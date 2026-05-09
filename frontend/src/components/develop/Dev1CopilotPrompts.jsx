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

// ─── Shared Format Blocks ─────────────────────────────────────────────────────

const WORD_FORMAT = (docType, courseName, classification) => `
OUTPUT FORMAT INSTRUCTIONS:
Create this as a Microsoft Word document with the following formatting:

COVER PAGE:
- Document title: ${docType}
- Course name: ${courseName}
- Version: 0.1 DRAFT
- Date: [Today's date]
- Security Classification: ${classification}
- Training Authority logo placeholder

DOCUMENT STYLE:
- Font: Arial throughout
- Body text: Arial 11pt, 1.15 line spacing
- Heading 1: Arial 16pt, Bold, Navy Blue (#003087), space before 12pt, space after 6pt
- Heading 2: Arial 13pt, Bold, Navy Blue (#003087), space before 8pt, space after 4pt
- Heading 3: Arial 11pt, Bold, Dark Gray (#404040), space before 6pt, space after 2pt
- Page margins: 2.54cm all sides (standard A4)

HEADER (all pages except cover):
- Left: ${courseName}
- Centre: ${docType}
- Right: ${classification}
- Separated by a navy blue border line

FOOTER (all pages except cover):
- Left: Version 0.1 DRAFT
- Centre: Page [X] of [Y]
- Right: [Today's date]
- Separated by a navy blue border line

TABLES:
- Use a professional table style with navy blue (#003087) header row
- Header row: White bold text on navy background
- Alternating row shading: White and light blue (#E8F0FB)
- All cell borders: 0.5pt solid light gray
- Cell padding: 0.1cm all sides

BULLET POINTS:
- Use consistent bullet style throughout (filled circle •)
- Indent: 1cm hanging indent
- No more than 2 levels of nesting

EMPHASIS:
- Bold for key terms, critical steps, and important warnings
- Use a yellow highlight or orange text for CRITICAL/WARNING items
- Use a blue text box or shaded paragraph for key definitions

GENERAL:
- Insert a page break before each major section (Heading 1)
- All tables and figures should have a caption
- Use consistent capitalisation throughout
- Spell check and grammar check before finalising`

const POWERPOINT_FORMAT = (moduleName, courseName, classification) => `
OUTPUT FORMAT INSTRUCTIONS:
Create this as a Microsoft PowerPoint presentation with the following formatting:

THEME AND COLOURS:
- Background: Dark navy (#003087) for title/section slides, White for content slides
- Primary accent: Gold (#FFB800)
- Secondary accent: Light blue (#4DA6FF)
- Text on dark backgrounds: White
- Text on light backgrounds: Dark navy (#003087) or black

SLIDE LAYOUT TYPES:
1. COVER SLIDE: Full navy background, course name in gold, module name in white, classification in small white text bottom-right
2. SECTION DIVIDER: Navy background, LO number in gold, LO name in large white text
3. CONTENT SLIDE: White background, navy heading, content in dark text, thin gold line under heading
4. KNOWLEDGE CHECK: Light blue background, question in navy bold, answers revealed on click
5. SUMMARY SLIDE: Navy background, white text, key points bulleted in gold

TYPOGRAPHY:
- Title font: Arial Bold 36pt (cover), 28pt (section dividers), 24pt (content headings)
- Body font: Arial 18pt for main points, 16pt for sub-points
- Maximum 5 bullet points per content slide
- Maximum 8 words per bullet point
- No full sentences — use key phrases only

VISUALS:
- Every content slide should have a relevant image, diagram, or icon placeholder
- Describe what image/diagram should appear (e.g. "[IMAGE: Soldier operating BMS terminal]")
- Use consistent icon style throughout (outline style recommended)

PRESENTER NOTES:
- Every content slide must have full presenter notes (complete sentences)
- Notes should expand on bullets, not repeat them
- Include timing guidance (e.g. "Allow 3 minutes for this slide")
- Include facilitation questions where appropriate

STRUCTURE:
- Slide numbers on all slides except cover
- Course name and security classification in footer on all content slides
- Module name in header on all content slides
- ${classification} watermark on all slides

COURSE: ${courseName}
MODULE: ${moduleName}
CLASSIFICATION: ${classification}`

const ASSESSMENT_FORMAT = (courseName, classification) => `
OUTPUT FORMAT INSTRUCTIONS:
Create this as a formal Microsoft Word assessment document with the following formatting:

COVER PAGE:
- Document title: Assessment Tool
- Course name: ${courseName}
- Assessment ID and name
- Version: 0.1 DRAFT
- Date: [Today's date]
- Security Classification: ${classification}
- "ASSESSOR USE ONLY" watermark on all pages

DOCUMENT STYLE:
- Font: Arial throughout
- Body text: Arial 11pt
- Heading 1: Arial 14pt Bold, Navy Blue (#003087)
- Heading 2: Arial 12pt Bold, Dark Gray
- Page margins: 2.54cm all sides

HEADER: ${courseName} | Assessment Tool | ${classification}
FOOTER: Version 0.1 DRAFT | Page [X] of [Y] | [Date]

OBSERVATION CHECKLIST TABLES:
- Three columns: Observable Behaviour | S | NYS
  (S = Satisfactory, NYS = Not Yet Satisfactory)
- S and NYS columns: 1.5cm wide, centred checkboxes
- Observable Behaviour column: remaining width
- Critical steps marked with ★ symbol and bold text
- Header row: Navy background, white bold text
- Comments row after each criterion: full width, 2cm height

RESULT RECORD BOX:
- Prominent bordered box at end of document
- Fields: Overall Result (S/NYS), Date, Assessor Name, Assessor Signature, Student Name, Student Signature
- 1cm height for signature fields

GENERAL:
- Page break before Assessor Instructions and Student Instructions sections
- All critical steps bolded and marked ★
- "This page intentionally left blank" on any blank pages`

// ─── Prompt Generators ────────────────────────────────────────────────────────

function generateLessonPlanPrompt(lo, des4, des1) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  return `You are an instructional designer creating a detailed lesson plan for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}
Training Authority: ${des1?.trainingAuthority || ""}
Delivery Method: ${DELIVERY_LABELS[lo.deliveryMethod] || lo.deliveryMethod}
Training Level: ${TRAINING_LEVEL_LABELS[lo.trainingLevel] || lo.trainingLevel}

LEARNING OUTCOME:
LO ${lo.sequence}: ${lo.loName}

Performance Statement: ${lo.performanceStatement}
Performance Conditions: ${lo.performanceConditions}
Performance Standard: ${lo.performanceStandard}
Assessment Criteria: ${lo.assessmentCriteria}
Content Summary: ${lo.contentSummary}

Duration: ${lo.durationOffJobHours ? `${lo.durationOffJobHours} hours off-job` : ""}${lo.durationOnJobHours ? `, ${lo.durationOnJobHours} hours on-job` : ""}
Pre-requisite LOs: ${lo.prerequisiteLOs || "None"}
Resources: ${lo.resources || ""}
References: ${lo.references || ""}

TASK:
Create a detailed lesson plan for this learning outcome. Include:

1. LESSON OVERVIEW
   - Lesson title and LO reference
   - Duration and delivery method
   - Resources required
   - Pre-requisite knowledge

2. LEARNING OBJECTIVES
   - What students will be able to do by the end of the lesson
   - How this connects to the performance standard

3. LESSON STRUCTURE
   For each stage (Introduction, Body, Conclusion) provide:
   - Time allocation
   - Instructor actions and key teaching points
   - Student activities
   - Resources/materials used

4. FORMATIVE ASSESSMENT
   - How the instructor will check understanding during the lesson
   - Questions to ask students
   - Practical exercises or scenarios

5. ASSESSMENT PREPARATION
   - How this lesson prepares students for the summative assessment
   - Key standards students must meet

6. INSTRUCTOR NOTES
   - Common student errors and how to address them
   - Safety or WHS considerations
   - Tips for effective delivery

${WORD_FORMAT(`Lesson Plan — LO ${lo.sequence}: ${lo.loName}`, courseName, classification)}`
}

function generateInstructorGuidePrompt(mod, los, des4, des1) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  const assignedLOs = los.filter(lo => {
    try {
      const assignments = typeof mod.loAssignments === "string"
        ? JSON.parse(mod.loAssignments || "[]")
        : (mod.loAssignments || [])
      return assignments.includes(lo.id || `lo-${lo.sequence}`)
    } catch { return false }
  })

  return `You are an instructional designer creating a comprehensive instructor guide for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}
Training Authority: ${des1?.trainingAuthority || ""}
Assessment Strategy: ${des4?.summativeStrategy || ""}

MODULE: ${mod.moduleName}
Module Content: ${mod.moduleContent || ""}
Delivery Method: ${DELIVERY_LABELS[mod.deliveryMethod] || mod.deliveryMethod}
Duration: ${mod.durationOffJobDays ? `${mod.durationOffJobDays} days` : ""}
WHS Requirements: ${mod.whsRequirements || "None specified"}
Key Resources: ${mod.keyResources || ""}

LEARNING OUTCOMES IN THIS MODULE:
${assignedLOs.map(lo => `
LO ${lo.sequence}: ${lo.loName}
- Performance Statement: ${lo.performanceStatement}
- Conditions: ${lo.performanceConditions}
- Standard: ${lo.performanceStandard}
- Assessment Criteria: ${lo.assessmentCriteria}
- Content Summary: ${lo.contentSummary}
`).join("\n")}

SUMMATIVE ASSESSMENTS:
${(mod.summativeAssessments || []).map(sa => `
${sa.saId}: ${sa.saName}
- LOs Assessed: ${sa.loAssessed}
- Method: ${sa.method}
- Description: ${sa.description}
- Assessment Criteria: ${sa.assessmentCriteria}
`).join("\n")}

TASK:
Create a comprehensive instructor guide for this module. Include:

1. MODULE OVERVIEW
   - Purpose and context
   - Prerequisites
   - Resources and equipment checklist
   - Room/facility setup instructions
   - WHS briefing points

2. DELIVERY SCHEDULE
   - Suggested timetable for the module
   - Time allocation per LO
   - Break schedule

3. FOR EACH LEARNING OUTCOME:
   - Key teaching points and explanations
   - Suggested demonstrations or worked examples
   - Questions to check understanding
   - Common student errors and corrections
   - Transition to the next LO

4. ASSESSMENT CONDUCT
   - How to set up and conduct the summative assessment
   - Assessor observation checklist
   - How to record results
   - Re-assessment procedures

5. INSTRUCTOR NOTES
   - Tips for effective delivery
   - Handling student difficulties
   - Equipment troubleshooting

${WORD_FORMAT(`Instructor Guide — ${mod.moduleName}`, courseName, classification)}`
}

function generateLearnerWorkbookPrompt(mod, los, des4) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  const assignedLOs = los.filter(lo => {
    try {
      const assignments = typeof mod.loAssignments === "string"
        ? JSON.parse(mod.loAssignments || "[]")
        : (mod.loAssignments || [])
      return assignments.includes(lo.id || `lo-${lo.sequence}`)
    } catch { return false }
  })

  return `You are an instructional designer creating a learner workbook for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}

MODULE: ${mod.moduleName}
Module Content: ${mod.moduleContent || ""}
Delivery Method: ${DELIVERY_LABELS[mod.deliveryMethod] || mod.deliveryMethod}

LEARNING OUTCOMES:
${assignedLOs.map(lo => `
LO ${lo.sequence}: ${lo.loName}
- Performance Statement: ${lo.performanceStatement}
- Conditions: ${lo.performanceConditions}
- Standard: ${lo.performanceStandard}
- Content Summary: ${lo.contentSummary}
- Assessment Criteria: ${lo.assessmentCriteria}
`).join("\n")}

TASK:
Create a learner workbook for this module. Include:

1. MODULE INTRODUCTION
   - What you will learn
   - Why this matters operationally
   - How this module is assessed

2. FOR EACH LEARNING OUTCOME:
   a) THEORY NOTES
      - Clear explanation of key concepts
      - Diagrams or visual aids (describe what diagrams should show)
      - Key definitions and terminology
      - Relevant doctrine or policy references

   b) WORKED EXAMPLES
      - Step-by-step procedure or example scenario
      - Tips and tricks from experienced practitioners

   c) KNOWLEDGE CHECK
      - 3-5 questions to check understanding
      - Space for student notes and answers

   d) PRACTICAL PREPARATION
      - What to prepare before the practical exercise
      - Key steps to remember
      - Common errors to avoid

3. ASSESSMENT PREPARATION
   - Summary of what you need to demonstrate
   - Self-assessment checklist against the performance standard
   - Key references for further study

${WORD_FORMAT(`Learner Workbook — ${mod.moduleName}`, courseName, classification)}`
}

function generatePracticalActivityPrompt(lo, des4, des1) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  return `You are an instructional designer creating a practical activity book for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}
Training Authority: ${des1?.trainingAuthority || ""}

LEARNING OUTCOME:
LO ${lo.sequence}: ${lo.loName}

Performance Statement: ${lo.performanceStatement}
Performance Conditions: ${lo.performanceConditions}
Performance Standard: ${lo.performanceStandard}
Assessment Criteria: ${lo.assessmentCriteria}
Content Summary: ${lo.contentSummary}
Resources Required: ${lo.resources || ""}
References: ${lo.references || ""}
Duration: ${lo.durationOnJobHours ? `${lo.durationOnJobHours} hours on-job` : ""}${lo.durationOffJobHours ? `, ${lo.durationOffJobHours} hours off-job` : ""}

TASK:
Create a practical activity book for this learning outcome. Include:

1. ACTIVITY OVERVIEW
   - Activity title and LO reference
   - Purpose — what skill this develops
   - Equipment and resources required
   - Safety/WHS requirements and pre-activity briefing

2. BACKGROUND KNOWLEDGE
   - Key concepts the student needs before starting
   - Reference to theory covered in the learner workbook

3. STEP-BY-STEP PROCEDURE
   - Numbered steps for completing the task
   - Decision points and what to do in each case
   - Critical steps highlighted (errors here = fail)
   - Student record space at each key step

4. PRACTICE SCENARIOS
   - 2-3 realistic scenarios for the student to work through
   - Each scenario should vary the conditions slightly
   - Space for student to record their actions and outcomes

5. SELF-ASSESSMENT CHECKLIST
   - Student checks themselves against each assessment criterion
   - Space to note areas for improvement

6. INSTRUCTOR SIGN-OFF
   - Space for instructor to record observations
   - Pass/Fail against each assessment criterion
   - Remediation notes if required

${WORD_FORMAT(`Practical Activity Book — LO ${lo.sequence}: ${lo.loName}`, courseName, classification)}

ADDITIONAL FORMAT NOTES FOR PRACTICAL DOCUMENTS:
- Use large font (13pt) for procedure steps — these may be read in the field
- Critical steps must be in a red-bordered box with ★ symbol
- Each step should have a checkbox or space for the student to tick/initial when complete
- Include generous white space for field notes
- Consider a laminated quick-reference card format for critical procedures`
}

function generateStoryboardPrompt(lo, des4) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  return `You are an instructional designer creating an eLearning storyboard for ADELE (Army's LMS) or Moodle for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}
Platform: ADELE / Moodle

LEARNING OUTCOME:
LO ${lo.sequence}: ${lo.loName}

Performance Statement: ${lo.performanceStatement}
Performance Conditions: ${lo.performanceConditions}
Performance Standard: ${lo.performanceStandard}
Assessment Criteria: ${lo.assessmentCriteria}
Content Summary: ${lo.contentSummary}
Duration: ${lo.durationOffJobHours ? `${lo.durationOffJobHours} hours` : ""}
References: ${lo.references || ""}

TASK:
Create a detailed eLearning storyboard for this learning outcome. For each screen provide all columns of the storyboard table.

Screen types to include:
- Title/Introduction screen
- Learning objective screen
- Content screens (one key concept per screen)
- Worked example or scenario screen
- Knowledge check screens (multiple choice, drag-and-drop, or scenario-based)
- Summary screen
- Assessment preparation screen

Guidelines:
- Maximum 75 words of on-screen text per content screen
- Narration script should expand on on-screen text, not repeat it
- Visuals should be described in enough detail for a graphic designer to create them
- Knowledge checks should directly assess the learning objective
- Use a professional but approachable tone suitable for Defence personnel
- All visuals need alt text descriptions for accessibility

OUTPUT FORMAT INSTRUCTIONS:
Create this as a Microsoft Word document formatted as a storyboard table.

DOCUMENT STYLE:
- Font: Arial throughout
- Cover page: Course name, LO reference and title, Version 0.1 DRAFT, Classification: ${classification}
- Header: ${courseName} | Storyboard — LO ${lo.sequence} | ${classification}
- Footer: Version 0.1 DRAFT | Page [X] of [Y] | [Date]

STORYBOARD TABLE FORMAT:
Create a table with these columns (one row per screen):
| Screen No. | Screen Type | Title | On-Screen Text (max 75 words) | Narration Script | Visual Description | Interaction Type | Accessibility Notes | Developer Notes |

TABLE STYLING:
- Column widths: Screen No. (1.5cm), Screen Type (2.5cm), Title (3cm), On-Screen Text (5cm), Narration (5cm), Visual Description (4cm), Interaction (3cm), Accessibility (3cm), Notes (3cm)
- Header row: Navy (#003087) background, white bold text
- Alternating row shading: White / Light blue (#E8F0FB)
- Row height: minimum 2.5cm to allow for content
- Screen type column: colour-code by type (Title=gold, Content=white, Knowledge Check=light green, Summary=light blue)

GENERAL:
- Each screen on its own row — never combine screens
- Number screens sequentially (1.1, 1.2 etc. where 1 = LO number)
- Mark knowledge check answers with (CORRECT) in the interaction column`
}

function generateAssessmentToolPrompt(sa, mod, los, des4) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"
  const assessedLONames = sa.loAssessed || ""

  return `You are an instructional designer creating a formal assessment tool for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}
Assessment Strategy: ${des4?.summativeStrategy || ""}
Assessor Qualifications Required: ${des4?.assessorQualifications || ""}

MODULE: ${mod.moduleName}

ASSESSMENT:
Assessment ID: ${sa.saId}
Assessment Name: ${sa.saName}
Method: ${sa.method}
LOs Assessed: ${assessedLONames}
Description: ${sa.description}
Assessment Criteria: ${sa.assessmentCriteria}
Duration: ${sa.durationHours ? `${sa.durationHours} hours` : ""}

LEARNING OUTCOMES BEING ASSESSED:
${los.filter(lo => assessedLONames.includes(`LO ${lo.sequence}`)).map(lo => `
LO ${lo.sequence}: ${lo.loName}
- Performance Statement: ${lo.performanceStatement}
- Conditions: ${lo.performanceConditions}
- Standard: ${lo.performanceStandard}
- Assessment Criteria: ${lo.assessmentCriteria}
`).join("\n")}

TASK:
Create a comprehensive assessment tool. Include:

1. ASSESSMENT OVERVIEW
   - Assessment title, ID and version
   - Purpose and LOs assessed
   - Assessment conditions
   - Duration and pass standard

2. ASSESSOR INSTRUCTIONS
   - How to set up the assessment
   - What to observe and record
   - How to handle student questions
   - Recording and reporting requirements
   - Re-assessment procedures

3. STUDENT INSTRUCTIONS
   - What the student must do
   - Available resources
   - Time allowed
   - Pass standard

4. OBSERVATION/MARKING CHECKLIST
   - For each assessment criterion: observable behaviour, S/NYS rating, comments
   - Critical steps marked ★

5. OVERALL RESULT RECORD
   - Summary result, assessor signature, student signature, date

6. FEEDBACK GUIDE
   - Key feedback for satisfactory performance
   - Common areas for improvement
   - Guidance for not yet satisfactory results

${ASSESSMENT_FORMAT(courseName, classification)}`
}

function generatePresentationPrompt(mod, los, des4) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  const assignedLOs = los.filter(lo => {
    try {
      const assignments = typeof mod.loAssignments === "string"
        ? JSON.parse(mod.loAssignments || "[]")
        : (mod.loAssignments || [])
      return assignments.includes(lo.id || `lo-${lo.sequence}`)
    } catch { return false }
  })

  return `You are an instructional designer creating PowerPoint presentation slides for Australian Defence Force training.

COURSE CONTEXT:
Course: ${courseName}
Security Classification: ${classification}

MODULE: ${mod.moduleName}
Delivery Method: ${DELIVERY_LABELS[mod.deliveryMethod] || mod.deliveryMethod}
Duration: ${mod.durationOffJobDays ? `${mod.durationOffJobDays} days` : ""}

LEARNING OUTCOMES:
${assignedLOs.map(lo => `
LO ${lo.sequence}: ${lo.loName}
- Performance Statement: ${lo.performanceStatement}
- Content Summary: ${lo.contentSummary}
- Assessment Criteria: ${lo.assessmentCriteria}
`).join("\n")}

TASK:
Create a detailed slide-by-slide outline covering this module. Provide a full table with all columns for every slide.

Slide types to include:
- Cover slide
- Module objectives slide
- Section divider slides (one per LO)
- Content slides (3-5 per LO)
- Demonstration/example slides
- Knowledge check slides
- Summary slide
- Assessment overview slide

Guidelines:
- Maximum 5 bullet points per content slide
- Maximum 8 words per bullet point
- Presenter notes should be full sentences the instructor can read or paraphrase
- Visual suggestions should be practical and describable
- Knowledge check slides: include the question and answer options

${POWERPOINT_FORMAT(mod.moduleName, courseName, classification)}`
}

function generateCourseAdminPrompt(des4, des1, des2) {
  const courseName = des4?.courseAim || "ADF Training Course"
  const classification = des4?.securityClearance || "PROTECTED"

  return `You are an instructional designer creating course administration instructions for Australian Defence Force training.

COURSE DETAILS:
Course: ${courseName}
Course Description: ${des4?.courseDescription || ""}
Course Level: ${des4?.courseLevel || ""}
Course Type: ${des4?.courseType || ""}
Security Classification: ${classification}
Training Authority: ${des1?.trainingAuthority || ""}
Minimum Students: ${des4?.minStudents || ""}
Maximum Students: ${des4?.maxStudents || ""}
Total Duration: ${des4?.totalDays ? `${des4.totalDays} days` : ""}

PREREQUISITES:
Service Prerequisites: ${des4?.servicePrerequisites || ""}
Qualification Prerequisites: ${des4?.qualificationPrerequisites || ""}
Eligibility: ${des4?.eligibilityDetails || ""}
Course Targets: ${des4?.courseTargets || ""}

FACILITY:
Location: ${des2?.facilityLocation || ""}
Facility: ${des2?.facilityDescription || ""}
Access Requirements: ${des2?.facilityAccess || ""}

SPECIAL INSTRUCTIONS: ${des4?.specialInstructions || ""}

TASK:
Create comprehensive course administration instructions. Include:

1. COURSE OVERVIEW
2. NOMINATION PROCESS
3. PRE-COURSE REQUIREMENTS
4. TRAVEL AND ACCOMMODATION
5. DURING COURSE
6. ASSESSMENT AND RESULTS
7. CONTACT DETAILS (template fields)

${WORD_FORMAT(`Course Administration Instructions — ${courseName}`, courseName, classification)}

ADDITIONAL FORMAT NOTES FOR ADMIN DOCUMENTS:
- Use a two-column layout for checklist sections (item | action/details)
- Include a one-page Quick Reference summary as the final page
- Highlight all dates and deadlines in bold
- Use callout boxes for critical information (security requirements, medical requirements)
- Include a nomination pro-forma table at the end (Name, Rank, Unit, Service No., Clearance, Contact)`
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dev1CopilotPrompts({ developPhase, onSave, onSubmit, saving }) {
  const [copiedPrompts, setCopiedPrompts] = useState({})
  const [notes, setNotes] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const designPhase = developPhase?.project?.designPhase
  const des1 = designPhase?.des1InputAnalysis || {}
  const des3 = designPhase?.des3LearningOutcomes || {}
  const des4 = designPhase?.des4CourseStructure || {}
  const des2 = developPhase?.project?.designPhase?.des2Environments || {}
  const los = des3?.learningOutcomes || []
  const modules = des4?.modules || []

  const savedPromptSets = developPhase?.promptSets || []
  const isCopied = (type, refId) =>
    copiedPrompts[`${type}-${refId}`] ||
    savedPromptSets.some(ps => ps.promptType === type && ps.referenceId === refId && ps.copied)

  const handleCopy = async (prompt, type, refId, refName) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedPrompts(prev => ({ ...prev, [`${type}-${refId}`]: true }))
    await onSave("prompt-set", {
      promptType: type,
      referenceId: refId,
      referenceName: refName,
      copied: true,
      notes: notes[`${type}-${refId}`] || null,
    })
  }

  const handleNoteChange = (type, refId, value) => {
    setNotes(prev => ({ ...prev, [`${type}-${refId}`]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit()
    setSubmitted(true)
  }

  const isPractical = (lo) => ["ON_JOB", "SIMULATION"].includes(lo.deliveryMethod)
  const isElearning = (lo) => ["E_LEARNING", "BLENDED", "SELF_PACED"].includes(lo.deliveryMethod)

  if (!designPhase || los.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">No approved LMP data found.</p>
        <p className="text-sm">The Design Phase must be approved before generating development prompts.</p>
      </div>
    )
  }

  const PromptCard = ({ title, icon, description, prompt, type, refId, refName, conditional }) => {
    const [expanded, setExpanded] = useState(false)
    const copied = isCopied(type, refId)

    return (
      <div className={`border rounded-xl overflow-hidden mb-4 ${copied ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}>
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                {conditional && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{conditional}</span>
                )}
                {copied && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Copied</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs border border-gray-300 text-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition"
            >
              {expanded ? "Hide ▲" : "Preview ▼"}
            </button>
            <button
              onClick={() => handleCopy(prompt, type, refId, refName)}
              className={`text-xs font-medium px-4 py-1.5 rounded-lg transition ${
                copied
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {copied ? "✓ Copied" : "Copy Prompt"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
              {prompt}
            </pre>
          </div>
        )}

        <div className="px-5 pb-4">
          <textarea
            value={notes[`${type}-${refId}`] || ""}
            onChange={e => handleNoteChange(type, refId, e.target.value)}
            rows={2}
            placeholder="Add notes about this output (optional)..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Intro */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-blue-800 mb-1">How to use Copilot Prompts</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Click <strong>Copy Prompt</strong> on any output below</li>
          <li>Open Microsoft Word or PowerPoint with Copilot enabled</li>
          <li>Paste the prompt into Copilot and press Enter</li>
          <li>Review, edit and refine the generated content</li>
          <li>Save your completed document</li>
        </ol>
        <p className="text-xs text-blue-600 mt-3">
          Each prompt includes detailed formatting instructions so Copilot produces ADF-styled documents ready for review. Always check and adapt the output for your specific context before use.
        </p>
      </div>

      {/* Course Admin — one per course */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">Course-Level Documents</h3>
        <p className="text-sm text-gray-500 mb-4">One document covering the entire course.</p>
        <PromptCard
          title="Course Administration Instructions"
          icon="📋"
          description="Nomination process, prerequisites, what to bring, travel, assessment and results, contacts"
          prompt={generateCourseAdminPrompt(des4, des1, des2)}
          type="COURSE_ADMIN"
          refId="course"
          refName="Course Admin Instructions"
        />
      </div>

      {/* Module-level documents */}
      {modules.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Module-Level Documents</h3>
          <p className="text-sm text-gray-500 mb-4">One document per module.</p>
          {modules.map((mod, modIndex) => (
            <div key={modIndex} className="mb-6">
              <div className="bg-gray-100 rounded-lg px-4 py-2 mb-3">
                <p className="text-sm font-semibold text-gray-700">Module {mod.sequence} — {mod.moduleName}</p>
              </div>
              <PromptCard
                title="Instructor Guide"
                icon="📖"
                description="Facilitator notes, delivery schedule, teaching points, assessment conduct, instructor tips"
                prompt={generateInstructorGuidePrompt(mod, los, des4, des1)}
                type="INSTRUCTOR_GUIDE"
                refId={mod.id || `mod-${mod.sequence}`}
                refName={`Instructor Guide — ${mod.moduleName}`}
              />
              <PromptCard
                title="Learner Workbook"
                icon="📝"
                description="Theory notes, worked examples, knowledge checks, practical preparation, self-assessment"
                prompt={generateLearnerWorkbookPrompt(mod, los, des4)}
                type="LEARNER_WORKBOOK"
                refId={mod.id || `mod-${mod.sequence}`}
                refName={`Learner Workbook — ${mod.moduleName}`}
              />
              <PromptCard
                title="Presentation Slides"
                icon="📊"
                description="Slide-by-slide outline with navy/gold ADF theme, content, visuals and presenter notes"
                prompt={generatePresentationPrompt(mod, los, des4)}
                type="PRESENTATION_SLIDES"
                refId={mod.id || `mod-${mod.sequence}`}
                refName={`Presentation Slides — ${mod.moduleName}`}
              />
              {(mod.summativeAssessments || []).map((sa, saIndex) => (
                <PromptCard
                  key={saIndex}
                  title={`Assessment Tool — ${sa.saName || `SA ${saIndex + 1}`}`}
                  icon="✅"
                  description="Formal assessment tool with observation checklist, S/NYS ratings, result record, feedback guide"
                  prompt={generateAssessmentToolPrompt(sa, mod, los, des4)}
                  type="ASSESSMENT_TOOL"
                  refId={sa.id || `sa-${mod.sequence}-${saIndex}`}
                  refName={`Assessment Tool — ${sa.saName}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* LO-level documents */}
      {los.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Learning Outcome Documents</h3>
          <p className="text-sm text-gray-500 mb-4">One document per Learning Outcome.</p>
          {los.map((lo, loIndex) => (
            <div key={loIndex} className="mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-3">
                <p className="text-sm font-semibold text-blue-800">LO {lo.sequence} — {lo.loName}</p>
              </div>
              <PromptCard
                title="Lesson Plan"
                icon="📄"
                description="Lesson structure, key teaching points, formative assessment, instructor notes, ADF Word format"
                prompt={generateLessonPlanPrompt(lo, des4, des1)}
                type="LESSON_PLAN"
                refId={lo.id || `lo-${lo.sequence}`}
                refName={`Lesson Plan — LO ${lo.sequence} ${lo.loName}`}
              />
              {isPractical(lo) && (
                <PromptCard
                  title="Practical Activity Book"
                  icon="🔧"
                  description="Step-by-step procedure, practice scenarios, self-assessment checklist, field-friendly format"
                  prompt={generatePracticalActivityPrompt(lo, des4, des1)}
                  type="PRACTICAL_ACTIVITY"
                  refId={lo.id || `lo-${lo.sequence}`}
                  refName={`Practical Activity — LO ${lo.sequence} ${lo.loName}`}
                  conditional="Practical/On-Job LO"
                />
              )}
              {isElearning(lo) && (
                <PromptCard
                  title="ADELE/Moodle Storyboard"
                  icon="💻"
                  description="Screen-by-screen storyboard table with on-screen text, narration, visuals, interactions"
                  prompt={generateStoryboardPrompt(lo, des4)}
                  type="STORYBOARD"
                  refId={lo.id || `lo-${lo.sequence}`}
                  refName={`Storyboard — LO ${lo.sequence} ${lo.loName}`}
                  conditional="eLearning/Blended LO"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Submit Develop Phase for Approval</h3>
        <p className="text-sm text-gray-500 mb-4">
          Once you have generated and used the Copilot prompts to develop your learning materials, submit for manager review.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || submitted}
            className={`font-medium px-8 py-2.5 rounded-lg transition disabled:opacity-50 ${
              submitted
                ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {submitted ? "✓ Submitted for Approval" : saving ? "Submitting..." : "Submit Develop Phase for Approval →"}
          </button>
        </div>
      </div>

    </div>
  )
}
