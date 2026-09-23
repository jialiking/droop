/** 兼容 GitHub Pages 子路径（如 /droop/）的 public 资源地址 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
