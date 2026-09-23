import { Bell, BookOpen, Maximize2, Menu } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-app-header px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent-cyan/30 to-accent-blue/40">
          <span className="text-sm font-bold text-accent-cyan">丰</span>
        </div>
        <h1 className="text-xl font-semibold tracking-wide text-ink-primary">
          丰东科技信息管理系统
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <HeaderIconBtn label="通知">
          <Bell className="h-4 w-4" />
        </HeaderIconBtn>
        <HeaderIconBtn label="帮助">
          <BookOpen className="h-4 w-4" />
        </HeaderIconBtn>
        <button
          type="button"
          className={cn(
            'ml-1 flex items-center gap-1.5 rounded-panel border border-accent-cyan/40',
            'bg-gradient-to-r from-accent-blue/30 to-accent-cyan/20 px-3 py-1.5',
            'text-sm font-medium text-ink-primary transition',
            'hover:border-accent-cyan hover:shadow-glow',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60',
          )}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          进入大屏
        </button>
        <div className="ml-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-app-border bg-app-card">
          <img src="/mock/avatar.svg" alt="用户头像" className="h-full w-full" />
        </div>
        <HeaderIconBtn label="菜单" className="ml-1">
          <Menu className="h-4 w-4" />
        </HeaderIconBtn>
      </div>
    </header>
  )
}

function HeaderIconBtn({
  children,
  label,
  className,
}: {
  children: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-panel text-ink-secondary',
        'transition hover:bg-white/5 hover:text-ink-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50',
        className,
      )}
    >
      {children}
    </button>
  )
}
