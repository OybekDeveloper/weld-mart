import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeatureInfo({ productData }) {
  return (
    <Tabs defaultValue="info" className="w-11/12 mx-auto">
      <TabsList className="w-full">
        <TabsTrigger className="w-full textSmall3" value="info">
          Описание
        </TabsTrigger>
        <TabsTrigger className="w-full textSmall3" value="feature">
          Характеристики
        </TabsTrigger>
        <TabsTrigger className="w-full textSmall3" value="parametr">
          Гарантия
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <div dangerouslySetInnerHTML={{ __html: productData?.info || "Нет информации" }} />
      </TabsContent>
      
      <TabsContent value="feature">
        <div dangerouslySetInnerHTML={{ __html: productData?.feature || "Нет информации" }} />
      </TabsContent>
      
      <TabsContent value="parametr">
        {productData?.guarantee || "Нет информации"}
      </TabsContent>
    </Tabs>
  );
}
