// Importa useState e useEffect da React
import { useState, useEffect } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo le funzioni createPost e getMe dal mio file services/api
import { createPost, getMe } from "../services/api";

export default function CreatePost() {

  const [coverFile, setCoverFile] = useState(null);

  // Creo una funzione che calcola il tempo di lettura
  const calculateReadTime = (content) => {
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Assumiamo 200 parole al minuto
    return {
      value: readingTime,
      unit: readingTime === 1 ? "minuto" : "minuti"
    };
  };

  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    cover: "",
    readTime: { value: 0, unit: "minuti" },
    author: "",
  });

  // Hook per la navigazione
  const navigate = useNavigate();

  // useEffect per l'autenticazione
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "content") {
      const readTime = calculateReadTime(value);
      setPost(prevPost => ({
        ...prevPost,
        [name]: value,
        readTime: readTime
      }));
    } else {
      setPost(prevPost => ({ ...prevPost, [name]: value }));
    }
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creiamo un oggetto FormData per inviare sia i dati del post che il file
      const formData = new FormData();

      // Aggiungiamo tutti i campi del post al FormData
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiungiamo il file di copertina se presente
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Invia i dati del post al backend
      await createPost(formData);
      // Naviga alla rotta della home dopo la creazione del post
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0])
  }

  // Template del componente
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-red-800 text-center mb-8">
      Benvenuto/a {post.author}, crea un nuovo post
    </h1>
    
    <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
          type="text"
          id="category"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Contenuto</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 h-[200px]"
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">Immagine di copertina</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-800 hover:file:bg-yellow-300"
          type="file"
          id="cover"
          name="cover"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="readTimeValue" className="block text-sm font-medium text-gray-700 mb-2">Tempo di lettura stimato</label>
        <p className="p-3 bg-gray-100 rounded-md">
          {post.readTime.value} {post.readTime.unit}
        </p>
      </div>

      <button 
        type="submit" 
        className="w-full bg-red-800 text-white py-3 px-6 rounded-md hover:bg-yellow-300 hover:text-red-800 transition duration-300 ease-in-out"
      >
        Crea il post
      </button>
    </form>
    </div>
  );
}
