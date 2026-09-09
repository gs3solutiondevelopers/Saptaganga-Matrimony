import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import QuickSearchCard from '../components/home/QuickSearchCard';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedProfiles from '../components/home/FeaturedProfiles';
import WhyChooseUs from '../components/home/WhyChooseUs';
import MembershipPlans from '../components/home/MembershipPlans';

export default function HomePage({
  profiles,
  activeCategory,
  onCategoryChange,
  onSelectProfile,
  onSendInterest,
  onToggleShortlist,
  shortlistedIds,
  onQuickSearch,
  onOpenAuth,
  onSelectPlan
}) {
  return (
    <div className="home-page">
      {/* Saptaganga Panoramic Hero Banner */}
      <HeroBanner onStartJourney={() => onOpenAuth('register')} />

      {/* Quick Match Finder */}
      <QuickSearchCard 
        onSearch={onQuickSearch}
        onRegisterClick={() => onOpenAuth('register')}
      />

      {/* How It Works - 3 Steps */}
      <HowItWorks onGetStarted={() => onOpenAuth('register')} />

      {/* Featured Profiles Section */}
      <FeaturedProfiles 
        profiles={profiles}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        onSelectProfile={onSelectProfile}
        onSendInterest={onSendInterest}
        onToggleShortlist={onToggleShortlist}
        shortlistedIds={shortlistedIds}
      />

      {/* Why Choose Saptaganga & Success Stories */}
      <WhyChooseUs onRegisterClick={() => onOpenAuth('register')} />

      {/* Transparent Membership Packages */}
      <MembershipPlans onSelectPlan={onSelectPlan} />
    </div>
  );
}
