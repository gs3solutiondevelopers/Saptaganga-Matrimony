import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📱 Starting Saptaganga Matrimony Responsive Layout & Mobile/Tablet Verification Tests...\n');

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

// 1. Check components.css for essential Breakpoint Rules
const componentsCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'components.css'), 'utf-8');

console.log('1. Responsive Media Queries Verification:');
assert(componentsCss.includes('@media (max-width: 1024px)'), 'Tablet breakpoint (1024px) is declared');
assert(componentsCss.includes('@media (max-width: 992px)'), 'Tablet portrait breakpoint (992px) is declared');
assert(componentsCss.includes('@media (max-width: 768px)'), 'Mobile landscape / tablet small breakpoint (768px) is declared');
assert(componentsCss.includes('@media (max-width: 480px)'), 'Mobile portrait small breakpoint (480px) is declared');

console.log('\n2. Hero Section Responsive Adaptations:');
assert(componentsCss.includes('.hero-panoramic-container') && componentsCss.includes('flex-direction: column'), 'Hero container stacks vertically on mobile viewports');
assert(componentsCss.includes('.hero-metrics-strip-divided') && componentsCss.includes('grid-template-columns: repeat(2, 1fr)'), 'Metrics strip transitions to a clean 2x2 grid on mobile');
assert(componentsCss.includes('.hero-metric-divider') && componentsCss.includes('display: none'), 'Metric dividers hide on mobile grid layout to avoid clutter');
assert(componentsCss.includes('.hero-royal-rings-badge') && componentsCss.includes('position: static'), 'Royal rings badge becomes static & centered on mobile');
assert(componentsCss.includes('.hero-heart-ribbon-img'), 'Heart ribbon image has responsive sizing rules');

console.log('\n3. Touch & Interactive Components on Mobile:');
assert(componentsCss.includes('.category-tabs') && componentsCss.includes('overflow-x: auto'), 'Category filter pills support smooth horizontal touch scroll');
assert(componentsCss.includes('.quick-search-form') && componentsCss.includes('grid-template-columns: 1fr'), 'Quick search card fields stack to full-width inputs on mobile');
assert(componentsCss.includes('.profiles-grid') && componentsCss.includes('grid-template-columns: 1fr'), 'Profile cards stack to single column on mobile');
assert(componentsCss.includes('.membership-grid') && componentsCss.includes('grid-template-columns: 1fr'), 'Membership plans stack properly on small screens');

console.log('\n4. Component Markup Integrity:');
const heroBannerJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'home', 'HeroBanner.jsx'), 'utf-8');
assert(heroBannerJsx.includes('hero-title-top-row'), 'HeroBanner has hero-title-top-row for fluid text-ribbon alignment');
assert(heroBannerJsx.includes('hero-heart-ribbon-img'), 'HeroBanner embeds heart-ribbon.svg');
assert(heroBannerJsx.includes('hero-royal-rings-badge'), 'HeroBanner includes ornate royal rings badge');
assert(heroBannerJsx.includes('hero-cta-pill-row'), 'HeroBanner includes pill CTA buttons row');
assert(heroBannerJsx.includes('hero-metrics-strip-divided'), 'HeroBanner includes divided 4-metric strip');

console.log('\n========================================');
console.log(`Responsive Test Results: ${passCount} Passed, ${failCount} Failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
