import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Bell, Bookmark, BriefcaseBusiness, CalendarDays, Check,
  CircleUserRound, Clock3, Code2, LayoutDashboard,
  Menu, MessageCircle, Plus, Search, Send, Settings, Sparkles, Trophy,
  Users, X,
} from 'lucide-react'
import './App.css'

type Hackathon = {
  id: number
  name: string
  organizer: string
  poster: string
  mode: 'Online' | 'Offline' | 'Hybrid'
  location: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  deadline: string
  date: string
  prize: string
  fee: string
  teamSize: string
  description: string
  skills: string[]
  status: 'Open' | 'Closing soon'
}

type Student = {
  id: number
  name: string
  college: string
  skills: string[]
  interests: string[]
  level: 'Beginner' | 'Moderate' | 'Advanced'
  experience: string
  availability: string
  initials: string
  color: string
}

const hackathons: Hackathon[] = [
  {
    id: 1, name: 'Build for Bharat', organizer: 'Innovation Foundation',
    poster: 'bb', mode: 'Hybrid', location: 'New Delhi, India', category: 'Social Impact',
    difficulty: 'Intermediate', deadline: '2026-12-08', date: '2026-12-20',
    prize: '₹2,00,000', fee: 'Free', teamSize: '2–4 members', status: 'Closing soon',
    description: 'Build accessible digital solutions for education, health, and civic services. This demo listing is for platform testing and is not an active event registration.',
    skills: ['React', 'UI/UX', 'Node.js', 'Python'],
  },
  {
    id: 2, name: 'Campus Code Sprint', organizer: 'Code Society',
    poster: 'cc', mode: 'Online', location: 'Remote', category: 'Web Development',
    difficulty: 'Beginner', deadline: '2026-12-15', date: '2027-01-10',
    prize: '$1,500', fee: 'Free', teamSize: '1–3 members', status: 'Open',
    description: 'A beginner-friendly sprint focused on practical web applications and collaborative development.',
    skills: ['JavaScript', 'React', 'Figma', 'Firebase'],
  },
  {
    id: 3, name: 'Climate Tech Challenge', organizer: 'Green Labs Collective',
    poster: 'ct', mode: 'Offline', location: 'Bengaluru, India', category: 'Climate',
    difficulty: 'Advanced', deadline: '2026-12-22', date: '2027-02-04',
    prize: '$5,000', fee: '₹500', teamSize: '3–5 members', status: 'Open',
    description: 'Prototype data-led tools that help communities measure, plan, and respond to climate risks.',
    skills: ['Python', 'Data Science', 'IoT', 'Machine Learning'],
  },
  {
    id: 4, name: 'Design & Deploy', organizer: 'Student Developers Network',
    poster: 'dd', mode: 'Hybrid', location: 'Mumbai, India', category: 'Design',
    difficulty: 'Intermediate', deadline: '2027-01-05', date: '2027-02-18',
    prize: '₹1,00,000', fee: 'Free', teamSize: '2–4 members', status: 'Open',
    description: 'Turn a well-researched product idea into a polished, accessible and technically sound prototype.',
    skills: ['Figma', 'React', 'TypeScript', 'Branding'],
  },
]

const students: Student[] = [
  { id: 1, name: 'Aarav Mehta', college: 'IIT Delhi', skills: ['React', 'Node.js', 'UI/UX'], interests: ['Web', 'EdTech'], level: 'Advanced', experience: '4 hackathons', availability: 'Available', initials: 'AM', color: '#2563EB' },
  { id: 2, name: 'Diya Sharma', college: 'NIT Surathkal', skills: ['Python', 'Data Science', 'ML'], interests: ['AI', 'Climate'], level: 'Moderate', experience: '2 hackathons', availability: 'Available', initials: 'DS', color: '#F4C95D' },
  { id: 3, name: 'Kabir Rao', college: 'BITS Pilani', skills: ['Figma', 'React', 'Branding'], interests: ['Design', 'SaaS'], level: 'Moderate', experience: '3 hackathons', availability: 'This week', initials: 'KR', color: '#1E293B' },
  { id: 4, name: 'Zara Khan', college: 'Manipal Institute', skills: ['Flutter', 'Firebase', 'Python'], interests: ['Health', 'Mobile'], level: 'Beginner', experience: '1 hackathon', availability: 'Available', initials: 'ZK', color: '#64748B' },
]

const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}
const save = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value))

function App() {
  const [session, setSession] = useState<any>(() => read('codex_session', null))
  const [saved, setSaved] = useState<number[]>(() => read('codex_saved', [2]))
  const [notifications, setNotifications] = useState(() => read('codex_notifications', [
    { id: 1, text: 'Build for Bharat closes in 20 days', time: '12 min ago', read: false },
    { id: 2, text: 'Aarav sent you a team invitation', time: '1 hr ago', read: false },
  ]))

  useEffect(() => save('codex_session', session), [session])
  useEffect(() => save('codex_saved', saved), [saved])
  useEffect(() => save('codex_notifications', notifications), [notifications])

  const toggleSaved = (id: number) => setSaved(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id])
  const notify = (text: string) => setNotifications((v: any[]) => [{ id: Date.now(), text, time: 'Just now', read: false }, ...v])

  return (
    <BrowserRouter>
      <Cursor />
      <Navbar session={session} notifications={notifications} setSession={setSession} />
      <main>
        <Routes>
          <Route path="/" element={<Home saved={saved} toggleSaved={toggleSaved} />} />
          <Route path="/login" element={<Auth mode="login" setSession={setSession} />} />
          <Route path="/signup" element={<Auth mode="signup" setSession={setSession} />} />
          <Route path="/explore" element={<Explore saved={saved} toggleSaved={toggleSaved} />} />
          <Route path="/hackathon/:id" element={<HackathonDetails saved={saved} toggleSaved={toggleSaved} notify={notify} />} />
          <Route path="/teammates" element={<Teammates notify={notify} />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/workspace" element={<Workspace notify={notify} />} />
          <Route path="/dashboard" element={<Protected session={session}><Dashboard saved={saved} /></Protected>} />
          <Route path="/profile" element={<Protected session={session}><Profile session={session} setSession={setSession} /></Protected>} />
          <Route path="/notifications" element={<Notifications notifications={notifications} setNotifications={setNotifications} />} />
          <Route path="/organizer" element={<Organizer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

function Dashboard({ saved }: { saved: number[] }) {
  const [tasks] = useState(() => read<any[]>('codex_tasks', [
    { id: 1, title: 'Create wireframes', status: 'READY' },
    { id: 2, title: 'Build API mock', status: 'IN PROGRESS' },
    { id: 3, title: 'Prepare pitch', status: 'TO DO' },
  ]))
  const ready = tasks.filter(t => t.status === 'READY').length
  const progress = tasks.length ? Math.round(ready / tasks.length * 100) : 0
  return (
    <div className="page-shell dashboard-page">
      <div className="page-heading"><div><span className="eyebrow">Student dashboard</span><h1>Good morning, Builder <span>👋</span></h1></div><Link className="button primary" to="/explore">Explore events <Plus size={16} /></Link></div>
      <div className="stat-grid"><div><span><CalendarDays /></span><b>{saved.length}</b><small>Saved hackathons</small></div><div><span><Users /></span><b>1</b><small>Active team</small></div><div><span><Trophy /></span><b>{progress}%</b><small>Project progress</small></div><div><span><Clock3 /></span><b>20</b><small>Days until deadline</small></div></div>
      <div className="dashboard-layout"><section className="dashboard-card"><div className="card-heading"><h2>Upcoming deadlines</h2><Link to="/explore">View all</Link></div>{hackathons.slice(0, 3).map(h => <div className="deadline-row" key={h.id}><div className={`date-box poster-${h.poster}`}><b>{h.deadline.slice(-2)}</b><small>DEC</small></div><div><b>{h.name}</b><span>{h.status}</span></div><Link to={`/hackathon/${h.id}`}><ArrowRight size={16} /></Link></div>)}</section>
      <section className="dashboard-card"><div className="card-heading"><h2>Project progress</h2><Link to="/workspace">Open workspace</Link></div><div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as any}><div><b>{progress}%</b><span>complete</span></div></div><div className="progress-stats"><span><i className="blue-dot" />{ready} done</span><span><i className="yellow-dot" />{tasks.length - ready} in progress</span></div></section></div>
    </div>
  )
}

function Profile({ session, setSession }: any) {
  const [profile, setProfile] = useState<Record<string, any>>(() => read('codex_profile', { name: session?.name || '', email: session?.email || '', phone: '', college: '', branch: '', year: 'Third year', skills: 'React, UI/UX, Python', interests: 'Web Development, AI', experience: 'Moderate', github: '', linkedin: '', intro: '', privatePhone: true }))
  const [saved, setSaved] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); save('codex_profile', profile); setSession({ ...session, name: profile.name, email: profile.email }); setSaved(true) }
  const field = (key: string) => ({ value: profile[key], onChange: (e: any) => setProfile({ ...profile, [key]: e.target.value }) })
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">My profile</span><h1>Profile & preferences</h1></div></div>
      <form className="profile-layout" onSubmit={submit}>
        <aside className="profile-card"><div className="profile-avatar">{profile.name?.[0] || 'U'}<button type="button" aria-label="Change profile picture">✎</button></div><h2>{profile.name || 'Student Builder'}</h2><p>{profile.branch || 'No branch added'}</p><div className="profile-completeness"><span>Profile completeness</span><b>68%</b><div><i /></div></div><div className="privacy-note"><BriefcaseBusiness size={16} /> Phone number is private</div></aside>
        <div className="profile-form"><h2>Personal information</h2><div className="form-grid"><label>Full name<input {...field('name')} required /></label><label>Email<input type="email" {...field('email')} required /></label><label>Phone number<input {...field('phone')} /><small>Private by default</small></label><label>College / university<input {...field('college')} /></label><label>Branch / department<input {...field('branch')} /></label><label>Academic year<select {...field('year')}><option>First year</option><option>Second year</option><option>Third year</option><option>Fourth year</option><option>Graduate</option></select></label></div><h2>Skills & experience</h2><label>Skills<input {...field('skills')} /></label><label>Interests<input {...field('interests')} /></label><div className="form-grid"><label>Experience level<select {...field('experience')}><option>Beginner</option><option>Moderate</option><option>Advanced</option></select></label><label>Previous hackathon experience<input placeholder="e.g. 3 hackathons" /></label></div><h2>Online profiles</h2><div className="form-grid"><label>GitHub profile<input {...field('github')} placeholder="github.com/username" /></label><label>LinkedIn profile<input {...field('linkedin')} placeholder="linkedin.com/in/username" /></label></div><label>Short introduction<textarea {...field('intro')} placeholder="Tell teams what you enjoy building..." /></label>{saved && <div className="form-success">Profile changes saved locally.</div>}<button className="button primary" type="submit">Save profile</button></div>
      </form>
    </div>
  )
}

function Teammates({ notify }: { notify: (text: string) => void }) {
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('All')
  const [invited, setInvited] = useState<number[]>([])
  const filtered = students.filter(s => `${s.name} ${s.college} ${s.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (skill === 'All' || s.skills.includes(skill)))
  const invite = (s: Student) => { setInvited(v => [...v, s.id]); notify(`Invitation sent to ${s.name}`) }
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Community matching</span><h1>Find your teammates</h1></div><span className="demo-label">Local demo profiles</span></div>
      <div className="explore-toolbar"><label className="search-field"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, college or skill" /></label><select value={skill} onChange={e => setSkill(e.target.value)}><option>All</option><option>React</option><option>Python</option><option>Figma</option><option>Firebase</option></select></div>
      <div className="student-grid">{filtered.map(s => {
        const score = 62 + s.skills.length * 7
        return <article className="student-card" key={s.id}><div className="student-head"><div className="student-avatar" style={{ background: s.color }}>{s.initials}</div><div><h3>{s.name}</h3><p>{s.college}</p></div><span className="availability">{s.availability}</span></div><div className="tag-row">{s.skills.map(x => <span key={x}>{x}</span>)}</div><dl><div><dt>Experience</dt><dd>{s.level}</dd></div><div><dt>Hackathons</dt><dd>{s.experience}</dd></div></dl><div className="compatibility"><div><span>Compatibility</span><b>{score}%</b></div><div className="compat-bar"><i style={{ width: `${score}%` }} /></div><small>Shared skills + experience + availability</small></div><button className={invited.includes(s.id) ? 'button secondary full' : 'button primary full'} onClick={() => invite(s)} disabled={invited.includes(s.id)}>{invited.includes(s.id) ? <><Check size={16} /> Invitation sent</> : <><Send size={16} /> Invite teammate</>}</button></article>
      })}</div>
    </div>
  )
}

function Cursor() {
  useEffect(() => {
    const dot = document.querySelector('.cursor-dot') as HTMLElement
    const ring = document.querySelector('.cursor-ring') as HTMLElement
    if (!dot || !ring) return
    const move = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      ring.animate({ transform: `translate(${e.clientX - 16}px, ${e.clientY - 16}px)` }, { duration: 180, fill: 'forwards' })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <><div className="cursor-dot" /><div className="cursor-ring" /></>
}

function Navbar({ session, notifications, setSession }: any) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((n: any) => !n.read).length
  return (
    <header className="navbar">
      <Link className="brand" to="/" aria-label="CODE NEXUS home">
        <span className="brand-mark"><Code2 size={21} /></span>
        <span>CODE <b>NEXUS</b></span>
      </Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu /></button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <Link to="/explore" onClick={() => setOpen(false)}>Explore</Link>
        <Link to="/teammates" onClick={() => setOpen(false)}>Find Teammates</Link>
        <Link to="/teams" onClick={() => setOpen(false)}>Teams</Link>
        <Link to="/workspace" onClick={() => setOpen(false)}>Workspace</Link>
      </nav>
      <div className="nav-actions">
        <Link className="icon-button" to="/notifications" aria-label={`${unread} unread notifications`}><Bell size={19} />{unread > 0 && <span className="badge-dot">{unread}</span>}</Link>
        {session ? (
          <>
            <Link className="icon-button" to="/dashboard" aria-label="Dashboard"><LayoutDashboard size={19} /></Link>
            <button className="avatar-button" onClick={() => setSession(null)} title="Log out"><CircleUserRound size={20} /><span>{session.name?.[0] || 'U'}</span></button>
          </>
        ) : (
          <><Link className="button ghost small" to="/login">Log in</Link><Link className="button primary small" to="/signup">Join now</Link></>
        )}
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand"><span className="brand-mark"><Code2 size={20} /></span><div><b>CODE NEXUS</b><small>Discover. Connect. Build.</small></div></div>
      <div className="footer-links"><Link to="/explore">Hackathons</Link><Link to="/teammates">Community</Link><Link to="/organizer">For organizers</Link><Link to="/admin">Demo admin</Link></div>
      <p>© 2026 CodeX · Frontend demo</p>
    </footer>
  )
}

function Protected({ session, children }: any) {
  return session ? children : <Navigate to="/login" replace />
}

function Home({ saved, toggleSaved }: any) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy reveal">
          <div className="eyebrow"><Sparkles size={15} /> Your next big build starts here</div>
          <h1>Discover hackathons.<br /><span>Find your people.</span></h1>
          <p>Turn an idea into a team project. Explore opportunities, meet collaborators, and ship something meaningful.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/explore">Explore hackathons <ArrowRight size={18} /></Link>
            <Link className="button secondary" to="/teammates"><Users size={18} /> Find teammates</Link>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><span>AM</span><span>DS</span><span>KR</span></div><b>2,400+ students</b><span> building together</span></div>
        </div>
        <HeroVisual />
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">Trending now</span><h2>Featured hackathons</h2></div><Link to="/explore">View all <ArrowRight size={16} /></Link></div>
        <div className="card-grid">{hackathons.slice(0, 3).map(h => <HackathonCard key={h.id} h={h} saved={saved.includes(h.id)} toggleSaved={toggleSaved} />)}</div>
      </section>
      <section className="how-section section">
        <div className="section-heading centered"><div><span className="eyebrow">One connected journey</span><h2>From idea to submission</h2></div></div>
        <div className="journey">{['Discover', 'Match', 'Register', 'Build', 'Submit'].map((x, i) => <div className="journey-step" key={x}><span>{i + 1}</span><b>{x}</b>{i < 4 && <ArrowRight className="journey-arrow" size={18} />}</div>)}</div>
      </section>
      <section className="stats-strip"><div><b>120+</b><span>Demo opportunities</span></div><div><b>2.4k</b><span>Student profiles</span></div><div><b>680</b><span>Teams formed</span></div><div><b>94%</b><span>Projects completed</span></div></section>
    </>
  )
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Collaborative project illustration">
      <div className="dot-grid" />
      <div className="orbit-card card-back"><Code2 /><b>BUILD</b></div>
      <div className="team-window">
        <div className="window-bar"><span /><span /><span /><em>Team workspace</em></div>
        <div className="team-window-body">
          <div className="mini-avatar blue">AM</div><div className="mini-avatar yellow">DS</div><div className="mini-avatar navy">KR</div>
          <div className="sprint-card"><small>SPRINT 03</small><b>Ship the prototype</b><div className="progress-line"><i /></div></div>
        </div>
      </div>
      <div className="paper-plane">➜</div>
      <div className="light-bulb">💡</div>
      <div className="sticky-note">Great idea!<br /><span>✦</span></div>
    </div>
  )
}

function HackathonCard({ h, saved, toggleSaved }: { h: Hackathon; saved: boolean; toggleSaved: (id: number) => void }) {
  return (
    <article className="hack-card">
      <div className={`hack-poster poster-${h.poster}`}>
        <span className="poster-category">{h.category}</span>
        <button className={saved ? 'save-button active' : 'save-button'} onClick={() => toggleSaved(h.id)} aria-label={saved ? 'Unsave hackathon' : 'Save hackathon'}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button>
        <div className="poster-art"><span>&lt;/&gt;</span><i /></div>
      </div>
      <div className="hack-card-body">
        <div className="card-meta"><span className={h.status === 'Closing soon' ? 'status closing' : 'status'}>{h.status}</span><span>{h.mode}</span></div>
        <h3><Link to={`/hackathon/${h.id}`}>{h.name}</Link></h3>
        <p className="organizer">by {h.organizer}</p>
        <div className="hack-facts"><span><CalendarDays size={15} /> {h.deadline}</span><span><Trophy size={15} /> {h.prize}</span></div>
        <div className="hack-footer"><div className="tag-row">{h.skills.slice(0, 2).map(s => <span key={s}>{s}</span>)}</div><Link to={`/hackathon/${h.id}`} aria-label={`Open ${h.name}`}><ArrowRight size={18} /></Link></div>
      </div>
    </article>
  )
}

function Explore({ saved, toggleSaved }: any) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [sort, setSort] = useState('Closing soon')
  const filtered = useMemo(() => {
    let result = hackathons.filter(h =>
      `${h.name} ${h.organizer} ${h.location} ${h.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()) &&
      (mode === 'All' || h.mode === mode) &&
      (difficulty === 'All' || h.difficulty === difficulty))
    if (sort === 'Alphabetical') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'Closing soon') result = [...result].sort((a, b) => a.deadline.localeCompare(b.deadline))
    return result
  }, [query, mode, difficulty, sort])
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Discover opportunities</span><h1>Explore hackathons</h1></div><span className="demo-label">Demo listings · Not live events</span></div>
      <div className="explore-toolbar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, organizer, skill or city" /></label>
        <select value={mode} onChange={e => setMode(e.target.value)} aria-label="Event mode"><option>All</option><option>Online</option><option>Offline</option><option>Hybrid</option></select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} aria-label="Difficulty"><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort"><option>Closing soon</option><option>Alphabetical</option><option>Upcoming events</option></select>
      </div>
      <p className="results-count">{filtered.length} hackathons found</p>
      <div className="card-grid">{filtered.map(h => <HackathonCard key={h.id} h={h} saved={saved.includes(h.id)} toggleSaved={toggleSaved} />)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><h3>No matches found</h3><p>Try removing one or more filters.</p></div>}
    </div>
  )
}

function HackathonDetails({ saved, toggleSaved, notify }: any) {
  const { id } = useParams()
  const h = hackathons.find(x => x.id === Number(id)) || hackathons[0]
  const [status, setStatus] = useState(() => read(`codex_registration_${h.id}`, 'Not Registered'))
  const [showRegister, setShowRegister] = useState(false)
  useEffect(() => save(`codex_registration_${h.id}`, status), [h.id, status])
  const updateStatus = (value: string) => { setStatus(value); notify(`Registration status updated: ${value}`) }
  return (
    <div className="page-shell details-page">
      <Link className="back-link" to="/explore">← Back to explore</Link>
      <div className="details-hero">
        <div className={`details-poster poster-${h.poster}`}><span>&lt;/&gt;</span><small>{h.category}</small></div>
        <div className="details-title"><div className="card-meta"><span className="status">{h.status}</span><span>{h.mode}</span></div><h1>{h.name}</h1><p>Organized by <b>{h.organizer}</b></p><div className="details-actions"><button className="button primary" onClick={() => setShowRegister(true)}>Register <ArrowRight size={17} /></button><button className="button secondary" onClick={() => toggleSaved(h.id)}><Bookmark size={17} fill={saved.includes(h.id) ? 'currentColor' : 'none'} />{saved.includes(h.id) ? 'Saved' : 'Save'}</button><button className="icon-action" onClick={() => notify('Demo notification enabled')}><Bell size={18} /></button></div></div>
      </div>
      <div className="details-layout">
        <div className="details-main">
          <section><h2>About this hackathon</h2><p>{h.description}</p></section>
          <section><h2>Requirements</h2><div className="tag-row large">{h.skills.map(s => <span key={s}>{s}</span>)}</div><ul className="check-list"><li><Check /> Open to students and working professionals</li><li><Check /> Individual or team participation</li><li><Check /> Submit a working demo and project brief</li></ul></section>
          <section><h2>Event timeline</h2><div className="timeline"><div><b>Registration opens</b><span>November 20, 2026</span></div><div><b>Registration closes</b><span>{h.deadline}</span></div><div><b>Event begins</b><span>{h.date}</span></div><div><b>Submission deadline</b><span>{h.date}</span></div></div></section>
        </div>
        <aside className="details-aside">
          <div className="info-card"><h3>Event snapshot</h3><dl><div><dt>Location</dt><dd>{h.location}</dd></div><div><dt>Prize</dt><dd>{h.prize}</dd></div><div><dt>Fee</dt><dd>{h.fee}</dd></div><div><dt>Team size</dt><dd>{h.teamSize}</dd></div><div><dt>Level</dt><dd>{h.difficulty}</dd></div></dl></div>
          <div className="info-card"><h3>Registration tracking</h3><select value={status} onChange={e => updateStatus(e.target.value)}><option>Not Registered</option><option>Registration Submitted</option><option>Confirmed</option></select>{status !== 'Not Registered' && <label className="small-input">Registration ID<input placeholder="Demo ID" /></label>}</div>
          <Link className="button secondary full" to="/teammates">Find teammates <Users size={17} /></Link>
        </aside>
      </div>
      {showRegister && <Modal title="Demo registration" onClose={() => setShowRegister(false)}><p>This is a demonstration listing. No real registration is being made.</p><div className="modal-actions"><button className="button primary" onClick={() => { updateStatus('Registration Submitted'); setShowRegister(false) }}>Mark as submitted</button><button className="button ghost" onClick={() => setShowRegister(false)}>Close</button></div></Modal>}
    </div>
  )
}

function Auth({ mode, setSession }: { mode: 'login' | 'signup'; setSession: (v: any) => void }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const name = String(data.get('name') || '').trim()
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please complete all required fields.')
      return
    }
    if (mode === 'signup') {
      if (password !== String(data.get('confirm') || '')) {
        setError('Passwords do not match.')
        return
      }
      const accounts = read<any[]>('codex_accounts', [])
      if (accounts.some(a => a.email === email)) {
        setError('A demo account already exists for this email.')
        return
      }
      const account = { name, email, password, college: data.get('college'), branch: data.get('branch'), year: data.get('year') }
      save('codex_accounts', [...accounts, account])
      setSuccess('Demo account created.')
      setSession({ name, email })
      setTimeout(() => navigate('/profile'), 450)
      return
    }
    const accounts = read<any[]>('codex_accounts', [])
    const account = accounts.find(a => a.email === email && a.password === password)
    if (!account && !(email === 'demo@codenexus.app' && password === 'demo123')) {
      setError('Invalid demo credentials. Try demo@codenexus.app / demo123.')
      return
    }
    setSuccess('Welcome back.')
    setSession(account || { name: 'Demo Student', email })
    setTimeout(() => navigate('/dashboard'), 350)
  }
  return (
    <div className="auth-page">
      <div className="auth-art"><div className="auth-grid" /><div className="auth-quote"><span className="brand-mark"><Code2 /></span><h2>Great projects start with the right team.</h2><p>Discover. Connect. Build.</p></div></div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <Link className="brand auth-brand" to="/"><span className="brand-mark"><Code2 size={20} /></span><span>CODE <b>NEXUS</b></span></Link>
          <span className="demo-label">Demo Authentication — Backend Not Connected</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p>{mode === 'login' ? 'Log in to continue to your workspace.' : 'Join the student hackathon community.'}</p>
          {mode === 'signup' && <label>Full name<input name="name" placeholder="Your name" /></label>}
          <label>Email address<input name="email" type="email" placeholder="you@example.com" /></label>
          <label>Password<input name="password" type="password" placeholder="••••••••" /></label>
          {mode === 'signup' && <>
            <label>Confirm password<input name="confirm" type="password" placeholder="••••••••" /></label>
            <div className="form-grid"><label>College / university<input name="college" placeholder="Your college" /></label><label>Branch<input name="branch" placeholder="Computer Science" /></label></div>
            <label>Academic year<select name="year"><option>First year</option><option>Second year</option><option>Third year</option><option>Fourth year</option><option>Graduate</option></select></label>
          </>}
          {mode === 'login' && <div className="form-row"><label className="check-label"><input type="checkbox" /> Remember me</label><button type="button" className="text-button" onClick={() => setError('Demo reset link has been simulated.')}>Forgot password?</button></div>}
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button className="button primary full" type="submit">{mode === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={17} /></button>
          {mode === 'login' && <><button className="button secondary full" type="button" onClick={() => setShowDemo(true)}>Continue with Google <b>G</b></button><p className="auth-switch">New to CodeNexus? <Link to="/signup">Create an account</Link></p></>}
          {mode === 'signup' && <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>}
        </form>
      </div>
      {showDemo && <Modal title="Google login demo" onClose={() => setShowDemo(false)}><p>Demo only — Google OAuth is not connected and no third-party authentication is performed.</p></Modal>}
    </div>
  )
}

function Teams() {
  const [members, setMembers] = useState(students.slice(0, 3))
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('Nexus Builders')
  const create = (e: FormEvent) => { e.preventDefault(); save('codex_team', { name, members }); setShowCreate(false) }
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Team management</span><h1>{name}</h1></div><button className="button primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create / edit team</button></div>
      <div className="team-layout"><section className="team-main"><div className="card-heading"><h2>Members</h2><Link className="button secondary small" to="/teammates">Invite member</Link></div>{members.map((m, i) => <div className="member-row" key={m.id}><div className="student-avatar small" style={{ background: m.color }}>{m.initials}</div><div><b>{m.name}</b><span>{i === 0 ? 'Team leader' : i === 1 ? 'Frontend' : 'Backend'}</span></div><button className="icon-button" onClick={() => setMembers(v => v.filter(x => x.id !== m.id))} aria-label={`Remove ${m.name}`}><X size={15} /></button></div>)}</section><aside className="team-side"><div className="info-card"><h3>Selected hackathon</h3><b>Build for Bharat</b><p>Demo listing · Hybrid</p><Link to="/hackathon/1">View details</Link></div><div className="info-card"><h3>Required skill coverage</h3>{['React', 'UI/UX', 'Node.js', 'Python'].map(skill => { const found = members.some(m => m.skills.includes(skill)); return <div className="skill-coverage" key={skill}><span>{skill}</span><b className={found ? 'covered' : 'missing'}>{found ? 'Covered' : 'Missing'}</b></div> })}<p className="compatibility-copy">75% team coverage: 3 of 4 required skills are represented.</p></div></aside></div>
      {showCreate && <Modal title="Create or edit team" onClose={() => setShowCreate(false)}><form className="modal-form" onSubmit={create}><label>Team name<input value={name} onChange={e => setName(e.target.value)} /></label><label>Team description<textarea defaultValue="Building an accessible community platform." /></label><button className="button primary" type="submit">Save team</button></form></Modal>}
    </div>
  )
}

function Chat() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState(() => read<any[]>('codex_messages', [
    { id: 1, sender: 'Aarav', text: 'I pushed the first wireframe pass.', time: '10:24 AM', mine: false },
    { id: 2, sender: 'You', text: 'Nice — I’ll add the registration flow today.', time: '10:27 AM', mine: true },
  ]))
  const send = (e: FormEvent) => { e.preventDefault(); if (!text.trim()) return; const next = [...messages, { id: Date.now(), sender: 'You', text: text.trim(), time: 'Just now', mine: true }]; setMessages(next); save('codex_messages', next); setText('') }
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Private team channel</span><h1>Nexus Builders</h1></div><span className="demo-label">Messages are simulated locally</span></div>
      <div className="chat-layout"><aside className="chat-sidebar"><b>Team members</b>{students.slice(0, 3).map(s => <div className="chat-member" key={s.id}><div className="student-avatar tiny" style={{ background: s.color }}>{s.initials}</div><span>{s.name}</span><i /></div>)}</aside><section className="chat-window"><div className="chat-messages">{messages.map(m => <div className={m.mine ? 'message mine' : 'message'} key={m.id}>{!m.mine && <b>{m.sender}</b>}<p>{m.text}</p><small>{m.time}</small></div>)}</div><form className="chat-compose" onSubmit={send}><button type="button" aria-label="Attach file"><Plus size={18} /></button><input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message or share an update..." /><button className="send-button" type="submit" aria-label="Send message"><Send size={17} /></button></form></section></div>
    </div>
  )
}

type Task = { id: number; title: string; description: string; assignee: string; deadline: string; status: 'TO DO' | 'IN PROGRESS' | 'READY' }

function Workspace({ notify }: { notify: (text: string) => void }) {
  const [tasks, setTasks] = useState<Task[]>(() => read('codex_tasks_full', [
    { id: 1, title: 'Research user needs', description: 'Interview 5 students', assignee: 'Diya', deadline: '2026-12-03', status: 'READY' },
    { id: 2, title: 'Build dashboard UI', description: 'Student dashboard and progress views', assignee: 'Aarav', deadline: '2026-12-06', status: 'IN PROGRESS' },
    { id: 3, title: 'Prepare demo pitch', description: 'Create 5-slide deck', assignee: 'Kabir', deadline: '2026-12-10', status: 'TO DO' },
  ]))
  const [showTask, setShowTask] = useState(false)
  const saveTasks = (next: Task[]) => { setTasks(next); save('codex_tasks_full', next); save('codex_tasks', next) }
  const moveTask = (task: Task, status: Task['status']) => { saveTasks(tasks.map(t => t.id === task.id ? { ...t, status } : t)); if (status === 'READY') notify(`Task completed: ${task.title}`) }
  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Task = {
      id: Date.now(),
      title: String(data.get('title') || 'Untitled task'),
      description: String(data.get('description') || ''),
      assignee: String(data.get('assignee') || 'Unassigned'),
      deadline: String(data.get('deadline') || '2026-12-20'),
      status: 'TO DO',
    }
    saveTasks([...tasks, next])
    notify(`Task assigned: ${next.title}`)
    setShowTask(false)
  }
  const ready = tasks.filter(t => t.status === 'READY').length
  const progress = tasks.length ? Math.round(ready / tasks.length * 100) : 0
  return (
    <div className="page-shell workspace-page">
      <div className="page-heading"><div><span className="eyebrow">Project workspace</span><h1>Build for Bharat</h1></div><button className="button primary" onClick={() => setShowTask(true)}><Plus size={16} /> Add task</button></div>
      <div className="workspace-summary"><div><span>Overall progress</span><b>{progress}%</b><div className="summary-bar"><i style={{ width: `${progress}%` }} /></div></div><div><span>Completed tasks</span><b>{ready}</b></div><div><span>Submission deadline</span><b>Dec 20</b></div></div>
      <div className="kanban">{(['TO DO', 'IN PROGRESS', 'READY'] as Task['status'][]).map(status => <section className="kanban-column" key={status}><div className="kanban-heading"><h2>{status}</h2><span>{tasks.filter(t => t.status === status).length}</span></div>{tasks.filter(t => t.status === status).map(task => <article className="task-card" key={task.id}><div className="task-top"><b>{task.title}</b><button onClick={() => saveTasks(tasks.filter(t => t.id !== task.id))} aria-label={`Delete ${task.title}`}><X size={14} /></button></div><p>{task.description}</p><div className="task-meta"><span><CircleUserRound size={14} /> {task.assignee}</span><span><Clock3 size={14} /> {task.deadline}</span></div><div className="task-actions">{status !== 'TO DO' && <button onClick={() => moveTask(task, 'TO DO')}>To do</button>}{status !== 'IN PROGRESS' && <button onClick={() => moveTask(task, 'IN PROGRESS')}>Working</button>}{status !== 'READY' && <button onClick={() => moveTask(task, 'READY')}>Done</button>}</div></article>)}</section>)}</div>
      {showTask && <Modal title="Create task" onClose={() => setShowTask(false)}><form className="modal-form" onSubmit={addTask}><label>Task title<input name="title" required /></label><label>Description<textarea name="description" /></label><div className="form-grid"><label>Assignee<input name="assignee" /></label><label>Deadline<input name="deadline" type="date" /></label></div><button className="button primary" type="submit">Create task</button></form></Modal>}
    </div>
  )
}

function Notifications({ notifications, setNotifications }: any) {
  const markRead = () => setNotifications((v: any[]) => v.map(n => ({ ...n, read: true })))
  return (
    <div className="page-shell notifications-page">
      <div className="page-heading"><div><span className="eyebrow">Activity center</span><h1>Notifications</h1></div><button className="button secondary" onClick={markRead}>Mark all as read</button></div>
      <div className="notification-list">{notifications.map((n: any) => <div className={n.read ? 'notification-row' : 'notification-row unread'} key={n.id}><div className="notification-icon"><Bell size={17} /></div><div><b>{n.text}</b><span>{n.time}</span></div>{!n.read && <i />}</div>)}</div>
    </div>
  )
}

function Organizer() {
  const [events, setEvents] = useState(() => read('codex_organizer_events', [{ id: 1, name: 'Student Innovation Sprint', status: 'Pending admin review' }]))
  const [show, setShow] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const data = new FormData(e.currentTarget); setEvents(v => [...v, { id: Date.now(), name: String(data.get('name') || 'New demo event'), status: 'Pending admin review' }]); setShow(false) }
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Organizer demo</span><h1>Organizer dashboard</h1></div><button className="button primary" onClick={() => setShow(true)}><Plus size={16} /> Add hackathon</button></div>
      <div className="stat-grid"><div><span><CalendarDays /></span><b>{events.length}</b><small>Submitted events</small></div><div><span><Clock3 /></span><b>{events.filter(e => e.status.includes('Pending')).length}</b><small>Awaiting review</small></div><div><span><Check /></span><b>0</b><small>Approved</small></div></div>
      <div className="dashboard-card"><div className="card-heading"><h2>My submissions</h2></div>{events.map(e => <div className="deadline-row" key={e.id}><div className="date-box poster-bb"><b>DEMO</b></div><div><b>{e.name}</b><span>{e.status}</span></div><button className="icon-button" title="Edit event"><Settings size={16} /></button></div>)}</div>
      {show && <Modal title="Submit demo hackathon" onClose={() => setShow(false)}><form className="modal-form" onSubmit={submit}><label>Hackathon name<input name="name" required /></label><label>Description<textarea /></label><div className="form-grid"><label>Mode<select><option>Online</option><option>Offline</option><option>Hybrid</option></select></label><label>Registration deadline<input type="date" /></label></div><label>Official registration link<input placeholder="https://example.com/demo" /></label><button className="button primary" type="submit">Submit for review</button></form></Modal>}
    </div>
  )
}

function Admin() {
  const [pending, setPending] = useState(() => read('codex_pending_admin', [{ id: 1, name: 'Student Innovation Sprint', organizer: 'Demo Organizer' }]))
  const decide = (id: number, status: 'Approved' | 'Rejected') => { setPending(v => v.filter(x => x.id !== id)); save('codex_pending_admin', pending.filter(x => x.id !== id)); save(`codex_admin_${id}`, status) }
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Demonstration access</span><h1>Admin dashboard</h1></div><span className="demo-label">Admin access is simulated</span></div>
      <div className="stat-grid"><div><span><Users /></span><b>2,400</b><small>Demo users</small></div><div><span><CalendarDays /></span><b>{pending.length}</b><small>Pending approvals</small></div><div><span><MessageCircle /></span><b>3</b><small>Reported items</small></div><div><span><Sparkles /></span><b>Healthy</b><small>Mock sync status</small></div></div>
      <div className="dashboard-layout"><section className="dashboard-card"><div className="card-heading"><h2>Event approvals</h2></div>{pending.length ? pending.map(p => <div className="approval-row" key={p.id}><div><b>{p.name}</b><span>by {p.organizer}</span></div><div><button className="button primary small" onClick={() => decide(p.id, 'Approved')}><Check size={15} /> Approve</button><button className="button ghost small" onClick={() => decide(p.id, 'Rejected')}>Reject</button></div></div>) : <div className="empty-inline">No pending submissions.</div>}</section><section className="dashboard-card"><div className="card-heading"><h2>System activity</h2></div><div className="activity-row"><i />Demo event source checked <span>8 min ago</span></div><div className="activity-row"><i />No synchronization errors <span>20 min ago</span></div><div className="activity-row"><i />Organizer submitted an event <span>1 hr ago</span></div></section></div>
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><div className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>
}

export default App
