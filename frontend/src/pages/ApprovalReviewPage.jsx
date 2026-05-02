import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export default function ApprovalReviewPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReview()
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
    setSubmitting(true)
    setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/approvals/analyse/${projectId}/approve`,
        { comments },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!comments.trim()) {
      setError("Please provide comments explaining why this is being rejected.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/approvals/analyse/${projectId}/reject`,
        { comments },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading review...</p>
      </div>
    )
  }

  const { analysePhase, project } = data || {}

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-800">Analyse Phase Review</h1>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200">
          Awaiting Approval
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-10">

        {/* Project Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{project?.title}</h2>
          <p className="text-sm text-gray-500">
            Submitted by <span className="font-medium">{project?.user?.name}</span> ({project?.user?.email})
          </p>
          {project?.description && (
            <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
          )}
        </div>

        {/* A1 Input Analysis */}
        {analysePhase?.inputAnalysis && (
          <ReviewSection title="A1 — Input Analysis">
            <ReviewField label="Project Background" value={analysePhase.inputAnalysis.projectBackground} />
            <ReviewField label="Current Status" value={analysePhase.inputAnalysis.currentStatus} />
            <ReviewField label="Scope Notes" value={analysePhase.inputAnalysis.scopeNotes} />
            <ReviewField label="Stakeholder Needs" value={analysePhase.inputAnalysis.stakeholderNeeds} />
            <ReviewField label="OQE Notes" value={analysePhase.inputAnalysis.oqeNotes} />
          </ReviewSection>
        )}

        {/* A2 Job Task Profile */}
        {analysePhase?.jobTaskProfile && (
          <ReviewSection title="A2 — Job Task Profile">
            <ReviewField label="Job Title" value={analysePhase.jobTaskProfile.jobTitle} />
            <ReviewField label="Job Description" value={analysePhase.jobTaskProfile.jobDescription} />
            <ReviewField label="Organisational Context" value={analysePhase.jobTaskProfile.organisationalContext} />
            {analysePhase.jobTaskProfile.tasks?.map((task, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-sm font-medium text-gray-700">Task {i + 1}: {task.taskDescription}</p>
                <p className="text-xs text-gray-500 mt-1">
                  D: {task.difficulty} | F: {task.frequency} | I: {task.importance}
                </p>
                {task.conditions && <p className="text-xs text-gray-500">Conditions: {task.conditions}</p>}
                {task.standards && <p className="text-xs text-gray-500">Standards: {task.standards}</p>}
              </div>
            ))}
          </ReviewSection>
        )}

        {/* A2 Target Population */}
        {analysePhase?.targetPopulation && (
          <ReviewSection title="A2 — Target Population Profile">
            <ReviewField label="Job Designation" value={analysePhase.targetPopulation.jobDesignation} />
            <ReviewField label="Situation" value={analysePhase.targetPopulation.jobSituation} />
            <ReviewField label="Employment Classification" value={analysePhase.targetPopulation.employmentClassification} />
            <ReviewField label="Qualifications" value={analysePhase.targetPopulation.qualifications} />
            <ReviewField label="Learning Methods" value={analysePhase.targetPopulation.learningMethods} />
          </ReviewSection>
        )}

        {/* A2 Gap Analysis */}
        {analysePhase?.gapAnalysis && (
          <ReviewSection title="A2 — Gap Analysis Statement">
            <ReviewField label="Gap Exists" value={analysePhase.gapAnalysis.gapExists ? "Yes" : "No"} />
            <ReviewField label="Gap Type" value={analysePhase.gapAnalysis.gapType} />
            <ReviewField label="Gap Summary" value={analysePhase.gapAnalysis.gapSummary} />
            <ReviewField label="Recommendation" value={analysePhase.gapAnalysis.recommendation} />
          </ReviewSection>
        )}

        {/* A3 Feasibility */}
        {analysePhase?.feasibilityReport && (
          <ReviewSection title="A3 — Feasibility Analysis Report">
            <ReviewField label="Recommendation" value={analysePhase.feasibilityReport.recommendation} />
            <ReviewField label="Units Consulted" value={analysePhase.feasibilityReport.unitsConsulted} />
            {analysePhase.feasibilityReport.options?.map((opt, i) => (
              <div key={i} className={`rounded-lg p-4 mt-2 ${opt.recommended ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
                <p className="text-sm font-medium text-gray-700">
                  {opt.recommended && "⭐ "}{opt.optionType.replace(/_/g, " ")}
                </p>
                {opt.optionDescription && <p className="text-xs text-gray-600 mt-1">{opt.optionDescription}</p>}
                {opt.advantages && <p className="text-xs text-green-700 mt-1">✓ {opt.advantages}</p>}
                {opt.disadvantages && <p className="text-xs text-red-600 mt-1">✗ {opt.disadvantages}</p>}
              </div>
            ))}
          </ReviewSection>
        )}

        {/* A4 Output */}
        {analysePhase?.analyseOutput && (
          <ReviewSection title="A4 — Proposed Output">
            <ReviewField
              label="Output Type"
              value={analysePhase.analyseOutput.outputType === "TRS"
                ? "AP9 — Training Requirement Specification (TRS)"
                : "AP8 — Learning and Development Strategy (LDS)"}
            />
          </ReviewSection>
        )}

        {/* Approval Decision */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Approval Decision</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments {analysePhase?.status !== "APPROVED" && <span className="text-red-500">(required for rejection)</span>}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Add any comments, feedback or reasons for your decision..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleReject}
              disabled={submitting}
              className="border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Processing..." : "✗ Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Processing..." : "✓ Approve"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper components
function ReviewSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <h3 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ReviewField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value}</p>
    </div>
  )
}