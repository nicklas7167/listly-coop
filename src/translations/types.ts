export interface Translations {
  // Dashboard translations
  my_lists: string;
  create_list: string;
  join_list: string;
  sign_out: string;
  no_lists: string;
  create_first: string;
  loading_lists: string;
  error_loading: string;
  name: string;
  items: string;
  actions: string;
  
  // Create List Dialog
  create_new_list: string;
  list_description: string;
  creating: string;
  list_created: string;
  failed_create: string;
  
  // Join List Dialog
  join_existing: string;
  join_description: string;
  first_name: string;
  enter_first_name: string;
  share_code: string;
  enter_share_code: string;
  joining: string;
  already_member: string;
  joined_success: string;
  failed_join: string;
  
  // Grocery List
  back: string;
  share_code_copied: string;
  failed_copy: string;
  add_new_item: string;
  enter_item_name: string;
  adding_item: string;
  add_item: string;
  loading_items: string;
  no_items: string;
  delete_confirm: string;
  delete_item_confirm: string;
  cancel: string;
  delete: string;
  item_deleted: string;
  failed_delete: string;
  
  // Language Selection
  select_language: string;
  language_updated: string;
  failed_language: string;

  // List Actions Dialog
  list_actions: string;
  manage_list_settings: string;
  copy_share_code: string;
  delete_list: string;
  share_code_success: string;

  // Delete List Dialog
  delete_list_confirm: string;
  delete_list_warning: string;
  type_list_name: string;
  delete_list_success: string;
  delete_list_error: string;

  // List Members Dialog
  list_members: string;
  loading: string;
  no_members: string;
  anonymous_user: string;
}

export type Language = 'en' | 'es' | 'da';