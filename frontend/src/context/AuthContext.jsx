import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("sadl_user")
    const storedToken = localStorage.getItem("sadl_token")
    if (storedUser && storedToken) {
      return JSON.parse(storedUser)
    }
    return null
  })
  const [loading] = useState(false)

  const login = (userData, token) => {
    localStorage.setItem("sadl_user", JSON.stringify(userData))
    localStorage.setItem("sadl_token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("sadl_user")
    localStorage.removeItem("sadl_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}