// src/lib/api.ts
import Cookies from "js-cookie";

const BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend URL

// ---------------- TYPES ----------------
export interface SignupData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Album {
  id: number;
  title: string;
  total_tracks: number;
  audio_url?: string;
}

export interface Song {
  id: number;
  name: string;
  genre?: string;
  audio_url?: string;
  play_count?: number;
}

export interface Artist {
  id: number;
  name: string;
  country?: string;
  audio_url?: string;
  play_count?: number;
}

export interface DashboardData {
  totals: { songs: number; albums: number; artists: number };
  recently_added: { songs: Song[]; albums: Album[]; artists: Artist[] };
  top_played: { songs: Song[]; albums: Album[]; artists: Artist[] };
}

// ---------------- AUTH ----------------

// Signup
export const signup = async (data: SignupData): Promise<User> => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.full_name) formData.append("full_name", data.full_name);

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Login (sets cookie automatically)
export const login = async (username: string, password: string): Promise<Token> => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    credentials: "include", // important for cookie
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Logout
export const logout = async (): Promise<void> => {
  await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/me/`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// ---------------- DASHBOARD ----------------
export const getDashboard = async (): Promise<DashboardData> => {
  const res = await fetch(`${BASE_URL}/api/dashboard`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// ---------------- SONGS ----------------
export const getAllSongs = async (): Promise<Song[]> => {
  const res = await fetch(`${BASE_URL}/api/songs/all`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const createSong = async (data: { name: string; genre: string; audio?: File }): Promise<Song> => {
  const formData = new FormData();
  formData.append("Songs_name", data.name);
  formData.append("Gener", data.genre);
  if (data.audio) formData.append("audio", data.audio);

  const res = await fetch(`${BASE_URL}/api/songs/create`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const playSong = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/api/songs/${id}/play`, { method: "POST", credentials: "include" });
};

// ---------------- ALBUMS ----------------
export const getAllAlbums = async (): Promise<Album[]> => {
  const res = await fetch(`${BASE_URL}/api/albums/all`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const createAlbum = async (data: { title: string; total_tracks: number; audio?: File }): Promise<Album> => {
  const formData = new FormData();
  formData.append("Album_title", data.title);
  formData.append("Total_tracks", data.total_tracks.toString());
  if (data.audio) formData.append("audio", data.audio);

  const res = await fetch(`${BASE_URL}/api/albums/create`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// ---------------- ARTISTS ----------------
export const getAllArtists = async (): Promise<Artist[]> => {
  const res = await fetch(`${BASE_URL}/api/artists/all`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const createArtist = async (data: { name: string; country: string; audio?: File }): Promise<Artist> => {
  const formData = new FormData();
  formData.append("Artist_name", data.name);
  formData.append("Country", data.country);
  if (data.audio) formData.append("audio", data.audio);

  const res = await fetch(`${BASE_URL}/api/artists/create`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
