import { GiftTable } from './table/GiftTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { GiftHeader } from './header/GiftHeader'
import { getGiftPagedList } from '../../controllers/Gift/GiftController'

const NAMESPACE = 'Gift'

const Gift = () => (
  <KTCard>
    <GiftHeader namespace={NAMESPACE} />
    <GiftTable namespace={NAMESPACE} />
  </KTCard>
)

const GiftPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getGiftPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <Gift />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { GiftPage }
