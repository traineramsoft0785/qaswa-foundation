import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg">Qaswa Foundation</h3>
          <p className="text-sm text-gray-400 italic mt-1">
            التعليم للجميع (Education for All)
          </p>
          <p className="text-sm text-gray-400 mt-2">
            A charitable trust working to provide education, skills, and
            opportunities to underprivileged children.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <div className="space-y-1">
            <Link to="/about" className="block text-sm text-gray-400 hover:text-white">About Us</Link>
            <Link to="/programs" className="block text-sm text-gray-400 hover:text-white">Programs</Link>
            <Link to="/gallery" className="block text-sm text-gray-400 hover:text-white">Gallery</Link>
            <Link to="/contact" className="block text-sm text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Contact</h3>
          <p className="text-sm text-gray-400">Laxmipur, Raxaul</p>
          <p className="text-sm text-gray-400">theqaswafoundation@gmail.com</p>
          <p className="text-sm text-gray-400">+91 9876543210</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Qaswa Foundation. All rights reserved.
      </div>
    </footer>
  );
}
