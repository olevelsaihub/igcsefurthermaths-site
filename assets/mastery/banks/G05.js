/* Group G05 mastery bank: Graphs: tables of values, sketching, rational curves, and solving equations from graphs. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function ab(n) { return Math.abs(n); }
  // "ax + b" with clean signs
  function lin(a, b, v) {
    v = v || 'x'; var s = '';
    if (a !== 0) s = (a === 1 ? '' : a === -1 ? '-' : String(a)) + v;
    if (b !== 0) s += s ? (b < 0 ? ' - ' : ' + ') + ab(b) : String(b);
    return s || '0';
  }
  // constant first: "c + mx" or "c - mx"
  function linRev(c, m, v) {
    v = v || 'x'; var s = String(c);
    if (m !== 0) s += (m < 0 ? ' - ' : ' + ') + (ab(m) === 1 ? '' : ab(m)) + v;
    return s;
  }
  // reduced fraction as TeX
  function fr(n, d) {
    var g = gcd(n, d); n = n / g; d = d / g; if (d < 0) { n = -n; d = -d; }
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + ab(n) + '}{' + d + '}';
  }
  function dec(x, dp) { return String(R.roundDp(x, dp)); }
  function pw(b, n) { return n === 1 ? String(b) : b + '^{' + n + '}'; }
  function cf(n) { return n === 1 ? '' : n === -1 ? '-' : String(n); }
  function nz(lo, hi) { var v = 0; while (v === 0) v = rint(lo, hi); return v; }
  function safe(v, dp) { var s = v * Math.pow(10, dp); var f = Math.abs(s - Math.floor(s)); return Math.abs(f - 0.5) > 0.04 && Math.abs(v) < 1000; }
  // polynomial in x from coefficients [c3, c2, c1, c0]
  function poly(cs) {
    var s = '', pw = [3, 2, 1, 0];
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i], p = pw[i + (4 - cs.length)]; if (c === 0) continue;
      var t = (p === 0) ? String(ab(c)) : ((ab(c) === 1 ? '' : String(ab(c))) + 'x' + (p > 1 ? '^{' + p + '}' : ''));
      s += s ? (c < 0 ? ' - ' : ' + ') + t : (c < 0 ? '-' : '') + t;
    }
    return s || '0';
  }
  // MCQ with the correct option first, distractors deduplicated
  function Q(skill, q, correct, distract, why) {
    var opts = [correct], seen = {}; seen[correct] = 1;
    distract.forEach(function (d) { if (!seen[d] && opts.length < 4) { seen[d] = 1; opts.push(d); } });
    return { skill: skill, kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function M(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function N(skill, q, answer, tol, display, why) { return { skill: skill, kind: 'num', q: q, answer: answer, tol: tol, display: display, why: why }; }
  function T(s) { return '$' + s + '$'; }

  // A rational curve y = (ax+b)/(cx+d); opts.decd makes d a divisor of a power of 10 so b/d is terminating,
  // opts.deca does the same for a, opts.intv makes -d/c an integer, opts.inta makes a/c an integer.
  function mkRat(opts) {
    opts = opts || {};
    for (var tries = 0; tries < 500; tries++) {
      var c = opts.inta || opts.intv ? rint(1, 3) : rint(1, 4);
      var a = opts.inta ? c * nz(-4, 4) : (opts.deca ? pick([1, 2, 4, 5, -1, -2, -4, -5]) : nz(-5, 5));
      var d = opts.intv ? c * nz(-4, 4) : (opts.decd ? pick([1, 2, 4, 5, -1, -2, -4, -5]) : nz(-6, 6));
      var b = nz(-8, 8);
      if (opts.b0) b = 0;
      if (a * d - b * c === 0) continue;
      if (a === c && b === d) continue;
      var numTex = (a < 0 && b > 0 && Math.random() < 0.5) ? linRev(b, a) : lin(a, b);
      var denTex = (c > 0 && d < 0 && Math.random() < 0.0) ? linRev(d, c) : lin(c, d);
      return { a: a, b: b, c: c, d: d, numTex: numTex, denTex: denTex,
        tex: '\\frac{' + numTex + '}{' + denTex + '}' };
    }
    throw new Error('mkRat failed');
  }
  function coord(x, y) { return '\\left(' + x + ', ' + y + '\\right)'; }

  // =====================================================================
  // FPM-GRA-01 Filling in a table of values
  // =====================================================================
  B['FPM-GRA-01'] = { title: 'Filling in a table of values', items: [
    { skill: 'sub-poly', gen: function () {
      var a, b, x, v, k = 0;
      do { a = rint(2, 6); b = nz(-5, 5); x = nz(-6, 6) / 2; v = x * x * x - a * x + b; k++; } while (!safe(v, 2) && k < 200);
      var r = R.roundDp(v, 2);
      return N('sub-poly', 'Complete the table of values for $y = x^3 - ' + a + 'x ' + (b < 0 ? '- ' : '+ ') + ab(b) + '$. Find $y$ when $x = ' + x + '$, giving your answer to 2 decimal places.',
        r, 0.005, T(dec(v, 2)),
        'Substitute $x = ' + x + '$ with brackets: $(' + x + ')^3 - ' + a + '(' + x + ') ' + (b < 0 ? '- ' : '+ ') + ab(b) + ' = ' + v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + '$, which is $' + dec(v, 2) + '$ to 2 d.p.');
    } },
    { skill: 'sub-poly', gen: function () {
      var A, Bc, C, x, v, k = 0;
      do { A = rint(1, 3); Bc = nz(-4, 4); C = nz(-4, 4); x = nz(-8, 8) / 2; v = A * x + Bc / (x * x) + C; k++; } while (!safe(v, 2) && k < 300);
      var cur = lin(A, 0) + (Bc < 0 ? ' - ' : ' + ') + '\\frac{' + ab(Bc) + '}{x^2}' + (C < 0 ? ' - ' : ' + ') + ab(C);
      return N('sub-poly', 'A table of values is needed for $y = ' + cur + '$. Find $y$ when $x = ' + x + '$, to 2 decimal places.',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'Put $x = ' + x + '$ in: $' + (A === 1 ? '(' + x + ')' : A + '(' + x + ')') + ' ' + (Bc < 0 ? '- ' : '+ ') + ab(Bc) + ' \\div (' + x + ')^2 ' + (C < 0 ? '- ' : '+ ') + ab(C) + ' = ' + dec(v, 2) + '$. Square $x$ (using brackets if it is negative) before dividing.');
    } },
    { skill: 'sub-exp', gen: function () {
      var base = pick([2, 3, 5]), x, k = 0, c = nz(-3, 3), m = rint(1, 3), v;
      do { x = nz(-6, 6) / 2; v = Math.pow(base, x) + m * x + c; k++; } while (!safe(v, 2) && k < 300);
      return N('sub-exp', 'Complete a table of values for $y = ' + base + '^x ' + (m === 1 ? '+ x' : '+ ' + m + 'x') + ' ' + (c < 0 ? '- ' : '+ ') + ab(c) + '$. Find $y$ when $x = ' + x + '$, to 2 decimal places.',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'Work out $' + pw(base, x) + ' = ' + dec(Math.pow(base, x), 4) + '$, then add $' + (m * x) + '$ (that is $' + (m === 1 ? '' : m) + 'x$) and ' + (c < 0 ? 'subtract ' : 'add ') + ab(c) + ' to get $' + dec(v, 2) + '$.');
    } },
    { skill: 'sub-exp', gen: function () {
      var x, k = 0, a = rint(2, 4), v;
      do { x = nz(-5, 5) / 2; v = a * Math.exp(x) - x; k++; } while (!safe(v, 2) && k < 300);
      return N('sub-exp', 'Find the value of $y = ' + a + 'e^x - x$ when $x = ' + x + '$, giving your answer to 2 decimal places.',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'With $x = ' + x + '$: $' + pw('e', x) + ' = ' + dec(Math.exp(x), 4) + '$, so $y = ' + a + '\\times ' + dec(Math.exp(x), 4) + ' - (' + x + ') = ' + dec(v, 2) + '$.');
    } },
    { skill: 'sub-log', gen: function () {
      var b = pick([2, 3, 5]), k, x, v, tries = 0, arg;
      do { k = nz(-3, 5); x = rint(-2, 9); arg = x + k; v = Math.log(arg) / Math.log(b); tries++; } while ((arg <= 0 || !safe(v, 2)) && tries < 400);
      return N('sub-log', 'Find $y = \\log_{' + b + '}(x ' + (k < 0 ? '- ' : '+ ') + ab(k) + ')$ when $x = ' + x + '$, giving your answer to 2 decimal places.',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'Change base: $\\log_{' + b + '} ' + arg + ' = \\dfrac{\\ln ' + arg + '}{\\ln ' + b + '} = ' + dec(v, 2) + '$.');
    } },
    { skill: 'exact-log', gen: function () {
      var b = pick([2, 3, 4, 5]), n = rint(-2, 3), x = Math.pow(b, n), k = rint(1, 4);
      var xs = n >= 0 ? String(x) : '\\frac{1}{' + Math.pow(b, -n) + '}';
      return N('exact-log', 'In a table for $y = \\log_{' + b + '} x + ' + k + '$, the entry at $x = ' + xs + '$ is an exact value, not a rounded one. Write down that value of $y$.',
        n + k, 1e-9, T(String(n + k)),
        '$\\log_{' + b + '}' + (n >= 0 ? x : '\\frac{1}{' + Math.pow(b, -n) + '}') + ' = ' + n + '$ because ' + b + ' to the power ' + n + ' gives that number. Then $y = ' + n + ' + ' + k + ' = ' + (n + k) + '$ exactly.');
    } },
    { skill: 'sub-trig', gen: function () {
      var A = rint(2, 4), Bc = nz(-3, 3), x, v, k = 0;
      do { x = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]); v = A * Math.sin(x) + Bc * Math.cos(x); k++; } while (!safe(v, 2) && k < 300);
      var cs = (Bc < 0 ? ' - ' : ' + ') + (ab(Bc) === 1 ? '' : ab(Bc)) + '\\cos x', bt = (Bc < 0 ? '- ' : '+ ') + (ab(Bc) === 1 ? '' : ab(Bc)) + '\\cos ' + x;
      return N('sub-trig', 'Find $y = ' + A + '\\sin x' + cs + '$ when $x = ' + x + '$ radians, giving your answer to 2 decimal places.',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'Set the calculator to radians. $' + A + '\\sin ' + x + ' = ' + dec(A * Math.sin(x), 4) + '$ and the second term, $' + bt + '$, is $' + dec(Bc * Math.cos(x), 4) + '$, so $y = ' + dec(v, 2) + '$.');
    } },
    { skill: 'trig-mode', gen: function () {
      var A = rint(2, 5), x = rint(1, 3), good = A * Math.sin(x), bad = A * Math.sin(x * Math.PI / 180);
      return Q('trig-mode', 'A table is needed for $y = ' + A + '\\sin x$ with $x$ in radians. Which value of $y$ should go in the box at $x = ' + x + '$ (2 decimal places)?',
        T(dec(good, 2)), [T(dec(bad, 2)), T(dec(good / A, 2)), T(dec(A * Math.cos(x), 2))],
        'Radians mode gives $' + A + '\\sin ' + x + ' = ' + dec(good, 2) + '$. The value $' + dec(bad, 2) + '$ comes from degree mode, which is wrong for a curve in radians.');
    } },
    { skill: 'read-equation', gen: function () {
      var p = rint(2, 4), q = rint(1, 5), x, v, k = 0;
      do { x = rint(1, 9) / 2; v = Math.log(p * x + q); k++; } while (!safe(v, 2) && k < 300);
      return N('read-equation', 'Complete a table for $y = \\ln(' + p + 'x + ' + q + ')$. Find $y$ when $x = ' + x + '$, to 2 decimal places. (The bracket belongs inside the $\\ln$.)',
        R.roundDp(v, 2), 0.005, T(dec(v, 2)),
        'Work out the bracket first: $' + p + '(' + x + ') + ' + q + ' = ' + (p * x + q) + '$, then $\\ln ' + (p * x + q) + ' = ' + dec(v, 2) + '$. Reading it as $\\ln ' + (p * x) + ' + ' + q + '$ would give a different number.');
    } },
    { skill: 'change-base', gen: function () {
      var b = pick([2, 3, 4, 5, 6]), n = rint(2, 30);
      while (n === b || Math.pow(b, Math.round(Math.log(n) / Math.log(b))) === n) n = rint(2, 30);
      return Q('change-base', 'On a calculator with only $\\log_{10}$ and $\\ln$ keys, which keying gives $\\log_{' + b + '} ' + n + '$?',
        '$\\dfrac{\\ln ' + n + '}{\\ln ' + b + '}$', ['$\\dfrac{\\ln ' + b + '}{\\ln ' + n + '}$', '$\\ln ' + n + ' - \\ln ' + b + '$', '$\\dfrac{\\ln ' + n + '}{' + b + '}$'],
        'Change of base: $\\log_b x = \\dfrac{\\ln x}{\\ln b}$, so $\\log_{' + b + '} ' + n + ' = \\dfrac{\\ln ' + n + '}{\\ln ' + b + '}$. The other keyings calculate something different.');
    } },
    { skill: 'rounding', gen: function () {
      var ip = rint(1, 8), d1 = rint(0, 8), d2 = rint(0, 9), d3 = rint(5, 9);
      var v = Number(ip + '.' + d1 + d2 + d3), r2 = R.roundDp(v, 2);
      var tr = Number(ip + '.' + d1 + d2);
      return Q('rounding', 'A calculator shows $y = ' + v + '$. Which is the correct entry for the table if the question asks for 2 decimal places?',
        T(dec(r2, 2)), [T(dec(tr, 2)), T(dec(R.roundDp(v, 1), 1)), T(dec(r2 + 0.1, 2)), T(dec(r2 - 0.01, 2))],
        'Look at the third decimal place, which is ' + d3 + '. Since it is 5 or more, round the second decimal place up: $' + dec(r2, 2) + '$. Chopping off the digit gives $' + dec(tr, 2) + '$, which is wrong.');
    } },
    { skill: 'spot-error', gen: function () {
      var a = nz(-4, 4), c = nz(-5, 5), xs = [-3, -2, -1, 0, 1, 2, 3], bad = pick([-3, -2, -1]), row = [];
      xs.forEach(function (x) { row.push(x * x + a * x + c); });
      var wrongVal = -(bad * bad) + a * bad + c;
      var shown = row.slice(); shown[xs.indexOf(bad)] = wrongVal;
      var tbl = '<table class="mc-table"><tr><th>$x$</th>' + xs.map(function (x) { return '<td>$' + x + '$</td>'; }).join('') + '</tr><tr><th>$y$</th>' +
        shown.map(function (y) { return '<td>$' + y + '$</td>'; }).join('') + '</tr></table>';
      var others = [-3, -2, -1, 1, 2, 3].filter(function (x) { return x !== bad; });
      var opts = [bad]; others.forEach(function (x) { if (opts.length < 4 && ab(x) !== ab(bad)) opts.push(x); });
      while (opts.length < 4) opts.push(others[opts.length]);
      return Q('spot-error', 'A student completed this table for $y = x^2 ' + (a < 0 ? '- ' : '+ ') + (ab(a) === 1 ? '' : ab(a)) + 'x ' + (c < 0 ? '- ' : '+ ') + ab(c) + '$. One entry is wrong. ' + tbl + '<br>For which value of $x$ is the entry wrong?',
        T('x = ' + bad), opts.slice(1).map(function (x) { return T('x = ' + x); }),
        'At $x = ' + bad + '$ the correct value is $(' + bad + ')^2 ' + (a < 0 ? '- ' : '+ ') + (ab(a) === 1 ? '' : ab(a)) + '(' + bad + ') ' + (c < 0 ? '- ' : '+ ') + ab(c) + ' = ' + row[xs.indexOf(bad)] + '$, not $' + wrongVal + '$. The student forgot the brackets, so $-' + bad * bad + '$ appeared instead of $+' + bad * bad + '$.');
    } }
  ] };

  // =====================================================================
  // FPM-GRA-02 Drawing the graph from your table
  // =====================================================================
  B['FPM-GRA-02'] = { title: 'Drawing the graph from your table', items: [
    { skill: 'read-scale', gen: function () {
      var n = pick([2, 4, 5, 10]), big = pick([1, 2, 5, 10]);
      return N('read-scale', 'On the grid, one large square represents ' + big + ' unit' + (big > 1 ? 's' : '') + ' on the $y$-axis and is divided into ' + n + ' equal small squares. How many units does one small square represent?',
        big / n, 1e-9, T(String(big / n)), 'One small square is $' + big + ' \\div ' + n + ' = ' + (big / n) + '$ units. Always find this first, because plotting errors usually come from misreading the scale.');
    } },
    { skill: 'read-scale', gen: function () {
      var s = pick([0.1, 0.2, 0.5, 2, 4]), nsq = rint(5, 24), y = Math.round(nsq * s * 100) / 100;
      return N('read-scale', 'On a grid, one small square on the $y$-axis is worth ' + s + ' units, and $y = 0$ is on the line of the $x$-axis. A point has $y = ' + y + '$. How many small squares above the $x$-axis should it be plotted?',
        nsq, 0.1, T(String(nsq)), '$' + y + ' \\div ' + s + ' = ' + nsq + '$ small squares above the $x$-axis.');
    } },
    { skill: 'plot-points', gen: function () {
      var lo = rint(-4, -1), st = pick([0.5, 1]), hi = rint(2, 4), cnt = (hi - lo) / st + 1;
      return N('plot-points', 'A table for a curve has $x$-values from $' + lo + '$ to $' + hi + '$ in steps of ' + st + '. How many points must be plotted before you draw the curve?',
        cnt, 0.1, T(String(cnt)), 'Each column is one point. From $' + lo + '$ to $' + hi + '$ in steps of ' + st + ' there are $' + (hi - lo) + ' \\div ' + st + ' + 1 = ' + cnt + '$ points, including both end points.');
    } },
    { skill: 'plot-points', gen: function () {
      var s = pick([0.2, 0.5, 1, 2]);
      return N('plot-points', 'Points must be plotted within about half a small square. On a grid where one small square is worth ' + s + ' units, how large an error (in units) is just acceptable?',
        s / 2, 1e-9, T(String(s / 2)), 'Half a small square is $' + s + ' \\div 2 = ' + (s / 2) + '$ units.');
    } },
    { skill: 'curve-shape', gen: function () {
      var k = rint(3, 6), b = pick([2, 3]), lo = rint(-3, 0);
      return Q('curve-shape', 'The curve $y = \\log_{' + b + '}(' + k + ' - x)$ is to be drawn for $' + lo + ' \\leqslant x \\leqslant ' + (k - 1) + '$. Which description of the curve is correct?',
        'It falls from left to right, getting steeper as $x$ approaches ' + k + ', and the curve stops short of the line $x = ' + k + '$',
        ['It rises from left to right, getting steeper as $x$ approaches ' + k, 'It is a straight line sloping downwards, because the table is regular', 'It flattens off to a horizontal line as $x$ approaches ' + k],
        'As $x$ gets close to ' + k + ', $' + k + ' - x$ gets close to 0, and the log tends to $-\\infty$. So the curve drops ever more steeply towards the vertical line $x = ' + k + '$ without reaching it.');
    },},
    { skill: 'curve-shape', gen: function () {
      var b = pick([2, 3, 4]);
      return Q('curve-shape', 'A table for $y = ' + b + '^x$ gives $y = 1, ' + b + ', ' + b * b + ', ' + b * b * b + '$ for $x = 0, 1, 2, 3$. Which description of the drawn curve is correct?',
        'A smooth curve that gets steeper as $x$ increases', ['A straight line through the four points', 'A smooth curve that levels off as $x$ increases', 'A series of straight segments joined at the points'],
        'The $y$-values grow by bigger and bigger amounts, so the gradient is increasing: the curve rises ever more steeply. It is drawn freehand and smooth.');
    } },
    { skill: 'curve-shape', gen: function () {
      var lo = rint(-3, -1), hi = rint(2, 4);
      return Q('curve-shape', 'A curve is to be drawn for $' + lo + ' \\leqslant x \\leqslant ' + hi + '$. Which statement is correct?',
        'Plot every point including those at $x = ' + lo + '$ and $x = ' + hi + '$, and draw the curve exactly from the first point to the last',
        ['Stop the curve at the last point you are sure of, even if it is before $x = ' + hi + '$', 'Extend the curve beyond $x = ' + hi + '$ with an arrow to show it carries on', 'Leave out the end points because they are on the edge of the interval'],
        'The graph is only defined, and only marked, over the stated interval. Both end points are plotted and the curve runs from one to the other.');
    } },
    { skill: 'spot-error', gen: function () {
      var b = pick([2, 3]), idx = rint(1, 5), xs = [0, 1, 2, 3, 4, 5], ys = xs.map(function (x) { return Math.pow(b, x); });
      var shown = ys.slice(), wrong;
      do { wrong = ys[idx] + pick([-1, 1]) * rint(1, Math.max(1, Math.floor(ys[idx] / 3))); } while (ys.indexOf(wrong) >= 0 || wrong < 1);
      shown[idx] = wrong;
      var tbl = '<table class="mc-table"><tr><th>$x$</th>' + xs.map(function (x) { return '<td>$' + x + '$</td>'; }).join('') + '</tr><tr><th>$y$</th>' +
        shown.map(function (y) { return '<td>$' + y + '$</td>'; }).join('') + '</tr></table>';
      var pool = xs.filter(function (x) { return x !== idx; }), opts = [idx];
      while (opts.length < 4) opts.push(pool.splice(rint(0, pool.length - 1), 1)[0]);
      return Q('spot-error', 'Points are plotted from this table for $y = ' + b + '^x$. ' + tbl + 'When the points are plotted, one of them does not lie on a smooth curve through its neighbours. At which value of $x$ should you recalculate?',
        T('x = ' + idx), opts.slice(1).map(function (x) { return T('x = ' + x); }),
        'Each $y$-value should be ' + b + ' times the one before. At $x = ' + idx + '$ the correct value is $' + pw(b, idx) + ' = ' + ys[idx] + '$, but the table shows $' + wrong + '$. Do not force the curve through a wrong value: recalculate it.');
    } },
    { skill: 'draw-method', kind: 'mcq', q: 'Which is the correct way to join the plotted points of a curve?', options: ['Draw one smooth freehand curve through all the points', 'Join each pair of neighbouring points with a ruler', 'Draw several short curves and overlap them to fix the shape', 'Draw the curve through most points and ignore any that look odd'], answer: 0,
      why: 'The curve mark is for one smooth freehand curve. Ruler segments make joined-up dots, and ignoring a point that looks odd without rechecking it loses accuracy.' },
    { skill: 'draw-method', kind: 'mcq', q: 'Which makes later readings from the graph most accurate?', options: ['A sharp pencil and one thin line', 'A thick, well-shaded line so it is easy to see', 'Going over the curve several times to make it darker', 'Using a pen so it cannot be rubbed out'], answer: 0,
      why: 'A thin single line can be read to within a fraction of a small square. A thick or doubled line hides where the true curve is and costs accuracy when you read off values.' },
    { skill: 'draw-method', kind: 'mcq', q: 'A student plots the points for a curve, but the point at $x = 2$ sits well off the pattern of its neighbours. What should they do?', options: ['Recalculate that value from the equation, then plot the corrected point', 'Bend the curve so that it passes exactly through the point', 'Leave the point out and draw the curve through the others', 'Move the point to where it looks right'], answer: 0,
      why: 'A point that jumps out of the pattern is almost always a keying error. Check it by substituting again; forcing a curve through a wrong value spoils the curve mark.' }
  ] };

  // =====================================================================
  // FPM-GRA-03 Sketching curves and where they cross the axes
  // =====================================================================
  B['FPM-GRA-03'] = { title: 'Sketching curves and where they cross the axes', items: [
    { skill: 'axis-points', gen: function () {
      var p = nz(-6, 6), q = nz(-6, 6);
      return N('axis-points', 'A parabola has equation $y = (x ' + (p < 0 ? '+ ' : '- ') + ab(p) + ')(x ' + (q < 0 ? '+ ' : '- ') + ab(q) + ')$. Find the $y$-coordinate of the point where it crosses the $y$-axis.',
        p * q, 1e-9, T(String(p * q)), 'Put $x = 0$: $(0 ' + (p < 0 ? '+ ' : '- ') + ab(p) + ')(0 ' + (q < 0 ? '+ ' : '- ') + ab(q) + ') = (' + (-p) + ')(' + (-q) + ') = ' + (p * q) + '$.');
    } },
    { skill: 'axis-points', gen: function () {
      var p = rint(-6, 3), q = p + rint(1, 6);
      while (p === 0 || q === 0) { p = rint(-6, 3); q = p + rint(1, 6); }
      return N('axis-points', 'A parabola has equation $y = (x ' + (p < 0 ? '+ ' : '- ') + ab(p) + ')(x ' + (q < 0 ? '+ ' : '- ') + ab(q) + ')$ and crosses the $x$-axis at two points. What is the $x$-coordinate of the right-hand crossing point?',
        q, 1e-9, T(String(q)), 'Put $y = 0$: $x = ' + p + '$ or $x = ' + q + '$. The right-hand crossing is the larger value, $x = ' + q + '$.');
    } },
    { skill: 'axis-points', gen: function () {
      var a = nz(-4, 4), b = nz(-4, 4), c = nz(-4, 4);
      var f = function (r) { return '(x ' + (r < 0 ? '+ ' : '- ') + ab(r) + ')'; };
      return N('axis-points', 'A cubic has equation $y = ' + f(a) + f(b) + f(c) + '$. What is the $y$-coordinate of the point where it meets the $y$-axis?',
        -a * b * c, 1e-9, T(String(-a * b * c)), 'Put $x = 0$: $(' + (-a) + ')(' + (-b) + ')(' + (-c) + ') = ' + (-a * b * c) + '$.');
    } },
    { skill: 'turning-point', gen: function () {
      var p = rint(-4, 2) * 2, q = p + 2 * rint(1, 3);
      while (p === 0 || q === 0) { p = rint(-4, 2) * 2; q = p + 2 * rint(1, 3); }
      var mid = (p + q) / 2, yv = -((q - p) / 2) * ((q - p) / 2);
      return N('turning-point', 'The parabola $y = (x ' + (p < 0 ? '+ ' : '- ') + ab(p) + ')(x ' + (q < 0 ? '+ ' : '- ') + ab(q) + ')$ has a minimum point. Find the $y$-coordinate of the minimum.',
        yv, 1e-9, T(String(yv)), 'The minimum is halfway between the roots $' + p + '$ and $' + q + '$, at $x = ' + mid + '$. Then $y = (' + (mid - p) + ')(' + (mid - q) + ') = ' + yv + '$.');
    } },
    { skill: 'turning-point', gen: function () {
      var p = nz(-5, 5), q = nz(-9, 9), tp = coord(-p, q);
      return Q('turning-point', 'The curve $y = (x ' + (p < 0 ? '- ' : '+ ') + ab(p) + ')^2 ' + (q < 0 ? '- ' : '+ ') + ab(q) + '$ is sketched. Which are the coordinates of its turning point?',
        T(tp), [T(coord(p, q)), T(coord(-p, -q)), T(coord(p, -q))],
        'In $a(x + p)^2 + q$ the minimum is at $(-p, q)$. Here $(x ' + (p < 0 ? '- ' : '+ ') + ab(p) + ')^2$ is zero at $x = ' + (-p) + '$, where $y = ' + q + '$. It is a minimum because the squared term has positive coefficient.');
    } },
    { skill: 'shape', gen: function () {
      var a = nz(-3, 3), b = a + rint(1, 3), c = b + rint(1, 3), neg = Math.random() < 0.5;
      var f = function (r) { return '(x ' + (r < 0 ? '+ ' : '- ') + ab(r) + ')'; };
      var eq = (neg ? '-' : '') + f(a) + f(b) + f(c);
      return Q('shape', 'A cubic has equation $y = ' + eq + '$. Which description of its sketch is correct?',
        neg ? 'It starts top left, passes through the three roots, and ends bottom right' : 'It starts bottom left, passes through the three roots, and ends top right',
        [neg ? 'It starts bottom left, passes through the three roots, and ends top right' : 'It starts top left, passes through the three roots, and ends bottom right', 'It is a U-shape with a minimum between the roots', 'It touches the $x$-axis at ' + b + ' without crossing and crosses at the other two'],
        'The roots are $x = ' + a + ', ' + b + ', ' + c + '$, so it crosses the $x$-axis three times. Multiplying out gives an $x^3$ term with a ' + (neg ? 'negative' : 'positive') + ' coefficient, so for large positive $x$, $y$ is ' + (neg ? 'negative' : 'positive') + '.');
    } },
    { skill: 'asymptote', gen: function () {
      var base = pick([2, 3, 5]), k = nz(-4, 4);
      return Q('asymptote', 'Which description of the sketch of $y = ' + base + '^x ' + (k < 0 ? '- ' : '+ ') + ab(k) + '$ is correct?',
        'It approaches the horizontal line $y = ' + k + '$ on the left, never touching it, and crosses the $y$-axis at $(0, ' + (1 + k) + ')$',
        ['It approaches the line $y = 0$ on the left and crosses the $y$-axis at $(0, 1)$', 'It touches the line $y = ' + k + '$ at $(0, ' + k + ')$', 'It crosses the $y$-axis at $(0, ' + k + ')$ and has asymptote $x = ' + k + '$'],
        'The constant ' + k + ' in the equation shifts $y = ' + base + '^x$ vertically by ' + k + ' units, so the asymptote moves from $y = 0$ to $y = ' + k + '$. At $x = 0$, $' + base + '^0 = 1$, so $y = ' + (1 + k) + '$.');
    } },
    { skill: 'asymptote', gen: function () {
      var b = pick([2, 3, 5]), k = rint(1, 7);
      return Q('asymptote', 'Which is the equation of the vertical asymptote of $y = \\log_{' + b + '}(x + ' + k + ')$?',
        T('x = ' + (-k)), [T('x = ' + k), T('x = 0'), T('y = ' + (-k))],
        'The log is only defined when $x + ' + k + ' \\gt 0$, and it tends to $-\\infty$ as $x + ' + k + '$ tends to 0. So the asymptote is $x = ' + (-k) + '$.');
    } },
    { skill: 'axis-points', gen: function () {
      var base = pick([2, 3, 5]), n = rint(1, 3), v = Math.pow(base, n);
      return N('axis-points', 'The curve $y = ' + base + '^x - ' + v + '$ crosses the $x$-axis once. Find the $x$-coordinate of that point.',
        n, 1e-9, T(String(n)), 'Put $y = 0$: $' + base + '^x = ' + v + '$. Since $' + pw(base, n) + ' = ' + v + '$, $x = ' + n + '$.');
    } },
    { skill: 'axis-points', gen: function () {
      var b = pick([2, 3]), k = rint(2, 7);
      return N('axis-points', 'The curve $y = \\log_{' + b + '}(x + ' + k + ')$ crosses the $x$-axis at the point $(s, 0)$. Find $s$.',
        1 - k, 1e-9, T(String(1 - k)), 'Put $y = 0$: $x + ' + k + ' = ' + b + '^0 = 1$, so $x = ' + (1 - k) + '$.');
    } },
    { skill: 'axis-points', gen: function () {
      var b = pick([2, 3]), n = rint(1, 3), k = Math.pow(b, n);
      return N('axis-points', 'The curve $y = \\log_{' + b + '}(x + ' + k + ')$ meets the $y$-axis at $(0, t)$. Find $t$.',
        n, 1e-9, T(String(n)), 'Put $x = 0$: $y = \\log_{' + b + '} ' + k + '$. Since $' + pw(b, n) + ' = ' + k + '$, $t = ' + n + '$.');
    } },
    { skill: 'trap-sign', gen: function () {
      var p = rint(2, 5), q = nz(-7, 7), r = nz(-6, 6);
      while (gcd(p, q) !== 1) q = nz(-7, 7);
      var root1 = fr(-q, p);
      var xr = ' (x ' + (r < 0 ? '+ ' : '- ') + ab(r) + ')';
      return Q('trap-sign', 'A curve has equation $y = (' + lin(p, q) + ')' + xr + '$. At which values of $x$ does it cross the $x$-axis?',
        T('x = ' + root1 + ' \\text{ and } x = ' + r), [T('x = ' + fr(q, p) + ' \\text{ and } x = ' + r), T('x = ' + root1 + ' \\text{ and } x = ' + (-r)), T('x = ' + fr(q, p) + ' \\text{ and } x = ' + (-r))],
        'Set each bracket to zero. $' + lin(p, q) + ' = 0$ gives $x = ' + root1 + '$, and $x ' + (r < 0 ? '+ ' : '- ') + ab(r) + ' = 0$ gives $x = ' + r + '$. Watch the signs when moving a term across.');
    } },
    { skill: 'find-wrong-step', gen: function () {
      var a = rint(1, 6), b = a + rint(1, 5), s = a + b, t = a * b, err = rint(1, 3);
      var lines = [
        'Put $y = 0$.',
        '$x^2 - ' + s + 'x + ' + t + ' = 0$',
        '$(x - ' + a + ')(x - ' + b + ') = 0$',
        '$x = ' + a + '$ or $x = ' + b + '$'];
      if (err === 1) lines[0] = 'Put $x = 0$.';
      if (err === 2) lines[2] = '$(x + ' + a + ')(x + ' + b + ') = 0$';
      if (err === 3) lines[3] = '$x = ' + (-a) + '$ or $x = ' + (-b) + '$';
      var wrongLine = err === 1 ? 1 : err === 2 ? 3 : 4;
      return M('find-wrong-step', 'A student wants to show that the curve $y = x^2 - ' + s + 'x + ' + t + '$ crosses the $x$-axis at $x = ' + a + '$ and $x = ' + b + '$. Here are the four lines of working:<br>1. ' + lines[0] + '<br>2. ' + lines[1] + '<br>3. ' + lines[2] + '<br>4. ' + lines[3] + '<br>Which line contains the error?',
        ['Line 1', 'Line 2', 'Line 3', 'Line 4'], wrongLine - 1,
        wrongLine === 1 ? 'Points on the $x$-axis have $y = 0$. Putting $x = 0$ finds the $y$-intercept instead.' :
          wrongLine === 3 ? 'The brackets multiply to $x^2 + ' + s + 'x + ' + t + '$. To get $-' + s + 'x$ the factors must be $(x - ' + a + ')(x - ' + b + ')$.' :
            '$(x - ' + a + ')(x - ' + b + ') = 0$ gives $x = ' + a + '$ or $x = ' + b + '$, not the negatives. Each bracket is zero when $x$ equals the number being subtracted.');
    } },
    { skill: 'shape', kind: 'mcq', q: 'The curve $y = x^2 - 4x + 7$ has no real roots, because its minimum point is $(2, 3)$. Which statement about its sketch is correct?', options: ['It is a U-shape lying completely above the $x$-axis, crossing the $y$-axis at $(0, 7)$', 'It is a U-shape touching the $x$-axis at $(2, 0)$', 'It is an inverted U-shape with maximum point $(2, 3)$', 'It is a U-shape crossing the $x$-axis at $x = 2$ and $x = 3$'], answer: 0,
      why: 'The $x^2$ coefficient is positive so it is a U-shape. The minimum height is $3 \\gt 0$, so the whole curve is above the $x$-axis. Putting $x = 0$ gives $y = 7$.' }
  ] };

  // =====================================================================
  // FPM-GRA-04 Writing down the asymptotes of a rational curve
  // =====================================================================
  B['FPM-GRA-04'] = { title: 'Writing down the asymptotes of a rational curve', items: [
    { skill: 'vertical', gen: function () {
      var r = mkRat(), vx = fr(-r.d, r.c);
      return Q('vertical', 'Which is the equation of the asymptote of $y = ' + r.tex + '$ that is parallel to the $y$-axis?',
        T('x = ' + vx), [T('x = ' + fr(r.d, r.c)), T('y = ' + fr(r.a, r.c)), T('x = ' + fr(-r.b, r.a))],
        'The denominator is zero when $' + r.denTex + ' = 0$, so $x = ' + vx + '$. A vertical line is written $x = \\ldots$')
    } },
    { skill: 'horizontal', gen: function () {
      var r = mkRat(), hy = fr(r.a, r.c);
      return Q('horizontal', 'Which is the equation of the asymptote of $y = ' + r.tex + '$ that is parallel to the $x$-axis?',
        T('y = ' + hy), [T('y = ' + fr(r.b, r.d)), T('x = ' + fr(r.a, r.c)), T('y = ' + fr(r.c, r.a))],
        'For very large $x$ the constants hardly matter, so $y$ tends to $\\dfrac{' + cf(r.a) + 'x}{' + cf(r.c) + 'x} = ' + hy + '$. The ratio of the constants, $\\frac{b}{d}$, is the $y$-intercept, not the asymptote.');
    } },
    { skill: 'vertical', gen: function () {
      var r = mkRat({ intv: true });
      return N('vertical', 'The curve $y = ' + r.tex + '$ has a vertical asymptote $x = k$. Find $k$.',
        -r.d / r.c, 1e-9, T(String(-r.d / r.c)), 'Solve $' + r.denTex + ' = 0$: $x = ' + (-r.d / r.c) + '$. So $k = ' + (-r.d / r.c) + '$.');
    } },
    { skill: 'horizontal', gen: function () {
      var r = mkRat({ inta: true });
      return N('horizontal', 'The curve $y = ' + r.tex + '$ has a horizontal asymptote $y = m$. Find $m$.',
        r.a / r.c, 1e-9, T(String(r.a / r.c)), 'As $x$ becomes very large, $y \\to \\dfrac{' + r.a + '}{' + r.c + '} = ' + (r.a / r.c) + '$, the ratio of the $x$-coefficients. So $m = ' + (r.a / r.c) + '$.');
    } },
    { skill: 'vertical', gen: function () {
      var a = nz(-5, 5), b = nz(-6, 6), c = rint(1, 3), d = nz(-5, 5), k = Math.random() < 0.5;
      var h = fr(-d, c);
      while (a * d - b * c === 0) b = nz(-6, 6);
      var cond = fr(-d, c);
      return Q('vertical', 'A curve is given by $y = \\dfrac{' + lin(a, b) + '}{' + lin(c, d) + '}$, where $x \\neq ' + cond + '$. Which is the equation of its asymptote parallel to the $y$-axis?',
        T('x = ' + cond), [T('x = ' + fr(d, c)), T('y = ' + fr(a, c)), T('x = ' + fr(b, a))],
        'The excluded value is exactly where the denominator is zero: $' + lin(c, d) + ' = 0$ gives $x = ' + cond + '$. That vertical line is the asymptote.');
    } },
    { skill: 'form-split', gen: function () {
      var k = nz(-5, 5), m = nz(-6, 6), n = nz(-5, 5);
      while (m === k || ab(n) === ab(k)) { m = nz(-6, 6); n = nz(-5, 5); }
      var tex = k + ' ' + (m < 0 ? '- ' : '+ ') + '\\dfrac{' + ab(m) + '}{x ' + (n < 0 ? '- ' : '+ ') + ab(n) + '}';
      return Q('form-split', 'The curve $C$ has equation $y = ' + tex + '$. Which pair of equations gives its asymptotes?',
        T('x = ' + (-n) + ' \\text{ and } y = ' + k), [T('x = ' + n + ' \\text{ and } y = ' + k), T('x = ' + (-n) + ' \\text{ and } y = ' + m), T('x = ' + k + ' \\text{ and } y = ' + (-n))],
        'The fraction becomes huge when $x ' + (n < 0 ? '- ' : '+ ') + ab(n) + ' = 0$, so $x = ' + (-n) + '$. For large $|x|$ the fraction tends to 0, so $y \\to ' + k + '$.');
    } },
    { skill: 'horizontal', gen: function () {
      var a = nz(-4, 4), b = nz(-6, 6), c = rint(1, 3), d = nz(-6, 6);
      var m = nz(-4, 4), p = nz(-9, 9), d2 = nz(-6, 6);
      while (p === -m * d2) p = nz(-9, 9);
      // numerator written p - m x, denominator x + d2 ; horizontal asymptote y = -m
      var num = linRev(p, -m);
      return N('horizontal', 'The curve $y = \\dfrac{' + num + '}{x ' + (d2 < 0 ? '- ' : '+ ') + ab(d2) + '}$ has a horizontal asymptote $y = k$. Find $k$. (Watch the sign of the $x$ term in the numerator.)',
        -m, 1e-9, T(String(-m)), 'The coefficient of $x$ on top is $' + (-m) + '$ (the term is $' + (-m < 0 ? '-' : '+') + (ab(m) === 1 ? '' : ab(m)) + 'x$) and on the bottom is $1$. The ratio is $' + (-m) + '$, so $k = ' + (-m) + '$.');
    } },
    { skill: 'answer-form', gen: function () {
      var r = mkRat({ intv: true }), k = -r.d / r.c;
      return Q('answer-form', 'The denominator of $y = ' + r.tex + '$ is zero at $x = ' + k + '$. Which is the best way to state the asymptote parallel to the $y$-axis?',
        T('x = ' + k), [T(String(k)), T('y = ' + k), T('(' + k + ', 0)')],
        'An asymptote is a line, so it is answered as an equation. A vertical line is $x = ' + k + '$. A bare number, a point or $y = ' + k + '$ (a horizontal line) would not describe it.');
    } },
    { skill: 'answer-form', gen: function () {
      var h = nz(-6, 6), k = nz(-6, 6);
      while (k === h) k = nz(-6, 6);
      return Q('answer-form', 'A curve has asymptotes $x = ' + h + '$ and $y = ' + k + '$. Which one is parallel to the $x$-axis?',
        T('y = ' + k), [T('x = ' + h), T('x = ' + k), T('y = ' + h)],
        'A line parallel to the $x$-axis is horizontal, so it has the form $y = \\text{constant}$: $y = ' + k + '$. The equation $x = ' + h + '$ is vertical, parallel to the $y$-axis.');
    } },
    { skill: 'sum-both', gen: function () {
      var r = mkRat({ intv: true, inta: true }), h = -r.d / r.c, k = r.a / r.c;
      return N('sum-both', 'The curve $y = ' + r.tex + '$ has asymptotes $x = h$ and $y = k$. Find $h + k$.',
        h + k, 1e-9, T(String(h + k)), 'Vertical: $' + r.denTex + ' = 0$ gives $h = ' + h + '$. Horizontal: $k = \\frac{' + r.a + '}{' + r.c + '} = ' + k + '$. So $h + k = ' + (h + k) + '$.');
    } },
    { skill: 'definition', kind: 'mcq', q: 'Which statement about an asymptote is correct?', options: ['The curve gets closer and closer to the line but never reaches it', 'The curve touches the line at exactly one point', 'The curve crosses the line at the origin', 'It is the line through the $x$- and $y$-intercepts'], answer: 0,
      why: 'An asymptote is a line that the curve approaches without reaching. For $y = \\frac{ax + b}{cx + d}$ the curve never meets the vertical asymptote and never quite reaches the horizontal one.' },
    { skill: 'vertical', kind: 'mcq', q: 'For $y = \\dfrac{3x + 5}{x + 4}$, a student writes "$x = 4$" for the vertical asymptote. What is the error?', options: ['The denominator is zero at $x = -4$, not $4$', 'It should be $y = 4$', 'It should be $x = \\frac{5}{3}$', 'There is no error'], answer: 0,
      why: '$x + 4 = 0$ gives $x = -4$. The sign changes when 4 is moved across the equals sign.' }
  ] };

  // =====================================================================
  // FPM-GRA-05 Where a rational curve crosses the axes
  // =====================================================================
  B['FPM-GRA-05'] = { title: 'Where a rational curve crosses the axes', items: [
    { skill: 'y-intercept', gen: function () {
      var r = mkRat(), yv = fr(r.b, r.d);
      return Q('y-intercept', 'At which point does $y = ' + r.tex + '$ cross the $y$-axis?',
        T(coord(0, yv)), [T(coord(fr(-r.b, r.a), 0)), T(coord(0, fr(r.a, r.c))), T(coord(0, fr(-r.b, r.d)))],
        'Put $x = 0$: $y = \\dfrac{' + r.b + '}{' + r.d + '} = ' + yv + '$. So the point is $(0, ' + yv + ')$.');
    } },
    { skill: 'x-intercept', gen: function () {
      var r = mkRat(), xv = fr(-r.b, r.a);
      return Q('x-intercept', 'At which point does $y = ' + r.tex + '$ cross the $x$-axis?',
        T(coord(xv, 0)), [T(coord(fr(r.b, r.a), 0)), T(coord(0, xv)), T(coord(fr(-r.d, r.c), 0))],
        'A fraction is zero only when its numerator is zero: $' + r.numTex + ' = 0$ gives $x = ' + xv + '$. On the $x$-axis $y = 0$, so the point is $(' + xv + ', 0)$.');
    } },
    { skill: 'y-intercept', gen: function () {
      var r = mkRat({ decd: true });
      return N('y-intercept', 'The curve $y = ' + r.tex + '$ crosses the $y$-axis at $(0, q)$. Find $q$.',
        r.b / r.d, 1e-9, T(String(r.b / r.d)), 'Put $x = 0$: $q = \\dfrac{' + r.b + '}{' + r.d + '} = ' + (r.b / r.d) + '$.');
    } },
    { skill: 'x-intercept', gen: function () {
      var r = mkRat({ deca: true });
      return N('x-intercept', 'The curve $y = ' + r.tex + '$ crosses the $x$-axis at $(p, 0)$. Find $p$.',
        -r.b / r.a, 1e-9, T(String(-r.b / r.a)), 'Put the numerator equal to zero: $' + r.numTex + ' = 0$, so $x = ' + (-r.b / r.a) + '$. Then $p = ' + (-r.b / r.a) + '$.');
    } },
    { skill: 'method', gen: function () {
      var r = mkRat();
      return Q('method', 'To find where $y = ' + r.tex + '$ crosses the $x$-axis, which equation should be solved?',
        T(r.numTex + ' = 0'), [T(r.denTex + ' = 0'), T(r.numTex + ' = ' + r.d), T('x = 0')],
        'On the $x$-axis $y = 0$, and a fraction equals zero only when its numerator does. Setting the denominator to zero gives the vertical asymptote instead.');
    } },
    { skill: 'method', gen: function () {
      var r = mkRat();
      return Q('method', 'A student sets $' + r.denTex + ' = 0$ for $y = ' + r.tex + '$ and gets $x = ' + fr(-r.d, r.c) + '$. What does this value represent?',
        'The vertical asymptote, which is not a crossing point', ['The $x$-intercept', 'The $y$-intercept', 'The point where the two asymptotes cross the $y$-axis'],
        'The denominator is zero at $x = ' + fr(-r.d, r.c) + '$, where the curve is not defined. It gives the vertical asymptote, not an intercept.');
    } },
    { skill: 'format', gen: function () {
      var r = mkRat(), xv = fr(-r.b, r.a);
      return Q('format', 'The curve $y = ' + r.tex + '$ crosses the $x$-axis where $x = ' + xv + '$. Which is the correct way to give the answer to "find the coordinates of the point where it crosses the $x$-axis"?',
        T(coord(xv, 0)), [T(coord(0, xv)), T('x = ' + xv), T(coord(dec(-r.b / r.a, 2), 0))],
        'Coordinates are a pair, with $y = 0$ on the $x$-axis: $(' + xv + ', 0)$. Keep the exact fraction rather than a rounded decimal.');
    } },
    { skill: 'x-intercept', gen: function () {
      var m = nz(-4, -1), p = nz(-9, 9), d = rint(1, 6), s = nz(-4, 4);
      // y = (p + m x)/(x + d): numerator written p - kx
      while (p % m !== 0 || p === 0 || p === m * d) p = nz(-9, 9) * (-m);
      var xr = -p / m;
      return N('x-intercept', 'The curve $y = \\dfrac{' + linRev(p, m) + '}{x ' + '+ ' + d + '}$ crosses the $x$-axis at $(p, 0)$. Find $p$. (Be careful with the minus sign on the $x$ term.)',
        xr, 1e-9, T(String(xr)), 'Set the numerator to zero: $' + linRev(p, m) + ' = 0$, so $' + (ab(m) === 1 ? '' : ab(m)) + 'x = ' + p + '$ and $x = ' + xr + '$.');
    } },
    { skill: 'y-intercept', gen: function () {
      var r = mkRat({ b0: true });
      return Q('y-intercept', 'The curve $y = \\dfrac{' + lin(r.a, 0) + '}{' + r.denTex + '}$ has no constant term on top. Where does it cross the axes?',
        'Only at the origin $(0, 0)$', ['At $(0, 0)$ and at $(' + fr(-r.d, r.c) + ', 0)$', 'At $(0, ' + fr(r.a, r.d) + ')$ only', 'It never crosses either axis'],
        'Putting $x = 0$ gives $y = \\frac{0}{' + r.d + '} = 0$, and the numerator $' + lin(r.a, 0) + ' = 0$ also only when $x = 0$. So both crossings are the single point $(0, 0)$. The value $x = ' + fr(-r.d, r.c) + '$ is the asymptote.');
    } },
    { skill: 'format', gen: function () {
      var r = mkRat(), yv = fr(r.b, r.d);
      return Q('format', 'For $y = ' + r.tex + '$, which answer correctly states where the curve meets the $y$-axis?',
        T(coord(0, yv)), [T(yv), T('x = ' + yv), T(coord(yv, 0))],
        'The question asks for a point, so give a coordinate pair with $x = 0$: $(0, ' + yv + ')$. A single number or an equation is not a coordinate.');
    } },
    { skill: 'which-axis', kind: 'mcq', q: 'A curve meets the $x$-axis at the point $P$. Which is true of $P$?', options: ['Its $y$-coordinate is $0$', 'Its $x$-coordinate is $0$', 'Both coordinates are $0$', 'Its coordinates are equal'], answer: 0,
      why: 'Every point on the $x$-axis has height $y = 0$. Points on the $y$-axis have $x = 0$.' },
    { skill: 'check', gen: function () {
      var r = mkRat({ inta: true }), x0 = -r.b / r.a;
      var xv = fr(-r.b, r.a);
      return N('check', 'The curve $y = ' + r.tex + '$ crosses the $x$-axis at $x = ' + xv + '$. Substitute this into the numerator $' + r.numTex + '$. What value do you get?',
        0, 1e-9, T('0'), 'The numerator is $' + r.a + '(' + xv + ') + (' + r.b + ') = 0$. Checking that the numerator is zero (and the denominator is not) confirms the crossing point.');
    } }
  ] };

  // =====================================================================
  // FPM-GRA-06 Sketching a rational curve with its asymptotes
  // =====================================================================
  B['FPM-GRA-06'] = { title: 'Sketching a rational curve with its asymptotes', items: [
    { skill: 'corners', gen: function () {
      var r = mkRat(), s = r.b * r.c - r.a * r.d, upRight = s > 0;
      var h = fr(-r.d, r.c), k = fr(r.a, r.c);
      var right = 'one branch above the horizontal asymptote and to the right of $x = ' + h + '$, the other below it and to the left';
      var left = 'one branch above the horizontal asymptote and to the left of $x = ' + h + '$, the other below it and to the right';
      return Q('corners', 'The curve $y = ' + r.tex + '$ has asymptotes $x = ' + h + '$ and $y = ' + k + '$. Which description of its two branches is correct?',
        upRight ? right : left, [upRight ? left : right, 'both branches above the line $y = ' + k + '$', 'both branches to the right of the line $x = ' + h + '$'],
        'Write $y = ' + k + ' + \\dfrac{' + s + '}{' + (r.c === 1 ? '' : r.c) + '(' + r.denTex + ')}$. The numerator $' + s + '$ is ' + (s > 0 ? 'positive' : 'negative') + ', and $' + r.denTex + '$ is positive when $x \\gt ' + h + '$. So to the right of $x = ' + h + '$ the curve is ' + (upRight ? 'above' : 'below') + ' $y = ' + k + '$, and to the left it is ' + (upRight ? 'below' : 'above') + ' it. The branches sit in opposite corners.');
    } },
    { skill: 'centre', gen: function () {
      var r = mkRat({ intv: true, inta: true }), h = -r.d / r.c, k = r.a / r.c;
      return N('centre', 'The two asymptotes of $y = ' + r.tex + '$ cross at the point $(h, k)$. Find the value of $h$.',
        h, 1e-9, T(String(h)), 'The vertical asymptote comes from $' + r.denTex + ' = 0$, so $h = ' + h + '$. (The horizontal asymptote is $y = ' + k + '$, so the crossing point is $(' + h + ', ' + k + ')$.)');
    } },
    { skill: 'centre', gen: function () {
      var r = mkRat({ intv: true, inta: true }), h = -r.d / r.c, k = r.a / r.c;
      return N('centre', 'The two asymptotes of $y = ' + r.tex + '$ cross at the point $(h, k)$. Find the value of $k$.',
        k, 1e-9, T(String(k)), 'The horizontal asymptote is $y = \\dfrac{' + r.a + '}{' + r.c + '} = ' + k + '$, so $k = ' + k + '$. (The vertical asymptote is $x = ' + h + '$.)');
    } },
    { skill: 'which-branch', gen: function () {
      var h = rint(2, 6), a = nz(-3, 3), bb = nz(-6, 6), c = 1;
      // y = (a x + b)/(x - h): the y-intercept at x = 0 lies left of x = h
      while (a * (-h) - bb * c === 0) bb = nz(-6, 6);
      return Q('which-branch', 'The curve $y = \\dfrac{' + lin(a, bb) + '}{x - ' + h + '}$ has vertical asymptote $x = ' + h + '$ and crosses the $y$-axis at $(0, ' + fr(-bb, h) + ')$. Which branch contains the $y$-intercept?',
        'The left-hand branch, where $x \\lt ' + h + '$', ['The right-hand branch, where $x \\gt ' + h + '$', 'Neither: the intercept lies on the asymptote', 'Both branches, because the curve is symmetrical'],
        'The $y$-intercept has $x = 0$. Since $0 \\lt ' + h + '$, it is to the left of the vertical asymptote, so it lies on the left-hand branch. The other branch lies in the opposite corner.');
    } },
    { skill: 'sketch-features', gen: function () {
      var r = mkRat(), h = fr(-r.d, r.c), k = fr(r.a, r.c);
      return Q('sketch-features', 'A student sketches $y = ' + r.tex + '$ and wants full marks. Which of these must be included?',
        'Both branches, dashed lines $x = ' + h + '$ and $y = ' + k + '$ labelled with their equations, and the axis crossings labelled with exact coordinates',
        ['Only the branch through the $y$-intercept, with the intercept marked', 'Both branches with the asymptotes drawn but unlabelled', 'Both branches crossing the vertical asymptote, which shows the curve is continuous'],
        'The sketch needs both branches in the right corners, each asymptote drawn dashed and labelled with its equation, and exact crossing points labelled. The curve never crosses the vertical asymptote.');
    } },
    { skill: 'sketch-features', gen: function () {
      var r = mkRat(), h = fr(-r.d, r.c);
      return Q('sketch-features', 'A sketch of $y = ' + r.tex + '$ shows the right-hand branch curling back up and crossing the vertical asymptote $x = ' + h + '$. What is wrong with it?',
        'A curve can never cross its vertical asymptote: at $x = ' + h + '$ the function has no value', ['Nothing is wrong, the branches must meet', 'The asymptote should be horizontal', 'The curve must touch the asymptote at one point'],
        'The denominator is zero at $x = ' + h + '$, so there is no point on the curve with that $x$-value. Each branch approaches the line but cannot cross it.');
    } },
    { skill: 'crossings', gen: function () {
      var r = mkRat();
      return N('crossings', 'How many points does the curve $y = ' + r.tex + '$ have in common with the coordinate axes (counting a point on both axes once)?',
        2, 0.1, T('2'), 'It crosses the $y$-axis at $(0, ' + fr(r.b, r.d) + ')$ and the $x$-axis at $(' + fr(-r.b, r.a) + ', 0)$. These are different points because neither constant term is zero, so there are 2.');
    } },
    { skill: 'crossings', gen: function () {
      var r = mkRat({ b0: true });
      return N('crossings', 'How many points does the curve $y = \\dfrac{' + lin(r.a, 0) + '}{' + r.denTex + '}$ have in common with the coordinate axes (counting a point on both axes once)?',
        1, 0.1, T('1'), 'Putting $x = 0$ gives $y = 0$, and $y = 0$ requires $x = 0$. The only axis point is the origin, so the answer is 1.');
    } },
    { skill: 'corners', gen: function () {
      var h = nz(-4, 4), k = nz(-4, 4), m = nz(-6, 6);
      var s = m > 0;
      var tex = k + ' ' + (m < 0 ? '- ' : '+ ') + '\\dfrac{' + ab(m) + '}{x ' + (h > 0 ? '- ' : '+ ') + ab(h) + '}';
      return Q('corners', 'The curve $y = ' + tex + '$ has asymptotes $x = ' + h + '$ and $y = ' + k + '$. For $x \\gt ' + h + '$ the curve lies:',
        s ? 'above the line $y = ' + k + '$' : 'below the line $y = ' + k + '$', [s ? 'below the line $y = ' + k + '$' : 'above the line $y = ' + k + '$', 'on the line $y = ' + k + '$', 'to the left of the line $x = ' + h + '$'],
        'For $x \\gt ' + h + '$ the denominator $x ' + (h > 0 ? '- ' : '+ ') + ab(h) + '$ is positive, so the fraction $' + (m < 0 ? '-' : '') + '\\frac{' + ab(m) + '}{x ' + (h > 0 ? '- ' : '+ ') + ab(h) + '}$ is ' + (s ? 'positive' : 'negative') + '. Adding it to ' + k + ' puts $y$ ' + (s ? 'above' : 'below') + ' ' + k + '. The other branch is in the opposite corner.');
    } },
    { skill: 'intercept-form', gen: function () {
      var r = mkRat(), yv = fr(r.b, r.d);
      return Q('intercept-form', 'On a sketch of $y = ' + r.tex + '$, how should the $y$-axis crossing be labelled?',
        T(coord(0, yv)), [T(coord(0, dec(r.b / r.d, 1))), T(coord(yv, 0)), T('y = ' + yv)],
        'The crossing is the point $(0, ' + yv + ')$ with the exact value. A rounded decimal, swapped coordinates or an equation of a line would not earn the mark.');
    } },
    { skill: 'sketch-features', kind: 'mcq', q: 'How should the asymptotes be drawn on a sketch of a rational curve?', options: ['As dashed lines, each labelled with its equation', 'As solid lines, with no labels', 'As dotted lines through the intercepts', 'They are not drawn, only described'], answer: 0,
      why: 'Asymptotes are the framework for the curve. They are drawn as dashed lines and labelled with their equations so the examiner can see what you have found.' }
  ] };

  // =====================================================================
  // FPM-GRA-07 Finding the unknown letters in a rational curve
  // =====================================================================
  B['FPM-GRA-07'] = { title: 'Finding the unknown letters in a rational curve', items: [
    { skill: 'denominator', gen: function () {
      var k = nz(-7, 7), q = nz(-5, 5), p = nz(-4, 4);
      return N('denominator', 'The curve $y = \\dfrac{' + lin(p, q) + '}{x + r}$ has vertical asymptote $x = ' + k + '$. Find the value of $r$.',
        -k, 1e-9, T(String(-k)), 'The denominator is zero when $x = ' + k + '$: $' + k + ' + r = 0$, so $r = ' + (-k) + '$.');
    } },
    { skill: 'horizontal', gen: function () {
      var m = nz(-6, 6), r = nz(-5, 5), q = nz(-5, 5);
      return N('horizontal', 'The curve $y = \\dfrac{px ' + (q < 0 ? '- ' : '+ ') + ab(q) + '}{x ' + (r < 0 ? '- ' : '+ ') + ab(r) + '}$ has horizontal asymptote $y = ' + m + '$. Find the value of $p$.',
        m, 1e-9, T(String(m)), 'The horizontal asymptote is (coefficient of $x$ on top) $\\div$ (coefficient of $x$ below) $= \\dfrac{p}{1} = p$. So $p = ' + m + '$.');
    } },
    { skill: 'intercept', gen: function () {
      var r = nz(-5, 5), n = nz(-4, 4), p = nz(-4, 4);
      return N('intercept', 'The curve $y = \\dfrac{' + (p === 1 ? '' : p === -1 ? '-' : p) + 'x + q}{x ' + (r < 0 ? '- ' : '+ ') + ab(r) + '}$ crosses the $y$-axis at $(0, ' + n + ')$. Find the value of $q$.',
        n * r, 1e-9, T(String(n * r)), 'Put $x = 0$: $\\dfrac{q}{' + r + '} = ' + n + '$, so $q = ' + n + '\\times ' + r + ' = ' + (n * r) + '$.');
    } },
    { skill: 'intercept', gen: function () {
      var s = nz(-4, 4), p = pick([2, 3, 4, 5]), d = nz(-5, 5);
      return N('intercept', 'The curve $y = \\dfrac{' + p + 'x + q}{x ' + (d < 0 ? '- ' : '+ ') + ab(d) + '}$ crosses the $x$-axis at $(' + s + ', 0)$. Find the value of $q$.',
        -p * s, 1e-9, T(String(-p * s)), 'The numerator is zero at the $x$-intercept: $' + p + '(' + s + ') + q = 0$, so $q = ' + (-p * s) + '$.');
    } },
    { skill: 'combined', gen: function () {
      var h = nz(-5, 5), m = nz(-4, 4), n = nz(-4, 4);
      // y = (p x + q)/(x + r): x = h asymptote -> r = -h ; y = m -> p = m ; y-int n -> q = n r
      var r = -h, q = n * r;
      return N('combined', 'The curve $y = \\dfrac{px + q}{x + r}$ has vertical asymptote $x = ' + h + '$, horizontal asymptote $y = ' + m + '$ and crosses the $y$-axis at $(0, ' + n + ')$. Find the value of $q$.',
        q, 1e-9, T(String(q)), 'The vertical asymptote gives $r = ' + r + '$ and the horizontal asymptote gives $p = ' + m + '$. Then $x = 0$: $\\dfrac{q}{' + r + '} = ' + n + '$, so $q = ' + q + '$. The curve is $y = \\dfrac{' + lin(m, q) + '}{' + lin(1, r) + '}$.');
    } },
    { skill: 'combined', gen: function () {
      var k = nz(-5, 5), m = nz(-5, 5), a = nz(-8, 8);
      // y = (a - b x)/(x - d): asymptotes x = k -> d = k ; y = m -> -b = m -> b = -m
      return N('combined', 'The curve $y = \\dfrac{a - bx}{x - d}$ has vertical asymptote $x = ' + k + '$ and horizontal asymptote $y = ' + m + '$. Find the value of $b$.',
        -m, 1e-9, T(String(-m)), 'The numerator $a - bx$ has $x$-coefficient $-b$ and the denominator has $1$. The horizontal asymptote is $-b = ' + m + '$, so $b = ' + (-m) + '$. (Also $d = ' + k + '$ from the vertical asymptote.)');
    } },
    { skill: 'sign-vertical', gen: function () {
      var k = pick([-6, -5, -4, -2, 2, 4, 5, 6]);
      return Q('sign-vertical', 'The curve $y = \\dfrac{3x + 1}{x + r}$ has vertical asymptote $x = ' + k + '$. Which is the correct value of $r$?',
        T('r = ' + (-k)), [T('r = ' + k), T('r = ' + fr(1, -k === 0 ? 1 : -k)), T('r = ' + fr(3, k))],
        'The denominator must be zero at $x = ' + k + '$: $' + k + ' + r = 0$, so $r = ' + (-k) + '$. A common slip is to write $r = ' + k + '$, which puts the asymptote at $x = ' + (-k) + '$.');
    } },
    { skill: 'condition', gen: function () {
      var mn = pick([[3, 2], [3, 4], [6, 5], [5, 2], [4, 5], [8, 5], [7, 4], [9, 4], [7, 5], [9, 5]]);
      return N('condition', 'The curve $y = \\dfrac{ax + 3}{bx + 2}$ has horizontal asymptote $y = ' + (mn[0] / mn[1]) + '$, where $a$ and $b$ are positive integers with no common factor. Find $a + b$.',
        mn[0] + mn[1], 1e-9, T(String(mn[0] + mn[1])), 'The asymptote is $\\dfrac{a}{b} = ' + (mn[0] / mn[1]) + ' = \\dfrac{' + mn[0] + '}{' + mn[1] + '}$. With no common factor, $a = ' + mn[0] + '$ and $b = ' + mn[1] + '$, so $a + b = ' + (mn[0] + mn[1]) + '$.');
    } },
    { skill: 'find-wrong-step', gen: function () {
      var h = pick([-5, -4, -3, -2, 2, 3, 4, 5]), m = pick([-4, -3, -2, 2, 3, 4]), n = nz(-4, 4), r = -h, p = m, q = n * r, err = rint(1, 3);
      var s1 = 'Vertical asymptote $x = ' + h + '$, so $r = ' + (err === 1 ? h : r) + '$.';
      var s2 = 'Horizontal asymptote $y = ' + m + '$, so $p = ' + (err === 2 ? fr(1, m) : m) + '$.';
      var s3 = 'At $x = 0$, $y = ' + n + '$, so $\\dfrac{q}{r} = ' + n + '$ and $q = ' + (err === 3 ? fr(n, r) : n * r) + '$.';
      return M('find-wrong-step', 'A curve $y = \\dfrac{px + q}{x + r}$ has vertical asymptote $x = ' + h + '$, horizontal asymptote $y = ' + m + '$ and passes through $(0, ' + n + ')$. A student writes:<br>Step 1: ' + s1 + '<br>Step 2: ' + s2 + '<br>Step 3: ' + s3 + '<br>Which step contains the error?',
        ['Step 1', 'Step 2', 'Step 3', 'No step is wrong'], err - 1,
        err === 1 ? 'The denominator $x + r$ is zero at $x = ' + h + '$, so $r = ' + r + '$, not $' + h + '$.' :
          err === 2 ? 'The ratio of the $x$-coefficients is $\\dfrac{p}{1} = p$, so $p = ' + m + '$. The reciprocal is wrong.' :
            'From $\\dfrac{q}{r} = ' + n + '$, multiply both sides by $r = ' + r + '$ to get $q = ' + n + '\\times ' + r + ' = ' + (n * r) + '$; do not divide.');
    } },
    { skill: 'sign-vertical', gen: function () {
      var k = nz(-6, 6), c = rint(2, 4);
      return Q('sign-vertical', 'The curve $y = \\dfrac{5 - 2x}{' + c + 'x - d}$ has vertical asymptote $x = ' + k + '$. Which is the value of $d$?',
        T('d = ' + c * k), [T('d = ' + (-c * k)), T('d = ' + k), T('d = ' + fr(k, c))],
        'The denominator is zero at $x = ' + k + '$: $' + c + '(' + k + ') - d = 0$, so $d = ' + (c * k) + '$.');
    } },
    { skill: 'horizontal', gen: function () {
      var c = rint(2, 5), mm = nz(-4, 4), a = c * mm;
      return N('horizontal', 'The curve $y = \\dfrac{ax + 1}{' + c + 'x - 3}$ has horizontal asymptote $y = ' + mm + '$. Find the value of $a$.',
        a, 1e-9, T(String(a)), 'The horizontal asymptote is $\\dfrac{a}{' + c + '} = ' + mm + '$, so $a = ' + mm + '\\times ' + c + ' = ' + a + '$.');
    } },
    { skill: 'show-that', gen: function () {
      var k = rint(2, 6), m = nz(-4, 4), n = nz(-5, 5);
      return N('show-that', 'The curve $y = \\dfrac{px + q}{x + r}$ has asymptotes $x = ' + (-k) + '$ and $y = ' + m + '$ and passes through $(0, ' + n + ')$. Work out $p + q + r$.',
        m + n * k + k, 1e-9, T(String(m + n * k + k)), 'Vertical asymptote $x = ' + (-k) + '$ gives $r = ' + k + '$. Horizontal gives $p = ' + m + '$. Then $\\dfrac{q}{' + k + '} = ' + n + '$, so $q = ' + (n * k) + '$. Therefore $p + q + r = ' + m + ' + (' + (n * k) + ') + ' + k + ' = ' + (m + n * k + k) + '$.');
    } }
  ] };

  // =====================================================================
  // FPM-GRA-08 Solving an equation with your graph and a straight line
  // =====================================================================
  B['FPM-GRA-08'] = { title: 'Solving an equation with your graph and a straight line', items: [
    { skill: 'rearrange-cubic', gen: function () {
      var A, Bc, C, m, c, k = 0;
      do { A = rint(1, 3); Bc = nz(-4, 4); C = nz(-4, 4); m = nz(-3, 3); c = nz(-4, 4); k++; } while ((A === m || C === c) && k < 100);
      var cur = (A === 1 ? '' : A) + 'x ' + (Bc < 0 ? '- ' : '+ ') + '\\dfrac{' + ab(Bc) + '}{x^2} ' + (C < 0 ? '- ' : '+ ') + ab(C);
      var eq = poly([A - m, C - c, 0, Bc]);
      return Q('rearrange-cubic', 'The graph of $y = ' + cur + '$ has been drawn. A straight line is to be drawn on the same grid to solve $' + eq + ' = 0$. Which is the equation of the line?',
        T('y = ' + lin(m, c)), [T('y = ' + lin(-m, -c)), T('y = ' + lin(m, -c)), T('y = ' + lin(-m, c))],
        'Divide the equation by $x^2$: $' + lin(A - m, C - c) + ' ' + (Bc < 0 ? '- ' : '+ ') + '\\frac{' + ab(Bc) + '}{x^2} = 0$. Rearrange so that the left side is exactly the plotted curve: $' + cur + ' = ' + lin(m, c) + '$. The line is $y = ' + lin(m, c) + '$.');
    } },
    { skill: 'find-line', gen: function () {
      var A, Bc, C, m, c, k = 0;
      do { A = rint(1, 3); Bc = nz(-4, 4); C = nz(-4, 4); m = nz(-3, 3); c = nz(-4, 4); k++; } while ((A === m || C === c) && k < 100);
      var cur = (A === 1 ? '' : A) + 'x ' + (Bc < 0 ? '- ' : '+ ') + '\\dfrac{' + ab(Bc) + '}{x^2} ' + (C < 0 ? '- ' : '+ ') + ab(C);
      var eq = poly([A - m, C - c, 0, Bc]);
      var askM = Math.random() < 0.5;
      return N('find-line', 'The curve $y = ' + cur + '$ is drawn. To solve $' + eq + ' = 0$ a line $y = mx + c$ is drawn on the same grid. Find the value of ' + (askM ? '$m$' : '$c$') + '.',
        askM ? m : c, 1e-9, T(String(askM ? m : c)), 'Divide by $x^2$ to get $' + lin(A - m, C - c) + ' ' + (Bc < 0 ? '- ' : '+ ') + '\\frac{' + ab(Bc) + '}{x^2} = 0$, then rearrange so the left side is the curve: $' + cur + ' = ' + lin(m, c) + '$. So $m = ' + m + '$ and $c = ' + c + '$.');
    } },
    { skill: 'rearrange-poly', gen: function () {
      var a = nz(-3, 3), b = nz(-5, 5), m = nz(-3, 3), c = nz(-5, 5);
      var cur = poly([1, a, b, 0]), eq = poly([1, a, b - m, -c]);
      return Q('rearrange-poly', 'The graph of $y = ' + cur + '$ has been drawn. Which straight line should be drawn to solve $' + eq + ' = 0$?',
        T('y = ' + lin(m, c)), [T('y = ' + lin(-m, -c)), T('y = ' + lin(m, -c)), T('y = ' + lin(-m, c))],
        'Move the extra terms to the right: $' + cur + ' = ' + lin(m, c) + '$. The left side is the plotted curve, so the line is $y = ' + lin(m, c) + '$.');
    } },
    { skill: 'rearrange-poly', gen: function () {
      var a = nz(-3, 3), b = nz(-5, 5), e = nz(-5, 5), m = b - e, c = nz(-5, 5);
      var cur = poly([1, a, b, 0]), eq = poly([1, a, e, -c]);
      return N('rearrange-poly', 'The curve $y = ' + cur + '$ is drawn. A line $y = mx + c$ drawn on the same grid solves $' + eq + ' = 0$. Find the gradient $m$.',
        m, 1e-9, T(String(m)), 'Write the equation as $' + cur + ' = ' + lin(m, c) + '$: the $x$ terms differ by $' + b + ' - (' + e + ') = ' + m + '$. So $m = ' + m + '$ and $c = ' + c + '$.');
    } },
    { skill: 'rearrange-trig', gen: function () {
      var n = pick([2, 3, 4]), kk = pick([1, 2]);
      var line = linRev(kk, -1 / n); // not used for display
      var good = 'y = ' + kk + ' - \\dfrac{x}{' + n + '}';
      return Q('rearrange-trig', 'The graph of $y = \\sin x$ (with $x$ in radians) is drawn. Which line should be drawn to solve ' + T(n + '\\sin x + x = ' + (n * kk)) + '?',
        T(good), [T('y = ' + kk + ' + \\dfrac{x}{' + n + '}'), T('y = ' + (n * kk) + ' - x'), T('y = ' + kk + ' - ' + n + 'x')],
        'Divide by ' + n + ': $\\sin x + \\dfrac{x}{' + n + '} = ' + kk + '$, so $\\sin x = ' + kk + ' - \\dfrac{x}{' + n + '}$. The line is $' + good + '$.');
    } },
    { skill: 'rearrange-trig', gen: function () {
      var q = pick([2, 4, 6]), p = pick([-3, -1, 3, 5]), c0 = (1 - p) / 2, mm = q / 2;
      return Q('rearrange-trig', 'The graph of $y = \\sin^2 x$ is drawn, with $x$ in radians. Using $\\cos 2x = 1 - 2\\sin^2 x$, which line should be drawn to solve $\\cos 2x = ' + p + ' - ' + q + 'x$?',
        T('y = ' + lin(mm, c0)), [T('y = ' + lin(-mm, c0)), T('y = ' + lin(q, 1 - p)), T('y = ' + lin(mm, -c0))],
        'Replace $\\cos 2x$: $1 - 2\\sin^2 x = ' + p + ' - ' + q + 'x$, so $2\\sin^2 x = ' + (1 - p) + ' + ' + q + 'x$ and $\\sin^2 x = ' + lin(mm, c0) + '$.');
    } },
    { skill: 'horizontal-line', gen: function () {
      var A = rint(1, 3), Bc = nz(-4, 4), C = nz(-4, 4), D = nz(-5, 5);
      while (C === D) D = nz(-5, 5);
      var cur = (A === 1 ? '' : A) + 'x ' + (Bc < 0 ? '- ' : '+ ') + '\\dfrac{' + ab(Bc) + '}{x^2} ' + (C < 0 ? '- ' : '+ ') + ab(C);
      var eq = poly([A, D, 0, Bc]);
      return N('horizontal-line', 'The curve $y = ' + cur + '$ is drawn. The equation $' + eq + ' = 0$ is solved by drawing the horizontal line $y = k$. Find $k$.',
        C - D, 1e-9, T(String(C - D)), 'Divide by $x^2$: $' + (A === 1 ? '' : A) + 'x ' + (Bc < 0 ? '- ' : '+ ') + '\\frac{' + ab(Bc) + '}{x^2} ' + (D < 0 ? '- ' : '+ ') + ab(D) + ' = 0$. ' + (C - D < 0 ? 'Subtract $' + ab(C - D) + '$ from' : 'Add $' + (C - D) + '$ to') + ' both sides so that the left side becomes the curve: $' + cur + ' = ' + (C - D) + '$. So $k = ' + (C - D) + '$.');
    } },
    { skill: 'plot-line', gen: function () {
      var m = nz(-3, 3), c = nz(-5, 5), x1 = rint(2, 4), x0 = -rint(1, 3);
      return N('plot-line', 'You draw the line $y = ' + lin(m, c) + '$ across the grid. Work out the $y$-coordinate of the point on the line where $x = ' + x1 + '$.',
        m * x1 + c, 1e-9, T(String(m * x1 + c)), 'Substitute $x = ' + x1 + '$: $y = (' + m + ')(' + x1 + ') ' + (c < 0 ? '- ' : '+ ') + ab(c) + ' = ' + (m * x1 + c) + '$. Plot two or three such points and join them with a ruler.');
    } },
    { skill: 'read-roots', gen: function () {
      var lo = rint(0, 1), hi = rint(3, 4), xs = [], used = {};
      var x1 = -(rint(5, 15) / 10), x2 = lo + rint(2, 8) / 10, x3 = x2 + rint(5, 15) / 10;
      while (x3 >= hi) x3 -= 0.4;
      x3 = R.roundDp(x3, 1);
      var ys = [R.roundDp(rint(20, 70) / 10, 1), R.roundDp(rint(5, 30) / 10, 1), R.roundDp(rint(20, 70) / 10, 1)];
      var ok = [x2, x3];
      return Q('read-roots', 'A line meets a curve at the points $(' + x1 + ', ' + ys[0] + ')$, $(' + x2 + ', ' + ys[1] + ')$ and $(' + x3 + ', ' + ys[2] + ')$. The question asks for estimates of the roots for $' + lo + ' \\leqslant x \\leqslant ' + hi + '$, to 1 decimal place. Which answer is correct?',
        T('x = ' + x2 + ' \\text{ and } x = ' + x3), [T('x = ' + x1 + ', x = ' + x2 + ' \\text{ and } x = ' + x3), T('x = ' + ys[1] + ' \\text{ and } x = ' + ys[2]), T('x = ' + x2 + ' \\text{ only}')],
        'The roots are the $x$-coordinates of the intersections, and only those inside $' + lo + ' \\leqslant x \\leqslant ' + hi + '$ count. The point with $x = ' + x1 + '$ is outside the interval, and the $y$-coordinates are not roots.');
    } },
    { skill: 'read-roots', gen: function () {
      var lo = pick([-2, -1, 0]), hi = pick([2, 3]);
      var pts = [R.roundDp(lo - 0.6 - rint(0, 5) / 10, 1), R.roundDp(lo + 0.3 + rint(0, 8) / 10, 1), R.roundDp(hi - 1.2 + rint(0, 5) / 10, 1), R.roundDp(hi + 0.4 + rint(0, 6) / 10, 1)];
      var cnt = pts.filter(function (x) { return x >= lo && x <= hi; }).length;
      return N('read-roots', 'A line crosses a curve at points whose $x$-coordinates are $' + pts.join(', ') + '$. How many roots of the equation lie in the interval $' + lo + ' \\leqslant x \\leqslant ' + hi + '$?',
        cnt, 0.1, T(String(cnt)), 'Only intersections with $x$ between $' + lo + '$ and $' + hi + '$ count as roots. Here that is ' + cnt + ' of the four.');
    } },
    { skill: 'method', kind: 'mcq', q: 'A student draws a line only from $x = 0$ to $x = 1$, but the curve is plotted for $-2 \\leqslant x \\leqslant 3$. What is the risk?', options: ['The line may miss intersections that lie elsewhere in the interval, so some roots are lost', 'The line will have the wrong gradient', 'The curve will have to be redrawn', 'There is no risk if the points were right'], answer: 0,
      why: 'Extend the line across the whole interval using two or three points. A short line can miss a root.' },
    { skill: 'method', kind: 'mcq', q: 'After drawing the line, a student reads off the $y$-coordinates of the intersection points as the roots. What is wrong?', options: ['The roots are the $x$-coordinates of the intersections', 'Nothing is wrong, $y$ is the unknown', 'They should read the gradient of the line', 'They should give the intercepts of the line'], answer: 0,
      why: 'The equation is in $x$, so its solutions are the $x$-values where the curve and the line meet.' }
  ] };

  // =====================================================================
  // FPM-GRA-09 Solving log and exponential equations with your graph
  // =====================================================================
  B['FPM-GRA-09'] = { title: 'Solving log and exponential equations with your graph', items: [
    { skill: 'exp-switch', gen: function () {
      var a = rint(1, 3), b = nz(-3, 3), p = rint(1, 9), q = nz(-3, 3);
      var ex = lin(a, b);
      return Q('exp-switch', 'The graph of $y = e^{' + ex + '}$ is drawn. Which line should be drawn to solve $\\ln(' + linRev(p, -q) + ') = ' + ex + '$?',
        T('y = ' + linRev(p, -q)), [T('y = ' + linRev(p, q)), T('y = ' + pw('e', p) + ' ' + (q < 0 ? '+ ' : '- ') + (ab(q) === 1 ? '' : ab(q)) + 'x'), T('y = \\ln(' + linRev(p, -q) + ')')],
        'Take $e$ of both sides: $' + linRev(p, -q) + ' = e^{' + ex + '}$. The right side is the plotted curve, so the line is $y = ' + linRev(p, -q) + '$.');
    } },
    { skill: 'exp-switch', gen: function () {
      var a = rint(1, 3), b = nz(-3, 3), p = rint(1, 9), q = nz(-3, 3);
      var ex = lin(a, b), askM = Math.random() < 0.5;
      return N('exp-switch', 'The graph of $y = e^{' + ex + '}$ is drawn. A line $y = mx + c$ is drawn to solve $\\ln(' + linRev(p, -q) + ') = ' + ex + '$. Find ' + (askM ? 'the gradient $m$' : 'the value of $c$') + '.',
        askM ? -q : p, 1e-9, T(String(askM ? -q : p)), 'Exponentiating: $' + linRev(p, -q) + ' = e^{' + ex + '}$, so the line is $y = ' + linRev(p, -q) + '$, which is $y = ' + lin(-q, p) + '$. So ' + (askM ? '$m = ' + (-q) + '$' : '$c = ' + p + '$') + '.');
    } },
    { skill: 'log-law', gen: function () {
      var a = rint(2, 4), pp = nz(-3, 3), qq = nz(-3, 3), P = a * (pp + 4), Qc = a * qq;
      var ex = linRev(P, -Qc);
      return N('log-law', 'The graph of $y = \\ln x$ is drawn. To solve $\\ln(x^{' + a + '}) = ' + ex + '$ a line $y = mx + c$ is drawn. Find the gradient $m$.',
        -Qc / a, 1e-9, T(String(-Qc / a)), 'Use $\\ln(x^{' + a + '}) = ' + a + '\\ln x$ and divide by ' + a + ': $\\ln x = ' + linRev(P / a, -Qc / a) + '$. The gradient is $' + (-Qc / a) + '$.');
    } },
    { skill: 'log-law', gen: function () {
      var a = rint(2, 4), pp = rint(1, 5), qq = nz(-3, 3), P = a * pp, Qc = a * qq;
      return N('log-law', 'The graph of $y = \\ln x$ is drawn. To solve $\\ln(x^{' + a + '}) = ' + linRev(P, -Qc) + '$ a line $y = mx + c$ is drawn. Find $c$.',
        pp, 1e-9, T(String(pp)), 'Use $\\ln(x^{' + a + '}) = ' + a + '\\ln x$, then divide by ' + a + ': $\\ln x = ' + linRev(pp, -qq) + '$. So $c = ' + pp + '$.');
    } },
    { skill: 'log-law', gen: function () {
      var a = rint(2, 5), b = rint(2, 6);
      return Q('log-law', 'Which of these is a correct use of a log law?',
        T('\\ln(x^{' + a + '}) = ' + a + '\\ln x'), [T('\\ln(' + b + ' - x) = \\ln ' + b + ' - \\ln x'), T('\\ln(x + ' + b + ') = \\ln x + \\ln ' + b), T('(\\ln x)^{' + a + '} = ' + a + '\\ln x')],
        'The power law $\\log a^n = n\\log a$ is correct. There is no rule for the log of a sum or difference: $\\ln(' + b + ' - x)$ cannot be split, and $(\\ln x)^{' + a + '}$ is not $\\ln(x^{' + a + '})$.');
    } },
    { skill: 'log-law', gen: function () {
      var a = rint(2, 5), c = rint(2, 8);
      return Q('log-law', 'A student rearranges $\\ln(' + c + ' - x) = 2x$ and writes $\\ln ' + c + ' - \\ln x = 2x$. Which statement is correct?',
        'The first step is invalid: $\\ln(' + c + ' - x)$ cannot be split. Instead write $' + c + ' - x = e^{2x}$', ['The step is valid, because the log of a difference is a difference of logs', 'The step is valid only when $x \\gt ' + c + '$', 'The step is invalid; the correct form is $\\ln ' + c + ' - x = 2x$'],
        'There is no law for $\\log(a - b)$. Remove the log by exponentiating the whole equation: $' + c + ' - x = e^{2x}$, then draw the line $y = ' + c + ' - x$ against the curve $y = e^{2x}$.');
    } },
    { skill: 'switch-form', gen: function () {
      var b = pick([2, 3, 5]), n = rint(1, 3), k = nz(-4, 6), xv = Math.pow(b, n) - k;
      return N('switch-form', 'Solve $\\log_{' + b + '}(x ' + (k < 0 ? '- ' : '+ ') + ab(k) + ') = ' + n + '$ for $x$.',
        xv, 1e-9, T(String(xv)), 'Switch to power form: $x ' + (k < 0 ? '- ' : '+ ') + ab(k) + ' = ' + pw(b, n) + ' = ' + Math.pow(b, n) + '$, so $x = ' + xv + '$.');
    } },
    { skill: 'exp-base', gen: function () {
      var b = pick([2, 3]), n = rint(1, 2), s = Math.pow(b, n), pp = rint(1, 4) * s, qq = nz(-3, 3) * s;
      return N('exp-base', 'The graph of $y = ' + b + '^x$ is drawn. A line $y = mx + c$ is drawn to solve $' + b + '^{x + ' + n + '} = ' + linRev(pp, -qq) + '$. Find the gradient $m$.',
        -qq / s, 1e-9, T(String(-qq / s)), 'Use $' + b + '^{x + ' + n + '} = ' + b + '^x \\times ' + s + '$ and divide by ' + s + ': $' + b + '^x = ' + linRev(pp / s, -qq / s) + '$. The gradient is $' + (-qq / s) + '$.');
    } },
    { skill: 'exp-base', gen: function () {
      var b = pick([2, 3]), n = rint(1, 2), s = Math.pow(b, n), pp = rint(1, 4) * s, qq = nz(-3, 3) * s;
      return Q('exp-base', 'The graph of $y = ' + b + '^x$ is drawn. Which line solves $' + b + '^{x + ' + n + '} = ' + linRev(pp, -qq) + '$?',
        T('y = ' + linRev(pp / s, -qq / s)), [T('y = ' + linRev(pp, -qq)), T('y = ' + linRev(pp / s, -qq)), T('y = ' + linRev(pp / s, qq / s))],
        'Since $' + b + '^{x + ' + n + '} = ' + s + '\\times ' + b + '^x$, divide the whole right side by ' + s + ': $' + b + '^x = ' + linRev(pp / s, -qq / s) + '$. Dividing only one term would be a slip.');
    } },
    { skill: 'change-base', gen: function () {
      var b = pick([2, 3, 5]), p = rint(2, 6), qq = rint(1, 3), lnb = Math.log(b);
      var m = -qq * lnb, c = p * lnb;
      return N('change-base', 'The graph of $y = \\ln x$ is drawn. To solve $\\log_{' + b + '} x = ' + p + ' - ' + (qq === 1 ? '' : qq) + 'x$ a line $y = mx + c$ is drawn. Find $c$, to 2 decimal places.',
        R.roundDp(c, 2), 0.005, T(dec(c, 2)), 'Use $\\log_{' + b + '} x = \\dfrac{\\ln x}{\\ln ' + b + '}$, so $\\ln x = \\ln ' + b + '\\times(' + p + ' - ' + (qq === 1 ? '' : qq) + 'x)$. The intercept is $' + p + '\\ln ' + b + ' = ' + dec(c, 2) + '$ (and the gradient is $' + dec(m, 2) + '$).');
    } },
    { skill: 'exp-switch', gen: function () {
      var k = rint(1, 5), mm = rint(1, 3);
      return Q('exp-switch', 'The graph of $y = e^{' + (mm === 1 ? '' : mm) + 'x}$ is drawn. Which line should be drawn to solve $\\ln(x + ' + k + ') = ' + (mm === 1 ? '' : mm) + 'x$?',
        T('y = x + ' + k), [T('y = x - ' + k), T('y = \\ln x + ' + k), T('y = ' + pw('e', k) + 'x')],
        'Exponentiate both sides: $x + ' + k + ' = e^{' + (mm === 1 ? '' : mm) + 'x}$. The line is $y = x + ' + k + '$.');
    } },
    { skill: 'accuracy', gen: function () {
      var v = rint(100, 399) / 100;
      while (safe(v * 10, 0) === false) v = rint(100, 399) / 100;
      return N('accuracy', 'You read a root from the graph as $x = ' + v + '$ and the question asks for 1 decimal place. What do you write?',
        R.roundDp(v, 1), 0.005, T(dec(v, 1)), 'Round $' + v + '$ to 1 decimal place by looking at the second decimal place: $' + dec(v, 1) + '$. The answer is an $x$-value.');
    } },
    { skill: 'switch-form', kind: 'mcq', q: 'Which pair of statements is a correct switch between log form and power form?', options: ['$\\log_3 y = 4 \\Leftrightarrow y = 3^4$', '$\\log_3 y = 4 \\Leftrightarrow y = 4^3$', '$\\ln y = 4 \\Leftrightarrow y = 4e$', '$\\ln y = 4 \\Leftrightarrow y = \\ln 4$'], answer: 0,
      why: '$\\log_b y = k$ means $y = b^k$: the base stays the base. So $\\log_3 y = 4$ means $y = 3^4$, and $\\ln y = 4$ means $y = e^4$.' }
  ] };
})();
