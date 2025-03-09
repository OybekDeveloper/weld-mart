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
          "pt-[128] font-montserrat justify-start gap-5 flex-col items-start w-11/12"
        }
      >
        <section className="lg:hidden w-full flex gap-3">
          <div className="w-full flex justify-center items-center">
            <Image
              src={"/logo.svg"}
              className="mx-auto"
              width={400}
              height={300}
              alt="logo"
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
        <h1 className="textNormal5 font-medium">Биз билан боғланинг.</h1>
        <section className="flex justify-center items-center">
          <div className="w-full space-y-4">
            <h1 className="textSmall4 font-medium">
              Саволларингиз борми йоки йордам керакми? Биз билан почта йоки
              телефон рақамимиз орқали боғланинг. Ёрдам беришга таййормиз.
            </h1>
            <h1 className="textNormall4 font-bold">
              Сизга ёрдам беришдан мамнунмиз!
            </h1>
            <div className="flex">
              <div className="w-full space-y-3">
                <h1 className="textSmall4 font-medium">Бош идора:</h1>
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
                    <p>Город Ташкент Яшнабадский р-н Улица Боткина 1-а</p>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-3">
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
                    <p>Город Ташкент Яшнабадский р-н Улица Боткина 1-а</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-lg:hidden w-full flex juctify-center items-center">
            <Image
              src={"/logo.svg"}
              className="mx-auto"
              width={400}
              height={300}
              alt="logo"
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191884.83987166354!2d69.1145573106644!3d41.282737946188796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2z0KLQvnNoa2VudCwgT8q7emJla2lzdG9u!5e0!3m2!1suz!2s!4v1740941171899!5m2!1suz!2s"
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
