
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/fields/exams')
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
  const q     = (document.getElementById('searchInput').value || '').trim();
  const field = (document.getElementById('fieldFilter').value || '').trim();
  const grid  = document.getElementById('cardsGrid');

  grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Loading exams…</p></div>';

  const params = new URLSearchParams();
  if (q)     params.set('q',     q);
  if (field) params.set('field', field);

  try {
    const res   = await fetch(`/api/exams?${params}`);
    const exams = await res.json();

    if (!exams.length) {
      renderEmpty('cardsGrid');
      return;
    }

    grid.innerHTML = '';
    exams.forEach((e, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${i * 0.05}s`;

      const past   = isPast(e.exam_date);
      const feeStr = e.fee === 0 || e.fee === null ? 'Free' : formatFee(e.fee);

      card.innerHTML = `
        <div class="card-badges">
          ${fieldBadge(e.field)}
          <span class="badge badge-default">${e.type || 'Exam'}</span>
          ${past
            ? '<span class="badge badge-past">Past</span>'
            : '<span class="badge badge-upcoming">Upcoming</span>'}
        </div>
        <div class="card-title">${e.name}</div>
        <div class="card-host">🏛 ${e.host}</div>
        <div class="card-meta">
          <span>📅 Exam Date: ${formatDate(e.exam_date)}</span>
        </div>
        <div class="card-desc">${e.description || ''}</div>
        <div class="card-eligibility">${e.eligibility ? '✅ ' + e.eligibility : ''}</div>
        <div class="card-footer">
          ${feeStr === 'Free'
            ? '<span class="card-fee-free">Free</span>'
            : `<span class="card-fee">Fee: ${feeStr}</span>`}
          <a href="${e.link}" target="_blank" rel="noopener" class="card-link">Official Site →</a>
        </div>`;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to load exams. Check server connection.</p></div>';
  }
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('fieldFilter').value = '';
  loadData();
}
