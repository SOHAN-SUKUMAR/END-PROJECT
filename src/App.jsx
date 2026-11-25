import { useEffect, useMemo, useRef, useState } from 'react'

const USERS_KEY = 'portfolioUsers'
const SESSION_KEY = 'portfolioSession'
const PROFILES_KEY = 'portfolioProfiles'
const THEME_KEY = 'portfolioTheme'
const DEMO_MEMBERS_VERSION_KEY = 'portfolioDemoMembersVersion'
const DEMO_MEMBERS_VERSION = 'fresh-members-2026-v2'
const ADMIN = { id: 'admin', username: 'sohan', handle: 'vakumulla_sohan', role: 'admin' } // USER HANDLE FEATURE: reserved owner handle.
const ADMIN_PASSWORD = 'sohan123'
const DEMO_USERS = [
  {
    id: 'member-omkar',
    username: 'omkar',
    handle: 'avvaru_omkar',
    password: 'omkar123',
    role: 'user',
  },
]
const PAGE_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Work', path: '/work' },
  { label: 'Contact', path: '/contact' },
]
const PAGE_TITLES = {
  '/': 'Home',
  '/about': 'About',
  '/skills': 'Skills',
  '/work': 'Work',
  '/contact': 'Contact',
  '/accounts': 'Accounts',
}
const PROJECT_LANGUAGES = ['HTML', 'CSS', 'Java', 'JavaScript']
const PROGRAMMING_LANGUAGES = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C',
  'C++',
  'C#',
  'PHP',
  'SQL',
  'Go',
  'Rust',
  'Ruby',
  'Swift',
  'Kotlin',
]
const PROJECTS = [
  {
    className: 'project-card-one',
    visual: 'portfolio-window',
    tags: ['REACT', 'RESPONSIVE'],
    title: 'Personal portfolio',
    description: 'A bold digital identity built to present work with clarity and character.',
    visualLabel: 'PORTFOLIO',
  },
  {
    className: 'project-card-two',
    visual: 'profile-search',
    tags: ['REACT', 'PROFILE SEARCH'],
    title: 'Profile explorer',
    description: 'Search and explore member profiles with clear, helpful feedback.',
    visualLabel: 'Find a profile',
  },
  {
    className: 'project-card-three',
    visual: 'account-ui',
    tags: ['REACT', 'ACCOUNT MANAGEMENT'],
    title: 'Member dashboard',
    description: 'A focused admin experience for viewing and managing registered accounts.',
  },
]

function normalizePagePath(pathname, isAdmin) {
  const path = pathname.replace(/\/+$/, '') || '/'
  // USER HANDLE FEATURE: resolve public profile URLs without changing the existing page routes.
  const publicProfilePath = path.match(/^\/users\/([a-z0-9_][a-z0-9._]{0,29})$/i)
  if (publicProfilePath) return `/users/${publicProfilePath[1].toLowerCase()}`
  return PAGE_TITLES[path] && (path !== '/accounts' || isAdmin) ? path : '/'
}

function PageLink({ to, onNavigate, ...props }) {
  return <a {...props} href={to} onClick={(event) => onNavigate(to, event)} />
}

// USER HANDLE FEATURE: shared live-validation input for registration and profile editing.
function HandleInput({
  id,
  label = 'Choose your handle',
  value,
  onChange,
  onCheckHandle,
  excludeUserId = null,
  showSelected = false,
}) {
  const status = value ? onCheckHandle(value, excludeUserId) : null

  return (
    <div className="handle-field">
      <label htmlFor={id}>{label}</label>
      <div className="handle-input-control">
        <span aria-hidden="true">@</span>
        <input
          autoComplete="off"
          id={id}
          maxLength="30"
          name="handle"
          onChange={(event) => onChange(event.target.value)}
          placeholder="your.handle"
          required
          value={value}
        />
      </div>
      {showSelected && (
        <p className="handle-selected">
          Selected handle: <strong>@{value || 'your.handle'}</strong>
        </p>
      )}
      {status && (
        <>
          <p className={`handle-feedback ${status.available ? 'is-available' : ''}`} role="status">
            {status.message}
          </p>
          {status.suggestions.length > 0 && (
            <div className="handle-suggestions" aria-label="Available handle suggestions">
              <span>Try</span>
              {status.suggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => onChange(suggestion)} type="button">
                  @{suggestion}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const myDetails = {
  name: 'Vakumulla Sohan Sukumar',
  handle: 'vakumulla_sohan', // USER HANDLE FEATURE: default public profile handle.
  id: 'ADMIN-2026',
  email: 'sohan.sukumar@example.com',
  phone: '+91 98765 43210',
  about:
    'I am Vakumulla Sohan Sukumar, a frontend developer from Hyderabad who enjoys building clean, responsive websites and turning practical ideas into thoughtful digital experiences.',
}

const DEMO_PROFILES = [
  {
    ...myDetails,
    userId: ADMIN.id,
    username: ADMIN.username,
    projects: [
      {
        id: 'sohan-portfolio-page',
        title: 'Portfolio Landing Page',
        summary: 'A clean introduction page for showcasing skills and selected work.',
        language: 'HTML',
        githubUrl: '',
      },
      {
        id: 'sohan-color-study',
        title: 'Color Study',
        summary: 'A responsive collection of color palettes and reusable interface styles.',
        language: 'CSS',
        githubUrl: '',
      },
      {
        id: 'sohan-task-planner',
        title: 'Task Planner',
        summary: 'A small task organizer with simple interactive controls.',
        language: 'JavaScript',
        githubUrl: '',
      },
    ],
  },
  {
    userId: 'member-omkar',
    username: 'omkar',
    name: 'Avvaru Omkar',
    handle: 'avvaru_omkar',
    id: 'MEMBER-2026',
    email: 'avvaru.omkar@example.com',
    phone: '+91 91234 56789',
    about: 'I am Avvaru Omkar, a Java and web development enthusiast from Bengaluru who enjoys solving problems, learning new technologies, and building small projects.',
    projects: [
      {
        id: 'omkar-student-resource-tracker',
        title: 'Student Resource Tracker',
        summary: 'A simple program for keeping useful study resources organized.',
        language: 'Java',
        githubUrl: '',
      },
      {
        id: 'omkar-recipe-cards',
        title: 'Recipe Cards',
        summary: 'A responsive collection of recipe cards with clear, readable layouts.',
        language: 'CSS',
        githubUrl: '',
      },
    ],
  },
]

// USER HANDLE FEATURE: validation, local public-profile mapping, and generated avatars.
const HANDLE_PATTERN = /^[a-zA-Z0-9_][a-zA-Z0-9._]{0,29}$/

function normalizeHandle(handle) {
  return String(handle || '').trim().toLowerCase()
}

function fallbackHandle(username) {
  return String(username || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._]+/g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 30) || 'member'
}

// USER PROJECT SHOWCASE: only publish safe HTTPS GitHub repository links.
function isSafeGithubUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' &&
      (url.hostname === 'github.com' || url.hostname.endsWith('.github.com'))
  } catch {
    return false
  }
}

function getHandleAvailability(handle, users, profiles, excludeUserId = null) {
  const value = String(handle || '').trim()
  if (!value) {
    return { available: false, message: 'Choose a public handle.', suggestions: [] }
  }
  if (!HANDLE_PATTERN.test(value)) {
    return {
      available: false,
      message: 'Use 1-30 letters, numbers, underscores, or periods.',
      suggestions: [],
    }
  }

  const accounts = [ADMIN, ...users]
  const claimed = (candidate) => {
    const normalized = normalizeHandle(candidate)
    return accounts.some((account) => {
      if (account.id === excludeUserId) return false
      const savedProfile = profiles.find((item) => item.userId === account.id)
      return normalizeHandle(savedProfile?.handle || account.handle || fallbackHandle(account.username)) === normalized
    })
  }

  if (!claimed(value)) {
    return { available: true, message: `@${value.toLowerCase()} is available.`, suggestions: [] }
  }

  const base = value.toLowerCase().slice(0, 24)
  const suggestions = [`${base}_1`, `${base}1`, `${base}.dev`]
    .filter((candidate) => HANDLE_PATTERN.test(candidate) && !claimed(candidate))
    .slice(0, 3)
  return { available: false, message: `@${value} is already taken.`, suggestions }
}

function createAvatar(displayName, id) {
  const initials = String(displayName || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const tones = ['moss', 'clay', 'rose', 'blue']
  const seed = String(id || displayName || '').split('').reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return { initials, tone: tones[seed % tones.length] }
}

function getPublicProfiles(users, profiles, currentUser) {
  const accounts = [...users, currentUser].filter(
    (account, index, list) => account && list.findIndex((item) => item.id === account.id) === index,
  )
  const publicAccounts = accounts.map((account) => {
    const saved = profiles.find((item) => item.userId === account.id)
    const defaultProfile = account.id === ADMIN.id ? myDetails : null
    const displayName = saved?.name || defaultProfile?.name || account.username
    // USER PROJECT SHOWCASE: expose only the saved project fields on this public profile.
    const savedProjects = Array.isArray(saved?.projects)
      ? saved.projects
          .filter((project) => project && typeof project.title === 'string' && typeof project.summary === 'string')
          .map((project, index) => ({
            id: project.id || `project-${account.id}-${index}`,
            title: project.title,
            summary: project.summary,
            language: PROJECT_LANGUAGES.includes(project.language) ? project.language : 'HTML',
            githubUrl: typeof project.githubUrl === 'string' && isSafeGithubUrl(project.githubUrl)
              ? project.githubUrl
              : '',
          }))
      : []
    return {
      id: account.id,
      username: account.username,
      handle: normalizeHandle(saved?.handle || account.handle || defaultProfile?.handle || fallbackHandle(account.username)),
      displayName,
      avatar: saved?.avatar || account.avatar || createAvatar(displayName, account.id),
      bio: saved?.about || defaultProfile?.about || 'This member has not added a public bio yet.',
      projects: savedProjects,
      isCurrentUser: account.id === currentUser.id,
    }
  })
  return publicAccounts
}

// USER HANDLE FEATURE: consistent local avatar placeholder for search and profile views.
function UserAvatar({ user, size = 'medium' }) {
  const avatar = user.avatar || createAvatar(user.displayName, user.id)
  return (
    <span
      aria-label={`${user.displayName}'s profile picture`}
      className={`user-avatar user-avatar-${avatar.tone} user-avatar-${size}`}
      role="img"
    >
      <span aria-hidden="true">{avatar.initials}</span>
    </span>
  )
}

function readUsers() {
  const saved = localStorage.getItem(USERS_KEY)
  if (saved === null) return []

  const users = JSON.parse(saved)
  if (
    !Array.isArray(users) ||
    users.some(
      (user) =>
        !user ||
        typeof user.id !== 'string' ||
        typeof user.username !== 'string' ||
        typeof user.password !== 'string',
    )
  ) {
    throw new Error('Saved account data is invalid. Clear this site’s Local Storage and reload.')
  }
  return users
}

// FRESH DEMO MEMBERS: replace previous browser accounts once, retaining unrelated app preferences.
function installFreshDemoMembers() {
  if (localStorage.getItem(DEMO_MEMBERS_VERSION_KEY) === DEMO_MEMBERS_VERSION) return

  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
  localStorage.setItem(PROFILES_KEY, JSON.stringify(DEMO_PROFILES))
  localStorage.removeItem(SESSION_KEY)
  localStorage.setItem(DEMO_MEMBERS_VERSION_KEY, DEMO_MEMBERS_VERSION)
}

function readProfiles() {
  const saved = localStorage.getItem(PROFILES_KEY)
  if (!saved) return []

  const profiles = JSON.parse(saved)
  if (!Array.isArray(profiles)) {
    throw new Error('Saved profile data is invalid.')
  }
  return profiles
}

function ThemeToggle({ theme, onToggle, compact = false }) {
  return (
    <button
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={`theme-toggle ${compact ? 'compact' : ''}`}
      onClick={onToggle}
      title={`Use ${theme === 'dark' ? 'light' : 'dark'} theme`}
      type="button"
    >
      <span className="theme-icon sun" aria-hidden="true">☼</span>
      <span className="theme-icon moon" aria-hidden="true">☾</span>
      <span className="theme-knob" />
    </button>
  )
}

function App() {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    try {
      installFreshDemoMembers()
      const savedUsers = readUsers()
      const savedProfiles = readProfiles()
      const sessionId = localStorage.getItem(SESSION_KEY)
      setUsers(savedUsers)
      setProfiles(savedProfiles)
      setCurrentUser(
        sessionId === ADMIN.id
          ? ADMIN
          : savedUsers.find((user) => user.id === sessionId) || null,
      )
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : 'Browser Local Storage is unavailable.',
      )
    } finally {
      setReady(true)
    }
  }, [])

  function signIn(username, password) {
    const normalizedUsername = username.trim().toLowerCase()
    const user =
      normalizedUsername === ADMIN.username && password === ADMIN_PASSWORD
        ? ADMIN
        : users.find(
            (account) =>
              account.username.toLowerCase() === normalizedUsername &&
              account.password === password,
          )

    if (!user) return 'Incorrect username or password.'

    try {
      localStorage.setItem(SESSION_KEY, user.id)
      setCurrentUser(user)
      return ''
    } catch {
      return 'Could not save your login. Check that browser Local Storage is enabled.'
    }
  }

  function checkHandle(handle, excludeUserId = null) {
    return getHandleAvailability(handle, users, profiles, excludeUserId)
  }

  // USER HANDLE FEATURE: validate and persist the chosen public handle during signup.
  function signUp(username, password, handle, role, adminUsername, adminPassword) {
    const normalizedUsername = username.trim()
    const handleStatus = checkHandle(handle)
    if (!handleStatus.available) {
      return `${handleStatus.message}${handleStatus.suggestions.length ? ` Try ${handleStatus.suggestions.map((suggestion) => `@${suggestion}`).join(', ')}.` : ''}`
    }
    if (role !== 'user' && role !== 'admin') {
      return 'Choose a valid account type.'
    }
    if (
      role === 'admin' &&
      (adminUsername.trim().toLowerCase() !== ADMIN.username ||
        adminPassword !== ADMIN_PASSWORD)
    ) {
      return 'Only an existing admin can authorize admin registration.'
    }
    if (normalizedUsername.toLowerCase() === ADMIN.username) {
      return 'That username is reserved. Please choose another one.'
    }
    if (
      users.some(
        (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase(),
      )
    ) {
      return 'That username is already registered.'
    }

    const user = {
      id: globalThis.crypto?.randomUUID?.() || `user-${Date.now()}`,
      username: normalizedUsername,
      handle: normalizeHandle(handle),
      password,
      role,
    }
    const updatedUsers = [...users, user]

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
      localStorage.setItem(SESSION_KEY, user.id)
      setUsers(updatedUsers)
      setCurrentUser(user)
      return ''
    } catch {
      return 'Could not save your account. Check that browser Local Storage is enabled.'
    }
  }

  function signOut() {
    try {
      localStorage.removeItem(SESSION_KEY)
      setCurrentUser(null)
    } catch {
      setStorageError('Could not sign out. Check that browser Local Storage is enabled.')
    }
  }

  function removeUser(id) {
    const updatedUsers = users.filter((user) => user.id !== id)
    const updatedProfiles = profiles.filter((profile) => profile.userId !== id)
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles))
      setUsers(updatedUsers)
      setProfiles(updatedProfiles)
    } catch {
      setStorageError('Could not update accounts in browser Local Storage.')
    }
  }

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  // USER HANDLE FEATURE: enforce uniqueness when a profile handle is edited.
  function saveProfile(profile) {
    if (!currentUser) return 'No account is signed in.'
    const handleStatus = checkHandle(profile.handle, currentUser.id)
    if (!handleStatus.available) {
      return `${handleStatus.message}${handleStatus.suggestions.length ? ` Try ${handleStatus.suggestions.map((suggestion) => `@${suggestion}`).join(', ')}.` : ''}`
    }
    const nextProfiles = [
      ...profiles.filter((item) => item.userId !== currentUser.id),
      {
        ...profile,
        handle: normalizeHandle(profile.handle),
        userId: currentUser.id,
        username: currentUser.username,
      },
    ]
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(nextProfiles))
      setProfiles(nextProfiles)
      return ''
    } catch {
      return 'Could not save your profile. Check browser Local Storage.'
    }
  }

  if (!ready) return <p className="loading-message">Loading portfolio...</p>

  if (storageError) {
    return (
      <main className="login-screen">
        <section className="login-panel" role="alert">
          <h1>Storage error</h1>
          <p>{storageError}</p>
        </section>
      </main>
    )
  }

  if (!currentUser) {
    return (
      <AuthScreen
        onSignIn={signIn}
        onSignUp={signUp}
        onCheckHandle={checkHandle}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
    )
  }

  const hasProfile = profiles.some((profile) => profile.userId === currentUser.id)
  if (!hasProfile && currentUser.role !== 'admin') {
    return (
      <ProfileSetupScreen
        onSaveProfile={saveProfile}
        onCheckHandle={checkHandle}
        onSignOut={signOut}
        onToggleTheme={toggleTheme}
        theme={theme}
        user={currentUser}
      />
    )
  }

  if (currentUser.role === 'admin') {
    return (
      <Portfolio
        isAdmin
        onRemoveUser={removeUser}
        onSaveProfile={saveProfile}
        onCheckHandle={checkHandle}
        onSignOut={signOut}
        onToggleTheme={toggleTheme}
        profiles={profiles}
        theme={theme}
        user={currentUser}
        users={users}
      />
    )
  }

  return (
    <Portfolio
      onSaveProfile={saveProfile}
      onCheckHandle={checkHandle}
      onSignOut={signOut}
      onToggleTheme={toggleTheme}
      profiles={profiles}
      theme={theme}
      user={currentUser}
      users={users}
    />
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [className, delay])

  return (
    <div
      ref={elementRef}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      data-reveal-id={`${delay}-${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function AuthScreen({ onSignIn, onSignUp, onCheckHandle, onToggleTheme, theme }) {
  const [mode, setMode] = useState('login')
  const [accountRole, setAccountRole] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [handle, setHandle] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '')
    const password = String(formData.get('password') || '')
    let message

    if (mode === 'signup') {
      if (password !== formData.get('confirmPassword')) {
        setError('Passwords do not match.')
        return
      }
      message = onSignUp(
        username,
        password,
        String(formData.get('handle') || ''),
        accountRole,
        String(formData.get('adminUsername') || ''),
        String(formData.get('adminPassword') || ''),
      )
    } else {
      message = onSignIn(username, password)
    }

    setError(message)
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
  }

  return (
    <main className="login-screen">
      <section className="auth-shell" aria-label="Portfolio authentication">
        <div className="auth-story">
          <div className="auth-theme">
            <ThemeToggle onToggle={onToggleTheme} theme={theme} />
          </div>
          <a className="auth-brand" href="#top" aria-label="Sohan Sukumar home">
            <span className="brand-mark">S</span>
            <span>sohan<span className="brand-period">.</span></span>
          </a>
          <div className="auth-story-copy">
            <span className="auth-kicker">DIGITAL DESIGNER &amp; DEVELOPER</span>
            <h2>Ideas,<br /><em>made visible.</em></h2>
            <p>Explore a curated portfolio shaped by curiosity, clean code, and intentional design.</p>
          </div>
          <div className="auth-art" aria-hidden="true">
            <div className="auth-orbit orbit-a" />
            <div className="auth-orbit orbit-b" />
            <div className="auth-sphere" />
          </div>
          <p className="auth-footer">PORTFOLIO EXPERIENCE · 2026</p>
        </div>

        <form className="login-panel" onSubmit={handleSubmit}>
          <div className="auth-heading">
            <span className="eyebrow">MEMBER ACCESS</span>
            <h1>{mode === 'login' ? 'Welcome back.' : 'Join the portfolio.'}</h1>
            <p>{mode === 'login' ? 'Sign in to continue exploring.' : 'Create a new account to enter.'}</p>
          </div>
          <div className="auth-mode" role="tablist" aria-label="Authentication mode">
            <button
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'selected' : ''}
              onClick={() => changeMode('login')}
              role="tab"
              type="button"
            >
              Sign in
            </button>
            <button
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'selected' : ''}
              onClick={() => changeMode('signup')}
              role="tab"
              type="button"
            >
              Create account
            </button>
          </div>
          {mode === 'signup' && (
            <fieldset className="role-picker">
              <legend>Account type</legend>
              <label className={accountRole === 'user' ? 'selected' : ''}>
                <input
                  checked={accountRole === 'user'}
                  name="accountRole"
                  onChange={() => setAccountRole('user')}
                  type="radio"
                  value="user"
                />
                <span><strong>User</strong><small>View the portfolio</small></span>
              </label>
              <label className={accountRole === 'admin' ? 'selected' : ''}>
                <input
                  checked={accountRole === 'admin'}
                  name="accountRole"
                  onChange={() => setAccountRole('admin')}
                  type="radio"
                  value="admin"
                />
                <span><strong>Admin</strong><small>Manage accounts</small></span>
              </label>
            </fieldset>
          )}
          {mode === 'signup' && accountRole === 'admin' && (
            <div className="admin-authorization">
              <p>Existing admin authorization required.</p>
              <label htmlFor="adminUsername">Admin username</label>
              <input autoComplete="username" id="adminUsername" name="adminUsername" required />
              <label htmlFor="adminPassword">Admin password</label>
              <input
                autoComplete="current-password"
                id="adminPassword"
                name="adminPassword"
                required
                type={showPassword ? 'text' : 'password'}
              />
            </div>
          )}
          <label htmlFor="username">Username</label>
          <input autoComplete="username" id="username" maxLength="40" name="username" placeholder="Enter your username" required />
          {mode === 'signup' && (
            /* USER HANDLE FEATURE: keep the public handle separate from the sign-in username. */
            <HandleInput
              id="registration-handle"
              onChange={setHandle}
              onCheckHandle={onCheckHandle}
              showSelected
              value={handle}
            />
          )}
          <label htmlFor="password">Password</label>
          <input
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            id="password"
            minLength={mode === 'signup' ? 8 : undefined}
            name="password"
            placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
            required
            type={showPassword ? 'text' : 'password'}
          />
          {mode === 'signup' && (
            <>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                autoComplete="new-password"
                id="confirmPassword"
                minLength="8"
                name="confirmPassword"
                placeholder="Repeat your password"
                required
                type={showPassword ? 'text' : 'password'}
              />
            </>
          )}
          <label className="show-password-option" htmlFor="showPassword">
            <input checked={showPassword} id="showPassword" onChange={(event) => setShowPassword(event.target.checked)} type="checkbox" />
            <span>Show password</span>
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit">
            <span>{mode === 'login' ? 'Enter portfolio' : `Create ${accountRole} account`}</span>
            <span aria-hidden="true">↗</span>
          </button>
          {mode === 'login' && (
            <details className="demo-access">
              <summary>Demo account access</summary>
              <p>Admin · Username <strong>{ADMIN.username}</strong> · Password <strong>{ADMIN_PASSWORD}</strong></p>
              <p>User · Username <strong>omkar</strong> · Password <strong>omkar123</strong></p>
            </details>
          )}
          <p className="demo-hint">Demo environment · accounts are stored locally in this browser.</p>
        </form>
      </section>
    </main>
  )
}

function ProfileSetupScreen({
  user,
  onSaveProfile,
  onCheckHandle,
  onSignOut,
  onToggleTheme,
  theme,
  initialProfile = null,
  isEditing = false,
  onCancel,
}) {
  const [error, setError] = useState('')
  const [handle, setHandle] = useState(
    initialProfile?.handle || user.handle || fallbackHandle(user.username),
  )

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const profile = {
      name: String(formData.get('name') || '').trim(),
      handle: String(formData.get('handle') || '').trim(),
      id: String(formData.get('studentId') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      about: String(formData.get('about') || '').trim(),
      // USER PROJECT SHOWCASE: preserve projects when other profile details are edited.
      projects: Array.isArray(initialProfile?.projects) ? initialProfile.projects : [],
      skills: Array.isArray(initialProfile?.skills) ? initialProfile.skills : [],
    }

    if (!profile.name || !profile.id || !profile.email || !profile.phone || !profile.about) {
      setError('Complete every field before entering the portfolio.')
      return
    }

    const saveError = onSaveProfile(profile)
    setError(saveError)
    if (!saveError && isEditing) onCancel()
  }

  return (
    <main className="profile-setup-screen">
      <div className="profile-setup-shell">
        <aside className="profile-setup-story">
          <div className="profile-setup-brand">
            <a className="brand" href="#top" aria-label="Sohan Sukumar home">
              <span className="brand-mark">S</span>
              <span>sohan<span className="brand-period">.</span></span>
            </a>
            <ThemeToggle onToggle={onToggleTheme} theme={theme} compact />
          </div>
          <div className="profile-setup-copy">
            <span className="auth-kicker">{isEditing ? 'YOUR PROFILE' : 'FIRST-TIME PROFILE'}</span>
            <h1>{isEditing ? <>Make it<br /><em>your own.</em></> : <>Make the<br /><em>portfolio yours.</em></>}</h1>
            <p>
              {isEditing
                ? 'Update the details shown across your portfolio and in profile searches.'
                : 'Your details will appear across the portfolio and become searchable for everyone in this browser.'}
            </p>
          </div>
          <div className="setup-progress" aria-label="Profile setup progress">
            <span className="active" />
            <span />
            <span />
          </div>
        </aside>

        <form className="profile-setup-form" onSubmit={handleSubmit}>
          <div className="setup-form-heading">
            <span>{isEditing ? `Editing profile · ${user.username}` : `Welcome, ${user.username}`}</span>
            {isEditing
              ? <button onClick={onCancel} type="button">Cancel</button>
              : <button onClick={onSignOut} type="button">Sign out</button>}
          </div>
          <div>
            <span className="eyebrow">PROFILE DETAILS</span>
            <h2>{isEditing ? 'Update your details.' : 'Tell us about you.'}</h2>
            <p>{isEditing ? 'Your saved details will update across the portfolio.' : 'These details will be shown when your name is searched.'}</p>
          </div>
          <div className="setup-fields">
            {/* USER HANDLE FEATURE: allow the owner to keep or change their public handle. */}
            <HandleInput
              id="profile-handle"
              onChange={setHandle}
              onCheckHandle={onCheckHandle}
              excludeUserId={user.id}
              value={handle}
            />
            <label>
              <span>Full name</span>
              <input defaultValue={initialProfile?.name || ''} name="name" placeholder="e.g. V. Sohan Sukumar" required />
            </label>
            <label>
              <span>Student / member ID</span>
              <input defaultValue={initialProfile?.id || ''} name="studentId" placeholder="e.g. 250001234" required />
            </label>
            <label>
              <span>Email address</span>
              <input defaultValue={initialProfile?.email || ''} name="email" placeholder="you@example.com" required type="email" />
            </label>
            <label>
              <span>Phone number</span>
              <input defaultValue={initialProfile?.phone || ''} name="phone" placeholder="+91 XXXXX XXXXX" required />
            </label>
            <label className="setup-about">
              <span>About you</span>
              <textarea
                maxLength="320"
                defaultValue={initialProfile?.about || ''}
                name="about"
                placeholder="Share what you create, study, or care about..."
                required
                rows="4"
              />
            </label>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit">
            <span>{isEditing ? 'Save profile changes' : 'Save and enter portfolio'}</span>
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </div>
    </main>
  )
}

function AdminDashboard({ users, onRemoveUser }) {
  return (
    <section aria-labelledby="accounts-heading" className="section admin-overview" id="accounts">
      <div className="admin-overview-heading">
        <div>
          <span className="section-index">ADMINISTRATION</span>
          <h3 id="accounts-heading">Member overview</h3>
        </div>
        <p className="account-count">
          <strong>{users.length}</strong>
          <span>{users.length === 1 ? 'account' : 'accounts'}</span>
        </p>
      </div>
      <p className="admin-count-note">Accounts registered in this browser.</p>
      {users.length === 0 ? (
        <div className="empty-account-state">
          <span>0</span>
          <p>No member accounts yet.</p>
          <p>Sign out and create an account to see it here.</p>
        </div>
      ) : (
        <div className="account-list">
          {users.map((user) => (
            <div className="account-row" key={user.id}>
              <div className="account-avatar" aria-hidden="true">{user.username.slice(0, 1).toUpperCase()}</div>
              <p><strong>{user.username}</strong> <span>{user.role.toUpperCase()}</span></p>
              <button onClick={() => onRemoveUser(user.id)} type="button">Remove</button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function HomePage({ profile, onNavigate }) {
  return (
    <>
      <section className="hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <span className="eyebrow hero-kicker"><span className="availability-dot" /> AVAILABLE FOR OPPORTUNITIES</span>
          <h1 id="home-heading">Building for<br /><span>what’s next.</span></h1>
          <p className="hero-intro">I’m <strong>{profile.name}</strong>, a curious web developer turning ideas into thoughtful digital experiences.</p>
          <div className="hero-actions">
            <PageLink className="btn" onNavigate={onNavigate} to="/work">
              Explore my work <span aria-hidden="true">↗</span>
            </PageLink>
            <PageLink className="text-link" onNavigate={onNavigate} to="/contact">
              Contact me <span aria-hidden="true">↗</span>
            </PageLink>
          </div>
        </div>
        <div className="hero-visual" aria-label="Creative technology illustration">
          <div className="visual-grid" aria-hidden="true" />
          <div className="visual-ring ring-one" aria-hidden="true" />
          <div className="visual-ring ring-two" aria-hidden="true" />
          <div className="visual-core" aria-hidden="true"><span>S</span></div>
          <div className="visual-card visual-card-top">
            <span className="visual-card-index">01</span>
            <div><small>ROLE</small><strong>Developer</strong></div>
          </div>
          <div className="visual-card visual-card-bottom">
            <span className="pulse-dot" />
            <div><small>CURRENTLY</small><strong>Creating &amp; learning</strong></div>
          </div>
          <span className="visual-label">CREATIVE CODE · 2026</span>
        </div>
      </section>

      <Reveal className="section-reveal">
        <section className="section home-intro">
          <div>
            <span className="section-index">A LITTLE ABOUT ME</span>
            <h2>Curiosity, craft<br />and clean code.</h2>
          </div>
          <div className="home-intro-copy">
            <p>{profile.about}</p>
            <p className="home-expertise">HTML <span>·</span> CSS <span>·</span> JavaScript <span>·</span> Responsive design</p>
            <PageLink className="text-link" onNavigate={onNavigate} to="/about">
              Get to know me <span aria-hidden="true">↗</span>
            </PageLink>
          </div>
        </section>
      </Reveal>

      <Reveal className="section-reveal">
        <section className="section projects-section home-projects">
          <div className="section-heading projects-heading">
            <div>
              <span className="section-index">A FEW THINGS I’VE MADE</span>
              <h2>Selected work.</h2>
            </div>
            <PageLink className="text-link" onNavigate={onNavigate} to="/work">
              View all work <span aria-hidden="true">↗</span>
            </PageLink>
          </div>
          <ProjectCards projects={PROJECTS.slice(0, 2)} />
        </section>
      </Reveal>
    </>
  )
}

function AboutPage({ profile }) {
  return (
    <>
      <Reveal className="profile-reveal">
        <section className="section profile-box">
          <div className="section-heading">
            <span className="section-index">ABOUT / PROFILE</span>
            <h1>A little<br />about me</h1>
          </div>
          <div className="detail-list">
            <p><strong>Name</strong> <span>{profile.name}</span></p>
            {/* USER HANDLE FEATURE: show the saved handle on the owner's profile page. */}
            <p><strong>Handle</strong> <span>@{profile.handle || fallbackHandle(profile.username)}</span></p>
            <p><strong>Student ID</strong> <span>{profile.id}</span></p>
            <p><strong>Email</strong> <span>{profile.email}</span></p>
            <p><strong>Phone</strong> <span>{profile.phone}</span></p>
          </div>
        </section>
      </Reveal>
      <Reveal className="section-reveal">
        <section className="section about-section about-page-story">
          <div className="section-heading">
            <span className="section-index">THE STORY SO FAR</span>
            <h2>Curious by nature.<br /><span>Creative by choice.</span></h2>
          </div>
          <div className="about-content">
            <p className="about-copy">{profile.about}</p>
            <div className="about-stats">
              <p><strong>04</strong><span>Core technologies</span></p>
              <p><strong>03</strong><span>Featured projects</span></p>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  )
}

function SkillsPage({ profile, onSaveSkills }) {
  const savedSkills = Array.isArray(profile.skills)
    ? profile.skills.filter((language) => PROGRAMMING_LANGUAGES.includes(language))
    : []
  const [selectedLanguages, setSelectedLanguages] = useState(savedSkills)
  const [editingSkills, setEditingSkills] = useState(savedSkills.length === 0)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const saveError = onSaveSkills(selectedLanguages)
    setError(saveError)
    setSaved(!saveError)
    if (!saveError) setEditingSkills(false)
  }

  function toggleLanguage(language, checked) {
    setSelectedLanguages((current) => checked
      ? [...current, language]
      : current.filter((item) => item !== language))
    setSaved(false)
    setError('')
  }

  function cancelEditing() {
    setSelectedLanguages(savedSkills)
    setEditingSkills(false)
    setError('')
    setSaved(false)
  }

  function editSkills() {
    setEditingSkills(true)
    setSaved(false)
  }

  return (
    <Reveal className="section-reveal">
      <section className="section skills-section skills-page">
        <div className="section-heading skills-heading">
          <div>
            <span className="section-index">THE TOOLKIT</span>
            <h1>Things I work with</h1>
          </div>
          <p>{editingSkills ? <>Select the languages<br />you know.</> : <>Your selected<br />languages.</>}</p>
        </div>
        {editingSkills ? (
          <form className="skill-language-form" onSubmit={handleSubmit}>
            <fieldset className="skill-language-picker">
              <legend>Programming languages you know</legend>
              <div className="skill-language-options">
                {PROGRAMMING_LANGUAGES.map((language) => {
                  const isSelected = selectedLanguages.includes(language)
                  return (
                    <label className={`skill-language-option ${isSelected ? 'is-selected' : ''}`} key={language}>
                      <input
                        checked={isSelected}
                        onChange={(event) => toggleLanguage(language, event.target.checked)}
                        type="checkbox"
                      />
                      <span>{language}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
            <div className="skill-language-save">
              <button className="project-save-button" type="submit">Save skills</button>
              {savedSkills.length > 0 && (
                <button className="project-cancel-button" onClick={cancelEditing} type="button">Cancel</button>
              )}
              {error && <p className="skill-save-feedback is-error" role="alert">{error}</p>}
            </div>
          </form>
        ) : (
          <div className="skill-saved-view">
            <button className="project-save-button" onClick={editSkills} type="button">Change skills</button>
            {saved && <p className="skill-save-feedback" role="status">Your skills have been saved to your profile.</p>}
            {selectedLanguages.length > 0 ? (
              <div className="skills-grid">
                {selectedLanguages.map((language, index) => (
                  <article key={language}>
                    <span className="skill-number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="skill-mark">{language === 'JavaScript' ? 'JS' : language.slice(0, 2).toUpperCase()}</div>
                    <h2>{language}</h2>
                    <p>Selected skill</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="skill-selection-empty">No languages selected. Use “Change skills” to add some.</p>
            )}
          </div>
        )}
      </section>
    </Reveal>
  )
}

function ProjectCards({ projects }) {
  return (
    <div className="projects">
      {projects.map((project, index) => (
        <article className={`box project-card ${project.className}`} key={project.title}>
          <span className="project-number">0{index + 1}</span>
          <div className={`project-art project-art-${project.className.split('-').pop()}`} aria-hidden="true">
            {project.visual === 'portfolio-window' && (
              <div className="portfolio-window"><span>{project.visualLabel}</span><i /><i /><i /></div>
            )}
            {project.visual === 'profile-search' && (
              <div className="profile-search"><span>{project.visualLabel}</span><div><i /><b>⌕</b></div></div>
            )}
            {project.visual === 'account-ui' && (
              <div className="account-ui"><div /><div /><div /><div /></div>
            )}
          </div>
          <div className="project-meta">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <span className="project-arrow" aria-hidden="true">↗</span>
        </article>
      ))}
    </div>
  )
}

function WorkPage({ profile, onSaveProjects }) {
  const projectCount = profile.projects?.length || 0

  return (
    <Reveal className="section-reveal">
      <section className="section projects-section work-page">
        <div className="section-heading projects-heading">
          <div>
            <span className="section-index">SELECTED WORK</span>
            <h1>Made with curiosity.</h1>
          </div>
          <span className="project-count">
            {String(projectCount).padStart(2, '0')} {projectCount === 1 ? 'PROJECT' : 'PROJECTS'}
          </span>
        </div>
        <p className="page-intro">Projects you add to your profile will appear here.</p>
        <ProjectShowcase profile={{ ...profile, isCurrentUser: true }} onSaveProjects={onSaveProjects} />
      </section>
    </Reveal>
  )
}

function ContactPage({ profile }) {
  return (
    <Reveal className="section-reveal">
      <section className="section contact contact-page">
        <div className="contact-orbit" aria-hidden="true" />
        <div className="contact-copy">
          <span className="section-index">LET’S SAY HELLO</span>
          <h1>Have a good one<br /><span>in mind?</span></h1>
          <p>For professional inquiries, collaborations, or a simple hello.</p>
        </div>
        <div className="contact-details">
          <p><strong>Email</strong> <span>{profile.email}</span></p>
          <p><strong>Phone</strong> <span>{profile.phone}</span></p>
          <a className="btn" href={`mailto:${profile.email}`}>
            <span>Start a conversation</span>
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </Reveal>
  )
}

// USER PROJECT SHOWCASE: edit project metadata locally without exposing account fields.
function ProjectEditor({ project, onCancel, onSave }) {
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') || '').trim()
    const summary = String(formData.get('summary') || '').trim()
    const language = String(formData.get('language') || '')
    const githubUrl = String(formData.get('githubUrl') || '').trim()

    if (!title || !summary || !PROJECT_LANGUAGES.includes(language)) {
      setError('Add a project name, description, and supported language.')
      return
    }
    if (githubUrl && !isSafeGithubUrl(githubUrl)) {
      setError('Use an HTTPS link from github.com.')
      return
    }

    const saveError = onSave({
      id: project?.id || globalThis.crypto?.randomUUID?.() || `project-${Date.now()}`,
      title,
      summary,
      language,
      githubUrl,
    })
    setError(saveError)
    if (!saveError) onCancel()
  }

  return (
    <form className="project-editor" onSubmit={handleSubmit}>
      <div className="project-editor-heading">
        <div>
          <span className="section-index">{project ? 'EDIT PROJECT' : 'NEW PROJECT'}</span>
          <h3>{project ? 'Update your project.' : 'Add a project.'}</h3>
        </div>
        <button aria-label="Close project form" className="project-editor-close" onClick={onCancel} type="button">×</button>
      </div>
      <div className="project-editor-fields">
        <label>
          <span>Project Name</span>
          <input defaultValue={project?.title || ''} maxLength="80" name="title" placeholder="e.g. Personal portfolio" required />
        </label>
        <label>
          <span>Programming Language</span>
          <select defaultValue={project?.language || 'HTML'} name="language" required>
            {PROJECT_LANGUAGES.map((language) => <option key={language} value={language}>{language}</option>)}
          </select>
        </label>
        <label className="project-editor-description">
          <span>Short Description</span>
          <textarea defaultValue={project?.summary || ''} maxLength="320" name="summary" placeholder="What does this project do?" required rows="3" />
        </label>
        <label className="project-editor-link">
          <span>GitHub Link <small>(optional)</small></span>
          <input defaultValue={project?.githubUrl || ''} inputMode="url" name="githubUrl" placeholder="https://github.com/you/project" type="url" />
        </label>
      </div>
      {error && <p className="project-editor-error" role="alert">{error}</p>}
      <div className="project-editor-actions">
        <button className="project-save-button" type="submit">{project ? 'Save changes' : 'Add Project'}</button>
        <button className="project-cancel-button" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  )
}

// USER PROJECT SHOWCASE: language filters and owner-only project management.
function ProjectShowcase({ profile, onSaveProjects }) {
  const [activeLanguage, setActiveLanguage] = useState('All')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [saveError, setSaveError] = useState('')
  const canManageProjects = profile.isCurrentUser
  const projects = profile.projects || []
  const visibleProjects = activeLanguage === 'All'
    ? projects
    : projects.filter((project) => project.language === activeLanguage)

  function closeEditor() {
    setEditorOpen(false)
    setEditingProject(null)
  }

  function openEditor(project = null) {
    setEditingProject(project)
    setSaveError('')
    setEditorOpen(true)
  }

  function saveProject(updatedProject) {
    const nextProjects = editingProject
      ? projects.map((project) => project.id === editingProject.id ? updatedProject : project)
      : [...projects, updatedProject]
    const error = onSaveProjects(nextProjects)
    if (!error) setActiveLanguage('All')
    return error
  }

  function deleteProject(projectId) {
    const error = onSaveProjects(projects.filter((project) => project.id !== projectId))
    setSaveError(error)
  }

  return (
    <div className="public-projects">
      <div className="public-projects-heading">
        <div>
          <span className="section-index">SHARED PUBLICLY</span>
          <h2>Projects</h2>
        </div>
        {projects.length > 0 && (
          <div className="public-projects-heading-actions">
            <span>{String(projects.length).padStart(2, '0')} PROJECTS</span>
            {canManageProjects && (
              <button className="add-project-button" onClick={() => openEditor()} type="button">
                <span aria-hidden="true">+</span> Add Project
              </button>
            )}
          </div>
        )}
      </div>
      {saveError && <p className="project-save-error" role="alert">{saveError}</p>}
      {editorOpen && canManageProjects && (
        <ProjectEditor project={editingProject} onCancel={closeEditor} onSave={saveProject} />
      )}
      {projects.length === 0 ? (
        <div className="public-projects-empty">
          <span aria-hidden="true">✳</span>
          <p>No projects added yet</p>
          {canManageProjects && (
            <button className="add-project-button" onClick={() => openEditor()} type="button">
              <span aria-hidden="true">+</span> Add Project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="project-filters" role="group" aria-label="Filter projects by programming language">
            {['All', ...PROJECT_LANGUAGES].map((language) => (
              <button
                aria-pressed={activeLanguage === language}
                className={activeLanguage === language ? 'is-active' : ''}
                key={language}
                onClick={() => setActiveLanguage(language)}
                type="button"
              >
                {language}
              </button>
            ))}
          </div>
          {visibleProjects.length === 0 ? (
            <p className="project-filter-empty">No {activeLanguage} projects yet.</p>
          ) : (
            <div className="public-projects-grid">
              {visibleProjects.map((project) => (
                <article className="public-project-card" key={project.id || project.title}>
                  <div className="project-card-topline">
                    <span className="project-language-tag">{project.language}</span>
                    <span className="public-project-mark" aria-hidden="true">✳</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  {project.githubUrl && (
                    <a className="project-github-link" href={project.githubUrl} rel="noopener noreferrer" target="_blank">
                      View on GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {canManageProjects && (
                    <div className="project-card-actions">
                      <button onClick={() => openEditor(project)} type="button">Edit</button>
                      <button onClick={() => deleteProject(project.id)} type="button">Delete</button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// USER HANDLE FEATURE: public profile view only receives whitelisted public fields.
function PublicProfilePage({ profile, onNavigate, onSaveProjects }) {
  return (
    <Reveal className="section-reveal">
      <section className="public-profile section" aria-labelledby="public-profile-heading">
        <div className="public-profile-topline">
          <span className="section-index">PUBLIC PROFILE</span>
          <PageLink className="public-back-link" onNavigate={onNavigate} to="/">
            <span aria-hidden="true">←</span> Back to portfolio
          </PageLink>
        </div>
        <div className="public-profile-intro">
          <UserAvatar size="large" user={profile} />
          <div className="public-profile-copy">
            <span className="public-profile-handle">@{profile.handle}</span>
            <h1 id="public-profile-heading">{profile.displayName}</h1>
            <p>{profile.bio}</p>
          </div>
        </div>
        <ProjectShowcase profile={profile} onSaveProjects={onSaveProjects} />
        <div className="public-profile-footer">
          <p>Discover more work from this portfolio.</p>
          <PageLink className="btn" onNavigate={onNavigate} to="/work">
            Explore projects <span aria-hidden="true">↗</span>
          </PageLink>
        </div>
      </section>
    </Reveal>
  )
}

function PublicProfileNotFound({ onNavigate }) {
  return (
    <Reveal className="section-reveal">
      <section className="public-profile-not-found section">
        <span className="section-index">PROFILE NOT FOUND</span>
        <h1>This handle is not available.</h1>
        <p>It may have changed, or it may not be part of this demo.</p>
        <PageLink className="btn" onNavigate={onNavigate} to="/">
          Back to home <span aria-hidden="true">↗</span>
        </PageLink>
      </section>
    </Reveal>
  )
}

// USER HANDLE FEATURE: local user discovery, handle display, and public profile routing.
function Portfolio({
  user,
  onSignOut,
  onSaveProfile,
  onCheckHandle,
  isAdmin = false,
  users = [],
  onRemoveUser,
  profiles = [],
  theme = 'light',
  onToggleTheme,
}) {
  const ownProfile =
    profiles.find((item) => item.userId === user.id) ||
    (user.id === 'admin' ? myDetails : null)
  const profile = ownProfile || myDetails
  const displayHandle = normalizeHandle(ownProfile?.handle || user.handle || fallbackHandle(user.username))
  const publicProfiles = useMemo(
    () => getPublicProfiles(users, profiles, user),
    [users, profiles, user],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [currentPage, setCurrentPage] = useState(() =>
    normalizePagePath(window.location.pathname, isAdmin),
  )
  const accountMenuRef = useRef(null)
  const searchRef = useRef(null)
  const displayName = ownProfile?.name || user.username
  const searchTerm = searchQuery.trim().replace(/^@/, '').toLowerCase()
  const searchResults = useMemo(() => {
    if (!searchTerm) return []
    return publicProfiles
      .filter((candidate) =>
        candidate.handle.toLowerCase().includes(searchTerm) ||
        candidate.displayName.toLowerCase().includes(searchTerm),
      )
      .sort((left, right) => {
        const leftStarts = left.handle.toLowerCase().startsWith(searchTerm) ? 0 : 1
        const rightStarts = right.handle.toLowerCase().startsWith(searchTerm) ? 0 : 1
        return leftStarts - rightStarts || left.handle.localeCompare(right.handle)
      })
  }, [publicProfiles, searchTerm])
  const publicProfile = currentPage.startsWith('/users/')
    ? publicProfiles.find((candidate) => candidate.handle === currentPage.slice('/users/'.length))
    : null

  useEffect(() => {
    if (!searchTerm) {
      setSearchLoading(false)
      return undefined
    }
    setSearchLoading(true)
    const timer = window.setTimeout(() => setSearchLoading(false), 180)
    return () => window.clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    function syncPageWithLocation() {
      const path = normalizePagePath(window.location.pathname, isAdmin)
      if (path !== window.location.pathname) {
        window.history.replaceState({}, '', path)
      }
      setMenuOpen(false)
      setAccountMenuOpen(false)
      setSearchOpen(false)
      setCurrentPage(path)
    }

    syncPageWithLocation()
    window.addEventListener('popstate', syncPageWithLocation)
    return () => window.removeEventListener('popstate', syncPageWithLocation)
  }, [isAdmin])

  useEffect(() => {
    const pageTitle = currentPage.startsWith('/users/')
      ? publicProfiles.find((candidate) => candidate.handle === currentPage.slice('/users/'.length))?.displayName || 'Profile'
      : PAGE_TITLES[currentPage]
    document.title = `${pageTitle} | My Portfolio`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, publicProfiles])

  useEffect(() => {
    function dismissAccountMenu(event) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
        setSearchOpen(false)
        return
      }
      if (!accountMenuRef.current?.contains(event.target)) setAccountMenuOpen(false)
      if (!searchRef.current?.contains(event.target)) setSearchOpen(false)
    }

    document.addEventListener('pointerdown', dismissAccountMenu)
    document.addEventListener('keydown', dismissAccountMenu)
    return () => {
      document.removeEventListener('pointerdown', dismissAccountMenu)
      document.removeEventListener('keydown', dismissAccountMenu)
    }
  }, [])

  function navigateTo(path, event) {
    if (event) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }
      event.preventDefault()
    }

    const nextPage = normalizePagePath(path, isAdmin)
    setMenuOpen(false)
    setAccountMenuOpen(false)
    setSearchOpen(false)
    if (nextPage === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState({}, '', nextPage)
    setCurrentPage(nextPage)
  }

  function saveOwnProfile(updatedProfile) {
    const error = onSaveProfile(updatedProfile)
    const previousHandle = normalizeHandle(ownProfile?.handle || user.handle || fallbackHandle(user.username))
    if (!error && currentPage === `/users/${previousHandle}`) {
      const nextPath = `/users/${normalizeHandle(updatedProfile.handle)}`
      window.history.replaceState({}, '', nextPath)
      setCurrentPage(nextPath)
    }
    return error
  }

  // USER PROJECT SHOWCASE: persist project changes inside this account's profile record.
  function saveOwnProjects(projects) {
    return onSaveProfile({ ...(ownProfile || myDetails), projects })
  }

  function saveOwnSkills(skills) {
    return onSaveProfile({ ...(ownProfile || myDetails), skills })
  }

  function submitDiscoverySearch(event) {
    event.preventDefault()
    if (searchResults.length > 0) {
      navigateTo(`/users/${searchResults[0].handle}`)
      setSearchOpen(false)
    }
  }

  if (editingProfile) {
    return (
      <ProfileSetupScreen
        initialProfile={ownProfile}
        isEditing
        onCancel={() => setEditingProfile(false)}
        onSaveProfile={saveOwnProfile}
        onCheckHandle={onCheckHandle}
        onSignOut={onSignOut}
        onToggleTheme={onToggleTheme}
        theme={theme}
        user={user}
      />
    )
  }

  return (
    <main className="container">
      <header className="header">
        <div className="account-menu" ref={accountMenuRef}>
          <button
            aria-controls="account-menu-panel"
            aria-expanded={accountMenuOpen}
            aria-label={`Open ${user.username}'s profile menu`}
            className="account-trigger"
            onClick={() => setAccountMenuOpen((open) => !open)}
            type="button"
          >
            <UserAvatar
              size="small"
              user={{ displayName, id: user.id, avatar: ownProfile?.avatar || createAvatar(displayName, user.id) }}
            />
            <span className="account-trigger-copy">
              <span className="account-trigger-name">{displayName}</span>
              <small>@{displayHandle}</small>
            </span>
            <span className="account-trigger-chevron" aria-hidden="true">⌄</span>
          </button>
          {accountMenuOpen && (
            <section className="account-menu-panel" id="account-menu-panel" aria-label="Profile and settings">
              <div className="account-menu-identity">
                <UserAvatar
                  size="small"
                  user={{ displayName, id: user.id, avatar: ownProfile?.avatar || createAvatar(displayName, user.id) }}
                />
                <span><strong>{displayName}</strong><small>@{displayHandle}</small></span>
              </div>
              <PageLink
                className="account-menu-view-profile"
                onNavigate={navigateTo}
                to={`/users/${displayHandle}`}
              >
                View public profile <span aria-hidden="true">↗</span>
              </PageLink>
              <button
                className="account-menu-edit"
                onClick={() => {
                  setAccountMenuOpen(false)
                  setEditingProfile(true)
                }}
                type="button"
              >
                Edit profile <span aria-hidden="true">↗</span>
              </button>
              <div className="account-menu-settings">
                <span>SETTINGS</span>
                <div>
                  <span>Appearance</span>
                  <ThemeToggle compact onToggle={onToggleTheme} theme={theme} />
                </div>
              </div>
              <button className="account-menu-signout" onClick={onSignOut} type="button">
                Sign out <span aria-hidden="true">↗</span>
              </button>
            </section>
          )}
        </div>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Main navigation">
          {PAGE_LINKS.map((page) => (
            <PageLink
              aria-current={currentPage === page.path ? 'page' : undefined}
              className={currentPage === page.path ? 'is-active' : ''}
              key={page.path}
              onNavigate={navigateTo}
              to={page.path}
            >
              {page.label}
            </PageLink>
          ))}
          {isAdmin && (
            <PageLink
              aria-current={currentPage === '/accounts' ? 'page' : undefined}
              className={currentPage === '/accounts' ? 'is-active' : ''}
              onNavigate={navigateTo}
              to="/accounts"
            >
              Accounts
            </PageLink>
          )}
        </nav>

        <div className="discovery-search" ref={searchRef}>
          <form className="search-box" onSubmit={submitDiscoverySearch} role="search">
            <input
              aria-autocomplete="list"
              aria-controls="discovery-results"
              aria-expanded={searchOpen}
              aria-label="Search people by handle"
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Find people"
              role="combobox"
              value={searchQuery}
            />
            {searchQuery && (
              <button
                aria-label="Clear user search"
                className="search-clear"
                onClick={() => {
                  setSearchQuery('')
                  setSearchOpen(true)
                }}
                type="button"
              >
                ×
              </button>
            )}
            <button className="search-button" type="submit" aria-label="Search profiles">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" /></svg>
            </button>
          </form>
          {searchOpen && (
            <div className="discovery-results" id="discovery-results" role="listbox" aria-label="People">
              {searchLoading ? (
                <p className="discovery-state discovery-state-loading"><span className="discovery-spinner" />Searching people...</p>
              ) : !searchTerm ? (
                <div className="discovery-state">
                  <strong>Find your people</strong>
                  <span>Search by name or @handle.</span>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="discovery-state">No people found for “{searchQuery.trim()}”.</p>
              ) : (
                searchResults.map((candidate) => (
                  <button
                    className="discovery-result"
                    key={candidate.id}
                    onClick={() => {
                      navigateTo(`/users/${candidate.handle}`)
                      setSearchOpen(false)
                    }}
                    role="option"
                    type="button"
                  >
                    <UserAvatar size="small" user={candidate} />
                    <span className="discovery-result-copy">
                      <strong>{candidate.displayName}</strong>
                      <small>@{candidate.handle}</small>
                    </span>
                    {candidate.isCurrentUser && <span className="discovery-you">You</span>}
                    <span className="discovery-result-arrow" aria-hidden="true">↗</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
        </button>
      </header>

      <div className="page-transition" key={currentPage}>
        {currentPage === '/' && <HomePage onNavigate={navigateTo} profile={profile} />}
        {currentPage === '/about' && <AboutPage profile={profile} />}
        {currentPage === '/skills' && <SkillsPage onSaveSkills={saveOwnSkills} profile={profile} />}
        {currentPage === '/work' && <WorkPage onSaveProjects={saveOwnProjects} profile={profile} />}
        {currentPage === '/contact' && <ContactPage profile={profile} />}
        {currentPage.startsWith('/users/') && publicProfile && (
          <PublicProfilePage
            onNavigate={navigateTo}
            onSaveProjects={saveOwnProjects}
            profile={publicProfile}
          />
        )}
        {currentPage.startsWith('/users/') && !publicProfile && (
          <PublicProfileNotFound onNavigate={navigateTo} />
        )}
        {isAdmin && currentPage === '/accounts' && (
          <AdminDashboard onRemoveUser={onRemoveUser} users={users} />
        )}
      </div>
      <p className="storage-note">
        Signed in as an {isAdmin ? 'admin' : 'user'}. Your account is stored in this browser for this classroom demo.
      </p>
      <footer className="site-footer">
        <span>© 2026 SOHAN SUKUMAR</span>
        <PageLink onNavigate={navigateTo} to="/">BACK TO HOME ↑</PageLink>
        <span>MADE WITH CURIOSITY</span>
      </footer>
    </main>
  )
}

export default App
