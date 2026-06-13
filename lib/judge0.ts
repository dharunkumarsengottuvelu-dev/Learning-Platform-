import { getJudge0LanguageId } from "./utils";

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

const judge0Headers = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": JUDGE0_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0Result {
  token: string;
  status: { id: number; description: string };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: string;
  memory?: number;
}

export async function submitCode(
  code: string,
  language: string,
  stdin: string = "",
  expectedOutput?: string
): Promise<Judge0Result> {
  const languageId = getJudge0LanguageId(language);

  // Create submission
  const createRes = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`, {
    method: "POST",
    headers: judge0Headers,
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin,
      expected_output: expectedOutput,
      cpu_time_limit: 5,
      memory_limit: 256000,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Judge0 submission failed: ${err}`);
  }

  const { token } = await createRes.json();

  // Poll for result
  let attempts = 0;
  while (attempts < 20) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resultRes = await fetch(
      `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false&fields=status,stdout,stderr,compile_output,time,memory,message`,
      { headers: judge0Headers }
    );

    if (!resultRes.ok) {
      attempts++;
      continue;
    }

    const result = await resultRes.json();
    // Status 1 = In Queue, 2 = Processing
    if (result.status?.id > 2) {
      return { token, ...result };
    }
    attempts++;
  }

  throw new Error("Code execution timed out.");
}

export async function runTestCases(
  code: string,
  language: string,
  testCases: { input: string; output: string }[]
): Promise<{
  passed: number;
  total: number;
  results: { input: string; expected: string; actual: string; passed: boolean; time?: string }[];
  score: number;
}> {
  const results = await Promise.all(
    testCases.map(async (tc) => {
      try {
        const result = await submitCode(code, language, tc.input, tc.output);
        const actual = (result.stdout || "").trim();
        const expected = tc.output.trim();
        const passed = actual === expected && result.status.id === 3; // 3 = Accepted
        return {
          input: tc.input,
          expected,
          actual: result.stderr || result.compile_output || actual,
          passed,
          time: result.time,
          status: result.status?.description,
        };
      } catch {
        return {
          input: tc.input,
          expected: tc.output,
          actual: "Execution error",
          passed: false,
        };
      }
    })
  );

  const passed = results.filter((r) => r.passed).length;
  const score = testCases.length > 0 ? Math.round((passed / testCases.length) * 100) : 0;

  return { passed, total: testCases.length, results, score };
}
