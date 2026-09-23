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
page.on('pageerror', (e) => console.log('PAGE_ERROR', e.message))

await page.goto('http://127.0.0.1:4173/#/vertical-panorama', {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForSelector('.leaflet-container')
await page.waitForTimeout(1000)

// select cabin
await page.getByRole('button', { name: /方舱3/ }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: '机库控制' }).click()
await page.waitForTimeout(500)

const checks = {
  drawer: (await page.getByText('机库控制', { exact: true }).count()) > 0,
  safety: (await page.getByText('急停', { exact: true }).count()) > 0,
  coverCard: (await page.getByText('顶盖与升降').count()) > 0,
  droneCard: (await page.getByText('飞机与能源').count()) > 0,
  env: (await page.getByText('环境速览').count()) > 0,
  moreBtn: (await page.getByText('更多控制 / 明细', { exact: true }).count()) > 0,
  noJogOnMain: (await page.getByRole('button', { name: '归中夹紧' }).count()) === 0,
}

// open more dialog
await page.getByRole('button', { name: '更多控制 / 明细', exact: true }).click()
await page.waitForTimeout(300)
checks.jogInDialog = (await page.getByRole('button', { name: '归中夹紧' }).count()) > 0
checks.humidity = (await page.getByText('外湿').count()) > 0
await page.screenshot({ path: 'output/hangar-more.png' })
await page.getByRole('button', { name: '关闭弹窗' }).click()
await page.waitForTimeout(200)

// out_bound progress
await page.getByRole('button', { name: '出库' }).click()
await page.waitForTimeout(300)
const confirmOut = (await page.getByText('确认执行「出库」？').count()) > 0
checks.confirmOut = confirmOut
if (confirmOut) {
  await page.getByRole('button', { name: '确认执行' }).click()
}
await page.waitForTimeout(400)
checks.progressUi =
  (await page.getByText('出库进度').count()) > 0 ||
  (await page.getByText('出库完成').count()) > 0
await page.waitForTimeout(1600)
await page.screenshot({ path: 'output/hangar-drawer.png' })

// interlock: stop then try cover
await page.getByRole('button', { name: '急停', exact: true }).click()
await page.waitForTimeout(250)
await page.getByRole('button', { name: '确认执行' }).click()
await page.waitForTimeout(500)
const lockedText = (await page.getByText(/清除急停信号为 ON/).count()) > 0
checks.lockedText = lockedText
const coverDisabled = await page
  .getByRole('button', { name: '顶门打开' })
  .isDisabled()
checks.coverDisabled = coverDisabled
const stopStill = await page
  .getByRole('button', { name: '急停', exact: true })
  .isEnabled()
const clearEnabled = await page
  .getByRole('button', { name: '清除急停', exact: true })
  .isEnabled()
checks.stopEnabledWhenLocked = stopStill
checks.clearEnabled = clearEnabled

await page.screenshot({ path: 'output/hangar-locked.png' })
console.log(JSON.stringify(checks, null, 2))
await browser.close()
