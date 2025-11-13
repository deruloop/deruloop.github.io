import { Card, CardContent } from "@/components/ui/card";
import { Code2, Palette, Zap, Database, Smartphone, Cloud } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Swift & SwiftUI",
    description: "Expert in modern Swift development with SwiftUI for building reactive, declarative interfaces.",
  },
  {
    icon: Smartphone,
    title: "iOS Frameworks",
    description: "Proficient with UIKit, CoreData, Combine, and native iOS frameworks for rich app experiences.",
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Experience with Core Data, Realm, CloudKit, and backend integration for robust data handling.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Focused on app optimization, memory management, and delivering smooth 60fps experiences.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Strong eye for design, creating intuitive interfaces following Apple's Human Interface Guidelines.",
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description: "Integration with Firebase, REST APIs, GraphQL, and push notifications for connected apps.",
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive skill set for building production-ready iOS applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <Card 
              key={index}
              className="group hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardContent className="p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <skill.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-0.5">{skill.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
