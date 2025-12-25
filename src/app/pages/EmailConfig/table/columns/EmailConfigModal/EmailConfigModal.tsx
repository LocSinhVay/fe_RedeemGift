import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import { useGoogleOAuth } from "../../../../../hooks/useGoogleOAuth";
import { OptionType } from "../../../../../components/models/CommonModels";

interface EmailConfig {
  EmailId: number;
  Type: string;
  SmtpServer: string;
  SmtpPort: string;
  SenderEmail: string;
  SenderPassword: string;
  ClientId: string;
  ClientSecret: string;
  RedirectUri: string;
  Token: string;
  RefreshToken?: string;
}

interface EmailConfigModalProps {
  show: boolean;
  onClose: () => void;
  emailConfig?: EmailConfig;
  onSave: (updatedEmailConfig: EmailConfig) => void;
}

const emailTypes: OptionType[] = [
  { value: "GMAIL", label: "Gmail" },
  { value: "SMTP", label: "Smtp" },
];

const defaultFormData = {
  EmailId: 0,
  Type: "GMAIL",
  SmtpServer: "smtp.office365.com",
  SmtpPort: "587",
  SenderEmail: "",
  SenderPassword: "",
  ClientId: "",
  ClientSecret: "",
  RedirectUri: "",
  Token: "",
  RefreshToken: "",
};

export const EmailConfigModal = ({ show, onClose, emailConfig, onSave }: EmailConfigModalProps) => {
  const isEdit = Boolean(emailConfig);
  const [formData, setFormData] = useState<EmailConfig>(defaultFormData);
  const [emailType, setEmailType] = useState<OptionType | null>(emailTypes[0]);
  const { validateGmailConfig } = useGoogleOAuth();

  // Reset modal khi mở
  useEffect(() => {
    if (!show) return;

    if (isEdit && emailConfig) {
      const selected = emailTypes.find(t => t.value === emailConfig.Type) || emailTypes[0];
      setEmailType(selected);
      setFormData({ ...emailConfig });
    } else {
      setEmailType(emailTypes[0]);
      setFormData({ ...defaultFormData, Type: emailTypes[0].value as string });
    }
  }, [show, emailConfig]);

  // Cập nhật Type trong formData mỗi khi chọn loại email
  useEffect(() => {
    setFormData(prev => ({ ...prev, Type: emailType?.value as string }));
  }, [emailType]);

  const handleChange = (field: keyof EmailConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCommonFields = () => (
    <Form.Group className="mb-3">
      <Form.Label className="required fw-bold">Email Config</Form.Label>
      <Form.Control
        type="text"
        placeholder="Email Config"
        value={formData.SenderEmail}
        onChange={(e) => handleChange("SenderEmail", e.target.value)}
      />
    </Form.Group>
  );

  const renderSMTPFields = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Smtp Server</Form.Label>
        <Form.Control
          type="text"
          placeholder="Smtp Server"
          value={formData.SmtpServer}
          readOnly
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Smtp Port</Form.Label>
        <Form.Control
          type="text"
          placeholder="Smtp Port"
          value={formData.SmtpPort}
          readOnly
        />
      </Form.Group>

      {renderCommonFields()}

      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Email Password</Form.Label>
        <Form.Control
          type="text"
          placeholder="Email Password"
          value={formData.SenderPassword}
          onChange={(e) => handleChange("SenderPassword", e.target.value)}
        />
      </Form.Group>
    </>
  );

  const renderGmailFields = () => (
    <>
      {renderCommonFields()}

      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Client ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Client ID"
          value={formData.ClientId}
          onChange={(e) => handleChange("ClientId", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Client Secret</Form.Label>
        <Form.Control
          type="text"
          placeholder="Client Secret"
          value={formData.ClientSecret}
          onChange={(e) => handleChange("ClientSecret", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="required fw-bold">Redirect Uri</Form.Label>
        <Form.Control
          type="text"
          placeholder="Redirect Uri"
          value={formData.RedirectUri}
          onChange={(e) => handleChange("RedirectUri", e.target.value)}
        />
      </Form.Group>
    </>
  );

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Email Config</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Loại Email</Form.Label>
            <SearchableComboBox
              options={emailTypes}
              value={emailType}
              onChange={setEmailType}
              isDisabled={isEdit}
            />
          </Form.Group>

          {emailType?.value === "SMTP" ? renderSMTPFields() : renderGmailFields()}
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
          <Button variant="primary" onClick={async () => {
            const updatedForm = { ...formData }
            if (emailType?.value === 'GMAIL') {
              const result = await validateGmailConfig(updatedForm);
              if (!result) return; // lỗi hoặc xác thực sai
              updatedForm.Token = result.accessToken;
              updatedForm.RefreshToken = result.refreshToken;
              updatedForm.SmtpServer = "";
              updatedForm.SmtpPort = "";
            }
            onSave(updatedForm)
          }}>
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
