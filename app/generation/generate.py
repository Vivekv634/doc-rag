from app.retrieval.query_retrieval import retrieve
from chromadb.api.types import QueryResult, Where
from app.llm.ollama import gen_ollama_model_response, stop_all_running_models
from app.utils.constants import EMBED_MODEL
import sys
from pydantic import BaseModel


class LLMResponse(BaseModel):
    answer: str
    sources: list[dict[str, str | int]]


def build_context(
    docs: QueryResult,
):
    if not docs["metadatas"] or not docs["documents"]:
        raise ValueError("Insufficient data. Check the retrieval function.")

    documents = docs["documents"][0]
    metadatas = docs["metadatas"][0]

    if not documents or not metadatas:
        raise ValueError("Insufficient data. Check the retrieval function.")

    sorted_items = tuple(
        sorted(zip(documents, metadatas), key=lambda x: x[1].get("chunk_index"))
    )

    blocks: list[str] = []
    sources: list[dict[str, int | str]] = []

    for i, tp in enumerate(sorted_items, start=1):
        blocks.append(
            f"[{i}] (source: {tp[1]['source']}, page {tp[1]['page_no']})\n{tp[0].strip()}"
        )
        sources.append(
            {"n": i, "chunk_id": tp[1]["chunk_id"], "page": tp[1]["page_no"]}
        )

    return "\n\n".join(blocks), sources


def generate_llm_response(
    query: str, where: Where | None = None, model: str | None = None
) -> LLMResponse:
    res = retrieve(query, where=where)

    print("\nChunks retrived!")

    stop_all_running_models([EMBED_MODEL])

    context, sources = build_context(res)

    response = gen_ollama_model_response(
        model=model, messages=f"Context:\n{context}\n\nQuestion: {query}"
    )

    print("\nModel responded!")

    stop_all_running_models()

    return {"answer": response["message"]["content"], "sources": sources}


if __name__ == "__main__":
    while True:
        query = input("Your Query: ")

        if query == "/exit":
            sys.exit(0)

        response = generate_llm_response(query, model="qwen2.5:1.5b-instruct")

        stop_all_running_models()
        print(response["answer"])
        print(response)
