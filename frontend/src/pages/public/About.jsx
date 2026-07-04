import { useState, useEffect } from "react";
import { getPageContent } from "../../api/siteContent";

const FALLBACK = {
  intro: {
    body: "The Qaswa Foundation is a charitable trust based in Laxmipur, Raxaul, dedicated to transforming lives through education. We believe every child deserves access to quality education regardless of their socio-economic background.",
  },
  mission: {
    heading: "Our Mission",
    body: "To provide free and accessible education, skills training, and scholarship opportunities to underprivileged children and youth in our community, empowering them to build a better future.",
  },
  vision: {
    heading: "Our Vision",
    body: "A world where every child has the opportunity to learn, grow, and achieve their full potential — regardless of where they come from.",
  },
  what_we_do: {
    heading: "What We Do",
    items: [
      "Free coaching and tutoring for school students",
      "Scholarship support for deserving students",
      "Digital literacy and computer skills training",
      "Career guidance and mentorship programs",
      "Community awareness programs on education",
    ],
  },
};

export default function About() {
  const [content, setContent] = useState(FALLBACK);

  useEffect(() => {
    getPageContent("about")
      .then((res) => {
        const bySection = {};
        res.data.forEach((row) => {
          bySection[row.section_key] = row.data;
        });
        setContent((prev) => ({ ...prev, ...bySection }));
      })
      .catch(() => {});
  }, []);

  const { intro, mission, vision, what_we_do } = content;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700">About Us</h1>

      <div className="mt-6 space-y-6 text-gray-600">
        <p className="text-lg">{intro.body}</p>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-3">{mission.heading}</h2>
          <p>{mission.body}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-3">{vision.heading}</h2>
          <p>{vision.body}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">{what_we_do.heading}</h2>
          <ul className="list-disc list-inside space-y-2">
            {what_we_do.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
