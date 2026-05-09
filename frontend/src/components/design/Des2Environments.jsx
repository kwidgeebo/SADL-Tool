import { useState } from "react"
import { useSaveStatus } from "../../hooks/useSaveStatus"


const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"

export default function Des2Environments({ designPhase, onSave, onNext, onBack }) {
    const { withSaveStatus, buttonText, buttonClass, isDisabled } = useSaveStatus()
  const existing = designPhase?.des2Environments || {}

  const [form, setForm] = useState({
    facilityDescription:       existing.facilityDescription       || "",
    facilityAccess:            existing.facilityAccess            || "",
    facilityLocation:          existing.facilityLocation          || "",
    activitySpaces:            existing.activitySpaces            || "",
    classroomCapacity:         existing.classroomCapacity         || "",
    simulatorAccess:           existing.simulatorAccess           || "",
    outdoorSpaces:             existing.outdoorSpaces             || "",
    equipmentAvailable:        existing.equipmentAvailable        || "",
    technologyInfrastructure:  existing.technologyInfrastructure  || "",
    learningMaterials:         existing.learningMaterials         || "",
    instructorAvailability:    existing.instructorAvailability    || "",
    instructorQualifications:  existing.instructorQualifications  || "",
    supportStaff:              existing.supportStaff              || "",
    budgetAvailable:           existing.budgetAvailable           || "",
    costConstraints:           existing.costConstraints           || "",
    fundingSource:             existing.fundingSource             || "",
    relevantLegislation:       existing.relevantLegislation       || "",
    whsRequirements:           existing.whsRequirements           || "",
    accessibilityRequirements: existing.accessibilityRequirements || "",
    securityRequirements:      existing.securityRequirements      || "",
  })

  const [showOutput, setShowOutput] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveAndNext = async () => {
  await withSaveStatus(async () => {
    await onSave("your-endpoint", form)
  })
  onNext()
}

  return (
    <div className="space-y-8">

      {/* Facility */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.1 — Facility</h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe the training facility, its location and access arrangements.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Description</label>
            <textarea name="facilityDescription" value={form.facilityDescription} onChange={handleChange} rows={3}
              placeholder="Describe the primary training facility — type, size, ownership, condition..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Location</label>
            <textarea name="facilityLocation" value={form.facilityLocation} onChange={handleChange} rows={2}
              placeholder="Base, unit or address where training will be conducted..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Access</label>
            <textarea name="facilityAccess" value={form.facilityAccess} onChange={handleChange} rows={2}
              placeholder="Booking requirements, security clearance needed, access restrictions..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Activity Spaces */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.2 — Activity Spaces</h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify the spaces available for different types of learning activities.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Spaces</label>
            <textarea name="activitySpaces" value={form.activitySpaces} onChange={handleChange} rows={3}
              placeholder="List available training spaces — classrooms, workshops, parade grounds..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classroom Capacity</label>
            <textarea name="classroomCapacity" value={form.classroomCapacity} onChange={handleChange} rows={2}
              placeholder="Maximum student numbers per classroom or training bay..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Simulator / Lab Access</label>
            <textarea name="simulatorAccess" value={form.simulatorAccess} onChange={handleChange} rows={2}
              placeholder="Simulators, training systems or lab environments available and their booking arrangements..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Outdoor / Field Spaces</label>
            <textarea name="outdoorSpaces" value={form.outdoorSpaces} onChange={handleChange} rows={2}
              placeholder="Outdoor training areas, ranges, exercise areas available..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.3 — Resources</h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify equipment, technology and learning materials available to support the course.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Available</label>
            <textarea name="equipmentAvailable" value={form.equipmentAvailable} onChange={handleChange} rows={3}
              placeholder="List training equipment available — BMS terminals, vehicles, weapons systems, tools..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technology Infrastructure</label>
            <textarea name="technologyInfrastructure" value={form.technologyInfrastructure} onChange={handleChange} rows={2}
              placeholder="IT systems, network access, AV equipment, LMS access..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Existing Learning Materials</label>
            <textarea name="learningMaterials" value={form.learningMaterials} onChange={handleChange} rows={2}
              placeholder="Existing manuals, training packages, SOPs, reference materials available..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Staff */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.4 — Staff</h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify the instructional staff and support personnel available.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Availability</label>
            <textarea name="instructorAvailability" value={form.instructorAvailability} onChange={handleChange} rows={2}
              placeholder="Number of instructors available, their availability and any constraints..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Qualifications</label>
            <textarea name="instructorQualifications" value={form.instructorQualifications} onChange={handleChange} rows={2}
              placeholder="Required qualifications, current qualifications held, any gaps..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Staff</label>
            <textarea name="supportStaff" value={form.supportStaff} onChange={handleChange} rows={2}
              placeholder="Administrative, technical or support staff available to the course..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Finances */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.5 — Finances</h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe the budget available and any financial constraints on course design.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Available</label>
            <textarea name="budgetAvailable" value={form.budgetAvailable} onChange={handleChange} rows={2}
              placeholder="Approved budget for course development and delivery..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Constraints</label>
            <textarea name="costConstraints" value={form.costConstraints} onChange={handleChange} rows={2}
              placeholder="Any cost caps, procurement restrictions or value-for-money requirements..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Source</label>
            <textarea name="fundingSource" value={form.fundingSource} onChange={handleChange} rows={2}
              placeholder="Program, capability or budget line funding this course..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* Legislation and Policy */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Des2.6 — Legislation and Policy</h3>
        <p className="text-sm text-gray-500 mb-4">
          Identify legislative, WHS, accessibility and security requirements that constrain course design.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Legislation</label>
            <textarea name="relevantLegislation" value={form.relevantLegislation} onChange={handleChange} rows={2}
              placeholder="Acts, regulations or Defence Instructions applicable to this training..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WHS Requirements</label>
            <textarea name="whsRequirements" value={form.whsRequirements} onChange={handleChange} rows={2}
              placeholder="Work Health and Safety obligations, hazard controls, emergency procedures..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Requirements</label>
            <textarea name="accessibilityRequirements" value={form.accessibilityRequirements} onChange={handleChange} rows={2}
              placeholder="Disability access, reasonable adjustments, inclusive design requirements..."
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Requirements</label>
            <textarea name="securityRequirements" value={form.securityRequirements} onChange={handleChange} rows={2}
              placeholder="Security classification of training content, clearance requirements, handling caveats..."
              className={inputClass} />
          </div>
        </div>
      </div>

      {/* DesP2 Output Preview */}
      {existing.facilityDescription && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-semibold text-gray-800">📄 View DesP2 — Environments Profile</span>
            <span className="text-gray-400 text-sm">{showOutput ? "Hide ▲" : "Show ▼"}</span>
          </button>

          {showOutput && (
            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Project:</span> {designPhase?.project?.title}</div>
                <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString("en-AU")}</div>
              </div>
              <hr />
              {[
                { label: "Facility Description",       value: existing.facilityDescription },
                { label: "Facility Location",           value: existing.facilityLocation },
                { label: "Facility Access",             value: existing.facilityAccess },
                { label: "Activity Spaces",             value: existing.activitySpaces },
                { label: "Classroom Capacity",          value: existing.classroomCapacity },
                { label: "Simulator / Lab Access",      value: existing.simulatorAccess },
                { label: "Outdoor / Field Spaces",      value: existing.outdoorSpaces },
                { label: "Equipment Available",         value: existing.equipmentAvailable },
                { label: "Technology Infrastructure",   value: existing.technologyInfrastructure },
                { label: "Existing Learning Materials", value: existing.learningMaterials },
                { label: "Instructor Availability",     value: existing.instructorAvailability },
                { label: "Instructor Qualifications",   value: existing.instructorQualifications },
                { label: "Support Staff",               value: existing.supportStaff },
                { label: "Budget Available",            value: existing.budgetAvailable },
                { label: "Cost Constraints",            value: existing.costConstraints },
                { label: "Funding Source",              value: existing.fundingSource },
                { label: "Relevant Legislation",        value: existing.relevantLegislation },
                { label: "WHS Requirements",            value: existing.whsRequirements },
                { label: "Accessibility Requirements",  value: existing.accessibilityRequirements },
                { label: "Security Requirements",       value: existing.securityRequirements },
              ].filter(f => f.value).map(f => (
                <div key={f.label}>
                  <p className="font-semibold text-gray-800 mb-1">{f.label}</p>
                  <p className="whitespace-pre-wrap">{f.value}</p>
                </div>
              ))}
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
