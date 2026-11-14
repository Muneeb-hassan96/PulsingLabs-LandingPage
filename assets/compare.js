/* Pricing comparison: a small chevron (or the test's name) opens what each test tells you.
   Owner 2026-11-15: no filter chips and no "Expand all". */
(function () {
  var table = document.getElementById('cmp');
  if (!table) return;

  function detailOf(row) { return row.nextElementSibling; }

  function setOpen(row, open) {
    var det = detailOf(row), btn = row.querySelector('.more'), dw = det.querySelector('.dw');
    det.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', (open ? 'Hide details: ' : 'What it tells you: ') + row.querySelector('.nm').textContent);
    dw.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) dw.removeAttribute('inert'); else dw.setAttribute('inert', '');
  }

  // The chevron is the real button (keyboard + screen readers); a tap anywhere on the
  // test's name cell does the same, so the small chevron is never a fiddly target.
  table.querySelectorAll('.cmp-row').forEach(function (row) {
    var btn = row.querySelector('.more');
    if (btn) btn.setAttribute('aria-label', 'What it tells you: ' + row.querySelector('.nm').textContent);
  });
  table.addEventListener('click', function (e) {
    var cell = e.target.closest('.cmp-row th');
    if (!cell) return;
    var row = cell.closest('.cmp-row');
    setOpen(row, !detailOf(row).classList.contains('open'));
  });
})();
