import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, BooleanColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

// PDF Template table to store template metadata
export const x_326171_pdf_templ_pdf_template = Table({
  name: 'x_326171_pdf_templ_pdf_template',
  label: 'PDF Template',
  schema: {
    name: StringColumn({ 
      label: 'Template Name',
      maxLength: 100,
      mandatory: true
    }),
    description: StringColumn({ 
      label: 'Description',
      maxLength: 255
    }),
    source_table: StringColumn({
      label: 'Source Table',
      maxLength: 80,
      mandatory: true,
      read_only: false
    }),
    page_width: IntegerColumn({
      label: 'Page Width (px)',
      default: '595', // A4 width in points
      mandatory: true
    }),
    page_height: IntegerColumn({
      label: 'Page Height (px)', 
      default: '842', // A4 height in points
      mandatory: true
    }),
    template_json: StringColumn({
      label: 'Template Configuration',
      maxLength: 8000,
      read_only: false
    }),
    active: BooleanColumn({
      label: 'Active',
      default: 'true'
    }),
    created_by: ReferenceColumn({
      label: 'Created By',
      referenceTable: 'sys_user',
      read_only: true
    }),
    created_on: DateTimeColumn({
      label: 'Created On',
      read_only: true
    }),
    updated_by: ReferenceColumn({
      label: 'Updated By', 
      referenceTable: 'sys_user',
      read_only: true
    }),
    updated_on: DateTimeColumn({
      label: 'Updated On',
      read_only: true
    })
  },
  display: 'name',
  accessible_from: 'public',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete']
})