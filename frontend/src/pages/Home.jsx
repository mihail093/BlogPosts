// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa Link da react-router-dom per la navigazione
import { Link } from "react-router-dom";
// Importo la funzione getPosts dal mio file services/api
import { getPosts } from "../services/api";
// Importa il file CSS per gli stili specifici di questo componente

export default function Home() {
  // Stato per memorizzare l'array dei post
  const [posts, setPosts] = useState([]);

  // Effect hook per fetchare i post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere tutti i post
        const response = await getPosts();
        // Aggiorna lo stato con i dati dei post
        setPosts(response.data);
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post:", error);
      }
    };
    // Chiamiamo la funzione fetchPosts
    fetchPosts();
  }, []); // L'array vuoto come secondo argomento significa che questo effect si esegue solo al mount del componente

  // Rendering del componente
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-red-800 mb-8">Lista dei Post</h1>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {posts.map((post) => (
        <Link 
          to={`/post/${post._id}`} 
          key={post._id} 
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col"
        >
          <img 
            src={post.cover} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-red-800 mb-2 line-clamp-2">{post.title}</h2>
            <p className="text-sm text-gray-600 mb-2">Autore: {post.author}</p>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">
                {post.readTime.value} {post.readTime.unit} lettura
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
  );
}
