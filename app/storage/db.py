import chromadb
from app.utils.constants import VECTOR_DIR

COLLECTION_NAME = "docs"

db_client = chromadb.PersistentClient(VECTOR_DIR)
docs_collection = db_client.get_or_create_collection(
    COLLECTION_NAME, configuration={"hnsw": {"space": "cosine"}}
)


def clear_vector_db():
    db_client.delete_collection(COLLECTION_NAME)


if __name__ == "__main__":
    clear_vector_db()
