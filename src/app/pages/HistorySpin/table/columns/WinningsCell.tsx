import { FC, useState, useMemo } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { getWinningsPagedList } from '../../../../controllers/CustomerSpin/CustomerSpinController'
import { KTCard } from '../../../../../_metronic/helpers/components/KTCard'
import { QueryRequestProvider } from '../../../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../../../services/QueryResponseProvider'
import { WinningsTable } from '../../winngs/table/WinngsTable'
import { WinningsHeader } from '../../winngs/header/WinngsHeader'
import { KTIcon } from '../../../../../_metronic/helpers/components/KTIcon'

type Props = {
  qrCode?: string
  billImagePath?: string
}

export const WinningsCell: FC<Props> = ({ qrCode, billImagePath }) => {
  const [show, setShow] = useState(false)

  const namespace = 'Winnings_list'

  // Base query có thể được mở rộng về sau
  const baseQuery = useMemo(() => {
    if (!qrCode) return ''
    return `qrCode=${qrCode}`
  }, [qrCode])

  const handleView = () => setShow(true)
  const handleClose = () => setShow(false)

  return (
    <>
      <a
        href="#"
        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
        onClick={(e) => {
          e.preventDefault()
          handleView()
        }}
      >
        <KTIcon iconName="burger-menu-3" className="fs-3" />
      </a>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Thông tin Khách hàng trúng thưởng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
            <KTCard>
              <QueryRequestProvider namespace={namespace} initialParams={{ pageSize: 5 }}>
                <QueryResponseProvider
                  namespace={namespace}
                  fetchFunction={(q?: string) => {
                    const finalQuery = q ? `${baseQuery}&${q}` : baseQuery
                    return getWinningsPagedList(finalQuery)
                  }}
                >
                  <WinningsHeader
                    qrCode={qrCode || ''}
                    billImagePath={billImagePath || ''}
                  />
                  <WinningsTable namespace={namespace} />
                </QueryResponseProvider>
              </QueryRequestProvider>
            </KTCard>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
