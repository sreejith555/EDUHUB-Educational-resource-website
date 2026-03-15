// main.js — EduHub Shared Utilities

document.addEventListener('DOMContentLoaded', () => {
  // Show username from sessionStorage
  const username = sessionStorage.getItem('eduhub_user') || 'User';
  const el = document.getElementById('headerUsername');
  if (el) el.textContent = username;
});

/**
 * Highlight the active page link in both header nav and sidebar.
 * @param {string} page - e.g. 'home', 'courses', 'exams', ...
 */
function setActivePage(page) {
  // Header nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  // Sidebar
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

/**
 * Return a coloured badge HTML string for a given field.
 * @param {string} field
 * @returns {string} HTML
 */
function fieldBadge(field) {
  if (!field) return '';
  const map = {
    'Engineering': 'badge-engineering',
    'Medical':     'badge-medical',
    'Management':  'badge-management',
    'Science':     'badge-science',
    'Arts':        'badge-arts',
  };
  const cls = map[field] || 'badge-default';
  return `<span class="badge ${cls}">${field}</span>`;
}

/**
 * Format a fee in Indian Rupee style (e.g. ₹1,200 or "Free").
 * @param {number|null} fee
 * @returns {string}
 */
function formatFee(fee) {
  if (fee === null || fee === undefined) return '—';
  const n = parseFloat(fee);
  if (n === 0) return 'Free';
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Format a scholarship amount nicely.
 * @param {number} amount
 * @returns {string}
 */
function formatAmount(amount) {
  if (!amount) return '—';
  const n = parseFloat(amount);
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L/yr`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K/yr`;
  return `₹${n.toLocaleString('en-IN')}/yr`;
}

/**
 * Format a date string (YYYY-MM-DD) to human-readable.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Determine if a date is in the past.
 * @param {string} dateStr
 * @returns {boolean}
 */
function isPast(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/**
 * Return a category badge HTML string.
 * @param {string} cat
 * @returns {string}
 */
function categoryBadge(cat) {
  if (!cat) return '';
  const map = {
    'Merit-based': 'badge-merit',
    'Need-based':  'badge-need',
    'SC/ST':       'badge-scst',
    'Women':       'badge-women',
    'Minority':    'badge-minority',
  };
  const cls = map[cat] || 'badge-default';
  return `<span class="badge ${cls}">${cat}</span>`;
}

/**
 * Render an empty state message into a grid container.
 * @param {string} gridId
 * @param {string} msg
 */
function renderEmpty(gridId, msg = 'No results found. Try a different search.') {
  document.getElementById(gridId).innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>${msg}</p>
    </div>`;
}
