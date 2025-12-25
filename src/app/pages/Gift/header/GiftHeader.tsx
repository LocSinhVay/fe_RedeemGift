import { FC, useEffect, useMemo, useState } from 'react'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { GiftModal } from '../table/columns/GiftModal/GiftModal'
import { submitFormData } from '../../../hooks/submitFormData'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { OptionType } from '../../../components/models/CommonModels'
import { insertGift } from '../../../controllers/Gift/GiftController'
import { useProjects } from '../../../hooks/useProjects'

type Props = {
  namespace: string
}

export const GiftHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  const [showModal, setShowModal] = useState(false);
  const { visibleProjects, defaultProject, isAll } = useProjects(true);
  // ✅ Dự án lọc (nếu không isAll thì set mặc định)
  const [projectCode, setProjectCode] = useState<OptionType | null>(
    isAll
      ? { value: '', label: 'Chọn dự án' }
      : defaultProject ?? { value: '', label: 'Chọn dự án' }
  )
  const [status, setStatus] = useState<OptionType | null>({
    value: '',
    label: 'Chọn tình trạng',
  });

  // 🔹 Khi thay đổi quyền dự án
  useEffect(() => {
    if (!isAll && defaultProject) {
      setProjectCode(defaultProject)
    }
  }, [isAll, defaultProject])

  useEffect(() => {
    updateState({
      keySearch: debouncedSearchTerm,
      filter: { projectCode: projectCode?.value ?? '', status: status?.value ?? '' },
      ...initialQueryState,
    })
  }, [projectCode, status, debouncedSearchTerm])

  const statusGifts = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCreateGift = async (createGift: Partial<any>) => {
    await submitFormData({
      formFields: {
        ProjectCode: createGift.ProjectCode,
        GiftName: createGift.GiftName,
        Quantity: createGift.Quantity,
        IsUnlimited: createGift.IsUnlimited,
      },
      apiFunction: insertGift,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <div className='card-header border-0 pt-6 d-flex align-items-center justify-content-between'>
      <div className='d-flex gap-3 align-items-center flex-wrap'>
        <SearchComponent placeholder='Tìm kiếm...' onSearch={handleSearch} namespace={namespace} />

        <SearchableComboBox
          options={visibleProjects}
          value={projectCode}
          onChange={setProjectCode}
          includeAllOption={isAll}
          width='250px'
          isDisabled={!isAll}
        />

        <SearchableComboBox
          options={statusGifts}
          value={status}
          onChange={setStatus}
          includeAllOption={true}
          width='250px'
        />
      </div>

      <div className='card-toolbar'>
        <button type='button' className='btn btn-primary me-3' onClick={() => setShowModal(true)}>
          <KTIcon iconName='plus' className='fs-2' />
          Thêm mới
        </button>
      </div>

      {/* Modal thêm Gift*/}
      {showModal && (
        <GiftModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateGift}
        />
      )}
    </div>
  )
}
