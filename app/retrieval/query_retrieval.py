from app.vectorstore.chroma import query_documents
from chromadb.api.types import Where
from app.llm.ollama import gen_embedding_from_ollama_model


def retrieve(query: str, where_filter: Where | None = None):
    if query.strip() == "":
        raise ValueError("Irrelevant query given!")

    return query_documents(
        query_embeddings=gen_embedding_from_ollama_model(query)["embeddings"],
        where=where_filter,
    )


if __name__ == "__main__":
    print(retrieve("what is ATS system"))
