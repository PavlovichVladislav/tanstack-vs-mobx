import type { User } from '@/entities/user/types'
import { styles } from './user-badge.styles'

type UserBadgeProps = {
  user?: User
  isLoading?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UserBadge({ user, isLoading }: UserBadgeProps) {
  if (isLoading) {
    return <div className={styles.skeleton}>Loading user...</div>
  }

  if (!user) {
    return <div className={styles.skeleton}>No user</div>
  }

  return (
    <div className={styles.root}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
      ) : (
        <div className={styles.fallback}>{getInitials(user.name)}</div>
      )}

      <div className={styles.content}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.role}>{user.role}</div>
      </div>
    </div>
  )
}