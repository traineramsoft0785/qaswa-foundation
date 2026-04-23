import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <h1 className="font-bold text-xl text-blue-700">Qaswa Foundation</h1>
        <p className="text-xs text-gray-500 italic">
          التعليم للجميع
        </p>
      </div>

      <div className="space-x-6 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/programs" className="hover:text-blue-600">Programs</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
      </div>
    </nav>
  );
}