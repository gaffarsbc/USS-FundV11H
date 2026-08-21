import type { Metadata } from "next";

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  "/about": { title: "About United Social Services Inc. (USS)", description: "Learn about the USS mission, vision, values, founder and responsible path from direct service toward future housing pathways." },
  "/our-work": { title: "How USS Responds | United Social Services Inc.", description: "Explore Pathways to Home and Bridge to Stability: two connected areas of USS work supporting stability today and developing capacity for tomorrow." },
  "/our-work/pathways-to-home": { title: "Pathways to Home | USS", description: "Learn how USS is developing and fundraising for a continuum of future housing pathways as resources, partnerships and approvals become available." },
  "/our-work/bridge-to-stability": { title: "Bridge to Stability | USS", description: "Explore the essential-service areas USS supports and the organizational capacity it is working to strengthen." },
  "/campus": { title: "$4M Community Housing & Services Campus | USS", description: "Explore the planned USS Community Housing & Services Campus and the responsible development plan behind the initial $4 million campaign." },
  "/impact": { title: "Impact & Stewardship | USS", description: "Learn how USS approaches responsible measurement, stewardship and verified reporting." },
  "/ways-to-give": { title: "Ways to Give | USS", description: "Give through Zeffy, explore secondary financial methods, support Amazon needed items, or learn about long-term giving." },
  "/donate": { title: "Donate to United Social Services | USS", description: "Fund USS Today or Build USS Tomorrow through the primary Zeffy form and clearly organized giving options." },
  "/major-gifts": { title: "Major Gifts & Campaign Leadership | USS", description: "Discuss major gifts, campaign leadership, donor-advised funds, endowment and legacy giving with USS." },
  "/daf-endowment": { title: "Donor-Advised Fund & Endowment Giving | USS", description: "Explore structured long-term charitable giving through the USS Donor-Advised Fund and Endowment & Legacy Fund." },
  "/partner": { title: "Partner With USS", description: "Explore corporate giving, sponsorships, employee giving, in-kind assets, professional services and strategic partnership." },
  "/stories": { title: "Stories & Vision | USS", description: "Explore USS organizational milestones, service priorities and verified stories that show how capacity is being built for the future." },
  "/contact": { title: "Contact United Social Services Inc. (USS)", description: "Contact USS about donations, major gifts, partnerships, volunteering or in-kind support." },
  "/privacy": { title: "Privacy Policy | USS", description: "Read how the USS fundraising website handles inquiries, external giving links and visitor choices." },
  "/terms": { title: "Terms of Use | USS", description: "Read the terms governing the USS fundraising website, external services, organizational content and future plans." },
};

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`;
  const page = PAGE_METADATA[path] ?? { title: "United Social Services Inc. (USS)", description: "Serve people today. Build for tomorrow." };
  return {
    ...page,
    openGraph: page,
    twitter: page,
  };
}

export { default } from "../site";
