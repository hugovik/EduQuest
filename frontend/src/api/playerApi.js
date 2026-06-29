import { API_BASE_URL } from "../config/api";

export async function getPlayer() {
    const response = await fetch(`${API_BASE_URL}/child`);

    if (!response.ok) {
        throw new Error("Unable to load player.");
    }

    return response.json();
}