import { useEffect } from 'react'
import { EmailConfigTable } from './table/EmailConfigTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { EmailConfigHeader } from './header/EmailConfigHeader'
import { getEmailConfigPagedList } from '../../controllers/EmailConfig/EmailConfigController'

const NAMESPACE = 'EmailConfig'

const EmailConfig = () => (
  <KTCard>
    <EmailConfigHeader namespace={NAMESPACE} />
    <EmailConfigTable namespace={NAMESPACE} />
  </KTCard>
)

const EmailConfigPage = () => {
  // 👇 Thêm logic xử lý code gửi về từ popup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code && window.opener) {
      window.opener.postMessage({ code }, window.origin)
      window.close()
    }
  }, [])

  return (
    <QueryRequestProvider namespace={NAMESPACE}>
      <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getEmailConfigPagedList(query ?? '')}>
        <ToolbarWrapper />
        <Content>
          <EmailConfig />
        </Content>
      </QueryResponseProvider>
    </QueryRequestProvider>
  )
}

export { EmailConfigPage }
