import { useState } from "react"

const Field = ({ label, name, placeholder, rows = 2, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

export default function A2TargetPopulation({ analysePhase, onSave, onNext, onBack, saving }) {
  const existing = analysePhase?.targetPopulation || {}

  const [form, setForm] = useState({
    jobDesignation: existing.jobDesignation || "",
    jobSituation: existing.jobSituation || "",
    jobDescription: existing.jobDescription || "",
    jobFunction: existing.jobFunction || "",
    jobOwner: existing.jobOwner || "",
    workEnvironment: existing.workEnvironment || "",
    employmentClassification: existing.employmentClassification || "",
    geographicDistribution: existing.geographicDistribution || "",
    qualifications: existing.qualifications || "",
    aptitudes: existing.aptitudes || "",
    competencies: existing.competencies || "",
    academicAbility: existing.academicAbility || "",
    physicalCharacteristics: existing.physicalCharacteristics || "",
    learningMethods: existing.learningMethods || "",
    motivation: existing.motivation || "",
    otherCharacteristics: existing.otherCharacteristics || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveAndNext = async () => {
    await onSave("target-population", form)
    onNext()
  }

  return (
    <div className="space-y-8">

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Job Characteristics</h3>
        <p className="text-sm text-gray-500 mb-4">
          Provide a short summary of the intended job drawn from the Job Analysis.
        </p>
        <div className="space-y-4">
          <Field label="Job Designation" name="jobDesignation" placeholder="Job identification or description reference..." value={form.jobDesignation} onChange={handleChange} />
          <Field label="Situation" name="jobSituation" placeholder="Service, rank, category/corps/mustering and experience level..." value={form.jobSituation} onChange={handleChange} />
          <Field label="Job Description" name="jobDescription" placeholder="Short summary of the range of tasks in the job..." value={form.jobDescription} onChange={handleChange} />
          <Field label="Function" name="jobFunction" placeholder="Job function in terms of capability outcomes..." value={form.jobFunction} onChange={handleChange} />
          <Field label="Job Owner" name="jobOwner" placeholder="BPO or Job/Workforce Manager who owns this function..." value={form.jobOwner} onChange={handleChange} />
          <Field label="Work Environment" name="workEnvironment" placeholder="Likely location(s) for the job, including any special environmental factors..." value={form.workEnvironment} onChange={handleChange} />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Group and Individual Characteristics</h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe the characteristics of the Target Population group before selection or training.
        </p>
        <div className="space-y-4">
          <Field label="Employment Classification and Experience" name="employmentClassification" placeholder="Skills level, rank, specialisations, stream or job family..." value={form.employmentClassification} onChange={handleChange} />
          <Field label="Geographic Distribution" name="geographicDistribution" placeholder="Location(s) from which the Target Population may be drawn..." value={form.geographicDistribution} onChange={handleChange} />
          <Field label="Qualifications" name="qualifications" placeholder="Common qualifications, certificates and licences held..." value={form.qualifications} onChange={handleChange} />
          <Field label="Aptitudes" name="aptitudes" placeholder="Relevant inherent cognitive or psychomotor skills..." value={form.aptitudes} onChange={handleChange} />
          <Field label="Competencies" name="competencies" placeholder="Units of Competency commonly possessed by the Target Population..." value={form.competencies} onChange={handleChange} />
          <Field label="Academic Ability" name="academicAbility" placeholder="Academic achievements e.g. Year 10, Year 12, Certificate IV, Diploma, Tertiary..." value={form.academicAbility} onChange={handleChange} />
          <Field label="Physical Characteristics" name="physicalCharacteristics" placeholder="Relevant physical characteristics including age, gender ratios, fitness levels..." value={form.physicalCharacteristics} onChange={handleChange} />
          <Field label="Learning Methods" name="learningMethods" placeholder="Favoured or problematic learning styles or methods..." value={form.learningMethods} onChange={handleChange} />
          <Field label="Motivation" name="motivation" placeholder="Motivational factors based on research only..." value={form.motivation} onChange={handleChange} />
          <Field label="Other Characteristics" name="otherCharacteristics" placeholder="Any other pertinent factors..." value={form.otherCharacteristics} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
        >
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