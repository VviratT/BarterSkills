import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { downloadFile } from "./cloudinary.js";
import axios from "axios";

export async function fetchQuestions(summary) {
  const res = await axios.post("http://localhost:8001/generate-questions", { summary });
  return res.data.questions;
}

const execFileAsync = promisify(execFile);
const WHISPER_CMD = process.env.WHISPER_CMD || "whisper";
const WHISPER_MODEL = "small.en";
const HF_API_KEY = process.env.HF_API_KEY;

const OUTPUT_DIR = path.resolve("public", "temp");

export async function runLocalAI(videoUrl, tempPath) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await downloadFile(videoUrl, tempPath);

  await execFileAsync(WHISPER_CMD, [
    tempPath,
    "--model", WHISPER_MODEL,
    "--language", "en",
    "--output_format", "txt",
    "--output_dir", OUTPUT_DIR
  ]);

  const fileNameOnly = path.basename(tempPath, path.extname(tempPath));
  const transcriptPath = path.join(OUTPUT_DIR, `${fileNameOnly}.txt`);
  const transcript = await fs.readFile(transcriptPath, "utf-8");

  const summary = await getT5Summary(transcript);

  await Promise.all([
    fs.unlink(tempPath).catch(() => {}),
    fs.unlink(transcriptPath).catch(() => {}),
  ]);

  return { transcript, summary };
}

async function getT5Summary(transcript) {
  const model = "sshleifer/distilbart-cnn-12-6";
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: transcript },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );
    if (Array.isArray(response.data) && response.data[0]?.summary_text) {
      return response.data[0].summary_text;
    }
    if (typeof response.data === "string") {
      return response.data;
    }
    return "No summary generated.";
  } catch (err) {
    console.error("HuggingFace summarization error:", err?.response?.data || err.message);
    return "Summary generation failed.";
  }
}
