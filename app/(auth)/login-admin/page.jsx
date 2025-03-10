"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getData } from "@/actions/get";

export default function LoginAdmin() {
  const router = useRouter();
  const [form, setForm] = useState({ login: "", password: "" });
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin ma'lumotlarini API'dan olish
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getData("/api/admin", "admin");
        setAdminData(response);
      } catch (err) {
        setError("Admin ma'lumotlarini yuklashda xatolik!");
      }
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Ma'lumotlar hali yuklanmagan bo'lsa, loginni rad etish
    if (!adminData) {
      setError("Ma'lumotlar hali yuklanmagan. Iltimos, biroz kuting.");
      return;
    }

    // Login va parolni tekshirish
    if (
      form.login === adminData.login &&
      form.password === adminData.password
    ) {
      // Tokenni cookie-ga yozish
      Cookies.set("adminAuth", JSON.stringify(adminData), {
        expires: 3, // 3 kun
        path: "/",
      });

      router.push("/admin");
    } else {
      setError("Login yoki parol noto‘g‘ri!");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Админ Логин</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Логин</label>
            <input
              type="text"
              name="login"
              value={form.login}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Парол</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary hover:opacity-75"
            disabled={loading}
          >
            {loading ? "Кириш..." : "Кириш"}
          </button>
        </form>
      </div>
    </div>
  );
}
