import ollama
from app.retrieval.query_retrival import retrieve
from chromadb.api.types import QueryResult
from app.utils.constants import CHAT_MODEL

SYSTEM_PROMPT = """You answer questions using ONLY the numbered context chunks provided.
Rules:
- Use only facts stated in the chunks. No background knowledge. Just rephrase it.
- After each claim, cite the chunk number(s) it came from, like [2] or [1][3].
- If the context does not fully answer the question, say what is missing."""


def build_context(docs: QueryResult) -> tuple[str, list[dict[str, str | int]]]:
    documents = docs["documents"]
    metadatas = docs["metadatas"]

    if not documents or not metadatas:
        return "", []

    items = sorted(tuple(zip(documents[0], metadatas[0])), key=lambda x: x[1]["chunk_index"])  # type: ignore

    blocks: list[str] = []
    sources: list[dict[str, str | int]] = []

    for i, tp in enumerate(items, start=1):  # type: ignore
        blocks.append(
            f"[{i}] (source: {tp[1]['source']}, page {tp[1]['page_no']})\n{tp[0].strip()}"  # type: ignore
        )
        sources.append(
            {"n": i, "chunk_id": tp[1]["chunk_id"], "page": tp[1]["page_no"]}
        )

    return "\n\n".join(blocks), sources


def generate_llm_response(query: str) -> dict[str, str | list[dict[str, str | int]]]:
    res = retrieve(query)
    context, sources = build_context(res)

    response = ollama.chat(  # pyright: ignore[reportUnknownMemberType]
        think=False,
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
        ],
        options={"temperature": 0.2, "seed": 42, "num_ctx": 8192},
    )

    return {"answer": response["message"]["content"], "sources": sources}


if __name__ == "__main__":
    query = input("Query: ")

    print(generate_llm_response(query))
