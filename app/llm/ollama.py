import ollama
from app.utils.constants import EMBED_MODEL, CHAT_MODEL, SYSTEM_PROMPT
from ollama import EmbedResponse, ChatResponse


def gen_embedding_from_ollama_model(input: str) -> EmbedResponse:
    return ollama.embed(EMBED_MODEL, input=input)


def gen_ollama_model_response(messages: str) -> ChatResponse:
    return ollama.chat(  # pyright: ignore[reportUnknownMemberType]
        think=False,
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": messages},
        ],
        options={"temperature": 0.4, "seed": 42, "num_ctx": 16384},
    )


def stop_all_running_models():
    all_running_models = ollama.ps().models
    all_models = [EMBED_MODEL, CHAT_MODEL]
    models_stopped = []
    for m in all_models:
        if m.name in all_running_models:
            ollama.generate(m.name, prompt="", keep_alive=0)
            models_stopped.append(m.name)
    print(f"\nModels stopped: {models_stopped}")


if __name__ == "__main__":
    stop_all_running_models()
