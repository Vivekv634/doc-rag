from tqdm import tqdm
from app.store.chunk_store import get_chunks
from app.vectorstore.chroma import add_documents
from app.llm.ollama import gen_embedding_from_ollama_model


# Inputs the chunk document id and loads the chunks then make embeddings of it, returns embeddings.
def create_and_save_embeddings(chunk_doc_id: str):
    chunks = get_chunks(chunk_doc_id)

    no_of_chunks = len(chunks)

    if no_of_chunks == 0:
        raise ValueError("No chunks found.")

    print(f"\nEmbedding '{chunks[0].metadata['source']}' file...")
    for i in tqdm(range(no_of_chunks)):
        page_content_embeddings = gen_embedding_from_ollama_model(
            input=chunks[i].page_content
        )["embeddings"]
        add_documents(
            ids=[chunks[i].metadata["chunk_id"]],
            embeddings=page_content_embeddings,
            documents=chunks[i].page_content,
            metadatas=[chunks[i].metadata],
        )

    print(f"Embeddings created and saved for file: {chunks[0].metadata['source']}")


if __name__ == "__main__":
    create_and_save_embeddings("8cd4009a3490")
