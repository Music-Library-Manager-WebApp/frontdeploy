'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axios from 'axios'

interface AuthContextType {
  user: any
  loginUser: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null)

  // fetch currently logged in user
  const fetchMe = async () => {
    const res = await axios.get("http://localhost:8000/users/me/", {
      withCredentials: true, // important for cookie auth
    })
    return res.data
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await fetchMe()
        setUser(me)
      } catch {
        setUser(null) // not logged in
      }
    }
    loadUser()
  }, [])

  const loginUser = async (username: string, password: string) => {
    await axios.post(
      'http://localhost:8000/token',
      new URLSearchParams({ username, password }),
      { withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    // use fetchMe instead of getCurrentUser
    const me = await fetchMe()
    setUser(me)
  }

  const logout = async () => {
    await axios.post('http://localhost:8000/logout', {}, { withCredentials: true }) // backend should clear cookie
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
