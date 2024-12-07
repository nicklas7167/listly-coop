import { Translations } from "./types";

export const englishTranslations: Translations = {
  // Dashboard translations
  my_lists: "My Lists",
  create_list: "Create List",
  join_list: "Join List",
  sign_out: "Sign Out",
  no_lists: "No Lists Yet",
  create_first: "Create your first list or join an existing one to get started.",
  loading_lists: "Loading your lists...",
  error_loading: "Error Loading Data",
  try_refresh: "Please try refreshing the page.",
  name: "Name",
  items: "Items",
  actions: "Actions",
  
  // Create List Dialog
  create_new_list: "Create New List",
  list_description: "Give your grocery list a name to get started.",
  creating: "Creating...",
  list_created: "Your list has been created.",
  failed_create: "Failed to create list. Please try again.",
  
  // Join List Dialog
  join_existing: "Join Existing List",
  join_description: "Enter your name and the share code to join an existing grocery list.",
  first_name: "First Name",
  enter_first_name: "Enter your first name",
  share_code: "Share Code",
  enter_share_code: "Enter share code",
  joining: "Joining...",
  already_member: "You're already a member of this list.",
  joined_success: "You've joined the list.",
  failed_join: "Failed to join list. Please check the share code and try again.",
  
  // Grocery List
  back: "Back",
  share_code_copied: "Share code copied!",
  failed_copy: "Failed to copy code",
  add_new_item: "Add New Item",
  enter_item_name: "Enter item name...",
  adding_item: "Adding...",
  add_item: "Add Item",
  loading_items: "Loading items...",
  no_items: "No items in the list yet. Add some items to get started!",
  delete_confirm: "Are you sure?",
  delete_item_confirm: "This will permanently delete this item from your list.",
  cancel: "Cancel",
  delete: "Delete",
  item_deleted: "Item deleted",
  failed_delete: "Failed to delete item",
  
  // Language Selection
  select_language: "Select Language",
  language_updated: "Language updated to English",
  failed_language: "Failed to update language preference",

  // List Actions Dialog
  list_actions: "List Actions",
  manage_list_settings: "Manage your list settings and sharing options",
  copy_share_code: "Copy Share Code",
  delete_list: "Delete List",
  share_code_success: "Share code copied! Share this code with others to collaborate on this list.",

  // Delete List Dialog
  delete_list_confirm: "Are you absolutely sure?",
  delete_list_warning: "This action cannot be undone. This will permanently delete the list and all its items.",
  type_list_name: "Please type {listName} to confirm.",
  delete_list_success: "The list has been successfully deleted.",
  delete_list_error: "Failed to delete the list. Please try again.",

  // List Members Dialog
  list_members: "List Members",
  loading: "Loading...",
  no_members: "No members found",
  anonymous_user: "Anonymous User",
};
