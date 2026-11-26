from app.utils.constants import DATA_PROCESSED_DIR, DATA_RAW_DIR, VECTOR_DIR
from langchain_core.documents import Document
import json


def build_store_dir():
    (DATA_PROCESSED_DIR).mkdir(exist_ok=True, parents=True)
    (DATA_PROCESSED_DIR / "chunks").mkdir(exist_ok=True, parents=True)
    (DATA_PROCESSED_DIR / "documents").mkdir(exist_ok=True, parents=True)
    (DATA_RAW_DIR).mkdir(exist_ok=True, parents=True)
    (VECTOR_DIR).mkdir(exist_ok=True, parents=True)


def get_file_metadatas(document_ids: list[str]):
    processed_documents_folder = DATA_PROCESSED_DIR / "documents"

    if not processed_documents_folder.exists():
        return []

    all_files = processed_documents_folder.glob("*")

    filtered_files = [f.name for f in all_files if f.name.split(".")[0] in document_ids]

    if not filtered_files:
        return []

    file_metadatas_list = []

    for file_name in filtered_files:
        file_path = processed_documents_folder / file_name
        with open(file_path, "r") as file:
            file_first_line: Document = json.loads(file.readline())

            filtered_metadata = {
                k: file_first_line["metadata"][k]
                for k in ["document_id", "total_pages", "file_path"]
                if k in file_first_line["metadata"]
            }
            file_metadatas_list.append(filtered_metadata)

    return file_metadatas_list


if __name__ == "__main__":
    # build_store_dir()
    print(get_file_metadatas(["b3181036717b", "asdf"]))
