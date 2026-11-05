import uuid
import re


def getID(size: int = 12):
    return (str(uuid.uuid4()).split("-")[::-1][0])[0:size]


def remove_whitespace(text: str):
    return re.sub(r"\s+", " ", text).strip()
