import { ColumnDef } from '@tanstack/react-table';
import { ActionsCell } from './ActionsCell';
import { SortColumnHeader } from '../../../../components/sortColumn/SortColumnHeader';
import { Bool_StatusCell } from '../../../../components/statusCell/Bool_StatusCell';

export const ProjectColumns = (namespace: string): ColumnDef<any>[] => [
  {
    id: 'actions',
    header: (header) => (
      <SortColumnHeader header={header} title="#" className="min-w-100px" namespace={namespace} />
    ),
    cell: ({ row }) => <ActionsCell namespace={namespace} project={row.original} />,
  },
  {
    accessorKey: 'ProjectID',
    header: (header) => (
      <SortColumnHeader header={header} title="ID" className="min-w-125px" namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectCode',
    header: (header) => (
      <SortColumnHeader header={header} title="Mã dự án" className="min-w-125px" namespace={namespace} />
    ),
  },
  {
    accessorKey: 'ProjectName',
    header: (header) => (
      <SortColumnHeader header={header} title="Tên dự án" className="min-w-125px" namespace={namespace} />
    ),
  },
  {
    accessorKey: 'IsActive',
    header: (header) => (
      <SortColumnHeader header={header} title="Tình trạng" className="min-w-100px" namespace={namespace} />
    ),
    cell: ({ row }) => <Bool_StatusCell isActive={row.original.IsActive} />,
  },
];
