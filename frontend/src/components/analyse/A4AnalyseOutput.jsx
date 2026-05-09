import { useState } from "react"
import { openDocument } from "./DocumentGenerator"
import { useSaveStatus } from "../../hooks/useSaveStatus"

const optionTypeLabel = {
  NO_ACTION: "No Action",
  NON_LD: "Non-Learning and Development Solution",
  LD_NON_TRAINING: "L&D Solution (Non-Training)",
  LD_TRAINING: "L&D Solution (Training)",
}

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

export default function A4AnalyseOutput({ analysePhase, onSave, onBack, onSubmit }) {
  const { withSaveStatus, buttonText, buttonClass, isDisabled } = useSaveStatus()
  const existing = analysePhase?.analyseOutput || {}
  const feasibility = analysePhase?.feasibilityReport
  const inputAnalysis = analysePhase?.inputAnalysis || {}
  const jobTaskProfile = analysePhase?.jobTaskProfile || {}
  const targetPopulation = analysePhase?.targetPopulation || {}
  const gapAnalysis = analysePhase?.gapAnalysis || {}

  const recommendedOption = feasibility?.options?.find(o => o.recommended)
  const suggestedType = recommendedOption?.optionType === "LD_TRAINING" ? "TRS" : "LDS"

  const [outputType, setOutputType] = useState(existing.outputType || suggestedType || "TRS")
  const [showPreview, setShowPreview] = useState(false)
  
  const handleSaveAndSubmit = async () => {
  await withSaveStatus(async () => {
    await onSave("analyse-output", { outputType })
    await onSubmit()
  })
}

  const enclosures = {
    TRS: [
      { ref: "AP1", title: "Analyse Phase Scoping Form", mandatory: true, generated: true },
      { ref: "AP3", title: "Job Task Profile", mandatory: true, generated: true },
      { ref: "AP5", title: "Target Population Profile", mandatory: true, generated: true },
      { ref: "AP6", title: "Gap Analysis Statement", mandatory: true, generated: true },
      { ref: "AP7", title: "Feasibility Analysis Report", mandatory: true, generated: true },
      { ref: "AP2", title: "Risk Assessment Summary", mandatory: true, generated: false },
      { ref: "AP4", title: "Job Specification", mandatory: false, generated: false },
      { ref: "AP10", title: "Business Case", mandatory: false, generated: false },
      { ref: "AP11", title: "Implementation Schedule", mandatory: false, generated: false },
    ],
    LDS: [
      { ref: "AP1", title: "Analyse Phase Scoping Form", mandatory: true, generated: true },
      { ref: "AP3", title: "Job Task Profile", mandatory: true, generated: true },
      { ref: "AP5", title: "Target Population Profile", mandatory: true, generated: true },
      { ref: "AP6", title: "Gap Analysis Statement", mandatory: true, generated: true },
      { ref: "AP7", title: "Feasibility Analysis Report", mandatory: true, generated: true },
      { ref: "AP2", title: "Risk Assessment Summary", mandatory: true, generated: false },
      { ref: "AP4", title: "Job Specification", mandatory: false, generated: false },
      { ref: "AP10", title: "Business Case", mandatory: false, generated: false },
      { ref: "AP11", title: "Implementation Schedule", mandatory: false, generated: false },
    ]
  }

  const completionChecks = [
    { label: "A1 — Input Analysis completed", done: !!inputAnalysis?.projectBackground },
    { label: "A2 — Job Task Profile completed", done: !!jobTaskProfile?.jobTitle },
    { label: "A2 — Target Population Profile completed", done: !!targetPopulation?.jobDesignation },
    { label: "A2 — Gap Analysis Statement completed", done: !!gapAnalysis?.gapSummary },
    { label: "A3 — Feasibility Report completed", done: !!feasibility?.recommendation },
  ]

  const allComplete = completionChecks.every(c => c.done)

  return (
    <div className="space-y-8">

      {/* Completion Check */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Phase Completion Check</h3>
        <p className="text-sm text-gray-500 mb-4">
          Review the completion status of each Analyse Phase sub-stage before generating output.
        </p>
        <div className="space-y-2">
          {completionChecks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                check.done ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                check.done ? "bg-green-500 text-white" : "bg-yellow-400 text-white"
              }`}>
                {check.done ? "✓" : "!"}
              </span>
              <span className={`text-sm ${check.done ? "text-green-700" : "text-yellow-700"}`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
        {!allComplete && (
          <p className="text-sm text-yellow-600 mt-3">
            ⚠ Some sections are incomplete. You can still submit but the generated documents may have gaps.
          </p>
        )}
      </div>

      {/* Output Type Selection */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Select Output Type</h3>
        <p className="text-sm text-gray-500 mb-4">
          Based on your Feasibility Analysis, select the appropriate output document.
        </p>
        {recommendedOption && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
            Based on your recommended option ({recommendedOption.optionType.replace(/_/g, " ")}),
            we suggest generating a <strong>{suggestedType}</strong>.
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setOutputType("TRS")}
            className={`p-5 rounded-xl border-2 text-left transition ${
              outputType === "TRS" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-semibold text-gray-800 mb-1">AP9 — Training Requirement Specification (TRS)</div>
            <div className="text-xs text-gray-500">
              Use when a training-based L&D solution is required (face-to-face, distance learning, simulation etc)
            </div>
          </button>
          <button
            onClick={() => setOutputType("LDS")}
            className={`p-5 rounded-xl border-2 text-left transition ${
              outputType === "LDS" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-semibold text-gray-800 mb-1">AP8 — Learning and Development Strategy (LDS)</div>
            <div className="text-xs text-gray-500">
              Use when a non-training L&D solution is recommended (coaching, mentoring, job rotation etc)
            </div>
          </button>
        </div>
      </div>

      {/* Enclosures with View buttons */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Required Enclosures — {outputType}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          View each document before submitting. Generated documents open in a new tab and can be printed or saved as PDF.
        </p>
        <div className="space-y-2">
          {enclosures[outputType].map((enc, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                enc.mandatory ? "bg-gray-50 border-gray-200" : "bg-white border-dashed border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-8">{enc.ref}</span>
                <span className="text-sm text-gray-700">{enc.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  enc.mandatory ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {enc.mandatory ? "Mandatory" : "Optional"}
                </span>
                {enc.generated ? (
                  <button
                    onClick={() => openDocument(enc.ref, analysePhase)}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    View →
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-1">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full TRS/LDS Preview */}
      {allComplete && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">
              📄 Preview {outputType} — {analysePhase?.project?.title}
            </span>
            <span className="text-gray-400 text-sm">{showPreview ? "Hide ▲" : "Show ▼"}</span>
          </button>

          {showPreview && (
            <div className="p-6 space-y-6 text-sm text-gray-700">

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div><span className="font-medium">Document:</span> {outputType === "TRS" ? "AP9 — Training Requirements Specification" : "AP8 — Learning and Development Strategy"}</div>
                <div><span className="font-medium">Project:</span> {analysePhase?.project?.title}</div>
                <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-AU')}</div>
                <div><span className="font-medium">Output Type:</span> {outputType}</div>
              </div>

              <div>
                <p className="font-bold text-gray-900 text-base mb-3">A1 — Input Analysis</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Training Triggers</p>
                    <ul className="list-disc list-inside space-y-1">
                      {triggers.filter(t => inputAnalysis[t.key]).map(t => (
                        <li key={t.key}>{t.label}</li>
                      ))}
                    </ul>
                  </div>
                  {[
                    ["Project Background", inputAnalysis.projectBackground],
                    ["Current Status", inputAnalysis.currentStatus],
                    ["Linked Activities", inputAnalysis.linkedActivities],
                    ["Required Deliverables", inputAnalysis.requiredDeliverables],
                    ["Stakeholder Needs", inputAnalysis.stakeholderNeeds],
                    ["Time Factors", inputAnalysis.timeFactors],
                    ["Resources Required", inputAnalysis.resourcesRequired],
                    ["Roles and Responsibilities", inputAnalysis.rolesResponsibilities],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <p className="font-semibold text-gray-800 mb-1">{label}</p>
                      <p className="whitespace-pre-wrap">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div>
                <p className="font-bold text-gray-900 text-base mb-3">A2 — Job Task Profile</p>
                <div className="space-y-3">
                  <div><span className="font-semibold">Job Title:</span> {jobTaskProfile.jobTitle}</div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Job Description</p>
                    <p className="whitespace-pre-wrap">{jobTaskProfile.jobDescription}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Job Tasks</p>
                    <div className="space-y-3">
                      {(jobTaskProfile.tasks || []).map((task, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="font-medium mb-1">Task {i + 1}: {task.taskDescription}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div><span className="text-gray-500">Difficulty:</span> {task.difficulty?.replace("_", " ")}</div>
                            <div><span className="text-gray-500">Frequency:</span> {task.frequency}</div>
                            <div><span className="text-gray-500">Importance:</span> {task.importance}</div>
                          </div>
                          {task.conditions && <p className="text-xs mb-1"><span className="text-gray-500">Conditions:</span> {task.conditions}</p>}
                          {task.standards && <p className="text-xs"><span className="text-gray-500">Standards:</span> {task.standards}</p>}
                          {task.subTasks?.length > 0 && (
                            <ul className="list-disc list-inside text-xs mt-2 space-y-0.5">
                              {task.subTasks.map((st, si) => <li key={si}>{st.description}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <p className="font-bold text-gray-900 text-base mb-3">A2 — Target Population Profile</p>
                <div className="space-y-3">
                  {[
                    ["Job Designation", targetPopulation.jobDesignation],
                    ["Situation", targetPopulation.jobSituation],
                    ["Job Description", targetPopulation.jobDescription],
                    ["Function", targetPopulation.jobFunction],
                    ["Job Owner", targetPopulation.jobOwner],
                    ["Work Environment", targetPopulation.workEnvironment],
                    ["Employment Classification and Experience", targetPopulation.employmentClassification],
                    ["Geographic Distribution", targetPopulation.geographicDistribution],
                    ["Qualifications", targetPopulation.qualifications],
                    ["Aptitudes", targetPopulation.aptitudes],
                    ["Competencies", targetPopulation.competencies],
                    ["Academic Ability", targetPopulation.academicAbility],
                    ["Physical Characteristics", targetPopulation.physicalCharacteristics],
                    ["Learning Methods", targetPopulation.learningMethods],
                    ["Motivation", targetPopulation.motivation],
                    ["Other Characteristics", targetPopulation.otherCharacteristics],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <p className="font-semibold text-gray-800 mb-1">{label}</p>
                      <p className="whitespace-pre-wrap">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div>
                <p className="font-bold text-gray-900 text-base mb-3">A2 — Gap Analysis Statement</p>
                <div className="space-y-3">
                  <div><span className="font-semibold">Performance Gap:</span> {gapAnalysis.gapExists ? "Yes" : "No"}</div>
                  {gapAnalysis.gapExists && <div><span className="font-semibold">Gap Type:</span> {gapAnalysis.gapType?.replace("_", " ")}</div>}
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Gap Summary</p>
                    <p className="whitespace-pre-wrap">{gapAnalysis.gapSummary}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Recommendation</p>
                    <p className="whitespace-pre-wrap">{gapAnalysis.recommendation}</p>
                  </div>
                  {(gapAnalysis.gapItems || []).length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">Gap Analysis Items</p>
                      <div className="space-y-2">
                        {gapAnalysis.gapItems.map((item, i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs">
                            <p className="font-medium mb-1">{item.taskReference && `${item.taskReference} — `}{item.taskDescription}</p>
                            {item.difRating && <p><span className="text-gray-500">DIF:</span> {item.difRating}</p>}
                            {item.targetPopulationCapacity && <p><span className="text-gray-500">TP Capacity:</span> {item.targetPopulationCapacity}</p>}
                            {item.identifiedGap && <p><span className="text-gray-500">Gap:</span> {item.identifiedGap}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <hr />

              <div>
                <p className="font-bold text-gray-900 text-base mb-3">A3 — Feasibility Analysis Report</p>
                <div className="space-y-3">
                  {feasibility?.analysisProcess && (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Analysis Process</p>
                      <p className="whitespace-pre-wrap">{feasibility.analysisProcess}</p>
                    </div>
                  )}
                  {feasibility?.unitsConsulted && (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Units / Organisations Consulted</p>
                      <p className="whitespace-pre-wrap">{feasibility.unitsConsulted}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Options Considered</p>
                    <div className="space-y-3">
                      {(feasibility?.options || []).map((option, i) => (
                        <div key={i} className={`border rounded-lg p-3 ${option.recommended ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-xs">Option {i + 1} — {optionTypeLabel[option.optionType] || option.optionType}</p>
                            {option.recommended && <span className="text-xs font-medium bg-blue-600 text-white px-2 py-0.5 rounded-full">✓ Recommended</span>}
                          </div>
                          {option.optionDescription && <p className="text-xs mb-1">{option.optionDescription}</p>}
                          {option.advantages && <p className="text-xs"><span className="text-gray-500">Advantages:</span> {option.advantages}</p>}
                          {option.disadvantages && <p className="text-xs"><span className="text-gray-500">Disadvantages:</span> {option.disadvantages}</p>}
                          {option.mitigationActions && <p className="text-xs"><span className="text-gray-500">Mitigation:</span> {option.mitigationActions}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Final Recommendation</p>
                    <p className="whitespace-pre-wrap">{feasibility?.recommendation}</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Submit for Approval</h3>
        <p className="text-sm text-gray-500 mb-4">
          Submitting will generate your {outputType} and send it to your Training Manager for review and approval.
          You will not be able to edit this phase while it is under review.
        </p>
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition">
            ← Back
          </button>
          <button
  onClick={handleSaveAndSubmit}
  disabled={isDisabled}
  className={buttonClass("bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50")}
>
  {buttonText("Submit for Approval →")}
</button>
        </div>
      </div>
    </div>
  )
}
