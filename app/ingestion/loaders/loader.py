from app.utils.constants import DATA_RAW_DIR
from app.ingestion.loaders.pdf import pdf_loader
from pathlib import Path


def loader(path=Path):
    loader_map = {".pdf": pdf_loader}
    return loader_map[path.suffix](path)


if __name__ == "__main__":
    loaded_doc_id = loader(DATA_RAW_DIR / "paper.pdf")
    print(loaded_doc_id)
