
"""Adapters for the trained tender classifier and LayoutLMv3 extractor."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List

import joblib
# torch/transformers/PIL are intentionally NOT imported at module level.
# classify_tender() only needs joblib+scikit-learn; importing the LayoutLMv3
# stack eagerly here would force every caller (including anything that only
# wants the lightweight tender classifier, e.g. unit tests) to have
# torch+transformers installed just to import this file.

PROJECT_ROOT = Path(__file__).resolve().parents[2]

AI_ENGINE_ROOT = Path(__file__).resolve().parent

TENDER_MODEL_PATH = (
    AI_ENGINE_ROOT / "models/tender_type_classifier/tfidf_linear_svm_baseline.joblib"
)

DOCUMENT_MODEL_PATH = (
    AI_ENGINE_ROOT / "models/document_extractor/layoutlmv3_funsd_plus_v1"
)

@lru_cache(maxsize=1)
def load_tender_classifier():
    return joblib.load(TENDER_MODEL_PATH)

def classify_tender(title: str, description: str = "") -> Dict[str, Any]:
    """Predict Works, Goods, or Services from tender title and description."""
    text = f"{title or ''} [SEP] {description or ''}".strip()
    model = load_tender_classifier()
    prediction = model.predict([text])[0]

    return {
        "tender_type": prediction,
        "model": "TF-IDF + Linear SVM",
    }

@lru_cache(maxsize=1)
def load_document_extractor():
    import torch
    from transformers import AutoProcessor, LayoutLMv3ForTokenClassification

    processor = AutoProcessor.from_pretrained(
        DOCUMENT_MODEL_PATH,
        apply_ocr=False
    )
    model = LayoutLMv3ForTokenClassification.from_pretrained(
        DOCUMENT_MODEL_PATH
    )
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()
    return processor, model, device

def _normalize_box(box, width, height):
    x0, y0, x1, y1 = box
    return [
        max(0, min(1000, int(1000 * x0 / width))),
        max(0, min(1000, int(1000 * y0 / height))),
        max(0, min(1000, int(1000 * x1 / width))),
        max(0, min(1000, int(1000 * y1 / height))),
    ]

def extract_document_structure(
    image_path: str,
    words: List[str],
    bboxes: List[List[float]],
) -> Dict[str, Any]:
    """
    Assign each OCR word a document role: other/header/question/answer.

    Backend must provide OCR words and matching [x0, y0, x1, y1] boxes.
    """
    import torch
    from PIL import Image

    processor, model, device = load_document_extractor()

    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    normalized_boxes = [
        _normalize_box(box, width, height) for box in bboxes
    ]

    encoded = processor(
        image,
        words,
        boxes=normalized_boxes,
        truncation=True,
        padding="max_length",
        max_length=512,
        return_tensors="pt",
    )

    word_ids = encoded.word_ids(batch_index=0)
    model_inputs = {
        key: value.to(device)
        for key, value in encoded.items()
    }

    with torch.inference_mode():
        logits = model(**model_inputs).logits[0]
        token_predictions = logits.argmax(dim=-1).cpu().tolist()

    roles = []
    seen_words = set()

    for token_index, word_index in enumerate(word_ids):
        if word_index is None or word_index in seen_words:
            continue

        seen_words.add(word_index)
        roles.append({
            "word": words[word_index],
            "bbox": bboxes[word_index],
            "role": model.config.id2label[token_predictions[token_index]],
        })

    return {
        "model": "LayoutLMv3-base fine-tuned on FUNSD+",
        "document_roles": roles,
    }
