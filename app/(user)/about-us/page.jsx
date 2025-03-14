// pages/aboutus.jsx
import { getData } from "@/actions/get";
import BreadcrumbComponent from "@/components/shared/BreadcrumbComponent";
import Container from "@/components/shared/container";
import CompanyInfo from "./_components/CompanyInfo";
import MissionStatement from "./_components/MissionStatement";
import AchievementsSection from "./_components/AchievementsSection";

export default async function Aboutus() {
  const [achievements, statistics] = await Promise.all([
    getData(`/api/achievements`, "achievement"),
    getData("/api/statistics", "statistics"),
  ]);

  return (
    <Container
      className={
        "font-montserrat justify-start gap-5 flex-col items-start w-11/12"
      }
    >
      <BreadcrumbComponent
        data={[
          {
            href: "/",
            name: "Главная страница",
          },
          {
            name: "О нас",
            href: "/about-us",
          },
        ]}
      />
      <h1 className="textNormal5 font-medium">О нас</h1>
      <CompanyInfo statistics={statistics} />
      <MissionStatement />
      <AchievementsSection achievements={achievements} />
    </Container>
  );
}
