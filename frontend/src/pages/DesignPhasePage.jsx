import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Dev1CopilotPrompts from "../components/develop/Dev1CopilotPrompts"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const steps = [
  { key: "Dev1", label: "Dev1 — Copilot Prompts", description: "Generate development prompts" },
]

export default function DevelopPhasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [developPhase, setDevelopPhase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDevelopPhase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchDevelopPhase = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/develop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDevelopPhase(res.data)
    } catch (error) {
      console.error("Failed to fetch develop phase:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (endpoint, data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/develop/${id}/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const res = await axios.get(`${API_URL}/api/develop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDevelopPhase(res.data)
    } catch (error) {
      console.error("Save error:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/develop/${id}/submit`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/projects/${id}`)
    } catch (error) {
      console.error("Submit error:", error)
    }
  }

  const renderStep = () => {
    const props = { developPhase, onSave: handleSave, onSubmit: handleSubmit, saving }
    switch (steps[currentStep].key) {
      case "Dev1": return <Dev1CopilotPrompts {...props} />
      default: return null
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "#75777f" }}>Loading Develop Phase...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      <header style={{ backgroundColor: "#041534", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <nav style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => navigate(`/projects/${id}`)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              ← Back to Project
            </button>
            <span style={{ color: "rgba(201,168,76,0.25)" }}>|</span>
            <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "white" }}>Develop Phase</span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{developPhase?.project?.title || ""}</span>
        </nav>
      </header>

      <div style={{ backgroundColor: "#0a1e3d", borderBottom: "1px solid rgba(201,168,76,0.12)", overflowX: "auto" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "2px", minWidth: "max-content" }}>
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = index < currentStep
            return (
              <button key={step.key} onClick={() => setCurrentStep(index)} style={{ padding: "14px 16px", border: "none", cursor: "pointer", backgroundColor: "transparent", borderBottom: isActive ? "2px solid #C9A84C" : "2px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, backgroundColor: isActive ? "#C9A84C" : isComplete ? "#546435" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: isActive ? "#041534" : isComplete ? "white" : "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {isComplete ? "✓" : index + 1}
                </div>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", color: isActive ? "#C9A84C" : isComplete ? "#a3b87a" : "rgba(255,255,255,0.4)" }}>{step.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "6px" }}>Step {currentStep + 1} of {steps.length}</p>
          <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "22px", color: "#041534", marginBottom: "4px" }}>{steps[currentStep].label}</h2>
          <p style={{ fontSize: "13px", color: "#75777f" }}>{steps[currentStep].description}</p>
        </div>
        <div style={{ backgroundColor: "white", border: "1px solid #e5e1dc", borderTop: "3px solid #C9A84C", padding: "32px" }}>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
