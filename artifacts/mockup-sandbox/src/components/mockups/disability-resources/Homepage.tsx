import { useMemo, useState } from "react";
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Gavel,
  HeartPulse,
  Menu,
  MonitorSmartphone,
  MoveRight,
  Search,
  Settings2,
  ShieldCheck,
  TrainFront,
  X,
} from "lucide-react";

type Icon = typeof Accessibility;

const helpTopics: { title: string; description: string; icon: Icon }[] = [
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
  "Advocacy & Legal Rights", "Disability Benefits", "Disabling Conditions", "Education",
  "Employment", "Healthcare", "Assistive Technology", "Children & Families",
  "Transportation", "Recreation & Sports", "State Services",
];

const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

const resources = [
  { name: "Disability Information and Access Line", description: "Personalized help connecting people with disabilities to local services and supports.", category: "State Services", organization: "Administration for Community Living" },
  { name: "Centers for Independent Living", description: "Find peer-led services that help people live independently in their communities.", category: "Advocacy & Legal Rights", organization: "National Council on Independent Living" },
  { name: "Benefits.gov Disability Assistance", description: "A starting point for exploring federal and state disability benefit programs.", category: "Disability Benefits", organization: "U.S. Government" },
  { name: "Job Accommodation Network", description: "Practical guidance on workplace accommodations and disability employment.", category: "Employment", organization: "U.S. Department of Labor" },
];

export function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");
  const [resourceCategory, setResourceCategory] = useState("All resources");
  const [mainQuery, setMainQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [settings, setSettings] = useState({ largeText: false, contrast: false, reduceMotion: false, underline: false });

  const filteredStates = useMemo(() => states.filter((state) => state.toLowerCase().includes(stateQuery.toLowerCase())), [stateQuery]);
  const filteredResources = useMemo(() => resourceCategory === "All resources" ? resources : resources.filter((r) => r.category === resourceCategory), [resourceCategory]);
  const toggle = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className={`${settings.largeText ? "text-[17px]" : "text-[16px]"} ${settings.contrast ? "contrast-more" : ""} ${settings.underline ? "links-underlined" : ""} ${settings.reduceMotion ? "motion-reduced" : ""} min-h-[100dvh] bg-[#f7f8f5] text-[#233337]`} style={{ fontFamily: "'DM Sans', ui-sans-serif, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@500;600;700&display=swap');
        .display { font-family: 'Source Serif 4', Georgia, serif; }
        .focus-ring:focus-visible, button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #d1844f; outline-offset: 3px; }
        .contrast-more { filter: contrast(1.18); background: #fff; }
        .contrast-more .soft-panel { background: #fff; border-color: #233337; }
        .links-underlined a, .links-underlined button { text-decoration: underline; text-underline-offset: 3px; }
        .motion-reduced *, .motion-reduced *::before, .motion-reduced *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; scroll-behavior: auto !important; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
      `}</style>
      <a href="#main-content" className="focus-ring sr-only absolute left-4 top-4 z-50 rounded-md bg-[#233337] px-4 py-3 text-sm font-bold text-white focus:not-sr-only">Skip to Main Content</a>

      <header className="border-b border-[#d8dfd8] bg-[#f7f8f5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <a href="#" className="focus-ring flex items-center gap-3" aria-label="DisabilityResources.org home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#236b63] text-white"><Accessibility size={23} strokeWidth={2.5} /></span>
            <span className="leading-none"><span className="block text-[18px] font-bold tracking-[-.03em] text-[#233337]">Disability<span className="text-[#236b63]">Resources</span><span className="text-[#d1844f]">.org</span></span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.16em] text-[#637477]">Information you can trust</span></span>
          </a>
          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-[#45585b] lg:flex" aria-label="Primary navigation">
            {["State Services", "Disabling Conditions", "Disability Benefits", "Categories", "Site Index"].map((item) => <a className="focus-ring transition-colors hover:text-[#236b63]" href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>{item}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => document.getElementById("resource-search")?.focus()} className="focus-ring hidden items-center gap-2 rounded-md border border-[#b8c7c3] px-3 py-2 text-sm font-bold text-[#236b63] hover:bg-[#eaf1ee] sm:flex"><Search size={17} /> Search</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus-ring rounded-md p-2 text-[#236b63] lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-[#d8dfd8] px-5 py-3 lg:hidden" aria-label="Mobile navigation">{["State Services", "Disabling Conditions", "Disability Benefits", "Categories", "Site Index"].map((item) => <a onClick={() => setMenuOpen(false)} className="focus-ring block border-b border-[#e1e6e1] py-3 text-sm font-semibold" href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>{item}</a>)}</nav>}
      </header>

      <main id="main-content">
        <section className="border-b border-[#d8dfd8] bg-[#e6f0eb]">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#236b63]">A starting point for finding support</p>
              <h1 className="display text-5xl leading-[1.05] tracking-[-.035em] text-[#233337] sm:text-6xl lg:text-[76px]">Find Disability<br /><span className="text-[#236b63]">Resources and Information</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#45585b]">Explore trusted resources for disability services, benefits, healthcare, employment, education, accessibility, and more.</p>
              <form className="mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSubmitted(mainQuery || "all disability resources"); }}>
                <label className="sr-only" htmlFor="resource-search">Search disability resources</label>
                <div className="flex min-h-14 flex-1 items-center gap-3 rounded-md border-2 border-[#236b63] bg-white px-4 shadow-[0_3px_0_#b7cec5]"><Search size={21} className="shrink-0 text-[#236b63]" /><input id="resource-search" value={mainQuery} onChange={(e) => setMainQuery(e.target.value)} className="w-full bg-transparent text-base text-[#233337] outline-none placeholder:text-[#78888a]" placeholder="Search disability resources..." /></div>
                <button className="focus-ring min-h-14 rounded-md bg-[#236b63] px-8 font-bold text-white transition-colors hover:bg-[#18564f]">Search</button>
              </form>
              {submitted && <p className="mt-3 text-sm font-semibold text-[#236b63]" role="status">Showing a starting point for “{submitted}”. Try a category below to narrow your search.</p>}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-10" aria-labelledby="quick-links-heading">
          <h2 id="quick-links-heading" className="sr-only">Quick links</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{["Disability Benefits", "State Services", "Disabling Conditions", "Accessibility", "Find a Resource"].map((link, i) => <a href={i === 4 ? "#featured-resources" : `#${link.toLowerCase().replaceAll(" ", "-")}`} className="focus-ring flex min-h-14 items-center justify-between border-b-2 border-[#c9d7d1] px-2 py-3 text-sm font-bold text-[#236b63] hover:border-[#d1844f]" key={link}>{link}<MoveRight size={17} /></a>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16" aria-labelledby="help-heading">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#d1844f]">Start here</p><h2 id="help-heading" className="display text-4xl text-[#233337]">How Can We Help?</h2></div><a href="#categories" className="focus-ring hidden text-sm font-bold text-[#236b63] sm:flex sm:items-center sm:gap-2">Browse all topics <ArrowRight size={16} /></a></div>
          <div className="grid gap-x-10 gap-y-0 md:grid-cols-2 lg:grid-cols-4">{helpTopics.map(({ title, description, icon: TopicIcon }) => <a href="#featured-resources" key={title} className="focus-ring group flex gap-4 border-t border-[#d8dfd8] py-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#dcebe5] text-[#236b63]"><TopicIcon size={22} /></span><span><strong className="block text-[15px] text-[#233337] group-hover:text-[#236b63]">{title}</strong><span className="mt-1 block text-[13px] leading-5 text-[#637477]">{description}</span></span></a>)}</div>
        </section>

        <section id="categories" className="bg-[#eef1ec] py-14 lg:py-20" aria-labelledby="directory-heading">
          <div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="max-w-2xl"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#236b63]">Explore by topic</p><h2 id="directory-heading" className="display text-4xl text-[#233337]">Browse Disability Resources</h2><p className="mt-3 leading-7 text-[#637477]">Organized information for the questions people ask most often.</p></div><div className="mt-9 grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => <a href="#featured-resources" className="focus-ring flex items-center gap-3 border-t border-[#cbd7d0] py-4 text-[15px] font-semibold text-[#33484a] hover:text-[#236b63]" key={category}><span className="text-xs font-bold text-[#d1844f]">0{index + 1}</span>{category}<ArrowRight size={15} className="ml-auto text-[#9aa9a6]" /></a>)}</div></div>
        </section>

        <section id="state-services" className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24" aria-labelledby="state-heading">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.5fr] lg:gap-24"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#d1844f]">Local connections</p><h2 id="state-heading" className="display text-4xl leading-tight text-[#233337]">Find Disability Resources by State</h2><p className="mt-4 leading-7 text-[#637477]">State agencies and local organizations can help with benefits, services, and community support. Choose a state to begin.</p><a href="#site-index" className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#236b63]">What are state services? <ArrowRight size={16} /></a></div><div className="soft-panel rounded-md border border-[#cbd7d0] bg-[#fbfcf9] p-5 sm:p-7"><label htmlFor="state-search" className="mb-2 block text-sm font-bold text-[#233337]">Search the state directory</label><div className="flex items-center gap-3 border-b-2 border-[#236b63] pb-3"><Search size={19} className="text-[#236b63]" /><input id="state-search" value={stateQuery} onChange={(e) => setStateQuery(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-[#829091]" placeholder="Type a state name..." /><span className="text-xs text-[#637477]">{filteredStates.length} states</span></div><div className="mt-6 grid max-h-72 grid-cols-2 gap-x-8 overflow-y-auto pr-2 sm:grid-cols-3">{filteredStates.map((state) => <a href="#featured-resources" className="focus-ring border-b border-[#e1e6e1] py-2 text-sm font-semibold text-[#236b63] hover:text-[#d1844f]" key={state}>{state}</a>)}</div>{filteredStates.length === 0 && <p className="py-8 text-sm text-[#637477]">No state matches that search. Try another spelling.</p>}</div></div>
        </section>

        <section id="featured-resources" className="border-y border-[#d8dfd8] bg-[#e6f0eb] py-16 lg:py-20" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#236b63]">A few trusted places to begin</p><h2 id="featured-heading" className="display text-4xl text-[#233337]">Featured Resources</h2></div><label className="text-sm font-semibold text-[#45585b]">Filter by category<select value={resourceCategory} onChange={(e) => setResourceCategory(e.target.value)} className="focus-ring ml-3 rounded-md border border-[#b8c7c3] bg-white px-3 py-2 text-sm font-bold text-[#236b63]"><option>All resources</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label></div><div className="mt-9 grid gap-4 lg:grid-cols-2">{filteredResources.map((resource) => <article className="soft-panel border border-[#cbd7d0] bg-[#fbfcf9] p-6" key={resource.name}><div className="mb-5 flex items-start justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#d1844f]">{resource.category}</span><span className="text-xs text-[#637477]">Trusted guide</span></div><h3 className="display text-2xl text-[#233337]">{resource.name}</h3><p className="mt-3 text-sm leading-6 text-[#637477]">{resource.description}</p><div className="mt-6 flex items-center justify-between border-t border-[#e1e6e1] pt-4"><span className="text-xs font-semibold text-[#637477]">{resource.organization}</span><button onClick={() => setSubmitted(resource.name)} className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#236b63]">View Resource <ArrowRight size={15} /></button></div></article>)}</div></div>
        </section>

        <section id="accessibility" className="mx-auto max-w-7xl px-5 py-10 lg:px-10"><div className="relative"><button onClick={() => setAccessOpen(!accessOpen)} className="focus-ring flex min-h-12 items-center gap-3 rounded-md border border-[#b8c7c3] bg-white px-4 text-sm font-bold text-[#233337] hover:bg-[#eef1ec]" aria-expanded={accessOpen}><Settings2 size={18} className="text-[#236b63]" /> Accessibility Options <ChevronDown size={16} className={accessOpen ? "rotate-180" : ""} /></button>{accessOpen && <div className="absolute bottom-14 left-0 z-10 w-full max-w-sm rounded-md border border-[#9eb5ae] bg-[#fbfcf9] p-5 shadow-[0_8px_20px_rgba(35,51,55,.12)]"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Accessibility Options</h2><button onClick={() => setSettings({ largeText: false, contrast: false, reduceMotion: false, underline: false })} className="focus-ring text-xs font-bold text-[#236b63]">Reset settings</button></div>{[["largeText", "Increase text size"], ["contrast", "High contrast"], ["reduceMotion", "Reduce motion"], ["underline", "Underline links"]].map(([key, label]) => <label className="flex cursor-pointer items-center justify-between border-t border-[#e1e6e1] py-3 text-sm font-semibold" key={key}>{label}<input type="checkbox" checked={settings[key as keyof typeof settings]} onChange={() => toggle(key as keyof typeof settings)} className="h-5 w-5 accent-[#236b63]" /></label>)}</div>}</div></section>
      </main>

      <footer id="site-index" className="bg-[#233337] text-[#e7efeb]"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-10"><div className="flex flex-col justify-between gap-10 md:flex-row"><div className="max-w-xs"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#d1844f] text-[#233337]"><Accessibility size={20} /></span><span className="font-bold">DisabilityResources.org</span></div><p className="mt-4 text-sm leading-6 text-[#b8c7c3]">Clear, trustworthy information to help people find the support they need.</p></div><nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-[#d5e1dc] sm:grid-cols-3" aria-label="Footer navigation">{["Categories", "State Services", "Disability Benefits", "Disabling Conditions", "Site Index", "About", "Contact", "Accessibility", "Privacy"].map((item) => <a href={item === "Accessibility" ? "#accessibility" : `#${item.toLowerCase().replaceAll(" ", "-")}`} className="focus-ring hover:text-white" key={item}>{item}</a>)}</nav></div><div className="mt-12 border-t border-[#526465] pt-5 text-xs text-[#9eb0ad]">Information is for general guidance and is not a substitute for professional advice.</div></div></footer>
    </div>
  );
}