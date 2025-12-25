import { FC, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { KTCardBody } from '../../../../../_metronic/helpers'
import { Pagination } from '../../../../components/pagination/Pagination'
import { Loading } from '../../../../components/loading/Loading'
import { useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '../../../../services/QueryResponseProvider'
import { useQueryRequest } from '../../../../services/QueryRequestProvider'
import { WinningsColumns } from './columns/_columns'

type Props = {
  namespace: string
}

export const WinningsTable: FC<Props> = ({ namespace }) => {
  const winnings = useQueryResponseData(namespace) || []
  const isLoading = useQueryResponseLoading(namespace)
  const pagination = useQueryResponsePagination(namespace)
  const { updateState } = useQueryRequest(namespace)

  const columns = useMemo<ColumnDef<any>[]>(() => WinningsColumns(namespace), [namespace])

  const table = useReactTable({
    data: winnings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table id={`kt_table_${namespace}`} className='table table-bordered table-sm align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='text-center text-muted fw-bolder fs-7 text-uppercase gs-0'>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className='min-w-10px'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className='text-gray-600'>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='border p-3 text-center'>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} isLoading={isLoading} updateState={updateState} defaultPageSize={5} />
      {isLoading && <Loading />}
    </KTCardBody>
  )
}
