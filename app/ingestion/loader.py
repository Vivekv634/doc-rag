from pathlib import Path
from app.utils.utils import getID, remove_whitespace
from langchain_community.document_loaders import PyMuPDFLoader
from app.store.document_store import save_document
from langchain_core.documents import Document
from tqdm import tqdm


def load_and_save_document(doc_path: Path) -> str:
    """Loads and saves the document object into the disk for further use.

    Args:
        doc_path (Path): Path of the pdf file

    Raises:
        FileNotFoundError: If the file at that path didn't exists

    Returns:
        str: document_id
    """
    doc_path = doc_path.resolve()
    if not doc_path.exists():
        raise FileNotFoundError(doc_path)

    document_id = getID()
    loader = PyMuPDFLoader(file_path=str(doc_path))

    doc_pages = loader.load()

    print(f"\nLoading '{doc_path.name}' file...")
    for i in tqdm(range(len(doc_pages))):
        save_document(
            Document(
                page_content=remove_whitespace(doc_pages[i].page_content),
                metadata={
                    **doc_pages[i].metadata,
                    "page": doc_pages[i].metadata["page"] + 1,
                    "document_id": document_id,
                },
            )
        )

    return document_id


if __name__ == "__main__":
    BASE_PATH = Path(__file__).resolve().parents[1]
    loaded_doc_id = load_and_save_document(BASE_PATH / "data" / "raw" / "paper.pdf")
    print(loaded_doc_id)
