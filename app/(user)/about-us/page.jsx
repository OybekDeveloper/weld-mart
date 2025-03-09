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
        "pt-[128] font-montserrat justify-start gap-5 flex-col items-start w-11/12"
      }
    >
      <BreadcrumbComponent />
      <h1 className="textNormal5 font-medium">Биз хақимизда</h1>
      <CompanyInfo statistics={statistics} />
      <MissionStatement />
      <AchievementsSection achievements={achievements} />
    </Container>
  );
}