import ollama
from app.storage.db import docs_collection
from app.utils.constants import EMBED_MODEL


def retrive_embedding(query: str):
    response = ollama.embed(model=EMBED_MODEL, input=query)

    embeddings = docs_collection.query(
        query_embeddings=response["embeddings"], n_results=5
    )
    return embeddings


if __name__ == "__main__":
    print(retrive_embedding("what is ATS system"))
