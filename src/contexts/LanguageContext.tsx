import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Language = "en" | "es" | "da";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Dashboard translations
    "my_lists": "My Lists",
    "create_list": "Create List",
    "join_list": "Join List",
    "sign_out": "Sign Out",
    "no_lists": "No Lists Yet",
    "create_first": "Create your first list or join an existing one to get started.",
    "loading_lists": "Loading your lists...",
    "error_loading": "Error Loading Data",
    "try_refresh": "Please try refreshing the page.",
    "name": "Name",
    "items": "Items",
    "actions": "Actions",
    
    // Create List Dialog
    "create_new_list": "Create New List",
    "list_description": "Give your grocery list a name to get started.",
    "creating": "Creating...",
    "list_created": "Your list has been created.",
    "failed_create": "Failed to create list. Please try again.",
    
    // Join List Dialog
    "join_existing": "Join Existing List",
    "join_description": "Enter your name and the share code to join an existing grocery list.",
    "first_name": "First Name",
    "enter_first_name": "Enter your first name",
    "share_code": "Share Code",
    "enter_share_code": "Enter share code",
    "joining": "Joining...",
    "already_member": "You're already a member of this list.",
    "joined_success": "You've joined the list.",
    "failed_join": "Failed to join list. Please check the share code and try again.",
    
    // Grocery List
    "back": "Back",
    "share_code_copied": "Share code copied!",
    "failed_copy": "Failed to copy code",
    "add_new_item": "Add New Item",
    "enter_item_name": "Enter item name...",
    "adding_item": "Adding...",
    "add_item": "Add Item",
    "loading_items": "Loading items...",
    "no_items": "No items in the list yet. Add some items to get started!",
    "delete_confirm": "Are you sure?",
    "delete_item_confirm": "This will permanently delete this item from your list.",
    "cancel": "Cancel",
    "delete": "Delete",
    "item_deleted": "Item deleted",
    "failed_delete": "Failed to delete item",
    
    // Language Selection
    "select_language": "Select Language",
    "language_updated": "Language updated to English",
    "failed_language": "Failed to update language preference",
  },
  es: {
    // Dashboard translations
    "my_lists": "Mis Listas",
    "create_list": "Crear Lista",
    "join_list": "Unirse a Lista",
    "sign_out": "Cerrar Sesión",
    "no_lists": "Sin Listas Aún",
    "create_first": "Crea tu primera lista o únete a una existente para comenzar.",
    "loading_lists": "Cargando tus listas...",
    "error_loading": "Error al Cargar Datos",
    "try_refresh": "Por favor, intenta refrescar la página.",
    "name": "Nombre",
    "items": "Artículos",
    "actions": "Acciones",
    
    // Create List Dialog
    "create_new_list": "Crear Nueva Lista",
    "list_description": "Dale un nombre a tu lista de compras para comenzar.",
    "creating": "Creando...",
    "list_created": "Tu lista ha sido creada.",
    "failed_create": "Error al crear la lista. Por favor, intenta de nuevo.",
    
    // Join List Dialog
    "join_existing": "Unirse a Lista Existente",
    "join_description": "Ingresa tu nombre y el código de compartir para unirte a una lista existente.",
    "first_name": "Nombre",
    "enter_first_name": "Ingresa tu nombre",
    "share_code": "Código de Compartir",
    "enter_share_code": "Ingresa el código",
    "joining": "Uniéndose...",
    "already_member": "Ya eres miembro de esta lista.",
    "joined_success": "Te has unido a la lista.",
    "failed_join": "Error al unirse. Verifica el código e intenta de nuevo.",
    
    // Grocery List
    "back": "Volver",
    "share_code_copied": "¡Código copiado!",
    "failed_copy": "Error al copiar código",
    "add_new_item": "Añadir Artículo",
    "enter_item_name": "Ingresa el nombre del artículo...",
    "adding_item": "Añadiendo...",
    "add_item": "Añadir",
    "loading_items": "Cargando artículos...",
    "no_items": "No hay artículos en la lista. ¡Añade algunos para comenzar!",
    "delete_confirm": "¿Estás seguro?",
    "delete_item_confirm": "Esto eliminará permanentemente este artículo de tu lista.",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "item_deleted": "Artículo eliminado",
    "failed_delete": "Error al eliminar artículo",
    
    // Language Selection
    "select_language": "Seleccionar Idioma",
    "language_updated": "Idioma actualizado a Español",
    "failed_language": "Error al actualizar preferencia de idioma",
  },
  da: {
    // Dashboard translations
    "my_lists": "Mine Lister",
    "create_list": "Opret Liste",
    "join_list": "Tilslut Liste",
    "sign_out": "Log Ud",
    "no_lists": "Ingen Lister Endnu",
    "create_first": "Opret din første liste eller tilslut dig en eksisterende for at komme i gang.",
    "loading_lists": "Indlæser dine lister...",
    "error_loading": "Fejl Ved Indlæsning",
    "try_refresh": "Prøv venligst at genindlæse siden.",
    "name": "Navn",
    "items": "Varer",
    "actions": "Handlinger",
    
    // Create List Dialog
    "create_new_list": "Opret Ny Liste",
    "list_description": "Giv din indkøbsliste et navn for at komme i gang.",
    "creating": "Opretter...",
    "list_created": "Din liste er blevet oprettet.",
    "failed_create": "Kunne ikke oprette liste. Prøv igen.",
    
    // Join List Dialog
    "join_existing": "Tilslut Eksisterende Liste",
    "join_description": "Indtast dit navn og delingskoden for at tilslutte dig en eksisterende liste.",
    "first_name": "Fornavn",
    "enter_first_name": "Indtast dit fornavn",
    "share_code": "Delingskode",
    "enter_share_code": "Indtast delingskode",
    "joining": "Tilslutter...",
    "already_member": "Du er allerede medlem af denne liste.",
    "joined_success": "Du har tilsluttet dig listen.",
    "failed_join": "Kunne ikke tilslutte. Tjek koden og prøv igen.",
    
    // Grocery List
    "back": "Tilbage",
    "share_code_copied": "Delingskode kopieret!",
    "failed_copy": "Kunne ikke kopiere kode",
    "add_new_item": "Tilføj Vare",
    "enter_item_name": "Indtast varenavn...",
    "adding_item": "Tilføjer...",
    "add_item": "Tilføj",
    "loading_items": "Indlæser varer...",
    "no_items": "Ingen varer på listen endnu. Tilføj nogle for at komme i gang!",
    "delete_confirm": "Er du sikker?",
    "delete_item_confirm": "Dette vil permanent slette denne vare fra din liste.",
    "cancel": "Annuller",
    "delete": "Slet",
    "item_deleted": "Vare slettet",
    "failed_delete": "Kunne ikke slette vare",
    
    // Language Selection
    "select_language": "Vælg Sprog",
    "language_updated": "Sprog opdateret til Dansk",
    "failed_language": "Kunne ikke opdatere sprogpræference",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const fetchUserLanguage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('id', user.id)
        .single();

      if (profile?.preferred_language) {
        setLanguage(profile.preferred_language as Language);
      }
    };

    fetchUserLanguage();
  }, []);

  const value = {
    language,
    setLanguage,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}