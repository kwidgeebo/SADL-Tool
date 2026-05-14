import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Des1InputAnalysis from "../components/design/Des1InputAnalysis"
import Des2Environments from "../components/design/Des2Environments"
import Des3LearningOutcomes from "../components/design/Des3LearningOutcomes"
import Des4CourseStructure from "../components/design/Des4CourseStructure"
import Des5Output from "../components/design/Des5Output"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const steps = [
  { key: "Des1", label: "Des1 — Input Analysis",        description: "Documents, stakeholders and scope" },
  { key: "Des2", label: "Des2 — Environments Analysis", description: "Facility, resources and constraints" },
  { key: "Des3", label: "Des3 — Learning Outcomes",     description: "Generate and detail all LOs" },
  { key: "Des4", label: "Des4 — Course Structure",      description: "Modules, assessments and evaluation" },
  { key: "Des5", label: "Des5 — Output Production",     description: "Review and finalise Draft LMP" },
]

export default function DesignPhasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [designPhase, setDesignPhase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDesignPhase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchDesignPhase = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/design/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDesignPhase(res.data)
    } catch (error) {
      console.error("Failed to fetch design phase:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (endpoint, data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/design/${id}/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const res = await axios.get(`${API_URL}/api/design/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDesignPhase(res.data)
    } catch (error) {
      console.error("Save error:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0) }
  }
  const handleBack = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0) }
  }

  const renderStep = () => {
    const props = { designPhase, onSave: handleSave, onNext: handleNext, onBack: handleBack, saving }
    switch (steps[currentStep].key) {
      case "Des1": return <Des1InputAnalysis {...props} />
      case "Des2": return <Des2Environments {...props} />
      case "Des3": return <Des3LearningOutcomes {...props} />
      case "Des4": return <Des4CourseStructure {...props} />
      case "Des5": return <Des5Output designPhase={designPhase} onSave={handleSave} onBack={handleBack} saving={saving} />
      default: return null
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "#75777f" }}>Loading Design Phase...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&family=IBM+Plex+Mono:wght@500&display=swap');`}</style>

      {/* Nav */}
      <header style={{ backgroundColor: "#041534", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <nav style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => navigate(`/projects/${id}`)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              ← Back to Project
            </button>
            <span style={{ color: "rgba(201,168,76,0.25)" }}>|</span>
            <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "white" }}>
              Design Phase
            </span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
            {designPhase?.project?.title || ""}
          </span>
        </nav>
      </header>

      {/* Step tabs */}
      <div style={{ backgroundColor: "#0a1e3d", borderBottom: "1px solid rgba(201,168,76,0.12)", overflowX: "auto" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "2px", minWidth: "max-content" }}>
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = index < currentStep
            return (
              <button
                key={step.key}
                onClick={() => setCurrentStep(index)}
                style={{
                  padding: "14px 16px", border: "none", cursor: "pointer",
                  backgroundColor: "transparent",
                  borderBottom: isActive ? "2px solid #C9A84C" : "2px solid transparent",
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: isActive ? "#C9A84C" : isComplete ? "#546435" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 700,
                  color: isActive ? "#041534" : isComplete ? "white" : "rgba(255,255,255,0.35)",
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>
                  {isComplete ? "✓" : index + 1}
                </div>
                <p style={{
                  fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: isActive ? "#C9A84C" : isComplete ? "#a3b87a" : "rgba(255,255,255,0.4)"
                }}>
                  {step.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "6px" }}>
            Step {currentStep + 1} of {steps.length}
          </p>
          <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "22px", color: "#041534", marginBottom: "4px" }}>
            {steps[currentStep].label}
          </h2>
          <p style={{ fontSize: "13px", color: "#75777f" }}>
            {steps[currentStep].description}
          </p>
        </div>

        <div style={{ backgroundColor: "white", border: "1px solid #e5e1dc", borderTop: "3px solid #C9A84C", padding: "32px" }}>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
