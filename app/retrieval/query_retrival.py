import ollama
from app.storage.db import docs_collection
from app.utils.constants import EMBED_MODEL
from chromadb.api.types import Where


def retrieve(query: str, filter: Where | None = None):
    response = ollama.embed(model=EMBED_MODEL, input=query)

    embeddings = docs_collection.query(
        query_embeddings=response["embeddings"], n_results=5, where=filter
    )
    return embeddings


if __name__ == "__main__":
    print(retrieve("what is ATS system"))
