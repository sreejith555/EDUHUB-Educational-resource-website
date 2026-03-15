// scholarships.js — EduHub Scholarships Page

document.addEventListener('DOMContentLoaded', () => {
  // Populate category filter dropdown
  fetch('/api/categories')
    .then(r => r.json())
    .then(cats => {
      const sel = document.getElementById('categoryFilter');
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value       = c;
        opt.textContent = c;
        sel.appendChild(opt);
      });
    })
    .catch(() => {});

  // Initial load
  loadData();
});

async function loadData() {
  const q   = (document.getElementById('searchInput').value    || '').trim();
  const cat = (document.getElementById('categoryFilter').value || '').trim();
  const grid = document.getElementById('cardsGrid');

  grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Loading scholarships…</p></div>';

  const params = new URLSearchParams();
  if (q)   params.set('q',        q);
  if (cat) params.set('category', cat);

  try {
    const res          = await fetch(`/api/scholarships?${params}`);
    const scholarships = await res.json();

    if (!scholarships.length) {
      renderEmpty('cardsGrid');
      return;
    }

    grid.innerHTML = '';
    scholarships.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${i * 0.05}s`;

      const deadlinePast = isPast(s.deadline_date);

      card.innerHTML = `
        <div class="card-badges">
          ${categoryBadge(s.category)}
          ${fieldBadge(s.field)}
          ${deadlinePast
            ? '<span class="badge badge-past">Deadline Passed</span>'
            : '<span class="badge badge-upcoming">Open</span>'}
        </div>
        <div class="card-title">${s.name}</div>
        <div class="card-host">🏛 ${s.host}</div>
        <div class="card-meta">
          <span>🗓 Deadline: ${formatDate(s.deadline_date)}</span>
        </div>
        <div class="card-desc">${s.description || ''}</div>
        <div class="card-eligibility">${s.eligibility ? '✅ ' + s.eligibility : ''}</div>
        <div class="card-footer">
          <span class="card-amount">${formatAmount(s.amount)}</span>
          <a href="${s.link}" target="_blank" rel="noopener" class="card-link">Apply →</a>
        </div>`;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to load scholarships. Check server connection.</p></div>';
  }
}

function clearFilters() {
  document.getElementById('searchInput').value    = '';
  document.getElementById('categoryFilter').value = '';
  loadData();
}
