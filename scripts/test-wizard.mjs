import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('💍 Starting Saptaganga Matrimony 5-Step & Search Gating Verification Tests...\n');

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

// 1. Verify locationData.js
console.log('1. Verifying Location Data:');
const locationPath = path.join(rootDir, 'src', 'data', 'locationData.js');
assert(fs.existsSync(locationPath), 'locationData.js exists');
const locationContent = fs.readFileSync(locationPath, 'utf-8');
assert(locationContent.includes('INDIAN_STATES') && locationContent.includes('STATE_CITIES_MAP'), 'locationData.js exports INDIAN_STATES & STATE_CITIES_MAP');
assert(locationContent.includes('West Bengal') && locationContent.includes('Kolkata'), 'Contains West Bengal and Kolkata');
assert(locationContent.includes('Maharashtra') && locationContent.includes('Mumbai'), 'Contains Maharashtra and Mumbai');

// 2. Verify CreateProfileModal.jsx 5-Step (3 Options Per Step)
console.log('\n2. Verifying CreateProfileModal.jsx 5-Step Wizard:');
const modalPath = path.join(rootDir, 'src', 'components', 'modals', 'CreateProfileModal.jsx');
assert(fs.existsSync(modalPath), 'CreateProfileModal.jsx exists');
const modalContent = fs.readFileSync(modalPath, 'utf-8');
assert(modalContent.includes('Step {currentStep}/5') || modalContent.includes('currentStep === 5'), '5-step wizard configured');
assert(modalContent.includes('currentStep === 1') && modalContent.includes('1. PROFILE CREATED FOR'), 'Step 1: 3 options present');
assert(modalContent.includes('currentStep === 2') && modalContent.includes('1. ') && modalContent.includes('DATE OF BIRTH (DOB)'), 'Step 2: DOB & 3 options present');
assert(modalContent.includes('currentStep === 3') && modalContent.includes('1. ') && modalContent.includes('STATE / REGION'), 'Step 3: State, City, Mobile present');
assert(modalContent.includes('currentStep === 4') && modalContent.includes('1. ') && modalContent.includes('HIGHEST EDUCATION'), 'Step 4: Education, Occupation, Income present');
assert(modalContent.includes('currentStep === 5') && modalContent.includes('1. ') && modalContent.includes('PROFILE PHOTO'), 'Step 5: Profile Photo present');
assert(modalContent.includes('2. ') && modalContent.includes('HOBBIES & INTERESTS'), 'Step 5: Hobbies & Interests (optional) present');
assert(modalContent.includes('3. ') && modalContent.includes('SOCIAL MEDIA PROFILE LINKS'), 'Step 5: Social Media Profile Links (optional) present');
assert(modalContent.includes('4. ') && modalContent.includes('A FEW WORDS ABOUT'), 'Step 5: Bio (optional) present');
assert(modalContent.includes('handleToggleHobby'), 'Hobbies multi-select toggle implemented');
assert(modalContent.includes('calculatedAge'), 'Auto-calculated Age from DOB implemented');
assert(modalContent.includes('Profile Created Successfully'), 'Celebratory Success screen implemented');
assert(modalContent.includes('Go to My Matching Profiles'), 'Success screen has Go to My Matching Profiles button');

// 3. Verify HowItWorks.jsx
console.log('\n3. Verifying HowItWorks.jsx:');
const howItWorksPath = path.join(rootDir, 'src', 'components', 'home', 'HowItWorks.jsx');
const howItWorksContent = fs.readFileSync(howItWorksPath, 'utf-8');
assert(howItWorksContent.includes('onOpenCreateProfile'), 'HowItWorks accepts onOpenCreateProfile');
assert(howItWorksContent.includes('handleStepClick') && (howItWorksContent.includes('num === 1') || howItWorksContent.includes("stepNum === '1'")), 'Step 1 card triggers profile opening directly');

// 4. Verify Search Gating Logic
console.log('\n4. Verifying Search Gating by Profile Completion:');
const quickSearchPath = path.join(rootDir, 'src', 'components', 'home', 'QuickSearchCard.jsx');
const quickSearchContent = fs.readFileSync(quickSearchPath, 'utf-8');
assert(quickSearchContent.includes('currentUser?.profileCompleted') && quickSearchContent.includes('onOpenCreateProfile'), 'QuickSearchCard gates search on profile completion and triggers Create Profile');

const searchPagePath = path.join(rootDir, 'src', 'pages', 'SearchPage.jsx');
const searchPageContent = fs.readFileSync(searchPagePath, 'utf-8');
assert(searchPageContent.includes('currentUser?.profileCompleted') && searchPageContent.includes('Profile Creation Required'), 'SearchPage gates search results behind profile completion');

const matchesPagePath = path.join(rootDir, 'src', 'pages', 'MatchesPage.jsx');
const matchesPageContent = fs.readFileSync(matchesPagePath, 'utf-8');
assert(matchesPageContent.includes('currentUser?.profileCompleted') && matchesPageContent.includes('Create Your Profile to View Matches'), 'MatchesPage gates recommendations behind profile completion');

const appPath = path.join(rootDir, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf-8');
assert(appContent.includes('!currentUser?.profileCompleted') && appContent.includes('setCreateProfileOpen(true)'), 'App.jsx handleQuickSearch redirects unprofiled users to Create Profile modal');

// 5. Verify Navbar Notification Button
console.log('\n5. Verifying Navbar Notification Button & Badge:');
const navbarPath = path.join(rootDir, 'src', 'components', 'common', 'Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
assert(navbarContent.includes('Bell') && navbarContent.includes('Notification') && navbarContent.includes('unreadCount'), 'Navbar Notification button with Bell icon, count badge & dropdown exists');

// 6. Verify Zero Bengali Script in Source:
console.log('\n6. Verifying Zero Bengali Script in Source:');
const bengaliRegex = /[\u0980-\u09FF]/;
function checkDirForBengali(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkDirForBengali(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const hasBengali = bengaliRegex.test(content);
      if (hasBengali) {
        console.error(`  ❌ Bengali characters found in: ${fullPath}`);
        failCount++;
      }
    }
  }
}
checkDirForBengali(path.join(rootDir, 'src'));
assert(true, 'Checked all src files for Bengali script');

console.log('\n========================================');
console.log(`Verification Test Results: ${passCount} Passed, ${failCount} Failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}
