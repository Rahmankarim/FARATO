"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  avatar?: string
  joinDate: string
  isEmailVerified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_LOADING"; payload: boolean }

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  socialLogin: (provider: 'google' | 'facebook') => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

// Simulated user storage using localStorage
const USERS_STORAGE_KEY = "farato_users"
const CURRENT_USER_KEY = "farato_current_user"

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    const user = users.find(u => u.email === email)

    if (user) {
      // In a real app, you'd verify the password here
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
      setCurrentUser(user)
      router.push("/profile")
      return true
    } else {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    const existingUser = users.find(u => u.email === userData.email)

    if (existingUser) {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      joinDate: new Date().toISOString(),
      isEmailVerified: false,
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    
    dispatch({ type: "LOGIN_SUCCESS", payload: newUser })
    setCurrentUser(newUser)
    router.push("/profile")
    return true
  }

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock social login - in a real app, this would integrate with OAuth providers
    const mockUser: User = {
      id: Date.now().toString(),
      firstName: provider === 'google' ? 'Google' : 'Facebook',
      lastName: 'User',
      email: `user@${provider}.com`,
      joinDate: new Date().toISOString(),
      isEmailVerified: true,
      avatar: provider === 'google' 
        ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' 
        : 'https://graph.facebook.com/me/picture?type=large'
    }

    // Check if user already exists
    const users = getStoredUsers()
    let existingUser = users.find(u => u.email === mockUser.email)
    
    if (!existingUser) {
      // Create new user
      const updatedUsers = [...users, mockUser]
      saveUsers(updatedUsers)
      existingUser = mockUser
    }

    dispatch({ type: "LOGIN_SUCCESS", payload: existingUser })
    setCurrentUser(existingUser)
    router.push("/profile")
    return true
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    setCurrentUser(null)
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (!state.user) return

    const updatedUser = { ...state.user, ...userData }
    dispatch({ type: "UPDATE_USER", payload: userData })
    
    // Update in storage
    const users = getStoredUsers()
    const updatedUsers = users.map(u => 
      u.id === state.user!.id ? updatedUser : u
    )
    saveUsers(updatedUsers)
    setCurrentUser(updatedUser)
  }

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    socialLogin,
    logout,
    updateUser,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
