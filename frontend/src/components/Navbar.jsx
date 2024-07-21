// Importa il componente Link da react-router-dom per la navigazione
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserData } from "../services/api";
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true)
        } catch (error) {
          console.error("token non funzionante", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoggedIn(false);
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStateChange", checkLoginStatus);

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-red-800 py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white no-underline hover:text-yellow-300 transition duration-300">
          Strive Blog
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white no-underline hover:text-yellow-300 transition duration-300">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create" className="text-white no-underline hover:text-yellow-300 transition duration-300">
                  Nuovo Post
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white no-underline hover:text-yellow-300 transition duration-300">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white no-underline hover:text-yellow-300 transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white no-underline hover:text-yellow-300 transition duration-300">
                  Registrati
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}