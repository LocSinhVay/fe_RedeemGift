import { FC, useEffect, useState } from 'react'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import Swal from 'sweetalert2'
import { useProjects } from '../../../hooks/useProjects'
import { RoleModal } from '../table/columns/RoleModal/RoleModal'
import { insertRole } from '../../../controllers/Role/RoleController'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { OptionType } from '../../../components/models/CommonModels'

type Props = {
  namespace: string
}

export const RoleHeader: FC<Props> = ({ namespace }) => {
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

  const statusRole = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCreateRole = async (newRole: {
    RoleName: string;
    Symbol: string;
    IsActive: boolean;
    MenuIds: number[];
    AllMenus: {
      MenuID: number;
      MenuName: string;
      ParentId: number | null;
      IsChecked: boolean;
    }[];
  }) => {
    try {
      const { RoleName, Symbol, IsActive, MenuIds, AllMenus } = newRole;

      const roleMenuList = AllMenus.map(menu => ({
        RoleID: 0, // Backend sẽ tự sinh RoleID mới khi thêm
        MenuID: menu.MenuID,
        IsChecked: MenuIds.includes(menu.MenuID),
      }));

      const result = await insertRole({
        RoleName,
        Symbol,
        Status: IsActive ? 1 : 0,
        listRoleMenu: roleMenuList,
      });

      if (result.Status === 'Success') {
        await Swal.fire({
          text: "Thêm mới thành công!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: { confirmButton: "btn fw-bold btn-primary" },
        });
        setShowModal(false);
        refetch();
      } else {
        Swal.fire({
          text: `${result.Message || "Không thể thêm mới!"}`,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: {
            confirmButton: "btn fw-bold btn-warning",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        text: "Đã xảy ra lỗi khi thêm mới. Vui lòng thử lại!",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-danger" },
      });
    }
  };

  return (
    <div className='card-header border-0 pt-6 d-flex align-items-center justify-content-between'>
      <div className='d-flex gap-3 align-items-center flex-wrap'>
        <SearchComponent placeholder='Tìm kiếm...' onSearch={handleSearch} namespace={namespace} />

        <SearchableComboBox
          options={statusRole}
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

      {/* Modal thêm Role*/}
      {showModal && (
        <RoleModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateRole}
        />
      )}
    </div>
  )
}
