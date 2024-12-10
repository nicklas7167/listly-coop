import { useLanguage } from "@/contexts/LanguageContext";

export const GroceryListEmpty = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="text-center py-4 text-gray-500">
      {translations.no_items}
    </div>
  );
};