export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">About Us</h1>

      <div className="mt-6 space-y-6 text-gray-600">
        <p className="text-lg">
          The Qaswa Foundation is a charitable trust based in Laxmipur, Raxaul,
          dedicated to transforming lives through education. We believe every
          child deserves access to quality education regardless of their
          socio-economic background.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Our Mission</h2>
          <p>
            To provide free and accessible education, skills training, and
            scholarship opportunities to underprivileged children and youth in
            our community, empowering them to build a better future.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Our Vision</h2>
          <p>
            A world where every child has the opportunity to learn, grow, and
            achieve their full potential — regardless of where they come from.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">What We Do</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Free coaching and tutoring for school students</li>
            <li>Scholarship support for deserving students</li>
            <li>Digital literacy and computer skills training</li>
            <li>Career guidance and mentorship programs</li>
            <li>Community awareness programs on education</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
