import { KTCard } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { getRedeemSpinPagedList } from '../../controllers/RedeemSpin/RedeemSpinController'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { RedeemSpinHeader } from './header/RedeemSpinHeader'
import { RedeemSpinTable } from './table/RedeemSpinTable'

const NAMESPACE = 'RedeemSpin'

const RedeemSpin = () => (
  <KTCard>
    <RedeemSpinHeader namespace={NAMESPACE} />
    <RedeemSpinTable namespace={NAMESPACE} />
  </KTCard>
)

const RedeemSpinPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getRedeemSpinPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <RedeemSpin />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { RedeemSpinPage }
