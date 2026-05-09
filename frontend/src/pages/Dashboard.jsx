import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ProjectCard from "../components/ProjectCard"
import NewProjectModal from "../components/NewProjectModal"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [pendingAnalyse, setPendingAnalyse] = useState([])
  const [pendingDesign, setPendingDesign] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const headers = { Authorization: `Bearer ${token}` }

      if (user?.role === "MANAGER") {
        const [projectsRes, approvalsRes] = await Promise.all([
          axios.get(`${API_URL}/api/projects`, { headers }),
          axios.get(`${API_URL}/api/approvals/pending`, { headers })
        ])
        setProjects(projectsRes.data)
        setPendingAnalyse(approvalsRes.data.pendingAnalyse || [])
        setPendingDesign(approvalsRes.data.pendingDesign || [])
      } else {
        const res = await axios.get(`${API_URL}/api/projects`, { headers })
        setProjects(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects])
  }

  const hasPending = pendingAnalyse.length > 0 || pendingDesign.length > 0

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">SADL Tool</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} — <span className={`font-medium ${user?.role === "MANAGER" ? "text-purple-600" : "text-blue-600"}`}>{user?.role}</span>
          </span>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* Manager — Pending Approvals */}
        {user?.role === "MANAGER" && hasPending && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Pending Approvals</h2>
            <p className="text-gray-500 mb-4">These projects are awaiting your review.</p>
            <div className="space-y-3">

              {pendingAnalyse.map(project => (
                <div
                  key={`analyse-${project.id}`}
                  onClick={() => navigate(`/approvals/analyse/${project.id}`)}
                  className="bg-white border-l-4 border-yellow-400 rounded-xl p-5 cursor-pointer hover:shadow-md transition flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Submitted by {project.user.name} — <span className="font-medium text-yellow-700">Analyse Phase</span> awaiting approval
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200">
                    Review →
                  </span>
                </div>
              ))}

              {pendingDesign.map(project => (
                <div
                  key={`design-${project.id}`}
                  onClick={() => navigate(`/approvals/design/${project.id}`)}
                  className="bg-white border-l-4 border-blue-400 rounded-xl p-5 cursor-pointer hover:shadow-md transition flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Submitted by {project.user.name} — <span className="font-medium text-blue-700">Design Phase (Draft LMP)</span> awaiting approval
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                    Review →
                  </span>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* Projects */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
            <p className="text-gray-500 mt-1">
              {user?.role === "MANAGER" ? "All SADL training projects" : "Manage your SADL training projects"}
            </p>
          </div>
          {user?.role === "DESIGNER" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
            >
              + New Project
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No projects yet</p>
            {user?.role === "DESIGNER" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}
