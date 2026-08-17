import { isAxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    console.log(err.message);
    if (err.response?.data?.error === "username not found" ||
      err.response?.data?.error === "bad credentials") {
      return "Invalid credentials. Please try again.";
    } else if (err.response?.data?.error === "username already exists") {
      return "Username already exists. Please choose a different one.";
    } else if (err.response?.data?.error === "email already registered") {
      return "An account already exists with this email address.";
    } else if (err.response?.data?.error === "You already have a hosted match") {
      return "You already created a game.";
    } else if (err.response?.data?.error === "player already in match") {
      return "You already joined this game.";
    } else if (err.response?.data?.error === "match is not open for joining") {
      return "This game is not ready. Pleasy try again later.";
    } else if (err.response?.data?.error === "match is full") {
      return "This game is currently full.";
    } else {
      return "Server error. Please try again later.";
    }
  }
  return "Error."
}
