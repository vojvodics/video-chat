export class ContextNotInProviderError extends Error {
  constructor() {
    super('Must use context value in provider');
  }
}
