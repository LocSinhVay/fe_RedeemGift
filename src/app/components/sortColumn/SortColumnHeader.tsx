import clsx from 'clsx'
import { FC, useCallback } from 'react'
import { HeaderContext } from '@tanstack/react-table'
import { useQueryRequest } from '../../services/QueryRequestProvider'

type Props = {
  className?: string
  title?: string
  header: HeaderContext<any, unknown>
  namespace: string // 📌 Thêm namespace để xác định bảng nào đang sort
}

export const SortColumnHeader: FC<Props> = ({ className, title, header, namespace }) => {
  const id = header.column.id
  const { state, updateState } = useQueryRequest(namespace) // 📌 Sử dụng namespace riêng

  const isSelectedForSorting = state.sort === id
  const order: 'asc' | 'desc' | undefined = state.order

  const sortColumn = useCallback(() => {
    if (!updateState) return
    if (id === 'actions' || id === 'selection') return

    updateState({
      sort: isSelectedForSorting ? (order === 'asc' ? id : undefined) : id,
      order: isSelectedForSorting ? (order === 'asc' ? 'desc' : undefined) : 'asc',
    })
  }, [id, isSelectedForSorting, order, updateState])

  return (
    <span
      className={clsx(className, isSelectedForSorting && order && `table-sort-${order}`)}
      style={{ cursor: 'pointer' }}
      onClick={sortColumn}
    >
      {title}
    </span>
  )
}
