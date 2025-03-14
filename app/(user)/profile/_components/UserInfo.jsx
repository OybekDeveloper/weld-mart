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
    logout(); // `auth` state'ni va cookie'ni tozalash
    router.push("/"); // Bosh sahifaga yo‘naltirish
  };

  return (
    <section className="w-full space-y-3">
      <h1 className="textNormal5 font-medium">Аккаунт</h1>
      <div>
        <Label>Исм</Label>
        <Input readOnly value={auth?.name || ""} type="text" />
      </div>
      <div>
        <Label>Телефон рақами</Label>
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

      {/* Logout tugmasi */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <DialogTitle className="">
            <div className="bg-primary px-4 py-3 rounded-md textSmall3 hover:bg-primary text-white hover:opacity-75 duration-200">
              Аккаунтдан чиқиш
            </div>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">
              Ростдан ҳам чиқмоқчимисиз?
            </h2>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Йўқ
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Ҳа
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
