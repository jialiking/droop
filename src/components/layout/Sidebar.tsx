import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Cpu,
  Database,
  FileText,
  Flame,
  Grid3X3,
  MapPin,
  Monitor,
  Phone,
  Route,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Upload,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/data/mock'
import { cn } from '@/lib/cn'
import type { NavItem } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  monitor: Monitor,
  grid: Grid3X3,
  route: Route,
  'map-pin': MapPin,
  search: Search,
  'file-text': FileText,
  phone: Phone,
  flame: Flame,
  clipboard: ClipboardList,
  settings: Settings,
  cpu: Cpu,
  alert: AlertTriangle,
  sliders: SlidersHorizontal,
  database: Database,
  upload: Upload,
  book: BookOpen,
}

function shouldOpenGroup(group: NavItem, pathname: string): boolean {
  return Boolean(group.children?.some((child) => child.path === pathname))
}

export function Sidebar() {
  const location = useLocation()
  const [openIds, setOpenIds] = useState<string[]>(() =>
    NAV_ITEMS.filter((item) => shouldOpenGroup(item, location.pathname)).map(
      (item) => item.id,
    ),
  )

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-app-border bg-app-sidebar">
      <nav
        className="scrollbar-thin flex-1 overflow-y-auto py-2"
        aria-label="主导航"
      >
        {NAV_ITEMS.map((item) => {
          if (item.children && item.children.length > 0) {
            const open = openIds.includes(item.id) || shouldOpenGroup(item, location.pathname)
            return (
              <div key={item.id} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={open}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm',
                    'text-ink-primary transition hover:bg-white/5',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan/40',
                  )}
                >
                  <NavIcon name={item.icon} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-ink-muted transition-transform',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                {open && (
                  <ul className="pb-1">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <SideNavLink item={child} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          }

          return (
            <div key={item.id} className="px-0 py-0.5">
              <SideNavLink item={item} />
            </div>
          )
        })}
      </nav>

      <div className="border-t border-app-border px-3 py-3">
        <button
          type="button"
          aria-label="收起菜单"
          className="flex h-8 w-8 items-center justify-center rounded-panel text-ink-secondary transition hover:bg-white/5 hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
        >
          <span className="flex flex-col gap-0.5">
            <span className="block h-0.5 w-4 rounded bg-current" />
            <span className="block h-0.5 w-4 rounded bg-current" />
            <span className="block h-0.5 w-4 rounded bg-current" />
          </span>
        </button>
      </div>
    </aside>
  )
}

function SideNavLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path ?? '#'}
      className={({ isActive }) =>
        cn(
          'mx-2 flex items-center gap-2 rounded-panel px-2.5 py-2 text-sm transition',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan/50',
          isActive
            ? 'bg-app-active font-medium text-ink-primary shadow-card'
            : 'text-ink-secondary hover:bg-white/5 hover:text-ink-primary',
        )
      }
    >
      <NavIcon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  )
}

function NavIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? MapPin
  return <Icon className="h-4 w-4 shrink-0" />
}
