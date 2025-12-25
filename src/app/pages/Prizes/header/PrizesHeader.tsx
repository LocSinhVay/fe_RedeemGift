import { FC, useEffect, useState } from 'react'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { OptionType } from '../../../components/models/CommonModels'
import { useProjects } from '../../../hooks/useProjects'
import { submitFormData } from '../../../hooks/submitFormData'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { insertPrize } from '../../../controllers/Prizes/PrizesController'
import { PrizesModal } from '../table/columns/PrizesModal/PrizesModal'

type Props = { namespace: string }

export const PrizesHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const [showPrizesModal, setShowPrizesModal] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 150)

  // ✅ Dự án có quyền
  const { visibleProjects, defaultProject, isAll } = useProjects(true)

  // ✅ Trạng thái lọc
  const [status, setStatus] = useState<OptionType | null>({
    value: '',
    label: 'Chọn tình trạng',
  })

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
        projectCode: projectCode?.value ?? '',
        status: status?.value ?? '',
      },
      ...initialQueryState,
    })
  }, [projectCode, status, debouncedSearchTerm])

  const statusPrizes = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => setSearchTerm(term)

  // ✅ Thêm mới Prizes
  const handleCreatePrizes = async (createPrizes: Partial<any>) => {
    await submitFormData({
      formFields: {
        ProjectCode: createPrizes.ProjectCode,
        GiftID: createPrizes.GiftID,
        Weight: createPrizes.Weight,
      },
      apiFunction: insertPrize,
      onSuccess: () => {
        setShowPrizesModal(false)
        refetch()
      },
    })
  }

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

        {/* Lọc theo tình trạng */}
        <SearchableComboBox
          options={statusPrizes}
          value={status}
          onChange={setStatus}
          includeAllOption={true}
          width='250px'
        />
      </div>

      {/* Nút thêm mới */}
      <div className='card-toolbar'>
        <button
          type='button'
          className='btn btn-primary me-3'
          onClick={() => setShowPrizesModal(true)}
        >
          <KTIcon iconName='plus' className='fs-2' /> Thêm mới
        </button>
      </div>

      {/* Modal thêm Prizes */}
      {showPrizesModal && (
        <PrizesModal
          show={showPrizesModal}
          onClose={() => setShowPrizesModal(false)}
          onSave={handleCreatePrizes}
        />
      )}
    </div>
  )
}
