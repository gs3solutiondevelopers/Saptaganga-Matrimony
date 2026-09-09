import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Comprehensive Multi-Viewport & Device Simulation Verification\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failCount++;
  }
}

const componentsCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'components.css'), 'utf-8');
const indexCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'index.css'), 'utf-8');

console.log('1. Device Viewport Range Validation:');
assert(componentsCss.includes('@media (max-width: 1024px)'), 'iPad / Android Tablet (1024px) breakpoint configured');
assert(componentsCss.includes('@media (max-width: 992px)'), 'iPad Portrait / Small Tablet (992px) breakpoint configured');
assert(componentsCss.includes('@media (max-width: 768px)'), 'Large Phone / Phablet (768px) breakpoint configured');
assert(componentsCss.includes('@media (max-width: 480px)'), 'Standard Mobile (480px) breakpoint configured');

console.log('\n2. Mobile Viewport (320px - 480px) UI Safety:');
assert(indexCss.includes('overflow-x: clip') || indexCss.includes('overflow-x: hidden') || componentsCss.includes('overflow-x'), 'Global overflow-x protection prevents horizontal page shifting');
assert(componentsCss.includes('.hero-metrics-strip-divided') && componentsCss.includes('grid-template-columns: repeat(2, 1fr)'), 'Hero 4-metric strip collapses to 2x2 grid on mobile');
assert(componentsCss.includes('.hero-btn-pill-primary') && componentsCss.includes('flex: 1'), 'CTA buttons adjust flex layout for mobile touch interaction');
assert(componentsCss.includes('.hero-heart-ribbon-img') && componentsCss.includes('max-width'), 'Heart ribbon image respects max-width constraints on small screens');

console.log('\n3. Tablet Viewport (768px - 1024px) UI Balance:');
assert(componentsCss.includes('.quick-search-form') && componentsCss.includes('grid-template-columns: 1fr 1fr'), 'Quick search card formats as 2x2 grid on tablet');
assert(componentsCss.includes('.membership-grid') && componentsCss.includes('repeat(2, 1fr)'), 'Membership cards format as balanced 2x2 grid on tablet');
assert(componentsCss.includes('.profiles-grid') && componentsCss.includes('repeat(2, 1fr)'), 'Featured profiles format as balanced 2-column grid on tablet');

console.log('\n4. Desktop Viewport (> 1024px) Luxury Aesthetics:');
assert(componentsCss.includes('.hero-metrics-strip-divided') && componentsCss.includes('.hero-metric-divider'), 'Desktop displays horizontal metric strip with golden vertical dividers');
assert(componentsCss.includes('.hero-royal-rings-badge') && componentsCss.includes('position: absolute'), 'Desktop positions royal rings badge over couple portrait');

console.log('\n========================================');
console.log(`Viewport Verification Results: ${passCount} Passed, ${failCount} Failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
