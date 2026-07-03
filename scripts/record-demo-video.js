const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '..');
const baseUrl = 'https://agendamento-saas-sigma.vercel.app';
const outputDir = path.join(rootDir, 'docs', 'demo_video');
const rawVideoDir = '/tmp/agendamento-saas-demo-video-raw';
const webmPath = path.join(outputDir, 'agendamento-saas-demo.webm');

fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(rawVideoDir, { recursive: true, force: true });
fs.mkdirSync(rawVideoDir, { recursive: true });

let cursor = { x: 100, y: 100 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureCursor(page) {
  await page.evaluate(({ x, y }) => {
    if (!document.getElementById('portfolio-demo-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'portfolio-demo-cursor-style';
      style.textContent = `
        * { cursor: none !important; }

        #portfolio-demo-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          border: 3px solid #0f2a2e;
          border-radius: 9999px;
          background: rgba(244, 201, 93, 0.72);
          box-shadow:
            0 0 0 5px rgba(244, 201, 93, 0.22),
            0 10px 28px rgba(15, 42, 46, 0.28);
          pointer-events: none;
          z-index: 2147483647;
          transform: translate3d(${x}px, ${y}px, 0);
          will-change: transform;
        }

        #portfolio-demo-cursor::after {
          content: "";
          position: absolute;
          left: 7px;
          top: 7px;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #0f2a2e;
        }

        #portfolio-demo-cursor.portfolio-click {
          animation: portfolio-click-pulse 420ms ease-out;
        }

        @keyframes portfolio-click-pulse {
          0% { transform: translate3d(var(--cursor-x), var(--cursor-y), 0) scale(1); }
          50% { transform: translate3d(var(--cursor-x), var(--cursor-y), 0) scale(.82); }
          100% { transform: translate3d(var(--cursor-x), var(--cursor-y), 0) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById('portfolio-demo-cursor')) {
      const element = document.createElement('div');
      element.id = 'portfolio-demo-cursor';
      document.body.appendChild(element);
    }

    const element = document.getElementById('portfolio-demo-cursor');
    element.style.setProperty('--cursor-x', `${x}px`);
    element.style.setProperty('--cursor-y', `${y}px`);
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, cursor);
}

async function moveCursor(page, x, y, duration = 700) {
  await ensureCursor(page);
  const from = { ...cursor };
  const to = { x, y };

  await page.evaluate(
    ({ from, to, duration }) =>
      new Promise((resolve) => {
        const element = document.getElementById('portfolio-demo-cursor');
        const start = performance.now();
        const ease = (time) => 1 - Math.pow(1 - time, 3);

        function frame(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = ease(progress);
          const x = from.x + (to.x - from.x) * eased;
          const y = from.y + (to.y - from.y) * eased;

          element.style.setProperty('--cursor-x', `${x}px`);
          element.style.setProperty('--cursor-y', `${y}px`);
          element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

          if (progress < 1) {
            requestAnimationFrame(frame);
            return;
          }

          resolve();
        }

        requestAnimationFrame(frame);
      }),
    { from, to, duration },
  );

  await page.mouse.move(x + 12, y + 12, { steps: 8 });
  cursor = to;
}

async function pulse(page) {
  await ensureCursor(page);
  await page.evaluate(() => {
    const element = document.getElementById('portfolio-demo-cursor');
    element.classList.remove('portfolio-click');
    void element.offsetWidth;
    element.classList.add('portfolio-click');
  });
  await sleep(450);
}

async function pointForLocator(locator, label = 'target') {
  await locator.scrollIntoViewIfNeeded();
  await sleep(250);

  const box = await locator.boundingBox();
  if (!box) {
    throw new Error(`No visible box for ${label}`);
  }

  return {
    x: Math.max(8, Math.min(box.x + box.width / 2 - 12, 1220)),
    y: Math.max(8, Math.min(box.y + box.height / 2 - 12, 680)),
  };
}

async function clickLocator(page, locator, label = 'target') {
  const { x, y } = await pointForLocator(locator, label);
  await moveCursor(page, x, y);
  await page.mouse.click(x + 12, y + 12);
  await pulse(page);
  await sleep(250);
}

async function fillLocator(page, locator, value, label = 'field') {
  await clickLocator(page, locator, label);
  await locator.fill(value);
  await sleep(450);
}

async function selectLocator(page, locator, value, label = 'select') {
  const { x, y } = await pointForLocator(locator, label);
  await moveCursor(page, x, y);
  await page.mouse.click(x + 12, y + 12);
  await pulse(page);
  await locator.selectOption(value);
  await sleep(450);
}

async function selectFirstAvailable(page, locator, label = 'select') {
  const values = await locator.locator('option').evaluateAll((options) =>
    options.map((option) => option.value).filter(Boolean),
  );

  if (values[0]) {
    await selectLocator(page, locator, values[0], label);
  }
}

async function selectByOptionValue(page, label, value) {
  const candidates = page.getByLabel(label);
  const count = await candidates.count();

  for (let index = 0; index < count; index += 1) {
    const candidate = candidates.nth(index);
    const values = await candidate.locator('option').evaluateAll((options) =>
      options.map((option) => option.value),
    );

    if (values.includes(value)) {
      await selectLocator(page, candidate, value, `${label}: ${value}`);
      return;
    }
  }

  throw new Error(`No select option "${value}" for label "${label}"`);
}

async function scrollFullPage(page, pause = 500) {
  await ensureCursor(page);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const view = await page.evaluate(() => window.innerHeight);

  let y = 0;
  while (y + view < height - 20) {
    y = Math.min(y + Math.floor(view * 0.72), height - view);
    await page.evaluate((target) => {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }, y);
    await sleep(pause);
  }

  await sleep(500);

  if (height > view + 20) {
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await sleep(pause);
  }
}

async function gotoApp(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
  await ensureCursor(page);
  await page.waitForLoadState('networkidle');
  await sleep(900);
}

async function loginAsAdmin(page) {
  await gotoApp(page, '/');
  await clickLocator(page, page.getByRole('button', { name: /Demo admin/i }), 'admin demo');
  await clickLocator(page, page.getByRole('button', { name: /^Entrar$/i }), 'login');
  await page.waitForURL('**/dashboard', { timeout: 60000 });
  await ensureCursor(page);
  await sleep(1200);
}

async function loginAsClient(page) {
  await gotoApp(page, '/');
  await clickLocator(page, page.getByRole('button', { name: /Demo cliente/i }), 'client demo');
  await clickLocator(page, page.getByRole('button', { name: /^Entrar$/i }), 'login');
  await page.waitForURL('**/my-appointments', { timeout: 60000 });
  await ensureCursor(page);
  await sleep(1200);
}

async function tourAdmin(page) {
  await scrollFullPage(page);

  await gotoApp(page, '/users');
  await fillLocator(page, page.getByLabel('Busca').first(), 'admin', 'users search');
  await fillLocator(page, page.getByLabel('Busca').first(), '', 'clear users search');

  await gotoApp(page, '/clients');
  await selectByOptionValue(page, 'Status', 'true');
  await clickLocator(page, page.getByText('Ver detalhe', { exact: true }).first(), 'client detail');
  await scrollFullPage(page);

  await gotoApp(page, '/services');
  await selectByOptionValue(page, 'Status', 'false');
  await selectByOptionValue(page, 'Status', 'all');
  await scrollFullPage(page);

  await gotoApp(page, '/appointments');
  await selectByOptionValue(page, 'Status', 'scheduled');
  await clickLocator(page, page.getByText('Ver detalhe', { exact: true }).first(), 'appointment detail');
  await clickLocator(page, page.getByText('Reagendar', { exact: true }).first(), 'reschedule');
  await scrollFullPage(page);

  await gotoApp(page, '/payments');
  await selectByOptionValue(page, 'Status', 'paid');
  await selectByOptionValue(page, 'Status', 'all');
  await clickLocator(page, page.getByText('Editar status', { exact: true }).first(), 'payment edit');
  await scrollFullPage(page);

  await gotoApp(page, '/account');
  await scrollFullPage(page);
}

async function tourClient(page) {
  await scrollFullPage(page);

  await gotoApp(page, '/book-appointment');
  await selectFirstAvailable(page, page.getByLabel('Servico').first(), 'service');
  await fillLocator(
    page,
    page.getByLabel('Observacoes').first(),
    'Demo de fluxo de agendamento pelo cliente.',
    'booking notes',
  );
  await scrollFullPage(page);

  await gotoApp(page, '/account');
  await scrollFullPage(page);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let context;
  let video;

  try {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: rawVideoDir,
        size: { width: 1280, height: 720 },
      },
    });

    const page = await context.newPage();
    video = page.video();

    await loginAsAdmin(page);
    await tourAdmin(page);

    await clickLocator(page, page.getByRole('button', { name: /^Sair$/i }).first(), 'logout');
    await page.waitForURL('**/', { timeout: 60000 });
    await sleep(900);

    await loginAsClient(page);
    await tourClient(page);

    await sleep(1200);
  } finally {
    if (context) {
      await context.close();
    }

    if (video) {
      await video.saveAs(webmPath);
      console.log(`Saved video: ${webmPath}`);
    }

    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
