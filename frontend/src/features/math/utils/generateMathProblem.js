function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAdditionProblem(context = "bridge") {
  const left = randomNumber(1, 20);
  const right = randomNumber(1, 20);

  return {
    operation: "addition",
    question: `${left} + ${right}`,
    story:
      context === "bridge"
        ? `The workers found ${left} stones near the trail and ${right} more beside the broken bridge. How many stones did they find altogether?`
        : `Lena found ${left} trail markers and then found ${right} more. How many trail markers did she find altogether?`,
    answer: String(left + right),
  };
}

function generateSubtractionProblem(context = "rockfall") {
  const total = randomNumber(10, 30);
  const removed = randomNumber(1, total - 1);

  return {
    operation: "subtraction",
    question: `${total} - ${removed}`,
    story:
      context === "rockfall"
        ? `There were ${total} rocks blocking the trail. The workers cleared ${removed} rocks. How many rocks are still blocking the trail?`
        : `Lena had ${total} trail supplies and used ${removed}. How many supplies are left?`,
    answer: String(total - removed),
  };
}

export function generateMathProblem({ operation, context } = {}) {
  if (operation === "subtraction") {
    return generateSubtractionProblem(context);
  }

  return generateAdditionProblem(context);
}