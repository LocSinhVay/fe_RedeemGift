import { FC, useMemo } from 'react'

type Props = {
  status?: 'Waiting' | 'Activated' | 'Blocked' | 'Rejected'
}

export const String_StatusCell: FC<Props> = ({ status }) => {
  // 🔹 Dùng useMemo để tránh gọi lại nhiều lần
  const statusClass = useMemo(() => {
    switch (status) {
      case 'Activated':
        return 'badge badge-light-success'
      case 'Blocked':
        return 'badge badge-light-danger'
      case 'Waiting':
        return 'badge badge-light-warning'
      case 'Rejected':
        return 'badge badge-light-dark'
      default:
        return 'badge badge-light' // Mặc định không màu nếu status không xác định
    }
  }, [status])

  return <span className={statusClass}>{status || 'Unknown'}</span>
}
