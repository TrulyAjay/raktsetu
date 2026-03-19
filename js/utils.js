// ── RaktSetu Utilities ──

// ── Toast Notifications ──
export function showToast(message, type = "info", duration = 3500) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Format Date ──
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function timeAgo(timestamp) {
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// ── Validation ──
export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/[^\d]/g, "").slice(-10));
}
export function validatePincode(pin) {
  return /^\d{6}$/.test(pin);
}
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validateName(name) {
  return name.trim().length >= 2 && name.trim().length <= 60;
}

// ── Form Helpers ──
export function showError(inputId, msg) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + "-error");
  if (input) input.classList.add("error");
  if (errorEl) { errorEl.textContent = msg; errorEl.classList.add("show"); }
}
export function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + "-error");
  if (input) input.classList.remove("error");
  if (errorEl) errorEl.classList.remove("show");
}
export function setLoading(btn, loading, text = "Loading...") {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;margin-right:8px;"></span>${text}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

// ── Smart Donor Matching Score ──
export function calculateMatchScore(donor, request) {
  let score = 0;
  const reasons = [];

  // Blood group match (required)
  if (donor.blood_group !== request.blood_group_needed) return { score: 0, reasons: [] };

  // Base score
  score += 40;

  // Availability
  if (donor.available) { score += 20; reasons.push("Currently available"); }

  // Donation gap (90+ days = eligible)
  if (donor.last_donation_date) {
    const lastDonation = new Date(donor.last_donation_date);
    const daysSince = Math.floor((new Date() - lastDonation) / (1000 * 60 * 60 * 24));
    if (daysSince >= 90) {
      score += 20;
      reasons.push(`${daysSince} days since last donation`);
    } else {
      score -= 15;
      reasons.push(`Only ${daysSince} days since last donation`);
    }
  } else {
    score += 15;
    reasons.push("New donor");
  }

  // Total donations (experience)
  if (donor.total_donations >= 10) { score += 10; reasons.push("Experienced donor (10+ donations)"); }
  else if (donor.total_donations >= 5) { score += 6; reasons.push("Regular donor"); }
  else if (donor.total_donations >= 1) { score += 3; reasons.push("Has donated before"); }

  // Urgency boost
  if (request.urgency_level === "CRITICAL") {
    if (donor.available) { score += 10; reasons.push("Urgently needed"); }
  }

  // City match
  if (donor.city && request.hospital_address &&
    request.hospital_address.toLowerCase().includes(donor.city.toLowerCase())) {
    score += 10;
    reasons.push("Same city as hospital");
  }

  score = Math.min(100, Math.max(0, score));
  return { score, reasons };
}

export function getMatchLabel(score) {
  if (score >= 80) return { label: "Excellent Match", color: "#059669" };
  if (score >= 60) return { label: "Good Match", color: "#0284C7" };
  if (score >= 40) return { label: "Possible Match", color: "#D97706" };
  return { label: "Low Match", color: "#9CA3AF" };
}

// ── Request Status Constants ──
export const REQUEST_STATUS = {
  ACTIVE: 'ACTIVE',
  DONOR_RESPONDING: 'DONOR_RESPONDING',
  PENDING_SEEKER_CONFIRMATION: 'PENDING_SEEKER_CONFIRMATION',
  COMPLETED: 'COMPLETED',
  FULFILLED: 'FULFILLED',      // Blood bank fulfilled directly
  CANCELLED: 'CANCELLED'
};

export function getStatusBadgeClass(status) {
  const map = {
    ACTIVE: 'active',
    DONOR_RESPONDING: 'active',
    PENDING_SEEKER_CONFIRMATION: 'active',
    COMPLETED: 'fulfilled',
    FULFILLED: 'fulfilled',
    CANCELLED: 'cancelled'
  };
  return map[status] || 'active';
}

export function getStatusLabel(status) {
  const map = {
    ACTIVE: '🟡 Active',
    DONOR_RESPONDING: '🔵 Donor Responding',
    PENDING_SEEKER_CONFIRMATION: '🟠 Awaiting Your Confirmation',
    COMPLETED: '✅ Completed',
    FULFILLED: '✅ Fulfilled by Blood Bank',
    CANCELLED: '❌ Cancelled'
  };
  return map[status] || status;
}

// ── Generate IDs ──
export function generateRequestId() {
  return "RKT" + Date.now().toString().slice(-8);
}
export function generateDonationId() {
  return "DON" + Date.now().toString().slice(-8);
}

// ── Local Storage Helpers ──
export function saveToLocal(key, value) {
  try { localStorage.setItem("raktsetu_" + key, JSON.stringify(value)); } catch(e) {}
}
export function getFromLocal(key) {
  try { return JSON.parse(localStorage.getItem("raktsetu_" + key)); } catch(e) { return null; }
}

// ── Blood Group Colors ──
export const bloodGroupColors = {
  "A+": "#DC3545", "A-": "#E74C3C",
  "B+": "#E67E22", "B-": "#D35400",
  "O+": "#27AE60", "O-": "#1E8449",
  "AB+": "#8E44AD", "AB-": "#6C3483"
};

// ── Debounce ──
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Format Phone ──
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${cleaned.slice(0,5)} ${cleaned.slice(5)}`;
}

// ── Days Until Eligible ──
export function daysUntilEligible(lastDonationDate) {
  if (!lastDonationDate) return 0;
  const last = new Date(lastDonationDate);
  const eligible = new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
  const today = new Date();
  const diff = Math.ceil((eligible - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
