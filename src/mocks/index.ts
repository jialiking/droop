import { handlers } from './handlers'

/**
 * 开发环境可选启用 MSW：
 * 在 main.tsx 顶部：
 * if (import.meta.env.DEV) {
 *   const { worker } = await import('./mocks/browser')
 *   await worker.start({ onUnhandledRequest: 'bypass' })
 * }
 * 当前 Demo 以本地 mock 数据直连渲染，保证无网络也可完整交互。
 */
export { handlers }
