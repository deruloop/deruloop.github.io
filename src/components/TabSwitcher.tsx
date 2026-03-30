import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Portfolio", path: "/" },
  { label: "Articles", path: "/articles" },
];

const TabSwitcher = ({ isStatic = false }: { isStatic?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className={isStatic ? "" : "fixed top-4 left-1/2 -translate-x-1/2 z-50"}>
      <div className="flex bg-card/80 backdrop-blur-md border border-border rounded-full p-1 shadow-soft">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              "px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              isActive(tab.path)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
