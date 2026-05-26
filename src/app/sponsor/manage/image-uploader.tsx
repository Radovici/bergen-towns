"use client";

import { useState, useRef } from "react";

export default function ImageUploader({
  token,
  currentLogo,
  currentBanner,
}: {
  token: string;
  currentLogo?: string;
  currentBanner?: string;
}) {
  const [logo, setLogo] = useState(currentLogo);
  const [banner, setBanner] = useState(currentBanner);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const upload = async (type: "logo" | "banner", file: File) => {
    setUploading(type);
    setError(null);

    const form = new FormData();
    form.append("token", token);
    form.append("type", type);
    form.append("file", file);

    try {
      const res = await fetch("/api/sponsor/upload-media", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      if (type === "logo") setLogo(data.url);
      else setBanner(data.url);
    } catch {
      setError("Network error.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo (max 512KB, square recommended)
        </label>
        <div className="flex items-center gap-4">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
          )}
          <input
            ref={logoRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload("logo", f);
            }}
          />
          <button
            type="button"
            onClick={() => logoRef.current?.click()}
            disabled={uploading === "logo"}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading === "logo" ? "Uploading..." : logo ? "Change Logo" : "Upload Logo"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner (max 1MB, 16:9 recommended)
        </label>
        <div className="space-y-2">
          {banner && (
            <img
              src={banner}
              alt="Banner"
              className="w-full max-w-md h-32 rounded-lg object-cover border border-gray-200"
            />
          )}
          <input
            ref={bannerRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload("banner", f);
            }}
          />
          <button
            type="button"
            onClick={() => bannerRef.current?.click()}
            disabled={uploading === "banner"}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading === "banner" ? "Uploading..." : banner ? "Change Banner" : "Upload Banner"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
