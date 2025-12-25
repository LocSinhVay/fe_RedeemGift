import { ColumnDef } from '@tanstack/react-table'
import { StatusCell } from './StatusCell'
import { ActionsCell } from './ActionsCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { EmailConfigCell } from './EmailConfigCell'

const emailConfigColumns = (namespace: string): ColumnDef<any>[] => [
  {
    accessorKey: 'SenderEmail',
    header: (header) => (
      <SortColumnHeader header={header} title='Email Config' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => (<EmailConfigCell namespace={namespace} emailConfig={row.original} />),
  },
  {
    accessorKey: 'Type',
    header: (header) => (
      <SortColumnHeader header={header} title='Loại Email' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'IsActive',
    header: (header) => (
      <SortColumnHeader header={header} title='Tình trạng' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <StatusCell isActive={row.original.IsActive} />,
  },
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} emailConfig={row.original} />,
  },
]

export { emailConfigColumns }
