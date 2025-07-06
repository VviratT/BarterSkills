import axios from "axios";

console.log(" QG service URL:", process.env.QG_URL);
const QG_SERVICE_URL = process.env.QG_URL || "http://127.0.0.1:8001";


export async function fetchQuestions(summary) {
  console.log(" Calling QG on:", summary.slice(0, 80) + "...");
console.log(" QG_URL:", process.env.QG_URL);

  const resp = await axios.post(
  `${process.env.QG_URL}/generate-questions`,
  { summary },
  { timeout: 5000, family: 4 }
);
  if (!resp.data?.questions) {
    throw new Error("Question‑gen service returned no questions");
  }
  return resp.data.questions;
}
