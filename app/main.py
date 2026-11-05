import argparse
from pathlib import Path
from app.ingestion.pipeline import ingest_pipeline
from app.embeddings.embed import create_and_save_embeddings
from app.generation.generate import generate_llm_response
from app.store.chunk_store import clear_chunks_store
from app.store.document_store import clear_document_store
from app.storage.db import clear_vector_db
from app.store.store import build_store_dir

"""
To run the script with query:
python3 -m app.main -q <query>

To run the script with file indexing pipeline:
Python3 -m app.main -f <file1> <file2> ...

"""


def index_pipeline(file_paths: list[Path]):
    file_id_list: list[str] = ingest_pipeline(file_paths)

    for id in file_id_list:
        create_and_save_embeddings(id)


def generation_pipeline(query: str):
    print(generate_llm_response(query))


def delete_all_data():
    clear_document_store()
    clear_chunks_store()
    clear_vector_db()


def main():
    build_store_dir()

    parser = argparse.ArgumentParser()

    # File/Query/Delete parser
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--query",
        "-q",
        type=str,
        help="Write query to get answers from the indexed files.",
    )
    group.add_argument(
        "--files", "-f", nargs="+", help="File(s) to indexed into vector database."
    )
    group.add_argument(
        "--delete",
        action="store_true",
        help="Deletes all the data including processed documents, chunks & saved embeddings.",
    )

    args = parser.parse_args()

    if args.query:
        generation_pipeline(query=args.query)
    elif args.files:
        file_paths: list[Path] = []
        for f in args.files:
            file_paths.append(Path(f))

        index_pipeline(file_paths)
    elif args.delete:
        delete_all_data()


if __name__ == "__main__":
    main()
