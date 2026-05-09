import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Des1InputAnalysis from "../components/design/Des1InputAnalysis"
import Des2Environments from "../components/design/Des2Environments"
import Des3LearningOutcomes from "../components/design/Des3LearningOutcomes"
import Des4CourseStructure from "../components/design/Des4CourseStructure"
import Des5Output from "../components/design/Des5Output"

// Placeholders — replace as each stage is built
const Placeholder = ({ label, onNext, onBack }) => (
  <div>
    <p className="text-gray-500 mb-6">{label} — coming soon.</p>
    <div className="flex justify-between pt-4 border-t border-gray-100">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg transition">
        ← Back
      </button>
      <button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition">
        Next →
      </button>
    </div>
  </div>
)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const steps = [
  { key: "Des1", label: "Des1 — Input Analysis",        description: "Documents, stakeholders and scope" },
  { key: "Des2", label: "Des2 — Environments Analysis", description: "Facility, resources and constraints" },
  { key: "Des3", label: "Des3 — Learning Outcomes",     description: "Generate and detail all LOs" },
  { key: "Des4", label: "Des4 — Course Structure",      description: "Modules, assessments and evaluation" },
  { key: "Des5", label: "Des5 — Output Production",     description: "Review and finalise Draft LMP" },
]

export default function DesignPhasePage() {
  const { id } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [designPhase, setDesignPhase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
  fetchDesignPhase()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id])

  const fetchDesignPhase = async () => {
    try {
      const token = localStorage.getItem("sadl_token")
      const res = await axios.get(`${API_URL}/api/design/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDesignPhase(res.data)
    } catch (error) {
      console.error("Failed to fetch design phase:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (endpoint, data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem("sadl_token")
      await axios.post(
        `${API_URL}/api/design/${id}/${endpoint}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Re-fetch full designPhase so all tabs stay in sync
      const res = await axios.get(`${API_URL}/api/design/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDesignPhase(res.data)
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

  
  const renderStep = () => {
    const props = {
      designPhase,
      onSave: handleSave,
      onNext: handleNext,
      onBack: handleBack,
      saving,
    }

   switch (steps[currentStep].key) {
    case "Des1":
      return <Des1InputAnalysis {...props} />
    case "Des2":
      return <Des2Environments {...props} />
    case "Des3":
      return <Des3LearningOutcomes {...props} />
    case "Des4":
      return <Des4CourseStructure {...props} />
    case "Des5":
      console.log("HIT DES5 CASE")
      return <Des5Output
        designPhase={designPhase}
        onSave={handleSave}
        onBack={handleBack}
        saving={saving}
      />
  default:
    return null
}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading Design Phase...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Design Phase</h1>
        <p className="text-gray-500 text-sm mt-1">
          {designPhase?.project?.title || ""}
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
