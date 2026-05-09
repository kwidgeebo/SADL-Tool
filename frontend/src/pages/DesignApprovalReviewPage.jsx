import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const DELIVERY_LABELS = {
  INSTRUCTOR_LED: "Instructor Led", SELF_PACED: "Self Paced", BLENDED: "Blended",
  ON_JOB: "On Job", SIMULATION: "Simulation", E_LEARNING: "eLearning", OTHER: "Other",
}
const TRAINING_LEVEL_LABELS = {
  LEVEL_1: "Level 1 — Awareness",
  LEVEL_2: "Level 2 — Supervised Performance",
  LEVEL_3: "Level 3 — Unsupervised Performance",
  LEVEL_4: "Level 4 — Instructional Ability",
}
const KIRKPATRICK_LABELS = {
  LEVEL_1_REACTION:  "Level 1 — Reaction",
  LEVEL_2_LEARNING:  "Level 2 — Learning",
  LEVEL_3_BEHAVIOUR: "Level 3 — Behaviour",
  LEVEL_4_RESULTS:   "Level 4 — Results",
}
const ASSESSMENT_LABELS = {
  OBSERVATION: "Observation", WRITTEN_TEST: "Written Test", PRACTICAL_EXERCISE: "Practical Exercise",
  PORTFOLIO: "Portfolio", ORAL_QUESTIONING: "Oral Questioning", SIMULATION_EXERCISE: "Simulation Exercise", OTHER: "Other",
}

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
      <p className="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function ReviewTable({ headers, rows }) {
  if (!rows || rows.length === 0) return null
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {headers.map(h => (
              <th key={h} className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-200 px-3 py-2 text-gray-700 text-xs align-top">{cell || "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DesignApprovalReviewPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReview()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/approvals/design/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
    } catch (err) {
      console.error("Failed to fetch review:", err)
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
        `${API_URL}/api/approvals/design/${projectId}/approve`,
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
        `${API_URL}/api/approvals/design/${projectId}/reject`,
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

  const { designPhase, project } = data || {}
  const des1 = designPhase?.des1InputAnalysis || {}
  const des2 = designPhase?.des2Environments || {}
  const des3 = designPhase?.des3LearningOutcomes || {}
  const des4 = designPhase?.des4CourseStructure || {}
  const los = des3?.learningOutcomes || []
  const modules = des4?.modules || []
  const evalPlan = des4?.evaluationPlan || []

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-700 text-sm">
            ← Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-800">Design Phase Review — Draft LMP</h1>
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
        </div>

        {/* Des1 — Input Analysis */}
        {des1 && (
          <ReviewSection title="Des1 — Input Analysis">
            <ReviewField label="Training Authority" value={des1.trainingAuthority} />
            <ReviewField label="Project Sponsor" value={des1.projectSponsor} />
            <ReviewField label="Stakeholders" value={des1.stakeholders} />
            <ReviewField label="SME Panel" value={des1.smePanel} />
            <ReviewField label="Scope Notes" value={des1.scopeNotes} />
            <ReviewField label="Steps Omitted" value={des1.phasesOmitted} />
            <ReviewField label="Rationale for Omissions" value={des1.rationaleOmissions} />
            <ReviewField label="Risk Notes" value={des1.riskNotes} />
            <ReviewField label="Overall Risk Rating" value={des1.overallRiskRating} />
            <ReviewField label="Mitigation Actions" value={des1.mitigationActions} />
          </ReviewSection>
        )}

        {/* Des2 — Environments */}
        {des2 && (
          <ReviewSection title="Des2 — Environments Analysis">
            <ReviewField label="Facility" value={des2.facilityDescription} />
            <ReviewField label="Location" value={des2.facilityLocation} />
            <ReviewField label="Activity Spaces" value={des2.activitySpaces} />
            <ReviewField label="Equipment Available" value={des2.equipmentAvailable} />
            <ReviewField label="Instructor Availability" value={des2.instructorAvailability} />
            <ReviewField label="Budget Available" value={des2.budgetAvailable} />
            <ReviewField label="WHS Requirements" value={des2.whsRequirements} />
            <ReviewField label="Security Requirements" value={des2.securityRequirements} />
          </ReviewSection>
        )}

        {/* Des3 — Learning Outcomes */}
        {los.length > 0 && (
          <ReviewSection title="Des3 — Learning Outcomes">
            <ReviewTable
              headers={["LO", "Name", "Training Level", "Delivery Method"]}
              rows={los.map(lo => [
                `LO ${lo.sequence}`,
                lo.loName || "—",
                TRAINING_LEVEL_LABELS[lo.trainingLevel] || lo.trainingLevel,
                DELIVERY_LABELS[lo.deliveryMethod] || lo.deliveryMethod,
              ])}
            />
            {los.map((lo, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 mt-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  LO {lo.sequence} — {lo.loName}
                </p>
                <div className="space-y-2">
                  <ReviewField label="Performance Statement" value={lo.performanceStatement} />
                  <ReviewField label="Performance Conditions" value={lo.performanceConditions} />
                  <ReviewField label="Performance Standard" value={lo.performanceStandard} />
                  <ReviewField label="Assessment Criteria" value={lo.assessmentCriteria} />
                  <ReviewField label="Content Summary" value={lo.contentSummary} />
                </div>
              </div>
            ))}
          </ReviewSection>
        )}

        {/* Des4 — Course Structure */}
        {des4 && (
          <ReviewSection title="Des4 — Course Structure">
            <ReviewField label="Course Aim" value={des4.courseAim} />
            <ReviewField label="Course Description" value={des4.courseDescription} />
            <ReviewField label="Course Type" value={des4.courseType} />
            <ReviewField label="Course Level" value={des4.courseLevel} />
            <ReviewField label="Min / Max Students" value={des4.minStudents && des4.maxStudents ? `${des4.minStudents} – ${des4.maxStudents}` : null} />
            <ReviewField label="Total Days" value={des4.totalDays ? String(des4.totalDays) : null} />
            <ReviewField label="Security Clearance" value={des4.securityClearance} />
            <ReviewField label="Formative Strategy" value={des4.formativeStrategy} />
            <ReviewField label="Summative Strategy" value={des4.summativeStrategy} />

            {modules.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Modules</p>
                {modules.map((mod, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Module {mod.sequence} — {mod.moduleName}
                    </p>
                    <ReviewField label="Content" value={mod.moduleContent} />
                    <ReviewField label="Delivery Method" value={DELIVERY_LABELS[mod.deliveryMethod]} />
                    <ReviewField label="Duration (Off Job)" value={mod.durationOffJobDays ? `${mod.durationOffJobDays} days` : null} />
                    {(mod.summativeAssessments || []).length > 0 && (
                      <ReviewTable
                        headers={["SA ID", "Name", "Method", "LO Assessed"]}
                        rows={mod.summativeAssessments.map(sa => [
                          sa.saId, sa.saName,
                          ASSESSMENT_LABELS[sa.method] || sa.method,
                          sa.loAssessed,
                        ])}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {evalPlan.filter(ep => ep.planDescription).length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Evaluation Plan</p>
                <ReviewTable
                  headers={["Level", "Approach", "Timing", "Responsibility"]}
                  rows={evalPlan.filter(ep => ep.planDescription).map(ep => [
                    KIRKPATRICK_LABELS[ep.kirkpatrickLevel] || ep.kirkpatrickLevel,
                    ep.planDescription,
                    ep.timing,
                    ep.responsibility,
                  ])}
                />
              </div>
            )}
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
              Comments <span className="text-red-500">(required for rejection)</span>
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
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
