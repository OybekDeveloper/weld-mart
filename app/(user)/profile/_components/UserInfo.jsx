"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

export default function UserInfo() {
  const { auth, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Очистка состояния `auth` и cookies
    router.push("/"); // Перенаправление на главную страницу
  };

  return (
    <section className="w-full space-y-3">
      <h1 className="textNormal5 font-medium">Аккаунт</h1>
      <div>
        <Label>Имя</Label>
        <Input readOnly value={auth?.name || ""} type="text" />
      </div>
      <div>
        <Label>Номер телефона</Label>
        <Input readOnly value={auth?.phone || ""} type="text" />
      </div>
      <div>
        <Label>Бонус</Label>
        <Input
          readOnly
          value={`${auth?.bonus?.toLocaleString() || 0} сум`}
          type="text"
        />
      </div>

      {/* Кнопка выхода */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <DialogTitle className="">
            <div className="bg-primary px-4 py-3 rounded-md textSmall3 hover:bg-primary text-white hover:opacity-75 duration-200">
              Выйти из аккаунта
            </div>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">
              Вы действительно хотите выйти?
            </h2>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Нет
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Да
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}