import { FC, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { RedeemSpinColumns } from './columns/_columns'
import { useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '../../../services/QueryResponseProvider'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { KTCardBody } from '../../../../_metronic/helpers'
import { Loading } from '../../../components/loading/Loading'
import { Pagination } from '../../../components/pagination/Pagination'

type Props = {
  namespace: string
}

const RedeemSpinTable: FC<Props> = ({ namespace }) => {
  const RedeemSpins = useQueryResponseData(namespace)
  const isLoading = useQueryResponseLoading(namespace)
  const pagination = useQueryResponsePagination(namespace) // Lấy thông tin phân trang
  const { updateState } = useQueryRequest(namespace) // Hàm cập nhật state

  const columns = useMemo<ColumnDef<any>[]>(() => RedeemSpinColumns(namespace), [namespace])

  const table = useReactTable({
    data: RedeemSpins,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table id={`kt_table_${namespace}`} className='table table-bordered align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
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

      {/* Truyền thông tin phân trang vào component Pagination */}
      <Pagination pagination={pagination} isLoading={isLoading} updateState={updateState} />

      {isLoading && <Loading />}
    </KTCardBody>
  )
}

export { RedeemSpinTable }
