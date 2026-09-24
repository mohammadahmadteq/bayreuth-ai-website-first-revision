import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './client'

type Section = 'partners' | 'team_members' | 'events' | 'association_photos'
type Field = {
  key: string
  label: string
  type?: 'text' | 'url' | 'date' | 'textarea' | 'select' | 'image'
  options?: string[]
  required?: boolean
}
type Row = Record<string, unknown> & { id: string }

const sections: Record<Section, { label: string; fields: Field[]; title: string }> = {
  partners: {
    label: 'Partners',
    title: 'name',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'logo_url', label: 'Logo', type: 'image', required: true },
      { key: 'website_url', label: 'Website', type: 'url' },
      {
        key: 'tier',
        label: 'Tier',
        type: 'select',
        options: ['cooperation', 'sponsor'],
        required: true,
      },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  team_members: {
    label: 'Team members',
    title: 'name',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'role', label: 'Role', required: true },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'image_url', label: 'Portrait', type: 'image', required: true },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'is_board_member', label: 'Board member', type: 'select', options: ['false', 'true'] },
    ],
  },
  events: {
    label: 'Events',
    title: 'title',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'time', label: 'Time', required: true },
      { key: 'location', label: 'Location', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['talk', 'dinner', 'workshop', 'social'],
      },
      { key: 'is_featured', label: 'Featured', type: 'select', options: ['false', 'true'] },
    ],
  },
  association_photos: {
    label: 'Association photos',
    title: 'alt',
    fields: [
      { key: 'image_url', label: 'Photo', type: 'image', required: true },
      { key: 'alt', label: 'Description for accessibility', required: true },
    ],
  },
}

const sectionNames = Object.keys(sections) as Section[]
const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function emptyForm(section: Section): Record<string, string> {
  return Object.fromEntries(
    sections[section].fields.map((field) => [field.key, field.options?.[0] ?? '']),
  )
}

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [authorizedUserId, setAuthorizedUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('bayreuth.ai@gmail.com')
  const [password, setPassword] = useState('')
  const [section, setSection] = useState<Section>('partners')
  const [rows, setRows] = useState<Row[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>(emptyForm('partners'))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const authorized = Boolean(user && authorizedUserId === user.id)

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setChecking(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setChecking(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    let active = true
    void supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        setAuthorizedUserId(data && !error ? user.id : null)
        setChecking(false)
        if (error) setMessage(error.message)
      })
    return () => {
      active = false
    }
  }, [user])

  const loadRows = useCallback(async (selected: Section) => {
    const { data, error } = await supabase.from(selected).select('*').order('sort_order')
    if (error) throw error
    setRows((data ?? []) as Row[])
  }, [])

  useEffect(() => {
    if (!authorized) return
    void Promise.resolve()
      .then(() => loadRows(section))
      .catch((error: Error) => setMessage(error.message))
  }, [authorized, section, loadRows])

  function chooseSection(next: Section) {
    setSection(next)
    setEditingId(null)
    setForm(emptyForm(next))
    setMessage('')
  }

  function edit(row: Row) {
    setEditingId(row.id)
    setForm(
      Object.fromEntries(
        sections[section].fields.map((field) => [field.key, String(row[field.key] ?? '')]),
      ),
    )
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function authenticate(signup: boolean) {
    setBusy(true)
    setMessage('')
    const result = signup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    setMessage(
      result.error?.message ??
        (signup ? 'Check your email to confirm the account, then sign in.' : 'Signed in.'),
    )
    setPassword('')
  }

  async function uploadImage(file: File, field: string) {
    if (!imageTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage('Choose a JPEG, PNG, WebP or GIF image under 5 MB.')
      return
    }
    setBusy(true)
    setMessage('Uploading image…')
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${section}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage
      .from('site-images')
      .upload(path, file, { contentType: file.type })
    if (error) setMessage(error.message)
    else {
      const { data } = supabase.storage.from('site-images').getPublicUrl(path)
      setForm((current) => ({ ...current, [field]: data.publicUrl }))
      setMessage('Image uploaded. Save the entry to publish it.')
    }
    setBusy(false)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const payload: Record<string, string | number | boolean | null> = {
      id: editingId ?? crypto.randomUUID(),
      sort_order: editingId
        ? Number(rows.find((row) => row.id === editingId)?.sort_order ?? 0)
        : rows.length,
    }
    for (const field of sections[section].fields) {
      const value = form[field.key]?.trim() ?? ''
      payload[field.key] =
        field.key === 'is_board_member' || field.key === 'is_featured'
          ? value === 'true'
          : value || (field.required ? '' : null)
    }
    const { error } = await supabase.from(section).upsert(payload)
    if (error) setMessage(error.message)
    else {
      setEditingId(null)
      setForm(emptyForm(section))
      setMessage('Saved. The public website will show this entry on refresh.')
      try {
        await loadRows(section)
      } catch (loadError) {
        setMessage((loadError as Error).message)
      }
    }
    setBusy(false)
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete ${String(row[sections[section].title])}?`)) return
    setBusy(true)
    const { error } = await supabase.from(section).delete().eq('id', row.id)
    if (error) setMessage(error.message)
    else {
      if (editingId === row.id) {
        setEditingId(null)
        setForm(emptyForm(section))
      }
      setMessage('Deleted.')
      try {
        await loadRows(section)
      } catch (loadError) {
        setMessage((loadError as Error).message)
      }
    }
    setBusy(false)
  }

  if (checking)
    return (
      <main className="shell">
        <p>Checking access…</p>
      </main>
    )

  if (!user)
    return (
      <main className="shell login">
        <p className="eyebrow">Bayreuth AI Association</p>
        <h1>Content admin</h1>
        <p>Sign in to manage partners, people, dates, and photos.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void authenticate(false)
          }}
        >
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <div className="actions">
            <button disabled={busy}>Sign in</button>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={(event) => {
                const formElement = event.currentTarget.closest('form')
                if (formElement?.reportValidity()) void authenticate(true)
              }}
            >
              Create account
            </button>
          </div>
        </form>
        <p className="hint">Only the approved email receives editing access after confirmation.</p>
        {message && (
          <p role="status" className="status">
            {message}
          </p>
        )}
      </main>
    )

  if (!authorized)
    return (
      <main className="shell login">
        <h1>Access pending</h1>
        <p>
          This account has no editing access. Confirm the approved email or contact the association.
        </p>
        <button onClick={() => void supabase.auth.signOut()}>Sign out</button>
        {message && (
          <p role="status" className="status">
            {message}
          </p>
        )}
      </main>
    )

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">Bayreuth AI Association</p>
          <h1>Content admin</h1>
        </div>
        <button className="secondary" onClick={() => void supabase.auth.signOut()}>
          Sign out
        </button>
      </header>
      <nav aria-label="Content sections">
        {sectionNames.map((name) => (
          <button
            key={name}
            className={section === name ? 'active' : 'secondary'}
            onClick={() => chooseSection(name)}
          >
            {sections[name].label}
          </button>
        ))}
      </nav>
      <div className="layout">
        <section className="card">
          <h2>
            {editingId ? 'Edit' : 'Add'} {sections[section].label.toLowerCase()}
          </h2>
          <form onSubmit={(event) => void save(event)}>
            {sections[section].fields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.type === 'textarea' ? (
                  <textarea
                    value={form[field.key] ?? ''}
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                    required={field.required}
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={form[field.key] ?? field.options?.[0]}
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type={field.type === 'image' ? 'text' : (field.type ?? 'text')}
                      value={form[field.key] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                      required={field.required}
                    />
                    {field.type === 'image' && (
                      <input
                        aria-label={`Upload ${field.label.toLowerCase()}`}
                        type="file"
                        accept={imageTypes.join(',')}
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) void uploadImage(file, field.key)
                        }}
                      />
                    )}
                  </>
                )}
              </label>
            ))}
            <div className="actions">
              <button disabled={busy}>{editingId ? 'Save changes' : 'Publish entry'}</button>
              {editingId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm(section))
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
        <section className="card">
          <h2>{sections[section].label}</h2>
          {rows.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <ul>
              {rows.map((row) => (
                <li key={row.id}>
                  <span>{String(row[sections[section].title])}</span>
                  <div className="actions">
                    <button className="secondary" onClick={() => edit(row)}>
                      Edit
                    </button>
                    <button className="danger" disabled={busy} onClick={() => void remove(row)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {message && (
        <p role="status" className="status">
          {message}
        </p>
      )}
    </main>
  )
}
