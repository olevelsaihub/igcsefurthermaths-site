/* Group G06 mastery bank: Inequalities, regions and linear programming; Factor theorem and cubics; Simultaneous equations with a curve. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function sgn() { return Math.random() < 0.5 ? -1 : 1; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  // ---------- formatting helpers ----------
  // fraction n/d in lowest terms as LaTeX (no dollars)
  function fr(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }
  // sum of terms: pairs [coef, variable-text]; '' for a constant. No "+ -", no 1x, no 0x.
  function E(pairs) {
    var s = '';
    pairs.forEach(function (p) {
      var c = p[0], v = p[1];
      if (c === 0) return;
      var ab = Math.abs(c), body = v === '' ? String(ab) : (ab === 1 ? v : ab + v);
      if (!s) s = (c < 0 ? '-' : '') + body; else s += (c < 0 ? ' - ' : ' + ') + body;
    });
    return s || '0';
  }
  var OPS = { lt: '\\lt', gt: '\\gt', le: '\\leqslant', ge: '\\geqslant' };
  var FLIP = { lt: 'gt', gt: 'lt', le: 'ge', ge: 'le' };
  function xo(op, val) { return '$x ' + OPS[op] + ' ' + val + '$'; }
  function paren(s) { return '(' + s + ')'; }
  // multiple-choice from a correct string and distractors; null if fewer than 3 distinct distractors (gen retries)
  function MC(q, correct, ds, why) {
    var seen = {}, opts = [correct]; seen[correct] = 1;
    ds.forEach(function (d) { if (d && !seen[d] && opts.length < 4) { seen[d] = 1; opts.push(d); } });
    if (opts.length < 4) return null;
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function NM(q, ans, why, tol) {
    return { kind: 'num', q: q, answer: ans, tol: tol || 1e-9, unit: '', display: '$' + ans + '$', why: why };
  }
  function G(fn) { return function () { for (var i = 0; i < 300; i++) { var r = fn(); if (r) return r; } throw new Error('gen failed'); }; }
  function S(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function sfTol(x, n) { return 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - (n - 1)); }
  // region text for a quadratic inequality with roots p < q
  function reg(p, q, inside, strict) {
    var lo = strict ? '\\lt' : '\\leqslant', hi = strict ? '\\gt' : '\\geqslant';
    return inside ? '$' + p + ' ' + lo + ' x ' + lo + ' ' + q + '$' : '$x ' + lo + ' ' + p + '$ or $x ' + hi + ' ' + q + '$';
  }
  function quadOpts(p, q, inside, strict, extra) {
    var lo = strict ? '\\lt' : '\\leqslant';
    var ds = [reg(p, q, !inside, strict), reg(-q, -p, inside, strict), reg(-q, -p, !inside, strict), reg(p, q, inside, !strict),
      inside ? '$x ' + lo + ' ' + q + '$' : '$' + q + ' ' + lo + ' x ' + lo + ' ' + p + '$'];
    return { c: reg(p, q, inside, strict), ds: (extra || []).concat(ds) };
  }
  function polyMul(a, b) { var r = []; var i, j; for (i = 0; i < a.length + b.length - 1; i++) r.push(0); for (i = 0; i < a.length; i++) for (j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]; return r; }
  // coefficients high to low -> text, optionally masking one coefficient (index from the left) with a letter
  function polyText(cs, maskIdx, letter) {
    var n = cs.length - 1, pairs = [];
    cs.forEach(function (c, i) {
      var pw = n - i, v = pw === 0 ? '' : (pw === 1 ? 'x' : 'x^{' + pw + '}');
      if (i === maskIdx) pairs.push([1, letter + v]); else pairs.push([c, v]);
    });
    return E(pairs);
  }
  function linFactor(s, r) { return E([[s, 'x'], [-r, '']]); }   // (sx - r)

  // =====================================================================
  // FPM-IDN-01 Linear inequalities and the 'both' overlap
  // =====================================================================
  function lin1(neg) {
    var a = rint(2, 7) * (neg ? -1 : 1), b = rint(-9, 9), c = rint(-9, 12), op = pick(['lt', 'gt', 'le', 'ge']);
    if (!b) return null;
    var rhs = c - b; if (!rhs) return null;
    var sop = a < 0 ? FLIP[op] : op;
    var q = 'Solve $' + E([[a, 'x'], [b, '']]) + ' ' + OPS[op] + ' ' + c + '$.';
    var why = 'Move the constant to get $' + E([[a, 'x']]) + ' ' + OPS[op] + ' ' + rhs + '$. Divide by ' + a + (neg ? ', which is negative, so the sign reverses: ' : ', which is positive, so the sign stays: ') + xo(sop, fr(rhs, a)) + '.';
    return MC(q, xo(sop, fr(rhs, a)), [xo(FLIP[sop], fr(rhs, a)), xo(sop, fr(-rhs, a)), xo(FLIP[sop], fr(-rhs, a))], why);
  }
  B['FPM-IDN-01'] = { title: 'Linear inequalities and the \'both\' overlap', items: [
    { skill: 'solve-linear', gen: G(function () { return lin1(false); }) },
    { skill: 'flip-sign', gen: G(function () { return lin1(true); }) },
    { skill: 'flip-sign', gen: G(function () { return lin1(true); }) },
    { skill: 'brackets', gen: G(function () {
      var p = rint(2, 5), q = sgn() * rint(1, 3), r = rint(1, 5), s = rint(-8, 10), op = pick(['lt', 'gt', 'le', 'ge']);
      var a = p * q, rhs = s + p * r; if (!rhs) return null;
      var sop = a < 0 ? FLIP[op] : op;
      var text = 'Solve $' + p + paren(E([[q, 'x'], [-r, '']])) + ' ' + OPS[op] + ' ' + s + '$.';
      var why = 'Expand: $' + E([[a, 'x'], [-p * r, '']]) + ' ' + OPS[op] + ' ' + s + '$, so $' + E([[a, 'x']]) + ' ' + OPS[op] + ' ' + rhs + '$. Divide by ' + a + (a < 0 ? ' and reverse the sign.' : '.');
      return MC(text, xo(sop, fr(rhs, a)), [xo(sop, fr(s + r, a)), xo(FLIP[sop], fr(rhs, a)), xo(sop, fr(s - p * r, a))], why);
    }) },
    { skill: 'collect-terms', gen: G(function () {
      var a = rint(1, 8), c = rint(1, 8), b = rint(-8, 8), d = rint(-8, 8), op = pick(['lt', 'gt', 'le', 'ge']);
      if (a === c || b === d) return null;
      var e = a - c, rhs = d - b, sop = e < 0 ? FLIP[op] : op;
      var text = 'Solve $' + E([[a, 'x'], [b, '']]) + ' ' + OPS[op] + ' ' + E([[c, 'x'], [d, '']]) + '$.';
      var why = 'Collect the $x$ terms on the left and numbers on the right: $' + E([[e, 'x']]) + ' ' + OPS[op] + ' ' + rhs + '$. Divide by ' + e + (e < 0 ? ' (negative, so reverse the sign).' : '.');
      return MC(text, xo(sop, fr(rhs, e)), [xo(FLIP[sop], fr(rhs, e)), xo(sop, fr(-rhs, e)), xo(FLIP[sop], fr(-rhs, e))], why);
    }) },
    { skill: 'integer-extreme', gen: G(function () {
      var a = rint(2, 6) * sgn(), b = rint(-8, 8), c = rint(-10, 14), op = pick(['lt', 'gt', 'le', 'ge']);
      var sop = a < 0 ? FLIP[op] : op, largest = (sop === 'lt' || sop === 'le');
      var best = null;
      for (var x = -60; x <= 60; x++) {
        var v = a * x + b, ok = op === 'lt' ? v < c : op === 'gt' ? v > c : op === 'le' ? v <= c : v >= c;
        if (ok && (best === null || (largest ? x > best : x < best))) best = x;
      }
      if (best === null || Math.abs(best) > 50) return null;
      var text = 'Find the ' + (largest ? 'largest' : 'smallest') + ' integer $x$ that satisfies $' + E([[a, 'x'], [b, '']]) + ' ' + OPS[op] + ' ' + c + '$.';
      var why = 'Solving gives $x ' + OPS[sop] + ' ' + fr(c - b, a) + '$' + (a < 0 ? ' (the sign reverses on dividing by a negative)' : '') + '. The ' + (largest ? 'largest' : 'smallest') + ' integer allowed is ' + best + '.';
      return NM(text, best, why);
    }) },
    { skill: 'overlap', gen: G(function () {
      var p = rint(-5, 3), q = p + rint(3, 8), a1 = rint(2, 4), b1 = rint(-5, 5), a2 = rint(2, 4), b2 = rint(-4, 8);
      var c1 = a1 * p + b1, c2 = b2 - a2 * q;
      var text = 'How many integers $x$ satisfy both $' + E([[a1, 'x'], [b1, '']]) + ' \\gt ' + c1 + '$ and $' + E([[-a2, 'x'], [b2, '']]) + ' \\gt ' + c2 + '$?';
      var why = 'The first gives $x \\gt ' + p + '$. The second gives $' + E([[-a2, 'x']]) + ' \\gt ' + (c2 - b2) + '$, so $x \\lt ' + q + '$ (reversed). Both must hold, so $' + p + ' \\lt x \\lt ' + q + '$, which has ' + (q - p - 1) + ' integers.';
      return NM(text, q - p - 1, why);
    }) },
    { skill: 'overlap', gen: G(function () {
      var p = rint(-5, 3), q = p + rint(2, 7), a1 = rint(2, 4), b1 = rint(-5, 5), a2 = rint(2, 4), b2 = rint(-4, 8);
      var c1 = a1 * p + b1, c2 = b2 - a2 * q;
      var text = 'Find the set of values of $x$ for which both $' + E([[a1, 'x'], [b1, '']]) + ' \\gt ' + c1 + '$ and $' + E([[-a2, 'x'], [b2, '']]) + ' \\geqslant ' + c2 + '$.';
      var why = 'The first gives $x \\gt ' + p + '$. The second gives $x \\leqslant ' + q + '$ (the sign reverses when dividing by ' + (-a2) + '). "Both" means the overlap: $' + p + ' \\lt x \\leqslant ' + q + '$.';
      return MC(text, '$' + p + ' \\lt x \\leqslant ' + q + '$', ['$x \\gt ' + p + '$', '$x \\leqslant ' + q + '$', '$x \\lt ' + p + '$ or $x \\geqslant ' + q + '$'], why);
    }) },
    { skill: 'surd-sign', gen: G(function () {
      var n = pick([2, 3, 5, 7]), k = pick([2, 3]);
      if (k * k <= n) return null;
      var d = k * k - n; if (d === 1) return null;
      var top = k + '+\\sqrt{' + n + '}', top2 = k + '-\\sqrt{' + n + '}';
      var text = 'Without a calculator, solve $(\\sqrt{' + n + '} - ' + k + ')x \\lt 1$, giving the answer with a rationalised denominator.';
      var why = '$\\sqrt{' + n + '} - ' + k + '$ is negative, so dividing reverses the sign: $x \\gt \\frac{1}{\\sqrt{' + n + '}-' + k + '}$. Multiplying top and bottom by $\\sqrt{' + n + '}+' + k + '$ gives denominator $' + n + '-' + (k * k) + '=-' + d + '$, so $x \\gt -\\frac{' + top + '}{' + d + '}$.';
      return MC(text, '$x \\gt -\\frac{' + top + '}{' + d + '}$', ['$x \\lt -\\frac{' + top + '}{' + d + '}$', '$x \\gt \\frac{' + top + '}{' + d + '}$', '$x \\gt -\\frac{' + top2 + '}{' + d + '}$'], why);
    }) },
    S('boundary', 'Which of these values of $x$ satisfies $2x - 1 \\geqslant 5$?', ['$3$', '$2.9$', '$2$', '$0$'], 0, 'Solving gives $x \\geqslant 3$. The sign $\\geqslant$ includes the end value, so $x = 3$ works (2.9, 2 and 0 are below 3).'),
    S('overlap', 'Part (a) gives $x \\lt 4$ and part (b) gives $x \\gt -1$. What does "both" mean for the final answer?', ['$-1 \\lt x \\lt 4$, the overlap of the two sets', '$x \\lt 4$ or $x \\gt -1$, the combined set', '$x \\lt -1$ or $x \\gt 4$', '$4 \\lt x \\lt -1$'], 0, '"Both" means each inequality must be true at the same time, so you take the overlap on the number line, $-1 \\lt x \\lt 4$.'),
    S('surd-sign', 'Before dividing both sides by $(\\sqrt{7} - 3)$ in an inequality, what must you notice?', ['$\\sqrt{7}\\approx 2.65$, so $\\sqrt{7}-3$ is negative and the sign must reverse', '$\\sqrt{7}-3$ is positive, so the sign stays', 'Surds cannot be used in inequalities', 'The sign reverses whenever a surd is involved'], 0, 'Decide the sign of the surd expression first. $\\sqrt{7}$ is about 2.65, so $\\sqrt{7}-3 \\lt 0$ and dividing by it reverses the inequality sign.'),
    S('solve-linear', 'Which is the correct way to write the answer to $3x - 2 \\lt 0$?', ['$x \\lt \\frac{2}{3}$', '$x = \\frac{2}{3}$', '$x \\gt \\frac{2}{3}$', '$\\frac{2}{3}$'], 0, '$3x \\lt 2$, so $x \\lt \\frac{2}{3}$. The answer must be an inequality, not an equation, and the sign stays since we divide by 3.')
  ] };

  // =====================================================================
  // FPM-IDN-02 Quadratic inequalities
  // =====================================================================
  function roots2() { var p = rint(-6, 5), q = p + rint(1, 8); return [p, q]; }
  B['FPM-IDN-02'] = { title: 'Quadratic inequalities', items: [
    { skill: 'region-choice', gen: G(function () {
      var pq = roots2(), p = pq[0], q = pq[1], op = pick(['lt', 'gt', 'le', 'ge']);
      var strict = (op === 'lt' || op === 'gt'), inside = (op === 'lt' || op === 'le');
      var o = quadOpts(p, q, inside, strict);
      var text = 'Solve $' + E([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]) + ' ' + OPS[op] + ' 0$.';
      var why = 'Factorise: $(x' + (p < 0 ? ' + ' + (-p) : ' - ' + p) + ')(x' + (q < 0 ? ' + ' + (-q) : ' - ' + q) + ')$, so the critical values are ' + p + ' and ' + q + '. The graph is a U shape, so it is ' + (inside ? 'below the axis between' : 'above the axis outside') + ' the roots: ' + o.c + '.';
      return MC(text, o.c, o.ds, why);
    }) },
    { skill: 'region-choice', gen: G(function () {
      var pq = roots2(), p = pq[0], q = pq[1], op = pick(['lt', 'gt']);
      var inside = op === 'lt', o = quadOpts(p, q, inside, true);
      var text = 'Find the set of values of $x$ for which $' + E([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]) + ' ' + OPS[op] + ' 0$.';
      var why = 'Critical values ' + p + ' and ' + q + ' from factorising. For a U-shaped graph, "' + (inside ? '$\\lt 0$' : '$\\gt 0$') + '" is the ' + (inside ? 'inside' : 'outside') + ' region: ' + o.c + '.';
      return MC(text, o.c, o.ds, why);
    }) },
    { skill: 'rearrange', gen: G(function () {
      var pq = roots2(), p = pq[0], q = pq[1], k = rint(1, 3), m = rint(-4, 4), n = rint(-6, 6), op = pick(['lt', 'gt', 'le', 'ge']);
      if (!m || !n) return null;
      var B1 = -k * (p + q) + m, C1 = k * p * q + n;
      var strict = (op === 'lt' || op === 'gt'), inside = (op === 'lt' || op === 'le');
      var o = quadOpts(p, q, inside, strict);
      var text = 'Solve $' + E([[k, 'x^2'], [B1, 'x'], [C1, '']]) + ' ' + OPS[op] + ' ' + E([[m, 'x'], [n, '']]) + '$.';
      var why = 'Subtract the right side: $' + E([[k, 'x^2'], [-k * (p + q), 'x'], [k * p * q, '']]) + ' ' + OPS[op] + ' 0$, i.e. $' + (k > 1 ? k : '') + '(x' + (p < 0 ? ' + ' + (-p) : ' - ' + p) + ')(x' + (q < 0 ? ' + ' + (-q) : ' - ' + q) + ') ' + OPS[op] + ' 0$. Roots ' + p + ' and ' + q + ', so ' + o.c + '.';
      return MC(text, o.c, o.ds, why);
    }) },
    { skill: 'curve-line', gen: G(function () {
      var pq = roots2(), p = pq[0], q = pq[1], k = rint(1, 3), m = rint(-4, 4), n = rint(-6, 6), above = Math.random() < 0.5;
      if (!m || !n) return null;
      var B1 = -k * (p + q) + m, C1 = k * p * q + n;
      var o = quadOpts(p, q, !above, true);
      var text = 'The curve $y = ' + E([[k, 'x^2'], [B1, 'x'], [C1, '']]) + '$ and the line $y = ' + E([[m, 'x'], [n, '']]) + '$ are drawn on the same axes. For which values of $x$ does the curve lie ' + (above ? 'above' : 'below') + ' the line?';
      var why = 'The curve is ' + (above ? 'above' : 'below') + ' the line when curve minus line is ' + (above ? 'positive' : 'negative') + ': $' + E([[k, 'x^2'], [-k * (p + q), 'x'], [k * p * q, '']]) + ' ' + (above ? '\\gt' : '\\lt') + ' 0$. The roots are ' + p + ' and ' + q + ', so ' + o.c + '.';
      return MC(text, o.c, o.ds, why);
    }) },
    { skill: 'integer-count', gen: G(function () {
      var p = rint(-6, 2), q = p + rint(3, 9), op = pick(['lt', 'le']);
      var cnt = op === 'lt' ? q - p - 1 : q - p + 1;
      var text = 'How many integers $x$ satisfy $' + E([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]) + ' ' + OPS[op] + ' 0$?';
      var why = 'The roots are ' + p + ' and ' + q + ' and the solution is the region between them: $' + p + ' ' + (op === 'lt' ? '\\lt' : '\\leqslant') + ' x ' + (op === 'lt' ? '\\lt' : '\\leqslant') + ' ' + q + '$. That contains ' + cnt + ' integers' + (op === 'le' ? ' (both end values count because the sign is $\\leqslant$)' : ' (the end values are not included)') + '.';
      return NM(text, cnt, why);
    }) },
    { skill: 'square-form', gen: G(function () {
      var n = rint(2, 9), op = pick(['lt', 'gt', 'le', 'ge']);
      var strict = (op === 'lt' || op === 'gt'), inside = (op === 'lt' || op === 'le');
      var o = quadOpts(-n, n, inside, strict, [inside ? '$x ' + (strict ? '\\lt' : '\\leqslant') + ' ' + n + '$' : '$x ' + (strict ? '\\gt' : '\\geqslant') + ' ' + n + '$']);
      var text = 'Solve $x^2 ' + OPS[op] + ' ' + (n * n) + '$.';
      var why = 'The critical values are $x = \\pm ' + n + '$. For a U-shaped graph, "$' + (inside ? 'x^2 \\lt' : 'x^2 \\gt') + '$ a number" is the ' + (inside ? 'inside' : 'outside') + ' region: ' + o.c + '. Writing only $x ' + OPS[op] + ' ' + n + '$ misses the negative side.';
      return MC(text, o.c, o.ds, why);
    }) },
    { skill: 'negative-x2', gen: G(function () {
      var pq = roots2(), p = pq[0], q = pq[1], op = pick(['gt', 'lt']);
      var inside = (op === 'gt'), o = quadOpts(p, q, inside, true);
      var text = 'Solve $' + E([[-1, 'x^2'], [p + q, 'x'], [-p * q, '']]) + ' ' + OPS[op] + ' 0$.';
      var why = 'Here the $x^2$ coefficient is negative, so the graph is an upside-down U (an n shape): it is above the axis between the roots ' + p + ' and ' + q + ' and below it outside. For "' + (op === 'gt' ? '$\\gt 0$' : '$\\lt 0$') + '" the answer is ' + o.c + '.';
      return MC(text, o.c, o.ds, why);
    }) },
    S('rearrange', 'Rearrange $4x^2 - 7x + 1 \\gt 6 - 2x^2$ into the form $ax^2 + bx + c \\gt 0$.', ['$6x^2 - 7x - 5 \\gt 0$', '$2x^2 - 7x - 5 \\gt 0$', '$6x^2 - 7x + 7 \\gt 0$', '$2x^2 - 7x + 7 \\gt 0$'], 0, 'Subtract the right side from both sides: $4x^2 + 2x^2 = 6x^2$, the $x$ term stays $-7x$, and $1 - 6 = -5$. So $6x^2 - 7x - 5 \\gt 0$.'),
    S('write-answer', 'A student solves $x^2 - x - 6 \\gt 0$ and writes $-2 \\lt x \\lt 3$. Which is the correct answer?', ['$x \\lt -2$ or $x \\gt 3$', '$-2 \\lt x \\lt 3$', '$x \\lt 3$ and $x \\gt -2$', '$x \\lt 2$ or $x \\gt -3$'], 0, '$x^2 - x - 6 = (x-3)(x+2)$, roots 3 and $-2$. "$\\gt 0$" on a U-shaped graph is the outside region: $x \\lt -2$ or $x \\gt 3$. The student chose the inside region.'),
    S('write-answer', 'A student writes the answer to a quadratic inequality as $3 \\lt x \\lt -\\frac{1}{2}$. What is wrong?', ['No number is both greater than 3 and less than $-\\frac{1}{2}$; two outside regions need two separate inequalities', 'Nothing is wrong, this is a correct way to show two regions', 'The signs should be $\\leqslant$', 'The fraction should be written as a decimal'], 0, 'A joined inequality $a \\lt x \\lt b$ means $x$ is between two values, and 3 is bigger than $-\\frac{1}{2}$ so nothing fits. Write $x \\lt -\\frac{1}{2}$ and $x \\gt 3$ separately.')
  ] };

  // =====================================================================
  // FPM-IDN-04 Rectangle and shape problems with inequalities
  // =====================================================================
  function rectSet() {
    var a = rint(1, 5), r = rint(1, 5), u = r + rint(2, 6);
    return { a: a, r: r, u: u, P: 4 * u + 2 * a, A: r * (r + a) };
  }
  B['FPM-IDN-04'] = { title: 'Rectangle and shape problems with inequalities', items: [
    { skill: 'perimeter-ineq', gen: G(function () {
      var s = rectSet();
      var text = 'A rectangle has width $x$ cm and length $(x + ' + s.a + ')$ cm. Its perimeter is less than ' + s.P + ' cm. The perimeter condition gives $x \\lt u$. Find $u$.';
      var why = 'Perimeter $= 2(x + x + ' + s.a + ') = ' + E([[4, 'x'], [2 * s.a, '']]) + '$. So $' + E([[4, 'x'], [2 * s.a, '']]) + ' \\lt ' + s.P + '$, giving $4x \\lt ' + (s.P - 2 * s.a) + '$ and $x \\lt ' + s.u + '$.';
      return NM(text, s.u, why);
    }) },
    { skill: 'area-ineq', gen: G(function () {
      var s = rectSet();
      var text = 'A rectangle has width $x$ cm and length $(x + ' + s.a + ')$ cm, where $x \\gt 0$. Its area is greater than ' + s.A + ' cm$^2$. This gives $x \\gt r$. Find $r$.';
      var why = 'Area $= x(x + ' + s.a + ') \\gt ' + s.A + '$, so $' + E([[1, 'x^2'], [s.a, 'x'], [-s.A, '']]) + ' \\gt 0$, i.e. $(x - ' + s.r + ')(x + ' + (s.r + s.a) + ') \\gt 0$. The outside region is $x \\lt -' + (s.r + s.a) + '$ or $x \\gt ' + s.r + '$; a width must be positive, so $x \\gt ' + s.r + '$.';
      return NM(text, s.r, why);
    }) },
    { skill: 'combine', gen: G(function () {
      var s = rectSet();
      var text = 'A rectangle has width $x$ cm and length $(x + ' + s.a + ')$ cm. Its perimeter is less than ' + s.P + ' cm and its area is greater than ' + s.A + ' cm$^2$. Find the set of possible values of $x$.';
      var why = 'Perimeter: $4x + ' + (2 * s.a) + ' \\lt ' + s.P + '$ gives $x \\lt ' + s.u + '$. Area: $(x - ' + s.r + ')(x + ' + (s.r + s.a) + ') \\gt 0$ gives $x \\gt ' + s.r + '$ once the negative region is rejected (a width is positive). The overlap is $' + s.r + ' \\lt x \\lt ' + s.u + '$.';
      return MC(text, '$' + s.r + ' \\lt x \\lt ' + s.u + '$', ['$x \\lt ' + s.u + '$', '$x \\gt ' + s.r + '$', '$-' + (s.r + s.a) + ' \\lt x \\lt ' + s.u + '$'], why);
    }) },
    { skill: 'combine', gen: G(function () {
      var s = rectSet(); if (s.u - s.r < 2) return null;
      var text = 'A rectangle has width $x$ cm and length $(x + ' + s.a + ')$ cm, where $x$ is a whole number. Its perimeter is less than ' + s.P + ' cm and its area is greater than ' + s.A + ' cm$^2$. How many values of $x$ are possible?';
      var why = 'Perimeter gives $x \\lt ' + s.u + '$ and area gives $x \\gt ' + s.r + '$ (rejecting the negative region), so $' + s.r + ' \\lt x \\lt ' + s.u + '$. The whole numbers strictly between are ' + (s.u - s.r - 1) + ' values.';
      return NM(text, s.u - s.r - 1, why);
    }) },
    { skill: 'form-expression', gen: G(function () {
      var m = rint(1, 3), n = rint(1, 3), a = rint(1, 6), b = rint(1, 6);
      var text = 'A rectangle has sides $' + E([[m, 'x'], [a, '']]) + '$ cm and $' + E([[n, 'x'], [b, '']]) + '$ cm. Which expression is its perimeter?';
      var correct = '$' + E([[2 * (m + n), 'x'], [2 * (a + b), '']]) + '$';
      var why = 'Perimeter $= 2(\\text{length} + \\text{width}) = 2(' + E([[m + n, 'x'], [a + b, '']]) + ') = ' + E([[2 * (m + n), 'x'], [2 * (a + b), '']]) + '$. Using length plus width only gives half of this.';
      return MC(text, correct, ['$' + E([[m + n, 'x'], [a + b, '']]) + '$', '$' + E([[2 * m + n, 'x'], [2 * a + b, '']]) + '$', '$' + E([[m * n, 'x^2'], [m * b + n * a, 'x'], [a * b, '']]) + '$'], why);
    }) },
    { skill: 'form-expression', gen: G(function () {
      var m = rint(2, 4), a = rint(1, 4), b = rint(1, 6);
      var text = 'A rectangle has width $(x + ' + a + ')$ cm and length $(' + E([[m, 'x'], [b, '']]) + ')$ cm. Which expression is its area in cm$^2$?';
      var correct = '$' + E([[m, 'x^2'], [b + a * m, 'x'], [a * b, '']]) + '$';
      var why = 'Area $= (x + ' + a + ')(' + E([[m, 'x'], [b, '']]) + ')$. Multiply every term: $' + E([[m, 'x^2'], [b, 'x'], [a * m, 'x'], [a * b, '']]) + '$ $= ' + E([[m, 'x^2'], [b + a * m, 'x'], [a * b, '']]) + '$.';
      return MC(text, correct, ['$' + E([[m, 'x^2'], [a * b, '']]) + '$', '$' + E([[m, 'x^2'], [b + a + m, 'x'], [a * b, '']]) + '$', '$' + E([[m + 1, 'x'], [a + b, '']]) + '$'], why);
    }) },
    { skill: 'shape-area', gen: G(function () {
      var a = rint(2, 5), b = rint(2, 5), x = rint(2, 8);
      var S1 = (a + b) * x + a * b;
      var text = 'A large rectangle measures $(x + ' + a + ')$ cm by $(x + ' + b + ')$ cm. A square of side $x$ cm is cut from one corner. The area left is ' + S1 + ' cm$^2$. Find $x$.';
      var why = 'Area left $= (x + ' + a + ')(x + ' + b + ') - x^2 = ' + E([[a + b, 'x'], [a * b, '']]) + '$. Setting this equal to ' + S1 + ' gives $' + (a + b) + 'x = ' + (S1 - a * b) + '$, so $x = ' + x + '$.';
      return NM(text, x, why);
    }) },
    { skill: 'perimeter-ineq', gen: G(function () {
      var a = rint(1, 6), b = rint(1, 6), x = rint(2, 9), P = 2 * (2 * x + a + b);
      var text = 'A rectangle has sides $(x + ' + a + ')$ cm and $(x + ' + b + ')$ cm and perimeter ' + P + ' cm. Find $x$.';
      var why = 'Perimeter $= 2(2x + ' + (a + b) + ') = ' + E([[4, 'x'], [2 * (a + b), '']]) + '$. Setting it equal to ' + P + ' gives $4x = ' + (P - 2 * (a + b)) + '$, so $x = ' + x + '$.';
      return NM(text, x, why);
    }) },
    S('combine', 'The area condition for a rectangle of width $w$ gives $w \\lt -4$ or $w \\gt 1$. Which part must be rejected, and why?', ['$w \\lt -4$, because a width cannot be negative', '$w \\gt 1$, because it is a strict inequality', 'Neither; both regions are possible widths', '$w \\gt 1$, because it is larger than the perimeter limit'], 0, 'A length must be positive, so the region $w \\lt -4$ is thrown away and only $w \\gt 1$ remains to combine with the perimeter condition.'),
    S('perimeter-ineq', 'A rectangle\'s area is "greater than 8" and its perimeter is "less than 30". Which pair of signs do these translate to?', ['Area $\\gt 8$ and perimeter $\\lt 30$', 'Area $\\lt 8$ and perimeter $\\gt 30$', 'Area $\\gt 8$ and perimeter $\\gt 30$', 'Area $\\leqslant 8$ and perimeter $\\geqslant 30$'], 0, '"Greater than" is $\\gt$ and "less than" is $\\lt$. Each sentence becomes exactly one inequality.')
  ] };

  // =====================================================================
  // FPM-IDN-05 Drawing the lines for an inequality graph
  // =====================================================================
  function line3() { return { a: rint(1, 6), b: rint(2, 6) }; }
  B['FPM-IDN-05'] = { title: 'Drawing the lines for an inequality graph', items: [
    { skill: 'intercepts', gen: G(function () {
      var a = rint(1, 6), b = rint(2, 6), y0 = rint(1, 7) * sgn(), c = b * y0;
      var text = 'The line $' + E([[a, 'x'], [b, 'y']]) + ' = ' + c + '$ is to be drawn. At what value of $y$ does it cross the $y$-axis?';
      var why = 'On the $y$-axis $x = 0$, so $' + b + 'y = ' + c + '$ and $y = ' + y0 + '$.';
      return NM(text, y0, why);
    }) },
    { skill: 'intercepts', gen: G(function () {
      var a = rint(2, 6), b = rint(1, 6), x0 = rint(1, 7) * sgn(), c = a * x0;
      var text = 'The line $' + E([[a, 'x'], [b, 'y']]) + ' = ' + c + '$ is to be drawn. At what value of $x$ does it cross the $x$-axis?';
      var why = 'On the $x$-axis $y = 0$, so $' + a + 'x = ' + c + '$ and $x = ' + x0 + '$.';
      return NM(text, x0, why);
    }) },
    { skill: 'trap-sign', gen: G(function () {
      var a = pick([2, 3, 4, 5]), t = rint(1, 5), c = sgn() * a * t, m = rint(1, 6);
      var text = 'The line $' + a + 'y = ' + E([[m, 'x'], [c, '']]) + '$ is drawn. At what value of $y$ does it cross the $y$-axis?';
      var why = 'Put $x = 0$: $' + a + 'y = ' + c + '$, so $y = ' + (c / a) + '$. Watch the sign of the constant, it is not always positive.';
      return NM(text, c / a, why);
    }) },
    { skill: 'equation', gen: G(function () {
      var p = rint(-8, 8), q = rint(-8, 8);
      if (!p || !q || p === q || gcd(p, q) !== 1) return null;
      var text = 'A straight line crosses the $x$-axis at $(' + p + ', 0)$ and the $y$-axis at $(0, ' + q + ')$. Which is its equation?';
      var correct = '$' + E([[q, 'x'], [p, 'y']]) + ' = ' + (p * q) + '$';
      var why = 'Check both points: at $(' + p + ', 0)$ the left side is ' + (q * p) + ' and at $(0, ' + q + ')$ it is ' + (p * q) + ', both equal to the right side ' + (p * q) + '. The other equations fail one of the points.';
      return MC(text, correct, ['$' + E([[p, 'x'], [q, 'y']]) + ' = ' + (p * q) + '$', '$' + E([[q, 'x'], [-p, 'y']]) + ' = ' + (p * q) + '$', '$' + E([[q, 'x'], [p, 'y']]) + ' = ' + (p + q) + '$'], why);
    }) },
    { skill: 'plot-points', gen: G(function () {
      var m = pick([1, 2, 3, 4]) * sgn(), t = rint(1, 5) * sgn(), c = m * t;
      var text = 'To draw $y = ' + E([[m, 'x'], [c, '']]) + '$ on a grid, which two points could you plot?';
      var P = function (x, y) { return '$(' + x + ', ' + y + ')$ and $(' + x2 + ', ' + y2 + ')$'; };
      var x2 = -t, y2 = 0;
      var correct = '$(0, ' + c + ')$ and $(' + (-t) + ', 0)$';
      var why = 'Put $x = 0$ to get $y = ' + c + '$, and $y = 0$ to get $' + E([[m, 'x']]) + ' = ' + (-c) + '$, so $x = ' + (-t) + '$. The points are $(0, ' + c + ')$ and $(' + (-t) + ', 0)$.';
      return MC(text, correct, ['$(0, ' + c + ')$ and $(' + t + ', 0)$', '$(0, ' + m + ')$ and $(' + (-c) + ', 0)$', '$(0, ' + (-c) + ')$ and $(' + (-t) + ', 0)$'], why);
    }) },
    { skill: 'plot-points', gen: G(function () {
      var k = rint(2, 6) * sgn(), t = rint(2, 4);
      var text = 'The line $y = ' + E([[k, 'x']]) + '$ passes through the origin. A second point is needed to draw it. What is $y$ when $x = ' + t + '$?';
      var why = 'Substitute $x = ' + t + '$: $y = ' + k + ' \\times ' + t + ' = ' + (k * t) + '$. So $(' + t + ', ' + (k * t) + ')$ and the origin give the line.';
      return NM(text, k * t, why);
    }) },
    { skill: 'special-lines', gen: G(function () {
      var vert = Math.random() < 0.5, k = rint(2, 7) * sgn();
      var text = 'Which description matches the line $' + (vert ? 'x' : 'y') + ' = ' + k + '$?';
      var correct = vert ? 'A vertical line through $(' + k + ', 0)$' : 'A horizontal line through $(0, ' + k + ')$';
      var ds = vert ? ['A horizontal line through $(0, ' + k + ')$', 'A vertical line through $(0, ' + k + ')$', 'A line through the origin with gradient ' + k]
        : ['A vertical line through $(' + k + ', 0)$', 'A horizontal line through $(' + k + ', 0)$', 'A line through the origin with gradient ' + k];
      var why = vert ? '$x = ' + k + '$ means every point has $x$-coordinate ' + k + ', so it is a vertical line crossing the $x$-axis at ' + k + '.' : '$y = ' + k + '$ means every point has $y$-coordinate ' + k + ', so it is a horizontal line crossing the $y$-axis at ' + k + '.';
      return MC(text, correct, ds, why);
    }) },
    { skill: 'points-on-line', gen: G(function () {
      var a = rint(2, 5), b = rint(2, 5), x0 = rint(1, 5), y0 = rint(1, 5), c = a * x0 + b * y0;
      var pts = [[x0, y0], [y0, x0], [x0, -y0], [-x0, y0]];
      var onLine = function (pt) { return a * pt[0] + b * pt[1] === c; };
      var good = pts.filter(onLine);
      if (good.length !== 1) return null;
      var text = 'Which of these points lies on the line $' + E([[a, 'x'], [b, 'y']]) + ' = ' + c + '$?';
      var f = function (pt) { return '$(' + pt[0] + ', ' + pt[1] + ')$'; };
      var why = 'Substitute: $' + a + '(' + x0 + ') + ' + b + '(' + y0 + ') = ' + c + '$, which is correct. The other points give a different total.';
      return MC(text, f(pts[0]), [f(pts[1]), f(pts[2]), f(pts[3])], why);
    }) },
    S('plot-points', 'The line $y = 2x$ and the line $y = x + 2$ are both to be drawn. Which statement is correct?', ['$y = 2x$ passes through the origin; $y = x + 2$ crosses the $y$-axis at $(0, 2)$', 'Both lines cross the $y$-axis at $(0, 2)$', '$y = x + 2$ passes through the origin', 'Both lines pass through the origin'], 0, 'In $y = mx + c$ the constant $c$ is the $y$-intercept. $y = 2x$ has $c = 0$, so it passes through the origin. $y = x + 2$ has $c = 2$.'),
    S('plot-points', 'A line is drawn only as a short piece between its two axis crossings. Why is this a problem?', ['The full line is needed later to find the corners of the region', 'It is too accurate', 'Lines must always be freehand', 'It makes the gradient negative'], 0, 'Later parts need the corners where lines meet, and those corners can lie outside the short piece. Rule the line across the whole grid.'),
    S('special-lines', 'For the line $x + y = 0$ both axis crossings are the origin. What should you do?', ['Find a second point, for example $(2, -2)$', 'Plot the origin twice', 'Skip the line', 'Draw it horizontal'], 0, 'You need two different points to fix a line. Choose any $x$, for example $x = 2$ gives $y = -2$, so $(2, -2)$ is on the line.')
  ] };

  // =====================================================================
  // FPM-IDN-06 Shading or describing a region
  // =====================================================================
  B['FPM-IDN-06'] = { title: 'Shading or describing a region', items: [
    { skill: 'test-point', gen: G(function () {
      var a = rint(1, 5), b = rint(1, 5), c = rint(2, 12) * sgn(), op = pick(['le', 'ge']);
      var originOK = op === 'le' ? 0 <= c : 0 >= c;
      var text = 'To shade the region $' + E([[a, 'x'], [b, 'y']]) + ' ' + OPS[op] + ' ' + c + '$, you test the origin $(0, 0)$. Which conclusion is correct?';
      var yes = 'The origin makes it true ($0 ' + OPS[op] + ' ' + c + '$), so shade the side containing the origin';
      var no = 'The origin makes it false ($0 ' + OPS[op] + ' ' + c + '$ is not true), so shade the side not containing the origin';
      var why = 'Substituting $(0, 0)$ gives $0 ' + OPS[op] + ' ' + c + '$, which is ' + (originOK ? 'true' : 'false') + '. So the wanted region is the side ' + (originOK ? 'with' : 'without') + ' the origin.';
      var o = MC(text, originOK ? yes : no, [originOK ? no : yes, 'The origin lies on the line, so it cannot be used', 'Shade both sides of the line'], why);
      return o;
    }) },
    { skill: 'sign-from-side', gen: G(function () {
      var p = rint(1, 6), q = rint(1, 6), r = rint(2, 12), op = pick(['lt', 'gt', 'le', 'ge']);
      var above = (op === 'le' || op === 'lt'), solid = (op === 'le' || op === 'ge');
      var text = 'The inequality is $' + E([[p, 'x'], [-q, 'y']]) + ' ' + OPS[op] + ' ' + r + '$. Where is the region, relative to the line $' + E([[p, 'x'], [-q, 'y']]) + ' = ' + r + '$?';
      var D = function (ab, so) { return (ab ? 'Above' : 'Below') + ' the line, ' + (so ? 'boundary included' : 'boundary not included'); };
      var why = 'The origin gives $0 ' + OPS[op] + ' ' + r + '$, which is ' + ((op === 'le' || op === 'lt') ? 'true' : 'false') + ', and the origin is above this line (the line crosses the $y$-axis at $y = -' + fr(r, q) + '$, below the origin). So the region is ' + (above ? 'above' : 'below') + ' the line. ' + (solid ? 'The sign includes equality, so the line is solid.' : 'The sign is strict, so the line is dashed.');
      return MC(text, D(above, solid), [D(!above, solid), D(above, !solid), D(!above, !solid)], why);
    }) },
    { skill: 'describe-region', gen: G(function () {
      var m = rint(1, 4) * sgn(), c = rint(-6, 6), below = Math.random() < 0.5, inc = Math.random() < 0.5;
      var op = below ? (inc ? 'le' : 'lt') : (inc ? 'ge' : 'gt');
      var text = 'The region lies ' + (below ? 'below' : 'above') + ' the line $y = ' + E([[m, 'x'], [c, '']]) + '$, and points on the line ' + (inc ? 'are' : 'are not') + ' included. Which inequality describes the region?';
      var why = (below ? 'Below' : 'Above') + ' the line means $y$ is ' + (below ? 'less' : 'greater') + ' than the line\'s value; ' + (inc ? 'including the line means the sign has the bar underneath ($\\leqslant$ or $\\geqslant$).' : 'excluding the line means a strict sign with no bar underneath.') + ' So $y ' + OPS[op] + ' ' + E([[m, 'x'], [c, '']]) + '$.';
      var mk = function (o) { return '$y ' + OPS[o] + ' ' + E([[m, 'x'], [c, '']]) + '$'; };
      var ords = ['lt', 'gt', 'le', 'ge'].filter(function (o) { return o !== op; });
      return MC(text, mk(op), ords.map(mk), why);
    }) },
    { skill: 'lattice-in-R', gen: G(function () {
      var a = rint(0, 2), b = rint(0, 2), n = rint(5, 9);
      if (a + b >= n - 1) return null;
      var cnt = 0, x, y;
      for (x = a; x <= n; x++) for (y = b; y <= n; y++) if (x + y <= n) cnt++;
      var text = 'The region $R$ is defined by $x \\geqslant ' + a + '$, $y \\geqslant ' + b + '$ and $x + y \\leqslant ' + n + '$. How many points with whole-number coordinates lie in $R$ (including the boundary)?';
      var why = 'For each $x$ from ' + a + ' up to ' + (n - b) + ', the values of $y$ run from ' + b + ' to ' + n + ' minus $x$. Adding these up gives ' + cnt + ' points.';
      return NM(text, cnt, why);
    }) },
    { skill: 'lattice-in-R', gen: G(function () {
      var a = rint(2, 4), b = rint(2, 4), c = a * b * rint(2, 3);
      var cnt = 0, x, y;
      for (x = 0; x <= 40; x++) for (y = 0; y <= 40; y++) if (a * x + b * y <= c) cnt++;
      var text = 'The region $R$ is defined by $x \\geqslant 0$, $y \\geqslant 0$ and $' + E([[a, 'x'], [b, 'y']]) + ' \\leqslant ' + c + '$. How many points with whole-number coordinates lie in $R$, including the boundary?';
      var why = 'List by $x$ value: for each whole $x$ from 0 to ' + Math.floor(c / a) + ' count the whole $y$ with $0 \\leqslant y \\leqslant (' + c + ' - ' + a + 'x)/' + b + '$. The total is ' + cnt + '.';
      return NM(text, cnt, why);
    }) },
    { skill: 'describe-region', gen: G(function () {
      var p = rint(2, 8), q = rint(2, 8);
      if (p === q || gcd(p, q) !== 1) return null;
      var text = 'The shaded triangle has vertices $(0, 0)$, $(' + p + ', 0)$ and $(0, ' + q + ')$, and includes its edges. Which set of inequalities defines it?';
      var line = E([[q, 'x'], [p, 'y']]);
      var correct = '$x \\geqslant 0$, $y \\geqslant 0$, $' + line + ' \\leqslant ' + (p * q) + '$';
      var why = 'The sides on the axes give $x \\geqslant 0$ and $y \\geqslant 0$. The slanted edge through $(' + p + ', 0)$ and $(0, ' + q + ')$ is $' + line + ' = ' + (p * q) + '$; the origin is inside and gives $0 \\leqslant ' + (p * q) + '$, so the sign is $\\leqslant$.';
      return MC(text, correct, ['$x \\geqslant 0$, $y \\geqslant 0$, $' + line + ' \\geqslant ' + (p * q) + '$', '$x \\geqslant 0$, $y \\geqslant 0$, $' + E([[p, 'x'], [q, 'y']]) + ' \\leqslant ' + (p * q) + '$', '$x \\leqslant 0$, $y \\leqslant 0$, $' + line + ' \\leqslant ' + (p * q) + '$'], why);
    }) },
    { skill: 'test-point', gen: G(function () {
      var a = rint(1, 3), n = rint(6, 10);
      var inP = [a + rint(0, 1), rint(0, 2)];
      if (inP[0] + inP[1] > n) return null;
      var text = 'The region $R$ is defined by $x \\geqslant ' + a + '$, $y \\geqslant 0$ and $x + y \\leqslant ' + n + '$. Which point lies in $R$?';
      var f = function (p) { return '$(' + p[0] + ', ' + p[1] + ')$'; };
      var bad1 = [a - 1, 1], bad2 = [a + 1, -1], bad3 = [n, 2];
      var why = f(inP) + ' has $x \\geqslant ' + a + '$, $y \\geqslant 0$ and $x + y = ' + (inP[0] + inP[1]) + ' \\leqslant ' + n + '$, so it satisfies all three. ' + f(bad1) + ' breaks $x \\geqslant ' + a + '$, ' + f(bad2) + ' breaks $y \\geqslant 0$, and ' + f(bad3) + ' breaks $x + y \\leqslant ' + n + '$.';
      return MC(text, f(inP), [f(bad1), f(bad2), f(bad3)], why);
    }) },
    S('boundary-type', 'The inequality is $y \\lt 2x + 1$. How is the boundary line $y = 2x + 1$ drawn?', ['Dashed, because points on the line do not satisfy a strict inequality', 'Solid, because the line is the boundary', 'Not drawn at all', 'Solid, because 2 is positive'], 0, 'Strict signs $\\lt$ and $\\gt$ exclude the boundary, so the line is dashed. Only $\\leqslant$ and $\\geqslant$ give a solid line.'),
    S('test-point', 'To decide which side of $y \\geqslant 2x$ to shade, why is the origin a poor test point?', ['It lies on the line $y = 2x$, so it tells you nothing about which side', 'The origin is never inside a region', 'The origin always makes the inequality false', 'Only integer points can be test points'], 0, 'The origin satisfies $0 = 2(0)$, so it is on the boundary. Choose a point off the line such as $(0, 1)$: $1 \\geqslant 0$ is true, so shade above the line.'),
    S('describe-region', 'Region $R$ is the part of the grid where all the inequalities are true together. How should $R$ be shown?', ['Shade (or leave unshaded, as the question says) the overlap of all the wanted sides, and label it $R$', 'Shade the union of all the wanted sides', 'Shade only the side of the last line drawn', 'Draw the lines only and label nothing'], 0, 'Every inequality must hold, so $R$ is the overlap of the wanted sides. The examiner must see which region is $R$, so label it.')
  ] };

  // =====================================================================
  // FPM-IDN-07 Greatest or least value in a region
  // =====================================================================
  function cornerGen(mode) {
    return G(function () {
      var s = rint(6, 12), u = rint(2, s - 2), a = rint(-4, 5), b = rint(-4, 5);
      if (!a || !b || (a < 0 && b < 0)) return null;
      var V = [[0, 0], [u, 0], [u, s - u], [0, s]];
      var vals = V.map(function (v) { return a * v[0] + b * v[1]; });
      var best = mode === 'max' ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
      var P = E([[a, 'x'], [b, 'y']]);
      var text = 'The region $R$ is the quadrilateral with vertices $(0, 0)$, $(' + u + ', 0)$, $(' + u + ', ' + (s - u) + ')$ and $(0, ' + s + ')$. For points in $R$, $P = ' + P + '$. Find the ' + (mode === 'max' ? 'greatest' : 'least') + ' value of $P$.';
      var why = 'A linear expression is greatest/least at a vertex. The values of $P$ at the four vertices are ' + vals.join(', ') + ' in order. The ' + (mode === 'max' ? 'greatest' : 'least') + ' is ' + best + '.';
      return NM(text, best, why);
    });
  }
  B['FPM-IDN-07'] = { title: 'Greatest or least value in a region', items: [
    { skill: 'corner-value', gen: cornerGen('max') },
    { skill: 'corner-value', gen: cornerGen('min') },
    { skill: 'find-corner', gen: G(function () {
      var x = rint(1, 8), y = rint(1, 8), a = rint(-3, 5), b = rint(-3, 5);
      if (!a || !b || x === y) return null;
      var text = 'Two boundary lines of $R$, $x + y = ' + (x + y) + '$ and $x - y = ' + (x - y) + '$, meet at a corner. Find the value of $P = ' + E([[a, 'x'], [b, 'y']]) + '$ at that corner.';
      var why = 'Add the equations: $2x = ' + (2 * x) + '$, so $x = ' + x + '$ and then $y = ' + y + '$. At $(' + x + ', ' + y + ')$, $P = ' + (a * x + b * y) + '$.';
      return NM(text, a * x + b * y, why);
    }) },
    { skill: 'find-corner', gen: G(function () {
      var p = rint(1, 4), q = rint(1, 4), x = rint(1, 8), k = rint(1, 6), a = rint(1, 5), b = rint(-3, 5);
      if (!b) return null;
      var c = p * x + q * k;
      var text = 'The boundary lines $' + E([[p, 'x'], [q, 'y']]) + ' = ' + c + '$ and $y = ' + k + '$ meet at a corner of $R$. Find the value of $P = ' + E([[a, 'x'], [b, 'y']]) + '$ at that corner.';
      var why = 'Put $y = ' + k + '$ into the first line: $' + E([[p, 'x']]) + ' = ' + (c - q * k) + '$, so $x = ' + x + '$. At $(' + x + ', ' + k + ')$, $P = ' + (a * x + b * k) + '$.';
      return NM(text, a * x + b * k, why);
    }) },
    { skill: 'integer-trap', gen: G(function () {
      var a = rint(2, 5), b = rint(2, 5), c = rint(11, 22), p = rint(1, 5), q = rint(1, 5);
      if (p === q) return null;
      var best = -1, x, y;
      for (x = 0; x <= c; x++) for (y = 0; y <= c; y++) if (a * x + b * y <= c) best = Math.max(best, p * x + q * y);
      var cornerBest = Math.max(p * c / a, q * c / b);
      if (Math.abs(cornerBest - best) < 0.3) return null;
      var text = 'The region $R$ is defined by $x \\geqslant 0$, $y \\geqslant 0$ and $' + E([[a, 'x'], [b, 'y']]) + ' \\leqslant ' + c + '$. $x$ and $y$ must both be integers. Find the greatest value of $P = ' + E([[p, 'x'], [q, 'y']]) + '$.';
      var why = 'The best vertex of the region would give $P \\approx ' + R.roundDp(cornerBest, 2) + '$, but its coordinates are not both whole numbers. Testing the whole-number points near that corner, the best allowed value is ' + best + '.';
      return NM(text, best, why);
    }) },
    { skill: 'which-corner', gen: G(function () {
      var s = rint(6, 12), u = rint(2, s - 2), a = rint(1, 5), b = rint(1, 5);
      if (a === b) return null;
      var V = [[0, 0], [u, 0], [u, s - u], [0, s]];
      var vals = V.map(function (v) { return a * v[0] + b * v[1]; });
      var mx = Math.max.apply(null, vals), idx = vals.indexOf(mx);
      if (vals.filter(function (v) { return v === mx; }).length > 1) return null;
      var f = function (v) { return '$(' + v[0] + ', ' + v[1] + ')$'; };
      var text = 'The region $R$ has vertices ' + V.map(f).join(', ') + '. At which vertex is $P = ' + E([[a, 'x'], [b, 'y']]) + '$ greatest?';
      var why = 'Values of $P$ at the vertices: ' + V.map(function (v, i) { return f(v) + ' gives ' + vals[i]; }).join('; ') + '. The greatest, ' + mx + ', is at ' + f(V[idx]) + '.';
      var others = V.filter(function (v, i) { return i !== idx; }).map(f);
      return MC(text, f(V[idx]), others, why);
    }) },
    { skill: 'corner-value', gen: G(function () {
      var a = rint(2, 8), b = rint(2, 8), p = rint(-3, 5), q = rint(-3, 5);
      if (!p || !q || a === b) return null;
      var V = [[0, 0], [a, 0], [0, b]];
      var vals = V.map(function (v) { return p * v[0] + q * v[1]; });
      var mx = Math.max.apply(null, vals);
      var text = 'The region $R$ is the triangle with vertices $(0, 0)$, $(' + a + ', 0)$ and $(0, ' + b + ')$. For points in $R$, $P = ' + E([[p, 'x'], [q, 'y']]) + '$. Find the greatest value of $P$.';
      var why = 'Check the vertices: $P$ is ' + vals[0] + ' at the origin, ' + vals[1] + ' at $(' + a + ', 0)$ and ' + vals[2] + ' at $(0, ' + b + ')$. The greatest is ' + mx + '.';
      return NM(text, mx, why);
    }) },
    S('concept', 'Where does the greatest value of a linear expression like $P = 2x + y$ occur over a region bounded by straight lines?', ['At a corner (vertex) of the region', 'At the middle of the region', 'Anywhere on the longest side only', 'At the point nearest the origin'], 0, 'A linear expression changes steadily, so its greatest and least values over a region bounded by straight lines are always at corners. Compare $P$ at each corner.'),
    S('concept', 'In a question asking for the greatest value of $P$, a student gives the coordinates of the best corner. What is missing?', ['The value of $P$ at that corner, because the question asks for $P$', 'Nothing, the coordinates are the answer', 'The gradient of the line', 'The area of the region'], 0, 'The accuracy mark is for the value of $P$, not the position. Substitute the corner coordinates into $P$ and state that number.'),
    S('integer-trap', 'A question says "$x$ and $y$ are integers". How does this change the method?', ['Test the whole-number points inside $R$ near the best corner, not the corner itself if it is fractional', 'Ignore it, corners are always integers', 'Round the corner coordinates to the nearest whole number and use them', 'The region becomes a single point'], 0, 'A fractional corner is not an allowed point. List the integer points in $R$ close to it and compare $P$ at each; rounding the corner blindly may leave $R$.')
  ] };

  // =====================================================================
  // FPM-IDN-08 Factor theorem: show a factor or find a constant
  // =====================================================================
  function cubicFromFactor(s, r, al, be, ga) {
    // (sx - r)(al x^2 + be x + ga)
    return polyMul([s, -r], [al, be, ga]);
  }
  function findConst(idx, letter, withRem) {
    return G(function () {
      var s = withRem ? 1 : pick([1, 1, 2, 3]), r = rint(1, 4) * sgn(), al = rint(1, 2), be = rint(-4, 4), ga = rint(-4, 4);
      if (s === 1 && !withRem) { /* factor (x - r) */ }
      if (!be || !ga) return null;
      if (s > 1 && gcd(s, r) !== 1) return null;
      var cs = cubicFromFactor(s, r, al, be, ga);
      var ans = cs[idx]; if (!ans) return null;
      var f = 'f(x) = ' + polyText(cs, idx, 'p');
      var why, text, rem = 0;
      if (withRem) {
        // remainder when divided by (x - r) is f(r) with p unknown: change masked coefficient so remainder is nonzero
        var delta = rint(1, 6) * sgn();
        rem = delta * Math.pow(r, 3 - idx);
        cs = cs.slice(); cs[idx] += delta; ans = cs[idx];
        if (!ans) return null;
        f = 'f(x) = ' + polyText(cs, idx, 'p');
        text = 'When $' + f + '$ is divided by $(x ' + (r < 0 ? '+ ' + (-r) : '- ' + r) + ')$ the remainder is ' + rem + '. Find the value of $p$.';
        var fr1 = cs.map(function (c, i) { return i === idx ? 'p' : c; });
        why = 'The remainder is $f(' + r + ') = ' + rem + '$. Substituting gives an equation in $p$ with $p$ multiplied by $' + Math.pow(r, 3 - idx) + '$; solving it gives $p = ' + ans + '$.';
      } else {
        text = 'Given that $(' + linFactor(s, r) + ')$ is a factor of $' + f + '$, find the value of $p$.';
        why = 'Put ' + (s === 1 ? '$x = ' + r + '$' : '$x = ' + fr(r, s) + '$') + ' (the value that makes the factor zero) into $f(x)$ and set it equal to 0. Solving the resulting equation gives $p = ' + ans + '$.';
      }
      return NM(text, ans, why);
    });
  }
  B['FPM-IDN-08'] = { title: 'Factor theorem: show a factor or find a constant', items: [
    { skill: 'find-constant', gen: findConst(1, 'p', false) },
    { skill: 'find-constant', gen: findConst(2, 'p', false) },
    { skill: 'find-constant', gen: findConst(3, 'p', false) },
    { skill: 'remainder', gen: findConst(1, 'p', true) },
    { skill: 'remainder', gen: G(function () {
      var a = rint(1, 4) * sgn(), c3 = rint(1, 3), c2 = rint(-5, 5), c1 = rint(-6, 6), c0 = rint(-8, 8);
      if (!c2 || !c1 || !c0) return null;
      var cs = [c3, c2, c1, c0], val = c3 * a * a * a + c2 * a * a + c1 * a + c0;
      var text = 'Find the remainder when $' + polyText(cs) + '$ is divided by $(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')$.';
      var why = 'By the remainder theorem the remainder is $f(' + a + ')$ $= ' + c3 + '(' + a + ')^3 + (' + c2 + ')(' + a + ')^2 + (' + c1 + ')(' + a + ') + (' + c0 + ') = ' + val + '$.';
      return NM(text, val, why);
    }) },
    { skill: 'sub-value', gen: G(function () {
      var s = pick([2, 3, 4, 5]), r = rint(1, 7);
      if (gcd(s, r) !== 1 || r === s) return null;
      var text = 'To use the factor theorem with $(' + linFactor(s, r) + ')$, which value of $x$ do you substitute into $f(x)$?';
      var why = 'Set the factor to zero: $' + linFactor(s, r) + ' = 0$ gives $x = ' + fr(r, s) + '$. This is the value to substitute, and $f(' + fr(r, s) + ')$ must be 0 for it to be a factor.';
      return MC(text, '$x = ' + fr(r, s) + '$', ['$x = ' + fr(-r, s) + '$', '$x = ' + fr(s, r) + '$', '$x = ' + fr(-s, r) + '$'], why);
    }) },
    { skill: 'evaluate', gen: G(function () {
      var a = rint(1, 4), c3 = rint(1, 3), c2 = rint(-5, 5), c1 = rint(-6, 6), c0 = rint(-8, 8);
      if (!c2 || !c1) return null;
      var val = c3 * -a * a * a + c2 * a * a + c1 * -a + c0;
      var cs = [c3, c2, c1, c0];
      var text = 'Given $f(x) = ' + polyText(cs) + '$, find $f(-' + a + ')$.';
      var why = '$f(-' + a + ') = ' + c3 + '(-' + a + ')^3 + (' + c2 + ')(-' + a + ')^2 + (' + c1 + ')(-' + a + ') + (' + c0 + ')$. Remember $(-' + a + ')^3 = -' + (a * a * a) + '$ but $(-' + a + ')^2 = ' + (a * a) + '$. The total is ' + val + '.';
      return NM(text, val, why);
    }) },
    { skill: 'trap-sign', gen: G(function () {
      var a = rint(1, 5), c3 = rint(1, 2), c2 = rint(-4, 4), c1 = rint(-5, 5);
      if (!c2 || !c1) return null;
      var c0 = -(c3 * -a * a * a + c2 * a * a + c1 * -a);
      var off = Math.random() < 0.5 ? 0 : rint(1, 6) * sgn();
      c0 += off;
      var cs = [c3, c2, c1, c0];
      var terms = [c3 * -a * a * a, c2 * a * a, c1 * -a, c0];
      var text = 'To test whether $(x + ' + a + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, work out the value of $f(x)$ at the correct value of $x$. What do you get?';
      var why = 'For the factor $(x + ' + a + ')$ substitute $x = -' + a + '$, not $' + a + '$. Then $f(-' + a + ') = ' + E([[terms[0], ''], [terms[1], ''], [terms[2], ''], [terms[3], '']]) + ' = ' + off + '$' + (off === 0 ? ', so $(x + ' + a + ')$ is a factor.' : ', which is not 0, so $(x + ' + a + ')$ is not a factor.');
      return NM(text, off, why);
    }) },
    S('conclusion', 'In a "show that $(x - 2)$ is a factor" question, you have found $f(2) = 0$. What is the complete final line?', ['$f(2) = 0$, so $(x - 2)$ is a factor', '$f(2) = 0$', '$x = 2$', 'So $f(-2) = 0$'], 0, 'A "show that" answer needs a conclusion. State the result and what it means: $f(2) = 0$, so by the factor theorem $(x - 2)$ is a factor.'),
    S('trap-sign', 'A student tests whether $(x + 3)$ is a factor of $f(x)$ by working out $f(3)$. What is wrong?', ['They should calculate $f(-3)$, since $x + 3 = 0$ gives $x = -3$', 'Nothing, $f(3)$ is correct', 'They should calculate $f(0)$', 'They should calculate $f(\\frac{1}{3})$'], 0, 'The factor theorem uses the value that makes the factor zero. $x + 3 = 0$ gives $x = -3$, so test $f(-3)$.'),
    S('remainder', 'When $f(x)$ is divided by $(3x - 2)$, what is the remainder?', ['$f\\left(\\frac{2}{3}\\right)$', '$f\\left(-\\frac{2}{3}\\right)$', '$f(2)$', '$f\\left(\\frac{3}{2}\\right)$'], 0, 'Set $3x - 2 = 0$ to get $x = \\frac{2}{3}$. The remainder is $f\\left(\\frac{2}{3}\\right)$.')
  ] };

  // =====================================================================
  // FPM-IDN-09 Two constants from factor and remainder information
  // =====================================================================
  function twoConst() {
    var al = rint(1, 3) * sgn(), be = rint(1, 3) * sgn(), p = rint(-4, 5), q = rint(-5, 5);
    var c0 = -(al * al * al + p * al * al + q * al);
    var f = function (x) { return x * x * x + p * x * x + q * x + c0; };
    if (al === be || !p || !q || !c0 || Math.abs(c0) > 30 || f(be) === 0) return null;
    return { al: al, be: be, p: p, q: q, c0: c0, R: f(be) };
  }
  function eqS(A, Bq, C) { return E([[A, 'p'], [Bq, 'q']]) + ' = ' + C; }
  function fText(c0) { return 'f(x) = x^3 + px^2 + qx ' + (c0 < 0 ? '- ' + (-c0) : '+ ' + c0); }
  function dvs(a) { return a === 0 ? 'x' : '(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')'; }
  B['FPM-IDN-09'] = { title: 'Two constants from factor and remainder information', items: [
    { skill: 'solve-simult', gen: G(function () {
      var t = twoConst(); if (!t) return null;
      var text = 'Given that $' + dvs(t.al) + '$ is a factor of $' + fText(t.c0) + '$ and that the remainder when $f(x)$ is divided by $' + dvs(t.be) + '$ is ' + t.R + ', find the value of $p$.';
      var why = 'Factor: $f(' + t.al + ') = 0$ gives $' + eqS(t.al * t.al, t.al, -t.al * t.al * t.al - t.c0) + '$. Remainder: $f(' + t.be + ') = ' + t.R + '$ gives $' + eqS(t.be * t.be, t.be, t.R - t.be * t.be * t.be - t.c0) + '$. Solving simultaneously gives $p = ' + t.p + '$ and $q = ' + t.q + '$.';
      return NM(text, t.p, why);
    }) },
    { skill: 'solve-simult', gen: G(function () {
      var t = twoConst(); if (!t) return null;
      var text = 'Given that $' + dvs(t.al) + '$ is a factor of $' + fText(t.c0) + '$ and that the remainder when $f(x)$ is divided by $' + dvs(t.be) + '$ is ' + t.R + ', find the value of $q$.';
      var why = 'Factor: $f(' + t.al + ') = 0$ gives $' + eqS(t.al * t.al, t.al, -t.al * t.al * t.al - t.c0) + '$. Remainder: $f(' + t.be + ') = ' + t.R + '$ gives $' + eqS(t.be * t.be, t.be, t.R - t.be * t.be * t.be - t.c0) + '$. Eliminating $p$ gives $q = ' + t.q + '$ (and $p = ' + t.p + '$).';
      return NM(text, t.q, why);
    }) },
    { skill: 'solve-simult', gen: G(function () {
      var t = twoConst(); if (!t) return null;
      var text = 'Given that $' + dvs(t.al) + '$ is a factor of $' + fText(t.c0) + '$ and that the remainder when $f(x)$ is divided by $' + dvs(t.be) + '$ is ' + t.R + ', find the value of $p + q$.';
      var why = 'Form $' + eqS(t.al * t.al, t.al, -t.al * t.al * t.al - t.c0) + '$ and $' + eqS(t.be * t.be, t.be, t.R - t.be * t.be * t.be - t.c0) + '$, then solve: $p = ' + t.p + '$, $q = ' + t.q + '$, so $p + q = ' + (t.p + t.q) + '$.';
      return NM(text, t.p + t.q, why);
    }) },
    { skill: 'form-equations', gen: G(function () {
      var al = rint(1, 4) * sgn(), c0 = rint(-8, 8); if (!c0) return null;
      var C = -al * al * al - c0;
      var text = 'Given that $' + dvs(al) + '$ is a factor of $' + fText(c0) + '$, which equation do you get for $p$ and $q$?';
      var why = 'Substitute $x = ' + al + '$: $(' + al + ')^3 + p(' + al + ')^2 + q(' + al + ') ' + (c0 < 0 ? '- ' + (-c0) : '+ ' + c0) + ' = 0$, so $' + eqS(al * al, al, C) + '$.';
      return MC(text, '$' + eqS(al * al, al, C) + '$', ['$' + eqS(al * al, -al, al * al * al - c0) + '$', '$' + eqS(al * al, al, al * al * al + c0) + '$', '$' + eqS(al * al, al, -al * al * al + c0) + '$'], why);
    }) },
    { skill: 'form-equations', gen: G(function () {
      var be = rint(1, 4) * sgn(), c0 = rint(-8, 8), R1 = rint(-20, 20); if (!c0) return null;
      var C = R1 - be * be * be - c0;
      var text = 'The remainder when $' + fText(c0) + '$ is divided by $' + dvs(be) + '$ is ' + R1 + '. Which equation do you get for $p$ and $q$?';
      var why = 'The remainder is $f(' + be + ') = ' + R1 + '$. Substituting gives $(' + be + ')^3 + p(' + be + ')^2 + q(' + be + ') ' + (c0 < 0 ? '- ' + (-c0) : '+ ' + c0) + ' = ' + R1 + '$, so $' + eqS(be * be, be, C) + '$.';
      return MC(text, '$' + eqS(be * be, be, C) + '$', ['$' + eqS(be * be, -be, R1 + be * be * be - c0) + '$', '$' + eqS(be * be, be, R1 - be * be * be) + '$', '$' + eqS(be * be, be, 0 - be * be * be - c0) + '$'], why);
    }) },
    { skill: 'derivative-condition', gen: G(function () {
      var al = rint(1, 3) * sgn(), be = rint(1, 3) * sgn(), p = rint(-4, 5), q = rint(-5, 5);
      var c0 = -(al * al * al + p * al * al + q * al);
      if (!p || !q || !c0 || al === 2 * be || Math.abs(c0) > 30) return null;
      var D = 3 * be * be + 2 * p * be + q;
      var text = 'Given that $' + dvs(al) + '$ is a factor of $' + fText(c0) + '$ and that $f\'(' + be + ') = ' + D + '$, find the value of $q$.';
      var why = 'Factor: $f(' + al + ') = 0$ gives $' + eqS(al * al, al, -al * al * al - c0) + '$. Differentiating, $f\'(x) = 3x^2 + 2px + q$, so $f\'(' + be + ') = ' + D + '$ gives $' + E([[2 * be, 'p'], [1, 'q']]) + ' = ' + (D - 3 * be * be) + '$. Solving gives $p = ' + p + '$, $q = ' + q + '$.';
      return NM(text, q, why);
    }) },
    { skill: 'integrate-constant', gen: G(function () {
      var al = rint(1, 3) * sgn(), p = rint(-4, 4), m = rint(-5, 5);
      if (!p || !m) return null;
      var C = -(al * al * al + p * al * al + m * al);
      var text = 'The function $f(x)$ satisfies $f\'(x) = ' + E([[3, 'x^2'], [2 * p, 'x'], [m, '']]) + '$ and $' + dvs(al) + '$ is a factor of $f(x)$. Find the constant term of $f(x)$.';
      var why = 'Integrate: $f(x) = ' + E([[1, 'x^3'], [p, 'x^2'], [m, 'x'], [1, 'C']]) + '$ (do not forget $+C$). Then $f(' + al + ') = 0$ gives $C = ' + C + '$.';
      return NM(text, C, why);
    }) },
    S('form-equations', 'A cubic $f(x)$ has $(x + 2)$ as a factor and leaves remainder 21 when divided by $(x + 3)$. Which pair of conditions is correct?', ['$f(-2) = 0$ and $f(-3) = 21$', '$f(2) = 0$ and $f(3) = 21$', '$f(-2) = 21$ and $f(-3) = 0$', '$f(2) = 21$ and $f(3) = 0$'], 0, 'A factor means the value is 0; a remainder means the value is that remainder. $x + 2 = 0$ gives $x = -2$ and $x + 3 = 0$ gives $x = -3$. So $f(-2) = 0$ and $f(-3) = 21$.'),
    S('form-equations', 'A student treats "the remainder is 5 when divided by $(x - 1)$" as $f(1) = 0$. What is the mistake?', ['A remainder of 5 means $f(1) = 5$; only a factor gives $f(1) = 0$', 'It should be $f(-1) = 5$', 'It should be $f(5) = 1$', 'There is no mistake'], 0, 'By the remainder theorem, dividing by $(x - 1)$ leaves remainder $f(1)$, so $f(1) = 5$. Zero is only the remainder when it IS a factor.'),
    S('solve-simult', 'In a "show that $a = 2$ and find $b$" question, what must you not do?', ['Substitute $a = 2$ into the equations at the start', 'Form two equations', 'Solve them simultaneously', 'Check the answers in a condition'], 0, 'You are asked to show $a = 2$, so it has to come out of the working. Form both equations and solve them; assuming it at the start earns nothing.')
  ] };

  // =====================================================================
  // FPM-IDN-10 Factorising and solving a cubic
  // =====================================================================
  function cubicRoots() {
    // returns factors as [s, r] meaning (sx - r)
    var f1 = [1, rint(1, 4) * sgn()];
    var f2 = [pick([1, 2]), rint(1, 5) * sgn()];
    var f3 = [pick([1, 2]), rint(1, 5) * sgn()];
    return [f1, f2, f3];
  }
  function okFactors(fs) {
    var i, j;
    for (i = 0; i < 3; i++) { if (gcd(fs[i][0], fs[i][1]) !== 1) return false; for (j = i + 1; j < 3; j++) if (fs[i][1] * fs[j][0] === fs[j][1] * fs[i][0]) return false; }
    return true;
  }
  function expandF(fs) { return polyMul(polyMul([fs[0][0], -fs[0][1]], [fs[1][0], -fs[1][1]]), [fs[2][0], -fs[2][1]]); }
  function facText(f) { return '(' + linFactor(f[0], f[1]) + ')'; }
  B['FPM-IDN-10'] = { title: 'Factorising and solving a cubic', items: [
    { skill: 'quotient', gen: G(function () {
      var a = rint(1, 5) * sgn(), m = rint(-5, 5), n = rint(-6, 6);
      if (!m || !n) return null;
      var cs = polyMul([1, -a], [1, m, n]);
      var text = '$(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, so $f(x) = (x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')(x^2 + mx + n)$. Find $m$.';
      var why = 'The $x^2$ coefficient of $(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')(x^2 + mx + n)$ is $' + E([[1, 'm'], [-a, '']]) + '$ (from $x \\times mx$ and the constant times $x^2$). This must equal ' + cs[1] + ', so $m = ' + m + '$.';
      return NM(text, m, why);
    }) },
    { skill: 'quotient', gen: G(function () {
      var a = rint(1, 5) * sgn(), m = rint(-5, 5), n = rint(-6, 6);
      if (!m || !n) return null;
      var cs = polyMul([1, -a], [1, m, n]);
      var text = '$(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, so $f(x) = (x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')(x^2 + mx + n)$. Find $n$.';
      var why = 'Compare the constant terms: $' + E([[-a, 'n']]) + ' = ' + cs[3] + '$, so $n = ' + n + '$. (Check with the $x$ terms: $' + E([[1, 'n'], [-a, 'm']]) + ' = ' + cs[2] + '$.)';
      return NM(text, n, why);
    }) },
    { skill: 'factorise-completely', gen: G(function () {
      var fs = cubicRoots(); if (!okFactors(fs)) return null;
      var cs = expandF(fs);
      var text = '$(' + linFactor(fs[0][0], fs[0][1]) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$. Factorise $f(x)$ completely.';
      var join = function (a, b, c) { return '$' + facText(a) + facText(b) + facText(c) + '$'; };
      var flip = function (f) { return [f[0], -f[1]]; };
      var swap = function (f) { return [f[1] === 0 ? 1 : Math.abs(f[1]), f[0] * (f[1] < 0 ? -1 : 1)]; };
      var why = 'Divide by the known factor to get a quadratic, then factorise it. The roots are ' + fs.map(function (f) { return '$x = ' + fr(f[1], f[0]) + '$'; }).join(', ') + ', so $f(x) = ' + facText(fs[0]) + facText(fs[1]) + facText(fs[2]) + '$ (expand to check).';
      return MC(text, join(fs[0], fs[1], fs[2]), [join(fs[0], flip(fs[1]), flip(fs[2])), join(flip(fs[0]), fs[1], fs[2]), join(fs[0], swap(fs[1]), swap(fs[2]))], why);
    }) },
    { skill: 'all-roots', gen: G(function () {
      var fs = cubicRoots(); if (!okFactors(fs)) return null;
      var text = 'Solve $' + facText(fs[0]) + facText(fs[1]) + facText(fs[2]) + ' = 0$. Which set of solutions is correct?';
      var rs = fs.map(function (f) { return fr(f[1], f[0]); });
      var rneg = fs.map(function (f) { return fr(-f[1], f[0]); });
      var str = function (a) { return '$x = ' + a.join('$, $x = ') + '$'; };
      var why = 'Set each factor to zero: ' + fs.map(function (f) { return '$' + linFactor(f[0], f[1]) + ' = 0$ gives $x = ' + fr(f[1], f[0]) + '$'; }).join('; ') + '. Watch the signs: a factor $(2x + 1)$ gives $-\\frac{1}{2}$.';
      var inv = fs.map(function (f) { return fr(f[0], f[1]); });
      return MC(text, str(rs), [str(rneg), str([rs[0], rneg[1], rneg[2]]), str(inv)], why);
    }) },
    { skill: 'all-roots', gen: G(function () {
      var fs = [[1, rint(-5, 5)], [pick([1, 2]), rint(-5, 5)], [pick([1, 2]), rint(-5, 5)]];
      if (!okFactors(fs) || !fs[0][1] || !fs[1][1] || !fs[2][1]) return null;
      var cs = expandF(fs);
      var text = 'The curve $y = ' + polyText(cs) + '$ crosses the $x$-axis at three points. Given that $(' + linFactor(fs[0][0], fs[0][1]) + ')$ is a factor, find the sum of the three $x$-coordinates. Give your answer as a decimal.';
      var sum = fs[0][1] / fs[0][0] + fs[1][1] / fs[1][0] + fs[2][1] / fs[2][0];
      var why = 'Divide by the known factor and factorise the quadratic: $y = ' + facText(fs[0]) + facText(fs[1]) + facText(fs[2]) + '$. The crossings are at $x = ' + fr(fs[0][1], fs[0][0]) + '$, $' + fr(fs[1][1], fs[1][0]) + '$ and $' + fr(fs[2][1], fs[2][0]) + '$. Include the known root as well; the sum is ' + sum + '.';
      return NM(text, sum, why);
    }) },
    { skill: 'smallest-root', gen: G(function () {
      var fs = cubicRoots(); if (!okFactors(fs)) return null;
      var cs = expandF(fs);
      var roots = fs.map(function (f) { return f[1] / f[0]; });
      var mn = Math.min.apply(null, roots);
      var text = 'Given that $(' + linFactor(fs[0][0], fs[0][1]) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, solve $f(x) = 0$ and give the smallest root as a decimal.';
      var why = 'Dividing by the known factor and factorising the quadratic gives $f(x) = ' + facText(fs[0]) + facText(fs[1]) + facText(fs[2]) + '$, with roots ' + roots.join(', ') + '. The smallest is ' + mn + '.';
      return NM(text, mn, why);
    }) },
    { skill: 'surd-roots', gen: G(function () {
      var a = rint(1, 4) * sgn(), m = rint(-4, 4), n = pick([2, 3, 5, 6, 7, 10, 11]);
      if (!m) return null;
      var cs = polyMul([1, -a], [1, -2 * m, m * m - n]);
      var text = '$(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$. Find the exact solutions of $f(x) = 0$.';
      var sq = '\\sqrt{' + n + '}';
      var mk = function (r, mm) { return '$x = ' + r + '$ or $x = ' + mm + ' \\pm ' + sq + '$'; };
      var why = 'Dividing by the factor gives $' + E([[1, 'x^2'], [-2 * m, 'x'], [m * m - n, '']]) + '$, which does not factorise. The formula gives $x = ' + m + ' \\pm ' + sq + '$. Do not forget the known root $x = ' + a + '$.';
      return MC(text, mk(a, m), [mk(-a, m), mk(a, -m), '$x = ' + m + ' \\pm ' + sq + '$ only'], why);
    }) },
    { skill: 'surd-roots', gen: G(function () {
      var a = rint(-4, 4), m = rint(1, 5), n = pick([2, 3, 5, 6, 7, 10, 11]);
      if (!a) return null;
      var cs = polyMul([1, -a], [1, -2 * m, m * m - n]);
      var big = m + Math.sqrt(n);
      var text = '$(x ' + (a < 0 ? '+ ' + (-a) : '- ' + a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$. The quadratic factor has two real roots. Find the larger of them, correct to 3 significant figures.';
      var why = 'The quadratic factor is $' + E([[1, 'x^2'], [-2 * m, 'x'], [m * m - n, '']]) + '$. By the formula $x = ' + m + ' \\pm \\sqrt{' + n + '}$, and the larger root is $' + m + ' + \\sqrt{' + n + '} \\approx ' + R.roundSf(big, 3) + '$.';
      return NM(text, R.roundSf(big, 3), why, sfTol(big, 3));
    }) },
    S('all-roots', 'A student solves a cubic by dividing out a known root $x = 2$ and solving the quadratic quotient to get $x = -1$ and $x = 3$. Which final answer is complete?', ['$x = -1, 2, 3$', '$x = -1, 3$', '$x = 2$', '$x = 2, -1$'], 0, 'The cubic has three roots, including the one from the known factor. Leaving out $x = 2$ is a common way to lose the last mark.'),
    S('factorise-completely', 'After dividing, $f(x) = (x - 1)(x^2 - 5x + 6)$. Why is this not yet "factorised completely"?', ['The quadratic factorises further to $(x - 2)(x - 3)$', 'The factor $(x - 1)$ is wrong', 'A cubic must have a squared factor', 'It is already complete'], 0, '"Completely" means every factor is linear where possible. $x^2 - 5x + 6 = (x - 2)(x - 3)$, so $f(x) = (x - 1)(x - 2)(x - 3)$.')
  ] };

  // =====================================================================
  // FPM-IDN-12 Showing a cubic has only one real root
  // =====================================================================
  function discTrio(monic) {
    var p = monic ? 1 : pick([1, 2, 3]), b = rint(-5, 5), c = rint(-6, 8), a = rint(-4, 4);
    if (!a || !b || !c) return null;
    return { p: p, b: b, c: c, a: a, D: b * b - 4 * p * c };
  }
  B['FPM-IDN-12'] = { title: 'Showing a cubic has only one real root', items: [
    { skill: 'discriminant', gen: G(function () {
      var t = discTrio(true); if (!t) return null;
      var cs = polyMul([1, -t.a], [t.p, t.b, t.c]);
      var text = '$(x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, so $f(x) = (x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')(x^2 + bx + c)$. Find the value of $b^2 - 4c$ for the quadratic factor.';
      var why = 'Comparing coefficients gives $b = ' + t.b + '$ and $c = ' + t.c + '$. Then $b^2 - 4c = (' + t.b + ')^2 - 4(' + t.c + ') = ' + t.D + '$.';
      return NM(text, t.D, why);
    }) },
    { skill: 'discriminant', gen: G(function () {
      var t = discTrio(false); if (!t || t.p === 1) return null;
      var cs = polyMul([1, -t.a], [t.p, t.b, t.c]);
      var text = '$(x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')$ is a factor of $f(x) = ' + polyText(cs) + '$, so $f(x) = (x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')(' + E([[t.p, 'x^2'], [t.b, 'x'], [t.c, '']]) + ')$. Work out the discriminant $b^2 - 4ac$ of the quadratic factor.';
      var why = 'The quadratic is $' + E([[t.p, 'x^2'], [t.b, 'x'], [t.c, '']]) + '$ with $a = ' + t.p + '$, $b = ' + t.b + '$, $c = ' + t.c + '$. So $b^2 - 4ac = (' + t.b + ')^2 - 4(' + t.p + ')(' + t.c + ') = ' + t.D + '$.';
      return NM(text, t.D, why);
    }) },
    { skill: 'count-roots', gen: G(function () {
      var t = discTrio(false); if (!t) return null;
      var qa = t.a * t.a * t.p + t.a * t.b + t.c; if (qa === 0) return null;
      var cnt = t.D < 0 ? 1 : t.D === 0 ? 2 : 3;
      var text = 'How many distinct real roots does $(x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')(' + E([[t.p, 'x^2'], [t.b, 'x'], [t.c, '']]) + ') = 0$ have?';
      var why = 'The linear factor gives one root. For the quadratic, $b^2 - 4ac = ' + t.D + '$, which is ' + (t.D < 0 ? 'negative: no real roots' : t.D === 0 ? 'zero: one repeated root' : 'positive: two real roots') + '. Altogether ' + cnt + ' distinct real root' + (cnt > 1 ? 's' : '') + '.';
      return NM(text, cnt, why);
    }) },
    { skill: 'range-constant', gen: G(function () {
      var m = rint(1, 5);
      var text = 'The quadratic factor of a cubic is $x^2 + kx + ' + (m * m) + '$, and the cubic has only one real root. Find the range of values of $k$.';
      var why = 'No real roots from the quadratic needs $k^2 - 4(' + (m * m) + ') \\lt 0$, so $k^2 \\lt ' + (4 * m * m) + '$, giving $-' + (2 * m) + ' \\lt k \\lt ' + (2 * m) + '$.';
      return MC(text, '$-' + (2 * m) + ' \\lt k \\lt ' + (2 * m) + '$', ['$k \\lt -' + (2 * m) + '$ or $k \\gt ' + (2 * m) + '$', '$-' + m + ' \\lt k \\lt ' + m + '$', '$-' + (4 * m) + ' \\lt k \\lt ' + (4 * m) + '$'], why);
    }) },
    { skill: 'range-constant', gen: G(function () {
      var c = rint(3, 12);
      var best = 0; for (var k = 0; k <= 20; k++) if (k * k < 4 * c) best = k;
      var text = 'The quadratic factor of a cubic is $x^2 + kx + ' + c + '$. Find the greatest positive integer value of $k$ for which the cubic has only one real root.';
      var why = 'We need $k^2 - 4(' + c + ') \\lt 0$, i.e. $k^2 \\lt ' + (4 * c) + '$. The greatest positive integer with this is ' + best + ' (because ' + ((best + 1) * (best + 1)) + ' is not less than ' + (4 * c) + ').';
      return NM(text, best, why);
    }) },
    { skill: 'conclusion', gen: G(function () {
      var t = discTrio(true); if (!t) return null;
      var cnt = t.D < 0 ? 'No real roots from the quadratic, so the only real root is $x = ' + t.a + '$' : t.D === 0 ? 'One repeated real root from the quadratic, so two distinct real roots in all' : 'Two real roots from the quadratic, so three real roots in all';
      var all = ['No real roots from the quadratic, so the only real root is $x = ' + t.a + '$', 'One repeated real root from the quadratic, so two distinct real roots in all', 'Two real roots from the quadratic, so three real roots in all', 'The quadratic cannot be solved, so there are no real roots at all'];
      var why = 'If $b^2 - 4ac \\lt 0$ there are no real roots; if it is $0$ there is one repeated root; if it is positive there are two. Here the discriminant is ' + t.D + ', so: ' + cnt.charAt(0).toLowerCase() + cnt.slice(1) + '.';
      var text = 'The quadratic factor of a cubic has discriminant ' + t.D + ', and the linear factor is $(x ' + (t.a < 0 ? '+ ' + (-t.a) : '- ' + t.a) + ')$ (assume the quadratic\'s roots are different from $' + t.a + '$). Which conclusion about $f(x) = 0$ is correct?';
      return MC(text, cnt, all.filter(function (w) { return w !== cnt; }), why);
    }) },
    S('conclusion', 'A student shows that the quadratic factor has $b^2 - 4ac = -8$ and then stops. What is missing for full marks?', ['A statement that it is negative so the quadratic has no real roots, and that the only real root comes from the linear factor', 'Nothing, the number is enough', 'A decimal value of the root', 'The student must also find the complex roots'], 0, 'A number alone is not a proof. Say that $-8 \\lt 0$, so the quadratic has no real roots, and name the one real root given by the linear factor.'),
    S('discriminant', 'A student calculates the discriminant of $2x^2 + 3x + 4$ as $3^2 + 4(2)(4) = 41$. What is the error?', ['It should be $b^2 - 4ac = 9 - 32 = -23$', 'It should be $b^2 - 2ac$', 'The student should have used $a^2 - 4bc$', 'There is no error'], 0, 'The discriminant is $b^2 - 4ac$, with a minus sign: $3^2 - 4 \\times 2 \\times 4 = 9 - 32 = -23$, which is negative, so there are no real roots.'),
    S('conclusion', 'What does it mean for the curve $y = f(x)$ of a cubic to have only one real root?', ['It crosses the $x$-axis exactly once', 'It never crosses the $x$-axis', 'It touches the $x$-axis at three points', 'It crosses the $y$-axis once'], 0, 'The real roots of $f(x) = 0$ are the $x$-coordinates where the curve meets the $x$-axis, so one real root means one crossing.'),
    S('count-roots', 'Can a cubic equation $f(x) = 0$ with real coefficients have no real roots at all?', ['No, it always has at least one real root', 'Yes, whenever the discriminant of the quadratic factor is negative', 'Yes, whenever the constant term is positive', 'Only if the leading coefficient is negative'], 0, 'A cubic curve goes from below the $x$-axis to above it (or the reverse), so it must cross the axis at least once. That is why there is always a linear factor from one real root.')
  ] };

  // =====================================================================
  // FPM-IDN-13 Where a line meets a curve (simultaneous equations)
  // =====================================================================
  function lineParab() {
    var x1 = rint(-5, 4), x2 = x1 + rint(1, 7), m = rint(-3, 3), k = rint(-6, 6);
    if (!m) return null;
    var b = m - (x1 + x2), c = x1 * x2 + k;
    return { x1: x1, x2: x2, m: m, k: k, b: b, c: c };
  }
  B['FPM-IDN-13'] = { title: 'Where a line meets a curve (simultaneous equations)', items: [
    { skill: 'substitute', gen: G(function () {
      var t = lineParab(); if (!t) return null;
      var text = 'The curve $y = ' + E([[1, 'x^2'], [t.b, 'x'], [t.c, '']]) + '$ meets the line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ at two points. Find the smaller $x$-coordinate of the points of intersection.';
      var why = 'Equate: $' + E([[1, 'x^2'], [t.b, 'x'], [t.c, '']]) + ' = ' + E([[t.m, 'x'], [t.k, '']]) + '$, so $' + E([[1, 'x^2'], [t.b - t.m, 'x'], [t.c - t.k, '']]) + ' = 0$, i.e. $' + dvs(t.x1) + dvs(t.x2) + ' = 0$. The smaller solution is $x = ' + t.x1 + '$.';
      return NM(text, t.x1, why);
    }) },
    { skill: 'pairing', gen: G(function () {
      var t = lineParab(); if (!t) return null;
      var y2 = t.m * t.x2 + t.k;
      var text = 'The curve $y = ' + E([[1, 'x^2'], [t.b, 'x'], [t.c, '']]) + '$ meets the line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ at two points. Find the $y$-coordinate of the point with the larger $x$-coordinate.';
      var why = 'Equating gives $' + dvs(t.x1) + dvs(t.x2) + ' = 0$, so the larger $x$ is ' + t.x2 + '. Use the line: $y = ' + t.m + '(' + t.x2 + ') ' + (t.k < 0 ? '- ' + (-t.k) : '+ ' + t.k) + ' = ' + y2 + '$.';
      return NM(text, y2, why);
    }) },
    { skill: 'pairing', gen: G(function () {
      var t = lineParab(); if (!t) return null;
      var y1 = t.m * t.x1 + t.k, y2 = t.m * t.x2 + t.k;
      if (t.x1 === -t.x2) return null;
      var f = function (x, y) { return '$(' + x + ', ' + y + ')$'; };
      var text = 'The curve $y = ' + E([[1, 'x^2'], [t.b, 'x'], [t.c, '']]) + '$ meets the line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$. Which is the point of intersection with the larger $x$-coordinate?';
      var why = 'Equating gives $x = ' + t.x1 + '$ or $x = ' + t.x2 + '$. Pair each $x$ with its own $y$ from the line: $x = ' + t.x1 + '$ gives $y = ' + y1 + '$ and $x = ' + t.x2 + '$ gives $y = ' + y2 + '$. The larger $x$ gives ' + f(t.x2, y2) + '.';
      return MC(text, f(t.x2, y2), [f(t.x2, y1), f(t.x1, y2), f(-t.x2, y2)], why);
    }) },
    { skill: 'xy-form', gen: G(function () {
      var x1 = rint(-6, 3), x2 = x1 + rint(2, 8);
      if (!x1 || !x2) return null;
      var d = -(x1 + x2), p = -x1 * x2;
      var ys = [x1 + d, x2 + d], big = Math.max(ys[0], ys[1]);
      var text = 'Solve the simultaneous equations $y = ' + E([[1, 'x'], [d, '']]) + '$ and $xy = ' + p + '$. Find the larger value of $y$.';
      var why = 'Substitute: $x(' + E([[1, 'x'], [d, '']]) + ') = ' + p + '$, so $' + E([[1, 'x^2'], [d, 'x'], [-p, '']]) + ' = 0$, with $x = ' + x1 + '$ or $x = ' + x2 + '$. Then $y = x ' + (d < 0 ? '- ' + (-d) : '+ ' + d) + '$ gives $y = ' + ys[0] + '$ or $y = ' + ys[1] + '$. The larger is ' + big + '.';
      return NM(text, big, why);
    }) },
    { skill: 'circle-line', gen: G(function () {
      var u = rint(-4, 6), v = rint(-4, 6);
      if (u === v || u + v === 0) return null;
      var s = u + v, t = u * u + v * v;
      var text = 'Solve $x + y = ' + s + '$ and $x^2 + y^2 = ' + t + '$. Find the larger value of $x$.';
      var why = 'Substitute $y = ' + s + ' - x$ into the second equation and rearrange to a quadratic in $x$. It factorises to $' + dvs(u) + dvs(v) + ' = 0$, so $x = ' + u + '$ or $x = ' + v + '$. The larger is ' + Math.max(u, v) + '.';
      return NM(text, Math.max(u, v), why);
    }) },
    { skill: 'substitute', gen: G(function () {
      var m = rint(-3, 3), k = rint(-5, 5), b = rint(-4, 4), c = rint(-5, 6);
      if (!m) return null;
      var bb = b - m, cc = c - k;
      var text = 'Substituting $y = ' + E([[m, 'x'], [k, '']]) + '$ into $y = ' + E([[1, 'x^2'], [b, 'x'], [c, '']]) + '$ gives which quadratic equation?';
      var fmt = function (p1, p2) { return '$' + E([[1, 'x^2'], [p1, 'x'], [p2, '']]) + ' = 0$'; };
      var why = 'Set the two expressions for $y$ equal and move everything to one side: $x^2 + (' + E([[b, ''], [-m, '']]) + ')x + (' + E([[c, ''], [-k, '']]) + ') = 0$, which is ' + fmt(bb, cc) + '.';
      return MC(text, fmt(bb, cc), [fmt(b + m, c + k), fmt(bb, c + k), fmt(m - b, k - c)], why);
    }) },
    { skill: 'tangent', gen: G(function () {
      var m = rint(-3, 3), t = rint(-3, 3), b = m + 2 * t, c = rint(-4, 8);
      if (!m || !t) return null;
      var k = c - t * t;
      var text = 'The line $y = ' + E([[m, 'x'], [1, 'k']]) + '$ is a tangent to the curve $y = ' + E([[1, 'x^2'], [b, 'x'], [c, '']]) + '$. Find the value of $k$.';
      var why = 'Equate: $x^2 + ' + (b - m < 0 ? '(' + (b - m) + ')' : (b - m)) + 'x + (' + c + ' - k) = 0$. A tangent means a repeated root, so the discriminant is 0: $(' + (b - m) + ')^2 - 4(' + c + ' - k) = 0$, giving $k = ' + k + '$.';
      return NM(text, k, why);
    }) },
    { skill: 'discriminant', gen: G(function () {
      var r = Math.random(), B1, C1;
      if (r < 0.3) { B1 = 2 * rint(-3, 3); C1 = B1 * B1 / 4; } else { B1 = rint(-6, 6); C1 = rint(-6, 9); }
      var D = B1 * B1 - 4 * C1, cnt = D > 0 ? 2 : D === 0 ? 1 : 0;
      var m = rint(-3, 3), k = rint(-5, 5); if (!m) return null;
      var b = B1 + m, c = C1 + k;
      var text = 'How many points of intersection do the curve $y = ' + E([[1, 'x^2'], [b, 'x'], [c, '']]) + '$ and the line $y = ' + E([[m, 'x'], [k, '']]) + '$ have?';
      var why = 'Equating gives $' + E([[1, 'x^2'], [B1, 'x'], [C1, '']]) + ' = 0$. Its discriminant is $(' + B1 + ')^2 - 4(' + C1 + ') = ' + D + '$, which is ' + (D > 0 ? 'positive: 2 points' : D === 0 ? 'zero: 1 point (the line is a tangent)' : 'negative: no points') + '.';
      return NM(text, cnt, why);
    }) },
    S('pairing', 'Solving a pair of simultaneous equations gives $x = 2$ and $x = 5$. The question asks for the points of intersection. What must you do next?', ['Find the matching $y$ for each $x$ using the linear equation and write two coordinate pairs', 'Give the $x$ values as the final answer', 'Choose the larger $x$ only', 'Add the two $x$ values'], 0, 'Points of intersection need both coordinates. Substitute each $x$ into the simpler (linear) equation to get its own $y$, then write the pairs.'),
    S('substitute', 'To solve $x^2 = 3x$ a student divides by $x$ and finds $x = 3$ only. What was lost?', ['The solution $x = 0$, so you should rearrange and factorise $x(x - 3) = 0$', 'The solution $x = -3$', 'Nothing was lost', 'The solution $x = 9$'], 0, 'Dividing by a variable loses the solution where it is zero. Write $x^2 - 3x = 0$, factorise to $x(x - 3) = 0$, and get both $x = 0$ and $x = 3$.')
  ] };

  // =====================================================================
  // FPM-IDN-15 Where a line meets a fraction curve again
  // =====================================================================
  function ratSet(mset) {
    var m = pick(mset), h = rint(-3, 3), k = rint(-4, 4), x0 = rint(-4, 5), j = rint(-7, 7);
    if (!j || !k) return null;
    if (j === m * x0) return null;
    var x1n = j, x1d = m;
    if (x0 === h || (j % m === 0 && j / m === h) || (j === m * h)) return null;
    var a = k - m * h + j + m * x0, bb = -k * h - j * x0;
    if (!a || !bb) return null;
    return { m: m, h: h, k: k, x0: x0, j: j, a: a, b: bb };
  }
  function ratText(t) {
    var den = E([[1, 'x'], [-t.h, '']]);
    return 'y = \\frac{' + E([[t.a, 'x'], [t.b, '']]) + '}{' + den + '}';
  }
  function chk(t) { // sanity: known root satisfies (mx+k)(x-h) = ax+b
    return (t.m * t.x0 + t.k) * (t.x0 - t.h) === t.a * t.x0 + t.b;
  }
  B['FPM-IDN-15'] = { title: 'Where a line meets a fraction curve again', items: [
    { skill: 'other-root', gen: G(function () {
      var t = ratSet([1, 2, 4, 5]); if (!t || !chk(t)) return null;
      var ans = t.j / t.m;
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$ at the point where $x = ' + t.x0 + '$, and again at the point $D$. Find the $x$-coordinate of $D$ as a decimal.';
      var why = 'Equate and multiply by $(' + E([[1, 'x'], [-t.h, '']]) + ')$: $(' + E([[t.m, 'x'], [t.k, '']]) + ')(' + E([[1, 'x'], [-t.h, '']]) + ') = ' + E([[t.a, 'x'], [t.b, '']]) + '$, which rearranges to $' + E([[t.m, 'x^2'], [-(t.j + t.m * t.x0), 'x'], [t.j * t.x0, '']]) + ' = 0$. One root is ' + t.x0 + ' so the factors are $' + dvs(t.x0) + '(' + E([[t.m, 'x'], [-t.j, '']]) + ')$ and the other root is $' + fr(t.j, t.m) + '$.';
      return NM(text, ans, why);
    }) },
    { skill: 'other-root', gen: G(function () {
      var t = ratSet([2, 3, 5]); if (!t || !chk(t) || t.j % t.m === 0) return null;
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$ at the point where $x = ' + t.x0 + '$, and again at the point $D$. Find the $x$-coordinate of $D$ as a fraction.';
      var why = 'Clearing the fraction gives $' + E([[t.m, 'x^2'], [-(t.j + t.m * t.x0), 'x'], [t.j * t.x0, '']]) + ' = 0$. Since $x = ' + t.x0 + '$ is one root, the factors are $' + dvs(t.x0) + '(' + E([[t.m, 'x'], [-t.j, '']]) + ') = 0$, so $D$ has $x = ' + fr(t.j, t.m) + '$.';
      return MC(text, '$x = ' + fr(t.j, t.m) + '$', ['$x = ' + fr(-t.j, t.m) + '$', '$x = ' + fr(t.m, t.j) + '$', '$x = ' + t.x0 + '$'], why);
    }) },
    { skill: 'clear-fraction', gen: G(function () {
      var t = ratSet([1, 2, 3]); if (!t || !chk(t) || t.h === 0) return null;
      var den = '(' + E([[1, 'x'], [-t.h, '']]) + ')';
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$. Which equation results from setting them equal and multiplying through by ' + den.replace(/^/, '$').replace(/$/, '$') + '?';
      var lin = '(' + E([[t.m, 'x'], [t.k, '']]) + ')';
      var correct = '$' + lin + den + ' = ' + E([[t.a, 'x'], [t.b, '']]) + '$';
      var why = 'Both sides are multiplied by ' + den.replace(/^/, '$').replace(/$/, '$') + ': the fraction becomes just its top, and the whole of the line expression is multiplied by the bracket, giving ' + correct + '.';
      return MC(text, correct, ['$' + E([[t.m, 'x'], [t.k, '']]) + ' = ' + E([[t.a, 'x'], [t.b, '']]) + '$', '$' + E([[t.m, 'x']]) + den + ' ' + (t.k < 0 ? '- ' + (-t.k) : '+ ' + t.k) + ' = ' + E([[t.a, 'x'], [t.b, '']]) + '$', '$' + lin + den + ' = (' + E([[t.a, 'x'], [t.b, '']]) + ')' + den + '$'], why);
    }) },
    { skill: 'clear-fraction', gen: G(function () {
      var t = ratSet([1, 2, 3]); if (!t || !chk(t)) return null;
      var A = t.m, Bc = -(t.j + t.m * t.x0), C = t.j * t.x0;
      var correct = '$' + E([[A, 'x^2'], [Bc, 'x'], [C, '']]) + ' = 0$';
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$. After clearing the fraction and collecting everything on one side, which quadratic equation do you get?';
      var why = 'Multiply out $(' + E([[t.m, 'x'], [t.k, '']]) + ')(' + E([[1, 'x'], [-t.h, '']]) + ')$ and subtract $' + E([[t.a, 'x'], [t.b, '']]) + '$: the $x^2$ term is $' + E([[A, 'x^2']]) + '$, the $x$ term is $' + E([[t.k - t.m * t.h - t.a, 'x']]) + '$ and the constant is $' + (-t.k * t.h - t.b) + '$. This gives ' + correct + '.';
      var alt1 = E([[A, 'x^2'], [t.k - t.m * t.h + t.a, 'x'], [-t.k * t.h + t.b, '']]);
      var alt2 = E([[A, 'x^2'], [-Bc, 'x'], [C, '']]);
      var alt3 = E([[A, 'x^2'], [Bc, 'x'], [-C, '']]);
      return MC(text, correct, ['$' + alt1 + ' = 0$', '$' + alt2 + ' = 0$', '$' + alt3 + ' = 0$'], why);
    }) },
    { skill: 'y-coordinate', gen: G(function () {
      var t = ratSet([1, 2, 4, 5]); if (!t || !chk(t)) return null;
      var yD = t.j + t.k;
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$ at $x = ' + t.x0 + '$ and again at $D$. Find the $y$-coordinate of $D$.';
      var why = 'Clearing the fraction gives $' + E([[t.m, 'x^2'], [-(t.j + t.m * t.x0), 'x'], [t.j * t.x0, '']]) + ' = 0$, which factorises as $' + dvs(t.x0) + '(' + E([[t.m, 'x'], [-t.j, '']]) + ') = 0$. At $D$, $x = ' + fr(t.j, t.m) + '$ and the line gives $y = ' + t.m + '\\left(' + fr(t.j, t.m) + '\\right) ' + (t.k < 0 ? '- ' + (-t.k) : '+ ' + t.k) + ' = ' + yD + '$.';
      return NM(text, yD, why);
    }) },
    { skill: 'use-known-root', gen: G(function () {
      var m = pick([2, 3, 4, 5]), x0 = rint(-4, 5), j = rint(-9, 9);
      if (!j || j === m * x0 || j % m === 0) return null;
      var text = 'Clearing the fractions gives $' + E([[m, 'x^2'], [-(j + m * x0), 'x'], [j * x0, '']]) + ' = 0$, and $x = ' + x0 + '$ is already known to be one root. Find the other root as a fraction.';
      var why = 'Since $x = ' + x0 + '$ is a root, $(x ' + (x0 < 0 ? '+ ' + (-x0) : '- ' + x0) + ')$ is a factor. Using the leading and constant terms the other factor is $(' + E([[m, 'x'], [-j, '']]) + ')$, giving $x = ' + fr(j, m) + '$. Check: the roots multiply to $\\frac{' + (j * x0) + '}{' + m + '}$.';
      return MC(text, '$x = ' + fr(j, m) + '$', ['$x = ' + fr(-j, m) + '$', '$x = ' + x0 + '$', '$x = ' + fr(j * x0, m) + '$'], why);
    }) },
    { skill: 'clear-fraction', gen: G(function () {
      var t = ratSet([1, 2, 3, 4]); if (!t || !chk(t)) return null;
      var coef = t.k - t.m * t.h - t.a;
      if (!coef) return null;
      var text = 'The line $y = ' + E([[t.m, 'x'], [t.k, '']]) + '$ meets the curve $' + ratText(t) + '$. After multiplying by the denominator and collecting terms on the left, $' + E([[t.m, 'x^2']]) + ' + (\\ldots)x + (\\ldots) = 0$. Find the coefficient of $x$.';
      var why = '$(' + E([[t.m, 'x'], [t.k, '']]) + ')(' + E([[1, 'x'], [-t.h, '']]) + ') = ' + E([[t.m, 'x^2'], [t.k - t.m * t.h, 'x'], [-t.k * t.h, '']]) + '$. Subtracting $' + E([[t.a, 'x'], [t.b, '']]) + '$ changes the $x$ coefficient to $' + (t.k - t.m * t.h) + ' - (' + t.a + ') = ' + coef + '$.';
      return NM(text, coef, why);
    }) },
    S('rule-out-known', 'The line meets a curve at a point you already know, and again at $D$. After solving the quadratic you get $x = 3$ and $x = -\\frac{1}{2}$, and the known point has $x = 3$. What is the answer for $D$?', ['$x = -\\frac{1}{2}$, because $x = 3$ is the known point', '$x = 3$', '$x = \\frac{5}{2}$', 'Both values'], 0, 'The question wants the second intersection, so reject the root that belongs to the known point. $D$ has $x = -\\frac{1}{2}$.'),
    S('clear-fraction', 'Why is it safe to multiply both sides by $(x - 1)$ when solving $x + 2 = \\frac{3x - 2}{x - 1}$?', ['The curve is not defined at $x = 1$, so $x \\neq 1$ at any intersection', 'Because $(x - 1)$ is always positive', 'Because it makes the equation harder', 'Because $x = 1$ is a solution'], 0, 'At $x = 1$ the denominator is zero and the curve has no point, so no intersection can have $x = 1$ and multiplying by $(x - 1)$ does not lose or add solutions.'),
    S('clear-fraction', 'To clear the fraction in $2x + 1 = \\frac{5x}{x - 3}$, a student writes $2x + 1 (x - 3) = 5x$. What is wrong?', ['Every term on the left must be multiplied: $(2x + 1)(x - 3) = 5x$', 'Nothing is wrong', 'The right side should also be multiplied by $x - 3$ again', 'The denominator should be added'], 0, 'Multiplying both sides by $(x - 3)$ means the whole left side is multiplied. Use a bracket: $(2x + 1)(x - 3) = 5x$.')
  ] };
})();
