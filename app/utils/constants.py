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
CHAT_MODEL = "nemotron-3-nano:4b"

# db constants
COLLECTION_NAME = "docs"

# chunk constants
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150

SYSTEM_PROMPT = """You answer questions using ONLY the numbered context chunks provided.
Rules:
- Use only facts stated in the chunks. No trained knowledge. Just rephrase & explain in simple terms.
- After each claim, cite the chunk number(s) it came from, like [2] or [1][3].
- If the context does not fully answer the question, say what is missing."""


if __name__ == "__main__":
    print(APP_DIR)
