import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        dataDiNascita: "",
        //avatar: "",
    });

    const navigate = useNavigate();

    // Gestore per aggiornare lo stato quando i campi del form cambiano
    const handleChange = (e) => {
        setFormData ({...formData, [e.target.name]: e.target.value});
    };

    // Gestore per aggiornare lo stato quando il file cambia
    const handleFileChange = (e) => {
        setFormData ({...formData, [e.target.name]: e.target.files[0]});
    };

    // Gestore per l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Dati inviati per la registrazione:", formData); // Log dei dati inviati

            const response = await registerUser(formData); // Chiama la funzione registerUser 
            
            console.log("Risposta del server:", response); // Log della risposta del server

            alert("Registrazione avvenuta con successo!");
            navigate("/login");
        } catch (error) {
            console.error("Errore durante la registrazione", error);
            alert(`Errore durante la registrazione, riprova... Dettagli: ${error.message}`);
        }
    };

    return (
<div className="max-w-[600px] mx-auto p-8 bg-white rounded-lg shadow-md">
  <h2 className="text-3xl font-bold mb-6 text-red-800">Registrazione</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="text"
      name="nome"
      placeholder="Nome"
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
    />
    <input
      type="text"
      name="cognome"
      placeholder="Cognome"
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
    />
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
    <div className="flex flex-col">
      <label htmlFor="dataDiNascita" className="text-sm text-gray-600 mb-1">Data di nascita</label>
      <input
        type="date"
        id="dataDiNascita"
        name="dataDiNascita"
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
      />
    </div>
    {/* <div className="flex flex-col">
      <label htmlFor="avatar" className="text-sm text-gray-600 mb-1">Avatar</label>
      <input
        type="file"
        id="avatar"
        name="avatar"
        onChange={handleFileChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-800 hover:file:bg-yellow-300"
      />
    </div> */}
    <button 
      type="submit"
      className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-yellow-300 hover:text-red-800 transition duration-300 ease-in-out"
    >
      Registrati
    </button>
  </form>
</div>
    );
}