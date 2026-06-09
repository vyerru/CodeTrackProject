import type { CourseLevel } from '@/shared/types'
import { getLevelColor } from '@/shared/utils'

interface Props {
  level: CourseLevel
}

export default function LevelBadge({ level }: Props) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getLevelColor(level)}`}>
      {level}
    </span>
  )
}
