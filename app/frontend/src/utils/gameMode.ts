export const normalizeGameMode = (gameMode: string) => {
  if (gameMode === "ai") return "AI";
  return gameMode[0].toUpperCase() + gameMode.slice(1);
};
