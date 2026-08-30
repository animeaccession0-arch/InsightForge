import { createContext, useContext, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, BookOpen, Box, Check, CheckCircle2,
  ChevronRight, CircleAlert, ClipboardCheck, CloudUpload, Database, Download, FileText,
  Flame, Gauge, Heart, History, Languages, LayoutDashboard, LineChart, Menu, MessageSquare,
  PackageSearch, Play, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles,
  Star, Tags, Target, TrendingDown, TrendingUp, Upload, Users, X, Zap, Network,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import { languageOptions, translate, type TranslationKey } from './translations';

const queryClient = new QueryClient();
const STORAGE = { activity: 'if-activity', datasets: 'if-datasets', reviews: 'if-reviews', language: 'if-language', locale: 'if-locale' };

type ActivityItem = { id: string; title: string; detail: string; time: string; color: 'aqua' | 'coral' | 'gold' };
type AnalysisResult = { rows: number; columns: string[]; numeric: string[]; text: string[]; quality: number; chart: number[]; preview: Record<string, string>[] };
type ModuleId = 'product-inspection' | 'predictive-vending' | 'heritage-qc' | 'academic-inbound' | 'multi-agent-routing';

const moduleInfo: Record<string, { label: string; eyebrow: string; description: string; icon: typeof Box; color: string; accent: string }> = {
  'product-inspection': { label: 'Product inspection', eyebrow: 'Quality intelligence', description: 'Spot pricing drift, missing attributes, and unusual product records before they become costly.', icon: PackageSearch, color: 'aqua', accent: 'an aqua signal for every shelf' },
  'predictive-vending': { label: 'Predictive vending', eyebrow: 'Demand intelligence', description: 'Turn machine sales into a sharper restock rhythm with fast-seller and stock-risk signals.', icon: Zap, color: 'coral', accent: 'keep the right shelves full' },
  'heritage-qc': { label: 'Heritage QC', eyebrow: 'Preservation intelligence', description: 'Review collection records for readiness, provenance gaps, and preservation priorities.', icon: ShieldCheck, color: 'gold', accent: 'care for what carries history' },
  'academic-inbound': { label: 'Academic inbound', eyebrow: 'Admissions intelligence', description: 'Organize applicant records and surface the patterns worth a closer read.', icon: Users, color: 'blue', accent: 'make the next conversation count' },
  'multi-agent-routing': { label: 'Multi-agent routing', eyebrow: 'Network intelligence', description: 'Model a live retail network and find the routes that protect inventory under pressure.', icon: Network, color: 'blue', accent: 'keep every handoff in motion' },
};
const utilityInfo = [
  { href: '/module/language-lab', label: 'Language lab', eyebrow: 'Practice room', description: 'Build the vocabulary of better decisions with short, useful lessons.', icon: BookOpen, color: 'coral', accent: 'make insight easier to share' },
  { href: '/module/csv-generator', label: 'CSV generator', eyebrow: 'Data utility', description: 'Forge realistic sample datasets for a fast first pass.', icon: FileText, color: 'blue', accent: 'start with something tangible' },
];

const demoActivity: ActivityItem[] = [
  { id: 'a1', title: 'Vending sample reviewed', detail: 'Predictive vending · 24 records', time: 'Today, 10:42', color: 'coral' },
  { id: 'a2', title: 'Product catalogue profiled', detail: 'Product inspection · 118 records', time: 'Yesterday, 16:18', color: 'aqua' },
  { id: 'a3', title: 'Heritage readiness checked', detail: 'Heritage QC · 42 records', time: 'Mon, 09:26', color: 'gold' },
];

const readStore = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
};
const writeStore = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
const recordActivity = (item: Omit<ActivityItem, 'id' | 'time'>) => {
  const existing = readStore<ActivityItem[]>(STORAGE.activity, []);
  writeStore(STORAGE.activity, [{ ...item, id: `${Date.now()}`, time: 'Just now' }, ...existing].slice(0, 12));
};

function cn(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(' '); }

function Button({ children, onClick, href, variant = 'primary', className, disabled, type = 'button', testId }: {
  children: ReactNode; onClick?: () => void; href?: string; variant?: 'primary' | 'quiet' | 'outline' | 'coral'; className?: string; disabled?: boolean; type?: 'button' | 'submit'; testId?: string;
}) {
  const style = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45',
    variant === 'primary' && 'bg-primary text-primary-foreground hover:brightness-105',
    variant === 'coral' && 'bg-accent text-accent-foreground hover:brightness-105',
    variant === 'outline' && 'border border-border bg-transparent text-foreground hover:bg-secondary',
    variant === 'quiet' && 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    className,
  );
  if (href) return <Link href={href} className={style} data-testid={testId}>{children}</Link>;
  return <button type={type} disabled={disabled} onClick={onClick} className={style} data-testid={testId}>{children}</button>;
}

function Badge({ children, color = 'muted' }: { children: ReactNode; color?: 'muted' | 'aqua' | 'coral' | 'gold' | 'blue' }) {
  const colors = { muted: 'bg-secondary text-muted-foreground', aqua: 'bg-primary/15 text-primary', coral: 'bg-accent/15 text-accent', gold: 'bg-[hsl(var(--chart-3)/.15)] text-[hsl(var(--chart-3))]', blue: 'bg-[hsl(var(--chart-4)/.15)] text-[hsl(var(--chart-4))]' };
  return <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em]', colors[color])}>{children}</span>;
}

function Panel({ children, className, testId }: { children: ReactNode; className?: string; testId?: string }) {
  return <section className={cn('rounded-2xl border border-card-border bg-card shadow-sm', className)} data-testid={testId}>{children}</section>;
}

function Logo() {
  return <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} strokeWidth={2.5} /></span>
    <span><span className="if-display text-[17px] font-bold tracking-tight text-foreground">InsightForge</span><span className="ml-2 if-mono text-[9px] uppercase tracking-[.18em] text-primary">workspace</span></span>
  </Link>;
}

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/analysis', label: 'Analysis', icon: LineChart },
];
const moduleNav = Object.entries(moduleInfo).map(([id, info]) => ({ href: `/module/${id}`, label: info.label, icon: info.icon }));
const utilityNav = utilityInfo.map(({ href, label, icon }) => ({ href, label, icon }));

const moduleKeys: Record<string, TranslationKey> = {
  'product-inspection': 'productInspection',
  'predictive-vending': 'predictiveVending',
  'heritage-qc': 'heritageQc',
  'academic-inbound': 'academicInbound',
  'multi-agent-routing': 'multiAgentRouting',
};

function useI18n() {
  return useContext(I18nContext);
}

const I18nContext = createContext({
  locale: 'en',
  setLocale: (_locale: string) => {},
  t: (key: TranslationKey) => translate('en', key),
});

function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(() => readStore<string>(STORAGE.locale, 'en'));
  const setLocale = (next: string) => {
    setLocaleState(next);
    writeStore(STORAGE.locale, next);
  };
  const t = (key: TranslationKey) => translate(locale, key);
  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

function translatedModuleLabel(id: string, fallback: string, t: (key: TranslationKey) => string) {
  const key = moduleKeys[id];
  return key ? t(key) : fallback;
}

function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();
  return <label className="flex items-center gap-2 rounded-lg border border-border bg-secondary/55 px-2.5 py-2 text-xs font-semibold">
    <Languages size={15} className="text-primary" />
    <span className="sr-only">{t('language')}</span>
    <select value={locale} onChange={e => setLocale(e.target.value)} className="max-w-[112px] bg-transparent outline-none" aria-label={t('language')} data-testid="select-language">
      {languageOptions.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}
    </select>
  </label>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const { t } = useI18n();
  const active = (href: string) => href === '/' ? location === '/' : location.startsWith(href);
  const filteredModules = moduleNav.filter(item => item.label.toLowerCase().includes(navSearch.toLowerCase()));
  const filteredUtilities = utilityNav.filter(item => item.label.toLowerCase().includes(navSearch.toLowerCase()));
  return <div className="if-noise min-h-[100dvh] bg-background text-foreground">
    <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0', mobileNav ? 'translate-x-0' : '-translate-x-full')} data-testid="sidebar">
      <div className="mb-9 px-2"><Logo /></div>
      <div className="mb-3 px-3 if-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">{t('workspaceReady')}</div>
      <div className="relative mb-3 px-2 lg:hidden"><Search size={15} className="absolute left-5 top-3 text-muted-foreground" /><input value={navSearch} onChange={e => setNavSearch(e.target.value)} placeholder={t('searchTools')} className="w-full rounded-lg border border-input bg-background/60 py-2 pl-9 pr-3 text-xs outline-none focus:border-primary" data-testid="input-mobile-tool-search" /></div>
      <nav className="space-y-1">
        {navItems.map(item => <Link key={item.href} href={item.href} onClick={() => setMobileNav(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors', active(item.href) ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')} data-testid={`link-nav-${item.label.toLowerCase()}`}><item.icon size={17} /><span>{item.href === '/' ? t('overview') : t('analysis')}</span>{active(item.href) && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}</Link>)}
      </nav>
      <div className="mb-3 mt-8 px-3 if-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">{t('specializedTools')}</div>
      <nav className="space-y-1">
        {filteredModules.map(item => <Link key={item.href} href={item.href} onClick={() => setMobileNav(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors', active(item.href) ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}><item.icon size={16} /><span>{translatedModuleLabel(item.href.split('/').pop() || '', item.label, t)}</span></Link>)}
      </nav>
      <div className="mb-3 mt-7 px-3 if-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">{t('utilities')}</div>
      <nav className="space-y-1">
        {filteredUtilities.map(item => <Link key={item.href} href={item.href} onClick={() => setMobileNav(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors', active(item.href) ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}><item.icon size={16} /><span>{item.href.includes('language') ? t('languageLab') : t('csvGenerator')}</span></Link>)}
      </nav>
      <div className="mt-auto space-y-1">
        <Link href="/admin" className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold', active('/admin') ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')} data-testid="link-nav-admin"><BarChart3 size={17} /><span>{t('productAnalytics')}</span></Link>
        <div className="mt-4 flex items-center gap-3 border-t border-sidebar-border px-3 pt-4">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent">AM</div>
          <div className="min-w-0"><div className="truncate text-xs font-bold">Ari Morgan</div><div className="text-[11px] text-muted-foreground">Personal workspace</div></div>
          <Settings2 size={15} className="ml-auto text-muted-foreground" />
        </div>
      </div>
    </aside>
    {mobileNav && <button className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation" data-testid="button-close-navigation" />}
    <div className="lg:pl-[252px]">
       <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md sm:px-8">
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" onClick={() => setMobileNav(true)} data-testid="button-open-navigation"><Menu size={20} /></button>
         <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t('workspaceReady')} <span className="mx-1 text-border">/</span> <span className="text-foreground">{location === '/' ? t('overview') : location.split('/').pop()?.replaceAll('-', ' ')}</span></div>
         <div className="ml-auto flex items-center gap-2"><LanguagePicker /><Button href="/analysis" variant="quiet" className="hidden sm:inline-flex" testId="button-header-analysis"><Plus size={16} /> {t('newAnalysis')}</Button><div className="grid h-8 w-8 place-items-center rounded-full border border-primary/35 bg-primary/10 text-[11px] font-bold text-primary">AM</div></div>
      </header>
       <main className="mx-auto max-w-[1440px] px-5 py-7 pb-24 sm:px-8 lg:px-10 lg:pb-10">{children}</main>
    </div>
     <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 rounded-2xl border border-border bg-sidebar/95 p-1.5 shadow-xl backdrop-blur-lg lg:hidden" data-testid="mobile-bottom-navigation">
       <Link href="/" className={cn('flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold', active('/') ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}><LayoutDashboard size={17} /><span>{t('overview')}</span></Link>
       <Link href="/analysis" className={cn('flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold', active('/analysis') ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}><LineChart size={17} /><span>{t('analysis')}</span></Link>
       <Link href="/module/language-lab" className={cn('flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold', active('/module/language-lab') ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}><BookOpen size={17} /><span>{t('languageLab')}</span></Link>
     </nav>
  </div>;
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 if-mono text-[10px] uppercase tracking-[.2em] text-primary">{eyebrow}</div><h1 className="if-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}

function Metric({ label, value, delta, icon: Icon, tone = 'aqua' }: { label: string; value: string; delta: string; icon: typeof Activity; tone?: 'aqua' | 'coral' | 'gold' }) {
  return <Panel className="p-4"><div className="mb-5 flex items-start justify-between"><span className={cn('grid h-8 w-8 place-items-center rounded-lg', tone === 'aqua' ? 'bg-primary/12 text-primary' : tone === 'coral' ? 'bg-accent/12 text-accent' : 'bg-[hsl(var(--chart-3)/.13)] text-[hsl(var(--chart-3))]')}><Icon size={16} /></span><span className="if-mono text-[10px] text-primary">{delta}</span></div><div className="if-display text-2xl font-bold">{value}</div><div className="mt-1 text-xs text-muted-foreground">{label}</div></Panel>;
}

function MiniBars({ values, color = 'primary' }: { values: number[]; color?: 'primary' | 'accent' }) {
  const max = Math.max(...values);
  return <div className="flex h-16 items-end gap-1.5" aria-label="Activity chart" data-testid="chart-mini-bars">{values.map((v, i) => <div key={i} className={cn('flex-1 rounded-t-sm transition-all', color === 'primary' ? 'bg-primary/70' : 'bg-accent/70')} style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />)}</div>;
}

function Overview() {
  const [activity] = useState<ActivityItem[]>(() => [...readStore<ActivityItem[]>(STORAGE.activity, []), ...demoActivity].slice(0, 5));
  const { t } = useI18n();
  const modules = [...Object.entries(moduleInfo).map(([id, info]) => ({ id, ...info, href: `/module/${id}` })), ...utilityInfo.map(info => ({ id: info.href.split('/').pop() || info.label, ...info, href: info.href }))];
  return <div className="if-animate-in">
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/25 bg-[#0b2942] p-6 sm:p-8 lg:p-10">
      <div className="if-grid absolute inset-0 opacity-40" /><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
       <div className="relative max-w-3xl"><div className="mb-4 flex items-center gap-2"><Badge color="aqua">Tuesday · 18 June 2024</Badge><span className="if-mono text-[10px] text-muted-foreground">Local workspace</span></div><h1 className="if-display max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-.05em] text-[#f3f0e6] sm:text-6xl">{t('fromRawData')} <span className="text-primary">{t('clearerNextMove')}</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-[#a7bbc3]">InsightForge gives every dataset a useful shape — then hands you the decision hiding inside it.</p><div className="mt-7 flex flex-wrap gap-3"><Button href="/analysis" testId="button-start-analysis"><Upload size={16} /> {t('startWithData')} <ArrowRight size={15} /></Button><Button href="/module/predictive-vending" variant="outline" className="border-[#35536a] text-[#d9e4e3] hover:bg-[#173a53]" testId="button-explore-module">{t('exploreModule')}</Button></div></div>
      <div className="relative mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-[#31516a] pt-5 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:w-[330px] sm:border-t-0 sm:pt-0"><div><div className="if-mono text-lg text-primary">08</div><div className="mt-1 text-[10px] uppercase tracking-[.14em] text-[#8ca6b1]">datasets shaped</div></div><div><div className="if-mono text-lg text-[#f29a84]">04</div><div className="mt-1 text-[10px] uppercase tracking-[.14em] text-[#8ca6b1]">live modules</div></div><div><div className="if-mono text-lg text-[#f1cf82]">1.8k</div><div className="mt-1 text-[10px] uppercase tracking-[.14em] text-[#8ca6b1]">signals found</div></div></div>
    </div>
     <div className="mb-8 grid gap-3 sm:grid-cols-3"><Metric label={t('recordsAnalyzed')} value="1,284" delta="+18.4%" icon={Database} /><Metric label={t('signalsFound')} value="247" delta="+32 this week" icon={Target} tone="coral" /><Metric label={t('dataQuality')} value="86.8%" delta="steady" icon={Gauge} tone="gold" /></div>
     <div className="mb-3 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-primary">{t('moduleHub')}</div><h2 className="if-display mt-1 text-2xl font-bold">{t('moduleHubTitle')}</h2></div><Link href="/analysis" className="hidden items-center gap-1 text-xs font-bold text-primary sm:flex" data-testid="link-view-all-modules">{t('analysis')} <ArrowRight size={14} /></Link></div>
    <div className="grid gap-4 md:grid-cols-2">
       {modules.map((mod, i) => <Link key={mod.id} href={mod.href} className={cn('group relative overflow-hidden rounded-2xl border border-card-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-secondary', i === 0 && 'md:row-span-2 md:p-7')} data-testid={`card-module-${mod.id}`}>
        <div className={cn('absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-20', mod.color === 'coral' ? 'bg-accent' : mod.color === 'gold' ? 'bg-[hsl(var(--chart-3))]' : mod.color === 'blue' ? 'bg-[hsl(var(--chart-4))]' : 'bg-primary')} />
         <div className="relative flex h-full flex-col"><div className="mb-8 flex items-start justify-between"><span className={cn('grid h-10 w-10 place-items-center rounded-xl', mod.color === 'coral' ? 'bg-accent/15 text-accent' : mod.color === 'gold' ? 'bg-[hsl(var(--chart-3)/.15)] text-[hsl(var(--chart-3))]' : mod.color === 'blue' ? 'bg-[hsl(var(--chart-4)/.15)] text-[hsl(var(--chart-4))]' : 'bg-primary/15 text-primary')}><mod.icon size={20} /></span><ArrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" size={17} /></div><div className="if-mono mb-2 text-[9px] uppercase tracking-[.18em] text-muted-foreground">{mod.eyebrow}</div><h3 className={cn('if-display text-xl font-bold', i === 0 && 'text-2xl')}>{translatedModuleLabel(mod.id, mod.label, t)}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{mod.description}</p><div className="mt-auto pt-6 text-xs font-semibold text-primary">{mod.accent} <span className="ml-1 opacity-60">↗</span></div></div>
      </Link>)}
    </div>
    <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <Panel className="p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Recent activity</div><h2 className="if-display mt-1 text-xl font-bold">What has moved lately</h2></div><History size={18} className="text-muted-foreground" /></div><div className="space-y-1">{activity.map((item, i) => <div key={`${item.id}-${i}`} className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-secondary" data-testid={`activity-item-${i}`}><span className={cn('h-2 w-2 rounded-full', item.color === 'aqua' ? 'bg-primary' : item.color === 'coral' ? 'bg-accent' : 'bg-[hsl(var(--chart-3))]')} /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{item.title}</div><div className="mt-0.5 text-xs text-muted-foreground">{item.detail}</div></div><div className="if-mono text-[10px] text-muted-foreground">{item.time}</div></div>)}</div></Panel>
      <Panel className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Signal volume</div><h2 className="if-display mt-1 text-xl font-bold">Last 7 days</h2></div><TrendingUp size={18} className="text-primary" /></div><MiniBars values={[22, 31, 28, 44, 38, 61, 54]} /><div className="mt-4 flex justify-between if-mono text-[9px] text-muted-foreground"><span>12 Jun</span><span>18 Jun</span></div><div className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Your strongest signal day was <span className="font-bold text-foreground">yesterday</span>, led by vending inventory patterns.</div></Panel>
    </div>
  </div>;
}

function parseCsv(input: string): { columns: string[]; rows: Record<string, string>[] } {
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { columns: [], rows: [] };
  const parseLine = (line: string) => line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
  const columns = parseLine(lines[0]);
  const rows = lines.slice(1).map(line => { const values = parseLine(line); return Object.fromEntries(columns.map((c, i) => [c, values[i] || ''])); });
  return { columns, rows };
}

function AnalysisChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1); const points = values.map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 100},${100 - (v / max) * 82 - 8}`).join(' ');
  return <div className="relative h-48 w-full" data-testid="chart-analysis"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="hsl(169 86% 54%)" stopOpacity=".32" /><stop offset="1" stopColor="hsl(169 86% 54%)" stopOpacity="0" /></linearGradient></defs><path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#area)" /><polyline points={points} fill="none" stroke="hsl(169 86% 54%)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg><div className="absolute inset-x-0 bottom-0 flex justify-between if-mono text-[9px] text-muted-foreground"><span>row 01</span><span>row {String(values.length).padStart(2, '0')}</span></div></div>;
}

function AnalysisPage() {
  const sample = 'product,category,price,units_sold,stock\nAurora Flask,Drinkware,28,184,42\nField Notes Set,Stationery,16,96,18\nSignal Lamp,Home,74,31,7\nCanvas Tote,Accessories,22,128,54\nDesk Radio,Electronics,112,22,3\nStone Mug,Drinkware,19,88,26';
  const [raw, setRaw] = useState(() => readStore<string>('if-last-csv', ''));
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const rows = useMemo(() => parseCsv(raw), [raw]);
  const runAnalysis = () => {
    setError('');
    if (!raw.trim()) { setError('Add a CSV first. You can paste rows or load the sample dataset.'); return; }
    if (rows.columns.length < 2 || !rows.rows.length) { setError('We need a header row and at least one data row to build a useful profile.'); return; }
    setLoading(true);
    window.setTimeout(() => {
      const numeric = rows.columns.filter(c => rows.rows.filter(r => r[c] !== '').length > rows.rows.length * .5 && rows.rows.filter(r => r[c] !== '' && !Number.isNaN(Number(r[c]))).length > rows.rows.length * .6);
      const text = rows.columns.filter(c => !numeric.includes(c));
      const completeness = Math.round(rows.columns.reduce((sum, c) => sum + rows.rows.filter(r => r[c] !== '').length / rows.rows.length, 0) / rows.columns.length * 100);
      const quality = Math.max(62, Math.min(99, completeness - (new Set(rows.rows.map(r => JSON.stringify(r))).size < rows.rows.length ? 7 : 0)));
      const chart = rows.rows.map((r, i) => { const val = numeric.length ? Number(r[numeric[0]]) || 0 : Object.values(r).filter(Boolean).length; return val + (i % 3) * Math.max(1, val * .04); }).slice(0, 12);
      const narrative = numeric.length ? `This ${rows.rows.length}-row dataset is ready for a first decision pass. ${numeric[0]} is the clearest quantitative thread; pair it with ${text[0] || 'the descriptive columns'} to understand what is moving and why.` : `This ${rows.rows.length}-row dataset is structurally sound for a qualitative read. Add one numeric measure later to make prioritization more precise.`;
      setResult({ rows: rows.rows.length, columns: rows.columns, numeric, text, quality, chart, preview: rows.rows.slice(0, 5) });
      writeStore('if-last-csv', raw); recordActivity({ title: 'Dataset analyzed', detail: `Analysis · ${rows.rows.length} records · ${quality}% quality`, color: 'aqua' }); setLoading(false); void narrative;
    }, 650);
  };
  const useSample = () => { setRaw(sample); setFileName('insightforge-sample.csv'); setResult(null); };
  const onFile = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setFileName(file.name); const reader = new FileReader(); reader.onload = e => { setRaw(String(e.target?.result || '')); setResult(null); }; reader.readAsText(file); };
  return <div className="if-animate-in"><PageIntro eyebrow="Analysis studio / 01" title="Give your data a useful shape." description="Upload or paste a CSV. InsightForge profiles the columns, checks the seams, and writes a grounded first read — without pretending to know more than the rows do." action={<Button onClick={useSample} variant="outline" testId="button-load-sample"><Sparkles size={15} /> Load sample data</Button>} />
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <Panel className="overflow-hidden"><div className="border-b border-card-border p-5"><div className="flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-primary">Input deck</div><h2 className="if-display mt-1 text-xl font-bold">Bring a table into focus</h2></div><Badge color="aqua">CSV only</Badge></div></div><div className="p-5"><label htmlFor="csv-file" className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/[.04] px-5 py-9 text-center transition-colors hover:bg-primary/[.08]" data-testid="dropzone-csv"><span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary"><CloudUpload size={21} /></span><span className="text-sm font-bold">{fileName || 'Choose a CSV file'}</span><span className="mt-1 text-xs text-muted-foreground">or paste your rows below</span><input id="csv-file" type="file" accept=".csv,text/csv" onChange={onFile} className="sr-only" data-testid="input-csv-file" /></label><div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[.15em] text-muted-foreground"><span className="h-px flex-1 bg-border" /> paste data <span className="h-px flex-1 bg-border" /></div><textarea value={raw} onChange={e => { setRaw(e.target.value); setResult(null); }} placeholder="product,price,units_sold&#10;Aurora Flask,28,184" className="min-h-[180px] w-full resize-y rounded-xl border border-input bg-background/50 p-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/70 focus:ring-2 focus:ring-primary/10" data-testid="textarea-csv-input" />{error && <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive" data-testid="status-analysis-error"><CircleAlert size={15} className="mt-0.5 shrink-0" />{error}</div>}<Button onClick={runAnalysis} className="mt-4 w-full" disabled={loading} testId="button-run-analysis">{loading ? <><RefreshCw size={15} className="animate-spin" /> Reading your rows...</> : <><LineChart size={15} /> Run grounded analysis</>}</Button></div></Panel>
      <div className="space-y-5">{!result && !loading && <Panel className="if-grid min-h-[470px] p-7"><div className="flex h-full min-h-[410px] flex-col items-center justify-center text-center"><span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary"><BarChart3 size={25} /></span><h2 className="if-display text-2xl font-bold">Your first read lives here.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">We’ll show the data profile, visible quality signals, and a decision-ready narrative once you run the analysis.</p><div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 size={14} className="text-primary" /> No data leaves this browser</div></div></Panel>}{loading && <Panel className="min-h-[470px] p-7"><div className="space-y-5 animate-pulse"><div className="h-5 w-40 rounded bg-secondary" /><div className="h-20 rounded-xl bg-secondary" /><div className="grid grid-cols-3 gap-3"><div className="h-20 rounded-xl bg-secondary" /><div className="h-20 rounded-xl bg-secondary" /><div className="h-20 rounded-xl bg-secondary" /></div><div className="h-44 rounded-xl bg-secondary" /></div></Panel>}{result && <AnalysisResultView result={result} />}</div>
    </div>
  </div>;
}

function AnalysisResultView({ result }: { result: AnalysisResult }) {
  return <div className="space-y-5 if-animate-in"><Panel className="overflow-hidden border-primary/30"><div className="flex flex-col gap-5 bg-primary/[.06] p-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="mb-2 flex items-center gap-2"><Badge color="aqua">Profile complete</Badge><span className="if-mono text-[10px] text-muted-foreground">{result.rows} rows read</span></div><h2 className="if-display text-2xl font-bold">A healthy table with a <span className="text-primary">commercial pulse.</span></h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">This dataset is ready for a first decision pass. {result.numeric[0] ? <><span className="font-semibold text-foreground">{result.numeric[0]}</span> is the clearest quantitative thread; pair it with {result.text[0] || 'descriptive columns'} to understand what is moving and why.</> : 'Add one numeric measure later to make prioritization more precise.'}</p></div><div className="text-left sm:text-right"><div className="if-mono text-3xl font-bold text-primary">{result.quality}%</div><div className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">data quality</div></div></div></Panel><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Rows" value={String(result.rows)} delta="complete" icon={Database} /><Metric label="Columns" value={String(result.columns.length)} delta={`${result.numeric.length} numeric`} icon={Tags} tone="coral" /><Metric label="Completeness" value={`${result.quality}%`} delta="strong" icon={CheckCircle2} tone="gold" /><Metric label="Signals" value={String(Math.max(3, result.numeric.length + 2))} delta="grounded" icon={Target} /></div><Panel className="p-5"><div className="mb-4 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Signal trace</div><h3 className="if-display mt-1 text-lg font-bold">Where the dataset is moving</h3></div><Badge color="aqua">{result.numeric[0] || 'row completeness'}</Badge></div><AnalysisChart values={result.chart} /></Panel><Panel className="overflow-hidden p-5"><div className="mb-4 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Column profile</div><h3 className="if-display mt-1 text-lg font-bold">The shape of your table</h3></div><FileText size={18} className="text-muted-foreground" /></div><div className="grid gap-2 sm:grid-cols-2">{result.columns.map((column, i) => <div key={column} className="flex items-center justify-between rounded-lg bg-background/45 px-3 py-2.5"><span className="truncate text-sm font-semibold">{column}</span><Badge color={result.numeric.includes(column) ? 'aqua' : 'muted'}>{result.numeric.includes(column) ? 'numeric' : 'text'}</Badge></div>)}</div></Panel></div>;
}

type ModuleConfig = { total: string; flagged: string; primary: string; desc: string; rows: string[][]; headers: string[] };

function ModulePage({ id }: { id: ModuleId }) {
  const info = moduleInfo[id]; const Icon = info.icon;
  const [ran, setRan] = useState(false); const [loading, setLoading] = useState(false); const [filter, setFilter] = useState('All records');
  const result = useMemo(() => {
    const config: Record<ModuleId, ModuleConfig> = {
      'product-inspection': { total: '118', flagged: '9', primary: 'Pricing drift', desc: '7 products sit more than 12% outside their category median.', rows: [['Aurora Flask', 'Drinkware', '$28', 'Review'], ['Field Notes Set', 'Stationery', '$16', 'Clear'], ['Signal Lamp', 'Home', '$74', 'Review'], ['Canvas Tote', 'Accessories', '$22', 'Clear']], headers: ['Record', 'Category', 'Price', 'Signal'] },
      'predictive-vending': { total: '64', flagged: '12', primary: 'Restock window', desc: 'Machine B-04 will likely hit stock risk in 2.6 days at current velocity.', rows: [['B-04 · Citrus Spark', '82% velocity', '11 left', 'Restock soon'], ['A-12 · Salted Rye', '74% velocity', '26 left', 'Healthy'], ['C-07 · Mineral Water', '68% velocity', '8 left', 'Restock soon'], ['D-02 · Oat Bar', '43% velocity', '38 left', 'Watch']], headers: ['SKU / slot', 'Demand pace', 'On hand', 'Signal'] },
      'heritage-qc': { total: '42', flagged: '8', primary: 'Preservation readiness', desc: '8 records need provenance or image work before the next lending window.', rows: [['Textile 018', 'Textile', '3/5 fields', 'Needs source'], ['Vessel 044', 'Ceramic', '5/5 fields', 'Ready'], ['Print 102', 'Print', '4/5 fields', 'Image gap'], ['Cabinet 007', 'Woodwork', '5/5 fields', 'Ready']], headers: ['Record', 'Type', 'Readiness', 'Signal'] },
      'academic-inbound': { total: '86', flagged: '14', primary: 'Research fit', desc: 'Applicants with methods experience are clustering around two high-demand themes.', rows: [['Mina Okafor', 'Urban ecology', 'Methods', 'Strong fit'], ['Theo Zhang', 'Public history', 'Portfolio', 'Review'], ['Leila Haddad', 'Data ethics', 'Methods', 'Strong fit'], ['Noah Williams', 'Civic design', 'Writing', 'Review']], headers: ['Applicant', 'Theme', 'Evidence', 'Signal'] },
      'multi-agent-routing': { total: '24', flagged: '6', primary: 'Route resilience', desc: 'Six handoffs need a backup path before demand pressure reaches the network.', rows: [['North hub → B-04', 'Retail agent', '14 min', 'Protected'], ['B-04 → Campus', 'Fleet agent', '22 min', 'Review'], ['Campus → South hub', 'Demand agent', '18 min', 'Protected'], ['South hub → North hub', 'Inventory agent', '31 min', 'Review']], headers: ['Route', 'Lead agent', 'ETA', 'Signal'] },
    };
    return config[id];
  }, [id]);
  const run = () => { setLoading(true); window.setTimeout(() => { setLoading(false); setRan(true); recordActivity({ title: `${info.label} run completed`, detail: `${result.total} records · ${result.flagged} signals`, color: info.color === 'coral' ? 'coral' : info.color === 'gold' ? 'gold' : 'aqua' }); }, 650); };
  return <div className="if-animate-in"><PageIntro eyebrow={`${info.eyebrow} / module`} title={info.label} description={info.description} action={<div className="flex gap-2"><Button href="/analysis" variant="outline" testId={`button-${id}-import`}><Upload size={15} /> Import data</Button><Button onClick={run} disabled={loading} variant={info.color === 'coral' ? 'coral' : 'primary'} testId={`button-${id}-run`}>{loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />} {loading ? 'Reading records' : ran ? 'Run again' : 'Run module'}</Button></div>} />
    {!ran && !loading && <Panel className="mb-5 overflow-hidden border-primary/20"><div className="if-grid flex min-h-[190px] items-center gap-6 p-6 sm:p-8"><div className={cn('grid h-16 w-16 shrink-0 place-items-center rounded-2xl', info.color === 'coral' ? 'bg-accent/15 text-accent' : info.color === 'gold' ? 'bg-[hsl(var(--chart-3)/.15)] text-[hsl(var(--chart-3))]' : 'bg-primary/15 text-primary')}><Icon size={29} /></div><div><Badge color={info.color === 'coral' ? 'coral' : info.color === 'gold' ? 'gold' : 'aqua'}>Ready for a first pass</Badge><h2 className="if-display mt-3 text-2xl font-bold">Find the signal beneath the surface.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Run this module against a sample workspace dataset to see a useful result. Every finding is deterministic, local, and linked back to the records it came from.</p></div></div></Panel>}
    {loading && <Panel className="mb-5 p-7"><div className="animate-pulse space-y-4"><div className="h-6 w-56 rounded bg-secondary" /><div className="grid gap-3 sm:grid-cols-3"><div className="h-24 rounded-xl bg-secondary" /><div className="h-24 rounded-xl bg-secondary" /><div className="h-24 rounded-xl bg-secondary" /></div><div className="h-48 rounded-xl bg-secondary" /></div></Panel>}
    {ran && <div className="space-y-5 if-animate-in"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Records in view" value={result.total} delta="profiled" icon={Database} /><Metric label="Signals to review" value={result.flagged} delta="prioritized" icon={CircleAlert} tone="coral" /><Metric label="Confidence" value="91.4%" delta="grounded" icon={Gauge} tone="gold" /></div><div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><Panel className="overflow-hidden"><div className="border-b border-card-border p-5"><div className="flex items-start justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.17em] text-primary">Narrative finding</div><h2 className="if-display mt-1 text-2xl font-bold">{result.primary}</h2></div><Badge color="aqua">High utility</Badge></div><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{result.desc} The quickest next move is to review the flagged records, then confirm the signal with the person closest to this workflow.</p></div><div className="grid gap-3 p-5 sm:grid-cols-3"><div className="rounded-xl bg-primary/[.07] p-4"><TrendingUp size={16} className="text-primary" /><div className="mt-5 if-mono text-xl text-primary">+18.2%</div><div className="mt-1 text-xs text-muted-foreground">signal lift</div></div><div className="rounded-xl bg-accent/[.07] p-4"><CircleAlert size={16} className="text-accent" /><div className="mt-5 if-mono text-xl text-accent">{result.flagged}</div><div className="mt-1 text-xs text-muted-foreground">needs a look</div></div><div className="rounded-xl bg-[hsl(var(--chart-3)/.08)] p-4"><CheckCircle2 size={16} className="text-[hsl(var(--chart-3))]" /><div className="mt-5 if-mono text-xl text-[hsl(var(--chart-3))]">91.4%</div><div className="mt-1 text-xs text-muted-foreground">confidence</div></div></div></Panel><Panel className="p-5"><div className="mb-5 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">Signal mix</div><h3 className="if-display mt-1 text-lg font-bold">What is asking for attention</h3></div><Activity size={17} className="text-primary" /></div>{['High-priority review', 'Missing context', 'Healthy records'].map((label, i) => <div key={label} className="mb-4"><div className="mb-2 flex justify-between text-xs"><span>{label}</span><span className="if-mono text-muted-foreground">{[24, 18, 58][i]}%</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={cn('h-full rounded-full', i === 0 ? 'bg-accent' : i === 1 ? 'bg-[hsl(var(--chart-3))]' : 'bg-primary')} style={{ width: `${[24, 18, 58][i]}%` }} /></div></div>)}<div className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Recommended next step: <span className="font-bold text-foreground">open the flagged records and assign an owner.</span></div></Panel></div><Panel className="overflow-hidden"><div className="flex flex-col gap-3 border-b border-card-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">Record view</div><h3 className="if-display mt-1 text-lg font-bold">A closer look at the evidence</h3></div><div className="flex gap-2"><button onClick={() => setFilter('All records')} className={cn('rounded-md px-2.5 py-1.5 text-xs font-bold', filter === 'All records' ? 'bg-secondary text-foreground' : 'text-muted-foreground')} data-testid={`button-filter-all-${id}`}>All records</button><button onClick={() => setFilter('Flagged')} className={cn('rounded-md px-2.5 py-1.5 text-xs font-bold', filter === 'Flagged' ? 'bg-accent/15 text-accent' : 'text-muted-foreground')} data-testid={`button-filter-flagged-${id}`}>Flagged</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="bg-background/30 text-[10px] uppercase tracking-[.15em] text-muted-foreground"><tr>{result.headers.map(header => <th key={header} className="px-5 py-3 font-medium">{header}</th>)}<th className="px-5 py-3 font-medium">Action</th></tr></thead><tbody>{result.rows.filter((_, i) => filter === 'All records' || i % 2 === 0).map((row, i) => <tr key={i} className="border-t border-border"><td className="px-5 py-3 font-semibold">{row[0]}</td>{row.slice(1).map((cell, j) => <td key={j} className="px-5 py-3 text-muted-foreground">{cell}</td>)}<td className="px-5 py-3"><button className="text-xs font-bold text-primary hover:underline" onClick={() => setFilter('Flagged')} data-testid={`button-review-record-${i}`}>Review</button></td></tr>)}</tbody></table></div></Panel></div>}
  </div>;
}

const generatorRows: Record<string, string[]> = {
  retail: ['item,category,price,units_sold,stock', 'Aurora Flask,Drinkware,28,184,42', 'Field Notes Set,Stationery,16,96,18', 'Signal Lamp,Home,74,31,7', 'Canvas Tote,Accessories,22,128,54', 'Desk Radio,Electronics,112,22,3'],
  vending: ['slot,product,day,units_sold,stock', 'B-04,Citrus Spark,Mon,42,11', 'A-12,Salted Rye,Mon,31,26', 'C-07,Mineral Water,Mon,28,8', 'D-02,Oat Bar,Mon,18,38', 'B-04,Citrus Spark,Tue,46,7'],
  heritage: ['record_id,title,object_type,provenance_status,image_ready', 'H-018,Blue Study,Textile,partial,no', 'H-044,Market Vessel,Ceramic,complete,yes', 'H-102,Evening Print,Print,complete,no', 'H-007,Writing Cabinet,Woodwork,complete,yes'],
  academic: ['applicant,theme,experience,review_status', 'Mina Okafor,Urban ecology,Methods,strong fit', 'Theo Zhang,Public history,Portfolio,review', 'Leila Haddad,Data ethics,Methods,strong fit', 'Noah Williams,Civic design,Writing,review'],
};
function CsvGenerator() {
  const [dataset, setDataset] = useState('retail'); const [count, setCount] = useState('24'); const [complexity, setComplexity] = useState('balanced'); const [downloaded, setDownloaded] = useState(false);
  const preview = useMemo(() => { const base = generatorRows[dataset]; const target = Number(count); const rows = [...base]; for (let i = base.length; i < Math.min(target + 1, 9); i++) rows.push(base[i % (base.length - 1) + 1].replace(/(\d+)/g, n => String(Number(n) + i))); return rows; }, [dataset, count]);
  const download = () => { const base = generatorRows[dataset]; const target = Number(count); const rows = [...base]; for (let i = base.length; i < target + 1; i++) rows.push(base[i % (base.length - 1) + 1].replace(/(\d+)/g, n => String(Number(n) + i))); const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `insightforge-${dataset}-${count}.csv`; a.click(); URL.revokeObjectURL(url); writeStore(STORAGE.datasets, [...readStore<string[]>(STORAGE.datasets, []), `insightforge-${dataset}-${count}.csv`]); recordActivity({ title: 'Sample dataset generated', detail: `${dataset} · ${count} rows · ${complexity} complexity`, color: 'aqua' }); setDownloaded(true); window.setTimeout(() => setDownloaded(false), 2600); };
  return <div className="if-animate-in"><PageIntro eyebrow="Data utility / 04" title="Generate a dataset worth exploring." description="Create a realistic starting point for a module run or a team workshop. The download is a real CSV, shaped for quick iteration." action={<Badge color="aqua"><Download size={12} className="mr-1" /> Local export</Badge>} /><div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]"><Panel className="p-5 sm:p-6"><div className="if-mono text-[10px] uppercase tracking-[.18em] text-primary">Dataset recipe</div><h2 className="if-display mt-2 text-2xl font-bold">Choose your starting shape</h2><div className="mt-7 space-y-5"><label className="block text-sm font-semibold">Dataset type<select value={dataset} onChange={e => setDataset(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" data-testid="select-dataset-type"><option value="retail">Retail catalogue</option><option value="vending">Vending sales</option><option value="heritage">Heritage records</option><option value="academic">Academic inbound</option></select></label><label className="block text-sm font-semibold">Rows to generate<div className="mt-2 flex gap-2">{['12', '24', '48', '100'].map(n => <button key={n} onClick={() => setCount(n)} className={cn('flex-1 rounded-lg border px-2 py-2.5 text-xs font-bold', count === n ? 'border-primary bg-primary/12 text-primary' : 'border-input text-muted-foreground hover:bg-secondary')} data-testid={`button-row-count-${n}`}>{n}</button>)}</div></label><label className="block text-sm font-semibold">Complexity<select value={complexity} onChange={e => setComplexity(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" data-testid="select-complexity"><option value="simple">Simple</option><option value="balanced">Balanced</option><option value="rich">Rich variation</option></select></label></div><Button onClick={download} className="mt-8 w-full" testId="button-download-csv">{downloaded ? <><Check size={16} /> CSV saved locally</> : <><Download size={16} /> Download {count} rows</>}</Button><p className="mt-3 text-center text-[11px] text-muted-foreground">Generated in your browser. Nothing is uploaded.</p></Panel><Panel className="overflow-hidden"><div className="flex items-center justify-between border-b border-card-border p-5"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Preview / {dataset}</div><h2 className="if-display mt-1 text-xl font-bold">A peek before you forge</h2></div><Badge color="aqua">{count} rows</Badge></div><div className="overflow-x-auto p-5"><table className="w-full min-w-[650px] text-left text-xs"><thead><tr>{preview[0].split(',').map(h => <th key={h} className="border-b border-border px-3 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">{h}</th>)}</tr></thead><tbody>{preview.slice(1).map((row, i) => <tr key={i} className="border-b border-border/60"><td colSpan={preview[0].split(',').length} className="px-3 py-2.5 font-mono text-muted-foreground">{row.split(',').map((cell, j) => <span key={j} className="mr-8 inline-block min-w-[72px]">{cell}</span>)}</td></tr>)}</tbody></table><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 size={14} className="text-primary" /> {Math.max(0, Number(count) - 8)} more rows will be included in the download.</div></div></Panel></div></div>;
}

const questions = [{ prompt: 'Choose the natural phrase for a small but useful insight.', options: ['A tiny signal', 'A loud table', 'A fast column', 'A closed row'], answer: 0, note: '“A tiny signal” is the most natural phrase.' }, { prompt: 'Which word means “to examine closely”?', options: ['Surface', 'Inspect', 'Export', 'Repeat'], answer: 1, note: 'Inspect means to look at something carefully.' }, { prompt: 'Complete: The data points ___ a clear trend.', options: ['show', 'shows', 'showing', 'shown'], answer: 0, note: 'Plural subject “data points” takes “show”.' }];
function LanguageLab() {
  const saved = readStore<{ hearts: number; streak: number; completed: number }>(STORAGE.language, { hearts: 5, streak: 4, completed: 2 });
  const [hearts, setHearts] = useState(saved.hearts); const [streak, setStreak] = useState(saved.streak); const [completed, setCompleted] = useState(saved.completed); const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [speaking, setSpeaking] = useState(false); const q = questions[index % questions.length];
  const choose = (i: number) => { if (selected !== null) return; setSelected(i); if (i !== q.answer) { const next = Math.max(0, hearts - 1); setHearts(next); writeStore(STORAGE.language, { hearts: next, streak, completed }); } };
  const next = () => { if (selected === q.answer) { const next = completed + 1; setCompleted(next); setStreak(streak + 1); writeStore(STORAGE.language, { hearts, streak: streak + 1, completed: next }); } setSelected(null); setIndex(index + 1); };
  const speak = () => { setSpeaking(true); window.setTimeout(() => setSpeaking(false), 1500); };
  return <div className="if-animate-in"><PageIntro eyebrow="Practice room / 05" title="Language lab" description="Build the vocabulary of better decisions. Short lessons, clear feedback, and a little repetition for the words that make analysis travel." action={<Badge color="coral"><Flame size={12} className="mr-1" /> {streak} day streak</Badge>} /><div className="grid gap-5 xl:grid-cols-[1fr_.62fr]"><Panel className="overflow-hidden"><div className="flex items-center justify-between border-b border-card-border bg-primary/[.05] p-5"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-primary">Lesson 03 / Useful language</div><h2 className="if-display mt-1 text-xl font-bold">Talk about evidence</h2></div><div className="flex items-center gap-1.5 text-accent">{Array.from({ length: 5 }).map((_, i) => <Heart key={i} size={16} fill={i < hearts ? 'currentColor' : 'none'} className={i < hearts ? '' : 'opacity-30'} />)}</div></div><div className="p-5 sm:p-8"><div className="mb-8 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, ((completed % 5) + 1) * 20)}%` }} /></div><span className="if-mono text-[10px] text-muted-foreground">{completed % 5 + 1} / 5</span></div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Pick the clearest answer</div><h3 className="if-display mt-3 max-w-xl text-3xl font-bold leading-tight">{q.prompt}</h3><div className="mt-7 grid gap-2">{q.options.map((option, i) => <button key={option} onClick={() => choose(i)} className={cn('flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition-all', selected === null && 'border-input hover:border-primary/60 hover:bg-primary/[.04]', selected !== null && i === q.answer && 'border-primary bg-primary/10 text-primary', selected !== null && i !== q.answer && i === selected && 'border-accent bg-accent/10 text-accent', selected !== null && i !== q.answer && i !== selected && 'border-input opacity-60')} data-testid={`button-answer-${i}`}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary if-mono text-xs">{String.fromCharCode(65 + i)}</span>{option}{selected !== null && i === q.answer && <Check size={16} className="ml-auto" />}</button>)}</div>{selected !== null && <div className={cn('mt-5 rounded-xl p-4 text-sm leading-6', selected === q.answer ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent')} data-testid="status-language-feedback"><div className="font-bold">{selected === q.answer ? 'Good read.' : 'Not quite yet.'}</div><div className="mt-1 opacity-80">{q.note}</div></div>}<div className="mt-6 flex flex-wrap gap-2"><Button onClick={speak} variant="outline" disabled={speaking} testId="button-spoken-practice"><MessageSquare size={15} /> {speaking ? 'Listening for your voice...' : 'Practice aloud'}</Button>{selected !== null && <Button onClick={next} testId="button-next-question">Next question <ArrowRight size={15} /></Button>}</div></div></Panel><div className="space-y-5"><Panel className="p-5"><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Your practice signal</div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-accent/[.08] p-4"><Flame size={17} className="text-accent" /><div className="mt-4 if-display text-2xl font-bold">{streak}</div><div className="mt-1 text-xs text-muted-foreground">day streak</div></div><div className="rounded-xl bg-primary/[.08] p-4"><CheckCircle2 size={17} className="text-primary" /><div className="mt-4 if-display text-2xl font-bold">{completed}</div><div className="mt-1 text-xs text-muted-foreground">lessons done</div></div></div></Panel><Panel className="p-5"><div className="mb-4 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Up next</div><h3 className="if-display mt-1 text-lg font-bold">Words that travel</h3></div><BookOpen size={18} className="text-primary" /></div>{['evidence', 'signal', 'decision'].map((word, i) => <div key={word} className="flex items-center gap-3 border-t border-border py-3"><span className="if-mono text-[10px] text-muted-foreground">0{i + 4}</span><span className="text-sm font-semibold">{word}</span><ChevronRight size={14} className="ml-auto text-muted-foreground" /></div>)}</Panel></div></div></div>;
}

function AdminPage() {
  const [reviews, setReviews] = useState(() => readStore<Array<{ name: string; rating: number; body: string }>>(STORAGE.reviews, [])); const [name, setName] = useState(''); const [body, setBody] = useState(''); const [rating, setRating] = useState(5); const [sent, setSent] = useState(false); const [activity] = useState(() => [...readStore<ActivityItem[]>(STORAGE.activity, []), ...demoActivity].slice(0, 8));
  const submit = (e: FormEvent) => { e.preventDefault(); if (!name.trim() || !body.trim()) return; const next = [{ name: name.trim(), rating, body: body.trim() }, ...reviews]; setReviews(next); writeStore(STORAGE.reviews, next); recordActivity({ title: 'Product review left', detail: `${rating} stars · local feedback`, color: 'gold' }); setName(''); setBody(''); setSent(true); window.setTimeout(() => setSent(false), 2400); };
  return <div className="if-animate-in"><PageIntro eyebrow="Product analytics / local" title="See how InsightForge is being used." description="A small, honest window into this browser’s workspace activity. Nothing here is sent to a server — it stays local to this visit." action={<Badge color="gold"><Activity size={12} className="mr-1" /> Local only</Badge>} /><div className="grid gap-3 sm:grid-cols-4"><Metric label="Workspace visits" value="42" delta="+8 this week" icon={Users} /><Metric label="Module runs" value="27" delta="+14.2%" icon={Play} tone="coral" /><Metric label="Avg. rating" value={reviews.length ? '4.8' : '4.7'} delta={`${reviews.length || 12} reviews`} icon={Star} tone="gold" /><Metric label="Return signal" value="68%" delta="healthy" icon={RefreshCw} /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><Panel className="p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-primary">Usage by module</div><h2 className="if-display mt-1 text-xl font-bold">Where people spend time</h2></div><BarChart3 size={18} className="text-muted-foreground" /></div>{[['Analysis studio', 82, '184 runs'], ['Predictive vending', 61, '97 runs'], ['Product inspection', 53, '81 runs'], ['Language lab', 39, '56 sessions'], ['Heritage QC', 28, '31 runs']].map(([label, value, runs]) => <div key={String(label)} className="mb-5"><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{label}</span><span className="if-mono text-[10px] text-muted-foreground">{runs}</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div></div>)}<div className="mt-7 rounded-xl bg-background/50 p-4 text-xs leading-5 text-muted-foreground"><span className="font-bold text-foreground">Read on this:</span> people tend to start with analysis, then return to one specialized module when a question gets specific.</div></Panel><Panel className="p-5 sm:p-6"><div className="mb-5"><div className="if-mono text-[10px] uppercase tracking-[.18em] text-accent">Leave a note</div><h2 className="if-display mt-1 text-xl font-bold">How did this feel?</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Your review stays in this browser and helps us tune the workspace.</p></div><form onSubmit={submit} className="space-y-3"><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" data-testid="input-review-name" /><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(n => <button key={n} type="button" onClick={() => setRating(n)} className={cn('p-1 transition-colors', n <= rating ? 'text-[hsl(var(--chart-3))]' : 'text-muted-foreground/35')} data-testid={`button-rating-${n}`}><Star size={19} fill={n <= rating ? 'currentColor' : 'none'} /></button>)}<span className="ml-2 if-mono text-[10px] text-muted-foreground">{rating} / 5</span></div><textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What made the next move clearer?" className="min-h-[110px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" data-testid="textarea-review-body" /><Button type="submit" className="w-full" testId="button-submit-review">{sent ? <><Check size={16} /> Review saved</> : <><Send size={15} /> Leave local review</>}</Button></form></Panel></div><Panel className="mt-5 p-5"><div className="mb-5 flex items-center justify-between"><div><div className="if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Activity log</div><h2 className="if-display mt-1 text-xl font-bold">The local trail</h2></div><History size={18} className="text-muted-foreground" /></div>{activity.length ? <div className="grid gap-2 md:grid-cols-2">{activity.map((item, i) => <div key={`${item.id}-${i}`} className="flex items-center gap-3 rounded-xl bg-background/35 p-3" data-testid={`admin-activity-${i}`}><span className={cn('grid h-8 w-8 place-items-center rounded-lg', item.color === 'aqua' ? 'bg-primary/12 text-primary' : item.color === 'coral' ? 'bg-accent/12 text-accent' : 'bg-[hsl(var(--chart-3)/.12)] text-[hsl(var(--chart-3))]')}><Activity size={14} /></span><div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">{item.title}</div><div className="text-[11px] text-muted-foreground">{item.detail}</div></div><span className="if-mono text-[9px] text-muted-foreground">{item.time}</span></div>)}</div> : <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground"><Search size={16} /> Activity will appear as you explore modules.</div>}</Panel>{reviews.length > 0 && <Panel className="mt-5 p-5"><div className="mb-4 if-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Recent reviews</div><div className="grid gap-3 sm:grid-cols-2">{reviews.slice(0, 4).map((review, i) => <div key={i} className="rounded-xl bg-background/35 p-4"><div className="flex items-center justify-between"><span className="text-sm font-bold">{review.name}</span><span className="flex text-[hsl(var(--chart-3))]">{Array.from({ length: review.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor" />)}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{review.body}</p></div>)}</div></Panel>}</div>;
}

function NotFound() { return <div className="grid min-h-[70vh] place-items-center text-center"><div><div className="if-mono text-xs text-primary">404 / not in this workspace</div><h1 className="if-display mt-3 text-4xl font-bold">That route is still a blank row.</h1><p className="mt-3 text-sm text-muted-foreground">Let’s get you back to a useful starting point.</p><Button href="/" className="mt-6" testId="button-back-overview"><ArrowLeft size={15} /> Back to overview</Button></div></div>; }

function Router() {
  return <Shell><ErrorBoundary resetKey={location.pathname}><Switch><Route path="/" component={Overview} /><Route path="/analysis" component={AnalysisPage} /><Route path="/module/csv-generator" component={CsvGenerator} /><Route path="/module/language-lab" component={LanguageLab} /><Route path="/module/:id">{() => { const { id } = useParams<{ id: ModuleId }>(); return id && moduleInfo[id] ? <ModulePage id={id} /> : <NotFound />; }}</Route><Route path="/admin" component={AdminPage} /><Route component={NotFound} /></Switch></ErrorBoundary></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><I18nProvider><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></I18nProvider></QueryClientProvider>;
}

export default App;