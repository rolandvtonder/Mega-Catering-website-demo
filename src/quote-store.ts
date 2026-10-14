import { useSyncExternalStore } from 'react'
import type { ServiceId } from './content'

/*
  The quote list is shared by pages that never see each other — the hire
  catalogue, the services page and the quote form — so it is a tiny external
  store mirrored to localStorage. Ticking a chair on /hire/ and opening
  /quote/ finds it still there.
*/

type State = { items: string[]; services: ServiceId[] }

const KEY = 'mega-quote'
const EMPTY: State = { items: [], services: [] }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const v = JSON.parse(raw)
    return { items: Array.isArray(v.items) ? v.items : [], services: Array.isArray(v.services) ? v.services : [] }
  } catch {
    return EMPTY
  }
}

let state: State = load()
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

const set = (next: State) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode or storage blocked: the list still works for this page */
  }
  emit()
}

/* Back/forward restores a page from cache with its old list; re-read on return,
   and follow changes made in another tab. */
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      state = load()
      emit()
    }
  })
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load()
      emit()
    }
  })
}

export const quote = {
  subscribe(f: () => void) {
    subs.add(f)
    return () => {
      subs.delete(f)
    }
  },
  get: () => state,
  toggleItem(item: string) {
    const has = state.items.includes(item)
    set({ ...state, items: has ? state.items.filter((i) => i !== item) : [...state.items, item] })
  },
  toggleService(id: ServiceId) {
    const has = state.services.includes(id)
    set({ ...state, services: has ? state.services.filter((s) => s !== id) : [...state.services, id] })
  },
  addService(id: ServiceId) {
    if (!state.services.includes(id)) set({ ...state, services: [...state.services, id] })
  },
  clear() {
    set(EMPTY)
  },
}

/* At build time (prerendering) there is no browser storage, so the list is empty. */
export const useQuote = () => useSyncExternalStore(quote.subscribe, quote.get, () => EMPTY)
