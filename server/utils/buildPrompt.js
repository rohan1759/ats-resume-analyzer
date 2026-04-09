export function buildPrompt(resumeText, jobDescription) {
  console.log("building prompt")
  //     return `You are an expert ATS resume reviewer. Analyze the resume against the job description and return ONLY a valid JSON object with absolutely no extra text, no markdown, no backticks, no code fences.

  // RESUME:
  // ${resumeText}

  // JOB DESCRIPTION:
  // ${jobDescription}

  // Return this exact JSON structure:
  // {
  // "match_score": <number 0-100>,
  // "score_label": <"Poor" | "Fair" | "Good" | "Excellent">,
  // "summary": "<2-3 sentence overall feedback>",
  // "missing_keywords": ["keyword1", "keyword2"],
  // "strong_keywords": ["keyword1", "keyword2"],
  // "weak_bullets": [
  //     {
  //     "original": "<original bullet from resume>",
  //     "rewritten": "<improved version>",
  //     "reason": "<why it was weak>"
  //     }
  // ],
  // "ats_issues": ["issue1", "issue2"],
  // "sections_detected": {
  //     "experience": true or false,
  //     "education": true or false,
  //     "skills": true or false,
  //     "summary": true or false
  // }
  // }`;

  // return `Analyze this resume against the job description and return ONLY this exact JSON structure with no extra text:

  // {
  // "match_score": <integer between 0 and 100>,
  // "score_label": <one of: "Poor", "Fair", "Good", "Excellent">,
  // "summary": "<2-3 sentences of overall feedback>",
  // "missing_keywords": ["<keyword>", "<keyword>"],
  // "strong_keywords": ["<keyword>", "<keyword>"],
  // "weak_bullets": [
  //     {
  //     "original": "<original bullet point text from resume>",
  //     "rewritten": "<improved version of that bullet>",
  //     "reason": "<why the original was weak>"
  //     }
  // ],
  // "ats_issues": ["<issue1>", "<issue2>"],
  // "sections_detected": {
  //     "experience": <true or false>,
  //     "education": <true or false>,
  //     "skills": <true or false>,
  //     "summary": <true or false>
  // }
  // }

  // RESUME:
  // ${resumeText}

  // JOB DESCRIPTION:
  // ${jobDescription}`

  return `You are screening a job application. Be extremely strict and critical.

INSTRUCTIONS:
- Compare ONLY what is explicitly written in the resume vs what the job requires
- Do NOT assume the candidate has skills not mentioned
- Do NOT give credit for adjacent or related skills unless they are directly relevant
- Do NOT be encouraging — be like a real recruiter who rejects 95% of applicants
- missing_keywords must list EVERY required skill not found in the resume
- weak_bullets must rewrite vague bullets into achievement-driven, metric-backed statements
- ats_issues must flag every problem a real ATS system would penalize

CRITICAL FORMAT RULES - DO NOT DEVIATE:
- First key MUST be "is_resume" (true or false)
- If "is_resume" is false, return ONLY this:
{
  "is_resume": false,
  "error_message": "<one sentence explaining what the document appears to be instead>"
}
- If "is_resume" is true, return the full structure:
- The root key for score MUST be "match_score" (not "score", not "candidate_score")
- The root key for label MUST be "score_label"
- Each object in "weak_bullets" MUST have exactly these 3 keys: "original", "rewritten", "reason"
(not "bullet", not "revised", not "suggestion")
- "missing_keywords" MUST be an array of plain strings only
- "strong_keywords" MUST be an array of plain strings only  
- "ats_issues" MUST be an array of plain strings only
- Do NOT add any extra keys like "candidate_name", "job_title", "recommendation"
- Do NOT rename any key for any reason
- Copy the JSON structure below EXACTLY as your output template:
{
  "is_resume": true,
  "match_score": 0,
  "score_label": "Poor",
  "summary": "",
  "missing_keywords": [],
  "strong_keywords": [],
  "weak_bullets": [
    {
      "original": "",
      "rewritten": "",
      "reason": ""
    }
  ],
  "ats_issues": [],
  "sections_detected": {
    "experience": false,
    "education": false,
    "skills": false,
    "summary": false
  }
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY this exact JSON, no other text:
{
  "match_score": <integer 0-100, be harsh and realistic>,
  "score_label": <"Poor" if below 40, "Fair" if 40-60, "Good" if 61-75, "Excellent" only if above 75>,
  "summary": "<Be brutally honest in 2-3 sentences. State clearly what is missing and why this resume would likely be rejected. Do not sugarcoat.>",
  "missing_keywords": ["<every required skill/tool/experience missing from resume>"],
  "strong_keywords": ["<only skills that directly match job requirements, not generic ones>"],
  "weak_bullets": [
    {
      "original": "<vague or weak bullet from resume>",
      "rewritten": "<stronger version with metrics and impact>",
      "reason": "<exactly why this bullet is weak>"
    }
  ],
  "ats_issues": ["<every formatting, keyword, structure issue an ATS would penalize>"],
  "sections_detected": {
    "experience": <true or false>,
    "education": <true or false>,
    "skills": <true or false>,
    "summary": <true or false>
  }
}`
}