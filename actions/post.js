"use server";

import { backUrl } from "@/lib/utils";

export async function postData(data, endpoint, tag) {
  const url = `${backUrl}${endpoint}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });
    const result = await response.json();
    console.log(result);

    if (result.error) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return error; // Xatolik bo'lsa, `null` qaytariladi
  }
}
