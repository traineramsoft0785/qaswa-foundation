export default function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="bg-blue-700 text-white text-center py-16">
        <h1 className="text-4xl font-bold">
          Qaswa Foundation
        </h1>
        <p className="mt-2 italic">
          التعليم للجميع (Education for All)
        </p>

        <p className="mt-4 max-w-xl mx-auto">
          A charitable trust in Laxmipur, Raxaul working to provide
          education, skills, and opportunities to underprivileged children.
        </p>

        <button className="mt-6 bg-white text-blue-700 px-6 py-2 rounded font-semibold">
          Donate Now
        </button>
      </section>

      {/* ABOUT SHORT */}
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold text-blue-700">Who We Are</h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          We believe education is the most powerful tool to transform lives.
          Our mission is to bring equal opportunities to every child.
        </p>
      </section>

      {/* PROGRAMS */}
      <section className="grid md:grid-cols-3 gap-6 p-6">
        <div className="shadow p-4 rounded bg-white">
          <h3 className="font-bold text-lg">📘 Free Education</h3>
          <p>Support and coaching for school students.</p>
        </div>

        <div className="shadow p-4 rounded bg-white">
          <h3 className="font-bold text-lg">🎓 Scholarships</h3>
          <p>Helping deserving students continue education.</p>
        </div>

        <div className="shadow p-4 rounded bg-white">
          <h3 className="font-bold text-lg">💻 Digital Skills</h3>
          <p>Preparing youth for modern careers.</p>
        </div>
      </section>

    </div>
  );
}