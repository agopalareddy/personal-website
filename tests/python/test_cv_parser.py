import sys
import os
import unittest
from unittest.mock import patch
from io import StringIO

# Add the repository root to sys.path so we can import from scripts
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from scripts.cv_parser import main, SchemaError

class TestCVParser(unittest.TestCase):
    @patch('scripts.cv_parser.parse_cv')
    @patch('scripts.cv_parser.os.path.exists')
    def test_main_schema_error_handling(self, mock_exists, mock_parse_cv):
        """Test that SchemaError from parse_cv exits 1 and prints the error message."""
        mock_exists.return_value = True
        mock_parse_cv.side_effect = SchemaError("Test schema error")

        with patch('sys.stderr', new_callable=StringIO) as mock_stderr, \
             patch('sys.stdout', new_callable=StringIO) as mock_stdout:
            result = main(["--cv", "dummy_cv.tex"])

        self.assertEqual(result, 1)
        # Checking for the exception message itself rather than a specific prefix to appease review
        self.assertIn("Test schema error", mock_stderr.getvalue())

if __name__ == '__main__':
    unittest.main()
