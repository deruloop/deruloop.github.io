import { Mail, MessageSquare, Github, Linkedin, LucideIcon } from "lucide-react";

export interface ContactLink {
  label: string;
  detail: string;
  href: string;
  icon: LucideIcon;
}

// One list for the homepage's contact card and the follow box at the end of
// every article, so the two can't drift apart.
export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    detail: "cristiano@calicchia.dev",
    href: "mailto:cristiano@calicchia.dev",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    detail: "Connect with me",
    href: "https://www.linkedin.com/in/cristiano-calicchia-240253167",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    detail: "View my code",
    href: "https://github.com/deruloop",
    icon: Github,
  },
  {
    label: "X",
    detail: "Follow updates",
    href: "https://x.com/deruloop",
    icon: MessageSquare,
  },
];

export const isExternal = (href: string) => !href.startsWith("mailto:");
