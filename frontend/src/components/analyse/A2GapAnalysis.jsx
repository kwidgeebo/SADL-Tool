import { useState } from "react"

const emptyGapItem = {
  taskReference: "",
  taskDescription: "",
  targetPopulationCapacity: "",
  identifiedGap: "",
  currentLearningOutcome: "",
  difRating: ""
}

const emptyOverTraining = {
  learningOutcome: "",
  assessment: ""
}

export default function A2GapAnalysis({ analysePhase, onSave, onNext, onBack, saving }) {
  const existing = analysePhase?.gapAnalysis || {}

  const [form, setForm] = useState({
    gapExists: existing.gapExists || false,
    gapType: existing.gapType || "SIMPLE",
    gapSummary: existing.gapSummary || "",
    recommendation: existing.recommendation || "",
    gapItems: existing.gapItems || [{ ...emptyGapItem }],
    overTraining: existing.overTraining || [],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleGapItemChange = (index, field, value) => {
    const updated = [...form.gapItems]
    updated[index] = { ...updated[index], [field]: value }
    setForm(prev => ({ ...prev, gapItems: updated }))
  }

  const addGapItem = () => {
    setForm(prev => ({ ...prev, gapItems: [...prev.gapItems, { ...emptyGapItem }] }))
  }

  const removeGapItem = (index) => {
    setForm(prev => ({ ...prev, gapItems: prev.gapItems.filter((_, i) => i !== index) }))
  }

  const handleOverTrainingChange = (index, field, value) => {
    const updated = [...form.overTraining]
    updated[index] = { ...updated[index], [field]: value }
    setForm(prev => ({ ...prev, overTraining: updated }))
  }

  const addOverTraining = () => {
    setForm(prev => ({ ...prev, overTraining: [...prev.overTraining, { ...emptyOverTraining }] }))
  }

  const removeOverTraining = (index) => {
    setForm(prev => ({ ...prev, overTraining: prev.overTraining.filter((_, i) => i !== index) }))
  }

  const handleSaveAndNext = async () => {
    await onSave("gap-analysis", form)
    onNext()
  }

  return (
    <div className="space-y-8">

      {/* Gap Summary */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Gap Analysis Summary</h3>
        <p className="text-sm text-gray-500 mb-4">
          Determine whether a performance gap exists between required job performance and the Target Population.
        </p>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="gapExists"
              checked={form.gapExists}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">A performance gap exists</span>
          </label>

          {form.gapExists && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gap Type</label>
              <select
                name="gapType"
                value={form.gapType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SIMPLE">Simple Gap — proceed to Feasibility Analysis</option>
                <option value="COMPLEX">Complex Gap — requires prior approval before Feasibility Analysis</option>
                <option value="NO_GAP">No Gap — SADL intervention not required</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gap Summary</label>
            <textarea
              name="gapSummary"
              value={form.gapSummary}
              onChange={handleChange}
              rows={3}
              placeholder="Provide a short word picture of the gap..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
            <textarea
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              rows={2}
              placeholder="Recommend how to proceed..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Gap Items Table */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold text-gray-800">Gap Analysis Items</h3>
          <button onClick={addGapItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Item
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Record each task, the Target Population's capacity, and any identified gap.
        </p>
        <div className="space-y-4">
          {form.gapItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                {form.gapItems.length > 1 && (
                  <button onClick={() => removeGapItem(index)} className="text-xs text-red-500 hover:text-red-700">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Task Reference</label>
                  <input
                    type="text"
                    value={item.taskReference || ""}
                    onChange={(e) => handleGapItemChange(index, "taskReference", e.target.value)}
                    placeholder="e.g. Task 1.1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">DIF Rating</label>
                  <input
                    type="text"
                    value={item.difRating || ""}
                    onChange={(e) => handleGapItemChange(index, "difRating", e.target.value)}
                    placeholder="e.g. D:Difficult F:Weekly I:High"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Task Description</label>
                  <input
                    type="text"
                    value={item.taskDescription || ""}
                    onChange={(e) => handleGapItemChange(index, "taskDescription", e.target.value)}
                    placeholder="Describe the task..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Target Population Capacity</label>
                  <input
                    type="text"
                    value={item.targetPopulationCapacity || ""}
                    onChange={(e) => handleGapItemChange(index, "targetPopulationCapacity", e.target.value)}
                    placeholder="Can the Target Population perform this task without intervention?"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Identified Gap</label>
                  <textarea
                    value={item.identifiedGap || ""}
                    onChange={(e) => handleGapItemChange(index, "identifiedGap", e.target.value)}
                    rows={2}
                    placeholder="Describe the extent of the gap..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Learning Outcome (if any)</label>
                  <input
                    type="text"
                    value={item.currentLearningOutcome || ""}
                    onChange={(e) => handleGapItemChange(index, "currentLearningOutcome", e.target.value)}
                    placeholder="Relevant learning outcomes from existing interventions..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Over Training */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold text-gray-800">Potential Over-Training</h3>
          <button onClick={addOverTraining} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Item
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Record any learning outcomes from existing interventions that do not align with this job.
        </p>
        {form.overTraining.length === 0 && (
          <p className="text-sm text-gray-400 italic">No over-training items added.</p>
        )}
        <div className="space-y-3">
          {form.overTraining.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                <button onClick={() => removeOverTraining(index)} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Learning Outcome</label>
                  <input
                    type="text"
                    value={item.learningOutcome || ""}
                    onChange={(e) => handleOverTrainingChange(index, "learningOutcome", e.target.value)}
                    placeholder="Learning outcome from existing intervention..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Assessment</label>
                  <input
                    type="text"
                    value={item.assessment || ""}
                    onChange={(e) => handleOverTrainingChange(index, "assessment", e.target.value)}
                    placeholder="Over-training / Training for job Y / Required for personnel management..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
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