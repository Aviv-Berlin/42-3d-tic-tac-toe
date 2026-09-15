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
