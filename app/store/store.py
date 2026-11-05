from app.utils.constants import DATA_PROCESSED_DIR, DATA_RAW_DIR, VECTOR_DIR


def build_store_dir():
    (DATA_PROCESSED_DIR).mkdir(exist_ok=True, parents=True)
    (DATA_PROCESSED_DIR / "chunks").mkdir(exist_ok=True, parents=True)
    (DATA_PROCESSED_DIR / "documents").mkdir(exist_ok=True, parents=True)
    (DATA_RAW_DIR).mkdir(exist_ok=True, parents=True)
    (VECTOR_DIR).mkdir(exist_ok=True, parents=True)


if __name__ == "__main__":
    build_store_dir()
