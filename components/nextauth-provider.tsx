"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
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

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>
  logout: () => Promise<void>
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

// Storage functions
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

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Convert NextAuth session to our user format
  useEffect(() => {
    if (status === "loading") {
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    if (session?.user?.email) {
      // Try to get full user data from localStorage
      const users = getStoredUsers()
      let user = users.find(u => u.email === session.user!.email)
      
      // If not found, create from session data
      if (!user) {
        user = {
          id: Date.now().toString(),
          firstName: session.user.name?.split(" ")[0] || "",
          lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
          email: session.user.email || "",
          avatar: session.user.image || undefined,
          joinDate: new Date().toISOString(),
          isEmailVerified: true,
        }
        
        // Save to localStorage
        const updatedUsers = [...users, user]
        saveUsers(updatedUsers)
      }
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      setCurrentUser(user)
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      setCurrentUser(null)
    }
  }, [session, status])

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push("/profile")
        return true
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const users = getStoredUsers()
      const existingUser = users.find(u => u.email === userData.email)

      if (existingUser) {
        setState(prev => ({ ...prev, isLoading: false }))
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
      
      // Auto-login after registration
      const result = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push("/profile")
        return true
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    await signIn(provider, { callbackUrl: "/profile" })
  }

  const logout = async (): Promise<void> => {
    await signOut({ callbackUrl: "/" })
  }

  const updateUser = (userData: Partial<User>) => {
    if (!state.user) return

    const updatedUser = { ...state.user, ...userData }
    setState(prev => ({ ...prev, user: updatedUser }))
    
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

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
