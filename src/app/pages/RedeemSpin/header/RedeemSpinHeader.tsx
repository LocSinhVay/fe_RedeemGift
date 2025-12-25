import { FC, useEffect, useState } from 'react'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { OptionType } from '../../../components/models/CommonModels'
import { useProjects } from '../../../hooks/useProjects'
import { submitFormData } from '../../../hooks/submitFormData'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { insertRedeemSpin } from '../../../controllers/RedeemSpin/RedeemSpinController'
import { RedeemSpinModal } from '../table/columns/RedeemSpinModal/RedeemSpinModal'

type Props = { namespace: string }

export const RedeemSpinHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const [showRedeemSpinModal, setShowRedeemSpinModal] = useState(false)
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

  const statusRedeemSpin = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => setSearchTerm(term)

  // ✅ Thêm mới RedeemSpin
  const handleCreateRedeemSpin = async (createRedeemSpin: Partial<any>) => {
    await submitFormData({
      formFields: {
        ProjectCode: createRedeemSpin.ProjectCode,
        BillValuePerSpin: createRedeemSpin.BillValuePerSpin,
        MaxSpinsPerBill: createRedeemSpin.MaxSpinsPerBill,
        StartDate: createRedeemSpin.StartDate,
        EndDate: createRedeemSpin.EndDate,
      },
      apiFunction: insertRedeemSpin,
      onSuccess: () => {
        setShowRedeemSpinModal(false)
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

        <SearchableComboBox
          options={visibleProjects}
          value={projectCode}
          onChange={setProjectCode}
          includeAllOption={isAll}
          width='250px'
          isDisabled={!isAll}
        />

        <SearchableComboBox
          options={statusRedeemSpin}
          value={status}
          onChange={setStatus}
          includeAllOption={true}
          width='250px'
        />
      </div>

      <div className='card-toolbar'>
        <button
          type='button'
          className='btn btn-primary me-3'
          onClick={() => setShowRedeemSpinModal(true)}
        >
          <KTIcon iconName='plus' className='fs-2' /> Thêm mới
        </button>
      </div>

      {/* Modal thêm RedeemSpin*/}
      {showRedeemSpinModal && (
        <RedeemSpinModal
          show={showRedeemSpinModal}
          onClose={() => setShowRedeemSpinModal(false)}
          onSave={handleCreateRedeemSpin}
        />
      )}
    </div>
  )
}
