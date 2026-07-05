export function evaluateChoiceAnswer(expected, selected) {
  return expected === selected;
}

export function evaluateSentenceAnswer(expected, selected) {
  return expected.trim() === selected.trim();
}

export function evaluateOrderedWords(expected, selectedWords) {
  return expected === selectedWords.join(" ");
}