import React from "react";
import { Button } from "@/components/ui/button";
import { BadgePercent, ArrowRight } from "lucide-react";

export default function TotalInfo() {
  return (
    <main className="w-[50%] h-full border p-5 rounded-md flex flex-col gap-4 bg-white">
      <h1 className="text-lg font-bold">Буюртмангиз</h1>

      {/* Order Summary */}
      <div className="flex flex-col gap-2 text-base">
        <div className="flex justify-between font-medium">
          <span>Жами</span>
          <span className="font-bold">22 000 000 сум</span>
        </div>
        <div className="flex justify-between text-red-500 font-medium">
          <span>Скидка (-10%)</span>
          <span>-2 200 000 сум</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Етакзиб бериш</span>
          <span>50 000 сум</span>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex justify-between font-bold text-lg">
        <span>Умуний</span>
        <span>19 850 000 сум</span>
      </div>

      {/* Promo Code Input */}
      <div className="flex w-full items-center gap-2">
        <div className="h-10 focus-within:ring-2 focus-within:ring-primary flex items-center border rounded-md px-3 py-2 flex-1 bg-gray-100">
          <BadgePercent className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Промокод"
            className="bg-transparent outline-none flex-1 ml-2"
          />
        </div>
        <Button className="h-10 bg-primary hover:bg-primary/80 text-white font-medium rounded-md px-4">
          Қўшиш
        </Button>
      </div>

      {/* Confirm Button */}
      <Button className="h-10 w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2">
        Буюртмангизни тасдиқлаш
        <ArrowRight size={18} />
      </Button>

      {/* ZoodPay Button */}
      <Button className="h-10 w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-md">
        Оркали <span className="ml-2 font-bold">ZOODPAY</span>
      </Button>
    </main>
  );
}
