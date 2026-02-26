import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import templateBuilderPage from '../../client/index.html'

export const pdf_template_builder = UiPage({
  $id: Now.ID['pdf-template-builder'], 
  endpoint: 'pdf_template_builder.do',
  description: 'PDF Template Builder - Drag and Drop Designer',
  category: 'general',
  html: templateBuilderPage,
  direct: true
})