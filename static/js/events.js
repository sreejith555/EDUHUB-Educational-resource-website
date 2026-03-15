
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

async function loadData() {
  const q    = (document.getElementById('searchInput').value || '').trim();
  const grid = document.getElementById('cardsGrid');

  grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Loading events…</p></div>';

  const params = new URLSearchParams();
  if (q) params.set('q', q);

  try {
    const res    = await fetch(`/api/events?${params}`);
    const events = await res.json();

    if (!events.length) {
      renderEmpty('cardsGrid');
      return;
    }

    grid.innerHTML = '';
    events.forEach((ev, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${i * 0.05}s`;

      const past    = isPast(ev.date);
      const fee     = parseFloat(ev.fee);
      const feeStr  = (fee === 0 || ev.fee === null) ? 'Free' : formatFee(fee);

      card.innerHTML = `
        <div class="card-badges">
          ${fee === 0
            ? '<span class="badge badge-free">Free Entry</span>'
            : `<span class="badge badge-paid">Entry: ${feeStr}</span>`}
          ${past
            ? '<span class="badge badge-past">Past</span>'
            : '<span class="badge badge-upcoming">Upcoming</span>'}
        </div>
        <div class="card-title">${ev.name}</div>
        <div class="card-host">🏛 ${ev.host}</div>
        <div class="card-meta">
          <span>📍 ${ev.venue || 'Venue TBA'}</span>
          <span>📅 ${formatDate(ev.date)}</span>
        </div>
        <div class="card-desc">${ev.description || ''}</div>
        <div class="card-eligibility">${ev.eligibility ? '✅ ' + ev.eligibility : ''}</div>
        <div class="card-footer">
          <span class="${fee === 0 ? 'card-fee-free' : 'card-fee'}">${feeStr}</span>
          <a href="${ev.link}" target="_blank" rel="noopener" class="card-link">Register →</a>
        </div>`;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Failed to load events. Check server connection.</p></div>';
  }
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  loadData();
}
