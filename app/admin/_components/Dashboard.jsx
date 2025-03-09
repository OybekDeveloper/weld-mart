// src/pages/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "../layout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your statistical charts here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Sales Overview</h2>
          {/* Chart component */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">User Statistics</h2>
          {/* Chart component */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Order Trends</h2>
          {/* Chart component */}
        </div>
      </div>
    </AdminLayout>
  );
}