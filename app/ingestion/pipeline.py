from pathlib import Path
from app.store.document_store import get_processed_documents
from app.utils.constants import DATA_RAW_DIR

from app.ingestion.loaders.loader import loader
from app.ingestion.chunking.chunking import recursive_chunking
from app.ingestion.embeddings.embed import create_and_save_embeddings


def ingest_pipeline(file_path: Path):
    if file_path.exists():
        document_id = loader(file_path)

        documents = get_processed_documents(document_id)
        processed_doc_id = recursive_chunking(documents)
        create_and_save_embeddings(processed_doc_id)

    return document_id


if __name__ == "__main__":
    file_path: Path = Path(DATA_RAW_DIR / "paper.pdf")

    ingest_pipeline(file_path)
