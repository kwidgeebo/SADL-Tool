import { useState } from "react"

const DELIVERY_LABELS = {
  INSTRUCTOR_LED: "Instructor Led", SELF_PACED: "Self Paced", BLENDED: "Blended",
  ON_JOB: "On Job", SIMULATION: "Simulation", E_LEARNING: "eLearning", OTHER: "Other",
}
const TRAINING_LEVEL_LABELS = {
  LEVEL_1: "Level 1 — Awareness",
  LEVEL_2: "Level 2 — Supervised Performance",
  LEVEL_3: "Level 3 — Unsupervised Performance",
  LEVEL_4: "Level 4 — Instructional Ability",
}
const KIRKPATRICK_LABELS = {
  LEVEL_1_REACTION:  "Level 1 — Reaction",
  LEVEL_2_LEARNING:  "Level 2 — Learning",
  LEVEL_3_BEHAVIOUR: "Level 3 — Behaviour",
  LEVEL_4_RESULTS:   "Level 4 — Results",
}
const ASSESSMENT_LABELS = {
  OBSERVATION: "Observation", WRITTEN_TEST: "Written Test", PRACTICAL_EXERCISE: "Practical Exercise",
  PORTFOLIO: "Portfolio", ORAL_QUESTIONING: "Oral Questioning", SIMULATION_EXERCISE: "Simulation Exercise", OTHER: "Other",
}

const SectionHeader = ({ number, title }) => (
  <div className="mb-6">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Section {number}</p>
    <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2">{title}</h2>
  </div>
)

const Field = ({ label, value }) => (
  value ? (
    <div className="mb-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  ) : null
)

const Table = ({ headers, rows, placeholder }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {headers.map(h => (
            <th key={h} className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-300 px-3 py-2 text-gray-800 align-top">{cell}</td>
            ))}
          </tr>
        )) : (
          <tr>
            <td colSpan={headers.length} className="border border-gray-300 px-3 py-4 text-center text-gray-400 italic text-xs">
              {placeholder || "No data entered"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default function Des5Output({ designPhase, onSave, onBack, saving }) {
  const [submitting, setSubmitting] = useState(false)

  const des1 = designPhase?.des1InputAnalysis || {}
  const des2 = designPhase?.des2Environments || {}
  const des3 = designPhase?.des3LearningOutcomes || {}
  const des4 = designPhase?.des4CourseStructure || {}
  const los = des3?.learningOutcomes || []
  const modules = des4?.modules || []
  const evalPlan = des4?.evaluationPlan || []
  const project = designPhase?.project || {}

  const today = new Date().toLocaleDateString("en-AU")

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSave("des5-output", { approvalStatus: "PENDING" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium">Draft Learning Management Package</p>
        <p className="text-xs text-blue-600 mt-0.5">
          Review the complete Draft LMP below. When satisfied, submit for approval. All data is drawn from Des1–Des4.
        </p>
      </div>

      {/* LMP DOCUMENT */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        {/* Cover */}
        <div className="bg-gray-900 text-white px-8 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Learning Management Package</p>
          <h1 className="text-2xl font-bold mb-1">{project.title || "Untitled Course"}</h1>
          <p className="text-gray-400 text-sm">{des4.courseDescription || ""}</p>
          <div className="mt-6 grid grid-cols-3 gap-6 text-xs">
            <div><p className="text-gray-500 mb-0.5">Training Authority</p><p className="text-white">{des1.trainingAuthority || "—"}</p></div>
            <div><p className="text-gray-500 mb-0.5">Version</p><p className="text-white">Draft v0.1</p></div>
            <div><p className="text-gray-500 mb-0.5">Date</p><p className="text-white">{today}</p></div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-12">

          {/* ===== SECTION 1 — Learning Management Information ===== */}
          <div>
            <SectionHeader number="1" title="Learning Management Information" />

            {/* Course Data */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Course Data Sheet</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <Field label="Course Aim" value={des4.courseAim} />
                <Field label="Course Type" value={des4.courseType} />
                <Field label="Course Level" value={des4.courseLevel} />
                <Field label="Primary Delivery Method" value={DELIVERY_LABELS[des4.primaryDeliveryMethod] || des4.primaryDeliveryMethod} />
                <Field label="Minimum Students" value={des4.minStudents} />
                <Field label="Maximum Students" value={des4.maxStudents} />
                <Field label="Total Off Job Hours" value={des4.totalOffJobHours} />
                <Field label="Total On Job Hours" value={des4.totalOnJobHours} />
                <Field label="Total Duration (Days)" value={des4.totalDays} />
                <Field label="Security Clearance" value={des4.securityClearance} />
              </div>
              <div className="mt-3">
                <Field label="Course Description" value={des4.courseDescription} />
                <Field label="Course Overview" value={des4.courseOverview} />
              </div>
            </div>

            {/* Learning Outcomes Summary */}
            {los.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Learning Outcomes</h3>
                <Table
                  headers={["LO", "Learning Outcome", "Training Level", "Delivery Method"]}
                  rows={los.map(lo => [
                    `LO ${lo.sequence}`,
                    lo.loName || "—",
                    TRAINING_LEVEL_LABELS[lo.trainingLevel] || lo.trainingLevel,
                    DELIVERY_LABELS[lo.deliveryMethod] || lo.deliveryMethod,
                  ])}
                />
              </div>
            )}

            {/* Summative Assessments Summary */}
            {modules.some(m => (m.summativeAssessments || []).length > 0) && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Summative Assessments</h3>
                <Table
                  headers={["SA ID", "Assessment Name", "LO Assessed", "Method", "Duration"]}
                  rows={modules.flatMap(m => (m.summativeAssessments || []).map(sa => [
                    sa.saId || "—",
                    sa.saName || "—",
                    sa.loAssessed || "—",
                    ASSESSMENT_LABELS[sa.method] || sa.method,
                    sa.durationHours ? `${sa.durationHours} hrs` : "—",
                  ]))}
                />
              </div>
            )}

            {/* Prerequisites and Targets */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Prerequisites and Targets</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <Field label="Service Pre-requisites" value={des4.servicePrerequisites} />
                <Field label="Qualification Pre-requisites" value={des4.qualificationPrerequisites} />
                <Field label="Course Targets" value={des4.courseTargets} />
                <Field label="Eligibility Details" value={des4.eligibilityDetails} />
              </div>
            </div>

            {/* Programme Course Components */}
            {modules.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Programme Course Components</h3>
                <Table
                  headers={["Module ID", "Module Name", "Delivery Method", "Off Job Hours", "Off Job Days"]}
                  rows={modules.map(m => [
                    m.moduleId || String(m.sequence),
                    m.moduleName || "—",
                    DELIVERY_LABELS[m.deliveryMethod] || m.deliveryMethod,
                    m.durationOffJobHours || "—",
                    m.durationOffJobDays || "—",
                  ])}
                />
              </div>
            )}

            {/* Training Authority and Admin */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Training Authority and Administration</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <Field label="Training Authority" value={des1.trainingAuthority} />
                <Field label="Training Authority Details" value={des4.trainingAuthorityDetails} />
                <Field label="Authority to Use" value={des4.authorityToUse} />
                <Field label="Special Instructions" value={des4.specialInstructions} />
              </div>
            </div>

            {/* Evaluation Plan */}
            {evalPlan.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Evaluation Plan</h3>
                <Table
                  headers={["Kirkpatrick Level", "Evaluation Approach", "Timing", "Responsibility"]}
                  rows={evalPlan.filter(ep => ep.planDescription).map(ep => [
                    KIRKPATRICK_LABELS[ep.kirkpatrickLevel] || ep.kirkpatrickLevel,
                    ep.planDescription || "—",
                    ep.timing || "—",
                    ep.responsibility || "—",
                  ])}
                  placeholder="No evaluation plan entries completed"
                />
              </div>
            )}

          </div>

          {/* ===== SECTION 2 — Curriculum ===== */}
          <div>
            <SectionHeader number="2" title="Curriculum" />

            {modules.map((mod, modIndex) => {
              const assignedLOs = los.filter(lo => {
                const assignments = typeof mod.loAssignments === 'string'
                  ? JSON.parse(mod.loAssignments || '[]')
                  : (mod.loAssignments || [])
                return assignments.includes(lo.id || `lo-${lo.sequence}`)
              })

              return (
                <div key={modIndex} className="mb-10">

                  {/* Module Header */}
                  <div className="bg-gray-100 rounded-xl px-6 py-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Module {mod.sequence}</span>
                      <span className="font-bold text-gray-900">{mod.moduleName || "Untitled Module"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div><span className="text-gray-500">Delivery: </span><span className="text-gray-800">{DELIVERY_LABELS[mod.deliveryMethod] || mod.deliveryMethod}</span></div>
                      <div><span className="text-gray-500">Off Job: </span><span className="text-gray-800">{mod.durationOffJobHours || "—"} hrs / {mod.durationOffJobDays || "—"} days</span></div>
                      <div><span className="text-gray-500">Pre-requisites: </span><span className="text-gray-800">{mod.prerequisiteModules || "None"}</span></div>
                    </div>
                    {mod.moduleContent && <p className="text-sm text-gray-700 mt-3">{mod.moduleContent}</p>}
                    {mod.keyResources && <div className="mt-2"><span className="text-xs text-gray-500">Key Resources: </span><span className="text-xs text-gray-700">{mod.keyResources}</span></div>}
                    {mod.whsRequirements && <div className="mt-1"><span className="text-xs text-gray-500">WHS: </span><span className="text-xs text-gray-700">{mod.whsRequirements}</span></div>}
                  </div>

                  {/* Learning Outcomes in this Module */}
                  {assignedLOs.map((lo, loIndex) => (
                    <div key={loIndex} className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
                      <div className="bg-blue-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
                        <span className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded">LO {lo.sequence}</span>
                        <span className="font-semibold text-gray-800">{lo.loName || "Untitled LO"}</span>
                        <span className="ml-auto text-xs text-gray-500">{TRAINING_LEVEL_LABELS[lo.trainingLevel]}</span>
                      </div>
                      <div className="px-6 py-4 grid grid-cols-2 gap-x-8 gap-y-3">
                        <Field label="Performance Statement" value={lo.performanceStatement} />
                        <Field label="Training Level" value={TRAINING_LEVEL_LABELS[lo.trainingLevel]} />
                        <Field label="Performance Conditions" value={lo.performanceConditions} />
                        <Field label="Delivery Method" value={DELIVERY_LABELS[lo.deliveryMethod]} />
                        <Field label="Performance Standard" value={lo.performanceStandard} />
                        <Field label="Pre-requisite LOs" value={lo.prerequisiteLOs || "None"} />
                        <Field label="Assessment Criteria" value={lo.assessmentCriteria} />
                        <Field label="Related Assessments" value={lo.relatedAssessments} />
                        <Field label="Content Summary" value={lo.contentSummary} />
                        <Field label="UoC Reference" value={lo.uocReference} />
                        <Field label="Resources" value={lo.resources} />
                        <Field label="References" value={lo.references} />
                      </div>

                      {/* LO Duration Table */}
                      <div className="px-6 pb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Duration</p>
                        <Table
                          headers={["Activity", "Hours", "Days"]}
                          rows={[
                            lo.durationOnJobHours           && ["On Job Training",       lo.durationOnJobHours,           lo.durationOnJobDays           || "—"],
                            lo.durationOffJobHours          && ["Off Job Training",       lo.durationOffJobHours,          lo.durationOffJobDays          || "—"],
                            lo.durationSummativeOnJobHours  && ["Summative (On Job)",     lo.durationSummativeOnJobHours,  lo.durationSummativeOnJobDays  || "—"],
                            lo.durationSummativeOffJobHours && ["Summative (Off Job)",    lo.durationSummativeOffJobHours, lo.durationSummativeOffJobDays || "—"],
                            lo.durationFormativeOffJobHours && ["Formative (Off Job)",    lo.durationFormativeOffJobHours, lo.durationFormativeOffJobDays || "—"],
                            lo.durationOtherHours           && [lo.durationOtherType || "Other", lo.durationOtherHours,   lo.durationOtherDays           || "—"],
                          ].filter(Boolean)}
                          placeholder="No duration entered"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Formative Assessments */}
                  {(mod.formativeAssessments || []).length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Formative Assessments</p>
                      <Table
                        headers={["FA ID", "Name", "LO Assessed", "Method", "Description", "Duration"]}
                        rows={(mod.formativeAssessments || []).map(fa => [
                          fa.faId || "—", fa.faName || "—", fa.loAssessed || "—",
                          ASSESSMENT_LABELS[fa.method] || fa.method,
                          fa.description || "—",
                          fa.durationHours ? `${fa.durationHours} hrs` : "—",
                        ])}
                      />
                    </div>
                  )}

                  {/* Summative Assessments */}
                  {(mod.summativeAssessments || []).length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Summative Assessments</p>
                      <Table
                        headers={["SA ID", "Name", "LO Assessed", "Method", "Description", "UoC Ref", "Duration"]}
                        rows={(mod.summativeAssessments || []).map(sa => [
                          sa.saId || "—", sa.saName || "—", sa.loAssessed || "—",
                          ASSESSMENT_LABELS[sa.method] || sa.method,
                          sa.description || "—",
                          sa.uocReference || "N/A",
                          sa.durationHours ? `${sa.durationHours} hrs` : "—",
                        ])}
                      />
                    </div>
                  )}

                </div>
              )
            })}

            {modules.length === 0 && (
              <p className="text-sm text-gray-400 italic">No modules have been added in Des4.</p>
            )}
          </div>

          {/* ===== SECTION 3 — Major Resource Requirements ===== */}
<div>
  <SectionHeader number="3" title="Major Resource Requirements" />
  <div className="space-y-6">

    {/* Human Resources */}
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Human Resources</h3>
      <Field label="Instructors and Assessors" value={des2.instructorAvailability} />
      <Field label="Instructor Qualifications" value={des2.instructorQualifications} />
      <Field label="Support Staff" value={des2.supportStaff} />
      <Field label="Human Resource Requirements" value={des4.humanResources} />
    </div>

    {/* Physical Resources */}
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Physical Resources</h3>
      <Field label="Facility" value={des2.facilityDescription} />
      <Field label="Location" value={des2.facilityLocation} />
      <Field label="Access" value={des2.facilityAccess} />
      <Field label="Activity Spaces" value={des2.activitySpaces} />
      <Field label="Simulator / Lab Access" value={des2.simulatorAccess} />
      <Field label="Equipment Available" value={des2.equipmentAvailable} />
      <Field label="Technology Infrastructure" value={des2.technologyInfrastructure} />
      <Field label="Existing Learning Materials" value={des2.learningMaterials} />
      <Field label="Physical Resource Requirements" value={des4.physicalResources} />
    </div>

    {/* Defence Unit Support */}
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Defence Unit Support</h3>
      <Field label="Defence Unit Support Requirements" value={des4.defenceSupportRequirements} />
    </div>

    {/* Financial */}
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Financial Requirements</h3>
      <Field label="Budget Available" value={des2.budgetAvailable} />
      <Field label="Cost Constraints" value={des2.costConstraints} />
      <Field label="Funding Source" value={des2.fundingSource} />
      <Field label="Financial Requirements" value={des4.financialRequirements} />
    </div>

    {/* Legislation and WHS */}
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Legislation and WHS</h3>
      <Field label="Relevant Legislation" value={des2.relevantLegislation} />
      <Field label="WHS Requirements" value={des2.whsRequirements} />
      <Field label="Accessibility Requirements" value={des2.accessibilityRequirements} />
      <Field label="Security Requirements" value={des2.securityRequirements} />
    </div>

    {/* Other */}
    {des4.otherRequirements && (
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Other Requirements</h3>
        <Field label="Other Requirements" value={des4.otherRequirements} />
      </div>
    )}

  </div>
</div>

          {/* ===== SECTION 4 — Learning and Assessment Materials ===== */}
          <div>
            <SectionHeader number="4" title="Learning and Assessment Materials" />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-xs text-amber-700 font-medium">To be completed in Develop Phase</p>
              <p className="text-xs text-amber-600 mt-0.5">Learning and assessment materials will be listed here once developed.</p>
            </div>
            <Table
              headers={["Document Title / Package Name", "Ver.", "Objective Reference", "Date Last Updated"]}
              rows={[]}
              placeholder="To be completed in Develop Phase"
            />
          </div>

          {/* ===== SECTION 5 — Supporting Materials ===== */}
          <div>
            <SectionHeader number="5" title="Supporting Materials" />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-xs text-amber-700 font-medium">Partially complete — additional rows to be added in Develop and Implement Phases</p>
            </div>
            <Table
              headers={["Document Title / Package Name", "Ver.", "Objective Reference", "Date Last Updated"]}
              rows={[
                ["Analyse Phase Documentation\n• AP3 Skills Matrix\n• AP5 Target Population Profile\n• AP6 Gap Analysis Statement\n• AP7 Feasibility Analysis Report", "1", "—", today],
                ["Design Phase Worksheets\n• DesP1 Design Phase Scoping Form\n• DesP2 Environments Profile\n• DesP4 Draft LMP", "1", "—", today],
                ["Develop Phase — Learning and Assessment Materials", "—", "—", "To be completed"],
              ]}
            />
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg transition">
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Draft LMP for Approval →"}
        </button>
      </div>

    </div>
  )
}
