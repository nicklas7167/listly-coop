import { Translations } from "./types";

export const spanishTranslations: Translations = {
  // Dashboard translations
  my_lists: "Mis Listas",
  create_list: "Crear Lista",
  join_list: "Unirse a Lista",
  sign_out: "Cerrar Sesión",
  no_lists: "Sin Listas Aún",
  create_first: "Crea tu primera lista o únete a una existente para comenzar.",
  loading_lists: "Cargando tus listas...",
  error_loading: "Error al Cargar Datos",
  try_refresh: "Por favor, intenta refrescar la página.",
  name: "Nombre",
  items: "Artículos",
  actions: "Acciones",
  
  // Create List Dialog
  create_new_list: "Crear Nueva Lista",
  list_description: "Dale un nombre a tu lista de compras para comenzar.",
  creating: "Creando...",
  list_created: "Tu lista ha sido creada.",
  failed_create: "Error al crear la lista. Por favor, intenta de nuevo.",
  
  // Join List Dialog
  join_existing: "Unirse a Lista Existente",
  join_description: "Ingresa tu nombre y el código de compartir para unirte a una lista existente.",
  first_name: "Nombre",
  enter_first_name: "Ingresa tu nombre",
  share_code: "Código de Compartir",
  enter_share_code: "Ingresa el código",
  joining: "Uniéndose...",
  already_member: "Ya eres miembro de esta lista.",
  joined_success: "Te has unido a la lista.",
  failed_join: "Error al unirse. Verifica el código e intenta de nuevo.",
  
  // Grocery List
  back: "Volver",
  share_code_copied: "¡Código copiado!",
  failed_copy: "Error al copiar código",
  add_new_item: "Añadir Artículo",
  enter_item_name: "Ingresa el nombre del artículo...",
  adding_item: "Añadiendo...",
  add_item: "Añadir",
  loading_items: "Cargando artículos...",
  no_items: "No hay artículos en la lista. ¡Añade algunos para comenzar!",
  delete_confirm: "¿Estás seguro?",
  delete_item_confirm: "Esto eliminará permanentemente este artículo de tu lista.",
  cancel: "Cancelar",
  delete: "Eliminar",
  item_deleted: "Artículo eliminado",
  failed_delete: "Error al eliminar artículo",
  
  // Language Selection
  select_language: "Seleccionar Idioma",
  language_updated: "Idioma actualizado a Español",
  failed_language: "Error al actualizar preferencia de idioma",

  // List Actions Dialog
  list_actions: "Acciones de Lista",
  manage_list_settings: "Administra la configuración y opciones de compartir de tu lista",
  copy_share_code: "Copiar Código de Compartir",
  delete_list: "Eliminar Lista",
  share_code_success: "¡Código copiado! Comparte este código con otros para colaborar en esta lista.",

  // Delete List Dialog
  delete_list_confirm: "¿Estás absolutamente seguro?",
  delete_list_warning: "Esta acción no se puede deshacer. Esto eliminará permanentemente la lista y todos sus elementos.",
  type_list_name: "Por favor escribe {listName} para confirmar.",
  delete_list_success: "La lista ha sido eliminada exitosamente.",
  delete_list_error: "Error al eliminar la lista. Por favor, intenta de nuevo.",

  // List Members Dialog
  list_members: "Miembros de la Lista",
  loading: "Cargando...",
  no_members: "No se encontraron miembros",
  anonymous_user: "Usuario Anónimo",
};
