export type UiActionState = {
  canGenerate: boolean;
  canDownloadIcs: boolean;
  generateLabel: string;
};

export const deriveUiActionState = (selectedCount: number, loading: boolean): UiActionState => ({
  canGenerate: selectedCount > 0 && !loading,
  canDownloadIcs: selectedCount > 0,
  generateLabel: loading ? "Generiere..." : "Wochenausblick generieren"
});

export const toUiErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Unknown error";
  }
  const message = error.message.trim();
  if (message.startsWith("API ")) {
    return message;
  }
  if (message.length === 0) {
    return "Unknown error";
  }
  return "Request failed";
};
