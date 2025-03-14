import BreadcrumbComponent from "@/components/shared/BreadcrumbComponent";
import Container from "@/components/shared/container";
import { socialMedias } from "@/lib/utils";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Contact() {
  return (
    <>
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
              name: "Контакты",
              href: "/contact",
            },
          ]}
        />
        <section className="lg:hidden w-full flex gap-3">
          <div className="w-full flex justify-center items-center">
            <Image
              src={"/logo.svg"}
              className="mx-auto"
              width={400}
              height={300}
              alt="логотип"
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            {socialMedias?.map((social, idx) => {
              return (
                <Link key={idx} target="_blank" href={social.url} className="">
                  <Image
                    width={100}
                    height={100}
                    src={social.icon}
                    alt={social.name}
                    className="w-8 h-8"
                  />
                </Link>
              );
            })}
          </div>
        </section>
        <h1 className="textNormal5 font-medium">Свяжитесь с нами.</h1>
        <section className="flex justify-center items-center">
          <div className="w-full space-y-4">
            <h1 className="textSmall4 font-medium">
              У вас есть вопросы или нужна помощь? Свяжитесь с нами по почте или
              телефону. Мы готовы помочь.
            </h1>
            <h1 className="textNormall4 font-bold">Мы рады вам помочь!</h1>
            <div className="flex">
              <div className="w-full space-y-3">
                <h1 className="textSmall4 font-medium">Головной офис:</h1>
                <div className="flex flex-col gap-2 textSmall3">
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <Phone />
                    </div>
                    <a href="tel:+998954189999" target="_blank">
                      <p>+998954189999</p>
                    </a>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <Mail />
                    </div>
                    <p>weldmartuz@gmail.com</p>
                  </div>
                  <Link
                    target="_blank"
                    href="https://www.google.com/maps?q=41.36173881280273,69.24032755414049"
                    className="flex justify-start items-center gap-2 cursor-pointer"
                  >
                    <div>
                      <MapPin />
                    </div>
                    <p>
                      ГОРОД ТАШКЕНТ, АЛМАЗАРСКИЙ РАЙОН, GULSAROY MFY, OLTINSOY
                      KO'CHASI, 7-AUY
                    </p>
                  </Link>
                </div>
              </div>
              {/* <div className="w-full space-y-3">
                <h1 className="textSmall4 font-medium">Филиал:</h1>
                <div className="flex flex-col gap-2 textSmall3">
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <Phone />
                    </div>
                    <a href="tel:+998954189999" target="_blank">
                      <p>+998954189999</p>
                    </a>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <Mail />
                    </div>
                    <p>weldmartuz@gmail.com</p>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <MapPin />
                    </div>
                    <p>Город Ташкент, Яшнабадский район, улица Боткина 1-а</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="max-lg:hidden w-full flex juctify-center items-center">
            <Image
              src={"/logo.svg"}
              className="mx-auto"
              width={400}
              height={300}
              alt="логотип"
            />
          </div>
        </section>
        <div className="max-lg:hidden flex justify-between items-center gap-5">
          {socialMedias?.map((social, idx) => {
            return (
              <Link key={idx} target="_blank" href={social.url} className="">
                <Image
                  width={100}
                  height={100}
                  src={social.icon}
                  alt={social.name}
                  className="w-8 h-8"
                />
              </Link>
            );
          })}
        </div>
      </Container>

      <div className="w-[90vw] mx-auto h-[300] sm:h-[400px] mt-5 rounded-xl overflow-hidden border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d748.6420752364812!2d69.24032755414049!3d41.36173881280273!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDIxJzQxLjciTiA2OcKwMTQnMjUuMyJF!5e0!3m2!1sru!2s!4v1741970544347!5m2!1sru!2s"
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}
