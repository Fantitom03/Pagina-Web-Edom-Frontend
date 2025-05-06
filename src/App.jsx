import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from "./context/ThemeContext";
import { CategoryProvider } from './context/CategoryContext';
import NavBar from "./components/NavBar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-orange-500 to-orange-300 transition-colors duration-100 dark:bg-gradient-to-r dark:from-orange-600 dark:to-orange-950">
      <AuthProvider>
        <ThemeProvider>
          <CategoryProvider>
            <CartProvider>
              <ItemProvider>
                <BrowserRouter>
                  <NavBar />
                  <main className="flex-1 px-4 py-6">
                    <AppRouter />
                  </main>
                </BrowserRouter>
              </ItemProvider>
            </CartProvider>
          </CategoryProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;