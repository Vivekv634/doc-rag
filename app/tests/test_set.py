import json
from app.generation.generate import generate_llm_response
from app.utils.constants import TEST_DIR
from pathlib import Path
import time

questions: list[str] = [
    "Which two Explainable AI techniques does the proposed system use, and what do they do for recruiters?",
    "According to the comparative performance table, what F1-score does each of the three approaches achieve?",
    "Walk me through the steps of the RAG pipeline used in the “Advanced Model”, from document chunking to the final match score.",
    "The abstract says “empirical evidence suggests” the system speeds up shortlisting by 90%. Does the Results section actually support that wording? Explain.",
    "What was the size of the training dataset, and what learning rate and batch size were used to fine-tune the transformer model?",
]


def run_questions_test():
    file_name: Path = TEST_DIR / f"./test_{time.time()}.txt"
    for i, q in enumerate(questions, start=1):
        with open(file_name, "a") as file:
            print(f"Query {i}: {q}")
            llm_response = generate_llm_response(q)
            print(f"Response {i}: {llm_response['answer']}\n")

            file.write(f"Query {i}: {q}\n Response {i}: {json.dumps(llm_response)}\n\n")


if __name__ == "__main__":
    run_questions_test()
