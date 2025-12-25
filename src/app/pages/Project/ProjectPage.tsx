import { ProjectTable } from './table/ProjectTable'
import { KTCard } from '../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { QueryRequestProvider } from '../../services/QueryRequestProvider'
import { QueryResponseProvider } from '../../services/QueryResponseProvider'
import { ProjectHeader } from './header/ProjectHeader'
import { getProjectPagedList } from '../../controllers/Project/ProjectController'

const NAMESPACE = 'Project'

const Project = () => (
  <KTCard>
    <ProjectHeader namespace={NAMESPACE} />
    <ProjectTable namespace={NAMESPACE} />
  </KTCard>
)

const ProjectPage = () => (
  <QueryRequestProvider namespace={NAMESPACE}>
    <QueryResponseProvider namespace={NAMESPACE} fetchFunction={(query?: string) => getProjectPagedList(query ?? '')}>
      <ToolbarWrapper />
      <Content>
        <Project />
      </Content>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { ProjectPage }
