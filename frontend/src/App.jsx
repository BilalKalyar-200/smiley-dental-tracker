import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    //browserRouter enables page navigation without full reload
    <BrowserRouter>
      {/*AuthProvider wraps everything so all components can access user state */}
      <AuthProvider>
        <div className="min-h-screen bg-[#0a0f1e]">
          <Navbar />
          <AppRoutes />
        </div>
        {/* Toast notifications (success/error popups) */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e2a45",
              color: "#fff",
              border: "1px solid #2d3f6b",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
