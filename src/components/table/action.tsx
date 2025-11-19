import { Edit, Eye, Trash2 } from 'lucide-react'

interface ActionProps {
  onShow?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const Action = ({ onShow, onEdit, onDelete }: ActionProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {onShow && (
        <button
          onClick={onShow}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          title="View"
        >
          <Eye className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          title="Edit"
        >
          <Edit className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-200 cursor-pointer"
          title="Delete"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>
      )}
    </div>
  )
}

export default Action
