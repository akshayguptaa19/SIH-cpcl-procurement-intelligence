
import sys
from pathlib import Path
from unittest.mock import patch

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from ai_engine.ocr import ocr_document, ocr_image  # noqa: E402


def _make_test_image(tmp_path, text_lines):
    """
    Builds a synthetic document image with real (not tiny bitmap-font)
    rendered text, for testing OCR against known ground truth.

    Uses Pillow's bundled scalable default font (available since Pillow
    10.1 via ImageFont.load_default(size=...)) rather than a system font
    path like DejaVuSans.ttf - system fonts aren't guaranteed to be
    installed on every host (e.g. a bare Colab runtime), and silently
    falling back to PIL's tiny 1980s bitmap font produces garbled OCR
    output that looks like an OCR bug but is actually just an unreadable
    test image.
    """
    from PIL import Image, ImageDraw, ImageFont

    font = ImageFont.load_default(size=28)

    img = Image.new("RGB", (900, 60 * len(text_lines) + 40), color="white")
    draw = ImageDraw.Draw(img)
    for i, line in enumerate(text_lines):
        draw.text((30, 30 + i * 60), line, fill="black", font=font)

    path = tmp_path / "synthetic_doc.png"
    img.save(path)
    return str(path)


def test_ocr_image_extracts_known_identifiers(tmp_path):
    image_path = _make_test_image(
        tmp_path,
        ["ABC Enterprises", "GSTIN: 27AAACG1234M1Z5", "PAN: AAACG1234M"],
    )
    result = ocr_image(image_path)
    assert "27AAACG1234M1Z5" in result["text"]
    assert "AAACG1234M" in result["text"]
    assert len(result["words"]) == len(result["bboxes"])


def test_ocr_image_bboxes_are_within_image_bounds(tmp_path):
    image_path = _make_test_image(tmp_path, ["GSTIN: 27AAACG1234M1Z5"])
    result = ocr_image(image_path)
    from PIL import Image
    width, height = Image.open(image_path).size
    for x0, y0, x1, y1 in result["bboxes"]:
        assert 0 <= x0 < x1 <= width
        assert 0 <= y0 < y1 <= height


def test_ocr_document_rejects_unsupported_file_type(tmp_path):
    bad_file = tmp_path / "not_a_document.txt"
    bad_file.write_text("hello")
    try:
        ocr_document(str(bad_file))
        assert False, "expected ValueError for unsupported file type"
    except ValueError:
        pass


def test_ocr_document_routes_pdf_through_ocr_pdf(tmp_path):
    # Verifies the PDF branch is actually taken for a .pdf extension,
    # without needing a real multi-page PDF fixture on disk.
    fake_page = {
        "text": "GSTIN: 27AAACG1234M1Z5", "words": ["GSTIN:", "27AAACG1234M1Z5"],
        "bboxes": [[0, 0, 10, 10], [10, 0, 20, 10]],
        "page_number": 1, "image_path": "/tmp/fake_page_1.png",
    }
    with patch("ai_engine.ocr.ocr_pdf", return_value=[fake_page]) as mock_ocr_pdf:
        result = ocr_document("/tmp/fake.pdf")
        mock_ocr_pdf.assert_called_once()
        assert result["full_text"] == "GSTIN: 27AAACG1234M1Z5"
        assert result["pages"][0]["page_number"] == 1
