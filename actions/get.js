"use server";

import { backUrl } from "@/lib/utils";

export async function getData(endpoint, tag, revalidate) {
  const url = `${backUrl}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      next: { tags: [`${tag}`], revalidate: 86400 }, // 1 kun cache
      redirect: "follow",
    });

    if (!response.ok)
      throw new Error(`Error: ${response.status} - ${response.statusText}`);

    return await response?.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Xatolik bo'lsa, `null` qaytariladi
  }
}
