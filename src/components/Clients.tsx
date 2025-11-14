import nuance from "@/assets/nuance.png";
import intesa from "@/assets/intesa.svg";
import reply from "@/assets/reply.png";
import opentech from "@/assets/opentech.svg";
import spindox from "@/assets/spindox.png";
import isybank from "@/assets/isybank.svg";
import telepass from "@/assets/telepass.png";
import piksel from "@/assets/piksel.png";
import { Building2, Smartphone, Globe, Zap, Cloud, Code } from "lucide-react";

type Client = {
  name: string;
  logo: string; // URL importato (png, svg, ecc.)
  url: string;
  height: number;
  width: number;
};

const clients: Client[] = [
  { name: "NuanceAudio", logo: nuance, url: "https://www.nuanceaudio.com/it-it" , height: 12, width: 80},
  { name: "IntesaSanpaolo", logo: intesa, url: "https://www.intesasanpaolo.com", height: 8, width: 100},
  { name: "Reply", logo: reply, url: "https://www.reply.com/it", height: 12, width: 60},
  { name: "Opentech", logo: opentech, url: "https://opentech.com", height: 12, width: 80},
  { name: "Spindox", logo: spindox, url: "https://makeamark.spindox.it", height: 12, width: 80},
  { name: "Isybank", logo: isybank, url: "https://www.isybank.com/it/", height: 8, width: 60},
  { name: "Telepass", logo: telepass, url: "https://www.telepass.com/it", height: 8, width: 60},
  { name: "Piksel", logo: piksel, url: "https://piksel.com", height: 8, width: 60},
];

const Clients = () => {
  return (
    <section className="py-16 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Trusted by Companies</h2>
          <p className="text-muted-foreground mt-2">
            Working with leading organizations worldwide
          </p>
        </div>

        <div className="relative">
          <div className="flex animate-scroll-horizontal hover:pause">
            {/* First set of logos */}
            {clients.map((client, index) => (
              <a
                key={`first-${index}`}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 mx-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`h-${client.height} w-${client.width} object-contain`}
                />
              </a>
            ))}
            {/* Duplicate for infinite scroll */}
            {clients.map((client, index) => (
              <a
                key={`second-${index}`}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 mx-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`h-${client.height} w-${client.width} object-contain`}
                />
              </a>
            ))}
            {/* Duplicate for infinite scroll */}
            {clients.map((client, index) => (
              <a
                key={`third-${index}`}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 mx-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`h-${client.height} w-${client.width} object-contain`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
