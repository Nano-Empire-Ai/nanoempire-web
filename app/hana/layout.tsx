import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hana — Diner Waitress by Night, Gym Girl by Morning",
  description:
    "Meet Hana: small-town Canadian diner waitress by night, gym girl by morning — saving for a Mustang and a move to Mexico. Her story, photos, the Hana Club, and the Mexico & Mustang tip jar.",
  alternates: {
    canonical: "/hana",
  },
  openGraph: {
    title: "Hana — Diner Waitress by Night, Gym Girl by Morning",
    description:
      "Strength, style, appetite and ambition — one electric personality learning what it means to be seen.",
    url: "https://www.nanoempireai.com/hana",
    siteName: "Nano Empire AI",
    locale: "en_US",
    type: "website",
  },
};

export default function HanaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
