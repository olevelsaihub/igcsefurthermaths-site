/* Group G09 mastery bank: Geometric series convergence, sum to infinity, logs in series, binomial expansions with rational powers. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  // fractions as [numerator, denominator], always reduced, denominator > 0
  function fr(n, d) { if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return [n / g, d / g]; }
  function fadd(p, q) { return fr(p[0] * q[1] + q[0] * p[1], p[1] * q[1]); }
  function fsub(p, q) { return fr(p[0] * q[1] - q[0] * p[1], p[1] * q[1]); }
  function fmul(p, q) { return fr(p[0] * q[0], p[1] * q[1]); }
  function fdiv(p, q) { return fr(p[0] * q[1], p[1] * q[0]); }
  function fabs(p) { return [Math.abs(p[0]), p[1]]; }
  function fv(p) { return p[0] / p[1]; }
  function fs(p) { p = fr(p[0], p[1]); var s = p[0] < 0 ? '-' : ''; var a = Math.abs(p[0]); return p[1] === 1 ? s + a : s + '\\frac{' + a + '}{' + p[1] + '}'; }
  function tm(p, v) { p = fr(p[0], p[1]); if (p[0] === 1 && p[1] === 1) return v; return fs(p) + v; }   // positive coefficient times a variable
  function xp(k) { return k === 0 ? '' : (k === 1 ? 'x' : 'x^{' + k + '}'); }
  // a + bx for fractions a, b (either may be zero)
  function lin(a, b) {
    var out = '';
    if (a[0] !== 0) out = fs(a);
    if (b[0] !== 0) { if (out === '') out = (b[0] < 0 ? '-' : '') + tm(fabs(b), 'x'); else out += (b[0] < 0 ? ' - ' : ' + ') + tm(fabs(b), 'x'); }
    return out || '0';
  }
  function polyStr(cs) {
    var out = '', first = true;
    for (var k = 0; k < cs.length; k++) {
      var c = cs[k]; if (c[0] === 0) continue;
      var a = fabs(c), body = k === 0 ? fs(a) : tm(a, xp(k));
      if (first) { out = (c[0] < 0 ? '-' : '') + body; first = false; } else out += (c[0] < 0 ? ' - ' : ' + ') + body;
    }
    return out || '0';
  }
  // coefficients of (1 + b x)^n up to x^K
  function binom(n, b, K) {
    var cs = [[1, 1]];
    for (var k = 1; k <= K; k++) cs.push(fmul(fmul(cs[k - 1], fmul(fsub(n, [k - 1, 1]), b)), [1, k]));
    return cs;
  }
  function mulLin(p, q, cs, K) {   // (p + q x) * series, up to x^K
    var out = [];
    for (var k = 0; k <= K; k++) {
      var t = fmul(p, cs[k]);
      if (k > 0) t = fadd(t, fmul(q, cs[k - 1]));
      out.push(t);
    }
    return out;
  }
  function fexpr(n, inner) {   // expression with exponent n of a bracket
    var k = fs(n);
    if (n[0] === 1 && n[1] === 2) return '\\sqrt{' + inner + '}';
    if (n[0] === -1 && n[1] === 2) return '\\frac{1}{\\sqrt{' + inner + '}}';
    if (n[0] === -1 && n[1] === 1) return '\\frac{1}{' + inner + '}';
    if (n[0] === -2 && n[1] === 1) return '\\frac{1}{(' + inner + ')^2}';
    if (n[0] === -3 && n[1] === 1) return '\\frac{1}{(' + inner + ')^3}';
    if (n[0] === 1 && n[1] === 3) return '\\sqrt[3]{' + inner + '}';
    if (n[0] === -1 && n[1] === 3) return '\\frac{1}{\\sqrt[3]{' + inner + '}}';
    return '(' + inner + ')^{' + k + '}';
  }
  function pw(inner, n) { return '(' + inner + ')^{' + fs(n) + '}'; }
  function fmtD(x) { return String(R.roundDp(x, 6)); }
  function G(skill, fn) { return { skill: skill, gen: function () { for (var i = 0; i < 400; i++) { var r = fn(); if (r) return r; } throw new Error('gen failed: ' + skill); } }; }
  function mc(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function mq(q, correct, wrongs, why) {
    var opts = [correct];
    wrongs.forEach(function (w) { if (opts.indexOf(w) < 0) opts.push(w); });
    if (opts.length < 4) return null;
    return { kind: 'mcq', q: q, options: opts.slice(0, 4), answer: 0, why: why };
  }
  function nu(q, answer, why, disp, tol) { return { kind: 'num', q: q, answer: answer, tol: tol || 1e-9, unit: '', display: '$' + (disp != null ? disp : fmtD(answer)) + '$', why: why }; }
  function tolSf(x, sf) { return 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - sf + 1) + 1e-9; }
  var NPOOL = [[1, 2], [-1, 2], [-1, 1], [-2, 1], [1, 3], [-1, 3], [3, 2], [-3, 2], [-3, 1]];
  var NROOT = [[1, 2], [-1, 2], [-1, 1], [1, 3]];
  var BINT = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  function bracket(b) { return '1 ' + (b[0] < 0 ? '- ' : '+ ') + tm(fabs(b), 'x'); }

  // =====================================================================
  // FPM-SER-12 Does a geometric series have a sum to infinity?
  // =====================================================================
  var RS12 = [[1, 2], [-1, 2], [2, 3], [-2, 3], [3, 4], [-3, 4], [3, 2], [-3, 2], [4, 3], [-4, 3], [-2, 1], [2, 1], [5, 4], [-5, 4], [1, 3], [-1, 3]];
  function concl(c) { return c ? 'so the series is convergent' : 'so the series has no sum to infinity'; }
  function stmt12(r, c) { var ar = fabs(r); return '$r = ' + fs(r) + '$ and $|r| = ' + fs(ar) + (Math.abs(fv(r)) < 1 ? ' \\lt 1$' : ' \\gt 1$') + ', ' + concl(c); }
  B['FPM-SER-12'] = { title: 'Does a geometric series have a sum to infinity?', items: [
    G('decide', function () {
      var rr = pick(RS12), k = rint(1, 4), den = rr[1], a = den * den * k;
      var t2 = a * rr[0] / den, t3 = a * rr[0] * rr[0] / (den * den);
      var r = fr(rr[0], rr[1]), conv = Math.abs(fv(r)) < 1, inv = fr(rr[1], rr[0]);
      return mq('A geometric series begins $' + a + ' + ' + (t2 < 0 ? '(' + t2 + ')' : t2) + ' + ' + t3 + ' + \\dots$ Which statement is correct?',
        stmt12(r, conv), [stmt12(r, !conv), stmt12(inv, Math.abs(fv(inv)) < 1), stmt12([-r[0], r[1]], conv)],
        'Divide a term by the one before: $r = ' + t2 + ' \\div ' + a + ' = ' + fs(r) + '$. Then $|r| = ' + fs(fabs(r)) + '$, which is ' + (conv ? 'less' : 'greater') + ' than 1, ' + concl(conv) + '.');
    }),
    G('find-r', function () {
      var rr = pick([-0.5, 0.25, -0.2, 1.5, -2.5, 0.4, -1.5, 0.8, -0.75, 2]), a = pick([400, 800, 1200]);
      var t1 = a, t2 = R.roundDp(a * rr, 6), t3 = R.roundDp(a * rr * rr, 6);
      return nu('The first three terms of a geometric series are $' + t1 + '$, $' + t2 + '$, $' + t3 + '$. Find the common ratio $r$ (as a decimal).', rr,
        'Divide each term by the one before: $' + t2 + ' \\div ' + t1 + ' = ' + rr + '$. Check: $' + t3 + ' \\div ' + t2 + ' = ' + rr + '$.');
    }),
    G('trap-negative', function () {
      var r = pick([[-2, 1], [-3, 1], [-3, 2], [-5, 2], [-4, 3]]);
      return mq('A student writes: "$r = ' + fs(r) + '$, which is less than 1, so the series is convergent." What is wrong with this?',
        'The test is $|r| \\lt 1$, and here $|r| = ' + fs(fabs(r)) + ' \\gt 1$, so the series is not convergent',
        ['A convergent series needs $r$ to be positive, so a negative $r$ can never converge', 'The test should be $r \\gt 1$, so the series is convergent only if $r$ is larger than 1', 'Nothing is wrong, because any $r$ less than 1 gives a convergent series'],
        'Convergence depends on the size of $r$, not its sign. $|' + fs(r) + '| = ' + fs(fabs(r)) + ' \\gt 1$, so the terms grow in size and there is no sum to infinity. A negative $r$ with $|r| \\lt 1$ is perfectly fine.');
    }),
    G('range', function () {
      var m = rint(4, 12);
      return nu('A geometric series has common ratio $r = \\dfrac{k}{' + m + '}$, where $k$ is a positive integer. Find the largest value of $k$ for which the series has a sum to infinity.', m - 1,
        'The series converges when $|r| \\lt 1$, so $\\frac{k}{' + m + '} \\lt 1$ and $k \\lt ' + m + '$. The largest integer is $' + (m - 1) + '$.');
    }),
    G('range', function () {
      var m = rint(3, 9);
      return nu('A geometric series has common ratio $r = \\dfrac{x}{' + m + '}$, where $x$ is an integer. How many integer values of $x$ give a series with a sum to infinity?', 2 * m - 1,
        '$|r| \\lt 1$ means $|x| \\lt ' + m + '$, so $-' + m + ' \\lt x \\lt ' + m + '$. The integers are $-' + (m - 1) + ', \\dots, ' + (m - 1) + '$, which is $' + (2 * m - 1) + '$ values.');
    }),
    G('unknown-x', function () {
      var pr = pick([[3, 2], [2, 3], [-1, 2], [-2, 3], [4, 3], [3, 4], [-3, 2]]), q = pr[1], t = rint(1, 3), a = q * q * t;
      var r = fr(pr[0], pr[1]), p = a * pr[0] / q - a, qq = a * pr[0] * pr[0] / (q * q) - a;
      function sg(v) { return v < 0 ? '- ' + (-v) : '+ ' + v; }
      var conv = Math.abs(fv(r)) < 1, inv = fr(r[1], r[0]);
      function st(xv, rv, c) { return '$x = ' + xv + '$, $r = ' + fs(rv) + '$, ' + concl(c); }
      return mq('The first three terms of a geometric series are $x$, $x ' + sg(p) + '$, $x ' + sg(qq) + '$. Find $x$ and decide whether the series has a sum to infinity. Which is correct?',
        st(a, r, conv), [st(a, r, !conv), st(a, inv, Math.abs(fv(inv)) < 1), st(a + p, r, conv)],
        'Terms 1 and 2: $x \\times r = x ' + sg(p) + '$. Equating the ratios gives $x = ' + a + '$, so the terms are $' + a + ', ' + (a + p) + ', ' + (a + qq) + '$ and $r = ' + fs(r) + '$. $|r| = ' + fs(fabs(r)) + '$ is ' + (conv ? 'less' : 'greater') + ' than 1, ' + concl(conv) + '.');
    }),
    G('decide-multi', function () {
      var conv = ['\\frac{2}{3}', '-\\frac{3}{4}', '0.9', '-0.5', '\\frac{1}{10}', '-\\frac{4}{5}'], div = ['\\frac{5}{4}', '-2', '1', '-1', '\\frac{7}{3}', '3', '-\\frac{3}{2}'];
      var nc = rint(2, 3), cs = [], ds = [], i, j;
      while (cs.length < nc) { j = pick(conv); if (cs.indexOf(j) < 0) cs.push(j); }
      while (ds.length < 6 - nc) { j = pick(div); if (ds.indexOf(j) < 0) ds.push(j); }
      var all = cs.concat(ds), order = [0, 1, 2, 3, 4, 5].sort(function () { return Math.random() - 0.5; });
      var options = order.map(function (k) { return 'A geometric series with $r = ' + all[k] + '$'; });
      var answers = []; order.forEach(function (k, idx) { if (k < nc) answers.push(idx); });
      return { kind: 'multi', q: 'Which of these geometric series have a sum to infinity? Select all that apply.', options: options, answers: answers,
        why: 'A sum to infinity exists only when $|r| \\lt 1$. Here that is true for $r = ' + cs.join('$, $r = ') + '$. The others have $|r| \\ge 1$ (note $r = 1$ and $r = -1$ also fail).' };
    }),
    mc('boundary', 'The series $5 + 5 + 5 + 5 + \\dots$ is geometric with $r = 1$. Which statement is correct?',
      ['$|r| = 1$, which is not less than 1, so the series has no sum to infinity', '$|r| = 1 \\lt 1$ is false but the series still converges to 5', '$r = 1$, so the series converges to $\\frac{5}{1 - 1}$', '$r = 1$, so the series is convergent because $r$ is not negative'], 0,
      'Convergence needs $|r| \\lt 1$ strictly. With $r = 1$ the partial sums $5, 10, 15, \\dots$ keep growing, and $\\frac{5}{1-1}$ cannot be evaluated.'),
    mc('conclusion', 'A geometric series has $r = -\\frac{1}{2}$. Which is the best way to show that it is convergent?',
      ['$|r| = \\frac{1}{2} \\lt 1$, so the series is convergent', '$r = -\\frac{1}{2}$, so the series is convergent', '$r$ is negative, so the series is convergent', '$|r| \\lt 1$'], 0,
      'The mark needs the value of $|r|$, the comparison with 1 and a conclusion in words. Quoting only $r$, or only the condition, is not enough.'),
    mc('explain', 'The terms of a geometric series are $4$, $4\\sqrt{2}$, $8$, $\\dots$. Which is the best explanation of why it has no sum to infinity?',
      ['$r = \\sqrt{2}$, so $|r| \\gt 1$', '$r = \\sqrt{2}$, which is irrational', '$r = 4\\sqrt{2}$, which is greater than 1', 'the terms are positive, so the sum is infinite'], 0,
      '$r = 4\\sqrt{2} \\div 4 = \\sqrt{2} \\approx 1.41$, and $|r| \\gt 1$, so the terms grow and no sum to infinity exists. Being irrational is irrelevant, and $4\\sqrt{2}$ is a term, not the ratio.'),
    G('find-r-then-decide', function () {
      var r = pick([[5, 4], [4, 5], [-6, 5], [-5, 6], [7, 4], [-4, 7]]), a = r[1] * r[1] * rint(1, 3);
      var t2 = a * r[0] / r[1], t3 = a * r[0] * r[0] / (r[1] * r[1]), conv = Math.abs(fv(r)) < 1;
      return mq('A geometric series has first terms $' + a + '$, $' + t2 + '$, $' + t3 + '$. Which conclusion is correct?',
        stmt12(r, conv), [stmt12(r, !conv), stmt12(fr(r[1], r[0]), Math.abs(r[1] / r[0]) < 1), stmt12([-r[0], r[1]], conv)],
        '$r = ' + t2 + ' \\div ' + a + ' = ' + fs(r) + '$, so $|r| = ' + fs(fabs(r)) + '$, ' + (conv ? 'less' : 'greater') + ' than 1, ' + concl(conv) + '.');
    })
  ] };

  // =====================================================================
  // FPM-SER-13 Sum to infinity of a geometric series
  // =====================================================================
  var RP13 = [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4], [-1, 2], [-1, 3], [-2, 3], [-3, 4], [-2, 5], [-3, 5], [-1, 4]];
  function rp(r) { return r[0] < 0 ? '\\left(' + fs(r) + '\\right)' : fs(r); }
  B['FPM-SER-13'] = { title: 'Sum to infinity of a geometric series', items: [
    G('direct', function () {
      var r = pick(RP13), q = r[1], p = r[0], k = rint(1, 6), a = (q - p) * k, S = q * k;
      return nu('A geometric series has first term $' + a + '$ and common ratio $' + fs(fr(p, q)) + '$. Find its sum to infinity.', S,
        '$S_\\infty = \\frac{a}{1 - r} = \\frac{' + a + '}{1 - ' + rp(fr(p, q)) + '} = \\frac{' + a + '}{' + fs(fr(q - p, q)) + '} = ' + a + ' \\times ' + fs(fr(q, q - p)) + ' = ' + S + '$.');
    }),
    G('decimal', function () {
      var r = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, -0.5, -0.25, -0.2, -0.6]), S = pick([10, 20, 40, 50, 100]), a = R.roundDp((1 - r) * S, 4);
      return nu('A geometric series has first term $' + fmtD(a) + '$ and common ratio $' + fmtD(r) + '$. Find the sum to infinity.', S,
        '$S_\\infty = \\frac{a}{1 - r} = \\frac{' + fmtD(a) + '}{1 - ' + (r < 0 ? '(' + fmtD(r) + ')' : fmtD(r)) + '} = \\frac{' + fmtD(a) + '}{' + fmtD(R.roundDp(1 - r, 4)) + '} = ' + S + '$.');
    }),
    G('from-terms', function () {
      var r = pick(RP13), p = r[0], q = r[1], s = rint(1, 2), t = Math.abs(q - p) * s;
      var u1 = q * q * t, u2 = p * q * t, u3 = p * p * t, S = q * q * q * s;
      return nu('A geometric series begins $' + u1 + ' + ' + (u2 < 0 ? '(' + u2 + ')' : u2) + ' + ' + u3 + ' + \\dots$ Find the sum to infinity.', S,
        '$r = ' + u2 + ' \\div ' + u1 + ' = ' + fs(fr(p, q)) + '$, which has $|r| \\lt 1$. Then $S_\\infty = \\frac{' + u1 + '}{1 - ' + rp(fr(p, q)) + '} = ' + u1 + ' \\times ' + fs(fr(q, q - p)) + ' = ' + S + '$.');
    }),
    G('nth-term', function () {
      var r = pick(RP13), p = r[0], q = r[1], k = rint(1, 5), a = (q - p) * k, S = q * k;
      return nu('The $n$th term of a geometric series is $u_n = ' + a + ' \\times ' + (p < 0 ? '\\left(' + fs(fr(p, q)) + '\\right)' : '\\left(' + fs(fr(p, q)) + '\\right)') + '^{n-1}$. Find the sum to infinity.', S,
        'Putting $n = 1$ gives $a = ' + a + '$, and the number raised to the power $n - 1$ is $r = ' + fs(fr(p, q)) + '$. Then $S_\\infty = \\frac{' + a + '}{1 - ' + rp(fr(p, q)) + '} = ' + S + '$.');
    }),
    G('choose-r', function () {
      var pq = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]), p = pq[0], q = pq[1], m = rint(2, 5), k = rint(1, 4), a = (q - p) * k, S = q * k;
      return nu('A geometric series has first term $' + a + '$. Its common ratio $r$ satisfies $' + tm([q, 1], 'r^2') + ' - ' + (p + q * m) + 'r + ' + (p * m) + ' = 0$ and the series is convergent. Find the sum to infinity.', S,
        'Factorise: $(' + tm([q, 1], 'r') + ' - ' + p + ')(r - ' + m + ') = 0$, so $r = ' + fs(fr(p, q)) + '$ or $r = ' + m + '$. Only $r = ' + fs(fr(p, q)) + '$ has $|r| \\lt 1$. Then $S_\\infty = \\frac{' + a + '}{1 - ' + fs(fr(p, q)) + '} = ' + S + '$.');
    }),
    G('choose-r', function () {
      var pq = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]), p = pq[0], q = pq[1], m = rint(2, 5), k = rint(1, 4), a = (q - p) * k, S = q * k;
      var wrongA = fs(fr(a, 1 + m)), wrongB = fs(fr(a * q, q + p)), wrongC = fs(fr(a, 1 - m));
      return mq('A geometric series has first term $' + a + '$ and a common ratio $r$ with $(' + tm([q, 1], 'r') + ' - ' + p + ')(r + ' + m + ') = 0$. The series is convergent. What is its sum to infinity?',
        '$' + S + '$', ['$' + wrongA + '$', '$' + wrongB + '$', '$' + wrongC + '$'],
        'The roots are $r = ' + fs(fr(p, q)) + '$ and $r = -' + m + '$. Only $r = ' + fs(fr(p, q)) + '$ has $|r| \\lt 1$, so $S_\\infty = \\frac{' + a + '}{1 - ' + fs(fr(p, q)) + '} = ' + S + '$. Using $r = -' + m + '$ would give $' + wrongA + '$, but that series does not converge.');
    }),
    G('fraction-answer', function () {
      var r = pick([[1, 4], [1, 3], [2, 7], [3, 5], [-1, 4], [-2, 5], [1, 6]]), a = pick([3, 5, 7, 9, 11]);
      var one = fsub([1, 1], fr(r[0], r[1])), S = fdiv([a, 1], one);
      if (S[1] === 1) return null;
      return mq('A geometric series has first term $' + a + '$ and common ratio $' + fs(fr(r[0], r[1])) + '$. What is its exact sum to infinity?',
        '$' + fs(S) + '$', ['$' + fs(fdiv([a, 1], fadd([1, 1], fr(r[0], r[1])))) + '$', '$' + fs(fdiv(one, [a, 1])) + '$', '$' + fs(fmul([a, 1], one)) + '$'],
        '$S_\\infty = \\frac{a}{1 - r} = \\frac{' + a + '}{' + fs(one) + '} = ' + a + ' \\times ' + fs(fdiv([1, 1], one)) + ' = ' + fs(S) + '$.');
    }),
    G('surd', function () {
      var k = pick([2, 3, 5]), m = rint(1, 4), a = (k - 1) * m;
      function sq(c) { return tm([c, 1], '\\sqrt{' + k + '}'); }
      return mq('A geometric series has first term $' + a + '$ and common ratio $\\dfrac{1}{\\sqrt{' + k + '}}$. Find the exact sum to infinity.',
        '$' + (m * k) + ' + ' + sq(m) + '$', ['$' + (m * k) + ' - ' + sq(m) + '$', '$' + (m * (k + 1)) + ' + ' + sq(m) + '$', '$' + m + ' + ' + sq(m * k) + '$'],
        '$S_\\infty = \\frac{' + a + '}{1 - \\frac{1}{\\sqrt{' + k + '}}} = \\frac{' + a + '\\sqrt{' + k + '}}{\\sqrt{' + k + '} - 1}$. Multiply top and bottom by $\\sqrt{' + k + '} + 1$: $\\frac{' + a + '\\sqrt{' + k + '}(\\sqrt{' + k + '} + 1)}{' + (k - 1) + '} = ' + m + '(' + k + ' + \\sqrt{' + k + '}) = ' + (m * k) + ' + ' + sq(m) + '$.');
    }),
    mc('formula', 'A convergent geometric series has first term $a$ and common ratio $r$. Which expression gives the sum to infinity?',
      ['$\\dfrac{a}{1 - r}$', '$\\dfrac{a}{1 + r}$', '$\\dfrac{1 - r}{a}$', '$\\dfrac{a(1 - r^n)}{1 - r}$'], 0,
      '$S_\\infty = \\frac{a}{1-r}$. The last option is $S_n$, the sum of the first $n$ terms.'),
    mc('trap-sign', 'A student works out the sum to infinity of $12 - 4 + \\frac{4}{3} - \\dots$ as $\\dfrac{12}{1 - \\frac{1}{3}} = 18$. What is the mistake?',
      ['The ratio is $-\\frac{1}{3}$, so the denominator should be $1 - \\left(-\\frac{1}{3}\\right) = \\frac{4}{3}$, giving $9$', 'The formula should be $\\frac{a}{1 + r}$ with $r = \\frac{1}{3}$, which gives $9$ only by luck', 'The series is not convergent because it has a negative term', 'The first term should be $-4$, giving $S_\\infty = -6$'], 0,
      'Dividing $-4$ by $12$ gives $r = -\\frac{1}{3}$, and the sign matters: $S_\\infty = \\frac{12}{1 - (-\\frac{1}{3})} = \\frac{12}{\\frac{4}{3}} = 9$.'),
    mc('trap-r', 'Which geometric series can be given a sum to infinity using $\\dfrac{a}{1 - r}$?',
      ['$20 + 10 + 5 + \\dots$', '$3 + 6 + 12 + \\dots$', '$2 - 6 + 18 - \\dots$', '$5 + 5 + 5 + \\dots$'], 0,
      'The formula needs $|r| \\lt 1$. The first series has $r = \\frac{1}{2}$. The others have $r = 2$, $r = -3$ and $r = 1$.')
  ] };

  // =====================================================================
  // FPM-SER-14 Finding n in a geometric series with logarithms
  // =====================================================================
  function leastN(test) { for (var n = 1; n < 400; n++) if (test(n)) return n; return null; }
  B['FPM-SER-14'] = { title: 'Finding n in a geometric series with logarithms', items: [
    G('term-n', function () {
      var a = pick([2, 3, 4, 5, 6, 8]), r = pick([2, 3, 1.5, 2.5, 4]), n0 = rint(5, 11);
      var lo = a * Math.pow(r, n0 - 2), hi = a * Math.pow(r, n0 - 1), L = Math.round((lo + hi) / 2);
      var n = leastN(function (m) { return a * Math.pow(r, m - 1) > L; });
      if (n !== n0 || hi - lo < 4) return null;
      var y = Math.log(L / a) / Math.log(r) + 1;
      return nu('A geometric series has first term $' + a + '$ and common ratio $' + r + '$. Use logarithms to find the least value of $n$ for which the $n$th term is greater than $' + L + '$.', n,
        '$' + a + ' \\times ' + r + '^{n-1} \\gt ' + L + '$ gives $' + r + '^{n-1} \\gt ' + fmtD(R.roundDp(L / a, 4)) + '$. Taking logs: $(n-1)\\log ' + r + ' \\gt \\log ' + fmtD(R.roundDp(L / a, 4)) + '$, so $n \\gt ' + R.roundDp(y, 3) + '$. The least integer is $' + n + '$.');
    }),
    G('sum-n', function () {
      var a = pick([2, 3, 4, 5]), r = pick([2, 3, 1.5, 2.5]), n0 = rint(5, 10);
      function S(n) { return a * (Math.pow(r, n) - 1) / (r - 1); }
      var L = Math.round((S(n0 - 1) + S(n0)) / 2);
      var n = leastN(function (m) { return S(m) > L; });
      if (n !== n0 || S(n0) - S(n0 - 1) < 6) return null;
      var k = L * (r - 1) / a + 1;
      return nu('A geometric series has first term $' + a + '$ and common ratio $' + r + '$. Use logarithms to find the least value of $n$ for which $S_n \\gt ' + L + '$.', n,
        '$S_n = \\frac{' + a + '(' + r + '^n - 1)}{' + fmtD(r - 1) + '} \\gt ' + L + '$ gives $' + r + '^n \\gt ' + fmtD(R.roundDp(k, 4)) + '$. Then $n \\gt \\frac{\\log ' + fmtD(R.roundDp(k, 4)) + '}{\\log ' + r + '} = ' + R.roundDp(Math.log(k) / Math.log(r), 3) + '$, so the least $n$ is $' + n + '$.');
    }),
    G('sum-n-decreasing', function () {
      var a = pick([10, 20, 40, 60]), r = pick([0.5, 0.6, 0.8, 0.9, 0.75]), n0 = rint(4, 12);
      function S(n) { return a * (1 - Math.pow(r, n)) / (1 - r); }
      var X = R.roundDp((S(n0 - 1) + S(n0)) / 2, 1);
      var n = leastN(function (m) { return S(m) > X; });
      if (n !== n0 || X >= a / (1 - r) || S(n0) - S(n0 - 1) < 0.5) return null;
      var k = 1 - X * (1 - r) / a;
      return nu('A geometric series has first term $' + a + '$ and common ratio $' + r + '$. Use logarithms to find the least value of $n$ for which $S_n \\gt ' + X + '$.', n,
        '$\\frac{' + a + '(1 - ' + r + '^n)}{' + fmtD(1 - r) + '} \\gt ' + X + '$ gives $' + r + '^n \\lt ' + fmtD(R.roundDp(k, 5)) + '$. Taking logs and dividing by $\\log ' + r + '$ (which is negative, so the inequality reverses): $n \\gt ' + R.roundDp(Math.log(k) / Math.log(r), 3) + '$. The least $n$ is $' + n + '$.');
    }),
    G('tail', function () {
      var a = pick([8, 12, 20, 24]), r = pick([0.5, 0.6, 0.8, 0.75, 0.9]), n0 = rint(4, 14);
      function T(n) { return a * Math.pow(r, n) / (1 - r); }
      var eps = R.roundDp((T(n0 - 1) + T(n0)) / 2, 3);
      var n = leastN(function (m) { return T(m) < eps; });
      if (n !== n0 || eps <= 0 || T(n0 - 1) - T(n0) < 0.01) return null;
      var k = eps * (1 - r) / a;
      return nu('A geometric series has first term $' + a + '$ and common ratio $' + r + '$. It has sum to infinity $S$. Use logarithms to find the least value of $n$ for which $S - S_n \\lt ' + eps + '$.', n,
        '$S - S_n = \\frac{' + a + ' \\times ' + r + '^n}{' + fmtD(1 - r) + '} \\lt ' + eps + '$ gives $' + r + '^n \\lt ' + fmtD(R.roundDp(k, 6)) + '$. Dividing by the negative $\\log ' + r + '$ reverses the sign: $n \\gt ' + R.roundDp(Math.log(k) / Math.log(r), 3) + '$, so the least $n$ is $' + n + '$.');
    }),
    G('direction', function () {
      var small = Math.random() < 0.5, r = small ? pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]) : pick([1.5, 2, 3, 4]);
      var sig = pick(['\\lt', '\\gt']), kk = small ? pick([0.01, 0.02, 0.05, 0.1, 0.15, 0.25]) : pick([20, 50, 100, 250, 400, 600]);
      var flip = function (s) { return s === '\\lt' ? '\\gt' : '\\lt'; };
      var good = small ? flip(sig) : sig, ratio = '\\frac{\\log ' + kk + '}{\\log ' + r + '}', inv = '\\frac{\\log ' + r + '}{\\log ' + kk + '}';
      return mq('Solve $' + r + '^n ' + sig + ' ' + kk + '$ by taking logarithms. Which is the correct result?',
        '$n ' + good + ' ' + ratio + '$', ['$n ' + flip(good) + ' ' + ratio + '$', '$n ' + good + ' ' + inv + '$', '$n ' + flip(good) + ' ' + inv + '$'],
        '$n\\log ' + r + ' ' + sig + ' \\log ' + kk + '$. Now $\\log ' + r + '$ is ' + (small ? 'negative (since $0 \\lt ' + r + ' \\lt 1$), so dividing reverses the inequality' : 'positive (since $' + r + ' \\gt 1$), so dividing keeps the inequality') + ': $n ' + good + ' ' + ratio + '$.');
    }),
    G('isolate', function () {
      var a = pick([20, 40, 80]), r = pick([0.5, 0.8]), c = pick([0.75, 0.8, 0.9, 0.95]), X = a * c / (1 - r);
      var lhs = r + '^n';
      return mq('A geometric series has first term $' + a + '$ and common ratio $' + r + '$. The condition $S_n \\gt ' + X + '$ is rearranged to get $' + lhs + '$ on its own. Which result is correct?',
        '$' + lhs + ' \\lt ' + fmtD(R.roundDp(1 - c, 4)) + '$', ['$' + lhs + ' \\gt ' + fmtD(R.roundDp(1 - c, 4)) + '$', '$' + lhs + ' \\lt ' + c + '$', '$' + lhs + ' \\gt ' + c + '$'],
        '$S_n = \\frac{' + a + '(1 - ' + lhs + ')}{' + fmtD(1 - r) + '} \\gt ' + X + '$, so $1 - ' + lhs + ' \\gt ' + c + '$. Subtracting from 1 reverses the sign: $' + lhs + ' \\lt ' + fmtD(R.roundDp(1 - c, 4)) + '$.');
    }),
    G('round', function () {
      var y = rint(5, 22) + rint(1, 9) / 10, least = Math.random() < 0.5;
      var ans = least ? Math.ceil(y) : Math.floor(y);
      return mq('Solving an inequality for $n$ gives $n ' + (least ? '\\gt' : '\\lt') + ' ' + y + '$, where $n$ is a positive integer. What is the ' + (least ? 'least' : 'greatest') + ' possible value of $n$?',
        '$' + ans + '$', ['$' + (least ? Math.floor(y) : Math.ceil(y)) + '$', '$' + (least ? Math.ceil(y) + 1 : Math.floor(y) - 1) + '$', '$' + y + '$'],
        '$n$ must be a whole number. ' + (least ? 'Being greater than ' + y + ' means the least whole number is the next integer up, ' + ans + '.' : 'Being less than ' + y + ' means the greatest whole number is ' + ans + '.') + ' Do not round to the nearest integer without checking the direction.');
    }),
    G('equation', function () {
      var a = pick([2, 3, 5, 7]), r = pick([2, 3, 4, 5]), n0 = rint(4, 8), L = a * Math.pow(r, n0 - 1);
      return nu('The $n$th term of a geometric series is $' + a + ' \\times ' + r + '^{n-1}$. Use logarithms to find the value of $n$ for which the $n$th term is exactly $' + L + '$.', n0,
        '$' + r + '^{n-1} = ' + (L / a) + '$, so $(n-1)\\log ' + r + ' = \\log ' + (L / a) + '$ and $n - 1 = ' + (n0 - 1) + '$. Hence $n = ' + n0 + '$.');
    }),
    G('exact-n', function () {
      var up = Math.random() < 0.6, r = up ? pick([1.02, 1.05, 1.08, 1.1, 1.2]) : pick([0.9, 0.8, 0.95]), k = up ? pick([2, 3, 4, 5, 10]) : pick([0.5, 0.2, 0.1]);
      var n = Math.log(k) / Math.log(r), ans = R.roundSf(n, 3);
      return nu('Use logarithms to solve $' + r + '^n = ' + k + '$. Give $n$ to 3 significant figures.', ans,
        'Taking logs: $n\\log ' + r + ' = \\log ' + k + '$, so $n = \\frac{\\log ' + k + '}{\\log ' + r + '} = ' + n.toFixed(4) + '$, which is $' + ans + '$ to 3 s.f.', String(ans), tolSf(ans, 3));
    }),
    mc('error', 'A student solves $S_n \\gt 100$ with $S_n = 50(1 - 0.5^n)$ and writes: "$1 - 0.5^n \\gt 2$, so $\\log 1 - \\log 0.5^n \\gt \\log 2$". What is the error?',
      ['$\\log(1 - 0.5^n)$ is not $\\log 1 - \\log 0.5^n$, so $0.5^n$ must be isolated before taking logs', '$\\log 1$ should be 1, not 0', 'The inequality should have been $1 - 0.5^n \\lt 2$', 'Logs cannot be used with an inequality'], 0,
      'There is no law for $\\log(A - B)$. Rearrange to $0.5^n \\lt -1$ first, then take logs. (Here that is impossible, which shows $S_n$ can never reach 100.)'),
    mc('first-step', 'You are asked to find the least $n$ with $S_n \\gt 700$ for a geometric series with $a = 5$, $r = 3$. What should the first step be?',
      ['Write $\\frac{5(3^n - 1)}{2} \\gt 700$ and rearrange to isolate $3^n$', 'Take logs of $5$, $3^n - 1$ and $700$ separately', 'Divide 700 by 5 and take $n = 140$', 'Substitute $n = 1, 2, 3, \\dots$ until the sum exceeds 700'], 0,
      'Logs can only bring down a power that stands alone, so first isolate it: $3^n - 1 \\gt 280$, so $3^n \\gt 281$. "Using logarithms" means trial and improvement scores little.')
  ] };

  // =====================================================================
  // FPM-SER-15 Series made of logarithms
  // =====================================================================
  B['FPM-SER-15'] = { title: 'Series made of logarithms', items: [
    G('convert-base', function () {
      var m = rint(2, 4), p = rint(2, 5), q = rint(1, 5), n = rint(3, 8), c = m * (p * n + q);
      return nu('A series has $n$th term $u_n = (' + p + 'n + ' + q + ')\\ln ' + Math.pow(2, m) + '$. Given that $u_' + n + ' = c\\ln 2$, find the value of $c$.', c,
        '$u_' + n + ' = (' + p * n + ' + ' + q + ')\\ln ' + Math.pow(2, m) + ' = ' + (p * n + q) + '\\ln 2^{' + m + '} = ' + (p * n + q) + ' \\times ' + m + '\\ln 2 = ' + c + '\\ln 2$.');
    }),
    G('sum-arith', function () {
      var m = rint(1, 3), n = rint(6, 12), c = m * n * (n + 1) / 2;
      return nu('Find the sum of the first ' + n + ' terms of $\\ln ' + Math.pow(2, m) + ' + \\ln ' + Math.pow(2, 2 * m) + ' + \\ln ' + Math.pow(2, 3 * m) + ' + \\dots$ (each term is $\\ln 2^{' + m + 'k}$ for $k = 1, 2, 3, \\dots$), giving your answer as $c\\ln 2$. State $c$.', c,
        'The terms are $' + m + '\\ln 2,\\ ' + 2 * m + '\\ln 2,\\ ' + 3 * m + '\\ln 2,\\dots$, an arithmetic series with $a = d = ' + m + '\\ln 2$. $S_{' + n + '} = \\frac{' + n + '}{2}(' + m + ' + ' + (m * n) + ')\\ln 2 = ' + c + '\\ln 2$.');
    }),
    G('common-diff', function () {
      var a = pick([2, 3, 5, 7]), b = pick([2, 3, 4, 5, 6]);
      return mq('A series has first three terms $\\ln ' + a + '$, $\\ln ' + (a * b) + '$, $\\ln ' + (a * b * b) + '$. It is an arithmetic series. What is its common difference?',
        '$\\ln ' + b + '$', ['$\\ln ' + a + '$', '$\\ln ' + (a * b - a) + '$', '$\\ln ' + (a * b) + '$'],
        '$\\ln ' + (a * b) + ' - \\ln ' + a + ' = \\ln\\frac{' + (a * b) + '}{' + a + '} = \\ln ' + b + '$. Check: $\\ln ' + (a * b * b) + ' - \\ln ' + (a * b) + ' = \\ln ' + b + '$. Subtracting logs divides the numbers; it is not $\\ln(' + (a * b) + ' - ' + a + ')$.');
    }),
    G('log-law', function () {
      var b = rint(2, 5), a = b + rint(1, 4);
      return mq('Which of these statements is true?',
        '$\\ln ' + (a * b) + ' = \\ln ' + a + ' + \\ln ' + b + '$', ['$\\ln ' + (a + b) + ' = \\ln ' + a + ' + \\ln ' + b + '$', '$\\ln ' + (a - b) + ' = \\ln ' + a + ' - \\ln ' + b + '$', '$\\ln ' + (a * a) + ' = (\\ln ' + a + ')^2$'],
        'The law is $\\ln(xy) = \\ln x + \\ln y$: a product becomes a sum. Adding or subtracting inside the log does not split, and $\\ln x^2 = 2\\ln x$, not $(\\ln x)^2$.');
    }),
    G('geo-to-arith', function () {
      var base = pick([2, 3]), p = rint(1, 3), q = rint(1, 4), k = rint(6, 12), c = p + q * (k - 1);
      return nu('A geometric series has $n$th term $u_n = ' + Math.pow(base, p) + ' \\times ' + Math.pow(base, q) + '^{n-1}$. The numbers $\\log_{' + base + '} u_n$ form an arithmetic sequence. Find $\\log_{' + base + '} u_{' + k + '}$.', c,
        '$\\log_{' + base + '} u_n = ' + p + ' + (n-1) \\times ' + q + '$, since $\\log_{' + base + '}' + Math.pow(base, p) + ' = ' + p + '$ and $\\log_{' + base + '}' + Math.pow(base, q) + ' = ' + q + '$. So $\\log_{' + base + '} u_{' + k + '} = ' + p + ' + ' + (k - 1) + ' \\times ' + q + ' = ' + c + '$.');
    }),
    G('first-term', function () {
      var p = rint(2, 5), q = rint(1, 6), kk = pick([2, 3, 5]);
      return nu('A series has $n$th term $u_n = (' + p + 'n + ' + q + ')\\ln ' + kk + '$. Given that the first term is $c\\ln ' + kk + '$, find $c$.', p + q,
        'The first term uses $n = 1$ (not $n = 0$): $u_1 = (' + p + ' \\times 1 + ' + q + ')\\ln ' + kk + ' = ' + (p + q) + '\\ln ' + kk + '$.');
    }),
    G('solve-b', function () {
      var a = pick([2, 3, 5, 7]), b = pick([2, 3, 4, 5]);
      return nu('An arithmetic series has first term $\\ln ' + a + '$ and its third term is $\\ln ' + (a * b * b) + '$. The common difference is $\\ln b$ where $b$ is a positive integer. Find $b$.', b,
        'Third term $= \\ln ' + a + ' + 2\\ln b = \\ln(' + a + 'b^2) = \\ln ' + (a * b * b) + '$, so $' + a + 'b^2 = ' + (a * b * b) + '$, $b^2 = ' + (b * b) + '$ and $b = ' + b + '$.');
    }),
    G('simplify', function () {
      var p = rint(2, 6), q = rint(2, 6), r = rint(1, 3), c = p + q - r;
      return nu('Given that $\\ln ' + Math.pow(2, p) + ' + \\ln ' + Math.pow(2, q) + ' - \\ln ' + Math.pow(2, r) + ' = c\\ln 2$, find $c$.', c,
        'Write each as a multiple of $\\ln 2$: $' + p + '\\ln 2 + ' + q + '\\ln 2 - ' + r + '\\ln 2 = ' + c + '\\ln 2$.');
    }),
    mc('error', 'A student writes $\\ln 4 + \\ln 5 = \\ln 9$. What is the correct simplification?',
      ['$\\ln 20$', '$\\ln 9$', '$(\\ln 4)(\\ln 5)$', '$\\ln 1$'], 0,
      'Adding logs multiplies the numbers: $\\ln 4 + \\ln 5 = \\ln(4 \\times 5) = \\ln 20$. There is no rule that turns $\\ln a + \\ln b$ into $\\ln(a+b)$.'),
    mc('first-term', 'For a series with $u_n = \\ln 3 + (n-1)\\ln 5$, which statement is correct?',
      ['It is arithmetic with first term $\\ln 3$ and common difference $\\ln 5$', 'It is arithmetic with first term $\\ln 5$ and common difference $\\ln 3$', 'It is geometric with first term $\\ln 3$ and common ratio $\\ln 5$', 'It is arithmetic with first term $\\ln 3 - \\ln 5$ and common difference $\\ln 5$'], 0,
      'At $n = 1$ the bracket $(n-1)$ is zero, so $u_1 = \\ln 3$. Each increase of $n$ by 1 adds $\\ln 5$, so $d = \\ln 5$.'),
    mc('geo-link', 'The terms $u_n$ of a geometric series are positive, with first term $a$ and common ratio $r$. Taking logs of the terms gives which kind of sequence?',
      ['Arithmetic, with first term $\\log a$ and common difference $\\log r$', 'Geometric, with first term $\\log a$ and common ratio $\\log r$', 'Arithmetic, with first term $\\log a$ and common difference $r$', 'Arithmetic, with first term $a$ and common difference $\\log r$'], 0,
      '$\\log(ar^{n-1}) = \\log a + (n-1)\\log r$, which is linear in $n$, so it is arithmetic with $d = \\log r$.')
  ] };

  // =====================================================================
  // FPM-SER-18 Expanding a bracket with a negative or fractional power
  // =====================================================================
  function bq(n, b) { return fexpr(n, bracket(b)); }
  B['FPM-SER-18'] = { title: 'Expanding a bracket with a negative or fractional power', items: [
    G('coef-x2', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), cs = binom(n, b, 3), c = cs[2];
      if (c[1] !== 1 || c[0] === 0) return null;
      var B2 = binom(n, [1, 1], 2)[2];
      return nu('Find the coefficient of $x^2$ in the expansion of $' + bq(n, b) + '$ in ascending powers of $x$ (an integer).', c[0],
        'Use $\\frac{n(n-1)}{2}(bx)^2$ with $n = ' + fs(n) + '$, $b = ' + b[0] + '$: $\\frac{n(n-1)}{2} = ' + fs(B2) + '$ and $(bx)^2 = ' + b[0] * b[0] + 'x^2$. So the coefficient is $' + fs(B2) + ' \\times ' + b[0] * b[0] + ' = ' + c[0] + '$.');
    }),
    G('coef-x3', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), cs = binom(n, b, 3), c = cs[3];
      if (c[1] !== 1 || c[0] === 0) return null;
      var B3 = binom(n, [1, 1], 3)[3];
      return nu('Find the coefficient of $x^3$ in the expansion of $' + bq(n, b) + '$ in ascending powers of $x$ (an integer).', c[0],
        'Use $\\frac{n(n-1)(n-2)}{3!}(bx)^3$ with $n = ' + fs(n) + '$, $b = ' + b[0] + '$: $\\frac{n(n-1)(n-2)}{6} = ' + fs(B3) + '$ and $(bx)^3 = ' + Math.pow(b[0], 3) + 'x^3$. So the coefficient is $' + fs(B3) + ' \\times (' + Math.pow(b[0], 3) + ') = ' + c[0] + '$.');
    }),
    G('coef-frac', function () {
      var n = pick(NPOOL), b = fr(pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), 1), k = pick([2, 3]), cs = binom(n, b, 3), c = cs[k];
      if (c[0] === 0) return null;
      var Bk = binom(n, [1, 1], 3)[k], bk = Math.pow(b[0], k);
      var wrongNoPower = fmul(Bk, b), wrongSign = binom(n, fr(-b[0], 1), 3)[k], wrongFact = fmul(c, [k === 2 ? 2 : 6, 1]);
      return mq('What is the coefficient of $x^' + k + '$ in the expansion of $' + bq(n, b) + '$ in ascending powers of $x$?',
        '$' + fs(c) + '$', ['$' + fs(wrongNoPower) + '$', '$' + fs(wrongSign) + '$', '$' + fs(wrongFact) + '$'],
        'The coefficient is $' + (k === 2 ? '\\frac{n(n-1)}{2}' : '\\frac{n(n-1)(n-2)}{6}') + ' b^' + k + '$ with $n = ' + fs(n) + '$, $b = ' + b[0] + '$: $' + fs(Bk) + ' \\times (' + bk + ') = ' + fs(c) + '$. The whole of $bx$ is raised to the power, so $b^' + k + '$ is needed, and the factorial divides.');
    }),
    G('expand', function () {
      var n = pick(NPOOL), b = fr(pick([-6, -4, -3, -2, 2, 3, 4, 6]), 1), cs = binom(n, b, 3);
      var noPow = [[1, 1], fmul(n, b), fmul(binom(n, [1, 1], 2)[2], b), fmul(binom(n, [1, 1], 3)[3], b)];
      var neg = binom(n, fr(-b[0], 1), 3), nofact = [[1, 1], cs[1], fmul(cs[2], [2, 1]), fmul(cs[3], [6, 1])];
      return mq('Which is the expansion of $' + bq(n, b) + '$ in ascending powers of $x$ up to and including the term in $x^3$?',
        '$' + polyStr(cs) + ' + \\dots$', ['$' + polyStr(noPow) + ' + \\dots$', '$' + polyStr(neg) + ' + \\dots$', '$' + polyStr(nofact) + ' + \\dots$'],
        'Rewrite as $(1 + (' + b[0] + 'x))^{' + fs(n) + '}$ and use $1 + nX + \\frac{n(n-1)}{2}X^2 + \\frac{n(n-1)(n-2)}{6}X^3$ with $X = ' + b[0] + 'x$. Keep $X$ in brackets so the whole of $' + b[0] + 'x$ is squared and cubed. This gives $' + polyStr(cs) + ' + \\dots$');
    }),
    G('negative-power', function () {
      var m = pick([1, 2, 3]), b = pick(BINT), k = pick([2, 3]), cs = binom([-m, 1], fr(b, 1), 3), c = cs[k];
      var inner = '1 ' + (b < 0 ? '- ' : '+ ') + tm([Math.abs(b), 1], 'x');
      return nu('Find the coefficient of $x^' + k + '$ in the expansion of $\\dfrac{1}{' + (m === 1 ? '(' + inner + ')' : '(' + inner + ')^' + m) + '}$ in ascending powers of $x$.', c[0],
        'Write it as $(' + inner + ')^{-' + m + '}$ and use the binomial series with $n = -' + m + '$ and $X = ' + b + 'x$. The $x^' + k + '$ term is ' + (k === 2 ? '$\\frac{n(n-1)}{2}X^2$' : '$\\frac{n(n-1)(n-2)}{6}X^3$') + ', which gives $' + fs(binom([-m, 1], [1, 1], 3)[k]) + ' \\times (' + Math.pow(b, k) + ') = ' + c[0] + '$.');
    }),
    G('constant-out', function () {
      var m = rint(2, 4), n = pick([[1, 2], [3, 2]]), bp = fr(pick([-4, -3, -2, 2, 3, 4, 6, 8]), 1), A = m * m, Bc = bp[0] * A;
      var cs = binom(n, bp, 3), mult = Math.pow(m, n[0] === 1 ? 1 : 3), c = fmul([mult, 1], cs[2]);
      if (c[1] !== 1 || c[0] === 0) return null;
      return nu('Find the coefficient of $x^2$ in the expansion of $(' + A + ' ' + (Bc < 0 ? '- ' : '+ ') + Math.abs(Bc) + 'x)^{' + fs(n) + '}$ in ascending powers of $x$.', c[0],
        'Take out the constant: $(' + A + ' ' + (Bc < 0 ? '- ' : '+ ') + Math.abs(Bc) + 'x)^{' + fs(n) + '} = ' + A + '^{' + fs(n) + '}(1 ' + (bp[0] < 0 ? '- ' : '+ ') + tm(fabs(bp), 'x') + ')^{' + fs(n) + '} = ' + mult + '(1 ' + (bp[0] < 0 ? '- ' : '+ ') + tm(fabs(bp), 'x') + ')^{' + fs(n) + '}$. The $x^2$ coefficient inside is $' + fs(cs[2]) + '$, and multiplying by ' + mult + ' gives $' + c[0] + '$.');
    }),
    G('constant-form', function () {
      var m = rint(2, 5), A = m * m, Bc = pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 8]), ratio = fr(Bc, A);
      var good = m + '(' + bracket(ratio) + ')^{\\frac{1}{2}}';
      var w1 = A + '(' + bracket(ratio) + ')^{\\frac{1}{2}}', w2 = m + '(' + bracket(fr(Bc, 1)) + ')^{\\frac{1}{2}}', w3 = m + '(' + bracket(ratio) + ')^{2}';
      return mq('Which expression is equal to $\\sqrt{' + A + ' ' + (Bc < 0 ? '- ' : '+ ') + Math.abs(Bc) + 'x}$, written so that the bracket starts with 1?',
        '$' + good + '$', ['$' + w1 + '$', '$' + w2 + '$', '$' + w3 + '$'],
        '$' + A + ' ' + (Bc < 0 ? '- ' : '+ ') + Math.abs(Bc) + 'x = ' + A + '\\left(1 ' + (Bc < 0 ? '- ' : '+ ') + tm(fabs(ratio), 'x') + '\\right)$, so taking the square root gives $' + A + '^{\\frac{1}{2}} = ' + m + '$ outside, not $' + A + '$. The coefficient inside is $' + fs(ratio) + '$ because every term is divided by ' + A + '.');
    }),
    G('rewrite', function () {
      var root = pick([2, 3]), b = pick([-7, -5, -4, -3, -2, 2, 3, 4, 5]), inner = '1 ' + (b < 0 ? '- ' : '+ ') + Math.abs(b) + 'x';
      var ex = root === 2 ? '\\frac{1}{\\sqrt{' + inner + '}}' : '\\frac{1}{\\sqrt[3]{' + inner + '}}';
      var good = '(' + inner + ')^{-\\frac{1}{' + root + '}}', other = '1 ' + (b < 0 ? '+ ' : '- ') + Math.abs(b) + 'x';
      return mq('To expand $' + ex + '$ with the binomial series, which form should it be written in?',
        '$' + good + '$', ['$(' + inner + ')^{\\frac{1}{' + root + '}}$', '$(' + other + ')^{-\\frac{1}{' + root + '}}$', '$(' + inner + ')^{-' + root + '}$'],
        'A root is a power $\\frac{1}{' + root + '}$ and a reciprocal makes the power negative, so $' + ex + ' = ' + good + '$. The bracket itself is unchanged.');
    }),
    mc('mistake', 'A student expands $(1 - 4x)^{\\frac{1}{2}}$ and writes the $x^2$ term as $\\dfrac{\\frac{1}{2}\\left(-\\frac{1}{2}\\right)}{2}\\times(-4)x^2 = \\dfrac{1}{2}x^2$. What is the mistake?',
      ['$-4$ has not been squared: it should be $(-4x)^2 = 16x^2$, giving $-2x^2$', 'The factor $\\frac{n(n-1)}{2}$ should be $\\frac{n(n+1)}{2}$', 'The answer should be negative because $n$ is a fraction', 'The $x^2$ term should use $3!$ in the denominator'], 0,
      '$\\frac{n(n-1)}{2} = \\frac{\\frac12(-\\frac12)}{2} = -\\frac{1}{8}$ and $(-4x)^2 = 16x^2$, so the term is $-\\frac{1}{8}\\times 16x^2 = -2x^2$. Forgetting to square the $-4$ is the classic slip.'),
    mc('first-step', 'You are asked to expand $\\dfrac{1}{(2 + 3x)^2}$ in ascending powers of $x$. What should you do first?',
      ['Take out the 2: $\\frac{1}{4}\\left(1 + \\frac{3}{2}x\\right)^{-2}$', 'Write it as $(1 + 3x)^{-2}$ and expand', 'Expand $(2 + 3x)^2$ and invert the answer', 'Write it as $2^{-2}(1 + 3x)^{-2}$'], 0,
      'The series needs a bracket that starts with 1. $(2 + 3x)^{-2} = 2^{-2}\\left(1 + \\frac{3x}{2}\\right)^{-2} = \\frac{1}{4}\\left(1 + \\frac{3}{2}x\\right)^{-2}$: the $3x$ must also be divided by 2.')
  ] };

  // =====================================================================
  // FPM-SER-19 When is a binomial expansion valid?
  // =====================================================================
  function absx(s) { return '|x| \\lt ' + s; }
  B['FPM-SER-19'] = { title: 'When is a binomial expansion valid?', items: [
    G('simple', function () {
      var n = pick(NROOT), b = fr(pick(BINT), 1), R1 = fdiv([1, 1], fabs(b));
      return mq('State the range of values of $x$ for which the binomial expansion of $' + bq(n, b) + '$ is valid.',
        '$' + absx(fs(R1)) + '$', ['$' + absx('1') + '$', '$' + absx(fs(fabs(b))) + '$', '$x \\lt ' + fs(R1) + '$'],
        'The expansion of $(1 + bx)^n$ is valid when $|bx| \\lt 1$. Here $|' + b[0] + 'x| \\lt 1$, so $|x| \\lt \\frac{1}{' + Math.abs(b[0]) + '}$. Note the modulus: the sign of $b$ does not change the range.');
    }),
    G('unit-fraction', function () {
      var n = pick(NROOT), q = pick([2, 3, 4, 5, 8]), b = fr(pick([-1, 1]), q), R1 = fdiv([1, 1], fabs(b));
      return mq('State the range of values of $x$ for which the binomial expansion of $' + bq(n, b) + '$ is valid.',
        '$' + absx(fs(R1)) + '$', ['$' + absx('1') + '$', '$' + absx(fs(fabs(b))) + '$', '$' + absx(fs(fmul(fabs(b), [q, 1]))) + '$'].concat(['$' + absx(fs(fr(q * q, 1))) + '$']),
        '$|bx| \\lt 1$ with $b = ' + fs(b) + '$ gives $\\left|\\frac{x}{' + q + '}\\right| \\lt 1$, so $|x| \\lt ' + q + '$.');
    }),
    G('constant-out', function () {
      var n = pick(NROOT), A = pick([2, 3, 4, 5, 8, 9]), Bc = pick([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
      if (A === Math.abs(Bc)) return null;
      var inner = A + ' ' + (Bc < 0 ? '- ' : '+ ') + Math.abs(Bc) + 'x', rg = fr(A, Math.abs(Bc));
      return mq('State the range of values of $x$ for which the binomial expansion of $' + fexpr(n, inner) + '$ is valid.',
        '$' + absx(fs(rg)) + '$', ['$' + absx(fs(fr(Math.abs(Bc), A))) + '$', '$' + absx(fs(fr(1, Math.abs(Bc)))) + '$', '$' + absx(fs(fr(A * Math.abs(Bc), 1))) + '$'],
        'Take out ' + A + ' first: the bracket becomes $' + A + '\\left(1 ' + (Bc < 0 ? '- ' : '+ ') + tm(fabs(fr(Bc, A)), 'x') + '\\right)$. The condition is $\\left|\\frac{' + Math.abs(Bc) + 'x}{' + A + '}\\right| \\lt 1$, so $|x| \\lt \\frac{' + A + '}{' + Math.abs(Bc) + '}' + (rg[1] === 1 ? ' = ' + rg[0] : '') + '$.');
    }),
    G('reverse', function () {
      var k = rint(2, 12), R1 = fr(1, k);
      var n = pick(NROOT);
      return nu('The expansion of $' + fexpr(n, '1 + kx') + '$, where $k$ is a positive constant, is valid for $|x| \\lt \\frac{1}{' + k + '}$. Find $k$.', k,
        'The expansion of $(1 + kx)^n$ is valid for $|kx| \\lt 1$, that is $|x| \\lt \\frac{1}{k}$. Comparing with $\\frac{1}{' + k + '}$ gives $k = ' + k + '$.');
    }),
    G('reverse', function () {
      var A = pick([2, 3, 4, 5]), R1 = pick([0.5, 0.25, 0.2, 0.1]), k = A / R1;
      if (Math.abs(k - Math.round(k)) > 1e-9 || k > 40) return null;
      var n = pick(NROOT);
      return nu('The expansion of $' + fexpr(n, A + ' + kx') + '$, where $k$ is a positive constant, is valid for $|x| \\lt ' + R1 + '$. Find $k$.', k,
        'Take out ' + A + ': $' + A + '\\left(1 + \\frac{k}{' + A + '}x\\right)$, valid for $\\left|\\frac{kx}{' + A + '}\\right| \\lt 1$, that is $|x| \\lt \\frac{' + A + '}{k}$. So $\\frac{' + A + '}{k} = ' + R1 + '$ and $k = ' + k + '$.');
    }),
    G('integers', function () {
      var A = rint(3, 15), Bc = rint(2, 9), c = A / Bc;
      if (A % Bc === 0 || A < Bc) return null;
      var cnt = 2 * Math.floor(c) + 1, n = pick(NROOT);
      return nu('The binomial expansion of $' + fexpr(n, A + ' - ' + Bc + 'x') + '$ is used. How many integer values of $x$ is the expansion valid for?', cnt,
        'Valid when $\\left|\\frac{' + Bc + 'x}{' + A + '}\\right| \\lt 1$, that is $|x| \\lt \\frac{' + A + '}{' + Bc + '} = ' + R.roundDp(c, 3) + '$. The integers are $-' + Math.floor(c) + ', \\dots, ' + Math.floor(c) + '$, which is $' + cnt + '$ values.');
    }),
    G('valid-x', function () {
      var bb = pick([2, 4, 5, 8, 10]), sgn = pick([-1, 1]), c = 1 / bb, n = pick(NROOT);
      var good = R.roundDp(c * 0.5, 6), opts = [R.roundDp(c, 6), R.roundDp(c * 1.5, 6), R.roundDp(-c * 1.5, 6)];
      return mq('The expansion of $' + bq(n, fr(sgn * bb, 1)) + '$ is used. Which of these values of $x$ can be substituted into the expansion with the series still valid?',
        '$x = ' + good + '$', opts.map(function (v) { return '$x = ' + v + '$'; }),
        'The range is $|x| \\lt \\frac{1}{' + bb + '} = ' + c + '$. Only $x = ' + good + '$ is strictly inside it; $x = ' + c + '$ is on the boundary, and the other values are outside.');
    }),
    mc('modulus', 'What does $|x| \\lt 3$ mean?',
      ['$-3 \\lt x \\lt 3$', '$x \\lt 3$', '$x \\gt -3$', '$x \\lt -3$ or $x \\gt 3$'], 0,
      '$|x|$ is the size of $x$ ignoring sign, so $|x| \\lt 3$ means $x$ lies between $-3$ and $3$. Writing only $x \\lt 3$ loses the lower limit.'),
    mc('sign', 'Is the expansion of $(1 - 5x)^{-2}$ valid for the same range of $x$ as the expansion of $(1 + 5x)^{-2}$?',
      ['Yes, both are valid for $|x| \\lt \\frac{1}{5}$', 'No, the first is valid for $x \\lt \\frac{1}{5}$ only', 'No, the first is valid for $x \\gt -\\frac{1}{5}$ only', 'Yes, both are valid for $|x| \\lt 5$'], 0,
      'The condition is $|bx| \\lt 1$, which involves the size of $bx$. The sign of $b$ does not matter, so both need $|x| \\lt \\frac{1}{5}$.'),
    mc('common-error', 'A student says the expansion of $(3 + x)^{-3}$ is valid for $|x| \\lt 1$. What is the correct range?',
      ['$|x| \\lt 3$, because $(3 + x)^{-3} = \\frac{1}{27}\\left(1 + \\frac{x}{3}\\right)^{-3}$', '$|x| \\lt \\frac{1}{3}$', '$|x| \\lt 27$', 'The student is correct'], 0,
      'The bracket must start with 1 before the condition applies: $\\left|\\frac{x}{3}\\right| \\lt 1$ gives $|x| \\lt 3$.')
  ] };

  // =====================================================================
  // FPM-SER-20 Using a binomial expansion to estimate a value
  // =====================================================================
  function tgt(n, T) {
    if (n[0] === 1 && n[1] === 2) return '\\sqrt{' + T + '}';
    if (n[0] === -1 && n[1] === 2) return '\\dfrac{1}{\\sqrt{' + T + '}}';
    if (n[0] === -1 && n[1] === 1) return '\\dfrac{1}{' + T + '}';
    return '\\sqrt[3]{' + T + '}';
  }
  var B20 = [-5, -4, -3, -2, 2, 3, 4, 5];
  function estimateItem(pool) {
    return function () {
      var n = pick(pool), b = pick(B20), x0 = pick([0.01, 0.02, 0.03, 0.04, 0.05, 0.1]);
      var T = R.roundDp(1 + b * x0, 4), cs = binom(n, fr(b, 1), 3);
      var sum = 0, i; for (i = 0; i <= 3; i++) sum += fv(cs[i]) * Math.pow(x0, i);
      var frac = sum * 10000 - Math.floor(sum * 10000);
      if (Math.abs(frac - 0.5) < 0.03) return null;
      var ans = R.roundDp(sum, 4), parts = [];
      for (i = 0; i <= 3; i++) parts.push((fv(cs[i]) * Math.pow(x0, i)).toFixed(6));
      return nu('Given that $' + bq(n, fr(b, 1)) + ' = ' + polyStr(cs) + ' + \\dots$, use this expansion with a suitable value of $x$ to estimate $' + tgt(n, T) + '$, giving your answer to 4 decimal places.', ans,
        'Set $1 ' + (b < 0 ? '- ' : '+ ') + Math.abs(b) + 'x = ' + T + '$, so $x = ' + x0 + '$. Then the four terms are $' + parts.join(',\\ ') + '$, which add to ' + sum.toFixed(6) + ', so the estimate is $' + ans + '$ to 4 d.p.', fmtD(ans), 0.00006);
    };
  }
  B['FPM-SER-20'] = { title: 'Using a binomial expansion to estimate a value', items: [
    G('choose-x', function () {
      var n = pick(NROOT), b = pick(B20), x0 = pick([0.01, 0.02, 0.03, 0.04, 0.05, 0.1]), T = R.roundDp(1 + b * x0, 4);
      return nu('The expansion of $' + bq(n, fr(b, 1)) + '$ in powers of $x$ is to be used to estimate $' + tgt(n, T) + '$. What value of $x$ should be used?', x0,
        'Make the bracket equal the number being estimated: $1 ' + (b < 0 ? '- ' : '+ ') + Math.abs(b) + 'x = ' + T + '$, so $' + (b < 0 ? '-' : '') + tm(fabs(fr(b, 1)), 'x') + ' = ' + fmtD(R.roundDp(T - 1, 4)) + '$ and $x = ' + x0 + '$.');
    }),
    G('choose-x', function () {
      var n = pick(NROOT), b = pick(B20), x0 = pick([0.01, 0.02, 0.03, 0.04, 0.05, 0.1]), T = R.roundDp(1 + b * x0, 4);
      return mq('The expansion of $' + bq(n, fr(b, 1)) + '$ is to be used to estimate $' + tgt(n, T) + '$. Which value of $x$ should be substituted?',
        '$x = ' + x0 + '$', ['$x = ' + T + '$', '$x = ' + fmtD(R.roundDp(T - 1, 4)) + '$', '$x = ' + fmtD(R.roundDp(-x0, 6)) + '$'],
        'Solve $1 ' + (b < 0 ? '- ' : '+ ') + Math.abs(b) + 'x = ' + T + '$: $' + (b < 0 ? '-' : '') + tm(fabs(fr(b, 1)), 'x') + ' = ' + fmtD(R.roundDp(T - 1, 4)) + '$, so $x = ' + x0 + '$. Setting $x$ equal to the number itself, or forgetting to divide by ' + Math.abs(b) + ', gives the wrong value.');
    }),
    G('estimate', estimateItem(NROOT)),
    G('estimate', estimateItem([[1, 2], [-1, 2], [-1, 1], [1, 3]])),
    G('scale', function () {
      var s = pick([5, 10]), T = s === 5 ? pick([0.96, 0.84, 0.76, 0.92, 0.88, 0.72]) : pick([0.98, 0.97, 0.95, 0.93, 0.91]);
      var N = R.roundDp(s * s * T, 4), E = R.roundDp(Math.sqrt(T), 4), ans = R.roundDp(s * E, 4);
      return nu('An estimate for $\\sqrt{' + T + '}$ is $' + E + '$. Hence estimate $\\sqrt{' + N + '}$ giving your answer to 4 decimal places.', ans,
        '$' + N + ' = ' + s * s + ' \\times ' + T + '$, so $\\sqrt{' + N + '} = ' + s + '\\sqrt{' + T + '} \\approx ' + s + ' \\times ' + E + ' = ' + ans + '$.', fmtD(ans), 0.00006);
    }),
    G('valid-use', function () {
      var good = Math.random() < 0.5, n = pick(NROOT), b = pick([-4, -3, -2, 2, 3, 4]);
      var T = good ? R.roundDp(1 + b * pick([0.02, 0.05, 0.1]), 4) : pick([2.5, 3, 3.5, 5]);
      var x0 = R.roundDp((T - 1) / b, 6), v = R.roundDp(Math.abs(T - 1), 4);
      var ex = bq(n, fr(b, 1));
      if (good) return mq('A student wants to estimate $' + tgt(n, T) + '$ using the expansion of $' + ex + '$ with $x = ' + x0 + '$. Is this a suitable value of $x$?',
        'Yes, because $|' + b + 'x| = ' + v + ' \\lt 1$, so $x$ is inside the range of validity', ['No, because $x$ must be a whole number', 'No, because $x$ must be negative', 'No, because the expansion is only valid for $|x| \\gt 1$'],
        'The expansion is valid when $|' + b + 'x| \\lt 1$. Here $|' + b + ' \\times ' + x0 + '| = ' + v + '$, which is less than 1, so the series converges and the choice is fine.');
      return mq('A student wants to estimate $' + tgt(n, T) + '$ using the expansion of $' + ex + '$ with $x = ' + x0 + '$. Is this a suitable value of $x$?',
        'No, because $|' + b + 'x| = ' + v + ' \\gt 1$, so $x$ is outside the range of validity', ['Yes, because the expansion is valid for every $x$', 'Yes, because $x$ is small', 'No, because $x$ must be positive'],
        'The series only converges for $|' + b + 'x| \\lt 1$. Here $|' + b + ' \\times ' + x0 + '| = ' + v + ' \\gt 1$, so the series would give nonsense even with many terms.');
    }),
    G('percent-error', function () {
      var V = R.roundDp(1 + Math.random() * 8, 4), d = R.roundDp(rint(5, 200) / 10000, 4), E = R.roundDp(V + d, 4);
      var pct = d / V * 100, ans = R.roundSf(pct, 2);
      if (pct < 0.05) return null;
      return nu('The exact value of a number is $' + V + '$ and a series estimate of it is $' + E + '$. Find the percentage error in the estimate, as a number to 2 significant figures (do not include the % sign).', ans,
        'Percentage error $= \\frac{|\\text{estimate} - \\text{true}|}{\\text{true}} \\times 100 = \\frac{' + d + '}{' + V + '} \\times 100 = ' + pct.toFixed(4) + '$, which is $' + ans + '$ to 2 s.f.', String(ans), tolSf(ans, 2));
    }),
    mc('choice-of-x', 'To estimate $\\sqrt{0.76}$ a student substitutes $x = 0.76$ into the expansion of $\\sqrt{1 - 4x}$. Why is this wrong?',
      ['$x$ must make the bracket equal the number: $1 - 4x = 0.76$, so $x = 0.06$', '$x$ must always be a whole number', '$x$ should equal $\\sqrt{0.76}$', 'There is no mistake'], 0,
      'The series equals $\\sqrt{1 - 4x}$, so choose $x$ to make $1 - 4x = 0.76$, giving $x = 0.06$. A small $x$ also makes the series converge quickly.'),
    mc('rounding', 'When working out a series estimate to 4 decimal places, when should you round?',
      ['Only at the end, keeping full accuracy in each term until then', 'Each term to 4 decimal places before adding', 'Each term to 2 decimal places before adding', 'After the first two terms only'], 0,
      'Rounding the terms early can change the last digit of the total. Keep full values and round once at the end.'),
    mc('method', 'A question says "Use your expansion to estimate $\\sqrt{0.76}$". A student gives 0.8718 straight from a calculator. Why is this unlikely to earn the marks?',
      ['The method required is to substitute a value of $x$ into the series, with working shown', 'A calculator cannot find square roots', 'The answer must be a fraction', 'The answer should always have 3 significant figures'], 0,
      'The question asks for an estimate from the series, so the marks are for choosing $x$ and substituting it into the terms, not for the calculator value.')
  ] };

  // =====================================================================
  // FPM-SER-21 Multiplying a binomial expansion by another bracket
  // =====================================================================
  var PQ = [[1, 2], [2, 1], [3, -1], [-1, 2], [2, -3], [1, -2], [3, 2], [-2, 3], [1, 3], [2, 5]];
  B['FPM-SER-21'] = { title: 'Multiplying a binomial expansion by another bracket', items: [
    G('x1-coef', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), pq = pick(PQ), cs = binom(n, b, 3), c = fadd(fmul([pq[0], 1], cs[1]), [pq[1], 1]);
      if (c[1] !== 1) return null;
      return nu('Find the coefficient of $x$ in the expansion of $(' + lin([pq[0], 1], [pq[1], 1]) + ')' + bq(n, b) + '$ in ascending powers of $x$.', c[0],
        'The $x$ term comes from $' + pq[0] + ' \\times (' + fs(cs[1]) + 'x)$ and $' + pq[1] + 'x \\times 1$: $' + (pq[0] * fv(cs[1])) + ' + (' + pq[1] + ') = ' + c[0] + '$.');
    }),
    G('x2-coef', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), pq = pick(PQ), cs = binom(n, b, 3), c = fadd(fmul([pq[0], 1], cs[2]), fmul([pq[1], 1], cs[1]));
      if (c[1] !== 1 || c[0] === 0) return null;
      return nu('Find the coefficient of $x^2$ in the expansion of $(' + lin([pq[0], 1], [pq[1], 1]) + ')' + bq(n, b) + '$ in ascending powers of $x$.', c[0],
        'The binomial series is $' + polyStr(cs) + ' + \\dots$ The $x^2$ term of the product is $(' + pq[0] + ') \\times (' + fs(cs[2]) + ') + (' + pq[1] + ') \\times (' + fs(cs[1]) + ') = ' + c[0] + '$.');
    }),
    G('x3-coef', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), pq = pick(PQ), cs = binom(n, b, 3), c = fadd(fmul([pq[0], 1], cs[3]), fmul([pq[1], 1], cs[2]));
      if (c[1] !== 1 || c[0] === 0) return null;
      return nu('Find the coefficient of $x^3$ in the expansion of $(' + lin([pq[0], 1], [pq[1], 1]) + ')' + bq(n, b) + '$ in ascending powers of $x$.', c[0],
        'The binomial series is $' + polyStr(cs) + ' + \\dots$ The $x^3$ term of the product is $(' + pq[0] + ') \\times (' + fs(cs[3]) + ') + (' + pq[1] + ') \\times (' + fs(cs[2]) + ') = ' + c[0] + '$.');
    }),
    G('x3-frac', function () {
      var n = pick(NROOT), b = fr(pick([-4, -3, -2, 2, 3, 4, 5]), 1), pq = pick([[2, 1], [3, -1], [2, -3], [3, 2], [4, 1], [5, -2]]), cs = binom(n, b, 3);
      var c = fadd(fmul([pq[0], 1], cs[3]), fmul([pq[1], 1], cs[2]));
      var w1 = fmul([pq[0], 1], cs[3]), w2 = fadd(cs[3], fmul([pq[1], 1], cs[2])), w3 = fadd(fmul([pq[0], 1], cs[3]), fmul([pq[1], 1], cs[1]));
      return mq('What is the coefficient of $x^3$ in the expansion of $(' + lin([pq[0], 1], [pq[1], 1]) + ')' + bq(n, b) + '$ in ascending powers of $x$?',
        '$' + fs(c) + '$', ['$' + fs(w1) + '$', '$' + fs(w2) + '$', '$' + fs(w3) + '$'],
        'Binomial series: $' + polyStr(cs) + ' + \\dots$ The $x^3$ term of the product has two contributions: $(' + pq[0] + ') \\times (' + fs(cs[3]) + ')$ from the constant and $(' + pq[1] + ') \\times (' + fs(cs[2]) + ')$ from the $x$ term. Adding gives $' + fs(c) + '$.');
    }),
    G('find-k', function () {
      var n = pick(NPOOL), b = fr(pick(BINT), 1), k = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), cs = binom(n, b, 3);
      var c = fadd(cs[2], fmul([k, 1], cs[1]));
      if (c[1] !== 1 || cs[1][0] === 0) return null;
      return nu('The coefficient of $x^2$ in the expansion of $(1 + kx)' + bq(n, b) + '$ is $' + c[0] + '$. Find the value of $k$.', k,
        'The binomial series is $' + polyStr(cs) + ' + \\dots$ The $x^2$ coefficient of the product is $' + fs(cs[2]) + ' + k \\times (' + fs(cs[1]) + ') = ' + c[0] + '$, so $' + fs(cs[1]) + 'k = ' + fs(fsub([c[0], 1], cs[2])) + '$ and $k = ' + k + '$.');
    }),
    G('series', function () {
      var p = pick([1, 2, 3, -1]), q = pick([1, 2, -1, -2, 3]), m = pick([2, 3, 4, 5]), nn = pick([1, -1, 2, -2, 3]);
      var base = fr(nn, m), cs = binom([-1, 1], base, 2), prod = mulLin([p, 1], [q, 1], cs, 2).map(function (c) { return fmul(c, [1, m]); });
      var noconst = mulLin([p, 1], [q, 1], cs, 2), neg = mulLin([p, 1], [q, 1], binom([-1, 1], fr(-nn, m), 2), 2).map(function (c) { return fmul(c, [1, m]); });
      var nocross = [prod[0], prod[1], fmul(fmul([p, 1], cs[2]), [1, m])];
      if (neg[1][0] === 0 && neg[2][0] === 0) return null;
      return mq('Find the expansion of $\\dfrac{' + lin([p, 1], [q, 1]) + '}{' + lin([m, 1], [nn, 1]) + '}$ in ascending powers of $x$, up to and including the term in $x^2$.',
        '$' + polyStr(prod) + ' + \\dots$', ['$' + polyStr(noconst) + ' + \\dots$', '$' + polyStr(neg) + ' + \\dots$', '$' + polyStr(nocross) + ' + \\dots$'],
        'Write it as $(' + lin([p, 1], [q, 1]) + ')(' + lin([m, 1], [nn, 1]) + ')^{-1} = \\frac{1}{' + m + '}(' + lin([p, 1], [q, 1]) + ')\\left(1 ' + (nn < 0 ? '- ' : '+ ') + tm(fabs(base), 'x') + '\\right)^{-1}$. The bracket expands to $' + polyStr(cs) + ' + \\dots$ Multiply by the first bracket, collect like powers and multiply by $\\frac{1}{' + m + '}$: $' + polyStr(prod) + ' + \\dots$');
    }),
    G('rewrite', function () {
      var p = pick([1, 2, 3]), q = pick([1, 2, -1, 3]), m = pick([2, 3, 4]), nn = pick([1, 2, 3, -2]), e = pick([1, 2]);
      var num = lin([p, 1], [q, 1]), den = lin([m, 1], [nn, 1]);
      var q1 = '\\dfrac{' + num + '}{' + (e === 1 ? den : '(' + den + ')^2') + '}';
      return mq('To use the binomial series, $' + q1 + '$ is first written as a product. Which form is correct?',
        '$(' + num + ')(' + den + ')^{-' + e + '}$', ['$(' + num + ')(' + den + ')^{' + e + '}$', '$(' + den + ')(' + num + ')^{-' + e + '}$', '$(' + num + ')(' + lin([m, 1], [-nn, 1]) + ')^{-' + e + '}$'],
        'Dividing by a bracket to the power ' + e + ' is multiplying by that bracket to the power $-' + e + '$. The numerator stays as it is: $' + q1 + ' = (' + num + ')(' + den + ')^{-' + e + '}$.');
    }),
    mc('which-terms', 'When finding the $x^3$ term of $(1 + 2x)(1 + ax + bx^2 + cx^3 + \\dots)$, which products contribute?',
      ['$1 \\times cx^3$ and $2x \\times bx^2$', '$1 \\times cx^3$ only', '$2x \\times cx^3$ and $1 \\times bx^2$', '$2x \\times ax$ and $1 \\times cx^3$'], 0,
      'Pairs of terms whose powers add to 3: $x^0 \\times x^3$ and $x^1 \\times x^2$. So the coefficient is $c + 2b$.'),
    mc('ignore', 'A product is being expanded up to and including $x^3$. Which product of terms can be ignored?',
      ['$x \\times x^3$, because it gives a term in $x^4$', '$x \\times x^2$, because it gives a term in $x^3$', '$1 \\times x^3$, because it gives a term in $x^3$', 'None, every product must be kept'], 0,
      'Anything giving $x^4$ or higher is beyond what is asked and is also incomplete, so leave it out.'),
    mc('validity', 'The binomial series for $(1 - 3x)^{-\\frac{1}{2}}$ is valid for $|x| \\lt \\frac{1}{3}$. For what values of $x$ is the expansion of $(1 + 2x)(1 - 3x)^{-\\frac{1}{2}}$ valid?',
      ['$|x| \\lt \\frac{1}{3}$, the same as for the binomial factor', '$|x| \\lt \\frac{1}{2}$', '$|x| \\lt \\frac{1}{5}$', '$|x| \\lt 1$'], 0,
      'Multiplying by $(1 + 2x)$ does not change the convergence. The product is valid wherever the binomial series is, so $|x| \\lt \\frac{1}{3}$.')
  ] };

  // =====================================================================
  // FPM-SER-22 Finding unknown constants from binomial coefficients
  // =====================================================================
  function c12(n, a) { return [n * a, n * (n - 1) * a * a / 2]; }
  var N22 = [-6, -5, -4, -3, -2, 3, 4, 5, 6, 7], A22 = [-3, -2, -1, 1, 2, 3];
  function base22() {
    var n = pick(N22), a = pick(A22), c = c12(n, a);
    return { n: n, a: a, c1: c[0], c2: c[1], c3: n * (n - 1) * (n - 2) * a * a * a / 6 };
  }
  B['FPM-SER-22'] = { title: 'Finding unknown constants from binomial coefficients', items: [
    G('find-n', function () {
      var s = base22(), n = s.c1 * s.c1 / (s.c1 * s.c1 - 2 * s.c2);
      return nu('In the expansion of $(1 + ax)^n$ in ascending powers of $x$, the coefficient of $x$ is $' + s.c1 + '$ and the coefficient of $x^2$ is $' + s.c2 + '$. Find the value of $n$.', s.n,
        '$na = ' + s.c1 + '$ and $\\frac{n(n-1)}{2}a^2 = ' + s.c2 + '$. Substitute $a = \\frac{' + s.c1 + '}{n}$: $\\frac{(n-1)}{2n} \\times ' + (s.c1 * s.c1) + ' = ' + s.c2 + '$, so $' + (s.c1 * s.c1) + '(n - 1) = ' + (2 * s.c2) + 'n$ and $n = ' + s.n + '$.');
    }),
    G('find-a', function () {
      var s = base22();
      return nu('In the expansion of $(1 + ax)^n$ in ascending powers of $x$, the coefficient of $x$ is $' + s.c1 + '$ and the coefficient of $x^2$ is $' + s.c2 + '$. Find the value of $a$.', s.a,
        'Eliminating gives $n = ' + s.n + '$ (from $\\frac{n-1}{2n} = \\frac{' + s.c2 + '}{' + (s.c1 * s.c1) + '}$). Then $na = ' + s.c1 + '$ gives $a = \\frac{' + s.c1 + '}{' + s.n + '} = ' + s.a + '$.');
    }),
    G('hence', function () {
      var s = base22();
      return nu('In the expansion of $(1 + ax)^n$ in ascending powers of $x$, the coefficient of $x$ is $' + s.c1 + '$ and the coefficient of $x^2$ is $' + s.c2 + '$. Find the coefficient of $x^3$.', s.c3,
        'From the two equations, $n = ' + s.n + '$ and $a = ' + s.a + '$. The $x^3$ coefficient is $\\frac{n(n-1)(n-2)}{6}a^3 = \\frac{(' + s.n + ')(' + (s.n - 1) + ')(' + (s.n - 2) + ')}{6} \\times (' + Math.pow(s.a, 3) + ') = ' + s.c3 + '$.');
    }),
    G('find-a-sign', function () {
      var n = pick([-4, -3, -2, 3, 4, 5]), a = pick([-3, -2, -1, 1, 2, 3]), neg = a < 0, c2 = n * (n - 1) * a * a / 2;
      return nu('In the expansion of $(1 + ax)^{' + n + '}$ in ascending powers of $x$, the coefficient of $x^2$ is $' + c2 + '$ and $a$ is ' + (neg ? 'negative' : 'positive') + '. Find the value of $a$.', a,
        '$\\frac{n(n-1)}{2}a^2 = ' + c2 + '$ with $n = ' + n + '$ gives $' + (n * (n - 1) / 2) + 'a^2 = ' + c2 + '$, so $a^2 = ' + (a * a) + '$ and $a = \\pm ' + Math.abs(a) + '$. Since $a$ is ' + (neg ? 'negative' : 'positive') + ', $a = ' + a + '$.');
    }),
    G('equal-coefs', function () {
      var a = pick([1, 3, -1, 1.5, 0.5, -0.5]), n = 2 + 3 / a;
      return nu('The coefficients of $x^2$ and $x^3$ in the expansion of $(1 ' + (a < 0 ? '- ' : '+ ') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x)^n$ are equal and non-zero. Find the value of $n$.', n,
        '$\\frac{n(n-1)}{2}a^2 = \\frac{n(n-1)(n-2)}{6}a^3$. Cancelling $\\frac{n(n-1)a^2}{2}$ gives $1 = \\frac{(n-2)a}{3}$, so $(n-2)a = 3$. With $a = ' + a + '$: $n - 2 = ' + fmtD(3 / a) + '$ and $n = ' + fmtD(n) + '$.');
    }),
    G('quadratic', function () {
      var a = pick([1, 2, 3]), pos = Math.random() < 0.5, n = pos ? rint(3, 9) : -rint(2, 7), T = a * a * n * (n - 1) / 2;
      return nu('The coefficient of $x^2$ in the expansion of $(1 + ' + (a === 1 ? '' : a) + 'x)^n$ is $' + T + '$, where $n$ is ' + (pos ? 'greater than 1' : 'negative') + '. Find the value of $n$.', n,
        '$\\frac{n(n-1)}{2} \\times ' + (a * a) + ' = ' + T + '$ gives $n(n-1) = ' + (2 * T / (a * a)) + '$, so $n^2 - n - ' + (2 * T / (a * a)) + ' = 0$ and $n = ' + n + '$ or $n = ' + (1 - n) + '$. The condition that $n$ is ' + (pos ? 'greater than 1' : 'negative') + ' picks $n = ' + n + '$.');
    }),
    G('form-eqs', function () {
      var s = base22();
      return mq('In the expansion of $(1 + ax)^n$, the coefficient of $x$ is $' + s.c1 + '$ and the coefficient of $x^3$ is $' + s.c3 + '$. Which pair of equations is correct?',
        '$na = ' + s.c1 + '$ and $\\dfrac{n(n-1)(n-2)}{6}a^3 = ' + s.c3 + '$',
        ['$na = ' + s.c1 + '$ and $\\dfrac{n(n-1)(n-2)}{6}a = ' + s.c3 + '$', '$na = ' + s.c1 + '$ and $\\dfrac{n(n-1)(n-2)}{3}a^3 = ' + s.c3 + '$', '$na = ' + s.c1 + '$ and $n(n-1)(n-2)a^3 = ' + s.c3 + '$'],
        'The $x$ term of $1 + n(ax) + \\frac{n(n-1)}{2!}(ax)^2 + \\frac{n(n-1)(n-2)}{3!}(ax)^3$ gives $na$. The $x^3$ term needs $(ax)^3 = a^3x^3$ and divides by $3! = 6$.');
    }),
    mc('letter-coef', 'What is the coefficient of $x^2$ in the expansion of $(1 + ax)^n$?',
      ['$\\dfrac{n(n-1)}{2}a^2$', '$\\dfrac{n(n-1)}{2}a$', '$n(n-1)a^2$', '$\\dfrac{n(n+1)}{2}a^2$'], 0,
      'The term is $\\frac{n(n-1)}{2!}(ax)^2 = \\frac{n(n-1)}{2}a^2x^2$. The $a$ must be squared along with $x$.'),
    mc('cancel', 'The coefficients of $x^2$ and $x^3$ in $(1 + ax)^n$ are equal, so $\\dfrac{n(n-1)}{2}a^2 = \\dfrac{n(n-1)(n-2)}{6}a^3$. For $n \\gt 2$ and $a \\neq 0$, which equation results after cancelling common factors?',
      ['$(n-2)a = 3$', '$na = 3$', '$(n-2)a^2 = 3$', '$(n-2)a = \\frac{1}{3}$'], 0,
      'Divide both sides by $\\frac{n(n-1)a^2}{2}$. The left side becomes 1 and the right side becomes $\\frac{(n-2)a}{3}$, so $(n-2)a = 3$.'),
    mc('condition', 'Solving for $n$ gives $n = -1$ or $n = 5$. The question says "$n \\gt 2$". Which statement is correct?',
      ['Choose $n = 5$, because $-1$ does not satisfy $n \\gt 2$', 'Choose $n = -1$, because it is the first solution found', 'Both are acceptable', 'Choose $n = 5$, because positive numbers are always preferred'], 0,
      'Always check solutions against the conditions in the question. Only $n = 5$ satisfies $n \\gt 2$.')
  ] };
})();
