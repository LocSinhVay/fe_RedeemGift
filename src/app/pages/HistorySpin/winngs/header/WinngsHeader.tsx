import { FC, useState } from 'react'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { Modal } from 'react-bootstrap'

type Props = {
  qrCode: string
  billImagePath: string
}

export const WinningsHeader: FC<Props> = ({ qrCode, billImagePath }) => {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<'qr' | 'image' | null>(null)
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || window.location.origin
  const qrData = `${baseUrl}/spin/${qrCode}`

  const handleOpenModal = (type: 'qr' | 'image') => {
    setModalContent(type)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalContent(null)
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-5 p-4 flex-wrap text-center">
      {/* QR Code */}
      <div
        className="p-4 border rounded bg-white shadow-sm d-flex flex-column align-items-center justify-content-center"
        style={{
          width: '250px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => handleOpenModal('qr')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <QRCode value={qrData || ''} size={200} />
      </div>

      {/* Bill Image */}
      <div
        className="p-2 border rounded bg-white shadow-sm d-flex align-items-center justify-content-center"
        style={{
          width: '230px',
          height: '230px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onClick={() => handleOpenModal('image')}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img
          src={billImagePath}
          alt="Bill Image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* Modal xem phóng to */}
      {showModal && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {/* Nội dung (ngăn click lan ra ngoài) */}
          <div onClick={(e) => e.stopPropagation()}>
            {modalContent === 'qr' && (
              <div
                className="bg-white p-4 rounded shadow-lg text-center"
                style={{
                  maxWidth: '500px',
                }}
              >
                <QRCode value={qrData || ''} size={350} />
                <div className="mt-3 text-muted">{qrData}</div>
              </div>
            )}

            {modalContent === 'image' && (
              <img
                src={billImagePath}
                alt="Bill Image"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  borderRadius: '10px',
                  boxShadow: '0 0 25px rgba(0,0,0,0.4)',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}