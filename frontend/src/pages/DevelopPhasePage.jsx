import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Dev1CopilotPrompts from "../components/develop/Dev1CopilotPrompts"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const steps = [
  { key: "Dev1", label: "Dev1 — Copilot Prompts", description: "Generate development prompts" },
]

export default function DevelopPhasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [developPhase, setDevelopPhase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDevelopPhase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchDevelopPhase = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/develop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDevelopPhase(res.data)
    } catch (error) {
      console.error("Failed to fetch develop phase:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (endpoint, data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/develop/${id}/${endpoint}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const res = await axios.get(`${API_URL}/api/develop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDevelopPhase(res.data)
    } catch (error) {
      console.error("Save error:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/develop/${id}/submit`,
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
      developPhase,
      onSave: handleSave,
      onSubmit: handleSubmit,
      saving,
    }

    switch (steps[currentStep].key) {
      case "Dev1":
        return <Dev1CopilotPrompts {...props} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading Develop Phase...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="text-gray-500 hover:text-gray-700 text-sm mb-3 inline-block"
        >
          ← Back to Project
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Develop Phase</h1>
        <p className="text-gray-500 text-sm mt-1">
          {developPhase?.project?.title || ""}
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-start gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isComplete = index < currentStep
          return (
            <button
              key={step.key}
              onClick={() => setCurrentStep(index)}
              className={`flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl border transition text-left min-w-[160px] ${
                isActive
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : isComplete
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span className="text-xs font-semibold mb-0.5">
                {isComplete ? "✓ " : ""}{step.label}
              </span>
              <span className="text-xs opacity-70">{step.description}</span>
            </button>
          )
        })}
      </div>

      {/* Active Step Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep].label}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {steps[currentStep].description}
          </p>
        </div>
        {renderStep()}
      </div>

    </div>
  )
}
