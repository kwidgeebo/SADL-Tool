import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

function ReviewSection({ title, children }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e5e1dc", borderLeft: "3px solid #C9A84C", padding: "24px", marginBottom: "12px" }}>
      <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "14px", color: "#041534", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f0ece8" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  )
}

function ReviewField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#75777f", marginBottom: "3px" }}>{label}</p>
      <p style={{ fontSize: "13px", color: "#1b1b1e", lineHeight: 1.6 }}>{value}</p>
    </div>
  )
}

export default function ApprovalReviewPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [decision, setDecision] = useState(null)

  useEffect(() => {
    fetchReview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/approvals/analyse/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
    } catch (error) {
      console.error("Failed to fetch review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setSubmitting(true); setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/approvals/analyse/${projectId}/approve`, { comments }, { headers: { Authorization: `Bearer ${token}` } })
      setDecision("approved")
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve")
    } finally { setSubmitting(false) }
  }

  const handleReject = async () => {
    if (!comments.trim()) { setError("Please provide comments explaining why this is being rejected."); return }
    setSubmitting(true); setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/approvals/analyse/${projectId}/reject`, { comments }, { headers: { Authorization: `Bearer ${token}` } })
      setDecision("rejected")
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject")
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "32px", height: "32px", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "#75777f" }}>Loading review...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  const { analysePhase, project } = data || {}

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f2ee", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&display=swap');`}</style>

      <header style={{ backgroundColor: "#041534", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <nav style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              ← Dashboard
            </button>
            <span style={{ color: "rgba(201,168,76,0.25)" }}>|</span>
            <span style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "white" }}>Analyse Phase Review</span>
          </div>
          <span style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px" }}>
            Awaiting Approval
          </span>
        </nav>
      </header>

      <div style={{ backgroundColor: "#0a1e3d", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "4px" }}>Submission for Review</p>
          <h1 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "20px", color: "white", marginBottom: "4px" }}>{project?.title}</h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Submitted by {project?.user?.name} ({project?.user?.email})</p>
        </div>
      </div>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {analysePhase?.inputAnalysis && (
          <ReviewSection title="A1 — Input Analysis">
            <ReviewField label="Project Background" value={analysePhase.inputAnalysis.projectBackground} />
            <ReviewField label="Current Status" value={analysePhase.inputAnalysis.currentStatus} />
            <ReviewField label="Scope Notes" value={analysePhase.inputAnalysis.scopeNotes} />
            <ReviewField label="Stakeholder Needs" value={analysePhase.inputAnalysis.stakeholderNeeds} />
            <ReviewField label="OQE Notes" value={analysePhase.inputAnalysis.oqeNotes} />
          </ReviewSection>
        )}

        {analysePhase?.jobTaskProfile && (
          <ReviewSection title="A2 — Job Task Profile">
            <ReviewField label="Job Title" value={analysePhase.jobTaskProfile.jobTitle} />
            <ReviewField label="Job Description" value={analysePhase.jobTaskProfile.jobDescription} />
            <ReviewField label="Organisational Context" value={analysePhase.jobTaskProfile.organisationalContext} />
            {analysePhase.jobTaskProfile.tasks?.map((task, i) => (
              <div key={i} style={{ backgroundColor: "#f5f3f0", border: "1px solid #e5e1dc", padding: "12px 16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#041534", marginBottom: "4px" }}>Task {i + 1}: {task.taskDescription}</p>
                <p style={{ fontSize: "11px", color: "#75777f" }}>D: {task.difficulty} | F: {task.frequency} | I: {task.importance}</p>
                {task.conditions && <p style={{ fontSize: "11px", color: "#75777f", marginTop: "2px" }}>Conditions: {task.conditions}</p>}
                {task.standards && <p style={{ fontSize: "11px", color: "#75777f", marginTop: "2px" }}>Standards: {task.standards}</p>}
              </div>
            ))}
          </ReviewSection>
        )}

        {analysePhase?.targetPopulation && (
          <ReviewSection title="A2 — Target Population Profile">
            <ReviewField label="Job Designation" value={analysePhase.targetPopulation.jobDesignation} />
            <ReviewField label="Situation" value={analysePhase.targetPopulation.jobSituation} />
            <ReviewField label="Employment Classification" value={analysePhase.targetPopulation.employmentClassification} />
            <ReviewField label="Qualifications" value={analysePhase.targetPopulation.qualifications} />
            <ReviewField label="Learning Methods" value={analysePhase.targetPopulation.learningMethods} />
          </ReviewSection>
        )}

        {analysePhase?.gapAnalysis && (
          <ReviewSection title="A2 — Gap Analysis Statement">
            <ReviewField label="Gap Exists" value={analysePhase.gapAnalysis.gapExists ? "Yes" : "No"} />
            <ReviewField label="Gap Type" value={analysePhase.gapAnalysis.gapType} />
            <ReviewField label="Gap Summary" value={analysePhase.gapAnalysis.gapSummary} />
            <ReviewField label="Recommendation" value={analysePhase.gapAnalysis.recommendation} />
          </ReviewSection>
        )}

        {analysePhase?.feasibilityReport && (
          <ReviewSection title="A3 — Feasibility Analysis Report">
            <ReviewField label="Recommendation" value={analysePhase.feasibilityReport.recommendation} />
            <ReviewField label="Units Consulted" value={analysePhase.feasibilityReport.unitsConsulted} />
            {analysePhase.feasibilityReport.options?.map((opt, i) => (
              <div key={i} style={{ backgroundColor: opt.recommended ? "rgba(201,168,76,0.06)" : "#f5f3f0", border: `1px solid ${opt.recommended ? "rgba(201,168,76,0.25)" : "#e5e1dc"}`, borderLeft: opt.recommended ? "3px solid #C9A84C" : "3px solid #e5e1dc", padding: "12px 16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#041534", marginBottom: "4px" }}>{opt.recommended && "★ "}{opt.optionType.replace(/_/g, " ")}</p>
                {opt.optionDescription && <p style={{ fontSize: "12px", color: "#45464e", marginTop: "4px" }}>{opt.optionDescription}</p>}
                {opt.advantages && <p style={{ fontSize: "12px", color: "#546435", marginTop: "4px" }}>✓ {opt.advantages}</p>}
                {opt.disadvantages && <p style={{ fontSize: "12px", color: "#ba1a1a", marginTop: "4px" }}>✕ {opt.disadvantages}</p>}
              </div>
            ))}
          </ReviewSection>
        )}

        {analysePhase?.analyseOutput && (
          <ReviewSection title="A4 — Proposed Output">
            <ReviewField label="Output Type" value={analysePhase.analyseOutput.outputType === "TRS" ? "AP9 — Training Requirement Specification (TRS)" : "AP8 — Learning and Development Strategy (LDS)"} />
          </ReviewSection>
        )}

        {/* Approval Decision */}
        <div style={{ backgroundColor: "white", border: "1px solid #e5e1dc", borderTop: "3px solid #041534", padding: "28px", marginTop: "8px" }}>
          <h3 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 700, fontSize: "16px", color: "#041534", marginBottom: "20px" }}>Approval Decision</h3>

          {decision && (
            <div style={{ backgroundColor: decision === "approved" ? "rgba(84,100,53,0.08)" : "rgba(186,26,26,0.06)", border: `1px solid ${decision === "approved" ? "rgba(84,100,53,0.2)" : "rgba(186,26,26,0.15)"}`, padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: decision === "approved" ? "#546435" : "#ba1a1a", fontWeight: 600 }}>
                {decision === "approved" ? "✓ Approved — redirecting to dashboard..." : "✕ Rejected — redirecting to dashboard..."}
              </p>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: "rgba(186,26,26,0.06)", border: "1px solid rgba(186,26,26,0.15)", borderLeft: "3px solid #ba1a1a", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#ba1a1a" }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#45464e", display: "block", marginBottom: "6px" }}>
              Comments <span style={{ color: "#ba1a1a" }}>(required for rejection)</span>
            </label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} rows={4}
              placeholder="Add any comments, feedback or reasons for your decision..."
              style={{ width: "100%", border: "1px solid #c5c6cf", padding: "10px 14px", fontSize: "14px", fontFamily: "'Inter', sans-serif", outline: "none", borderRadius: "2px", resize: "vertical" }}
              onFocus={e => { e.target.style.borderColor = "#C9A84C"; e.target.style.boxShadow = "0 0 0 2px rgba(201,168,76,0.15)" }}
              onBlur={e => { e.target.style.borderColor = "#c5c6cf"; e.target.style.boxShadow = "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button onClick={handleReject} disabled={submitting || !!decision} style={{ padding: "10px 24px", border: "2px solid rgba(186,26,26,0.4)", background: "white", color: "#ba1a1a", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: submitting || decision ? "default" : "pointer", opacity: submitting || decision ? 0.5 : 1 }}>
              {submitting ? "Processing..." : "✕ Reject"}
            </button>
            <button onClick={handleApprove} disabled={submitting || !!decision} style={{ padding: "10px 24px", backgroundColor: submitting || decision ? "#b89a3a" : "#C9A84C", color: "#041534", border: "none", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: submitting || decision ? "default" : "pointer" }}>
              {submitting ? "Processing..." : "✓ Approve"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
