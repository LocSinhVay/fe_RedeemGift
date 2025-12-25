import clsx from 'clsx'
import { useQueryResponseLoading, useQueryResponsePagination } from '../../core/QueryResponseProvider'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { PaginationState } from '../../../../../../_metronic/helpers'
import { useMemo } from 'react'

const mappedLabel = (label: string): string => {
  if (label === '&laquo; Previous') {
    return 'Previous'
  }
  if (label === 'Next &raquo;') {
    return 'Next'
  }
  return label
}

const Pagination = () => {
  const pagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const { updateState } = useQueryRequest()

  const pageSizeOptions = [10, 30, 50, 100] as const

  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.page === page) {
      return
    }
    updateState({ page, items_per_page: pagination.items_per_page || 10 })
  }

  const updatePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value) as (typeof pageSizeOptions)[number] // Ép kiểu đúng
    updateState({ items_per_page: newSize, page: 1 }) // Truyền giá trị đã ép kiểu
  }

  const PAGINATION_PAGES_COUNT = 5
  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return []
    }

    const scopedLinks = [...pagination.links]
    let pageLinks: Array<{ label: string; active: boolean; url: string | null; page: number | null }> = []
    const previousLink = scopedLinks.shift()!
    const nextLink = scopedLinks.pop()!
    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2)

    pageLinks.push(previousLink)
    if (pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) || scopedLinks.length <= PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT)]
    }

    if (pagination.page > scopedLinks.length - halfOfPagesCount && scopedLinks.length > PAGINATION_PAGES_COUNT) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(scopedLinks.length - PAGINATION_PAGES_COUNT)]
    }

    if (!(pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) || scopedLinks.length <= PAGINATION_PAGES_COUNT) &&
      !(pagination.page > scopedLinks.length - halfOfPagesCount)) {
      pageLinks = [...pageLinks, ...scopedLinks.slice(pagination.page - 1 - halfOfPagesCount, pagination.page + halfOfPagesCount)]
    }

    pageLinks.push(nextLink)
    return pageLinks
  }

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination])

  return (
    <div className='row align-items-center'>
      {/* Dropdown chọn số lượng bản ghi */}
      <div className='col-sm-12 col-md-4 d-flex align-items-center'>
        <select className='form-select form-select-sm w-auto' value={pagination.items_per_page} onChange={updatePageSize}>
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className='ms-3'>
          {pagination.total && pagination.total > 0 ? (
            <>
              Showing {Math.min((pagination.page - 1) * (pagination.items_per_page || 10) + 1, pagination.total || 0)}
              {' '}to {Math.min((pagination.page || 1) * (pagination.items_per_page || 10), pagination.total || 0)}
              {' '}of {pagination.total || 0} records
            </>
          ) : (
            'Showing no records'
          )}
        </span>

      </div>

      {/* Phân trang */}
      <div className='col-sm-12 col-md-8 d-flex align-items-center justify-content-end'>
        <ul className='pagination'>
          <li className={clsx('page-item', { disabled: isLoading || pagination.page === 1 })}>
            <a onClick={() => updatePage(1)} style={{ cursor: 'pointer' }} className='page-link'>First</a>
          </li>
          {paginationLinks.map(link => (
            <li key={link.label} className={clsx('page-item', {
              active: pagination.page === link.page,
              disabled: isLoading,
              previous: link.label === 'Previous',
              next: link.label === 'Next',
            })}>
              <a className='page-link' onClick={() => updatePage(link.page)} style={{ cursor: 'pointer' }}>
                {mappedLabel(link.label)}
              </a>
            </li>
          ))}
          <li className={clsx('page-item', { disabled: isLoading || pagination.page === (pagination.links?.length || 3) - 2 })}>
            <a onClick={() => updatePage((pagination.links?.length || 3) - 2)} style={{ cursor: 'pointer' }} className='page-link'>Last</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export { Pagination }
