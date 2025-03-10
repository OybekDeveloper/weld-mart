import { getData } from "@/actions/get";
import RegisterFormComponent from "./_components/registerForm";

export default async function Register() {
  const [statistics,brands] = await Promise.all([
    getData("/api/statistics", "statistics"),
    getData("/api/brands", "brand"),
  ]);
  const statis = [
    {
      title: "Махсулотлар",
      count: statistics?.products,
    },
    {
      title: "Хамкорлар",
      count: statistics?.partners,
    },
    {
      title: "Мамнун мижозлар",
      count: statistics?.clients,
    },
  ];
  return <RegisterFormComponent statis={statis} brands={brands}/>;
}
