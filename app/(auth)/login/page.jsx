import { getData } from "@/actions/get";
import LoginFormComponent from "./_components/loginFormComponent";

export default async function Login() {
  const [statistics, brands] = await Promise.all([
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
  return <LoginFormComponent statis={statis} brands={brands}/>;
}
