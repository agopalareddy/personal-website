const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          const MODES = [
            { value: 'auto', label: 'Sync with system' },
            { value: 'light', label: 'Light' }
          ];
          const modeIcon = () => '<svg></svg>';

          // Baseline implementation
          function syncPickersBaseline(mode) {
            var currentObj = MODES.find((m) => m.value === mode) || MODES[0];
            var pickers = document.querySelectorAll('.theme-picker');

            pickers.forEach((picker) => {
              var summary = picker.querySelector('summary');
              if (summary) {
                summary.setAttribute('aria-label', 'Theme: ' + currentObj.label);
                var icons = summary.querySelectorAll('svg');
                if (icons.length > 0) {
                  var newDoc = new DOMParser().parseFromString(modeIcon(mode), 'image/svg+xml');
                  if (newDoc.documentElement) icons[0].replaceWith(newDoc.documentElement);
                }
              }
              var options = picker.querySelectorAll('.theme-picker-option');
              options.forEach((opt) => {
                opt.setAttribute('aria-checked', opt.dataset.themeValue === mode ? 'true' : 'false');
              });
            });
          }

          // Optimized implementation
          function syncPickersOptimized(mode) {
            var currentObj = MODES.find((m) => m.value === mode) || MODES[0];
            var pickers = document.querySelectorAll('.theme-picker');

            var newDoc = new DOMParser().parseFromString(modeIcon(mode), 'image/svg+xml');
            var iconTemplate = newDoc.documentElement;

            pickers.forEach((picker) => {
              var summary = picker.querySelector('summary');
              if (summary) {
                summary.setAttribute('aria-label', 'Theme: ' + currentObj.label);
                var icons = summary.querySelectorAll('svg');
                if (icons.length > 0 && iconTemplate) {
                  icons[0].replaceWith(iconTemplate.cloneNode(true));
                }
              }
              var options = picker.querySelectorAll('.theme-picker-option');
              options.forEach((opt) => {
                opt.setAttribute('aria-checked', opt.dataset.themeValue === mode ? 'true' : 'false');
              });
            });
          }

          // Setup test data
          for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.className = 'theme-picker';
            div.innerHTML = '<summary><svg></svg></summary>';
            document.body.appendChild(div);
          }

          // Warmup
          for (let i = 0; i < 10; i++) {
            syncPickersBaseline('light');
            syncPickersOptimized('light');
          }

          // Measure Baseline
          const startBaseline = performance.now();
          for (let i = 0; i < 100; i++) {
            syncPickersBaseline('light');
          }
          const endBaseline = performance.now();

          // Measure Optimized
          const startOptimized = performance.now();
          for (let i = 0; i < 100; i++) {
            syncPickersOptimized('light');
          }
          const endOptimized = performance.now();

          window.benchmarkResult = {
            baseline: endBaseline - startBaseline,
            optimized: endOptimized - startOptimized
          };
        </script>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const result = await page.evaluate(() => window.benchmarkResult);

  console.log('--- Benchmark Results ---');
  console.log(`Baseline: ${result.baseline.toFixed(2)} ms`);
  console.log(`Optimized: ${result.optimized.toFixed(2)} ms`);
  const improvement = (((result.baseline - result.optimized) / result.baseline) * 100).toFixed(2);
  console.log(`Improvement: ${improvement}%`);

  await browser.close();
})();
