import ollama
from tqdm import tqdm
from app.store.chunk_store import get_chunks
from app.storage.db import docs_collection
from app.utils.constants import EMBED_MODEL


# Inputs the chunk document id and loads the chunks then make embeddings of it, returns embeddings.
def create_and_save_embeddings(chunk_doc_id: str):
    chunks = get_chunks(chunk_doc_id)

    no_of_chunks = len(chunks)

    if no_of_chunks == 0:
        raise ValueError("No chunks found.")

    print(f"\nEmbedding {chunks[0].metadata['source']} file...")
    for i in tqdm(range(no_of_chunks)):
        response = ollama.embed(EMBED_MODEL, input=chunks[i].page_content)
        docs_collection.add(
            embeddings=response["embeddings"],
            ids=[chunks[i].metadata["chunk_id"]],
            documents=chunks[i].page_content,
            metadatas=[chunks[i].metadata],
        )

    print("---- Embeddings created and saved ----")


if __name__ == "__main__":
    create_and_save_embeddings("3efd80aa6e29")
