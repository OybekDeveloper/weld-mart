// src/pages/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "../layout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Добавьте ваши статистические графики здесь */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Обзор продаж</h2>
          {/* Компонент графика */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Статистика пользователей</h2>
          {/* Компонент графика */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Тенденции заказов</h2>
          {/* Компонент графика */}
        </div>
      </div>
    </AdminLayout>
  );
}