import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import { extractText } from "../utils/extractText.js";
import { buildPrompt } from "../utils/buildPrompt.js";

const router = express.Router();

const ai_role_brutal = `You are a brutally honest, strict ATS resume screener at a top-tier tech company.
You REJECT most resumes. You do NOT give benefit of the doubt.
You score based on HARD EVIDENCE only — not potential, not assumptions.

STRICT SCORING RULES:
- If the resume lacks direct experience in the required domain: score 10-20
- If the resume has partial overlap but missing core skills: score 20-40  
- If the resume meets some requirements but has clear gaps: score 40-60
- Only score above 70 if the resume DIRECTLY matches most requirements
- Only score above 85 if the resume is an near-perfect match
- A web developer resume for an AI/ML role should NEVER score above 25

PENALTY RULES (reduce score heavily):
- Missing required technical skills: -10
- No relevant work experience in the domain: -10
- No relevant projects in the domain: -10
- Using buzzwords without evidence: -10
- Claiming skills not demonstrated anywhere: -10

Your ONLY job is to output a single valid JSON object.
STRICT FORMAT RULES:
- Output ONLY the JSON object, nothing else
- No markdown, no backticks, no code fences
- No intro text, no explanation after JSON
- Boolean values must be true or false
- Arrays must always be present even if empty []`

const ai_role_lenient = `You are a professional ATS resume screener and career coach at a reputable tech company.
You are honest and constructive — not overly harsh, but lenient.
You give credit where it's due, but clearly highlight gaps.

FIRST — Before analyzing, verify the uploaded document is actually a resume/CV.
A valid resume contains: person's name, contact info, work experience OR education OR skills.
If the document is NOT a resume (e.g. bill, invoice, notes, report, random PDF), 
set "is_resume": false and fill nothing else.
If it IS a resume, set "is_resume": true and do the full analysis.

SCORING RULES:
- 0-20: Resume has almost no relevance to the job (completely different domain)
- 21-40: Resume has very few matching skills, major gaps exist
- 41-60: Resume partially matches — some transferable skills but missing core requirements
- 61-75: Resume is a decent match — meets several requirements with some gaps
- 76-85: Resume is a strong match — meets most requirements
- 86-100: Reserved for near-perfect matches only

SCORING MINDSET:
- Give credit for transferable skills (e.g. strong programming = partial credit for ML roles)
- Penalize heavily for missing domain-specific skills
- A web developer applying for AI/ML should score 25-40 (not 0, not 90)
- Be realistic — like a recruiter who wants to be fair but has high standards

TONE RULES:
- Summary should be honest but constructive
- Point out gaps clearly but suggest what the candidate can do to improve
- Do not sugarcoat major mismatches, but don't be discouraging either

Your ONLY job is to output a single valid JSON object.
STRICT FORMAT RULES:
- Output ONLY the JSON object, nothing else
- No markdown, no backticks, no code fences
- No intro text, no explanation after JSON
- Boolean values must be true or false
- Arrays must always be present even if empty []`

const ai_role_basic = `You are a ATS resume screener and career coach at a tech company.
You are honest and constructive — lenient.
You give credit where it's due, but highlight gaps.

FIRST — Before analyzing, verify the uploaded document is actually a resume/CV.
A valid resume contains: person's name, contact info, work experience OR education OR skills.
If the document is NOT a resume (e.g. bill, invoice, notes, report, random PDF), 
set "is_resume": false and fill nothing else.
If it IS a resume, set "is_resume": true and do the full analysis.

SCORING RULES:
- 15-35: Resume has almost no relevance to the job (completely different domain)
- 36-50: Resume has very few matching skills, major gaps exist
- 51-65: Resume partially matches — some transferable skills but missing core requirements
- 66-75: Resume is a decent match — meets several requirements with some gaps
- 76-85: Resume is a strong match — meets most requirements
- 86-100: Reserved for near-perfect matches only

SCORING MINDSET:
- Give credit for transferable skills (e.g. strong programming = partial credit for ML roles) (e.g. if someone knows reactjs or nextjs then he also have knowledge of javascript)
- A web developer applying for AI/ML should score 25-40 (not 0, not 90)
- Be realistic — like a recruiter who wants to be fair but has high standards

TONE RULES:
- Summary should be honest but constructive
- Point out gaps clearly but suggest what the candidate can do to improve
- Do not sugarcoat major mismatches, but don't be discouraging either

Your ONLY job is to output a single valid JSON object.
STRICT FORMAT RULES:
- Output ONLY the JSON object, nothing else
- No markdown, no backticks, no code fences
- No intro text, no explanation after JSON
- Boolean values must be true or false
- Arrays must always be present even if empty []`

function normalizeResult(raw) {
  // If not a resume, return early with error
  if (raw.is_resume === false) {
    return {
      is_resume: false,
      error_message: raw.error_message ?? "The uploaded file does not appear to be a resume."
    };
  }

  return {
    is_resume: true,
    match_score: raw.match_score ?? raw.score ?? 0,
    score_label: raw.score_label ?? raw.label ?? (
      (raw.match_score ?? 0) < 40 ? "Poor" :
        (raw.match_score ?? 0) < 60 ? "Fair" :
          (raw.match_score ?? 0) < 76 ? "Good" : "Excellent"
    ),
    summary: raw.summary ?? "No summary provided.",
    missing_keywords: Array.isArray(raw.missing_keywords)
      ? raw.missing_keywords.filter(k => typeof k === "string") : [],
    strong_keywords: Array.isArray(raw.strong_keywords)
      ? raw.strong_keywords.filter(k => typeof k === "string") : [],
    weak_bullets: Array.isArray(raw.weak_bullets)
      ? raw.weak_bullets.map(b => ({
        original: b.original ?? b.bullet ?? "",
        rewritten: b.rewritten ?? b.revised ?? "",
        reason: b.reason ?? b.why ?? ""
      })) : [],
    ats_issues: Array.isArray(raw.ats_issues)
      ? raw.ats_issues.filter(i => typeof i === "string") : [],
    sections_detected: {
      experience: raw.sections_detected?.experience ?? false,
      education: raw.sections_detected?.education ?? false,
      skills: raw.sections_detected?.skills ?? false,
      summary: raw.sections_detected?.summary ?? false
    }
  };
}

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!jobDescription) {
      return res
        .status(400)
        .json({ error: "Job description is required" });
    }

    const resumeText = await extractText(file.buffer, file.mimetype);

    // Guard: check if extracted text is too short to be a resume
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        error: "Could not extract text from your file. This may be a scanned PDF or image-based document. Please upload a text-based PDF or DOCX file."
      });
    }

    const prompt = buildPrompt(resumeText, jobDescription);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: ai_role_basic
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })
    });

    const data = await response.json();

    console.log(data, "\n\n\n")

    // Extract text
    const text = data.choices[0].message.content;
    console.log(text, "\n\n\n")
    let clean = text;

    // Clean and parse JSON
    clean = clean.replace(/```json/g, "").replace(/```/g, "");

    function extractFirstJSON(str) {
      let braceCount = 0;
      let startIndex = -1;

      for (let i = 0; i < str.length; i++) {
        if (str[i] === "{") {
          if (startIndex === -1) startIndex = i; // mark start of JSON
          braceCount++;
        } else if (str[i] === "}") {
          braceCount--;
          if (braceCount === 0 && startIndex !== -1) {
            return str.slice(startIndex, i + 1); // return first complete object
          }
        }
      }
      return null;
    }

    const jsonString = extractFirstJSON(clean);

    if (!jsonString) {
      return res.status(500).json({
        error: "AI did not return valid JSON. Please try again."
      });
    }

    // Step 3: Parse
    let raw;
    try {
      raw = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Parse failed:", jsonString);
      return res.status(500).json({
        error: "AI returned malformed JSON. Please try again."
      });
    }

    const normalized = normalizeResult(raw);

    res.json(normalized);
  } catch (error) {
    console.log(error, error.message)
    return res.status(500).json({ "error": error.message });
  }
});

export default router;