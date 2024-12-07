import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import GroceryList from "@/pages/GroceryList";
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list/:id" element={<GroceryList />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </LanguageProvider>
  );
}

export default App;