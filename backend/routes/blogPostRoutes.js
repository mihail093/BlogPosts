import express from "express";
import BlogPost from "../models/BlogPost.js";
// import upload from "../middlewares/upload.js";
// import controlloMail from "../middlewares/controlloMail.js"; // NON USARE - SOLO PER DIDATTICA - MIDDLEWARE (commentato)
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendEmail } from "../services/emailServices.js"; // Import del codice per l'invio delle mail (INVIO MAIL)


const router = express.Router();

// router.use(controlloMail); // NON USARE - SOLO PER DIDATTICA - Applicazione del middleware a tutte le rotte (commentato)

// GET /blogPosts: ritorna una lista di blog post
router.get("/", async (req, res) => {
  try {
    let query = {};
    // Se c'è un parametro 'title' nella query, crea un filtro per la ricerca case-insensitive
    if (req.query.title) {
      // Per fare ricerca case-insensitive:
      query.title = { $regex: req.query.title, $options: "i" };
      // Altrimenti per fare ricerca case-sensitive:
      // query.title = req.query.title;
    }
    // Cerca i blog post nel database usando il filtro (se presente)
    const blogPosts = await BlogPost.find(query);
    // Invia la lista dei blog post come risposta JSON
    res.json(blogPosts);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/123: ritorna un singolo blog post
router.get("/:id", async (req, res) => {
  try {
    // Cerca un blog post specifico per ID
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post trovato come risposta JSON
    res.json(blogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

router.use(authMiddleware);

// POST /blogPosts: crea un nuovo blog post
/* router.post("/", async (req, res) => {
  // Crea una nuova istanza di BlogPost con i dati dalla richiesta
  const blogPost = new BlogPost(req.body);
  try {
    // Salva il nuovo blog post nel database
    const newBlogPost = await blogPost.save();
    // Invia il nuovo blog post creato come risposta JSON con status 201 (Created)
    res.status(201).json(newBlogPost);
  } catch (err) {
    // In caso di errore (es. validazione fallita), invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
}); */

// POST con upload
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      //postData.cover = `http://localhost:3001/uploads/${req.file.filename}`
      postData.cover = req.file.path
    }
    const newPost = new BlogPost(postData);
    await newPost.save();
    // CODICE PER INVIO MAIL con MAILGUN
    const htmlContent = `
    <h1>Il tuo post è stato pubblicato!</h1>
    <p>Ciao ${newPost.author},</p>
    <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
    <p>Categoria: ${newPost.category}</p>
    <p>Grazie per il tuo contributo al blog!</p>
  `;

  await sendEmail(
    newPost.author, // Ovviamente assumendo che newPost.author sia l'email dell'autore
    "Il tuo post è stato correttamente pubblicato",
    htmlContent
  );
    res.status(201).json(newPost)
  } catch (err) {
    console.error("Errore nella Post", err);
    res.status(400).json({ message: err.message})
  }
})


// PUT /blogPosts/123: modifica il blog post con l'id associato
router.put("/:id", async (req, res) => {
  try {
    // Trova e aggiorna il blog post nel database
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Opzione per restituire il documento aggiornato
    );
    if (!updatedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia il blog post aggiornato come risposta JSON
    res.json(updatedBlogPost);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(400).json({ message: err.message });
  }
});

// DELETE /blogPosts/123: cancella il blog post con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    // Trova e elimina il blog post dal database
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }
    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: "Blog post eliminato" });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }

    // Cerca il blog post nel db
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// COMMENTI

// GET /blogPosts/:id/comments: ritorna tutti i commenti di uno specifico post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message: "Post non trovato"});
    }
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET /blogPosts/:id/comments/:commentId: ritorna un commento specifico di un post specifico
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message: "Post non trovato"});
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "Commento non trovato"});
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// POST /blogPosts/:id/comments: aggiungi un nuovo commento ad un post specifico
router.post("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message: "Post non trovato"});
    }
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      commentText: req.body.commentText
    };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// PUT /blogPosts/:id/comments/:commentId: cambia un commento di un post specifico
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message: "Post non trovato"});
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "Commento non trovato"});
    }
    comment.commentText = req.body.commentText;
    await post.save();
    res.json(comment);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// DELETE /blogPosts/:id/comments/:commentId: elimina un commento specifico da un post specifico
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({message: "Post non trovato"});
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({message: "Commento non trovato"});
    }
    comment.remove();
    await post.save();
    res.json({message: "Commento eliminato con successo"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

export default router;
