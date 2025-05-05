import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext"; // 👈 ¡Faltaba este import!
import NavBar from "./components/NavBar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <BrowserRouter>
          <NavBar />
          <main className="min-h-screen bg-gray-50">
            <AppRouter />
          </main>
        </BrowserRouter>
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;