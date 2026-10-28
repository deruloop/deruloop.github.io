import { Mail, MessageSquare, Github, Linkedin } from "lucide-react";
import type { ComponentType } from "react";
import BlueskyIcon from "@/components/BlueskyIcon";

export interface ContactLink {
  label: string;
  detail: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
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
  {
    label: "Bluesky",
    detail: "@deruloop.dev",
    href: "https://bsky.app/profile/deruloop.dev",
    icon: BlueskyIcon,
  },
];

// With an odd number of links the first one (email) spans the full row, so the
// rest pair up evenly in the two-column grids.
export const spansRow = (index: number) => index === 0 && contactLinks.length % 2 === 1;

export const isExternal = (href: string) => !href.startsWith("mailto:");
