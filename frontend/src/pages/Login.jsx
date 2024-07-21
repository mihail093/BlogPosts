import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";

// Importa l'URL dell'API dalla variabile d'ambiente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const location = useLocation(); // Per accedere ai parametri dell'URL corrente

    useEffect(() => {
      // Questo effect viene eseguito dopo il rendering del componente
      // e ogni volta che location o navigate cambiano
    
      // Estraiamo i parametri dall'URL
      const params = new URLSearchParams(location.search);
      // Cerchiamo un parametro 'token' nell'URL
      const token = params.get("token");
    
      if (token) {
        // Se troviamo un token, lo salviamo nel localStorage
        localStorage.setItem("token", token);
        // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
        window.dispatchEvent(new Event("storage"));
        // Navighiamo alla home page
        navigate("/");
      }
    }, [location, navigate]);

    // Gestore per aggiornare lo stato quando i campi del form cambiano
    const handleChange = (e) => {
        setFormData ({...formData, [e.target.name]: e.target.value});
    };

    // Gestore dell'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
            localStorage.setItem("token", response.token);
            window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
            alert("Login effetuato con successo!");
            navigate("/");
        } catch (error) {
            console.error("Errore durante il login:", error);
            alert("Credenziali non valide, riprova...");
        }
    };

    // Funzione per gestire il login con Google
    const handleGoogleLogin = () => {
    // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Google
    window.location.href = `${API_URL}/api/auth/google`;
    };

  return (
<div className="max-w-[600px] mx-auto p-8 bg-white rounded-lg shadow-md">
  <h2 className="text-3xl font-bold mb-6 text-red-800">Login</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="email"
      name="email"
      placeholder="Email"
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
    />
    <button 
      type="submit"
      className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-yellow-300 hover:text-red-800 transition duration-300 ease-in-out"
    >
      Accedi
    </button>
  </form>
  <button 
    onClick={handleGoogleLogin}
    className="w-full bg-red-800 text-white py-2 px-4 mt-2 rounded-md hover:bg-yellow-300 hover:text-red-800 transition duration-300 ease-in-out"
  >
    Accedi con Google
  </button>
</div>
  )
}
