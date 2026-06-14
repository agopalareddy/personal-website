#!/usr/bin/env python3
"""Smoke test for Google Analytics 4 data flow on agreshow.com / agreedy.com.

Mints a service-account access token with the analytics.readonly scope, then
queries the GA4 Realtime API. Exits non-zero if the API call fails or if no
active users are detected within the last 30 minutes.

Usage:
    ./scripts/verify_ga4.py                          # default property + key
    ./scripts/verify_ga4.py --property-id 123456     # custom property
    ./scripts/verify_ga4.py --key-file /path/key.json
    ./scripts/verify_ga4.py --expect-min-users 1     # set floor (default: 1)
    ./scripts/verify_ga4.py --window 60              # minutes (default: 30)

Required env or defaults:
    GA_VERIFIER_KEY  : path to SA key file  (default: ~/.config/gcp/ga-verifier.json)
    GA4_PROPERTY_ID  : numeric GA4 property (default: 539267802 = "Project Showcase")
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any

import jwt
import requests

DEFAULT_KEY_PATH = Path.home() / ".config" / "gcp" / "ga-verifier.json"
DEFAULT_PROPERTY_ID = 539267802  # agreshow / Project Showcase
TOKEN_URL = "https://oauth2.googleapis.com/token"
REALTIME_URL_TEMPLATE = (
    "https://analyticsdata.googleapis.com/v1beta/properties/{pid}:runRealtimeReport"
)
ANALYTICS_READONLY = "https://www.googleapis.com/auth/analytics.readonly"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--property-id", type=int, default=int(os.environ.get("GA4_PROPERTY_ID", DEFAULT_PROPERTY_ID)))
    p.add_argument("--key-file", type=Path, default=Path(os.environ.get("GA_VERIFIER_KEY", DEFAULT_KEY_PATH)))
    p.add_argument("--window", type=int, default=30, help="minute window (default: 30)")
    p.add_argument("--expect-min-users", type=int, default=1, help="exit non-zero if fewer (default: 1)")
    p.add_argument("--quiet", action="store_true", help="suppress per-metric output, exit code only")
    return p.parse_args()


def mint_access_token(key_file: Path) -> str:
    """Exchange SA JWT for a short-lived access token with analytics.readonly scope."""
    if not key_file.exists():
        sys.exit(f"[fatal] key file not found: {key_file}")
    sa = json.loads(key_file.read_text())
    now = int(time.time())
    claims = {
        "iss": sa["client_email"],
        "sub": sa["client_email"],
        "aud": TOKEN_URL,
        "iat": now,
        "exp": now + 3600,
        "scope": ANALYTICS_READONLY,
    }
    signed = jwt.encode(claims, sa["private_key"], algorithm="RS256")
    resp = requests.post(
        TOKEN_URL,
        data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": signed},
        timeout=30,
    )
    data = resp.json()
    if "access_token" not in data:
        sys.exit(f"[fatal] token mint failed: {data}")
    return data["access_token"]


def run_realtime(token: str, property_id: int, window_min: int) -> dict[str, Any]:
    """Call runRealtimeReport and return the parsed response."""
    body = {
        "metrics": [
            {"name": "activeUsers"},
            {"name": "eventCount"},
            {"name": "screenPageViews"},
        ],
        "minuteRanges": [{"name": f"{window_min}m", "startMinutesAgo": window_min - 1, "endMinutesAgo": 0}],
    }
    resp = requests.post(
        REALTIME_URL_TEMPLATE.format(pid=property_id),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=body,
        timeout=30,
    )
    if not resp.ok:
        sys.exit(f"[fatal] GA4 API {resp.status_code}: {resp.text[:300]}")
    return resp.json()


def main() -> int:
    args = parse_args()
    token = mint_access_token(args.key_file)
    report = run_realtime(token, args.property_id, args.window)

    if not report.get("rows"):
        print(f"[fail] no rows in last {args.window} min — no traffic, or tag broken")
        return 2

    headers = [h["name"] for h in report.get("metricHeaders", [])]
    values = report["rows"][0].get("metricValues", [])
    metrics = dict(zip(headers, [int(v["value"]) for v in values]))

    if not args.quiet:
        print(f"property   : {args.property_id}")
        print(f"window     : last {args.window} min")
        print(f"activeUsers: {metrics.get('activeUsers', 0)}")
        print(f"eventCount : {metrics.get('eventCount', 0)}")
        print(f"pageViews  : {metrics.get('screenPageViews', 0)}")

    if metrics.get("activeUsers", 0) < args.expect_min_users:
        print(f"[fail] activeUsers={metrics.get('activeUsers', 0)} < expected {args.expect_min_users}")
        return 3

    print("[ok] GA4 receiving traffic")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
