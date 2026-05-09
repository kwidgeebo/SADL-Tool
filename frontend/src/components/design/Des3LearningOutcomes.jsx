import { useState } from "react"
import { useSaveStatus } from "../../hooks/useSaveStatus"

const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-1"

const TRAINING_LEVELS = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"]
const TRAINING_LEVEL_LABELS = {
  LEVEL_1: "Level 1 — Awareness",
  LEVEL_2: "Level 2 — Supervised Performance",
  LEVEL_3: "Level 3 — Unsupervised Performance",
  LEVEL_4: "Level 4 — Instructional Ability",
}

const DELIVERY_METHODS = [
  "INSTRUCTOR_LED", "SELF_PACED", "BLENDED", "ON_JOB", "SIMULATION", "E_LEARNING", "OTHER",
]
const DELIVERY_LABELS = {
  INSTRUCTOR_LED: "Instructor Led",
  SELF_PACED:     "Self Paced",
  BLENDED:        "Blended",
  ON_JOB:         "On Job",
  SIMULATION:     "Simulation",
  E_LEARNING:     "eLearning",
  OTHER:          "Other",
}

const TABS = ["Performance", "Delivery", "Duration"]

const emptyLO = (sequence) => ({
  sequence,
  loName: "",
  performanceStatement: "",
  performanceConditions: "",
  performanceStandard: "",
  assessmentCriteria: "",
  contentSummary: "",
  trainingLevel: "LEVEL_1",
  deliveryMethod: "INSTRUCTOR_LED",
  prerequisiteLOs: "",
  relatedAssessments: "",
  uocReference: "",
  resources: "",
  references: "",
  durationOnJobHours: "",
  durationOnJobDays: "",
  durationOffJobHours: "",
  durationOffJobDays: "",
  durationSummativeOnJobHours: "",
  durationSummativeOnJobDays: "",
  durationSummativeOffJobHours: "",
  durationSummativeOffJobDays: "",
  durationFormativeOffJobHours: "",
  durationFormativeOffJobDays: "",
  durationOtherHours: "",
  durationOtherDays: "",
  durationOtherType: "",
})

function DurationRow({ label, hoursField, daysField, selected, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hours</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={selected[hoursField]}
          onChange={e => onChange(hoursField, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Days</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={selected[daysField]}
          onChange={e => onChange(daysField, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

export default function Des3LearningOutcomes({ designPhase, onSave, onNext, onBack }) {
  const { withSaveStatus, buttonText, buttonClass, isDisabled } = useSaveStatus()
  const existing = designPhase?.des3LearningOutcomes || {}
  const existingLOs = existing.learningOutcomes || []

  const [mappingMatrixApplies, setMappingMatrixApplies] = useState(
    existing.mappingMatrixApplies ?? false
  )
  const [mappingMatrixNotes, setMappingMatrixNotes] = useState(
    existing.mappingMatrixNotes || ""
  )

  const [los, setLos] = useState(
    existingLOs.length > 0
      ? existingLOs.map(lo => ({
          ...lo,
          durationOnJobHours:           lo.durationOnJobHours           ?? "",
          durationOnJobDays:            lo.durationOnJobDays            ?? "",
          durationOffJobHours:          lo.durationOffJobHours          ?? "",
          durationOffJobDays:           lo.durationOffJobDays           ?? "",
          durationSummativeOnJobHours:  lo.durationSummativeOnJobHours  ?? "",
          durationSummativeOnJobDays:   lo.durationSummativeOnJobDays   ?? "",
          durationSummativeOffJobHours: lo.durationSummativeOffJobHours ?? "",
          durationSummativeOffJobDays:  lo.durationSummativeOffJobDays  ?? "",
          durationFormativeOffJobHours: lo.durationFormativeOffJobHours ?? "",
          durationFormativeOffJobDays:  lo.durationFormativeOffJobDays  ?? "",
          durationOtherHours:           lo.durationOtherHours           ?? "",
          durationOtherDays:            lo.durationOtherDays            ?? "",
          durationOtherType:            lo.durationOtherType            || "",
        }))
      : []
  )

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeTab, setActiveTab] = useState("Performance")

  const handleAddLO = () => {
    const newLO = emptyLO(los.length + 1)
    const updated = [...los, newLO]
    setLos(updated)
    setSelectedIndex(updated.length - 1)
    setActiveTab("Performance")
  }

  const handleDeleteLO = (index) => {
    const updated = los
      .filter((_, i) => i !== index)
      .map((lo, i) => ({ ...lo, sequence: i + 1 }))
    setLos(updated)
    if (selectedIndex >= updated.length) {
      setSelectedIndex(updated.length - 1)
    }
  }

  const handleLOChange = (field, value) => {
    if (selectedIndex === null) return
    const updated = [...los]
    updated[selectedIndex] = { ...updated[selectedIndex], [field]: value }
    setLos(updated)
  }

 const handleSaveAndNext = async () => {
  await withSaveStatus(async () => {
    const cleanedLOs = los.map(lo => {
      const cleaned = { ...lo }
      const durationFields = [
        "durationOnJobHours", "durationOnJobDays",
        "durationOffJobHours", "durationOffJobDays",
        "durationSummativeOnJobHours", "durationSummativeOnJobDays",
        "durationSummativeOffJobHours", "durationSummativeOffJobDays",
        "durationFormativeOffJobHours", "durationFormativeOffJobDays",
        "durationOtherHours", "durationOtherDays",
      ]
      durationFields.forEach(f => {
        cleaned[f] = cleaned[f] === "" ? null : parseFloat(cleaned[f])
      })
      delete cleaned.id
      delete cleaned.createdAt
      delete cleaned.updatedAt
      delete cleaned.des3Id
      return cleaned
    })
    await onSave("des3-learning-outcomes", {
      mappingMatrixApplies,
      mappingMatrixNotes,
      learningOutcomes: cleanedLOs,
    })
  })
  onNext()
}

  const selected = selectedIndex !== null ? los[selectedIndex] : null

  return (
    <div className="space-y-6">

      {/* Mapping Matrix */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-1">Mapping Matrix</h3>
        <p className="text-sm text-gray-500 mb-4">
          The Mapping Matrix is required only when a formal qualification or Unit of Competency is being awarded.
        </p>
        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition w-fit ${
          mappingMatrixApplies ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
        }`}>
          <input
            type="checkbox"
            checked={mappingMatrixApplies}
            onChange={e => setMappingMatrixApplies(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Mapping Matrix applies to this course</span>
        </label>
        {!mappingMatrixApplies && (
          <p className="text-xs text-gray-400 mt-2 ml-1">
            Not applicable — no formal qualification or UoC being awarded.
          </p>
        )}
        {mappingMatrixApplies && (
          <div className="mt-3">
            <label className={labelClass}>Mapping Matrix Notes</label>
            <textarea
              value={mappingMatrixNotes}
              onChange={e => setMappingMatrixNotes(e.target.value)}
              rows={2}
              placeholder="Note the qualification or UoC being mapped, and any alignment considerations..."
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* LO List + Detail Panel */}
      <div className="flex gap-6 min-h-[500px]">

        {/* Left — LO List */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-700">Learning Outcomes</h3>
            <button
              onClick={handleAddLO}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
            >
              + Add LO
            </button>
          </div>

          {los.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-xl">
              No LOs yet.<br />Click + Add LO to start.
            </div>
          )}

          {los.map((lo, index) => (
            <div
              key={index}
              onClick={() => { setSelectedIndex(index); setActiveTab("Performance") }}
              className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition ${
                selectedIndex === index
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500">LO {lo.sequence}</p>
                <p className="text-sm text-gray-800 truncate">
                  {lo.loName || <span className="text-gray-400 italic">Untitled</span>}
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDeleteLO(index) }}
                className="text-gray-300 hover:text-red-400 transition text-xs ml-2 mt-0.5 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Right — Detail Panel */}
        <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
          {selected === null ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              {los.length === 0
                ? "Add a Learning Outcome to get started."
                : "Select a Learning Outcome to edit it."}
            </div>
          ) : (
            <div className="flex flex-col h-full">

              {/* LO Header */}
              <div className="px-6 pt-5 pb-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg">
                    LO {selected.sequence}
                  </span>
                  <input
                    type="text"
                    value={selected.loName}
                    onChange={e => handleLOChange("loName", e.target.value)}
                    placeholder="Learning Outcome name..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-white">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {activeTab === "Performance" && (
                  <>
                    <div>
                      <label className={labelClass}>Performance Statement</label>
                      <textarea value={selected.performanceStatement} onChange={e => handleLOChange("performanceStatement", e.target.value)} rows={2} placeholder="What the learner must be able to do — the observable, measurable action..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Performance Conditions</label>
                      <textarea value={selected.performanceConditions} onChange={e => handleLOChange("performanceConditions", e.target.value)} rows={2} placeholder="The circumstances under which the performance must occur — given what, using what, where..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Performance Standard</label>
                      <textarea value={selected.performanceStandard} onChange={e => handleLOChange("performanceStandard", e.target.value)} rows={2} placeholder="How well the task must be performed — speed, accuracy, completeness..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Assessment Criteria</label>
                      <textarea value={selected.assessmentCriteria} onChange={e => handleLOChange("assessmentCriteria", e.target.value)} rows={3} placeholder="The observable evidence that will be used to judge satisfactory performance..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Content Summary</label>
                      <textarea value={selected.contentSummary} onChange={e => handleLOChange("contentSummary", e.target.value)} rows={3} placeholder="Key knowledge and skills that underpin this learning outcome..." className={inputClass} />
                    </div>
                  </>
                )}

                {activeTab === "Delivery" && (
                  <>
                    <div>
                      <label className={labelClass}>Training Level</label>
                      <div className="grid grid-cols-1 gap-2">
                        {TRAINING_LEVELS.map(level => (
                          <label key={level} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${selected.trainingLevel === level ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                            <input type="radio" name="trainingLevel" value={level} checked={selected.trainingLevel === level} onChange={e => handleLOChange("trainingLevel", e.target.value)} className="w-3.5 h-3.5" />
                            {TRAINING_LEVEL_LABELS[level]}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Delivery Method</label>
                      <select value={selected.deliveryMethod} onChange={e => handleLOChange("deliveryMethod", e.target.value)} className={inputClass}>
                        {DELIVERY_METHODS.map(m => (
                          <option key={m} value={m}>{DELIVERY_LABELS[m]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Pre-requisite LOs</label>
                      <input type="text" value={selected.prerequisiteLOs} onChange={e => handleLOChange("prerequisiteLOs", e.target.value)} placeholder="e.g. LO 1, LO 2 — or None" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Related Assessments</label>
                      <textarea value={selected.relatedAssessments} onChange={e => handleLOChange("relatedAssessments", e.target.value)} rows={2} placeholder="Formative and summative assessments that assess this LO..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>UoC Reference</label>
                      <input type="text" value={selected.uocReference} onChange={e => handleLOChange("uocReference", e.target.value)} placeholder="VET Unit of Competency code — or N/A if no formal qualification" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Resources</label>
                      <textarea value={selected.resources} onChange={e => handleLOChange("resources", e.target.value)} rows={2} placeholder="Equipment, materials and facilities required to deliver this LO..." className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>References</label>
                      <textarea value={selected.references} onChange={e => handleLOChange("references", e.target.value)} rows={2} placeholder="Publications, manuals, SOPs or other references supporting this LO..." className={inputClass} />
                    </div>
                  </>
                )}

                {activeTab === "Duration" && (
                  <div className="space-y-5">
                    <p className="text-sm text-gray-500">Enter the time allocation for each activity type. Leave blank if not applicable.</p>
                    <div className="space-y-3">
                      <DurationRow label="On Job Training"     hoursField="durationOnJobHours"           daysField="durationOnJobDays"           selected={selected} onChange={handleLOChange} />
                      <DurationRow label="Off Job Training"    hoursField="durationOffJobHours"          daysField="durationOffJobDays"          selected={selected} onChange={handleLOChange} />
                      <DurationRow label="Summative (On Job)"  hoursField="durationSummativeOnJobHours"  daysField="durationSummativeOnJobDays"  selected={selected} onChange={handleLOChange} />
                      <DurationRow label="Summative (Off Job)" hoursField="durationSummativeOffJobHours" daysField="durationSummativeOffJobDays" selected={selected} onChange={handleLOChange} />
                      <DurationRow label="Formative (Off Job)" hoursField="durationFormativeOffJobHours" daysField="durationFormativeOffJobDays" selected={selected} onChange={handleLOChange} />
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-3">Other Activities</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Activity Type</label>
                          <input type="text" value={selected.durationOtherType} onChange={e => handleLOChange("durationOtherType", e.target.value)} placeholder="e.g. Self-study, field exercise..." className={inputClass} />
                        </div>
                        <DurationRow label="Other Activities" hoursField="durationOtherHours" daysField="durationOtherDays" selected={selected} onChange={handleLOChange} />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

{/* Add LO shortcut */}
onClick={async () => {
  await onSave("des3-learning-outcomes", {
    mappingMatrixApplies,
    mappingMatrixNotes,
    learningOutcomes: los.map(lo => {
      const cleaned = { ...lo }
      const durationFields = ["durationOnJobHours","durationOnJobDays","durationOffJobHours","durationOffJobDays","durationSummativeOnJobHours","durationSummativeOnJobDays","durationSummativeOffJobHours","durationSummativeOffJobDays","durationFormativeOffJobHours","durationFormativeOffJobDays","durationOtherHours","durationOtherDays"]
      durationFields.forEach(f => { cleaned[f] = cleaned[f] === "" ? null : parseFloat(cleaned[f]) })
      delete cleaned.id; delete cleaned.createdAt; delete cleaned.updatedAt; delete cleaned.des3Id
      return cleaned
    }),
  })
  handleAddLO()
}}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSaveAndNext}
          disabled={isDisabled}
          className={buttonClass("bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50")}
        >
          {buttonText("Save and Continue →")}
        </button>
      </div>

    </div>
  )
}
