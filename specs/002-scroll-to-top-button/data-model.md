# Phase 1 Data Model: Scroll to Top Button

Not applicable. This feature has no persisted, transmitted, or structured data — no entities, no storage, no API payloads. Its only state is transient, in-memory UI state held by the island script:

| State       | Type      | Lifetime                      | Notes                                                                                                                                                                                                |
| ----------- | --------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isVisible` | `boolean` | Per page view, in-memory only | Derived each time from `scrollY` vs. threshold AND `scrollHeight > clientHeight`; never persisted (no localStorage/cookie — spec has no requirement to remember dismissal or position across visits) |

No `Key Entities` section is included in `spec.md` for this reason (per the spec template's own guidance to omit sections that don't apply).
