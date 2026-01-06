import { ColumnDef } from '@tanstack/react-table'
import { ActionsCell } from './ActionsCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { MenuCell } from './MenuCell'
import { Bool_StatusCell } from '../../../../components/statusCell/Bool_StatusCell'

export const menuColumns = (namespace: string): ColumnDef<any>[] => [
  {
    accessorKey: 'MenuName',
    header: (header) => (
      <SortColumnHeader header={header} title='Menu' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => (<MenuCell namespace={namespace} menu={row.original} />),
  },
  {
    accessorKey: 'MenuPath',
    header: (header) => (
      <SortColumnHeader header={header} title='Đường dẫn' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'MenuParentName',
    header: (header) => (
      <SortColumnHeader header={header} title='Menu cha' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Status',
    header: (header) => (
      <SortColumnHeader header={header} title='Tình trạng' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <Bool_StatusCell isActive={row.original.Status} />,
  },
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} menu={row.original} />,
  },
]
