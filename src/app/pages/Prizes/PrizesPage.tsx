import { KTCard } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { getPrizePagedList } from '../../controllers/Prizes/PrizesController'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { PrizesHeader } from './header/PrizesHeader'
import { PrizesTable } from './table/PrizesTable'

const NAMESPACE = 'Prizes'

const Prizes = () => (
  <KTCard>
    <PrizesHeader namespace={NAMESPACE} />
    <PrizesTable namespace={NAMESPACE} />
  </KTCard>
)

const PrizesPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getPrizePagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <Prizes />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { PrizesPage }
