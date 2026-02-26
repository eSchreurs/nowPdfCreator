import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ReferenceColumn, DecimalColumn } from '@servicenow/sdk/core'

// Template elements table to store individual drag-and-drop components
export const x_326171_pdf_templ_template_element = Table({
  name: 'x_326171_pdf_templ_template_element',
  label: 'Template Element',
  schema: {
    template: ReferenceColumn({
      label: 'Template',
      referenceTable: 'x_326171_pdf_templ_pdf_template',
      mandatory: true
    }),
    element_type: StringColumn({
      label: 'Element Type',
      maxLength: 50,
      mandatory: true,
      choices: {
        text: { label: 'Text', sequence: 0 },
        field: { label: 'Field', sequence: 1 },
        image: { label: 'Image', sequence: 2 },
        table: { label: 'Table', sequence: 3 },
        line: { label: 'Line', sequence: 4 },
        rectangle: { label: 'Rectangle', sequence: 5 },
        barcode: { label: 'Barcode', sequence: 6 }
      }
    }),
    field_name: StringColumn({
      label: 'Field Name',
      maxLength: 100
    }),
    content: StringColumn({
      label: 'Static Content',
      maxLength: 1000
    }),
    x_position: DecimalColumn({
      label: 'X Position',
      mandatory: true
    }),
    y_position: DecimalColumn({
      label: 'Y Position', 
      mandatory: true
    }),
    width: DecimalColumn({
      label: 'Width',
      mandatory: true
    }),
    height: DecimalColumn({
      label: 'Height',
      mandatory: true
    }),
    font_size: IntegerColumn({
      label: 'Font Size',
      default: '12'
    }),
    font_family: StringColumn({
      label: 'Font Family',
      maxLength: 50,
      default: 'Arial'
    }),
    color: StringColumn({
      label: 'Color',
      maxLength: 7,
      default: '#000000'
    }),
    background_color: StringColumn({
      label: 'Background Color',
      maxLength: 7
    }),
    border_width: IntegerColumn({
      label: 'Border Width',
      default: '0'
    }),
    border_color: StringColumn({
      label: 'Border Color',
      maxLength: 7,
      default: '#000000'
    }),
    z_index: IntegerColumn({
      label: 'Z Index',
      default: '1'
    }),
    style_properties: StringColumn({
      label: 'Style Properties (JSON)',
      maxLength: 2000
    })
  },
  display: 'element_type',
  accessible_from: 'public',
  allow_web_service_access: true,
  actions: ['create', 'read', 'update', 'delete']
})