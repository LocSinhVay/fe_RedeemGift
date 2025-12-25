import { ColumnDef } from '@tanstack/react-table'
import { SortColumnHeader } from '../../../../../components/sortColumn/SortColumnHeader'
import { formatDate } from '../../../../../hooks/formatDate'

export const WinningsColumns = (namespace: string): ColumnDef<any>[] => [
  {
    accessorKey: 'PrizeName',
    header: (header) => (
      <SortColumnHeader header={header} title='Giải thưởng' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'WonAt',
    header: (header) => (
      <SortColumnHeader header={header} title='Thời gian quay' className='min-w-250px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const raw = row.original.WonAt?.toString() || ''
      return formatDate(raw)
    }
  },
]
