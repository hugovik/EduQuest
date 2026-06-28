import { apiGet } from "./client";

export function getChild() {
  return apiGet("/child");
}