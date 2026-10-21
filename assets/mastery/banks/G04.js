/* Group G04 mastery bank: Coordinate geometry (distance, midpoints and ratios, equations of lines, parallel and perpendicular lines, intersections, areas). Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function rnz(lo, hi) { var v = 0; while (v === 0) v = rint(lo, hi); return v; }          // non-zero random integer
  function rsgn() { return Math.random() < 0.5 ? -1 : 1; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function tex(s) { return '$' + s + '$'; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }            // bracket negatives
  function sgn(n) { return n < 0 ? '- ' + (-n) : '+ ' + n; }                // "+ 3" / "- 3"
  function sub(a, b) { return a + ' - ' + par(b); }                          // "a - (b)"
  function pt(x, y) { return '(' + x + ', ' + y + ')'; }
  function sfTol(x) { return 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - 2); }
  function simp(n) { var a = 1, m = n; for (var i = Math.floor(Math.sqrt(n)); i >= 2; i--) { if (n % (i * i) === 0) { a = i; m = n / (i * i); break; } } return { a: a, m: m }; }
  function surdTex(n) { var s = simp(n); if (s.m === 1) return String(s.a); return (s.a === 1 ? '' : String(s.a)) + '\\sqrt{' + s.m + '}'; }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function fracTex(n, d) {                                                   // reduced fraction, sign in front
    var g = gcd(n, d) || 1; n = n / g; d = d / g; if (d < 0) { n = -n; d = -d; }
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }
  // a x + b y  (zero terms dropped, coefficients of 1 shown as x / -x)
  function lhs(a, b) {
    var s = '';
    [[a, 'x'], [b, 'y']].forEach(function (t) {
      var c = t[0]; if (c === 0) return;
      var body = (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + t[1];
      s += s === '' ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body;
    });
    return s;
  }
  function lineStr(a, b, c) { var s = lhs(a, b); if (c !== 0) s += ' ' + sgn(c); return s + ' = 0'; }
  function eqD(a, b, d) { return lhs(a, b) + ' = ' + d; }                    // ax + by = d
  function normLine(a, b, c) {
    var g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g;
    if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
    return [a + 0, b + 0, c + 0];
  }
  function nl(a, b, c) { var r = normLine(a, b, c); return lineStr(r[0], r[1], r[2]); }
  // line with gradient n/d through (x1,y1), normalised:  n x - d y + (d y1 - n x1) = 0
  function gradLine(n, d, x1, y1) { return nl(n, -d, d * y1 - n * x1); }
  // y = (p/q)x + c
  function yEq(p, q, c) {
    var cs = q === 1 ? (p === 1 ? '' : p === -1 ? '-' : String(p)) : (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}';
    var s = 'y = ' + cs + 'x';
    if (c !== 0) s += ' ' + sgn(c);
    return s;
  }
  function lin(a, v, c) {                                                    // a v + c
    var s = '';
    if (a !== 0) s = (a === 1 ? '' : a === -1 ? '-' : String(a)) + v;
    if (c !== 0) s += s ? ' ' + sgn(c) : String(c);
    return s || '0';
  }
  // a*X + b*Y + c written with the values of X and Y substituted (a value may be a number or a letter such as 'k')
  function substLine(a, b, c, xv, yv) {
    var out = '';
    [[a, xv], [b, yv]].forEach(function (t) {
      var co = t[0], v = t[1]; if (co === 0) return;
      var mag = Math.abs(co), body = typeof v === 'string' ? (mag === 1 ? v : mag + v) : (mag === 1 ? par(v) : mag + '(' + v + ')');
      out += out === '' ? (co < 0 ? '-' : '') + body : (co < 0 ? ' - ' : ' + ') + body;
    });
    if (c !== 0) out += ' ' + sgn(c);
    return out;
  }
  function shuf4(correct, wrongs, fallbacks) {                               // correct first, then unique wrongs, topped up to 4
    var o = [correct];
    wrongs.concat(fallbacks || []).forEach(function (w) { if (o.indexOf(w) < 0 && o.length < 4) o.push(w); });
    return o;
  }
  function mcqT(q, correct, wrongs, fallbacks, why) {                        // options are maths strings, wrapped in $ here
    return { kind: 'mcq', q: q, options: shuf4(correct, wrongs, fallbacks).map(tex), answer: 0, why: why };
  }
  function mc(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function G(skill, f) { return { skill: skill, gen: f }; }
  function numQ(q, answer, why, display, tol) {
    return { kind: 'num', q: q, answer: answer, tol: tol == null ? 1e-9 : tol, display: display == null ? tex(String(answer)) : display, why: why };
  }
  function shoelace(P) { var s = 0; for (var i = 0; i < P.length; i++) { var j = (i + 1) % P.length; s += P[i][0] * P[j][1] - P[j][0] * P[i][1]; } return Math.abs(s) / 2; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
  var RATIOS = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [3, 4], [4, 1]];
  // gradient P/Q in lowest terms with Q >= 1
  function gradPQ(qs) { var P, Q; do { P = rnz(-5, 5); Q = pick(qs || [1, 2, 3, 4, 5]); } while (gcd(P, Q) !== 1); return [P, Q]; }

  // =====================================================================
  // FPM-COO-01 Finding the length between two points
  // =====================================================================
  B['FPM-COO-01'] = { title: 'Finding the length between two points', items: [
    G('distance-integer', function () {
      var t = pick(TRIPLES), a = t[0], b = t[1]; if (Math.random() < 0.5) { var s = a; a = b; b = s; }
      var x1 = rint(-6, 6), y1 = rint(-6, 6), x2 = x1 + rsgn() * a, y2 = y1 + rsgn() * b;
      return numQ('The points $A' + pt(x1, y1) + '$ and $B' + pt(x2, y2) + '$ are plotted on a grid. Find the length $AB$.', t[2],
        'Change in $x$ is $' + sub(x2, x1) + ' = ' + (x2 - x1) + '$ and change in $y$ is $' + sub(y2, y1) + ' = ' + (y2 - y1) + '$. So $AB = \\sqrt{' + a * a + ' + ' + b * b + '} = \\sqrt{' + t[2] * t[2] + '} = ' + t[2] + '$.');
    }),
    G('simplify-surd', function () {
      var dx, dy, n;
      do { dx = rint(1, 9); dy = rint(1, 9); n = dx * dx + dy * dy; } while (simp(n).a === 1 || isSq(n));
      var x1 = rint(-5, 5), y1 = rint(-5, 5), x2 = x1 + rsgn() * dx, y2 = y1 + rsgn() * dy;
      var ans = surdTex(n);
      return mcqT('Find the exact length of the line joining $P' + pt(x1, y1) + '$ and $Q' + pt(x2, y2) + '$, giving your answer as a simplified surd.', ans,
        ['\\sqrt{' + n + '}', surdTex(dx * dx + dy), surdTex((dx + dy) * (dx + dy)), surdTex(n + 2 * dx), surdTex(n + 3)], [surdTex(n + 5), surdTex(n + 7)],
        'The changes are $' + dx + '$ and $' + dy + '$, so $PQ = \\sqrt{' + dx * dx + ' + ' + dy * dy + '} = \\sqrt{' + n + '}$. Take out the largest square factor ' + simp(n).a * simp(n).a + ': $\\sqrt{' + n + '} = ' + ans + '$. Leaving $\\sqrt{' + n + '}$ is not fully simplified.');
    }),
    G('sign-trap', function () {
      var p = rint(1, 7), q = rint(1, 7), r = rint(1, 7), s = rint(1, 7);
      var dx = r + p, dy = s + q;
      return numQ('$A$ is the point $(-' + p + ', -' + q + ')$ and $B$ is the point $(' + r + ', ' + s + ')$. Work out $AB^2$.', dx * dx + dy * dy,
        'Change in $x$ is $' + r + ' - (-' + p + ') = ' + dx + '$ and change in $y$ is $' + s + ' - (-' + q + ') = ' + dy + '$ (subtracting a negative adds). So $AB^2 = ' + dx + '^2 + ' + dy + '^2 = ' + (dx * dx + dy * dy) + '$.');
    }),
    G('working-mcq', function () {
      var x1 = -rint(1, 6), y1 = rint(1, 6), x2 = rint(1, 6), y2 = -rint(1, 6);
      var c = '\\sqrt{(' + sub(x2, x1) + ')^2 + (' + sub(y2, y1) + ')^2}';
      var w1 = '\\sqrt{(' + x2 + ' - ' + (-x1) + ')^2 + (' + sub(y2, y1) + ')^2}';
      var w2 = '\\sqrt{(' + sub(x2, x1) + ')^2 + (' + y2 + ' + ' + y1 + ')^2}';
      var w3 = '\\sqrt{(' + sub(x2, x1) + ') + (' + sub(y2, y1) + ')}';
      var w4 = '(' + sub(x2, x1) + ') + (' + sub(y2, y1) + ')';
      return mcqT('Which expression correctly gives the distance between $A' + pt(x1, y1) + '$ and $B' + pt(x2, y2) + '$?', 'AB = ' + c,
        ['AB = ' + w1, 'AB = ' + w2, 'AB = ' + w3, 'AB = ' + w4], [],
        'The distance formula squares each change before adding, then takes the root, and the change in $x$ must be ' + sub(x2, x1) + ' (not ' + x2 + ' - ' + (-x1) + '). Forgetting the squares or dropping the root gives the other options.');
    }),
    G('compare-lengths', function () {
      var p = rnz(-5, 5), q = rnz(-5, 5), x0 = rint(-4, 4), y0 = rint(-4, 4), L = shuffle(['A', 'B', 'C']);
      var apex = L[0], u = L[1], v = L[2];
      var P = {}; P[apex] = [x0, y0]; P[u] = [x0 + p, y0 + q]; P[v] = [x0 - q, y0 + p];
      var n = p * p + q * q;
      function nm(a, b) { return [a, b].sort().join(''); }
      var correct = nm(apex, u) + ' = ' + nm(apex, v);
      var wr = [nm(apex, u) + ' = ' + nm(u, v), nm(apex, v) + ' = ' + nm(u, v), 'no two sides are equal'];
      var c = correct;
      return { kind: 'mcq', q: 'Triangle $ABC$ has $A' + pt(P.A[0], P.A[1]) + '$, $B' + pt(P.B[0], P.B[1]) + '$ and $C' + pt(P.C[0], P.C[1]) + '$. Which statement is true?',
        options: [tex(c)].concat(wr.map(function (w) { return w.indexOf('no two') === 0 ? 'No two sides have equal length' : tex(w); })), answer: 0,
        why: '$' + nm(apex, u) + '^2 = ' + p * p + ' + ' + q * q + ' = ' + n + '$ and $' + nm(apex, v) + '^2 = ' + q * q + ' + ' + p * p + ' = ' + n + '$, while $' + nm(u, v) + '^2 = ' + 2 * n + '$. So $' + c + '$ and the triangle is isosceles.' };
    }),
    G('scale-ratio', function () {
      var a = rnz(-4, 4), b = rnz(-4, 4), k = rint(2, 5), x0 = rint(-3, 3), y0 = rint(-3, 3);
      var C = [x0 + a, y0 + b], Bp = [x0 + k * b, y0 - k * a];
      return numQ('$A$ is $' + pt(x0, y0) + '$, $B$ is $' + pt(Bp[0], Bp[1]) + '$ and $C$ is $' + pt(C[0], C[1]) + '$. Given that $AB = k \\times AC$, find the value of $k$.', k,
        '$AC^2 = ' + a * a + ' + ' + b * b + ' = ' + (a * a + b * b) + '$ and $AB^2 = ' + k * k * b * b + ' + ' + k * k * a * a + ' = ' + k * k * (a * a + b * b) + '$. So $AB^2 = ' + k * k + ' \\times AC^2$, giving $AB = ' + k + ' \\times AC$.');
    }),
    G('unknown-coord', function () {
      var t = pick(TRIPLES), dx = t[0], dy = t[1], d = t[2], x1 = rint(-4, 4), y1 = rint(-4, 4), x2 = x1 + rsgn() * dx, up = Math.random() < 0.5;
      var k = up ? y1 + dy : y1 - dy;
      return numQ('$A$ is the point $' + pt(x1, y1) + '$ and $B$ is the point $(' + x2 + ', k)$. Given that $AB = ' + d + '$ and that $k ' + (up ? '\\gt ' : '\\lt ') + y1 + '$, find the value of $k$.', k,
        '$AB^2 = ' + d * d + '$, so $(' + sub(x2, x1) + ')^2 + (k - ' + par(y1) + ')^2 = ' + d * d + '$, giving $(k - ' + par(y1) + ')^2 = ' + dy * dy + '$ and $k - ' + par(y1) + ' = \\pm ' + dy + '$. The condition $k ' + (up ? '\\gt ' : '\\lt ') + y1 + '$ picks $k = ' + k + '$.');
    }),
    G('circle-radius', function () {
      var dx = rint(1, 8), dy = rint(1, 8), x1 = rint(-4, 4), y1 = rint(-4, 4);
      return numQ('A circle has centre $C' + pt(x1, y1) + '$ and passes through the point $P' + pt(x1 + rsgn() * dx, y1 + rsgn() * dy) + '$. Find the value of $r^2$, where $r$ is the radius of the circle.', dx * dx + dy * dy,
        'The radius is the distance $CP$, so $r^2 = (\\Delta x)^2 + (\\Delta y)^2 = ' + dx + '^2 + ' + dy + '^2 = ' + (dx * dx + dy * dy) + '$.');
    }),
    G('tan-ratio', function () {
      var adj = pick([2, 4, 5, 8]), opp = rint(1, 9), bx = rint(-3, 3), by = rint(-3, 3);
      var ans = opp / adj;
      return numQ('$A' + pt(bx - adj, by) + '$, $B' + pt(bx, by) + '$ and $C' + pt(bx, by + opp) + '$ are the vertices of a triangle with a right angle at $B$. Find $\\tan \\angle BAC$ as a decimal.', ans,
        '$AB = ' + adj + '$ (horizontal) and $BC = ' + opp + '$ (vertical). $\\tan \\angle BAC = \\frac{BC}{AB} = \\frac{' + opp + '}{' + adj + '} = ' + ans + '$.', tex(String(ans)), 1e-6);
    }),
    G('simplify-surd', function () {
      var a = rint(2, 6), m = pick([2, 3, 5, 6, 7, 10, 11]), n = a * a * m;
      return mcqT('Write $\\sqrt{' + n + '}$ in the form $a\\sqrt{b}$ with $b$ as small as possible.', a + '\\sqrt{' + m + '}',
        [m + '\\sqrt{' + a + '}', (a * a) + '\\sqrt{' + m + '}', '\\sqrt{' + n + '}', (a + 1) + '\\sqrt{' + m + '}'], [(a + 2) + '\\sqrt{' + m + '}'],
        '$' + n + ' = ' + (a * a) + ' \\times ' + m + '$ and ' + (a * a) + ' is a square, so $\\sqrt{' + n + '} = \\sqrt{' + (a * a) + '} \\times \\sqrt{' + m + '} = ' + a + '\\sqrt{' + m + '}$.');
    }),
    G('decimal-sf', function () {
      var dx, dy, n;
      do { dx = rint(2, 9); dy = rint(2, 9); n = dx * dx + dy * dy; } while (isSq(n));
      var x1 = rint(-4, 4), y1 = rint(-4, 4), d = Math.sqrt(n), ans = R.roundSf(d, 3);
      return numQ('Find the distance between $(' + x1 + ', ' + y1 + ')$ and $(' + (x1 + dx) + ', ' + (y1 - dy) + ')$. Give your answer to 3 significant figures.', ans,
        '$d = \\sqrt{' + dx + '^2 + ' + dy + '^2} = \\sqrt{' + n + '} = ' + d.toFixed(4) + '\\ldots$, which is $' + ans + '$ to 3 s.f.', tex(String(ans)), sfTol(ans));
    }),
    mc('common-error', 'Which statement about the distance formula is correct?',
      ['$\\sqrt{3^2 + 4^2} = 5$ but $3 + 4 = 7$, so $\\sqrt{a^2 + b^2}$ is not the same as $a + b$', '$\\sqrt{a^2 + b^2} = a + b$ for all $a$ and $b$', 'The distance between two points changes if you swap which point is called the first', 'The change in $x$ and the change in $y$ should be added before squaring'], 0,
      'Squaring both changes first and taking the root of the sum is Pythagoras: $\\sqrt{3^2+4^2} = 5$, not $7$. Because each change is squared, swapping the two points gives the same distance.'),
    G('conclusion', function () {
      var s = rint(2, 6), t = rint(1, 4), n = s * s * t;
      return { kind: 'mcq', q: 'In triangle $PQR$ it is found that $PQ^2 = ' + n + '$, $PR^2 = ' + n + '$ and $QR^2 = ' + 2 * n + '$. Which is the best conclusion to a "show that" question on the triangle?',
        options: ['$PQ = PR$, so triangle $PQR$ is isosceles', '$PQ^2 = PR^2$ only, so no conclusion is needed', '$QR$ is the longest side, so the triangle is isosceles', 'The three squares are different, so the triangle is scalene'], answer: 0,
        why: 'Two squared lengths are equal, so $PQ = PR$. A "show that" must end with the statement that the triangle is isosceles. ($QR^2 = PQ^2 + PR^2$ also means the angle at $P$ is a right angle.)' };
    })
  ]};

  // =====================================================================
  // FPM-COO-02 Midpoints and points that split a line in a ratio
  // =====================================================================
  B['FPM-COO-02'] = { title: 'Midpoints and points that split a line in a ratio', items: [
    G('midpoint', function () {
      var x1 = rint(-8, 8), y1 = rint(-8, 8), x2 = x1 + 2 * rnz(-5, 5), y2 = y1 + 2 * rnz(-5, 5);
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return mcqT('Find the midpoint of the line segment joining $A' + pt(x1, y1) + '$ and $B' + pt(x2, y2) + '$.', pt(mx, my),
        [pt((x2 - x1) / 2, (y2 - y1) / 2), pt(x1 + x2, y1 + y2), pt(my, mx), pt(mx + 1, my - 1)], [pt(mx - 1, my + 1)],
        'Add the coordinates and halve: $\\left(\\frac{' + par(x1) + ' + ' + par(x2) + '}{2}, \\frac{' + par(y1) + ' + ' + par(y2) + '}{2}\\right) = ' + pt(mx, my) + '$.');
    }),
    G('midpoint-reverse', function () {
      var ax = rint(-6, 6), ay = rint(-6, 6), mx = rint(-5, 5), my = rint(-5, 5), askX = Math.random() < 0.5;
      var bx = 2 * mx - ax, by = 2 * my - ay;
      return numQ('$M' + pt(mx, my) + '$ is the midpoint of $AB$, where $A$ is $' + pt(ax, ay) + '$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $B$.', askX ? bx : by,
        'If $B = (p, q)$ then $\\frac{' + ax + ' + p}{2} = ' + mx + '$ and $\\frac{' + ay + ' + q}{2} = ' + my + '$. So $' + (askX ? 'p = 2(' + mx + ') - ' + par(ax) + ' = ' + bx : 'q = 2(' + my + ') - ' + par(ay) + ' = ' + by) + '$.');
    }),
    G('ratio-point', function () {
      var r = pick(RATIOS), m = r[0], n = r[1], s = m + n, u = rnz(-3, 3), v = rnz(-3, 3), x1 = rint(-6, 6), y1 = rint(-6, 6), askX = Math.random() < 0.5;
      var x2 = x1 + s * u, y2 = y1 + s * v, px = x1 + m * u, py = y1 + m * v;
      return numQ('$A$ is the point $' + pt(x1, y1) + '$ and $B$ is the point $' + pt(x2, y2) + '$. The point $P$ lies on $AB$ with $AP : PB = ' + m + ' : ' + n + '$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $P$.', askX ? px : py,
        'The line is split into $' + s + '$ equal parts and $AP$ is $\\frac{' + m + '}{' + s + '}$ of $AB$. The change in ' + (askX ? '$x$' : '$y$') + ' from $A$ to $B$ is $' + (askX ? x2 - x1 : y2 - y1) + '$, so ' + (askX ? '$x' : '$y') + '_P = ' + (askX ? x1 : y1) + ' + \\frac{' + m + '}{' + s + '} \\times ' + par(askX ? x2 - x1 : y2 - y1) + ' = ' + (askX ? px : py) + '$.');
    }),
    G('ratio-point', function () {
      var r = pick(RATIOS), m = r[0], n = r[1], s = m + n, u = rnz(-3, 3), v = rnz(-3, 3), x1 = rint(-6, 6), y1 = rint(-6, 6);
      var x2 = x1 + s * u, y2 = y1 + s * v, px = x1 + m * u, py = y1 + m * v;
      return mcqT('$A$ is $' + pt(x1, y1) + '$ and $B$ is $' + pt(x2, y2) + '$. Find the coordinates of the point $P$ on $AB$ such that $AP : PB = ' + m + ' : ' + n + '$.', pt(px, py),
        [pt(x1 + n * u, y1 + n * v), pt((x1 + x2) / 2, (y1 + y2) / 2), pt(px + u, py + v)], [pt(px - u, py - v), pt(px + 1, py)],
        '$AP$ is $\\frac{' + m + '}{' + s + '}$ of the way from $A$ to $B$. Move $\\frac{' + m + '}{' + s + '}$ of $(' + (x2 - x1) + ', ' + (y2 - y1) + ')$, which is $(' + m * u + ', ' + m * v + ')$, from $A$ to reach ' + '$' + pt(px, py) + '$. Putting the ratio the wrong way round gives ' + '$' + pt(x1 + n * u, y1 + n * v) + '$.');
    }),
    G('ratio-meaning', function () {
      var m = rint(1, 5), n = rint(1, 5); while (m === n || gcd(m, n) !== 1) { m = rint(1, 5); n = rint(1, 5); }
      var s = m + n;
      return mcqT('The point $P$ lies on the line segment $AB$ with $AP : PB = ' + m + ' : ' + n + '$. What fraction of the length of $AB$ is $AP$?', fracTex(m, s),
        [fracTex(m, n), fracTex(n, s), fracTex(n, m)], [fracTex(m, s + 1)],
        'The segment is split into $' + m + ' + ' + n + ' = ' + s + '$ equal parts and $AP$ takes $' + m + '$ of them, so $AP = \\frac{' + m + '}{' + s + '}AB$. Dividing by $' + n + '$ instead of $' + s + '$ confuses $AP : PB$ with $AP : AB$.');
    }),
    G('parallelogram', function () {
      var ax = rint(-5, 5), ay = rint(-5, 5), bx = rint(-5, 5), by = rint(-5, 5), cx = rint(-5, 5), cy = rint(-5, 5), askX = Math.random() < 0.5;
      while (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by) === 0) { ax = rint(-5, 5); ay = rint(-5, 5); bx = rint(-5, 5); by = rint(-5, 5); cx = rint(-5, 5); cy = rint(-5, 5); }
      var dx = ax + cx - bx, dy = ay + cy - by;
      return numQ('$ABCD$ is a parallelogram with $A' + pt(ax, ay) + '$, $B' + pt(bx, by) + '$ and $C' + pt(cx, cy) + '$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $D$.', askX ? dx : dy,
        'The diagonals $AC$ and $BD$ of a parallelogram bisect each other, so they have the same midpoint. ' + (askX ? '$\\frac{' + ax + ' + ' + par(cx) + '}{2} = \\frac{' + bx + ' + x_D}{2}$ gives $x_D = ' + ax + ' + ' + par(cx) + ' - ' + par(bx) + ' = ' + dx + '$.' : '$\\frac{' + ay + ' + ' + par(cy) + '}{2} = \\frac{' + by + ' + y_D}{2}$ gives $y_D = ' + ay + ' + ' + par(cy) + ' - ' + par(by) + ' = ' + dy + '$.'));
    }),
    G('circle-centre', function () {
      var W = [[3, 4], [4, 3], [5, 0], [0, 5], [-3, 4], [-4, 3]], w1 = pick(W), w2;
      do { w2 = pick(W); } while ((w2[0] === w1[0] && w2[1] === w1[1]) || (w2[0] === -w1[0] && w2[1] === -w1[1]));
      var ox = rint(-4, 4), oy = rint(-4, 4), askX = Math.random() < 0.5;
      return numQ('The points $A' + pt(ox - w1[0], oy - w1[1]) + '$, $B' + pt(ox + w2[0], oy + w2[1]) + '$ and $C' + pt(ox + w1[0], oy + w1[1]) + '$ lie on a circle and angle $ABC = 90^\\circ$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of the centre of the circle.', askX ? ox : oy,
        'The angle in a semicircle is a right angle, so $AC$ (opposite the right angle) is a diameter. The centre is the midpoint of $AC$: ' + (askX ? '$\\frac{' + (ox - w1[0]) + ' + ' + par(ox + w1[0]) + '}{2} = ' + ox + '$.' : '$\\frac{' + (oy - w1[1]) + ' + ' + par(oy + w1[1]) + '}{2} = ' + oy + '$.'));
    }),
    G('ratio-reverse', function () {
      var r = pick(RATIOS), m = r[0], n = r[1], s = m + n, u = rnz(-3, 3), v = rnz(-3, 3), x1 = rint(-5, 5), y1 = rint(-5, 5), askX = Math.random() < 0.5;
      var px = x1 + m * u, py = y1 + m * v, bx = x1 + s * u, by = y1 + s * v;
      return numQ('$A$ is $' + pt(x1, y1) + '$. The point $P' + pt(px, py) + '$ lies on $AB$ with $AP : PB = ' + m + ' : ' + n + '$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $B$.', askX ? bx : by,
        '$AP$ is $\\frac{' + m + '}{' + s + '}$ of $AB$. From $A$ to $P$ the ' + (askX ? '$x$' : '$y$') + '-change is $' + (askX ? px - x1 : py - y1) + '$, so the whole of $AB$ has change $' + (askX ? px - x1 : py - y1) + ' \\times \\frac{' + s + '}{' + m + '} = ' + (askX ? s * u : s * v) + '$. Hence ' + (askX ? '$x_B = ' + bx : '$y_B = ' + by) + '$.');
    }),
    G('midpoint-reverse', function () {
      var cx = rint(-4, 4), cy = rint(-4, 4), p = rint(1, 5), q = rint(1, 5);
      return numQ('$AB$ is a diameter of a circle. $A$ is $' + pt(cx - p, cy + q) + '$ and $B$ is $' + pt(cx + p, cy - q) + '$. Find the sum of the coordinates of the centre of the circle.', cx + cy,
        'The centre is the midpoint of the diameter: $\\left(\\frac{' + (cx - p) + ' + ' + par(cx + p) + '}{2}, \\frac{' + (cy + q) + ' + ' + par(cy - q) + '}{2}\\right) = ' + pt(cx, cy) + '$, so the sum is $' + cx + ' + ' + par(cy) + ' = ' + (cx + cy) + '$.');
    }),
    mc('circle-centre', 'The points $P$, $Q$ and $R$ lie on a circle and angle $PQR = 90^\\circ$. Where is the centre of the circle?',
      ['At the midpoint of $PR$', 'At the midpoint of $PQ$', 'At the midpoint of $QR$', 'At $Q$'], 0,
      'The angle in a semicircle is $90^\\circ$, so the side opposite the right angle, $PR$, is a diameter. The centre is the midpoint of that side, not of a shorter side.'),
    mc('parallelogram', 'In parallelogram $ABCD$, which statement is always true?',
      ['The midpoint of $AC$ is the same as the midpoint of $BD$', 'The midpoint of $AB$ is the same as the midpoint of $CD$', 'The midpoint of $AD$ is the same as the midpoint of $AC$', 'The midpoint of $BC$ is the same as the midpoint of $AC$'], 0,
      'The diagonals of a parallelogram bisect each other. The diagonals are $AC$ and $BD$, so they share a midpoint, and that gives $D = A + C - B$.'),
    mc('ratio-meaning', 'Point $P$ is on $AB$ with $AP : PB = 1 : 4$. Which statement is correct?',
      ['$P$ is $\\frac{1}{5}$ of the way from $A$ to $B$', '$P$ is $\\frac{1}{4}$ of the way from $A$ to $B$', '$P$ is $\\frac{4}{5}$ of the way from $A$ to $B$', '$P$ is the midpoint of $AB$'], 0,
      'There are $1 + 4 = 5$ equal parts altogether, and $AP$ is one of them, so $P$ is $\\frac{1}{5}$ of the way from $A$ to $B$.')
  ]};

  // =====================================================================
  // FPM-COO-03 Writing the equation of a line through two points
  // =====================================================================
  function twoPts() {                                                        // returns A, B on a line with gradient P/Q
    var g = gradPQ(), P = g[0], Q = g[1], t = rint(1, 3), x1 = rint(-5, 5), y1 = rint(-5, 5);
    return { P: P, Q: Q, A: [x1, y1], B: [x1 + t * Q, y1 + t * P], t: t };
  }
  B['FPM-COO-03'] = { title: 'Writing the equation of a line through two points', items: [
    G('gradient', function () {
      var g = gradPQ([1, 2, 4, 5]), P = g[0], Q = g[1], t = rint(1, 3), x1 = rint(-5, 5), y1 = rint(-5, 5), x2 = x1 + t * Q, y2 = y1 + t * P;
      var swap = Math.random() < 0.5, a = swap ? [x2, y2] : [x1, y1], b = swap ? [x1, y1] : [x2, y2];
      return numQ('Find the gradient of the line through $A' + pt(a[0], a[1]) + '$ and $B' + pt(b[0], b[1]) + '$, as a decimal.', P / Q,
        '$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{' + sub(b[1], a[1]) + '}{' + sub(b[0], a[0]) + '} = \\frac{' + (b[1] - a[1]) + '}{' + (b[0] - a[0]) + '} = ' + (P / Q) + '$.', tex(String(P / Q)), 1e-6);
    }),
    G('equation-integer', function () {
      var d = twoPts(), P = d.P, Q = d.Q, A = d.A, B2 = d.B, swap = Math.random() < 0.5, U = swap ? B2 : A, V = swap ? A : B2;
      var ans = gradLine(P, Q, A[0], A[1]);
      return mcqT('Find an equation of the line through $A' + pt(U[0], U[1]) + '$ and $B' + pt(V[0], V[1]) + '$ in the form $ax + by + c = 0$ where $a$, $b$ and $c$ are integers with no common factor and $a \\gt 0$.', ans,
        [gradLine(Q, P, A[0], A[1]), gradLine(-P, Q, A[0], A[1]), nl(P, -Q, Q * A[1] + P * A[0])], [gradLine(P, Q, -A[0], A[1]), gradLine(Q, -P, A[0], A[1]), gradLine(P, Q, A[0] + 1, A[1]), gradLine(P, Q, A[0], A[1] + 1)],
        'Gradient $= \\frac{' + (V[1] - U[1]) + '}{' + (V[0] - U[0]) + '} = ' + fracTex(P, Q) + '$. Then $y - ' + par(A[1]) + ' = ' + fracTex(P, Q) + '(x - ' + par(A[0]) + ')$. Clearing the fraction and collecting terms gives $' + ans + '$. Inverting the gradient or slipping a sign on the point gives the other options.');
    }),
    G('find-c', function () {
      var Q = pick([1, 2, 3, 4, 5]), P, k = rint(-3, 3), t = rint(1, 3), y1 = rint(-6, 6);
      do { P = rnz(-5, 5); } while (gcd(P, Q) !== 1);
      var x1 = Q * k, c = y1 - P * k;
      return numQ('A line passes through $A' + pt(x1, y1) + '$ and $B' + pt(x1 + t * Q, y1 + t * P) + '$. It has equation $y = mx + c$. Find the value of $c$.', c,
        '$m = \\frac{' + (t * P) + '}{' + (t * Q) + '} = ' + fracTex(P, Q) + '$. Using $A$: $' + y1 + ' = ' + fracTex(P, Q) + '(' + x1 + ') + c$, so $c = ' + y1 + ' - ' + par(P * k) + ' = ' + c + '$.');
    }),
    G('equation-slope-intercept', function () {
      var Q = pick([1, 2, 3, 4]), P, k = rint(-3, 3), t = rint(1, 3), y1 = rint(-5, 5);
      do { P = rnz(-5, 5); } while (gcd(P, Q) !== 1);
      var x1 = Q * k, c = y1 - P * k; if (c === 0) { c = 1; y1 += 1; }
      var ans = yEq(P, Q, c);
      return mcqT('Find the equation of the line through $A' + pt(x1, y1) + '$ and $B' + pt(x1 + t * Q, y1 + t * P) + '$ in the form $y = mx + c$.', ans,
        [yEq(Q, P, c) === ans ? yEq(Q, P, c + 1) : yEq(Q, P, c), yEq(-P, Q, c), yEq(P, Q, -c)], [yEq(P, Q, c + 1), yEq(P, Q, c - 1)],
        'Gradient $= \\frac{' + (t * P) + '}{' + (t * Q) + '} = ' + fracTex(P, Q) + '$. Substituting $A$ into $y = mx + c$: $' + y1 + ' = ' + fracTex(P, Q) + '(' + x1 + ') + c$ gives $c = ' + c + '$, so $' + ans + '$.');
    }),
    G('read-gradient', function () {
      var b = pick([-5, -4, -2, -1, 1, 2, 4, 5]), a = rnz(-6, 6), c = rnz(-8, 8);
      return numQ('Find the gradient of the line $' + lineStr(a, b, c) + '$, as a decimal.', -a / b,
        'Rearrange to make $y$ the subject: $' + lhs(0, b) + ' = ' + lhs(-a, 0) + ' ' + sgn(-c) + '$. The gradient is $-\\frac{a}{b} = -\\frac{' + par(a) + '}{' + par(b) + '} = ' + (-a / b) + '$.', tex(String(-a / b)), 1e-6);
    }),
    G('order-trap', function () {
      var a = rint(1, 6), b = rint(-5, 5), c = rint(1, 6), d = rint(-5, 5);
      while (d === b) d = rint(-5, 5);
      var correct = '\\frac{' + sub(d, b) + '}{' + sub(c, -a) + '}';
      return mcqT('Which expression gives the gradient of the line through $A(-' + a + ', ' + b + ')$ and $B(' + c + ', ' + d + ')$?', correct,
        ['\\frac{' + sub(d, b) + '}{' + c + ' - ' + a + '}', '\\frac{' + sub(c, -a) + '}{' + sub(d, b) + '}', '\\frac{' + sub(b, d) + '}{' + sub(c, -a) + '}'], ['\\frac{' + sub(d, b) + '}{' + sub(-a, c) + '}'],
        'Gradient is change in $y$ over change in $x$, with the same order of points top and bottom: $\\frac{' + sub(d, b) + '}{' + c + ' - (-' + a + ')}$. Writing $x_2 - x_1$ as $' + c + ' - ' + a + '$ forgets that $x_1$ is negative, and inverting or swapping the order flips the answer.');
    }),
    G('solve-c', function () {
      var d = twoPts(), P = d.P, Q = d.Q, A = d.A, r = normLine(P, -Q, Q * A[1] - P * A[0]), askC = Math.random() < 0.5;
      return numQ('The line through $A' + pt(A[0], A[1]) + '$ and $B' + pt(d.B[0], d.B[1]) + '$ has equation $ax + by + c = 0$, where $a$, $b$ and $c$ are integers with no common factor and $a \\gt 0$. Find the value of $' + (askC ? 'c' : 'b') + '$.', askC ? r[2] : r[1],
        'Gradient $= ' + fracTex(P, Q) + '$, so $y - ' + par(A[1]) + ' = ' + fracTex(P, Q) + '(x - ' + par(A[0]) + ')$. Clearing the fraction gives $' + lineStr(r[0], r[1], r[2]) + '$ with $a \\gt 0$ and no common factor, so ' + (askC ? '$c = ' + r[2] : '$b = ' + r[1]) + '$.');
    }),
    G('check-point', function () {
      var d = twoPts(), P = d.P, Q = d.Q, A = d.A, ans = gradLine(P, Q, A[0], A[1]), r = normLine(P, -Q, Q * A[1] - P * A[0]);
      var k = rint(2, 4), x = d.B[0] + k * Q, y = d.B[1] + k * P;
      return numQ('A line has equation $' + ans + '$. The point $(' + x + ', k)$ lies on the line. Find $k$.', y,
        'Substitute $x = ' + x + '$: $' + substLine(r[0], r[1], r[2], x, 'k') + ' = 0$, which gives $k = ' + y + '$.');
    }),
    mc('required-form', 'Which of these is <b>not</b> in the form $ax + by + c = 0$ with $a$, $b$, $c$ integers?',
      ['$\\frac{3}{2}x - y + \\frac{1}{2} = 0$', '$6x - 4y + 2 = 0$', '$3x - 2y + 1 = 0$', '$-3x + 2y - 1 = 0$'], 0,
      'The first has fractional coefficients. Multiplying through by $2$ gives $3x - 2y + 1 = 0$, which has integer coefficients. The other three all have integer coefficients.'),
    mc('required-form', 'A line has gradient $\\frac{3}{2}$ and passes through $(4, 1)$. Which equation is the same line?',
      ['$3x - 2y - 10 = 0$', '$3x + 2y - 14 = 0$', '$2x - 3y - 5 = 0$', '$3x - 2y + 10 = 0$'], 0,
      '$y - 1 = \\frac{3}{2}(x - 4)$ gives $2y - 2 = 3x - 12$, so $3x - 2y - 10 = 0$. Check: $3(4) - 2(1) - 10 = 0$.'),
    mc('check', 'You find that the line through $A(1, 5)$ and $B(3, 9)$ is $y = 2x + 3$. What is the quickest check?',
      ['Substitute the coordinates of $B$ (the point not used) into the equation', 'Check that the gradient is positive', 'Check that the equation contains both $x$ and $y$', 'Substitute $x = 0$ only'], 0,
      'A correct line must pass through both points. $A$ was used to find $c$, so substitute $B$: $2(3) + 3 = 9$, which matches, so the line is right.')
  ]};

  // =====================================================================
  // FPM-COO-04 Using a line's equation to find a missing coordinate or intercept
  // =====================================================================
  function randLine() {                                                      // a x + b y + c = 0 through integer point (x0,y0)
    var a = rnz(-5, 5), b = rnz(-5, 5), x0 = rint(-4, 4), y0 = rint(-4, 4);
    return { a: a, b: b, x0: x0, y0: y0, c: -(a * x0 + b * y0) };
  }
  B['FPM-COO-04'] = { title: 'Using a line\'s equation to find a missing coordinate or intercept', items: [
    G('missing-coordinate', function () {
      var L = randLine(), t = rnz(-3, 3), kx = L.x0 + L.b * t, ky = L.y0 - L.a * t, askX = Math.random() < 0.5;
      var ans = askX ? kx : ky;
      return numQ('The point $P' + (askX ? '(k, ' + ky + ')' : '(' + kx + ', k)') + '$ lies on the line $' + lineStr(L.a, L.b, L.c) + '$. Find the value of $k$.', ans,
        'Substitute ' + (askX ? '$y = ' + ky + '$' : '$x = ' + kx + '$') + ' into the equation: $' + (askX ? substLine(L.a, L.b, L.c, 'k', ky) : substLine(L.a, L.b, L.c, kx, 'k')) + ' = 0$, which gives $k = ' + ans + '$.');
    }),
    G('intercept-value', function () {
      var r = rnz(-6, 6), s = rnz(-6, 6), askX = Math.random() < 0.5;
      var a = s, b = r, c = -r * s;
      return numQ('Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of the point where the line $' + lineStr(a, b, c) + '$ crosses the ' + (askX ? '$x$' : '$y$') + '-axis.', askX ? r : s,
        askX ? 'On the $x$-axis $y = 0$, so $' + lhs(a, 0) + ' ' + sgn(c) + ' = 0$, giving $x = ' + r + '$.' : 'On the $y$-axis $x = 0$, so $' + lhs(0, b) + ' ' + sgn(c) + ' = 0$, giving $y = ' + s + '$.');
    }),
    G('intercept-point', function () {
      var m = rnz(-4, 4), c = rnz(-7, 7);
      while (Math.abs(c) === Math.abs(m)) c = rnz(-7, 7);
      return mcqT('Write down the coordinates of the point where the line $' + yEq(m, 1, c) + '$ crosses the $y$-axis.', pt(0, c),
        [pt(c, 0), pt(0, -c), pt(0, m)], [pt(m, 0)],
        'On the $y$-axis $x = 0$, so $y = ' + c + '$ and the point is $' + pt(0, c) + '$. The $y$-coordinate goes second, and the gradient $' + m + '$ is not the intercept.');
    }),
    G('gradient-given', function () {
      var g = gradPQ([2, 3, 4, 5]), P = g[0], Q = g[1], t = rnz(-3, 3), x1 = rint(-5, 5), y1 = rint(-5, 5);
      var a = x1 + t * Q, y2 = y1 + t * P;
      return numQ('A line has gradient $' + fracTex(P, Q) + '$ and passes through $A' + pt(x1, y1) + '$ and $B(a, ' + y2 + ')$. Find the value of $a$.', a,
        '$\\frac{' + y2 + ' - ' + par(y1) + '}{a - ' + par(x1) + '} = ' + fracTex(P, Q) + '$, so $\\frac{' + (y2 - y1) + '}{a - ' + par(x1) + '} = ' + fracTex(P, Q) + '$, giving $a - ' + par(x1) + ' = ' + t * Q + '$ and $a = ' + a + '$.');
    }),
    G('sketch-features', function () {
      var a = rint(2, 5), b = rint(2, 5); while (a === b) b = rint(2, 5);
      var k = rint(2, 3), D = a * b * k;
      return mcqT('A student sketches the line $' + eqD(a, b, D) + '$ by marking its intercepts with the axes. Which pair of points should be joined?', 'x\\text{-axis: } ' + pt(b * k, 0) + ',\\ y\\text{-axis: } ' + pt(0, a * k),
        ['x\\text{-axis: } ' + pt(a * k, 0) + ',\\ y\\text{-axis: } ' + pt(0, b * k), 'x\\text{-axis: } ' + pt(a, 0) + ',\\ y\\text{-axis: } ' + pt(0, b), 'x\\text{-axis: } ' + pt(D, 0) + ',\\ y\\text{-axis: } ' + pt(0, D)], ['x\\text{-axis: } ' + pt(0, b * k) + ',\\ y\\text{-axis: } ' + pt(a * k, 0)],
        'Put $y = 0$: $' + a + 'x = ' + D + '$ so $x = ' + b * k + '$. Put $x = 0$: $' + b + 'y = ' + D + '$ so $y = ' + a * k + '$. The line joins $' + pt(b * k, 0) + '$ and $' + pt(0, a * k) + '$.');
    }),
    G('find-constant', function () {
      var m = rnz(-4, 4), x1 = rnz(-4, 4), c = rnz(-6, 6), y1 = m * x1 + c, findK = Math.random() < 0.5;
      if (findK) {
        return numQ('The line $y = kx ' + sgn(c) + '$ passes through the point $' + pt(x1, y1) + '$. Find the value of $k$.', m,
          'Substitute: $' + y1 + ' = k(' + x1 + ') ' + sgn(c) + '$, so $' + par(x1) + 'k = ' + (y1 - c) + '$ and $k = ' + m + '$.');
      }
      return numQ('The line $y = ' + (m === 1 ? '' : m === -1 ? '-' : m) + 'x + c$ passes through the point $' + pt(x1, y1) + '$. Find the value of $c$.', c,
        'Substitute $x = ' + x1 + '$ and $y = ' + y1 + '$: $' + y1 + ' = ' + par(m) + '(' + x1 + ') + c$, so $c = ' + y1 + ' - ' + par(m * x1) + ' = ' + c + '$.');
    }),
    G('substitution-trap', function () {
      var m = rint(2, 5), c = rnz(-6, 6), yv = rint(2, 9);
      return mcqT('The point $P(a, ' + yv + ')$ lies on the line $y = ' + lin(m, 'x', c) + '$. Which equation should be solved to find $a$?', yv + ' = ' + lin(m, 'a', c),
        ['a = ' + m + '(' + yv + ') ' + sgn(c), '0 = ' + lin(m, 'a', c), yv + ' = ' + m + '(' + yv + ') ' + sgn(c)], ['a = ' + yv + ' ' + sgn(c)],
        'The point has $x = a$ and $y = ' + yv + '$, so substitute $x = a$ and $y = ' + yv + '$ into $y = ' + lin(m, 'x', c) + '$ to give $' + yv + ' = ' + lin(m, 'a', c) + '$. Putting ' + yv + ' in place of $x$, or setting $y = 0$, uses the wrong coordinate.');
    }),
    G('missing-coordinate', function () {
      var L = randLine(), t = rnz(-3, 3), kx = L.x0 + L.b * t, ky = L.y0 - L.a * t;
      return numQ('The point $(p, ' + ky + ')$ lies on the line $' + lineStr(L.a, L.b, L.c) + '$. Find the value of $p$, showing the substitution.', kx,
        'Substitute $y = ' + ky + '$: $' + substLine(L.a, L.b, L.c, 'p', ky) + ' = 0$, which gives $p = ' + kx + '$. In a "show that" part you must show every line of this substitution.');
    }),
    mc('coordinates-form', 'A question asks you to write down where the line $y = 3x - 5$ crosses the $y$-axis. Which answer earns the mark?',
      ['$(0, -5)$', '$-5$', '$(-5, 0)$', '$(5, 0)$'], 0,
      'On the $y$-axis $x = 0$, so $y = -5$. "Coordinates" means a point, so write $(0, -5)$ with the $x$-coordinate first.'),
    mc('substitution-trap', 'The point $(7, k)$ lies on $2x + 3y = 20$. Which line of working is correct?',
      ['$2(7) + 3k = 20$', '$2k + 3(7) = 20$', '$2(7) + 3(7) = 20$', '$7k + 2 + 3 = 20$'], 0,
      'The point is $(x, y) = (7, k)$, so $x = 7$ and $y = k$. This gives $14 + 3k = 20$ and $k = 2$.')
  ]};

  // =====================================================================
  // FPM-COO-05 Parallel and perpendicular lines
  // =====================================================================
  B['FPM-COO-05'] = { title: 'Parallel and perpendicular lines: proving it or finding an unknown', items: [
    G('perp-gradient', function () {
      var Q = pick([1, 2, 4, 5]), P = pick([-5, -4, -2, -1, 1, 2, 4, 5]);
      while (gcd(P, Q) !== 1) P = pick([-5, -4, -2, -1, 1, 2, 4, 5]);
      return numQ('A line has gradient $' + fracTex(P, Q) + '$. Find the gradient of a line perpendicular to it, as a decimal.', -Q / P,
        'Perpendicular gradients multiply to $-1$, so the new gradient is the negative reciprocal: $-\\frac{1}{' + fracTex(P, Q) + '} = ' + fracTex(-Q, P) + ' = ' + (-Q / P) + '$.', tex(String(-Q / P)), 1e-6);
    }),
    G('perp-gradient', function () {
      var g = gradPQ([2, 3, 4, 5, 7]), P = g[0], Q = g[1];
      return mcqT('A line has gradient $' + fracTex(P, Q) + '$. What is the gradient of any line perpendicular to it?', fracTex(-Q, P),
        [fracTex(Q, P), fracTex(-P, Q), fracTex(P, Q)], [],
        'Turn the fraction upside down and change the sign: $' + fracTex(-Q, P) + '$. Check: $' + fracTex(P, Q) + ' \\times ' + par(fracTex(-Q, P)) + ' = -1$. Just inverting, or just changing the sign, does not give $-1$.');
    }),
    G('read-gradient', function () {
      var b = pick([-5, -4, -2, -1, 1, 2, 4, 5]), a = rnz(-7, 7), c = rnz(-8, 8), perp = Math.random() < 0.5;
      if (perp) {
        a = pick([-5, -4, -2, -1, 1, 2, 4, 5]); b = rnz(-7, 7);
        return numQ('Find the gradient of a line that is perpendicular to the line $' + lineStr(a, b, c) + '$, as a decimal.', b / a,
          'The given line has gradient $-\\frac{a}{b} = ' + fracTex(-a, b) + '$. A perpendicular line has gradient equal to the negative reciprocal, $' + fracTex(b, a) + ' = ' + (b / a) + '$.', tex(String(b / a)), 1e-6);
      }
      return numQ('Find the gradient of any line parallel to $' + lineStr(a, b, c) + '$, as a decimal.', -a / b,
        'Rearrange to $y = \\ldots$ to get $y = ' + fracTex(-a, b) + 'x + \\ldots$. Parallel lines share this gradient, $' + (-a / b) + '$.', tex(String(-a / b)), 1e-6);
    }),
    G('relationship', function () {
      var kind = pick(['par', 'perp', 'none']), a1 = rnz(-5, 5), b1 = rnz(-5, 5), c1 = rnz(-8, 8), c2 = rnz(-8, 8), a2, b2, ans;
      if (kind === 'par') { var k = pick([-2, -1, 2, 3]); a2 = k * a1; b2 = k * b1; while (c2 === k * c1) c2 = rnz(-8, 8); ans = 0; }
      else if (kind === 'perp') { var j = pick([-2, -1, 1, 2]); a2 = j * b1; b2 = -j * a1; ans = 1; }
      else { do { a2 = rnz(-5, 5); b2 = rnz(-5, 5); } while (a1 * b2 === a2 * b1 || a1 * a2 + b1 * b2 === 0); ans = 2; }
      return { kind: 'mcq', q: 'Line $L_1$ is $' + lineStr(a1, b1, c1) + '$ and line $L_2$ is $' + lineStr(a2, b2, c2) + '$. Which statement is true?',
        options: ['$L_1$ and $L_2$ are parallel', '$L_1$ and $L_2$ are perpendicular', '$L_1$ and $L_2$ are neither parallel nor perpendicular', '$L_1$ and $L_2$ are the same line'], answer: ans,
        why: 'The gradients are $m_1 = ' + fracTex(-a1, b1) + '$ and $m_2 = ' + fracTex(-a2, b2) + '$. ' + (ans === 0 ? 'They are equal, and the constants do not match, so the lines are parallel.' : ans === 1 ? 'Their product is $' + fracTex(-a1, b1) + ' \\times ' + par(fracTex(-a2, b2)) + ' = -1$, so the lines are perpendicular.' : 'They are not equal and their product is $' + fracTex(a1 * a2, b1 * b2) + '$, not $-1$, so the lines are neither parallel nor perpendicular.') };
    }),
    G('find-unknown', function () {
      var g = gradPQ([1, 2, 3, 4]), P = g[0], Q = g[1], t = rint(1, 3), x1 = rint(-4, 4), y1 = rint(-4, 4);
      var cx = rint(-4, 4), cy = rint(-4, 4), s = rnz(-3, 3), perp = Math.random() < 0.5, p, dy;
      if (perp) { dy = Q * s; p = cx - P * s; } else { dy = P * s; p = cx + Q * s; }
      return numQ('$A$ is $' + pt(x1, y1) + '$, $B$ is $' + pt(x1 + t * Q, y1 + t * P) + '$, $C$ is $' + pt(cx, cy) + '$ and $D$ is $(p, ' + (cy + dy) + ')$. Given that $CD$ is ' + (perp ? 'perpendicular' : 'parallel') + ' to $AB$, find the value of $p$.', p,
        'Gradient of $AB$ is $' + fracTex(P, Q) + '$. Gradient of $CD$ is $\\frac{' + dy + '}{p - ' + par(cx) + '}$. ' + (perp ? 'For perpendicular lines the product is $-1$, so $\\frac{' + dy + '}{p - ' + par(cx) + '} = ' + fracTex(-Q, P) + '$, which gives $p - ' + par(cx) + ' = ' + (-P * s) + '$.' : 'For parallel lines the gradients are equal, so $\\frac{' + dy + '}{p - ' + par(cx) + '} = ' + fracTex(P, Q) + '$, which gives $p - ' + par(cx) + ' = ' + Q * s + '$.') + ' Hence $p = ' + p + '$.');
    }),
    G('quadratic-condition', function () {
      var k = pick([1, 2]), u = rint(1, 3), v = rint(1, 3), neg = Math.random() < 0.5, a = k * u * u, b = k * v * v, p = k * u * v;
      return numQ('$A$ is $(-' + a + ', 0)$, $B$ is $(' + b + ', 0)$ and $C$ is $(0, p)$. Given that $AC$ is perpendicular to $BC$ and that $p ' + (neg ? '\\lt' : '\\gt') + ' 0$, find the value of $p$.', neg ? -p : p,
        'Gradient of $AC$ is $\\frac{p}{' + a + '}$ and gradient of $BC$ is $-\\frac{p}{' + b + '}$. Their product is $-1$: $-\\frac{p^2}{' + a * b + '} = -1$, so $p^2 = ' + a * b + '$ and $p = \\pm ' + p + '$. The condition $p ' + (neg ? '\\lt' : '\\gt') + ' 0$ rejects one root, leaving $p = ' + (neg ? -p : p) + '$.');
    }),
    G('find-k', function () {
      var g = gradPQ([1, 2, 3, 4]), P = g[0], Q = g[1], c0 = rnz(-5, 5), s = rnz(-3, 3), perp = Math.random() < 0.5, b, k;
      if (perp) { b = P * s; k = Q * s; } else { b = Q * s; k = -P * s; }
      return numQ('The line $L_1$ has equation $' + yEq(P, Q, c0) + '$ and the line $L_2$ has equation $kx ' + sgn(b) + 'y + 5 = 0$. Given that $L_1$ and $L_2$ are ' + (perp ? 'perpendicular' : 'parallel') + ', find the value of $k$.', k,
        '$L_2$ has gradient $-\\frac{k}{' + b + '}$. ' + (perp ? 'Perpendicular lines have $m_1 m_2 = -1$: $' + fracTex(P, Q) + ' \\times \\left(-\\frac{k}{' + b + '}\\right) = -1$, so $k = ' + k + '$.' : 'Parallel lines have equal gradients: $-\\frac{k}{' + b + '} = ' + fracTex(P, Q) + '$, so $k = ' + k + '$.'));
    }),
    mc('conclusion', 'You find that the gradients of two lines are $m_1 = \\frac{3}{4}$ and $m_2 = -\\frac{4}{3}$. Which is the complete conclusion?',
      ['$m_1 m_2 = -1$, so the lines are perpendicular', '$m_1 m_2 = 1$, so the lines are perpendicular', '$m_1 \\neq m_2$, so the lines are perpendicular', '$m_1 + m_2 = 0$, so the lines are parallel'], 0,
      '$\\frac{3}{4} \\times \\left(-\\frac{4}{3}\\right) = -1$. The test for perpendicular lines is that the product of the gradients is $-1$, and a proof must say so in a written conclusion.'),
    mc('special-cases', 'Which pair of lines is perpendicular?',
      ['$x = 3$ and $y = 7$', '$x = 3$ and $x = 7$', '$y = 3x$ and $y = 3x + 7$', '$y = x$ and $y = x + 1$'], 0,
      'A vertical line (which has no gradient) is perpendicular to a horizontal line (gradient $0$). Two vertical lines are parallel, and the last two pairs have equal gradients, so they are parallel too.'),
    mc('trap-sign', 'A student says: "the gradient of a line is $2$, so a perpendicular line has gradient $\\frac{1}{2}$". What is the mistake?',
      ['The sign was not changed: it should be $-\\frac{1}{2}$', 'The gradient should have been doubled', 'Perpendicular lines have equal gradients', 'There is no mistake'], 0,
      'The gradient of a perpendicular line is the <b>negative</b> reciprocal: $-\\frac{1}{2}$. Check: $2 \\times \\frac{1}{2} = 1$, not $-1$.'),
    mc('reject-root', 'Solving a gradient condition gives $p^2 = 16$ and the question states that $p \\lt 0$. What should you write?',
      ['$p = -4$, because $p = 4$ breaks the condition $p \\lt 0$', '$p = 4$ only', '$p = 4$ or $p = -4$ with no further comment', '$p = 16$'], 0,
      '$p^2 = 16$ gives $p = \\pm 4$. The stated condition $p \\lt 0$ rejects $p = 4$, so the answer is $p = -4$.')
  ]};

  // =====================================================================
  // FPM-COO-06 Equation of a perpendicular line
  // =====================================================================
  function ratioSetup() {
    var r = pick(RATIOS), m = r[0], n = r[1], s = m + n, u, v;
    do { u = rnz(-3, 3); v = rnz(-3, 3); } while (Math.abs(u) === Math.abs(v) || gcd(u, v) !== 1);
    var x1 = rint(-5, 5), y1 = rint(-5, 5);
    return { m: m, n: n, s: s, u: u, v: v, A: [x1, y1], B: [x1 + s * u, y1 + s * v], P: [x1 + m * u, y1 + m * v] };
  }
  B['FPM-COO-06'] = { title: 'Equation of a perpendicular line (including perpendicular bisectors)', items: [
    G('perp-through-point', function () {
      var a, b; do { a = rnz(-4, 4); b = rnz(-4, 4); } while (gcd(a, b) !== 1 || Math.abs(a) === Math.abs(b));
      var c = rnz(-6, 6), x1 = rint(-4, 4), y1 = rint(-4, 4);
      var ans = gradLine(b, a, x1, y1);
      return mcqT('The line $l$ has equation $' + lineStr(a, b, c) + '$. Find an equation of the line perpendicular to $l$ that passes through $' + pt(x1, y1) + '$, in the form $px + qy + r = 0$ with integer coefficients, no common factor and $p \\gt 0$.', ans,
        [gradLine(-b, a, x1, y1), gradLine(a, b, x1, y1), gradLine(-a, b, x1, y1)], [gradLine(b, a, -x1, y1)],
        'The gradient of $l$ is $-\\frac{a}{b} = ' + fracTex(-a, b) + '$, so the perpendicular gradient is $' + fracTex(b, a) + '$. Then $y - ' + par(y1) + ' = ' + fracTex(b, a) + '(x - ' + par(x1) + ')$ and clearing fractions gives $' + ans + '$. Using the same gradient, or forgetting to change the sign, gives the other options.');
    }),
    G('perp-bisector', function () {
      var u, v; do { u = rnz(-4, 4); v = rnz(-4, 4); } while (Math.abs(u) === Math.abs(v) || gcd(u, v) !== 1);
      var x1 = rint(-5, 5), y1 = rint(-5, 5), mx = x1 + u, my = y1 + v, x2 = x1 + 2 * u, y2 = y1 + 2 * v;
      var ans = gradLine(-u, v, mx, my);
      return mcqT('Find the equation of the perpendicular bisector of the line joining $A' + pt(x1, y1) + '$ and $B' + pt(x2, y2) + '$, in the form $ax + by + c = 0$ with integer coefficients, no common factor and $a \\gt 0$.', ans,
        [gradLine(-u, v, x1, y1), gradLine(v, u, mx, my), gradLine(u, v, mx, my)], [gradLine(-u, v, x2, y2)],
        'The midpoint of $AB$ is $' + pt(mx, my) + '$. The gradient of $AB$ is $' + fracTex(2 * v, 2 * u) + '$, so the perpendicular gradient is $' + fracTex(-u, v) + '$. Through the midpoint this gives $' + ans + '$. A perpendicular bisector must pass through the midpoint, not through $A$ or $B$.');
    }),
    G('perp-form-k', function () {
      var g = gradPQ([1, 2, 3, 4]), P = g[0], Q = g[1], c0 = rnz(-5, 5), x1 = rint(-5, 5), y1 = rint(-5, 5);
      return numQ('A line $l$ has equation $' + yEq(P, Q, c0) + '$. The line through $' + pt(x1, y1) + '$ perpendicular to $l$ has equation $' + lhs(Q, P) + ' = k$. Find the value of $k$.', Q * x1 + P * y1,
        'The gradient of $l$ is $' + fracTex(P, Q) + '$, so the perpendicular gradient is $' + fracTex(-Q, P) + '$. Then $y - ' + par(y1) + ' = ' + fracTex(-Q, P) + '(x - ' + par(x1) + ')$. Multiplying by $' + P + '$ and rearranging gives $' + lhs(Q, P) + ' = ' + (Q * x1 + P * y1) + '$, so $k = ' + (Q * x1 + P * y1) + '$.');
    }),
    G('ratio-then-perp', function () {
      var d = ratioSetup(), u = d.u, v = d.v, P = d.P, ans = gradLine(-u, v, P[0], P[1]);
      return mcqT('$A$ is $' + pt(d.A[0], d.A[1]) + '$ and $B$ is $' + pt(d.B[0], d.B[1]) + '$. The point $P$ divides $AB$ so that $AP : PB = ' + d.m + ' : ' + d.n + '$. Find an equation of the line through $P$ perpendicular to $AB$, in the form $ax + by + c = 0$ with integer coefficients, no common factor and $a \\gt 0$.', ans,
        [gradLine(-u, v, d.A[0], d.A[1]), gradLine(-u, v, d.B[0], d.B[1]), gradLine(v, u, P[0], P[1]), gradLine(u, v, P[0], P[1])], [],
        'First, $P = ' + pt(P[0], P[1]) + '$ (move $\\frac{' + d.m + '}{' + d.s + '}$ of the way from $A$ to $B$). The gradient of $AB$ is $' + fracTex(v, u) + '$, so the perpendicular gradient is $' + fracTex(-u, v) + '$. Through $P$ this gives $' + ans + '$.');
    }),
    G('perp-gradient-eq', function () {
      var a = pick([-5, -4, -2, -1, 1, 2, 4, 5]), b = rnz(-7, 7), c = rnz(-8, 8);
      return numQ('Find the gradient of any line perpendicular to $' + lineStr(a, b, c) + '$, as a decimal.', b / a,
        'Rearranging, the gradient of the given line is $-\\frac{a}{b} = ' + fracTex(-a, b) + '$. The perpendicular gradient is $' + fracTex(b, a) + ' = ' + (b / a) + '$.', tex(String(b / a)), 1e-6);
    }),
    G('bisector-point', function () {
      var u = rnz(-4, 4), v = rnz(-4, 4), x1 = rint(-5, 5), y1 = rint(-5, 5), mx = x1 + u, my = y1 + v;
      return mcqT('Which point must the perpendicular bisector of $A' + pt(x1, y1) + '$ and $B' + pt(x1 + 2 * u, y1 + 2 * v) + '$ pass through?', pt(mx, my),
        [pt(x1, y1), pt(x1 + 2 * u, y1 + 2 * v), pt(my, mx)], [pt(mx + 1, my)],
        'A perpendicular bisector cuts $AB$ in half at right angles, so it passes through the midpoint $' + pt(mx, my) + '$, found by averaging the coordinates.');
    }),
    G('perp-intercept', function () {
      var g = gradPQ([1, 2, 3, 4]), P = g[0], Q = g[1], c0 = rnz(-5, 5), k = rnz(-3, 3), x1 = P * k, y1 = rint(-5, 5), ans = y1 + Q * k;
      return numQ('A line $l$ has equation $' + yEq(P, Q, c0) + '$. Find the $y$-coordinate of the point where the line through $' + pt(x1, y1) + '$ perpendicular to $l$ crosses the $y$-axis.', ans,
        'The perpendicular gradient is $' + fracTex(-Q, P) + '$. Using $y - ' + par(y1) + ' = ' + fracTex(-Q, P) + '(x - ' + par(x1) + ')$ with $x = 0$: $y = ' + y1 + ' + ' + fracTex(Q, P) + '(' + x1 + ') = ' + ans + '$.');
    }),
    mc('trap-wrong-step', 'The line $AB$ has gradient $\\frac{1}{2}$. A student writes the perpendicular line through $(4, 3)$ as $y - 3 = -2(x - 4)$ and then simplifies to $y = -2x + 11$. Is the answer correct?',
      ['Yes: the gradient is $-2$ and $3 = -8 + c$ gives $c = 11$', 'No: the gradient should be $2$', 'No: the gradient should be $-\\frac{1}{2}$', 'No: the line should pass through $(3, 4)$'], 0,
      'The negative reciprocal of $\\frac{1}{2}$ is $-2$. Then $y - 3 = -2x + 8$, so $y = -2x + 11$. The working is correct.'),
    mc('show-that', 'In a "show that" question the final equation is printed as $x + 2y - 22 = 0$. A student reaches $y = -\\frac{1}{2}x + 11$ and stops. What should they do?',
      ['Rearrange to reach exactly $x + 2y - 22 = 0$ and then stop', 'Nothing: the equations are equivalent so no more is needed', 'Change the question\'s equation to match', 'Substitute $x = 0$'], 0,
      'A show-that must finish at the exact printed result. Multiplying $y = -\\frac{1}{2}x + 11$ by $2$ gives $2y = -x + 22$, so $x + 2y - 22 = 0$.'),
    mc('trap-point', 'A perpendicular bisector of $AB$ is wanted. A student uses the gradient $-\\frac{1}{m}$ correctly but the line passes through $A$. Why is this wrong?',
      ['The bisector must pass through the midpoint of $AB$, not an end point', 'The bisector must pass through the origin', 'The gradient should have been $m$', 'The bisector must pass through $B$ as well'], 0,
      'A bisector cuts $AB$ into two equal halves, so it goes through the midpoint. A line through an end point with the right gradient is perpendicular to $AB$ but does not bisect it.')
  ]};

  // =====================================================================
  // FPM-COO-07 Where two lines meet
  // =====================================================================
  function twoLines() {
    var x0 = rint(-5, 5), y0 = rint(-5, 5), a1, b1, a2, b2;
    do { a1 = rnz(-4, 4); b1 = rnz(-4, 4); a2 = rnz(-4, 4); b2 = rnz(-4, 4); } while (a1 * b2 - a2 * b1 === 0 || (a1 === a2 && b1 === b2) || (a1 === -a2 && b1 === -b2));
    return { x0: x0, y0: y0, a1: a1, b1: b1, d1: a1 * x0 + b1 * y0, a2: a2, b2: b2, d2: a2 * x0 + b2 * y0 };
  }
  B['FPM-COO-07'] = { title: 'Where two lines meet', items: [
    G('solve-simultaneous', function () {
      var L = twoLines(), askX = Math.random() < 0.5;
      return numQ('The lines $' + eqD(L.a1, L.b1, L.d1) + '$ and $' + eqD(L.a2, L.b2, L.d2) + '$ meet at the point $P$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $P$.', askX ? L.x0 : L.y0,
        'Solve the two equations together by elimination or substitution. This gives $x = ' + L.x0 + '$, $y = ' + L.y0 + '$. Check in the second line: $' + substLine(L.a2, L.b2, 0, L.x0, L.y0) + ' = ' + L.d2 + '$.');
    }),
    G('solve-simultaneous', function () {
      var L = twoLines();
      return mcqT('Find the coordinates of the point where the lines $' + eqD(L.a1, L.b1, L.d1) + '$ and $' + eqD(L.a2, L.b2, L.d2) + '$ intersect.', pt(L.x0, L.y0),
        [pt(L.y0, L.x0), pt(L.x0, -L.y0), pt(-L.x0, L.y0)], [pt(L.x0 + 1, L.y0 + 1), pt(L.x0 - 1, L.y0)],
        'The point must satisfy both equations. Eliminating one variable gives $' + pt(L.x0, L.y0) + '$. Check: $' + substLine(L.a1, L.b1, 0, L.x0, L.y0) + ' = ' + L.d1 + '$ and $' + substLine(L.a2, L.b2, 0, L.x0, L.y0) + ' = ' + L.d2 + '$. Swapping $x$ and $y$ gives a point on neither line.');
    }),
    G('slope-intercept-form', function () {
      var x0 = rint(-5, 5), y0 = rint(-5, 5), m1 = rnz(-4, 4), m2 = rnz(-4, 4); while (m2 === m1) m2 = rnz(-4, 4);
      var c1 = y0 - m1 * x0, c2 = y0 - m2 * x0, askX = Math.random() < 0.5;
      return numQ('The lines $' + yEq(m1, 1, c1) + '$ and $' + yEq(m2, 1, c2) + '$ meet at the point $Q$. Find the ' + (askX ? '$x$' : '$y$') + '-coordinate of $Q$.', askX ? x0 : y0,
        'At the meeting point the two values of $y$ are equal: $' + lin(m1, 'x', c1) + ' = ' + lin(m2, 'x', c2) + '$, so $' + par(m1 - m2) + 'x = ' + (c2 - c1) + '$ and $x = ' + x0 + '$. Then $y = ' + y0 + '$.');
    }),
    G('sum-of-coordinates', function () {
      var L = twoLines();
      return numQ('The lines $' + eqD(L.a1, L.b1, L.d1) + '$ and $' + eqD(L.a2, L.b2, L.d2) + '$ meet at $D(p, q)$. Find the value of $p + q$.', L.x0 + L.y0,
        'Solving simultaneously gives $p = ' + L.x0 + '$ and $q = ' + L.y0 + '$, so $p + q = ' + (L.x0 + L.y0) + '$.');
    }),
    G('unknown-constant', function () {
      var x0 = rint(-4, 4), y0 = rint(-4, 4), m = rnz(-3, 3), k = y0 - m * x0, a = rnz(1, 3), b = rnz(1, 3), d = a * x0 + b * y0;
      return numQ('The line $y = ' + lin(m, 'x', 0) + ' + k$ meets the line $' + eqD(a, b, d) + '$ at the point where $x = ' + x0 + '$. Find the value of $k$.', k,
        'On the second line, when $x = ' + x0 + '$: $' + par(a) + '(' + x0 + ') + ' + par(b) + 'y = ' + d + '$, so $y = ' + y0 + '$. This point is also on the first line: $' + y0 + ' = ' + par(m) + '(' + x0 + ') + k$, so $k = ' + k + '$.');
    }),
    G('number-of-meetings', function () {
      var kind = pick(['par', 'perp', 'none']), a1 = rnz(-4, 4), b1 = rnz(-4, 4), c1 = rnz(-8, 8), c2 = rnz(-8, 8), a2, b2, ans;
      if (kind === 'par') { var k = pick([-2, 2, 3]); a2 = k * a1; b2 = k * b1; while (c2 === k * c1) c2 = rnz(-8, 8); ans = 0; }
      else if (kind === 'perp') { a2 = b1; b2 = -a1; ans = 1; }
      else { do { a2 = rnz(-4, 4); b2 = rnz(-4, 4); } while (a1 * b2 === a2 * b1); ans = 1; }
      return { kind: 'mcq', q: 'How many points do the lines $' + lineStr(a1, b1, c1) + '$ and $' + lineStr(a2, b2, c2) + '$ have in common?',
        options: ['None', 'Exactly one', 'Exactly two', 'Infinitely many'], answer: ans,
        why: 'The gradients are $' + fracTex(-a1, b1) + '$ and $' + fracTex(-a2, b2) + '$. ' + (ans === 0 ? 'They are equal and the lines are different, so the lines are parallel and never meet.' : 'The gradients differ, so the lines are not parallel and meet at exactly one point. Two straight lines cannot meet twice.') };
    }),
    G('elimination-step', function () {
      var a1 = rint(2, 5), a2 = rint(2, 5); while (a1 === a2) a2 = rint(2, 5);
      var b = rint(2, 5), same = Math.random() < 0.5, x0 = rint(-3, 3), y0 = rint(-3, 3);
      var b2 = same ? b : -b, d1 = a1 * x0 + b * y0, d2 = a2 * x0 + b2 * y0;
      return { kind: 'mcq', q: 'The lines $' + eqD(a1, b, d1) + '$ and $' + eqD(a2, b2, d2) + '$ are to be solved together. Which first step eliminates $y$?',
        options: ['Subtract the second equation from the first', 'Add the two equations', 'Multiply the first equation by $' + a2 + '$ and add', 'Substitute $y = 0$'], answer: same ? 0 : 1,
        why: 'The $y$-terms are $' + b + 'y$ and $' + lhs(0, b2) + '$. ' + (same ? 'They are equal, so subtracting cancels them.' : 'They are $+' + b + 'y$ and $-' + b + 'y$, so adding cancels them.') + ' After finding $x = ' + x0 + '$, substitute back to find $y = ' + y0 + '$.' };
    }),
    G('check-trap', function () {
      var L = twoLines(), bad = L.y0 + 1;
      var x = L.x0, y = null;
      for (var yy = L.y0 - 6; yy <= L.y0 + 6; yy++) { if (yy !== L.y0 && L.a1 * x + L.b1 * yy === L.d1) { y = yy; } }
      if (y === null) { x = L.x0; y = L.y0; }
      return { kind: 'mcq', q: 'The lines $l_1$: $' + eqD(L.a1, L.b1, L.d1) + '$ and $l_2$: $' + eqD(L.a2, L.b2, L.d2) + '$ meet at $D(' + L.x0 + ', ' + L.y0 + ')$. A student writes: "$' + substLine(L.a1, L.b1, 0, L.x0, L.y0) + ' = ' + L.d1 + '$, so $D$ is the point of intersection." What is missing?',
        options: ['The point must also be shown to satisfy $l_2$', 'Nothing: lying on $l_1$ is enough', 'The point must be shown to lie on the $x$-axis', 'The lines must be shown to be parallel'], answer: 0,
        why: 'Lying on $l_1$ only shows $D$ is on one line. The intersection is on both lines, so $' + substLine(L.a2, L.b2, 0, L.x0, L.y0) + ' = ' + L.d2 + '$ must be checked as well (or the equations solved, if the question says "show that").' };
    }),
    G('back-substitute', function () {
      var m1 = rnz(-3, 3), m2 = rnz(-3, 3); while (m2 === m1) m2 = rnz(-3, 3);
      var x0 = rint(-4, 4), y0 = rint(-4, 4), c1 = y0 - m1 * x0, c2 = y0 - m2 * x0;
      return mcqT('The lines $' + yEq(m1, 1, c1) + '$ and $' + yEq(m2, 1, c2) + '$ meet where $x = ' + x0 + '$. What are the coordinates of the point of intersection?', pt(x0, y0),
        [pt(x0, m1 * x0), pt(x0, c1), pt(x0, y0 + 1)], [pt(x0, c2), pt(x0, y0 - 1)],
        'Substitute $x = ' + x0 + '$ into either line: $y = ' + par(m1) + '(' + x0 + ') ' + sgn(c1) + ' = ' + y0 + '$. Check in the other line: $' + par(m2) + '(' + x0 + ') ' + sgn(c2) + ' = ' + y0 + '$. Both coordinates are needed.');
    }),
    G('intercept-on-axis', function () {
      var x0 = rint(-4, 4), m = rnz(-3, 3), c = rnz(-5, 5), xr = rnz(-6, 6);
      // line y = m x + c meets the vertical line x = xr
      return numQ('Find the $y$-coordinate of the point where the line $' + yEq(m, 1, c) + '$ meets the line $x = ' + xr + '$.', m * xr + c,
        'On the line $x = ' + xr + '$, every point has $x = ' + xr + '$. Substitute into the other line: $y = ' + par(m) + '(' + xr + ') ' + sgn(c) + ' = ' + (m * xr + c) + '$.');
    }),
    mc('conclusion', 'Two lines have different gradients. What can you say about their intersection?',
      ['They meet at exactly one point', 'They never meet', 'They meet at two points', 'They meet only if the gradients multiply to $-1$'], 0,
      'Lines with different gradients are not parallel, so they must cross, and two straight lines cross at only one point. Perpendicular lines are just a special case.')
  ]};

  // =====================================================================
  // FPM-COO-08 Finding a point from a line and a distance
  // =====================================================================
  var SLOPES = [1, 2, 3, -1, -2];
  function onLine() {
    var g = pick(SLOPES), k = 1 + g * g, t = rint(2, 6), x0 = rint(-3, 3), y0 = rint(-5, 5);
    return { g: g, k: k, t: t, x0: x0, y0: y0, c: y0 - g * x0, dtex: t + '\\sqrt{' + k + '}' };
  }
  B['FPM-COO-08'] = { title: 'Finding a point from a line and a distance', items: [
    G('on-line-distance', function () {
      var L = onLine(), right = Math.random() < 0.5, s = right ? L.t : -L.t, m = L.x0 + s;
      return numQ('$A$ is the point $' + pt(L.x0, L.y0) + '$ on the line $' + yEq(L.g, 1, L.c) + '$. The point $B(m, n)$ is also on this line, with $AB = ' + L.dtex + '$ and $m ' + (right ? '\\gt' : '\\lt') + ' ' + L.x0 + '$. Find the value of $m$.', m,
        'On the line, $n = ' + lin(L.g, 'm', L.c) + '$. So $(m - ' + par(L.x0) + ')^2 + (n - ' + par(L.y0) + ')^2 = (m - ' + par(L.x0) + ')^2 + ' + (L.g === 1 || L.g === -1 ? '' : L.g * L.g) + '(m - ' + par(L.x0) + ')^2 = ' + L.t * L.t * L.k + '$. Then $' + L.k + '(m - ' + par(L.x0) + ')^2 = ' + L.t * L.t * L.k + '$, so $m - ' + par(L.x0) + ' = \\pm ' + L.t + '$. The condition $m ' + (right ? '\\gt' : '\\lt') + ' ' + L.x0 + '$ gives $m = ' + m + '$.');
    }),
    G('on-line-distance', function () {
      var L = onLine(), up = Math.random() < 0.5, s = L.t * (up ? 1 : -1), m = L.x0 + s, n = L.y0 + L.g * s;
      return numQ('$A$ is the point $' + pt(L.x0, L.y0) + '$ on the line $' + yEq(L.g, 1, L.c) + '$. The point $B(m, n)$ is also on this line, with $AB = ' + L.dtex + '$ and $m ' + (up ? '\\gt' : '\\lt') + ' ' + L.x0 + '$. Find the value of $n$.', n,
        'Write $B = (' + L.x0 + ' + s, ' + L.y0 + ' + ' + par(L.g) + 's)$ for a step $s$ along the line. Then $s^2 + ' + (L.g * L.g) + 's^2 = ' + L.t * L.t * L.k + '$ so $s = \\pm ' + L.t + '$, and $m ' + (up ? '\\gt' : '\\lt') + ' ' + L.x0 + '$ gives $s = ' + s + '$. Therefore $n = ' + n + '$.');
    }),
    G('square-surd', function () {
      var t = rint(2, 9), k = pick([2, 3, 5, 6, 7, 10]);
      return numQ('Work out the value of $(' + t + '\\sqrt{' + k + '})^2$.', t * t * k,
        '$(' + t + '\\sqrt{' + k + '})^2 = ' + t + '^2 \\times (\\sqrt{' + k + '})^2 = ' + t * t + ' \\times ' + k + ' = ' + t * t * k + '$. Both the number and the surd are squared.');
    }),
    G('area-to-length', function () {
      var L1 = rint(3, 9), w = rint(3, 12); if ((L1 * w) % 2) w += 1;
      var S = L1 * w / 2, x1 = rint(-3, 3), y1 = rint(-3, 3);
      return numQ('Triangle $ABC$ has a right angle at $A$ and $AB = ' + L1 + '$. The area of the triangle is $' + S + '$. Find the length $AC$.', w,
        'The two perpendicular sides are the base and height, so the area is $\\frac{1}{2} \\times AB \\times AC = ' + S + '$. Then $\\frac{1}{2} \\times ' + L1 + ' \\times AC = ' + S + '$ and $AC = ' + w + '$.');
    }),
    G('equation-setup', function () {
      var g = pick([1, 2, 3, -1, -2]), c = rnz(-4, 4), a1 = rint(-3, 3), a2 = rint(-4, 4), t = rint(2, 4), k = pick([2, 3, 5]), D = t * t * k;
      var mm = a1 === 0 ? 'm' : 'm ' + sgn(-a1), mp = a1 === 0 ? 'm' : 'm ' + sgn(a1), yy = lin(g, 'm', c - a2);
      var cor = '(' + mm + ')^2 + (' + yy + ')^2 = ' + D;
      var w1 = '(' + mm + ')^2 + (' + yy + ')^2 = ' + t + '\\sqrt{' + k + '}';
      var w2 = '(' + mm + ')^2 + (' + yy + ')^2 = ' + t * k;
      var w3 = '(' + mp + ')^2 + (' + lin(g, 'm', c + a2) + ')^2 = ' + D;
      return mcqT('The point $B(m, n)$ lies on the line $' + yEq(g, 1, c) + '$ and $A$ is the point $' + pt(a1, a2) + '$. Given that $AB = ' + t + '\\sqrt{' + k + '}$, which equation can be solved to find $m$?', cor,
        [w1, w2, w3], ['(' + mm + ') + (' + yy + ') = ' + D],
        'Since $n = ' + lin(g, 'm', c) + '$, the changes are $' + mm + '$ and $n - ' + par(a2) + ' = ' + yy + '$. The distance condition squared is $(\\Delta x)^2 + (\\Delta y)^2 = AB^2$, and $(' + t + '\\sqrt{' + k + '})^2 = ' + D + '$, not $' + t + '\\sqrt{' + k + '}$ or $' + t * k + '$.');
    }),
    G('choose-point', function () {
      var L = onLine(), s = L.t; while (s <= Math.abs(L.x0)) s++;
      var posM = Math.random() < 0.5, p1 = [L.x0 + s, L.y0 + L.g * s], p2 = [L.x0 - s, L.y0 - L.g * s];
      var good = posM ? p1 : p2, bad = posM ? p2 : p1;
      var d = s + '\\sqrt{' + L.k + '}';
      return mcqT('The point $B(m, n)$ lies on the line $' + yEq(L.g, 1, L.c) + '$ and $AB = ' + d + '$, where $A$ is $' + pt(L.x0, L.y0) + '$. Solving gives two possible points, and $m ' + (posM ? '\\gt' : '\\lt') + ' 0$. Which point is $B$?', pt(good[0], good[1]),
        [pt(bad[0], bad[1]), pt(good[0], bad[1]), pt(bad[0], good[1])], [pt(good[0] + 1, good[1])],
        'The two points are ' + '$' + pt(p1[0], p1[1]) + '$ and $' + pt(p2[0], p2[1]) + '$, one on each side of $A$. The condition $m ' + (posM ? '\\gt' : '\\lt') + ' 0$ selects ' + '$' + pt(good[0], good[1]) + '$ because its $x$-coordinate is ' + (posM ? 'positive' : 'negative') + '.');
    }),
    G('gradient-and-distance', function () {
      var g = pick([1, 2, 3]), k = 1 + g * g, t = rint(2, 5), x0 = rint(-4, 4), y0 = rint(-4, 4), up = Math.random() < 0.5;
      var s = up ? t : -t, m = x0 + s, n = y0 + g * s;
      return numQ('$A$ is the point $' + pt(x0, y0) + '$ and $B$ is the point $(m, n)$. The line $AB$ has gradient $' + g + '$ and $AB = ' + t + '\\sqrt{' + k + '}$. Given that $n ' + (up ? '\\gt' : '\\lt') + ' ' + y0 + '$, find $m$.', m,
        'Since $n - ' + par(y0) + ' = ' + g + '(m - ' + par(x0) + ')$, we get $AB^2 = (m - ' + par(x0) + ')^2(1 + ' + g * g + ') = ' + t * t * k + '$, so $m - ' + par(x0) + ' = \\pm ' + t + '$. The line rises (gradient is positive), so $n ' + (up ? '\\gt' : '\\lt') + ' ' + y0 + '$ means $m ' + (up ? '\\gt' : '\\lt') + ' ' + x0 + '$, giving $m = ' + m + '$.');
    }),
    mc('number-of-points', 'A line is given, and a point $A$ on it. How many points on the line are exactly a given distance from $A$?',
      ['Two, one on each side of $A$', 'One', 'Four', 'None'], 0,
      'Moving the same distance along the line in either direction from $A$ gives two points. A condition in the question (such as $m \\gt 0$) is then used to pick one.'),
    mc('square-surd', 'Which is the correct value of $(8\\sqrt{5})^2$?',
      ['$320$', '$40$', '$64\\sqrt{5}$', '$1600$'], 0,
      'Square both parts: $8^2 \\times (\\sqrt{5})^2 = 64 \\times 5 = 320$. Forgetting to square the $8$ or the surd gives the wrong options.'),
    mc('condition', 'Solving a distance equation for a point gives two solutions for $m$, namely $m = -2$ and $m = 6$. The question says $m \\gt 0$. What should you do?',
      ['Reject $m = -2$ and state $m = 6$, then find the point', 'Give both values', 'Reject $m = 6$', 'Take the average'], 0,
      'A stated condition decides between the two points. $m = -2$ breaks $m \\gt 0$, so only $m = 6$ is kept.')
  ]};

  // =====================================================================
  // FPM-COO-09 Area of a triangle or quadrilateral from coordinates
  // =====================================================================
  B['FPM-COO-09'] = { title: 'Area of a triangle or quadrilateral from coordinates', items: [
    G('base-height', function () {
      var y0 = rint(-4, 4), a1 = rint(-5, 2), w = rint(2, 8), h = rnz(-7, 7), c1 = rint(-5, 8);
      var area = w * Math.abs(h) / 2;
      return numQ('Find the area of triangle $ABC$ with $A' + pt(a1, y0) + '$, $B' + pt(a1 + w, y0) + '$ and $C' + pt(c1, y0 + h) + '$.', area,
        '$AB$ is horizontal with length $' + w + '$, and the perpendicular height from $C$ is the vertical distance $' + Math.abs(h) + '$. Area $= \\frac{1}{2} \\times ' + w + ' \\times ' + Math.abs(h) + ' = ' + area + '$.');
    }),
    G('shoelace-triangle', function () {
      var P, a;
      do { P = [[rint(-5, 5), rint(-5, 5)], [rint(-5, 5), rint(-5, 5)], [rint(-5, 5), rint(-5, 5)]]; a = shoelace(P); } while (a === 0);
      var s = P[0][0] * P[1][1] - P[1][0] * P[0][1] + P[1][0] * P[2][1] - P[2][0] * P[1][1] + P[2][0] * P[0][1] - P[0][0] * P[2][1];
      return numQ('Triangle $PQR$ has vertices $P' + pt(P[0][0], P[0][1]) + '$, $Q' + pt(P[1][0], P[1][1]) + '$ and $R' + pt(P[2][0], P[2][1]) + '$. Find its area.', a,
        'Shoelace: $\\frac{1}{2}|x_1y_2 - x_2y_1 + x_2y_3 - x_3y_2 + x_3y_1 - x_1y_3| = \\frac{1}{2}|' + s + '| = ' + a + '$.');
    }),
    G('right-angle-sides', function () {
      var a = rnz(-3, 3), b = rnz(-3, 3), k = rint(2, 3), bx = rint(-3, 3), by = rint(-3, 3), n = a * a + b * b;
      var area = k * n / 2;
      return numQ('Triangle $ABC$ has a right angle at $B$. The coordinates are $A' + pt(bx + a, by + b) + '$, $B' + pt(bx, by) + '$ and $C' + pt(bx - k * b, by + k * a) + '$. Find the area of the triangle.', area,
        '$BA^2 = ' + a * a + ' + ' + b * b + ' = ' + n + '$ and $BC^2 = ' + k * k * b * b + ' + ' + k * k * a * a + ' = ' + k * k * n + '$, so $BC = ' + k + ' \\times BA$. Area $= \\frac{1}{2} \\times BA \\times BC = \\frac{1}{2} \\times ' + k + ' \\times ' + n + ' = ' + area + '$.');
    }),
    G('perp-diagonals', function () {
      var p = rint(1, 5), q = rint(1, 5), r = rint(1, 5), s = rint(1, 5), cx = rint(-3, 3), cy = rint(-3, 3);
      var d1 = p + q, d2 = r + s, area = d1 * d2 / 2;
      return numQ('Quadrilateral $ABCD$ has $A' + pt(cx - p, cy) + '$, $B' + pt(cx, cy + r) + '$, $C' + pt(cx + q, cy) + '$ and $D' + pt(cx, cy - s) + '$. Its diagonals $AC$ and $BD$ are perpendicular. Find its area.', area,
        'Diagonal $AC$ is horizontal with length $' + q + ' + ' + p + ' = ' + d1 + '$. Diagonal $BD$ is vertical with length $' + r + ' + ' + s + ' = ' + d2 + '$. For perpendicular diagonals the area is $\\frac{1}{2}d_1d_2 = \\frac{1}{2} \\times ' + d1 + ' \\times ' + d2 + ' = ' + area + '$.');
    }),
    G('trapezium', function () {
      var w1 = rint(3, 9), w2 = rint(1, w1 - 1), h = rint(2, 7), x0 = rint(-4, 2), y0 = rint(-3, 3), off = rint(0, 3);
      var area = (w1 + w2) * h / 2;
      return numQ('$ABCD$ is a trapezium with $A' + pt(x0, y0) + '$, $B' + pt(x0 + w1, y0) + '$, $C' + pt(x0 + off + w2, y0 + h) + '$ and $D' + pt(x0 + off, y0 + h) + '$. Find its area.', area,
        '$AB = ' + w1 + '$ and $DC = ' + w2 + '$ are parallel (both horizontal), and the perpendicular distance between them is $' + h + '$. Area $= \\frac{1}{2}(' + w1 + ' + ' + w2 + ') \\times ' + h + ' = ' + area + '$.');
    }),
    G('median-half', function () {
      var A = [rint(-4, 4), rint(-4, 4)], Bp = [2 * rint(-3, 3), 2 * rint(-3, 3)], C = [2 * rint(-3, 3), 2 * rint(-3, 3)], S = shoelace([A, Bp, C]);
      while (S === 0 || S > 30) { A = [rint(-4, 4), rint(-4, 4)]; Bp = [2 * rint(-3, 3), 2 * rint(-3, 3)]; C = [2 * rint(-3, 3), 2 * rint(-3, 3)]; S = shoelace([A, Bp, C]); }
      var M = [(Bp[0] + C[0]) / 2, (Bp[1] + C[1]) / 2];
      return numQ('Triangle $ABC$ has $A' + pt(A[0], A[1]) + '$, $B' + pt(Bp[0], Bp[1]) + '$ and $C' + pt(C[0], C[1]) + '$. Its area is $' + S + '$. $M$ is the midpoint of $BC$. Find the area of triangle $ABM$.', S / 2,
        '$M = ' + pt(M[0], M[1]) + '$ is the midpoint of $BC$, so $AM$ is a median and splits the triangle into two triangles of equal area. Area of $ABM = \\frac{1}{2} \\times ' + S + ' = ' + (S / 2) + '$.');
    }),
    G('shoelace-quad', function () {
      var w1 = rint(4, 9), w2 = rint(2, w1 - 1), h = rint(2, 6), x0 = rint(-3, 2), y0 = rint(-3, 2), off = rint(-2, 3);
      var Pq = [[x0, y0], [x0 + w1, y0], [x0 + off + w2, y0 + h], [x0 + off, y0 + h]], a = shoelace(Pq);
      var terms = [];
      for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; terms.push(Pq[i][0] * Pq[j][1] - Pq[j][0] * Pq[i][1]); }
      return numQ('Use the shoelace method to find the area of quadrilateral $PQRS$ with $P' + pt(Pq[0][0], Pq[0][1]) + '$, $Q' + pt(Pq[1][0], Pq[1][1]) + '$, $R' + pt(Pq[2][0], Pq[2][1]) + '$ and $S' + pt(Pq[3][0], Pq[3][1]) + '$ (taken in order).', a,
        'The four cross terms $x_iy_{i+1} - x_{i+1}y_i$ are $' + terms.join(', ') + '$, which add to $' + terms.reduce(function (p, c) { return p + c; }, 0) + '$. Area $= \\frac{1}{2}|' + terms.reduce(function (p, c) { return p + c; }, 0) + '| = ' + a + '$.');
    }),
    G('slanted-height-trap', function () {
      var y0 = rint(-3, 3), a = rint(-4, 0), w = rint(4, 8), h = rint(3, 7), c = rint(a + 1, a + w - 1);
      var AC2 = (c - a) * (c - a) + h * h, BC2 = (a + w - c) * (a + w - c) + h * h;
      return mcqT('In triangle $ABC$, $A' + pt(a, y0) + '$, $B' + pt(a + w, y0) + '$ and $C' + pt(c, y0 + h) + '$. Taking $AB$ as the base, what is the perpendicular height of the triangle?', String(h),
        [surdTex(AC2), surdTex(BC2), String(w)], [String(h + 1), String(h + 2), String(h - 1)],
        '$AB$ is horizontal, so the perpendicular height from $C$ to $AB$ is the vertical distance $' + (y0 + h) + ' - ' + par(y0) + ' = ' + h + '$. The slanted sides $AC$ and $BC$ are not perpendicular to the base, so their lengths are not the height.');
    }),
    mc('shoelace-order', 'When using the shoelace method on quadrilateral $ABCD$, how should the vertices be listed?',
      ['In order around the shape, clockwise or anticlockwise', 'Any order, as the area is the same', 'Alphabetically, even if that crosses the shape', 'Starting with the vertex with the largest $y$ and then in any order'], 0,
      'The vertices must follow the boundary in order. A wrong order makes the sides cross, and the formula then gives a different (wrong) value.'),
    mc('formula-slip', 'A right-angled triangle has perpendicular sides of lengths $6$ and $8$. A student gives the area as $48$. What is the mistake?',
      ['The $\\frac{1}{2}$ was left out: the area is $24$', 'The hypotenuse should have been used: the area is $60$', 'The area should be $14$', 'There is no mistake'], 0,
      'Area of a triangle $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 6 \\times 8 = 24$. $48$ is the area of the rectangle, twice as large.'),
    mc('exact-form', 'The area of a triangle is found to be $\\frac{15}{4}$. The question asks for the exact area. Which answer should be given?',
      ['$\\frac{15}{4}$ (or $3.75$)', '$3.8$', '$4$', '$3.7$'], 0,
      '"Exact" means no rounding. $\\frac{15}{4}$ is exactly $3.75$, so a rounded value like $3.8$ would lose the accuracy mark.')
  ]};
})();
