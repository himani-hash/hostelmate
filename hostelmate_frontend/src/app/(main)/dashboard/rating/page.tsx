"use client";
import { useState } from "react";
import { Star } from "lucide-react";

type FormDataType = {
  mealType: string;
  rating: number;
  comment: string;
  photo: File | null;
};

export default function RatingPage() {
  const [formData, setFormData] = useState<FormDataType>({
    mealType: "",
    rating: 0,
    comment: "",
    photo: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;

    if (target.name === "photo" && target.files) {
      const file = target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [target.name]: target.value });
    }
  };

  const handleRating = (value: number) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.mealType || formData.rating === 0) {
      setMessage({ type: "error", text: "Please select meal type and rating." });
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("meal_type", formData.mealType);
    data.append("rating", formData.rating.toString());
    data.append("comment", formData.comment);
    if (formData.photo) data.append("photo", formData.photo);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: result.msg || "Failed to submit rating" });
      } else {
        setMessage({ type: "success", text: "Rating submitted successfully!" });
        setFormData({ mealType: "", rating: 0, comment: "", photo: null });
        setPreview(null);
      }
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-semibold mb-2">Mess Food Rating</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Share your feedback about today&apos;s meal to help improve the mess quality.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Submit Your Rating</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Meal Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"
              >
                <option value="">Select meal type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                placeholder="Share your thoughts about the meal..."
                className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Photo (optional)</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-md bg-background file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-md text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
                }`}
              >
                {loading ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          {preview ? (
            <img
              src={preview}
              alt="Meal preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-muted/40 rounded-lg text-sm text-muted-foreground">
              No image selected
            </div>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meal</span>
              <span className="font-medium capitalize">
                {formData.mealType || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">
                {formData.rating > 0 ? `${formData.rating} / 5` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
