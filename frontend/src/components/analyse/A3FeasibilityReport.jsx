import { useState } from "react"

const optionTypes = [
  { value: "NO_ACTION", label: "No Action" },
  { value: "NON_LD", label: "Non-Learning and Development Solution" },
  { value: "LD_NON_TRAINING", label: "L&D Solution (Non-Training)" },
  { value: "LD_TRAINING", label: "L&D Solution (Training)" },
]

const emptyOption = {
  optionType: "NO_ACTION",
  optionDescription: "",
  advantages: "",
  disadvantages: "",
  risks: "",
  mitigationActions: "",
  recommended: false
}

export default function A3FeasibilityReport({ analysePhase, onSave, onNext, onBack, saving }) {
  const existing = analysePhase?.feasibilityReport || {}

  const [form, setForm] = useState({
    analysisProcess: existing.analysisProcess || "",
    unitsConsulted: existing.unitsConsulted || "",
    recommendation: existing.recommendation || "",
    options: existing.options || [{ ...emptyOption }]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index, field, value) => {
    const updated = [...form.options]
    updated[index] = { ...updated[index], [field]: field === "recommended" ? value : value }
    setForm(prev => ({ ...prev, options: updated }))
  }

  const addOption = () => {
    setForm(prev => ({ ...prev, options: [...prev.options, { ...emptyOption }] }))
  }

  const removeOption = (index) => {
    setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }))
  }

  const setRecommended = (index) => {
    const updated = form.options.map((opt, i) => ({ ...opt, recommended: i === index }))
    setForm(prev => ({ ...prev, options: updated }))
  }

  const handleSaveAndNext = async () => {
    await onSave("feasibility-report", form)
    onNext()
  }

  return (
    <div className="space-y-8">

      {/* Options */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold text-gray-800">Feasibility Options</h3>
          <button onClick={addOption} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Option
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          List all potential solutions. Start with No Action, then non-L&D solutions, then L&D solutions.
        </p>

        <div className="space-y-5">
          {form.options.map((option, index) => (
            <div
              key={index}
              className={`border rounded-xl p-5 ${option.recommended ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Option {index + 1}</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRecommended(index)}
                    className={`text-xs font-medium px-3 py-1 rounded-full border transition ${
                      option.recommended
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {option.recommended ? "✓ Recommended" : "Mark as Recommended"}
                  </button>
                  {form.options.length > 1 && (
                    <button onClick={() => removeOption(index)} className="text-xs text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Option Type</label>
                  <select
                    value={option.optionType}
                    onChange={(e) => handleOptionChange(index, "optionType", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {optionTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Option Description</label>
                  <textarea
                    value={option.optionDescription || ""}
                    onChange={(e) => handleOptionChange(index, "optionDescription", e.target.value)}
                    rows={2}
                    placeholder="Describe this option..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Advantages</label>
                    <textarea
                      value={option.advantages || ""}
                      onChange={(e) => handleOptionChange(index, "advantages", e.target.value)}
                      rows={2}
                      placeholder="List advantages..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Disadvantages / Risks</label>
                    <textarea
                      value={option.disadvantages || ""}
                      onChange={(e) => handleOptionChange(index, "disadvantages", e.target.value)}
                      rows={2}
                      placeholder="List disadvantages and risks..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mitigation Actions</label>
                  <textarea
                    value={option.mitigationActions || ""}
                    onChange={(e) => handleOptionChange(index, "mitigationActions", e.target.value)}
                    rows={2}
                    placeholder="Describe mitigation actions for identified risks..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Process */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Analysis Process</h3>
        <p className="text-sm text-gray-500 mb-4">Record the process used and units consulted during the analysis.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Process</label>
            <textarea
              name="analysisProcess"
              value={form.analysisProcess}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the process used to conduct the feasibility analysis..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Units / Organisations Consulted</label>
            <textarea
              name="unitsConsulted"
              value={form.unitsConsulted}
              onChange={handleChange}
              rows={2}
              placeholder="List units and organisations consulted during the analysis..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Final Recommendation</label>
            <textarea
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              rows={3}
              placeholder="State the recommended course of action..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button onClick={onBack} className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition">
          ← Back
        </button>
        <button
          onClick={handleSaveAndNext}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save and Continue →"}
        </button>
      </div>
    </div>
  )
}