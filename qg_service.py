# qg_service.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration
import math

app = FastAPI(title="Question‑Generation Service")

class QGRequest(BaseModel):
    summary: str

MODEL_ID = "valhalla/t5-small-qg-prepend"
tokenizer = T5Tokenizer.from_pretrained(MODEL_ID)
model     = T5ForConditionalGeneration.from_pretrained(MODEL_ID)

@app.post("/generate-questions")
async def generate_questions(req: QGRequest):
    text = req.summary.strip()
    if not text:
        raise HTTPException(400, detail="`summary` must be non-empty")

    # count sentences very simply
    sent_count = max(1, text.count("."))
    # ask for between 3 and 7 questions
    n_q = min(max(3, sent_count), 7)

    input_text = "generate questions: " + text
    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        max_length=512,
        truncation=True
    )

    outputs = model.generate(
       **inputs,
       max_length=64,
       do_sample=True,
       top_p=0.9,
       temperature=1.2,
       no_repeat_ngram_size=2,
       num_return_sequences=n_q
    )

    # decode & dedupe
    qs = []
    for o in outputs:
      q = tokenizer.decode(o, skip_special_tokens=True).strip()
      if len(q)>5 and q not in qs:
        qs.append(q)

    return {"questions": qs}
