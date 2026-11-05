from pathlib import Path
from app.store.document_store import get_documents
from app.utils.constants import DATA_RAW_DIR

from app.ingestion.loader import load_and_save_document
from app.ingestion.chunking import recursive_chunking


def ingest_pipeline(path_lists: list[Path]):
    file_id_list: list[str] = []
    for file in path_lists:
        if file.exists():
            document_id = load_and_save_document(file)

            documents = get_documents(document_id)
            file_id_list.append(recursive_chunking(documents))

    return file_id_list


if __name__ == "__main__":
    path_lists: list[Path] = [Path(DATA_RAW_DIR / "paper.pdf")]

    ingest_pipeline(path_lists)
