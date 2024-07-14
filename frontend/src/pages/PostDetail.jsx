// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa useParams per accedere ai parametri dell'URL
import { useParams } from "react-router-dom";
// Importo la funzione getPost dal mio file services/api
import { getPost, getComments, createComment } from "../services/api";

export default function PostDetail() {
  // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);

  // Stato per memorizzare i commenti
  const [comments, setComments] = useState([]);

  // Stato per il nuovo commento
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    commentText: ""
  });

  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();

  // Effect hook per fetchare i dati del post quando il componente viene montato o l'id cambia
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Effettua una richiesta GET al backend per ottenere i dettagli del post
        const postResponse  = await getPost(id);
        // Aggiorna lo stato con i dati del post
        setPost(postResponse);

        const commentsResponse = await getComments(id);
        setComments(commentsResponse);
        commentsResponse.forEach((comment) => 
          console.log("commentId", comment._id),
        );
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch del post o dei commenti:", error);
      }
    };
    // Chiama la funzione fetchPost
    fetchPostAndComments();
  }, [id]); // L'effetto si attiva quando l'id cambia

  // Gestore per i cambiamenti nei campi del nuovo commento
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  // Gestore per l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment(id, newComment);
      // Aggiorna i commenti ricaricandoli dal database per ottenere l'ID del nuovo commento
      const commentsResponse = await getComments(id);
      setComments(commentsResponse);
      setNewComment({ name: "", email: "", content: "" });

      // Logga gli ID dei commenti dopo l'aggiornamento
      commentsResponse.forEach((comment) =>
        console.log("Comment ID:", comment._id),
      );
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return <div>Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="container mx-auto p-5">
      <article className="max-w-[800px] mx-auto py-5">
        {/* Immagine di copertina del post */}
        <img src={post.cover} alt={post.title} className="w-full max-h-[400px] object-cover rounded-lg" />
        {/* Titolo del post */}
        <h1 className="my-5">{post.title}</h1>
        {/* Dati del post */}
        <div className="flex justify-between text-gray-600 mb-5">
          <span>Categoria: {post.category}</span>
          <span>Autore: {post.author}</span>
          <span>
            Tempo di lettura: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
        {/* Contenuto del post */}
        {/* dangerouslySetInnerHTML, come nel template originario che ci ha dato EPICODE è usato per renderizzare HTML "RAW", usare con cautela!!!! */}
        <div
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        >
        </div>
        {/* Sezione commenti */}
        <div className="mt-8">
          <h2>Commenti</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border border-gray-300 p-4 mb-4">
                <h3>{comment.name}</h3>
                <p>{comment.commentText}</p>
              </div>
            ))
          ) : (
            <p>Ancora nessun commento</p>
          )}

          {/* Form per aggiungere un nuovo commento */}
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleCommentSubmit}>
            <input
              className="p-2"
              type="text"
              name="name"
              value={newComment.name}
              onChange={handleCommentChange}
              placeholder="Il tuo nome"
              required
            />
            <input
              className="p-2"
              type="email"
              name="email"
              value={newComment.email}
              onChange={handleCommentChange}
              placeholder="La tua email"
              required
            />
            <textarea
              className="p-2"
              name="commentText"
              value={newComment.commentText}
              onChange={handleCommentChange}
              placeholder="Il tuo commento"
              required
            ></textarea>
            <button className="p-2 bg-blue-500 text-white border-none cursor-pointer hover:bg-blue-700" type="submit">Invia commento</button>
          </form>
        </div>
      </article>
    </div>
  );
}
