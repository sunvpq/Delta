from fastapi import APIRouter, HTTPException
from schemas import ExtractRequest, ExtractResponse
from services.extractor import extract_reasoning
from services.codeforces import fetch_problem_metadata

router = APIRouter()


@router.post("/extract", response_model=ExtractResponse)
async def extract_trace(request: ExtractRequest):
    try:
        extracted = await extract_reasoning(request.editorial_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

    cf_metadata = {}
    if request.problem_url:
        try:
            cf_metadata = await fetch_problem_metadata(request.problem_url)
        except Exception:
            pass

    existing_tags = set(extracted.get("technique_tags") or [])
    cf_tags = set(cf_metadata.get("technique_tags") or [])

    result = {
        **extracted,
        "source_editorial": request.editorial_text,
        "problem_id": cf_metadata.get("problem_id"),
        "problem_title": cf_metadata.get("problem_title"),
        "problem_url": request.problem_url,
        "difficulty_rating": cf_metadata.get("difficulty_rating"),
        "technique_tags": list(existing_tags | cf_tags),
    }

    return result
