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

export const toUiErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";
