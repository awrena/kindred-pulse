import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '../components/Icon'

const typeIcons = {
  coffee: 'coffee',
  lunch: 'restaurant',
  darts: 'sports_esports',
  walk: 'directions_walk',
  cake: 'cake',
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    api.getEvent(id).then(setEvent).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleJoin = async () => {
    setJoining(true)
    try {
      const updated = await api.joinEvent(id)
      setEvent(updated)
    } catch {
      // already joined or full
    }
    setJoining(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary font-headline font-bold text-xl">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="font-headline text-2xl font-bold text-on-surface-variant">Event not found</h2>
        <Link to="/" className="text-primary font-bold mt-4 inline-block">Back to Feed</Link>
      </div>
    )
  }

  const spotsLeft = event.capacity - event.participant_count

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden px-6 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-md w-full">
          <div className="mb-6 flex justify-center">
            <span className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-label font-semibold text-sm tracking-wide shadow-sm">
              We Are Still Here
            </span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(57,50,34,0.08)] relative">
            {event.image_url && (
              <div className="h-48 w-full relative">
                <img className="w-full h-full object-cover" src={event.image_url} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                <div className="absolute -bottom-6 left-8 flex items-center gap-3 bg-surface-container-highest p-2 pr-6 rounded-full shadow-lg">
                  <img
                    alt={event.creator.display_name}
                    className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover"
                    src={event.creator.avatar_url}
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Created by</span>
                    <span className="text-sm font-bold text-on-surface">{event.creator.display_name}</span>
                  </div>
                </div>
              </div>
            )}
            <div className={`px-8 pb-10 ${event.image_url ? 'pt-12' : 'pt-8'}`}>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface leading-tight mb-4 tracking-tight">
                {event.title}
              </h2>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3 text-primary font-semibold">
                  <Icon name="schedule" filled />
                  <span className="text-lg">
                    {new Date(event.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Icon name="groups" />
                  <span className="font-medium">{spotsLeft} of {event.capacity} spots left</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Location</span>
                  <span className="font-bold text-on-surface mt-1">{event.location}</span>
                </div>
                <div className="bg-tertiary-container/20 p-4 rounded-lg flex flex-col justify-between">
                  <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Vibe Check</span>
                  <span className="font-bold text-tertiary mt-1">{event.vibe}</span>
                </div>
              </div>
              {event.participants.length > 0 && (
                <div className="flex flex-col gap-3 mb-10">
                  <span className="text-sm font-bold text-on-surface-variant">Who's already here?</span>
                  <div className="flex items-center">
                    <div className="flex -space-x-3 overflow-hidden">
                      {event.participants.slice(0, 3).map((p) => (
                        <img
                          key={p.id}
                          alt={p.display_name}
                          className="inline-block h-12 w-12 rounded-full ring-4 ring-surface-container-lowest object-cover"
                          src={p.avatar_url}
                        />
                      ))}
                      {event.participant_count > 3 && (
                        <div className="flex items-center justify-center h-12 w-12 rounded-full ring-4 ring-surface-container-lowest bg-surface-container-high text-on-surface font-bold text-sm">
                          +{event.participant_count - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-4 text-sm font-medium text-on-surface-variant italic">Join them!</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleJoin}
                disabled={joining || spotsLeft <= 0}
                className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg font-headline font-extrabold text-xl shadow-[0_12px_24px_rgba(160,66,35,0.2)] hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {joining ? 'Joining...' : spotsLeft <= 0 ? 'Event Full' : "I'M IN! 🎯"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-8">
        {event.image_url && (
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl">
            <img className="w-full h-full object-cover" src={event.image_url} alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#393222]/80 to-transparent flex flex-col justify-end p-12">
              <div className="flex gap-3 mb-4">
                <span className="bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  Community Event
                </span>
                <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  {spotsLeft} Spots Left
                </span>
              </div>
              <h1 className="text-white text-6xl font-extrabold tracking-tight mb-4 font-headline">{event.title}</h1>
              <p className="text-white/90 text-xl max-w-2xl font-medium">{event.description}</p>
            </div>
          </div>
        )}

        {!event.image_url && (
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 font-headline text-primary">{event.title}</h1>
            <p className="text-xl text-on-surface-variant">{event.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-8 rounded-lg space-y-3">
                <Icon name="schedule" className="text-primary text-3xl" />
                <h3 className="font-bold text-lg">Starting Time</h3>
                <p className="text-on-surface-variant font-medium">
                  {new Date(event.starts_at).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="bg-surface-container-low p-8 rounded-lg space-y-3">
                <Icon name="location_on" className="text-primary text-3xl" />
                <h3 className="font-bold text-lg">Location</h3>
                <p className="text-on-surface-variant font-medium">{event.location}</p>
              </div>
              <div className="bg-surface-container-low p-8 rounded-lg space-y-3">
                <Icon name="mood" className="text-primary text-3xl" />
                <h3 className="font-bold text-lg">Vibe Check</h3>
                <p className="text-on-surface-variant font-medium">{event.vibe}</p>
              </div>
            </div>

            {event.description && (
              <div className="bg-surface p-10 rounded-xl shadow-[0_10px_40px_rgba(57,50,34,0.05)] border border-outline-variant/10">
                <h2 className="text-3xl font-bold mb-6 text-on-background font-headline">What to expect</h2>
                <p className="text-lg leading-relaxed text-on-surface-variant">{event.description}</p>
              </div>
            )}

            {event.participants.length > 0 && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold text-on-background font-headline">Who's already here?</h2>
                  <span className="text-primary font-bold">{event.participant_count} People Attending</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {event.participants.map((p) => (
                    <Link
                      key={p.id}
                      to={`/profile/${p.id}`}
                      className="flex flex-col items-center p-6 bg-surface-container rounded-lg transition-transform hover:scale-105"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 shadow-md">
                        <img alt={p.display_name} className="w-full h-full object-cover" src={p.avatar_url} />
                      </div>
                      <span className="font-bold">{p.display_name}</span>
                      <span className="text-xs text-on-surface-variant uppercase tracking-wider">{p.role}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-surface-container-high p-8 rounded-xl shadow-[0_10px_40px_rgba(57,50,34,0.05)] border border-primary/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-primary-container p-3 rounded-full">
                    <Icon name="confirmation_number" className="text-primary text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline">Secure a spot</h3>
                    <p className="text-on-surface-variant">Hurry, only {spotsLeft} left!</p>
                  </div>
                </div>
                <button
                  onClick={handleJoin}
                  disabled={joining || spotsLeft <= 0}
                  className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-extrabold text-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
                >
                  {joining ? 'Joining...' : spotsLeft <= 0 ? 'Event Full' : "I'M IN! 🎯"}
                </button>
                <p className="text-center text-xs text-on-surface-variant font-medium">
                  Joining confirms your participation.
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg flex items-center gap-4">
                <img
                  alt={event.creator.display_name}
                  className="w-12 h-12 rounded-full border-2 border-primary-container object-cover"
                  src={event.creator.avatar_url}
                />
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Hosted By</p>
                  <p className="font-bold text-on-background">{event.creator.display_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
