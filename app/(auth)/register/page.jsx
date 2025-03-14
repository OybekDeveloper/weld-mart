import { getData } from "@/actions/get";
import RegisterFormComponent from "./_components/registerForm";

export default async function Register() {
  const [statistics,brands] = await Promise.all([
    getData("/api/statistics", "statistics"),
    getData("/api/brands", "brand"),
  ]);
  const statis = [
    {
      title: "Продуктов",
      count: statistics?.products,
    },
    {
      title: "Партнёров",
      count: statistics?.partners,
    },
    {
      title: "Довольных клиентов",
      count: statistics?.clients,
    },
  ];
  return <RegisterFormComponent statis={statis} brands={brands}/>;
}
