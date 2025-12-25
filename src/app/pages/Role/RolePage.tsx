import { RoleTable } from './table/RoleTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { RoleHeader } from './header/RoleHeader'
import { getRolePagedList } from '../../controllers/Role/RoleController'

const NAMESPACE = 'Role'

const Role = () => (
  <KTCard>
    <RoleHeader namespace={NAMESPACE} />
    <RoleTable namespace={NAMESPACE} />
  </KTCard>
)

const RolePage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getRolePagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <Role />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { RolePage }
