import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Github, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Let's Connect</h2>
            <p className="text-xl text-muted-foreground">
              Have a project in mind? Let's discuss how we can work together.
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <a
                  href="mailto:cristiano@calicchia.dev"
                  className="group"
                >
                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-all duration-300 hover:shadow-medium">
                    <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold mb-1">Email</p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      cristiano@calicchia.dev
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/cristiano-calicchia-240253167"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-all duration-300 hover:shadow-medium">
                    <Linkedin className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold mb-1">LinkedIn</p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Connect with me
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/deruloop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-all duration-300 hover:shadow-medium">
                    <Github className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold mb-1">GitHub</p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      View my code
                    </p>
                  </div>
                </a>

                <a
                  href="https://x.com/deruloop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-all duration-300 hover:shadow-medium">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-semibold mb-1">X</p>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Follow updates
                    </p>
                  </div>
                </a>
              </div>
              <a
                    href="mailto:cristiano@calicchia.dev"
                    className="group"
                  >
              <div className="pt-6">
                <Button 
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Send Me a Message
                </Button>
              </div>
              </a>
            </CardContent>
          </Card>

          {/* <p className="text-muted-foreground mt-12">
            Currently available for freelance opportunities and collaborations
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
