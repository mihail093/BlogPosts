import { verifyJWT } from "../utils/jwt.js";
import Author from "../models/Author.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // Estrai il token dall'header Authorization
        // L'operatore ?. (optional chaining) previene errori se authorization è undefined
        // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send("Manca il token!");
        }

        // Verifico/decodifico il token usando una funzione dedicata (verifyJWT)
        const decoded = await verifyJWT(token);

        const author = await Author.findById(decoded.id).select('-password');
        if (!author) {
            return res.status(401).send("Autore non trovato del DB");
        }

        // Passo l'oggetto autore alla request
        req.author = author;
        // Passo al prossimo middleware (se c'è se no passa alle rotte)
        next();
    } catch (error) {
        res.status(401).send("Token non valido");
    }
}