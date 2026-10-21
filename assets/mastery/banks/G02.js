/* Group G02 mastery bank: Optimisation (justify and evaluate), small changes, rates of change, integration and areas. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function dec(x) { return String(Math.round(x * 1e9) / 1e9); }
  // a non-negative number as an integer, or a LaTeX fraction when it is a simple fraction, else a decimal
  function fr(a) {
    if (Math.abs(a - Math.round(a)) < 1e-9) return String(Math.round(a));
    for (var d = 2; d <= 96; d++) { var n = a * d; if (Math.abs(n - Math.round(n)) < 1e-9) return '\\frac{' + Math.round(n) + '}{' + d + '}'; }
    return dec(a);
  }
  // polynomial-like expression from terms [[coef, power], ...] (highest power first); power may be a string such as '\\frac{3}{2}'
  function P(terms, v) {
    v = v || 'x'; var s = '';
    terms.forEach(function (t) {
      var c = t[0], p = t[1]; if (Math.abs(c) < 1e-12) return;
      var a = Math.abs(c), cs = (Math.abs(a - 1) < 1e-12 && p !== 0) ? '' : fr(a), body;
      if (p === 0) body = cs; else if (p === 1) body = cs + v; else body = cs + v + '^{' + p + '}';
      if (!s) s = (c < 0 ? '-' : '') + body; else s += (c < 0 ? ' - ' : ' + ') + body;
    });
    return s || '0';
  }
  function T(s) { return '$' + s + '$'; }
  function clean(s) { return s.replace(/(\\(?:sin|cos)) 1x/g, '$1 x'); }
  function fin(it) { it.q = clean(it.q); it.why = clean(it.why); if (it.options) it.options = it.options.map(clean); return it; }
  function piFr(n, d) { var g = gcd(n, d); n /= g; d /= g; if (d === 1) return n === 1 ? '\\pi' : n + '\\pi'; return n === 1 ? '\\frac{\\pi}{' + d + '}' : '\\frac{' + n + '\\pi}{' + d + '}'; }
  // multiple-choice item (skill added by the caller); the correct option is written first, the engine shuffles
  function M(q, correct, wrongs, why) {
    var opts = [correct], seen = {}; seen[correct] = 1;
    wrongs.forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
    if (opts.length < 4) throw new Error('too few distinct options: ' + q);
    return fin({ kind: 'mcq', q: q, options: opts, answer: 0, why: why });
  }
  // numeric item: sf = significant figures (0 = exact value)
  function N(q, x, sf, why) {
    var a = sf ? R.roundSf(x, sf) : Math.round(x * 1e9) / 1e9;
    var tol = sf ? 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(a))) - sf + 1) * 1.0001 : 1e-6;
    return fin({ kind: 'num', q: q, answer: a, tol: tol, display: '$' + dec(a) + '$', why: why });
  }
  function ND(q, x, dp, why) {
    var a = R.roundDp(x, dp);
    return fin({ kind: 'num', q: q, answer: a, tol: 0.5 * Math.pow(10, -dp) * 1.0001, display: '$' + dec(a) + '$', why: why });
  }
  function S(skill, item) { item.skill = skill; return item; }
  function G(skill, fn) { return { skill: skill, gen: fn }; }
  // polynomials as arrays of coefficients, lowest power first
  function pmul(p, q) { var r = []; for (var i = 0; i < p.length + q.length - 1; i++) r.push(0); p.forEach(function (a, i) { q.forEach(function (b, j) { r[i + j] += a * b; }); }); return r; }
  function padd(p, q, s) { var r = [], n = Math.max(p.length, q.length); for (var i = 0; i < n; i++) r.push((p[i] || 0) + s * (q[i] || 0)); return r; }
  function pev(p, x) { var s = 0; p.forEach(function (c, i) { s += c * Math.pow(x, i); }); return s; }
  function pint(p) { var r = [0]; p.forEach(function (c, i) { r.push(c / (i + 1)); }); return r; }
  function defint(p, a, b) { var F = pint(p); return pev(F, b) - pev(F, a); }
  function pstr(p) { var t = []; for (var i = p.length - 1; i >= 0; i--) t.push([Math.round(p[i] * 1e9) / 1e9, i]); return P(t); }
  function lin(r) { return [-r, 1]; }                       // (x - r)

  // =====================================================================
  // FPM-CAL-11 Optimisation part 2
  // =====================================================================
  B['FPM-CAL-11'] = { title: 'Optimisation part 2: finding, justifying and evaluating the maximum or minimum', items: [
    G('find-critical', function () {
      var x0 = rint(2, 9), A = rint(1, 5), Bc = A * x0 * x0;
      return N('The surface area of a component is $S = ' + P([[A, 1]]) + ' + \\frac{' + Bc + '}{x}$ for $x \\gt 0$. $S$ has a minimum value. Find the value of $x$ for which $\\frac{dS}{dx} = 0$.', x0, 0,
        'Write $S = ' + A + 'x + ' + Bc + 'x^{-1}$, so $\\frac{dS}{dx} = ' + A + ' - \\frac{' + Bc + '}{x^2}$. Setting this to 0 gives $x^2 = ' + (Bc / A) + '$, and since $x \\gt 0$, $x = ' + x0 + '$.');
    }),
    G('optimum-value', function () {
      var x0 = rint(2, 8), A = rint(1, 5), Bc = A * x0 * x0, v = 2 * A * x0;
      return N('The cost of a design is $C = ' + P([[A, 1]]) + ' + \\frac{' + Bc + '}{x}$ for $x \\gt 0$, and $C$ is a minimum when $x = ' + x0 + '$. Find the minimum value of $C$.', v, 0,
        'Substitute into the original expression, not the derivative: $C = ' + A + '(' + x0 + ') + \\frac{' + Bc + '}{' + x0 + '} = ' + (A * x0) + ' + ' + (Bc / x0) + ' = ' + v + '$.');
    }),
    G('justify', function () {
      var x0 = pick([2, 4, 5, 8, 10]), A = rint(1, 6), Bc = A * x0 * x0, v = 2 * A / x0;
      return N('For $S = ' + P([[A, 1]]) + ' + \\frac{' + Bc + '}{x}$, find the value of $\\frac{d^2S}{dx^2}$ when $x = ' + x0 + '$ (the point where $\\frac{dS}{dx} = 0$).', v, 0,
        '$\\frac{dS}{dx} = ' + A + ' - ' + Bc + 'x^{-2}$, so $\\frac{d^2S}{dx^2} = ' + (2 * Bc) + 'x^{-3} = \\frac{' + (2 * Bc) + '}{x^3}$. At $x = ' + x0 + '$ this is ' + dec(v) + ', which is positive, so $S$ is a minimum.');
    }),
    G('justify', function () {
      var v = pick([-1, 1]) * rint(2, 9), x0 = rint(2, 6), pos = v > 0, vs = (v < 0 ? '-' : '') + Math.abs(v);
      var q = 'A model gives $\\frac{dP}{dx} = 0$ at $x = ' + x0 + '$ and $\\frac{d^2P}{dx^2} = ' + vs + '$ there. Which conclusion is fully justified?';
      var right = pos ? 'A minimum, because $\\frac{d^2P}{dx^2} \\gt 0$' : 'A maximum, because $\\frac{d^2P}{dx^2} \\lt 0$';
      var swap = pos ? 'A maximum, because $\\frac{d^2P}{dx^2} \\gt 0$' : 'A minimum, because $\\frac{d^2P}{dx^2} \\lt 0$';
      return M(q, right, [swap, 'A minimum, because $\\frac{dP}{dx} = 0$', 'A maximum, because $\\frac{dP}{dx} = 0$'],
        'Zero first derivative only says the point is stationary. The sign of the second derivative decides: positive gives a minimum, negative gives a maximum. Here it is ' + (pos ? 'positive' : 'negative') + '.');
    }),
    G('other-dimension', function () {
      var k = rint(1, 5), x0 = 2 * k, V = x0 * x0 * x0 / 2, h = V / (x0 * x0);
      return N('An open-topped box has a square base of side $x$ cm and a volume of ' + V + ' cm$^3$. Its surface area is $S = x^2 + \\frac{' + (4 * V) + '}{x}$. Given that $S$ is a minimum when $\\frac{dS}{dx} = 0$, find the height of the box, in cm, when $S$ is a minimum.', h, 0,
        '$\\frac{dS}{dx} = 2x - \\frac{' + (4 * V) + '}{x^2} = 0$ gives $x^3 = ' + (2 * V) + '$, so $x = ' + x0 + '$. The height is $h = \\frac{V}{x^2} = \\frac{' + V + '}{' + (x0 * x0) + '} = ' + dec(h) + '$.');
    }),
    G('optimum-value', function () {
      var k = rint(1, 4), a = 3 * k, vmax = 4 * k * k * k;
      return N('A volume is modelled by $V = ' + P([[a, 2], [-1, 3]]) + '$ for $0 \\lt x \\lt ' + a + '$. $V$ is a maximum when $\\frac{dV}{dx} = 0$. Find the maximum value of $V$.', vmax, 0,
        '$\\frac{dV}{dx} = ' + (2 * a) + 'x - 3x^2 = 0$ gives $x = ' + (2 * k * 3 / 3 * 1) * 1 + '$ (the root $x = 0$ is a minimum). Then $V = ' + a + '(' + (2 * k) + ')^2 - (' + (2 * k) + ')^3 = ' + (a * 4 * k * k) + ' - ' + (8 * k * k * k) + ' = ' + vmax + '$.');
    }),
    G('find-critical', function () {
      var A = pick([2, 3, 4, 5]), c, x;
      do { c = rint(10, 60) * A; x = Math.sqrt(c / A); } while (Math.abs(x - Math.round(x)) < 1e-9);
      return N('The running cost of a machine is $C = ' + P([[A, 1]]) + ' + \\frac{' + c + '}{x}$ for $x \\gt 0$. Use calculus to find the value of $x$ for which $C$ is a minimum. Give your answer to 3 significant figures.', x, 3,
        '$\\frac{dC}{dx} = ' + A + ' - \\frac{' + c + '}{x^2} = 0$ gives $x^2 = ' + (c / A) + '$, so $x = ' + dec(R.roundSf(x, 3)) + '$ to 3 s.f. (the positive root).');
    }),
    G('unrounded-value', function () {
      var A = pick([2, 3, 4, 5]), c, x;
      do { c = rint(10, 60) * A; x = Math.sqrt(c / A); } while (Math.abs(x - Math.round(x)) < 1e-9);
      var v = 2 * Math.sqrt(A * c);
      return N('The cost of a process is $C = ' + P([[A, 1]]) + ' + \\frac{' + c + '}{x}$ for $x \\gt 0$. Find the minimum value of $C$, giving your answer to 3 significant figures. (Use the exact critical value, not a rounded one.)', v, 3,
        'The minimum is at $x = \\sqrt{' + (c / A) + '}$. Then $C = ' + A + 'x + \\frac{' + c + '}{x}$ with the unrounded $x$ gives ' + dec(R.roundSf(v, 3)) + ' to 3 s.f. Rounding $x$ first can change the last digit.');
    }),
    G('differentiate', function () {
      var a = rint(2, 6), c = rint(20, 200);
      return M('A surface area is $S = ' + a + 'r^2 + \\frac{' + c + '}{r}$. Which expression is $\\frac{dS}{dr}$?', T(P([[2 * a, 1]], 'r') + ' - \\frac{' + c + '}{r^2}'),
        [T(P([[2 * a, 1]], 'r') + ' + \\frac{' + c + '}{r^2}'), T(P([[2 * a, 1]], 'r') + ' + ' + c + '\\ln r'), T(P([[2 * a, 1]], 'r') + ' + ' + c), T(P([[2 * a, 1]], 'r') + ' - \\frac{' + c + '}{r}')],
        'Write $\\frac{' + c + '}{r}$ as $' + c + 'r^{-1}$. Its derivative is $-' + c + 'r^{-2}= -\\frac{' + c + '}{r^2}$, and $' + a + 'r^2$ gives $' + (2 * a) + 'r$.');
    }),
    S('justify', M('For $S = 2x + \\frac{32}{x}$ ($x \\gt 0$), $\\frac{dS}{dx} = 0$ at $x = 4$. Which is a complete justification that $x = 4$ gives a minimum?',
      '$\\frac{d^2S}{dx^2} = \\frac{64}{x^3} = 1 \\gt 0$ at $x = 4$, so $S$ is a minimum',
      ['$\\frac{dS}{dx} = 0$ at $x = 4$, so $S$ is a minimum', '$S = 16$ at $x = 4$, which is positive, so $S$ is a minimum', '$\\frac{d^2S}{dx^2} = \\frac{64}{x^3} = 1 \\gt 0$ at $x = 4$, so $S$ is a maximum'],
      'Differentiate again: $\\frac{d^2S}{dx^2} = 64x^{-3}$, which is 1 at $x = 4$. A positive second derivative means a minimum, and the answer must state both the value or sign and the conclusion.')),
    S('trap-substitute', M('A student finds $x = 5$ from $\\frac{dS}{dx} = 0$ and wants the minimum value of $S$. Into which expression should $x = 5$ be substituted?',
      'The original expression for $S$',
      ['The first derivative $\\frac{dS}{dx}$', 'The second derivative $\\frac{d^2S}{dx^2}$', 'Neither: the minimum value is always 0'],
      'The optimum value is the value of the quantity itself, so substitute into $S$. The derivative is zero there by construction, and the second derivative only tells you the nature.')),
    S('trap-root', M('Solving $\\frac{dV}{dx} = 0$ for a box gives $x^2 = 36$, where $x$ is a length in cm. What should be done?',
      'Take $x = 6$ only, because a length must be positive',
      ['Use both $x = 6$ and $x = -6$ as valid solutions', 'Take $x = 18$', 'Take $x = -6$ because it gives the smaller value'],
      '$x^2 = 36$ gives $x = \\pm 6$, but a length cannot be negative, so only $x = 6$ is kept.'))
  ] };

  // =====================================================================
  // FPM-CAL-13 Small changes and percentage changes
  // =====================================================================
  B['FPM-CAL-13'] = { title: 'Small changes and percentage changes', items: [
    G('delta-y', function () {
      var a = rint(2, 7), n = rint(2, 4), x0 = rint(2, 5), d = pick([0.01, 0.02, 0.05, 0.1]);
      var v = a * n * Math.pow(x0, n - 1) * d;
      return N('A quantity is given by $y = ' + P([[a, n]]) + '$. Use $\\delta y \\approx \\frac{dy}{dx}\\,\\delta x$ to estimate the change in $y$ when $x$ increases from ' + x0 + ' to ' + dec(x0 + d) + '.', v, 0,
        '$\\frac{dy}{dx} = ' + P([[a * n, n - 1]]) + '$, which is ' + dec(a * n * Math.pow(x0, n - 1)) + ' at $x = ' + x0 + '$. With $\\delta x = ' + d + '$, $\\delta y \\approx ' + dec(a * n * Math.pow(x0, n - 1)) + ' \\times ' + d + ' = ' + dec(v) + '$.');
    }),
    G('percent', function () {
      var cases = [
        { f: 'the area of a circle, $A = \\pi r^2$', v: 'radius', n: 2 },
        { f: 'the volume of a cube, $V = x^3$', v: 'edge length', n: 3 },
        { f: 'a quantity $y = 5x^4$', v: '$x$', n: 4 },
        { f: 'a quantity $y = \\frac{8}{x^2}$', v: '$x$', n: -2 },
        { f: 'a quantity $y = \\frac{3}{x}$', v: '$x$', n: -1 }
      ];
      var c = pick(cases), p = pick([1, 2, 3, 4, 5]), ans = c.n * p;
      return N('Consider ' + c.f + '. Use calculus to estimate the percentage change in it when the ' + (c.v === '$x$' ? 'value of $x$' : c.v) + ' increases by ' + p + '%. Give a negative number for a decrease.', ans, 0,
        'For $y = kx^n$, $\\delta y \\approx nkx^{n-1}\\delta x$ and $\\delta x = \\frac{' + p + '}{100}x$, so $\\frac{\\delta y}{y} \\approx n \\times \\frac{' + p + '}{100}$. The percentage change is about $' + c.n + ' \\times ' + p + ' = ' + ans + '\\%$.');
    }),
    G('percent', function () {
      var x0 = rint(2, 5), b = rint(1, 6), p = rint(1, 4);
      var y = x0 * x0 + b * x0, dy = 2 * x0 + b, pct = dy * x0 * p / y;
      return N('A cost is $y = x^2 + ' + b + 'x$. When $x = ' + x0 + '$ it increases by ' + p + '%. Use calculus to estimate the percentage increase in $y$. Give your answer to 3 significant figures.', pct, 3,
        '$\\frac{dy}{dx} = 2x + ' + b + ' = ' + dy + '$, $y = ' + y + '$ and $\\delta x = 0.0' + p + ' \\times ' + x0 + ' = ' + dec(0.01 * p * x0) + '$. So $\\delta y \\approx ' + dy + ' \\times ' + dec(0.01 * p * x0) + ' = ' + dec(dy * 0.01 * p * x0) + '$ and the percentage change is $\\frac{\\delta y}{y} \\times 100 \\approx ' + dec(R.roundSf(pct, 3)) + '\\%$.');
    }),
    G('find-dx', function () {
      var x0 = rint(2, 6), b = rint(1, 6), dx = pick([0.01, 0.02, 0.05]), dy = (2 * x0 + b) * dx;
      return N('For $y = x^2 + ' + b + 'x$, a small change in $x$ from $x = ' + x0 + '$ causes $y$ to increase by approximately ' + dec(dy) + '. Estimate the change in $x$.', dx, 0,
        '$\\frac{dy}{dx} = 2x + ' + b + ' = ' + (2 * x0 + b) + '$ at $x = ' + x0 + '$. Rearranging $\\delta y \\approx \\frac{dy}{dx}\\delta x$ gives $\\delta x \\approx \\frac{' + dec(dy) + '}{' + (2 * x0 + b) + '} = ' + dec(dx) + '$.');
    }),
    G('delta-y', function () {
      var r0 = rint(3, 12), d = pick([0.01, 0.02, 0.05, 0.1]);
      var v = 4 * Math.PI * r0 * r0 * d;
      return N('The volume of a sphere is $V = \\frac{4}{3}\\pi r^3$. Use calculus to estimate the increase in volume, in cm$^3$, when the radius increases from ' + r0 + ' cm to ' + dec(r0 + d) + ' cm. Give your answer to 3 significant figures.', v, 3,
        '$\\frac{dV}{dr} = 4\\pi r^2 = ' + (4 * r0 * r0) + '\\pi$ at $r = ' + r0 + '$. So $\\delta V \\approx ' + (4 * r0 * r0) + '\\pi \\times ' + d + ' = ' + dec(R.roundSf(v, 3)) + '$ cm$^3$.');
    }),
    G('delta-y', function () {
      var k = rint(2, 9) * 5, x0 = pick([2, 4, 5, 10]), d = pick([0.01, 0.02, 0.05]);
      var v = -k * d / (x0 * x0);
      return N('A quantity is $y = \\frac{' + k + '}{x}$. Estimate the change in $y$ when $x$ increases from ' + x0 + ' by ' + d + '. (Your answer should be negative.)', v, 3,
        '$y = ' + k + 'x^{-1}$ so $\\frac{dy}{dx} = -\\frac{' + k + '}{x^2} = -' + dec(k / (x0 * x0)) + '$ at $x = ' + x0 + '$. Then $\\delta y \\approx -' + dec(k / (x0 * x0)) + ' \\times ' + d + ' = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('write-dx', function () {
      var x0 = pick([20, 40, 50, 80, 120, 200]), p = rint(1, 6);
      return M('A length is $x = ' + x0 + '$ cm and it increases by ' + p + '%. Which is the correct value of $\\delta x$, in cm, to use in $\\delta y \\approx \\frac{dy}{dx}\\delta x$?',
        T(dec(x0 * p / 100)), [T(String(p)), T(dec(p / 100)), T(dec(x0 * p))],
        'A ' + p + '% increase in $x$ means $\\delta x = \\frac{' + p + '}{100} \\times ' + x0 + ' = ' + dec(x0 * p / 100) + '$ cm. Using ' + p + ' directly is the usual slip.');
    }),
    G('delta-y-setup', function () {
      var n = rint(2, 5), x0 = rint(2, 6), d = pick([0.01, 0.02, 0.05]);
      var right = n * Math.pow(x0, n - 1) * d;
      return M('For $y = x^{' + n + '}$ and $x = ' + x0 + '$, which value is the best estimate of $\\delta y$ when $\\delta x = ' + d + '$?', T(dec(right)),
        [T(dec(Math.pow(x0, n) * d)), T(dec(n * Math.pow(x0, n - 1))), T(dec(n * Math.pow(x0, n - 1) * d * 100)), T(dec(right * 10)), T(dec(right / 2))],
        '$\\frac{dy}{dx} = ' + n + 'x^{' + (n - 1) + '} = ' + dec(n * Math.pow(x0, n - 1)) + '$, then multiply by $\\delta x$: $' + dec(n * Math.pow(x0, n - 1)) + ' \\times ' + d + ' = ' + dec(right) + '$. Using $y$ instead of $\\frac{dy}{dx}$ or leaving out $\\delta x$ are the common errors.');
    }),
    S('percent-formula', M('Which expression gives the approximate percentage change in $y$ caused by a small change $\\delta x$ in $x$?',
      '$\\dfrac{1}{y}\\cdot\\dfrac{dy}{dx}\\,\\delta x \\times 100$',
      ['$\\dfrac{dy}{dx}\\,\\delta x \\times 100$', '$\\dfrac{dy}{dx}\\times 100$', '$\\dfrac{\\delta x}{y} \\times 100$'],
      'A percentage change is relative to the original value, so divide the change $\\delta y \\approx \\frac{dy}{dx}\\delta x$ by $y$ and multiply by 100.')),
    S('interpret', M('The approximation $\\delta y \\approx \\frac{dy}{dx}\\,\\delta x$ is reliable when...',
      '$\\delta x$ is small compared with $x$',
      ['$\\delta x$ is large, so the change is easy to see', '$y$ is a straight line only', '$\\frac{dy}{dx} = 0$'],
      'The gradient at $x$ only matches the curve close to $x$, so the estimate works for small changes.')),
    S('interpret', M('A student works out a percentage change in $y$ as $\\frac{\\delta y}{\\delta x} \\times 100$. What is wrong?',
      'The change in $y$ should be divided by $y$, not by $\\delta x$',
      ['Nothing: this is the correct formula', 'It should be multiplied by $x$ instead of 100', '$\\delta x$ should be squared'],
      'Percentage change in $y$ is $\\frac{\\delta y}{y} \\times 100$. Dividing by $\\delta x$ gives a gradient, not a relative change.'))
  ] };

  // =====================================================================
  // FPM-CAL-14 Rates of change with one chain-rule link
  // =====================================================================
  B['FPM-CAL-14'] = { title: 'Rates of change with one chain-rule link', items: [
    G('chain-rate', function () {
      var c = 2 * rint(3, 20), r = pick([2, 3, 4, 5, 6]), v = c / (2 * r);
      return N('The area of a circular oil slick increases at a constant rate of $' + c + '\\pi$ cm$^2$ s$^{-1}$. Find the rate of increase of the radius, in cm s$^{-1}$, when the radius is ' + r + ' cm. Give your answer to 3 significant figures.', v, 3,
        '$A = \\pi r^2$, so $\\frac{dA}{dr} = 2\\pi r$. Then $\\frac{dr}{dt} = \\frac{dA/dt}{dA/dr} = \\frac{' + c + '\\pi}{2\\pi(' + r + ')} = ' + dec(R.roundSf(v, 3)) + '$ cm s$^{-1}$.');
    }),
    G('chain-rate', function () {
      var k = rint(4, 20) * 5, r = rint(2, 6), v = k / (4 * Math.PI * r * r);
      return N('A spherical balloon is inflated so that its volume increases at a constant rate of ' + k + ' cm$^3$ s$^{-1}$. Find the rate at which the radius is increasing when the radius is ' + r + ' cm. Give your answer in cm s$^{-1}$ to 3 significant figures.', v, 3,
        '$V = \\frac{4}{3}\\pi r^3$, so $\\frac{dV}{dr} = 4\\pi r^2$. Then $\\frac{dr}{dt} = \\frac{dV/dt}{dV/dr} = \\frac{' + k + '}{4\\pi(' + r + ')^2} = ' + dec(R.roundSf(v, 3)) + '$ cm s$^{-1}$.');
    }),
    G('find-instant', function () {
      var r = pick([3, 6]), V = 4 * r * r * r / 3, k = pick([6, 9, 12, 15, 24]), v = k / (4 * r * r);
      return N('A sphere has volume $V$ cm$^3$ and radius $r$ cm, where $V = \\frac{4}{3}\\pi r^3$. Its volume increases at ' + k + ' cm$^3$ s$^{-1}$. Find the rate of change of the radius, in cm s$^{-1}$, at the instant when $V = ' + V + '\\pi$. Give your answer to 3 significant figures.', v, 3,
        'First find $r$: $\\frac{4}{3}\\pi r^3 = ' + V + '\\pi$ gives $r^3 = ' + (V * 3 / 4) + '$, so $r = ' + r + '$. Then $\\frac{dr}{dt} = \\frac{' + k + '}{4\\pi r^2} = \\frac{' + k + '}{' + (4 * r * r) + '\\pi} = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('find-instant', function () {
      var A = rint(20, 90), r = Math.sqrt(A / Math.PI);
      return N('The area of a circle is $A = \\pi r^2$. At a certain instant $A = ' + A + '$ cm$^2$. Find the radius $r$ at that instant, in cm, to 3 significant figures.', r, 3,
        '$\\pi r^2 = ' + A + '$ gives $r^2 = \\frac{' + A + '}{\\pi}$, so $r = ' + dec(R.roundSf(r, 3)) + '$ cm. The area (' + A + ') is not the radius.');
    }),
    G('chain-rate', function () {
      var x = pick([2, 3, 4, 5, 6]), k = pick([6, 12, 18, 24, 30, 36, 48]), v = k / (3 * x * x);
      return N('The volume of a cube of edge $x$ cm is increasing at a constant rate of ' + k + ' cm$^3$ s$^{-1}$. Find the rate at which $x$ is increasing, in cm s$^{-1}$, when $x = ' + x + '$. Give your answer to 3 significant figures.', v, 3,
        '$V = x^3$, so $\\frac{dV}{dx} = 3x^2$. Then $\\frac{dx}{dt} = \\frac{dV/dt}{dV/dx} = \\frac{' + k + '}{3(' + x + ')^2} = ' + dec(R.roundSf(v, 3)) + '$ cm s$^{-1}$.');
    }),
    G('geometry', function () {
      var Rr = pick([2, 3, 4, 5]), c = rint(2, 12) * 5, v = c / (Rr * Rr);
      return N('Water is poured into a cylindrical tank of radius ' + Rr + ' m at a constant rate of $' + c + '\\pi$ m$^3$ per minute. Find the rate at which the depth $h$ of water is rising, in m per minute, to 3 significant figures.', v, 3,
        '$V = \\pi(' + Rr + ')^2 h = ' + (Rr * Rr) + '\\pi h$, so $\\frac{dV}{dh} = ' + (Rr * Rr) + '\\pi$. Then $\\frac{dh}{dt} = \\frac{' + c + '\\pi}{' + (Rr * Rr) + '\\pi} = ' + dec(R.roundSf(v, 3)) + '$ m per minute.');
    }),
    G('geometry', function () {
      var m = pick([2, 3]), h = pick([4, 5, 6, 8]), c = pick([5, 10, 12, 15, 20]), v = c * m * m / (h * h);
      return N('Liquid runs into a cone with its point downwards. The radius of the liquid surface is always $\\frac{h}{' + m + '}$, where $h$ cm is the depth. The liquid enters at a constant rate of $' + c + '\\pi$ cm$^3$ s$^{-1}$. Find the rate at which $h$ is increasing, in cm s$^{-1}$, when $h = ' + h + '$. Give your answer to 3 significant figures.', v, 3,
        '$V = \\frac{1}{3}\\pi\\left(\\frac{h}{' + m + '}\\right)^2 h = \\frac{\\pi h^3}{' + (3 * m * m) + '}$, so $\\frac{dV}{dh} = \\frac{\\pi h^2}{' + (m * m) + '}$. Then $\\frac{dh}{dt} = \\frac{' + c + '\\pi}{\\pi h^2/' + (m * m) + '} = \\frac{' + (c * m * m) + '}{' + (h * h) + '} = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('negative-rate', function () {
      var k = rint(3, 12) * 5, r = rint(2, 6), v = -k / (4 * Math.PI * r * r);
      return N('Air leaks from a spherical balloon so that its volume decreases at a constant rate of ' + k + ' cm$^3$ s$^{-1}$. Find $\\frac{dr}{dt}$, in cm s$^{-1}$, when $r = ' + r + '$. Give your answer to 3 significant figures (it should be negative).', v, 3,
        '$\\frac{dV}{dt} = -' + k + '$ because the volume is decreasing. $\\frac{dr}{dt} = \\frac{-' + k + '}{4\\pi(' + r + ')^2} = ' + dec(R.roundSf(v, 3)) + '$ cm s$^{-1}$.');
    }),
    G('cone-formula', function () {
      var m = pick([2, 3, 4]);
      return M('A cone has radius $r = \\frac{h}{' + m + '}$ at every depth $h$. Which gives its volume $V = \\frac{1}{3}\\pi r^2 h$ in terms of $h$ alone?',
        T('V = \\frac{\\pi h^3}{' + (3 * m * m) + '}'), [T('V = \\frac{\\pi h^3}{' + (3 * m) + '}'), T('V = \\frac{\\pi h^2}{' + (3 * m * m) + '}'), T('V = \\frac{\\pi h^3}{' + (m * m) + '}'), T('V = \\frac{\\pi h^3}{' + (m * m + 3) + '}')],
        'Replace $r$ by $\\frac{h}{' + m + '}$: $V = \\frac{1}{3}\\pi\\frac{h^2}{' + (m * m) + '}h = \\frac{\\pi h^3}{' + (3 * m * m) + '}$. You must square the ratio and keep the factor $\\frac{1}{3}$.');
    }),
    S('chain-direction', M('A circle\'s area $A = \\pi r^2$ grows at a known rate $\\frac{dA}{dt}$. Which is the correct way to find $\\frac{dr}{dt}$?',
      '$\\dfrac{dr}{dt} = \\dfrac{dA}{dt} \\div \\dfrac{dA}{dr}$',
      ['$\\dfrac{dr}{dt} = \\dfrac{dA}{dt} \\times \\dfrac{dA}{dr}$', '$\\dfrac{dr}{dt} = \\dfrac{dA}{dr} \\div \\dfrac{dA}{dt}$', '$\\dfrac{dr}{dt} = \\dfrac{dA}{dt} - \\dfrac{dA}{dr}$'],
      'The chain rule is $\\frac{dA}{dt} = \\frac{dA}{dr} \\times \\frac{dr}{dt}$. Rearranging gives $\\frac{dr}{dt} = \\frac{dA/dt}{dA/dr}$.')),
    S('trap-order', M('In a rate-of-change question the radius is 5 cm at the instant of interest. When should $r = 5$ be substituted?',
      'After differentiating, when evaluating the rate',
      ['Before differentiating, into the formula for the area', 'It is never needed', 'Only into $\\frac{dr}{dt}$ after rounding to 1 decimal place'],
      'Substituting a number first turns the formula into a constant, whose derivative is 0. Differentiate with $r$ as a variable, then substitute.')),
    S('negative-rate', M('Liquid is draining from a tank at 5 cm$^3$ s$^{-1}$. What is $\\frac{dV}{dt}$?', '$-5$ cm$^3$ s$^{-1}$',
      ['$5$ cm$^3$ s$^{-1}$', '$\\frac{1}{5}$ cm$^3$ s$^{-1}$', '$-\\frac{1}{5}$ cm$^3$ s$^{-1}$'],
      'A decreasing volume has a negative rate of change, so $\\frac{dV}{dt} = -5$.'))
  ] };

  // =====================================================================
  // FPM-CAL-15 Connected rates
  // =====================================================================
  B['FPM-CAL-15'] = { title: 'Connected rates: linking two changing quantities', items: [
    G('two-step', function () {
      var k = pick([0.3, 0.45, 0.6, 1.2, 0.8]), x0 = pick([4, 8, 10, 12]), v = k * x0 / 4;
      return N('The surface area of a cube of edge $x$ cm is increasing at a constant rate of ' + k + ' cm$^2$ s$^{-1}$. Find the rate of increase of the volume, in cm$^3$ s$^{-1}$, at the instant when the surface area is ' + (6 * x0 * x0) + ' cm$^2$. Give your answer to 3 significant figures.', v, 3,
        '$A = 6x^2$ gives $6x^2 = ' + (6 * x0 * x0) + '$ so $x = ' + x0 + '$. $\\frac{dx}{dt} = \\frac{dA/dt}{dA/dx} = \\frac{' + k + '}{12(' + x0 + ')}$. With $V = x^3$, $\\frac{dV}{dt} = 3x^2\\frac{dx}{dt} = 3(' + (x0 * x0) + ')\\times\\frac{' + k + '}{' + (12 * x0) + '} = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('two-step', function () {
      var k = pick([3, 6, 9, 12, 15, 18]), x0 = pick([2, 3, 4, 6, 8]), v = 4 * k / x0;
      return N('The volume of a cube of edge $x$ cm increases at ' + k + ' cm$^3$ s$^{-1}$. Find the rate of increase of its surface area, in cm$^2$ s$^{-1}$, when $x = ' + x0 + '$. Give your answer to 3 significant figures.', v, 3,
        '$\\frac{dx}{dt} = \\frac{dV/dt}{dV/dx} = \\frac{' + k + '}{3x^2}$. Since $A = 6x^2$, $\\frac{dA}{dt} = 12x\\frac{dx}{dt} = 12(' + x0 + ')\\times\\frac{' + k + '}{3(' + (x0 * x0) + ')} = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('two-step', function () {
      var k = pick([2, 4, 6, 8, 10]), r = rint(2, 9), v = k * r / 2;
      return N('The surface area of a sphere of radius $r$ cm increases at ' + k + ' cm$^2$ s$^{-1}$. Find the rate of increase of its volume, in cm$^3$ s$^{-1}$, when $r = ' + r + '$. ($S = 4\\pi r^2$, $V = \\frac{4}{3}\\pi r^3$.)', v, 3,
        '$\\frac{dr}{dt} = \\frac{dS/dt}{dS/dr} = \\frac{' + k + '}{8\\pi r}$. Then $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt} = 4\\pi r^2\\times\\frac{' + k + '}{8\\pi r} = \\frac{' + k + 'r}{2} = ' + dec(v) + '$.');
    }),
    G('two-step', function () {
      var k = pick([6, 12, 18, 24, 30]), r = pick([2, 3, 4, 6]), v = 2 * k / r;
      return N('The volume of a sphere increases at ' + k + ' cm$^3$ s$^{-1}$. Find the rate of increase of its surface area, in cm$^2$ s$^{-1}$, when the radius is ' + r + ' cm. Give your answer to 3 significant figures.', v, 3,
        '$\\frac{dr}{dt} = \\frac{' + k + '}{4\\pi r^2}$. Then $\\frac{dS}{dt} = 8\\pi r\\frac{dr}{dt} = 8\\pi r\\times\\frac{' + k + '}{4\\pi r^2} = \\frac{' + (2 * k) + '}{r} = ' + dec(R.roundSf(v, 3)) + '$.');
    }),
    G('two-step', function () {
      var k = rint(2, 9), r = rint(3, 12), v = k * r;
      return N('The circumference of a circle is increasing at a constant rate of ' + k + ' cm s$^{-1}$. Find the rate of increase of the area, in cm$^2$ s$^{-1}$, when the radius is ' + r + ' cm. ($C = 2\\pi r$, $A = \\pi r^2$.)', v, 3,
        '$\\frac{dr}{dt} = \\frac{dC/dt}{2\\pi} = \\frac{' + k + '}{2\\pi}$. Then $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt} = 2\\pi(' + r + ')\\times\\frac{' + k + '}{2\\pi} = ' + v + '$.');
    }),
    G('find-instant', function () {
      var x = rint(3, 12);
      return N('The surface area of a cube of edge $x$ cm is 6$x^2$. At one instant the surface area is ' + (6 * x * x) + ' cm$^2$. Find the edge length at that instant, in cm.', x, 0,
        '$6x^2 = ' + (6 * x * x) + '$ gives $x^2 = ' + (x * x) + '$, so $x = ' + x + '$. The area is not the edge length.');
    }),
    G('ratio', function () {
      var x = pick([2, 4, 6, 8, 10, 12, 20]);
      return N('A cube has edge $x$ cm. Its volume and surface area both change with time. Find the value of $\\frac{dV/dt}{dA/dt}$ when $x = ' + x + '$.', x / 4, 0,
        'Both rates contain $\\frac{dx}{dt}$, which cancels: $\\frac{dV/dt}{dA/dt} = \\frac{3x^2}{12x} = \\frac{x}{4}$. When $x = ' + x + '$ this is ' + dec(x / 4) + '.');
    }),
    S('chain-setup', M('The surface area $A = 6x^2$ of a cube is changing at a known rate. Which expression gives $\\frac{dV}{dt}$, where $V = x^3$?',
      '$3x^2 \\times \\dfrac{dA/dt}{12x}$',
      ['$3x^2 \\times \\dfrac{12x}{dA/dt}$', '$12x \\times \\dfrac{dA/dt}{3x^2}$', '$3x^2 \\times 12x \\times \\dfrac{dA}{dt}$'],
      'First find $\\frac{dx}{dt} = \\frac{dA/dt}{dA/dx} = \\frac{dA/dt}{12x}$, then $\\frac{dV}{dt} = \\frac{dV}{dx}\\times\\frac{dx}{dt} = 3x^2 \\times \\frac{dA/dt}{12x}$.')),
    S('chain-setup', M('For a sphere, $\\frac{dV}{dt}$ is given and $\\frac{dS}{dt}$ is required, where $V = \\frac{4}{3}\\pi r^3$ and $S = 4\\pi r^2$. Which chain is correct?',
      '$\\dfrac{dS}{dt} = 8\\pi r \\times \\dfrac{dV/dt}{4\\pi r^2}$',
      ['$\\dfrac{dS}{dt} = 4\\pi r^2 \\times \\dfrac{dV/dt}{8\\pi r}$', '$\\dfrac{dS}{dt} = 8\\pi r \\times 4\\pi r^2 \\times \\dfrac{dV}{dt}$', '$\\dfrac{dS}{dt} = \\dfrac{8\\pi r}{4\\pi r^2}\\div\\dfrac{dV}{dt}$'],
      'The given rate is for $V$, so $\\frac{dr}{dt} = \\frac{dV/dt}{dV/dr} = \\frac{dV/dt}{4\\pi r^2}$. Then multiply by $\\frac{dS}{dr} = 8\\pi r$.')),
    S('units', M('The surface area of a sphere is increasing at 0.4 cm$^2$ s$^{-1}$. What are the units of the required rate of increase of the volume?',
      'cm$^3$ s$^{-1}$', ['cm$^2$ s$^{-1}$', 'cm s$^{-1}$', 'cm$^3$ s$^{-2}$'],
      'Volume is measured in cm$^3$, and the rate is per second, so cm$^3$ s$^{-1}$.')),
    S('trap-given', M('A question gives $\\frac{dA}{dt} = 0.45$ and asks for $\\frac{dV}{dt}$. A student starts by calculating $\\frac{dV}{dx}\\div\\frac{dx}{dA}$... Which first step is sensible?',
      'Find $\\frac{dx}{dt}$ from $\\frac{dA}{dt}\\div\\frac{dA}{dx}$', ['Find $\\frac{dA}{dt}$ from $\\frac{dV}{dt}$, which is not given', 'Substitute the area as if it were the edge length', 'Differentiate $V$ with respect to $A$ without a chain'],
      'The known rate is $\\frac{dA}{dt}$, so start by using it to find the rate of the shared variable $\\frac{dx}{dt}$, then use $\\frac{dV}{dt} = \\frac{dV}{dx}\\frac{dx}{dt}$.'))
  ] };

  // =====================================================================
  // FPM-CAL-16 Finding a curve from its gradient function
  // =====================================================================
  B['FPM-CAL-16'] = { title: 'Finding a curve from its gradient function', items: [
    G('find-constant', function () {
      var a, b, d, c, x0, y0;
      do { a = rint(-2, 3); b = rint(-4, 4); d = rint(-5, 6); c = rint(-8, 8); x0 = pick([1, 2, 3, -1, -2]); } while (a === 0 || c === 0 || (b === 0 && d === 0));
      y0 = a * x0 * x0 * x0 + b * x0 * x0 + d * x0 + c;
      return N('A curve has gradient $\\frac{dy}{dx} = ' + P([[3 * a, 2], [2 * b, 1], [d, 0]]) + '$ and passes through the point $(' + x0 + ', ' + y0 + ')$. Its equation is $y = ' + P([[a, 3], [b, 2], [d, 1]]) + ' + c$. Find the value of $c$.', c, 0,
        'Substitute $(' + x0 + ', ' + y0 + ')$ into $y = ' + P([[a, 3], [b, 2], [d, 1]]) + ' + c$: $' + y0 + ' = ' + (y0 - c) + ' + c$, so $c = ' + c + '$.');
    }),
    G('evaluate', function () {
      var a, b, d, c, x0, x1, y0;
      do { a = rint(1, 3); b = rint(-3, 3); d = rint(-4, 5); c = rint(-6, 6); x0 = pick([1, 2]); x1 = pick([-1, 3, 2, 0]); } while (x1 === x0 || c === 0);
      y0 = a * Math.pow(x0, 3) + b * x0 * x0 + d * x0 + c;
      var y1 = a * Math.pow(x1, 3) + b * x1 * x1 + d * x1 + c;
      return N('A curve with $\\frac{dy}{dx} = ' + P([[3 * a, 2], [2 * b, 1], [d, 0]]) + '$ passes through $(' + x0 + ', ' + y0 + ')$. Find the value of $y$ on the curve when $x = ' + x1 + '$.', y1, 0,
        'Integrate: $y = ' + P([[a, 3], [b, 2], [d, 1]]) + ' + c$. Using $(' + x0 + ', ' + y0 + ')$ gives $c = ' + c + '$. Then at $x = ' + x1 + '$, $y = ' + y1 + '$.');
    }),
    G('unknown-in-gradient', function () {
      var k = pick([-4, -3, -2, -1, 1, 2, 3, 4]), d = rint(3, 7), x0 = pick([1, 2, 3, -1, -2]);
      var y0 = Math.pow(x0, 3) + k * x0 * x0 + d * x0;
      return N('A curve passes through the origin and has gradient $\\frac{dy}{dx} = 3x^2 + 2px + ' + d + '$, where $p$ is a constant. The curve also passes through the point $(' + x0 + ', ' + y0 + ')$. Find the value of $p$.', k, 0,
        'Integrating gives $y = x^3 + px^2 + ' + d + 'x + c$. The curve passes through the origin, so $c = 0$. Substitute $(' + x0 + ', ' + y0 + ')$: $' + y0 + ' = ' + Math.pow(x0, 3) + ' + ' + (x0 * x0) + 'p + ' + (d * x0) + '$, so $p = ' + k + '$.');
    }),
    G('factor-theorem', function () {
      var b = rint(-3, 3), d = rint(-4, 5), a = rint(1, 4), c = -(a * a * a + b * a * a + d * a);
      return N('A curve $y = f(x)$ has $f\'(x) = ' + P([[3, 2], [2 * b, 1], [d, 0]]) + '$, so $f(x) = ' + P([[1, 3], [b, 2], [d, 1]]) + ' + c$. Given that $(x - ' + a + ')$ is a factor of $f(x)$, find $c$.', c, 0,
        'By the factor theorem $f(' + a + ') = 0$: $' + a + '^3 + (' + b + ')(' + a + ')^2 + (' + d + ')(' + a + ') + c = 0$, which is $' + (a * a * a + b * a * a + d * a) + ' + c = 0$, so $c = ' + c + '$.');
    }),
    G('integrate', function () {
      var n = rint(1, 4), m = rint(2, 6), k = m * (n + 1);
      return M('Which is the integral of $' + P([[k, n]]) + '$ with respect to $x$?', T(P([[m, n + 1]]) + ' + c'),
        [T(P([[m, n + 1]])), T(P([[k * (n + 1), n + 1]]) + ' + c'), T(P([[k, n + 1]]) + ' + c')],
        'Raise the power by one and divide by the new power: $\\frac{' + k + '}{' + (n + 1) + '}x^{' + (n + 1) + '} = ' + P([[m, n + 1]]) + '$, then add $+c$. Multiplying by the new power or leaving out $+c$ are the usual errors.');
    }),
    G('equation', function () {
      var a, d, x0, y0, c;
      do { a = rint(1, 4); d = rint(-5, 5); x0 = pick([1, 2, 3]); c = rint(-6, 6); } while (c === 0 || d === 0);
      y0 = a * x0 * x0 + d * x0 + c;
      var f = function (cc) { return 'y = ' + P([[a, 2], [d, 1], [cc, 0]]); };
      return M('A curve has $\\frac{dy}{dx} = ' + P([[2 * a, 1], [d, 0]]) + '$ and passes through $(' + x0 + ', ' + y0 + ')$. What is its equation?', T(f(c)),
        [T(f(-c)), T(f(c + 2 * d * x0)), T(f(y0)), T(f(c + 1)), T(f(c - 1))],
        'Integrating gives $y = ' + P([[a, 2], [d, 1]]) + ' + c$. At $(' + x0 + ', ' + y0 + ')$, $c = ' + y0 + ' - ' + (a * x0 * x0 + d * x0) + ' = ' + c + '$.');
    }),
    G('trap-intercept', function () {
      var a = rint(1, 3), b = rint(-3, 3), d = rint(-4, 5), c = rint(-7, 7), x0 = pick([1, 2]);
      if (c === 0) c = 4;
      var y0 = a * Math.pow(x0, 3) + b * x0 * x0 + d * x0 + c;
      return N('A curve with $\\frac{dy}{dx} = ' + P([[3 * a, 2], [2 * b, 1], [d, 0]]) + '$ passes through $(' + x0 + ', ' + y0 + ')$. At what value of $y$ does it cross the $y$-axis?', c, 0,
        'Integrating gives $y = ' + P([[a, 3], [b, 2], [d, 1]]) + ' + c$, and at $x = 0$ every term except $c$ vanishes. Using the given point gives $c = ' + c + '$, so the curve crosses the $y$-axis at $y = ' + c + '$.');
    }),
    S('integrate', M('What is $\\int 5\\,dx$?', '$5x + c$', ['$5 + c$', '$c$', '$\\frac{5x^2}{2} + c$'],
      'A constant $k$ integrates to $kx$: think of 5 as $5x^0$, raise the power to 1 and divide by 1, giving $5x$, then add $c$.')),
    S('integrate', M('What is $\\int 6x^{1/2}\\,dx$?', '$4x^{3/2} + c$', ['$9x^{3/2} + c$', '$3x^{-1/2} + c$', '$6x^{3/2} + c$'],
      'Add 1 to the power: $\\frac{1}{2} + 1 = \\frac{3}{2}$. Dividing 6 by $\\frac{3}{2}$ gives 4, so the integral is $4x^{3/2} + c$.')),
    S('spot-error', M('A curve has $\\frac{dy}{dx} = 12x^2 - 6x + 5$ and passes through $(1, 10)$. A student writes: <br>Line 1: $y = 4x^3 - 3x^2 + 5x + c$<br>Line 2: $10 = 4 - 3 + 5 + c$<br>Line 3: $10 = 6 + c$, so $c = 16$<br>Line 4: $y = 4x^3 - 3x^2 + 5x + 16$<br>Which line is the first to contain an error?',
      'Line 3', ['Line 1', 'Line 2', 'Line 4'],
      'Lines 1 and 2 are right. In Line 3, $10 = 6 + c$ gives $c = 10 - 6 = 4$, not 16. Line 4 is wrong only because it uses that value.')),
    S('spot-error', M('A curve has $\\frac{dy}{dx} = 12x^2 + 4$ and passes through $(0, 3)$. A student writes: <br>Line 1: $y = 36x^3 + 4x + c$<br>Line 2: $3 = 0 + 0 + c$ so $c = 3$<br>Line 3: $y = 36x^3 + 4x + 3$<br>Which line is the first to contain an error?',
      'Line 1', ['Line 2', 'Line 3', 'There is no error'],
      'Integrating $12x^2$ gives $\\frac{12x^3}{3} = 4x^3$, not $36x^3$ (the power is divided into the coefficient, not multiplied). The later lines are consistent with that slip but also wrong.'))
  ] };

  // =====================================================================
  // FPM-CAL-17 Integrating trig functions using identities
  // =====================================================================
  B['FPM-CAL-17'] = { title: 'Integrating trig functions using identities', items: [
    G('integrate-cos', function () {
      var a = rint(2, 5), m = rint(1, 4), k = 2 * a * m, half = pick([true, false]);
      var up = half ? piFr(1, 2 * a) : piFr(1, 6 * a), v = k / a * (half ? 1 : 0.5);
      return N('Evaluate $\\displaystyle\\int_0^{' + up + '} ' + k + '\\cos ' + a + 'x\\,dx$, where $x$ is in radians.', v, 0,
        '$\\int ' + k + '\\cos ' + a + 'x\\,dx = \\frac{' + k + '}{' + a + '}\\sin ' + a + 'x = ' + (k / a) + '\\sin ' + a + 'x$. At the upper limit $' + a + 'x = ' + (half ? '\\frac{\\pi}{2}' : '\\frac{\\pi}{6}') + '$, so the value is $' + (k / a) + ' \\times ' + (half ? '1' : '\\frac{1}{2}') + ' = ' + dec(v) + '$ (the lower limit gives 0).');
    }),
    G('integrate-sin', function () {
      var a = rint(2, 5), m = rint(1, 4), k = 2 * a * m, t = pick([[1, 2, 1], [2, 1, 2], [1, 3, 0.5]]);
      var up = piFr(t[0], t[1] * a), v = k / a * t[2];
      var cosV = t[2] === 1 ? '0' : (t[2] === 2 ? '-1' : '\\frac{1}{2}');
      return N('Evaluate $\\displaystyle\\int_0^{' + up + '} ' + k + '\\sin ' + a + 'x\\,dx$, where $x$ is in radians.', v, 0,
        '$\\int ' + k + '\\sin ' + a + 'x\\,dx = -\\frac{' + k + '}{' + a + '}\\cos ' + a + 'x = -' + (k / a) + '\\cos ' + a + 'x$. So the integral is $' + (k / a) + '(\\cos 0 - \\cos ' + piFr(t[0], t[1]) + ') = ' + (k / a) + '(1 - ' + (cosV.indexOf('-') === 0 ? '(' + cosV + ')' : cosV) + ') = ' + dec(v) + '$.');
    }),
    G('product-to-sum', function () {
      var A, Bq, j = rint(1, 2);
      do { A = rint(2, 7); Bq = rint(1, A - 1); } while ((A + Bq) % 2 === 0);
      var k = j * (A * A - Bq * Bq), v = 2 * j * A;
      return N('Use $2\\sin P\\cos Q = \\sin(P + Q) + \\sin(P - Q)$ to evaluate $\\displaystyle\\int_0^{\\pi} ' + k + '\\sin ' + A + 'x\\cos ' + (Bq === 1 ? '' : Bq) + 'x\\,dx$, where $x$ is in radians.', v, 0,
        '$' + k + '\\sin ' + A + 'x\\cos ' + (Bq === 1 ? '' : Bq) + 'x = ' + (k / 2) + '[\\sin ' + (A + Bq) + 'x + \\sin ' + (A - Bq === 1 ? '' : A - Bq) + 'x]$. Each $\\int_0^{\\pi}\\sin nx\\,dx = \\frac{1 - \\cos n\\pi}{n} = \\frac{2}{n}$ for odd $n$, so the total is $' + (k / 2) + '\\left(\\frac{2}{' + (A + Bq) + '} + \\frac{2}{' + (A - Bq) + '}\\right) = ' + v + '$.');
    }),
    G('power-reduction', function () {
      var c = pick([2, 4, 6, 8, 10, 12]), trig = pick(['\\cos', '\\sin']), full = pick([true, false]);
      var v = full ? c / 2 : c / 4;
      return N('Using a double-angle identity, $\\displaystyle\\int_0^{' + (full ? '\\pi' : '\\frac{\\pi}{2}') + '} ' + c + trig + '^2 x\\,dx = k\\pi$ (with $x$ in radians). Find $k$.', v, 0,
        '$' + trig + '^2 x = \\frac{1}{2}(1 ' + (trig === '\\cos' ? '+' : '-') + ' \\cos 2x)$. Integrating gives $' + (c / 2) + '\\left[x ' + (trig === '\\cos' ? '+' : '-') + ' \\frac{\\sin 2x}{2}\\right]$, and the sine term is 0 at both limits. So the value is $' + (c / 2) + ' \\times ' + (full ? '\\pi' : '\\frac{\\pi}{2}') + '$, and $k = ' + dec(v) + '$.');
    }),
    G('rewrite', function () {
      var a = rint(2, 5), trig = pick(['\\sin', '\\cos']);
      var right = '$\\frac{1}{2}(1 ' + (trig === '\\cos' ? '+' : '-') + ' \\cos ' + (2 * a) + 'x)$';
      return M('Which expression is equal to $' + trig + '^2 ' + a + 'x$?', right,
        ['$\\frac{1}{2}(1 ' + (trig === '\\cos' ? '-' : '+') + ' \\cos ' + (2 * a) + 'x)$', '$\\frac{1}{2}(1 ' + (trig === '\\cos' ? '+' : '-') + ' \\cos ' + a + 'x)$', '$1 ' + (trig === '\\cos' ? '+' : '-') + ' \\cos ' + (2 * a) + 'x$'],
        'From $\\cos 2A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A$ with $A = ' + a + 'x$: $' + trig + '^2 A = \\frac{1}{2}(1 ' + (trig === '\\cos' ? '+' : '-') + ' \\cos 2A)$, and $2A = ' + (2 * a) + 'x$.');
    }),
    G('rewrite', function () {
      var p = rint(2, 7), q = rint(1, p - 1), m = rint(1, 4), k = 2 * m;
      return M('Which is equal to $' + k + '\\sin ' + p + 'x\\cos ' + (q === 1 ? '' : q) + 'x$?', '$' + m + '(\\sin ' + (p + q) + 'x + \\sin ' + (p - q) + 'x)$',
        ['$' + k + '(\\sin ' + (p + q) + 'x + \\sin ' + (p - q) + 'x)$', '$' + m + '(\\sin ' + (p + q) + 'x - \\sin ' + (p - q) + 'x)$', '$' + m + '\\sin ' + (p * q) + 'x$'],
        'Use $2\\sin P\\cos Q = \\sin(P + Q) + \\sin(P - Q)$. Here $' + k + '\\sin ' + p + 'x\\cos ' + q + 'x = ' + m + ' \\times 2\\sin ' + p + 'x\\cos ' + q + 'x = ' + m + '(\\sin ' + (p + q) + 'x + \\sin ' + (p - q === 1 ? '' : p - q) + 'x)$.');
    }),
    G('integrate-sin', function () {
      var a = rint(3, 9), k = pick([2, 4, 6, 10]);
      var c = k / a, cs = fr(c);
      return M('Find $\\int ' + k + '\\sin ' + a + 'x\\,dx$.', T('-' + (c === 1 ? '' : (cs.indexOf('frac') >= 0 ? cs : cs)) + '\\cos ' + a + 'x + c'),
        [T((c === 1 ? '' : cs) + '\\cos ' + a + 'x + c'), T('-' + k + '\\cos ' + a + 'x + c'), T(k * a + '\\cos ' + a + 'x + c')],
        'Divide by the multiple of $x$ and change the sign: $\\int \\sin ax\\,dx = -\\frac{1}{a}\\cos ax$. So the integral is $-\\frac{' + k + '}{' + a + '}\\cos ' + a + 'x + c$.');
    }),
    S('plan', M('Which is a sensible first step to evaluate $\\int_0^{\\pi/2} \\cos^4 x\\,dx$?', 'Write $\\cos^4 x = \\left(\\frac{1 + \\cos 2x}{2}\\right)^2$ and expand',
      ['Integrate $\\cos x$ and raise the result to the power 4', 'Write $\\cos^4 x = \\cos 4x$', 'Differentiate $\\cos^4 x$ using the chain rule'],
      '$\\cos^4 x = (\\cos^2 x)^2$ and $\\cos^2 x = \\frac{1}{2}(1 + \\cos 2x)$. Expanding gives terms in $1$, $\\cos 2x$ and $\\cos^2 2x$, which can be reduced again and then integrated.')),
    S('trap-product', M('A student writes $\\int \\sin 7x\\cos x\\,dx = \\int \\sin 7x\\,dx \\times \\int \\cos x\\,dx$. What is wrong?',
      'The integral of a product is not the product of the integrals; rewrite as a sum first',
      ['Nothing is wrong: integrals of products always split', '$\\sin 7x$ cannot be integrated', 'It should be a sum of the two integrals'],
      'Products of trig functions must be turned into sums with $2\\sin A\\cos B = \\sin(A + B) + \\sin(A - B)$ before integrating.')),
    S('exact-value', M('Which is the exact value of $\\cos 3\\pi$ (radians)?', '$-1$', ['$1$', '$0$', '$-0.9986$'],
      '$3\\pi$ is one and a half turns, so it points in the same direction as $\\pi$ where $\\cos \\pi = -1$. A calculator set to degrees would give the wrong value.')),
    S('identity', M('Which rearrangement of $\\cos 2A = 1 - 2\\sin^2 A$ gives $\\sin^2 A$?', '$\\sin^2 A = \\frac{1}{2}(1 - \\cos 2A)$',
      ['$\\sin^2 A = \\frac{1}{2}(1 + \\cos 2A)$', '$\\sin^2 A = 1 - \\cos 2A$', '$\\sin^2 A = \\frac{1}{2}\\cos 2A - 1$'],
      'Make $\\sin^2 A$ the subject: $2\\sin^2 A = 1 - \\cos 2A$, then divide by 2.'))
  ] };

  // =====================================================================
  // FPM-CAL-18 Estimating an integral using a series expansion
  // =====================================================================
  var SER = [{ n: 0.5, s: '\\frac{1}{2}' }, { n: -1, s: '-1' }, { n: -0.5, s: '-\\frac{1}{2}' }, { n: -2, s: '-2' }, { n: 1 / 3, s: '\\frac{1}{3}' }, { n: -1 / 3, s: '-\\frac{1}{3}' }];
  function coefs(n, b, terms) { var c = [], t = 1; for (var k = 0; k < terms; k++) { if (k > 0) t = t * (n - k + 1) / k; c.push(t * Math.pow(b, k)); } return c; }
  function ascJoin(t) { var s = ''; t.forEach(function (x) { var one = P([x]); s += s ? (x[0] < 0 ? ' - ' + one.replace(/^-/, '') : ' + ' + one) : one; }); return s; }
  function serStr(c) { var t = []; for (var i = 0; i < c.length; i++) t.push([c[i], i]); return ascJoin(t.filter(function (x) { return Math.abs(x[0]) > 1e-12; })); }
  function anti(c) { var t = []; for (var i = 0; i < c.length; i++) t.push([c[i] / (i + 1), i + 1]); return ascJoin(t.filter(function (x) { return Math.abs(x[0]) > 1e-12; })); }
  function estimate(c, a, b) { var s = 0; c.forEach(function (ck, k) { s += ck * (Math.pow(b, k + 1) - Math.pow(a, k + 1)) / (k + 1); }); return s; }
  function ser(allowedL) { var s = pick(SER), b = pick([1, -1, 2, -2]); var Ls = Math.abs(b) === 1 ? [0.1, 0.2, 0.25, 0.5] : [0.1, 0.2, 0.25]; return { n: s.n, ns: s.s, b: b, L: pick(Ls) }; }
  function base(sr) { var bx = sr.b === 1 ? 'x' : (sr.b === -1 ? '-x' : sr.b + 'x'); return '(1 ' + (sr.b < 0 ? '-' : '+') + ' ' + (Math.abs(sr.b) === 1 ? '' : Math.abs(sr.b)) + 'x)^{' + sr.ns + '}'; }
  B['FPM-CAL-18'] = { title: 'Estimating an integral using a series expansion', items: [
    G('integrate-series', function () {
      var sr = ser(), terms = pick([3, 4]), c = coefs(sr.n, sr.b, terms), v = estimate(c, 0, sr.L);
      return ND('Given that $' + base(sr) + ' \\approx ' + serStr(c) + '$ for small $x$, use algebraic integration to estimate $\\displaystyle\\int_0^{' + sr.L + '} ' + base(sr) + '\\,dx$. Give your answer to 4 decimal places.', v, 4,
        'Integrate the polynomial term by term: $\\left[' + anti(c) + '\\right]_0^{' + sr.L + '}$. Substituting $x = ' + sr.L + '$ (the lower limit gives 0) gives ' + dec(R.roundDp(v, 4)) + ' to 4 d.p.');
    }),
    G('integrate-series', function () {
      var sr = ser(), c = coefs(sr.n, sr.b, 3), v = estimate(c, 0, sr.L);
      return ND('The first three terms of the expansion of $' + base(sr) + '$ are $' + serStr(c) + '$. Hence estimate $\\displaystyle\\int_0^{' + sr.L + '} ' + base(sr) + '\\,dx$ to 4 decimal places.', v, 4,
        'Integrating the three terms gives $' + anti(c) + '$. Substituting the upper limit $x = ' + sr.L + '$ gives ' + dec(R.roundDp(v, 4)) + ' to 4 d.p.');
    }),
    G('limits', function () {
      var sr = ser(), c = coefs(sr.n, sr.b, 3), lo = sr.L / 2, v = estimate(c, lo, sr.L);
      return ND('Using $' + base(sr) + ' \\approx ' + serStr(c) + '$, estimate $\\displaystyle\\int_{' + dec(lo) + '}^{' + sr.L + '} ' + base(sr) + '\\,dx$ to 4 decimal places.', v, 4,
        'With antiderivative $F(x) = ' + anti(c) + '$, the estimate is $F(' + sr.L + ') - F(' + dec(lo) + ')$. Both limits must be substituted and subtracted. This gives ' + dec(R.roundDp(v, 4)) + ' to 4 d.p.');
    }),
    G('integrate-series', function () {
      var sr = ser(), c = coefs(sr.n, sr.b, 4), last = c[3] / 4;
      return N('A series is $' + serStr(c) + '$. When it is integrated term by term, the integrated series contains a term $kx^4$. Find $k$ (give it as a decimal, or to 3 significant figures if it does not terminate).', last, 3,
        'The $x^3$ term is $' + fr(Math.abs(c[3])) + 'x^3$ with coefficient ' + dec(R.roundSf(c[3], 4)) + '. Integrating $ax^3$ gives $\\frac{a}{4}x^4$, so $k = \\frac{' + dec(R.roundSf(c[3], 4)) + '}{4} = ' + dec(R.roundSf(last, 3)) + '$.');
    }),
    G('antiderivative', function () {
      var sr = ser(), c = coefs(sr.n, sr.b, 3), right = anti(c);
      var d1 = [], i; for (i = 1; i < c.length; i++) d1.push(c[i] * i);
      var w1 = serStr(d1);                                                       // differentiated instead
      var w2 = P([[c[2], 3], [c[1], 2], [c[0], 1]]);                              // forgot to divide
      var w4 = P([[c[2] / 2, 3], [c[1] / 2, 2], [c[0], 1]]);                      // divided by wrong power
      return M('A series for a function is $' + serStr(c) + '$. Which is the result of integrating it term by term (ignoring the constant)?', T(right),
        [T(w2), T(w4), T(w1)],
        'Add one to each power and divide by it: $' + right + '$. Forgetting to divide, dividing by the old power, or differentiating are the usual slips.');
    }),
    G('validity', function () {
      var good = pick([true, false]), bq = pick([2, 3, 4]), L, ok;
      if (good) { L = pick([0.1, 0.2]); } else { L = pick([0.5, 1, 2]); }
      ok = bq * L < 1;
      var n = pick(['\\frac{1}{2}', '-1', '-\\frac{1}{2}']);
      return M('The expansion of $(1 + ' + bq + 'x)^{' + n + '}$ is used to estimate $\\displaystyle\\int_0^{' + L + '} (1 + ' + bq + 'x)^{' + n + '}\\,dx$. Which statement is correct?',
        ok ? 'The estimate is reasonable, because $|' + bq + 'x| \\lt 1$ for every $x$ in the interval' : 'The series is not valid over the whole interval, because $|' + bq + 'x|$ reaches or exceeds 1',
        [ok ? 'The series is not valid over the whole interval, because $|' + bq + 'x|$ reaches or exceeds 1' : 'The estimate is reasonable, because $|' + bq + 'x| \\lt 1$ for every $x$ in the interval',
          'The series is always valid because it only has a few terms', 'The series is never valid when the lower limit is 0'],
        'The binomial series for $(1 + ' + bq + 'x)^n$ needs $|' + bq + 'x| \\lt 1$, that is $|x| \\lt \\frac{1}{' + bq + '}$. The upper limit is ' + L + ', so ' + (ok ? 'the whole interval is inside the range.' : 'part of the interval is outside the range.'));
    }),
    S('series-slip', M('Which is the result of integrating $1 - \\frac{3}{2}x + \\frac{3}{2}x^2$ term by term?',
      '$x - \\frac{3}{4}x^2 + \\frac{1}{2}x^3$', ['$x - \\frac{3}{2}x^2 + \\frac{3}{2}x^3$', '$-\\frac{3}{2} + 3x$', '$x - \\frac{3}{4}x^2 + \\frac{3}{4}x^3$'],
      '$\\frac{3}{2}x$ integrates to $\\frac{3}{4}x^2$ and $\\frac{3}{2}x^2$ integrates to $\\frac{3}{2} \\div 3 = \\frac{1}{2}$ times $x^3$. Differentiating by mistake gives the second option.')),
    S('validity', M('The series for $(1 - 3x)^{1/2}$ is valid for $|3x| \\lt 1$. For which interval of integration is it safe to use?',
      '$0$ to $0.2$', ['$0$ to $0.5$', '$0$ to $1$', '$0$ to $2$'],
      '$|3x| \\lt 1$ means $|x| \\lt \\frac{1}{3}$. Only the upper limit $0.2$ lies inside that range.')),
    S('arithmetic', N('Evaluate $\\frac{1}{4}(0.5)^4$ as a decimal.', 0.015625, 0, '$0.5^2 = 0.25$, $0.5^4 = 0.0625$, and $\\frac{0.0625}{4} = 0.015625$. Small powers of 0.5 are where arithmetic slips happen.')),
    S('why-series', M('Why is a series used to estimate $\\int_0^{0.2} (1 + 2x)^{-1/2}\\,dx$ in this type of question?',
      'The series gives a polynomial, which can be integrated term by term',
      ['The series is exact, so the answer has no error', 'A series is needed because integration is impossible for every function', 'The series lets us avoid substituting limits'],
      'The question says to use the expansion: a truncated series is a polynomial, which is easy to integrate. The result is an estimate, not an exact value.'))
  ] };

  // =====================================================================
  // FPM-CAL-19 Area between a curve and the x-axis
  // =====================================================================
  function cubicRoots() { var p = rint(1, 4), q = rint(1, 4); if (p === q) q += 1; return { p: p, q: q, f: pmul(pmul([0, 1], lin(-p)), lin(q)) }; }   // x(x+p)(x-q)
  function sgn(v) { return v < 0 ? '-' + Math.abs(v) : String(v); }
  B['FPM-CAL-19'] = { title: 'Area between a curve and the x-axis', items: [
    G('area-single', function () {
      var a = rint(-3, 1), g = rint(2, 6), b = a + g, f = pmul(lin(a), lin(b));
      var area = Math.abs(defint(f, a, b));
      return N('The curve $y = ' + pstr(f) + '$ crosses the $x$-axis at $x = ' + a + '$ and $x = ' + b + '$. Use integration to find the area of the finite region bounded by the curve and the $x$-axis. Give your answer to 3 significant figures if it is not exact.', area, 3,
        '$\\int_{' + a + '}^{' + b + '}(' + pstr(f) + ')\\,dx = ' + dec(R.roundSf(defint(f, a, b), 4)) + '$. The curve is below the axis between the roots, so the integral is negative and the area is its size: ' + dec(R.roundSf(area, 3)) + '.');
    }),
    G('area-split', function () {
      var cr = cubicRoots(), f = cr.f, a1 = Math.abs(defint(f, -cr.p, 0)), a2 = Math.abs(defint(f, 0, cr.q)), tot = a1 + a2;
      return N('The curve $y = x(x + ' + cr.p + ')(x - ' + cr.q + ')$ crosses the $x$-axis at three points. Find the total area of the two finite regions bounded by the curve and the $x$-axis. Give your answer to 3 significant figures.', tot, 3,
        'Expand: $y = ' + pstr(f) + '$. The roots are $-' + cr.p + '$, $0$, $' + cr.q + '$. Integrate separately: $\\int_{-' + cr.p + '}^{0} y\\,dx = ' + dec(R.roundSf(defint(f, -cr.p, 0), 4)) + '$ and $\\int_{0}^{' + cr.q + '} y\\,dx = ' + dec(R.roundSf(defint(f, 0, cr.q), 4)) + '$. Add the sizes: ' + dec(R.roundSf(a1, 4)) + ' + ' + dec(R.roundSf(a2, 4)) + ' = ' + dec(R.roundSf(tot, 3)) + '.');
    }),
    G('trap-cancel', function () {
      var cr = cubicRoots(), v = defint(cr.f, -cr.p, cr.q);
      return N('For $y = x(x + ' + cr.p + ')(x - ' + cr.q + ')$, evaluate $\\displaystyle\\int_{-' + cr.p + '}^{' + cr.q + '} y\\,dx$. Give your answer to 3 significant figures (it may be negative).', v, 3,
        'Integrating straight across the root at $x = 0$ lets the positive and negative parts partly cancel: the value is ' + dec(R.roundSf(v, 3)) + '. This is not the area. For the area, split at $x = 0$ and add the sizes.');
    }),
    G('area-trig', function () {
      var a = rint(2, 4), A = rint(1, 6) * a;
      return N('The curve $y = ' + (A === 1 ? '' : A) + '\\sin ' + (a === 1 ? '' : a) + 'x$ for $0 \\leqslant x \\leqslant ' + piFr(2, a) + '$ (radians) crosses the $x$-axis at $x = 0$, $x = ' + piFr(1, a) + '$ and $x = ' + piFr(2, a) + '$. Find the total area of the two regions bounded by the curve and the $x$-axis.', 4 * A / a, 0,
        'Each half-wave has area $\\frac{2 \\times ' + A + '}{' + a + '} = ' + dec(2 * A / a) + '$, because $\\int_0^{\\pi/' + a + '} ' + A + '\\sin ' + a + 'x\\,dx = \\frac{' + A + '}{' + a + '}[-\\cos ' + a + 'x] = \\frac{2 \\times ' + A + '}{' + a + '}$. The second half is below the axis, so take its size and add: ' + dec(4 * A / a) + '.');
    }),
    G('area-trig', function () {
      var a = rint(2, 4), A = rint(1, 6) * a;
      return N('Find the total area enclosed between the curve $y = ' + A + '\\cos ' + (a === 1 ? '' : a) + 'x$ and the $x$-axis for $0 \\leqslant x \\leqslant \\frac{\\pi}{' + a + '}$ (radians). Remember that part of the curve lies below the axis.', 2 * A / a, 0,
        'The curve crosses the axis at $x = \\frac{\\pi}{' + (2 * a) + '}$. The first part gives $\\frac{' + A + '}{' + a + '}\\sin\\frac{\\pi}{2} = ' + dec(A / a) + '$. The second part gives $-' + dec(A / a) + '$, whose size is $' + dec(A / a) + '$. The total area is ' + dec(2 * A / a) + '.');
    }),
    G('crossings', function () {
      var a = pick([2, 3]), right = [], k;
      for (k = 0; k < a; k++) right.push(piFr(2 * k + 1, 2 * a));
      var w1 = [], w2 = [], w3 = [];
      for (k = 1; k <= a; k++) w1.push(piFr(k, a));
      for (k = 0; k < a; k++) w2.push(piFr(2 * k + 1, 2));
      for (k = 0; k <= a; k++) w3.push(piFr(2 * k + 1, 2 * a));
      var fmt = function (l) { return T(l.join(',\\ ')); };
      return M('Which are the values of $x$, in radians, where $y = \\cos ' + a + 'x$ crosses the $x$-axis for $0 \\leqslant x \\leqslant \\pi$?', fmt(right), [fmt(w1), fmt(w2), fmt(w3)],
        '$\\cos ' + a + 'x = 0$ gives $' + a + 'x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\ldots$, so $x = \\frac{\\pi}{' + (2 * a) + '}, \\frac{3\\pi}{' + (2 * a) + '}, \\ldots$ Keep only the values up to $\\pi$ after dividing by ' + a + '.');
    }),
    G('sketch-sign', function () {
      var r = [rint(-4, -1), rint(0, 1), rint(2, 5)];
      var f = 'y = (x ' + (r[0] < 0 ? '+ ' + (-r[0]) : '- ' + r[0]) + ')(x ' + (r[1] === 0 ? '' : '- ' + r[1]) + ')(x - ' + r[2] + ')';
      f = 'y = ' + (r[0] === 0 ? 'x' : '(x + ' + (-r[0]) + ')') + (r[1] === 0 ? 'x' : '(x - ' + r[1] + ')') + '(x - ' + r[2] + ')';
      f = 'y = (x + ' + (-r[0]) + ')' + (r[1] === 0 ? 'x' : '(x - ' + r[1] + ')') + '(x - ' + r[2] + ')';
      var up = '$x$ from ' + r[0] + ' to ' + r[1], dn = '$x$ from ' + r[1] + ' to ' + r[2];
      return M('The curve $' + f + '$ crosses the $x$-axis at $x = ' + r[0] + '$, $x = ' + r[1] + '$ and $x = ' + r[2] + '$, and the $x^3$ coefficient is positive. Which statement about the two finite regions is correct?',
        'The region for ' + up + ' is above the axis and the region for ' + dn + ' is below it',
        ['The region for ' + up + ' is below the axis and the region for ' + dn + ' is above it', 'Both finite regions are above the axis', 'Both finite regions are below the axis'],
        'A cubic with a positive $x^3$ coefficient rises to the right, so it is above the axis beyond the last root, below between the last two roots, and above between the first two roots. The finite regions therefore alternate: above, then below.');
    }),
    G('set-up', function () {
      var c = rint(1, 3), d = c + rint(2, 4), e = rint(1, 3);
      var ok = '$\\displaystyle\\int_0^{' + c + '} f(x)\\,dx - \\int_{' + c + '}^{' + d + '} f(x)\\,dx$';
      return M('A curve $y = f(x)$ is above the $x$-axis for $0 \\lt x \\lt ' + c + '$ and below it for ' + c + ' $\\lt x \\lt ' + d + '$. Which expression gives the total area of the regions between the curve and the axis from $x = 0$ to $x = ' + d + '$?', ok,
        ['$\\displaystyle\\int_0^{' + d + '} f(x)\\,dx$', '$\\displaystyle\\int_0^{' + c + '} f(x)\\,dx + \\int_{' + c + '}^{' + d + '} f(x)\\,dx$', '$\\displaystyle\\left|\\int_0^{' + d + '} f(x)\\,dx\\right|$'],
        'Split at the crossing $x = ' + c + '$. The second integral is negative, so subtract it (or take its modulus) to add its size. A single integral over the whole interval, or its modulus, lets the parts cancel.');
    }),
    G('sign', function () {
      var v = rint(2, 15) * 2;
      return M('Evaluating $\\displaystyle\\int_2^5 f(x)\\,dx$ gives $-' + v + '$, where $f$ is negative on the whole interval. What is the area of the region between the curve and the $x$-axis from $x = 2$ to $x = 5$?', T(String(v)),
        [T('-' + v), T('0'), T(dec(v / 2))], 'The curve is below the axis, so the integral is negative. Area is always positive, so the area is the size of the integral: ' + v + '.');
    }),
    S('why-split', M('Why must you integrate separately on each side of a point where the curve crosses the $x$-axis?',
      'Parts below the axis give negative values that would cancel parts above it',
      ['The integral of a curve is only defined between roots', 'Each part needs a different method of integration', 'The constant of integration changes at each root'],
      'A single integral over both parts gives (area above) minus (area below). Splitting lets you take the size of each part and add them.')),
    S('trap-sin', M('A student writes $\\int_0^{\\pi} \\sin x\\,dx = [\\cos x]_0^{\\pi} = -1 - 1 = -2$ and says the area is $-2$. Which statement is correct?',
      'The antiderivative should be $-\\cos x$, and the area is $2$',
      ['The student is correct: the area is $-2$', 'The antiderivative is correct, but the area is 0', 'The antiderivative is $\\cos x$ and the area is 1'],
      '$\\int \\sin x\\,dx = -\\cos x$, so the integral is $[-\\cos x]_0^{\\pi} = 1 - (-1) = 2$. The curve is above the axis on $0$ to $\\pi$, so the area is 2.'))
  ] };

  // =====================================================================
  // FPM-CAL-20 Area between two curves (or a curve and a line)
  // =====================================================================
  function rootsPair() { var a = rint(-3, 2), b = a + rint(2, 5); return { a: a, b: b }; }
  function lineParab() {
    var rp = rootsPair(), k = pick([1, 1, 2, 3]), m = rint(-3, 4), n = rint(-5, 6), a = rp.a, b = rp.b;
    var Lp = [n, m], Pp = padd(Lp, pmul([k], pmul(lin(a), lin(b))), 1);
    return { a: a, b: b, k: k, L: Lp, Pq: Pp };
  }
  B['FPM-CAL-20'] = { title: 'Area between two curves (or a curve and a line)', items: [
    G('area-line-curve', function () {
      var d = lineParab(), area = defint(padd(d.L, d.Pq, -1), d.a, d.b);
      return N('The curve $C: y = ' + pstr(d.Pq) + '$ and the line $l: y = ' + pstr(d.L) + '$ intersect at the points with $x = ' + d.a + '$ and $x = ' + d.b + '$. Find the area of the finite region bounded by $C$ and $l$. Give your answer to 3 significant figures if it is not exact.', area, 3,
        'Between the intersections the line is above the curve, so integrate (line - curve) $= ' + pstr(padd(d.L, d.Pq, -1)) + '$ from ' + d.a + ' to ' + d.b + '. The result is ' + dec(R.roundSf(area, 3)) + '.');
    }),
    G('intersections', function () {
      var d = lineParab();
      return N('The curve $y = ' + pstr(d.Pq) + '$ meets the line $y = ' + pstr(d.L) + '$ at two points. Find the larger $x$-coordinate of the two points of intersection.', d.b, 0,
        'Set the equations equal: $' + pstr(d.Pq) + ' = ' + pstr(d.L) + '$, so $' + pstr(padd(d.Pq, d.L, -1)) + ' = 0$, which factorises as $(x ' + (d.a < 0 ? '+ ' + (-d.a) : '- ' + d.a) + ')(x ' + (d.b < 0 ? '+ ' + (-d.b) : '- ' + d.b) + ') = 0$' + (d.k === 1 ? '' : ' (after dividing by ' + d.k + ')') + '. The larger root is ' + d.b + '.');
    }),
    G('area-two-curves', function () {
      var rp = rootsPair(), a = rp.a, b = rp.b, u = rint(-4, 4), v = rint(-6, 3);
      var bottom = [v, u, 1], D = pmul([-2], pmul(lin(a), lin(b))), top = padd(bottom, D, 1), area = defint(D, a, b);
      return N('Two curves have equations $y = ' + pstr(top) + '$ and $y = ' + pstr(bottom) + '$. They meet where $x = ' + a + '$ and $x = ' + b + '$. Find the area of the finite region between them. Give your answer to 3 significant figures if it is not exact.', area, 3,
        'Find which is on top by testing a value between ' + a + ' and ' + b + ': the first curve (the one with $-x^2$) is on top. Top minus bottom $= ' + pstr(D) + '$. Integrating from ' + a + ' to ' + b + ' gives ' + dec(R.roundSf(area, 3)) + '.');
    }),
    G('area-line-curve', function () {
      var p = rint(1, 4), m = rint(2, 4), area = p * m * m * m / 6;
      return N('The curve $y = ' + (p === 1 ? '' : p) + 'x^2$ and the line $y = ' + (p * m) + 'x$ meet at the origin and at one other point. Find the area of the region enclosed between them. Give your answer to 3 significant figures if it is not exact.', area, 3,
        'Solve $' + P([[p, 2]]) + ' = ' + (p * m) + 'x$: $x = 0$ or $x = ' + m + '$. The line is on top, so the area is $\\int_0^{' + m + '}(' + (p * m) + 'x - ' + P([[p, 2]]) + ')\\,dx = \\left[' + dec(p * m / 2) + 'x^2 - \\frac{' + p + '}{3}x^3\\right]_0^{' + m + '} = ' + dec(R.roundSf(area, 3)) + '$.');
    }),
    G('test-top', function () {
      var rp; do { rp = rootsPair(); } while ((rp.a + rp.b) % 2 !== 0);
      var k = pick([1, 2, 3]), m = rint(-3, 4), n = rint(-5, 6), a = rp.a, b = rp.b, xm = (a + b) / 2;
      var Lp = [n, m], Pp = padd(Lp, pmul([k], pmul(lin(a), lin(b))), 1), val = pev(Lp, xm) - pev(Pp, xm);
      return N('A curve $y = ' + pstr(Pp) + '$ and a line $y = ' + pstr(Lp) + '$ meet at $x = ' + a + '$ and $x = ' + b + '$. Test the midpoint $x = ' + dec(xm) + '$: find (value of the line) minus (value of the curve) there. A positive answer means the line is above the curve between the intersections.', val, 0,
        'At $x = ' + dec(xm) + '$ the line gives ' + dec(pev(Lp, xm)) + ' and the curve gives ' + dec(pev(Pp, xm)) + '. The difference is ' + dec(val) + ', which is positive, so the line is on top and the integrand is (line - curve).');
    }),
    G('set-up', function () {
      var d = lineParab(), D = padd(d.L, d.Pq, -1), S1 = padd(d.L, d.Pq, 1);
      var integ = function (e, lo, hi) { return T('\\displaystyle\\int_{' + lo + '}^{' + hi + '} (' + pstr(e) + ')\\,dx'); };
      return M('The line $y = ' + pstr(d.L) + '$ and the curve $y = ' + pstr(d.Pq) + '$ meet at $x = ' + d.a + '$ and $x = ' + d.b + '$, with the line above the curve between those values. Which integral gives the area between them?',
        integ(D, d.a, d.b), [integ(padd(d.Pq, d.L, -1), d.a, d.b), integ(S1, d.a, d.b), integ(D, 0, d.b), integ(D, d.b, d.a), integ(d.L, d.a, d.b)],
        'Area $= \\int (\\text{top} - \\text{bottom})\\,dx$ between the intersection $x$-values. The line is on top, so subtract the curve from the line: $' + pstr(D) + '$, from ' + d.a + ' to ' + d.b + '.');
    }),
    G('limits', function () {
      var d, ya, yb;
      do { d = lineParab(); ya = pev(d.L, d.a); yb = pev(d.L, d.b); } while (ya === d.a || ya === d.b || yb === d.a || yb === d.b || ya === 0 || yb === 0 || ya === yb);
      return M('A curve and a line meet at the points $(' + d.a + ', ' + ya + ')$ and $(' + d.b + ', ' + yb + ')$. To find the area between them by integrating with respect to $x$, what limits should be used?',
        T('x = ' + d.a) + ' to ' + T('x = ' + d.b), [T('x = ' + ya) + ' to ' + T('x = ' + yb), T('x = 0') + ' to ' + T('x = ' + d.b), T('x = ' + d.a) + ' to ' + T('x = ' + yb), T('x = ' + ya) + ' to ' + T('x = ' + d.b), T('x = 0') + ' to ' + T('x = ' + yb), T('x = ' + (d.a - 1)) + ' to ' + T('x = ' + (d.b + 1))],
        'The limits are the $x$-coordinates of the intersection points: ' + d.a + ' and ' + d.b + '. The $y$-coordinates ' + ya + ' and ' + yb + ' are not limits for an integral in $x$.');
    }),
    S('negative-area', M('A student subtracts curve minus line and gets an area of $-9$ for a region where the line is above the curve. What is the correct area?',
      '$9$, by integrating line minus curve', ['$-9$, since it is below the curve', '$0$', '$4.5$'],
      'Area cannot be negative. Subtracting the wrong way round changes the sign. Using top minus bottom gives $+9$.')),
    S('whole-region', M('Part of the region between a curve and a line lies below the $x$-axis. How does this change the method of "top minus bottom"?',
      'It does not: top minus bottom still gives the correct area',
      ['You must integrate the curve and the line separately and take moduli', 'You must use the $x$-axis as the bottom instead', 'The area cannot be found by integration'],
      'The difference (top - bottom) is the vertical height of the region at each $x$, wherever it is relative to the axis, so one integral works.')),
    S('check-formula', M('A parabola $y = ax^2 + bx + c$ meets a line at $x = x_1$ and $x = x_2$. Which formula gives the area between them, as a quick check?',
      '$\\dfrac{|a|(x_2 - x_1)^3}{6}$', ['$\\dfrac{|a|(x_2 - x_1)^2}{6}$', '$\\dfrac{|a|(x_2 + x_1)^3}{6}$', '$\\dfrac{|a|(x_2 - x_1)^3}{3}$'],
      'Integrating $a(x - x_1)(x - x_2)$ between the roots gives $-\\frac{a(x_2 - x_1)^3}{6}$, so the area is $\\frac{|a|(x_2 - x_1)^3}{6}$.'))
  ] };
})();
