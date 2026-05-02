import { useState } from "react"

export default function A4AnalyseOutput({ analysePhase, onSave, onBack, onSubmit, saving }) {
  const existing = analysePhase?.analyseOutput || {}
  const feasibility = analysePhase?.feasibilityReport

  const recommendedOption = feasibility?.options?.find(o => o.recommended)
  const suggestedType = recommendedOption?.optionType === "LD_TRAINING" ? "TRS" : "LDS"

  const [outputType, setOutputType] = useState(existing.outputType || suggestedType || "TRS")
  const [submitting, setSubmitting] = useState(false)

  const handleSaveAndSubmit = async () => {
    setSubmitting(true)
    try {
      await onSave("analyse-output", { outputType })
      await onSubmit()
    } finally {
      setSubmitting(false)
    }
  }

  const enclosures = {
    TRS: [
      { ref: "AP3", title: "Job Task Profile", mandatory: true },
      { ref: "AP6", title: "Gap Analysis Statement", mandatory: true },
      { ref: "AP7", title: "Feasibility Analysis Report", mandatory: true },
      { ref: "AP2", title: "Risk Assessment Summary", mandatory: true },
      { ref: "AP4", title: "Job Specification", mandatory: false },
      { ref: "AP10", title: "Business Case", mandatory: false },
      { ref: "AP11", title: "Implementation Schedule", mandatory: false },
    ],
    LDS: [
      { ref: "AP3", title: "Job Task Profile", mandatory: true },
      { ref: "AP6", title: "Gap Analysis Statement", mandatory: true },
      { ref: "AP7", title: "Feasibility Analysis Report", mandatory: true },
      { ref: "AP2", title: "Risk Assessment Summary", mandatory: true },
      { ref: "AP4", title: "Job Specification", mandatory: false },
      { ref: "AP10", title: "Business Case", mandatory: false },
      { ref: "AP11", title: "Implementation Schedule", mandatory: false },
    ]
  }

  const completionChecks = [
    { label: "A1 — Input Analysis completed", done: !!analysePhase?.inputAnalysis?.projectBackground },
    { label: "A2 — Job Task Profile completed", done: !!analysePhase?.jobTaskProfile?.jobTitle },
    { label: "A2 — Target Population Profile completed", done: !!analysePhase?.targetPopulation?.jobDesignation },
    { label: "A2 — Gap Analysis Statement completed", done: !!analysePhase?.gapAnalysis?.gapSummary },
    { label: "A3 — Feasibility Report completed", done: !!analysePhase?.feasibilityReport?.recommendation },
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
                check.done
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
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
              outputType === "TRS"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
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
              outputType === "LDS"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="font-semibold text-gray-800 mb-1">AP8 — Learning and Development Strategy (LDS)</div>
            <div className="text-xs text-gray-500">
              Use when a non-training L&D solution is recommended (coaching, mentoring, job rotation etc)
            </div>
          </button>
        </div>
      </div>

      {/* Enclosures */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Required Enclosures — {outputType}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          The following documents will be included with your {outputType}.
        </p>
        <div className="space-y-2">
          {enclosures[outputType].map((enc, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                enc.mandatory
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-dashed border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-8">{enc.ref}</span>
                <span className="text-sm text-gray-700">{enc.title}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                enc.mandatory
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {enc.mandatory ? "Mandatory" : "Optional"}
              </span>
            </div>
          ))}
        </div>
      </div>

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
            disabled={saving || submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : `Generate ${outputType} and Submit for Approval →`}
          </button>
        </div>
      </div>
    </div>
  )
}