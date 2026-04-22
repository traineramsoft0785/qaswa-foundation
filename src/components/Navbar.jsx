import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="font-bold text-xl">Qaswa Foundation</h1>
        <p className="text-xs italic text-yellow-200">
          التعليم للجميع (Education for All)
        </p>
      </div>

      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}
