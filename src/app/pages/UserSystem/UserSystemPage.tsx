import { UserSystemTable } from './table/UserSystemTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { UserSystemHeader } from './header/UserSystemHeader'
import { getUserSystemPagedList } from '../../controllers/UserSystem/UserSystemController'

const NAMESPACE = 'UserSystem'

const UserSystem = () => (
  <KTCard>
    <UserSystemHeader namespace={NAMESPACE} />
    <UserSystemTable namespace={NAMESPACE} />
  </KTCard>
)

const UserSystemPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getUserSystemPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <UserSystem />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { UserSystemPage }
