import { getData } from "@/actions/get";
import LoginFormComponent from "./_components/loginFormComponent";

export default async function Login() {
  const [statistics] = await Promise.all([
    getData("/api/statistics", "statistics"),
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
  return <LoginFormComponent statis={statis} />;
}
