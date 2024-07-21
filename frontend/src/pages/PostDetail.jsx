// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importo useParams e Link da react-router-dom
import { useParams, Link } from "react-router-dom";
// Importo tutte le funzioni necessarie dal mio file services/api
import { getPost, getComments, createComment, getUserData } from "../services/api";

export default function PostDetail() {
  // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);

  // Stato per memorizzare i commenti
  const [comments, setComments] = useState([]);

  // Stato per il nuovo commento
  const [newComment, setNewComment] = useState({ commentText: "" });

  // Stato per verificare se l'utente è loggato
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stato per memorizzare i dati dell'utente
  const [userData, setUserData] = useState(null);

  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();

  // Effettua il fetch dei dati del post e dei commenti al caricamento del componente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id); // Ottiene i dati del post dall'API
        setPost(postData); // Imposta i dati del post nello stato
      } catch (error) {
        console.error("Errore nel caricamento del post:", error); // Logga l'errore in console
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id); // Ottiene i commenti del post dall'API
        setComments(commentsData); // Imposta i commenti nello stato
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error); // Logga l'errore in console
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
      if (token) {
        setIsLoggedIn(true); // Imposta lo stato di autenticazione a true
        try {
          const data = await getUserData(); // Ottiene i dati dell'utente autenticato dall'API
          setUserData(data); // Imposta i dati dell'utente nello stato
          fetchComments(); // Carica i commenti del post
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); // Logga l'errore in console
          setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
        }
      } else {
        setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
      }
    };

    fetchPost(); // Carica i dati del post al caricamento del componente
    checkAuthAndFetchUserData(); // Verifica l'autenticazione e carica i dati dell'utente
  }, [id]); // Effettua nuovamente l'effetto quando l'ID del post cambia

  // Gestore per la sottomissione del nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per commentare."); // Logga un messaggio di errore se l'utente non è loggato
      return;
    }
    try {
      const commentData = {
        commentText: newComment.commentText, // Contenuto del nuovo commento
        name: `${userData.nome} ${userData.cognome}`, // Nome dell'utente
        email: userData.email, // Email dell'utente
      };
      const newCommentData = await createComment(id, commentData); // Invia il nuovo commento all'API

      // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]); // Aggiunge il nuovo commento alla lista dei commenti
      setNewComment({ commentText: "" }); // Resetta il campo del nuovo commento
    } catch (error) {
      console.error("Errore nell'invio del commento:", error); // Logga l'errore in console
      alert(
        `Errore nell'invio del commento: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (!post) return <div>Caricamento...</div>; // Mostra un messaggio di caricamento se i dati del post non sono ancora stati caricati

  // Rendering del componente
  return (
  <div className="container mx-auto px-4 py-8">
  <article className="max-w-[800px] mx-auto">
    <img src={post.cover} alt={post.title} className="w-full h-[400px] object-cover rounded-lg shadow-md" />
    
    <h1 className="text-3xl font-bold text-red-800 mt-8 mb-4">{post.title}</h1>
    
    <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-6">
      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Categoria: {post.category}</span>
      <span>Autore: {post.author}</span>
      <span>Tempo di lettura: {post.readTime.value} {post.readTime.unit}</span>
    </div>
    
    <div className="prose prose-lg max-w-none leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
    
    <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-red-800 mb-6">Commenti</h2>
      
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-md shadow-sm mb-4">
            <h3 className="font-semibold text-red-700">{comment.name}</h3>
            <p className="text-gray-700 mt-2">{comment.commentText}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">Ancora nessun commento</p>
      )}
      
      {isLoggedIn ? (
        <form className="mt-8" onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            name="commentText"
            value={newComment.commentText}
            onChange={(e) => setNewComment({ ...newComment, commentText: e.target.value })}
            placeholder="Scrivi il tuo commento"
            rows="4"
            required
          ></textarea>
          <button 
            className="mt-4 px-6 py-2 bg-red-800 text-white rounded-md hover:bg-yellow-300 hover:text-red-800 transition duration-300" 
            type="submit"
          >
            Invia commento
          </button>
        </form>
      ) : (
        <p className="mt-6 text-gray-600">
          <Link to="/login" className="text-red-800 hover:text-yellow-300 transition duration-300">Accedi</Link> per visualizzare o lasciare commenti.
        </p>
      )}
    </div>
  </article>
  </div>
  );
}
