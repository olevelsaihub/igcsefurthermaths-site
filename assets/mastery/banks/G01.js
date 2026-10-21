/* Group G01 mastery bank: Differentiation (product, chain and quotient rules; tangents, normals, stationary points, optimisation set-up). Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n)

  // ---------- helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function rnz(lo, hi) { var v = 0; while (v === 0) v = rint(lo, hi); return v; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  // sum of terms [[coef, body], ...]; body '' is a constant; coefficient 1 is hidden, zero terms dropped
  function P(terms) {
    var s = '';
    terms.forEach(function (t) {
      var c = t[0], b = t[1];
      if (c === 0) return;
      var mag = Math.abs(c);
      var piece = (b !== '' && mag === 1 ? '' : String(mag)) + b;
      if (!s) s = (c < 0 ? '-' : '') + piece; else s += (c < 0 ? ' - ' : ' + ') + piece;
    });
    return s || '0';
  }
  function fr(n, d) {   // reduced fraction as LaTeX
    var g = gcd(n, d); n = n / g; d = d / g;
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }
  function num(x) { return String(parseFloat(x.toFixed(6))); }
  function ex(k) { return 'e^{' + (k === 1 ? '' : k === -1 ? '-' : k) + 'x}'; }
  function kx(k) { return (k === 1 ? '' : k === -1 ? '-' : k) + 'x'; }
  function pw(n) { return n === 1 ? '' : '^{' + n + '}'; }
  function br(s) { return '(' + s + ')'; }
  function K(c, s) { return (c === 1 ? '' : c === -1 ? '-' : c) + s; }   // coefficient then expression
  function pr(s) { return s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function M(s) { return '$' + s + '$'; }
  var Y1 = '\\frac{dy}{dx}', Y2 = '\\frac{d^2y}{dx^2}';
  // numerical answer item
  function N(q, ans, why, tol, disp) {
    return { kind: 'num', q: q, answer: ans, tol: tol || 1e-6, display: '$' + (disp != null ? disp : num(ans)) + '$', why: why };
  }
  // mcq with right answer first then distractors (de-duplicated, up to 3 kept)
  function C(q, correct, dist, why) {
    var opts = [correct], seen = {}; seen[correct] = 1;
    dist.forEach(function (d) { if (!seen[d] && opts.length < 4) { seen[d] = 1; opts.push(d); } });
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function S(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function tidy(t) {
    if (typeof t !== 'string') return t;
    return t.replace(/ \+ -/g, ' - ').replace(/ - -/g, ' + ').replace(/([^0-9.\\{a-z])1x/g, '$1x').replace(/\(1x/g, '(x').replace(/\^\{1\}/g, '');
  }
  function G(skill, fn) {
    return { skill: skill, gen: function () {
      var q = fn();
      q.q = tidy(q.q); q.why = tidy(q.why);
      if (q.options) q.options = q.options.map(tidy);
      if (q.display) q.display = tidy(q.display);
      return q;
    } };
  }
  // cubic with stationary x-values r1<r2 of the same parity: y = x^3 + B x^2 + Cx + d, dy/dx = 3(x-r1)(x-r2)
  function cubicFromRoots() {
    var r1, r2;
    do { r1 = rint(-4, 3); r2 = r1 + 2 * rint(1, 3); } while (r2 > 5);
    var Bc = -3 * (r1 + r2) / 2, Cc = 3 * r1 * r2, d = rint(-6, 6);
    return { r1: r1, r2: r2, B: Bc, C: Cc, d: d, f: function (x) { return x * x * x + Bc * x * x + Cc * x + d; },
      text: P([[1, 'x^3'], [Bc, 'x^2'], [Cc, 'x'], [d, '']]) };
  }

  // =====================================================================
  // FPM-CAL-01 Product rule and chain rule
  // =====================================================================
  B['FPM-CAL-01'] = { title: 'Product rule and chain rule: differentiating products and \'function of a function\'', items: [
    G('product-exp-poly', function () {
      var a = pick([1, 2, 3, 4, -2]), b = rnz(-5, 5), k = pick([2, 3, 4, 5, -2, -3]);
      var f = function (p, q) { return br(P([[p, 'x'], [q, '']])) ; };
      var right = ex(k) + f(k * a, a + k * b);
      return C('Differentiate $y = ' + br(P([[a, 'x'], [b, '']])) + ex(k) + '$ with respect to $x$.',
        M(right),
        [M(ex(k) + f(a, a + b)), M(K(a * k, ex(k))), M(ex(k) + f(k * a, a - k * b)), M(ex(k) + f(k * a, k * a + b))],
        'Product rule with $u = ' + P([[a, 'x'], [b, '']]) + '$, $v = ' + ex(k) + '$: $u\' = ' + a + '$, $v\' = ' + K(k, ex(k)) + '$ (chain rule). So ' + M(Y1 + ' = ' + br(P([[a, 'x'], [b, '']])) + pr(K(k, ex(k))) + ' + ' + a + ex(k)) + ' and taking out $' + ex(k) + '$ gives $' + right + '$.');
    }),
    G('product-trig', function () {
      var k = pick([2, 3, 4, -1, -2]), m = pick([2, 3, 4, 5]);
      var sn = '\\sin ' + kx(m), cs = '\\cos ' + kx(m);
      var right = ex(k) + br(P([[k, sn], [m, cs]]));
      return C('Differentiate $y = ' + ex(k) + sn + '$ with respect to $x$.', M(right),
        [M(ex(k) + br(P([[k, sn], [-m, cs]]))), M(ex(k) + br(P([[m, sn], [k, cs]]))), M(ex(k) + br(P([[k, sn], [1, cs]]))), M(K(k * m, ex(k)) + cs)],
        'Use the product rule with $u = ' + ex(k) + '$ and $v = ' + sn + '$. Here $u\' = ' + K(k, ex(k)) + '$ and $v\' = ' + K(m, cs) + '$ (chain rule). Then $' + Y1 + ' = ' + ex(k) + '\\times ' + K(m, cs) + ' + ' + sn + '\\times ' + pr(K(k, ex(k))) + '$, which factorises to $' + right + '$.');
    }),
    G('product-trig', function () {
      var k = pick([2, 3, 4, 1, -2]), m = pick([2, 3, 4, 5]);
      var sn = '\\sin ' + kx(m), cs = '\\cos ' + kx(m);
      var right = ex(k) + br(P([[k, cs], [-m, sn]]));
      return C('Differentiate $y = ' + ex(k) + cs + '$ with respect to $x$.', M(right),
        [M(ex(k) + br(P([[k, cs], [m, sn]]))), M(ex(k) + br(P([[m, cs], [-k, sn]]))), M(ex(k) + br(P([[k, cs], [-1, sn]]))), M(K(-k * m, ex(k)) + sn)],
        'Product rule with $u = ' + ex(k) + '$ and $v = ' + cs + '$: $u\' = ' + K(k, ex(k)) + '$ and $v\' = ' + K(-m, sn) + '$ (the derivative of cosine carries a minus sign). So $' + Y1 + ' = ' + right + '$.');
    }),
    G('evaluate', function () {
      var a = pick([2, 3, 4, 5, -2]), b = rnz(-5, 5), k = pick([2, 3, 4, -2, -3]);
      var ans = a + k * b;
      return N('The curve $y = ' + br(P([[a, 'x'], [b, '']])) + ex(k) + '$ has gradient $' + Y1 + '$. Find the gradient of the curve at the point where $x = 0$.', ans,
        '$' + Y1 + ' = ' + ex(k) + br(P([[k * a, 'x'], [a + k * b, '']])) + '$. At $x = 0$, $' + ex(k) + ' = 1$, so the gradient is $' + ans + '$.');
    }),
    G('chain-power', function () {
      var a = pick([2, 3, 4, 5]), n = pick([3, 4]), t = pick([1, 2, -1, -2]), x0 = rint(1, 3);
      var b = t - a * x0, ans = a * n * Math.pow(t, n - 1);
      return N('Given $y = ' + br(P([[a, 'x'], [b, '']])) + '^{' + n + '}$, find the value of $' + Y1 + '$ when $x = ' + x0 + '$.', ans,
        'Chain rule: $' + Y1 + ' = ' + n + '\\times ' + a + br(P([[a, 'x'], [b, '']])) + '^{' + (n - 1) + '} = ' + (a * n) + br(P([[a, 'x'], [b, '']])) + '^{' + (n - 1) + '}$. When $x = ' + x0 + '$ the bracket equals $' + t + '$, so the gradient is $' + (a * n) + '\\times ' + (t < 0 ? '(' + t + ')' : t) + '^{' + (n - 1) + '} = ' + ans + '$.');
    }),
    G('chain-root', function () {
      var tr = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]);
      var a = tr[0], b = tr[1], h = tr[2];
      return N('Given $y = \\sqrt{x^2 + ' + (b * b) + '}$, find the value of $' + Y1 + '$ when $x = ' + a + '$. Give your answer as a decimal.', a / h,
        'Write $y = (x^2 + ' + (b * b) + ')^{\\frac{1}{2}}$. Chain rule: $' + Y1 + ' = \\frac{1}{2}(x^2 + ' + (b * b) + ')^{-\\frac{1}{2}}\\times 2x = \\frac{x}{\\sqrt{x^2 + ' + (b * b) + '}}$. At $x = ' + a + '$ this is $\\frac{' + a + '}{' + h + '} = ' + num(a / h) + '$.');
    }),
    G('chain-trig', function () {
      var A = pick([2, 4]), k = pick([1, 2, 3, 5]);
      var ans = A * k / 2;
      return N('Given $y = ' + A + '\\sin ' + kx(k) + '$ (with $x$ in radians), find the gradient of the curve at the point where $x = \\frac{\\pi}{' + (3 * k) + '}$.', ans,
        '$' + Y1 + ' = ' + (A * k) + '\\cos ' + kx(k) + '$. When $x = \\frac{\\pi}{' + (3 * k) + '}$, ' + (k === 1 ? '' : '$' + k + 'x = \\frac{\\pi}{3}$ and ') + '$\\cos\\frac{\\pi}{3} = \\frac{1}{2}$, so the gradient is $' + (A * k) + '\\times\\frac{1}{2} = ' + ans + '$.');
    }),
    G('product-chain-both', function () {
      var a = pick([2, 3, -2]), b = rnz(-4, 4), n = pick([2, 3, 4]);
      var inner = br(P([[a, 'x'], [b, '']]));
      var right = inner + pw(n - 1) + br(P([[(1 + n) * a, 'x'], [b, '']]));
      return C('Differentiate $y = x' + inner + pw(n) + '$ with respect to $x$.', M(right),
        [M(inner + pw(n - 1) + br(P([[a + n, 'x'], [b, '']]))), M(K(n * a, 'x') + inner + pw(n - 1)), M(inner + pw(n - 1) + br(P([[(1 + n) * a, 'x'], [-b, '']]))), M(inner + pw(n - 1) + br(P([[(1 + n) * a, 'x'], [n * b, '']])))],
        'Product rule with $u = x$ and $v = ' + inner + pw(n) + '$: $u\' = 1$ and $v\' = ' + (n * a) + inner + pw(n - 1) + '$ (chain rule). So $' + Y1 + ' = ' + inner + pw(n) + ' + ' + K(n * a, 'x') + inner + pw(n - 1) + '$. Take out $' + inner + pw(n - 1) + '$ to get $' + right + '$.');
    }),
    G('product-poly-trig', function () {
      var n = pick([2, 3]), k = pick([2, 3, 4, 5]);
      var xn = n === 1 ? 'x' : 'x^{' + n + '}', xm = n - 1 === 1 ? 'x' : 'x^{' + (n - 1) + '}';
      var right = P([[n, xm + '\\cos ' + kx(k)], [-k, xn + '\\sin ' + kx(k)]]);
      return C('Differentiate $y = ' + xn + '\\cos ' + kx(k) + '$ with respect to $x$.', M(right),
        [M(P([[n, xm + '\\cos ' + kx(k)], [k, xn + '\\sin ' + kx(k)]])), M(P([[n, xm + '\\cos ' + kx(k)], [-1, xn + '\\sin ' + kx(k)]])), M(P([[-k * n, xm + '\\sin ' + kx(k)]])), M(P([[1, xm + '\\cos ' + kx(k)], [-k, xn + '\\sin ' + kx(k)]]))],
        'Product rule with $u = ' + xn + '$, $v = \\cos ' + kx(k) + '$: $u\' = ' + K(n, xm) + '$, $v\' = ' + K(-k, '\\sin ' + kx(k)) + '$. So $' + Y1 + ' = ' + right + '$.');
    }),
    G('show-factorise', function () {
      var a = pick([2, 3, 4, 5]), b = rnz(-5, 5), k = pick([2, 3, 4, -2]);
      var p = k * a, q = a + k * b;
      var which = pick(['p', 'q']);
      return N('It is given that $y = ' + br(P([[a, 'x'], [b, '']])) + ex(k) + '$ and that $' + Y1 + ' = ' + ex(k) + '(px + q)$, where $p$ and $q$ are constants. Find the value of $' + which + '$.', which === 'p' ? p : q,
        'Product and chain rules give $' + Y1 + ' = ' + ex(k) + br(P([[p, 'x'], [q, '']])) + '$, so $p = ' + p + '$ and $q = ' + q + '$ (the constant term is $' + a + ' + ' + k + '\\times ' + (b < 0 ? '(' + b + ')' : b) + '$).');
    }),
    S('spot-error', 'A student differentiates $y = e^{3x}\\cos 2x$ and writes $\\frac{dy}{dx} = e^{3x}(3\\cos 2x + 2\\sin 2x)$. What is wrong?',
      ['The derivative of $\\cos 2x$ is $-2\\sin 2x$, so the sign of the second term is wrong', 'The $e^{3x}$ should not have been differentiated', 'The product rule should be $u\'v\'$, not $uv\' + vu\'$', 'The factor $3$ should not appear because $\\frac{d}{dx}e^{3x} = e^{3x}$'], 0,
      'The product rule is right, but $\\frac{d}{dx}(\\cos 2x) = -2\\sin 2x$. The correct answer is $e^{3x}(3\\cos 2x - 2\\sin 2x)$.'),
    S('choose-rule', 'Which of these needs the product rule, not just the chain rule?',
      ['$y = x^2 e^{3x}$', '$y = \\sin(3x + 1)$', '$y = e^{5x}$', '$y = (2x - 1)^4$'], 0,
      '$x^2e^{3x}$ is two different functions of $x$ multiplied together. The others are one function of a bracket or of $kx$, which only needs the chain rule.')
  ] };

  // =====================================================================
  // FPM-CAL-02 Quotient rule
  // =====================================================================
  function linq() {   // (ax+b)/(cx+d) with ad-bc nonzero
    var a, b, c, d;
    do { a = rnz(-3, 4); b = rnz(-7, 7); c = pick([1, 2, 3, -1, -2]); d = rnz(-7, 7); } while (a * d - b * c === 0);
    return { a: a, b: b, c: c, d: d, k: a * d - b * c, top: P([[a, 'x'], [b, '']]), bot: P([[c, 'x'], [d, '']]) };
  }
  function ratk(k, D, sq) { return (k < 0 ? '-' : '') + '\\frac{' + Math.abs(k) + '}{' + (sq ? br(D) + '^2' : br(D)) + '}'; }
  B['FPM-CAL-02'] = { title: 'The quotient rule: differentiating fractions', items: [
    G('quotient-linear', function () {
      var t = linq();
      return C('Differentiate $y = \\frac{' + t.top + '}{' + t.bot + '}$ with respect to $x$.', M(ratk(t.k, t.bot, true)),
        [M(ratk(-t.k, t.bot, true)), M(ratk(t.k, t.bot, false)), M(ratk(t.a * t.d + t.b * t.c, t.bot, true)), M(ratk(t.a * t.d, t.bot, true))],
        'With $u = ' + t.top + '$ and $v = ' + t.bot + '$, $' + Y1 + ' = \\frac{vu\' - uv\'}{v^2} = \\frac{' + br(t.bot) + '(' + t.a + ') - ' + br(t.top) + '(' + t.c + ')}{' + br(t.bot) + '^2}$. The $x$ terms cancel and the numerator is $' + t.a + '\\times ' + (t.d < 0 ? '(' + t.d + ')' : t.d) + ' - ' + (t.b < 0 ? '(' + t.b + ')' : t.b) + '\\times ' + (t.c < 0 ? '(' + t.c + ')' : t.c) + ' = ' + t.k + '$. The denominator stays squared.');
    }),
    G('gradient-at-point', function () {
      var g = rnz(-5, 6), D = pick([1, 2, 3, 4, 5]), sgn = pick([1, -1]), c = pick([1, 2]), x0 = rint(-3, 3), a, b, d, k, tries = 0;
      do {
        D = sgn * D; k = g * D * D; d = D - c * x0; a = rnz(-3, 4);
        b = (a * d - k) / c; tries++;
        D = Math.abs(D); sgn = pick([1, -1]);
      } while ((b !== Math.round(b) || b === 0 || d === 0 || a * d - b * c !== k) && tries < 2000);
      var den = c * x0 + d;
      return N('Given $y = \\frac{' + P([[a, 'x'], [b, '']]) + '}{' + P([[c, 'x'], [d, '']]) + '}$, find the gradient of the curve at the point where $x = ' + x0 + '$.', g,
        '$' + Y1 + ' = \\frac{' + k + '}{' + br(P([[c, 'x'], [d, '']])) + '^2}$ (numerator $' + a + '\\times ' + (d < 0 ? '(' + d + ')' : d) + ' - ' + (b < 0 ? '(' + b + ')' : b) + '\\times ' + c + ' = ' + k + '$). At $x = ' + x0 + '$ the bracket is $' + den + '$, so the gradient is $\\frac{' + k + '}{' + den * den + '} = ' + g + '$.');
    }),
    G('sign-argument', function () {
      var t = linq(), pos = t.k > 0;
      var opts = ['The gradient is always positive (for every allowed $x$)', 'The gradient is always negative (for every allowed $x$)', 'The gradient is positive for some $x$ and negative for others', 'The gradient is zero when $x = ' + fr(-t.d, t.c) + '$'];
      return S('sign-argument', 'The curve $y = \\frac{' + t.top + '}{' + t.bot + '}$ is defined for $x \\ne ' + fr(-t.d, t.c) + '$. Which statement about its gradient is correct?', opts, pos ? 0 : 1,
        'The quotient rule gives $' + Y1 + ' = \\frac{' + t.k + '}{' + br(t.bot) + '^2}$. A square is positive, so a ' + (pos ? 'positive' : 'negative') + ' constant over a square is ' + (pos ? 'positive' : 'negative') + ' for every allowed $x$. The numerator is never zero, so the gradient is never zero either.');
    }),
    G('exp-over-linear', function () {
      var k = pick([2, 3, -2, 4]), b = rnz(-4, 4), D = P([[1, 'x'], [b, '']]);
      var right = '\\frac{' + ex(k) + br(P([[k, 'x'], [k * b - 1, '']])) + '}{' + br(D) + '^2}';
      return C('Differentiate $y = \\frac{' + ex(k) + '}{' + D + '}$ with respect to $x$.', M(right),
        [M('\\frac{' + ex(k) + br(P([[-k, 'x'], [1 - k * b, '']])) + '}{' + br(D) + '^2}'), M('\\frac{' + ex(k) + br(P([[1, 'x'], [b - 1, '']])) + '}{' + br(D) + '^2}'), M('\\frac{' + ex(k) + br(P([[k, 'x'], [k * b - 1, '']])) + '}{' + br(D) + '}'), M('\\frac{' + ex(k) + br(P([[k, 'x'], [k * b + 1, '']])) + '}{' + br(D) + '^2}')],
        'Quotient rule with $u = ' + ex(k) + '$ ($u\' = ' + K(k, ex(k)) + '$) and $v = ' + D + '$ ($v\' = 1$): numerator $vu\' - uv\' = ' + br(D) + K(k, ex(k)) + ' - ' + ex(k) + ' = ' + ex(k) + br(P([[k, 'x'], [k * b - 1, '']])) + '$, over $' + br(D) + '^2$.');
    }),
    G('trig-over-linear', function () {
      var k = pick([2, 3, 4]), b = rnz(-4, 4), D = P([[1, 'x'], [b, '']]);
      var sn = '\\sin ' + kx(k), cs = '\\cos ' + kx(k);
      var c1 = k + br(D) + cs;
      var right = '\\frac{' + c1 + ' - ' + sn + '}{' + br(D) + '^2}';
      return C('Differentiate $y = \\frac{' + sn + '}{' + D + '}$ with respect to $x$.', M(right),
        [M('\\frac{' + sn + ' - ' + c1 + '}{' + br(D) + '^2}'), M('\\frac{' + br(D) + cs + ' - ' + sn + '}{' + br(D) + '^2}'), M('\\frac{' + c1 + ' + ' + sn + '}{' + br(D) + '^2}'), M('\\frac{' + c1 + ' - ' + sn + '}{' + br(D) + '}')],
        'Quotient rule with $u = ' + sn + '$ ($u\' = ' + k + cs + '$ by the chain rule) and $v = ' + D + '$ ($v\' = 1$): $' + Y1 + ' = \\frac{' + br(D) + '\\times ' + k + cs + ' - ' + sn + '\\times 1}{' + br(D) + '^2}$.');
    }),
    G('gradient-at-zero', function () {
      var c = pick([2, 4, 5, 10]);
      return N('Given $y = \\frac{x}{x^2 + ' + c + '}$, find the gradient of the curve at the point where $x = 0$. Give your answer as a decimal.', 1 / c,
        'Quotient rule: $' + Y1 + ' = \\frac{(x^2 + ' + c + ')(1) - x(2x)}{(x^2 + ' + c + ')^2} = \\frac{' + c + ' - x^2}{(x^2 + ' + c + ')^2}$. At $x = 0$ this is $\\frac{' + c + '}{' + c * c + '} = ' + num(1 / c) + '$.');
    }),
    G('gradient-at-point', function () {
      var D = pick([1, 2, 4, 5]), x0 = rint(1, 4), b = D - x0;
      if (b === 0) { D += 1; if (D === 3) D = 4; b = D - x0; if (b === 0) { D = 5; b = 5 - x0; } }
      var den = x0 + b;
      var ans = (x0 * x0 + 2 * b * x0) / (den * den);
      return N('Given $y = \\frac{x^2}{' + P([[1, 'x'], [b, '']]) + '}$, find the gradient of the curve at the point where $x = ' + x0 + '$. Give your answer as a decimal.', ans,
        'Quotient rule: $' + Y1 + ' = \\frac{' + br(P([[1, 'x'], [b, '']])) + '(2x) - x^2(1)}{' + br(P([[1, 'x'], [b, '']])) + '^2} = \\frac{x^2 + ' + (2 * b) + 'x}{' + br(P([[1, 'x'], [b, '']])) + '^2}$. At $x = ' + x0 + '$ the numerator is $' + (x0 * x0 + 2 * b * x0) + '$ and the denominator is $' + den + '^2 = ' + den * den + '$, so the gradient is $' + num(ans) + '$.');
    }),
    G('simplify-numerator', function () {
      var t = linq();
      return N('The quotient rule is used on $y = \\frac{' + t.top + '}{' + t.bot + '}$ and the answer is simplified to $' + Y1 + ' = \\frac{k}{(' + t.bot + ')^2}$. Find the value of $k$.', t.k,
        'The numerator is $vu\' - uv\' = (' + t.bot + ')(' + t.a + ') - (' + t.top + ')(' + t.c + ')$. The $x$ terms cancel, leaving $' + t.a * t.d + ' - ' + (t.b * t.c < 0 ? '(' + t.b * t.c + ')' : t.b * t.c) + ' = ' + t.k + '$.');
    }),
    S('quotient-rule-form', 'Which is the correct quotient rule for $y = \\frac{u}{v}$?',
      ['$\\frac{dy}{dx} = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}$', '$\\frac{dy}{dx} = \\frac{u\\frac{dv}{dx} - v\\frac{du}{dx}}{v^2}$', '$\\frac{dy}{dx} = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v}$', '$\\frac{dy}{dx} = \\frac{\\frac{du}{dx}}{\\frac{dv}{dx}}$'], 0,
      'The numerator is bottom times derivative of top, minus top times derivative of bottom, and the whole denominator is squared. Reversing the order flips the sign of the answer.'),
    S('sign-argument', 'A curve has $\\frac{dy}{dx} = \\frac{-5}{(x - 1)^2}$ for $x \\ne 1$. Which reason shows that the gradient is always negative?',
      ['$(x-1)^2$ is positive for every $x \\ne 1$, so $-5$ divided by it is negative', '$-5$ is negative, so the gradient is negative whatever the denominator', 'When $x = 1$ the gradient is negative', 'The gradient is negative because $x - 1$ is negative'], 0,
      'The numerator is a negative constant and the squared denominator is always positive, so the fraction is negative for every allowed $x$. The sign of $x - 1$ does not matter because it is squared.'),
    S('sign-argument', 'A curve has $\\frac{dy}{dx} = \\frac{7}{(2x - 3)^2}$ for $x \\ne \\frac{3}{2}$. How many stationary points does the curve have?',
      ['None, because $7$ divided by a square is never $0$', 'One, at $x = \\frac{3}{2}$', 'One, at $x = 0$', 'Two, because the denominator is squared'], 0,
      'A stationary point needs $\\frac{dy}{dx} = 0$, but a non-zero constant divided by anything is never $0$. At $x = \\frac{3}{2}$ the gradient is not even defined.')
  ] };

  // =====================================================================
  // FPM-CAL-03 Differentiating twice and proving a relation
  // =====================================================================
  function esin(a, b, kind) { return ex(a) + '\\' + kind + ' ' + kx(b); }
  B['FPM-CAL-03'] = { title: 'Differentiating twice and proving a relation between y and its derivatives', items: [
    G('first-derivative', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]);
      var sn = '\\sin ' + kx(b), cs = '\\cos ' + kx(b);
      return C('Given $y = ' + ex(a) + sn + '$, find $\\frac{dy}{dx}$.', M(ex(a) + br(P([[a, sn], [b, cs]]))),
        [M(ex(a) + br(P([[a, sn], [-b, cs]]))), M(ex(a) + br(P([[b, sn], [a, cs]]))), M(ex(a) + br(P([[a, sn], [1, cs]]))), M(K(a * b, ex(a)) + cs)],
        'Product rule: $' + Y1 + ' = ' + ex(a) + '\\times ' + K(b, cs) + ' + ' + sn + '\\times ' + K(a, ex(a)) + ' = ' + ex(a) + br(P([[a, sn], [b, cs]])) + '$.');
    }),
    G('first-derivative', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]);
      var sn = '\\sin ' + kx(b), cs = '\\cos ' + kx(b);
      return C('Given $y = ' + ex(a) + cs + '$, find $\\frac{dy}{dx}$.', M(ex(a) + br(P([[a, cs], [-b, sn]]))),
        [M(ex(a) + br(P([[a, cs], [b, sn]]))), M(ex(a) + br(P([[b, cs], [-a, sn]]))), M(ex(a) + br(P([[a, cs], [-1, sn]]))), M(K(-a * b, ex(a)) + sn)],
        'Product rule: $' + Y1 + ' = ' + ex(a) + '\\times ' + pr(K(-b, sn)) + ' + ' + cs + '\\times ' + K(a, ex(a)) + ' = ' + ex(a) + br(P([[a, cs], [-b, sn]])) + '$. The derivative of cosine brings a minus sign.');
    }),
    G('second-derivative', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]);
      return N('Let $y = ' + ex(a) + '\\sin ' + kx(b) + '$, so that $' + Y1 + ' = ' + ex(a) + br(P([[a, '\\sin ' + kx(b)], [b, '\\cos ' + kx(b)]])) + '$. When $' + Y2 + '$ is written as $' + ex(a) + '(p\\sin ' + kx(b) + ' + q\\cos ' + kx(b) + ')$, find $q$.', 2 * a * b,
        'Differentiate $' + ex(a) + br(P([[a, '\\sin ' + kx(b)], [b, '\\cos ' + kx(b)]])) + '$ by the product rule. The $\\cos ' + kx(b) + '$ terms come from $' + a + '\\times ' + b + '\\cos$ (differentiating the sine) and $' + b + '\\times ' + a + '\\cos$ (differentiating the exponential), so $q = 2ab = ' + (2 * a * b) + '$. (Also $p = a^2 - b^2 = ' + (a * a - b * b) + '$.)');
    }),
    G('second-derivative', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]);
      return N('Let $y = ' + ex(a) + '\\sin ' + kx(b) + '$. Find the coefficient of $' + ex(a) + '\\sin ' + kx(b) + '$ in $' + Y2 + '$.', a * a - b * b,
        '$' + Y1 + ' = ' + ex(a) + br(P([[a, '\\sin ' + kx(b)], [b, '\\cos ' + kx(b)]])) + '$. Differentiating again, the sine terms are $' + a + '\\times ' + a + '\\sin$ and $' + b + '\\times(-' + b + '\\sin)$, so the coefficient is $a^2 - b^2 = ' + (a * a - b * b) + '$.');
    }),
    G('second-derivative', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]);
      return N('Let $y = ' + ex(a) + '\\cos ' + kx(b) + '$. Find the coefficient of $' + ex(a) + '\\sin ' + kx(b) + '$ in $' + Y2 + '$.', -2 * a * b,
        '$' + Y1 + ' = ' + ex(a) + br(P([[a, '\\cos ' + kx(b)], [-b, '\\sin ' + kx(b)]])) + '$. Differentiating again, the sine terms are $' + a + '\\times(-' + b + '\\sin)$ from the first part and $(-' + b + '\\sin)\\times ' + a + '$ from the exponential, giving $-2ab = ' + (-2 * a * b) + '$.');
    }),
    G('which-relation', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4]), f = pick(['sin', 'cos']);
      var rel = function (p, q) { return M(P([[1, Y2], [p, Y1], [q, 'y']]) + ' = 0'); };
      return C('The curve $y = ' + esin(a, b, f) + '$ satisfies a relation of the form $' + Y2 + ' + p' + Y1 + ' + qy = 0$. Which relation is correct?', rel(-2 * a, a * a + b * b),
        [rel(2 * a, a * a + b * b), rel(-2 * a, a * a - b * b), rel(-2 * a, b * b - a * a), rel(-a, a * a + b * b)],
        'Differentiating twice and collecting terms gives $' + Y2 + ' = ' + (2 * a) + Y1 + ' - ' + (a * a + b * b) + 'y$, i.e. $' + P([[1, Y2], [-2 * a, Y1], [a * a + b * b, 'y']]) + ' = 0$. The general result for $e^{ax}\\sin bx$ or $e^{ax}\\cos bx$ is $y\'\' - 2ay\' + (a^2 + b^2)y = 0$.');
    }),
    G('find-constants', function () {
      var a = pick([1, 2, 3, -1, -2, 4]), b = pick([2, 3, 4]), f = pick(['sin', 'cos']);
      return N('The function $y = ' + esin(a, b, f) + '$ satisfies $' + Y2 + ' + p' + Y1 + ' + qy = 0$ for constants $p$ and $q$. Find the value of $p$.', -2 * a,
        'Differentiating twice gives $' + Y2 + ' = ' + (2 * a) + Y1 + ' - ' + (a * a + b * b) + 'y$. Rearranged, this is $' + Y2 + ' ' + (-2 * a < 0 ? '- ' + (2 * a) : '+ ' + (-2 * a)) + Y1 + ' + ' + (a * a + b * b) + 'y = 0$, so $p = ' + (-2 * a) + '$ (and $q = ' + (a * a + b * b) + '$).');
    }),
    G('find-constants', function () {
      var a = pick([1, 2, 3, -1, -2]), b = pick([2, 3, 4, 5]), f = pick(['sin', 'cos']);
      return N('The function $y = ' + esin(a, b, f) + '$ satisfies $' + Y2 + ' + p' + Y1 + ' + qy = 0$ for constants $p$ and $q$. Find the value of $q$.', a * a + b * b,
        'The standard result is $q = a^2 + b^2$. Here $q = ' + (a * a) + ' + ' + (b * b) + ' = ' + (a * a + b * b) + '$ (and $p = ' + (-2 * a) + '$).');
    }),
    G('find-b', function () {
      var a = pick([1, 2, 3]), b = pick([2, 3, 4, 5]);
      return N('The function $y = ' + ex(a) + '\\sin bx$, where $b \\gt 0$, satisfies $' + P([[1, Y2], [-2 * a, Y1], [a * a + b * b, 'y']]) + ' = 0$. Find the value of $b$.', b,
        'For $y = e^{ax}\\sin bx$ the relation is $y\'\' - 2ay\' + (a^2 + b^2)y = 0$ with $a = ' + a + '$. So $' + a * a + ' + b^2 = ' + (a * a + b * b) + '$, giving $b^2 = ' + (b * b) + '$ and $b = ' + b + '$.');
    }),
    G('product-poly', function () {
      var k = pick([2, 3, 4, 5, -2, -3]);
      var which = pick([0, 1]);
      if (which === 0) return N('Let $y = x' + ex(k) + '$. Find the value of $' + Y2 + '$ when $x = 0$.', 2 * k,
        '$' + Y1 + ' = ' + ex(k) + br(P([[k, 'x'], [1, '']])) + '$. Differentiating again: $' + Y2 + ' = ' + ex(k) + br(P([[k * k, 'x'], [2 * k, '']])) + '$. At $x = 0$ this is $' + (2 * k) + '$.');
      return N('The curve $y = x' + ex(k) + '$ satisfies $' + Y2 + ' + p' + Y1 + ' + qy = 0$. Find the value of $p$.', -2 * k,
        '$' + Y1 + ' = ' + ex(k) + br(P([[k, 'x'], [1, '']])) + '$ and $' + Y2 + ' = ' + ex(k) + br(P([[k * k, 'x'], [2 * k, '']])) + '$. Matching with $' + Y2 + ' - ' + (2 * k < 0 ? '(' + (2 * k) + ')' : 2 * k) + Y1 + ' + ' + (k * k) + 'y = 0$ gives $p = ' + (-2 * k) + '$ (and $q = ' + (k * k) + '$).');
    }),
    S('chain-slip', 'When $y = e^{2x}\\cos 3x$ is differentiated a second time, a student writes $\\frac{d}{dx}(\\cos 3x) = -\\sin 3x$. What is the correct derivative?',
      ['$-3\\sin 3x$', '$3\\sin 3x$', '$-\\frac{1}{3}\\sin 3x$', '$-\\sin 3x$ is correct'], 0,
      'The chain rule multiplies by the derivative of $3x$, which is $3$, so $\\frac{d}{dx}(\\cos 3x) = -3\\sin 3x$. Missing this factor spoils every later line.'),
    S('proof-structure', 'To show that $\\frac{d^2y}{dx^2} - 6\\frac{dy}{dx} + 13y = 0$ for $y = e^{3x}\\sin 2x$, which is the best final step after substituting $y$, $\\frac{dy}{dx}$ and $\\frac{d^2y}{dx^2}$?',
      ['Collect the $e^{3x}\\sin 2x$ terms and the $e^{3x}\\cos 2x$ terms and show that each coefficient is $0$', 'Write "= 0" because both sides look similar', 'Divide every term by $y$ and state the result', 'Substitute $x = 0$ and show the left side is $0$'], 0,
      'A proof must show the cancellation: with $\\frac{d^2y}{dx^2} = e^{3x}(5\\sin 2x + 12\\cos 2x)$ the sine terms give $5 - 18 + 13 = 0$ and the cosine terms give $12 - 12 = 0$, so the left side is $0$ for all $x$. Checking one value of $x$ proves nothing about all $x$.')
  ] };

  // ---------- quadratic helper for tangent / normal types ----------
  function quad() {
    var a, b, c, x0, m;
    do { a = pick([1, 1, 2, 3, -1, -2]); b = rint(-6, 6); c = rint(-8, 8); x0 = rnz(-3, 3); m = 2 * a * x0 + b; } while (m === 0);
    var y0 = a * x0 * x0 + b * x0 + c;
    return { a: a, b: b, c: c, x0: x0, m: m, y0: y0, text: P([[a, 'x^2'], [b, 'x'], [c, '']]), dtext: P([[2 * a, 'x'], [b, '']]) };
  }
  function pt(x, y) { return '(' + x + ', ' + y + ')'; }

  // =====================================================================
  // FPM-CAL-04 Equation of a tangent
  // =====================================================================
  B['FPM-CAL-04'] = { title: 'Finding the equation of a tangent', items: [
    G('gradient', function () {
      var q = quad();
      return N('The curve $y = ' + q.text + '$ has a tangent at the point where $x = ' + q.x0 + '$. Find the gradient of this tangent.', q.m,
        '$' + Y1 + ' = ' + q.dtext + '$. Substituting $x = ' + q.x0 + '$ gives the gradient $' + q.m + '$.');
    }),
    G('y-intercept', function () {
      var q = quad(), ci = q.y0 - q.m * q.x0;
      return N('The curve $y = ' + q.text + '$ passes through the point $P$ where $x = ' + q.x0 + '$. The tangent to the curve at $P$ meets the $y$-axis at the point $(0, k)$. Find $k$.', ci,
        'Gradient: $' + Y1 + ' = ' + q.dtext + '$, so $m = ' + q.m + '$ at $x = ' + q.x0 + '$. The $y$-coordinate of $P$ comes from the curve: $y = ' + q.y0 + '$. The tangent is $y - ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = ' + q.m + '(x - ' + (q.x0 < 0 ? '(' + q.x0 + ')' : q.x0) + ')$. Putting $x = 0$ gives $k = ' + q.y0 + ' - ' + (q.m * q.x0 < 0 ? '(' + q.m * q.x0 + ')' : q.m * q.x0) + ' = ' + ci + '$.');
    }),
    G('tangent-equation', function () {
      var q = quad(), ci = q.y0 - q.m * q.x0;
      var eq = function (m, c) { return M('y = ' + P([[m, 'x'], [c, '']])); };
      return C('Find the equation of the tangent to the curve $y = ' + q.text + '$ at the point where $x = ' + q.x0 + '$.', eq(q.m, ci),
        [eq(q.m, q.y0 + q.m * q.x0), eq(q.m, q.m * q.x0 - q.y0), eq(q.m, q.y0), eq(q.y0, ci), eq(-q.m, ci), eq(q.m, -ci), eq(q.m + 1, ci)],
        'Gradient: $' + Y1 + ' = ' + q.dtext + '$, which is $' + q.m + '$ at $x = ' + q.x0 + '$. The point is $' + pt(q.x0, q.y0) + '$ (found from the curve). So $y - ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = ' + q.m + '(x - ' + (q.x0 < 0 ? '(' + q.x0 + ')' : q.x0) + ')$, i.e. $y = ' + P([[q.m, 'x'], [ci, '']]) + '$.');
    }),
    G('tangent-equation', function () {
      var b = rint(-6, 6), c = rint(-6, 6), x0 = pick([-2, -1, 1, 2]);
      var m = 3 * x0 * x0 + b, y0 = x0 * x0 * x0 + b * x0 + c, ci = y0 - m * x0;
      var eq = function (mm, cc) { return M('y = ' + P([[mm, 'x'], [cc, '']])); };
      return C('Find the equation of the tangent to the curve $y = ' + P([[1, 'x^3'], [b, 'x'], [c, '']]) + '$ at the point where $x = ' + x0 + '$.', eq(m, ci),
        [eq(m, y0 + m * x0), eq(m, m * x0 - y0), eq(b, c), eq(3 * x0 * x0, ci), eq(-m, ci), eq(m, -ci), eq(m + 1, ci)],
        '$' + Y1 + ' = ' + P([[3, 'x^2'], [b, '']]) + '$, so the gradient at $x = ' + x0 + '$ is $' + m + '$. The curve gives $y = ' + y0 + '$ at $x = ' + x0 + '$. Then $y - ' + (y0 < 0 ? '(' + y0 + ')' : y0) + ' = ' + m + '(x - ' + (x0 < 0 ? '(' + x0 + ')' : x0) + ')$, i.e. $y = ' + P([[m, 'x'], [ci, '']]) + '$.');
    }),
    G('x-intercept', function () {
      var q, tries = 0;
      do { q = quad(); tries++; } while ((q.m === 0 || q.y0 % q.m !== 0) && tries < 5000);
      var xi = q.x0 - q.y0 / q.m;
      return N('The tangent to the curve $y = ' + q.text + '$ at the point where $x = ' + q.x0 + '$ meets the $x$-axis at the point $(p, 0)$. Find $p$.', xi,
        'Gradient $= ' + q.m + '$ and the point is $' + pt(q.x0, q.y0) + '$. Setting $y = 0$ in $y - ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = ' + q.m + '(x - ' + (q.x0 < 0 ? '(' + q.x0 + ')' : q.x0) + ')$ gives $x = ' + q.x0 + ' - \\frac{' + q.y0 + '}{' + q.m + '} = ' + xi + '$.');
    }),
    G('exp-tangent', function () {
      var A = pick([1, 2, 3, 5]), k = pick([2, 4, 5, -2, -4, -5]);
      return N('The curve $y = ' + K(A, ex(k)) + '$ crosses the $y$-axis at $P$. The tangent to the curve at $P$ meets the $x$-axis at the point $(p, 0)$. Find $p$.', -1 / k,
        'At $P$, $x = 0$ and $y = ' + A + '$. Also $' + Y1 + ' = ' + K(A * k, ex(k)) + '$, so the gradient at $P$ is $' + (A * k) + '$. The tangent is $y = ' + (A * k) + 'x + ' + A + '$. Setting $y = 0$ gives $x = -\\frac{' + A + '}{' + (A * k) + '} = ' + num(-1 / k) + '$.');
    }),
    G('root-tangent', function () {
      var s = rint(2, 6), x0 = s * s;
      return N('The tangent to the curve $y = \\sqrt{x}$ at the point where $x = ' + x0 + '$ meets the $y$-axis at the point $(0, k)$. Find $k$ as a decimal.', s / 2,
        '$y = x^{\\frac{1}{2}}$ so $' + Y1 + ' = \\frac{1}{2\\sqrt{x}}$. At $x = ' + x0 + '$ the gradient is $\\frac{1}{' + 2 * s + '}$ and $y = ' + s + '$. The tangent is $y - ' + s + ' = \\frac{1}{' + 2 * s + '}(x - ' + x0 + ')$. At $x = 0$: $y = ' + s + ' - \\frac{' + x0 + '}{' + 2 * s + '} = ' + num(s / 2) + '$.');
    }),
    G('reciprocal-gradient', function () {
      var x0 = pick([1, 2, 3, 4, 5]), t = rint(1, 5), a = t * x0 * x0;
      return N('Find the gradient of the tangent to the curve $y = \\frac{' + a + '}{x}$ at the point where $x = ' + x0 + '$.', -t,
        '$y = ' + a + 'x^{-1}$, so $' + Y1 + ' = -' + a + 'x^{-2} = -\\frac{' + a + '}{x^2}$. At $x = ' + x0 + '$ this is $-\\frac{' + a + '}{' + x0 * x0 + '} = ' + (-t) + '$.');
    }),
    G('trig-gradient', function () {
      var A = rint(2, 6), k = rint(2, 5);
      return N('The curve $y = ' + A + '\\sin ' + kx(k) + '$ (with $x$ in radians) passes through the origin. Find the gradient of the tangent to the curve at the origin.', A * k,
        '$' + Y1 + ' = ' + (A * k) + '\\cos ' + kx(k) + '$. At $x = 0$, $\\cos 0 = 1$, so the gradient is $' + (A * k) + '$.');
    }),
    G('exp-tangent', function () {
      var k = pick([2, 3, 4, 5]), A = pick([2, 3, 4]);
      return N('The tangent to the curve $y = ' + A + ex(k) + '$ at the point where $x = 0$ has the equation $y = mx + c$. Find $m + c$.', A * k + A,
        'At $x = 0$: $y = ' + A + '$, so $c = ' + A + '$. $' + Y1 + ' = ' + (A * k) + ex(k) + '$, which is $' + (A * k) + '$ at $x = 0$, so $m = ' + (A * k) + '$. Then $m + c = ' + (A * k + A) + '$.');
    }),
    S('y-from-curve', 'To find the equation of the tangent to $y = x^3 - 4x$ at the point where $x = 2$, how should the $y$-coordinate of the point be found?',
      ['Substitute $x = 2$ into $y = x^3 - 4x$', 'Substitute $x = 2$ into $\\frac{dy}{dx} = 3x^2 - 4$', 'Set $\\frac{dy}{dx} = 0$ and solve', 'Use the gradient as the $y$-coordinate'], 0,
      'The point lies on the curve, so its $y$-coordinate comes from the curve ($y = 0$ here). Substituting into $\\frac{dy}{dx}$ gives the gradient, which is a different number ($8$).'),
    S('line-form', 'A tangent has gradient $3$ and touches the curve at the point $(2, 5)$. Which is its equation?',
      ['$y - 5 = 3(x - 2)$', '$y - 2 = 3(x - 5)$', '$y + 5 = 3(x + 2)$', '$y = 3x + 5$'], 0,
      'The straight-line equation is $y - y_1 = m(x - x_1)$ with $m = 3$ and $(x_1, y_1) = (2, 5)$. This gives $y = 3x - 1$.')
  ] };

  // =====================================================================
  // FPM-CAL-05 Equation of a normal
  // =====================================================================
  function quadM(ms) {   // quadratic whose gradient at x0 is one of ms
    var a = pick([1, 1, 2, -1, 3]), x0 = rint(-3, 3), m = pick(ms), b = m - 2 * a * x0, c = rint(-8, 8);
    return { a: a, b: b, c: c, x0: x0, m: m, y0: a * x0 * x0 + b * x0 + c, text: P([[a, 'x^2'], [b, 'x'], [c, '']]), dtext: P([[2 * a, 'x'], [b, '']]) };
  }
  var NM = [2, 3, 4, 5, -2, -3, -4, -5, 8, -8, 10];
  B['FPM-CAL-05'] = { title: 'Finding the equation of a normal', items: [
    G('normal-gradient', function () {
      var q = quadM([2, 4, 5, -2, -4, -5, 8, -8, 10]);
      return N('The curve $y = ' + q.text + '$ has a normal at the point where $x = ' + q.x0 + '$. Find the gradient of this normal as a decimal.', -1 / q.m,
        '$' + Y1 + ' = ' + q.dtext + '$, so the tangent gradient at $x = ' + q.x0 + '$ is $' + q.m + '$. The normal gradient is the negative reciprocal: $-\\frac{1}{' + (q.m < 0 ? '(' + q.m + ')' : q.m) + '} = ' + num(-1 / q.m) + '$.');
    }),
    G('integer-form', function () {
      var q = quadM(NM);
      var eq = function (a, b, c) { return M(P([[a, 'x'], [b, 'y'], [c, '']]) + ' = 0'); };
      var m = q.m;
      return C('Find the equation of the normal to the curve $y = ' + q.text + '$ at the point where $x = ' + q.x0 + '$. Give your answer in the form $ax + by + c = 0$ with integer coefficients.',
        eq(1, m, -q.x0 - m * q.y0),
        [eq(m, -1, -m * q.x0 + q.y0), eq(1, -m, -q.x0 + m * q.y0), eq(1, m, q.x0 + m * q.y0), eq(1, m, -q.x0 + m * q.y0), eq(1, m, -q.x0), eq(1, -m, -q.x0 - m * q.y0), eq(m, 1, -q.x0 - m * q.y0)],
        'Tangent gradient: $' + Y1 + ' = ' + q.dtext + '$, which is $' + m + '$ at $x = ' + q.x0 + '$, where $y = ' + q.y0 + '$. The normal gradient is $-\\frac{1}{' + (m < 0 ? '(' + m + ')' : m) + '}$, so $y - ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = -\\frac{1}{' + (m < 0 ? '(' + m + ')' : m) + '}(x - ' + (q.x0 < 0 ? '(' + q.x0 + ')' : q.x0) + ')$. Multiplying by $' + m + '$ and rearranging gives $' + P([[1, 'x'], [m, 'y'], [-q.x0 - m * q.y0, '']]) + ' = 0$.');
    }),
    G('x-intercept', function () {
      var q = quadM(NM);
      var xi = q.x0 + q.m * q.y0;
      return N('The curve $y = ' + q.text + '$ has a normal at the point $P$ where $x = ' + q.x0 + '$. The normal meets the $x$-axis at the point $(p, 0)$. Find $p$.', xi,
        'Tangent gradient at $P$ is $' + q.m + '$, and $P = ' + pt(q.x0, q.y0) + '$. Normal: $y - ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = -\\frac{1}{' + (q.m < 0 ? '(' + q.m + ')' : q.m) + '}(x - ' + (q.x0 < 0 ? '(' + q.x0 + ')' : q.x0) + ')$. Setting $y = 0$: $x = ' + q.x0 + ' + ' + (q.m < 0 ? '(' + q.m + ')' : q.m) + '\\times ' + (q.y0 < 0 ? '(' + q.y0 + ')' : q.y0) + ' = ' + xi + '$.');
    }),
    G('y-intercept', function () {
      var m = pick([2, 3, -2, -3]), t = pick([-2, -1, 1, 2]), x0 = m * t, a = pick([1, 2, -1]), b = m - 2 * a * x0, c = rint(-6, 6);
      var y0 = a * x0 * x0 + b * x0 + c, yi = y0 + x0 / m;
      return N('The curve $y = ' + P([[a, 'x^2'], [b, 'x'], [c, '']]) + '$ has a normal at the point $P$ where $x = ' + x0 + '$. The normal meets the $y$-axis at $(0, k)$. Find $k$.', yi,
        '$' + Y1 + ' = ' + P([[2 * a, 'x'], [b, '']]) + '$, so the tangent gradient at $P$ is $' + m + '$ and $P = ' + pt(x0, y0) + '$. The normal has gradient $-\\frac{1}{' + (m < 0 ? '(' + m + ')' : m) + '}$: $y - ' + (y0 < 0 ? '(' + y0 + ')' : y0) + ' = -\\frac{1}{' + (m < 0 ? '(' + m + ')' : m) + '}(x - ' + (x0 < 0 ? '(' + x0 + ')' : x0) + ')$. At $x = 0$, $k = ' + y0 + ' + \\frac{' + x0 + '}{' + (m < 0 ? '(' + m + ')' : m) + '} = ' + yi + '$.');
    }),
    G('exp-normal', function () {
      var k = pick([2, 3, 4, 5, -2, -3]);
      var eq = function (a, b, c) { return M(P([[a, 'x'], [b, 'y'], [c, '']]) + ' = 0'); };
      return C('The curve $y = ' + ex(k) + '$ crosses the $y$-axis at $P$. Find the equation of the normal at $P$ in the form $ax + by + c = 0$ with $a \\gt 0$ and integer coefficients.',
        eq(1, k, -k),
        [eq(k, -1, 1), eq(1, -k, k), eq(1, k, k), eq(k, 1, -1)],
        'At $P$, $x = 0$ and $y = 1$. $' + Y1 + ' = ' + K(k, ex(k)) + '$, so the tangent gradient at $P$ is $' + k + '$ and the normal gradient is $-\\frac{1}{' + (k < 0 ? '(' + k + ')' : k) + '}$. Normal: $y - 1 = -\\frac{1}{' + (k < 0 ? '(' + k + ')' : k) + '}x$. Multiply by $' + k + '$: $' + P([[k, 'y'], [-k, '']]) + ' = ' + P([[-1, 'x']]) + '$, i.e. $' + P([[1, 'x'], [k, 'y'], [-k, '']]) + ' = 0$.');
    }),
    G('fraction-gradient', function () {
      var p = rnz(-7, 7), q = pick([2, 3, 4, 5, 7]);
      while (gcd(p, q) !== 1) { p = rnz(-7, 7); }
      var frac = function (n, d) { return M(fr(n, d)); };
      return C('The tangent to a curve at a point has gradient $' + fr(p, q) + '$. What is the gradient of the normal at that point?', frac(-q, p),
        [frac(q, p), frac(-p, q), frac(p, q)],
        'The normal gradient is the negative reciprocal: $-1 \\div ' + (p < 0 || q > 0 ? '(' + fr(p, q) + ')' : fr(p, q)) + ' = ' + fr(-q, p) + '$. Check: $' + fr(p, q) + '\\times ' + (-q < 0 && p > 0 ? '(' + fr(-q, p) + ')' : fr(-q, p)) + ' = -1$.');
    }),
    G('root-normal', function () {
      var s = rint(1, 6), x0 = s * s;
      return N('The curve $y = \\sqrt{x}$ has a normal at the point where $x = ' + x0 + '$. Find the gradient of this normal.', -2 * s,
        '$' + Y1 + ' = \\frac{1}{2\\sqrt{x}}$, which is $\\frac{1}{' + 2 * s + '}$ at $x = ' + x0 + '$. The normal gradient is the negative reciprocal, $-' + 2 * s + '$.');
    }),
    G('reciprocal-normal', function () {
      var x0 = pick([2, 4, 5]), a = pick([1, 2, 4, 5, 8, 10]);
      var ans = x0 * x0 / a;
      return N('The curve $y = \\frac{' + a + '}{x}$ has a normal at the point where $x = ' + x0 + '$. Find the gradient of this normal as a decimal.', ans,
        '$' + Y1 + ' = -\\frac{' + a + '}{x^2}$, so the tangent gradient is $-\\frac{' + a + '}{' + x0 * x0 + '}$. The normal gradient is the negative reciprocal: $\\frac{' + x0 * x0 + '}{' + a + '} = ' + num(ans) + '$.');
    }),
    S('which-gradient', 'The tangent to a curve at $P$ has gradient $4$. Which statement about the normal at $P$ is correct?',
      ['It has gradient $-\\frac{1}{4}$, because the gradients multiply to $-1$', 'It has gradient $\\frac{1}{4}$, the reciprocal of $4$', 'It has gradient $-4$, the negative of $4$', 'It has gradient $4$, the same as the tangent'], 0,
      'The normal is perpendicular to the tangent, so the two gradients multiply to $-1$: $4\\times\\left(-\\frac{1}{4}\\right) = -1$. You need both the reciprocal and the change of sign.'),
    S('which-step', 'A student finds the normal to $y = x^2 + 3x$ at $x = 1$. They write: "$\\frac{dy}{dx} = 2x + 3 = 5$, so the point is $(1, 5)$". What is wrong?',
      ['The $y$-coordinate should come from the curve: $y = 4$, so the point is $(1, 4)$', 'The gradient should be $2x - 3$', 'The gradient of the normal should be used as the $y$-coordinate', 'Nothing is wrong'], 0,
      'The gradient is $5$ but the point is on the curve: $y = 1^2 + 3 = 4$. Using the gradient as the $y$-coordinate is a common error.'),
    S('perpendicular', 'The normal to a curve at $A$ has gradient $-\\frac{1}{5}$. Which is the gradient of the tangent at $A$?',
      ['$5$', '$\\frac{1}{5}$', '$-5$', '$-\\frac{1}{5}$'], 0,
      'The tangent is perpendicular to the normal, so its gradient is the negative reciprocal of $-\\frac{1}{5}$, which is $5$.')
  ] };

  // =====================================================================
  // FPM-CAL-06 Finding where a curve has a given gradient
  // =====================================================================
  function twoRoot() {   // cubic with dy/dx = m at x = r1 and x = r2
    var r1 = rint(-4, 2), r2 = r1 + 2 * rint(1, 3), m = rint(-6, 12), d = rint(-6, 6);
    var Bc = -3 * (r1 + r2) / 2, Cc = 3 * r1 * r2 + m;
    return { r1: r1, r2: r2, m: m, B: Bc, C: Cc, d: d, f: function (x) { return x * x * x + Bc * x * x + Cc * x + d; },
      text: P([[1, 'x^3'], [Bc, 'x^2'], [Cc, 'x'], [d, '']]), dtext: P([[3, 'x^2'], [2 * Bc, 'x'], [Cc, '']]) };
  }
  B['FPM-CAL-06'] = { title: 'Finding where a curve has a given gradient', items: [
    G('solve-gradient', function () {
      var t = twoRoot();
      return N('The tangent to the curve $y = ' + t.text + '$ is parallel to the line $y = ' + P([[t.m, 'x'], [rnz(-9, 9), '']]) + '$ at two points. Find the larger $x$-coordinate of these points.', t.r2,
        '$' + Y1 + ' = ' + t.dtext + '$. Parallel to the line means the gradient is $' + t.m + '$, so $' + t.dtext + ' = ' + t.m + '$, i.e. $' + P([[3, 'x^2'], [-3 * (t.r1 + t.r2), 'x'], [3 * t.r1 * t.r2, '']]) + ' = 0$. This factorises as $3(x - ' + (t.r1 < 0 ? '(' + t.r1 + ')' : t.r1) + ')(x - ' + (t.r2 < 0 ? '(' + t.r2 + ')' : t.r2) + ') = 0$, so the larger root is $x = ' + t.r2 + '$.');
    }),
    G('solve-gradient', function () {
      var t = twoRoot();
      return N('The gradient of the curve $y = ' + t.text + '$ is equal to $' + t.m + '$ at two points. Find the sum of their $x$-coordinates.', t.r1 + t.r2,
        'Setting $' + t.dtext + ' = ' + t.m + '$ gives $' + P([[3, 'x^2'], [-3 * (t.r1 + t.r2), 'x'], [3 * t.r1 * t.r2, '']]) + ' = 0$, whose roots are $' + t.r1 + '$ and $' + t.r2 + '$ (sum $' + (t.r1 + t.r2) + '$).');
    }),
    G('use-point', function () {
      var t = twoRoot();
      return N('The gradient of the curve $y = ' + t.text + '$ is equal to $' + t.m + '$ at two points. Find the $y$-coordinate of the point with the larger $x$-coordinate.', t.f(t.r2),
        'Setting $' + t.dtext + ' = ' + t.m + '$ gives $x = ' + t.r1 + '$ or $x = ' + t.r2 + '$. The larger is $x = ' + t.r2 + '$. The $y$-coordinate comes from the curve, not from $' + Y1 + '$: $y = ' + t.f(t.r2) + '$.');
    }),
    G('normal-parallel', function () {
      var t; do { t = twoRoot(); } while (t.m === 0);
      var g = t.m, kk = rint(1, 9), lt = P([[1, 'x'], [g, 'y']]) + ' = ' + kk;
      return N('The normal to the curve $y = ' + t.text + '$ at a point $P$ is parallel to the line $' + lt + '$. There are two such points. Find the larger $x$-coordinate of $P$.', t.r2,
        'The line $' + lt + '$ has gradient $-\\frac{1}{' + (g < 0 ? '(' + g + ')' : g) + '}$, so the normal has this gradient and the tangent gradient is its negative reciprocal, $' + g + '$. Solve $' + t.dtext + ' = ' + g + '$, i.e. $' + P([[3, 'x^2'], [-3 * (t.r1 + t.r2), 'x'], [3 * t.r1 * t.r2, '']]) + ' = 0$, which gives $x = ' + t.r1 + '$ or $x = ' + t.r2 + '$.');
    }),
    G('square-roots', function () {
      var a = pick([1, 2, 4, 5]), b = rnz(-5, 5), tt = pick([2, 3, 4, 5]);
      var xs = [(tt - b) / a, (-tt - b) / a];
      return N('The curve $y = \\frac{(' + P([[a, 'x'], [b, '']]) + ')^3}{' + (3 * a) + '}$ has gradient $' + (tt * tt) + '$ at two points. Find the larger $x$-coordinate as a decimal.', Math.max(xs[0], xs[1]),
        '$' + Y1 + ' = ' + (3 * a) + '(' + P([[a, 'x'], [b, '']]) + ')^2\\div ' + (3 * a) + ' = (' + P([[a, 'x'], [b, '']]) + ')^2$. Setting this to $' + tt * tt + '$ gives $' + P([[a, 'x'], [b, '']]) + ' = \\pm ' + tt + '$ (both signs), so $x = \\frac{' + tt + ' - ' + (b < 0 ? '(' + b + ')' : b) + '}{' + a + '}$ or $x = \\frac{-' + tt + ' - ' + (b < 0 ? '(' + b + ')' : b) + '}{' + a + '}$. The larger is $' + num(Math.max(xs[0], xs[1])) + '$.');
    }),
    G('both-roots', function () {
      var a = pick([1, 2, 4, 5]), b = rnz(-5, 5), tt = pick([2, 3, 4, 5, 6]);
      var x1 = fr(tt - b, a), x2 = fr(-tt - b, a);
      var pair = function (u, v) { return M('x = ' + u + '\\text{ or } x = ' + v); };
      return C('To find where a curve has gradient ' + (tt * tt) + ', a student solves $(' + P([[a, 'x'], [b, '']]) + ')^2 = ' + tt * tt + '$. Which pair of $x$-values is correct?',
        pair(x1, x2),
        [pair(x1, fr(tt + b, a)), pair(fr(tt * tt - b, a), fr(-tt * tt - b, a)), pair(fr(b - tt, a), fr(b + tt, a)), pair(fr(tt + b, a), fr(-tt + b, a)), pair(fr(tt - b, a), fr(-tt + b, a)), pair(fr(-tt - b, a), fr(tt * tt - b, a))],
        'Taking the square root gives ' + M(P([[a, 'x'], [b, '']]) + ' = ' + tt) + ' <b>or</b> ' + M(P([[a, 'x'], [b, '']]) + ' = -' + tt) + '. Solving each: $x = ' + x1 + '$ and $x = ' + x2 + '$. Taking only the positive root misses a point.');
    }),
    G('second-point', function () {
      var tq = pick([-2, -1, 1, 2, 3]), xa = rint(-3, 3), c = rint(-6, 6), d = rint(-5, 5);
      while (xa === -tq) xa = rint(-3, 3);
      var xb = -2 * tq - xa;
      return N('The curve $y = ' + P([[1, 'x^3'], [3 * tq, 'x^2'], [c, 'x'], [d, '']]) + '$ has the same gradient at the point $A$, where $x = ' + xa + '$, as at another point $B$. Find the $x$-coordinate of $B$.', xb,
        '$' + Y1 + ' = ' + P([[3, 'x^2'], [6 * tq, 'x'], [c, '']]) + '$. If the gradient equals the gradient at $A$, then $3x^2 ' + (6 * tq < 0 ? '- ' + (-6 * tq) : '+ ' + (6 * tq)) + 'x = 3(' + xa + ')^2 + ' + (6 * tq) + '(' + xa + ')$. The two roots of this quadratic add up to $-\\frac{' + (6 * tq) + '}{3} = ' + (-2 * tq) + '$, so the other root is $' + (-2 * tq) + ' - ' + (xa < 0 ? '(' + xa + ')' : xa) + ' = ' + xb + '$.');
    }),
    G('distance', function () {
      var tr = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]);
      var x1 = rint(-3, 3), y1 = rint(-3, 3);
      return N('The tangents to a curve at the points $A(' + x1 + ', ' + y1 + ')$ and $B(' + (x1 + tr[0]) + ', ' + (y1 + tr[1]) + ')$ both have gradient $2$. Find the distance $AB$.', tr[2],
        '$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\sqrt{' + tr[0] + '^2 + ' + tr[1] + '^2} = \\sqrt{' + (tr[0] * tr[0] + tr[1] * tr[1]) + '} = ' + tr[2] + '$.');
    }),
    S('reject-point', 'The curve $y = x^3 - 12x$ has gradient $-9$ at the point $A(1, -11)$ and at another point $B$. Solving $3x^2 - 12 = -9$ gives $x^2 = 1$. What should be done next?',
      ['Take $x = 1$ and $x = -1$, reject $x = 1$ (it is point $A$), so $B$ has $x = -1$', 'Take $x = 1$ only', 'Take $x = -1$ only, because squares are negative', 'Take $x = \\pm 1$ and use both as the $x$-coordinates of $B$'], 0,
      '$x^2 = 1$ has two roots, $x = 1$ and $x = -1$. The point $A$ already has $x = 1$, so the other point $B$ has $x = -1$ (with $y = 11$).'),
    S('gradient-value', 'The normal at a point on a curve is parallel to the line $y = -\\frac{1}{3}x + 2$. What is the gradient of the curve at that point?',
      ['$3$', '$-3$', '$\\frac{1}{3}$', '$-\\frac{1}{3}$'], 0,
      'The normal has gradient $-\\frac{1}{3}$, so the tangent (the curve\'s gradient) is the negative reciprocal, $3$. Setting $\\frac{dy}{dx} = -\\frac{1}{3}$ would be the usual slip.')
  ] };

  // =====================================================================
  // FPM-CAL-07 Unknown constants from gradient information
  // =====================================================================
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  B['FPM-CAL-07'] = { title: 'Finding unknown constants in a curve from its gradient', items: [
    G('stationary-p', function () {
      var a = pick([1, 2, 3, -1]), s = rnz(-3, 3), p = -2 * a * s, q = rint(-6, 6), u = rnz(-3, 3);
      while (u === s) u = rnz(-3, 3);
      var v = a * u * u + p * u + q;
      return N('The curve $y = ' + K(a, 'x^2') + ' + px + q$ has a stationary point at $x = ' + s + '$ and passes through the point $(' + u + ', ' + v + ')$. Find the value of $p$.', p,
        '$' + Y1 + ' = ' + K(2 * a, 'x') + ' + p$. At a stationary point this is $0$ when $x = ' + s + '$, so $' + (2 * a * s) + ' + p = 0$ and $p = ' + p + '$.');
    }),
    G('stationary-p', function () {
      var a = pick([1, 2, 3, -1]), s = rnz(-3, 3), p = -2 * a * s, q = rint(-6, 6), u = rnz(-3, 3);
      while (u === s) u = rnz(-3, 3);
      var v = a * u * u + p * u + q;
      return N('The curve $y = ' + K(a, 'x^2') + ' + px + q$ has a stationary point at $x = ' + s + '$ and passes through the point $(' + u + ', ' + v + ')$. Find the value of $q$.', q,
        'From $' + Y1 + ' = 0$ at $x = ' + s + '$: $' + (2 * a * s) + ' + p = 0$, so $p = ' + p + '$. The point $(' + u + ', ' + v + ')$ lies on the curve, so substitute into <b>$y$</b>: $' + v + ' = ' + (a * u * u) + ' + ' + par(p) + '\\times ' + par(u) + ' + q$, giving $q = ' + q + '$.');
    }),
    G('cubic-gradient', function () {
      var p = rnz(-9, 4), q = rint(-8, 8), x0 = rnz(-2, 2);
      var m = 3 * x0 * x0 + p, y0 = x0 * x0 * x0 + p * x0 + q;
      return N('The tangent to the curve $y = x^3 + px + q$ at the point $(' + x0 + ', ' + y0 + ')$ has gradient $' + m + '$. Find the value of $q$.', q,
        '$' + Y1 + ' = 3x^2 + p$. At $x = ' + x0 + '$: $' + (3 * x0 * x0) + ' + p = ' + m + '$, so $p = ' + p + '$. The point is on the curve, so $' + y0 + ' = ' + (x0 * x0 * x0) + ' + ' + par(p) + '\\times ' + par(x0) + ' + q$, giving $q = ' + q + '$.');
    }),
    G('normal-constants', function () {
      var x0 = pick([1, 2]), p, q, g, y0, tries = 0;
      do { p = rnz(-4, 5); q = rint(-7, 7); g = 2 * p * x0 + q; y0 = p * x0 * x0 + q * x0; tries++; } while (g === 0 && tries < 100);
      return N('The curve $y = px^2 + qx$ passes through the point $(' + x0 + ', ' + y0 + ')$. The normal to the curve at this point has gradient $' + fr(-1, g) + '$. Find the value of $p$.', p,
        'The normal gradient is $' + fr(-1, g) + '$, so the tangent gradient is its negative reciprocal, $' + g + '$. Then $' + Y1 + ' = 2px + q = ' + g + '$ at $x = ' + x0 + '$ gives $' + P([[2 * x0, 'p'], [1, 'q']]) + ' = ' + g + '$, and the point gives $' + P([[x0 * x0, 'p'], [x0, 'q']]) + ' = ' + y0 + '$. Eliminating $q$ (' + (x0 === 1 ? 'subtract the second equation from the first' : 'multiply the first equation by ' + x0 + ' and subtract the second') + ') gives $' + (x0 === 1 ? '' : (x0 * x0)) + 'p = ' + (g * x0 - y0) + '$, so $p = ' + p + '$.');
    }),
    G('reciprocal-p', function () {
      var s = pick([1, 2, 3]);
      return N('The curve $y = x^2 + \\frac{p}{x}$ has a stationary point at $x = ' + s + '$. Find the value of $p$.', 2 * s * s * s,
        '$y = x^2 + px^{-1}$, so $' + Y1 + ' = 2x - \\frac{p}{x^2}$. This is $0$ at $x = ' + s + '$: $' + (2 * s) + ' - \\frac{p}{' + (s * s) + '} = 0$, so $p = ' + (2 * s * s * s) + '$.');
    }),
    G('cubic-stationary', function () {
      var s = pick([2, 4, -2, -4, 6]), p = -3 * s / 2, q = rint(-6, 6), u = pick([1, 2, -1, 3]);
      var v = u * u * u + p * u * u + q;
      return N('The curve $y = x^3 + px^2 + q$ has a stationary point at $x = ' + s + '$ and passes through $(' + u + ', ' + v + ')$. Find the value of $q$.', q,
        '$' + Y1 + ' = 3x^2 + 2px = 0$ at $x = ' + s + '$ gives $' + (3 * s * s) + ' + ' + (2 * s) + 'p = 0$, so $p = ' + p + '$. Then substituting the point into $y$: $' + v + ' = ' + (u * u * u) + ' + ' + par(p) + '\\times ' + (u * u) + ' + q$, so $q = ' + q + '$.');
    }),
    G('one-equation', function () {
      var p = rnz(-3, 4), c = rnz(-4, 4), d = rint(-5, 5), x0 = rnz(-2, 3), m = 2 * p * x0 + c;
      return N('The curve $y = px^2 + ' + P([[c, 'x'], [d, '']]) + '$ has a tangent at the point where $x = ' + x0 + '$ that is parallel to the line $y = ' + P([[m, 'x'], [1, '']]) + '$. Find the value of $p$.', p,
        '$' + Y1 + ' = 2px + ' + par(c) + '$. Parallel means the gradient is $' + m + '$ at $x = ' + x0 + '$: $' + (2 * x0) + 'p + ' + par(c) + ' = ' + m + '$, so $p = ' + p + '$.');
    }),
    G('exp-constants', function () {
      var k = pick([2, 3, 4]), A = rint(2, 5), m = rint(-4, 9);
      var q = m - k * A;
      return N('The curve $y = pe^{' + k + 'x} + qx$ passes through the point $(0, ' + A + ')$. The gradient of the curve at this point is $' + m + '$. Find the value of $q$.', q,
        'At $x = 0$, $y = p = ' + A + '$. Also $' + Y1 + ' = ' + k + 'pe^{' + k + 'x} + q$, which at $x = 0$ is $' + k + 'p + q = ' + m + '$. So $' + (k * A) + ' + q = ' + m + '$ and $q = ' + q + '$.');
    }),
    G('which-equation', function () {
      var a = pick([1, 2, 3]), s = rint(1, 4);
      var eq = function (t) { return M(t + ' = 0'); };
      return C('The curve $y = ' + K(a, 'x^2') + ' + px + q$ has a stationary point at $x = ' + s + '$. Which equation must be true?',
        eq(P([[2 * a * s, ''], [1, 'p']])),
        [eq(P([[a * s * s, ''], [s, 'p'], [1, 'q']])), eq(P([[a * s * s, ''], [1, 'p']])), eq(P([[2 * a * s, ''], [1, 'q']])), eq(P([[2 * a * s, ''], [1, 'p'], [1, 'q']])), eq(P([[2 * a, ''], [1, 'p']]))],
        'A stationary point means $' + Y1 + ' = 0$. Here $' + Y1 + ' = ' + K(2 * a, 'x') + ' + p$, so at $x = ' + s + '$ we need $' + P([[2 * a * s, ''], [1, 'p']]) + ' = 0$. Putting $y = 0$ is the common slip.');
    }),
    G('normal-equation', function () {
      var x0 = pick([1, 2, 3]), g = pick([2, 3, 4, -2, -3, 5]);
      var lhs = P([[2 * x0, 'p'], [1, 'q']]);
      var eq = function (r) { return M(lhs + ' = ' + r); };
      return C('The curve $y = px^2 + qx$ has a normal at the point where $x = ' + x0 + '$ with gradient $' + fr(-1, g) + '$. Which equation must hold for $p$ and $q$?',
        eq(g),
        [eq(fr(-1, g)), eq(fr(1, g)), M(P([[x0 * x0, 'p'], [x0, 'q']]) + ' = ' + g)],
        'The tangent gradient is the negative reciprocal of the normal gradient: $' + g + '$. Since $' + Y1 + ' = 2px + q$, at $x = ' + x0 + '$ we need $' + lhs + ' = ' + g + '$. Using the normal gradient directly is the common slip.');
    }),
    S('where-point-goes', 'A curve $y = ax^2 + bx$ passes through $(2, 10)$. Where should the coordinates be substituted to form an equation in $a$ and $b$?',
      ['Into $y = ax^2 + bx$, giving $4a + 2b = 10$', 'Into $\\frac{dy}{dx} = 2ax + b$, giving $4a + b = 10$', 'Into $\\frac{dy}{dx} = 0$', 'Into $\\frac{d^2y}{dx^2}$'], 0,
      'A point on the curve satisfies the curve\'s own equation, so $x = 2$, $y = 10$ goes into $y = ax^2 + bx$. The gradient equation uses only the $x$-value.'),
    S('count-equations', 'A curve $y = x^3 + ax^2 + bx$ has a stationary point at $x = 1$ and passes through $(2, 6)$. How are $a$ and $b$ found?',
      ['$\\frac{dy}{dx} = 0$ at $x = 1$ gives one equation; the point $(2, 6)$ in $y$ gives another; solve simultaneously', 'Substitute $(2, 6)$ into $\\frac{dy}{dx}$ and set $y = 0$ at $x = 1$', 'Set $y = 0$ at $x = 1$ and $\\frac{dy}{dx} = 6$ at $x = 2$', 'Only one equation is needed because there is one stationary point'], 0,
      'There are two unknowns so two equations are needed: $3 + 2a + b = 0$ from the stationary point and $8 + 4a + 2b = 6$ from the point on the curve.')
  ] };

  // =====================================================================
  // FPM-CAL-08 Finding stationary points
  // =====================================================================
  function sf3(v) { var r = R.roundSf(v, 3); return { r: r, tol: 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(r))) - 2) }; }
  B['FPM-CAL-08'] = { title: 'Finding stationary points', items: [
    G('solve-dy-zero', function () {
      var c = cubicFromRoots();
      return N('The curve $y = ' + c.text + '$ has two stationary points. Find the larger $x$-coordinate of these.', c.r2,
        '$' + Y1 + ' = ' + P([[3, 'x^2'], [-3 * (c.r1 + c.r2), 'x'], [3 * c.r1 * c.r2, '']]) + ' = 3(x - ' + par(c.r1) + ')(x - ' + par(c.r2) + ')$. Setting $' + Y1 + ' = 0$ gives $x = ' + c.r1 + '$ or $x = ' + c.r2 + '$, so the larger is $' + c.r2 + '$.');
    }),
    G('find-y', function () {
      var c = cubicFromRoots();
      return N('The curve $y = ' + c.text + '$ has a stationary point where $x = ' + c.r2 + '$. Find the $y$-coordinate of this point.', c.f(c.r2),
        'Substitute $x = ' + c.r2 + '$ into the <b>curve</b> (not into $' + Y1 + '$, which is $0$ there): $y = ' + c.f(c.r2) + '$.');
    }),
    G('find-y', function () {
      var c = cubicFromRoots();
      return N('The curve $y = ' + c.text + '$ has a stationary point where $x = ' + c.r1 + '$. Find the $y$-coordinate of this point.', c.f(c.r1),
        '$' + Y1 + ' = 3(x - ' + par(c.r1) + ')(x - ' + par(c.r2) + ')$ is $0$ at $x = ' + c.r1 + '$. The $y$-coordinate comes from the curve: $y = ' + c.f(c.r1) + '$.');
    }),
    G('quadratic-vertex', function () {
      var a = pick([1, 2, 3, -1, -2]), xs = rnz(-4, 4), b = -2 * a * xs, c = rint(-8, 8);
      var ys = a * xs * xs + b * xs + c;
      var o = function (x, y) { return M(pt(x, y)); };
      return C('Find the coordinates of the stationary point of $y = ' + P([[a, 'x^2'], [b, 'x'], [c, '']]) + '$.', o(xs, ys),
        [o(xs, 0), o(ys, xs), o(-xs, a * xs * xs - b * xs + c), o(xs, c), o(xs, -ys), o(-xs, ys)],
        '$' + Y1 + ' = ' + P([[2 * a, 'x'], [b, '']]) + ' = 0$ gives $x = ' + xs + '$. Then $y = ' + P([[a, '(' + xs + ')^2'], [b, '(' + xs + ')'], [c, '']]).replace(/\s+/g, ' ') + ' = ' + ys + '$. The stationary point is $' + pt(xs, ys) + '$.');
    }),
    G('reciprocal', function () {
      var s = rint(1, 6);
      return N('The curve $y = x + \\frac{' + (s * s) + '}{x}$ has two stationary points. Find the $y$-coordinate of the one with $x \\gt 0$.', 2 * s,
        '$y = x + ' + (s * s) + 'x^{-1}$, so $' + Y1 + ' = 1 - \\frac{' + (s * s) + '}{x^2} = 0$ gives $x^2 = ' + (s * s) + '$, $x = \\pm ' + s + '$. For $x = ' + s + '$: $y = ' + s + ' + \\frac{' + (s * s) + '}{' + s + '} = ' + (2 * s) + '$.');
    }),
    G('reciprocal', function () {
      var s = rint(1, 3);
      return N('The curve $y = x^2 + \\frac{' + (2 * s * s * s) + '}{x}$ has one stationary point. Find its $y$-coordinate.', 3 * s * s,
        '$' + Y1 + ' = 2x - \\frac{' + (2 * s * s * s) + '}{x^2} = 0$ gives $2x^3 = ' + (2 * s * s * s) + '$, so $x = ' + s + '$. Then $y = ' + (s * s) + ' + \\frac{' + (2 * s * s * s) + '}{' + s + '} = ' + (3 * s * s) + '$.');
    }),
    G('trig-stationary', function () {
      var c = pick([1, 2, 3]);
      var pr = function (a, b) { return M('x = ' + a + ',\\ x = ' + b); };
      return C('Find the values of $x$ in the interval $0 \\leqslant x \\leqslant 2\\pi$ (radians) at which the curve $y = ' + K(c, 'x') + ' + ' + K(2 * c, '\\sin x') + '$ has stationary points.',
        pr('\\frac{2\\pi}{3}', '\\frac{4\\pi}{3}'),
        [pr('\\frac{\\pi}{3}', '\\frac{5\\pi}{3}'), pr('\\frac{\\pi}{6}', '\\frac{5\\pi}{6}'), pr('\\frac{5\\pi}{6}', '\\frac{7\\pi}{6}')],
        '$' + Y1 + ' = ' + c + ' + ' + (2 * c) + '\\cos x = 0$ gives $\\cos x = -\\frac{1}{2}$. In $0 \\leqslant x \\leqslant 2\\pi$ the solutions are $\\frac{2\\pi}{3}$ and $\\frac{4\\pi}{3}$. (Using $+\\frac{1}{2}$ instead gives $\\frac{\\pi}{3}$ and $\\frac{5\\pi}{3}$.)');
    }),
    G('trig-stationary', function () {
      var c = pick([1, 2, 3]);
      var pr = function (a, b) { return M('x = ' + a + ',\\ x = ' + b); };
      return C('Find the values of $x$ in the interval $0 \\leqslant x \\leqslant \\pi$ (radians) at which the curve $y = ' + K(c, 'x') + ' + ' + K(2 * c, '\\cos x') + '$ has stationary points.',
        pr('\\frac{\\pi}{6}', '\\frac{5\\pi}{6}'),
        [pr('\\frac{\\pi}{3}', '\\frac{2\\pi}{3}'), pr('\\frac{\\pi}{3}', '\\frac{5\\pi}{6}'), pr('\\frac{\\pi}{6}', '\\frac{\\pi}{3}')],
        '$' + Y1 + ' = ' + c + ' - ' + (2 * c) + '\\sin x = 0$ gives $\\sin x = \\frac{1}{2}$. In $0 \\leqslant x \\leqslant \\pi$ the solutions are $\\frac{\\pi}{6}$ and $\\frac{5\\pi}{6}$ (two angles with the same sine).');
    }),
    G('quotient-stationary', function () {
      var s = pick([2, 4, 5]);
      return N('The curve $y = \\frac{x}{x^2 + ' + (s * s) + '}$ has a stationary point at a positive value of $x$. Find its $y$-coordinate as a decimal.', 1 / (2 * s),
        'Quotient rule: $' + Y1 + ' = \\frac{(x^2 + ' + (s * s) + ') - 2x^2}{(x^2 + ' + (s * s) + ')^2} = \\frac{' + (s * s) + ' - x^2}{(x^2 + ' + (s * s) + ')^2}$. This is $0$ when the numerator is $0$: $x^2 = ' + (s * s) + '$, so $x = ' + s + '$. Then $y = \\frac{' + s + '}{' + (2 * s * s) + '} = ' + num(1 / (2 * s)) + '$.');
    }),
    G('exp-stationary', function () {
      var k = pick([1, 2, 4, 5]);
      return N('The curve $y = xe^{-' + (k === 1 ? '' : k) + 'x}$ has one stationary point. Find its $x$-coordinate as a decimal.', 1 / k,
        'Product rule: $' + Y1 + ' = e^{-' + kx(k) + '} - ' + K(k, 'x') + 'e^{-' + kx(k) + '} = e^{-' + kx(k) + '}(1 - ' + kx(k) + ')$. Since $e^{-' + kx(k) + '}$ is never $0$, $1 - ' + kx(k) + ' = 0$ and $x = ' + num(1 / k) + '$.');
    }),
    G('exp-stationary', function () {
      var k = pick([1, 2, 3, 4]);
      var v = sf3(1 / (k * Math.E));
      return N('The curve $y = xe^{-' + (k === 1 ? '' : k) + 'x}$ has one stationary point. Find its $y$-coordinate, correct to 3 significant figures.', v.r,
        '$' + Y1 + ' = e^{-' + kx(k) + '}(1 - ' + kx(k) + ') = 0$ gives $x = \\frac{1}{' + k + '}$. Then $y = \\frac{1}{' + k + '}e^{-1} = ' + v.r.toPrecision(3) + '$ to 3 s.f.', v.tol, v.r.toPrecision(3));
    }),
    G('missing-root', function () {
      var n = pick([2, 4, 5, 6]);
      var o = function (a) { return M(a); };
      return C('Solving $' + Y1 + ' = 3x^2 - ' + (3 * n * n) + ' = 0$ to find stationary points, which values of $x$ are correct?', o('x = ' + n + ' \\text{ or } x = -' + n),
        [o('x = ' + n + ' \\text{ only}'), o('x = ' + (n * n) + ' \\text{ or } x = -' + (n * n)), o('x = ' + (3 * n) + ' \\text{ or } x = -' + (3 * n))],
        '$3x^2 = ' + (3 * n * n) + '$ gives $x^2 = ' + (n * n) + '$, so $x = \\pm ' + n + '$. Taking only the positive root misses a stationary point.');
    }),
    S('which-equation', 'A student finds that $\\frac{dy}{dx} = 0$ at $x = 3$ for a curve $y = x^3 - 6x^2 + 9x + 2$, then substitutes $x = 3$ into $\\frac{dy}{dx}$ to find the $y$-coordinate and gets $0$. What is wrong?',
      ['The $y$-coordinate must be found by substituting into the curve $y = x^3 - 6x^2 + 9x + 2$', 'The $y$-coordinate of a stationary point is always $0$', 'The student should have used $\\frac{d^2y}{dx^2}$', 'Nothing is wrong'], 0,
      '$\\frac{dy}{dx}$ is $0$ at every stationary point by definition, so it cannot give $y$. Substituting into the curve gives $y = 27 - 54 + 27 + 2 = 2$.'),
    S('quotient-numerator', 'For $y = \\frac{u}{v}$, the quotient rule gives $\\frac{dy}{dx} = \\frac{vu\' - uv\'}{v^2}$. To find the stationary points, what should be set equal to $0$?',
      ['Just the numerator $vu\' - uv\'$', 'The whole fraction, expanding $v^2$ as well', 'Only the denominator $v^2$', 'The numerator and denominator added together'], 0,
      'A fraction is $0$ only when its numerator is $0$ (and the denominator is not). Setting $vu\' - uv\' = 0$ avoids a lot of unnecessary algebra.')
  ] };

  // =====================================================================
  // FPM-CAL-09 Maximum or minimum?
  // =====================================================================
  function natureItem(q, d2, d2txt, why) {   // d2: sign-determining number; d2txt: LaTeX of the value
    var mx = d2 < 0, neg = d2txt.charAt(0) === '-', flip = neg ? d2txt.slice(1) : '-' + d2txt;
    var t = function (nat, txt, rel) { return nat + ', because $' + Y2 + ' = ' + txt + ' ' + rel + ' 0$'; };
    var right = mx ? t('A maximum', d2txt, '\\lt') : t('A minimum', d2txt, '\\gt');
    var alts = mx ? [t('A minimum', d2txt, '\\lt'), t('A minimum', flip, '\\gt'), t('A maximum', flip, '\\gt')] : [t('A maximum', d2txt, '\\gt'), t('A maximum', flip, '\\lt'), t('A minimum', flip, '\\lt')];
    return C(q, right, alts, why);
  }
  B['FPM-CAL-09'] = { title: 'Maximum or minimum? Using the second derivative', items: [
    G('second-derivative-value', function () {
      var c = cubicFromRoots(), r = pick([c.r1, c.r2]);
      var v = 6 * r - 3 * (c.r1 + c.r2);
      return N('The curve $y = ' + c.text + '$ has a stationary point at $x = ' + r + '$. Find the value of $' + Y2 + '$ at this point.', v,
        '$' + Y1 + ' = ' + P([[3, 'x^2'], [-3 * (c.r1 + c.r2), 'x'], [3 * c.r1 * c.r2, '']]) + '$, so $' + Y2 + ' = ' + P([[6, 'x'], [-3 * (c.r1 + c.r2), '']]) + '$. At $x = ' + r + '$ this is $' + v + '$.');
    }),
    G('nature-cubic', function () {
      var c = cubicFromRoots(), r = pick([c.r1, c.r2]);
      var v = 6 * r - 3 * (c.r1 + c.r2);
      return natureItem('The curve $y = ' + c.text + '$ has a stationary point at $x = ' + r + '$. Which statement correctly describes it?', v, String(v),
        '$' + Y2 + ' = ' + P([[6, 'x'], [-3 * (c.r1 + c.r2), '']]) + '$. At $x = ' + r + '$ it equals $' + v + '$, which is ' + (v < 0 ? 'negative, so the point is a maximum' : 'positive, so the point is a minimum') + '. The conclusion must quote the value (or sign) of the second derivative.');
    }),
    G('nature-quadratic', function () {
      var a = pick([1, 2, 3, -1, -2, -3]), xs = rint(-4, 4), b = -2 * a * xs, c = rint(-6, 6);
      return natureItem('Find the nature of the stationary point of $y = ' + P([[a, 'x^2'], [b, 'x'], [c, '']]) + '$.', 2 * a, String(2 * a),
        '$' + Y1 + ' = ' + P([[2 * a, 'x'], [b, '']]) + '$ is zero at $x = ' + xs + '$. $' + Y2 + ' = ' + (2 * a) + '$ for every $x$, and ' + (a < 0 ? 'it is negative, so the point is a maximum.' : 'it is positive, so the point is a minimum.'));
    }),
    G('nature-reciprocal', function () {
      var s = pick([1, 2, 4, 5]), side = pick([1, -1]), xv = side * s;
      var d2 = side * 2 / s, txt = (side < 0 ? '-' : '') + fr(2, s);
      return natureItem('The curve $y = x + \\frac{' + (s * s) + '}{x}$ has a stationary point at $x = ' + xv + '$. Which statement correctly describes it?', d2, txt,
        '$y = x + ' + (s * s) + 'x^{-1}$, so $' + Y1 + ' = 1 - ' + (s * s) + 'x^{-2}$ (which is $0$ at $x = \\pm ' + s + '$) and $' + Y2 + ' = ' + (2 * s * s) + 'x^{-3} = \\frac{' + (2 * s * s) + '}{x^3}$. At $x = ' + xv + '$ this is $' + txt + '$, ' + (d2 < 0 ? 'negative, so a maximum.' : 'positive, so a minimum.'));
    }),
    G('second-derivative-value', function () {
      var A = rnz(-4, 4), k = rint(1, 4);
      return N('The curve $y = ' + K(A, '\\cos ' + kx(k)) + '$ (with $x$ in radians) has a stationary point at $x = 0$. Find the value of $' + Y2 + '$ at $x = 0$.', -A * k * k,
        '$' + Y1 + ' = ' + K(-A * k, '\\sin ' + kx(k)) + '$, which is $0$ at $x = 0$. $' + Y2 + ' = ' + K(-A * k * k, '\\cos ' + kx(k)) + '$ and $\\cos 0 = 1$, so the value is $' + (-A * k * k) + '$.');
    }),
    G('nature-quadratic', function () {
      var p = rint(2, 9), q = rint(1, 4), r = rint(1, 6);
      return natureItem('Find the nature of the stationary point of $y = ' + p + ' + ' + K(q, 'x') + ' - ' + K(r, 'x^2') + '$.', -2 * r, String(-2 * r),
        '$' + Y1 + ' = ' + q + ' - ' + (2 * r) + 'x$ is zero at one value of $x$. $' + Y2 + ' = ' + (-2 * r) + '$, which is negative, so the stationary point is a maximum.');
    }),
    G('nature-trig', function () {
      var A = pick([1, 2, 3]), k = pick([1, 2, 3]);
      var d2 = -A * k * k;
      return natureItem('The curve $y = ' + K(A, '\\sin ' + kx(k)) + '$ has a stationary point at $x = \\frac{\\pi}{' + (2 * k) + '}$ (radians). Which statement correctly describes it?', d2, String(d2),
        '$' + Y1 + ' = ' + K(A * k, '\\cos ' + kx(k)) + '$ is $0$ when $' + k + 'x = \\frac{\\pi}{2}$. $' + Y2 + ' = ' + K(-A * k * k, '\\sin ' + kx(k)) + '$, and $\\sin\\frac{\\pi}{2} = 1$, so $' + Y2 + ' = ' + d2 + ' \\lt 0$: a maximum.');
    }),
    S('rule', 'At a stationary point of a curve, $\\frac{d^2y}{dx^2} = 12$. What can be concluded?',
      ['It is a minimum, because $\\frac{d^2y}{dx^2} \\gt 0$', 'It is a maximum, because $\\frac{d^2y}{dx^2} \\gt 0$', 'It is a minimum, because $\\frac{dy}{dx} = 12$', 'Nothing, because the value is not $0$'], 0,
      'A positive second derivative at a stationary point means a minimum (the curve is bending upwards, like a bowl). A negative value means a maximum.'),
    S('show-stationary', 'To show that the point $x = 2$ on $y = x^3 - 12x + 5$ is a stationary point, which is the correct thing to show?',
      ['That $\\frac{dy}{dx} = 3x^2 - 12$ equals $0$ when $x = 2$', 'That $\\frac{d^2y}{dx^2} = 0$ when $x = 2$', 'That $y = 0$ when $x = 2$', 'That $\\frac{d^2y}{dx^2} \\gt 0$ when $x = 2$'], 0,
      '"Stationary" means the gradient is zero: $3(2)^2 - 12 = 0$. The second derivative only decides which kind of stationary point it is.'),
    S('inconclusive', 'For $y = x^4$, $\\frac{dy}{dx} = 0$ and $\\frac{d^2y}{dx^2} = 0$ at $x = 0$. What does this tell you?',
      ['The second derivative test is inconclusive, so another method (such as the sign of the gradient either side) is needed', 'The point is a point of inflection', 'The point is a maximum', 'The point is a minimum, because the second derivative is not negative'], 0,
      'A zero second derivative does not decide the nature: $x^4$ has a minimum at $0$, while $x^3$ has a point of inflexion there. Check the gradient either side instead.'),
    S('conclusion', 'At a stationary point, $\\frac{d^2y}{dx^2} = -6$. Which is the best conclusion to write in an exam?',
      ['$\\frac{d^2y}{dx^2} = -6 \\lt 0$, so the point is a maximum', 'The point is a maximum', 'The point is a maximum because $\\frac{dy}{dx} = 0$', 'The point is a minimum because $-6 \\lt 0$'], 0,
      'The conclusion should quote the value or sign of the second derivative as the reason: a negative value means a maximum.')
  ] };

  // =====================================================================
  // FPM-CAL-10 Optimisation part 1: building the formula
  // =====================================================================
  B['FPM-CAL-10'] = { title: 'Optimisation part 1: building the formula to maximise or minimise', items: [
    G('find-height', function () {
      var r = rint(2, 6), h = rint(2, 12);
      return N('A solid cylinder has volume $' + (r * r * h) + '\\pi$ cm$^3$ and radius $' + r + '$ cm. Find its height in cm.', h,
        'Volume $= \\pi r^2h$, so $' + (r * r * h) + '\\pi = \\pi \\times ' + (r * r) + ' \\times h$ and $h = \\frac{' + (r * r * h) + '}{' + (r * r) + '} = ' + h + '$.');
    }),
    G('closed-cylinder', function () {
      var k = pick([45, 54, 90, 125, 180, 250]);
      var o = function (t) { return M('S = ' + t); };
      return C('A closed cylinder has radius $r$ cm, height $h$ cm and volume $' + k + '\\pi$ cm$^3$. Its total surface area is $S$ cm$^2$. Which expression gives $S$ in terms of $r$ only?',
        o('2\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}'),
        [o('2\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r^2}'), o('\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}'), o('2\\pi r^2 + \\frac{' + k + '\\pi}{r}')],
        'From the volume, $\\pi r^2h = ' + k + '\\pi$, so $h = \\frac{' + k + '}{r^2}$. Total surface area (two ends and the curved surface) is $S = 2\\pi r^2 + 2\\pi rh = 2\\pi r^2 + 2\\pi r\\times\\frac{' + k + '}{r^2} = 2\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}$. One power of $r$ cancels.');
    }),
    G('open-cylinder', function () {
      var k = pick([45, 54, 90, 125, 180, 250]);
      var o = function (t) { return M('S = ' + t); };
      return C('An open-topped cylindrical tank has radius $r$ m, height $h$ m and volume $' + k + '\\pi$ m$^3$. The surface area of the base and curved side is $S$ m$^2$. Which expression gives $S$ in terms of $r$ only?',
        o('\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}'),
        [o('2\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}'), o('\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r^2}'), o('\\pi r^2 + 2\\pi r^2 h')],
        'Only one circular end is included, so $S = \\pi r^2 + 2\\pi rh$. With $h = \\frac{' + k + '}{r^2}$ this becomes $\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}$.');
    }),
    G('square-base-box', function () {
      var V = pick([100, 200, 250, 500, 1000, 1500]);
      var open = pick([true, false]);
      var o = function (t) { return M('S = ' + t); };
      var right = open ? 'x^2 + \\frac{' + (4 * V) + '}{x}' : '2x^2 + \\frac{' + (4 * V) + '}{x}';
      var d = open ? [o('2x^2 + \\frac{' + (4 * V) + '}{x}'), o('x^2 + \\frac{' + (4 * V) + '}{x^2}'), o('x^2 + \\frac{' + (2 * V) + '}{x}')] : [o('x^2 + \\frac{' + (4 * V) + '}{x}'), o('2x^2 + \\frac{' + (4 * V) + '}{x^2}'), o('2x^2 + \\frac{' + (2 * V) + '}{x}')];
      return C('A cuboid box ' + (open ? 'with no lid' : 'with a lid') + ' has a square base of side $x$ cm, height $h$ cm and volume $' + V + '$ cm$^3$. Its total outer surface area is $S$ cm$^2$. Which expression gives $S$ in terms of $x$ only?',
        o(right), d,
        'From the volume, $x^2h = ' + V + '$, so $h = \\frac{' + V + '}{x^2}$. The ' + (open ? 'base plus four sides' : 'top and base plus four sides') + ' give $S = ' + (open ? 'x^2' : '2x^2') + ' + 4xh = ' + (open ? 'x^2' : '2x^2') + ' + 4x\\times\\frac{' + V + '}{x^2} = ' + right + '$.');
    }),
    G('two-by-one', function () {
      var V = pick([36, 54, 72, 90, 144]);
      var o = function (t) { return M('S = ' + t); };
      return C('A closed box has a rectangular base measuring $x$ cm by $2x$ cm and height $h$ cm. Its volume is $' + V + '$ cm$^3$ and its total surface area is $S$ cm$^2$. Which expression gives $S$ in terms of $x$ only?',
        o('4x^2 + \\frac{' + (3 * V) + '}{x}'),
        [o('4x^2 + \\frac{' + (6 * V) + '}{x}'), o('2x^2 + \\frac{' + (3 * V) + '}{x}'), o('4x^2 + \\frac{' + (3 * V) + '}{x^2}')],
        'Volume: $2x^2h = ' + V + '$, so $h = \\frac{' + V + '}{2x^2}$. Faces: top and base $2\\times 2x^2 = 4x^2$, two sides $2\\times xh$ and two ends $2\\times 2xh$, so $S = 4x^2 + 6xh = 4x^2 + 6x\\times\\frac{' + V + '}{2x^2} = 4x^2 + \\frac{' + (3 * V) + '}{x}$.');
    }),
    G('fixed-perimeter', function () {
      var Pp = pick([20, 24, 30, 40, 60]);
      var o = function (t) { return M('A = ' + t); };
      return C('A rectangle has perimeter $' + Pp + '$ cm, length $x$ cm and area $A$ cm$^2$. Which expression gives $A$ in terms of $x$ only?',
        o(Pp / 2 + 'x - x^2'),
        [o(Pp + 'x - x^2'), o(Pp / 2 + 'x - 2x^2'), o('x^2 - ' + Pp / 2 + 'x'), o(Pp / 2 + ' - x^2')],
        'Two lengths and two widths: $2x + 2w = ' + Pp + '$, so $w = ' + Pp / 2 + ' - x$. Then $A = xw = x(' + Pp / 2 + ' - x) = ' + Pp / 2 + 'x - x^2$.');
    }),
    G('sector-angle', function () {
      var r = rint(2, 9), th = pick([1, 2, 3, 4, 5]);
      var Pp = 2 * r + r * th;
      return N('A sector of a circle has radius $' + r + '$ cm and perimeter $' + Pp + '$ cm. Find the angle of the sector in radians.', th,
        'Perimeter $= 2r + r\\theta$, so $' + Pp + ' = ' + (2 * r) + ' + ' + r + '\\theta$. Then $' + r + '\\theta = ' + (Pp - 2 * r) + '$ and $\\theta = ' + th + '$ radians.');
    }),
    G('sector-area', function () {
      var Pp = pick([20, 30, 40, 60, 80]);
      var o = function (t) { return M('A = ' + t); };
      return C('A sector of a circle has radius $r$ cm, angle $\\theta$ radians and a fixed perimeter of $' + Pp + '$ cm. Its area is $A$ cm$^2$. Which expression gives $A$ in terms of $r$ only?',
        o(Pp / 2 + 'r - r^2'),
        [o(Pp + 'r - r^2'), o(Pp / 2 + 'r - 2r^2'), o(Pp / 2 + 'r + r^2'), o('\\frac{' + Pp + '}{2} - r^2')].filter(function () { return true; }),
        'Perimeter: $2r + r\\theta = ' + Pp + '$, so $r\\theta = ' + Pp + ' - 2r$. Area $= \\frac{1}{2}r^2\\theta = \\frac{1}{2}r(r\\theta) = \\frac{1}{2}r(' + Pp + ' - 2r) = ' + Pp / 2 + 'r - r^2$.');
    }),
    G('evaluate-S', function () {
      var r = pick([2, 3, 5]), mult = rint(2, 6), k = r * mult;
      var ans = 2 * r * r + 2 * k / r;
      return N('A closed cylinder with radius $r$ cm has volume $' + k + '\\pi$ cm$^3$, so its total surface area is $S = 2\\pi r^2 + \\frac{' + (2 * k) + '\\pi}{r}$. Find the value of $\\frac{S}{\\pi}$ when $r = ' + r + '$.', ans,
        '$\\frac{S}{\\pi} = 2r^2 + \\frac{' + (2 * k) + '}{r} = 2\\times ' + (r * r) + ' + \\frac{' + (2 * k) + '}{' + r + '} = ' + (2 * r * r) + ' + ' + (2 * k / r) + ' = ' + ans + '$.');
    }),
    G('two-squares', function () {
      var L = pick([40, 48, 60, 80]);
      var o = function (t) { return M('A = ' + t); };
      var h = L / 4;
      return C('A wire of length $' + L + '$ cm is cut into two pieces. One piece is bent into a square of side $x$ cm, the other into a square of side $y$ cm. The total area is $A$ cm$^2$. Which expression gives $A$ in terms of $x$ only?',
        o('x^2 + (' + h + ' - x)^2'),
        [o('x^2 + (' + L + ' - x)^2'), o('x^2 + (' + L + ' - 4x)^2'), o('x^2 + (' + h + ' - 4x)^2')],
        'The perimeters add to the wire: $4x + 4y = ' + L + '$, so $y = ' + h + ' - x$. Then $A = x^2 + y^2 = x^2 + (' + h + ' - x)^2$.');
    }),
    S('missing-face', 'A cuboid has a square base of side $x$ and height $h$, and an open top. Which faces make up its surface area?',
      ['One square base and four rectangular sides: $x^2 + 4xh$', 'Two squares and four rectangles: $2x^2 + 4xh$', 'One square base and two rectangular sides: $x^2 + 2xh$', 'Four rectangular sides only: $4xh$'], 0,
      'With no lid there is a base ($x^2$) and four sides (each $xh$), so $S = x^2 + 4xh$. Including a lid would add another $x^2$.'),
    S('simplify-substitute', 'Which is the correct simplification of $2\\pi r \\times \\frac{90}{r^2}$?',
      ['$\\frac{180\\pi}{r}$', '$\\frac{180\\pi}{r^2}$', '$180\\pi r$', '$\\frac{90\\pi}{r}$'], 0,
      'The $r$ in the numerator cancels one of the two $r$s in the denominator: $2\\pi r\\times\\frac{90}{r^2} = \\frac{180\\pi r}{r^2} = \\frac{180\\pi}{r}$.'),
    S('eliminate', 'A rectangle has a fixed area. To get a formula for its perimeter in terms of the length $x$ alone, what is the first step?',
      ['Use the fixed area to write the width in terms of $x$, then substitute into the perimeter', 'Differentiate the area', 'Set the perimeter equal to zero', 'Make the area equal to the perimeter'], 0,
      'The fixed quantity (the constraint) lets you eliminate one variable: width $= \\frac{\\text{area}}{x}$. Then the perimeter $2x + 2\\times\\frac{\\text{area}}{x}$ has only one variable.')
  ] };
})();
