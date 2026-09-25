import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { events as initialEvents, partners as initialPartners, team as initialTeam } from '../data'
import { initialPhotos } from '../data/photos'
import { supabase } from '../lib/supabase'
import { SiteContentContext } from './siteContentContext'

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState(initialEvents)
  const [partners, setPartners] = useState(initialPartners)
  const [team, setTeam] = useState(initialTeam)
  const [photos, setPhotos] = useState(initialPhotos)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshVersion = useRef(0)

  const refresh = useCallback(async () => {
    if (!supabase) return
    const version = ++refreshVersion.current
    const [eventResult, partnerResult, teamResult, photoResult] = await Promise.all([
      supabase.from('events').select('*').order('sort_order'),
      supabase.from('partners').select('*').order('sort_order'),
      supabase.from('team_members').select('*').order('sort_order'),
      supabase.from('association_photos').select('*').order('sort_order'),
    ])
    // An older response must not overwrite a refresh triggered by a newer edit.
    if (version !== refreshVersion.current) return
    const failure = [eventResult, partnerResult, teamResult, photoResult].find(
      (result) => result.error,
    )
    if (failure?.error) {
      setError(failure.error.message)
      return
    }
    setEvents(
      (eventResult.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        date: row.date,
        time: row.time,
        location: row.location,
        category: row.category,
        isFeatured: row.is_featured,
      })),
    )
    setPartners(
      (partnerResult.data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        logoUrl: row.logo_url,
        websiteUrl: row.website_url ?? undefined,
        tier: row.tier,
        description: row.description ?? undefined,
      })),
    )
    setTeam(
      (teamResult.data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        bio: row.bio,
        imageUrl: row.image_url,
        linkedin: row.linkedin ?? undefined,
        isBoardMember: row.is_board_member,
      })),
    )
    setPhotos(
      (photoResult.data ?? []).map((row) => ({
        id: row.id,
        imageUrl: row.image_url,
        alt: row.alt,
      })),
    )
    setError(null)
  }, [])

  useEffect(() => {
    let active = true
    void Promise.resolve()
      .then(refresh)
      .catch((failure: unknown) => {
        if (active)
          setError(failure instanceof Error ? failure.message : 'Content could not be loaded')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [refresh])

  useEffect(() => {
    const client = supabase
    if (!client) return
    let active = true
    let debounce: number | undefined

    const sync = () => {
      if (!active || document.visibilityState !== 'visible') return
      void refresh().catch((failure: unknown) => {
        if (active)
          setError(failure instanceof Error ? failure.message : 'Content could not be loaded')
      })
    }
    const scheduleSync = () => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(sync, 150)
    }

    const channel = client.channel('public-site-content')
    for (const table of ['partners', 'team_members', 'events', 'association_photos']) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, scheduleSync)
    }
    channel.subscribe((status) => {
      // Also catch edits made while the connection was being established or restored.
      if (status === 'SUBSCRIBED') scheduleSync()
    })
    window.addEventListener('focus', scheduleSync)
    window.addEventListener('online', scheduleSync)
    document.addEventListener('visibilitychange', scheduleSync)
    // A visible tab still catches up if its WebSocket connection is unavailable.
    const fallback = window.setInterval(sync, 60000)

    return () => {
      active = false
      window.clearTimeout(debounce)
      window.clearInterval(fallback)
      window.removeEventListener('focus', scheduleSync)
      window.removeEventListener('online', scheduleSync)
      document.removeEventListener('visibilitychange', scheduleSync)
      void client.removeChannel(channel)
    }
  }, [refresh])

  return (
    <SiteContentContext.Provider
      value={{ events, partners, team, photos, error, isLoading, refresh }}
    >
      {children}
    </SiteContentContext.Provider>
  )
}
