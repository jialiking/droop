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
await page.waitForSelector('.leaflet-container')
await page.waitForTimeout(800)

await page.getByRole('button', { name: /方舱3/ }).click()
await page.getByRole('button', { name: '机库控制' }).click()
await page.waitForTimeout(400)

const labels = [
  '顶门关闭',
  '升降下降',
  '归中夹紧',
  '充电夹具缩回',
  '未充电',
  '在库·出库',
  '飞机关机',
  '急停',
  '机场复位',
  '重启工控机',
  '关空调',
]
// bound button label is onLabel when off: 出库 when drone_in_dock true shows offLabel 入库
const found = {}
for (const t of labels) {
  found[t] = (await page.getByText(t, { exact: true }).count()) > 0
}
found.noOsdHumidity = (await page.getByText('外湿').count()) === 0
found.dialogTitle = (await page.getByText('机库控制', { exact: true }).count()) > 0

// toggle cover: currently closed -> click shows 顶门关闭 state button executes open
await page.getByRole('button', { name: '顶门关闭', exact: true }).click()
await page.waitForTimeout(700)
found.coverToggled = (await page.getByText('顶门打开', { exact: true }).count()) > 0

await page.screenshot({ path: 'output/hangar-cmd-dialog.png' })
console.log(JSON.stringify(found, null, 2))
await browser.close()
