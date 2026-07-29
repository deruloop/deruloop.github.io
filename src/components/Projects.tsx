import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Clock } from "lucide-react";
import packd from "@/assets/packd.png";
import exoreaderIcon from "@/assets/exoreader-icon.png";
import voltaSdkImage from "@/assets/voltasdk-icon.svg";
import ravioloIcon from "@/assets/raviolo-icon.png";
import konuqIcon from "@/assets/konuq-icon.png";

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
  comingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "Packd",
    description: "Trip organizer, packing list manager and more! With AI integration and VisionOS support.",
    image: packd,
    tags: ["SwiftUI", "CloudKit", "VisionOS", "AI"],
    appStore: "https://apps.apple.com/it/app/packd/id6593688485",
    detailPage: "/packd/",
  },
  {
    title: "Exoreader",
    description: "A calm, chronological reader for Bluesky. No algorithm. No noise. Just the posts, in order.",
    image: exoreaderIcon,
    tags: ["SwiftUI", "iOS", "macOS", "Android", "Kotlin"],
    detailPage: "/exoreader/",
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
  {
    title: "Raviolo",
    description: "An AI-first meal companion. Smart shopping lists by aisle, a home for every recipe, and instant dish ideas when the fridge feels uninspired.",
    image: ravioloIcon,
    tags: ["SwiftUI", "iOS", "AI", "KMP", "Swift", "Android", "Kotlin"],
    detailPage: "/raviolo/",
    comingSoon: true,
  },
  {
    title: "Konuq",
    description: "A note-taking app that lets you publish custom hubs of notes to the web. Organize your thinking, then share it as your own space.",
    image: konuqIcon,
    tags: ["SwiftUI", "iOS", "AI", "KMP", "Swift", "Android", "Kotlin"],
    comingSoon: true,
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
          {projects.map((project, index) => {
            const clickable = !project.comingSoon && !!project.detailPage;
            return (
            <Card
              key={index}
              className={
                "group overflow-hidden transition-all duration-300 border-2 " +
                (clickable ? "hover:shadow-large cursor-pointer" : "cursor-default")
              }
              onClick={clickable ? () => window.open(project.detailPage, '_blank') : undefined}
              aria-disabled={project.comingSoon || undefined}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:w-1/3 flex items-center justify-center">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={
                      "w-32 rounded-xl shadow-large transition-transform duration-500 " +
                      (clickable ? "group-hover:scale-105" : "")
                    }
                  />
                </div>

                <div className="md:w-2/3 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      {project.comingSoon && (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          Coming soon
                        </span>
                      )}
                    </div>
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
                      {project.comingSoon && (
                        <span className="flex items-center gap-2 text-sm text-muted-foreground/60 cursor-not-allowed select-none">
                          <Clock className="h-4 w-4" />
                          In development
                        </span>
                      )}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
