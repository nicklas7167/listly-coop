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
    "back": "Back",
    "share_code": "Share Code",
    "add_item": "Add Item",
    "enter_item": "Enter item name...",
    "adding": "Adding...",
    "delete": "Delete",
    "cancel": "Cancel",
    "are_you_sure": "Are you sure?",
    "delete_confirm": "This will permanently delete this item from your list.",
  },
  es: {
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
    "back": "Volver",
    "share_code": "Código Compartir",
    "add_item": "Añadir Artículo",
    "enter_item": "Ingresa nombre del artículo...",
    "adding": "Añadiendo...",
    "delete": "Eliminar",
    "cancel": "Cancelar",
    "are_you_sure": "¿Estás seguro?",
    "delete_confirm": "Esto eliminará permanentemente este artículo de tu lista.",
  },
  da: {
    "my_lists": "Mine Lister",
    "create_list": "Opret Liste",
    "join_list": "Tilslut Liste",
    "sign_out": "Log Ud",
    "no_lists": "Ingen Lister Endnu",
    "create_first": "Opret din første liste eller tilslut dig en eksisterende for at komme i gang.",
    "loading_lists": "Indlæser dine lister...",
    "error_loading": "Fejl Ved Indlæsning af Data",
    "try_refresh": "Prøv venligst at genindlæse siden.",
    "name": "Navn",
    "items": "Varer",
    "actions": "Handlinger",
    "back": "Tilbage",
    "share_code": "Delingskode",
    "add_item": "Tilføj Vare",
    "enter_item": "Indtast varenavn...",
    "adding": "Tilføjer...",
    "delete": "Slet",
    "cancel": "Annuller",
    "are_you_sure": "Er du sikker?",
    "delete_confirm": "Dette vil permanent slette denne vare fra din liste.",
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