import { PageFrame } from '@/components/layout/AppLayout'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageFrame title={title}>
      <div className="flex h-full items-center justify-center">
        <div className="panel-glass rounded-panel px-8 py-6 text-center">
          <p className="text-base font-medium text-ink-primary">{title}</p>
          <p className="mt-2 text-sm text-ink-secondary">
            该模块原型将在后续迭代中接入，当前优先交付「垂起全景」。
          </p>
        </div>
      </div>
    </PageFrame>
  )
}
