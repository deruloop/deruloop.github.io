import { Card, CardContent } from "@/components/ui/card";
import aboutPhoto from "@/assets/about-photo.png.asset.json";

const About = () => {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
            <p className="text-xl text-muted-foreground">
              Passionate about creating exceptional mobile experiences
            </p>
          </div>

          <Card className="border-2 overflow-hidden">
            <CardContent className="p-0">
              {/* Horizontal photo banner — landscape orientation used full width */}
              <div className="relative w-full aspect-[16/9] md:aspect-[16/7] overflow-hidden bg-muted">
                <img
                  src={aboutPhoto.url}
                  alt="Cristiano Calicchia"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="p-8 md:p-12 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">
                    Cristiano Calicchia
                  </h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    iOS Developer — Based in Italy
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground">
                  I'm an iOS developer with a passion for creating beautiful, intuitive applications
                  that users love. With expertise in Swift and SwiftUI, I focus on building apps that
                  combine elegant design with robust functionality.
                </p>

                <p className="text-lg leading-relaxed text-foreground">
                  My approach to development emphasizes clean code, thoughtful architecture, and
                  attention to detail. I believe the best apps are those that feel natural to use
                  and solve real problems for their users.
                </p>

                <p className="text-lg leading-relaxed text-foreground">
                  When I'm not coding, you'll find me exploring the latest iOS features, contributing
                  to open source projects, or sharing knowledge with the developer community.
                </p>
              </div>

              {/* Experience Highlights — full width */}
              <div className="p-8 md:p-12 pt-0 border-t border-border">
                <h3 className="text-xl font-semibold mb-4 mt-6">Experience Highlights</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">▹</span>
                    <span>5+ years of professional iOS development experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">▹</span>
                    <span>Worked with 10+ companies with app in production on the App Store</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">▹</span>
                    <span>Strong focus on performance optimization and user experience</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
