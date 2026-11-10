from app.retrieval.query_retrieval import retrieve
from chromadb.api.types import QueryResult
from app.llm.ollama import gen_ollama_model_response


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


def generate_llm_response(query: str) -> dict[str, str | list[dict[str, str | int]]]:
    res = retrieve(query)
    context, sources = build_context(res)

    response = gen_ollama_model_response(
        messages=f"Context:\n{context}\n\nQuestion: {query}"
    )

    return {"answer": response["message"]["content"], "sources": sources}


if __name__ == "__main__":
    query = input("Query: ")

    print(generate_llm_response(query))
