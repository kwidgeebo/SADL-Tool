// DocumentGenerator.js
// Generates self-contained printable HTML documents for each SADL enclosure.
// Usage: import { generateDocument, openDocument } from './DocumentGenerator'

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

// ─── Shared HTML shell ────────────────────────────────────────────────────────

const wrap = (title, ref, projectTitle, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${ref} — ${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11pt; color: #1a1a1a; background: #fff; padding: 0; }

    /* Print page setup */
    @page { size: A4; margin: 20mm 20mm 20mm 20mm; }
    @media print { .no-print { display: none !important; } body { padding: 0; } }

    /* Screen wrapper */
    @media screen { body { background: #e5e7eb; padding: 24px; } }
    .page { background: #fff; max-width: 794px; margin: 0 auto; padding: 32px 40px; }

    /* Print button */
    .print-bar { background: #1e3a5f; color: #fff; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; max-width: 794px; margin: 0 auto 16px; border-radius: 8px; }
    .print-bar button { background: #fff; color: #1e3a5f; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 10pt; }
    .print-bar button:hover { background: #f0f4ff; }

    /* Header */
    .doc-header { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
    .doc-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .doc-title { font-size: 18pt; font-weight: 700; color: #1e3a5f; }
    .doc-ref { font-size: 10pt; color: #6b7280; font-weight: 600; }
    .doc-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; font-size: 9.5pt; color: #374151; }
    .doc-meta span { font-weight: 600; }

    /* Sections */
    .section { margin-bottom: 24px; }
    .section-title { font-size: 12pt; font-weight: 700; color: #1e3a5f; border-bottom: 1px solid #d1d5db; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
    .field { margin-bottom: 12px; }
    .field-label { font-size: 9pt; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
    .field-value { font-size: 10.5pt; color: #1a1a1a; line-height: 1.5; white-space: pre-wrap; }

    /* Task cards */
    .task-card { border: 1px solid #d1d5db; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; background: #f9fafb; }
    .task-title { font-weight: 700; font-size: 10.5pt; margin-bottom: 8px; color: #1e3a5f; }
    .dif-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px; }
    .dif-item { background: #e0e7ff; border-radius: 4px; padding: 4px 8px; text-align: center; font-size: 9pt; }
    .dif-item .dif-label { color: #6b7280; font-size: 8pt; display: block; }
    .dif-item .dif-val { font-weight: 700; color: #1e3a5f; }
    .subtask-list { margin-top: 8px; padding-left: 18px; }
    .subtask-list li { font-size: 9.5pt; color: #374151; margin-bottom: 3px; }

    /* Gap items */
    .gap-card { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; background: #f9fafb; }
    .gap-card .gap-ref { font-size: 9pt; font-weight: 700; color: #6b7280; margin-bottom: 4px; }
    .gap-card .gap-desc { font-weight: 700; font-size: 10pt; margin-bottom: 6px; }
    .gap-card .gap-row { font-size: 9.5pt; margin-bottom: 3px; }
    .gap-card .gap-row span { font-weight: 600; color: #374151; }

    /* Feasibility options */
    .option-card { border: 1px solid #d1d5db; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; background: #f9fafb; }
    .option-card.recommended { border-color: #3b82f6; background: #eff6ff; }
    .option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .option-type { font-weight: 700; font-size: 10.5pt; color: #1e3a5f; }
    .option-badge { background: #1e3a5f; color: #fff; font-size: 8pt; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
    .option-col .col-label { font-size: 8.5pt; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 3px; }
    .option-col .col-val { font-size: 9.5pt; color: #374151; white-space: pre-wrap; }

    /* Trigger pills */
    .trigger-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .trigger-pill { background: #dbeafe; color: #1e40af; font-size: 9pt; font-weight: 600; padding: 3px 10px; border-radius: 20px; }

    /* Signature block */
    .sig-block { margin-top: 32px; border-top: 1px solid #d1d5db; padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .sig-line { border-bottom: 1px solid #374151; height: 32px; margin-bottom: 4px; }
    .sig-label { font-size: 8.5pt; color: #6b7280; }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span style="font-size:10pt; font-weight:600;">${ref} — ${title} &nbsp;|&nbsp; ${projectTitle}</span>
    <button onclick="window.print()">🖨 Print / Save as PDF</button>
  </div>
  <div class="page">
    <div class="doc-header">
      <div class="doc-header-top">
        <div>
          <div class="doc-ref">${ref}</div>
          <div class="doc-title">${title}</div>
        </div>
        <div style="text-align:right; font-size:9pt; color:#6b7280;">
          SADL Tool<br/>ADF Systems Approach to Defence Learning
        </div>
      </div>
      <div class="doc-meta">
        <div><span>Project:</span> ${projectTitle}</div>
        <div><span>Date:</span> ${new Date().toLocaleDateString('en-AU')}</div>
      </div>
    </div>
    ${body}
    <div class="sig-block">
      <div>
        <div class="sig-line"></div>
        <div class="sig-label">Prepared by (Designer)</div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div class="sig-label">Approved by (Manager)</div>
      </div>
    </div>
  </div>
</body>
</html>
`

// ─── Field helpers ────────────────────────────────────────────────────────────

const field = (label, value) => {
  if (!value && value !== false) return ''
  return `
    <div class="field">
      <div class="field-label">${label}</div>
      <div class="field-value">${value}</div>
    </div>`
}

const section = (title, content) => `
  <div class="section">
    <div class="section-title">${title}</div>
    ${content}
  </div>`

// ─── AP1 — Analyse Phase Scoping Form ────────────────────────────────────────

const generateAP1 = (analysePhase) => {
  const d = analysePhase?.inputAnalysis || {}
  const activeTriggers = triggers.filter(t => d[t.key]).map(t => t.label)

  const body = `
    ${section('A1.1 — Project Triggers', `
      <div class="trigger-list">
        ${activeTriggers.map(t => `<span class="trigger-pill">${t}</span>`).join('')}
      </div>
      ${d.triggerOther && d.triggerOtherDetails ? field('Other Trigger Details', d.triggerOtherDetails) : ''}
    `)}
    ${section('A1.2 — Project Background', `
      ${field('Project Background', d.projectBackground)}
      ${field('Current Status', d.currentStatus)}
      ${field('Linked Activities', d.linkedActivities)}
    `)}
    ${section('Scope Confirmation', `
      ${field('SADL Appropriate', d.sadlAppropriate ? 'Yes' : 'No')}
      ${field('Analyse Phase Required', d.analyseRequired ? 'Yes' : 'No')}
      ${field('Scope Notes', d.scopeNotes)}
      ${field('Required Deliverables', d.requiredDeliverables)}
    `)}
    ${section('Stakeholders and Resources', `
      ${field('Stakeholder Needs', d.stakeholderNeeds)}
      ${field('Time Factors', d.timeFactors)}
      ${field('Resources Required', d.resourcesRequired)}
      ${field('Roles and Responsibilities', d.rolesResponsibilities)}
      ${field('Communication Process', d.communicationProcess)}
    `)}
    ${section('Objective Quality Evidence (OQE)', `
      ${field('OQE Provided', d.oqeProvided ? 'Yes' : 'No')}
      ${field('OQE Notes', d.oqeNotes)}
    `)}
  `
  return wrap('Analyse Phase Scoping Form', 'AP1', analysePhase?.project?.title || '', body)
}

// ─── AP3 — Job Task Profile ───────────────────────────────────────────────────

const generateAP3 = (analysePhase) => {
  const d = analysePhase?.jobTaskProfile || {}

  const tasksHtml = (d.tasks || []).map((task, i) => `
    <div class="task-card">
      <div class="task-title">Task ${i + 1}: ${task.taskDescription}</div>
      <div class="dif-grid">
        <div class="dif-item">
          <span class="dif-label">Difficulty</span>
          <span class="dif-val">${(task.difficulty || '').replace('_', ' ')}</span>
        </div>
        <div class="dif-item">
          <span class="dif-label">Frequency</span>
          <span class="dif-val">${task.frequency || ''}</span>
        </div>
        <div class="dif-item">
          <span class="dif-label">Importance</span>
          <span class="dif-val">${task.importance || ''}</span>
        </div>
      </div>
      ${task.conditions ? `<div class="field"><div class="field-label">Conditions</div><div class="field-value">${task.conditions}</div></div>` : ''}
      ${task.standards ? `<div class="field"><div class="field-label">Standards</div><div class="field-value">${task.standards}</div></div>` : ''}
      ${task.subTasks && task.subTasks.length > 0 ? `
        <div class="field-label" style="margin-top:8px;">Sub-Tasks</div>
        <ul class="subtask-list">
          ${task.subTasks.map(st => `<li>${st.description}</li>`).join('')}
        </ul>` : ''}
    </div>
  `).join('')

  const body = `
    ${section('Job Details', `
      ${field('Job Title', d.jobTitle)}
      ${field('Job Description', d.jobDescription)}
      ${field('Organisational Context', d.organisationalContext)}
      ${d.licenceRequired ? field('Licence / Qualification Required', d.licenceDetails) : ''}
    `)}
    ${section('Job Tasks — DIF Analysis', tasksHtml)}
  `
  return wrap('Job Task Profile', 'AP3', analysePhase?.project?.title || '', body)
}

// ─── AP5 — Target Population Profile ─────────────────────────────────────────

const generateAP5 = (analysePhase) => {
  const d = analysePhase?.targetPopulation || {}

  const body = `
    ${section('Job Characteristics', `
      ${field('Job Designation', d.jobDesignation)}
      ${field('Situation', d.jobSituation)}
      ${field('Job Description', d.jobDescription)}
      ${field('Function', d.jobFunction)}
      ${field('Job Owner', d.jobOwner)}
      ${field('Work Environment', d.workEnvironment)}
    `)}
    ${section('Group and Individual Characteristics', `
      ${field('Employment Classification and Experience', d.employmentClassification)}
      ${field('Geographic Distribution', d.geographicDistribution)}
      ${field('Qualifications', d.qualifications)}
      ${field('Aptitudes', d.aptitudes)}
      ${field('Competencies', d.competencies)}
      ${field('Academic Ability', d.academicAbility)}
      ${field('Physical Characteristics', d.physicalCharacteristics)}
      ${field('Learning Methods', d.learningMethods)}
      ${field('Motivation', d.motivation)}
      ${field('Other Characteristics', d.otherCharacteristics)}
    `)}
  `
  return wrap('Target Population Profile', 'AP5', analysePhase?.project?.title || '', body)
}

// ─── AP6 — Gap Analysis Statement ────────────────────────────────────────────

const generateAP6 = (analysePhase) => {
  const d = analysePhase?.gapAnalysis || {}

  const gapItemsHtml = (d.gapItems || []).map((item, i) => `
    <div class="gap-card">
      <div class="gap-ref">${item.taskReference || `Item ${i + 1}`}</div>
      <div class="gap-desc">${item.taskDescription}</div>
      ${item.difRating ? `<div class="gap-row"><span>DIF Rating:</span> ${item.difRating}</div>` : ''}
      ${item.targetPopulationCapacity ? `<div class="gap-row"><span>TP Capacity:</span> ${item.targetPopulationCapacity}</div>` : ''}
      ${item.identifiedGap ? `<div class="gap-row"><span>Identified Gap:</span> ${item.identifiedGap}</div>` : ''}
      ${item.currentLearningOutcome ? `<div class="gap-row"><span>Current Learning Outcome:</span> ${item.currentLearningOutcome}</div>` : ''}
    </div>
  `).join('')

  const overTrainingHtml = (d.overTraining || []).length > 0
    ? (d.overTraining || []).map(item => `
        <div class="gap-card">
          <div class="gap-row"><span>Learning Outcome:</span> ${item.learningOutcome}</div>
          <div class="gap-row"><span>Assessment:</span> ${item.assessment}</div>
        </div>
      `).join('')
    : '<p style="font-size:9.5pt; color:#6b7280; font-style:italic;">No over-training items identified.</p>'

  const body = `
    ${section('Gap Analysis Summary', `
      ${field('Performance Gap Exists', d.gapExists ? 'Yes' : 'No')}
      ${d.gapExists ? field('Gap Type', (d.gapType || '').replace('_', ' ')) : ''}
      ${field('Gap Summary', d.gapSummary)}
      ${field('Recommendation', d.recommendation)}
    `)}
    ${section('Gap Analysis Items', gapItemsHtml)}
    ${section('Potential Over-Training', overTrainingHtml)}
  `
  return wrap('Gap Analysis Statement', 'AP6', analysePhase?.project?.title || '', body)
}

// ─── AP7 — Feasibility Analysis Report ───────────────────────────────────────

const generateAP7 = (analysePhase) => {
  const d = analysePhase?.feasibilityReport || {}

  const optionsHtml = (d.options || []).map((opt, i) => `
    <div class="option-card ${opt.recommended ? 'recommended' : ''}">
      <div class="option-header">
        <div class="option-type">Option ${i + 1} — ${optionTypeLabel[opt.optionType] || opt.optionType}</div>
        ${opt.recommended ? '<span class="option-badge">✓ Recommended</span>' : ''}
      </div>
      ${opt.optionDescription ? `<div style="font-size:10pt; margin-bottom:8px; color:#374151;">${opt.optionDescription}</div>` : ''}
      <div class="option-grid">
        <div class="option-col">
          <div class="col-label">Advantages</div>
          <div class="col-val">${opt.advantages || '—'}</div>
        </div>
        <div class="option-col">
          <div class="col-label">Disadvantages / Risks</div>
          <div class="col-val">${opt.disadvantages || '—'}</div>
        </div>
      </div>
      ${opt.mitigationActions ? `
        <div class="field" style="margin-top:10px;">
          <div class="field-label">Mitigation Actions</div>
          <div class="field-value">${opt.mitigationActions}</div>
        </div>` : ''}
    </div>
  `).join('')

  const body = `
    ${section('Analysis Process', `
      ${field('Analysis Process', d.analysisProcess)}
      ${field('Units / Organisations Consulted', d.unitsConsulted)}
    `)}
    ${section('Options Considered', optionsHtml)}
    ${section('Final Recommendation', field('Recommendation', d.recommendation))}
  `
  return wrap('Feasibility Analysis Report', 'AP7', analysePhase?.project?.title || '', body)
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const generateDocument = (ref, analysePhase) => {
  switch (ref) {
    case 'AP1': return generateAP1(analysePhase)
    case 'AP3': return generateAP3(analysePhase)
    case 'AP5': return generateAP5(analysePhase)
    case 'AP6': return generateAP6(analysePhase)
    case 'AP7': return generateAP7(analysePhase)
    default: return null
  }
}

export const openDocument = (ref, analysePhase) => {
  const html = generateDocument(ref, analysePhase)
  if (!html) return
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}