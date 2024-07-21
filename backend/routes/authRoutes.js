import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

// POST /login: restituirà un token di accesso
router.post("/login", async (req, res) => {
    try {
        // Prendo email e password dalla request
        const { email, password } = req.body;
        const author = await Author.findOne({ email });
        if (!author) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        const isMatch = await author.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali non valide" });
        }

        // Se tutto corrisponde genero il token JWT
        const token = await generateJWT({ id: author._id });
        res.json({ token, message: "Login effettuato con successo" })
    } catch (error) {
        console.error("Errore nel Login", error);
        res.status(500).json({ message: "Errore nel server" });
    }
});

// GET /me: restituisce l'autore collegato al token di accesso
// authMiddleware verifica il token e aggiunge i dati dell'autore a req.author
router.get("/me", authMiddleware, (req, res) => {
    // Converto il doc mongoose in oggetto js
    const authorData = req.author.toObject();
    // Cancello per sicurezza la password
    delete authorData.password;

    res.json(authorData);
})

// Rotta per iniziare il processo di autenticazione Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  // Questo endpoint inizia il flusso di autenticazione OAuth con Google
  // 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
  // scope: specifica le informazioni richiediamo a Google (profilo e email)
  
// Rotta di callback per l'autenticazione Google
router.get(
"/google/callback",
// Passport tenta di autenticare l'utente con le credenziali Google
passport.authenticate("google", { failureRedirect: "/login" }),
// Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login

async (req, res) => {
    try {
    // A questo punto, l'utente è autenticato con successo
    // req.user contiene i dati dell'utente forniti da Passport

    // Genera un JWT (JSON Web Token) per l'utente autenticato
    // Usiamo l'ID dell'utente dal database come payload del token
    const token = await generateJWT({ id: req.user._id });

    // Reindirizza l'utente al frontend, passando il token come parametro URL
    // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
    res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (error) {
    // Se c'è un errore nella generazione del token, lo logghiamo
    console.error("Errore nella generazione del token:", error);
    // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
    res.redirect("/login?error=auth_failed");
    }
}
);  

export default router;