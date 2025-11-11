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
  {
    title: "Sky Weather",
    description: "Beautiful weather app with detailed forecasts, interactive maps, and customizable widgets.",
    image: packd,
    tags: ["Swift", "WeatherKit", "Widgets"],
    github: "https://github.com",
    appStore: "https://apps.apple.com",
  },
  {
    title: "TaskFlow",
    description: "Intuitive task management app with smart organization, reminders, and collaboration features.",
    image: packd,
    tags: ["SwiftUI", "CloudKit", "Combine"],
    github: "https://github.com",
    appStore: "https://apps.apple.com",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of iOS applications I've built, showcasing clean design and robust functionality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className="group overflow-hidden hover:shadow-large transition-all duration-300 border-2 cursor-pointer"
              onClick={() => project.detailPage && window.open(project.detailPage, '_blank')}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-48 mx-auto rounded-2xl shadow-large group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                  <a
                    href={project.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    App Store
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
