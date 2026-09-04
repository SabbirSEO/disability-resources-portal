import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  ChevronDown,
  FileText,
  Gavel,
  HeartPulse,
  Menu,
  MonitorSmartphone,
  MoveRight,
  Search,
  Settings2,
  ShieldCheck,
  TrainFront,
  CircleHelp,
  X,
  type LucideIcon,
} from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";

const queryClient = new QueryClient();

type HelpTopic = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Resource = {
  name: string;
  description: string;
  category: string;
  organization: string;
};

const navigation = [
  "Getting Started",
  "Disabling Conditions",
  "Disability Benefits",
  "Categories",
  "Site Index",
];

const helpTopics: HelpTopic[] = [
  { title: "Disability Benefits", description: "Understand eligibility, applications, and the benefits available to you.", icon: ShieldCheck },
  { title: "Healthcare", description: "Find health coverage, accessible care, and condition-specific support.", icon: HeartPulse },
  { title: "Employment", description: "Explore job support, workplace rights, and vocational services.", icon: BriefcaseBusiness },
  { title: "Education", description: "Locate school services, accommodations, and transition planning.", icon: BookOpen },
  { title: "Accessibility", description: "Learn about accommodations, accessible housing, and daily living.", icon: Accessibility },
  { title: "Assistive Technology", description: "Discover tools and funding that support independence.", icon: MonitorSmartphone },
  { title: "Legal Rights", description: "Get clear information about civil rights and advocacy.", icon: Gavel },
  { title: "Transportation", description: "Find paratransit, travel training, and accessible transit options.", icon: TrainFront },
];

const categories = [
  "Advocacy & Legal Rights",
  "Disability Benefits",
  "Disabling Conditions",
  "Education",
  "Employment",
  "Healthcare",
  "Assistive Technology",
  "Children & Families",
  "Transportation",
  "Recreation & Sports",
  "State Services",
];

const resources: Resource[] = [
  {
    name: "Disability Information and Access Line",
    description: "Personalized help connecting people with disabilities to local services and supports.",
    category: "State Services",
    organization: "Administration for Community Living",
  },
  {
    name: "Centers for Independent Living",
    description: "Find peer-led services that help people live independently in their communities.",
    category: "Advocacy & Legal Rights",
    organization: "National Council on Independent Living",
  },
  {
    name: "Benefits.gov Disability Assistance",
    description: "A starting point for exploring federal and state disability benefit programs.",
    category: "Disability Benefits",
    organization: "U.S. Government",
  },
  {
    name: "Job Accommodation Network",
    description: "Practical guidance on workplace accommodations and disability employment.",
    category: "Employment",
    organization: "U.S. Department of Labor",
  },
];

const footerLinks = [
  "Categories",
  "Getting Started",
  "Disability Benefits",
  "Disabling Conditions",
  "Site Index",
  "About",
  "Contact",
  "Accessibility",
  "Privacy",
];

const slug = (label: string) => label.toLowerCase().replaceAll(" ", "-").replaceAll("&", "");

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const words = query.trim().split(/\s+/).filter(Boolean).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${words.join("|")})`, "ig"));
  return (
    <>
      {parts.map((part, index) =>
        words.some((word) => part.toLowerCase() === word.replaceAll("\\", "").toLowerCase()) ? (
          <mark key={`${part}-${index}`} className="rounded-sm bg-[#f2c5ae] px-0.5 text-inherit">{part}</mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-3 no-underline" aria-label="DisabilityResources.org home" data-testid={`${footer ? "footer" : "header"}-home-link`}>
      <span className={`brand-mark ${footer ? "bg-[#d1844f] text-[#233337]" : ""}`}><Accessibility size={footer ? 20 : 23} strokeWidth={2.5} aria-hidden="true" /></span>
      <span>
        <span className="brand-name"><span>Disability</span><span>Resources</span><span className="text-[#d1844f]">.org</span></span>
        <span className="brand-tagline">Information you can trust</span>
      </span>
    </a>
  );
}

function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const focusSearch = () => document.getElementById("resource-search")?.focus();
  return (
    <header className="portal-header">
      <div className="portal-container flex items-center justify-between py-5">
        <Brand />
        <nav className="portal-nav hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a href={`#${slug(item)}`} key={item} data-testid={`link-primary-${slug(item)}`}>{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" onClick={focusSearch} className="search-trigger hidden sm:inline-flex" data-testid="button-focus-search">
            <Search size={16} aria-hidden="true" /> Search
          </button>
          <button
            type="button"
            className="menu-trigger lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav lg:hidden" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a href={`#${slug(item)}`} onClick={() => setMenuOpen(false)} key={item} data-testid={`link-mobile-${slug(item)}`}>{item}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function TopicLink({
  topic,
  onChoose,
}: {
  topic: HelpTopic;
  onChoose: (topic: string) => void;
}) {
  const TopicIcon = topic.icon;
  return (
    <a href="#featured-resources" className="topic-link" onClick={() => onChoose(topic.title)} data-testid={`link-help-topic-${slug(topic.title)}`}>
      <span className="topic-icon"><TopicIcon size={20} aria-hidden="true" /></span>
      <span>
        <strong className="topic-title">{topic.title}</strong>
        <span className="topic-description">{topic.description}</span>
      </span>
    </a>
  );
}

const gettingStartedSteps = [
  {
    number: "01",
    title: "Start with your need",
    description: "Choose a topic that matches what you need help with, from benefits and healthcare to work and education.",
    icon: CircleHelp,
    link: "#categories",
    linkLabel: "Browse topics",
  },
  {
    number: "02",
    title: "Prepare your questions",
    description: "Write down what you need, important dates, and any documents or decisions you want to discuss.",
    icon: FileText,
    link: "#accessibility",
    linkLabel: "View accessibility options",
  },
  {
    number: "03",
    title: "Connect and follow up",
    description: "Reach out to a trusted organization, ask about next steps, and keep a record of who you spoke with.",
    icon: ClipboardCheck,
    link: "#featured-resources",
    linkLabel: "Find a trusted resource",
  },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [resourceCategory, setResourceCategory] = useState("All resources");
  const [mainQuery, setMainQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [resourceStatus, setResourceStatus] = useState("");
  const [settings, setSettings] = useState({
    largeText: false,
    contrast: false,
    reduceMotion: false,
    underline: false,
  });

  const searchQuery = submitted.trim().toLowerCase();
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = resourceCategory === "All resources" || resource.category === resourceCategory;
      const searchable = `${resource.name} ${resource.description} ${resource.category} ${resource.organization}`.toLowerCase();
      return matchesCategory && (!searchQuery || searchable.includes(searchQuery));
    });
  }, [resourceCategory, searchQuery]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };
  const chooseTopic = (topic: string) => {
    const matchingCategory = categories.find((category) => category.toLowerCase().includes(topic.toLowerCase()));
    if (matchingCategory) setResourceCategory(matchingCategory);
    setResourceStatus(`${topic} resources are ready below.`);
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = mainQuery.trim();
    setSubmitted(query);
    setResourceStatus(query ? `Showing resources related to “${query}”.` : "Showing all featured resources.");
    document.getElementById("featured-resources")?.scrollIntoView({ behavior: settings.reduceMotion ? "auto" : "smooth" });
  };
  const resetSettings = () => setSettings({ largeText: false, contrast: false, reduceMotion: false, underline: false });

  const shellClasses = [
    "portal-shell",
    settings.largeText ? "portal-large-text" : "",
    settings.contrast ? "portal-contrast" : "",
    settings.reduceMotion ? "portal-motion-reduced" : "",
    settings.underline ? "link-underline" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClasses}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#233337] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[#f7f8f5]" data-testid="link-skip-main">Skip to Main Content</a>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="portal-container hero-inner">
            <p className="eyebrow">A starting point for finding support</p>
            <h1 id="hero-heading" className="hero-title display-font">Find Disability<br /><em>Resources and Information</em></h1>
            <p className="hero-copy">Explore trusted resources for disability services, benefits, healthcare, employment, education, accessibility, and more.</p>
            <form className="search-form" onSubmit={submitSearch} role="search">
              <label className="sr-only" htmlFor="resource-search">Search disability resources</label>
              <div className="search-input-wrap">
                <Search size={19} aria-hidden="true" />
                <input id="resource-search" type="search" value={mainQuery} onChange={(event) => setMainQuery(event.target.value)} placeholder="Search disability resources..." data-testid="input-primary-search" />
              </div>
              <button type="submit" className="primary-button" data-testid="button-primary-search">Search</button>
            </form>
            {submitted !== "" && (
              <p className="search-status" role="status" data-testid="status-primary-search">
                {submitted ? `Showing a starting point for “${submitted}”. Try a category below to narrow your search.` : "Showing all featured resources. Try a category below to narrow your search."}
              </p>
            )}
          </div>
        </section>

        <section className="portal-container quick-links" aria-labelledby="quick-links-heading">
          <h2 id="quick-links-heading" className="sr-only">Quick links</h2>
         {["Disability Benefits", "Getting Started", "Disabling Conditions", "Accessibility", "Find a Resource"].map((link, index) => (
            <a href={index === 4 ? "#featured-resources" : `#${slug(link)}`} className="quick-link" key={link} data-testid={`link-quick-${slug(link)}`}>
              {link}<MoveRight size={16} aria-hidden="true" />
            </a>
          ))}
        </section>

        <section className="portal-container section" aria-labelledby="help-heading">
          <div className="heading-row">
            <div>
              <p className="eyebrow accent-eyebrow">Start here</p>
              <h2 id="help-heading" className="section-heading">How Can We Help?</h2>
            </div>
            <a href="#categories" className="text-link" data-testid="link-browse-all-topics">Browse all topics <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="topic-grid">
            {helpTopics.map((topic) => <TopicLink topic={topic} onChoose={chooseTopic} key={topic.title} />)}
          </div>
        </section>

        <section id="categories" className="directory-band section" aria-labelledby="directory-heading">
          <div className="portal-container">
            <span id="disabling-conditions" className="scroll-anchor" aria-hidden="true" />
            <p className="eyebrow">Explore by topic</p>
            <h2 id="directory-heading" className="section-heading">Browse Disability Resources</h2>
            <p className="section-intro">Organized information for the questions people ask most often.</p>
            <div className="category-grid">
              {categories.map((category, index) => (
                <a
                  href="#featured-resources"
                  className="category-link"
                  key={category}
                  onClick={() => { setResourceCategory(category); setResourceStatus(`Showing ${category} resources.`); }}
                  data-testid={`link-category-${slug(category)}`}
                >
                  <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
                  {category}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="getting-started" className="getting-started section" aria-labelledby="getting-started-heading">
          <div className="portal-container">
            <div className="getting-started-heading">
              <p className="eyebrow accent-eyebrow">A simple way forward</p>
              <h2 id="getting-started-heading" className="section-heading">Not Sure Where to Begin?</h2>
              <p className="section-intro">You do not have to figure everything out at once. Use these steps to find a starting point and feel more prepared when asking for support.</p>
            </div>
            <div className="getting-started-grid">
              {gettingStartedSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <article className="getting-started-card" key={step.number}>
                    <div className="getting-started-card-top">
                      <span className="getting-started-number">{step.number}</span>
                      <span className="getting-started-icon"><StepIcon size={21} aria-hidden="true" /></span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <a href={step.link} className="text-link" data-testid={`link-getting-started-${slug(step.title)}`}>
                      {step.linkLabel} <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="featured-resources" className="featured section" aria-labelledby="featured-heading">
          <div className="portal-container">
            <span id="disability-benefits" className="scroll-anchor" aria-hidden="true" />
            <div className="featured-toolbar">
              <div>
                <p className="eyebrow">A few trusted places to begin</p>
                <h2 id="featured-heading" className="section-heading">Featured Resources</h2>
              </div>
              <label className="filter-label" htmlFor="resource-category-filter">
                Filter by category
                <select id="resource-category-filter" className="filter-select" value={resourceCategory} onChange={(event) => setResourceCategory(event.target.value)} data-testid="select-resource-category">
                  <option>All resources</option>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            </div>
            <div className="resource-grid" data-testid="list-featured-resources">
              {filteredResources.map((resource) => (
                <article className="resource-card surface" key={resource.name} data-testid={`card-resource-${slug(resource.name)}`}>
                  <div className="resource-meta"><span><HighlightedText text={resource.category} query={submitted} /></span><span className="resource-trust">Trusted guide</span></div>
                  <h3 className="resource-title"><HighlightedText text={resource.name} query={submitted} /></h3>
                  <p className="resource-description"><HighlightedText text={resource.description} query={submitted} /></p>
                  <div className="resource-footer">
                    <span className="resource-org">{resource.organization}</span>
                    <button type="button" className="resource-action" onClick={() => setResourceStatus(`${resource.name} selected. Resource details are ready to explore.`)} data-testid={`button-view-resource-${slug(resource.name)}`}>
                      View Resource <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {filteredResources.length === 0 && (
              <p className="state-empty" role="status" data-testid="empty-featured-resources">No featured resources match that search or category. Try another search.</p>
            )}
            {resourceStatus && <p className="resource-status" role="status" data-testid="status-resource-action">{resourceStatus}</p>}
          </div>
        </section>

        <section id="accessibility" className="portal-container accessibility-section" aria-label="Accessibility controls">
          <div className="accessibility-wrap">
            <button type="button" className="access-trigger" onClick={() => setAccessOpen(!accessOpen)} aria-expanded={accessOpen} aria-controls="accessibility-options" data-testid="button-accessibility-options">
              <Settings2 size={17} aria-hidden="true" /> Accessibility Options <ChevronDown size={15} className={accessOpen ? "rotate-180" : ""} aria-hidden="true" />
            </button>
            {accessOpen && (
              <div id="accessibility-options" className="access-panel" role="region" aria-label="Accessibility Options">
                <div className="access-header">
                  <h2 className="access-heading">Accessibility Options</h2>
                  <button type="button" className="reset-button" onClick={resetSettings} data-testid="button-reset-settings">Reset settings</button>
                </div>
                {[
                  ["largeText", "Increase text size"],
                  ["contrast", "High contrast"],
                  ["reduceMotion", "Reduce motion"],
                  ["underline", "Underline links"],
                ].map(([key, label]) => (
                  <label className="option-row" key={key} htmlFor={`setting-${key}`}>
                    {label}
                    <input id={`setting-${key}`} type="checkbox" checked={settings[key as keyof typeof settings]} onChange={() => toggleSetting(key as keyof typeof settings)} data-testid={`checkbox-setting-${key}`} />
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer id="site-index" className="portal-footer">
        <div className="portal-container footer-inner">
          <div className="footer-layout">
            <div className="footer-brand">
              <Brand footer />
              <p className="footer-copy">Clear, trustworthy information to help people find the support they need.</p>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              {footerLinks.map((item) => (
                <a href={item === "Accessibility" ? "#accessibility" : `#${slug(item)}`} key={item} data-testid={`link-footer-${slug(item)}`}>{item}</a>
              ))}
            </nav>
          </div>
          <p className="footer-note">Information is for general guidance and is not a substitute for professional advice.</p>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;