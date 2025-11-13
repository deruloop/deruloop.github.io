import { Building2, Smartphone, Globe, Zap, Cloud, Code } from "lucide-react";

const clients = [
  { name: "TechCorp", icon: Building2 },
  { name: "AppStudio", icon: Smartphone },
  { name: "GlobalNet", icon: Globe },
  { name: "FastTech", icon: Zap },
  { name: "CloudSys", icon: Cloud },
  { name: "DevHub", icon: Code },
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
              <div
                key={`first-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <client.icon className="h-12 w-12 text-primary" />
                  <span className="text-sm font-medium">{client.name}</span>
                </div>
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {clients.map((client, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <client.icon className="h-12 w-12 text-primary" />
                  <span className="text-sm font-medium">{client.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
