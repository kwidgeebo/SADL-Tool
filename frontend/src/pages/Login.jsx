import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      login(res.data.user, res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#041534", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&display=swap');
        .login-input { background: white; border: 1px solid #c5c6cf; padding: 10px 14px; font-size: 14px; font-family: 'Inter', sans-serif; width: 100%; outline: none; transition: border-color 0.2s; border-radius: 2px; color: #1b1b1e; }
        .login-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 2px rgba(201,168,76,0.15); }
        .login-input::placeholder { color: #aaa; }
      `}</style>

      {/* Nav bar */}
      <header style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "18px", color: "#C9A84C" }}>
            SADL-Up
          </button>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Secure Sign In
          </p>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Card */}
          <div style={{ backgroundColor: "white", padding: "40px", borderTop: "3px solid #C9A84C" }}>

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>
                Welcome Back
              </p>
              <h1 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "26px", color: "#041534", lineHeight: 1.2, marginBottom: "6px" }}>
                Sign in to SADL-Up
              </h1>
              <p style={{ fontSize: "13px", color: "#75777f" }}>
                ADF Training Development Platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ backgroundColor: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)", borderLeft: "3px solid #ba1a1a", padding: "10px 14px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#ba1a1a" }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@defence.gov.au"
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>
                  Password
                </label>
                <input
                  className="login-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px",
                  backgroundColor: loading ? "#b89a3a" : "#C9A84C",
                  color: "#041534",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  border: "none", cursor: loading ? "default" : "pointer",
                  transition: "background-color 0.2s",
                  marginBottom: "16px"
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#b89a3a" }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#C9A84C" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer link */}
            <p style={{ fontSize: "13px", color: "#75777f", textAlign: "center" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Sign up
              </Link>
            </p>
          </div>

          {/* Below card */}
          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "24px", lineHeight: 1.6 }}>
            Protected system. Authorised users only.<br />
            All activity is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
