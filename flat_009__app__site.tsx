"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect */

import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const ORG = "United Social Services Inc. (USS)";

const LINKS = {
  zeffy: "https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-21399",
  paypal: "https://www.paypal.com/donate/?hosted_button_id=3EVXXHN5HZB5Y",
  cashApp: "https://cash.app/$USS2018",
  venmo: "https://account.venmo.com/u/USS2018",
  daf: "https://www.zeffy.com/en-US/donation-form/united-social-services-inc-uss-donor-advised-fund-daf",
  endowment: "https://www.zeffy.com/en-US/donation-form/uss-endowment-and-legacy-fund-contribution",
  amazon: "https://a.co/05wOLDTv",
  facebook: "https://www.facebook.com/share/14kc5Xw6Lz8/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/uss_tx?igsh=MTk3czJsYTB4YmdneQ%3D%3D&utm_source=qr",
  linkedin: "https://linkedin.com/company/united-social-services-inc-uss",
  founderLinkedin: "https://www.linkedin.com/in/lee-c-wallace?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  founderEmail: "lwallace@usstx.org",
  infoEmail: "Info@UssTx.Org",
  phoneDisplay: "(210) 245-8780",
  phoneHref: "tel:+12102458780",
  addressLineOne: "3918 Clark Ave, PO Box #23265",
  addressLineTwo: "San Antonio, Texas 78223",
  maps: "https://www.google.com/maps/search/?api=1&query=3918%20Clark%20Ave%20San%20Antonio%20Texas%2078223",
};

// Every mission photograph is assigned to exactly one visual slot site-wide.
const MEDIA = {
  homeHeroFamily: "/images/african-american-family.jpg",
  homeHeroLearning: "/images/family-learning.jpg",
  homeHeroFather: "/images/father-children.jpg",
  homeNeedDistribution: "/images/volunteer-distribution.jpg",
  homeNeedCare: "/images/volunteer-wheelchair.jpg",
  homeNeedBox: "/images/charity-box.jpg",
  homeCampaign: "/images/modern-campus.jpg",
  aboutHeroTeam: "/images/community-team.jpg",
  aboutHeroHome: "/images/family-home.jpg",
  aboutStoryHelp: "/images/senior-home-help.jpg",
  aboutStoryWriting: "/images/senior-writing.jpg",
  aboutStoryCare: "/images/senior-care.jpg",
  founder: "/images/lee-wallace.jpg",
  workHeroClassroom: "/images/classroom-students.jpg",
  workHeroTraining: "/images/training.jpg",
  pathwaysHeroHousing: "/images/family-couch.jpg",
  pathwaysHeroSupport: "/images/wheelchair-support.jpg",
  bridgeHeroTeacher: "/images/teacher-classroom.jpg",
  bridgeHeroTechnology: "/images/technology-support.jpg",
  campusHeroExterior: "/images/modern-apartments.jpg",
  campusHeroHousing: "/images/modern-housing.jpg",
  impactHeroSupport: "/images/support-elder.jpg",
  impactHeroMobility: "/images/mobility-scooter.jpg",
  impactStewardship: "/images/partner-meeting.jpg",
  giveHeroMeeting: "/images/business-meeting.jpg",
  giveHeroTransport: "/images/accessible-transport.jpg",
  donateHeroFood: "/images/food-support.jpg",
  donateHeroSorting: "/images/donation-sorting.jpg",
  majorHeroDiscussion: "/images/team-discussion.jpg",
  majorHeroTable: "/images/team-table.jpg",
  partnerHeroTeam: "/images/team-smiling.jpg",
  partnerHeroAdvisor: "/images/advisor-couple.jpg",
  storiesHeroCommunity: "/images/veteran-community.jpg",
  storiesHeroVeteran: "/images/veteran-flag.jpg",
  contactHeroOutreach: "/images/outreach.jpg",
  contactHeroTechnology: "/images/tech-classroom.jpg",
} as const;

type Slide = { src: string; alt: string; position?: string };
type Card = { title: string; copy: string; href?: string; kicker?: string; external?: boolean };

const NAV = [
  ["About", "/about"], ["Our Work", "/our-work"], ["The Campus", "/campus"],
  ["Impact", "/impact"], ["Ways to Give", "/ways-to-give"], ["Partner", "/partner"],
  ["Stories & Vision", "/stories"], ["Contact", "/contact"],
] as const;

const bridgeAreas = [
  ["Education & life skills", "Practical learning that builds confidence, capability and everyday independence."],
  ["Workforce & career development", "Job readiness, career exploration and connections to opportunity."],
  ["Food & basic needs", "Connections to food, household essentials and practical assistance."],
  ["Transportation & mobility", "Mobility support that helps people reach work, learning, care and services."],
  ["Care coordination & navigation", "One-to-one guidance and warm connections across complex systems."],
  ["Wellness & supportive services", "Whole-person support that values health, dignity and connection."],
  ["Community connections", "Outreach, events, referrals and trusted local relationships."],
  ["Personal development & empowerment", "Support for confidence, self-direction and meaningful growth."],
];

const populations = [
  ["Youth & Young Adults", "Housing pathways, education, workforce development and supportive services."],
  ["Families", "Housing stability, food and basic needs, navigation and family-centered support."],
  ["Veterans & Military Families", "Housing stability, transportation, employment and supportive services."],
  ["Seniors", "Housing pathways, mobility, wellness connections and practical support."],
  ["People with Disabilities", "Accessible housing pathways, transportation, navigation and community connection."],
  ["Underserved Neighbors", "Responsive services for people and communities facing barriers to stability."],
];

const donorMotivations = [
  ["Fund USS Today", "Strengthen current operations, essential services, transportation, technology, staffing, outreach and the capacity needed to serve effectively.", "/donate?fund=today"],
  ["Build USS Tomorrow", `Advance property acquisition, the $4M Campus Campaign, developing housing pathways, future infrastructure and responsible expansion.`, "/donate?fund=future"],
];

const currentFundingPriorities: Card[] = [
  { title: "Technology & Digital Infrastructure", copy: "Help USS strengthen the technology needed to operate, communicate, fundraise and serve effectively.", href: "/donate?fund=today" },
  { title: "Transportation", copy: "Help USS acquire, maintain and repair transportation resources used to connect people with essential services.", href: "/donate?fund=today" },
  { title: "Program Support", copy: "Help provide resources necessary for direct community support.", href: "/donate?fund=today" },
  { title: "Organizational Capacity", copy: "Help USS strengthen staffing, administration, compliance and operational infrastructure.", href: "/donate?fund=today" },
  { title: "Community Outreach", copy: "Help USS reach individuals and families who need assistance and connect them with available resources.", href: "/donate?fund=today" },
];

const majorGiftPriorities: Card[] = [
  { title: "Campus", copy: "Support development of the planned Community Housing & Services Campus.", href: "/contact?topic=major-gift" },
  { title: "Housing", copy: "Support developing housing pathways as funding and infrastructure become available.", href: "/contact?topic=major-gift" },
  { title: "Transportation", copy: "Strengthen transportation acquisition, maintenance and mobility capacity.", href: "/contact?topic=major-gift" },
  { title: "Technology", copy: "Support digital systems, equipment and operational technology.", href: "/contact?topic=major-gift" },
  { title: "Services", copy: "Strengthen direct community support and essential service capacity.", href: "/contact?topic=major-gift" },
  { title: "Organizational Capacity", copy: "Support staffing, administration, compliance, fundraising and operational infrastructure.", href: "/contact?topic=major-gift" },
];

const dafImpactAreas: Card[] = [
  { title: "Housing Stability", copy: "Support developing housing stability and homelessness-prevention initiatives." },
  { title: "Mobile & Community Support", copy: "Strengthen outreach and community-based service delivery." },
  { title: "Essential Services", copy: "Support practical assistance for homeless and at-risk populations." },
  { title: "Program Growth", copy: "Help expand mission-aligned programs, innovation and life-skills development." },
  { title: "Emergency & Crisis Support", copy: "Increase the organization’s ability to respond to urgent community needs." },
  { title: "Future Infrastructure", copy: "Support long-term facilities and infrastructure development as resources allow." },
  { title: "Organizational Sustainability", copy: "Strengthen long-term operational capacity and resilience." },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "0px 0px -9%", threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

function RotatingMedia({ slides, className = "", label, eager = false }: { slides: Slide[]; className?: string; label?: string; eager?: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);
  return <div className={`rotating-media ${className}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
    <div className="rotating-stage">
      {slides.map((slide, index) => <img key={slide.src} className={index === active ? "is-active" : ""} src={slide.src} alt={index === active ? slide.alt : ""} aria-hidden={index !== active} loading={eager && index === 0 ? "eager" : "lazy"} fetchPriority={eager && index === 0 ? "high" : "auto"} width="1600" height="1067" style={{ objectPosition: slide.position || "center" }} />)}
    </div>
    {slides.length > 1 && <div className="carousel-arrows"><button type="button" aria-label="Previous image" onClick={() => setActive(value => (value - 1 + slides.length) % slides.length)}>←</button><button type="button" aria-label="Next image" onClick={() => setActive(value => (value + 1) % slides.length)}>→</button></div>}
    {slides.length > 1 && <div className="carousel-dots" aria-label="Choose image">{slides.map((slide, index) => <button key={slide.src} type="button" className={index === active ? "active" : ""} aria-label={`Show image ${index + 1} of ${slides.length}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}</div>}
    {label && <span className="photo-label">{label}</span>}
  </div>;
}

function Logo() {
  return <a className="logo" href="/" aria-label={`${ORG} home`}><img className="logo-mark" src="/uss-primary-logo.svg" alt="United Social Services Inc. (USS)" width="1000" height="1000" /><span className="logo-copy"><strong>{ORG}</strong><small>Serve today. Build tomorrow.</small></span></a>;
}

function Button({ href, children, variant = "gold", external }: { href: string; children: ReactNode; variant?: "gold" | "ghost" | "teal"; external?: boolean }) {
  const opensNew = external ?? /^https?:\/\//.test(href);
  return <a className={`button button-${variant}`} href={href} target={opensNew ? "_blank" : undefined} rel={opensNew ? "noopener noreferrer" : undefined}><span>{children}</span><Arrow /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  useEffect(() => setOpen(false), [pathname]);
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><div className="header-inner"><Logo /><nav id="primary-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">{NAV.map(([label, href]) => <a key={href} className={pathname === href ? "active" : ""} href={href}>{label}</a>)}</nav><a className="header-donate" href="/donate"><span>Donate now</span> <Arrow /></a><button className="menu-toggle" type="button" aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><span /><span /><span /></button></div></header>;
}

function ExternalLink({ href, children, className = "", ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}</a>;
}

function SocialIcon({ platform }: { platform: "facebook" | "instagram" | "linkedin" }) {
  if (platform === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" /></svg>;
  if (platform === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.668-.072-4.948c-.198-4.354-2.617-6.78-6.98-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.371 4.267 5.456v6.285ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" /></svg>;
}

function SocialLinks({ includeLinkedin = true }: { includeLinkedin?: boolean }) {
  return <div className="socials" aria-label={`${ORG} social channels`}><ExternalLink href={LINKS.facebook} className="social-link" ariaLabel="Follow USS on Facebook"><SocialIcon platform="facebook" /><span className="social-label">Facebook</span></ExternalLink><ExternalLink href={LINKS.instagram} className="social-link" ariaLabel="Follow USS on Instagram"><SocialIcon platform="instagram" /><span className="social-label">Instagram</span></ExternalLink>{includeLinkedin && <ExternalLink href={LINKS.linkedin} className="social-link" ariaLabel="Connect with USS on LinkedIn"><SocialIcon platform="linkedin" /><span className="social-label">LinkedIn</span></ExternalLink>}</div>;
}

function Footer() {
  return <footer className="footer"><div className="footer-top wrap"><div className="footer-brand"><Logo /><p>Expanding hope, support and pathways toward housing stability.</p><p className="location">Serving within multiple communities in San Antonio and other cities.</p></div><div><h3>Explore</h3><a href="/about">About</a><a href="/our-work">Our Work</a><a href="/campus">The Campus</a><a href="/impact">Impact</a><a href="/stories">Stories &amp; Vision</a></div><div><h3>Take action</h3><a href="/donate">Donate</a><a href="/ways-to-give">Ways to Give</a><a href="/daf-endowment">DAF &amp; Legacy Giving</a><a href="/major-gifts">Major Gifts</a><a href="/partner">Partner</a><a href="/contact">Contact</a></div><div className="footer-contact"><h3>Contact &amp; follow</h3><ExternalLink href={LINKS.maps}>{LINKS.addressLineOne}<br />{LINKS.addressLineTwo}</ExternalLink><a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a><a href={`mailto:${LINKS.infoEmail}`}>{LINKS.infoEmail}</a><SocialLinks /><ExternalLink className="photo-credit" href="https://www.pexels.com">Representative photography from Pexels</ExternalLink></div></div><div className="footer-status wrap">United Social Services Inc. (USS) is a tax-exempt 501(c)(3) nonprofit corporation. EIN: 82-5444257.</div><div className="footer-bottom wrap"><span>© {new Date().getFullYear()} {ORG}</span><span><a href="/privacy">Privacy</a><a href="/terms">Terms</a></span></div></footer>;
}

function Hero({ eyebrow, title, body, slides, primary, secondary, conceptual = false, compact = false }: { eyebrow: string; title: ReactNode; body: string; slides?: Slide[]; primary: [string, string]; secondary?: [string, string]; conceptual?: boolean; compact?: boolean }) {
  return <section className={`hero ${compact ? "hero-compact" : ""} ${slides ? "hero-has-media" : "hero-no-media"}`}>
    {slides && <RotatingMedia slides={slides} className="hero-media" eager label={conceptual ? "Conceptual vision · representative photography" : "Representative community photography"} />}
    <div className="hero-overlay" /><div className="hero-grain" />
    <div className="wrap hero-content"><div className="hero-sequence"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-copy">{body}</p><div className="hero-actions"><Button href={primary[1]}>{primary[0]}</Button>{secondary && <Button href={secondary[1]} variant="ghost">{secondary[0]}</Button>}</div></div></div>
  </section>;
}

function Section({ children, tone = "white", id, className = "" }: { children: ReactNode; tone?: "white" | "mist" | "navy" | "teal"; id?: string; className?: string }) { return <section id={id} className={`section section-${tone} ${className}`}><div className="wrap">{children}</div></section>; }
function SectionHead({ eyebrow, title, copy, center = false }: { eyebrow?: string; title: ReactNode; copy?: string; center?: boolean }) { return <Reveal className={`section-head ${center ? "center" : ""}`}>{eyebrow && <p className="eyebrow dark">{eyebrow}</p>}<h2>{title}</h2>{copy && <p>{copy}</p>}</Reveal>; }
function PhotoSplit({ slides, eyebrow, title, children, reverse = false, label, portrait = false }: { slides: Slide[]; eyebrow?: string; title: ReactNode; children: ReactNode; reverse?: boolean; label?: string; portrait?: boolean }) { return <div className={`photo-split ${reverse ? "reverse" : ""} ${portrait ? "portrait-split" : ""}`}><Reveal className="photo-frame"><RotatingMedia slides={slides} label={label} /></Reveal><Reveal className="split-copy" delay={100}>{eyebrow && <p className="eyebrow dark">{eyebrow}</p>}<h2>{title}</h2>{children}</Reveal></div>; }

function CardGrid({ items, columns = 3 }: { items: Card[]; columns?: 2 | 3 | 4 }) {
  return <div className={`card-grid cols-${columns}`}>{items.map((item, i) => <Reveal key={item.title} delay={(i % 4) * 70}>{item.href ? <a className="feature-card" href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}><div className="card-index">{String(i + 1).padStart(2, "0")}</div><div className="card-body">{item.kicker && <p className="card-kicker">{item.kicker}</p>}<h3>{item.title}</h3><p>{item.copy}</p><span className="text-link">Explore <Arrow /></span></div></a> : <article className="feature-card"><div className="card-index">{String(i + 1).padStart(2, "0")}</div><div className="card-body">{item.kicker && <p className="card-kicker">{item.kicker}</p>}<h3>{item.title}</h3><p>{item.copy}</p></div></article>}</Reveal>)}</div>;
}

function Pathway({ labels }: { labels: string[] }) { return <Reveal className="pathway">{labels.map((label, i) => <div className="path-node" key={label}><span>{String(i + 1).padStart(2, "0")}</span><strong>{label}</strong></div>)}</Reveal>; }
function Callout({ title, children, action }: { title: string; children: ReactNode; action?: [string, string] }) { return <Reveal className="callout"><div><p className="eyebrow">{ORG}</p><h3>{title}</h3><div>{children}</div></div>{action && <Button href={action[1]}>{action[0]}</Button>}</Reveal>; }
function FinalCta() { return <section className="final-cta"><div className="cta-orbit cta-orbit-one" /><div className="cta-orbit cta-orbit-two" /><Reveal className="wrap"><p className="eyebrow">Help us build the pathways</p><h2>Serve people today.<br />Build for tomorrow.</h2><p>Together, we can create communities where people have not only a place to turn—but a pathway forward.</p><div className="hero-actions"><Button href="/donate">Donate</Button><Button href="/campus" variant="ghost">Support the campus</Button><Button href="/partner" variant="teal">Become a partner</Button></div></Reveal></section>; }
function DonorArchitecture() { return <Section tone="mist" id="funding-paths"><SectionHead eyebrow="Two ways to move the mission forward" title="Fund USS Today. Build USS Tomorrow." copy="Choose between strengthening current operations and services or advancing future housing pathways, Campus development and infrastructure." center /><CardGrid columns={2} items={donorMotivations.map(([title, copy, href]) => ({ title, copy, href }))} /></Section>; }

function CurrentFundingPriorities() { return <Section id="current-funding-priorities"><SectionHead eyebrow="Fund USS Today" title="Current Funding Priorities" copy="Your support strengthens the practical resources USS needs to operate, communicate, reach communities and serve effectively today." /><CardGrid columns={3} items={currentFundingPriorities} /></Section>; }

function CampaignSection() {
  return <section className="campaign-band"><img src={MEDIA.homeCampaign} alt="Representative image of a future community housing and services campus." loading="lazy" width="1600" height="2133" /><div className="campaign-overlay" /><div className="campaign-glow" /><div className="wrap campaign-content"><Reveal><p className="eyebrow">Build for tomorrow · capital campaign</p><div className="campaign-number"><span>$4,000,000</span></div><h2>Campus Campaign</h2></Reveal><div className="campaign-facts"><Reveal delay={100}><span>Our goal</span><strong>$4 million</strong></Reveal><Reveal delay={180}><span>Purpose</span><strong>Funding is intended to help acquire and develop a planned initial {ORG} Community Housing &amp; Services Campus.</strong></Reveal><Reveal delay={260}><span>Status</span><strong>Campaign launching—seeking lead investors, foundations, corporations and major donors</strong></Reveal></div><Reveal delay={320} className="hero-actions"><Button href="/campus">Explore the campus</Button><Button href="/donate?fund=future" variant="ghost">Support the campaign</Button></Reveal></div></section>;
}

function HomePage() {
  return <>
    <Hero eyebrow="Serve today. Build tomorrow." title="USS is building the resources to serve today—and the infrastructure to serve tomorrow." body="Your support strengthens current services and operational capacity while advancing planned housing pathways, Campus development and future infrastructure." slides={[{ src: MEDIA.homeHeroFamily, alt: "African American family spending time together at home", position: "center 38%" }, { src: MEDIA.homeHeroLearning, alt: "Family learning together at home" }, { src: MEDIA.homeHeroFather, alt: "Father sharing a joyful moment with his children" }]} primary={["SUPPORT USS TODAY", "/donate?fund=today"]} secondary={["HELP BUILD THE FUTURE", "/donate?fund=future"]} />
    <DonorArchitecture />
    <CurrentFundingPriorities />
    <Section id="need"><PhotoSplit slides={[{ src: MEDIA.homeNeedDistribution, alt: "Volunteers preparing practical support" }, { src: MEDIA.homeNeedCare, alt: "Volunteer supporting a community member" }, { src: MEDIA.homeNeedBox, alt: "Hands preparing a box of donated essentials" }]} eyebrow="The need" title="Interconnected barriers need connected pathways."><p>People experiencing housing instability or other barriers to stability rarely face just one challenge. Housing, transportation, employment, education, food access, health and well-being, and supportive services are often interconnected.</p><p>{ORG} brings these pieces together—meeting people where they are and helping them move forward.</p><a className="text-link" href="/our-work">Explore the response <Arrow /></a></PhotoSplit></Section>
    <Section tone="mist" id="response"><SectionHead eyebrow="How USS Responds" title={<>Safe. Supported. <span className="teal-text">Stable.</span></>} copy={`At ${ORG}, lasting change begins with meeting people where they are—and helping them move forward.`} center /><CardGrid items={[{ title: "Safe", copy: "Immediate protection and compassionate care." }, { title: "Supported", copy: "Essential services and personalized guidance." }, { title: "Stable", copy: "Developing pathways toward long-term housing, independence and opportunity." }]} /></Section>
    <Section tone="navy" id="model"><SectionHead eyebrow="The model" title="Pathways to Home + Bridge to Stability." copy="Your support helps strengthen two connected pathways that address housing needs and the practical services that support long-term stability." /><CardGrid columns={2} items={[{ title: "Pathways to Home", copy: "A developing continuum of housing solutions intended to meet different stages of need as funding, partnerships, property, approvals and infrastructure become available.", href: "/our-work/pathways-to-home" }, { title: "Bridge to Stability", copy: "Education, workforce development, food, transportation, care coordination, wellness and community support that help people move forward.", href: "/our-work/bridge-to-stability" }]} /></Section>
    <Section tone="mist" id="who-we-serve"><SectionHead eyebrow="Who we serve" title="Dignity, access and opportunity across generations." copy={`${ORG} supports people and families with different starting points and different needs while developing expanded housing pathways for the future.`} /><CardGrid columns={3} items={populations.map(([title, copy]) => ({ title, copy }))} /></Section>
    <Section><SectionHead eyebrow={`Why give to ${ORG}?`} title="Integrated. Community-centered. Built for scale." copy={`${ORG} brings together essential services and developing housing pathways under one coordinated organizational framework.`} center /><Reveal className="framework-grid">{["Housing Pathways", "Essential Services", "Education", "Workforce Development", "Transportation", "Technology", "Community Support", "Enterprise"].map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</Reveal><p className="center-copy">People need more than a service. They need pathways. This connected model is designed to serve people now and build sustainable capacity for the future.</p></Section>
    <HundredCampaign />
    <CampaignSection />
    <Section><SectionHead eyebrow="One person. One family. One community at a time." title="People need more than a service. They need pathways." center /><Pathway labels={["Meet people where they are", "Address immediate needs", "Build stability", "Create opportunity", "Strengthen communities"]} /><div className="center-action"><Button href="/our-work" variant="teal">See our approach</Button></div></Section>
    <FinalCta />
  </>;
}

function AboutPage() {
  return <>
    <Hero compact eyebrow={`About ${ORG}`} title="From One Home to a Community Vision." body={`${ORG} was founded in 2018 and has grown through direct community service while working toward a planned Campus and a connected, scalable model.`} slides={[{ src: MEDIA.aboutHeroTeam, alt: "Community team gathered together" }, { src: MEDIA.aboutHeroHome, alt: "Family together in a welcoming home" }]} primary={["Support the mission", "/donate"]} secondary={["Explore our work", "/our-work"]} />
    <Section><PhotoSplit slides={[{ src: MEDIA.aboutStoryHelp, alt: "Community support provided at home" }, { src: MEDIA.aboutStoryWriting, alt: "An older adult building confidence through learning" }, { src: MEDIA.aboutStoryCare, alt: "Compassionate support for an older adult" }]} eyebrow="Our story" title="A commitment to people. A vision for stronger communities."><p>{ORG} began in 2018 with a simple conviction: lasting change starts by meeting people where they are and helping them move forward.</p><p>As the organization served communities directly, it saw how housing, food, transportation, employment, education, technology, wellness and supportive services intersect. That experience shaped a bigger vision—one connected system where those pathways can meet.</p></PhotoSplit></Section>
    <Section tone="navy"><div className="statement-grid"><Reveal><p className="eyebrow">Our Mission · Empowering Communities</p><h2>Helping people stabilize, rebuild and thrive.</h2><p>United Social Services Inc. (USS) provides essential services and direct community support to individuals and families facing homelessness or poverty while working toward expanded housing pathways designed to help people stabilize, rebuild and thrive.</p></Reveal><Reveal delay={120}><p className="eyebrow">Our Vision · Strategic Roadmap</p><h2>Dignity, hope and access for every person.</h2><p>A world where every person has access to safe housing, vital community resources, and the empowering support needed to live with dignity and hope.</p></Reveal></div></Section>
    <Section tone="mist"><SectionHead eyebrow="Strategic roadmap" title="From local service to scalable community impact." center /><Pathway labels={["Local Impact", "Community Infrastructure", "Regional Expansion", "National Impact"]} /></Section>
    <Section><SectionHead eyebrow="Our history" title="Service shaped the model. The model shapes what comes next." /><div className="timeline"><Reveal><article><span>2018</span><h3>{ORG} begins</h3><p>The organization is founded with a commitment to direct service, dignity and community.</p></article></Reveal><Reveal delay={80}><article><span>Today</span><h3>Growing through service</h3><p>Community assistance, outreach, partnerships and program development continue to shape the model.</p></article></Reveal><Reveal delay={160}><article><span>Next</span><h3>A planned initial Campus</h3><p>The $4 million campaign is intended to help acquire and develop a planned initial Community Housing &amp; Services Campus, subject to funding and approvals.</p></article></Reveal><Reveal delay={240}><article><span>Future</span><h3>A scalable framework</h3><p>The long-term vision is an integrated, community-centered model that can grow across communities as resources allow.</p></article></Reveal></div></Section>
    <Section tone="mist"><SectionHead eyebrow="Core values" title="How United Social Services Inc. (USS) leads and serves." /><CardGrid columns={4} items={[{ title: "Accountability", copy: "We act with responsibility, transparency, and stewardship in every decision and action." }, { title: "Excellence", copy: "We pursue the highest standards of quality, innovation, and continuous improvement in serving our communities." }, { title: "Integrity", copy: "We lead with honesty, ethics, and trust, ensuring our actions reflect our mission and values." }, { title: "Community Empowerment", copy: "We strengthen individuals, families, and communities by fostering collaboration, opportunity, and self-sufficiency." }]} /></Section>
    <Section><PhotoSplit portrait slides={[{ src: MEDIA.founder, alt: "Mr. Lee C. Wallace, Founder of United Social Services Inc. (USS)", position: "center 18%" }]} eyebrow="Founder" title="Leadership grounded in service." label="Mr. Lee C. Wallace · Founder"><p>Mr. Lee C. Wallace founded {ORG} in 2018. His leadership connects direct community service with a long-term vision for housing, essential services, opportunity and stronger community infrastructure.</p><div className="founder-signature"><strong>Mr. Lee C. Wallace</strong><span>Founder, {ORG}</span><div className="founder-links"><a href={`mailto:${LINKS.founderEmail}`}><span aria-hidden="true">✉</span>{LINKS.founderEmail}</a><ExternalLink href={LINKS.founderLinkedin} ariaLabel="Mr. Lee C. Wallace on LinkedIn"><SocialIcon platform="linkedin" />LinkedIn</ExternalLink></div></div></PhotoSplit></Section>
    <FinalCta />
  </>;
}

function OurWorkPage() {
  return <>
    <Hero compact eyebrow="How USS Responds" title="Safe. Supported. Stable." body="Developing housing pathways and essential services belong in one connected approach—because the barriers people face are interconnected." slides={[{ src: MEDIA.workHeroClassroom, alt: "Students learning together in a classroom" }, { src: MEDIA.workHeroTraining, alt: "Community education and skills training" }]} primary={["Explore Pathways to Home", "/our-work/pathways-to-home"]} secondary={["Explore Bridge to Stability", "/our-work/bridge-to-stability"]} />
    <Section><SectionHead eyebrow="Our approach" title="Meet people where they are—and help them move forward." copy={`${ORG} is working to create an integrated system where pathways to housing, support and opportunity can connect.`} /><Pathway labels={["Meet people where they are", "Address immediate needs", "Build stability", "Create opportunity", "Strengthen communities"]} /><div className="approach-details">{["We recognize that every individual and family enters the journey from a different starting point.", "We help connect people with practical resources, housing opportunities, and essential support.", "We focus on the services and connections that can help people strengthen their foundation.", "We support pathways toward education, employment, independence, and personal growth.", "When individuals and families become more stable, communities become stronger."].map((copy, i) => <Reveal key={copy} delay={(i % 3) * 70}><article><span>{String(i + 1).padStart(2, "0")}</span><p>{copy}</p></article></Reveal>)}</div></Section>
    <Section tone="navy"><SectionHead eyebrow="Two connected pathways" title="Housing pathways for the future. Support that helps people move forward today." copy="Your support strengthens two connected areas of work: developing housing pathways and the essential services that help people move toward stability." /><CardGrid columns={2} items={[{ title: "Pathways to Home", copy: "A developing continuum of housing solutions intended for different stages of need as funding, partnerships, property, approvals and infrastructure become available.", href: "/our-work/pathways-to-home" }, { title: "Bridge to Stability", copy: "Essential services and community-based support that strengthen stability, increase opportunity and build greater independence.", href: "/our-work/bridge-to-stability" }]} /></Section>
    <Section tone="mist"><SectionHead eyebrow="The motto" title="The USS Three: Safe. Supported. Stable." center /><CardGrid items={[{ title: "Safe", copy: "Immediate protection and compassionate care." }, { title: "Supported", copy: "Essential services and personalized guidance." }, { title: "Stable", copy: "Developing pathways toward long-term housing, independence and opportunity." }]} /></Section>
    <FinalCta />
  </>;
}

function PathwaysPage() {
  return <>
    <Hero compact eyebrow="Pathways to Home" title="Working toward housing that meets people where they are." body="Pathways to Home is currently in the development and fundraising stage. USS is working toward a continuum of housing solutions as funding, partnerships, property, approvals and infrastructure become available." slides={[{ src: MEDIA.pathwaysHeroHousing, alt: "Family together in a welcoming home" }, { src: MEDIA.pathwaysHeroSupport, alt: "Supportive assistance for a wheelchair user" }]} primary={["Support housing pathways", "/donate?fund=future"]} secondary={["Explore the campus", "/campus"]} />
    <Section><SectionHead eyebrow="A developing housing continuum" title="From immediate need toward a safe, stable place to call home." copy="The goal is to create housing pathways toward stability, independence and opportunity as resources, approvals and partnerships become available." /><CardGrid columns={3} items={[{ title: "Immediate Shelter", copy: "A planned response intended to offer safety when protection and stability cannot wait." }, { title: "Rapid Rehousing", copy: "A planned pathway focused on a faster return to stable housing." }, { title: "Transitional Housing", copy: "A planned time-limited housing model with services that support the next step." }, { title: "Supportive Housing", copy: "A planned housing model connected with services for people facing complex barriers." }, { title: "Permanent Supportive Housing", copy: "A planned longer-term housing model paired with supportive services and community connection." }, { title: "Housing Navigation", copy: "Practical guidance, coordination and connections across available housing systems." }]} /></Section>
    <Section tone="navy"><Callout title="Housing is the foundation—not the whole journey." action={["See Bridge to Stability", "/our-work/bridge-to-stability"]}><p>Education, employment, transportation, food access, wellness and personalized guidance can help turn a housing opportunity into lasting stability.</p></Callout></Section>
    <FinalCta />
  </>;
}

function BridgePage() {
  return <>
    <Hero compact eyebrow="Bridge to Stability" title="Support that helps people move forward." body="Housing alone cannot address every barrier. Essential services and community-based support can strengthen stability, increase opportunity and help build greater independence." slides={[{ src: MEDIA.bridgeHeroTeacher, alt: "Teacher guiding a community classroom" }, { src: MEDIA.bridgeHeroTechnology, alt: "Technology support opening access to opportunity" }]} primary={["Support essential services", "/donate?fund=today"]} secondary={["Explore housing pathways", "/our-work/pathways-to-home"]} />
    <Section><SectionHead eyebrow="Essential services" title="One connected bridge. Many practical supports." copy="These areas reflect services USS currently supports as well as organizational capacity USS is working to strengthen as resources become available." /><CardGrid columns={4} items={bridgeAreas.map(([title, copy]) => ({ title, copy }))} /></Section>
    <Section tone="mist"><SectionHead eyebrow="Why connection matters" title="Needs change over time. Pathways should connect." copy="A person may need emergency assistance today, housing tomorrow, employment support next month, and continued community connection as they build a more stable future." center /><div className="center-action"><Button href="/donate" variant="teal">Help build the pathways</Button></div></Section>
    <FinalCta />
  </>;
}

function CampusPage() {
  return <>
    <Hero compact conceptual eyebrow="$4,000,000 Campus Campaign" title="Build the infrastructure to expand the model." body={`Help ${ORG} work toward a planned initial Community Housing & Services Campus intended to connect housing, support, learning, workforce and community resources as funding, partnerships and approvals become available.`} slides={[{ src: MEDIA.campusHeroExterior, alt: "Representative image of a future community housing and services campus." }, { src: MEDIA.campusHeroHousing, alt: "Representative image of future community-centered housing." }]} primary={["Support the campaign", "/donate?fund=future"]} secondary={["Discuss a major gift", "/major-gifts"]} />
    <Section><Reveal className="campaign-summary"><div><p className="eyebrow dark">Campaign objective</p><strong>$4M</strong><span>Initial campus goal</span></div><div><h2>A planned home for connected pathways.</h2><p>The campaign is launching and seeking lead investors, foundations, corporations and major donors. Funding is intended to help USS acquire and develop a planned initial Community Housing &amp; Services Campus, subject to resources, partnerships, property, regulatory approvals and organizational capacity.</p></div></Reveal></Section>
    <Section tone="navy"><SectionHead eyebrow="Campus ecosystem" title="Housing + services + opportunity in one community-centered setting." center /><div className="priority-grid">{["Housing", "Essential Services", "Education", "Workforce", "Transportation", "Technology", "Community Support", "Enterprise"].map((item, i) => <Reveal key={item} delay={(i % 4) * 60}><div><span>{String(i + 1).padStart(2, "0")}</span>{item}</div></Reveal>)}</div></Section>
    <Section tone="mist"><SectionHead eyebrow="Campaign status" title="Launching with a clear purpose and a responsible development plan." center /><CardGrid items={[{ title: "Our Goal", copy: "$4 million." }, { title: "Our Purpose", copy: `Funding is intended to help acquire and develop a planned initial ${ORG} Community Housing & Services Campus.` }, { title: "Our Invitation", copy: "Lead investors, foundations, corporations and major donors are invited to help develop future infrastructure as resources and approvals become available." }]} /></Section>
    <DonorArchitecture />
    <FinalCta />
  </>;
}

function ImpactPage() {
  return <>
    <Hero compact eyebrow={`Impact at ${ORG}`} title="Proof in service. Discipline in what comes next." body="United Social Services Inc. (USS) has grown through direct community service since 2018. The next chapter pairs responsible measurement with a planned Campus and scalable model." slides={[{ src: MEDIA.impactHeroSupport, alt: "Practical support for an older adult" }, { src: MEDIA.impactHeroMobility, alt: "A community member gaining mobility and independence" }]} primary={["Support the work", "/donate"]} secondary={["Read our story", "/about"]} />
    <Section><SectionHead eyebrow="Responsible measurement" title="A record of service. A commitment to stronger measurement." copy="USS is committed to responsible measurement and publishes impact figures after the underlying data has been reviewed and confirmed. As programs and the planned Campus develop, USS intends to share verified indicators of reach, service connection and organizational capacity." /><CardGrid columns={4} items={[{ title: "2018", copy: "The year United Social Services Inc. (USS) began serving." }, { title: "Direct Service", copy: "Community needs and relationships have shaped the model." }, { title: "Connected Approach", copy: "Essential services today connect with housing pathways USS is developing for the future." }, { title: "$4M Vision", copy: "The initial Campus campaign creates a clear development goal." }]} /></Section>
    <Section tone="mist"><PhotoSplit reverse slides={[{ src: MEDIA.impactStewardship, alt: "Team meeting focused on stewardship and planning" }]} eyebrow="Transparency & stewardship" title="Responsible resources. Clear intent."><p>{ORG} centers responsible operations, governance and respect for formally accepted donor restrictions. Online financial gifts are completed through clearly labeled third-party payment providers.</p><Button href="/ways-to-give" variant="teal">Ways to give</Button></PhotoSplit></Section>
    <FinalCta />
  </>;
}

function WaysToGivePage() {
  return <>
    <Hero compact eyebrow={`Ways to support ${ORG}`} title="Give money, needed items, expertise or partnership." body="Choose the type of giving first. Zeffy is the featured online financial method, with additional giving options clearly organized below." slides={[{ src: MEDIA.giveHeroMeeting, alt: "Business leaders discussing community investment" }, { src: MEDIA.giveHeroTransport, alt: "Accessible transportation supporting independence" }]} primary={["Donate", "/donate"]} secondary={["Contact us", "/contact"]} />
    <Section><SectionHead eyebrow="Financial giving" title="Give online with a clear primary option." copy="Zeffy is USS’s featured general donation platform. PayPal, Cash App and Venmo remain available as secondary choices." /><div className="giving-methods"><Reveal><article className="giving-feature"><p className="eyebrow">Featured general giving option</p><h2>Donate with Zeffy</h2><p>Support current needs or future priorities through the main USS donation form.</p><Button href={LINKS.zeffy} variant="teal">Donate with Zeffy</Button></article></Reveal><Reveal delay={100} className="giving-secondary"><ExternalLink href={LINKS.paypal}><span>PayPal</span><strong>Donate with PayPal <Arrow /></strong></ExternalLink><ExternalLink href={LINKS.cashApp}><span>Cash App</span><strong>Give with Cash App <Arrow /></strong></ExternalLink><ExternalLink href={LINKS.venmo}><span>Venmo</span><strong>Give with Venmo <Arrow /></strong></ExternalLink></Reveal></div></Section>
    <Section tone="mist"><SectionHead eyebrow="Long-term giving" title="Long-Term & Legacy Giving" copy="Explore structured giving options designed to support USS’s long-term mission, sustainability and future capacity." /><div className="long-term-grid"><Reveal><article className="long-term-card"><p className="eyebrow dark">Structured giving</p><h3>USS Donor-Advised Fund (DAF)</h3><p>Support USS through a structured charitable giving option designed for long-term mission impact.</p><div className="card-actions"><Button href="/daf-endowment" variant="teal">Learn More</Button><Button href={LINKS.daf}>Support the USS DAF</Button></div></article></Reveal><Reveal delay={100}><article className="long-term-card"><p className="eyebrow dark">Sustainable giving</p><h3>USS Endowment & Legacy Fund</h3><p>Help strengthen USS’s long-term financial sustainability, programs and future capacity.</p><div className="card-actions"><Button href="/daf-endowment" variant="teal">Learn More</Button><Button href={LINKS.endowment}>Contribute to the Endowment &amp; Legacy Fund</Button></div></article></Reveal></div><div className="center-action"><Button href={`mailto:${LINKS.founderEmail}`} variant="teal">Discuss Legacy Giving</Button></div></Section>
    <Section><SectionHead eyebrow="Give Assets / Needed Items" title="Property, vehicles, computers, equipment and supplies." copy="Potential asset gifts require direct review. Needed items may also be purchased through USS’s Amazon list." /><div className="long-term-grid single"><Reveal><article className="long-term-card"><p className="eyebrow dark">Needed items</p><h3>Amazon Needed Items</h3><p>View items currently identified for USS support.</p><Button href={LINKS.amazon} variant="teal">View Needed Items on Amazon</Button></article></Reveal></div></Section>
    <Section><SectionHead eyebrow="Other ways to help" title="Bring resources, expertise or shared purpose." /><CardGrid columns={3} items={[{ title: "Corporate Support", copy: "Philanthropy, sponsorship, matching gifts, employee giving and strategic partnership.", href: "/partner" }, { title: "Property, Vehicles & Equipment", copy: "Potential in-kind assets are considered through a direct conversation and responsible review.", href: "/contact?topic=in-kind" }, { title: "Professional Services", copy: "Legal, financial, construction, technology, communications and advisory expertise.", href: "/partner" }]} /></Section>
    <Section tone="navy"><Callout title="In-kind and asset gifts require review." action={["Start a conversation", "/contact"]}><p>{ORG} does not imply automatic acceptance, appraisal or tax treatment. Please contact the organization before transferring property, vehicles, equipment or professional services.</p></Callout></Section>
    <FinalCta />
  </>;
}

function ShareCampaign() {
  const [status, setStatus] = useState("");
  const share = async () => {
    const url = `${window.location.origin}/donate#hundred-campaign`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "10,000 People. $100 Each. $1 Million.", text: "Join the USS fundraising campaign.", url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setStatus("Campaign link copied.");
    window.setTimeout(() => setStatus(""), 3200);
  };
  return <div className="share-campaign"><button type="button" className="button button-ghost" onClick={share}><span>Invite Someone Else</span><Arrow /></button><span className="share-status" role="status" aria-live="polite">{status}</span></div>;
}

function HundredCampaign() { return <Section tone="navy" id="hundred-campaign"><Reveal className="hundred-campaign"><p className="eyebrow">A shared goal</p><h2>10,000 PEOPLE. $100 EACH. $1 MILLION.</h2><p>One gift can move the mission forward. One invitation can bring someone else into the work.</p><div className="hero-actions"><Button href={LINKS.zeffy}>Give $100</Button><Button href={LINKS.zeffy} variant="teal">Give $100 Monthly</Button><ShareCampaign /></div></Reveal></Section>; }

function DonatePage() {
  const [fund, setFund] = useState("most-needed");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("fund") || "most-needed";
    const aliases: Record<string, string> = { "serve-today": "today", campus: "future", strengthen: "today" };
    setFund(aliases[requested] || requested);
  }, []);
  const fundDetails: Record<string, { title: string; subtitle: string; copy: string }> = {
    today: { title: "Fund USS Today", subtitle: "Current Needs / Where Most Needed Today", copy: "Support essential services, outreach, direct community support and organizational operations today." },
    future: { title: "Build USS Tomorrow", subtitle: "Future Needs", copy: "Campus, Housing & Future Infrastructure" },
    "most-needed": { title: "Fund USS Today", subtitle: "Where Most Needed", copy: "Allow USS to direct support toward responsible, mission-aligned priorities." },
  };
  const selected = fundDetails[fund] || fundDetails["most-needed"];
  return <>
    <Hero compact eyebrow={`Donate to ${ORG}`} title="Give with clarity. Build with purpose." body="Choose the fundraising purpose that moves you, then complete your gift through the giving method that works for you." slides={[{ src: MEDIA.donateHeroFood, alt: "Food and essentials prepared for community support" }, { src: MEDIA.donateHeroSorting, alt: "Volunteers organizing donated essentials" }]} primary={["Choose a giving method", "#give"]} secondary={["Explore the $4M campaign", "/campus"]} />
    <Section id="give"><Reveal className="selected-fund"><p className="eyebrow dark">Your selected purpose</p><h2>{selected.title}</h2><h3>{selected.subtitle}</h3><p>{selected.copy}</p><small>The payment provider may not carry this website selection automatically. If a designation field is available, enter your chosen purpose there; otherwise contact USS before making a restricted gift.</small></Reveal><div className="giving-methods"><Reveal><article className="giving-feature"><p className="eyebrow">Featured online option</p><h2>Donate with Zeffy</h2><p>Open the main {ORG} Zeffy donation form in a secure new tab.</p><Button href={LINKS.zeffy} variant="teal">Donate with Zeffy</Button></article></Reveal><Reveal delay={100} className="giving-secondary"><ExternalLink href={LINKS.paypal}><span>PayPal</span><strong>Donate with PayPal <Arrow /></strong></ExternalLink><ExternalLink href={LINKS.cashApp}><span>Cash App</span><strong>Give with Cash App <Arrow /></strong></ExternalLink><ExternalLink href={LINKS.venmo}><span>Venmo</span><strong>Give with Venmo <Arrow /></strong></ExternalLink></Reveal></div></Section>
    <DonorArchitecture />
    <HundredCampaign />
    <Section><div className="donate-layout"><div><SectionHead eyebrow="Give Assets / Needed Items" title="Property, vehicles, computers, equipment and supplies." copy="Potential asset gifts require direct review. Needed items may also be purchased through USS’s Amazon list." /><article className="needed-items-card"><h3>Amazon Needed Items</h3><p>View items currently identified for USS support.</p><Button href={LINKS.amazon} variant="teal">View Needed Items on Amazon</Button></article></div><aside className="trust-panel"><p className="eyebrow">Trust & stewardship</p><h3>Your intent matters.</h3><ul><li>{ORG} is a tax-exempt 501(c)(3) nonprofit corporation. EIN: 82-5444257.</li><li>Donor restrictions are honored only when formally accepted.</li><li>Online gifts are processed by the selected third-party provider.</li><li>Consult your tax advisor regarding deductibility.</li></ul><div className="trust-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></aside></div></Section>
    <Section tone="mist"><Callout title="Looking for long-term or legacy giving?" action={["Explore Long-Term Giving", "/daf-endowment"]}><p>Explore the USS Donor-Advised Fund and Endowment &amp; Legacy Fund.</p></Callout></Section>
  </>;
}

function MajorGiftsPage() {
  return <>
    <Hero compact eyebrow="Major gifts & campaign leadership" title="Accelerate what is possible." body={`Lead donors can help ${ORG} advance the $4 million campus campaign, housing, transportation, technology, services and organizational capacity.`} slides={[{ src: MEDIA.majorHeroDiscussion, alt: "Leaders planning a high-impact community investment" }, { src: MEDIA.majorHeroTable, alt: "Collaborative team meeting around a shared vision" }]} primary={["Discuss a major gift", "/contact?topic=major-gift"]} secondary={["See the campus", "/campus"]} />
    <Section><SectionHead eyebrow="Priority areas" title="Create a mission-aligned conversation." /><CardGrid columns={3} items={majorGiftPriorities} /></Section>
    <Section tone="mist"><SectionHead eyebrow="Long-term giving" title="Long-Term & Legacy Giving" copy="Explore structured giving through the USS Donor-Advised Fund, the USS Endowment & Legacy Fund, or a planned and legacy giving conversation." /><div className="hero-actions"><Button href="/daf-endowment" variant="teal">Explore DAF &amp; Endowment Giving</Button><Button href={`mailto:${LINKS.founderEmail}`}>Discuss Legacy Giving</Button></div></Section>
    <Section tone="navy"><Callout title="A thoughtful major-gift conversation." action={["Start the conversation", "/contact?topic=major-gift"]}><p>Discuss alignment, timing and appropriate donor intent directly with Mr. Lee C. Wallace, Founder of {ORG}, at <a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a> or <a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a>.</p></Callout></Section>
    <FinalCta />
  </>;
}

function SimpleInquiryForm({ partner = false }: { partner?: boolean }) {
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = `${partner ? "Partnership" : "Website"} inquiry: ${String(form.get("topic") || "General")}`;
    const body = [`Name: ${String(form.get("name") || "")}`, `Email: ${String(form.get("email") || "")}`, `Organization: ${String(form.get("organization") || "Not provided")}`, `Topic: ${String(form.get("topic") || "General")}`, "", String(form.get("message") || "")].join("\n");
    setDone(true);
    window.location.href = `mailto:${LINKS.founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const topics = partner ? ["Corporate giving", "Sponsorship", "Matching or employee giving", "Property, vehicle or equipment", "Professional services", "Strategic or institutional partnership"] : ["General", "Donation", "Major gift", "Partnership", "Volunteer", "Property", "Vehicle", "Equipment"];
  return <form className="inquiry-form" onSubmit={submit}><div className="form-row"><label className="field"><span>Name</span><input required name="name" autoComplete="name" /></label><label className="field"><span>Email</span><input required name="email" type="email" autoComplete="email" /></label></div><div className="form-row"><label className="field"><span>Organization <small>(optional)</small></span><input name="organization" autoComplete="organization" /></label><label className="field"><span>{partner ? "Partnership type" : "Topic"}</span><select name="topic" defaultValue={topics[0]}>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label></div><label className="field"><span>Message</span><textarea name="message" required rows={5} /></label><button className="submit-button" type="submit">{partner ? "Email partnership inquiry" : "Email inquiry"} <Arrow /></button>{done && <p className="form-status" role="status">Your email application has been opened with the inquiry addressed to <a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a>.</p>}<p className="form-helper">Submitting opens your email application. If it does not open, email <a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a> directly.</p></form>;
}

function PartnerPage() {
  return <>
    <Hero compact eyebrow={`Partner with ${ORG}`} title="Build more when we build together." body="Businesses, foundations, community organizations, faith-based groups and professionals can help expand housing, employment, education, transportation, services and referrals." slides={[{ src: MEDIA.partnerHeroTeam, alt: "A professional team collaborating together" }, { src: MEDIA.partnerHeroAdvisor, alt: "Advisors discussing a community partnership" }]} primary={["Start a partnership inquiry", "#inquiry"]} secondary={["Explore the campus", "/campus"]} />
    <Section><SectionHead eyebrow="Partnership types" title="Bring resources, expertise or shared purpose." /><CardGrid columns={3} items={[{ title: "Corporate Giving", copy: "Support current priorities or future infrastructure through company philanthropy." }, { title: "Sponsorships", copy: "Support approved outreach, fundraising initiatives or community activities." }, { title: "Matching & Employee Giving", copy: "Extend the value of employee contributions through workplace giving programs." }, { title: "Property, Vehicles & Equipment", copy: "Contribute approved assets that can strengthen USS operations or future capacity." }, { title: "Professional Services", copy: "Provide specialized expertise in areas such as technology, marketing, legal, accounting, construction or consulting." }, { title: "Strategic & Institutional Partnership", copy: "Explore longer-term partnerships aligned with USS priorities and organizational goals." }]} /></Section>
    <Section tone="navy"><SectionHead eyebrow="What partnership can support" title="Today’s services and tomorrow’s capacity." center /><div className="chip-list large inverse">{["Current Services", "$4M Campus", "Technology", "Transportation", "Workforce", "Outreach", "Organizational Capacity"].map(item => <span key={item}>{item}</span>)}</div></Section>
    <Section id="inquiry"><div className="form-shell"><div><p className="eyebrow dark">Partner inquiry</p><h2>Start a conversation.</h2><p>Your inquiry will be addressed to Mr. Lee C. Wallace, Founder of {ORG}.</p><div className="contact-note"><a href={`mailto:${LINKS.founderEmail}`}><strong>{LINKS.founderEmail}</strong></a><a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a></div></div><SimpleInquiryForm partner /></div></Section>
    <FinalCta />
  </>;
}

function StoriesPage() {
  return <>
    <Hero compact eyebrow={`Stories & Vision from ${ORG}`} title="Behind the mission. Beyond the moment." body="Explore organizational milestones, service priorities and verified stories that show how USS is building capacity for the future." slides={[{ src: MEDIA.storiesHeroCommunity, alt: "Veterans and community members gathered in connection" }, { src: MEDIA.storiesHeroVeteran, alt: "A veteran standing with the United States flag" }]} primary={["Explore Stories & Vision", "#stories"]} secondary={["Support the work", "/donate"]} />
    <Section id="stories"><SectionHead eyebrow="Stories & Vision" title="Milestones, priorities and pathways." copy="Explore organizational milestones, service priorities and verified stories that show how USS is building capacity for the future." /><CardGrid columns={3} items={[{ kicker: "Our history", title: "From One Home to a Community Vision", copy: "How service since 2018 shaped a planned Campus and scalable-model vision.", href: "/about" }, { kicker: "The model", title: "How connected support becomes a stronger pathway", copy: "Why developing housing pathways, transportation, learning and practical guidance belong in the same conversation.", href: "/our-work" }, { kicker: "Campus vision", title: "What a community Campus is intended to make possible", copy: "A practical, phased vision for housing, services, learning, workforce and connection as resources become available.", href: "/campus" }, { kicker: "Partnership", title: "Building capacity through shared purpose", copy: "How responsible partnerships can strengthen services today and infrastructure tomorrow.", href: "/partner" }, { kicker: "Service spotlight", title: "Mobility is part of stability", copy: "Transportation can connect people to work, learning, care and daily essentials.", href: "/our-work/bridge-to-stability" }, { kicker: "Service spotlight", title: "Technology as a bridge to opportunity", copy: "Digital access and guidance can support learning, employment and connection.", href: "/our-work/bridge-to-stability" }]} /></Section>
    <FinalCta />
  </>;
}

function ContactPage() {
  return <>
    <Hero compact eyebrow={`Contact ${ORG}`} title="Let’s connect around the next right step." body="Contact USS about donations, major gifts, partnerships, volunteering or in-kind support." slides={[{ src: MEDIA.contactHeroOutreach, alt: "Community outreach and direct support" }, { src: MEDIA.contactHeroTechnology, alt: "A technology learning session for community members" }]} primary={["Send an inquiry", "#contact-form"]} secondary={["Ways to give", "/ways-to-give"]} />
    <Section><div className="contact-grid"><article><p className="eyebrow dark">Address</p><h3>Mailing & contact</h3><ExternalLink href={LINKS.maps}>{LINKS.addressLineOne}<br />{LINKS.addressLineTwo}</ExternalLink></article><article><p className="eyebrow dark">Phone</p><h3>Call {ORG}</h3><a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a></article><article><p className="eyebrow dark">General email</p><h3>Organizational contact</h3><a href={`mailto:${LINKS.infoEmail}`}>{LINKS.infoEmail}</a></article><article><p className="eyebrow dark">Website inquiries</p><h3>Mr. Lee C. Wallace · Founder</h3><a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a></article></div></Section>
    <Section tone="navy"><SectionHead eyebrow="Contact & Follow" title="Stay connected with USS." copy="Follow current USS updates on the approved Facebook and Instagram channels." /><div className="contact-socials"><SocialLinks includeLinkedin={false} /><ExternalLink href={LINKS.facebook}>Facebook <Arrow /></ExternalLink><ExternalLink href={LINKS.instagram}>Instagram <Arrow /></ExternalLink></div></Section>
    <Section tone="mist" id="contact-form"><div className="form-shell"><div><p className="eyebrow dark">Send an inquiry</p><h2>We’d like to hear from you.</h2><p>{ORG} serves within multiple communities in San Antonio and other cities.</p><div className="contact-note"><a href={LINKS.phoneHref}><strong>{LINKS.phoneDisplay}</strong></a><span>{LINKS.addressLineOne}<br />{LINKS.addressLineTwo}</span></div></div><SimpleInquiryForm /></div></Section>
  </>;
}

function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  return <>
    <Hero compact eyebrow={privacy ? "Privacy policy" : "Terms of use"} title={privacy ? "Privacy, explained clearly." : "Clear terms build trust."} body={`${ORG} provides this information so website visitors can understand how this site, inquiries and third-party giving links work.`} primary={["Contact us", "/contact"]} secondary={["Home", "/"]} />
    <Section><article className="legal-copy"><p className="eyebrow dark">Effective August 18, 2026</p><h2>{privacy ? `Privacy Policy for ${ORG}` : `Terms of Use for ${ORG}`}</h2>{privacy ? <>
      <p>{ORG} respects the privacy of website visitors, donors, partners and community members. This policy describes the information involved when you use this website.</p>
      <h3>Information you choose to provide</h3><p>Contact and partnership forms on this website prepare an email in your own email application. Information you enter may include your name, email address, organization, inquiry topic and message. The website does not automatically submit or store that message; you choose whether to send it through your email provider.</p>
      <h3>Donations and needed items</h3><p>Financial gifts and needed-item purchases are completed on third-party websites including Zeffy, PayPal, Cash App, Venmo and Amazon. Those providers process information under their own privacy policies and terms. {ORG} does not receive your payment-card information through this website.</p>
      <h3>How information may be used</h3><p>Information sent directly to {ORG} may be used to respond to inquiries, communicate about giving or partnerships, maintain appropriate organizational records and protect the organization and website.</p>
      <h3>Your choices and questions</h3><p>You may choose not to send an inquiry or follow an external link. For privacy questions, email <a href={`mailto:${LINKS.infoEmail}`}>{LINKS.infoEmail}</a> or call <a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a>.</p>
    </> : <>
      <p>By using this website, you agree to use it lawfully and understand the following terms.</p>
      <h3>Information and availability</h3><p>This website describes the mission, current direction and future plans of {ORG}. Program, property, campaign and service information may change as funding, approvals, partnerships and organizational capacity develop. Website content does not guarantee eligibility, availability, outcomes or timelines.</p>
      <h3>Donations and external services</h3><p>Donations and needed-item purchases are completed through third-party providers. Their terms, fees, security practices and privacy policies apply when you leave this website. Donor restrictions are effective only when formally accepted by {ORG}. Consult your own advisor regarding legal or tax matters.</p>
      <h3>Acceptable use</h3><p>Do not interfere with the website, attempt unauthorized access, submit unlawful material or misuse the name, logo, content or contact information of {ORG}.</p>
      <h3>Content and trademarks</h3><p>Unless otherwise noted, organizational text, branding and the {ORG} logo displayed on this website may not be reproduced for commercial use without permission. Licensed photography remains subject to its source terms.</p>
      <h3>Questions</h3><p>For questions about these terms, email <a href={`mailto:${LINKS.infoEmail}`}>{LINKS.infoEmail}</a> or write to {LINKS.addressLineOne}, {LINKS.addressLineTwo}.</p>
    </>}</article></Section>
  </>;
}

function FaqItem({ question, children, index }: { question: string; children: ReactNode; index: number }) {
  const [open, setOpen] = useState(false);
  const answerId = `daf-faq-answer-${index}`;
  return <article className={`faq-item ${open ? "is-open" : ""}`}><h3><button type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpen(value => !value)}><span>{question}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button></h3><div id={answerId} className="faq-answer" hidden={!open}>{children}</div></article>;
}

function DafEndowmentPage() {
  return <>
    <Hero compact eyebrow="Donor-Advised Fund & Endowment Giving" title="Sustaining Stability. Advancing Dignity. Building the Future." body="Support long-term charitable impact for families facing homelessness through USS’s Donor-Advised Fund and Endowment. Advance sustainable giving today." primary={["Support the USS Donor-Advised Fund", LINKS.daf]} secondary={["Invest in the USS Endowment & Legacy Fund", LINKS.endowment]} />
    <Section><SectionHead eyebrow="A legacy of impact" title="A Legacy of Impact—Managed by United Social Services Inc. (USS)" copy="USS focuses on sustainable responses to homelessness, poverty and community instability. The USS Donor-Advised Fund and Endowment provide structured, long-term charitable giving options intended to strengthen essential services, developing housing pathways and organizational sustainability." /><div className="long-term-grid"><Reveal><article className="long-term-card"><h3>USS Donor-Advised Fund (DAF) for Long-Term Impact</h3><p>The USS Donor-Advised Fund supports USS exclusively. Donors may provide advisory input about timing and internal allocation; USS reviews recommendations and retains appropriate legal control and discretion so contributions remain aligned with its mission, governance and applicable law.</p><ul><li>Support USS housing stability initiatives and essential services</li><li>Contribute to mission-aligned outreach initiatives</li><li>Participate in long-term community impact planning</li><li>Encourage ethical and efficient stewardship</li><li>Align charitable giving with USS strategic priorities</li></ul><Button href={LINKS.daf}>Support the USS Donor-Advised Fund</Button></article></Reveal><Reveal delay={100}><article className="long-term-card"><h3>USS Endowment: Sustainable Giving for the Future</h3><p>The USS Endowment &amp; Legacy Fund is designed to strengthen USS’s long-term financial sustainability and support mission impact over time.</p><ul><li>Sustainable housing initiatives</li><li>Mobile and community-based outreach programs</li><li>Essential services</li><li>Organizational growth and resilience</li><li>Future program expansion and infrastructure</li></ul><Button href={LINKS.endowment}>Invest in the USS Endowment &amp; Legacy Fund</Button></article></Reveal></div></Section>
    <Section tone="navy"><SectionHead eyebrow="Stewardship" title="Why USS-Managed Giving Matters" copy="USS-managed giving centers mission alignment, transparency, accountability, ethical stewardship, flexible response, efficient use of resources and organizational discipline. It does not promise investment returns." /><div className="chip-list large inverse">{["Mission alignment", "Transparency", "Accountability", "Ethical stewardship", "Flexible response", "Efficient resources", "Organizational discipline"].map(item => <span key={item}>{item}</span>)}</div></Section>
    <Section tone="mist"><SectionHead eyebrow="Strategic impact" title="Strategic Impact Areas Supported by USS Giving" copy="Contributions may support mission-aligned priorities, subject to USS governance, financial capacity and formally accepted donor restrictions." /><CardGrid columns={3} items={dafImpactAreas} /></Section>
    <Section><SectionHead eyebrow="Future Campus Vision" title="Future Campus Vision: Expanding Access and Stability" copy="Building for Generations" /><div className="daf-campus"><h3>The planned USS Campus is intended to support coordinated access and long-term stability.</h3><p>USS is working toward future infrastructure that may connect developing housing pathways, essential services, education, workforce development, life-skills training and community collaboration. Future facilities depend on resources, governance, financial capacity, approvals and mission priorities.</p><div className="hero-actions"><Button href="/campus" variant="teal">Explore the Campus Vision</Button><Button href={LINKS.endowment}>Support Long-Term Impact</Button></div></div></Section>
    <Section tone="mist"><div className="daf-give-grid"><div><SectionHead eyebrow="How to give" title="How to Give to the USS DAF & Endowment" copy="Your gift helps strengthen support now and in the future." /><ul className="check-list"><li>One-time charitable donations</li><li>Recurring giving commitments</li><li>Legacy or planned giving</li><li>Foundation or corporate partnerships</li></ul><p>Direct charitable contributions may be completed through USS’s giving forms. Recommendations from donor-advised funds held at external institutions must be submitted through the donor’s DAF provider.</p></div><aside className="contact-card"><p className="eyebrow dark">Point of contact</p><h3>Mr. Lee C. Wallace</h3><a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a><a href={`mailto:${LINKS.infoEmail}`}>{LINKS.infoEmail}</a><a href={LINKS.phoneHref}>{LINKS.phoneDisplay}</a><Button href={`mailto:${LINKS.founderEmail}`} variant="teal">Discuss Legacy Giving</Button></aside></div></Section>
    <Section><SectionHead eyebrow="Questions" title="Frequently Asked Questions" /><div className="faq-list"><FaqItem index={0} question="What is the USS Donor-Advised Fund?"><p>A structured charitable giving option that allows donors to provide advisory input while USS ensures mission alignment, ethical stewardship and nonprofit compliance.</p></FaqItem><FaqItem index={1} question="What is the USS Endowment?"><p>A long-term fund designed to provide ongoing support for USS programs, operations and community impact.</p></FaqItem><FaqItem index={2} question="Can my gift support future Campus or facility development?"><p>Yes. USS may strategically apply funds to future infrastructure initiatives that strengthen mission delivery, subject to governance, financial capacity, approvals and mission priorities.</p></FaqItem><FaqItem index={3} question="Do donors control how funds are spent?"><p>No. USS retains full discretion and authority to allocate charitable contributions in accordance with applicable law while considering donor recommendations.</p></FaqItem><FaqItem index={4} question="Is my contribution tax-deductible?"><p>USS is a tax-exempt 501(c)(3) nonprofit corporation. Donors should consult a tax advisor for guidance specific to their situation.</p></FaqItem><FaqItem index={5} question="How can I discuss long-term or legacy giving?"><p>Contact Lee C. Wallace at <a href={`mailto:${LINKS.founderEmail}`}>{LINKS.founderEmail}</a> or <a href={LINKS.phoneHref}>210-245-8780</a> for a confidential conversation about strategic or legacy contributions.</p></FaqItem></div></Section>
    <Section tone="navy"><div className="legal-transparency"><p className="eyebrow">Legal & transparency</p><h2>Legal & Transparency Statement</h2><p>United Social Services Inc. (USS) is a tax-exempt 501(c)(3) nonprofit corporation. EIN: 82-5444257. Contributions to the USS Donor-Advised Fund and Endowment are administered under USS governance policies. USS retains full legal control and discretion over contributed assets and allocates funds to advance its mission, support sustainability and respond to future opportunities in accordance with applicable law.</p><p>Donors should consult their own tax advisor regarding the deductibility and tax treatment of charitable contributions.</p></div></Section>
    <FinalCta />
  </>;
}

function NotFoundPage() { return <Hero compact eyebrow="Page not found" title="That pathway isn’t here—yet." body={`Return home or explore the work ${ORG} is building for today and tomorrow.`} primary={["Return home", "/"]} secondary={["Explore our work", "/our-work"]} />; }

function RouteContent({ path }: { path: string }) {
  const pages: Record<string, ReactNode> = { "/": <HomePage />, "/about": <AboutPage />, "/our-work": <OurWorkPage />, "/our-work/pathways-to-home": <PathwaysPage />, "/our-work/bridge-to-stability": <BridgePage />, "/campus": <CampusPage />, "/impact": <ImpactPage />, "/ways-to-give": <WaysToGivePage />, "/donate": <DonatePage />, "/major-gifts": <MajorGiftsPage />, "/daf-endowment": <DafEndowmentPage />, "/partner": <PartnerPage />, "/stories": <StoriesPage />, "/contact": <ContactPage />, "/privacy": <LegalPage type="privacy" />, "/terms": <LegalPage type="terms" /> };
  return pages[path] ?? <NotFoundPage />;
}

export default function Site() {
  const pathname = usePathname();
  const path = useMemo(() => (pathname || "/").replace(/\/$/, "") || "/", [pathname]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [path]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><RouteContent path={path} /></main><Footer /></>;
}
