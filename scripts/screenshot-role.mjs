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

await page.goto('http://127.0.0.1:4173/#/vertical-panorama', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container', { timeout: 30000 })
await page.waitForTimeout(1500)

// default = cabin
const cabinRole = await page.getByText('方舱', { exact: true }).first().isVisible()
const cabinBattery = await page
  .locator('[aria-label*="电量"]')
  .first()
  .getAttribute('aria-label')
await page.screenshot({ path: 'output/detail-cabin.png' })

// click drone
await page.getByRole('button', { name: /垂起3/ }).click()
await page.waitForTimeout(400)
const droneRole = await page.getByText('垂起', { exact: true }).first().isVisible()
const droneBattery = await page
  .locator('[aria-label*="电量"]')
  .first()
  .getAttribute('aria-label')
const charge = await page.getByText('空闲').count()
await page.screenshot({ path: 'output/detail-drone.png' })

console.log(
  JSON.stringify(
    { cabinRole, cabinBattery, droneRole, droneBattery, hasIdleCharge: charge > 0 },
    null,
    2,
  ),
)

await browser.close()
