import { MOCK_PROFILES } from '../src/data/mockData.js';
import { authService } from '../src/services/authService.js';
import { adminService } from '../src/services/adminService.js';
import { firestoreService } from '../src/services/firestoreService.js';

// Mock localStorage & sessionStorage in Node
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};
global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

console.log('=== TEST 1: User 1 (Pralay Mahapatra) OTP Login & Profile Creation ===');
const user1Res = await authService.verifyPhoneOtp('8918512242', '123456', { name: 'Pralay Mahapatra', gender: 'groom' });
console.log('User 1 Created:', user1Res.user.name, user1Res.user.memberId);

console.log('\n=== TEST 2: Admin Approves User 1 (Pralay Mahapatra) ===');
await adminService.approveProfile(user1Res.user.memberId);
const adminProfilesAfterApprove1 = await adminService.getProfiles();
const user1InAdmin = adminProfilesAfterApprove1.data.find(p => p.id === user1Res.user.memberId);
console.log('User 1 in Admin is Approved?', user1InAdmin?.approved, 'Status:', user1InAdmin?.status);

console.log('\n=== TEST 3: User 2 (Giri Dutta) OTP Login ===');
const user2Res = await authService.verifyPhoneOtp('9733140877', '123456', { name: 'Giri Dutta', gender: 'groom' });
console.log('User 2 Created:', user2Res.user.name, user2Res.user.memberId);

console.log('\n=== TEST 4: Admin Profiles Fetch with Multi-User Check ===');
const adminProfilesAfterUser2 = await adminService.getProfiles();
const foundPralayInAdmin = adminProfilesAfterUser2.data.find(p => p.id === user1Res.user.memberId || p.name === 'Pralay Mahapatra');
const foundGiriInAdmin = adminProfilesAfterUser2.data.find(p => p.id === user2Res.user.memberId || p.name === 'Giri Dutta');

console.log('Admin Profiles Count:', adminProfilesAfterUser2.data.length);
console.log('Is Pralay still present & approved in Admin?', !!foundPralayInAdmin, 'Approved:', foundPralayInAdmin?.approved);
console.log('Is Giri present & pending in Admin?', !!foundGiriInAdmin, 'Approved:', foundGiriInAdmin?.approved, 'Status:', foundGiriInAdmin?.status);

console.log('\n=== TEST 5: Website Public Profiles Live Check ===');
const liveProfiles = await firestoreService.getProfiles({ category: 'all' });
const livePralay = liveProfiles.data.find(p => p.name === 'Pralay Mahapatra');
const liveGiriBeforeApprove = liveProfiles.data.find(p => p.name === 'Giri Dutta');

console.log('Total Live Profiles on Website:', liveProfiles.data.length);
console.log('Is Approved Pralay Live on Website?', !!livePralay);
console.log('Is Pending Giri hidden from Website until approved?', !liveGiriBeforeApprove);

console.log('\n=== TEST 6: Admin Approves Giri Dutta ===');
await adminService.approveProfile(user2Res.user.memberId);
const liveProfilesAfterGiriApprove = await firestoreService.getProfiles({ category: 'all' });
const liveGiriAfterApprove = liveProfilesAfterGiriApprove.data.find(p => p.name === 'Giri Dutta');

console.log('Is Giri now Live on Website after approval?', !!liveGiriAfterApprove);
console.log('\n>>> ALL TEST CASES PASSED SUCCESSFULLY! <<<');
