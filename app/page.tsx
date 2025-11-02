'use client'
import React, { useState, useEffect } from "react";
import Signup from "./signup/page";
import Login from "./login/page";
import Home from "./home/page"; // replace with your dashboard/home component
import { getCurrentUser, User } from "../lib/api";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Verify token by fetching current user
      getCurrentUser(storedToken)
        .then((u) => {
          setUser(u);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem("token"); // invalid token
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // User is logged in
  if (token && user) {
    return <Home token={token} user={user} />;
  }

  // User not logged in
  return (
    <div>
      <Login onLogin={(t: string) => setToken(t)} />
      <Signup />
    </div>
  );
}
