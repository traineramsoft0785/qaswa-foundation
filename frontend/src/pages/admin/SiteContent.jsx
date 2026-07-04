import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getPageContent, updateSectionContent } from "../../api/siteContent";
import FormModal from "../../components/admin/FormModal";
import ImageUpload from "../../components/admin/ImageUpload";

const SECTIONS = {
  home: [
    {
      key: "hero",
      label: "Hero",
      fields: [
        { name: "heading", label: "Heading", type: "text" },
        { name: "tagline", label: "Tagline", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea" },
        { name: "primary_button_label", label: "Primary Button Label", type: "text" },
        { name: "secondary_button_label", label: "Secondary Button Label", type: "text" },
      ],
    },
    {
      key: "who_we_are",
      label: "Who We Are",
      fields: [
        { name: "heading", label: "Heading", type: "text" },
        { name: "body", label: "Body", type: "textarea" },
      ],
    },
  ],
  about: [
    {
      key: "intro",
      label: "Intro",
      fields: [{ name: "body", label: "Body", type: "textarea" }],
    },
    {
      key: "mission",
      label: "Our Mission",
      fields: [
        { name: "heading", label: "Heading", type: "text" },
        { name: "body", label: "Body", type: "textarea" },
      ],
    },
    {
      key: "vision",
      label: "Our Vision",
      fields: [
        { name: "heading", label: "Heading", type: "text" },
        { name: "body", label: "Body", type: "textarea" },
      ],
    },
    {
      key: "what_we_do",
      label: "What We Do",
      fields: [
        { name: "heading", label: "Heading", type: "text" },
        { name: "items", label: "Bullet Points", type: "list" },
      ],
    },
  ],
  global: [
    {
      key: "footer_branding",
      label: "Footer Branding",
      fields: [
        { name: "logo_url", label: "Logo", type: "image" },
        { name: "heading", label: "Heading", type: "text" },
        { name: "tagline", label: "Tagline", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      key: "contact_info",
      label: "Contact Info",
      fields: [
        { name: "address", label: "Address", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Phone", type: "text" },
      ],
    },
  ],
};

const PAGES = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "global", label: "Footer & Contact" },
];

export default function AdminSiteContent() {
  const [page, setPage] = useState("home");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = (p) => {
    setLoading(true);
    getPageContent(p)
      .then((res) => {
        const bySection = {};
        res.data.forEach((row) => {
          bySection[row.section_key] = row.data;
        });
        setContent(bySection);
      })
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
  }, [page]);

  const openEdit = (section) => {
    const data = content[section.key] || {};
    const initial = {};
    section.fields.forEach((f) => {
      initial[f.name] = f.type === "list" ? data[f.name] || [] : data[f.name] || "";
    });
    setForm(initial);
    setEditing(section);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSectionContent(page, editing.key, form);
      toast.success("Section updated");
      setEditing(null);
      load(page);
    } catch {
      toast.error("Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const updateListItem = (index, value) => {
    const items = [...form.items];
    items[index] = value;
    setForm({ ...form, items });
  };

  const removeListItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const addListItem = () => {
    setForm({ ...form, items: [...(form.items || []), ""] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Website Content</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPage(p.key)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              page === p.key
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {SECTIONS[page].map((section) => (
            <div key={section.key} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">{section.label}</h3>
                <button
                  onClick={() => openEdit(section)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                {section.fields.map((f) => {
                  const value = (content[section.key] || {})[f.name];
                  return (
                    <p key={f.name} className="line-clamp-2">
                      <span className="font-medium text-gray-600">{f.label}: </span>
                      {f.type === "list"
                        ? (value || []).join(", ")
                        : value || <span className="italic">(empty)</span>}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <FormModal title={`Edit ${editing.label}`} onClose={() => setEditing(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            {editing.fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label}
                </label>
                {f.type === "image" && (
                  <ImageUpload
                    bucket="gallery-images"
                    currentUrl={form[f.name]}
                    onUpload={(url) => setForm({ ...form, [f.name]: url })}
                  />
                )}
                {f.type === "textarea" && (
                  <textarea
                    value={form[f.name] || ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    rows={4}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {f.type === "text" && (
                  <input
                    type="text"
                    value={form[f.name] || ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {f.type === "list" && (
                  <div className="space-y-2">
                    {(form[f.name] || []).map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListItem(i, e.target.value)}
                          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(i)}
                          className="px-3 text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addListItem}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      + Add item
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </div>
  );
}
