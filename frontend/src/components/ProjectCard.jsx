import { useNavigate } from "react-router-dom"

const phaseOrder = ['ANALYSE', 'DESIGN', 'DEVELOP', 'IMPLEMENT', 'EVALUATE']

const statusColors = {
  DRAFT: 'bg-gray-200 text-gray-600',
  SUBMITTED: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700'
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          project.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
          project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {project.status}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {phaseOrder.map((phase) => {
          const phaseData = project.phases?.find(p => p.type === phase)
          const status = phaseData?.status || 'DRAFT'
          return (
            <div key={phase} className="flex-1">
              <div className={`text-center text-xs py-1 rounded-lg font-medium ${statusColors[status]}`}>
                {phase.charAt(0)}
              </div>
              <p className="text-center text-xs text-gray-400 mt-1 hidden sm:block">
                {phase.charAt(0) + phase.slice(1).toLowerCase()}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Created {new Date(project.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}