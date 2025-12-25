import { ColumnDef } from '@tanstack/react-table'
import { StatusCell } from './StatusCell'
import { ActionsCell } from './ActionsCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { RoleCell } from './RoleCell'

export const roleColumns = (namespace: string): ColumnDef<any>[] => [
  {
    accessorKey: 'RoleID',
    header: (header) => (
      <SortColumnHeader header={header} title='Mã Quyền' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'RoleName',
    header: (header) => (
      <SortColumnHeader header={header} title='Tên Quyền' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => (<RoleCell namespace={namespace} role={row.original} />),
  },
  {
    accessorKey: 'Symbol',
    header: (header) => (
      <SortColumnHeader header={header} title='Ký hiệu' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Status',
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
    cell: ({ row }) => <ActionsCell namespace={namespace} role={row.original} />,
  },
]
