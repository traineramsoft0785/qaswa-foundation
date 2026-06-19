import { useState } from "react";
import { uploadFile } from "../../api/upload";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function ImageUpload({ bucket, onUpload, currentUrl }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadFile(bucket, file);
      onUpload(res.data.url);
    } catch {
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <label className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded cursor-pointer text-sm font-medium hover:bg-white">
            {uploading ? "Uploading..." : "Change"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
          <HiOutlinePhotograph className="w-10 h-10 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
