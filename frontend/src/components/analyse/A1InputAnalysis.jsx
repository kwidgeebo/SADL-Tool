import { useState } from "react"

const triggers = [
  { key: "triggerLegislative", label: "Legislative Change" },
  { key: "triggerPolicy", label: "Policy or Procedural Change" },
  { key: "triggerNewCapability", label: "New Capability, Platform or Equipment" },
  { key: "triggerLessonsLearnt", label: "Operational Lessons Learnt" },
  { key: "triggerLearningReview", label: "Learning Review Feedback" },
  { key: "triggerWorkplaceEval", label: "Workplace Evaluation Feedback" },
  { key: "triggerBusinessSkill", label: "New Business Skilling Requirement" },
  { key: "triggerCultural", label: "Cultural Change Requirement" },
  { key: "triggerOther", label: "Other" },
]

export default function A1InputAnalysis({ analysePhase, onSave, onNext, saving }) {
  const existing = analysePhase?.inputAnalysis || {}

  const [form, setForm] = useState({
    triggerLegislative: existing.triggerLegislative || false,
    triggerPolicy: existing.triggerPolicy || false,
    triggerNewCapability: existing.triggerNewCapability || false,
    triggerLessonsLearnt: existing.triggerLessonsLearnt || false,
    triggerLearningReview: existing.triggerLearningReview || false,
    triggerWorkplaceEval: existing.triggerWorkplaceEval || false,
    triggerBusinessSkill: existing.triggerBusinessSkill || false,
    triggerCultural: existing.triggerCultural || false,
    triggerOther: existing.triggerOther || false,
    triggerOtherDetails: existing.triggerOtherDetails || "",
    projectBackground: existing.projectBackground || "",
    currentStatus: existing.currentStatus || "",
    linkedActivities: existing.linkedActivities || "",
    sadlAppropriate: existing.sadlAppropriate ?? true,
    analyseRequired: existing.analyseRequired ?? true,
    scopeNotes: existing.scopeNotes || "",
    requiredDeliverables: existing.requiredDeliverables || "",
    stakeholderNeeds: existing.stakeholderNeeds || "",
    timeFactors: existing.timeFactors || "",
    resourcesRequired: existing.resourcesRequired || "",
    rolesResponsibilities: existing.rolesResponsibilities || "",
    communicationProcess: existing.communicationProcess || "",
    oqeProvided: existing.oqeProvided ?? false,
    oqeNotes: existing.oqeNotes || "",
  })

  const [showOutput, setShowOutput] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSaveAndNext = async () => {
    await onSave("input-analysis", form)
    onNext()
  }

  return (
    <div className="space-y-8">

      {/* Triggers */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          A1.1 — Project Triggers
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Select all triggers that initiated this analysis activity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {triggers.map(trigger => (
            <label
              key={trigger.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                form[trigger.key]
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                name={trigger.key}
                checked={form[trigger.key]}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{trigger.label}</span>
            </label>
          ))}
        </div>
        {form.triggerOther && (
          <div className="mt-3">
            <textarea
              name="triggerOtherDetails"
              value={form.triggerOtherDetails}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the other trigger..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Project Background */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          A1.2 — Project Background
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe the project context, current status and any linked activities.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Background
            </label>
            <textarea
              name="projectBackground"
              value={form.projectBackground}
              onChange={handleChange}
              rows={3}
              placeholder="Describe relevant history, current status and foreseen developments..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <textarea
              name="currentStatus"
              value={form.currentStatus}
              onChange={handleChange}
              rows={2}
              placeholder="What is the current state of the capability or job requirement?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Activities
            </label>
            <textarea
              name="linkedActivities"
              value={form.linkedActivities}
              onChange={handleChange}
              rows={2}
              placeholder="List any related projects or activities currently underway..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scope */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Scope Confirmation
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Confirm whether SADL is the appropriate process for this project.
        </p>
        <div className="space-y-4">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="sadlAppropriate"
                checked={form.sadlAppropriate}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">SADL is appropriate for this project</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="analyseRequired"
                checked={form.analyseRequired}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Analyse Phase is required</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scope Notes
            </label>
            <textarea
              name="scopeNotes"
              value={form.scopeNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Note any aspects of the Analyse Phase that are not required and why..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Deliverables
            </label>
            <textarea
              name="requiredDeliverables"
              value={form.requiredDeliverables}
              onChange={handleChange}
              rows={2}
              placeholder="List the standard Analyse Phase outputs that will be developed..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stakeholders and Resources */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Stakeholders and Resources
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify key stakeholders, timeframes and resources for this project.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stakeholder Needs
            </label>
            <textarea
              name="stakeholderNeeds"
              value={form.stakeholderNeeds}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the needs of key stakeholders..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Factors
            </label>
            <textarea
              name="timeFactors"
              value={form.timeFactors}
              onChange={handleChange}
              rows={2}
              placeholder="List pertinent deadlines and rationale..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resources Required
            </label>
            <textarea
              name="resourcesRequired"
              value={form.resourcesRequired}
              onChange={handleChange}
              rows={2}
              placeholder="Identify key personnel, budget and equipment requirements..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles and Responsibilities
            </label>
            <textarea
              name="rolesResponsibilities"
              value={form.rolesResponsibilities}
              onChange={handleChange}
              rows={2}
              placeholder="Define key roles and responsibilities for this project..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Process
            </label>
            <textarea
              name="communicationProcess"
              value={form.communicationProcess}
              onChange={handleChange}
              rows={2}
              placeholder="Describe meeting schedules, correspondence and approvals processes..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* OQE */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Objective Quality Evidence (OQE)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Confirm whether OQE has been provided to support the trigger.
        </p>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="oqeProvided"
              checked={form.oqeProvided}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">OQE has been provided</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OQE Notes
            </label>
            <textarea
              name="oqeNotes"
              value={form.oqeNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the OQE provided or explain why it is not available..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

{/* AP1 Output Preview */}
{existing.projectBackground && (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <button
      onClick={() => setShowOutput(!showOutput)}
      className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
    >
      <span className="font-semibold text-gray-800">📄 View AP1 — Analyse Phase Scoping Form</span>
      <span className="text-gray-400 text-sm">{showOutput ? "Hide ▲" : "Show ▼"}</span>
    </button>

    {showOutput && (
      <div className="p-6 space-y-4 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium">Project:</span> {analysePhase?.project?.title}</div>
          <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-AU')}</div>
        </div>

        <hr />

        <div>
          <p className="font-semibold text-gray-800 mb-1">Training Triggers</p>
          <ul className="list-disc list-inside space-y-1">
            {triggers.filter(t => existing[t.key]).map(t => (
              <li key={t.key}>{t.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Project Background</p>
          <p className="whitespace-pre-wrap">{existing.projectBackground}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Current Status</p>
          <p className="whitespace-pre-wrap">{existing.currentStatus}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Linked Activities</p>
          <p className="whitespace-pre-wrap">{existing.linkedActivities}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Scope</p>
          <p className="whitespace-pre-wrap">{existing.scopeNotes}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Required Deliverables</p>
          <p className="whitespace-pre-wrap">{existing.requiredDeliverables}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Stakeholder Needs</p>
          <p className="whitespace-pre-wrap">{existing.stakeholderNeeds}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Time Factors</p>
          <p className="whitespace-pre-wrap">{existing.timeFactors}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Resources Required</p>
          <p className="whitespace-pre-wrap">{existing.resourcesRequired}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Roles and Responsibilities</p>
          <p className="whitespace-pre-wrap">{existing.rolesResponsibilities}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Communication Process</p>
          <p className="whitespace-pre-wrap">{existing.communicationProcess}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">OQE Notes</p>
          <p className="whitespace-pre-wrap">{existing.oqeNotes}</p>
        </div>
      </div>
    )}
  </div>
)}
      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
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