/* Pricing comparison: "See more" under every test, filter chips, expand all. */
(function () {
  var table = document.getElementById('cmp');
  if (!table) return;
  var allBtn = document.getElementById('cmpAll');
  var rows = [].slice.call(table.querySelectorAll('.cmp-row'));

  function detailOf(row) { return row.nextElementSibling; }

  function setOpen(row, open) {
    var det = detailOf(row), btn = row.querySelector('.more'), dw = det.querySelector('.dw');
    det.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Show less' : 'See more';
    dw.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) dw.removeAttribute('inert'); else dw.setAttribute('inert', '');
  }

  function visibleRows() { return rows.filter(function (r) { return !r.hidden; }); }

  function syncAll() {
    var vis = visibleRows();
    var allOpen = vis.length > 0 && vis.every(function (r) { return detailOf(r).classList.contains('open'); });
    allBtn.textContent = allOpen ? 'Collapse all' : 'Expand all';
    allBtn.setAttribute('aria-pressed', allOpen ? 'true' : 'false');
  }

  table.addEventListener('click', function (e) {
    var btn = e.target.closest('.more');
    if (!btn) return;
    var row = btn.closest('.cmp-row');
    setOpen(row, !detailOf(row).classList.contains('open'));
    syncAll();
  });

  allBtn.addEventListener('click', function () {
    var vis = visibleRows();
    var open = !vis.every(function (r) { return detailOf(r).classList.contains('open'); });
    vis.forEach(function (r) { setOpen(r, open); });
    syncAll();
  });

  [].forEach.call(document.querySelectorAll('.cmp-filter .chip'), function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-f');
      [].forEach.call(document.querySelectorAll('.cmp-filter .chip'), function (c) {
        var on = c === chip;
        c.classList.toggle('on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      rows.forEach(function (r) {
        var tier = r.getAttribute('data-tier');
        var show = f === 'all' || (f === 'std' && tier === 'both') || (f === 'pre' && tier === 'p');
        r.hidden = !show;
        detailOf(r).hidden = !show;
      });
      [].forEach.call(table.querySelectorAll('.cmp-g'), function (g) {
        g.hidden = !g.querySelector('.cmp-row:not([hidden])');
      });
      syncAll();
    });
  });
})();
