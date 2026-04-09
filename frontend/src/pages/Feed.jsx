import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '../components/Icon'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function MemeOfTheDay({ meme }) {
  if (!meme) return null
  return (
    <section className="sticky top-20 md:top-24 z-40 pt-2">
      <div className="bg-surface-container-highest rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            Meme of the Day
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            Shared by @{meme.author.username}
          </span>
        </div>
        {meme.image_url && (
          <div className="rounded-lg overflow-hidden mb-4 bg-surface-dim relative">
            <div className="bg-on-surface text-white px-6 py-4 font-headline font-extrabold text-xl text-center uppercase tracking-wide">
              BU Director po hackatonie AI
            </div>
            <img className="w-full object-contain max-h-[500px] mx-auto" src={meme.image_url} alt="Meme" />
            <div className="bg-on-surface text-white px-6 py-4 font-headline font-bold text-lg text-center">
              {meme.content}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          {Object.entries(meme.reactions).map(([emoji, count]) => (
            <button
              key={emoji}
              className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full hover:bg-white transition-all shadow-sm active:scale-95"
            >
              <span className="text-xl">{emoji}</span>
              <span className="font-bold text-primary">{count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function SpottedSection({ items }) {
  if (!items.length) return null
  return (
    <section>
      <div className="flex justify-between items-end mb-4 px-2">
        <h2 className="font-headline font-extrabold text-2xl tracking-tight">Spotted</h2>
        <button className="text-primary font-bold text-sm hover:underline">View All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x">
        {items.map((item) => (
          <div key={item.id} className="snap-start flex-none w-64 group">
            <div className="relative h-80 rounded-xl overflow-hidden mb-2">
              <img className="w-full h-full object-cover" src={item.image_url} alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-bold">{item.title}</p>
                <p className="text-xs opacity-80">{timeAgo(item.created_at)} • {item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PostCard({ post }) {
  const [reactions, setReactions] = useState(post.reactions)

  const handleReact = async (emoji) => {
    try {
      const updated = await api.reactToPost(post.id, emoji)
      setReactions(updated.reactions)
    } catch (e) {
      // optimistic update
      setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))
    }
  }

  const isQuote = post.post_type === 'quote'

  return (
    <article className="bg-surface-container-low rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${post.author.id}`}>
          <img
            alt="User avatar"
            className="w-12 h-12 rounded-full bg-primary-container object-cover"
            src={post.author.avatar_url}
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author.id}`} className="font-bold text-lg leading-none hover:underline">
            {post.author.display_name}
          </Link>
          <p className="text-xs text-on-surface-variant font-medium">
            {post.author.role} • {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      {isQuote ? (
        <div className="bg-surface p-6 rounded-lg italic text-on-surface-variant border-l-4 border-primary/30">
          {post.content}
        </div>
      ) : (
        <p className="text-on-surface leading-relaxed">{post.content}</p>
      )}

      {post.image_url && !isQuote && (
        <img className="rounded-lg w-full h-64 object-cover" src={post.image_url} alt="" />
      )}

      <div className="flex items-center gap-2 pt-2 overflow-x-auto hide-scrollbar">
        {Object.entries(reactions).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="flex items-center gap-1.5 bg-surface-container-high px-3 py-2 rounded-full hover:bg-primary-container/20 transition-colors active:scale-95"
          >
            <span>{emoji}</span>
            <span className="font-bold text-xs">{count}</span>
          </button>
        ))}
      </div>
    </article>
  )
}

function EventsSidebar({ events }) {
  return (
    <aside className="hidden xl:block w-80 space-y-6 sticky top-24 h-fit shrink-0">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="bolt" className="text-secondary" />
          <h2 className="text-lg font-bold">Happening Now</h2>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <Icon name={event.event_type === 'coffee' ? 'coffee' : event.event_type === 'darts' ? 'sports_esports' : 'restaurant'} className="text-primary-dim" />
                <span className="text-[10px] font-black uppercase text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded">
                  {event.participant_count} joined
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">{event.title}</h4>
              <p className="text-xs text-on-surface-variant mb-4">
                {event.location} • {event.participant_count} people joined
              </p>
              <button className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg active:scale-95 transition-transform">
                Join
              </button>
            </Link>
          ))}
        </div>
        <Link
          to="/events/new"
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-sm font-bold text-primary border-2 border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
        >
          <Icon name="add" className="text-base" />
          Start Something
        </Link>
      </div>
      <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6 text-center">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Community Pulse</p>
        <div className="text-3xl font-black text-primary mb-1">242</div>
        <p className="text-xs text-stone-500 font-medium">Humans currently together</p>
      </div>
    </aside>
  )
}

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [meme, setMeme] = useState(null)
  const [spotted, setSpotted] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getFeed(),
      api.getMeme(),
      api.getSpotted(),
      api.getEvents(),
    ]).then(([feedData, memeData, spottedData, eventsData]) => {
      setPosts(feedData.filter((p) => p.post_type !== 'meme'))
      setMeme(memeData)
      setSpotted(spottedData)
      setEvents(eventsData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary font-headline font-bold text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 flex gap-8 max-w-[1440px] mx-auto">
      {/* Desktop Sidebar Left */}
      <aside className="hidden lg:flex flex-col gap-6 px-6 h-screen w-72 sticky top-24 pt-4 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary">
            <Icon name="park" filled />
          </div>
          <div>
            <h3 className="font-black text-primary leading-tight">Still Here</h3>
            <p className="text-xs text-stone-500 font-medium opacity-70">Internal Hub</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-primary font-bold scale-105 bg-surface-container-low rounded-xl transition-all duration-200">
            <Icon name="dynamic_feed" /> Feed
          </Link>
          <Link to="/events/1" className="flex items-center gap-4 px-4 py-3 text-stone-600 opacity-70 hover:translate-x-1 transition-all duration-200">
            <Icon name="event_note" /> Events
          </Link>
          <Link to="/profile/1" className="flex items-center gap-4 px-4 py-3 text-stone-600 opacity-70 hover:translate-x-1 transition-all duration-200">
            <Icon name="group" /> People
          </Link>
        </nav>
        <Link
          to="/events/new"
          className="mt-4 py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform text-center"
        >
          Share a Story
        </Link>
      </aside>

      {/* Central Feed */}
      <div className="flex-1 max-w-2xl space-y-8">
        <MemeOfTheDay meme={meme} />
        <SpottedSection items={spotted} />
        <section className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </div>

      {/* Right Sidebar */}
      <EventsSidebar events={events} />
    </div>
  )
}
