import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function validateTemplate(current, previous) {
    // Validate template name is unique
    if (current.name.getValue()) {
        const gr = new GlideRecord('x_326171_pdf_templ_pdf_template');
        gr.addQuery('name', current.name.getValue());
        gr.addQuery('sys_id', '!=', current.sys_id.getValue());
        gr.query();
        
        if (gr.next()) {
            gs.addErrorMessage('A template with this name already exists');
            current.setAbortAction(true);
            return;
        }
    }

    // Validate source table exists
    if (current.source_table.getValue()) {
        const tableGR = new GlideRecord('sys_db_object');
        tableGR.addQuery('name', current.source_table.getValue());
        tableGR.query();
        
        if (!tableGR.next()) {
            gs.addErrorMessage('The specified source table does not exist');
            current.setAbortAction(true);
            return;
        }
    }

    // Set creation/update timestamps and user
    const now = new GlideDateTime();
    const currentUser = gs.getUserID();
    
    if (current.isNewRecord()) {
        current.created_on.setValue(now);
        current.created_by.setValue(currentUser);
    }
    
    current.updated_on.setValue(now);
    current.updated_by.setValue(currentUser);
}

export function logTemplateChange(current, previous) {
    const action = current.isNewRecord() ? 'created' : 'updated';
    const templateName = current.name.getValue();
    
    gs.info(`PDF Template "${templateName}" was ${action} by ${gs.getUserName()}`);
}