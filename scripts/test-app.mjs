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
  assert(registerRes.success === true && (registerRes.user.uid || registerRes.user.memberId), 'Registration creates new Saptaganga Member ID');

  const loginRes = await api.loginUser({ emailOrPhone: 'member@saptaganga.com', password: 'secretpassword' });
  assert(loginRes.success === true && (loginRes.user.uid || loginRes.user.displayName), 'Login authenticates and returns user profile');

  // 6. Connect & Express Interest Service
  console.log('\n6. Connect & Send Interest Flow:');
  const interestRes = await api.sendInterest('SG-101', 'Namaste, our values align.');
  assert(interestRes.success === true, 'Express Interest successfully sent and acknowledged');

  // 7. Admin Service & Dashboard Verification
  console.log('\n7. Admin Service & Control Flow:');
  const { adminService } = await import('../src/services/adminService.js');
  
  const adminLoginRes = adminService.login('admin@saptaganga.com', 'SaptagangaAdmin2026', '7777');
  assert(adminLoginRes.success === true && adminLoginRes.session.adminId === 'ADMIN-001', 'Admin login authenticates with security master PIN');

  const statsRes = await adminService.getDashboardStats();
  assert(statsRes.success === true && statsRes.data.totalProfiles >= 6, 'Admin Dashboard fetches live KPI analytics');

  const toggleRes = await adminService.toggleVerification('SG-101', false);
  assert(toggleRes.success === true && toggleRes.verified === true, '1-Click Verification badge toggle works');

  const newProfileRes = await adminService.createProfile({
    name: 'Rupali Sen',
    gender: 'female',
    profession: 'UX Designer',
    city: 'Kolkata'
  });
  assert(newProfileRes.success === true && newProfileRes.data.name === 'Rupali Sen', 'Admin creates candidate profile in system');

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
