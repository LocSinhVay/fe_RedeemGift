import { MenuTable } from './table/MenuTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { MenuHeader } from './header/MenuHeader'
import { getMenuPagedList } from '../../controllers/Menu/MenuController'

const NAMESPACE = 'Menu'

const Menu = () => (
  <KTCard>
    <MenuHeader namespace={NAMESPACE} />
    <MenuTable namespace={NAMESPACE} />
  </KTCard>
)

const MenuPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getMenuPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <Menu />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { MenuPage }
