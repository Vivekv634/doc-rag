from pathlib import Path

# path constants
APP_DIR = Path(__file__).resolve().parents[1]
DATA_RAW_DIR = APP_DIR / "data" / "raw"
DATA_PROCESSED_DIR = APP_DIR / "data" / "processed"
STORAGE_DIR = APP_DIR / "storage"
VECTOR_DIR = APP_DIR / "data" / "vector"
TEST_DIR = APP_DIR / "tests"

# model constants
EMBED_MODEL = "embeddinggemma-2:440m"
CHAT_MODEL = "llama3.1:8b"

if __name__ == "__main__":
    print(APP_DIR)
