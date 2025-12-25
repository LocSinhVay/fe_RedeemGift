import { KTCard } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { getCustomerSpinPagedList } from '../../controllers/CustomerSpin/CustomerSpinController'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { HistorySpinHeader } from './header/HistorySpinHeader'
import { HistorySpinTable } from './table/HistorySpinTable'

const NAMESPACE = 'HistorySpin'

const HistorySpin = () => (
  <KTCard>
    <HistorySpinHeader namespace={NAMESPACE} />
    <HistorySpinTable namespace={NAMESPACE} />
  </KTCard>
)

const HistorySpinPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getCustomerSpinPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <HistorySpin />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { HistorySpinPage }
