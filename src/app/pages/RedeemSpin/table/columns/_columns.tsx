import { ColumnDef } from '@tanstack/react-table'
import { ActionsCell } from './ActionsCell'
import { StatusCell } from './StatusCell'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { allowPositiveNumbersOnly } from '../../../../hooks/allowPositiveNumbersOnly'
import { formatDate } from '../../../../hooks/formatDate'

export const RedeemSpinColumns = (namespace: string): ColumnDef<any>[] => [
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} redeemSpin={row.original} />,
  },
  {
    accessorKey: 'ProjectCode',
    header: (header) => (
      <SortColumnHeader header={header} title='Dự án' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'StartDate',
    header: (header) => (
      <SortColumnHeader
        header={header}
        title='Từ Ngày'
        className='min-w-100px'
        namespace={namespace}
      />
    ),
    cell: ({ row }) => formatDate(row.original.StartDate)
  },
  {
    accessorKey: 'EndDate',
    header: (header) => (
      <SortColumnHeader
        header={header}
        title='Đến Ngày'
        className='min-w-100px'
        namespace={namespace}
      />
    ),
    cell: ({ row }) => formatDate(row.original.EndDate)
  },
  {
    accessorKey: 'BillValuePerSpin',
    header: (header) => (
      <SortColumnHeader header={header} title='Giá trị (VNĐ)' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const raw = row.original.BillValuePerSpin?.toString() || ''
      return allowPositiveNumbersOnly(raw)
    }
  },
  {
    accessorKey: 'MaxSpinsPerBill',
    header: (header) => (
      <SortColumnHeader
        header={header}
        title='Số lượt quay'
        className='min-w-125px'
        namespace={namespace}
      />
    ),
    cell: ({ row }) => {
      const value = row.original.MaxSpinsPerBill
      // if (value === 0) {
      //   return 'Không giới hạn'
      // }
      const raw = value?.toString() || ''
      return allowPositiveNumbersOnly(raw)
    }
  },
  {
    accessorKey: 'IsActive',
    header: (header) => (
      <SortColumnHeader header={header} title='Tình trạng' className='min-w-100px' namespace={namespace} />
    ),
    cell: ({ row }) => <StatusCell isActive={row.original.IsActive} />,
  },
]
