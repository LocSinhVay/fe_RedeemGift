import { useEffect, useState, useCallback } from "react"
import { KTIcon, useDebounce } from "../../../_metronic/helpers"

interface SearchComponentProps {
  namespace: string  // Phân biệt bảng khi tìm kiếm
  placeholder?: string
  onSearch: (searchTerm: string) => void
}

export const SearchComponent = ({ namespace, placeholder = 'Search...', onSearch }: SearchComponentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 150) || '' // Đảm bảo luôn là string

  // Memoized search handler
  const handleSearch = useCallback(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, namespace, onSearch])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <div className='d-flex align-items-center position-relative my-1'>
      <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
      <input
        type='text'
        className='form-control form-control-solid w-250px ps-14'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
