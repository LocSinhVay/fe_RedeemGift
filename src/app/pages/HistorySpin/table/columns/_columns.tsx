import { ColumnDef } from '@tanstack/react-table'
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader'
import { allowPositiveNumbersOnly } from '../../../../hooks/allowPositiveNumbersOnly'
import { WinningsCell } from './WinningsCell'

export const HistorySpinColumns = (namespace: string): ColumnDef<any>[] => [
  {
    id: 'historySpinDetail',
    header: (header) => (
      <SortColumnHeader header={header} title='#' className='min-w-120px' namespace={namespace} />
    ),
    cell: ({ row }) => <WinningsCell qrCode={row.original.QRCode} billImagePath={row.original.BillImagePath} />,
  },
  {
    accessorKey: 'QRCode',
    header: (header) => (
      <SortColumnHeader header={header} title='QR' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'CustomerName',
    header: (header) => (
      <SortColumnHeader header={header} title='Tên khách hàng' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'PhoneNumber',
    header: (header) => (
      <SortColumnHeader header={header} title='Số điện thoại' className='min-w-125px' namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectCode',
    header: (header) => (
      <SortColumnHeader header={header} title='Dự án' className='min-w-125px' namespace={namespace} />
    )
  },
  {
    accessorKey: 'SpinsGranted',
    header: (header) => (
      <SortColumnHeader header={header} title='Tổng lượt' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const raw = row.original.SpinsGranted?.toString() || ''
      return allowPositiveNumbersOnly(raw)
    }
  },
  {
    accessorKey: 'SpinsUsed',
    header: (header) => (
      <SortColumnHeader header={header} title='Số lượt dùng' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const raw = row.original.SpinsUsed?.toString() || ''
      return allowPositiveNumbersOnly(raw)
    }
  },
  {
    accessorKey: 'BillValue',
    header: (header) => (
      <SortColumnHeader header={header} title='Tổng bill' className='min-w-125px' namespace={namespace} />
    ),
    cell: ({ row }) => {
      const raw = row.original.BillValue?.toString() || ''
      return allowPositiveNumbersOnly(raw)
    }
  },
]
