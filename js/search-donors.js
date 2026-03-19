// ── RaktSetu Search Donors Module ──
import { db } from './firebase-init.js';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { calculateMatchScore, getMatchLabel, daysUntilEligible } from './utils.js';

const PAGE_SIZE = 12;

/**
 * Search donors with filters
 * @param {Object} filters - { bloodGroup, city, available, page }
 * @param {Object} matchContext - { blood_group_needed, urgency_level, hospital_address }
 * @returns {Promise<{ donors: Array, hasMore: boolean }>}
 */
export async function searchDonors(filters = {}, matchContext = {}, lastDocument = null) {
  const { bloodGroup, city, available } = filters;

  try {
    let q = query(collection(db, 'donors'), orderBy('created_at', 'desc'), limit(PAGE_SIZE * 3));
    if (bloodGroup) q = query(collection(db, 'donors'), where('blood_group', '==', bloodGroup), orderBy('created_at', 'desc'), limit(PAGE_SIZE * 3));
    if (lastDocument) q = query(q, startAfter(lastDocument));

    const snap = await getDocs(q);
    let donors = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side filters
    if (city) donors = donors.filter(d => d.city?.toLowerCase().includes(city.toLowerCase()));
    if (available === true) donors = donors.filter(d => d.available === true);
    if (available === false) donors = donors.filter(d => d.available === false);

    // Score and sort
    donors = donors.map(d => ({
      ...d,
      _matchResult: calculateMatchScore(d, matchContext),
      _daysLeft: daysUntilEligible(d.last_donation_date)
    }));

    donors.sort((a, b) => {
      if (b.available !== a.available) return b.available ? 1 : -1;
      return (b._matchResult?.score || 0) - (a._matchResult?.score || 0);
    });

    return {
      donors: donors.slice(0, PAGE_SIZE),
      hasMore: donors.length > PAGE_SIZE,
      lastDoc: snap.docs[snap.docs.length - 1] || null
    };
  } catch (err) {
    console.error('Search donors error:', err);
    return { donors: [], hasMore: false, lastDoc: null };
  }
}

/**
 * Get best matched donors for a specific request
 * @param {Object} request - blood request object
 * @returns {Promise<Array>} - top matched donors
 */
export async function getBestMatchedDonors(request) {
  const { blood_group_needed, hospital_address, urgency_level } = request;
  const result = await searchDonors(
    { bloodGroup: blood_group_needed, available: true },
    { blood_group_needed, hospital_address, urgency_level }
  );
  return result.donors.slice(0, 5); // Top 5 matches
}

/**
 * Render a donor card HTML string
 * @param {Object} donor - donor data with _matchResult
 * @param {boolean} showMatchScore - whether to show match score
 * @returns {string} HTML
 */
export function renderDonorCard(donor, showMatchScore = false) {
  const matchResult = donor._matchResult || { score: 40, reasons: [] };
  const matchInfo = getMatchLabel(matchResult.score);
  const daysLeft = donor._daysLeft || 0;
  const eligible = daysLeft === 0;

  return `
    <div class="donor-card">
      <div class="donor-card-header">
        <div class="blood-badge" style="background:${donor.available && eligible ? 'linear-gradient(135deg,#DC3545,#FF6B6B)' : 'linear-gradient(135deg,#9CA3AF,#D1D5DB)'};">
          ${donor.blood_group}
        </div>
        <div style="flex:1;">
          <div class="donor-card-name">${donor.name}</div>
          <div class="donor-card-city"><i class="bi bi-geo-alt-fill" style="color:#DC3545;"></i> ${donor.city}, ${donor.state}</div>
        </div>
        ${showMatchScore ? `<div class="match-score" style="background:${matchInfo.color};font-size:0.72rem;">${matchResult.score}%</div>` : ''}
      </div>
      ${showMatchScore && matchResult.reasons.length > 0 ? `
        <div style="font-size:0.75rem;color:#636E72;">
          ${matchResult.reasons.slice(0,3).map(r => `<span style="background:#F3F4F6;padding:2px 8px;border-radius:10px;margin:2px;display:inline-block;">${r}</span>`).join('')}
        </div>` : ''}
      <div class="donor-card-stats">
        <div class="donor-stat"><div class="donor-stat-value">${donor.total_donations || 0}</div><div class="donor-stat-label">Donations</div></div>
        <div class="donor-stat">
          <div class="donor-stat-value" style="color:${eligible ? '#00B894' : '#9CA3AF'};">${eligible ? '✅' : daysLeft + 'd'}</div>
          <div class="donor-stat-label">${eligible ? 'Ready' : 'Days left'}</div>
        </div>
      </div>
      <div class="eligibility-bar">
        <div class="eligibility-fill" style="width:${matchResult.score}%;background:${matchInfo.color};"></div>
      </div>
      ${donor.available && eligible
        ? `<a href="tel:${donor.phone}" class="btn-primary-red w-100" style="justify-content:center;"><i class="bi bi-telephone-fill"></i> Call Donor</a>`
        : `<button class="btn-outline-red w-100" disabled style="opacity:0.5;justify-content:center;">Not Available</button>`
      }
    </div>`;
}
