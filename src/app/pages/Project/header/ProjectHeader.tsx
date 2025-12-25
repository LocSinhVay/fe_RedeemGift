import { FC, useEffect, useState } from 'react'
import { SearchComponent } from '../../../components/searchComponent/SearchComponent'
import { initialQueryState, KTIcon, useDebounce } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { ProjectModal } from '../table/columns/ProjectModal/ProjectModal'
import { submitFormData } from '../../../hooks/submitFormData'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { OptionType } from '../../../components/models/CommonModels'
import { insertProject } from '../../../controllers/Project/ProjectController'

type Props = {
  namespace: string
}

export const ProjectHeader: FC<Props> = ({ namespace }) => {
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

  const statusProjects = [
    { value: '1', label: 'Hoạt động' },
    { value: '0', label: 'Khóa' },
  ]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCreateProject = async (createProject: Partial<any>) => {
    await submitFormData({
      formFields: {
        ProjectCode: createProject.ProjectCode,
        ProjectName: createProject.ProjectName,
      },
      apiFunction: insertProject,
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
          options={statusProjects}
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

      {/* Modal thêm Project*/}
      {showModal && (
        <ProjectModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateProject}
        />
      )}
    </div>
  )
}
