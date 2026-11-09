from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.store.document_store import get_documents
from langchain_core.documents import Document
from tqdm import tqdm
from app.store.chunk_store import save_chunks, get_chunks
from pathlib import Path


def recursive_chunking(docs: list[Document]) -> str:
    first_doc = docs[0]
    document_id = first_doc.metadata["document_id"]

    separator = "\n\n"
    page_spans: list[tuple[int, int, int]] = []
    parts: list[str] = []
    cursor = 0

    for doc in docs:
        start = cursor
        end = start + len(doc.page_content)
        page_spans.append((start, end, doc.metadata["page"]))
        parts.append(doc.page_content)
        cursor = end + len(separator)

    del first_doc.metadata["page"]
    full_text = separator.join(parts)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", ". ", " ", ""],
        add_start_index=True,
    )

    chunks = splitter.create_documents([full_text], metadatas=[first_doc.metadata])

    chunk_docs: list[Document] = []
    idx_count = 1

    print(f"\nChunking '{Path(first_doc.metadata['source']).name}' file...")
    for i in tqdm(range(len(chunks))):
        chunk_start = chunks[i].metadata["start_index"]
        chunk_end = chunk_start + len(chunks[i].page_content)

        pages = [p for s, e, p in page_spans if s < chunk_end and e > chunk_start]

        chunk_docs.append(
            Document(
                chunks[i].page_content,
                metadata={
                    "source": f"{Path(chunks[i].metadata["source"]).name}",
                    "document_id": document_id,
                    "chunk_id": f"{document_id}-{idx_count}",
                    "chunk_index": idx_count,
                    "page_no": pages[0],
                    "page_end": pages[-1],
                    "start_index": chunks[i].metadata["start_index"],
                },
            )
        )
        idx_count += 1

    return save_chunks(chunk_docs, document_id)


if __name__ == "__main__":
    loaded_docs_list = get_documents("cc0232fa2f55")
    chunk_doc_id = recursive_chunking(loaded_docs_list)

    chunks = get_chunks(chunk_doc_id)

    print(len(chunks))

    for i, chunk in enumerate(chunks, start=1):
        print(f"> {i} {chunk.metadata}\n\n")
