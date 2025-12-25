import { FC, useEffect, useState } from 'react'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { OptionType } from '../../../components/models/CommonModels'
import { useProjects } from '../../../hooks/useProjects'
import { submitFormData } from '../../../hooks/submitFormData'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'

type Props = { namespace: string }

export const HistorySpinHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { updateState } = useQueryRequest(namespace)
  const debouncedSearchTerm = useDebounce(searchTerm, 150)

  // ✅ Dự án có quyền
  const { visibleProjects, defaultProject, isAll } = useProjects(true)

  // ✅ Dự án lọc (nếu không isAll thì set mặc định)
  const [projectCode, setProjectCode] = useState<OptionType | null>(
    isAll
      ? { value: '', label: 'Chọn dự án' }
      : defaultProject ?? { value: '', label: 'Chọn dự án' }
  )

  // 🔹 Khi thay đổi quyền dự án
  useEffect(() => {
    if (!isAll && defaultProject) {
      setProjectCode(defaultProject)
    }
  }, [isAll, defaultProject])

  // 🔹 Cập nhật bộ lọc tìm kiếm
  useEffect(() => {
    updateState({
      keySearch: debouncedSearchTerm,
      filter: {
        projectCode: projectCode?.value ?? ''
      },
      ...initialQueryState,
    })
  }, [projectCode, debouncedSearchTerm])

  const handleSearch = (term: string) => setSearchTerm(term)


  return (
    <div className='card-header border-0 pt-6 d-flex align-items-center justify-content-between'>
      <div className='d-flex gap-3 align-items-center flex-wrap'>
        <SearchComponent
          placeholder='Tìm kiếm...'
          onSearch={handleSearch}
          namespace={namespace}
        />

        {/* Lọc theo dự án */}
        <SearchableComboBox
          options={visibleProjects}
          value={projectCode}
          onChange={(selected) => {
            const newProject = selected || defaultProject
            setProjectCode(newProject)
          }}
          includeAllOption={isAll}
          width='250px'
          isDisabled={!isAll} // khóa nếu user không có quyền chọn nhiều dự án
        />
      </div>
    </div>
  )
}
