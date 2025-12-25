import React, { useEffect, useState } from 'react'
import { useAuth } from './Auth'
import * as authHelper from './AuthHelpers'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { OptionType } from '../../../components/models/CommonModels'

export function ProjectSelector() {
  const { auth, saveAuth } = useAuth()
  const [projectList, setProjectList] = useState<OptionType[]>([])
  const [selectedProject, setSelectedProject] = useState<OptionType | null>(null)

  useEffect(() => {
    if (!auth) return

    // ⚡ Chuẩn hoá danh sách project (backend có thể trả dạng string hoặc array)
    const codes =
      Array.isArray(auth.ProjectCodes)
        ? auth.ProjectCodes
        : typeof auth.ProjectCodes === 'string'
          ? auth.ProjectCodes.split(',').map(p => p.trim()).filter(Boolean)
          : []

    // Chuyển sang dạng OptionType cho combo
    const options: OptionType[] = codes.map(p => ({ label: p, value: p }))
    setProjectList(options)

    // Nếu user có nhiều dự án → chọn mặc định dự án đầu tiên
    if (options.length > 0) {
      const defaultProjectCode = auth.SelectedProject || options[0].value
      const defaultOption = options.find(o => o.value === defaultProjectCode) || options[0]
      setSelectedProject(defaultOption)

      if (defaultProjectCode !== auth.SelectedProject) {
        const updated = { ...auth, SelectedProject: defaultProjectCode }
        saveAuth(updated)
        authHelper.setAuth(updated)
      }
    }
  }, [auth])

  // 🌀 Khi người dùng chọn dự án khác
  const handleSelect = (selected: OptionType | null) => {
    if (!auth) return

    const projectCode = selected?.value || ''
    setSelectedProject(selected)

    const updated = { ...auth, SelectedProject: projectCode }
    saveAuth(updated)
    authHelper.setAuth(updated)
  }

  // Không có dự án nào thì ẩn hẳn
  if (!auth || projectList.length === 0) return null

  return (
    <div className='d-flex align-items-center ms-3'>
      <div>
        <SearchableComboBox
          options={projectList}
          value={selectedProject}
          onChange={handleSelect}
          width='200px'
        />
      </div>
    </div>
  )
}
