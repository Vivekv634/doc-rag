import ollama
from app.utils.constants import EMBED_MODEL, CHAT_MODEL, SYSTEM_PROMPT
from ollama import EmbedResponse, ChatResponse


def get_all_models():
    return [m.model for m in ollama.list().models]


def is_model_available(model: str):
    return model in get_all_models()


def gen_embedding_from_ollama_model(input: str) -> EmbedResponse:
    return ollama.embed(EMBED_MODEL, input=input)


def gen_ollama_model_response(messages: str, model: str | None) -> ChatResponse:
    chat_model: str = model or CHAT_MODEL
    return ollama.chat(  # pyright: ignore[reportUnknownMemberType]
        think=False,
        model=chat_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": messages},
        ],
        options={"temperature": 0.4, "seed": 42, "num_ctx": 16384},
    )


def stop_all_running_models(all_models: list[str] | None = [EMBED_MODEL, CHAT_MODEL]):
    all_running_models = [m.name for m in ollama.ps().models]
    all_models = (
        [EMBED_MODEL, CHAT_MODEL]
        if all_models is None or len(all_models) == 0
        else all_models
    )
    models_stopped = []

    for m in all_models:
        if m in all_running_models:
            ollama.generate(m, prompt="", keep_alive=0)
            models_stopped.append(m)
    print(f"\nModels stopped: {models_stopped}")


if __name__ == "__main__":
    # stop_all_running_models()
    print(is_model_available("llama3.1:8b"))
