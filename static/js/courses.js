document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/fields/courses')
    .then(r => r.json())
    .then(fields => {
      const sel = document.getElementById('fieldFilter');
      fields.forEach(f => {
        const opt = document.createElement('option');
        opt.value       = f;
        opt.textContent = f;
        sel.appendChild(opt);
      });
    })
    .catch(() => {});

  loadData();
});

async function loadData() {
  const q     = (document.getElementById('searchInput').value  || '').trim();
  const field = (document.getElementById('fieldFilter').value  || '').trim();
  const grid  = document.getElementById('cardsGrid');

  grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Loading courses…</p></div>';

  const params = new URLSearchParams();
  if (q)     params.set('q',     q);
  if (field) params.set('field', field);

  try {
    const res     = await fetch(`/api/courses?${params}`);
    const courses = await res.json();

    if (!courses.length) {
      renderEmpty('cardsGrid');
      return;
    }

    grid.innerHTML = '';
    courses.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${i * 0.05}s`;

      const deadlinePast = isPast(c.last_date);
      const feeStr       = formatFee(c.fees);

      card.innerHTML = `
        <div class="card-badges">
          ${fieldBadge(c.field)}
          <span class="badge badge-default">${c.type || 'Course'}</span>
          ${deadlinePast ? '<span class="badge badge-past">Closed</span>' : '<span class="badge badge-upcoming">Open</span>'}
        </div>
        <div class="card-title">${c.name}</div>
        <div class="card-host">🏛 ${c.host}</div>
        <div class="card-meta">
          <span>🗓 Deadline: ${formatDate(c.last_date)}</span>
        </div>
        <div class="card-desc">${c.description || ''}</div>
        <div class="card-eligibility">${c.eligibility ? '✅ ' + c.eligibility : ''}</div>
        <div class="card-footer">
          <span class="card-fee">${feeStr === 'Free' ? '<span class="card-fee-free">Free</span>' : feeStr + ' / yr'}</span>
          <a href="${c.link}" target="_blank" rel="noopener" class="card-link">Visit →</a>
        </div>`;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to load courses. Check server connection.</p></div>';
  }
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('fieldFilter').value = '';
  loadData();
}
