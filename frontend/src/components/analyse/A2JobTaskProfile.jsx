import { useState } from "react"

const difficultyOptions = ["EASY", "STRAIGHTFORWARD", "DIFFICULT", "VERY_DIFFICULT"]
const frequencyOptions = ["RARELY", "BIANNUALLY", "QUARTERLY", "MONTHLY", "WEEKLY", "DAILY"]
const importanceOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

const emptyTask = {
  taskNumber: 1,
  taskDescription: "",
  conditions: "",
  standards: "",
  difficulty: "STRAIGHTFORWARD",
  frequency: "MONTHLY",
  importance: "MEDIUM",
  subTasks: []
}

export default function A2JobTaskProfile({ analysePhase, onSave, onNext, onBack, saving }) {
  const existing = analysePhase?.jobTaskProfile || {}

  const [form, setForm] = useState({
    jobTitle: existing.jobTitle || "",
    jobDescription: existing.jobDescription || "",
    organisationalContext: existing.organisationalContext || "",
    licenceRequired: existing.licenceRequired || false,
    licenceDetails: existing.licenceDetails || "",
    tasks: existing.tasks || [{ ...emptyTask }]
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleTaskChange = (index, field, value) => {
    const updated = [...form.tasks]
    updated[index] = { ...updated[index], [field]: value }
    setForm(prev => ({ ...prev, tasks: updated }))
  }

  const addTask = () => {
    setForm(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...emptyTask, taskNumber: prev.tasks.length + 1, subTasks: [] }]
    }))
  }

  const removeTask = (index) => {
    setForm(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }))
  }

  const addSubTask = (taskIndex) => {
    const updated = [...form.tasks]
    updated[taskIndex].subTasks = [
      ...(updated[taskIndex].subTasks || []),
      { taskNumber: (updated[taskIndex].subTasks?.length || 0) + 1, description: "" }
    ]
    setForm(prev => ({ ...prev, tasks: updated }))
  }

  const handleSubTaskChange = (taskIndex, subIndex, value) => {
    const updated = [...form.tasks]
    updated[taskIndex].subTasks[subIndex].description = value
    setForm(prev => ({ ...prev, tasks: updated }))
  }

  const removeSubTask = (taskIndex, subIndex) => {
    const updated = [...form.tasks]
    updated[taskIndex].subTasks = updated[taskIndex].subTasks.filter((_, i) => i !== subIndex)
    setForm(prev => ({ ...prev, tasks: updated }))
  }

  const handleSaveAndNext = async () => {
    await onSave("job-task-profile", form)
    onNext()
  }

  return (
    <div className="space-y-8">

      {/* Job Details */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Job Details</h3>
        <p className="text-sm text-gray-500 mb-4">Describe the job or role being analysed.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Infantry Section Commander"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Provide a brief description of the job..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organisational Context</label>
            <textarea
              name="organisationalContext"
              value={form.organisationalContext}
              onChange={handleChange}
              rows={2}
              placeholder="Describe how this job fits within the organisation..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="licenceRequired"
                checked={form.licenceRequired}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Licence or qualification required for this job</span>
            </label>
            {form.licenceRequired && (
              <textarea
                name="licenceDetails"
                value={form.licenceDetails}
                onChange={handleChange}
                rows={2}
                placeholder="Describe the licence or qualification required..."
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Job Tasks */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-semibold text-gray-800">Job Tasks</h3>
          <button
            onClick={addTask}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Task
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Record each task the job holder must perform. Rate each by Difficulty, Frequency and Importance (DIF).
        </p>

        <div className="space-y-6">
          {form.tasks.map((task, taskIndex) => (
            <div key={taskIndex} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Task {taskIndex + 1}</h4>
                {form.tasks.length > 1 && (
                  <button
                    onClick={() => removeTask(taskIndex)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove Task
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Task Description</label>
                  <input
                    type="text"
                    value={task.taskDescription}
                    onChange={(e) => handleTaskChange(taskIndex, "taskDescription", e.target.value)}
                    placeholder="e.g. Service an outboard motor"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
                    <select
                      value={task.difficulty}
                      onChange={(e) => handleTaskChange(taskIndex, "difficulty", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficultyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                    <select
                      value={task.frequency}
                      onChange={(e) => handleTaskChange(taskIndex, "frequency", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {frequencyOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Importance</label>
                    <select
                      value={task.importance}
                      onChange={(e) => handleTaskChange(taskIndex, "importance", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {importanceOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Conditions</label>
                  <input
                    type="text"
                    value={task.conditions || ""}
                    onChange={(e) => handleTaskChange(taskIndex, "conditions", e.target.value)}
                    placeholder="Environment under which the task is performed..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Standards</label>
                  <input
                    type="text"
                    value={task.standards || ""}
                    onChange={(e) => handleTaskChange(taskIndex, "standards", e.target.value)}
                    placeholder="Parameters within which the task must be performed..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sub Tasks */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-gray-600">Sub-Tasks</label>
                    <button
                      onClick={() => addSubTask(taskIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      + Add Sub-Task
                    </button>
                  </div>
                  {task.subTasks && task.subTasks.map((subTask, subIndex) => (
                    <div key={subIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={subTask.description}
                        onChange={(e) => handleSubTaskChange(taskIndex, subIndex, e.target.value)}
                        placeholder={`Sub-task ${subIndex + 1}...`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeSubTask(taskIndex, subIndex)}
                        className="text-xs text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
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