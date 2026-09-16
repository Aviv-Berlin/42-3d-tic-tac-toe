export interface Form {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Stats {
	wins: number,
	draws: number,
	losses: number
}

export interface UserGameStats {
	online: Stats,
	all: Stats
}

export interface RankData {
	id: number,
	full_rank: number,
	full_score: number,
	online_rank: number,
	online_score: number,
	total_users: number
  }
