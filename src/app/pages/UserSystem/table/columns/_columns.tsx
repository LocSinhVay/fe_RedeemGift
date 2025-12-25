import { ColumnDef } from '@tanstack/react-table'
import { StatusCell } from './StatusCell'
import { ActionsCell } from './ActionsCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { UserAvatarCell } from './UserAvatarCell'

export const userSystemColumns = (namespace: string): ColumnDef<any>[] => [
  {
    accessorKey: 'Username',
    header: (header) => (
      <SortColumnHeader header={header} title='Nhân viên' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => <UserAvatarCell namespace={namespace} user={row.original} />,
  },
  {
    accessorKey: 'RoleName',
    header: (header) => (
      <SortColumnHeader header={header} title='Quyền' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Email',
    header: (header) => (
      <SortColumnHeader header={header} title='Email' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Phone',
    header: (header) => (
      <SortColumnHeader header={header} title='SĐT' className='min-w-110px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectCodes',
    header: (header) => (
      <SortColumnHeader header={header} title='Dự án' className='min-w-100px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'StatusName',
    header: (header) => (
      <SortColumnHeader header={header} title='Tình trạng' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <StatusCell status={row.original.Status} />,
  },
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} user={row.original} />,
  },
]
