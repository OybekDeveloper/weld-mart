import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeatureInfo({ productData }) {
  return (
    <Tabs defaultValue="info" className="w-11/12 mx-auto">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="info">
          Тавсиф
        </TabsTrigger>
        <TabsTrigger className="w-full" value="feature">
          Хусусиятлари
        </TabsTrigger>
        <TabsTrigger className="w-full" value="parametr">
          Гарантия
        </TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        Make changes to your info here.
      </TabsContent>
      <TabsContent value="feature">
        Make changes to your feature here.
      </TabsContent>
      <TabsContent value="parametr">
        Make changes to your parametr here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}
