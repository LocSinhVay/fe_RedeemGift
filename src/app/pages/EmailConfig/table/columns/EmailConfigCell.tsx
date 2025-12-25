import { useState } from 'react'
import { useQueryResponse } from '../../../../services/QueryResponseProvider';
import { updateEmailConfig } from '../../../../controllers/EmailConfig/EmailConfigController';
import { submitFormData } from '../../../../hooks/submitFormData';
import { EmailConfigModal } from './EmailConfigModal/EmailConfigModal';

export const EmailConfigCell: React.FC<any> = ({ namespace, emailConfig }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = async (updatedEmailConfig: Partial<any>) => {
    await submitFormData({
      formFields: {
        EmailId: updatedEmailConfig.EmailId,
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
      apiFunction: updateEmailConfig,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer text-primary hover:underline"
      >
        {emailConfig.SenderEmail}
      </span>

      {showModal && (
        <EmailConfigModal
          show={showModal}
          onClose={() => setShowModal(false)}
          emailConfig={emailConfig}
          onSave={handleUpdate}
        />
      )}
    </>
  )
}
