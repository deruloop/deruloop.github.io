import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { contactLinks, isExternal } from "@/lib/contacts";

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
                {contactLinks.map(({ label, detail, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group"
                  >
                    <div className="p-4 rounded-lg border-2 hover:border-primary transition-all duration-300 hover:shadow-medium flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-semibold text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {detail}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
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
