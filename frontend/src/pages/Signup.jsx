import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "DESIGNER" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, form)
      login(res.data.user, res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#041534", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&display=swap');
        .signup-input { background: white; border: 1px solid #c5c6cf; padding: 10px 14px; font-size: 14px; font-family: 'Inter', sans-serif; width: 100%; outline: none; transition: border-color 0.2s; border-radius: 2px; color: #1b1b1e; }
        .signup-input:focus { border-color: #C9A84C; box-shadow: 0 0 0 2px rgba(201,168,76,0.15); }
        .signup-input::placeholder { color: #aaa; }
      `}</style>

      {/* Nav */}
      <header style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "18px", color: "#C9A84C" }}>
            SADL-Up
          </button>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Create Account
          </p>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <div style={{ backgroundColor: "white", padding: "40px", borderTop: "3px solid #C9A84C" }}>

            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>
                Get Started
              </p>
              <h1 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "26px", color: "#041534", lineHeight: 1.2, marginBottom: "6px" }}>
                Create your account
              </h1>
              <p style={{ fontSize: "13px", color: "#75777f" }}>
                ADF Training Development Platform
              </p>
            </div>

            {error && (
              <div style={{ backgroundColor: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.2)", borderLeft: "3px solid #ba1a1a", padding: "10px 14px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#ba1a1a" }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>Full Name</label>
                <input className="signup-input" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>Email</label>
                <input className="signup-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@defence.gov.au" />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>Password</label>
                <input className="signup-input" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>Role</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { value: "DESIGNER", label: "Instructional Designer", desc: "Create & develop training" },
                    { value: "MANAGER", label: "Training Manager", desc: "Review & approve phases" },
                  ].map(role => (
                    <label key={role.value} style={{
                      border: `1px solid ${form.role === role.value ? "#C9A84C" : "#c5c6cf"}`,
                      backgroundColor: form.role === role.value ? "rgba(201,168,76,0.06)" : "white",
                      padding: "12px", cursor: "pointer", transition: "all 0.2s"
                    }}>
                      <input type="radio" name="role" value={role.value} checked={form.role === role.value} onChange={handleChange} style={{ display: "none" }} />
                      <p style={{ fontSize: "12px", fontWeight: 600, color: form.role === role.value ? "#041534" : "#45464e", marginBottom: "2px" }}>{role.label}</p>
                      <p style={{ fontSize: "11px", color: "#75777f" }}>{role.desc}</p>
                    </label>
                  ))}
                </div>
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
                  transition: "background-color 0.2s", marginBottom: "16px"
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#b89a3a" }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#C9A84C" }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p style={{ fontSize: "13px", color: "#75777f", textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Sign in
              </Link>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "24px", lineHeight: 1.6 }}>
            Protected system. Authorised users only.<br />
            All activity is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
