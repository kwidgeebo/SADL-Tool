import { useNavigate } from "react-router-dom"

const phaseOrder = ["ANALYSE", "DESIGN", "DEVELOP", "IMPLEMENT", "EVALUATE"]

const phaseConfig = {
  ANALYSE:   { label: "A", full: "Analyse" },
  DESIGN:    { label: "D", full: "Design" },
  DEVELOP:   { label: "Dv", full: "Develop" },
  IMPLEMENT: { label: "I", full: "Implement" },
  EVALUATE:  { label: "E", full: "Evaluate" },
}

const statusConfig = {
  DRAFT:     { bg: "rgba(117,119,127,0.08)", color: "#75777f", border: "rgba(117,119,127,0.2)", dot: "#aaa" },
  SUBMITTED: { bg: "rgba(201,168,76,0.08)",  color: "#b89a3a", border: "rgba(201,168,76,0.25)", dot: "#C9A84C" },
  APPROVED:  { bg: "rgba(84,100,53,0.08)",   color: "#546435", border: "rgba(84,100,53,0.2)",  dot: "#546435" },
  REJECTED:  { bg: "rgba(186,26,26,0.06)",   color: "#ba1a1a", border: "rgba(186,26,26,0.15)", dot: "#ba1a1a" },
}

const projectStatusConfig = {
  ACTIVE:    { bg: "rgba(84,100,53,0.08)",  color: "#546435", border: "rgba(84,100,53,0.2)" },
  COMPLETED: { bg: "rgba(27,42,74,0.06)",   color: "#1B2A4A", border: "rgba(27,42,74,0.15)" },
  ARCHIVED:  { bg: "rgba(117,119,127,0.08)", color: "#75777f", border: "rgba(117,119,127,0.2)" },
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const psc = projectStatusConfig[project.status] || projectStatusConfig.ACTIVE

  // Find furthest active phase
  const activePhase = [...phaseOrder].reverse().find(phase => {
    const phaseData = project.phases?.find(p => p.type === phase)
    return phaseData && phaseData.status !== "DRAFT"
  }) || "ANALYSE"

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="cursor-pointer transition-all group"
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e1dc",
        padding: "20px",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(4,21,52,0.08)"
        e.currentTarget.style.borderColor = "#d4cfc9"
        e.currentTarget.style.transform = "translateY(-1px)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none"
        e.currentTarget.style.borderColor = "#e5e1dc"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "#041534",
            fontFamily: "'Public Sans', sans-serif",
            lineHeight: 1.3,
            marginBottom: "4px"
          }}>
            {project.title}
          </h3>
          {project.description && (
            <p style={{
              fontSize: "12px",
              color: "#75777f",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>
              {project.description}
            </p>
          )}
        </div>
        <span style={{
          backgroundColor: psc.bg,
          color: psc.color,
          border: `1px solid ${psc.border}`,
          fontFamily: "'IBM Plex Sans', sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "9px",
          fontWeight: 700,
          padding: "3px 8px",
          flexShrink: 0,
          whiteSpace: "nowrap"
        }}>
          {project.status}
        </span>
      </div>

      {/* ADDIE Phase Pipeline */}
      <div className="flex gap-1.5 mb-4">
        {phaseOrder.map((phase) => {
          const phaseData = project.phases?.find(p => p.type === phase)
          const status = phaseData?.status || "DRAFT"
          const sc = statusConfig[status]
          const cfg = phaseConfig[phase]
          const isActive = phase === activePhase

          return (
            <div key={phase} className="flex-1 flex flex-col items-center gap-1">
              <div style={{
                width: "100%",
                paddingTop: "7px",
                paddingBottom: "7px",
                backgroundColor: isActive ? "#041534" : sc.bg,
                border: `1px solid ${isActive ? "#041534" : sc.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                {status !== "DRAFT" && (
                  <div style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: sc.dot
                  }} />
                )}
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: isActive ? "white" : sc.color,
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: "0.02em"
                }}>
                  {cfg.label}
                </span>
              </div>
              <span style={{
                fontSize: "9px",
                color: isActive ? "#041534" : "#aaa",
                fontWeight: isActive ? 600 : 400,
                textAlign: "center",
                lineHeight: 1,
                fontFamily: isActive ? "'IBM Plex Sans', sans-serif" : "inherit"
              }}>
                {cfg.full}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3" style={{ borderTop: "1px solid #f0ece8" }}>
        <span style={{ fontSize: "11px", color: "#aaa" }}>
          {new Date(project.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span style={{
          fontSize: "10px",
          color: "#C9A84C",
          fontFamily: "'IBM Plex Sans', sans-serif",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
          opacity: 0.7
        }}>
          Open →
        </span>
      </div>
    </div>
  )
}
