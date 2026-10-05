import { isAxiosError } from "axios";

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    //console.log(err.message);
    //console.log(err.response?.data?.error);
    if (err.response?.data?.error === "username/email not found" ||
      err.response?.data?.error === "bad credentials" ||
      err.response?.data?.error === "data incomplete") {
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
    } else if (err.response?.data?.error === "username too large") {
      return "Username is too long.";
    } else if (err.response?.data?.error === "password too long") {
      return "Password is too long.";
    } else if (err.response?.data?.error === "invalid email") {
      return "Email is invalid.";
    } else if (err.response?.data?.error === "email too long") {
      return "Email is too long.";
    } else if (err.response?.data?.error === 'username contains "@"') {
      return "Username cannot contain @.";
    } else {
      return "Server error. Please try again later.";
    }
  }
  return "Error."
}
