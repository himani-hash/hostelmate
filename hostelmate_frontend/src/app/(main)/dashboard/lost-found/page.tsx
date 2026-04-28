"use client";
import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

type Item = {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  location: string;
  date_lost_found: string | null;
  status: string;
  photo_url: string | null;
};

type Pagination = {
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);


  const [filterType, setFilterType] = useState<string>("all");


  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost",
    category: "",
    location: "",
    hostel_id: "",
    date_lost_found: "",
  });

  const [image, setImage] = useState<File | null>(null);


  const fetchItems = async (page = 1, type = filterType) => {
    setLoading(true);

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/items?page=${page}&per_page=10`;

    if (type !== "all") {
      url += `&type=${type}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    setItems(data.items);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(1, filterType);
  }, [filterType]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setSubmitLoading(true);

  const data = new FormData();


  data.append("title", formData.title || "");
  data.append("type", formData.type || "lost");
  data.append("hostel_id", formData.hostel_id || "1");


  if (formData.description) data.append("description", formData.description);
  if (formData.category) data.append("category", formData.category);
  if (formData.location) data.append("location", formData.location);
  if (formData.date_lost_found)
    data.append("date_lost_found", formData.date_lost_found);

  if (image) data.append("image", image);


  for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/items`,
      {
        method: "POST",
        headers: {
       
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      }
    );

    const result = await res.json();
    console.log("SERVER RESPONSE ", result);

    if (res.ok) {
      alert("Item Added ");
      setShowModal(false);
      fetchItems(1, filterType);
    } else {
      alert(result.error || "Validation failed ");
    }
  } catch (err) {
    console.error("ERROR ", err);
    alert("Server error");
  }

  setSubmitLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
  
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Lost & Found
        </h1>

     
        <div className="flex gap-2">
          {["all", "lost", "found"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

   
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
      
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow"
              >
                {item.photo_url && (
                  <img
                    src={item.photo_url}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {item.description}
                  </p>

                  <p className="text-sm text-gray-500">
                     {item.location}
                  </p>

                  <p className="text-sm text-gray-500">
                    📅 {item.date_lost_found || "N/A"}
                  </p>

                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.status === "active"
                        ? "bg-green-100 text-green-600"
                        : item.status === "claimed"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

  
          {pagination && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={!pagination.has_prev}
                onClick={() =>
                  fetchItems(pagination.current_page - 1, filterType)
                }
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-gray-700 dark:text-white">
                Page {pagination.current_page} / {pagination.total_pages}
              </span>

              <button
                disabled={!pagination.has_next}
                onClick={() =>
                  fetchItems(pagination.current_page + 1, filterType)
                }
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

  
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
              Add Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

        
                    <input
                        name="title"
                        placeholder="Title"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        required
                    />

                
                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                    />

               
                    <select
                        name="type"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>

                
                    <select
                        name="category"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="clothes">Clothes</option>
                        <option value="accessories">Accessories</option>
                        <option value="other">Other</option>
                    </select>

              
                    <input
                        name="location"
                        placeholder="Location"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        required
                    />

          
                    <input
                        name="hostel_id"
                        type="number"
                        placeholder="Hostel ID"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        required
                    />

               
                    <input
                        type="date"
                        name="date_lost_found"
                        onChange={handleChange}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                    />

          
                    <input
                        type="file"
                        onChange={handleImage}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                    />

         
                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded flex justify-center items-center"
                    >
                        {submitLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                        "Submit"
                        
                        )}
                    </button>
                </form>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;