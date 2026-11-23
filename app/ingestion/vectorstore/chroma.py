import chromadb

from chromadb.api.types import (
    Embedding,
    Metadata,
    Document,
    Where,
    QueryResult,
    WhereDocument,
    OneOrMany,
    Include,
)

from app.utils.constants import VECTOR_DIR
from app.utils.constants import COLLECTION_NAME

db_client = chromadb.PersistentClient(path=VECTOR_DIR)

docs_collection = db_client.get_or_create_collection(
    name=COLLECTION_NAME,
    configuration={"hnsw": {"space": "cosine"}},
)


def get_collection():
    """Return the documents collection."""
    return db_client.get_or_create_collection(
        name=COLLECTION_NAME,
        configuration={"hnsw": {"space": "cosine"}},
    )


def clear_vector_db():
    """Delete all documents and recreate the collection."""
    global docs_collection

    deletion_count = docs_collection.count()

    db_client.delete_collection(name=COLLECTION_NAME)

    docs_collection = get_collection()

    print(
        f"[ OK ] {deletion_count} vector rows deleted. "
        f"Collection '{COLLECTION_NAME}' recreated!"
    )


def delete_collection():
    """Permanently delete the collection."""
    global docs_collection

    if COLLECTION_NAME in db_client.list_collections():
        db_client.delete_collection(name=COLLECTION_NAME)
        print(f"[ OK ] Collection '{COLLECTION_NAME}' deleted!")


def collection_exists():
    """Check whether the collection exists."""
    return COLLECTION_NAME in db_client.list_collections()


def add_documents(
    ids: list[str],
    documents: OneOrMany[Document],
    embeddings: OneOrMany[Embedding] | None = None,
    metadatas: OneOrMany[Metadata] | None = None,
):
    """Add new documents to the collection."""
    docs_collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def query_documents(
    query_embeddings: list[float],
    n_results: int = 5,
    where: Where | None = None,
) -> QueryResult:
    """Retrieve similar documents using vector similarity."""
    return docs_collection.query(
        query_embeddings=query_embeddings,
        n_results=n_results,
        where=where,
    )


def get_documents(
    ids: list[str] | None = None,
    where: dict | None = None,
    limit: int | None = None,
    offset: int = 0,
    include: Include | None = ["documents", "metadatas", "embeddings"],
):
    """Retrieve documents by IDs or metadata filters."""
    print(f"Include: {include}")
    return docs_collection.get(
        ids=ids,
        where=where,
        limit=limit,
        offset=offset,
        include=include or ["documents", "metadatas", "embeddings"],
    )


def delete_documents(
    ids: list[str] | None = None,
    where: Where | None = None,
    where_document: WhereDocument | None = None,
):
    """Delete documents using IDs or filters."""
    if ids is None and where is None and where_document is None:
        raise ValueError("Provide IDs or a deletion filter.")

    docs_collection.delete(
        ids=ids,
        where=where,
        where_document=where_document,
    )


def peek_documents(limit: int = 5):
    """Preview documents stored in the collection."""
    return docs_collection.peek(limit=limit)


def count_documents():
    """Return the number of documents in the collection."""
    return docs_collection.count()


def database_heartbeat():
    """Check whether ChromaDB is responding."""
    return db_client.heartbeat()


def get_all_unique_docs():
    result = docs_collection.get(include=["metadatas"])
    unique_ids: set[Metadata] = set()
    unique_metadatas: list[Metadata] = []
    for metadata in result.get("metadatas"):
        if metadata["document_id"] not in unique_ids:
            unique_ids.add(metadata["document_id"])
            unique_metadatas.append(metadata)

    return unique_metadatas


if __name__ == "__main__":
    # print(get_all_unique_docs())
    # get_all_unique_doc_ids()

    docs = get_documents(
        ids=["89119b4153b4-2", "b3181036717b-12", "b3181036717b-14"],
        include=["documents", "metadatas"],
    )
    print(docs)
    pass
