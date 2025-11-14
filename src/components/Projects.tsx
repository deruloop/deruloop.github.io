import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import packd from "@/assets/packd.png";
import appWeather from "@/assets/app-weather.png";
import appTasks from "@/assets/app-tasks.png";

const projects = [
  {
    title: "Packd",
    description: "Trip organizer, packing list manager and more! With AI integration and VisionOS support.",
    image: packd,
    tags: ["SwiftUI", "CloudKit", "VisionOS"],
    github: "https://github.com",
    appStore: "https://apps.apple.com/it/app/packd/id6593688485",
    detailPage: "/packd/",
  },
  // {
  //   title: "Nuance Audio",
  //   description: "Beautiful weather app with detailed forecasts, interactive maps, and customizable widgets.",
  //   image: packd,
  //   tags: ["Swift", "WeatherKit", "Widgets"],
  //   appStore: "https://apps.apple.com/app/id6477399465",
  // },
  // {
  //   title: "TaskFlow",
  //   description: "Intuitive task management app with smart organization, reminders, and collaboration features.",
  //   image: packd,
  //   tags: ["SwiftUI", "CloudKit", "Combine"],
  //   github: "https://github.com",
  //   appStore: "https://apps.apple.com",
  // },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-4xl font-bold">Personal Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of iOS applications I've built, available on App Store.
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
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
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
