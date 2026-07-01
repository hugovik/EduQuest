import { generateMathProblem } from "./generateMathProblem.js";
import {
  getAvailableMathOperations,
  normalizeMathGrade,
} from "./mathGradeConfig.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function numbersFromQuestion(question) {
  return question.match(/\d+/g).map(Number);
}

function repeat(count, callback) {
  for (let index = 0; index < count; index += 1) {
    callback();
  }
}

export function runGenerateMathProblemTests() {
  repeat(100, () => {
    const problem = generateMathProblem({ operation: "addition", grade: 1 });
    const [left, right] = numbersFromQuestion(problem.question);

    assert(problem.operation === "addition", "Grade 1 addition should generate addition.");
    assert(left >= 0 && left <= 20, "Grade 1 addition left number should be small.");
    assert(right >= 0 && right <= 20, "Grade 1 addition right number should be small.");
  });

  repeat(100, () => {
    const problem = generateMathProblem({ operation: "subtraction", grade: 1 });

    assert(problem.operation === "subtraction", "Grade 1 subtraction should generate subtraction.");
    assert(Number(problem.answer) >= 0, "Grade 1 subtraction should not be negative.");
  });

  repeat(100, () => {
    const multiplication = generateMathProblem({ operation: "multiplication", grade: 1 });
    const division = generateMathProblem({ operation: "division", grade: 1 });

    assert(
      multiplication.operation !== "multiplication",
      "Grade 1 should not generate multiplication."
    );
    assert(
      division.operation !== "division",
      "Grade 1 should not generate division."
    );
  });

  ["addition", "subtraction", "multiplication", "division"].forEach((operation) => {
    const problem = generateMathProblem({ operation, grade: 2 });

    assert(problem.operation === operation, `Grade 2 should support ${operation}.`);
  });

  repeat(100, () => {
    const problem = generateMathProblem({ operation: "division", grade: 5 });
    const [dividend, divisor] = numbersFromQuestion(problem.question);

    assert(dividend % divisor === 0, "Division should have whole-number answers.");
    assert(Number.isInteger(Number(problem.answer)), "Division answer should be an integer.");
  });

  repeat(100, () => {
    const gradeOneProblem = generateMathProblem({ operation: "mixed", grade: 1 });
    const gradeThreeProblem = generateMathProblem({ operation: "mixed", grade: 3 });

    assert(
      getAvailableMathOperations(1).includes(gradeOneProblem.operation),
      "Grade 1 Surprise Me should respect available operations."
    );
    assert(
      getAvailableMathOperations(3).includes(gradeThreeProblem.operation),
      "Grade 3 Surprise Me should respect available operations."
    );
  });

  assert(normalizeMathGrade(undefined) === 2, "Missing grade should default safely.");
  assert(normalizeMathGrade(99) === 5, "Out-of-range grade should clamp safely.");
}
