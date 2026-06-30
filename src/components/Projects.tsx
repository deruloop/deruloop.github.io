import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import packd from "@/assets/packd.png";

const voltaSdkImage =
  "https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=large%20single%20battery%20icon%20as%20the%20main%20protagonist%2C%20centered%20and%20dominant%2C%20flat%20modern%20illustration%2C%20no%20face%2C%20no%20character%2C%20no%20background%20scene%2C%20plain%20clean%20background%2C%20the%20inside%20of%20the%20battery%20is%20made%20of%20stacked%20different%20colored%20horizontal%20layers%2C%20each%20layer%20represents%20a%20battery%20tick%2C%20bright%20orange%2C%20amber%2C%20warm%20gold%2C%20soft%20brown%20and%20light%20gray%20palette%2C%20minimal%20shading%2C%20clean%20rounded%20shape%2C%20no%20extra%20objects%2C%20no%20text&image_size=square_hd";

type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  appStore?: string;
  website?: string;
  websiteLabel?: string;
  detailPage?: string;
};

const projects: Project[] = [
  {
    title: "Packd",
    description: "Trip organizer, packing list manager and more! With AI integration and VisionOS support.",
    image: packd,
    tags: ["SwiftUI", "CloudKit", "VisionOS"],
    appStore: "https://apps.apple.com/it/app/packd/id6593688485",
    detailPage: "/packd/",
  },
  {
    title: "VoltaSDK",
    description: "A Swift SDK that decides which AI model should answer each call, preferring on-device when possible and falling back with privacy-aware rules.",
    image: voltaSdkImage,
    tags: ["Swift", "AI", "SDK", "iOS"],
    website: "https://github.com/deruloop/VoltaSDK",
    websiteLabel: "GitHub Repo",
    detailPage: "https://github.com/deruloop/VoltaSDK",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="pt-2 pb-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-4xl font-bold">Personal Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of apps, tools, and developer products I&apos;ve built across Apple platforms.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group overflow-hidden hover:shadow-large transition-all duration-300 border-2 cursor-pointer"
              onClick={() => project.detailPage && window.open(project.detailPage, '_blank')}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:w-1/3 flex items-center justify-center">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-32 rounded-xl shadow-large group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="md:w-2/3 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} className="text-xs bg-accent text-accent-foreground border-transparent">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      )}
                      {project.appStore && (
                        <a
                          href={project.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                          App Store
                        </a>
                      )}
                      {project.website && (
                        <a
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {project.websiteLabel ?? "Website"}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
