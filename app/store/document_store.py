import json
from langchain_core.documents import Document
from app.utils.constants import DATA_PROCESSED_DIR


def get_documents(document_id: str) -> list[Document]:
    """
    Fetch all the Document objects from the file named as `document_id`.
    """
    doc_path = DATA_PROCESSED_DIR / "documents" / f"{document_id}.jsonl"

    if not doc_path.exists():
        raise FileNotFoundError(doc_path)

    doc_list: list[Document] = []

    with open(doc_path, "r") as file:
        file_content = file.readlines()

        for page in file_content:
            page_content = json.loads(page)

            newDoc: Document = Document(**page_content)

            doc_list.append(newDoc)

    return doc_list


def save_document(document: Document):
    """
    Breaks the Document Object into pages and then saves it into file.
    """
    DATA_PROCESSED_DIR.mkdir(exist_ok=True, parents=True)

    doc_path = (
        DATA_PROCESSED_DIR / "documents" / f"{document.metadata['document_id']}.jsonl"
    )

    with open(doc_path, "a", encoding="utf-8") as file:
        json_doc: dict[str, str | dict[str, int | str | float]] = {
            "page_content": document.page_content,
            "metadata": document.metadata,
        }
        file.write(json.dumps(json_doc) + "\n")

    return doc_path


def clear_document_store():
    """
    Empty the entire `processed/documents` files. Leaves the folder only.
    """
    dir_path = DATA_PROCESSED_DIR / "documents"
    dir_path.mkdir(exist_ok=True, parents=True)

    count = 0
    for f in dir_path.iterdir():
        f.unlink()
        count += 1

    print(f"[ OK ] {count} Document file removed. Document store is empty!")


if __name__ == "__main__":
    clear_document_store()
