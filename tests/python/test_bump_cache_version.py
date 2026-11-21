import unittest
import tempfile
import hashlib
from pathlib import Path
from scripts.bump_cache_version import short_hash

class TestBumpCacheVersion(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.dir_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_short_hash_single_file(self):
        file_path = self.dir_path / "test1.txt"
        content = b"hello world"
        file_path.write_bytes(content)

        expected_hash = hashlib.sha256(content).hexdigest()[:8]
        result = short_hash(file_path)

        self.assertEqual(result, expected_hash)

    def test_short_hash_multiple_files(self):
        file1_path = self.dir_path / "test1.txt"
        file2_path = self.dir_path / "test2.txt"
        content1 = b"hello "
        content2 = b"world"
        file1_path.write_bytes(content1)
        file2_path.write_bytes(content2)

        expected_hash = hashlib.sha256(content1 + content2).hexdigest()[:8]
        result = short_hash(file1_path, file2_path)

        self.assertEqual(result, expected_hash)

    def test_short_hash_empty_file(self):
        file_path = self.dir_path / "empty.txt"
        content = b""
        file_path.write_bytes(content)

        expected_hash = hashlib.sha256(content).hexdigest()[:8]
        result = short_hash(file_path)

        self.assertEqual(result, expected_hash)

if __name__ == "__main__":
    unittest.main()
