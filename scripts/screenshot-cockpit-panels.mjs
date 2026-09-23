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

const openHasMileage = await page.getByText('总里程').count()
await page.getByRole('button', { name: '收起任务信息预览' }).click()
await page.waitForTimeout(200)
const closedMileage = await page.getByText('总里程').count()
const expandBtn = await page.getByRole('button', { name: '展开任务信息预览' }).count()
await page.getByRole('button', { name: '展开任务信息预览' }).click()
await page.waitForTimeout(200)
const reopenMileage = await page.getByText('总里程').count()

// collapse flight params
await page.getByRole('button', { name: '收起飞行参数' }).click()
await page.waitForTimeout(200)
const paramsHidden = (await page.getByText('已飞行时间').count()) === 0
await page.getByRole('button', { name: '展开飞行参数' }).click()

// collapse attitude
await page.getByRole('button', { name: '收起飞行状态及仪表' }).click()
await page.waitForTimeout(200)
const attitudeHidden =
  (await page.getByText('锁定状态，等待解锁').count()) === 0
await page.getByRole('button', { name: '展开飞行状态及仪表' }).click()

console.log(
  JSON.stringify(
    {
      openHasMileage: openHasMileage > 0,
      closedMileage: closedMileage === 0,
      expandBtn: expandBtn > 0,
      reopenMileage: reopenMileage > 0,
      paramsHidden,
      attitudeHidden,
    },
    null,
    2,
  ),
)
await page.screenshot({ path: 'output/cockpit-panels.png' })
await browser.close()
