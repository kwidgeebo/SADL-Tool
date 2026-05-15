const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, TabStopType,
  TabStopPosition, PageBreak
} = require('docx')

// ─── ADF Style Constants ──────────────────────────────────────────────────────

const NAVY   = '041534'
const GOLD   = 'C9A84C'
const OLIVE  = '546435'
const WHITE  = 'FFFFFF'
const LGRAY  = 'F5F3F0'
const MGRAY  = 'E5E1DC'

const A4 = { width: 11906, height: 16838 }
const MARGINS = { top: 1134, right: 1134, bottom: 1134, left: 1134 } // ~2cm
const CONTENT_WIDTH = A4.width - MARGINS.left - MARGINS.right // 9638 DXA

const cellBorder = (color = MGRAY) => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
})

const noBorder = () => ({
  top:    { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'auto' },
})

const DELIVERY_LABELS = {
  INSTRUCTOR_LED: 'Instructor Led', SELF_PACED: 'Self Paced', BLENDED: 'Blended',
  ON_JOB: 'On Job', SIMULATION: 'Simulation', E_LEARNING: 'eLearning', OTHER: 'Other',
}

const TRAINING_LEVEL_LABELS = {
  LEVEL_1: 'Level 1 — Awareness',
  LEVEL_2: 'Level 2 — Supervised Performance',
  LEVEL_3: 'Level 3 — Unsupervised Performance',
  LEVEL_4: 'Level 4 — Instructional Ability',
}

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const adfStyles = () => ({
  default: {
    document: { run: { font: 'Arial', size: 22, color: '1b1b1e' } },
  },
  paragraphStyles: [
    {
      id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 32, bold: true, font: 'Arial', color: NAVY },
      paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 4 } } }
    },
    {
      id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 26, bold: true, font: 'Arial', color: NAVY },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
    },
    {
      id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 22, bold: true, font: 'Arial', color: '45464e' },
      paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 }
    },
  ]
})

const adfNumbering = () => ({
  config: [
    {
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: 'Arial', size: 22 } }
      }]
    },
    {
      reference: 'numbers',
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: 'Arial', size: 22 } }
      }]
    },
  ]
})

const makeHeader = (courseTitle, docType, classification) => ({
  default: new Header({
    children: [
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 4 } },
        tabStops: [
          { type: TabStopType.CENTER, position: CONTENT_WIDTH / 2 },
          { type: TabStopType.RIGHT, position: CONTENT_WIDTH },
        ],
        children: [
          new TextRun({ text: courseTitle, font: 'Arial', size: 16, color: NAVY, bold: true }),
          new TextRun({ text: '\t' + docType, font: 'Arial', size: 16, color: '45464e' }),
          new TextRun({ text: '\t' + classification, font: 'Arial', size: 16, color: '75777f' }),
        ]
      })
    ]
  })
})

const makeFooter = (version) => ({
  default: new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 4 } },
        tabStops: [
          { type: TabStopType.CENTER, position: CONTENT_WIDTH / 2 },
          { type: TabStopType.RIGHT, position: CONTENT_WIDTH },
        ],
        children: [
          new TextRun({ text: version, font: 'Arial', size: 16, color: '75777f' }),
          new TextRun({ text: '\t', font: 'Arial', size: 16 }),
          new TextRun({ children: [new PageNumber()], font: 'Arial', size: 16, color: '75777f' }),
          new TextRun({ text: '\t' + new Date().toLocaleDateString('en-AU'), font: 'Arial', size: 16, color: '75777f' }),
        ]
      })
    ]
  })
})

const coverPage = (title, subtitle, courseName, classification, trainingAuthority) => [
  new Paragraph({
    children: [new TextRun({ text: '', size: 22 })],
    spacing: { before: 1440, after: 0 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'SADL-Up', font: 'IBM Plex Mono', size: 20, color: GOLD, bold: true })
    ],
    spacing: { before: 0, after: 160 }
  }),
  new Paragraph({
    children: [new TextRun({ text: title, font: 'Arial', size: 52, bold: true, color: NAVY })],
    spacing: { before: 0, after: 160 }
  }),
  new Paragraph({
    children: [new TextRun({ text: subtitle, font: 'Arial', size: 28, color: '45464e' })],
    spacing: { before: 0, after: 480 }
  }),
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
    children: [new TextRun({ text: '' })],
    spacing: { before: 0, after: 480 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Course:', font: 'Arial', size: 20, bold: true, color: NAVY })],
    spacing: { before: 0, after: 80 }
  }),
  new Paragraph({
    children: [new TextRun({ text: courseName, font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 0, after: 240 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Training Authority:', font: 'Arial', size: 20, bold: true, color: NAVY })],
    spacing: { before: 0, after: 80 }
  }),
  new Paragraph({
    children: [new TextRun({ text: trainingAuthority || '—', font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 0, after: 240 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Security Classification:', font: 'Arial', size: 20, bold: true, color: NAVY })],
    spacing: { before: 0, after: 80 }
  }),
  new Paragraph({
    children: [new TextRun({ text: classification || 'PROTECTED', font: 'Arial', size: 22, bold: true, color: '75777f' })],
    spacing: { before: 0, after: 240 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Version:', font: 'Arial', size: 20, bold: true, color: NAVY })],
    spacing: { before: 0, after: 80 }
  }),
  new Paragraph({
    children: [new TextRun({ text: '0.1 DRAFT', font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 0, after: 240 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Date:', font: 'Arial', size: 20, bold: true, color: NAVY })],
    spacing: { before: 0, after: 80 }
  }),
  new Paragraph({
    children: [new TextRun({ text: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 0, after: 0 }
  }),
  new Paragraph({ children: [new PageBreak()] }),
]

const labeledField = (label, value) => {
  if (!value) return []
  return [
    new Paragraph({
      children: [new TextRun({ text: label, font: 'Arial', size: 20, bold: true, color: NAVY, allCaps: true })],
      spacing: { before: 200, after: 60 }
    }),
    new Paragraph({
      children: [new TextRun({ text: value, font: 'Arial', size: 22, color: '1b1b1e' })],
      spacing: { before: 0, after: 120 }
    }),
  ]
}

const infoTable = (rows) => new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [2400, CONTENT_WIDTH - 2400],
  rows: rows.filter(([, v]) => v).map(([label, value]) =>
    new TableRow({
      children: [
        new TableCell({
          borders: cellBorder(),
          width: { size: 2400, type: WidthType.DXA },
          shading: { fill: LGRAY, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 20, bold: true, color: NAVY })] })]
        }),
        new TableCell({
          borders: cellBorder(),
          width: { size: CONTENT_WIDTH - 2400, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: String(value), font: 'Arial', size: 22, color: '1b1b1e' })] })]
        }),
      ]
    })
  )
})

const sectionBox = (title, content) => [
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: title, font: 'Arial', size: 26, bold: true, color: NAVY })],
    spacing: { before: 320, after: 160 }
  }),
  new Paragraph({
    children: [new TextRun({ text: content || '—', font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 0, after: 200 }
  }),
]

const bulletList = (items) => items.filter(Boolean).map(item =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text: item, font: 'Arial', size: 22, color: '1b1b1e' })],
    spacing: { before: 60, after: 60 }
  })
)

const sendDocx = async (res, doc, filename) => {
  const buffer = await Packer.toBuffer(doc)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Content-Length', buffer.length)
  res.send(buffer)
}

// ─── Helper: fetch design phase with full LMP data ────────────────────────────

const getDesignData = async (projectId) => {
  return await prisma.designPhase.findUnique({
    where: { projectId },
    include: {
      project: true,
      des1InputAnalysis: true,
      des2Environments: true,
      des3LearningOutcomes: { include: { learningOutcomes: true } },
      des4CourseStructure: {
        include: {
          modules: {
            include: {
              formativeAssessments: true,
              summativeAssessments: true,
            }
          },
          evaluationPlan: true,
        }
      },
    }
  })
}

// ─── 1. Lesson Plan ───────────────────────────────────────────────────────────

const generateLessonPlan = async (req, res) => {
  try {
    const { projectId, loId } = req.params
    const designPhase = await getDesignData(projectId)

    if (!designPhase) return res.status(404).json({ message: 'Design phase not found' })

    const des1 = designPhase.des1InputAnalysis || {}
    const des4 = designPhase.des4CourseStructure || {}
    const los = designPhase.des3LearningOutcomes?.learningOutcomes || []
    const lo = los.find(l => l.id === loId)

    if (!lo) return res.status(404).json({ message: 'Learning outcome not found' })

    const courseName = des4.courseAim || designPhase.project?.title || 'ADF Training Course'
    const classification = des4.securityClearance || 'PROTECTED'
    const trainingAuthority = des1.trainingAuthority || ''
    const docTitle = `Lesson Plan — LO ${lo.sequence}`
    const docSubtitle = lo.loName || 'Learning Outcome'

    const doc = new Document({
      styles: adfStyles(),
      numbering: adfNumbering(),
      sections: [
        // Cover page — no header/footer
        {
          properties: {
            page: { size: A4, margin: MARGINS }
          },
          children: coverPage(docTitle, docSubtitle, courseName, classification, trainingAuthority)
        },
        // Main content — with header/footer
        {
          properties: {
            page: { size: A4, margin: MARGINS }
          },
          headers: makeHeader(courseName, docTitle, classification),
          footers: makeFooter('Version 0.1 DRAFT'),
          children: [

            // 1. Lesson Overview
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. Lesson Overview')], spacing: { before: 0, after: 160 } }),
            infoTable([
              ['LO Reference',     `LO ${lo.sequence}`],
              ['Lesson Title',     lo.loName],
              ['Training Level',   TRAINING_LEVEL_LABELS[lo.trainingLevel] || lo.trainingLevel],
              ['Delivery Method',  DELIVERY_LABELS[lo.deliveryMethod] || lo.deliveryMethod],
              ['Duration (Off Job)', lo.durationOffJobHours ? `${lo.durationOffJobHours} hours / ${lo.durationOffJobDays || '—'} days` : '—'],
              ['Duration (On Job)',  lo.durationOnJobHours  ? `${lo.durationOnJobHours} hours / ${lo.durationOnJobDays || '—'} days`  : '—'],
              ['Pre-requisite LOs', lo.prerequisiteLOs || 'None'],
              ['Resources Required', lo.resources || '—'],
              ['References',        lo.references || '—'],
            ]),

            new Paragraph({ children: [new TextRun('')], spacing: { before: 320, after: 0 } }),

            // 2. Learning Objective
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. Learning Objective')], spacing: { before: 0, after: 160 } }),
            ...labeledField('Performance Statement', lo.performanceStatement),
            ...labeledField('Performance Conditions', lo.performanceConditions),
            ...labeledField('Performance Standard', lo.performanceStandard),
            ...labeledField('Assessment Criteria', lo.assessmentCriteria),
            ...labeledField('Content Summary', lo.contentSummary),

            new Paragraph({ children: [new TextRun('')], spacing: { before: 320, after: 0 } }),

            // 3. Lesson Structure
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('3. Lesson Structure')], spacing: { before: 0, after: 160 } }),

            // Introduction
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.1 Introduction')], spacing: { before: 240, after: 120 } }),
            new Table({
              width: { size: CONTENT_WIDTH, type: WidthType.DXA },
              columnWidths: [1600, 5438, 2600],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder(), width: { size: 1600, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, verticalAlign: VerticalAlign.CENTER,
                      children: [new Paragraph({ children: [new TextRun({ text: 'Phase', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 5438, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Instructor Actions / Key Teaching Points', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 2600, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Time / Resources', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                  ]
                }),
                ...['Introduction', 'Body — Part 1', 'Body — Part 2', 'Body — Part 3', 'Conclusion'].map((phase, i) =>
                  new TableRow({
                    children: [
                      new TableCell({ borders: cellBorder(), width: { size: 1600, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: phase, font: 'Arial', size: 20, bold: true, color: NAVY })] })] }),
                      new TableCell({ borders: cellBorder(), width: { size: 5438, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR }, margins: { top: 160, bottom: 160, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] })] }),
                      new TableCell({ borders: cellBorder(), width: { size: 2600, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR }, margins: { top: 160, bottom: 160, left: 120, right: 120 },
                        children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] })] }),
                    ]
                  })
                ),
              ]
            }),

            new Paragraph({ children: [new TextRun('')], spacing: { before: 320, after: 0 } }),

            // 4. Formative Assessment
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('4. Formative Assessment')], spacing: { before: 0, after: 160 } }),
            new Paragraph({ children: [new TextRun({ text: 'Record the formative assessment activities planned for this lesson.', font: 'Arial', size: 22, color: '75777f', italics: true })], spacing: { before: 0, after: 200 } }),
            new Table({
              width: { size: CONTENT_WIDTH, type: WidthType.DXA },
              columnWidths: [3200, 3200, 3238],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder(), width: { size: 3200, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Assessment Activity', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 3200, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Method', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 3238, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Timing', font: 'Arial', size: 20, bold: true, color: WHITE })] })] }),
                  ]
                }),
                ...[1, 2, 3].map(i => new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder(), width: { size: 3200, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 3200, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] })] }),
                    new TableCell({ borders: cellBorder(), width: { size: 3238, type: WidthType.DXA }, margins: { top: 200, bottom: 200, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: ' ', font: 'Arial', size: 22 })] })] }),
                  ]
                }))
              ]
            }),

            new Paragraph({ children: [new TextRun('')], spacing: { before: 320, after: 0 } }),

            // 5. Assessment Preparation
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('5. Assessment Preparation')], spacing: { before: 0, after: 160 } }),
            ...labeledField('Related Assessments', lo.relatedAssessments),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Standards Students Must Meet')], spacing: { before: 240, after: 120 } }),
            ...bulletList((lo.assessmentCriteria || '').split('\n').filter(Boolean)),

            new Paragraph({ children: [new TextRun('')], spacing: { before: 320, after: 0 } }),

            // 6. Instructor Notes
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('6. Instructor Notes')], spacing: { before: 0, after: 160 } }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Common Student Errors')], spacing: { before: 240, after: 120 } }),
            new Paragraph({ children: [new TextRun({ text: '[Complete prior to delivery — list common errors and correction strategies]', font: 'Arial', size: 22, color: '75777f', italics: true })], spacing: { before: 0, after: 200 } }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('WHS / Safety Considerations')], spacing: { before: 240, after: 120 } }),
            new Paragraph({ children: [new TextRun({ text: '[Note any WHS considerations for this lesson]', font: 'Arial', size: 22, color: '75777f', italics: true })], spacing: { before: 0, after: 200 } }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Delivery Tips')], spacing: { before: 240, after: 120 } }),
            new Paragraph({ children: [new TextRun({ text: '[Add delivery tips and best practices for this lesson]', font: 'Arial', size: 22, color: '75777f', italics: true })], spacing: { before: 0, after: 200 } }),

          ]
        }
      ]
    })

    const safeLoName = (lo.loName || `LO${lo.sequence}`).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    await sendDocx(res, doc, `LessonPlan_LO${lo.sequence}_${safeLoName}.docx`)

  } catch (error) {
    console.error('Generate lesson plan error:', error)
    res.status(500).json({ message: 'Failed to generate lesson plan' })
  }
}

module.exports = {
  generateLessonPlan,
}