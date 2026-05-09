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
    <div className="min-h-screen" style={{ backgroundColor: "#f4f2ee", fontFamily: "'Inter', sans-serif" }}>

      {/* Top Navigation */}
      <header style={{ backgroundColor: "#041534", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center" style={{ height: "64px" }}>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight" style={{ color: "#C9A84C", fontFamily: "'Public Sans', sans-serif" }}>
              SADL-Up
            </span>
            <span style={{ color: "rgba(201,168,76,0.25)", margin: "0 4px" }}>|</span>
            <span style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              {user?.role === "MANAGER" ? "Manager Portal" : "Designer Portal"}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{user?.name}</span>
              <span style={{
                backgroundColor: user?.role === "MANAGER" ? "rgba(201,168,76,0.12)" : "rgba(84,100,53,0.25)",
                color: user?.role === "MANAGER" ? "#C9A84C" : "#a3b87a",
                border: `1px solid ${user?.role === "MANAGER" ? "rgba(201,168,76,0.25)" : "rgba(84,100,53,0.35)"}`,
                fontFamily: "'IBM Plex Sans', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "9px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "2px"
              }}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'IBM Plex Sans', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "10px",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.target.style.color = "#C9A84C"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
            >
              Log Out
            </button>
          </div>
        </nav>
      </header>

      {/* Page Header Band */}
      <div style={{ backgroundColor: "#0a1e3d", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="max-w-6xl mx-auto px-8 py-7 flex justify-between items-end">
          <div>
            <p style={{
              color: "#C9A84C",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "6px"
            }}>
              Dashboard
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Public Sans', sans-serif", lineHeight: 1.2 }}>
              {user?.role === "MANAGER" ? "Training Projects Overview" : "My Training Projects"}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {user?.role === "MANAGER"
                ? "Review pending submissions and monitor project progress"
                : "Manage your SADL training development projects"}
            </p>
          </div>
          {user?.role === "DESIGNER" && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 transition-all"
              style={{
                backgroundColor: "#C9A84C",
                color: "#041534",
                fontFamily: "'IBM Plex Sans', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "11px",
                fontWeight: 700,
                padding: "10px 20px",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b89a3a"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#C9A84C"}
            >
              + New Project
            </button>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-8">

        {/* Pending Approvals — Manager only */}
        {user?.role === "MANAGER" && hasPending && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: "3px", height: "18px", backgroundColor: "#C9A84C", borderRadius: "2px", flexShrink: 0 }} />
              <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 600, fontSize: "15px", color: "#041534" }}>
                Pending Approvals
              </h2>
              <span style={{
                backgroundColor: "rgba(201,168,76,0.12)",
                color: "#C9A84C",
                border: "1px solid rgba(201,168,76,0.3)",
                fontSize: "11px",
                fontWeight: 600,
                padding: "1px 8px",
                borderRadius: "10px"
              }}>
                {pendingAnalyse.length + pendingDesign.length}
              </span>
            </div>
            <div className="space-y-2">
              {pendingAnalyse.map(project => (
                <div
                  key={`analyse-${project.id}`}
                  onClick={() => navigate(`/approvals/analyse/${project.id}`)}
                  className="flex justify-between items-center cursor-pointer transition-all"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e5e1dc",
                    borderLeft: "3px solid #C9A84C",
                    padding: "14px 18px"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(4,21,52,0.07)"; e.currentTarget.style.borderColor = "#d4cfc9" }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e1dc"; e.currentTarget.style.borderLeftColor = "#C9A84C" }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: "32px", height: "32px", backgroundColor: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "#C9A84C",
                      flexShrink: 0
                    }}>A</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "13px", color: "#041534" }}>{project.title}</p>
                      <p style={{ fontSize: "11px", color: "#75777f", marginTop: "2px" }}>
                        {project.user.name} —{" "}
                        <span style={{ color: "#C9A84C", fontWeight: 500 }}>Analyse Phase</span>{" "}
                        awaiting approval
                      </p>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: "rgba(201,168,76,0.07)",
                    color: "#b89a3a",
                    border: "1px solid rgba(201,168,76,0.22)",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    whiteSpace: "nowrap"
                  }}>Review →</span>
                </div>
              ))}

              {pendingDesign.map(project => (
                <div
                  key={`design-${project.id}`}
                  onClick={() => navigate(`/approvals/design/${project.id}`)}
                  className="flex justify-between items-center cursor-pointer transition-all"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e5e1dc",
                    borderLeft: "3px solid #1B2A4A",
                    padding: "14px 18px"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(4,21,52,0.07)"; e.currentTarget.style.borderColor = "#d4cfc9" }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e1dc"; e.currentTarget.style.borderLeftColor = "#1B2A4A" }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: "32px", height: "32px", backgroundColor: "rgba(27,42,74,0.06)",
                      border: "1px solid rgba(27,42,74,0.15)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "#1B2A4A",
                      flexShrink: 0
                    }}>D</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "13px", color: "#041534" }}>{project.title}</p>
                      <p style={{ fontSize: "11px", color: "#75777f", marginTop: "2px" }}>
                        {project.user.name} —{" "}
                        <span style={{ color: "#1B2A4A", fontWeight: 500 }}>Design Phase</span>{" "}
                        awaiting approval
                      </p>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: "rgba(27,42,74,0.05)",
                    color: "#1B2A4A",
                    border: "1px solid rgba(27,42,74,0.18)",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    whiteSpace: "nowrap"
                  }}>Review →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: "3px", height: "18px", backgroundColor: "#546435", borderRadius: "2px", flexShrink: 0 }} />
          <h2 style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 600, fontSize: "15px", color: "#041534" }}>
            {user?.role === "MANAGER" ? "All Projects" : "Projects"}
          </h2>
          {!loading && (
            <span style={{
              backgroundColor: "rgba(84,100,53,0.08)",
              color: "#546435",
              border: "1px solid rgba(84,100,53,0.2)",
              fontSize: "11px",
              fontWeight: 600,
              padding: "1px 8px",
              borderRadius: "10px"
            }}>
              {projects.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full animate-spin mb-3"
              style={{ border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#C9A84C" }} />
            <p style={{ color: "#75777f", fontSize: "13px" }}>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(27,42,74,0.05)", border: "1px solid rgba(27,42,74,0.1)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: "#041534", marginBottom: "6px" }}>No projects yet</p>
            <p style={{ fontSize: "13px", color: "#75777f", marginBottom: "24px" }}>
              Create your first SADL training project to get started
            </p>
            {user?.role === "DESIGNER" && (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: "#C9A84C", color: "#041534",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  fontSize: "11px", fontWeight: 700,
                  padding: "10px 24px", border: "none", cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b89a3a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#C9A84C"}
              >
                + New Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
