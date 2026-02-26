import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validateTemplate } from '../../server/template-validation.js'

export const template_validation_br = BusinessRule({
  $id: Now.ID['template-validation'],
  name: 'PDF Template Validation',
  table: 'x_326171_pdf_templ_pdf_template',
  when: 'before',
  action: ['insert', 'update'],
  script: validateTemplate,
  order: 100,
  active: true,
  description: 'Validates PDF template data before saving'
})