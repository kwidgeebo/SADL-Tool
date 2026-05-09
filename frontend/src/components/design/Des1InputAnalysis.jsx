import { useState } from "react"
import { useSaveStatus } from "../../hooks/useSaveStatus"

const riskRatings = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

export default function Des1InputAnalysis({ designPhase, onSave, onNext, onBack }) {
  const { withSaveStatus, buttonText, buttonClass, isDisabled } = useSaveStatus()
  const existing = designPhase?.des1InputAnalysis || {}

  const [form, setForm] = useState({
    // Documents Reviewed
    trsReviewed:               existing.trsReviewed               ?? false,
    trsReference:              existing.trsReference               || "",
    jobTaskProfileReviewed:    existing.jobTaskProfileReviewed     ?? false,
    targetPopulationReviewed:  existing.targetPopulationReviewed   ?? false,
    gapAnalysisReviewed:       existing.gapAnalysisReviewed        ?? false,
    feasibilityReviewed:       existing.feasibilityReviewed        ?? false,
    otherDocsReviewed:         existing.otherDocsReviewed          ?? false,
    otherDocsDetails:          existing.otherDocsDetails           || "",

    // Stakeholders
    stakeholders:              existing.stakeholders               || "",
    smePanel:                  existing.smePanel                   || "",
    trainingAuthority:         existing.trainingAuthority          || "",
    projectSponsor:            existing.projectSponsor             || "",

    // Scope
    designRequired:            existing.designRequired             ?? true,
    scopeNotes:                existing.scopeNotes                 || "",
    designDeliverables:        existing.designDeliverables         || "",
    phasesOmitted:             existing.phasesOmitted              || "",
    rationaleOmissions:        existing.rationaleOmissions         || "",

    // Updated Risk Assessment
    riskNotes:                 existing.riskNotes                  || "",
    residualRisk:              existing.residualRisk               || "",
    overallRiskRating:         existing.overallRiskRating          || "LOW",
    mitigationActions:         existing.mitigationActions          || "",

    // Resources and Timeline
    timeFactors:               existing.timeFactors                || "",
    resourcesRequired:         existing.resourcesRequired          || "",
    rolesResponsibilities:     existing.rolesResponsibilities      || "",
    communicationProcess:      existing.communicationProcess       || "",
  })

  const [showOutput, setShowOutput] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveAndNext = async () => {
  await withSaveStatus(async () => {
    await onSave("your-endpoint", form)
  })
  onNext()
}

  const riskColour = {
    LOW:      "bg-green-100 text-green-800 border-green-300",
    MEDIUM:   "bg-yellow-100 text-yellow-800 border-yellow-300",
    HIGH:     "bg-orange-100 text-orange-800 border-orange-300",
    CRITICAL: "bg-red-100 text-red-800 border-red-300",
  }

  return (
    <div className="space-y-8">

      {/* Documents Reviewed */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Des1.1 — Documents Reviewed
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Confirm which Analyse Phase outputs have been reviewed before commencing design.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "trsReviewed",              label: "Training Requirements Statement (TRS)" },
            { key: "jobTaskProfileReviewed",   label: "Job Task Profile (AP3)" },
            { key: "targetPopulationReviewed", label: "Target Population Profile (AP5)" },
            { key: "gapAnalysisReviewed",      label: "Gap Analysis Statement (AP6)" },
            { key: "feasibilityReviewed",      label: "Feasibility Analysis Report (AP7)" },
            { key: "otherDocsReviewed",        label: "Other Documents" },
          ].map(doc => (
            <label
              key={doc.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                form[doc.key]
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                name={doc.key}
                checked={form[doc.key]}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{doc.label}</span>
            </label>
          ))}
        </div>

        {form.trsReviewed && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TRS Reference / Version
            </label>
            <input
              type="text"
              name="trsReference"
              value={form.trsReference}
              onChange={handleChange}
              placeholder="e.g. JP2072 BMS Operator TRS v1.2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {form.otherDocsReviewed && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Documents Details
            </label>
            <textarea
              name="otherDocsDetails"
              value={form.otherDocsDetails}
              onChange={handleChange}
              rows={2}
              placeholder="List any other documents reviewed prior to commencing design..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Stakeholders */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Des1.2 — Stakeholders
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify the key people involved in the Design Phase.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stakeholders</label>
            <textarea
              name="stakeholders"
              value={form.stakeholders}
              onChange={handleChange}
              rows={2}
              placeholder="List key stakeholders and their interests in this design activity..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SME Panel</label>
            <textarea
              name="smePanel"
              value={form.smePanel}
              onChange={handleChange}
              rows={2}
              placeholder="Identify SME panel members — names, roles and technical authority..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Training Authority</label>
            <input
              type="text"
              name="trainingAuthority"
              value={form.trainingAuthority}
              onChange={handleChange}
              placeholder="e.g. Army ITEC, RAAF Air Commander Australia"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Sponsor</label>
            <input
              type="text"
              name="projectSponsor"
              value={form.projectSponsor}
              onChange={handleChange}
              placeholder="e.g. Army Headquarters, Signals Directorate"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scope Confirmation */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Des1.3 — Scope Confirmation
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Confirm the scope of the Design Phase and note any stages being omitted.
        </p>
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="designRequired"
              checked={form.designRequired}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Design Phase is required in full</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Design Deliverables</label>
            <textarea
              name="designDeliverables"
              value={form.designDeliverables}
              onChange={handleChange}
              rows={2}
              placeholder="List the Design Phase outputs to be produced (DesP1–DesP4)..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phases or Steps Omitted</label>
            <textarea
              name="phasesOmitted"
              value={form.phasesOmitted}
              onChange={handleChange}
              rows={2}
              placeholder="Note any Design Phase steps being omitted (e.g. Mapping Matrix — no formal qualification being awarded)..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rationale for Omissions</label>
            <textarea
              name="rationaleOmissions"
              value={form.rationaleOmissions}
              onChange={handleChange}
              rows={2}
              placeholder="Explain why any steps are being omitted..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scope Notes</label>
            <textarea
              name="scopeNotes"
              value={form.scopeNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Any additional scope notes or constraints relevant to this Design Phase..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Updated Risk Assessment */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Des1.4 — Updated Risk Assessment
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Review and update the risk assessment from the Analyse Phase for the Design context.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Notes</label>
            <textarea
              name="riskNotes"
              value={form.riskNotes}
              onChange={handleChange}
              rows={3}
              placeholder="Describe any risks identified for the Design Phase — resourcing, timeline, SME availability, technical complexity..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mitigation Actions</label>
            <textarea
              name="mitigationActions"
              value={form.mitigationActions}
              onChange={handleChange}
              rows={2}
              placeholder="Describe actions to mitigate identified risks..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Residual Risk</label>
            <textarea
              name="residualRisk"
              value={form.residualRisk}
              onChange={handleChange}
              rows={2}
              placeholder="Describe the residual risk after mitigation actions are applied..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Risk Rating</label>
            <div className="flex gap-3 flex-wrap">
              {riskRatings.map(rating => (
                <label
                  key={rating}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition text-sm font-medium ${
                    form.overallRiskRating === rating
                      ? riskColour[rating]
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="overallRiskRating"
                    value={rating}
                    checked={form.overallRiskRating === rating}
                    onChange={handleChange}
                    className="w-3.5 h-3.5"
                  />
                  {rating}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resources and Timeline */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Des1.5 — Resources and Timeline
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Confirm resource availability and key timeframes for the Design Phase.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Factors</label>
            <textarea
              name="timeFactors"
              value={form.timeFactors}
              onChange={handleChange}
              rows={2}
              placeholder="Key deadlines, milestones and rationale..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resources Required</label>
            <textarea
              name="resourcesRequired"
              value={form.resourcesRequired}
              onChange={handleChange}
              rows={2}
              placeholder="Personnel, budget, equipment and tooling needed for the Design Phase..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles and Responsibilities</label>
            <textarea
              name="rolesResponsibilities"
              value={form.rolesResponsibilities}
              onChange={handleChange}
              rows={2}
              placeholder="Lead Designer, SME Panel, Training Authority, Review Authority..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Communication Process</label>
            <textarea
              name="communicationProcess"
              value={form.communicationProcess}
              onChange={handleChange}
              rows={2}
              placeholder="Review gates, SME consultation approach, approval notifications..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* DesP1 Output Preview */}
      {existing.stakeholders && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">📄 View DesP1 — Design Phase Scoping Form</span>
            <span className="text-gray-400 text-sm">{showOutput ? "Hide ▲" : "Show ▼"}</span>
          </button>

          {showOutput && (
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Project:</span> {designPhase?.project?.title}</div>
                <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString("en-AU")}</div>
              </div>

              <hr />

              <div>
                <p className="font-semibold text-gray-800 mb-1">Documents Reviewed</p>
                <ul className="list-disc list-inside space-y-1">
                  {existing.trsReviewed              && <li>Training Requirements Statement (TRS){existing.trsReference ? ` — ${existing.trsReference}` : ""}</li>}
                  {existing.jobTaskProfileReviewed    && <li>Job Task Profile (AP3)</li>}
                  {existing.targetPopulationReviewed  && <li>Target Population Profile (AP5)</li>}
                  {existing.gapAnalysisReviewed       && <li>Gap Analysis Statement (AP6)</li>}
                  {existing.feasibilityReviewed       && <li>Feasibility Analysis Report (AP7)</li>}
                  {existing.otherDocsReviewed         && <li>Other: {existing.otherDocsDetails}</li>}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-1">Stakeholders</p>
                <p className="whitespace-pre-wrap">{existing.stakeholders}</p>
              </div>

              {existing.smePanel && (
                <div>
                  <p className="font-semibold text-gray-800 mb-1">SME Panel</p>
                  <p className="whitespace-pre-wrap">{existing.smePanel}</p>
                </div>
              )}

              {existing.trainingAuthority && (
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Training Authority</p>
                  <p>{existing.trainingAuthority}</p>
                </div>
              )}

              {existing.projectSponsor && (
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Project Sponsor</p>
                  <p>{existing.projectSponsor}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-800 mb-1">Scope</p>
                <p className="whitespace-pre-wrap">{existing.scopeNotes}</p>
                {existing.designDeliverables && (
                  <>
                    <p className="font-semibold text-gray-800 mt-2 mb-1">Design Deliverables</p>
                    <p className="whitespace-pre-wrap">{existing.designDeliverables}</p>
                  </>
                )}
                {existing.phasesOmitted && (
                  <>
                    <p className="font-semibold text-gray-800 mt-2 mb-1">Steps Omitted</p>
                    <p className="whitespace-pre-wrap">{existing.phasesOmitted}</p>
                    <p className="font-semibold text-gray-800 mt-2 mb-1">Rationale</p>
                    <p className="whitespace-pre-wrap">{existing.rationaleOmissions}</p>
                  </>
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-1">Risk Assessment</p>
                <p className="whitespace-pre-wrap">{existing.riskNotes}</p>
                {existing.mitigationActions && (
                  <>
                    <p className="font-semibold text-gray-800 mt-2 mb-1">Mitigation Actions</p>
                    <p className="whitespace-pre-wrap">{existing.mitigationActions}</p>
                  </>
                )}
                {existing.residualRisk && (
                  <>
                    <p className="font-semibold text-gray-800 mt-2 mb-1">Residual Risk</p>
                    <p className="whitespace-pre-wrap">{existing.residualRisk}</p>
                  </>
                )}
                <div className="mt-2">
                  <span className="font-medium">Overall Risk Rating: </span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                    { LOW: "bg-green-100 text-green-800 border-green-300",
                      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
                      HIGH: "bg-orange-100 text-orange-800 border-orange-300",
                      CRITICAL: "bg-red-100 text-red-800 border-red-300"
                    }[existing.overallRiskRating] || ""
                  }`}>
                    {existing.overallRiskRating}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-1">Resources and Timeline</p>
                {existing.timeFactors && <p className="whitespace-pre-wrap mb-2"><span className="font-medium">Time Factors: </span>{existing.timeFactors}</p>}
                {existing.resourcesRequired && <p className="whitespace-pre-wrap mb-2"><span className="font-medium">Resources Required: </span>{existing.resourcesRequired}</p>}
                {existing.rolesResponsibilities && <p className="whitespace-pre-wrap mb-2"><span className="font-medium">Roles and Responsibilities: </span>{existing.rolesResponsibilities}</p>}
                {existing.communicationProcess && <p className="whitespace-pre-wrap"><span className="font-medium">Communication Process: </span>{existing.communicationProcess}</p>}
              </div>
            </div>
          )}
        </div>
      )}

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
