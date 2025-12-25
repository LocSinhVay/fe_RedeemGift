import { FC, useEffect, useState } from 'react'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { MenuModal } from '../table/columns/MenuModal/MenuModal'
import { insertMenu } from '../../../controllers/Menu/MenuController'
import { submitFormData } from '../../../hooks/submitFormData'
import { OptionType } from '../../../components/models/CommonModels'

// interface Option {
//   value: string | number
//   label: string
// }

type Props = {
  namespace: string
}

const MenuHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<OptionType | null>({
    value: '',
    label: 'Chọn tình trạng',
  });

  useEffect(() => {
    updateState({
      keySearch: debouncedSearchTerm,
      filter: { status: status?.value ?? '' },
      ...initialQueryState,
    })
  }, [status, debouncedSearchTerm])

  const statusMenu = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCreateMenu = async (updatedMenu: Partial<any>) => {
    await submitFormData({
      formFields: {
        MenuName: updatedMenu.MenuName,
        MenuPath: updatedMenu.MenuPath,
        Icon: updatedMenu.Icon,
        ParentId: updatedMenu.ParentId,
        Status: updatedMenu.Status,
        DisplayOrder: updatedMenu.DisplayOrder,
      },
      apiFunction: insertMenu,
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
          options={statusMenu}
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

      {/* Modal thêm User*/}
      {showModal && (
        <MenuModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateMenu}
        />
      )}
    </div>
  )
}

export { MenuHeader }
