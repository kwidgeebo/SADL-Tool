import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", rank: "", unit: "", email: "", message: "" })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setFormSubmitted(true)
    setFormSubmitting(false)
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fbf8fc", color: "#1b1b1e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&family=IBM+Plex+Sans:wght@600&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .lp-btn-gold { background-color:#C9A84C;color:#041534;font-family:'IBM Plex Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:12px 28px;border:none;cursor:pointer;transition:background-color 0.2s,transform 0.1s;display:inline-block;text-decoration:none; }
        .lp-btn-gold:hover { background-color:#b89a3a; }
        .lp-btn-gold:active { transform:scale(0.97); }
        .lp-btn-outline { background:transparent;color:white;font-family:'IBM Plex Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:12px 28px;border:2px solid rgba(255,255,255,0.6);cursor:pointer;transition:background-color 0.2s,border-color 0.2s;display:inline-block;text-decoration:none; }
        .lp-btn-outline:hover { background-color:rgba(255,255,255,0.08);border-color:white; }
        .lp-nav-link { color:#45464e;font-size:14px;font-weight:500;text-decoration:none;transition:color 0.2s; }
        .lp-nav-link:hover { color:#041534; }
        .lp-feature-card { background:white;border:1px solid #e4e2e5;padding:32px;transition:box-shadow 0.2s,transform 0.2s; }
        .lp-feature-card:hover { box-shadow:0 16px 32px -12px rgba(4,21,52,0.1);transform:translateY(-2px); }
        .lp-form-input { background:white;border:1px solid #c5c6cf;padding:10px 14px;font-size:14px;font-family:'Inter',sans-serif;width:100%;outline:none;transition:border-color 0.2s;border-radius:2px; }
        .lp-form-input:focus { border-color:#C9A84C;box-shadow:0 0 0 2px rgba(201,168,76,0.15); }
        .lp-form-label { font-family:'IBM Plex Sans',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#45464e;display:block;margin-bottom:6px; }
        @media(max-width:768px){.lp-hide-mobile{display:none!important}.lp-grid-2{grid-template-columns:1fr!important}.lp-grid-3{grid-template-columns:1fr!important}.lp-hero-btns{flex-direction:column!important}.lp-hero-stats{grid-template-columns:1fr!important}.lp-footer-inner{flex-direction:column!important;align-items:flex-start!important}}
      `}</style>

      {/* Nav */}
      <header style={{backgroundColor:"#fbf8fc",borderBottom:"1px solid #e4e2e5",position:"sticky",top:0,zIndex:50}}>
        <nav style={{maxWidth:"1200px",margin:"0 auto",padding:"0 24px",height:"64px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"22px",color:"#041534"}}>SADL-Up</span>
          <div className="lp-hide-mobile" style={{display:"flex",gap:"36px"}}>
            {[["#features","Features"],["#how-it-works","How It Works"],["#who-its-for","Who It's For"],["#pricing","Pricing"],["#contact","Contact"]].map(([href,label])=>(
              <a key={href} href={href} className="lp-nav-link">{label}</a>
            ))}
          </div>
          <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
            <button onClick={()=>navigate("/login")} style={{padding:"8px 20px",border:"1px solid #c5c6cf",background:"white",color:"#041534",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#041534"} onMouseLeave={e=>e.currentTarget.style.borderColor="#c5c6cf"}>
              Log In
            </button>
            <a href="#contact" className="lp-btn-gold" style={{padding:"8px 20px"}}>Request Demo</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section style={{backgroundColor:"#041534",padding:"100px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{maxWidth:"760px"}}>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"16px"}}>ADF Training Development Platform</p>
            <h1 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"clamp(36px,5vw,52px)",fontWeight:700,lineHeight:1.15,letterSpacing:"-0.02em",color:"white",marginBottom:"24px"}}>Structured. Auditable.<br/>Defence-Ready.</h1>
            <p style={{fontSize:"18px",lineHeight:1.65,color:"rgba(255,255,255,0.6)",marginBottom:"40px",maxWidth:"600px"}}>SADL-Up digitises the ADF's Systems Approach to Defence Learning — guiding training analysts and developers through every phase with precision and compliance built in.</p>
            <div className="lp-hero-btns" style={{display:"flex",gap:"16px",alignItems:"center",marginBottom:"60px"}}>
              <a href="#contact" className="lp-btn-gold">Request a Demo</a>
              <button onClick={()=>navigate("/login")} className="lp-btn-outline">Log In</button>
            </div>
            <div className="lp-hero-stats" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px",paddingTop:"40px",borderTop:"1px solid rgba(201,168,76,0.2)"}}>
              {[["✓","6 Analyse Stages Covered"],["✓","Full Design Phase Output"],["✓","Built for Joint ADF Operations"]].map(([icon,text])=>(
                <div key={text} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{color:"#C9A84C",fontWeight:700}}>{icon}</span>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"11px",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"absolute",right:0,top:0,width:"40%",height:"100%",background:"radial-gradient(ellipse at right center,rgba(201,168,76,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
      </section>

      {/* How It Works + Video */}
      <section style={{backgroundColor:"#0a1e3d",padding:"80px 24px"}} id="how-it-works">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"48px"}}>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"12px"}}>See It In Action</p>
            <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"32px",fontWeight:700,color:"white",lineHeight:1.3}}>The Compliant Workflow.</h2>
          </div>
          {/* Video slot — replace inner div with <iframe> or <video> when ready */}
          <div style={{maxWidth:"860px",margin:"0 auto 60px",aspectRatio:"16/9",backgroundColor:"rgba(27,42,74,0.6)",border:"1px solid rgba(201,168,76,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:"72px",height:"72px",backgroundColor:"#C9A84C",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",cursor:"pointer"}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#041534"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#C9A84C"}}>Watch: How SADL-Up works in 90 seconds</p>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.35)",marginTop:"8px"}}>Explainer video coming soon</p>
            </div>
          </div>
          <div className="lp-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"32px"}}>
            {[
              {num:"1",title:"Analyse",desc:"Input job, task, and target population data through structured digital interviews.",output:"A complete, validated Analyse Phase record"},
              {num:"2",title:"Design",desc:"Build your learning solution using automated linking between tasks and objectives.",output:"A linked Learning Management Package"},
              {num:"3",title:"Develop",desc:"Generate Copilot-ready prompts for all training materials formatted for ADF standards.",output:"A submission-ready document package"},
            ].map(s=>(
              <div key={s.num} style={{textAlign:"center"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"50%",border:"2px solid #C9A84C",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"16px",color:"white"}}>{s.num}</div>
                <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"white",marginBottom:"10px"}}>{s.title}</h3>
                <p style={{fontSize:"14px",color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:"12px"}}>{s.desc}</p>
                <p style={{fontStyle:"italic",fontSize:"13px",color:"#C9A84C"}}>{s.output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case for Change */}
      <section style={{padding:"80px 24px",backgroundColor:"white"}} id="case-for-change">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{marginBottom:"48px"}}>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#546435",marginBottom:"12px"}}>Case for Change</p>
            <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"32px",fontWeight:700,color:"#041534",lineHeight:1.3,maxWidth:"600px"}}>SADL is rigorous. Manual compliance shouldn't be.</h2>
          </div>
          <div className="lp-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"start"}}>
            <div>
              <p style={{fontSize:"15px",color:"#45464e",lineHeight:1.7,marginBottom:"20px"}}>Legacy training management relies on fragmented Word documents and disconnected spreadsheets. This creates version control chaos where critical TRS outputs become inconsistent with the original Analyse phase intent.</p>
              <p style={{fontSize:"15px",color:"#45464e",lineHeight:1.7,marginBottom:"24px"}}>Approval chains managed via email lead to lost audit trails and validation bottlenecks that stall operational readiness. SADL-Up provides a single source of truth for the entire training lifecycle.</p>
              <div style={{padding:"16px 20px",backgroundColor:"#f5f3f0",borderLeft:"3px solid #041534"}}>
                <p style={{fontStyle:"italic",color:"#041534",fontSize:"15px",lineHeight:1.6}}>"SADL-Up solves all of this — in one place."</p>
              </div>
            </div>
            <div style={{backgroundColor:"#f5f3f0",border:"1px solid #e4e2e5",padding:"32px"}}>
              <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"18px",color:"#041534",marginBottom:"20px"}}>Current Friction Points</h3>
              {["Fractured Word Documents","No Version Control","Lost Audit Trails","Inconsistent TRS Outputs","Email-Based Approvals","Validation Bottlenecks"].map(p=>(
                <div key={p} style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
                  <div style={{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"rgba(186,26,26,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#ba1a1a",fontSize:"12px",fontWeight:700}}>✕</span>
                  </div>
                  <span style={{fontSize:"14px",fontWeight:500,color:"#1b1b1e"}}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{padding:"80px 24px",backgroundColor:"#f5f3f0"}} id="features">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"56px"}}>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#546435",marginBottom:"12px"}}>Engineered for Precision</p>
            <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"32px",fontWeight:700,color:"#041534",lineHeight:1.3}}>A complete SADL workflow — from first analysis to final document.</h2>
          </div>
          <div className="lp-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
            {[
              {icon:"📊",title:"Guided Analyse Phase",desc:"Step-by-step digital guidance through all six Analyse stages, ensuring no data point is missed and every requirement is validated against operational needs."},
              {icon:"🏗️",title:"Structured Design Phase",desc:"Build your Learning Management Plan using integrated templates that auto-populate from your Analyse data. LOs, modules, assessments and evaluation — all connected."},
              {icon:"✅",title:"Manager Approval Workflow",desc:"Integrated phase gates with robust review tools. Managers can review, annotate and sign off digitally with full timestamped accountability."},
              {icon:"📝",title:"Copilot-Ready Development Prompts",desc:"Generate ADF-formatted Copilot prompts for lesson plans, instructor guides, workbooks, assessment tools and presentation slides — pre-populated from your LMP."},
            ].map(f=>(
              <div key={f.title} className="lp-feature-card">
                <div style={{width:"44px",height:"44px",backgroundColor:"rgba(4,21,52,0.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",marginBottom:"16px"}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"18px",color:"#041534",marginBottom:"10px"}}>{f.title}</h3>
                <p style={{fontSize:"14px",color:"#45464e",lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section style={{padding:"80px 24px",backgroundColor:"white"}} id="who-its-for">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"56px"}}>
            <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"32px",fontWeight:700,color:"#041534",lineHeight:1.3}}>Built for every role in the training pipeline.</h2>
          </div>
          <div className="lp-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}}>
            {[
              {icon:"👥",title:"Training Analysts & Developers",desc:"Focus on high-quality training outcomes without getting bogged down in formatting. SADL-Up ensures workflow consistency across the entire team.",features:["Guided stage-by-stage workflow","Auto-linked outputs","Copilot prompt generation"]},
              {icon:"📈",title:"Training Managers",desc:"Get real-time visibility into project status. Approve phase gates and provide feedback directly within the system — no more email chains.",features:["Real-time project dashboards","Phase gate sign-off","Annotate and comment"]},
              {icon:"🛡️",title:"Commanding Officers",desc:"Ensure total compliance and auditability for sensitive training assets. Access complete version history and approval logs at a glance.",features:["High-level oversight","Audit trail visibility","One-click compliance sign-off"]},
            ].map(c=>(
              <div key={c.title} style={{backgroundColor:"white",border:"1px solid #e4e2e5",padding:"28px",display:"flex",flexDirection:"column"}}>
                <div style={{fontSize:"32px",marginBottom:"16px"}}>{c.icon}</div>
                <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"17px",color:"#041534",marginBottom:"10px",lineHeight:1.3}}>{c.title}</h3>
                <p style={{fontSize:"13px",color:"#45464e",lineHeight:1.65,marginBottom:"20px"}}>{c.desc}</p>
                <ul style={{marginTop:"auto",listStyle:"none",padding:0}}>
                  {c.features.map(f=>(
                    <li key={f} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",fontSize:"13px",color:"#1b1b1e"}}>
                      <span style={{color:"#546435",fontWeight:700}}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{padding:"80px 24px",backgroundColor:"#f5f3f0"}} id="pricing">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"56px"}}>
            <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"32px",fontWeight:700,color:"#041534",lineHeight:1.3}}>Scalable Deployment.</h2>
            <p style={{fontSize:"15px",color:"#45464e",marginTop:"12px"}}>Choose the package that fits your unit's training volume.</p>
          </div>
          <div className="lp-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px",alignItems:"stretch"}}>
            <div style={{backgroundColor:"white",border:"1px solid #e4e2e5",padding:"28px",display:"flex",flexDirection:"column"}}>
              <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"#041534",marginBottom:"4px"}}>Free Trial</h3>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",color:"#75777f",marginBottom:"20px"}}>Proof of Concept</p>
              <div style={{fontSize:"32px",fontWeight:700,color:"#041534",marginBottom:"24px",fontFamily:"'Public Sans',sans-serif"}}>$0 <span style={{fontSize:"14px",fontWeight:400,color:"#75777f"}}>/ 30 days</span></div>
              <ul style={{listStyle:"none",padding:0,marginBottom:"28px",flexGrow:1}}>
                {["1 active project","Full Analyse phase tools","Basic document export"].map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontSize:"13px"}}><span style={{color:"#546435"}}>✓</span>{f}</li>
                ))}
                {["Approval workflow","Manager dashboards"].map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontSize:"13px",opacity:0.4}}><span>—</span>{f}</li>
                ))}
              </ul>
              <button onClick={()=>navigate("/login")} style={{width:"100%",padding:"11px",border:"1px solid #041534",background:"white",color:"#041534",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#041534";e.currentTarget.style.color="white"}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="#041534"}}>
                Start Trial
              </button>
            </div>
            <div style={{backgroundColor:"#041534",border:"1px solid #041534",padding:"28px",display:"flex",flexDirection:"column",position:"relative",transform:"scale(1.03)",boxShadow:"0 20px 40px rgba(4,21,52,0.2)"}}>
              <div style={{position:"absolute",top:0,right:"24px",transform:"translateY(-50%)",backgroundColor:"#C9A84C",color:"#041534",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 10px"}}>Most Popular</div>
              <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"white",marginBottom:"4px"}}>Professional</h3>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:"20px"}}>Unit-Level</p>
              <div style={{fontSize:"32px",fontWeight:700,color:"white",marginBottom:"24px",fontFamily:"'Public Sans',sans-serif"}}>Contact <span style={{fontSize:"14px",fontWeight:400,color:"rgba(255,255,255,0.5)"}}>for pricing</span></div>
              <ul style={{listStyle:"none",padding:0,marginBottom:"28px",flexGrow:1}}>
                {["Unlimited projects","All ADF document formats","Manager approval workflow","Priority support","TRS / LDS / LMP export"].map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontSize:"13px",color:"rgba(255,255,255,0.8)"}}><span style={{color:"#C9A84C"}}>✓</span>{f}</li>
                ))}
              </ul>
              <a href="#contact" className="lp-btn-gold" style={{textAlign:"center",display:"block"}}>Request a Demo</a>
            </div>
            <div style={{backgroundColor:"white",border:"1px solid #e4e2e5",padding:"28px",display:"flex",flexDirection:"column"}}>
              <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"#041534",marginBottom:"4px"}}>Enterprise</h3>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",letterSpacing:"0.08em",textTransform:"uppercase",color:"#75777f",marginBottom:"20px"}}>Formation & Command</p>
              <div style={{fontSize:"32px",fontWeight:700,color:"#041534",marginBottom:"24px",fontFamily:"'Public Sans',sans-serif"}}>Custom <span style={{fontSize:"14px",fontWeight:400,color:"#75777f"}}>pricing</span></div>
              <ul style={{listStyle:"none",padding:0,marginBottom:"28px",flexGrow:1}}>
                {["On-premise deployment option","SSO & high-side integrations","Custom document logic","Dedicated support","24/7 priority response"].map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",fontSize:"13px"}}><span style={{color:"#546435"}}>✓</span>{f}</li>
                ))}
              </ul>
              <a href="#contact" style={{display:"block",textAlign:"center",padding:"11px",border:"1px solid #041534",background:"white",color:"#041534",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",textDecoration:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#041534";e.currentTarget.style.color="white"}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="#041534"}}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{padding:"80px 24px",backgroundColor:"#041534"}} id="contact">
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div className="lp-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"64px",alignItems:"start"}}>
            <div>
              <h2 style={{fontFamily:"'Public Sans',sans-serif",fontSize:"clamp(28px,4vw,42px)",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:"20px"}}>Ready to modernise your training workflow?</h2>
              <p style={{fontSize:"16px",color:"rgba(255,255,255,0.55)",lineHeight:1.7,marginBottom:"36px"}}>SADL-Up is designed to meet the rigorous standards of the Australian Defence Force. Our team can provide tailored walkthroughs based on your unit's specific needs.</p>
              {[["🛡️","Sovereign Australian Capability"],["🔒","Data handling compliant with Defence standards"],["⭐","Built for Army, Navy, and Air Force — joint by design"]].map(([icon,text])=>(
                <div key={text} style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px"}}>
                  <span style={{fontSize:"18px"}}>{icon}</span>
                  <p style={{fontSize:"14px",color:"rgba(255,255,255,0.65)",lineHeight:1.5}}>{text}</p>
                </div>
              ))}
            </div>
            <div style={{backgroundColor:"white",padding:"36px"}}>
              {formSubmitted ? (
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{fontSize:"48px",marginBottom:"16px"}}>✓</div>
                  <h3 style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"#041534",marginBottom:"10px"}}>Message Received</h3>
                  <p style={{fontSize:"14px",color:"#45464e",lineHeight:1.6}}>Thanks for reaching out. We'll be in touch within 1–2 business days.</p>
                </div>
              ):(
                <form onSubmit={handleFormSubmit}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
                    <div><label className="lp-form-label">Name</label><input className="lp-form-input" name="name" value={formData.name} onChange={handleFormChange} placeholder="Full name" required/></div>
                    <div><label className="lp-form-label">Rank / Role</label><input className="lp-form-input" name="rank" value={formData.rank} onChange={handleFormChange} placeholder="e.g. SQNLDR / Analyst"/></div>
                  </div>
                  <div style={{marginBottom:"16px"}}><label className="lp-form-label">Unit / Organisation</label><input className="lp-form-input" name="unit" value={formData.unit} onChange={handleFormChange} placeholder="e.g. HQ JOC, RAAF Williamtown"/></div>
                  <div style={{marginBottom:"16px"}}><label className="lp-form-label">Email</label><input className="lp-form-input" type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="you@defence.gov.au" required/></div>
                  <div style={{marginBottom:"24px"}}><label className="lp-form-label">Message (optional)</label><textarea className="lp-form-input" name="message" value={formData.message} onChange={handleFormChange} rows={4} placeholder="Tell us about your unit's training needs..." style={{resize:"vertical"}}/></div>
                  <button type="submit" disabled={formSubmitting} style={{width:"100%",padding:"13px",backgroundColor:formSubmitting?"#b89a3a":"#C9A84C",color:"#041534",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",border:"none",cursor:formSubmitting?"default":"pointer"}}>
                    {formSubmitting?"Sending...":"Request a Demo"}
                  </button>
                  <p style={{fontSize:"11px",color:"#75777f",textAlign:"center",marginTop:"12px",lineHeight:1.5}}>All enquiries handled securely. Information used solely for demonstrating SADL-Up capabilities.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor:"#041534",borderTop:"1px solid rgba(201,168,76,0.15)",padding:"32px 24px"}}>
        <div className="lp-footer-inner" style={{maxWidth:"1200px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
          <div>
            <span style={{fontFamily:"'Public Sans',sans-serif",fontWeight:700,fontSize:"20px",color:"#C9A84C"}}>SADL-Up</span>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"4px"}}>Built for the ADF. Designed for compliance. © 2026 SADL-Up.</p>
          </div>
          <div style={{display:"flex",gap:"24px",flexWrap:"wrap",alignItems:"center"}}>
            {["Privacy Policy","Terms of Service","Security Compliance","Support"].map(link=>(
              <a key={link} href="#" style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",textDecoration:"none"}}
                onMouseEnter={e=>e.target.style.color="#C9A84C"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>
                {link}
              </a>
            ))}
            <button onClick={()=>navigate("/login")} style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"#C9A84C",background:"none",border:"none",cursor:"pointer"}}>
              Log In →
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
