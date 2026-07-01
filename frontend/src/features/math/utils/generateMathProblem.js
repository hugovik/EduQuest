const problemOperations = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resolveOperation(operation = "addition") {
  if (operation === "mixed") {
    return problemOperations[randomNumber(0, problemOperations.length - 1)];
  }

  return problemOperations.includes(operation) ? operation : "addition";
}

function storyForOperation(operation, context, values) {
  if (context === "broken-bridge-001") {
    if (operation === "addition") {
      return "Lena has " + values.left + " planks and the workers bring " + values.right + " more. How many planks can they use for the bridge?";
    }

    if (operation === "subtraction") {
      return "The crew counted " + values.total + " bridge boards. " + values.removed + " boards are cracked. How many boards are still ready to use?";
    }

    if (operation === "multiplication") {
      return "Each bridge section needs " + values.left + " bolts. Lena checks " + values.right + " sections. How many bolts are needed?";
    }

    return "The bridge team shares " + values.dividend + " ropes equally across " + values.divisor + " repair teams. How many ropes does each team get?";
  }

  if (context === "rockfall-001") {
    if (operation === "addition") {
      return "The workers clear " + values.left + " rocks from one side and " + values.right + " from the other side. How many rocks did they clear?";
    }

    if (operation === "subtraction") {
      return "There are " + values.total + " rocks blocking the trail. The workers clear " + values.removed + ". How many rocks are left?";
    }

    if (operation === "multiplication") {
      return "Lena fills " + values.right + " carts with " + values.left + " rocks in each cart. How many rocks are in the carts?";
    }

    return "The rescue team splits " + values.dividend + " trail flags equally into " + values.divisor + " packs. How many flags go in each pack?";
  }

  if (operation === "addition") {
    return "Lena finds " + values.left + " trail markers and then " + values.right + " more. How many trail markers does she find?";
  }

  if (operation === "subtraction") {
    return "Lena has " + values.total + " supplies and uses " + values.removed + ". How many supplies are left?";
  }

  if (operation === "multiplication") {
    return "Lena packs " + values.right + " bags with " + values.left + " snacks in each bag. How many snacks are packed?";
  }

  return "Lena shares " + values.dividend + " berries equally into " + values.divisor + " bowls. How many berries are in each bowl?";
}

function generateAdditionProblem(context) {
  const left = randomNumber(1, 12);
  const right = randomNumber(1, 12);
  const values = { left, right };

  return {
    operation: "addition",
    question: `${left} + ${right}`,
    story: storyForOperation("addition", context, values),
    answer: String(left + right),
  };
}

function generateSubtractionProblem(context) {
  const answer = randomNumber(1, 12);
  const removed = randomNumber(1, 12);
  const total = answer + removed;
  const values = { total, removed };

  return {
    operation: "subtraction",
    question: `${total} - ${removed}`,
    story: storyForOperation("subtraction", context, values),
    answer: String(answer),
  };
}

function generateMultiplicationProblem(context) {
  const left = randomNumber(1, 5);
  const right = randomNumber(1, 5);
  const values = { left, right };

  return {
    operation: "multiplication",
    question: `${left} × ${right}`,
    story: storyForOperation("multiplication", context, values),
    answer: String(left * right),
  };
}

function generateDivisionProblem(context) {
  const divisor = randomNumber(2, 5);
  const quotient = randomNumber(1, 5);
  const dividend = divisor * quotient;
  const values = { dividend, divisor };

  return {
    operation: "division",
    question: `${dividend} ÷ ${divisor}`,
    story: storyForOperation("division", context, values),
    answer: String(quotient),
  };
}

export function generateMathProblem({ operation = "addition", context } = {}) {
  const resolvedOperation = resolveOperation(operation);

  if (resolvedOperation === "subtraction") {
    return generateSubtractionProblem(context);
  }

  if (resolvedOperation === "multiplication") {
    return generateMultiplicationProblem(context);
  }

  if (resolvedOperation === "division") {
    return generateDivisionProblem(context);
  }

  return generateAdditionProblem(context);
}
