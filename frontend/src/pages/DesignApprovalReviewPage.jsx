import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const DELIVERY_LABELS = { INSTRUCTOR_LED:"Instructor Led",SELF_PACED:"Self Paced",BLENDED:"Blended",ON_JOB:"On Job",SIMULATION:"Simulation",E_LEARNING:"eLearning",OTHER:"Other" }
const TRAINING_LEVEL_LABELS = { LEVEL_1:"Level 1 — Awareness",LEVEL_2:"Level 2 — Supervised Performance",LEVEL_3:"Level 3 — Unsupervised Performance",LEVEL_4:"Level 4 — Instructional Ability" }
const KIRKPATRICK_LABELS = { LEVEL_1_REACTION:"Level 1 — Reaction",LEVEL_2_LEARNING:"Level 2 — Learning",LEVEL_3_BEHAVIOUR:"Level 3 — Behaviour",LEVEL_4_RESULTS:"Level 4 — Results" }
const ASSESSMENT_LABELS = { OBSERVATION:"Observation",WRITTEN_TEST:"Written Test",PRACTICAL_EXERCISE:"Practical Exercise",PORTFOLIO:"Portfolio",ORAL_QUESTIONING:"Oral Questioning",SIMULATION_EXERCISE:"Simulation Exercise",OTHER:"Other" }

function ReviewSection({ title, children }) {
  return (
    <div style={{ backgroundColor:"white",border:"1px solid #e5e1dc",borderLeft:"3px solid #1B2A4A",padding:"24px",marginBottom:"12px" }}>
      <h3 style={{ fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"14px",color:"#041534",marginBottom:"16px",paddingBottom:"10px",borderBottom:"1px solid #f0ece8" }}>{title}</h3>
      <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>{children}</div>
    </div>
  )
}

function ReviewField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#75777f",marginBottom:"3px" }}>{label}</p>
      <p style={{ fontSize:"13px",color:"#1b1b1e",lineHeight:1.6,whiteSpace:"pre-wrap" }}>{value}</p>
    </div>
  )
}

function ReviewTable({ headers, rows }) {
  if (!rows || rows.length === 0) return null
  return (
    <div style={{ overflowX:"auto",marginTop:"8px" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"12px" }}>
        <thead>
          <tr style={{ backgroundColor:"#041534" }}>
            {headers.map(h => <th key={h} style={{ border:"1px solid #1B2A4A",padding:"8px 12px",textAlign:"left",fontSize:"10px",fontWeight:700,color:"white",fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={i} style={{ backgroundColor:i%2===0?"white":"#f5f3f0" }}>
              {row.map((cell,j) => <td key={j} style={{ border:"1px solid #e5e1dc",padding:"8px 12px",color:"#1b1b1e",verticalAlign:"top" }}>{cell||"—"}</td>)}
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
  const [decision, setDecision] = useState(null)

  useEffect(() => { fetchReview() }, [projectId]) // eslint-disable-line

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/approvals/design/${projectId}`, { headers:{ Authorization:`Bearer ${token}` } })
      setData(res.data)
    } catch (err) { console.error("Failed to fetch review:", err) } finally { setLoading(false) }
  }

  const handleApprove = async () => {
    setSubmitting(true); setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/approvals/design/${projectId}/approve`, { comments }, { headers:{ Authorization:`Bearer ${token}` } })
      setDecision("approved"); setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) { setError(err.response?.data?.message || "Failed to approve") } finally { setSubmitting(false) }
  }

  const handleReject = async () => {
    if (!comments.trim()) { setError("Please provide comments explaining why this is being rejected."); return }
    setSubmitting(true); setError("")
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(`${API_URL}/api/approvals/design/${projectId}/reject`, { comments }, { headers:{ Authorization:`Bearer ${token}` } })
      setDecision("rejected"); setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) { setError(err.response?.data?.message || "Failed to reject") } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div style={{ minHeight:"100vh",backgroundColor:"#f4f2ee",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:"32px",height:"32px",border:"2px solid rgba(201,168,76,0.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }}/>
          <p style={{ fontSize:"13px",color:"#75777f" }}>Loading review...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
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
    <div style={{ minHeight:"100vh",backgroundColor:"#f4f2ee",fontFamily:"'Inter',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&display=swap');`}</style>

      <header style={{ backgroundColor:"#041534",borderBottom:"1px solid rgba(201,168,76,0.2)" }}>
        <nav style={{ maxWidth:"1100px",margin:"0 auto",padding:"0 24px",height:"64px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
            <button onClick={()=>navigate("/dashboard")} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
              ← Dashboard
            </button>
            <span style={{ color:"rgba(201,168,76,0.25)" }}>|</span>
            <span style={{ fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"15px",color:"white" }}>Design Phase Review — Draft LMP</span>
          </div>
          <span style={{ backgroundColor:"rgba(201,168,76,0.12)",color:"#C9A84C",border:"1px solid rgba(201,168,76,0.25)",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 12px" }}>
            Awaiting Approval
          </span>
        </nav>
      </header>

      <div style={{ backgroundColor:"#0a1e3d",borderBottom:"1px solid rgba(201,168,76,0.12)",padding:"20px 24px" }}>
        <div style={{ maxWidth:"1100px",margin:"0 auto" }}>
          <p style={{ fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"4px" }}>Draft LMP Submission</p>
          <h1 style={{ fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"white",marginBottom:"4px" }}>{project?.title}</h1>
          <p style={{ fontSize:"12px",color:"rgba(255,255,255,0.45)" }}>Submitted by {project?.user?.name} ({project?.user?.email})</p>
        </div>
      </div>

      <main style={{ maxWidth:"1100px",margin:"0 auto",padding:"32px 24px" }}>

        {des1 && (
          <ReviewSection title="Des1 — Input Analysis">
            <ReviewField label="Training Authority" value={des1.trainingAuthority}/>
            <ReviewField label="Project Sponsor" value={des1.projectSponsor}/>
            <ReviewField label="Stakeholders" value={des1.stakeholders}/>
            <ReviewField label="SME Panel" value={des1.smePanel}/>
            <ReviewField label="Scope Notes" value={des1.scopeNotes}/>
            <ReviewField label="Steps Omitted" value={des1.phasesOmitted}/>
            <ReviewField label="Rationale for Omissions" value={des1.rationaleOmissions}/>
            <ReviewField label="Risk Notes" value={des1.riskNotes}/>
            <ReviewField label="Overall Risk Rating" value={des1.overallRiskRating}/>
            <ReviewField label="Mitigation Actions" value={des1.mitigationActions}/>
          </ReviewSection>
        )}

        {des2 && (
          <ReviewSection title="Des2 — Environments Analysis">
            <ReviewField label="Facility" value={des2.facilityDescription}/>
            <ReviewField label="Location" value={des2.facilityLocation}/>
            <ReviewField label="Activity Spaces" value={des2.activitySpaces}/>
            <ReviewField label="Equipment Available" value={des2.equipmentAvailable}/>
            <ReviewField label="Instructor Availability" value={des2.instructorAvailability}/>
            <ReviewField label="Budget Available" value={des2.budgetAvailable}/>
            <ReviewField label="WHS Requirements" value={des2.whsRequirements}/>
            <ReviewField label="Security Requirements" value={des2.securityRequirements}/>
          </ReviewSection>
        )}

        {los.length > 0 && (
          <ReviewSection title="Des3 — Learning Outcomes">
            <ReviewTable headers={["LO","Name","Training Level","Delivery Method"]} rows={los.map(lo=>[`LO ${lo.sequence}`,lo.loName||"—",TRAINING_LEVEL_LABELS[lo.trainingLevel]||lo.trainingLevel,DELIVERY_LABELS[lo.deliveryMethod]||lo.deliveryMethod])}/>
            {los.map((lo,i)=>(
              <div key={i} style={{ backgroundColor:"#f5f3f0",border:"1px solid #e5e1dc",padding:"16px",marginTop:"8px" }}>
                <p style={{ fontSize:"13px",fontWeight:600,color:"#041534",marginBottom:"10px" }}>LO {lo.sequence} — {lo.loName}</p>
                <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
                  <ReviewField label="Performance Statement" value={lo.performanceStatement}/>
                  <ReviewField label="Performance Conditions" value={lo.performanceConditions}/>
                  <ReviewField label="Performance Standard" value={lo.performanceStandard}/>
                  <ReviewField label="Assessment Criteria" value={lo.assessmentCriteria}/>
                  <ReviewField label="Content Summary" value={lo.contentSummary}/>
                </div>
              </div>
            ))}
          </ReviewSection>
        )}

        {des4 && (
          <ReviewSection title="Des4 — Course Structure">
            <ReviewField label="Course Aim" value={des4.courseAim}/>
            <ReviewField label="Course Description" value={des4.courseDescription}/>
            <ReviewField label="Course Type" value={des4.courseType}/>
            <ReviewField label="Course Level" value={des4.courseLevel}/>
            <ReviewField label="Min / Max Students" value={des4.minStudents&&des4.maxStudents?`${des4.minStudents} – ${des4.maxStudents}`:null}/>
            <ReviewField label="Total Days" value={des4.totalDays?String(des4.totalDays):null}/>
            <ReviewField label="Security Clearance" value={des4.securityClearance}/>
            <ReviewField label="Formative Strategy" value={des4.formativeStrategy}/>
            <ReviewField label="Summative Strategy" value={des4.summativeStrategy}/>
            {modules.length>0&&(
              <div style={{ marginTop:"8px" }}>
                <p style={{ fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#75777f",marginBottom:"8px" }}>Modules</p>
                {modules.map((mod,i)=>(
                  <div key={i} style={{ backgroundColor:"#f5f3f0",border:"1px solid #e5e1dc",padding:"14px 16px",marginBottom:"8px" }}>
                    <p style={{ fontSize:"13px",fontWeight:600,color:"#041534",marginBottom:"8px" }}>Module {mod.sequence} — {mod.moduleName}</p>
                    <ReviewField label="Content" value={mod.moduleContent}/>
                    <ReviewField label="Delivery Method" value={DELIVERY_LABELS[mod.deliveryMethod]}/>
                    <ReviewField label="Duration (Off Job)" value={mod.durationOffJobDays?`${mod.durationOffJobDays} days`:null}/>
                    {(mod.summativeAssessments||[]).length>0&&<ReviewTable headers={["SA ID","Name","Method","LO Assessed"]} rows={mod.summativeAssessments.map(sa=>[sa.saId,sa.saName,ASSESSMENT_LABELS[sa.method]||sa.method,sa.loAssessed])}/>}
                  </div>
                ))}
              </div>
            )}
            {evalPlan.filter(ep=>ep.planDescription).length>0&&(
              <div style={{ marginTop:"8px" }}>
                <p style={{ fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#75777f",marginBottom:"8px" }}>Evaluation Plan</p>
                <ReviewTable headers={["Level","Approach","Timing","Responsibility"]} rows={evalPlan.filter(ep=>ep.planDescription).map(ep=>[KIRKPATRICK_LABELS[ep.kirkpatrickLevel]||ep.kirkpatrickLevel,ep.planDescription,ep.timing,ep.responsibility])}/>
              </div>
            )}
          </ReviewSection>
        )}

        {/* Approval Decision */}
        <div style={{ backgroundColor:"white",border:"1px solid #e5e1dc",borderTop:"3px solid #041534",padding:"28px",marginTop:"8px" }}>
          <h3 style={{ fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"16px",color:"#041534",marginBottom:"20px" }}>Approval Decision</h3>

          {decision&&(
            <div style={{ backgroundColor:decision==="approved"?"rgba(84,100,53,0.08)":"rgba(186,26,26,0.06)",border:`1px solid ${decision==="approved"?"rgba(84,100,53,0.2)":"rgba(186,26,26,0.15)"}`,padding:"12px 16px",marginBottom:"16px" }}>
              <p style={{ fontSize:"13px",color:decision==="approved"?"#546435":"#ba1a1a",fontWeight:600 }}>
                {decision==="approved"?"✓ Approved — redirecting to dashboard...":"✕ Rejected — redirecting to dashboard..."}
              </p>
            </div>
          )}

          {error&&(
            <div style={{ backgroundColor:"rgba(186,26,26,0.06)",border:"1px solid rgba(186,26,26,0.15)",borderLeft:"3px solid #ba1a1a",padding:"10px 14px",marginBottom:"16px" }}>
              <p style={{ fontSize:"13px",color:"#ba1a1a" }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom:"20px" }}>
            <label style={{ fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#45464e",display:"block",marginBottom:"6px" }}>
              Comments <span style={{ color:"#ba1a1a" }}>(required for rejection)</span>
            </label>
            <textarea value={comments} onChange={e=>setComments(e.target.value)} rows={4} placeholder="Add any comments, feedback or reasons for your decision..."
              style={{ width:"100%",border:"1px solid #c5c6cf",padding:"10px 14px",fontSize:"14px",fontFamily:"'Inter',sans-serif",outline:"none",borderRadius:"2px",resize:"vertical" }}
              onFocus={e=>{e.target.style.borderColor="#C9A84C";e.target.style.boxShadow="0 0 0 2px rgba(201,168,76,0.15)"}}
              onBlur={e=>{e.target.style.borderColor="#c5c6cf";e.target.style.boxShadow="none"}}
            />
          </div>

          <div style={{ display:"flex",gap:"12px",justifyContent:"flex-end" }}>
            <button onClick={handleReject} disabled={submitting||!!decision} style={{ padding:"10px 24px",border:"2px solid rgba(186,26,26,0.4)",background:"white",color:"#ba1a1a",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:submitting||decision?"default":"pointer",opacity:submitting||decision?0.5:1 }}>
              {submitting?"Processing...":"✕ Reject"}
            </button>
            <button onClick={handleApprove} disabled={submitting||!!decision} style={{ padding:"10px 24px",backgroundColor:submitting||decision?"#b89a3a":"#C9A84C",color:"#041534",border:"none",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:submitting||decision?"default":"pointer" }}>
              {submitting?"Processing...":"✓ Approve"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
