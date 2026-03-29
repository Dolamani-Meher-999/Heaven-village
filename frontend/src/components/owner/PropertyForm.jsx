import { useState } from "react";

const AMENITIES = [
  "WiFi",
  "AC",
  "Parking",
  "Gym",
  "Pool",
  "Furnished",
  "Pets Allowed",
];

const INITIAL = {
  title: "",
  description: "",
  price: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  "location[address]": "",
  "location[city]": "",
  "location[state]": "",
  "location[pincode]": "",
  amenities: [],
};

export default function PropertyForm({ onSuccess, editData = null }) {
  const [form, setForm] = useState(
    editData
      ? {
          title: editData.title,
          description: editData.description,
          price: editData.price,
          propertyType: editData.propertyType,
          bedrooms: editData.bedrooms,
          bathrooms: editData.bathrooms,
          area: editData.area,
          "location[address]": editData.location?.address,
          "location[city]": editData.location?.city,
          "location[state]": editData.location?.state,
          "location[pincode]": editData.location?.pincode,
          amenities: editData.amenities || [],
        }
      : INITIAL,
  );
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("hv_token");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setError("");
    if (
      !form.title ||
      !form.price ||
      !form.propertyType ||
      !form["location[city]"]
    ) {
      setError("Title, price, property type and city are required");
      return;
    }
    if (!editData && images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "amenities") {
          // Send as JSON string so backend can parse it reliably
          fd.append("amenities", JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      images.forEach((img) => fd.append("images", img));

      const url = editData
        ? `http://localhost:5000/api/properties/${editData._id}`
        : "http://localhost:5000/api/properties";
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
          {editData ? "Property Updated!" : "Property Submitted!"}
        </h3>
        <p className="font-body text-charcoal/50 mb-2">
          {editData
            ? "Your property has been updated and resubmitted for admin approval."
            : "Your property has been submitted for admin approval."}
        </p>
        <p className="font-body text-sm text-orange font-semibold mb-8">
          ⏳ You'll be notified once the admin reviews your listing.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm(INITIAL);
            setImages([]);
            setPreviews([]);
          }}
          className="orange-gradient px-8 py-3 rounded-xl font-body text-sm font-bold text-white shadow-orange"
        >
          {editData ? "Back" : "Add Another Property"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-display text-2xl font-bold text-charcoal">
          {editData ? "Edit Property" : "Add New Property"}
        </h2>
        <p className="font-body text-sm text-charcoal/45 mt-1">
          Fill in the details below. Your listing will be reviewed by admin
          before going live.
        </p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <h3 className="font-body text-xs font-bold text-charcoal/40 uppercase tracking-widest border-b border-gray-100 pb-2">
              Basic Details
            </h3>

            {/* Title */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                Property Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. 2BHK Furnished Apartment in Koramangala"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your property — highlights, nearby landmarks, furnishing details..."
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Price + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                  Monthly Rent (₹) *
                </label>
                <input
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  type="number"
                  placeholder="e.g. 15000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                  Property Type *
                </label>
                <select
                  value={form.propertyType}
                  onChange={(e) => set("propertyType", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="pg">PG / Hostel</option>
                </select>
              </div>
            </div>

            {/* Bedrooms + Bathrooms + Area */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "bedrooms", label: "Bedrooms", placeholder: "e.g. 2" },
                { key: "bathrooms", label: "Bathrooms", placeholder: "e.g. 1" },
                { key: "area", label: "Area (sq ft)", placeholder: "e.g. 950" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    type="number"
                    placeholder={placeholder}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2 block">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-200 ${
                      form.amenities.includes(a)
                        ? "orange-gradient text-white shadow-orange"
                        : "bg-gray-50 border border-gray-200 text-charcoal/55 hover:border-orange/30"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <h3 className="font-body text-xs font-bold text-charcoal/40 uppercase tracking-widest border-b border-gray-100 pb-2">
              Location & Images
            </h3>

            {/* Address */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                Street Address *
              </label>
              <input
                value={form["location[address]"]}
                onChange={(e) => set("location[address]", e.target.value)}
                placeholder="e.g. 12B, 5th Cross, Indiranagar"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                  City *
                </label>
                <input
                  value={form["location[city]"]}
                  onChange={(e) => set("location[city]", e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                  State
                </label>
                <input
                  value={form["location[state]"]}
                  onChange={(e) => set("location[state]", e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5 block">
                Pincode
              </label>
              <input
                value={form["location[pincode]"]}
                onChange={(e) => set("location[pincode]", e.target.value)}
                placeholder="e.g. 560038"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2 block">
                Property Images{" "}
                {editData ? "(optional — adds to existing)" : "*"}
              </label>

              {/* Upload area */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-orange/40 hover:bg-orange/2 transition-all duration-200">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="font-body text-sm font-semibold text-charcoal/50 mb-1">
                    Click to upload images
                  </p>
                  <p className="font-body text-xs text-charcoal/30">
                    JPG, PNG, WEBP • Max 5MB each • Up to 5 images
                  </p>
                </div>
              </label>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden aspect-square group"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-500 text-sm font-body">
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <p className="font-body text-xs text-charcoal/35">
            * Required fields. Your listing will be reviewed by admin before
            going live.
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="orange-gradient px-10 py-3.5 rounded-xl font-body text-sm font-bold text-white tracking-wide shadow-orange hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span> Uploading...
              </>
            ) : (
              <>{editData ? "✓ Update Property" : "🏠 Submit Property"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
