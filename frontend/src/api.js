const BASE = '/api'

async function fetcher(url) {
  const res = await fetch(`${BASE}${url}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function poster(url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getFeed: () => fetcher('/feed'),
  getMeme: () => fetcher('/feed/meme'),
  getSpotted: () => fetcher('/spotted'),
  createPost: (data) => poster('/feed', data),
  reactToPost: (id, emoji) => poster(`/feed/${id}/react`, { emoji }),
  getEvents: () => fetcher('/events'),
  getEvent: (id) => fetcher(`/events/${id}`),
  createEvent: (data) => poster('/events', data),
  joinEvent: (id) => poster(`/events/${id}/join`, {}),
  getUsers: () => fetcher('/users'),
  getUser: (id) => fetcher(`/users/${id}`),
  getUserActivity: (id) => fetcher(`/users/${id}/activity`),
}
