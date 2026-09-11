import React, { useState } from 'react';
import { HeartHandshake, Search, ArrowRight, Filter } from 'lucide-react';

export default function QuickSearchCard({ onSearch, onRegisterClick, onOpenCreateProfile, currentUser }) {
  const [lookingFor, setLookingFor] = useState('female');
  const [ageRange, setAgeRange] = useState('22-32');
  const [religion, setReligion] = useState('any');
  const [motherTongue, setMotherTongue] = useState('any');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser?.profileCompleted) {
      if (onOpenCreateProfile) {
        onOpenCreateProfile();
      } else if (onRegisterClick) {
        onRegisterClick();
      }
      return;
    }

    const [minAge, maxAge] = ageRange.split('-').map(Number);
    onSearch({
      gender: lookingFor,
      minAge: minAge || 20,
      maxAge: maxAge || 45,
      religion: religion === 'any' ? null : religion,
      motherTongue: motherTongue === 'any' ? null : motherTongue
    });
  };

  return (
    <section className="quick-search-section" id="search">
      <div className="container">
        <div className="quick-search-card">
          
          <div className="quick-search-header">
            <div className="quick-search-title">
              <div className="quick-search-icon-badge">
                <HeartHandshake size={19} />
              </div>
              <span>Find Your Match</span>
            </div>
            
            <div className="quick-search-tabs">
              <button 
                type="button"
                className={`search-tab-btn ${lookingFor === 'female' ? 'active' : ''}`}
                onClick={() => setLookingFor('female')}
              >
                Bride
              </button>
              <button 
                type="button"
                className={`search-tab-btn ${lookingFor === 'male' ? 'active' : ''}`}
                onClick={() => setLookingFor('male')}
              >
                Groom
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="quick-search-form">
            
            {/* Field 1: Looking for */}
            <div className="search-field-group">
              <label className="search-field-label">I'm looking for a</label>
              <select 
                className="search-select"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
              >
                <option value="female">Bride (Female)</option>
                <option value="male">Groom (Male)</option>
              </select>
            </div>

            {/* Field 2: Age Range */}
            <div className="search-field-group">
              <label className="search-field-label">Aged</label>
              <select 
                className="search-select"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              >
                <option value="20-25">20 - 25 yrs</option>
                <option value="22-32">22 - 32 yrs</option>
                <option value="25-35">25 - 35 yrs</option>
                <option value="30-40">30 - 40 yrs</option>
                <option value="35-50">35 - 50 yrs</option>
              </select>
            </div>

            {/* Field 3: Religion */}
            <div className="search-field-group">
              <label className="search-field-label">Religion</label>
              <select 
                className="search-select"
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
              >
                <option value="any">Any Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
              </select>
            </div>

            {/* Field 4: Mother Tongue */}
            <div className="search-field-group">
              <label className="search-field-label">Mother Tongue</label>
              <select 
                className="search-select"
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value)}
              >
                <option value="any">Any Language</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="search-field-group">
              <label className="search-field-label" style={{ opacity: 0 }}>Action</label>
              <button type="submit" className="search-submit-btn">
                <span>Search Matches</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}
