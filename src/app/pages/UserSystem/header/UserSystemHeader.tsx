import { FC, useEffect, useState } from 'react'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { useProjects } from '../../../hooks/useProjects'
import { useRoles } from '../../../hooks/useRoles'
import { UserSystemModal } from '../table/columns/UserSystemModal/UserSystemModal'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { OptionType } from '../../../components/models/CommonModels'
import { exportFile } from '../../../hooks/exportFile'
import { exportUserSystem, insertUserSystem } from '../../../controllers/UserSystem/UserSystemController'
import { submitFormData } from '../../../hooks/submitFormData'

type Props = {
  namespace: string
}

export const UserSystemHeader: FC<Props> = ({ namespace }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const [showModal, setShowModal] = useState(false)

  // 🔹 Dự án & Quyền
  const { visibleProjects, isAll } = useProjects(true)
  const roles = useRoles(true)

  // 🔹 Bộ lọc
  const [projectCode, setProjectCode] = useState<OptionType | null>({
    value: '',
    label: 'Chọn dự án',
  })
  const [roleID, setRoleID] = useState<OptionType | null>({
    value: '',
    label: 'Chọn quyền',
  })
  const [status, setStatus] = useState<OptionType | null>({
    value: '',
    label: 'Chọn tình trạng',
  })

  // 🔹 Cập nhật bộ lọc khi thay đổi
  useEffect(() => {
    updateState({
      keySearch: debouncedSearchTerm,
      filter: {
        projectCode: projectCode?.value ?? '',
        roleID: roleID?.value ?? '',
        status: status?.value ?? '',
      },
      ...initialQueryState,
    })
  }, [projectCode, roleID, status, debouncedSearchTerm])

  const statusUserSystem = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  // 🔹 Tìm kiếm
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  // 🔹 Xuất Excel
  const handleExport = async () => {
    const queryParams = {
      keySearch: debouncedSearchTerm || '',
      projectCode: projectCode?.value?.toString() ?? '',
      roleID: roleID?.value ? Number(roleID.value) : -1,
      status: status?.value ? Number(status.value) : -1,
    }

    await exportFile(exportUserSystem, queryParams, 'UserSystemList.xlsx')
  }

  // 🔹 Thêm mới người dùng
  const handleCreateUser = async (createdUser: Partial<any>) => {
    await submitFormData({
      formFields: {
        FullName: createdUser.FullName,
        UserAvatar: createdUser.UserAvatar,
        Email: createdUser.Email,
        Phone: createdUser.Phone,
        Status: createdUser.Status,
        RoleID: createdUser.RoleID,
        ProjectCodes: createdUser.ProjectCodes,
        Username: createdUser.Username,
      },
      fileField: createdUser.AvatarFile
        ? { name: 'File', file: createdUser.AvatarFile }
        : undefined,
      apiFunction: insertUserSystem,
      onSuccess: () => {
        setShowModal(false)
        refetch()
      },
    })
  }

  return (
    <div className='card-header border-0 pt-6 d-flex align-items-center justify-content-between'>
      {/* Bộ lọc & Tìm kiếm */}
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
        />

        <SearchableComboBox
          options={roles}
          value={roleID}
          onChange={setRoleID}
          includeAllOption={true}
          width='250px'
        />

        <SearchableComboBox
          options={statusUserSystem}
          value={status}
          onChange={setStatus}
          includeAllOption={true}
          width='250px'
        />
      </div>

      {/* Nút hành động */}
      <div className='card-toolbar'>
        <button
          type='button'
          className='btn btn-primary me-3'
          onClick={() => setShowModal(true)}
        >
          <KTIcon iconName='plus' className='fs-2' />
          Thêm mới
        </button>
        <button
          type='button'
          className='btn btn-light-primary me-3'
          onClick={handleExport}
        >
          <KTIcon iconName='exit-up' className='fs-2' />
          Xuất
        </button>
      </div>

      {/* Modal thêm User */}
      {showModal && (
        <UserSystemModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
  )
}
