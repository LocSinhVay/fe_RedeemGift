import { ColumnDef } from '@tanstack/react-table';
import { ActionsCell } from './ActionsCell';
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader';
import { allowPositiveNumbersOnly } from '../../../../hooks/allowPositiveNumbersOnly';
import { Bool_StatusCell } from '../../../../components/statusCell/Bool_StatusCell';

export const GiftColumns = (namespace: string): ColumnDef<any>[] => [
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title="#" className="min-w-100px" namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} gift={row.original} />,
  },
  // {
  //   accessorKey: 'GiftID',
  //   header: (header) => (
  //     <SortColumnHeader header={header} title="ID" className="min-w-125px" namespace={namespace} />
  //   ),
  // },
  {
    accessorKey: 'GiftName',
    header: (header) => (
      <SortColumnHeader header={header} title="Tên quà tặng" className="min-w-125px" namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectCode',
    header: (header) => (
      <SortColumnHeader header={header} title="Dự án" className="min-w-125px" namespace={namespace} />
    ),
  },
  {
    accessorKey: 'Quantity',
    header: (header) => (
      <SortColumnHeader
        header={header}
        title='Số lượng'
        className='min-w-125px'
        namespace={namespace}
      />
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
    accessorKey: 'IsActive',
    header: (header) => (
      <SortColumnHeader header={header} title="Tình trạng" className="min-w-100px" namespace={namespace} />
    ),
    cell: ({ row }) => <Bool_StatusCell isActive={row.original.IsActive} />,
  },
];
