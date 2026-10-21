// Further Pure Mathematics 4PM1 question bank filters. Pure client-side filtering of rows already in the page.
(() => {
  'use strict';
  const table = document.querySelector('[data-bank-table]');
  if (!table) return;
  const rows = [...table.querySelectorAll('tbody tr')];
  const controls = [...document.querySelectorAll('[data-bank-filter]')];
  const text = document.querySelector('[data-bank-text]');
  const status = document.querySelector('[data-bank-status]');
  function apply() {
    const wanted = Object.fromEntries(controls.map(c => [c.dataset.bankFilter, c.value]));
    const terms = (text ? text.value : '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const row of rows) {
      const ok = Object.entries(wanted).every(([key, value]) => !value || row.dataset[key] === value)
        && terms.every(t => row.dataset.search.includes(t));
      row.hidden = !ok;
      if (ok) shown++;
    }
    if (status) status.textContent = `${shown} of ${rows.length} question parts shown`;
  }
  for (const c of controls) c.addEventListener('change', apply);
  if (text) text.addEventListener('input', apply);
  apply();
})();

// Physics' bottom-left "Formulas & key facts" button on every page except the page itself.
(function () {
  if (document.querySelector('.kf-dock') || /\/key-facts\.html$/.test(location.pathname)) return;
  var a = document.createElement('a');
  a.className = 'kf-dock'; a.href = '/igcsefurthermaths/key-facts.html'; a.textContent = 'Formulas & key facts';
  a.style.cssText = 'position:fixed;left:28px;bottom:25px;z-index:850;display:flex;align-items:center;border-radius:50px;background:#3B465A;color:#fff;padding:13px 21px;box-shadow:0 5px 24px #172b4d33;font:500 13px/1.2 Poppins,system-ui,sans-serif;text-decoration:none';
  if (innerWidth < 600) a.style.cssText += ';left:16px;bottom:16px;padding:12px 15px';
  var st = document.createElement('style');
  st.textContent = '@media print{.kf-dock{display:none!important}}.kf-dock:hover{background:#e4464f!important}.kf-dock:focus-visible{outline:3px solid #e4464f;outline-offset:3px}';
  document.head.appendChild(st); document.body.appendChild(a);
})();
