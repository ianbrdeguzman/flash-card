export function validateInputs<T extends object>(inputs: T) {
  return Object.values(inputs)
    .map((input) => input.trim())
    .every((input) => input.length !== 0);
}
