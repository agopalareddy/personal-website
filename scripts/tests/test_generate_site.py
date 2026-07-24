import unittest
import sys
import os

# Add the parent directory (scripts/) to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from generate_site import html_escape

class TestHtmlEscape(unittest.TestCase):
    def test_html_escape_none(self):
        self.assertEqual(html_escape(None), "")

    def test_html_escape_empty(self):
        self.assertEqual(html_escape(""), "")

    def test_html_escape_no_special_chars(self):
        self.assertEqual(html_escape("hello world"), "hello world")

    def test_html_escape_all_special_chars(self):
        self.assertEqual(html_escape("& < > \""), "&amp; &lt; &gt; &quot;")

    def test_html_escape_mixed(self):
        self.assertEqual(html_escape("a & b < c > d \" e"), "a &amp; b &lt; c &gt; d &quot; e")

if __name__ == '__main__':
    unittest.main()
