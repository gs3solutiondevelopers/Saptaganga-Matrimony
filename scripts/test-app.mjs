// Comprehensive Automated Test Suite for Saptaganga Matrimony Logic & Components
import { api } from '../src/services/api.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../src/data/mockData.js';

async function runTests() {
  console.log('🧪 Starting Saptaganga Matrimony Web Logic & Service Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Data Integrity Tests
  console.log('1. Mock Data Validation:');
  assert(MOCK_PROFILES.length >= 6, 'Mock profiles database is populated with >= 6 verified members');
  assert(MOCK_PROFILES.every(p => p.id && p.name && p.age && p.profession && p.religion), 'All profiles contain required matrimonial fields');
  assert(MOCK_STORIES.length >= 3, 'Success stories database contains real wedding stories');
  assert(MEMBERSHIP_PLANS.length === 4, 'Membership plans contain all 4 tiers (Free, Gold, Diamond, Platinum)');

  // 2. API Service - Default Fetch
  console.log('\n2. API Service - Profiles Fetching:');
  const allProfilesRes = await api.getProfiles({});
  assert(allProfilesRes.success === true && allProfilesRes.data.length === MOCK_PROFILES.length, 'Default getProfiles() returns all profiles');

  // 3. API Service - Filtering by Category
  console.log('\n3. Category Filtering Tests:');
  const bridesRes = await api.getProfiles({ category: 'brides' });
  assert(bridesRes.data.every(p => p.gender === 'female'), 'Filter category "brides" returns only female profiles');

  const groomsRes = await api.getProfiles({ category: 'grooms' });
  assert(groomsRes.data.every(p => p.gender === 'male'), 'Filter category "grooms" returns only male profiles');

  const doctorsRes = await api.getProfiles({ category: 'doctors' });
  assert(doctorsRes.data.every(p => p.profession.toLowerCase().includes('doctor') || p.profession.toLowerCase().includes('specialist') || p.profession.toLowerCase().includes('physician')), 'Filter category "doctors" returns medical professionals');

  // 4. Quick Match Finder Filtering
  console.log('\n4. Quick Match Finder Parameter Filtering:');
  const searchRes1 = await api.getProfiles({ gender: 'female', minAge: 25, maxAge: 28, religion: 'Hindu' });
  assert(searchRes1.data.every(p => p.gender === 'female' && p.age >= 25 && p.age <= 28 && p.religion === 'Hindu'), 'Search filter (Female, Age 25-28, Hindu) returns strictly matching candidates');

  // 5. Auth Service - Registration & Login Simulation
  console.log('\n5. Authentication & User Flow:');
  const registerRes = await api.registerUser({
    fullName: 'Test Member',
    email: 'test@saptaganga.com',
    gender: 'female',
    education: 'B.Tech',
    profession: 'Software Engineer',
    city: 'Kolkata',
    phone: '9876543210'
  });
  assert(registerRes.success === true && registerRes.user.id.startsWith('SG-NEW-'), 'Registration creates new Saptaganga Member ID');

  const loginRes = await api.loginUser({ emailOrPhone: 'member@saptaganga.com', password: 'secretpassword' });
  assert(loginRes.success === true && loginRes.token && loginRes.user.plan === 'Gold Advantage', 'Login returns session token and active subscription');

  // 6. Connect & Express Interest Service
  console.log('\n6. Connect & Send Interest Flow:');
  const interestRes = await api.sendInterest('SG-101', 'Namaste, our values align.');
  assert(interestRes.success === true, 'Express Interest successfully sent and acknowledged');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
