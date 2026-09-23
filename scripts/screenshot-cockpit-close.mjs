import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  headless: true,
  executablePath:
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
})
const page = await browser.newPage({
  viewport: { width: 1680, height: 945 },
  locale: 'zh-CN',
})

await page.goto('http://127.0.0.1:4173/#/cockpit', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container')
await page.waitForTimeout(1500)

await page.screenshot({ path: 'output/cockpit.png' })

await page.getByRole('button', { name: '关闭驾驶舱' }).click()
await page.waitForTimeout(300)

const dialogTitle = await page.getByText('确认关闭驾驶舱？').count()
const dialogBody = await page.getByText('关闭后将退出当前驾驶舱页面，是否继续？').count()
const hasCancel = await page.getByRole('button', { name: '取消' }).count()
const hasConfirm = await page.getByRole('button', { name: '确认关闭' }).count()

console.log(JSON.stringify({ dialogTitle, dialogBody, hasCancel, hasConfirm }, null, 2))
await page.screenshot({ path: 'output/cockpit-close-confirm.png' })

// cancel should dismiss
await page.getByRole('button', { name: '取消' }).click()
await page.waitForTimeout(200)
const afterCancel = await page.getByText('确认关闭驾驶舱？').count()
console.log('after_cancel', afterCancel)

await browser.close()
