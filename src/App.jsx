import { useEffect, useState } from 'react'

const USERS_KEY = 'portfolioUsers'
const SESSION_KEY = 'portfolioSession'
const ADMIN = { id: 'admin', username: 'sohan', role: 'admin' }
const ADMIN_PASSWORD = 'sohan@2026!'

const myDetails = {
  name: 'V.SOHAN SUKUMAR',
  id: '25000XXXXX',
  email: 'name@example.com',
  phone: '+91 XXXXX XXXXX',
  about:
    'I am V.SOHAN SUKUMAR, a beginner web developer who enjoys creating simple and user-friendly websites. I like learning HTML, CSS, and JavaScript and building clean designs.',
}

const friends = {
  sohan: myDetails,
  omkar: {
    name: 'A.Omkar',
    id: '25000XXXXX',
    email: 'friend@example.com',
    phone: '+91 XXXXX XXXXX',
    about:
      'I am Omkar, a friendly and hardworking student. I am a beginner web developer who enjoys creating simple and user-friendly websites. I like learning HTML, CSS, and JavaScript and building clean designs.',
  },
  sanjay: {
    name: 'K.Sanjay',
    id: '25000XXXXX',
    email: 'friend@example.com',
    phone: '+91 XXXXX XXXXX',
    about:
      'I am Sanjay, a student who loves technology. I am a beginner web developer who enjoys creating simple and user-friendly websites. I like learning HTML, CSS, and JavaScript and building clean designs.',
  },
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

function App() {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    try {
      const savedUsers = readUsers()
      const sessionId = localStorage.getItem(SESSION_KEY)
      setUsers(savedUsers)
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

  function signUp(username, password, role, adminUsername, adminPassword) {
    const normalizedUsername = username.trim()
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
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    } catch {
      setStorageError('Could not update accounts in browser Local Storage.')
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
    return <AuthScreen onSignIn={signIn} onSignUp={signUp} />
  }

  if (currentUser.role === 'admin') {
    return (
      <Portfolio
        isAdmin
        onRemoveUser={removeUser}
        onSignOut={signOut}
        user={currentUser}
        users={users}
      />
    )
  }

  return <Portfolio user={currentUser} onSignOut={signOut} />
}

function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('login')
  const [accountRole, setAccountRole] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

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
      <form className="login-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">SOHAN SUKUMAR · PORTFOLIO</span>
        <h1>{mode === 'login' ? 'Portfolio Login' : 'Create Account'}</h1>
        <p>
          {mode === 'login'
            ? 'Sign in to view the portfolio.'
            : 'Choose the type of account you want to register.'}
        </p>
        <div className="auth-mode">
          <button
            aria-pressed={mode === 'login'}
            className={mode === 'login' ? 'selected' : ''}
            onClick={() => changeMode('login')}
            type="button"
          >
            Sign in
          </button>
          <button
            aria-pressed={mode === 'signup'}
            className={mode === 'signup' ? 'selected' : ''}
            onClick={() => changeMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>
        {mode === 'signup' && (
          <>
            <label htmlFor="accountRole">Register account as</label>
            <select
              id="accountRole"
              name="accountRole"
              onChange={(event) => setAccountRole(event.target.value)}
              value={accountRole}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {accountRole === 'admin' && (
              <>
                <p className="demo-hint">
                  An existing admin must authorize new admin accounts.
                </p>
                <label htmlFor="adminUsername">Existing admin username</label>
                <input
                  autoComplete="username"
                  id="adminUsername"
                  name="adminUsername"
                  required
                />
                <label htmlFor="adminPassword">Existing admin password</label>
                <input
                  autoComplete="current-password"
                  id="adminPassword"
                  name="adminPassword"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
              </>
            )}
          </>
        )}
        <label htmlFor="username">Username</label>
        <input
          autoComplete="username"
          id="username"
          maxLength="40"
          name="username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          id="password"
          minLength={mode === 'signup' ? 8 : undefined}
          name="password"
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
              required
              type={showPassword ? 'text' : 'password'}
            />
          </>
        )}
        <label className="show-password-option" htmlFor="showPassword">
          <input
            checked={showPassword}
            id="showPassword"
            onChange={(event) => setShowPassword(event.target.checked)}
            type="checkbox"
          />
          Show password
        </label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button type="submit">
          {mode === 'login'
            ? 'Sign in'
            : `Create ${accountRole === 'admin' ? 'admin' : 'user'} account`}
        </button>
        <p className="demo-hint">
          Admin demo: username <strong>{ADMIN.username}</strong>, password <strong>{ADMIN_PASSWORD}</strong>
        </p>
        <p className="demo-hint">
          Demo only: Local Storage is for learning and is not secure for real passwords.
        </p>
      </form>
    </main>
  )
}

function AdminDashboard({ users, onRemoveUser }) {
  return (
    <section aria-labelledby="accounts-heading" className="section admin-overview" id="accounts">
      <div className="admin-overview-heading">
        <div>
          <span className="section-index">ADMINISTRATION</span>
          <h3 id="accounts-heading">Registered accounts</h3>
        </div>
        <p className="account-count">
          <strong>{users.length}</strong>
          <span>{users.length === 1 ? 'account' : 'accounts'}</span>
        </p>
      </div>
      <p className="admin-count-note">Total accounts registered in this browser.</p>
      {users.length === 0 ? (
        <p>No user accounts yet. Sign out and create an account to see it here.</p>
      ) : (
        <div className="account-list">
          {users.map((user) => (
            <div className="account-row" key={user.id}>
              <p><strong>{user.username}</strong> <span>{user.role.toUpperCase()}</span></p>
              <button onClick={() => onRemoveUser(user.id)} type="button">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Portfolio({ user, onSignOut, isAdmin = false, users = [], onRemoveUser }) {
  const [profile, setProfile] = useState(myDetails)
  const [friendName, setFriendName] = useState('')
  const [searchError, setSearchError] = useState('')

  function lookupFriend(event) {
    event.preventDefault()
    const name = friendName.trim()
    if (!name) {
      setProfile(myDetails)
      setSearchError('')
      return
    }

    const result = friends[name.toLowerCase()]
    if (result) {
      setProfile(result)
      setSearchError('')
    } else {
      setProfile({
        name: 'Result Not Found',
        id: 'Not available',
        email: 'Not available',
        phone: 'Not available',
        about: 'No matching friend details were found for this search.',
      })
      setSearchError('Try Sohan, Omkar, or Sanjay.')
    }
  }

  return (
    <main className="container">
      <header className="header">
        <a className="brand" href="#home" aria-label="Sohan Sukumar home">
          <span className="brand-mark">S</span>
          <span>sohan<span className="brand-period">.</span></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          {isAdmin && <a href="#accounts">Accounts</a>}
        </nav>

        <form className="search-box" onSubmit={lookupFriend}>
          <input
            aria-label="Enter friend name"
            onChange={(event) => setFriendName(event.target.value)}
            placeholder="Enter friend name"
            value={friendName}
          />
          <button className="search-button" type="submit" aria-label="Search profiles">
            <span aria-hidden="true">⌕</span>
          </button>
          <span className="welcome-user">
            {isAdmin ? `Admin · ${users.length} accounts` : `User: ${user.username}`}
          </span>
          <button onClick={onSignOut} type="button">Sign out</button>
        </form>
        {searchError && <p className="search-error" role="status">{searchError}</p>}
      </header>

      {isAdmin && <AdminDashboard onRemoveUser={onRemoveUser} users={users} />}

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><span className="availability-dot" /> AVAILABLE FOR OPPORTUNITIES</span>
          <h1>Building for<br /><span>what’s next.</span></h1>
          <p className="hero-intro">I’m <strong>{profile.name}</strong>, a curious web developer turning ideas into thoughtful digital experiences.</p>
          <div className="hero-actions">
            <a className="btn" href="#projects">Explore my work <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#contact">Let’s connect <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-sun" />
          <div className="art-card">
            <span>DESIGN<br />WITH INTENT</span>
            <span className="art-card-arrow">↗</span>
          </div>
          <span className="art-caption">CREATIVE CODE · 2026</span>
        </div>
      </section>

      <section className="section profile-box" id="profileCard">
        <div className="section-heading">
          <span className="section-index">01 / PROFILE</span>
          <h3>A little about me</h3>
        </div>
        <div className="detail-list">
          <p><strong>Name:</strong> <span>{profile.name}</span></p>
          <p><strong>Student ID:</strong> <span>{profile.id}</span></p>
          <p><strong>Email:</strong> <span>{profile.email}</span></p>
          <p><strong>Phone:</strong> <span>{profile.phone}</span></p>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-heading">
          <span className="section-index">02 / ABOUT</span>
          <h3>Curious by nature.<br />Creative by choice.</h3>
        </div>
        <p className="about-copy">{profile.about}</p>
      </section>

      <section className="section" id="skills">
        <div className="section-heading">
          <span className="section-index">03 / TOOLKIT</span>
          <h3>Things I work with</h3>
        </div>
        <ul className="skills-list">
          <li>HTML <span>01</span></li>
          <li>CSS <span>02</span></li>
          <li>JavaScript <span>03</span></li>
          <li>Responsive Design <span>04</span></li>
        </ul>
      </section>

      <section className="section" id="projects">
        <div className="section-heading">
          <span className="section-index">04 / SELECTED WORK</span>
          <h3>Made with curiosity.</h3>
        </div>
        <div className="projects">
          <article className="box project-card project-card-one">
            <span className="project-number">01</span>
            <div className="project-art project-art-one" aria-hidden="true"><span>01</span></div>
            <span className="project-type">REACT · RESPONSIVE DESIGN</span>
            <h4>Personal portfolio</h4>
            <p>A responsive portfolio with a bold visual identity and a home for my work.</p>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </article>
          <article className="box project-card project-card-two">
            <span className="project-number">02</span>
            <div className="project-art project-art-two" aria-hidden="true"><span>make<br />space.</span></div>
            <span className="project-type">REACT · PROFILE SEARCH</span>
            <h4>Profile explorer</h4>
            <p>Search and explore member profiles with clear, helpful feedback.</p>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </article>
          <article className="box project-card project-card-three">
            <span className="project-number">03</span>
            <div className="project-art project-art-three" aria-hidden="true"><span>GOOD<br />THINGS</span></div>
            <span className="project-type">REACT · ACCOUNT MANAGEMENT</span>
            <h4>Member dashboard</h4>
            <p>A simple admin space to view and manage registered member accounts.</p>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </article>
        </div>
      </section>

      <section className="section contact" id="contact">
        <span className="section-index">05 / SAY HELLO</span>
        <h3>Have a good one<br />in mind?</h3>
        <p><strong>Email:</strong> <span>{profile.email}</span></p>
        <p><strong>Phone:</strong> <span>{profile.phone}</span></p>
        <p>For professional inquiries, please connect with me on LinkedIn.</p>
        <a className="contact-link" href={`mailto:${profile.email}`}>Start a conversation <span aria-hidden="true">↗</span></a>
      </section>
      <p className="storage-note">
        Signed in as an {isAdmin ? 'admin' : 'user'}. Your account is stored in this browser for this classroom demo.
      </p>
      <footer className="site-footer"><span>© 2026 SOHAN SUKUMAR</span><a href="#home">BACK TO TOP ↑</a><span>MADE WITH CURIOSITY</span></footer>
    </main>
  )
}

export default App
