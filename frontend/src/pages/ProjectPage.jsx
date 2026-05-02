import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const phases = [
  { key: "ANALYSE", label: "Analyse", description: "Input Analysis, Performance Needs, Feasibility" },
  { key: "DESIGN", label: "Design", description: "Learning Management Package" },
  { key: "DEVELOP", label: "Develop", description: "Learning Materials" },
  { key: "IMPLEMENT", label: "Implement", description: "Delivery and Review" },
  { key: "EVALUATE", label: "Evaluate", description: "Evaluation and Amendment" },
]

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
  SUBMITTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-bold text-gray-800">{project.title}</h1>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
          project.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-600 border-gray-200"
        }`}>
          {project.status}
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-10">
        {project.description && (
          <p className="text-gray-500 mb-8">{project.description}</p>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-6">ADDIE Pipeline</h2>

        <div className="space-y-4">
          {phases.map((phase, index) => {
            const phaseData = project.phases?.find(p => p.type === phase.key)
            const status = phaseData?.status || "DRAFT"
            const isAnalyse = phase.key === "ANALYSE"

            return (
              <div
                key={phase.key}
                className={`bg-white rounded-2xl border p-6 ${isAnalyse ? "cursor-pointer hover:shadow-md transition" : "opacity-60"} ${statusColors[status]}`}
                onClick={() => isAnalyse && navigate(`/projects/${id}/analyse`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{phase.label}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[status]}`}>
                      {status}
                    </span>
                    {isAnalyse && (
                      <span className="text-blue-600 text-sm">→</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}