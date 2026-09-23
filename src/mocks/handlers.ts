import { http, HttpResponse } from 'msw'
import { AIRPORT_CARDS, DEVICE_DETAILS, DAILY_STATS } from '@/data/mock'

export const handlers = [
  http.get('/api/devices', () => {
    return HttpResponse.json({ data: AIRPORT_CARDS })
  }),
  http.get('/api/devices/:id', ({ params }) => {
    const id = String(params.id)
    const detail = DEVICE_DETAILS[id]
    if (!detail) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 })
    }
    return HttpResponse.json({ data: detail })
  }),
  http.get('/api/stats/today', () => {
    return HttpResponse.json({ data: DAILY_STATS })
  }),
]
