import { useCallback, useEffect, useState, type ReactNode } from 'react'
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

  const refresh = useCallback(async () => {
    if (!supabase) return
    const [eventResult, partnerResult, teamResult, photoResult] = await Promise.all([
      supabase.from('events').select('*').order('sort_order'),
      supabase.from('partners').select('*').order('sort_order'),
      supabase.from('team_members').select('*').order('sort_order'),
      supabase.from('association_photos').select('*').order('sort_order'),
    ])
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
    void Promise.resolve().then(refresh)
  }, [refresh])

  return (
    <SiteContentContext.Provider value={{ events, partners, team, photos, error, refresh }}>
      {children}
    </SiteContentContext.Provider>
  )
}
