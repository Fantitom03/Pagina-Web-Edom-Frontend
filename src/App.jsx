import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from "./context/ThemeContext";
import NavBar from "./components/NavBar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ItemProvider>
            <BrowserRouter>
              <NavBar />
              <main className="min-h-screen bg-gray-50">
                <AppRouter />
              </main>
            </BrowserRouter>
          </ItemProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;