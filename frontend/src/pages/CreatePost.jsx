// Importa useState hook da React
import { useState } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo la funzione createPost dal mio file services/api
import { createPost } from "../services/api";

export default function CreatePost() {

  const [coverFile, setCoverFile] = useState(null);

  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    cover: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Hook per la navigazione
  const navigate = useNavigate();

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
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
    <div>
      <h1 className="text-center">Crea un nuovo post</h1>
      <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto">
        {/* Campo per il titolo */}
        <div className="mb-5">
          <label className="block mb-1">Titolo</label>
          <input 
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        {/* Campo per la categoria */}
        <div className="mb-5">
          <label className="block mb-1">Categoria</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          />
        </div>
        {/* Campo per il contenuto HTML */}
        <div className="mb-5">
          <label className="block mb-1">Contenuto</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded h-[150px]"
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>
        {/* Campo per l'URL dell'immagine di copertina del post */}
        <div className="mb-5">
          <label className="block mb-1">URL Immagine</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
            required
          />
        </div>
        {/* Campo per il tempo di lettura */}
        <div className="mb-5">
          <label className="block mb-1">Tempo di lettura (minuti)</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
          />
        </div>
        {/* Campo per l'email dell'autore */}
        <div className="mb-5">
          <label className="block mb-1">Email autore</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            id="author"
            name="author"
            value={post.author}
            onChange={handleChange}
            required
          />
        </div>
        {/* Pulsante di invio */}
        <button type="submit" className="bg-blue-500 text-white border-none py-2 px-5 rounded cursor-pointer hover:bg-blue-700">
          Crea il post
        </button>
      </form>
    </div>
  );
}
