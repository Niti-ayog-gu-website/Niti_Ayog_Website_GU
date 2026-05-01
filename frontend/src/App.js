import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import ResearchDashboard from "./pages/ResearchDashboard";
import IndustryDashboard from "./pages/IndustryDashboard";


export default function App() {
  const [page, setPage] = useState("Home");

  const renderPage = () => {
    switch (page) {
      case "Home":      return <Home setPage={setPage} />;
      case "Login":     return <Login setPage={setPage} />;
      case "Students":  return <StudentDashboard />;
      case "Alumni":    return <AlumniDashboard />;
      case "Research":    return <ResearchDashboard />;
 case "Industry":  
      return <IndustryDashboard />;
      default:          return <Home setPage={setPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="font-sans antialiased">
        {page !== "Login" && (
          <Navbar currentPage={page} setPage={setPage} />
        )}
        {renderPage()}
      </div>
    </AuthProvider>
  );
}
