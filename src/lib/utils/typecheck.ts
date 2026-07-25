export function assertExists<T>(value: T | null | undefined, error?: Error): asserts value is T {
  if (value == null) {
    if (error) {
      throw error;
    }
    throw new Error("Type is null or undefined!");
  }
}
