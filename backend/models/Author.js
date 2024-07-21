import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String },
  avatar: { type: String },
  password: { type: String },
  googleId: { type: String },
}, {
  timestamps: true,
  collection: "authors"
});

// Funzione che confronta la password con la password hashata
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

// Middleware per l'hashing della password prima del salvataggio nel DB
authorSchema.pre('save', async function(next) {
  
  
  // Eseguo l'hashing SOLO se l'utente ha cambiato la password o in fase di registrazione
  if (!this.isModified('password')) return next();

  try {
    // Genero un valore casuale con 10 round di hashing
    const salt = await bcrypt.genSalt(10);

    // Poi salvo
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error)
  }
})



export default mongoose.model("Author", authorSchema);
