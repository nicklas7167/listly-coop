import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import GroceryList from "@/pages/GroceryList";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;