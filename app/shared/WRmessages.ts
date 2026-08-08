export type StartGameMessage =
{
	type: "start-game",
	matchId: string
}

export type CancelGameMessage =
{
	type: "cancel-game",
	matchId: string
}