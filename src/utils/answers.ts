const normalize = (text?: string) => text?.replace(/[’']/g, "'").trim().toLowerCase();

export const isCorrectAnswer = (input: string, expected?: string[]) => {
  if (!expected || !expected.length) return false;
  const normalizedInput = normalize(input);
  return expected.some((ans) => normalize(ans) === normalizedInput);
};
