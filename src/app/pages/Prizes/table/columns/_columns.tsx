import { ColumnDef } from '@tanstack/react-table'
import { ActionsCell } from './ActionsCell'
import { StatusCell } from './StatusCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { allowPositiveNumbersOnly } from '../../../../hooks/allowPositiveNumbersOnly'

export const PrizesColumns = (namespace: string): ColumnDef<any>[] => [
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} prizes={row.original} />,
  },
  {
    accessorKey: 'PrizeName',
    header: (header) => (
      <SortColumnHeader header={header} title='Giải thưởng' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectCode',
    header: (header) => (
      <SortColumnHeader header={header} title='Dự án' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Quantity',
    header: (header) => (
      <SortColumnHeader header={header} title='Số lượng tồn' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const { Quantity, IsUnlimited } = row.original;
      if (IsUnlimited) {
        return <span style={{ color: '#28a745', fontWeight: 600 }}>Không giới hạn</span>;
      }
      const raw = Quantity?.toString() || '';
      return allowPositiveNumbersOnly(raw);
    },
  },
  {
    accessorKey: 'Weight',
    header: (header) => (
      <SortColumnHeader header={header} title='Trọng số (%)' className='min-w-125px' namespace={namespace} />
    )
  },
  {
    accessorKey: 'RemainingWeight',
    header: (header) => (
      <SortColumnHeader header={header} title='Trọng số còn lại (%)' className='min-w-125px' namespace={namespace} />
    )
  },
  {
    accessorKey: 'IsActive',
    header: (header) => (
      <SortColumnHeader header={header} title='Tình trạng' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <StatusCell isActive={row.original.IsActive} />,
  },
]
