// Importa il componente Link da react-router-dom per la navigazione
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-100 py-2.5">
      {/* Container per centrare e limitare la larghezza del contenuto */}
      <div className="container mx-auto p-5">
        {/* Link al brand/logo dell'app, che porta alla home page */}
        <Link to="/" className="text-2xl font-bold text-gray-800 no-underline">
          Blog App
        </Link>

        {/* Menu */}
        <ul className="list-none p-0 mt-5 flex">
          {/* Link alla home page */}
          <li className="mr-4">
            <Link to="/" className="text-gray-800 no-underline hover:underline">
              Home
            </Link>
          </li>

          {/* Link alla pagina di creazione del post */}
          <li className="mr-4">
            <Link to="/create" className="text-gray-800 no-underline hover:underline">
              Nuovo Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
