import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import A1InputAnalysis from "../components/analyse/A1InputAnalysis"
import A2JobTaskProfile from "../components/analyse/A2JobTaskProfile"
import A2TargetPopulation from "../components/analyse/A2TargetPopulation"
import A2GapAnalysis from "../components/analyse/A2GapAnalysis"
import A3FeasibilityReport from "../components/analyse/A3FeasibilityReport"
import A4AnalyseOutput from "../components/analyse/A4AnalyseOutput"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const steps = [
  { key: "A1", label: "A1 — Input Analysis", description: "Triggers, scope and risk" },
  { key: "A2_JTP", label: "A2 — Job Task Profile", description: "Tasks, conditions and standards" },
  { key: "A2_TPP", label: "A2 — Target Population", description: "Who will do the job" },
  { key: "A2_GAS", label: "A2 — Gap Analysis", description: "Performance gaps identified" },
  { key: "A3", label: "A3 — Feasibility", description: "Options and recommendations" },
  { key: "A4", label: "A4 — Output", description: "TRS or LDS generation" },
]

export default function AnalysePhasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [analysePhase, setAnalysePhase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchAnalysePhase = async () => {
      try {
        const token = localStorage.getItem("sadl_token")
        const res = await axios.get(`${API_URL}/api/analyse/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAnalysePhase(res.data)
      } catch (error) {
        console.error("Failed to fetch analyse phase:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAnalysePhase()
    }
  }, [id])

  const handleSave = async (endpoint, data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/analyse/${id}/${endpoint}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Re-fetch full analysePhase so all tabs stay in sync
      const res = await axios.get(`${API_URL}/api/analyse/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnalysePhase(res.data)
    } catch (error) {
      console.error("Save error:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/analyse/${id}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      navigate(`/projects/${id}`)
    } catch (error) {
      console.error("Submit error:", error)
    }
  }

  const renderStep = () => {
    const props = {
      analysePhase,
      onSave: handleSave,
      onNext: handleNext,
      onBack: handleBack,
      saving
    }

    switch (steps[currentStep].key) {
      case "A1":
        return <A1InputAnalysis {...props} />
      case "A2_JTP":
        return <A2JobTaskProfile {...props} />
      case "A2_TPP":
        return <A2TargetPopulation {...props} />
      case "A2_GAS":
        return <A2GapAnalysis {...props} />
      case "A3":
        return <A3FeasibilityReport {...props} />
      case "A4":
        return <A4AnalyseOutput {...props} onSubmit={handleSubmit} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading Analyse Phase...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Analyse Phase</h1>
        </div>
        <span className="text-sm text-gray-500">
          {analysePhase?.project?.title || ""}
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  index === currentStep
                    ? "bg-blue-600 text-white"
                    : index < currentStep
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStep
                    ? "bg-white text-blue-600"
                    : index < currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {index < currentStep ? "✓" : index + 1}
                </span>
                <span className="hidden sm:block">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <span className="text-gray-300 mx-1">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">{steps[currentStep].label}</h2>
            <p className="text-gray-500 mt-1">{steps[currentStep].description}</p>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}