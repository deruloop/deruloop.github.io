import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Clients from "@/components/Clients";
import About from "@/components/About";
import Contact from "@/components/Contact";
import TabSwitcher from "@/components/TabSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TabSwitcher />
      <Hero />
      <Clients />
      <Projects />
      <Skills />
      <About />
      <Contact />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 iOS Developer Portfolio. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
