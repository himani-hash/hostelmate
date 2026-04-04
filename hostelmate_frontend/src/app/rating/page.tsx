"use client";
import { useState } from "react";

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

  const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();
  const data = new FormData();

  data.append("meal_type", formData.mealType);
  data.append("rating", formData.rating.toString());
  data.append("comment", formData.comment);

  if (formData.photo) {
    data.append("photo", formData.photo);
  }

  const token = localStorage.getItem("token");

const res = await fetch("http://127.0.0.1:5000/api/submit", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
    },
    body: data,
});

  const result = await res.json();
  console.log(result);
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      
      <div className="w-full max-w-xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl p-6">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
           Mess Food Rating
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Meal Type */}
          <select
            name="mealType"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select Meal Type</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>

          {/*  Star Rating */}
          <div className="flex gap-2 justify-center text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                className={`cursor-pointer transition ${
                  star <= formData.rating
                    ? "text-yellow-400 scale-110"
                    : "text-gray-400"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Comment */}
          <textarea
            name="comment"
            placeholder="Your feedback..."
            onChange={handleChange}
            className="p-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />

          {/* Photo Upload */}
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="p-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 text-white p-2 rounded-lg transition-all duration-200 shadow-lg"
          >
            Submit Rating 
          </button>

        </form>
      </div>
    </div>
  );
}