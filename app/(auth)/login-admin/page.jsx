"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginAdmin() {
  const router = useRouter();

  // Statik login va parol (buni o'zgartirib qo'yishingiz mumkin)
  const ADMIN_CREDENTIALS = {
    login: "admin",
    password: "123456",
    name: "Administrator",
  };

  // State
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");

  // Inputlarni yangilash
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login funksiyasi
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      form.login === ADMIN_CREDENTIALS.login &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      // 3 kun (72 soat) vaqt bilan cookie saqlash
      const expires = new Date();
      expires.setTime(expires.getTime() + 3 * 24 * 60 * 60 * 1000);
      Cookies.set("adminAuth", JSON.stringify(ADMIN_CREDENTIALS), {
        expires,
        path: "/",
      });

      // Admin dashboard'ga yo‘naltirish
      router.push("/admin");
    } else {
      setError("Login yoki parol noto‘g‘ri!");
    }
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
          >
            Кириш
          </button>
        </form>
      </div>
    </div>
  );
}
