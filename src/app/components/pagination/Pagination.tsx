import clsx from 'clsx';
import { useMemo, useCallback, useState, useEffect } from 'react';

interface PaginationProps {
  pagination: {
    total: number;
  };
  isLoading: boolean;
  updateState: (state: { page: number; pageSize: PageSizeOption; offset: number }) => void;
  defaultPageSize?: PageSizeOption;
}

const PAGE_SIZE_OPTIONS = [5, 10, 30, 50, 100] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  isLoading,
  updateState,
  defaultPageSize = 10,
}) => {
  const { total } = pagination;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(defaultPageSize);
  const [offset, setOffset] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (pageSize !== defaultPageSize) {
      setPageSize(defaultPageSize);
      setPage(1);
      setOffset(0);
      updateState({ page: 1, pageSize: defaultPageSize, offset: 0 });
    }
  }, [defaultPageSize]);

  const calculateOffset = useCallback((newPage: number, size: PageSizeOption) => {
    return (newPage - 1) * size;
  }, []);

  const updatePage = useCallback(
    (newPage: number | null | undefined) => {
      if (
        !newPage ||
        isLoading ||
        newPage === page ||
        newPage < 1 ||
        newPage > totalPages
      )
        return;

      const newOffset = calculateOffset(newPage, pageSize);
      setPage(newPage);
      setOffset(newOffset);
      updateState({ page: newPage, pageSize, offset: newOffset });
    },
    [isLoading, page, pageSize, totalPages]
  );

  const updatePageSize = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(event.target.value) as PageSizeOption;
      if (newSize !== pageSize) {
        const newPage = 1;
        const newOffset = calculateOffset(newPage, newSize);

        setPageSize(newSize);
        setPage(newPage);
        setOffset(newOffset);
        updateState({ page: newPage, pageSize: newSize, offset: newOffset });
      }
    },
    [calculateOffset, pageSize]
  );

  const paginationLinks = useMemo(() => {
    const links: Array<{ label: string; active: boolean; page: number | null; isEllipsis?: boolean }> = [];
    if (totalPages <= 1) return links;

    links.push({ label: 'Trang trước', active: false, page: page > 1 ? page - 1 : null });

    if (page > 4) {
      links.push({ label: '1', active: false, page: 1 });
      if (page > 5) {
        links.push({ label: '...', active: false, page: null, isEllipsis: true });
      }
    }

    const startPage = Math.max(1, page - 3);
    const endPage = Math.min(totalPages, page + 3);

    for (let i = startPage; i <= endPage; i++) {
      links.push({ label: i.toString(), active: i === page, page: i });
    }

    if (page < totalPages - 3) {
      if (page < totalPages - 4) {
        links.push({ label: '...', active: false, page: null, isEllipsis: true });
      }
      links.push({ label: totalPages.toString(), active: false, page: totalPages });
    }

    links.push({ label: 'Trang sau', active: false, page: page < totalPages ? page + 1 : null });
    return links;
  }, [page, totalPages]);

  return (
    <div className="row align-items-center mt-3">
      <div className="col-sm-12 col-md-5 d-flex align-items-center">
        <select
          className="form-select form-select-sm w-auto"
          value={pageSize}
          onChange={updatePageSize}
          disabled={isLoading}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="ms-3">
          {total > 0
            ? `Hiển từ ${Math.min(offset + 1, total)} đến ${Math.min(offset + pageSize, total)} của ${total} dòng`
            : 'Không có dữ liệu'}
        </span>
      </div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-end">
        <ul className="pagination mb-0">
          {paginationLinks.map((link, index) => (
            <li
              key={index}
              className={clsx('page-item', {
                active: link.active,
                disabled: isLoading || (!link.page && !link.isEllipsis),
              })}
            >
              {link.isEllipsis ? (
                <span className="page-link">{link.label}</span>
              ) : (
                <a
                  onClick={() => updatePage(link.page)}
                  style={{ cursor: link.page ? 'pointer' : 'not-allowed' }}
                  className="page-link"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
