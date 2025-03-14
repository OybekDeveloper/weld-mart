"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getData } from "@/actions/get";
import { putData } from "@/actions/put";

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    name: "",
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setIsLoading(true);
        const data = await getData("/api/admin", "admin");
        if (data) {
          setAdmin({
            name: data.name || "",
            login: data.login || "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast.error("Ошибка при загрузке данных администратора.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await putData(admin, "/api/admin", "admin");
      toast.success("Данные администратора обновлены");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update admin data:", error);
      toast.error("Ошибка при сохранении данных.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">Администратор</CardTitle>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={isSubmitting}>
            {isEditing ? "Отменить" : "Редактировать"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" value={admin.name} onChange={handleInputChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input id="login" name="login" value={admin.login} onChange={handleInputChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Новый пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={admin.password}
                    onChange={handleInputChange}
                    placeholder="Введите новый пароль"
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="w-full hover:bg-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                  Отменить
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-lg font-semibold text-gray-700">Имя</span>
                <span className="text-xl font-bold">{admin.name}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-lg font-semibold text-gray-700">Логин</span>
                <span className="text-xl font-bold">{admin.login}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}