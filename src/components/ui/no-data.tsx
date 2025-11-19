import { FolderArchive, FileText, Search, Database, Inbox, AlertCircle, Info, type LucideIcon } from 'lucide-react'
import { cn } from "../../lib/utils"

export type NoDataVariant = 'default' | 'search' | 'files' | 'database' | 'inbox' | 'alert' | 'info'

interface NoDataProps {
  message: string
  description?: string
  variant?: NoDataVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
  action?: React.ReactNode
  icon?: LucideIcon
}

const iconMap: Record<NoDataVariant, LucideIcon> = {
  default: FolderArchive,
  search: Search,
  files: FileText,
  database: Database,
  inbox: Inbox,
  alert: AlertCircle,
  info: Info,
}

const sizeClasses = {
  sm: {
    container: 'py-6',
    icon: 'w-6 h-6',
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    container: 'py-8',
    icon: 'w-8 h-8',
    title: 'text-base',
    description: 'text-sm',
  },
  lg: {
    container: 'py-12',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-base',
  },
}

const NoData = ({
  message,
  description,
  variant = 'default',
  size = 'md',
  className,
  action,
  icon: CustomIcon,
}: NoDataProps) => {
  const IconComponent = CustomIcon || iconMap[variant]
  const sizeConfig = sizeClasses[size]

  return (
    <div className={cn('text-center text-muted-foreground', sizeConfig.container, className)}>
      <div className='flex flex-col items-center space-y-3'>
        {/* Icon with background circle for better visual hierarchy */}
        <div
          className={cn(
            'rounded-full bg-muted/60 dark:bg-muted/30 flex items-center justify-center',
            size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
          )}
        >
          <IconComponent className={cn('text-muted-foreground/70', sizeConfig.icon)} />
        </div>

        {/* Content */}
        <div className='space-y-2 max-w-sm'>
          <h3 className={cn('font-medium text-foreground', sizeConfig.title)}>{message}</h3>

          {description && <p className={cn('text-muted-foreground', sizeConfig.description)}>{description}</p>}
        </div>

        {/* Action button */}
        {action && <div className='pt-2'>{action}</div>}
      </div>
    </div>
  )
}

// Backward compatibility
const NoRecord = ({ message }: { message: string }) => {
  return <NoData message={message} />
}

export default NoData
export { NoRecord }
