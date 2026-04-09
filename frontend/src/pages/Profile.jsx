import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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

export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [activity, setActivity] = useState({ posts: [], spotted: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getUser(id), api.getUserActivity(id)])
      .then(([userData, activityData]) => {
        setUser(userData)
        setActivity(activityData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary font-headline font-bold text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="font-headline text-2xl font-bold text-on-surface-variant">User not found</h2>
        <Link to="/" className="text-primary font-bold mt-4 inline-block">Back to Feed</Link>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden px-6 max-w-2xl mx-auto space-y-8">
        {/* Hero Profile */}
        <section className="relative">
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center gap-6 shadow-[0_10px_40px_rgba(57,50,34,0.05)]">
            <div className="relative group">
              <div className="w-48 h-48 rounded-xl overflow-hidden rotate-2 group-hover:rotate-0 transition-transform duration-500">
                <img alt={user.display_name} className="w-full h-full object-cover" src={user.avatar_url} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-tertiary-container p-3 rounded-xl -rotate-6 shadow-lg">
                <Icon name="auto_awesome" className="text-on-tertiary-container" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">{user.display_name}</h1>
              <p className="text-primary font-medium text-lg mb-4">{user.role}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-1.5 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-medium">
                  @{user.username}
                </span>
                {user.location && (
                  <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium flex items-center gap-1">
                    <Icon name="location_on" size="16px" /> {user.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Fun Facts & Interests */}
        <div className="grid grid-cols-1 gap-6">
          {user.fun_facts.length > 0 && (
            <section className="bg-surface-container-high rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="celebration" className="text-primary" />
                <h2 className="font-headline text-xl font-bold">Fun Facts</h2>
              </div>
              <ul className="space-y-4">
                {user.fun_facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded-md shadow-sm">
                    <Icon name="potted_plant" className="text-tertiary" />
                    <span className="text-on-surface-variant font-medium">{fact}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {user.interests.length > 0 && (
            <section className="bg-secondary-container/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="favorite" className="text-secondary" />
                <h2 className="font-headline text-xl font-bold text-on-surface">Interests</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {user.interests.map((interest, i) => (
                  <div key={i} className="px-4 py-2 bg-surface-container-lowest text-on-surface rounded-md font-medium shadow-sm">
                    {interest}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Activity */}
        <section className="bg-surface-container-low rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="rss_feed" className="text-primary" />
              <h2 className="font-headline text-2xl font-bold">What's New</h2>
            </div>
          </div>
          <div className="space-y-6">
            {activity.posts.map((post) => (
              <div key={post.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-primary-container">
                <div className="absolute left-[-6px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface" />
                <div className="bg-surface-container-lowest p-5 rounded-md shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-on-surface">{post.post_type === 'quote' ? 'Shared a quote' : 'Posted a story'}</span>
                    <span className="text-xs text-outline-variant">{timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{post.content.slice(0, 120)}...</p>
                </div>
              </div>
            ))}
            {activity.spotted.map((item) => (
              <div key={item.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-primary-container">
                <div className="absolute left-[-6px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface" />
                <div className="bg-surface-container-lowest p-5 rounded-md shadow-sm">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-on-surface">Posted Spotted: {item.title}</span>
                    <span className="text-xs text-outline-variant">{timeAgo(item.created_at)}</span>
                  </div>
                  <div className="rounded-lg overflow-hidden h-40 mb-3">
                    <img alt={item.title} className="w-full h-full object-cover" src={item.image_url} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-[1600px] mx-auto px-8">
        {/* Hero Header */}
        <header className="relative mt-8 mb-12">
          <div className="h-64 w-full rounded-xl overflow-hidden relative bg-gradient-to-br from-primary-container to-secondary-container">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="absolute -bottom-16 left-12 flex items-end gap-8">
            <div className="p-2 bg-surface rounded-xl shadow-md">
              <img alt={user.display_name} className="w-48 h-48 rounded-lg object-cover" src={user.avatar_url} />
            </div>
            <div className="pb-4">
              <h1 className="text-5xl font-black font-headline text-on-background tracking-tight -mb-1">{user.display_name}</h1>
              <p className="text-2xl font-medium text-primary-dim opacity-90">{user.role}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 flex gap-4">
            <button className="bg-surface/80 backdrop-blur px-6 py-3 rounded-full font-bold text-primary flex items-center gap-2 hover:bg-surface transition-colors shadow-sm">
              <Icon name="edit" /> Edit Profile
            </button>
            <button className="bg-primary px-8 py-3 rounded-full font-bold text-on-primary flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">
              <Icon name="chat_bubble" filled /> Message
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="mt-24 grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {user.bio && (
              <div className="bg-surface-container rounded-lg p-8">
                <h3 className="text-xl font-bold font-headline mb-4 flex items-center gap-2">
                  <Icon name="auto_awesome" className="text-primary" /> The Vibe
                </h3>
                <p className="text-on-surface-variant leading-relaxed">{user.bio}</p>
              </div>
            )}

            {user.fun_facts.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {user.fun_facts.map((fact, i) => (
                  <div key={i} className="bg-secondary-container/30 rounded-lg p-6 flex flex-col items-center text-center">
                    <Icon name={i === 0 ? 'pets' : 'music_note'} className={`${i === 0 ? 'text-secondary' : 'text-tertiary'} text-3xl mb-2`} />
                    <p className="font-headline font-bold text-sm">{fact}</p>
                  </div>
                ))}
                {user.location && (
                  <div className="col-span-2 bg-surface-container-high rounded-lg p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="location_on" className="text-primary text-2xl" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Home Base</span>
                      <p className="font-headline font-bold">{user.location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user.interests.length > 0 && (
              <div className="bg-surface-container-low rounded-lg p-8">
                <h3 className="text-xl font-bold font-headline mb-6">Interests & Obsessions</h3>
                <div className="flex flex-wrap gap-3">
                  {user.interests.map((interest, i) => (
                    <span key={i} className="bg-surface px-5 py-2.5 rounded-full text-sm font-semibold border border-primary-container/30 text-primary-dim">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Timeline */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_10px_40px_rgba(57,50,34,0.05)]">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-4xl font-black font-headline tracking-tighter text-on-background">What's New</h2>
                  <p className="text-on-surface-variant">{user.display_name}'s recent tracks and traces</p>
                </div>
              </div>
              <div className="relative space-y-12">
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-surface-container-high" />

                {activity.posts.map((post) => (
                  <div key={post.id} className="relative pl-16">
                    <div className="absolute left-0 top-1 w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center border-4 border-surface-container-lowest z-10">
                      <Icon name={post.post_type === 'quote' ? 'format_quote' : 'edit_note'} className="text-secondary" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">
                            {post.post_type === 'quote' ? 'Shared Quote' : 'Story'}
                          </p>
                          <h4 className="text-xl font-bold font-headline">{post.content.slice(0, 60)}...</h4>
                        </div>
                        <span className="text-sm text-on-surface-variant font-medium">{timeAgo(post.created_at)}</span>
                      </div>
                      {post.image_url && (
                        <div className="rounded-xl overflow-hidden">
                          <img alt="" className="w-full h-48 object-cover" src={post.image_url} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {activity.spotted.map((item) => (
                  <div key={item.id} className="relative pl-16">
                    <div className="absolute left-0 top-1 w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center border-4 border-surface-container-lowest z-10">
                      <Icon name="map" className="text-tertiary" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-tertiary uppercase tracking-widest mb-1">New Spotted</p>
                          <h4 className="text-xl font-bold font-headline">{item.title}</h4>
                        </div>
                        <span className="text-sm text-on-surface-variant font-medium">{timeAgo(item.created_at)}</span>
                      </div>
                      <div className="rounded-xl overflow-hidden">
                        <img alt={item.title} className="w-full h-48 object-cover" src={item.image_url} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
