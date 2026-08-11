import { create } from "zustand";

export interface Match {
	id: string;
	host: string;
	size: number;
	requiredPlayers: number;
	players: string[];
	status: "waiting" | "ready" | "started" | "disconnected" | "canceled";
}

interface MatchStore {
	match: Match | null;
	setMatch: (match: Match) => void;
	clearMatch: () => void;
}

const useMatchStore = create<MatchStore>((set) => ({
	match: null,

	setMatch: (match) => set({ match }),

	clearMatch: () => set({ match: null }),
}));

export const useMatch = () => useMatchStore((state) => state.match);
export const useSetMatch = () => useMatchStore((state) => state.setMatch);
export const useClearMatch = () => useMatchStore((state) => state.clearMatch);