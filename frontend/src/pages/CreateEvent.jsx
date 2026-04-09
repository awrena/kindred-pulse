import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '../components/Icon'

const vibes = [
  { type: 'coffee', icon: 'coffee', label: 'Coffee' },
  { type: 'lunch', icon: 'restaurant', label: 'Lunch' },
  { type: 'darts', icon: 'target', label: 'Darts' },
  { type: 'walk', icon: 'directions_walk', label: 'Walk' },
  { type: 'cake', icon: 'cake', label: 'Cake' },
]

const timeOptions = [
  { label: 'Now', minutes: 0 },
  { label: 'In 10 min', minutes: 10 },
  { label: 'In 30 min', minutes: 30 },
]

export default function CreateEvent() {
  const navigate = useNavigate()
  const [selectedVibe, setSelectedVibe] = useState('coffee')
  const [selectedTime, setSelectedTime] = useState(30)
  const [location, setLocation] = useState('')
  const [limitedSpots, setLimitedSpots] = useState(true)
  const [capacity, setCapacity] = useState(4)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const startsAt = new Date(Date.now() + selectedTime * 60000).toISOString()
      const event = await api.createEvent({
        title: `${vibes.find((v) => v.type === selectedVibe)?.label || 'Hangout'} session`,
        event_type: selectedVibe,
        location: location || 'TBD',
        starts_at: startsAt,
        capacity: limitedSpots ? capacity : 50,
        vibe: 'Chill & Chat',
      })
      navigate(`/events/${event.id}`)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4 md:px-8 max-w-5xl mx-auto">
      {/* Desktop back button */}
      <div className="hidden md:flex mb-8 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-all">
          <Icon name="arrow_back" />
          <span>Back to Hub</span>
        </Link>
        <div className="text-on-surface-variant font-label text-sm uppercase tracking-widest">New Gathering</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7 space-y-10">
          {/* Mobile header */}
          <section className="md:hidden mb-6">
            <h2 className="font-headline text-[3.5rem] leading-[1.1] font-extrabold tracking-tight mb-4 text-primary">
              Create Event
            </h2>
            <p className="text-on-surface-variant text-lg">
              Gather your crew. We Are Still Here and ready for connection.
            </p>
          </section>

          {/* Desktop header */}
          <header className="hidden md:block">
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter leading-none mb-4">
              Let's get <br />together.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md">
              Create a moment for the community. Keep it casual, keep it warm.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Vibe */}
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="hidden md:flex w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container items-center justify-center font-bold text-sm">1</span>
                <label className="font-headline font-bold text-xl">What's the vibe?</label>
              </div>
              <div className="flex flex-wrap gap-3 md:grid md:grid-cols-5 md:gap-4">
                {vibes.map((v) => (
                  <button
                    key={v.type}
                    type="button"
                    onClick={() => setSelectedVibe(v.type)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 md:flex-col md:items-center md:gap-3 md:p-6 md:rounded-xl ${
                      selectedVibe === v.type
                        ? 'bg-tertiary-container text-on-tertiary-container scale-105 shadow-md md:bg-primary-container/30 md:border-2 md:border-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest md:border-2 md:border-transparent md:hover:border-primary/20'
                    }`}
                  >
                    <div className={`md:w-12 md:h-12 md:rounded-full md:flex md:items-center md:justify-center ${
                      selectedVibe === v.type ? 'md:bg-primary md:text-on-primary' : 'md:bg-surface-container-highest md:text-primary'
                    }`}>
                      <Icon name={v.icon} filled={selectedVibe === v.type} />
                    </div>
                    <span className="font-bold text-sm">{v.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Time */}
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="hidden md:flex w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container items-center justify-center font-bold text-sm">2</span>
                <label className="font-headline font-bold text-xl">When & Where?</label>
              </div>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-2">
                {timeOptions.map((t) => (
                  <button
                    key={t.minutes}
                    type="button"
                    onClick={() => setSelectedTime(t.minutes)}
                    className={`p-4 rounded-lg text-center font-semibold transition-all ${
                      selectedTime === t.minutes
                        ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary/20'
                        : 'bg-surface-container-high text-on-surface hover:bg-secondary-container hover:text-on-secondary-container'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-lg placeholder:text-on-surface-variant/50"
                  placeholder="Search a place or address"
                />
              </div>
            </section>

            {/* Step 3: Capacity */}
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="hidden md:flex w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container items-center justify-center font-bold text-sm">3</span>
                <label className="font-headline font-bold text-xl">Capacity settings</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Limited spots</p>
                    <p className="text-sm text-on-surface-variant">Keep it intimate</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLimitedSpots(!limitedSpots)}
                    className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors ${
                      limitedSpots ? 'bg-secondary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 rounded-full bg-white transition-transform ${
                        limitedSpots ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-6 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Capacity</p>
                    <p className="text-sm text-on-surface-variant">Max people</p>
                  </div>
                  <div className="flex items-center gap-4 bg-surface-container-highest px-4 py-2 rounded-full">
                    <button type="button" onClick={() => setCapacity(Math.max(2, capacity - 1))} className="text-primary font-bold text-xl">
                      −
                    </button>
                    <span className="font-bold text-xl w-6 text-center">{capacity}</span>
                    <button type="button" onClick={() => setCapacity(Math.min(50, capacity + 1))} className="text-primary font-bold text-xl">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-headline font-extrabold text-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Blast it out!'}
              {!submitting && <Icon name="send" />}
            </button>
          </form>
        </div>

        {/* Right side: Preview (Desktop only) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="sticky top-32 space-y-8">
            <div className="bg-surface-container p-8 rounded-xl border-4 border-dashed border-primary/10 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-tertiary-container rounded-full opacity-20" />
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Live Preview
                  </div>
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                    <Icon name={vibes.find((v) => v.type === selectedVibe)?.icon || 'coffee'} filled />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-headline font-extrabold text-on-background mb-2">
                    {vibes.find((v) => v.type === selectedVibe)?.label || 'Hangout'} session
                  </h3>
                  <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <Icon name="schedule" className="text-sm" />
                    <span>
                      {selectedTime === 0 ? 'Starting now' : `In ${selectedTime} min`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <Icon name="location_on" className="text-sm" />
                    <span>{location || 'Location TBD'}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {limitedSpots ? `${capacity} spots` : 'Open event'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-tertiary-container/30 p-6 rounded-lg border-2 border-tertiary-container/50">
              <div className="flex gap-4">
                <Icon name="lightbulb" className="text-tertiary" />
                <div className="space-y-1">
                  <p className="font-bold text-on-tertiary-container">Host Tip</p>
                  <p className="text-sm text-on-tertiary-container/80 leading-relaxed">
                    Casual meetups get 40% more RSVPs when you include a specific table location in the description!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
