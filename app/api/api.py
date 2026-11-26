"""
Run the server with:
uvicorn app.api.api:app --reload --host 0.0.0.0

"""

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, HTTPException
from app.generation.generate import generate_llm_response
from chromadb.api.types import Where
from app.llm.ollama import stop_all_running_models, get_all_models
from app.ingestion.vectorstore.chroma import get_all_unique_docs, get_documents, Include
from pydantic import BaseModel
from app.utils.constants import ENV_PATH
from dotenv import load_dotenv, set_key
from app.store.store import get_file_metadatas
import os


def set_ip():
    import socket

    ip = socket.gethostbyname(socket.gethostname())
    set_key(ENV_PATH, "IP", ip)
    print(f"IP : {ip}")


set_ip()
load_dotenv(dotenv_path=ENV_PATH)


class ChunkRetreivalRequestBody(BaseModel):
    document_ids: list[str] = []
    include: Include


class FileMetadataRetrivalBody(BaseModel):
    document_ids: list[str] = []


class SearchRequestBody(BaseModel):
    query: str
    document_ids: list[str] | None = None
    model: str


app = FastAPI()

allow_origins = [
    "http://localhost:3000",
    f"http://{os.getenv('IP')}:3000",
    f"http://{os.getenv('IP')}:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Server is up!"}


@app.post("/upload")
def post_files(files: list[UploadFile]):
    return {"file_count": f"{[f for f in files]}"}


@app.post("/query")
async def user_query(request: SearchRequestBody):
    if not request.query:
        raise HTTPException(status_code=400, detail="Missing 'query' in request body.")

    where: Where | None = None

    if request.document_ids:
        where = {"document_id": {"$in": request.document_ids}}

    response = generate_llm_response(
        query=request.query, where=where, model=request.model
    )

    stop_all_running_models()

    return {"response": response}


@app.get("/all-models")
def fetch_all_models():
    return {"models": get_all_models()}


@app.get("/all-documents")
def fetch_all_documents():
    all_documents = get_all_unique_docs()
    return {"documents": all_documents}


@app.post("/get-chunks")
def get_chunks_by_ids(request: ChunkRetreivalRequestBody):
    if not request.document_ids:
        raise HTTPException(
            status_code=400, detail="Missing 'document_ids' in request body."
        )

    if request.include == []:
        request.include = ["documents", "metadatas"]

    docs = get_documents(ids=request.document_ids, include=request.include)
    return {
        "documents": docs.get("documents"),
        "ids": docs.get("ids"),
        "metadatas": docs.get("metadatas"),
    }


@app.post("/get-file-metadata")
def get_fileMetadata(request: FileMetadataRetrivalBody):
    if not request.document_ids or len(request.document_ids) == 0:
        raise HTTPException(
            status_code=400, detail="Missing 'document_ids' in request body."
        )
    file_metadatas = get_file_metadatas(document_ids=request.document_ids)

    return file_metadatas
