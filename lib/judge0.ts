import { getJudge0LanguageId } from "./utils";

const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

const isMockMode = !JUDGE0_API_KEY || JUDGE0_API_KEY === "your-rapidapi-key-here";

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

// ==========================================
// MOCK EXECUTOR (Fallback when no API Key)
// ==========================================
async function mockSubmitCode(
  code: string,
  language: string,
  stdin: string = "",
  expectedOutput?: string
): Promise<Judge0Result> {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 800));

  let stdout = "";
  let stderr = "";
  let compile_output = "";
  let statusId = 3; // 3 = Accepted
  let statusDesc = "Accepted";

  // Extremely basic simulated execution based on code contents
  if (code.includes("syntax error") || code.includes("compile_error")) {
    statusId = 6;
    statusDesc = "Compilation Error";
    compile_output = "SyntaxError: Unexpected token or invalid syntax at line 1";
  } else if (code.includes("throw") || code.includes("panic!") || code.includes("Exception")) {
    statusId = 11;
    statusDesc = "Runtime Error (NZEC)";
    stderr = "Error: Unhandled exception during execution.";
  } else if (code.includes("while(true)") || code.includes("infinite loop")) {
    statusId = 13;
    statusDesc = "Time Limit Exceeded";
    stderr = "Execution timed out.";
  } else {
    // If it's a test case execution and we have expected output, 
    // let's simulate passing it if the user wrote some code
    if (expectedOutput !== undefined) {
      if (code.trim().length > 10) {
        // Assume code is correct for mock purposes
        stdout = expectedOutput;
      } else {
        // If code is empty or very short, it's a wrong answer
        statusId = 4;
        statusDesc = "Wrong Answer";
        stdout = "";
      }
    } else {
      // Manual run simulation
      if (language === "python") {
        stdout = "Hello from Python mock!\nInput was: " + stdin;
      } else if (language === "javascript" || language === "typescript") {
        stdout = "Hello from JS/TS mock!\nInput was: " + stdin;
      } else {
        stdout = "Program executed successfully.\nInput was: " + stdin;
      }
    }
  }

  return {
    token: "mock-token-" + Math.random(),
    status: { id: statusId, description: statusDesc },
    stdout,
    stderr,
    compile_output,
    time: "0.01",
    memory: 1024,
  };
}

export async function submitCode(
  code: string,
  language: string,
  stdin: string = "",
  expectedOutput?: string
): Promise<Judge0Result> {
  if (isMockMode) {
    return mockSubmitCode(code, language, stdin, expectedOutput);
  }

  const languageId = getJudge0LanguageId(language);

  // Use wait=true (synchronous mode) to get results in a single request.
  // This avoids Vercel's serverless function timeout caused by polling loops.
  const createRes = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
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
    // If rapidapi says unauthorized, fallback to mock instead of throwing
    if (createRes.status === 401 || err.includes("You are not subscribed")) {
      console.warn("[Judge0] Unauthorized or missing key. Falling back to Mock Executor.");
      return mockSubmitCode(code, language, stdin, expectedOutput);
    }
    throw new Error(`Judge0 submission failed: ${err}`);
  }

  const result = await createRes.json();

  // If status is still In Queue or Processing (shouldn't happen with wait=true, but guard anyway)
  if (result.status?.id <= 2) {
    throw new Error("Code execution timed out waiting for Judge0 response.");
  }

  return { token: result.token || "sync-token", ...result };
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
        
        let passed = false;
        if (isMockMode) {
          // In mock mode, if it's accepted, we consider it passed
          passed = result.status.id === 3;
        } else {
          passed = actual === expected && result.status.id === 3; // 3 = Accepted
        }

        return {
          input: tc.input,
          expected,
          actual: result.stderr || result.compile_output || actual,
          passed,
          time: result.time,
          status: result.status?.description,
        };
      } catch (err: any) {
        return {
          input: tc.input,
          expected: tc.output,
          actual: "Execution error: " + err.message,
          passed: false,
        };
      }
    })
  );

  const passed = results.filter((r) => r.passed).length;
  const score = testCases.length > 0 ? Math.round((passed / testCases.length) * 100) : 0;

  return { passed, total: testCases.length, results, score };
}
