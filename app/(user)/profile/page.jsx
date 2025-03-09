import Container from "@/components/shared/container";
import UserInfo from "./_components/UserInfo";
import OrderInfo from "./_components/OrderInfo";
import { cookies } from "next/headers";
import { getData } from "@/actions/get";

export default async function Profile() {
  const authCookie = cookies().get("auth"); // "auth" cookie ni olish
  const auth = authCookie ? JSON.parse(authCookie.value) : null;
  const [userData] = await Promise.all([
    getData(`/api/users/${auth?.id}`, "user"),
  ]);
  console.log(userData);

  return (
    <Container className="font-montserrat gap-10 justify-start max-md:flex-col items-start pt-[120px] w-11/12 lg:w-10/12 xl:w-8/12 mx-auto mb-10">
      <UserInfo userData={userData} />
      <OrderInfo userData={userData} />
    </Container>
  );
}
