import { Building2, Smartphone, Globe, Zap, Cloud, Code } from "lucide-react";

const clients = [
  { name: "TechCorp", icon: Building2, url: "https://techcorp.com" },
  { name: "AppStudio", icon: Smartphone, url: "https://appstudio.com" },
  { name: "GlobalNet", icon: Globe, url: "https://globalnet.com" },
  { name: "FastTech", icon: Zap, url: "https://fasttech.com" },
  { name: "CloudSys", icon: Cloud, url: "https://cloudsys.com" },
  { name: "DevHub", icon: Code, url: "https://devhub.com" },
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
                <client.icon className="h-16 w-16 text-primary" />
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
                <client.icon className="h-16 w-16 text-primary" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
