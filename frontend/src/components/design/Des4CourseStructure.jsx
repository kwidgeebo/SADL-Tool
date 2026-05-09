import { useState, useRef } from "react"
import { useSaveStatus } from "../../hooks/useSaveStatus"

const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
const labelClass = "block text-sm font-medium text-gray-700 mb-1"

const DELIVERY_METHODS = ["INSTRUCTOR_LED", "SELF_PACED", "BLENDED", "ON_JOB", "SIMULATION", "E_LEARNING", "OTHER"]
const DELIVERY_LABELS = {
  INSTRUCTOR_LED: "Instructor Led", SELF_PACED: "Self Paced", BLENDED: "Blended",
  ON_JOB: "On Job", SIMULATION: "Simulation", E_LEARNING: "eLearning", OTHER: "Other",
}

const ASSESSMENT_METHODS = ["OBSERVATION", "WRITTEN_TEST", "PRACTICAL_EXERCISE", "PORTFOLIO", "ORAL_QUESTIONING", "SIMULATION_EXERCISE", "OTHER"]
const ASSESSMENT_LABELS = {
  OBSERVATION: "Observation", WRITTEN_TEST: "Written Test", PRACTICAL_EXERCISE: "Practical Exercise",
  PORTFOLIO: "Portfolio", ORAL_QUESTIONING: "Oral Questioning", SIMULATION_EXERCISE: "Simulation Exercise", OTHER: "Other",
}

const KIRKPATRICK_LEVELS = [
  { value: "LEVEL_1_REACTION",   label: "Level 1 — Reaction",   desc: "Did learners find the training valuable?" },
  { value: "LEVEL_2_LEARNING",   label: "Level 2 — Learning",   desc: "Did learners acquire the intended knowledge and skills?" },
  { value: "LEVEL_3_BEHAVIOUR",  label: "Level 3 — Behaviour",  desc: "Are learners applying what they learned on the job?" },
  { value: "LEVEL_4_RESULTS",    label: "Level 4 — Results",    desc: "Did the training achieve the desired organisational outcomes?" },
]

const emptyModule = (sequence) => ({
  sequence,
  moduleId: String(sequence),
  moduleName: "",
  moduleContent: "",
  prerequisiteModules: "",
  deliveryMethod: "INSTRUCTOR_LED",
  keyResources: "",
  whsRequirements: "",
  additionalComments: "",
  loAssignments: [],
  durationOnJobHours: "", durationOnJobDays: "",
  durationOffJobHours: "", durationOffJobDays: "",
  durationSummativeOnJobHours: "", durationSummativeOnJobDays: "",
  durationSummativeOffJobHours: "", durationSummativeOffJobDays: "",
  durationFormativeOffJobHours: "", durationFormativeOffJobDays: "",
  durationOtherHours: "", durationOtherDays: "", durationOtherType: "",
  formativeAssessments: [],
  summativeAssessments: [],
})

const emptyFormative = () => ({
  faId: "", faName: "", loAssessed: "", method: "OBSERVATION",
  description: "", assessmentCriteria: "", additionalComments: "",
  durationHours: "", durationDays: "",
})

const emptySummative = () => ({
  saId: "", saName: "", loAssessed: "", method: "WRITTEN_TEST",
  description: "", assessmentCriteria: "", uocReference: "", additionalComments: "",
  durationHours: "", durationDays: "",
})

const emptyEvalPlan = (level) => ({
  kirkpatrickLevel: level, planDescription: "", timing: "", responsibility: "",
})

export default function Des4CourseStructure({ designPhase, onSave, onNext, onBack }) {
  const { withSaveStatus, buttonText, buttonClass, isDisabled } = useSaveStatus()
  const existing = designPhase?.des4CourseStructure || {}
  const existingModules = existing.modules || []
  const existingEvalPlan = existing.evaluationPlan || []

  // Get LOs from Des3 for assignment
  const availableLOs = designPhase?.des3LearningOutcomes?.learningOutcomes || []

  const [form, setForm] = useState({
    courseAim:              existing.courseAim              || "",
    courseDescription:      existing.courseDescription      || "",
    courseOverview:         existing.courseOverview         || "",
    minStudents:            existing.minStudents            || "",
    maxStudents:            existing.maxStudents            || "",
    courseLevel:            existing.courseLevel            || "",
    courseType:             existing.courseType             || "",
    servicePrerequisites:   existing.servicePrerequisites   || "",
    qualificationPrerequisites: existing.qualificationPrerequisites || "",
    securityClearance:      existing.securityClearance      || "",
    courseTargets:          existing.courseTargets          || "",
    eligibilityDetails:     existing.eligibilityDetails     || "",
    trainingAuthorityDetails: existing.trainingAuthorityDetails || "",
    accreditationBody:      existing.accreditationBody      || "",
    authorityToUse:         existing.authorityToUse         || "",
    specialInstructions:    existing.specialInstructions    || "",
    formativeStrategy:      existing.formativeStrategy      || "",
    summativeStrategy:      existing.summativeStrategy      || "",
    assessorQualifications: existing.assessorQualifications || "",
    assessmentNotes:        existing.assessmentNotes        || "",
    primaryDeliveryMethod:  existing.primaryDeliveryMethod  || "INSTRUCTOR_LED",
    deliveryNotes:          existing.deliveryNotes          || "",
    learningMethods:        existing.learningMethods        || "",
    mediaRequirements:      existing.mediaRequirements      || "",
    totalOnJobHours:        existing.totalOnJobHours        || "",
    totalOffJobHours:       existing.totalOffJobHours       || "",
    totalDays:              existing.totalDays              || "",
    humanResources:         existing.humanResources         || "",
    physicalResources:      existing.physicalResources      || "",
    defenceSupportRequirements: existing.defenceSupportRequirements || "",
    financialRequirements:  existing.financialRequirements  || "",
    otherRequirements:      existing.otherRequirements      || "",
  })

  const [modules, setModules] = useState(
    existingModules.length > 0
      ? existingModules.map(m => ({
          ...m,
          loAssignments: m.loAssignments ? (typeof m.loAssignments === 'string' ? JSON.parse(m.loAssignments) : m.loAssignments) : [],
          formativeAssessments: m.formativeAssessments || [],
          summativeAssessments: m.summativeAssessments || [],
          durationOnJobHours: m.durationOnJobHours ?? "",
          durationOnJobDays: m.durationOnJobDays ?? "",
          durationOffJobHours: m.durationOffJobHours ?? "",
          durationOffJobDays: m.durationOffJobDays ?? "",
          durationSummativeOnJobHours: m.durationSummativeOnJobHours ?? "",
          durationSummativeOnJobDays: m.durationSummativeOnJobDays ?? "",
          durationSummativeOffJobHours: m.durationSummativeOffJobHours ?? "",
          durationSummativeOffJobDays: m.durationSummativeOffJobDays ?? "",
          durationFormativeOffJobHours: m.durationFormativeOffJobHours ?? "",
          durationFormativeOffJobDays: m.durationFormativeOffJobDays ?? "",
          durationOtherHours: m.durationOtherHours ?? "",
          durationOtherDays: m.durationOtherDays ?? "",
          durationOtherType: m.durationOtherType || "",
        }))
      : []
  )

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null)
  const [evalPlan, setEvalPlan] = useState(
    KIRKPATRICK_LEVELS.map(level => {
      const existing_ep = existingEvalPlan.find(e => e.kirkpatrickLevel === level.value)
      return existing_ep || emptyEvalPlan(level.value)
    })
  )

  // Drag and drop state
  const dragIndex = useRef(null)
  const dragOverIndex = useRef(null)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddModule = () => {
    const newModule = emptyModule(modules.length + 1)
    const updated = [...modules, newModule]
    setModules(updated)
    setSelectedModuleIndex(updated.length - 1)
  }

  const handleDeleteModule = (index) => {
    const updated = modules
      .filter((_, i) => i !== index)
      .map((m, i) => ({ ...m, sequence: i + 1 }))
    setModules(updated)
    if (selectedModuleIndex >= updated.length) setSelectedModuleIndex(updated.length - 1)
    else if (selectedModuleIndex === index) setSelectedModuleIndex(null)
  }

  const handleModuleChange = (field, value) => {
    if (selectedModuleIndex === null) return
    const updated = [...modules]
    updated[selectedModuleIndex] = { ...updated[selectedModuleIndex], [field]: value }
    setModules(updated)
  }

  const handleLOAssignment = (loId) => {
    if (selectedModuleIndex === null) return
    const updated = [...modules]
    const current = updated[selectedModuleIndex].loAssignments || []
    updated[selectedModuleIndex] = {
      ...updated[selectedModuleIndex],
      loAssignments: current.includes(loId)
        ? current.filter(id => id !== loId)
        : [...current, loId]
    }
    setModules(updated)
  }

  const handleAddFormative = () => {
    if (selectedModuleIndex === null) return
    const updated = [...modules]
    updated[selectedModuleIndex].formativeAssessments = [
      ...(updated[selectedModuleIndex].formativeAssessments || []),
      emptyFormative()
    ]
    setModules(updated)
  }

  const handleFormativeChange = (faIndex, field, value) => {
    const updated = [...modules]
    updated[selectedModuleIndex].formativeAssessments[faIndex] = {
      ...updated[selectedModuleIndex].formativeAssessments[faIndex],
      [field]: value
    }
    setModules(updated)
  }

  const handleDeleteFormative = (faIndex) => {
    const updated = [...modules]
    updated[selectedModuleIndex].formativeAssessments = updated[selectedModuleIndex].formativeAssessments.filter((_, i) => i !== faIndex)
    setModules(updated)
  }

  const handleAddSummative = () => {
    if (selectedModuleIndex === null) return
    const updated = [...modules]
    updated[selectedModuleIndex].summativeAssessments = [
      ...(updated[selectedModuleIndex].summativeAssessments || []),
      emptySummative()
    ]
    setModules(updated)
  }

  const handleSummativeChange = (saIndex, field, value) => {
    const updated = [...modules]
    updated[selectedModuleIndex].summativeAssessments[saIndex] = {
      ...updated[selectedModuleIndex].summativeAssessments[saIndex],
      [field]: value
    }
    setModules(updated)
  }

  const handleDeleteSummative = (saIndex) => {
    const updated = [...modules]
    updated[selectedModuleIndex].summativeAssessments = updated[selectedModuleIndex].summativeAssessments.filter((_, i) => i !== saIndex)
    setModules(updated)
  }

  const handleEvalChange = (index, field, value) => {
    const updated = [...evalPlan]
    updated[index] = { ...updated[index], [field]: value }
    setEvalPlan(updated)
  }

  // Drag and drop handlers
  const handleDragStart = (index) => { dragIndex.current = index }
  const handleDragOver = (e, index) => { e.preventDefault(); dragOverIndex.current = index }
  const handleDrop = () => {
    if (dragIndex.current === null || dragOverIndex.current === null) return
    const updated = [...modules]
    const dragged = updated.splice(dragIndex.current, 1)[0]
    updated.splice(dragOverIndex.current, 0, dragged)
    const resequenced = updated.map((m, i) => ({ ...m, sequence: i + 1 }))
    setModules(resequenced)
    if (selectedModuleIndex === dragIndex.current) setSelectedModuleIndex(dragOverIndex.current)
    dragIndex.current = null
    dragOverIndex.current = null
  }

  const cleanModules = (mods) => mods.map(m => {
    const cleaned = { ...m, loAssignments: JSON.stringify(m.loAssignments || []) }
    const durationFields = ["durationOnJobHours","durationOnJobDays","durationOffJobHours","durationOffJobDays",
      "durationSummativeOnJobHours","durationSummativeOnJobDays","durationSummativeOffJobHours","durationSummativeOffJobDays",
      "durationFormativeOffJobHours","durationFormativeOffJobDays","durationOtherHours","durationOtherDays"]
    durationFields.forEach(f => { cleaned[f] = cleaned[f] === "" ? null : parseFloat(cleaned[f]) })
    cleaned.formativeAssessments = (m.formativeAssessments || []).map(fa => {
      const c = { ...fa }
      c.durationHours = c.durationHours === "" ? null : parseFloat(c.durationHours)
      c.durationDays = c.durationDays === "" ? null : parseFloat(c.durationDays)
      delete c.id; delete c.moduleId; delete c.createdAt; delete c.updatedAt
      return c
    })
    cleaned.summativeAssessments = (m.summativeAssessments || []).map(sa => {
      const c = { ...sa }
      c.durationHours = c.durationHours === "" ? null : parseFloat(c.durationHours)
      c.durationDays = c.durationDays === "" ? null : parseFloat(c.durationDays)
      delete c.id; delete c.moduleId; delete c.createdAt; delete c.updatedAt
      return c
    })
    delete cleaned.id; delete cleaned.des4Id; delete cleaned.createdAt; delete cleaned.updatedAt
    return cleaned
  })

 const handleSaveAndNext = async () => {
  await withSaveStatus(async () => {
    await onSave("your-endpoint", form)
  })
  onNext()
}

  const selectedModule = selectedModuleIndex !== null ? modules[selectedModuleIndex] : null

  return (
    <div className="space-y-8">

      {/* Course Information */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.1 — Course Information</h3>
        <p className="text-sm text-gray-500 mb-4">Core course details that populate Section 1 of the LMP.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Course Aim</label>
            <textarea name="courseAim" value={form.courseAim} onChange={handleFormChange} rows={2}
              placeholder="The overall purpose of the course — what it will enable learners to do..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Course Description</label>
            <textarea name="courseDescription" value={form.courseDescription} onChange={handleFormChange} rows={3}
              placeholder="A concise description of the course content and structure..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Course Overview</label>
            <textarea name="courseOverview" value={form.courseOverview} onChange={handleFormChange} rows={3}
              placeholder="High-level overview of the course including modules, duration and delivery approach..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Minimum Students</label>
              <input type="number" name="minStudents" value={form.minStudents} onChange={handleFormChange}
                placeholder="e.g. 6" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Maximum Students</label>
              <input type="number" name="maxStudents" value={form.maxStudents} onChange={handleFormChange}
                placeholder="e.g. 20" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Course Level</label>
              <input type="text" name="courseLevel" value={form.courseLevel} onChange={handleFormChange}
                placeholder="e.g. Basic, Intermediate, Advanced" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Course Type</label>
              <input type="text" name="courseType" value={form.courseType} onChange={handleFormChange}
                placeholder="e.g. Initial, Refresher, Conversion" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Service Pre-requisites</label>
            <textarea name="servicePrerequisites" value={form.servicePrerequisites} onChange={handleFormChange} rows={2}
              placeholder="Rank, service, posting or experience requirements..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Qualification Pre-requisites</label>
            <textarea name="qualificationPrerequisites" value={form.qualificationPrerequisites} onChange={handleFormChange} rows={2}
              placeholder="Required qualifications or courses completed prior to attendance..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Security Clearance Required</label>
            <input type="text" name="securityClearance" value={form.securityClearance} onChange={handleFormChange}
              placeholder="e.g. PROTECTED, NV1, NV2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Course Targets</label>
            <textarea name="courseTargets" value={form.courseTargets} onChange={handleFormChange} rows={2}
              placeholder="Target corps, mustering, rank or employment categories..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Eligibility Details</label>
            <textarea name="eligibilityDetails" value={form.eligibilityDetails} onChange={handleFormChange} rows={2}
              placeholder="Any additional eligibility criteria for course nomination..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Training Authority Details</label>
            <textarea name="trainingAuthorityDetails" value={form.trainingAuthorityDetails} onChange={handleFormChange} rows={2}
              placeholder="Training authority, approval chain and contact details..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Authority to Use</label>
            <textarea name="authorityToUse" value={form.authorityToUse} onChange={handleFormChange} rows={2}
              placeholder="Who has authority to use this training package and under what conditions..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Special Instructions</label>
            <textarea name="specialInstructions" value={form.specialInstructions} onChange={handleFormChange} rows={2}
              placeholder="Any special instructions for course delivery or administration..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Assessment Strategy */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.2 — Assessment Strategy</h3>
        <p className="text-sm text-gray-500 mb-4">Describe the overall approach to formative and summative assessment for this course.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Formative Assessment Strategy</label>
            <textarea name="formativeStrategy" value={form.formativeStrategy} onChange={handleFormChange} rows={3}
              placeholder="How will formative (during learning) assessment be conducted? Frequency, methods, feedback approach..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Summative Assessment Strategy</label>
            <textarea name="summativeStrategy" value={form.summativeStrategy} onChange={handleFormChange} rows={3}
              placeholder="How will summative (end of learning) assessment be conducted? Methods, pass standards, re-attempt policy..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Assessor Qualifications</label>
            <textarea name="assessorQualifications" value={form.assessorQualifications} onChange={handleFormChange} rows={2}
              placeholder="Required qualifications and experience for assessors conducting summative assessment..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Assessment Notes</label>
            <textarea name="assessmentNotes" value={form.assessmentNotes} onChange={handleFormChange} rows={2}
              placeholder="Any additional assessment considerations, reasonable adjustments policy, appeals process..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Programme Structure — Module Builder */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.3 — Programme Structure</h3>
        <p className="text-sm text-gray-500 mb-4">
          Build the course module structure. Drag modules to reorder. Assign LOs from Des3 to each module.
        </p>

        <div className="flex gap-6 min-h-[600px]">

          {/* Left — Module List */}
          <div className="w-64 flex-shrink-0 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-700">Modules</h4>
              <button onClick={handleAddModule}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium">
                + Add Module
              </button>
            </div>

            {modules.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-xl">
                No modules yet.<br />Click + Add Module.
              </div>
            )}

            {modules.map((mod, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={handleDrop}
                onClick={() => setSelectedModuleIndex(index)}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                  selectedModuleIndex === index
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="text-gray-300 text-xs mt-0.5 cursor-grab">⠿</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500">Module {mod.sequence}</p>
                    <p className="text-sm text-gray-800 truncate">
                      {mod.moduleName || <span className="text-gray-400 italic">Untitled</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDeleteModule(index) }}
                  className="text-gray-300 hover:text-red-400 transition text-xs ml-2 mt-0.5 flex-shrink-0"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Right — Module Detail */}
          <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
            {selectedModule === null ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                {modules.length === 0 ? "Add a module to get started." : "Select a module to edit it."}
              </div>
            ) : (
              <div className="overflow-y-auto h-full p-6 space-y-6">

                {/* Module Header */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg flex-shrink-0">
                    Module {selectedModule.sequence}
                  </span>
                  <input type="text" value={selectedModule.moduleId}
                    onChange={e => handleModuleChange("moduleId", e.target.value)}
                    placeholder="ID e.g. 1, 1.1"
                    className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" value={selectedModule.moduleName}
                    onChange={e => handleModuleChange("moduleName", e.target.value)}
                    placeholder="Module name..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* LO Assignment */}
                {availableLOs.length > 0 && (
                  <div>
                    <label className={labelClass}>Learning Outcomes in this Module</label>
                    <div className="grid grid-cols-1 gap-2 mt-1">
                      {availableLOs.map(lo => {
                        const assigned = (selectedModule.loAssignments || []).includes(lo.id || `lo-${lo.sequence}`)
                        const loId = lo.id || `lo-${lo.sequence}`
                        return (
                          <label key={loId} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition text-sm ${
                            assigned ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          }`}>
                            <input type="checkbox" checked={assigned}
                              onChange={() => handleLOAssignment(loId)}
                              className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500 flex-shrink-0">LO {lo.sequence}</span>
                            <span className="text-gray-700 truncate">{lo.loName || "Untitled"}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Module Details */}
                <div>
                  <label className={labelClass}>Module Content Overview</label>
                  <textarea value={selectedModule.moduleContent}
                    onChange={e => handleModuleChange("moduleContent", e.target.value)} rows={3}
                    placeholder="Describe the content covered in this module..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pre-requisite Modules</label>
                  <input type="text" value={selectedModule.prerequisiteModules}
                    onChange={e => handleModuleChange("prerequisiteModules", e.target.value)}
                    placeholder="e.g. Module 1 — or None" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Delivery Method</label>
                  <select value={selectedModule.deliveryMethod}
                    onChange={e => handleModuleChange("deliveryMethod", e.target.value)} className={inputClass}>
                    {DELIVERY_METHODS.map(m => <option key={m} value={m}>{DELIVERY_LABELS[m]}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Key Resources</label>
                  <textarea value={selectedModule.keyResources}
                    onChange={e => handleModuleChange("keyResources", e.target.value)} rows={2}
                    placeholder="Equipment, materials and facilities required for this module..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>WHS Requirements</label>
                  <textarea value={selectedModule.whsRequirements}
                    onChange={e => handleModuleChange("whsRequirements", e.target.value)} rows={2}
                    placeholder="WHS considerations specific to this module..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Additional Comments</label>
                  <textarea value={selectedModule.additionalComments}
                    onChange={e => handleModuleChange("additionalComments", e.target.value)} rows={2}
                    placeholder="Any additional notes for this module..." className={inputClass} />
                </div>

                {/* Module Duration */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Module Duration</p>
                  <div className="space-y-3">
                    {[
                      { label: "On Job Training",     hf: "durationOnJobHours",           df: "durationOnJobDays" },
                      { label: "Off Job Training",    hf: "durationOffJobHours",          df: "durationOffJobDays" },
                      { label: "Summative (On Job)",  hf: "durationSummativeOnJobHours",  df: "durationSummativeOnJobDays" },
                      { label: "Summative (Off Job)", hf: "durationSummativeOffJobHours", df: "durationSummativeOffJobDays" },
                      { label: "Formative (Off Job)", hf: "durationFormativeOffJobHours", df: "durationFormativeOffJobDays" },
                    ].map(row => (
                      <div key={row.label} className="grid grid-cols-3 gap-3 items-center">
                        <span className="text-sm text-gray-600">{row.label}</span>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Hours</label>
                          <input type="number" min="0" step="0.5" value={selectedModule[row.hf]}
                            onChange={e => handleModuleChange(row.hf, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Days</label>
                          <input type="number" min="0" step="0.5" value={selectedModule[row.df]}
                            onChange={e => handleModuleChange(row.df, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Other Activity Type</label>
                        <input type="text" value={selectedModule.durationOtherType}
                          onChange={e => handleModuleChange("durationOtherType", e.target.value)}
                          placeholder="e.g. Self-study"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Hours</label>
                        <input type="number" min="0" step="0.5" value={selectedModule.durationOtherHours}
                          onChange={e => handleModuleChange("durationOtherHours", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Days</label>
                        <input type="number" min="0" step="0.5" value={selectedModule.durationOtherDays}
                          onChange={e => handleModuleChange("durationOtherDays", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formative Assessments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Formative Assessments</p>
                    <button onClick={handleAddFormative}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium">
                      + Add Formative
                    </button>
                  </div>
                  {(selectedModule.formativeAssessments || []).map((fa, faIndex) => (
                    <div key={faIndex} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">FA {faIndex + 1}</span>
                        <button onClick={() => handleDeleteFormative(faIndex)}
                          className="text-gray-300 hover:text-red-400 text-xs transition">✕</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">FA ID</label>
                          <input type="text" value={fa.faId} onChange={e => handleFormativeChange(faIndex, "faId", e.target.value)}
                            placeholder="e.g. FA1.1" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">FA Name</label>
                          <input type="text" value={fa.faName} onChange={e => handleFormativeChange(faIndex, "faName", e.target.value)}
                            placeholder="Name of the assessment..." className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">LO Assessed</label>
                        <input type="text" value={fa.loAssessed} onChange={e => handleFormativeChange(faIndex, "loAssessed", e.target.value)}
                          placeholder="e.g. LO 1, LO 2" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Method</label>
                        <select value={fa.method} onChange={e => handleFormativeChange(faIndex, "method", e.target.value)} className={inputClass}>
                          {ASSESSMENT_METHODS.map(m => <option key={m} value={m}>{ASSESSMENT_LABELS[m]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={fa.description} onChange={e => handleFormativeChange(faIndex, "description", e.target.value)}
                          rows={2} placeholder="Describe the assessment task..." className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Assessment Criteria</label>
                        <textarea value={fa.assessmentCriteria} onChange={e => handleFormativeChange(faIndex, "assessmentCriteria", e.target.value)}
                          rows={2} placeholder="What constitutes satisfactory performance..." className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Hours)</label>
                          <input type="number" min="0" step="0.5" value={fa.durationHours}
                            onChange={e => handleFormativeChange(faIndex, "durationHours", e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Days)</label>
                          <input type="number" min="0" step="0.5" value={fa.durationDays}
                            onChange={e => handleFormativeChange(faIndex, "durationDays", e.target.value)} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summative Assessments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Summative Assessments</p>
                    <button onClick={handleAddSummative}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium">
                      + Add Summative
                    </button>
                  </div>
                  {(selectedModule.summativeAssessments || []).map((sa, saIndex) => (
                    <div key={saIndex} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">SA {saIndex + 1}</span>
                        <button onClick={() => handleDeleteSummative(saIndex)}
                          className="text-gray-300 hover:text-red-400 text-xs transition">✕</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">SA ID</label>
                          <input type="text" value={sa.saId} onChange={e => handleSummativeChange(saIndex, "saId", e.target.value)}
                            placeholder="e.g. SA1.1" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">SA Name</label>
                          <input type="text" value={sa.saName} onChange={e => handleSummativeChange(saIndex, "saName", e.target.value)}
                            placeholder="Name of the assessment..." className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">LO Assessed</label>
                        <input type="text" value={sa.loAssessed} onChange={e => handleSummativeChange(saIndex, "loAssessed", e.target.value)}
                          placeholder="e.g. LO 1, LO 2" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Method</label>
                        <select value={sa.method} onChange={e => handleSummativeChange(saIndex, "method", e.target.value)} className={inputClass}>
                          {ASSESSMENT_METHODS.map(m => <option key={m} value={m}>{ASSESSMENT_LABELS[m]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={sa.description} onChange={e => handleSummativeChange(saIndex, "description", e.target.value)}
                          rows={2} placeholder="Describe the assessment task..." className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Assessment Criteria</label>
                        <textarea value={sa.assessmentCriteria} onChange={e => handleSummativeChange(saIndex, "assessmentCriteria", e.target.value)}
                          rows={2} placeholder="What constitutes satisfactory performance..." className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">UoC Reference</label>
                        <input type="text" value={sa.uocReference} onChange={e => handleSummativeChange(saIndex, "uocReference", e.target.value)}
                          placeholder="VET UoC code or N/A" className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Hours)</label>
                          <input type="number" min="0" step="0.5" value={sa.durationHours}
                            onChange={e => handleSummativeChange(saIndex, "durationHours", e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Days)</label>
                          <input type="number" min="0" step="0.5" value={sa.durationDays}
                            onChange={e => handleSummativeChange(saIndex, "durationDays", e.target.value)} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Methods and Media */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.4 — Learning Methods and Media</h3>
        <p className="text-sm text-gray-500 mb-4">Describe the primary delivery approach and any media or technology requirements.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Primary Delivery Method</label>
            <select name="primaryDeliveryMethod" value={form.primaryDeliveryMethod} onChange={handleFormChange} className={inputClass}>
              {DELIVERY_METHODS.map(m => <option key={m} value={m}>{DELIVERY_LABELS[m]}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Delivery Notes</label>
            <textarea name="deliveryNotes" value={form.deliveryNotes} onChange={handleFormChange} rows={2}
              placeholder="Any specific delivery considerations, constraints or flexibility..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Learning Methods</label>
            <textarea name="learningMethods" value={form.learningMethods} onChange={handleFormChange} rows={3}
              placeholder="Instructional strategies and learning activities — lecture, discussion, practical exercise, scenario-based learning..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Media Requirements</label>
            <textarea name="mediaRequirements" value={form.mediaRequirements} onChange={handleFormChange} rows={2}
              placeholder="AV equipment, eLearning platforms, simulation systems, printed materials..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Course Duration */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.5 — Course Duration</h3>
        <p className="text-sm text-gray-500 mb-4">Overall course duration totals.</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Total On Job Hours</label>
            <input type="number" min="0" step="0.5" name="totalOnJobHours" value={form.totalOnJobHours} onChange={handleFormChange}
              placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Total Off Job Hours</label>
            <input type="number" min="0" step="0.5" name="totalOffJobHours" value={form.totalOffJobHours} onChange={handleFormChange}
              placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Total Days</label>
            <input type="number" min="0" step="0.5" name="totalDays" value={form.totalDays} onChange={handleFormChange}
              placeholder="0" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Evaluation Plan */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.6 — Evaluation Plan</h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe how the course will be evaluated at each Kirkpatrick level. Leave blank if a level is not applicable.
        </p>
        <div className="space-y-4">
          {KIRKPATRICK_LEVELS.map((level, index) => (
            <div key={level.value} className="border border-gray-200 rounded-xl p-5">
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-800">{level.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{level.desc}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Evaluation Approach</label>
                  <textarea value={evalPlan[index].planDescription}
                    onChange={e => handleEvalChange(index, "planDescription", e.target.value)} rows={2}
                    placeholder="How will this level be evaluated? Method, tools, data collected..." className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Timing</label>
                    <input type="text" value={evalPlan[index].timing}
                      onChange={e => handleEvalChange(index, "timing", e.target.value)}
                      placeholder="e.g. End of course, 3 months post-course" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Responsibility</label>
                    <input type="text" value={evalPlan[index].responsibility}
                      onChange={e => handleEvalChange(index, "responsibility", e.target.value)}
                      placeholder="Who is responsible for conducting this evaluation?" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Requirements */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des4.7 — Resource Requirements</h3>
        <p className="text-sm text-gray-500 mb-4">Identify the major resources required to deliver this course. This populates Section 3 of the LMP.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Human Resources</label>
            <textarea name="humanResources" value={form.humanResources} onChange={handleFormChange} rows={3}
              placeholder="Instructors, assessors, SMEs, administrative support — numbers, qualifications, availability..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Physical Resources</label>
            <textarea name="physicalResources" value={form.physicalResources} onChange={handleFormChange} rows={3}
              placeholder="Facilities, equipment, simulators, vehicles, training aids required..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Defence Unit Support Requirements</label>
            <textarea name="defenceSupportRequirements" value={form.defenceSupportRequirements} onChange={handleFormChange} rows={2}
              placeholder="Support required from units — personnel, equipment, range bookings, exercise support..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Financial Requirements</label>
            <textarea name="financialRequirements" value={form.financialRequirements} onChange={handleFormChange} rows={2}
              placeholder="Budget requirements for delivery — travel, accommodation, consumables, contractor support..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Other Requirements</label>
            <textarea name="otherRequirements" value={form.otherRequirements} onChange={handleFormChange} rows={2}
              placeholder="Any other resource requirements not covered above..." className={inputClass} />
          </div>
        </div>
      </div>

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
