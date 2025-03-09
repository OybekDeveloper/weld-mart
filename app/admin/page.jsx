"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getData } from "@/actions/get";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAdminSocket } from "@/context/AdmnSocketContext";

export default function Dashboard() {
  const { newOrders } = useAdminSocket();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    dailyUsers: [],
    dailyOrders: [],
    monthlyUsers: [],
    monthlyOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const usersResponse = await getData("/api/users", "user");
        const ordersResponse = await getData("/api/orders", "order");

        // Process Users Data
        const users = usersResponse;
        const totalUsers = users.length;

        // Process Orders Data
        const orders = ordersResponse;
        const totalOrders = orders.length;

        // Helper function to group by date/month
        const groupByDate = (data, key) =>
          data.reduce((acc, item) => {
            const date = new Date(item.created_at);
            const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
            acc[dateKey] = (acc[dateKey] || 0) + 1;
            return acc;
          }, {});

        const groupByMonth = (data) =>
          data.reduce((acc, item) => {
            const date = new Date(item.created_at);
            const monthKey = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            }); // e.g., "Mar 2025"
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
          }, {});

        // Daily and Monthly Data
        const dailyUsersData = groupByDate(users);
        const dailyOrdersData = groupByDate(orders);
        const monthlyUsersData = groupByMonth(users);
        const monthlyOrdersData = groupByMonth(orders);

        // Convert to chart-friendly format
        const dailyUsers = Object.entries(dailyUsersData).map(
          ([date, count]) => ({
            date,
            count,
          })
        );
        const dailyOrders = Object.entries(dailyOrdersData).map(
          ([date, count]) => ({
            date,
            count,
          })
        );
        const monthlyUsers = Object.entries(monthlyUsersData).map(
          ([month, count]) => ({
            month,
            count,
          })
        );
        const monthlyOrders = Object.entries(monthlyOrdersData).map(
          ([month, count]) => ({
            month,
            count,
          })
        );

        // Sort by date/month
        dailyUsers.sort((a, b) => new Date(a.date) - new Date(b.date));
        dailyOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
        monthlyUsers.sort(
          (a, b) => new Date(a.month + " 1") - new Date(b.month + " 1")
        );
        monthlyOrders.sort(
          (a, b) => new Date(a.month + " 1") - new Date(b.month + " 1")
        );

        setStats({
          totalUsers,
          totalOrders,
          dailyUsers,
          dailyOrders,
          monthlyUsers,
          monthlyOrders,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [newOrders]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Бош мену</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Card - Emphasized */}
        <Card className="md:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">
              Барча буюртмалар
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-5xl font-bold text-gray-800 mb-4">
              {stats.totalOrders}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Кунлик буюртмалар" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">
              Барча фойдаланувчилар
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-4xl font-bold text-gray-800">
              {stats.totalUsers}
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  name="Кунлик фойдаланувчилар"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Growth Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">
              Кунлик ўсиш (буюртмалар)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#34d399"
                  name="Буюртмалар"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Growth Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Ойлик ўсиш</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" name="Буюртмалар" />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  name="Фойдаланувчилар"
                  data={stats.monthlyUsers}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
