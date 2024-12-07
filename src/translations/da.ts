import { Translations } from "./types";

export const danishTranslations: Translations = {
  // Dashboard translations
  my_lists: "Mine Lister",
  create_list: "Opret Liste",
  join_list: "Tilslut Liste",
  sign_out: "Log Ud",
  no_lists: "Ingen Lister Endnu",
  create_first: "Opret din første liste eller tilslut dig en eksisterende for at komme i gang.",
  loading_lists: "Indlæser dine lister...",
  error_loading: "Fejl Ved Indlæsning",
  try_refresh: "Prøv venligst at genindlæse siden.",
  name: "Navn",
  items: "Varer",
  actions: "Handlinger",
  
  // Create List Dialog
  create_new_list: "Opret Ny Liste",
  list_description: "Giv din indkøbsliste et navn for at komme i gang.",
  creating: "Opretter...",
  list_created: "Din liste er blevet oprettet.",
  failed_create: "Kunne ikke oprette liste. Prøv igen.",
  
  // Join List Dialog
  join_existing: "Tilslut Eksisterende Liste",
  join_description: "Indtast dit navn og delingskoden for at tilslutte dig en eksisterende liste.",
  first_name: "Fornavn",
  enter_first_name: "Indtast dit fornavn",
  share_code: "Delingskode",
  enter_share_code: "Indtast delingskode",
  joining: "Tilslutter...",
  already_member: "Du er allerede medlem af denne liste.",
  joined_success: "Du har tilsluttet dig listen.",
  failed_join: "Kunne ikke tilslutte. Tjek koden og prøv igen.",
  
  // Grocery List
  back: "Tilbage",
  share_code_copied: "Delingskode kopieret!",
  failed_copy: "Kunne ikke kopiere kode",
  add_new_item: "Tilføj Vare",
  enter_item_name: "Indtast varenavn...",
  adding_item: "Tilføjer...",
  add_item: "Tilføj",
  loading_items: "Indlæser varer...",
  no_items: "Ingen varer på listen endnu. Tilføj nogle for at komme i gang!",
  delete_confirm: "Er du sikker?",
  delete_item_confirm: "Dette vil permanent slette denne vare fra din liste.",
  cancel: "Annuller",
  delete: "Slet",
  item_deleted: "Vare slettet",
  failed_delete: "Kunne ikke slette vare",
  
  // Language Selection
  select_language: "Vælg Sprog",
  language_updated: "Sprog opdateret til Dansk",
  failed_language: "Kunne ikke opdatere sprogpræference",

  // List Actions Dialog
  list_actions: "Listehandlinger",
  manage_list_settings: "Administrer dine listeindstillinger og delingsmuligheder",
  copy_share_code: "Kopier Delingskode",
  delete_list: "Slet Liste",
  share_code_success: "Delingskode kopieret! Del denne kode med andre for at samarbejde om denne liste.",

  // Delete List Dialog
  delete_list_confirm: "Er du helt sikker?",
  delete_list_warning: "Denne handling kan ikke fortrydes. Dette vil permanent slette listen og alle dens varer.",
  type_list_name: "Skriv venligst {listName} for at bekræfte.",
  delete_list_success: "Listen er blevet slettet.",
  delete_list_error: "Kunne ikke slette listen. Prøv venligst igen.",

  // List Members Dialog
  list_members: "Listemedlemmer",
  loading: "Indlæser...",
  no_members: "Ingen medlemmer fundet",
  anonymous_user: "Anonym Bruger",
};
