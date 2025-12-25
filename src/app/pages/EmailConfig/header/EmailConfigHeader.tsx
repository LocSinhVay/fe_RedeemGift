import { FC, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { SearchableComboBox } from '../../../components/searchableComboBox/SearchableComboBox'
import { initialQueryState, KTIcon } from '../../../../_metronic/helpers'
import { useQueryRequest } from '../../../services/QueryRequestProvider'
import { useQueryResponse } from '../../../services/QueryResponseProvider'
import { insertEmailConfig, chooseEmailConfig } from '../../../controllers/EmailConfig/EmailConfigController'
import { submitFormData } from '../../../hooks/submitFormData'
import { EmailConfigModal } from '../table/columns/EmailConfigModal/EmailConfigModal'
import { useEmailConfigs } from '../../../hooks/useEmailConfigs'
import { OptionType } from '../../../components/models/CommonModels'

type Props = {
  namespace: string
}

const EmailConfigHeader: FC<Props> = ({ namespace }) => {
  const { refetch } = useQueryResponse(namespace)
  const { updateState } = useQueryRequest(namespace)
  const [showModal, setShowModal] = useState(false)
  const [emailId, setEmailId] = useState<OptionType | null>(null)
  const [emailType, setEmailType] = useState<OptionType | null>({
    value: '',
    label: 'Loại Email',
  })

  const [status, setStatus] = useState<OptionType | null>({
    value: '',
    label: 'Chọn tình trạng',
  })

  const emailConfig = useEmailConfigs(true)

  // Gán mặc định emailId nhưng không gọi API ở đây
  useEffect(() => {
    const selectedEmailConfig = emailConfig.find(p => p.isActive === true)
    if (selectedEmailConfig) {
      setEmailId(selectedEmailConfig)
    }
  }, [emailConfig])

  useEffect(() => {
    updateState({
      filter: { type: emailType?.value ?? '', status: status?.value ?? '' },
      ...initialQueryState,
    })
  }, [emailType, status])

  // Gọi API khi người dùng chọn thủ công email khác
  const handleChangeEmailId = async (selected: OptionType | null) => {
    setEmailId(selected)

    if (!selected?.value) return

    try {
      const response = await chooseEmailConfig(Number(selected?.value));
      if (response?.Status === 'Success') {
        Swal.fire({
          text: 'Cập nhật Email Config thành công',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn fw-bold btn-primary',
          },
        });
        refetch();
      } else {
        Swal.fire({
          text: response?.Message || 'Cập nhật thất bại',
          icon: 'warning',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-warning',
          },
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        text: 'Lỗi khi chọn Email Config',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn btn-danger',
        },
      })
    }
  }

  const emailTypes = [
    { value: 'GMAIL', label: 'Gmail' },
    { value: 'SMTP', label: 'Smtp' },
  ]

  const statusEmailConfig = [
    { value: '1', label: 'Đang sử dụng' },
    { value: '0', label: 'Khóa' },
  ]

  const handleCreateEmailConfig = async (updatedEmailConfig: Partial<any>) => {
    await submitFormData({
      formFields: {
        Type: updatedEmailConfig.Type,
        SmtpServer: updatedEmailConfig.SmtpServer,
        SmtpPort: updatedEmailConfig.SmtpPort,
        SenderEmail: updatedEmailConfig.SenderEmail,
        SenderPassword: updatedEmailConfig.SenderPassword,
        ClientId: updatedEmailConfig.ClientId,
        ClientSecret: updatedEmailConfig.ClientSecret,
        RedirectUri: updatedEmailConfig.RedirectUri,
        Token: updatedEmailConfig.Token,
        RefreshToken: updatedEmailConfig.RefreshToken,
      },
      apiFunction: insertEmailConfig,
      onSuccess: () => {
        setShowModal(false)
        refetch()
      },
    })
  }

  return (
    <div className='card-header border-0 pt-6 d-flex align-items-center justify-content-between'>
      <div className='d-flex gap-3 align-items-center flex-wrap'>
        <span>Email Config <br />mặc định</span>
        <SearchableComboBox
          options={emailConfig}
          value={emailId}
          onChange={handleChangeEmailId}
          width='250px'
        />
      </div>

      <div className='card-toolbar'>
        <div className='d-flex gap-3 align-items-center flex-wrap'>
          <SearchableComboBox
            options={emailTypes}
            value={emailType}
            onChange={setEmailType}
            includeAllOption={true}
            width='200px'
          />

          <SearchableComboBox
            options={statusEmailConfig}
            value={status}
            onChange={setStatus}
            includeAllOption={true}
            width='200px'
          />
          <button type='button' className='btn btn-primary me-3' onClick={() => setShowModal(true)}>
            <KTIcon iconName='plus' className='fs-2' />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Modal thêm Email Config*/}
      {showModal && (
        <EmailConfigModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleCreateEmailConfig}
        />
      )}
    </div>
  )
}

export { EmailConfigHeader }
