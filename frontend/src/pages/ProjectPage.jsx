import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const phases = [
  { key: "ANALYSE",   label: "Analyse",   description: "Input Analysis, Performance Needs, Feasibility", num: 1 },
  { key: "DESIGN",    label: "Design",    description: "Learning Management Package",                    num: 2 },
  { key: "DEVELOP",   label: "Develop",   description: "Learning Materials & Development",               num: 3 },
  { key: "IMPLEMENT", label: "Implement", description: "Delivery and Review",                            num: 4 },
  { key: "EVALUATE",  label: "Evaluate",  description: "Evaluation and Amendment",                       num: 5 },
]

const statusConfig = {
  DRAFT:     { color: "#75777f", bg: "rgba(117,119,127,0.08)", border: "rgba(117,119,127,0.2)",  dot: "#bbb" },
  SUBMITTED: { color: "#b89a3a", bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.25)", dot: "#C9A84C" },
  APPROVED:  { color: "#546435", bg: "rgba(84,100,53,0.08)",   border: "rgba(84,100,53,0.2)",   dot: "#546435" },
  REJECTED:  { color: "#ba1a1a", bg: "rgba(186,26,26,0.06)",   border: "rgba(186,26,26,0.15)",  dot: "#ba1a1a" },
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("sadl_token")
        const res = await axios.get(`${API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setProject(res.data)
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "#75777f" }}>Loading project...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#75777f" }}>Project not found.</p>
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
            <button onClick={() => navigate("/dashboard")} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              ← Dashboard
            </button>
            <span style={{ color: "rgba(201,168,76,0.25)" }}>|</span>
            <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "white" }}>
              {project.title}
            </span>
          </div>
          <span style={{
            backgroundColor: project.status === "ACTIVE" ? "rgba(84,100,53,0.2)" : "rgba(117,119,127,0.15)",
            color: project.status === "ACTIVE" ? "#a3b87a" : "#75777f",
            border: `1px solid ${project.status === "ACTIVE" ? "rgba(84,100,53,0.3)" : "rgba(117,119,127,0.2)"}`,
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px"
          }}>
            {project.status}
          </span>
        </nav>
      </header>

      {/* Page header */}
      <div style={{ backgroundColor: "#0a1e3d", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "28px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "6px" }}>
            ADDIE Pipeline
          </p>
          <h1 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "22px", color: "white", marginBottom: project.description ? "8px" : "0" }}>
            {project.title}
          </h1>
          {project.description && (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "700px" }}>
              {project.description}
            </p>
          )}
        </div>
      </div>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Pipeline progress bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", gap: "0" }}>
          {phases.map((phase, index) => {
            const phaseData = project.phases?.find(p => p.type === phase.key)
            const status = phaseData?.status || "DRAFT"
            const sc = statusConfig[status]
            const isLast = index === phases.length - 1

            return (
              <div key={phase.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: status === "APPROVED" ? "#546435" : status === "SUBMITTED" ? "#C9A84C" : "rgba(255,255,255,0.08)",
                    border: `2px solid ${sc.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 6px",
                    fontSize: "11px", fontWeight: 700,
                    color: status === "APPROVED" ? "white" : status === "SUBMITTED" ? "#041534" : "#75777f",
                    fontFamily: "'IBM Plex Mono', monospace"
                  }}>
                    {status === "APPROVED" ? "✓" : phase.num}
                  </div>
                  <p style={{ fontSize: "10px", fontWeight: 600, color: status === "DRAFT" ? "#75777f" : "#041534", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.04em" }}>
                    {phase.label}
                  </p>
                </div>
                {!isLast && (
                  <div style={{ flex: 1, height: "2px", backgroundColor: status === "APPROVED" ? "#546435" : "rgba(0,0,0,0.1)", maxWidth: "40px", margin: "0 4px", marginBottom: "14px" }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Phase cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {phases.map((phase, index) => {
            const phaseData = project.phases?.find(p => p.type === phase.key)
            const status = phaseData?.status || "DRAFT"
            const sc = statusConfig[status]

            const isAnalyse = phase.key === "ANALYSE"
            const isDesign = phase.key === "DESIGN"
            const designPhase = project.phases?.find(p => p.type === "DESIGN")
            const designApproved = designPhase?.status === "APPROVED"
            const isDevelop = phase.key === "DEVELOP" && designApproved
            const isClickable = isAnalyse || isDesign || isDevelop

            const handleClick = () => {
              if (isAnalyse) navigate(`/projects/${id}/analyse`)
              if (isDesign) navigate(`/projects/${id}/design`)
              if (isDevelop) navigate(`/projects/${id}/develop`)
            }

            return (
              <div
                key={phase.key}
                onClick={isClickable ? handleClick : undefined}
                style={{
                  backgroundColor: "white",
                  border: `1px solid ${isClickable ? "#e5e1dc" : "#eee"}`,
                  borderLeft: `3px solid ${isClickable ? sc.dot : "#ddd"}`,
                  padding: "20px 24px",
                  cursor: isClickable ? "pointer" : "default",
                  opacity: isClickable ? 1 : 0.5,
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}
                onMouseEnter={e => { if (isClickable) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(4,21,52,0.08)"; e.currentTarget.style.borderColor = "#d4cfc9" } }}
                onMouseLeave={e => { if (isClickable) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e1dc" } }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* Number badge */}
                  <div style={{
                    width: "36px", height: "36px", flexShrink: 0,
                    backgroundColor: isClickable ? "#041534" : "rgba(0,0,0,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "13px",
                    color: isClickable ? "white" : "#aaa"
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: isClickable ? "#041534" : "#aaa", marginBottom: "3px" }}>
                      {phase.label}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#75777f" }}>{phase.description}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: sc.dot, flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "9px", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase", color: sc.color
                    }}>
                      {status}
                    </span>
                  </div>
                  {isClickable && (
                    <span style={{ color: "#C9A84C", fontSize: "14px", fontWeight: 700 }}>→</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info note for locked phases */}
        <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "24px" }}>
          Each phase unlocks when the previous phase is approved.
        </p>
      </main>
    </div>
  )
}
