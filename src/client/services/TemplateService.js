export class TemplateService {
  constructor() {
    this.baseHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // Template CRUD operations
  async getTemplates() {
    try {
      const response = await fetch('/api/now/table/x_326171_pdf_templ_pdf_template?sysparm_display_value=all', {
        method: 'GET',
        headers: this.baseHeaders
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  async createTemplate(templateData) {
    try {
      const response = await fetch('/api/now/table/x_326171_pdf_templ_pdf_template', {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create template');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId, templateData) {
    try {
      const sysId = typeof templateId === 'object' ? templateId.value : templateId;
      const response = await fetch(`/api/now/table/x_326171_pdf_templ_pdf_template/${sysId}`, {
        method: 'PATCH',
        headers: this.baseHeaders,
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update template');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async deleteTemplate(templateId) {
    try {
      const sysId = typeof templateId === 'object' ? templateId.value : templateId;
      const response = await fetch(`/api/now/table/x_326171_pdf_templ_pdf_template/${sysId}`, {
        method: 'DELETE',
        headers: this.baseHeaders
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete template');
      }

      return response.ok;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // Template Elements CRUD
  async getTemplateElements(templateId) {
    try {
      const sysId = typeof templateId === 'object' ? templateId.value : templateId;
      const response = await fetch(
        `/api/now/table/x_326171_pdf_templ_template_element?sysparm_query=template=${sysId}&sysparm_display_value=all`, 
        {
          method: 'GET',
          headers: this.baseHeaders
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching template elements:', error);
      throw error;
    }
  }

  async saveTemplateElements(templateId, elements) {
    try {
      const sysId = typeof templateId === 'object' ? templateId.value : templateId;
      
      // First, delete existing elements
      await this.deleteTemplateElements(sysId);

      // Then create new elements
      const savePromises = elements.map(element => 
        this.createElement({ ...element, template: sysId })
      );

      return await Promise.all(savePromises);
    } catch (error) {
      console.error('Error saving template elements:', error);
      throw error;
    }
  }

  async createElement(elementData) {
    try {
      const response = await fetch('/api/now/table/x_326171_pdf_templ_template_element', {
        method: 'POST',
        headers: this.baseHeaders,
        body: JSON.stringify(elementData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create element');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating element:', error);
      throw error;
    }
  }

  async deleteTemplateElements(templateId) {
    try {
      const sysId = typeof templateId === 'object' ? templateId.value : templateId;
      const elements = await this.getTemplateElements(sysId);
      
      const deletePromises = elements.map(element => {
        const elementId = typeof element.sys_id === 'object' ? element.sys_id.value : element.sys_id;
        return fetch(`/api/now/table/x_326171_pdf_templ_template_element/${elementId}`, {
          method: 'DELETE',
          headers: this.baseHeaders
        });
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting template elements:', error);
      throw error;
    }
  }

  // Get available tables for template configuration
  async getAvailableTables() {
    try {
      const response = await fetch('/api/now/table/sys_db_object?sysparm_fields=name,label&sysparm_limit=100', {
        method: 'GET',
        headers: this.baseHeaders
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  // Get fields for a specific table
  async getTableFields(tableName) {
    try {
      const response = await fetch(
        `/api/now/table/sys_dictionary?sysparm_query=name=${tableName}&sysparm_fields=element,column_label,internal_type`, 
        {
          method: 'GET',
          headers: this.baseHeaders
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching table fields:', error);
      throw error;
    }
  }
}