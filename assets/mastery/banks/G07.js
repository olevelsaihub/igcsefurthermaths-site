/* Group G07 mastery bank: Logarithms and surds (what a log means, binomial-ready brackets, surds, log equations, exponential equations, log quadratics, simultaneous index/log equations); Quadratics (completing the square, max and min, the discriminant, sum and product of roots, difference of roots, roots conditions, forming new quadratics). Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function cl(x) { return Number(x.toPrecision(12)); }
  // rationals as [n, d] with d > 0, lowest terms
  function rn(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return [n / g, d / g]; }
  function radd(a, b) { return rn(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rsub(a, b) { return radd(a, [-b[0], b[1]]); }
  function rmul(a, b) { return rn(a[0] * b[0], a[1] * b[1]); }
  function rinv(a) { return rn(a[1], a[0]); }
  function rneg(a) { return [-a[0], a[1]]; }
  function ri(n) { return [n, 1]; }
  function rs(r) { return r[1] === 1 ? String(r[0]) : (r[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(r[0]) + '}{' + r[1] + '}'; }
  function fr(n, d) { return rs(rn(n, d)); }
  function rmag(r, v) { var n = Math.abs(r[0]), d = r[1]; v = v || ''; if (d === 1) return (n === 1 && v) ? v : (n + v); return '\\frac{' + n + '}{' + d + '}' + v; }
  function rsg(r, v) { return (r[0] < 0 ? ' - ' : ' + ') + rmag(r, v); }          // " + 3x", " - \frac{1}{2}"
  function rfirst(r, v) { return (r[0] < 0 ? '-' : '') + rmag(r, v); }              // leading term
  function co(c, v) { return c === 1 ? v : (c === -1 ? '-' + v : c + v); }
  function sg(c, v) { var a = Math.abs(c); return (c < 0 ? ' - ' : ' + ') + ((a === 1 && v) ? v : a + v); }
  function lin(a, b, v) { var s = ''; if (a !== 0) s = co(a, v); if (b !== 0) s += s ? sg(b, '') : String(b); return s || '0'; }
  function poly(a, b, c, v) { var s = co(a, v + '^2'); if (b !== 0) s += sg(b, v); if (c !== 0) s += sg(c, ''); return s; }
  // a + b sqrt(m) written cleanly
  function sf(a, b, m) {
    var r = '';
    if (a !== 0) r = String(a);
    if (b !== 0) { var t = (Math.abs(b) === 1 ? '' : Math.abs(b)) + '\\sqrt{' + m + '}'; r += r === '' ? (b < 0 ? '-' : '') + t : (b < 0 ? ' - ' : ' + ') + t; }
    return r === '' ? '0' : r;
  }
  function sq(c, m) { return sf(0, c, m); }
  // c/d times sqrt(m), reduced
  function cs(n, d, m) { var r = rn(n, d); if (r[1] === 1) return sq(r[0], m); return (r[0] < 0 ? '-' : '') + '\\frac{' + (Math.abs(r[0]) === 1 ? '' : Math.abs(r[0])) + '\\sqrt{' + m + '}}{' + r[1] + '}'; }
  // sqrt(n) simplified: returns {s, m} with n = s^2 m, m squarefree
  function simp(n) { var s = 1, m = n; for (var f = 2; f * f <= m; f++) { while (m % (f * f) === 0) { m /= f * f; s *= f; } } return { s: s, m: m }; }
  function sqrtS(n) { var t = simp(n); return t.m === 1 ? String(t.s) : sq(t.s, t.m); }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function smooth(d) { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
  function ufr(n, d) { return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}'; }
  function dm(s) { return '$' + s + '$'; }
  // 3 s.f. tolerance (half a unit in the last figure, a hair more)
  function tol3(x) { var e = Math.floor(Math.log10(Math.abs(x))); return 0.5 * Math.pow(10, e - 2) * 1.0001; }
  // numeric item
  function N(q, ans, why, disp, tol) { ans = cl(ans); return { kind: 'num', q: q, answer: ans, tol: tol == null ? 1e-9 : tol, unit: '', display: dm(disp == null ? ans : disp), why: why }; }
  function N3(q, ans, why) { var v = R.roundSf(ans, 3); return { kind: 'num', q: q, answer: v, tol: tol3(v), unit: '', display: dm(v), why: why }; }
  // mcq with the correct option first; wrongs are de-duplicated and trimmed to 3
  function M(q, correct, wrongs, why) {
    var opts = [correct];
    wrongs.forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 4) opts.push(w); });
    if (opts.length < 4) throw new Error('not enough distinct options: ' + JSON.stringify(opts));
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function S(skill, item) { item.skill = skill; return item; }   // static item
  function G(skill, fn) { return { skill: skill, gen: fn }; }      // generated item

  // =====================================================================
  // FPM-LOG-01 What a log means
  // =====================================================================
  B['FPM-LOG-01'] = { title: 'What a log means: reading values and switching to index form', items: [
    G('read-value', function () {
      var b = pick([2, 3, 4, 5, 6, 10]), k = rint(1, b === 10 ? 3 : 4), n = Math.pow(b, k);
      return N('Write down the value of $\\log_{' + b + '} ' + n + '$.', k, 'Ask what power of ' + b + ' gives ' + n + '. Since $' + b + '^{' + k + '} = ' + n + '$, $\\log_{' + b + '} ' + n + ' = ' + k + '$.');
    }),
    G('read-value', function () {
      var b = pick([2, 3, 5, 10]), k = rint(2, 4), n = Math.pow(b, k);
      return M('Find the value of $\\log_{' + b + '} \\frac{1}{' + n + '}$.', dm(-k), [dm(k), dm('-\\frac{1}{' + k + '}'), dm('\\frac{1}{' + k + '}')],
        '$\\frac{1}{' + n + '} = ' + b + '^{-' + k + '}$, so the power of ' + b + ' that gives it is $-' + k + '$. Log values can be negative.');
    }),
    G('find-unknown', function () {
      var a = rint(2, 7), c = rint(2, 4), n = Math.pow(a, c);
      return N('Find the value of $a$ such that $\\log_a ' + n + ' = ' + c + '$.', a, 'In index form $a^{' + c + '} = ' + n + '$. Since $' + a + '^{' + c + '} = ' + n + '$ and a base must be positive, $a = ' + a + '$.');
    }),
    G('index-form', function () {
      var L = pick(['p', 'q', 't', 'm']), c = rint(2, 7);
      return M('Given that $\\log_{' + L + '} x = ' + c + '$, express $x$ in terms of $' + L + '$.', dm('x = ' + L + '^{' + c + '}'),
        [dm('x = ' + c + '^{' + L + '}'), dm('x = ' + c + L), dm('x = \\frac{' + c + '}{' + L + '}')],
        'Switch to index form: the base ' + L + ' is raised to the log value ' + c + ' to give $x$, so $x = ' + L + '^{' + c + '}$.');
    }),
    G('index-form', function () {
      var t = pick([['a', 'b', 'c'], ['p', 'q', 'r'], ['x', 'y', 'z'], ['k', 'm', 'n']]), A = t[0], Bq = t[1], C = t[2];
      return M('Which statement is equivalent to $\\log_{' + A + '} ' + Bq + ' = ' + C + '$?', dm(A + '^{' + C + '} = ' + Bq),
        [dm(C + '^{' + A + '} = ' + Bq), dm(Bq + '^{' + C + '} = ' + A), dm(A + '^{' + Bq + '} = ' + C)],
        '$\\log_a b = c$ means $a^c = b$: the base is raised to the log value to give the number. Here that is $' + A + '^{' + C + '} = ' + Bq + '$.');
    }),
    G('read-value', function () {
      var b = pick([2, 3, 5, 7, 10]), k = rint(2, 4);
      return N('Find the value of $\\log_{' + b + '} ' + b + ' + \\log_{' + b + '} 1 + \\log_{' + b + '} ' + Math.pow(b, k) + '$.', k + 1,
        '$\\log_{' + b + '} ' + b + ' = 1$, $\\log_{' + b + '} 1 = 0$ and $\\log_{' + b + '} ' + Math.pow(b, k) + ' = ' + k + '$. The total is $1 + 0 + ' + k + ' = ' + (k + 1) + '$.');
    }),
    G('find-unknown', function () {
      var o = pick([[2, -3], [2, -2], [2, -4], [5, -1], [5, -2], [5, -3], [10, -2], [10, -3], [4, -2]]), b = o[0], k = o[1], v = cl(1 / Math.pow(b, -k));
      return N('Find the value of $x$ given that $\\log_{' + b + '} x = ' + k + '$. Give your answer as a decimal.', v,
        'Index form: $x = ' + b + '^{' + k + '} = \\frac{1}{' + Math.pow(b, -k) + '} = ' + v + '$.');
    }),
    G('read-value', function () {
      var r = pick([2, 3, 5]), d = pick([2, 3, 4]), n, cand = [];
      for (n = 1; n < d; n++) if (gcd(n, d) === 1) cand.push(n);
      n = pick(cand);
      var bb = Math.pow(r, d), nn = Math.pow(r, n);
      return M('Find the value of $\\log_{' + bb + '} ' + nn + '$.', dm(fr(n, d)), [dm(fr(d, n)), dm(fr(-n, d)), dm(fr(n, d + 1)), dm(fr(n + 1, d))],
        'Write both as powers of ' + r + ': $' + bb + ' = ' + r + '^{' + d + '}$ and $' + nn + ' = ' + r + '^{' + n + '}$, so $' + nn + ' = ' + bb + '^{\\frac{' + n + '}{' + d + '}}$ and the log is $\\frac{' + n + '}{' + d + '}$.');
    }),
    G('find-unknown', function () {
      var a = pick([4, 9, 16, 25]), n = Math.round(Math.pow(a, 1.5));
      return N('Find the value of $a$ given that $\\log_a ' + n + ' = \\frac{3}{2}$ and $a > 0$.', a,
        'Index form: $a^{\\frac{3}{2}} = ' + n + '$. Raise both sides to the power $\\frac{2}{3}$: $a = ' + n + '^{\\frac{2}{3}} = ' + a + '$.');
    }),
    G('trap', function () {
      var k = rint(3, 9), X = k * k;
      return M('Solve $\\log_a ' + X + ' = 2$, where $a$ is the base of the logarithm.', dm('a = ' + k), [dm('a = \\pm ' + k), dm('a = ' + fr(X, 2)), dm('a = ' + (2 * X))],
        'Index form: $a^2 = ' + X + '$, so $a = \\pm ' + k + '$. A base must be positive, so we reject $-' + k + '$ and keep $a = ' + k + '$.');
    }),
    S('trap', M('Which of these is defined (a real number)?', dm('\\log_{2} \\frac{1}{4}'), [dm('\\log_{2} (-4)'), dm('\\log_{1} 7'), dm('\\log_{-2} 4')],
      '$\\log_2 \\frac{1}{4} = -2$. The number inside a log must be positive, and the base must be positive and not 1, which rules out the other three.')),
    S('trap', M('A student writes $\\log_2 16 = 8$. What has the student done wrong?',
      'They worked out $16 \\div 2$. The log asks what power of 2 gives 16, and the answer is 4.',
      ['They multiplied instead: it should be $2 \\times 16 = 32$.', 'They used the wrong base: the correct statement is $\\log_{16} 2 = 4$.', 'Nothing: $\\log_2 16 = 8$ is correct.'],
      '$\\log_2 16$ is the power you raise 2 to in order to get 16. Since $2^4 = 16$, the value is 4, not $16 \\div 2$.')),
    S('trap', M('What is the value of $\\log_a 1$ for any valid base $a$?', dm('0'), [dm('1'), dm('a'), 'It is not defined'],
      'Any valid base to the power 0 is 1 ($a^0 = 1$), so $\\log_a 1 = 0$.'))
  ] };

  // =====================================================================
  // FPM-LOG-02 a(1 + bx)^n
  // =====================================================================
  var CASES = [{ n: [-1, 1], ps: [2, 3, 4, 5, 8, 10] }, { n: [-2, 1], ps: [2, 3, 4, 5] }, { n: [-3, 1], ps: [2, 3, 4] }, { n: [1, 2], ps: [4, 9, 16, 25] },
    { n: [-1, 2], ps: [4, 9, 16, 25] }, { n: [1, 3], ps: [8, 27] }, { n: [3, 2], ps: [4, 9] }];
  function bcase(neg) {
    var c = pick(CASES), p = pick(c.ps), q = pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    if (neg === true && q > 0) q = -q;
    var r = Math.round(Math.pow(p, 1 / c.n[1]));
    var A = c.n[0] > 0 ? ri(Math.pow(r, c.n[0])) : rn(1, Math.pow(r, -c.n[0]));
    return { n: c.n, p: p, q: q, A: A, B: rn(q, p) };
  }
  function br1(p, q) { return p + sg(q, 'x'); }
  function std(A, Bc, n) { return (A[0] === 1 && A[1] === 1 ? '' : rfirst(A)) + '(1' + rsg(Bc, 'x') + ')^{' + rs(n) + '}'; }
  function pw(p, q, n) { return '(' + br1(p, q) + ')^{' + rs(n) + '}'; }
  function rootForm(n, P) {
    var k = n[0] + '/' + n[1];
    if (k === '1/2') return '\\sqrt{' + P + '}';
    if (k === '-1/2') return '\\frac{1}{\\sqrt{' + P + '}}';
    if (k === '-1/1') return '\\frac{1}{' + P + '}';
    if (k === '-2/1') return '\\frac{1}{(' + P + ')^2}';
    if (k === '-3/1') return '\\frac{1}{(' + P + ')^3}';
    if (k === '1/3') return '\\sqrt[3]{' + P + '}';
    return '(' + P + ')^{' + rs(n) + '}';
  }
  B['FPM-LOG-02'] = { title: 'Getting a bracket ready for the binomial series: a(1 + bx)^n', items: [
    G('rewrite', function () {
      var c = bcase();
      return M('Write $' + pw(c.p, c.q, c.n) + '$ in the form $A(1 + Bx)^{' + rs(c.n) + '}$.', dm(std(c.A, c.B, c.n)),
        [dm(std(ri(c.p), c.B, c.n)), dm(std(c.A, ri(c.q), c.n)), dm(std(c.A, rneg(c.B), c.n)), dm(std(rinv(c.A), c.B, c.n))],
        'Take out the first term: $' + br1(c.p, c.q) + ' = ' + c.p + '\\left(1' + rsg(c.B, 'x') + '\\right)$. Raise the factor to the power too: $' + c.p + '^{' + rs(c.n) + '} = ' + rs(c.A) + '$. So the form is $' + std(c.A, c.B, c.n) + '$.');
    }),
    G('rewrite', function () {
      var c = bcase(), P = br1(c.p, c.q);
      return M('Write $' + rootForm(c.n, P) + '$ in the form $A(1 + Bx)^{n}$. Which is correct?', dm(std(c.A, c.B, c.n)),
        [dm(std(ri(c.p), c.B, c.n)), dm(std(c.A, ri(c.q), c.n)), dm(std(c.A, rneg(c.B), c.n)), dm(std(rinv(c.A), c.B, c.n))],
        'First write it as a power: $' + rootForm(c.n, P) + ' = (' + P + ')^{' + rs(c.n) + '}$. Then take out ' + c.p + ' from the bracket, giving $' + c.p + '^{' + rs(c.n) + '}\\left(1' + rsg(c.B, 'x') + '\\right)^{' + rs(c.n) + '}$, which is $' + std(c.A, c.B, c.n) + '$.');
    }),
    G('find-constant', function () {
      var c; do { c = bcase(); } while (!smooth(c.A[1]));
      return N('The expression $' + pw(c.p, c.q, c.n) + '$ can be written as $A(1 + Bx)^{' + rs(c.n) + '}$. Find the value of $A$ as a decimal.', c.A[0] / c.A[1],
        '$A = ' + c.p + '^{' + rs(c.n) + '}$, because the factor taken out of the bracket is raised to the same power. That is $' + rs(c.A) + '$.');
    }),
    G('find-constant', function () {
      var c; do { c = bcase(); } while (!smooth(c.B[1]));
      return N('The expression $' + pw(c.p, c.q, c.n) + '$ can be written as $A(1 + Bx)^{' + rs(c.n) + '}$. Find the value of $B$ as a decimal.', c.B[0] / c.B[1],
        'Taking out ' + c.p + ' leaves $1 + \\frac{q}{' + c.p + '}x$ with $q = ' + c.q + '$, so $B = ' + ufr(c.q, c.p) + (c.B[1] === c.p ? '' : ' = ' + rs(c.B)) + '$.');
    }),
    G('trap-sign', function () {
      var c = bcase(true);
      return M('Write $' + pw(c.p, c.q, c.n) + '$ as $A(1 + Bx)^{' + rs(c.n) + '}$. What is $B$?', dm(rs(c.B)),
        [dm(rs(rneg(c.B))), dm(rs(ri(c.q))), dm(rs(rinv(c.B))), dm(rs(ri(-c.q)))],
        'The form is $(1 + Bx)$, so $B$ keeps the sign of the $x$ term: $B = ' + ufr(c.q, c.p) + (c.B[1] === c.p ? '' : ' = ' + rs(c.B)) + '$.');
    }),
    G('find-power', function () {
      var c = pick([{ n: [1, 2], p: pick([4, 9, 16]) }, { n: [-1, 2], p: pick([4, 9, 16]) }, { n: [-1, 1], p: pick([2, 3, 5]) }, { n: [-2, 1], p: pick([2, 3, 5]) }, { n: [-3, 1], p: pick([2, 3]) }, { n: [1, 3], p: 8 }]);
      var q = pick([-5, -3, -2, 2, 3, 4, 5]), P = br1(c.p, q), n = c.n;
      var cand = [rneg(n), rinv(n), rneg(rinv(n)), rmul(n, ri(2)), radd(n, ri(1)), radd(n, ri(-1))].map(function (r) { return dm(rs(r)); });
      return M('Writing $' + rootForm(n, P) + '$ as $A(1 + Bx)^{n}$, what is the value of $n$?', dm(rs(n)), cand,
        'Roots are fractional powers and reciprocals give negative powers. $' + rootForm(n, P) + ' = (' + P + ')^{' + rs(n) + '}$, so $n = ' + rs(n) + '$.');
    }),
    G('with-coefficient', function () {
      var c = bcase(), k = rint(2, 5), C = rmul(ri(k), c.A), P = br1(c.p, c.q);
      return M('Write $' + k + '(' + P + ')^{' + rs(c.n) + '}$ in the form $C(1 + Bx)^{' + rs(c.n) + '}$. What is $C$?', dm(rs(C)),
        [dm(rs(c.A)), dm(rs(ri(k * c.p))), dm(rs(rmul(ri(k), rinv(c.A)))), dm(rs(radd(ri(k), c.A)))],
        'The factor ' + k + ' stays as it is and multiplies the factor taken out of the bracket: $C = ' + k + ' \\times ' + c.p + '^{' + rs(c.n) + '} = ' + k + ' \\times ' + rs(c.A) + ' = ' + rs(C) + '$.');
    }),
    G('find-q', function () {
      var p = pick([2, 4, 5, 8, 10]), q = rint(1, 9), c = pick([CASES[0], CASES[1]]), n = c.n;
      var A = n[0] === -1 ? rn(1, p) : rn(1, p * p), B = rn(q, p);
      if (!smooth(B[1])) { p = 4; q = 3; A = n[0] === -1 ? rn(1, 4) : rn(1, 16); B = rn(3, 4); }
      return N('It is given that $(' + p + ' + qx)^{' + rs(n) + '} = ' + rs(A) + '\\left(1' + rsg(B, 'x') + '\\right)^{' + rs(n) + '}$. Find the value of $q$.', q,
        'Taking out ' + p + ' gives $1 + \\frac{q}{' + p + '}x$, so $\\frac{q}{' + p + '} = ' + rs(B) + '$ and $q = ' + q + '$.');
    }),
    G('bracket', function () {
      var c = bcase();
      return M('When $' + pw(c.p, c.q, c.n) + '$ is written as $A(1 + Bx)^{' + rs(c.n) + '}$, which is the bracket $(1 + Bx)$?', dm('1' + rsg(c.B, 'x')),
        [dm('1' + sg(c.q, 'x')), dm('1' + sg(c.p, 'x')), dm('1' + rsg(rinv(c.B), 'x')), dm('1' + rsg(rneg(c.B), 'x')), dm('1' + sg(-c.p, 'x'))],
        'Divide the bracket by its first term ' + c.p + ': $\\frac{' + br1(c.p, c.q) + '}{' + c.p + '} = 1' + rsg(c.B, 'x') + '$.');
    }),
    G('evaluate-factor', function () {
      var c = bcase();
      return M('Evaluate $' + c.p + '^{' + rs(c.n) + '}$.', dm(rs(c.A)),
        [dm(rs(ri(c.p))), dm(rs(rinv(c.A))), dm(rs(rneg(c.A))), dm(rs(rn(c.p * c.n[0], c.n[1])))],
        (c.n[0] < 0 ? 'A negative power means the reciprocal. ' : '') + (c.n[1] > 1 ? 'The denominator of the power is a root. ' : '') + '$' + c.p + '^{' + rs(c.n) + '} = ' + rs(c.A) + '$.');
    }),
    S('concept', M('Why is the first term taken out as a factor before using the binomial series for a negative or fractional power?',
      'The series applies to a bracket of the form $(1 + y)^n$, so the bracket must start with 1.',
      ['The series only works when the bracket starts with the largest term.', 'It makes the power $n$ a whole number.', 'It removes the $x$ from the bracket.'],
      'The expansion of $(1 + y)^n$ for fractional or negative $n$ needs a bracket that begins with 1. Taking out the first term as a factor (raised to the power $n$) gets it into that form.'))
  ] };

  // =====================================================================
  // FPM-LOG-04 Surds
  // =====================================================================
  function conjCase() {
    var m = pick([2, 3, 5, 6, 7]), p = rint(1, 5), d = pick([-3, -2, -1, 1, 2, 3]), r = pick([-4, -3, -2, -1, 1, 2, 3, 4]), s = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    var a = r * p + s * d * m, b = r * d + s * p;           // (r + s sqrt m)(p + d sqrt m)
    var den = p * p - d * d * m;
    return { m: m, p: p, d: d, r: r, s: s, a: a, b: b, den: den, X: a * p - b * d * m, Y: b * p - a * d };
  }
  function conjWhy(c) {
    return 'Multiply top and bottom by the conjugate $' + sf(c.p, -c.d, c.m) + '$. The denominator becomes $' + c.p + '^2 - ' + (c.d * c.d === 1 ? '' : (c.d * c.d) + ' \\times ') + c.m + ' = ' + c.den + '$. The numerator becomes $' + sf(c.X, c.Y, c.m) + '$. Dividing by ' + c.den + ' gives $' + sf(c.r, c.s, c.m) + '$.';
  }
  B['FPM-LOG-04'] = { title: 'Surds: simplifying and rationalising the denominator', items: [
    G('simplify', function () {
      var m = pick([2, 3, 5, 6, 7, 10, 11]), s = rint(2, 9), n = s * s * m;
      return M('Simplify $\\sqrt{' + n + '}$.', dm(sq(s, m)), [dm(sq(s * s, m)), dm(sq(2 * s, m)), dm(sq(s, 2 * m)), dm(sq(s + 1, m))],
        '$' + n + ' = ' + (s * s) + ' \\times ' + m + '$ and ' + (s * s) + ' is a square, so $\\sqrt{' + n + '} = ' + s + '\\sqrt{' + m + '}$.');
    }),
    G('simplify', function () {
      var m = pick([2, 3, 5, 6, 7]), s1 = rint(2, 6), s2 = rint(1, 5), plus = Math.random() < 0.5;
      if (!plus && s1 <= s2) s1 = s2 + rint(1, 2);
      var a = s1 * s1 * m, b = s2 * s2 * m, k = plus ? s1 + s2 : s1 - s2;
      return N('Simplify $\\sqrt{' + a + '} ' + (plus ? '+' : '-') + ' \\sqrt{' + b + '}$ to the form $k\\sqrt{' + m + '}$. Find the integer $k$.', k,
        '$\\sqrt{' + a + '} = ' + s1 + '\\sqrt{' + m + '}$ and $\\sqrt{' + b + '} = ' + (s2 === 1 ? '' : s2) + '\\sqrt{' + m + '}$. They are like surds, so ' + s1 + (plus ? ' + ' : ' - ') + s2 + ' = ' + k + ' and the answer is $' + sq(k, m) + '$.');
    }),
    G('rationalise', function () {
      var m = pick([2, 3, 5, 7]), a = rint(1, 9);
      if (a % m === 0) a++;
      if (a % m === 0) a++;
      return M('Rationalise the denominator of $\\frac{' + a + '}{\\sqrt{' + m + '}}$.', dm(cs(a, m, m)), [dm(sq(a, m)), dm(fr(a, m)), dm(cs(a, 2 * m, m)), dm(sq(a * m, m))],
        'Multiply top and bottom by $\\sqrt{' + m + '}$: $\\frac{' + sq(a, m) + '}{\\sqrt{' + m + '} \\times \\sqrt{' + m + '}} = \\frac{' + sq(a, m) + '}{' + m + '}$.');
    }),
    G('conjugate', function () {
      var c = conjCase();
      return M('Write $\\frac{' + sf(c.a, c.b, c.m) + '}{' + sf(c.p, c.d, c.m) + '}$ in the form $r + s\\sqrt{' + c.m + '}$ where $r$ and $s$ are integers.', dm(sf(c.r, c.s, c.m)),
        [dm(sf(c.s, c.r, c.m)), dm(sf(c.r, -c.s, c.m)), dm(sf(-c.r, c.s, c.m)), dm(sf(-c.r, -c.s, c.m))], conjWhy(c));
    }),
    G('conjugate', function () {
      var c = conjCase();
      return N('The expression $\\frac{' + sf(c.a, c.b, c.m) + '}{' + sf(c.p, c.d, c.m) + '}$ can be written as $r + s\\sqrt{' + c.m + '}$ where $r$ and $s$ are integers. Find the value of $s$.', c.s, conjWhy(c));
    }),
    G('conjugate', function () {
      var m = pick([2, 3, 5, 7]), p = rint(3, 9), q = rint(1, 4), v = p * p - q * q * m;
      return N('Find the value of $(' + sf(p, q, m) + ')(' + sf(p, -q, m) + ')$.', v,
        'The two brackets are conjugates, so this is a difference of two squares: $' + p + '^2 - (' + (q === 1 ? '' : q) + '\\sqrt{' + m + '})^2 = ' + (p * p) + ' - ' + (q * q * m) + ' = ' + v + '$.');
    }),
    G('conjugate', function () {
      var c = conjCase(), conj = sf(c.p, -c.d, c.m), den = sf(c.p, c.d, c.m), neg = sf(-c.p, -c.d, c.m);
      return M('To rationalise $\\frac{1}{' + den + '}$, which fraction should you multiply by?', dm('\\frac{' + conj + '}{' + conj + '}'),
        [dm('\\frac{\\sqrt{' + c.m + '}}{\\sqrt{' + c.m + '}}'), dm('\\frac{' + den + '}{' + den + '}'), dm('\\frac{' + neg + '}{' + neg + '}'), dm('\\frac{' + sq(Math.abs(c.d), c.m) + '}{' + sq(Math.abs(c.d), c.m) + '}')],
        'Use the conjugate, the same two terms with the sign between them changed: $' + conj + '$. Then $(' + den + ')(' + conj + ') = ' + c.p + '^2 - ' + (c.d * c.d) + ' \\times ' + c.m + ' = ' + c.den + '$ has no surd.');
    }),
    G('expand', function () {
      var m = pick([2, 3, 5, 7]), p = rint(1, 5), q = rint(1, 4), sg1 = pick([1, -1]), qq = sg1 * q;
      var right = sf(p * p + q * q * m, 2 * p * qq, m);
      return M('Expand and simplify $(' + sf(p, qq, m) + ')^2$.', dm(right),
        [dm(sf(p * p + q * q, 2 * p * qq, m)), dm(sf(p * p + q * q * m, 0, m)), dm(sf(p * p + q * q * m, p * qq, m)), dm(sf(p * p + q * q * m, -2 * p * qq, m))],
        '$(' + p + ' ' + (qq < 0 ? '-' : '+') + ' ' + (q === 1 ? '' : q) + '\\sqrt{' + m + '})^2 = ' + (p * p) + ' ' + (qq < 0 ? '-' : '+') + ' ' + (2 * p * q) + '\\sqrt{' + m + '} + ' + (q * q) + ' \\times ' + m + '$. Note that $(' + (q === 1 ? '' : q) + '\\sqrt{' + m + '})^2 = ' + (q * q * m) + '$. So the answer is $' + right + '$.');
    }),
    G('expand', function () {
      var m = pick([2, 3, 5]), p = rint(1, 4), q = pick([-3, -2, -1, 1, 2, 3]), r = rint(1, 4), s = pick([-3, -2, -1, 1, 2, 3]);
      var A = p * r + q * s * m, Bc = p * s + q * r;
      return N('Given that $(' + sf(p, q, m) + ')(' + sf(r, s, m) + ') = A + B\\sqrt{' + m + '}$ where $A$ and $B$ are integers, find the value of $B$.', Bc,
        'The surd terms come from the two cross products: $' + p + ' \\times (' + s + '\\sqrt{' + m + '}) + (' + q + '\\sqrt{' + m + '}) \\times ' + r + '$. So $B = ' + (p * s) + ' + (' + (q * r) + ') = ' + Bc + '$. (The rational part is $A = ' + A + '$.)');
    }),
    G('simplify', function () {
      var m = pick([2, 3, 5, 6, 7]), s = rint(2, 9), n = s * s * m, dec = String(n / 100);
      return M('Write $\\sqrt{' + dec + '}$ exactly, in its simplest form.', dm(cs(s, 10, m)), [dm(cs(s, 100, m)), dm(cs(s * s, 10, m)), dm(cs(2 * s, 10, m)), dm(cs(s, 20, m))],
        '$' + dec + ' = \\frac{' + n + '}{100}$, so $\\sqrt{' + dec + '} = \\frac{\\sqrt{' + n + '}}{10} = \\frac{' + s + '\\sqrt{' + m + '}}{10}$' + (gcd(s, 10) > 1 ? ', which cancels to $' + cs(s, 10, m) + '$.' : '.'));
    }),
    G('trap-square', function () {
      var q = rint(2, 6), m = pick([2, 3, 5, 7]);
      return N('Find the value of $(' + q + '\\sqrt{' + m + '})^2$.', q * q * m, 'Square the number and the root separately: $' + q + '^2 \\times (\\sqrt{' + m + '})^2 = ' + (q * q) + ' \\times ' + m + ' = ' + (q * q * m) + '$.');
    }),
    G('compare', function () {
      var m = pick([2, 3, 5]), a = rint(1, 4), b = rint(1, 4), A = a * a + b * b * m, Bc = 2 * a * b;
      return N('Given that $(a + b\\sqrt{' + m + '})^2 = ' + A + ' + ' + Bc + '\\sqrt{' + m + '}$, where $a$ and $b$ are positive integers, find the value of $a$.', a,
        'Expanding gives $a^2 + ' + m + 'b^2 + 2ab\\sqrt{' + m + '}$. Comparing parts: $2ab = ' + Bc + '$ and $a^2 + ' + m + 'b^2 = ' + A + '$. The positive integers $a = ' + a + '$, $b = ' + b + '$ satisfy both.');
    }),
    G('context', function () {
      var c = conjCase(), rt = Math.sqrt(c.m);
      while (c.p + c.d * rt <= 0.2 || c.r + c.s * rt <= 0.2) { c = conjCase(); rt = Math.sqrt(c.m); }
      return M('A rectangle has width $(' + sf(c.p, c.d, c.m) + ')$ cm and area $(' + sf(c.a, c.b, c.m) + ')$ cm$^2$. The length is $r + s\\sqrt{' + c.m + '}$ cm, where $r$ and $s$ are integers. Find the length.', dm(sf(c.r, c.s, c.m) + '\\text{ cm}'),
        [dm(sf(c.s, c.r, c.m) + '\\text{ cm}'), dm(sf(c.r, -c.s, c.m) + '\\text{ cm}'), dm(sf(-c.r, c.s, c.m) + '\\text{ cm}'), dm(sf(-c.r, -c.s, c.m) + '\\text{ cm}')],
        'Length = area $\\div$ width $= \\frac{' + sf(c.a, c.b, c.m) + '}{' + sf(c.p, c.d, c.m) + '}$. ' + conjWhy(c));
    })
  ] };

  // =====================================================================
  // FPM-LOG-07 Log equations: combine into one log
  // =====================================================================
  function caseB() {
    var opts = [[2, [3, 4, 5, 6]], [3, [2, 3, 4]], [5, [2, 3]]], o = pick(opts), a = o[0], c = pick(o[1]), Nn = Math.pow(a, c), pairs = [];
    for (var v = 1; v < Nn; v++) if (Nn % v === 0) { var u = Nn / v; if (u - v >= 2) pairs.push([u, v]); }
    var uv = pick(pairs), u = uv[0], v2 = uv[1], tot = u - v2, p = rint(1, tot - 1), q = tot - p, x0 = v2 + q;
    return { a: a, c: c, N: Nn, p: p, q: q, x0: x0, other: q - p - x0 };
  }
  B['FPM-LOG-07'] = { title: 'Log equations: combine into one log, then remove the log', items: [
    G('combine', function () {
      var a = pick([2, 3, 5, 10]), s = rint(4, 9), k = rint(1, s - 1), Mv = s * (s - k);
      return N('Solve $\\log_{' + a + '} x + \\log_{' + a + '} (x - ' + k + ') = \\log_{' + a + '} ' + Mv + '$. Give the value of $x$.', s,
        'Combine the left side: $\\log_{' + a + '} (x(x - ' + k + ')) = \\log_{' + a + '} ' + Mv + '$, so $' + poly(1, -k, 0, 'x') + ' = ' + Mv + '$. Then $(x - ' + s + ')(x + ' + (s - k) + ') = 0$. We need $x > ' + k + '$ so that both logs exist, so $x = ' + s + '$.');
    }),
    G('combine', function () {
      var c = caseB();
      return N('Solve $\\log_{' + c.a + '} (x + ' + c.p + ') + \\log_{' + c.a + '} (x - ' + c.q + ') = ' + c.c + '$. Give the value of $x$.', c.x0,
        'Combine: $(x + ' + c.p + ')(x - ' + c.q + ') = ' + c.a + '^{' + c.c + '} = ' + c.N + '$, which gives $' + poly(1, c.p - c.q, -(c.p * c.q + c.N), 'x') + ' = 0$. The roots are $x = ' + c.x0 + '$ and $x = ' + c.other + '$. The second makes $x - ' + c.q + '$ negative, so $x = ' + c.x0 + '$.');
    }),
    G('combine', function () {
      var a = pick([2, 3]), c = pick([1, 2]), Nn = Math.pow(a, c), x, q, p;
      do { x = rint(6, 14); q = rint(1, 4); p = x * (Nn - 1) - Nn * q; } while (p < 1 || p > 30);
      return N('Solve $\\log_{' + a + '} (x + ' + p + ') - \\log_{' + a + '} (x - ' + q + ') = ' + c + '$. Give the value of $x$.', x,
        'Quotient law: $\\frac{x + ' + p + '}{x - ' + q + '} = ' + a + '^{' + c + '} = ' + Nn + '$. So $x + ' + p + ' = ' + Nn + 'x - ' + (Nn * q) + '$, giving $' + co(Nn - 1, 'x') + ' = ' + (p + Nn * q) + '$ and $x = ' + x + '$.');
    }),
    G('change-base', function () {
      var b = pick([2, 3, 5]), k = pick([2, 4]), n = pick([1, 2, 3]), sign = pick([1, -1]), cc = (1 + 2 * sign * n) * (k / 2);
      return N('Solve $\\log_{' + (b * b) + '} x' + (sign > 0 ? ' + ' : ' - ') + (n === 1 ? '' : n) + '\\log_{' + b + '} x = ' + cc + '$. Give the value of $x$.', Math.pow(b, k),
        'Change the first log to base ' + b + ': $\\log_{' + (b * b) + '} x = \\frac{1}{2}\\log_{' + b + '} x$. The equation becomes $\\left(\\frac{1}{2} ' + (sign > 0 ? '+' : '-') + ' ' + n + '\\right)\\log_{' + b + '} x = ' + cc + '$, so $\\log_{' + b + '} x = ' + k + '$ and $x = ' + b + '^{' + k + '} = ' + Math.pow(b, k) + '$.');
    }),
    G('number-as-log', function () {
      var a = pick([2, 3, 5]), c = pick([1, 2]), Nn = Math.pow(a, c), r = rint(1, Math.min(3, Nn - 1)), x = rint(1, 5), p = x * (Nn - r);
      var left = '\\log_{' + a + '} (' + lin(r, p, 'x') + ')', form = Math.random() < 0.5;
      var qq = form ? left + ' - \\log_{' + a + '} x = ' + c : left + ' = ' + c + ' + \\log_{' + a + '} x';
      return N('Solve $' + qq + '$. Give the value of $x$.', x,
        'Gather the logs on one side: $\\log_{' + a + '} \\frac{' + lin(r, p, 'x') + '}{x} = ' + c + '$. Index form: $\\frac{' + lin(r, p, 'x') + '}{x} = ' + a + '^{' + c + '} = ' + Nn + '$. So $' + lin(r, p, 'x') + ' = ' + Nn + 'x$, $' + p + ' = ' + co(Nn - r, 'x') + '$ and $x = ' + x + '$.');
    }),
    G('check-roots', function () {
      var a = pick([2, 3, 5]), s = rint(3, 8), t0 = rint(1, s - 1), m = s - t0, n = s * t0;
      return N('Solve $2\\log_{' + a + '} x = \\log_{' + a + '} (' + lin(m, n, 'x') + ')$. Give the value of $x$.', s,
        'Power law: $2\\log_{' + a + '} x = \\log_{' + a + '} x^2$, so $x^2 = ' + lin(m, n, 'x') + '$. Then $(x - ' + s + ')(x + ' + t0 + ') = 0$. A log needs a positive argument, so $x = -' + t0 + '$ is rejected and $x = ' + s + '$.');
    }),
    G('check-roots', function () {
      var c = caseB();
      return M('Solving $\\log_{' + c.a + '} (x + ' + c.p + ') + \\log_{' + c.a + '} (x - ' + c.q + ') = ' + c.c + '$ leads to $x = ' + c.x0 + '$ or $x = ' + c.other + '$. Which of these is a solution of the log equation?',
        dm('x = ' + c.x0 + '\\text{ only}'), [dm('x = ' + c.other + '\\text{ only}'), dm('\\text{both values}'), dm('\\text{neither value}')],
        'Test each value in the logs. For $x = ' + c.other + '$, $x - ' + c.q + ' = ' + (c.other - c.q) + '$ is negative, and a log of a negative number does not exist. For $x = ' + c.x0 + '$ both arguments are positive, so it is the only solution.');
    }),
    G('change-base', function () {
      var b = pick([2, 3, 5]), e = pick([2, 3, 4]);
      return M('Write $\\log_{' + Math.pow(b, e) + '} x$ in terms of $\\log_{' + b + '} x$.', dm('\\frac{1}{' + e + '}\\log_{' + b + '} x'),
        [dm(e + '\\log_{' + b + '} x'), dm('\\log_{' + b + '} x'), dm('\\log_{' + b + '} x - ' + e), dm('\\left(\\log_{' + b + '} x\\right)^{' + e + '}')],
        '$\\log_{' + Math.pow(b, e) + '} x = \\frac{\\log_{' + b + '} x}{\\log_{' + b + '} ' + Math.pow(b, e) + '} = \\frac{\\log_{' + b + '} x}{' + e + '}$.');
    }),
    G('number-as-log', function () {
      var a = pick([2, 3, 5]), c = rint(2, 3);
      return M('Write $' + c + ' + \\log_{' + a + '} x$ as a single logarithm.', dm('\\log_{' + a + '} (' + Math.pow(a, c) + 'x)'),
        [dm('\\log_{' + a + '} (' + c + 'x)'), dm('\\log_{' + a + '} (x + ' + c + ')'), dm('\\log_{' + a + '} x^{' + c + '}')],
        'Write ' + c + ' as a log of the same base: $' + c + ' = \\log_{' + a + '} ' + a + '^{' + c + '} = \\log_{' + a + '} ' + Math.pow(a, c) + '$. Then add the logs by multiplying: $\\log_{' + a + '} (' + Math.pow(a, c) + 'x)$.');
    }),
    S('trap-law', M('Which statement is true for all valid values of $x$ and any valid base?', dm('\\log_a x + \\log_a 3 = \\log_a (3x)'),
      [dm('\\log_a (x + 3) = \\log_a x + \\log_a 3'), dm('\\log_a x - \\log_a 3 = \\log_a (x - 3)'), dm('\\frac{\\log_a x}{\\log_a 3} = \\log_a (x - 3)')],
      'Adding logs multiplies the numbers inside: $\\log_a x + \\log_a 3 = \\log_a 3x$. The laws never split a sum or difference inside a log, and a quotient of logs is not a log of a difference.')),
    S('trap-law', M('A student solves $\\log_2 x + \\log_2 (x - 2) = 3$. Line 1: $\\log_2 (x(x - 2)) = 3$. Line 2: $x(x - 2) = 6$. Line 3: $x^2 - 2x - 6 = 0$. Which is the first line that is wrong?',
      'Line 2', ['Line 1', 'Line 3', 'None: all three lines are correct'],
      'Line 1 correctly uses the product law. In index form $\\log_2 P = 3$ means $P = 2^3 = 8$, not $3 \\times 2$, so Line 2 should read $x(x - 2) = 8$.'))
  ] };

  // =====================================================================
  // FPM-LOG-09 Exponential equations
  // =====================================================================
  function exv(k, v) { return (k === 1 ? '' : k) + v; }       // "3x" or "x"
  function qexp(k, b, c, base) {                              // e^{2kx} + b e^{kx} + c = 0
    var E = base || 'e', v = base ? 'y' : 'x', s = E + '^{' + exv(2 * k, v) + '}';
    if (b !== 0) s += sg(b, base ? '\\times ' + E + '^{' + exv(k, v) + '}' : E + '^{' + exv(k, v) + '}');
    if (c !== 0) s += sg(c, '');
    return s + ' = 0';
  }
  B['FPM-LOG-09'] = { title: 'Exponential equations, including hidden quadratics', items: [
    G('match-bases', function () {
      var b = pick([2, 3, 5, 7]), x, p, q, r;
      do { x = rint(-2, 4); p = pick([2, 3, 4, 5]); q = rint(-4, 6); r = p * x + q; } while (r < 1 || r > 5 || q === 0);
      return N('Solve $' + b + '^{' + lin(p, q, 'x') + '} = ' + Math.pow(b, r) + '$. Give the value of $x$.', x,
        '$' + Math.pow(b, r) + ' = ' + b + '^{' + r + '}$, so both sides are powers of ' + b + ' and the powers are equal: $' + lin(p, q, 'x') + ' = ' + r + '$, giving $x = ' + x + '$.');
    }),
    G('match-bases', function () {
      var r = pick([2, 3]), m = pick([2, 4]), n = rint(1, 7), A = Math.pow(r, m), Bv = Math.pow(r, n);
      return N('Solve $' + A + '^{x} = ' + Bv + '$. Give your answer as a decimal.', n / m,
        'Write both as powers of ' + r + ': $' + A + ' = ' + r + '^{' + m + '}$, so $' + r + '^{' + m + 'x} = ' + r + '^{' + n + '}$. Then $' + m + 'x = ' + n + '$ and $x = ' + cl(n / m) + '$.');
    }),
    G('take-logs', function () {
      var b = pick([2, 3, 5, 7]), n; do { n = rint(10, 200); } while (isPow(n, b));
      var x = Math.log(n) / Math.log(b);
      return N3('Solve $' + b + '^{x} = ' + n + '$. Give your answer to 3 significant figures.', x,
        'Take logs of both sides: $x\\ln ' + b + ' = \\ln ' + n + '$, so $x = \\frac{\\ln ' + n + '}{\\ln ' + b + '} = ' + R.roundSf(x, 3) + '$.');
    }),
    G('exact-form', function () {
      var k = rint(2, 5), c = pick([3, 5, 7, 10, 11, 13, 20]);
      return M('Solve $e^{' + k + 'x} = ' + c + '$. Give the exact value of $x$.', dm('\\frac{\\ln ' + c + '}{' + k + '}'),
        [dm(k + '\\ln ' + c), dm('\\ln ' + (c - k)), dm('\\ln \\frac{' + c + '}{' + k + '}'), dm('\\ln ' + c + ' - ' + k)],
        'Take natural logs: $' + k + 'x = \\ln ' + c + '$, so $x = \\frac{\\ln ' + c + '}{' + k + '}$. The ' + k + ' divides the whole of $\\ln ' + c + '$; it does not go inside the log.');
    }),
    G('exact-form', function () {
      var k = pick([2, 3, 4]), c = pick([3, 5, 6, 7, 10]);
      return M('The curve $y = ' + c + ' - e^{' + k + 'x}$ crosses the $x$-axis where $y = 0$. Find the exact $x$-coordinate.', dm('\\frac{\\ln ' + c + '}{' + k + '}'),
        [dm(k + '\\ln ' + c), dm('\\ln ' + (c - k)), dm('\\frac{1}{' + k + '}\\ln ' + (c - 1)), dm('\\ln ' + c + ' - ' + k)],
        'Set $y = 0$: $e^{' + k + 'x} = ' + c + '$. Taking natural logs gives $' + k + 'x = \\ln ' + c + '$, so $x = \\frac{\\ln ' + c + '}{' + k + '}$.');
    }),
    G('isolate-first', function () {
      var p = rint(2, 5), k = pick([2, 3, 4]), n = rint(2, 9), c = rint(1, 9), d = p * n - c;
      if (d < 1) { c = 1; d = p * n - 1; }
      var x = Math.log(n) / k;
      return N3('Solve $' + p + 'e^{' + k + 'x} - ' + c + ' = ' + d + '$. Give your answer to 3 significant figures.', x,
        'Isolate the exponential first: $' + p + 'e^{' + k + 'x} = ' + (d + c) + '$, so $e^{' + k + 'x} = ' + n + '$. Then $' + k + 'x = \\ln ' + n + '$ and $x = ' + R.roundSf(x, 3) + '$.');
    }),
    G('hidden-quad', function () {
      var u1 = rint(2, 5), u2 = rint(u1 + 1, 9), k = pick([1, 2, 3]);
      return N3('Solve $' + qexp(k, -(u1 + u2), u1 * u2) + '$. Give the larger solution to 3 significant figures.', Math.log(u2) / k,
        'Let $u = e^{' + exv(k, 'x') + '}$. Then $u^2 - ' + (u1 + u2) + 'u + ' + (u1 * u2) + ' = 0$, so $(u - ' + u1 + ')(u - ' + u2 + ') = 0$. The larger value is $u = ' + u2 + '$, so $' + exv(k, 'x') + ' = \\ln ' + u2 + '$ and $x = ' + R.roundSf(Math.log(u2) / k, 3) + '$.');
    }),
    G('hidden-quad', function () {
      var u1 = rint(2, 6), u2 = rint(1, 6), k = pick([1, 2]);
      while (u2 === u1) u2 = rint(1, 6);
      return N3('The equation $' + qexp(k, u2 - u1, -u1 * u2) + '$ has exactly one real solution. Find it to 3 significant figures.', Math.log(u1) / k,
        'Let $u = e^{' + exv(k, 'x') + '}$: $u^2 ' + sg(u2 - u1, 'u').replace(/^ /, '') + sg(-u1 * u2, '') + ' = 0$, so $(u - ' + u1 + ')(u + ' + u2 + ') = 0$. An exponential is always positive, so $u = -' + u2 + '$ is rejected. Then $' + exv(k, 'x') + ' = \\ln ' + u1 + '$ and $x = ' + R.roundSf(Math.log(u1) / k, 3) + '$.');
    }),
    G('hidden-quad', function () {
      var bs = pick([2, 3]), a = rint(0, 2), b = rint(a + 1, 4), u1 = Math.pow(bs, a), u2 = Math.pow(bs, b);
      return N('Solve $' + qexp(1, -(u1 + u2), u1 * u2, String(bs)) + '$. Give the larger value of $y$.', b,
        'Let $u = ' + bs + '^{y}$. Then $u^2 - ' + (u1 + u2) + 'u + ' + (u1 * u2) + ' = 0$, so $(u - ' + u1 + ')(u - ' + u2 + ') = 0$. So $' + bs + '^{y} = ' + u1 + ' = ' + bs + '^{' + a + '}$ or $' + bs + '^{y} = ' + u2 + ' = ' + bs + '^{' + b + '}$. The larger value is $y = ' + b + '$.');
    }),
    G('substitution', function () {
      var k = pick([2, 3, 4]), p = rint(3, 12), q = rint(2, 12);
      return M('Using the substitution $u = e^{' + k + 'x}$, what does $e^{' + (2 * k) + 'x} - ' + p + 'e^{' + k + 'x} + ' + q + ' = 0$ become?', dm('u^2 - ' + p + 'u + ' + q + ' = 0'),
        [dm('u^{' + (2 * k) + '} - ' + p + 'u^{' + k + '} + ' + q + ' = 0'), dm('2u - ' + p + 'u + ' + q + ' = 0'), dm('u^2 + ' + p + 'u + ' + q + ' = 0'), dm('u^2 - ' + p + 'u - ' + q + ' = 0')],
        '$e^{' + (2 * k) + 'x} = \\left(e^{' + k + 'x}\\right)^2 = u^2$ and $e^{' + k + 'x} = u$, so the equation is $u^2 - ' + p + 'u + ' + q + ' = 0$.');
    }),
    G('reject', function () {
      var a = rint(1, 5), b = rint(2, 9);
      return M('Solving a quadratic in $u = e^{x}$ gives $u = -' + a + '$ or $u = ' + b + '$. What are the real solutions for $x$?', dm('x = \\ln ' + b + '\\text{ only}'),
        [dm('x = \\ln ' + b + '\\text{ or } x = \\ln(-' + a + ')'), dm('x = e^{' + b + '}\\text{ only}'), dm('x = \\ln ' + a + '\\text{ or } x = \\ln ' + b)],
        '$e^{x}$ is always positive, so $u = -' + a + '$ gives no real $x$. For $u = ' + b + '$, take logs: $x = \\ln ' + b + '$.');
    }),
    G('exact-form', function () {
      var m = rint(2, 4), n = pick([5, 7, 10, 11, 13, 17, 20]), rt = m === 2 ? '\\sqrt{' + n + '}' : '\\sqrt[' + m + ']{' + n + '}';
      return M('Which of these is equal to $\\frac{1}{' + m + '}\\ln ' + n + '$?', dm('\\ln ' + rt), [dm('\\ln \\frac{' + n + '}{' + m + '}'), dm('\\ln (' + m + n + ')'), dm('\\ln ' + n + '^{' + m + '}')],
        'The power law lets the multiplier move inside as a power: $\\frac{1}{' + m + '}\\ln ' + n + ' = \\ln ' + n + '^{\\frac{1}{' + m + '}} = \\ln ' + rt + '$.');
    }),
    G('take-logs', function () {
      var o = pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7]]), b = o[0], c = o[1], p = rint(1, 3);
      var x = p * Math.log(b) / (Math.log(c) - Math.log(b));
      return N3('Solve $' + b + '^{x + ' + p + '} = ' + c + '^{x}$. Give your answer to 3 significant figures.', x,
        'Take logs: $(x + ' + p + ')\\ln ' + b + ' = x\\ln ' + c + '$. Collect the $x$ terms: $x(\\ln ' + c + ' - \\ln ' + b + ') = ' + p + '\\ln ' + b + '$, so $x = \\frac{' + p + '\\ln ' + b + '}{\\ln ' + c + ' - \\ln ' + b + '} = ' + R.roundSf(x, 3) + '$.');
    }),
    S('trap', M('A student solves $5 - e^{2x} = 3$ and writes $\\ln 5 - 2x = \\ln 3$. What is wrong?',
      'The log of a difference cannot be split. They should isolate the exponential first: $e^{2x} = 2$.',
      ['Nothing is wrong: $\\ln 5 - 2x = \\ln 3$ is correct.', '$\\ln e^{2x}$ should be $e^{2x}$, not $2x$.', 'They should have used $\\log_{10}$ instead of $\\ln$.'],
      'There is no law for $\\ln(5 - e^{2x})$. Rearrange first: $e^{2x} = 5 - 3 = 2$, then $2x = \\ln 2$ and $x = \\frac{1}{2}\\ln 2$.'))
  ] };
  function isPow(n, b) { var v = 1; while (v < n) v *= b; return v === n; }

  // =====================================================================
  // FPM-LOG-11 Log equations that become quadratics
  // =====================================================================
  function lqCase(decimalOk) {
    var u1, u2;
    do { u1 = rint(-3, 3); u2 = rint(-3, 3); } while (u1 === 0 || u2 === 0 || u1 >= u2 || u1 + u2 === 0);
    var a = decimalOk ? pick([2, 4, 5, 10]) : pick([2, 3, 5]), K = u1 * u2, c = u1 + u2;
    return { a: a, u1: u1, u2: u2, K: K, c: c };
  }
  function lqEq(t) {
    var K = t.K, ak = Math.abs(K);
    return '\\log_{' + t.a + '} x ' + (K < 0 ? '- ' : '+ ') + (ak === 1 ? '' : ak) + '\\log_{x} ' + t.a + ' = ' + t.c;
  }
  function rp(a, u) { return u >= 0 ? ri(Math.pow(a, u)) : rn(1, Math.pow(a, -u)); }
  function lqWhy(t) {
    return 'Let $u = \\log_{' + t.a + '} x$, so $\\log_x ' + t.a + ' = \\frac{1}{u}$. The equation is $u ' + (t.K < 0 ? '-' : '+') + ' \\frac{' + Math.abs(t.K) + '}{u} = ' + t.c + '$. Multiply by $u$: $' + poly(1, -t.c, t.K, 'u') + ' = 0$, so $(u ' + sg(-t.u1, '').trim() + ')(u ' + sg(-t.u2, '').trim() + ') = 0$ and $u = ' + t.u1 + '$ or $u = ' + t.u2 + '$.';
  }
  B['FPM-LOG-11'] = { title: 'Log equations that turn into a quadratic', items: [
    G('solve-x', function () {
      var t = lqCase(true), x = cl(t.u2 >= 0 ? Math.pow(t.a, t.u2) : 1 / Math.pow(t.a, -t.u2));
      return N('Solve $' + lqEq(t) + '$. Give the larger value of $x$ as a decimal.', x, lqWhy(t) + ' The larger value is $x = ' + t.a + '^{' + t.u2 + '} = ' + x + '$.');
    }),
    G('solve-x', function () {
      var t = lqCase(true), x = cl(t.u1 >= 0 ? Math.pow(t.a, t.u1) : 1 / Math.pow(t.a, -t.u1));
      return N('Solve $' + lqEq(t) + '$. Give the smaller value of $x$ as a decimal.', x, lqWhy(t) + ' The smaller value is $x = ' + t.a + '^{' + t.u1 + '} = ' + x + '$.');
    }),
    G('form-quadratic', function () {
      var t = lqCase(false);
      return M('Writing $u = \\log_{' + t.a + '} x$, the equation $' + lqEq(t) + '$ becomes a quadratic in $u$. Which one?', dm(poly(1, -t.c, t.K, 'u') + ' = 0'),
        [dm(poly(1, t.c, t.K, 'u') + ' = 0'), dm(poly(1, -t.c, -t.K, 'u') + ' = 0'), dm(poly(1, -t.K, t.c, 'u') + ' = 0'), dm(poly(1, t.c, -t.K, 'u') + ' = 0')],
        'Use $\\log_x ' + t.a + ' = \\frac{1}{u}$ to get $u ' + (t.K < 0 ? '-' : '+') + ' \\frac{' + Math.abs(t.K) + '}{u} = ' + t.c + '$. Multiplying every term by $u$, including the right-hand side, gives $' + poly(1, -t.c, t.K, 'u') + ' = 0$.');
    }),
    G('reciprocal', function () {
      var a = pick([2, 3, 5, 7]);
      return M('Which expression is equal to $\\log_x ' + a + '$?', dm('\\frac{1}{\\log_{' + a + '} x}'), [dm('\\log_{' + a + '} x'), dm('-\\log_{' + a + '} x'), dm('\\frac{x}{' + a + '}')],
        'Change of base to base ' + a + ': $\\log_x ' + a + ' = \\frac{\\log_{' + a + '} ' + a + '}{\\log_{' + a + '} x} = \\frac{1}{\\log_{' + a + '} x}$.');
    }),
    G('convert-back', function () {
      var a = pick([2, 3, 4, 5]), u = pick([-3, -2, -1, 1, 2, 3]), good = rp(a, u);
      return M('In an equation with $u = \\log_{' + a + '} x$, one solution is $u = ' + u + '$. What is the matching value of $x$?', dm(rs(good)),
        [dm(rs(ri(Math.pow(u, a)))), dm(rs(ri(a * u))), dm(rs(rp(a, -u))), dm(rs(ri(a + u))), dm(rs(rneg(good))), dm(rs(rn(u, a)))],
        'Index form: $u = \\log_{' + a + '} x$ means $x = ' + a + '^{u} = ' + a + '^{' + u + '} = ' + rs(good) + '$. ' + (u < 0 ? 'A negative $u$ is allowed and gives a positive fraction.' : ''));
    }),
    G('product', function () {
      var t = lqCase(false), a = pick([2, 5]), c = t.c; t.a = a;
      var v = cl(c >= 0 ? Math.pow(a, c) : 1 / Math.pow(a, -c));
      return N('The equation $' + lqEq(t) + '$ has two solutions for $x$. Find the product of the two solutions as a decimal.', v,
        lqWhy(t) + ' The solutions are $x = ' + a + '^{' + t.u1 + '}$ and $x = ' + a + '^{' + t.u2 + '}$, whose product is $' + a + '^{' + t.u1 + ' + ' + (t.u2 < 0 ? '(' + t.u2 + ')' : t.u2) + '} = ' + a + '^{' + c + '} = ' + v + '$.');
    }),
    G('change-base', function () {
      var b = pick([2, 3, 5]), m = rint(2, 5), n = Math.pow(b, m);
      return M('Writing $u = \\log_{' + b + '} x$, express $\\log_x ' + n + '$ in terms of $u$.', dm('\\frac{' + m + '}{u}'), [dm(m + 'u'), dm('\\frac{u}{' + m + '}'), dm('u^{' + m + '}')],
        '$\\log_x ' + n + ' = \\log_x ' + b + '^{' + m + '} = ' + m + '\\log_x ' + b + ' = \\frac{' + m + '}{\\log_{' + b + '} x} = \\frac{' + m + '}{u}$.');
    }),
    G('solve-x', function () {
      var cases = [[1, 2, 1, 2, 3], [1, 3, 1, 3, 4], [1, 4, 1, 4, 5], [1, 4, 2, 2, 4], [2, 3, 1, 6, 7], [2, 3, 2, 3, 5], [2, 4, 1, 8, 9], [2, 4, 2, 4, 6]];
      // [n, m, u1, u2 (product n*m)...]: use [n, m, small root, big root, c]
      var o = pick(cases), n = o[0], m = o[1], u1 = o[2], u2 = o[3], c = o[4];
      if (u1 * u2 !== n * m || u1 + u2 !== c) { n = 1; m = 2; u1 = 1; u2 = 2; c = 3; }
      var b = pick([2, 3, 5]);
      return N('Solve $\\log_{' + b + '} x + ' + (n === 1 ? '' : n) + '\\log_{x} ' + Math.pow(b, m) + ' = ' + c + '$. Give the larger value of $x$.', Math.pow(b, u2),
        'With $u = \\log_{' + b + '} x$: $\\log_x ' + Math.pow(b, m) + ' = \\frac{' + m + '}{u}$, so $u + \\frac{' + (n * m) + '}{u} = ' + c + '$ and $u^2 - ' + c + 'u + ' + (n * m) + ' = 0$. This gives $u = ' + u1 + '$ or $u = ' + u2 + '$, so $x = ' + Math.pow(b, u1) + '$ or $x = ' + Math.pow(b, u2) + '$.');
    }),
    G('solve-x', function () {
      var t = lqCase(false), good = [rp(t.a, t.u1), rp(t.a, t.u2)];
      var str = function (p, q) { return dm('x = ' + rs(p) + '\\text{ or } x = ' + rs(q)); };
      return M('Solve $' + lqEq(t) + '$.', str(good[0], good[1]),
        [str(rp(t.a, -t.u1), rp(t.a, -t.u2)), str(ri(t.a * t.u1), ri(t.a * t.u2)), str(ri(t.u1), ri(t.u2)), str(good[0], rp(t.a, -t.u2)), str(rp(t.a, -t.u1), good[1])],
        lqWhy(t) + ' Convert back with $x = ' + t.a + '^{u}$: $x = ' + rs(good[0]) + '$ or $x = ' + rs(good[1]) + '$.');
    }),
    G('clear-fraction', function () {
      var K = pick([-6, -4, -3, -2, 2, 3, 4, 6]), c = pick([-3, -2, -1, 1, 2, 3, 4, 5]), lhs = 'u' + (K < 0 ? ' - ' : ' + ') + '\\frac{' + Math.abs(K) + '}{u}';
      var cu = (c === 1 ? '' : (c === -1 ? '-' : c)) + 'u';
      return M('Multiplying both sides of $' + lhs + ' = ' + c + '$ by $u$ gives which equation?', dm('u^2' + sg(K, '') + ' = ' + cu),
        [dm('u^2' + sg(K, '') + ' = ' + c), dm('u' + sg(K, '') + ' = ' + cu), dm('u^2' + sg(K, 'u') + ' = ' + c)],
        'Every term must be multiplied by $u$, including the right-hand side: $u \\times u = u^2$, the fraction becomes ' + K + ', and $' + c + ' \\times u = ' + cu + '$.');
    }),
    S('trap', M('Solving a quadratic in $u = \\log_3 x$ gives $u = 2$ or $u = -1$. A student rejects $u = -1$ because "a log cannot be negative". Is this right?',
      'No. A log can be negative: $u = -1$ gives $x = 3^{-1} = \\frac{1}{3}$, which is positive and valid.',
      ['Yes, so the only solution is $x = 9$.', 'Yes, because $x = 3^{-1}$ is negative.', 'No, because $u = -1$ gives $x = -3$.'],
      'What must be positive is $x$ itself, not the log value. $u = -1$ gives $x = \\frac{1}{3}$ and $u = 2$ gives $x = 9$, so both solutions stand (after checking $x \\neq 1$).')),
    S('trap', M('In $u + \\frac{3}{u} = 4$, where $u = \\log_a x$, why can $u = 0$ never be a solution?',
      '$u = 0$ would mean $x = 1$, and $\\log_x a$ is not defined when the base $x$ is 1 (and the fraction would have a zero denominator).',
      ['Because $\\log_a x$ can never be zero.', 'Because $x$ would be negative.', 'Because zero is not a number.'],
      '$\\log_a x = 0$ means $x = 1$. A base of 1 is not allowed in $\\log_x a$, which is why $\\frac{1}{u}$ is not defined at $u = 0$.'))
  ] };

  // =====================================================================
  // FPM-LOG-12 Simultaneous equations with powers and logs
  // =====================================================================
  function lcomb(c1, v1, c2, v2) { return co(c1, v1) + sg(c2, v2); }
  B['FPM-LOG-12'] = { title: 'Simultaneous equations with powers and logs', items: [
    G('index-pair', function () {
      var r = pick([2, 3, 5]), m = pick([2, 3, 4]), p, y = rint(1, 5), askX = Math.random() < 0.5;
      do { p = pick([-2, -1, 1, 2, 3]); } while (m + p === 0);
      var x = m * y, q = x + p * y;
      return N('Solve the simultaneous equations $' + r + '^{x} = ' + Math.pow(r, m) + '^{y}$ and $' + lcomb(1, 'x', p, 'y') + ' = ' + q + '$. Give the value of $' + (askX ? 'x' : 'y') + '$.', askX ? x : y,
        'Write ' + Math.pow(r, m) + ' as $' + r + '^{' + m + '}$, so $' + r + '^{x} = ' + r + '^{' + m + 'y}$ and $x = ' + m + 'y$. Substitute: $' + lin(m, 0, 'y') + sg(p, 'y') + ' = ' + q + '$, so $' + (m + p === 1 ? '' : (m + p)) + 'y = ' + q + '$, $y = ' + y + '$ and $x = ' + x + '$.');
    }),
    G('log-pair', function () {
      var a = pick([2, 3]), s = rint(2, 4), t = rint(0, s - 1), d = Math.pow(a, s) - Math.pow(a, t);
      return N('Solve $\\log_{' + a + '} x + \\log_{' + a + '} y = ' + (s + t) + '$ and $x - y = ' + d + '$, where $x$ and $y$ are positive. Give the value of $x$.', Math.pow(a, s),
        'Combine the logs: $xy = ' + a + '^{' + (s + t) + '} = ' + Math.pow(a, s + t) + '$. Put $y = x - ' + d + '$: $x^2 - ' + d + 'x - ' + Math.pow(a, s + t) + ' = 0$, which factorises as $(x - ' + Math.pow(a, s) + ')(x + ' + Math.pow(a, t) + ') = 0$. Since $x > 0$, $x = ' + Math.pow(a, s) + '$.');
    }),
    G('quadratic-sub', function () {
      var a = pick([2, 3, 5]), y1 = rint(1, 4), K = a * y1 * y1 - y1, q = rint(1, 3), p = K - q;
      if (p < 1) { q = 1; p = K - 1; }
      var x = y1 + q;
      return N('Solve $\\log_{' + a + '} (x + ' + p + ') - 2\\log_{' + a + '} y = 1$ and $x - y = ' + q + '$, where $x$ and $y$ are positive. Give the value of $x$.', x,
        'Combine: $\\log_{' + a + '} \\frac{x + ' + p + '}{y^2} = 1$, so $x + ' + p + ' = ' + a + 'y^2$. Put $x = y + ' + q + '$: $' + a + 'y^2 - y - ' + K + ' = 0$, which factorises as $(y - ' + y1 + ')(' + a + 'y + ' + (a * y1 - 1) + ') = 0$. Only $y = ' + y1 + '$ is positive, so $x = ' + x + '$.');
    }),
    G('change-base', function () {
      var b = pick([2, 3, 5]), e = pick([2, 3]), s = rint(1, 3), t1 = rint(1, 3), t = e * t1, c1 = s + t1, d = t - s, bb = Math.pow(b, e);
      return N('Solve $\\log_{' + b + '} x + \\log_{' + bb + '} y = ' + c1 + '$ and $\\log_{' + b + '} y - \\log_{' + b + '} x = ' + d + '$. Give the value of $x$.', Math.pow(b, s),
        'Change the base: $\\log_{' + bb + '} y = \\frac{1}{' + e + '}\\log_{' + b + '} y$. Let $p = \\log_{' + b + '} x$ and $q = \\log_{' + b + '} y$: $p + \\frac{q}{' + e + '} = ' + c1 + '$ and $q - p = ' + d + '$. Substituting $q = p ' + (d < 0 ? '- ' + (-d) : '+ ' + d) + '$ gives $p = ' + s + '$, so $x = ' + b + '^{' + s + '} = ' + Math.pow(b, s) + '$.');
    }),
    G('index-pair', function () {
      var a = pick([2, 3, 5]), lim = a === 2 ? 9 : (a === 3 ? 7 : 5), x, y;
      do { x = rint(2, 6); y = rint(0, x - 1); } while (x + y > lim || x + y < 3);
      return N('Solve $' + a + '^{x} \\times ' + a + '^{y} = ' + Math.pow(a, x + y) + '$ and $' + a + '^{x} \\div ' + a + '^{y} = ' + Math.pow(a, x - y) + '$. Give the value of $x$.', x,
        'Add and subtract the powers: $x + y = ' + (x + y) + '$ and $x - y = ' + (x - y) + '$. Adding the two equations gives $2x = ' + (2 * x) + '$, so $x = ' + x + '$ (and $y = ' + y + '$).');
    }),
    G('inverse', function () {
      var p = rint(1, 6), m = pick([2, 3, 4]), n = rint(1, 3);
      return M('Rewrite $\\ln (x + ' + p + ') - ' + m + 'y - ' + n + ' = 0$ so that there is no log.', dm('x + ' + p + ' = e^{' + m + 'y + ' + n + '}'),
        [dm('x + ' + p + ' = e^{' + m + 'y} + e^{' + n + '}'), dm('x + ' + p + ' = e^{' + m + 'y} - e^{' + n + '}'), dm('x = e^{' + m + 'y + ' + n + '} + ' + p), dm('x + ' + p + ' = ' + m + 'y + ' + n)],
        'Rearrange to $\\ln (x + ' + p + ') = ' + m + 'y + ' + n + '$. Taking $e$ to the power of both sides, the whole right-hand side is the index: $x + ' + p + ' = e^{' + m + 'y + ' + n + '}$.');
    }),
    G('rewrite', function () {
      var r = pick([2, 3, 5]), m = pick([2, 3, 4]);
      return M('From $' + r + '^{x} = ' + Math.pow(r, m) + '^{y}$, which linear equation follows?', dm('x = ' + m + 'y'), [dm('y = ' + m + 'x'), dm('x = y + ' + m), dm('x = y^{' + m + '}')],
        '$' + Math.pow(r, m) + ' = ' + r + '^{' + m + '}$, so $' + Math.pow(r, m) + '^{y} = ' + r + '^{' + m + 'y}$. With equal bases, the powers are equal: $x = ' + m + 'y$.');
    }),
    G('quadratic-sub', function () {
      var a = pick([2, 3, 5]), y1 = rint(1, 4), y2 = rn(1 - a * y1, a);
      return M('Solving a pair of equations leaves $y = ' + y1 + '$ or $y = ' + rs(y2) + '$, where $y$ must be positive because it appears inside a logarithm. Which is correct?', dm('y = ' + y1 + '\\text{ only}'),
        [dm('y = ' + rs(y2) + '\\text{ only}'), dm('\\text{both values}'), dm('\\text{neither value}')],
        'A log needs a positive argument, so the negative value $y = ' + rs(y2) + '$ is rejected. Only $y = ' + y1 + '$ is valid.');
    }),
    G('log-pair', function () {
      var x = rint(2, 7), y = rint(x + 1, 9), S = x + y, Mv = x * y;
      return N('Solve $\\ln x + \\ln y = \\ln ' + Mv + '$ and $x + y = ' + S + '$. Give the larger of the two possible values of $x$.', y,
        'Combine: $\\ln xy = \\ln ' + Mv + '$, so $xy = ' + Mv + '$. With $y = ' + S + ' - x$: $x(' + S + ' - x) = ' + Mv + '$, so $x^2 - ' + S + 'x + ' + Mv + ' = 0$ and $(x - ' + x + ')(x - ' + y + ') = 0$. The larger value of $x$ is ' + y + ' (when $y$ is ' + x + ').');
    }),
    G('change-base', function () {
      var b = pick([2, 3, 5]), e = pick([2, 3]);
      return M('Which expression is equal to $\\log_{' + Math.pow(b, e) + '} y$?', dm('\\frac{1}{' + e + '}\\log_{' + b + '} y'), [dm(e + '\\log_{' + b + '} y'), dm('\\log_{' + b + '} y'), dm('\\log_{' + b + '} y - ' + e)],
        '$\\log_{' + Math.pow(b, e) + '} y = \\frac{\\log_{' + b + '} y}{\\log_{' + b + '} ' + Math.pow(b, e) + '} = \\frac{\\log_{' + b + '} y}{' + e + '}$.');
    }),
    S('trap', M('Solving a pair of equations that contain $\\ln x$ gives $(x, y) = (4, 1)$ or $(x, y) = (-2, 3)$. Which pair(s) can be kept?',
      dm('(4, 1)\\text{ only}'), [dm('(-2, 3)\\text{ only}'), dm('\\text{both pairs}'), dm('\\text{neither pair}')],
      '$\\ln x$ is only defined for $x > 0$. The pair $(-2, 3)$ has $x = -2$, so it is rejected, and $(4, 1)$ is kept.'))
  ] };

  // =====================================================================
  // FPM-QUA-03 Completing the square
  // =====================================================================
  function brx(p) { return 'x' + (p[0] === 0 ? '' : rsg(p, '')); }
  function lead(a) { return (a[1] === 1 && a[0] === 1) ? '' : (a[1] === 1 && a[0] === -1 ? '-' : rfirst(a)); }
  function csq(a, p, q) {   // a(x + p)^2 + q  with rationals
    return lead(a) + '(' + brx(p) + ')^2' + (q[0] !== 0 ? rsg(q, '') : '');
  }
  function nsq(q, a, p) {   // q - a(x + p)^2
    return rfirst(q) + ' - ' + (a[1] === 1 && a[0] === 1 ? '' : rmag(a)) + '(' + brx(p) + ')^2';
  }
  B['FPM-QUA-03'] = { title: 'Completing the square', items: [
    G('monic', function () {
      var p = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), c = rint(-10, 15), q = c - p * p;
      return N('Write $' + poly(1, 2 * p, c, 'x') + '$ in the form $(x + p)^2 + q$. Find the value of $q$.', q,
        'Half the coefficient of $x$ is ' + p + ', so $x^2 ' + sg(2 * p, 'x').trim() + ' = (x ' + sg(p, '').trim() + ')^2 - ' + (p * p) + '$. Then $q = ' + c + ' - ' + (p * p) + ' = ' + q + '$.');
    }),
    G('monic', function () {
      var b = pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), c = rint(-6, 10), p = rn(b, 2), q = rsub(ri(c), rn(b * b, 4));
      return M('Write $' + poly(1, b, c, 'x') + '$ in the form $(x + p)^2 + q$.', dm(csq(ri(1), p, q)),
        [dm(csq(ri(1), ri(b), ri(c - b * b))), dm(csq(ri(1), p, radd(ri(c), rn(b * b, 4)))), dm(csq(ri(1), rneg(p), q)), dm(csq(ri(1), p, rsub(ri(c), p)))],
        'Half of ' + b + ' is $' + rs(p) + '$, so $x^2 ' + sg(b, 'x').trim() + ' = (' + brx(p) + ')^2 - \\left(' + rs(p) + '\\right)^2$. Then the constant is $' + c + ' - ' + rs(rn(b * b, 4)) + ' = ' + rs(q) + '$, giving $' + csq(ri(1), p, q) + '$.');
    }),
    G('a-not-1', function () {
      var a = rint(2, 5), p = pick([-4, -3, -2, -1, 1, 2, 3, 4]), c = rint(-9, 12), q = c - a * p * p;
      return N('Write $' + poly(a, 2 * a * p, c, 'x') + '$ in the form $a(x + p)^2 + q$. Find the value of $q$.', q,
        'Take out ' + a + ': $' + a + '(x^2 ' + sg(2 * p, 'x').trim() + ')' + sg(c, '') + ' = ' + a + '(x ' + sg(p, '').trim() + ')^2 - ' + a + ' \\times ' + (p * p) + sg(c, '') + '$. So $q = ' + c + ' - ' + (a * p * p) + ' = ' + q + '$; remember the ' + (p * p) + ' is multiplied by ' + a + '.');
    }),
    G('a-not-1', function () {
      var a = rint(2, 5), p = pick([-4, -3, -2, -1, 1, 2, 3, 4]), c = rint(-9, 12), q = c - a * p * p;
      return M('Write $' + poly(a, 2 * a * p, c, 'x') + '$ in the form $a(x + p)^2 + q$.', dm(csq(ri(a), ri(p), ri(q))),
        [dm(csq(ri(a), ri(p), ri(c - p * p))), dm(csq(ri(a), ri(p), ri(c + a * p * p))), dm(csq(ri(a), ri(a * p), ri(c - a * a * a * p * p))), dm(csq(ri(a), ri(-p), ri(q)))],
        'Take out ' + a + ' from the first two terms: $' + a + '(x^2 ' + sg(2 * p, 'x').trim() + ')' + sg(c, '') + '$. Complete the square inside: $' + a + '\\left[(x ' + sg(p, '').trim() + ')^2 - ' + (p * p) + '\\right]' + sg(c, '') + '$. The ' + (p * p) + ' is multiplied by ' + a + ', so the constant is $' + c + ' - ' + (a * p * p) + ' = ' + q + '$.');
    }),
    G('fractions', function () {
      var a = pick([2, 3, 4, 5, 8]), b, c = rint(-8, 8), p, q;
      do { b = rint(-9, 9); } while (b === 0 || b % (2 * a) === 0);
      p = rn(b, 2 * a); q = rsub(ri(c), rn(b * b, 4 * a));
      return M('Write $' + poly(a, b, c, 'x') + '$ in the form $a(x + p)^2 + q$.', dm(csq(ri(a), p, q)),
        [dm(csq(ri(a), p, rsub(ri(c), rmul(p, p)))), dm(csq(ri(a), rneg(p), q)), dm(csq(ri(a), rn(b, 2), rsub(ri(c), rn(a * b * b, 4)))), dm(csq(ri(a), p, radd(ri(c), rn(b * b, 4 * a))))],
        'Take out ' + a + ': $' + a + '\\left(x^2 ' + rsg(rn(b, a), 'x').trim() + '\\right)' + sg(c, '') + '$. Half of $' + rs(rn(b, a)) + '$ is $' + rs(p) + '$, so this is $' + a + '\\left[(' + brx(p) + ')^2 - \\left(' + rs(p) + '\\right)^2\\right]' + sg(c, '') + '$. The constant is $' + c + ' - ' + a + ' \\times ' + rs(rmul(p, p)) + ' = ' + rs(q) + '$.');
    }),
    G('negative', function () {
      var p = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), c = rint(1, 15), q = c + p * p;
      return N('Write $' + c + sg(2 * p, 'x') + ' - x^2$ in the form $q - (x - p)^2$. Find the value of $q$.', q,
        'Take out $-1$: $-(x^2 ' + sg(-2 * p, 'x').trim() + ') + ' + c + ' = -\\left[(x ' + sg(-p, '').trim() + ')^2 - ' + (p * p) + '\\right] + ' + c + '$. The ' + (p * p) + ' changes sign, so $q = ' + c + ' + ' + (p * p) + ' = ' + q + '$.');
    }),
    G('negative', function () {
      var a = rint(1, 4), p = pick([-4, -3, -2, -1, 1, 2, 3, 4]), c = rint(1, 15), q = c + a * p * p;
      var eq = c + sg(2 * a * p, 'x') + ' - ' + (a === 1 ? '' : a) + 'x^2';
      return M('Write $' + eq + '$ in the form $q - a(x + p)^2$.', dm(nsq(ri(q), ri(a), ri(-p))),
        [dm(nsq(ri(q), ri(a), ri(p))), dm(nsq(ri(c - a * p * p), ri(a), ri(-p))), dm(nsq(ri(c + p * p), ri(a), ri(-p))), dm(nsq(ri(c - p * p), ri(a), ri(p)))],
        'Take out $-' + a + '$ from the $x$ terms: $-' + (a === 1 ? '' : a) + '(x^2 ' + sg(-2 * p, 'x').trim() + ') + ' + c + ' = -' + (a === 1 ? '' : a) + '\\left[(x ' + sg(-p, '').trim() + ')^2 - ' + (p * p) + '\\right] + ' + c + '$. The subtracted ' + (p * p) + ' becomes $+' + (a * p * p) + '$ after multiplying by $-' + (a === 1 ? '' : a) + '$, so the constant is ' + c + ' + ' + (a * p * p) + ' = ' + q + '.');
    }),
    G('sign', function () {
      var p0 = rint(1, 6), c = rint(-9, 12);
      return N('Write $' + poly(1, -2 * p0, c, 'x') + '$ in the form $(x + b)^2 + c$. Find the value of $b$.', -p0,
        'Half the coefficient of $x$ is $-' + p0 + '$, so $x^2 - ' + (2 * p0) + 'x = (x - ' + p0 + ')^2 - ' + (p0 * p0) + '$. Comparing with $(x + b)^2$ gives $b = -' + p0 + '$.');
    }),
    G('reverse', function () {
      var a = rint(2, 5), p = pick([-3, -2, -1, 1, 2, 3]), q = rint(-6, 9), askB = Math.random() < 0.5;
      var ans = askB ? 2 * a * p : a * p * p + q;
      return N('It is given that $' + csq(ri(a), ri(p), ri(q)) + ' = ' + co(a, 'x^2') + ' + bx + c$ for all $x$. Find the value of $' + (askB ? 'b' : 'c') + '$.', ans,
        'Expand: $' + a + '(x ' + sg(p, '').trim() + ')^2' + sg(q, '') + ' = ' + a + 'x^2' + sg(2 * a * p, 'x') + sg(a * p * p, '') + sg(q, '') + '$. So $b = ' + (2 * a * p) + '$ and $c = ' + (a * p * p + q) + '$.');
    }),
    G('error-spot', function () {
      var a = rint(2, 4), p = rint(1, 4), c = rint(1, 9), q = c - a * p * p;
      return M('A student writes $' + poly(a, 2 * a * p, c, 'x') + ' = ' + a + '(x + ' + p + ')^2 + ' + c + ' - ' + (p * p) + '$. What is the error?',
        'The ' + (p * p) + ' must be multiplied by ' + a + ' (the factor taken out), so the form is $' + csq(ri(a), ri(p), ri(q)) + '$.',
        ['The bracket should be $(x + ' + (2 * p) + ')^2$.', 'The constant should be $' + c + ' + ' + (a * p * p) + '$.', 'There is no error.'],
        'Taking out ' + a + ' means the square that is subtracted is ' + a + ' $\\times$ ' + (p * p) + ' = ' + (a * p * p) + ', not ' + (p * p) + '. The correct constant is $' + c + ' - ' + (a * p * p) + ' = ' + q + '$.');
    }),
    S('method', M('What is the first step when completing the square for $3x^2 + 12x + 5$?',
      'Take out 3 from the first two terms: $3(x^2 + 4x) + 5$.', ['Halve 12 to get 6 and write $(x + 6)^2$.', 'Divide the whole expression by 3, including the 5.', 'Subtract 5 from the $x$ terms.'],
      'The coefficient of $x^2$ must be 1 inside the bracket, so factorise it out of the $x^2$ and $x$ terms only: $3(x^2 + 4x) + 5$. Then $x^2 + 4x = (x + 2)^2 - 4$, giving $3(x + 2)^2 - 7$.'))
  ] };

  // =====================================================================
  // FPM-QUA-04 Maximum and minimum from completed-square form
  // =====================================================================
  B['FPM-QUA-04'] = { title: 'Reading the maximum or minimum from completed-square form', items: [
    G('read-value', function () {
      var a = rint(1, 4), p = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), q = rint(-8, 12);
      return N('For $f(x) = ' + csq(ri(a), ri(p), ri(q)) + '$, find the minimum value of $f(x)$.', q,
        '$(x ' + sg(p, '').trim() + ')^2 \\geqslant 0$, so the least value is when the bracket is zero, giving $f(x) = ' + q + '$.');
    }),
    G('read-x', function () {
      var a = rint(1, 4), p = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), q = rint(-8, 12);
      return N('For $f(x) = ' + csq(ri(a), ri(p), ri(q)) + '$, find the value of $x$ at which $f(x)$ is least.', -p,
        'The bracket is zero when $x ' + sg(p, '').trim() + ' = 0$, so $x = ' + (-p) + '$. The $x$-value has the opposite sign to the number in the bracket.');
    }),
    G('max-or-min', function () {
      var a = rint(1, 4), p = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = rint(1, 15), T = function (w, v, x) { return dm('\\text{' + w + ' of } ' + v + '\\text{ when } x = ' + x); };
      return M('For $f(x) = ' + nsq(ri(q), ri(a), ri(p)) + '$, which statement is correct?', T('greatest value', q, -p),
        [T('greatest value', q, p), T('least value', q, -p), T('greatest value', -q, -p)],
        'Here $-' + (a === 1 ? '' : a) + '(x ' + sg(p, '').trim() + ')^2 \\leqslant 0$, so $f(x)$ is greatest, when the bracket is zero. That happens at $x = ' + (-p) + '$ and the greatest value is ' + q + '.');
    }),
    G('expanded', function () {
      var a = rint(1, 3), p = rint(1, 6), c = rint(1, 20), q = c - a * p * p;
      return N('Find the minimum value of $' + poly(a, -2 * a * p, c, 'x') + '$.', q,
        'Complete the square: $' + poly(a, -2 * a * p, c, 'x') + ' = ' + csq(ri(a), ri(-p), ri(q)) + '$. The minimum value is $' + q + '$ (when $x = ' + p + '$).');
    }),
    G('expanded', function () {
      var a = rint(1, 3), p = rint(1, 6), c = rint(1, 20), q = c - a * p * p;
      return N('Find the value of $x$ at which $' + poly(a, -2 * a * p, c, 'x') + '$ has its minimum value.', p,
        'Complete the square: $' + poly(a, -2 * a * p, c, 'x') + ' = ' + csq(ri(a), ri(-p), ri(q)) + '$. The bracket is zero when $x = ' + p + '$.');
    }),
    G('reciprocal', function () {
      var p = rint(1, 5), q = pick([2, 4, 5, 8, 10]);
      return N('Given that $f(x) = (x + ' + p + ')^2 + ' + q + '$, find the greatest value of $\\frac{1}{f(x)}$ as a decimal.', 1 / q,
        'The least value of $f(x)$ is ' + q + '. The reciprocal is largest when $f(x)$ is smallest, so the greatest value of $\\frac{1}{f(x)}$ is $\\frac{1}{' + q + '} = ' + cl(1 / q) + '$.');
    }),
    G('reciprocal', function () {
      var p = rint(1, 6), q = rint(2, 9), c = q + p * p;
      return M('Find the greatest value of $\\frac{1}{' + poly(1, 2 * p, c, 'x') + '}$.', dm('\\frac{1}{' + q + '}'), [dm(String(q)), dm('\\frac{1}{' + c + '}'), dm('\\frac{1}{' + (q * q) + '}')],
        '$' + poly(1, 2 * p, c, 'x') + ' = (x + ' + p + ')^2 + ' + q + '$, which has least value ' + q + '. A fraction with a positive numerator is largest when its denominator is smallest, so the greatest value is $\\frac{1}{' + q + '}$.');
    }),
    G('shift', function () {
      var p = rint(1, 6), q = rint(1, 9), k = rint(1, 4), dir = pick([1, -1]);
      return N('The function $f(x) = (x + ' + p + ')^2 + ' + q + '$ has its least value at $x = ' + (-p) + '$. The function $g$ is defined by $g(x) = f(x ' + (dir > 0 ? '-' : '+') + ' ' + k + ')$. Find the value of $x$ at which $g(x)$ is least.', -p + dir * k,
        '$g(x) = (x ' + (dir > 0 ? '-' : '+') + ' ' + k + ' + ' + p + ')^2 + ' + q + '$. The bracket is zero when $x = ' + (-p + dir * k) + '$. Replacing $x$ by $x ' + (dir > 0 ? '-' : '+') + ' ' + k + '$ moves the graph ' + k + ' units ' + (dir > 0 ? 'right' : 'left') + '.');
    }),
    G('transform', function () {
      var p = rint(1, 6), q = rint(1, 9), t = pick(['add', 'sub', 'mul']), k = t === 'mul' ? rint(2, 4) : rint(1, 5), r = t === 'add' ? q + k : (t === 'sub' ? q - k : q * k);
      var gdef = t === 'add' ? 'f(x) + ' + k : (t === 'sub' ? 'f(x) - ' + k : k + 'f(x)');
      return N('The function $f(x) = (x + ' + p + ')^2 + ' + q + '$. The function $g$ is defined by $g(x) = ' + gdef + '$. Find the least value of $g(x)$.', r,
        'The least value of $f(x)$ is ' + q + '. So the least value of $' + gdef + '$ is ' + (t === 'mul' ? k + ' $\\times$ ' + q : q + (t === 'add' ? ' + ' : ' - ') + k) + ' = ' + r + '.');
    }),
    G('turning-point', function () {
      var a = rint(1, 4), p = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = pick([-7, -5, -3, -2, -1, 1, 2, 3, 5, 8]);
      return M('The curve $y = ' + csq(ri(a), ri(p), ri(q)) + '$ has a turning point. What are its coordinates?', dm('(' + (-p) + ',\\ ' + q + ')'),
        [dm('(' + p + ',\\ ' + q + ')'), dm('(' + (-p) + ',\\ ' + (-q) + ')'), dm('(' + q + ',\\ ' + (-p) + ')'), dm('(' + (-q) + ',\\ ' + p + ')'), dm('(' + q + ',\\ ' + p + ')')],
        'The squared bracket is zero at $x = ' + (-p) + '$, where $y = ' + q + '$. So the turning point (a minimum) is $(' + (-p) + ', ' + q + ')$. The sign of $p$ in the bracket flips for the $x$-coordinate.');
    }),
    G('reverse', function () {
      var b = pick([-8, -6, -4, -2, 2, 4, 6, 8]), m = rint(-5, 9);
      return N('The minimum value of $x^2 ' + sg(b, 'x').trim() + ' + c$ is ' + m + '. Find the value of $c$.', m + b * b / 4,
        'Complete the square: $x^2 ' + sg(b, 'x').trim() + ' + c = (x ' + sg(b / 2, '').trim() + ')^2 + c - ' + (b * b / 4) + '$. The minimum value is $c - ' + (b * b / 4) + ' = ' + m + '$, so $c = ' + (m + b * b / 4) + '$.');
    }),
    G('trap-sign', function () {
      var p = rint(1, 6), q = rint(1, 12);
      return M('For $f(x) = ' + q + ' - (x - ' + p + ')^2$, which statement is true?', dm('\\text{greatest value } ' + q + '\\text{ at } x = ' + p),
        [dm('\\text{greatest value } ' + q + '\\text{ at } x = ' + (-p)), dm('\\text{least value } ' + q + '\\text{ at } x = ' + p), dm('\\text{least value } ' + (-q) + '\\text{ at } x = ' + (-p))],
        '$(x - ' + p + ')^2 \\geqslant 0$, so $' + q + ' - (x - ' + p + ')^2 \\leqslant ' + q + '$. The greatest value is ' + q + ', when $x - ' + p + ' = 0$, that is $x = ' + p + '$.');
    }),
    S('concept', M('Why does $2(x + 3)^2 + 5$ have a least value of 5?',
      'Because $(x + 3)^2$ is never negative, so the expression is never less than 5, and it equals 5 when $x = -3$.',
      ['Because the constant 5 is the smallest number in the expression.', 'Because $(x + 3)^2$ is always at least 3.', 'Because $2(x + 3)^2$ is always negative.'],
      'A square cannot be negative: $(x + 3)^2 \\geqslant 0$. So $2(x + 3)^2 + 5 \\geqslant 5$, with equality when $x + 3 = 0$.'))
  ] };

  // =====================================================================
  // FPM-QUA-05 The discriminant
  // =====================================================================
  function slipCase() {
    var m = pick([1, 2, 3]), t = m + rint(1, 3), s = t * t - m * m;
    return { m: m, t: t, s: s, lo: 2 * m - 2 * t, hi: 2 * m + 2 * t, eq: 'x^2 + kx + (' + lin(m, s, 'k') + ') = 0' };
  }
  B['FPM-QUA-05'] = { title: 'The discriminant: equal, real or no real roots', items: [
    G('equal-roots', function () {
      var m = pick([2, 3, 4, 6]), divs = [], d;
      for (d = 1; d <= m * m; d++) if ((m * m) % d === 0) divs.push(d);
      var c = pick(divs), k = m * m / c;
      return N('The equation $kx^2 + ' + (2 * m) + 'x + ' + c + ' = 0$ has equal roots. Find the value of $k$.', k,
        'Equal roots means $b^2 - 4ac = 0$: $' + (2 * m) + '^2 - 4 \\times k \\times ' + c + ' = 0$, so $' + (4 * m * m) + ' = ' + (4 * c) + 'k$ and $k = ' + k + '$.');
    }),
    G('condition', function () {
      var ph = pick([['two distinct real roots', 'b^2 - 4ac \\gt 0'], ['equal roots', 'b^2 - 4ac = 0'], ['real roots', 'b^2 - 4ac \\geqslant 0'], ['no real roots', 'b^2 - 4ac \\lt 0']]);
      var all = ['b^2 - 4ac \\gt 0', 'b^2 - 4ac = 0', 'b^2 - 4ac \\geqslant 0', 'b^2 - 4ac \\lt 0'];
      return M('For the quadratic equation $ax^2 + bx + c = 0$, which condition means "' + ph[0] + '"?', dm(ph[1]), all.filter(function (x) { return x !== ph[1]; }).map(dm),
        'The discriminant $b^2 - 4ac$ decides the roots: ' + { 'two distinct real roots': 'positive gives two different real roots', 'equal roots': 'zero gives one repeated root', 'real roots': 'zero or positive gives real roots (equal or distinct)', 'no real roots': 'negative gives no real roots' }[ph[0]] + '.');
    }),
    G('condition', function () {
      var b = pick([-10, -8, -6, -4, -2, 2, 4, 6, 8, 10]), v = fr(b * b, 4), ph = pick([['real roots', 'k \\leqslant ' + v], ['two distinct real roots', 'k \\lt ' + v], ['no real roots', 'k \\gt ' + v], ['equal roots', 'k = ' + v]]);
      var all = ['k \\leqslant ' + v, 'k \\lt ' + v, 'k \\gt ' + v, 'k = ' + v];
      return M('The equation $' + poly(1, b, 0, 'x') + ' + k = 0$ has ' + ph[0] + '. Find the condition on $k$.', dm(ph[1]), all.filter(function (x) { return x !== ph[1]; }).map(dm),
        'Discriminant: $(' + b + ')^2 - 4 \\times 1 \\times k = ' + (b * b) + ' - 4k$. For ' + ph[0] + ' we need this ' + { 'real roots': '$\\geqslant 0$', 'two distinct real roots': '$\\gt 0$', 'no real roots': '$\\lt 0$', 'equal roots': '$= 0$' }[ph[0]] + ', which gives $' + ph[1] + '$.');
    }),
    G('region', function () {
      var s = rint(2, 6), In = '-' + (2 * s) + ' \\lt k \\lt ' + (2 * s), Out = 'k \\lt -' + (2 * s) + '\\text{ or } k \\gt ' + (2 * s), OutI = 'k \\leqslant -' + (2 * s) + '\\text{ or } k \\geqslant ' + (2 * s), InI = '-' + (2 * s) + ' \\leqslant k \\leqslant ' + (2 * s);
      var ph = pick([['no real roots', In], ['two distinct real roots', Out], ['real roots', OutI]]), all = [In, Out, OutI, InI];
      return M('Find the values of $k$ for which $x^2 + kx + ' + (s * s) + ' = 0$ has ' + ph[0] + '.', dm(ph[1]), all.filter(function (x) { return x !== ph[1]; }).map(dm),
        'Discriminant: $k^2 - 4 \\times ' + (s * s) + ' = k^2 - ' + (4 * s * s) + ' = (k - ' + (2 * s) + ')(k + ' + (2 * s) + ')$. The critical values are $\\pm ' + (2 * s) + '$. The graph of $k^2 - ' + (4 * s * s) + '$ is a U shape, so it is ' + (ph[0] === 'no real roots' ? 'negative between them' : 'positive outside them') + (ph[0] === 'real roots' ? ', and zero is allowed for real roots' : '') + '.');
    }),
    G('tangent', function () {
      var t = pick([-4, -3, -2, -1, 1, 2, 3, 4]), m = rint(1, 4), b = m + 2 * t, d = rint(-3, 8), k = d - t * t;
      return N('The line $y = ' + co(m, 'x') + ' + k$ is a tangent to the curve $y = ' + poly(1, b, d, 'x') + '$. Find the value of $k$.', k,
        'Set the equations equal: $' + poly(1, b, d, 'x') + ' = ' + co(m, 'x') + ' + k$, so $' + poly(1, b - m, d, 'x') + ' - k = 0$. A tangent means one repeated root: $(' + (b - m) + ')^2 - 4(' + d + ' - k) = 0$, so $' + ((b - m) * (b - m)) + ' = ' + (4 * d) + ' - 4k$ and $k = ' + k + '$.');
    }),
    G('line-curve', function () {
      var t = rint(1, 4), c = rint(-3, 8), v = c - t * t, ph = pick([['not meet the curve', 'k \\lt ' + v, 'does not meet the curve'], ['meet the curve at two distinct points', 'k \\gt ' + v, 'meets the curve at two distinct points'], ['touch the curve', 'k = ' + v, 'touches the curve']]);
      var all = ['k \\lt ' + v, 'k \\gt ' + v, 'k = ' + v, 'k \\leqslant ' + v];
      return M('The line $y = ' + (2 * t) + 'x + k$ and the curve $y = ' + poly(1, 0, c, 'x') + '$. For which values of $k$ does the line ' + ph[0] + '?', dm(ph[1]), all.filter(function (x) { return x !== ph[1]; }).map(dm),
        'Equate: $' + poly(1, 0, c, 'x') + ' = ' + (2 * t) + 'x + k$, so $x^2 - ' + (2 * t) + 'x + (' + c + ' - k) = 0$. Discriminant: $' + (4 * t * t) + ' - 4(' + c + ' - k) = ' + (4 * t * t - 4 * c) + ' + 4k$. The line ' + ph[2] + ' when this is ' + { 'not meet the curve': '$\\lt 0$', 'meet the curve at two distinct points': '$\\gt 0$', 'touch the curve': '$= 0$' }[ph[0]] + ', which gives $' + ph[1] + '$.');
    }),
    G('critical-values', function () {
      var c = slipCase(), ph = pick([['no real roots', 'in'], ['two distinct real roots', 'out'], ['real roots', 'outI']]);
      var In = c.lo + ' \\lt k \\lt ' + c.hi, Out = 'k \\lt ' + c.lo + '\\text{ or } k \\gt ' + c.hi, OutI = 'k \\leqslant ' + c.lo + '\\text{ or } k \\geqslant ' + c.hi, InI = c.lo + ' \\leqslant k \\leqslant ' + c.hi;
      var map = { 'in': In, 'out': Out, 'outI': OutI }, good = map[ph[1]];
      return M('Find the values of $k$ for which $' + c.eq + '$ has ' + ph[0] + '.', dm(good), [In, Out, OutI, InI].filter(function (x) { return x !== good; }).map(dm),
        'Discriminant: $k^2 - 4(' + lin(c.m, c.s, 'k') + ') = k^2 ' + sg(-4 * c.m, 'k').trim() + ' ' + sg(-4 * c.s, '').trim() + ' = (k ' + sg(-c.hi, '').trim() + ')(k ' + sg(-c.lo, '').trim() + ')$. The critical values are $k = ' + c.lo + '$ and $k = ' + c.hi + '$. For ' + ph[0] + ' the discriminant is ' + { 'no real roots': 'negative, which is between them', 'two distinct real roots': 'positive, which is outside them', 'real roots': 'zero or positive, which is outside them and includes them' }[ph[0]] + '.');
    }),
    G('critical-values', function () {
      var c = slipCase();
      return N('The equation $' + c.eq + '$ has equal roots. Find the larger value of $k$.', c.hi,
        'Equal roots: $k^2 - 4(' + lin(c.m, c.s, 'k') + ') = 0$, so $k^2 ' + sg(-4 * c.m, 'k').trim() + ' ' + sg(-4 * c.s, '').trim() + ' = 0$ and $(k ' + sg(-c.hi, '').trim() + ')(k ' + sg(-c.lo, '').trim() + ') = 0$. The larger value is $k = ' + c.hi + '$.');
    }),
    G('evaluate', function () {
      var a = pick([-3, -2, -1, 1, 2, 3, 4]), b = rint(-7, 7), c = rint(-6, 6);
      if (c === 0) c = 2;
      return N('Find the value of the discriminant of $' + poly(a, b, c, 'x') + ' = 0$.', b * b - 4 * a * c,
        '$b^2 - 4ac = (' + b + ')^2 - 4(' + a + ')(' + c + ') = ' + (b * b) + ' - (' + (4 * a * c) + ') = ' + (b * b - 4 * a * c) + '$.');
    }),
    G('evaluate', function () {
      var a = pick([-3, -2, -1, 1, 2, 3, 4]), b = rint(-7, 7), c = rint(-6, 6), D;
      if (c === 0) c = 2;
      D = b * b - 4 * a * c;
      return M('How many real roots does $' + poly(a, b, c, 'x') + ' = 0$ have?', D > 0 ? 'Two distinct real roots' : (D === 0 ? 'One repeated real root' : 'No real roots'),
        ['Two distinct real roots', 'One repeated real root', 'No real roots', 'It cannot be decided'].filter(function (x) { return x !== (D > 0 ? 'Two distinct real roots' : (D === 0 ? 'One repeated real root' : 'No real roots')); }),
        'The discriminant is $b^2 - 4ac = ' + (b * b) + ' - 4(' + a + ')(' + c + ') = ' + D + '$, which is ' + (D > 0 ? 'positive, so there are two distinct real roots' : (D === 0 ? 'zero, so there is one repeated root' : 'negative, so there are no real roots')) + '.');
    }),
    G('real-x', function () {
      var b = pick([-8, -6, -4, -2, 2, 4, 6, 8]), c = rint(-5, 9), v = c - b * b / 4;
      return M('The curve is $y = ' + poly(1, b, c, 'x') + '$. Rearranged as a quadratic in $x$, for which values of $y$ is $x$ real?', dm('y \\geqslant ' + v),
        [dm('y \\leqslant ' + v), dm('y \\gt ' + v), dm('y \\geqslant ' + c)],
        'Write $x^2 ' + sg(b, 'x').trim() + ' + (' + c + ' - y) = 0$. For real $x$ we need $(' + b + ')^2 - 4(' + c + ' - y) \\geqslant 0$ (that is $' + (b * b - 4 * c) + ' + 4y \\geqslant 0$), so $4y \\geqslant ' + (4 * c - b * b) + '$ and $y \\geqslant ' + v + '$.');
    }),
    G('restriction', function () {
      var b = pick([2, 4, 6, 8]), c = rint(1, 5), v = fr(b * b, 4 * c);
      return M('The equation $kx^2 + ' + b + 'x + ' + c + ' = 0$ has two distinct real roots. Find the possible values of $k$.', dm('k \\lt ' + v + ',\\ k \\neq 0'),
        [dm('k \\lt ' + v), dm('k \\gt ' + v + ',\\ k \\neq 0'), dm('k \\leqslant ' + v + ',\\ k \\neq 0')],
        'Discriminant: $' + (b * b) + ' - 4k \\times ' + c + ' = ' + (b * b) + ' - ' + (4 * c) + 'k \\gt 0$, so $k \\lt ' + v + '$. The equation is only a quadratic if $k \\neq 0$, so that value is excluded.');
    })
  ] };

  // =====================================================================
  // FPM-QUA-07 Sum and product of roots
  // =====================================================================
  function spCase(needP) {   // S, P with real distinct roots
    var S, P;
    do { S = rint(-6, 6); P = needP ? pick([-5, -4, -2, -1, 1, 2, 4, 5]) : rint(-8, 8); } while (S * S - 4 * P <= 0 || (S === 0 && P === 0));
    return { S: S, P: P, eq: poly(1, -S, P, 'x') + ' = 0' };
  }
  var AB = '\\alpha', BB = '\\beta';
  B['FPM-QUA-07'] = { title: 'Sum and product of roots', items: [
    G('write-down', function () {
      var a = pick([2, 3, 4, 5]), b = pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]), c = pick([-8, -7, -5, -3, -1, 1, 2, 3, 5, 7]), S = rn(-b, a), P = rn(c, a);
      var f = function (s, p) { return dm(AB + ' + ' + BB + ' = ' + rs(s) + ',\\ ' + AB + BB + ' = ' + rs(p)); };
      return M('The roots of $' + poly(a, b, c, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Write down $\\alpha + \\beta$ and $\\alpha\\beta$.', f(S, P),
        [f(rneg(S), P), f(ri(-b), ri(c)), f(S, rneg(P)), f(S, ri(c)), f(rn(b, a), rn(-c, a))],
        'For $ax^2 + bx + c = 0$: $\\alpha + \\beta = -\\frac{b}{a} = ' + rs(S) + '$ and $\\alpha\\beta = \\frac{c}{a} = ' + rs(P) + '$. Divide by $a = ' + a + '$ and mind the sign of the sum.');
    }),
    G('write-down', function () {
      var a = pick([1, 2, 3]), S = rint(-6, 6), c = rint(-9, 9);
      return N('The roots of $' + poly(a, -a * S, c, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the value of $\\alpha + \\beta$.', S,
        '$\\alpha + \\beta = -\\frac{b}{a} = -\\frac{' + (-a * S) + '}{' + a + '} = ' + S + '$.');
    }),
    G('write-down', function () {
      var a = pick([1, 2, 3]), b = rint(-6, 6), P = rint(-6, 6);
      return N('The roots of $' + poly(a, b, a * P, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the value of $\\alpha\\beta$.', P,
        '$\\alpha\\beta = \\frac{c}{a} = \\frac{' + (a * P) + '}{' + a + '} = ' + P + '$.');
    }),
    G('squares', function () {
      var c = spCase(false), v = c.S * c.S - 2 * c.P;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Without solving the equation, find the value of $\\alpha^2 + \\beta^2$.', v,
        '$\\alpha + \\beta = ' + c.S + '$ and $\\alpha\\beta = ' + c.P + '$. Then $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = ' + (c.S * c.S) + ' - 2(' + c.P + ') = ' + v + '$.');
    }),
    G('cubes', function () {
      var c = spCase(false), v = Math.pow(c.S, 3) - 3 * c.P * c.S;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Without solving the equation, find the value of $\\alpha^3 + \\beta^3$.', v,
        '$\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta) = (' + c.S + ')^3 - 3(' + c.P + ')(' + c.S + ') = ' + Math.pow(c.S, 3) + ' - (' + (3 * c.P * c.S) + ') = ' + v + '$.');
    }),
    G('fourth-powers', function () {
      var c = spCase(false), u = c.S * c.S - 2 * c.P, v = u * u - 2 * c.P * c.P;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Without solving the equation, find the value of $\\alpha^4 + \\beta^4$.', v,
        'First $\\alpha^2 + \\beta^2 = (' + c.S + ')^2 - 2(' + c.P + ') = ' + u + '$. Then $\\alpha^4 + \\beta^4 = (\\alpha^2 + \\beta^2)^2 - 2(\\alpha\\beta)^2 = ' + (u * u) + ' - 2 \\times ' + (c.P * c.P) + ' = ' + v + '$.');
    }),
    G('fractions', function () {
      var c = spCase(true), v = c.S / c.P;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the value of $\\frac{1}{\\alpha} + \\frac{1}{\\beta}$ as a decimal.', cl(v),
        '$\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta} = \\frac{' + c.S + '}{' + c.P + '} = ' + cl(v) + '$.');
    }),
    G('fractions', function () {
      var c = spCase(true), v = (c.S * c.S - 2 * c.P) / c.P;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the value of $\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha}$ as a decimal.', cl(v),
        '$\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha} = \\frac{\\alpha^2 + \\beta^2}{\\alpha\\beta} = \\frac{(' + c.S + ')^2 - 2(' + c.P + ')}{' + c.P + '} = \\frac{' + (c.S * c.S - 2 * c.P) + '}{' + c.P + '} = ' + cl(v) + '$.');
    }),
    G('brackets', function () {
      var c = spCase(false), k = pick([-3, -2, -1, 1, 2, 3]), v = c.P + k * c.S + k * k;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the value of $(\\alpha ' + sg(k, '').trim() + ')(\\beta ' + sg(k, '').trim() + ')$.', v,
        'Expand: $(\\alpha ' + sg(k, '').trim() + ')(\\beta ' + sg(k, '').trim() + ') = \\alpha\\beta ' + sg(k, '').trim() + '(\\alpha + \\beta) + ' + (k * k) + ' = ' + c.P + ' + (' + k + ')(' + c.S + ') + ' + (k * k) + ' = ' + v + '$.');
    }),
    G('factorise-symmetric', function () {
      var c = spCase(false), v = c.P * c.S;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the value of $\\alpha^2\\beta + \\alpha\\beta^2$.', v,
        'Factorise: $\\alpha^2\\beta + \\alpha\\beta^2 = \\alpha\\beta(\\alpha + \\beta) = (' + c.P + ')(' + c.S + ') = ' + v + '$.');
    }),
    G('non-monic', function () {
      var a = pick([2, 3]), b = pick([-7, -5, -3, -1, 1, 3, 5, 7]), c = pick([-5, -3, -1, 1, 2, 3, 4]), D = b * b - 4 * a * c;
      if (D <= 0) { b = 5; c = -1; }
      var S = rn(-b, a), P = rn(c, a), v = rsub(rmul(S, S), rmul(ri(2), P));
      return M('The roots of $' + poly(a, b, c, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find $\\alpha^2 + \\beta^2$.', dm(rs(v)),
        [dm(rs(ri(b * b - 2 * c))), dm(rs(rsub(rmul(S, S), P))), dm(rs(radd(rmul(S, S), rmul(ri(2), P)))), dm(rs(rsub(rmul(S, S), ri(2 * c))))],
        '$\\alpha + \\beta = ' + rs(S) + '$ and $\\alpha\\beta = ' + rs(P) + '$ (both divided by $a = ' + a + '$). So $\\alpha^2 + \\beta^2 = \\left(' + rs(S) + '\\right)^2 - 2\\left(' + rs(P) + '\\right) = ' + rs(v) + '$.');
    }),
    S('identity', M('Which is the correct expression for $\\alpha^3 + \\beta^3$ in terms of $\\alpha + \\beta$ and $\\alpha\\beta$?', dm('(\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)'),
      [dm('(\\alpha + \\beta)^3 - 3\\alpha\\beta'), dm('(\\alpha + \\beta)^3 + 3\\alpha\\beta(\\alpha + \\beta)'), dm('(\\alpha + \\beta)^3 - 2\\alpha\\beta(\\alpha + \\beta)')],
      '$(\\alpha + \\beta)^3 = \\alpha^3 + 3\\alpha^2\\beta + 3\\alpha\\beta^2 + \\beta^3 = \\alpha^3 + \\beta^3 + 3\\alpha\\beta(\\alpha + \\beta)$. So $\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)$; the factor $(\\alpha + \\beta)$ must stay.')),
    S('identity', M('Which is the correct expression for $\\alpha^4 + \\beta^4$ in terms of $\\alpha^2 + \\beta^2$ and $\\alpha\\beta$?', dm('(\\alpha^2 + \\beta^2)^2 - 2(\\alpha\\beta)^2'),
      [dm('(\\alpha^2 + \\beta^2)^2 - 2\\alpha\\beta'), dm('(\\alpha^2 + \\beta^2)^2 + 2(\\alpha\\beta)^2'), dm('(\\alpha^2 + \\beta^2)^2 - (\\alpha\\beta)^2')],
      '$(\\alpha^2 + \\beta^2)^2 = \\alpha^4 + 2\\alpha^2\\beta^2 + \\beta^4$, so $\\alpha^4 + \\beta^4 = (\\alpha^2 + \\beta^2)^2 - 2\\alpha^2\\beta^2 = (\\alpha^2 + \\beta^2)^2 - 2(\\alpha\\beta)^2$.'))
  ] };

  // =====================================================================
  // FPM-QUA-08 The difference of the roots
  // =====================================================================
  function dcase(needS, allowSq) {
    var S, P, D;
    do { S = rint(-7, 7); P = rint(-9, 12); D = S * S - 4 * P; } while (D <= 0 || (!allowSq && isSq(D)) || (needS && S === 0));
    var t = simp(D);
    return { S: S, P: P, D: D, s: t.s, m: t.m, eq: poly(1, -S, P, 'x') + ' = 0' };
  }
  function dhead(c) { return 'The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$, where $\\alpha \\gt \\beta$.'; }
  function dwhy(c) { return '$\\alpha + \\beta = ' + c.S + '$ and $\\alpha\\beta = ' + c.P + '$, so $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta = ' + (c.S * c.S) + ' - 4(' + c.P + ') = ' + c.D + '$ and $\\alpha - \\beta = \\sqrt{' + c.D + '}' + (sqrtS(c.D) === '\\sqrt{' + c.D + '}' ? '' : ' = ' + sqrtS(c.D)) + '$ (positive, since $\\alpha \\gt \\beta$).'; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  B['FPM-QUA-08'] = { title: 'The difference of the roots', items: [
    G('square-difference', function () {
      var c = dcase(false, true);
      return N(dhead(c) + ' Find the value of $(\\alpha - \\beta)^2$.', c.D, '$\\alpha + \\beta = ' + c.S + '$ and $\\alpha\\beta = ' + c.P + '$. Then $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta = ' + (c.S * c.S) + ' - 4(' + c.P + ') = ' + c.D + '$.');
    }),
    G('find-difference', function () {
      var c = dcase(false, false), good = sqrtS(c.D);
      return M(dhead(c) + ' Find the exact value of $\\alpha - \\beta$.', dm(good),
        [dm('-' + good), dm('\\pm ' + good), dm(sqrtS(c.S * c.S - 2 * c.P)), dm('\\sqrt{' + c.D + '}' === '\\sqrt{' + c.D + '}' && c.s > 1 ? '\\sqrt{' + c.D + '}' : String(c.D))],
        dwhy(c));
    }),
    G('find-difference', function () {
      var c = dcase(true, false), good = sq(c.S * c.s, c.m);
      return M(dhead(c) + ' Find the exact value of $\\alpha^2 - \\beta^2$.', dm(good),
        [dm(sq(-c.S * c.s, c.m)), dm(sq(c.s, c.m)), dm(String(c.D)), dm(sq(2 * c.S * c.s, c.m))],
        dwhy(c) + ' Then $\\alpha^2 - \\beta^2 = (\\alpha + \\beta)(\\alpha - \\beta) = ' + par(c.S) + ' \\times ' + sqrtS(c.D) + ' = ' + good + '$.');
    }),
    G('fourth-powers', function () {
      var c = dcase(true, false), u = c.S * c.S - 2 * c.P, C4 = u * c.S * c.s, good = sq(C4, c.m);
      return M(dhead(c) + ' Find the exact value of $\\alpha^4 - \\beta^4$.', dm(good),
        [dm(sq(-C4, c.m)), dm(sq(c.S * c.s, c.m)), dm(sq(u * c.s, c.m)), dm(sq(2 * C4, c.m))],
        dwhy(c) + ' Also $\\alpha^2 + \\beta^2 = ' + (c.S * c.S) + ' - 2(' + c.P + ') = ' + u + '$. So $\\alpha^4 - \\beta^4 = (\\alpha^2 + \\beta^2)(\\alpha + \\beta)(\\alpha - \\beta) = ' + u + ' \\times ' + par(c.S) + ' \\times ' + sqrtS(c.D) + ' = ' + good + '$.');
    }),
    G('integer-roots', function () {
      var r2 = rint(-5, 4), r1 = r2 + rint(1, 5), S = r1 + r2, P = r1 * r2, which = pick(['sq', 'fourth']);
      if (S === 0) { r1 = 3; r2 = 1; S = 4; P = 3; }
      var eq = poly(1, -S, P, 'x') + ' = 0';
      if (which === 'sq') return N('The roots of $' + eq + '$ are $\\alpha$ and $\\beta$, where $\\alpha \\gt \\beta$. Find the value of $\\alpha^2 - \\beta^2$.', S * (r1 - r2),
        '$(\\alpha - \\beta)^2 = ' + (S * S) + ' - 4(' + P + ') = ' + ((r1 - r2) * (r1 - r2)) + '$, so $\\alpha - \\beta = ' + (r1 - r2) + '$. Then $\\alpha^2 - \\beta^2 = (\\alpha + \\beta)(\\alpha - \\beta) = ' + S + ' \\times ' + (r1 - r2) + ' = ' + (S * (r1 - r2)) + '$.');
      return N('The roots of $' + eq + '$ are $\\alpha$ and $\\beta$, where $\\alpha \\gt \\beta$. Find the value of $\\alpha^4 - \\beta^4$.', Math.pow(r1, 4) - Math.pow(r2, 4),
        '$\\alpha^2 + \\beta^2 = ' + (S * S - 2 * P) + '$, $\\alpha + \\beta = ' + S + '$ and $\\alpha - \\beta = ' + (r1 - r2) + '$. So $\\alpha^4 - \\beta^4 = (\\alpha^2 + \\beta^2)(\\alpha + \\beta)(\\alpha - \\beta) = ' + (S * S - 2 * P) + ' \\times ' + S + ' \\times ' + (r1 - r2) + ' = ' + (Math.pow(r1, 4) - Math.pow(r2, 4)) + '$.');
    }),
    G('sign', function () {
      var c = dcase(false, false), good = sqrtS(c.D);
      return M('For a quadratic with $\\alpha \\gt \\beta$ and $(\\alpha - \\beta)^2 = ' + c.D + '$, what is $\\alpha - \\beta$?', dm(good),
        [dm('\\pm ' + good), dm('-' + good), dm(String(c.D)), dm(sqrtS(c.D + 1 === c.D ? 1 : c.D * 4 + 0))].filter(function (x, i) { return x !== dm(good); }),
        '$(\\alpha - \\beta)^2 = ' + c.D + '$ gives $\\alpha - \\beta = \\pm\\sqrt{' + c.D + '}$. Because $\\alpha \\gt \\beta$, the difference is positive, so $\\alpha - \\beta = ' + good + '$ in simplest form.');
    }),
    G('recover-root', function () {
      var c = dcase(true, false), u = c.S * c.S - 2 * c.P, U = u * u - 2 * c.P * c.P, C4 = u * c.S * c.s;
      var f = function (a, b, d) { return dm('\\frac{' + sf(a, b, c.m) + '}{' + d + '}'); };
      return M(dhead(c) + ' It is given that $\\alpha^4 + \\beta^4 = ' + U + '$ and $\\alpha^4 - \\beta^4 = ' + sq(C4, c.m) + '$. Find the exact value of $\\alpha^4$.', f(U, C4, 2),
        [f(U, -C4, 2), f(U, C4, 1), f(U, C4, 4), f(U, 2 * C4, 2)],
        'Adding the two results: $2\\alpha^4 = (\\alpha^4 + \\beta^4) + (\\alpha^4 - \\beta^4) = ' + sf(U, C4, c.m) + '$. So $\\alpha^4 = \\frac{1}{2}\\left(' + sf(U, C4, c.m) + '\\right)$.');
    }),
    G('identity', function () {
      var r2 = rint(-4, 3), r1 = r2 + rint(1, 5), u = r1 * r1 + r2 * r2, v = r1 * r2;
      return N('It is given that $\\alpha^2 + \\beta^2 = ' + u + '$ and $\\alpha\\beta = ' + v + '$. Find the value of $(\\alpha - \\beta)^2$.', u - 2 * v,
        '$(\\alpha - \\beta)^2 = \\alpha^2 - 2\\alpha\\beta + \\beta^2 = (\\alpha^2 + \\beta^2) - 2\\alpha\\beta = ' + u + ' - 2(' + v + ') = ' + (u - 2 * v) + '$.');
    }),
    G('identity', function () {
      var r2 = rint(-4, 3), r1 = r2 + rint(1, 5), S = r1 + r2, u = r1 * r1 + r2 * r2;
      return N('It is given that $\\alpha + \\beta = ' + S + '$ and $\\alpha^2 + \\beta^2 = ' + u + '$. Find the value of $(\\alpha - \\beta)^2$.', 2 * u - S * S,
        '$(\\alpha - \\beta)^2 + (\\alpha + \\beta)^2 = 2(\\alpha^2 + \\beta^2)$, so $(\\alpha - \\beta)^2 = 2(' + u + ') - ' + (S * S) + ' = ' + (2 * u - S * S) + '$.');
    }),
    S('factorise', M('Which is the complete factorisation of $\\alpha^4 - \\beta^4$?', dm('(\\alpha^2 + \\beta^2)(\\alpha + \\beta)(\\alpha - \\beta)'),
      [dm('(\\alpha^2 + \\beta^2)(\\alpha^2 - \\beta^2)'), dm('(\\alpha^2 + \\beta^2)(\\alpha - \\beta)^2'), dm('(\\alpha + \\beta)^2(\\alpha - \\beta)^2')],
      '$\\alpha^4 - \\beta^4 = (\\alpha^2 + \\beta^2)(\\alpha^2 - \\beta^2)$, and $\\alpha^2 - \\beta^2$ factorises again as $(\\alpha + \\beta)(\\alpha - \\beta)$. Stopping at $(\\alpha^2 + \\beta^2)(\\alpha^2 - \\beta^2)$ is not fully factorised.')),
    S('identity', M('Which expression is equal to $(\\alpha - \\beta)^2$?', dm('(\\alpha + \\beta)^2 - 4\\alpha\\beta'),
      [dm('(\\alpha + \\beta)^2 - 2\\alpha\\beta'), dm('(\\alpha + \\beta)^2 + 4\\alpha\\beta'), dm('\\alpha^2 - \\beta^2')],
      '$(\\alpha + \\beta)^2 = \\alpha^2 + 2\\alpha\\beta + \\beta^2$ and $(\\alpha - \\beta)^2 = \\alpha^2 - 2\\alpha\\beta + \\beta^2$. They differ by $4\\alpha\\beta$, so $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta$.'))
  ] };

  // =====================================================================
  // FPM-QUA-09 Finding an unknown constant from a condition on the roots
  // =====================================================================
  function f5case() {
    var j, d, c0;
    do { j = rint(1, 5); d = rint(1, 5); c0 = (j * (4 + j) - d * d) / 4; } while (c0 !== Math.floor(c0) || c0 === 0);
    return { j: j, d: d, c0: c0, k1: 4 + j, k2: -j, Nn: 4 * c0 + d * d, eq: 'x^2 - kx + (' + lin(1, c0, 'k') + ') = 0' };
  }
  B['FPM-QUA-09'] = { title: 'Finding an unknown constant from a condition on the roots', items: [
    G('difference', function () {
      var S = rint(-7, 7), d, k;
      do { d = rint(1, 6); } while ((S - d) % 2 !== 0);
      k = (S * S - d * d) / 4;
      return N('The roots of $x^2' + (S === 0 ? '' : sg(-S, 'x')) + ' + k = 0$ are $\\alpha$ and $\\beta$, where $\\alpha - \\beta = ' + d + '$. Find the value of $k$.', k,
        '$\\alpha + \\beta = ' + S + '$ and $\\alpha\\beta = k$. Use $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta$: $' + (d * d) + ' = ' + (S * S) + ' - 4k$, so $4k = ' + (S * S - d * d) + '$ and $k = ' + k + '$.');
    }),
    G('sum-of-squares', function () {
      var k0 = rint(2, 6), c, V;
      do { c = rint(-6, 5); } while (k0 * k0 - 4 * c <= 0 || c === 0);
      V = k0 * k0 - 2 * c;
      return N('The roots of $x^2 - kx ' + sg(c, '').trim() + ' = 0$ are $\\alpha$ and $\\beta$, where $\\alpha^2 + \\beta^2 = ' + V + '$ and $k \\gt 0$. Find the value of $k$.', k0,
        '$\\alpha + \\beta = k$ and $\\alpha\\beta = ' + c + '$. Then $\\alpha^2 + \\beta^2 = k^2 - 2(' + c + ') = ' + V + '$, so $k^2 = ' + (V + 2 * c) + '$ and $k = \\pm ' + k0 + '$. Since $k \\gt 0$, $k = ' + k0 + '$.');
    }),
    G('sum-of-squares', function () {
      var k0 = rint(2, 6), c, V;
      do { c = rint(-6, 5); } while (k0 * k0 - 4 * c <= 0 || c === 0);
      V = k0 * k0 - 2 * c;
      return M('The roots of $x^2 - kx ' + sg(c, '').trim() + ' = 0$ are $\\alpha$ and $\\beta$, where $\\alpha^2 + \\beta^2 = ' + V + '$. Find all possible values of $k$.', dm('k = \\pm ' + k0),
        [dm('k = ' + k0), dm('k = ' + (k0 * k0)), dm('k = \\pm ' + V)],
        '$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = k^2 - 2(' + c + ') = ' + V + '$, so $k^2 = ' + (k0 * k0) + '$. With no restriction on $k$, both $k = ' + k0 + '$ and $k = -' + k0 + '$ work.');
    }),
    G('ratio', function () {
      var n = pick([2, 3]), b0 = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), S = (n + 1) * b0, k = n * b0 * b0;
      return N('The roots of $x^2 ' + sg(-S, 'x').trim() + ' + k = 0$ are $\\alpha$ and $\\beta$, where $\\alpha = ' + n + '\\beta$. Find the value of $k$.', k,
        'Let the roots be $\\beta$ and ' + n + '$\\beta$. The sum is $' + (n + 1) + '\\beta = ' + S + '$, so $\\beta = ' + b0 + '$. The product is $k = ' + n + '\\beta^2 = ' + n + ' \\times ' + (b0 * b0) + ' = ' + k + '$.');
    }),
    G('relation', function () {
      var m, s, j, k, r, S0, P, ok = false;
      while (!ok) {
        m = pick([1, 2, 3]); s = pick([1, 2, 3]); j = pick([-3, -2, -1, 1, 2, 3]); k = m * j; r = -j * (s + m); S0 = -(k + r); P = s * k;
        ok = S0 * S0 - 4 * P > 0;
      }
      return N('The roots of $x^2 + (' + lin(1, r, 'k') + ')x + ' + co(s, 'k') + ' = 0$ are $\\alpha$ and $\\beta$, where $\\alpha\\beta = ' + (m === 1 ? '\\alpha + \\beta' : m + '(\\alpha + \\beta)') + '$. Find the value of $k$.', k,
        '$\\alpha + \\beta = -(' + lin(1, r, 'k') + ')$ and $\\alpha\\beta = ' + co(s, 'k') + '$. Substituting into the condition: $' + co(s, 'k') + ' = ' + (m === 1 ? '' : m) + '\\left(-(' + lin(1, r, 'k') + ')\\right)$. Solving gives $k = ' + k + '$.');
    }),
    G('quadratic-in-k', function () {
      var c = f5case();
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$, where $\\alpha - \\beta = ' + c.d + '$ and $k \\gt 0$. Find the value of $k$.', c.k1,
        '$\\alpha + \\beta = k$ and $\\alpha\\beta = ' + lin(1, c.c0, 'k') + '$. Then $(\\alpha - \\beta)^2 = k^2 - 4(' + lin(1, c.c0, 'k') + ') = ' + (c.d * c.d) + '$, which gives $k^2 - 4k - ' + c.Nn + ' = 0$, so $(k - ' + c.k1 + ')(k + ' + c.j + ') = 0$. As $k \\gt 0$, $k = ' + c.k1 + '$.');
    }),
    G('form-equation', function () {
      var c = f5case();
      return M('The roots of $' + c.eq + '$ satisfy $\\alpha - \\beta = ' + c.d + '$. Which equation in $k$ results?', dm('k^2 - 4k - ' + c.Nn + ' = 0'),
        [dm('k^2 - 4k + ' + c.Nn + ' = 0'), dm('k^2 + 4k - ' + c.Nn + ' = 0'), dm('k^2 - 4k - ' + c.d + ' = 0'), dm('k^2 - 2k - ' + c.Nn + ' = 0')],
        '$(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta = k^2 - 4(' + lin(1, c.c0, 'k') + ') = ' + (c.d * c.d) + '$. ' + (c.d > 1 ? 'Note that the condition is $\\alpha - \\beta = ' + c.d + '$, so the right side is ' + (c.d * c.d) + ', not ' + c.d + '. ' : '') + 'This gives $k^2 - 4k - ' + c.Nn + ' = 0$.');
    }),
    G('reject', function () {
      var c = f5case();
      return M('Solving for $k$ gives $k = ' + c.k1 + '$ or $k = -' + c.j + '$. The question states that $k \\gt 0$. What should be concluded?', dm('k = ' + c.k1),
        [dm('k = -' + c.j), dm('k = ' + c.k1 + '\\text{ or } k = -' + c.j), dm('\\text{there is no valid value of } k')],
        'The condition $k \\gt 0$ is not met by $k = -' + c.j + '$, so that value is rejected. The only valid value is $k = ' + c.k1 + '$.');
    }),
    G('sum-sign', function () {
      var r = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), c = rint(1, 8), good = lin(-1, -r, 'k');
      return M('The roots of $x^2 + (' + lin(1, r, 'k') + ')x + ' + c + ' = 0$ are $\\alpha$ and $\\beta$. Write $\\alpha + \\beta$ in terms of $k$.', dm(good),
        [dm(lin(1, r, 'k')), dm(lin(-1, r, 'k')), dm(lin(1, -r, 'k'))],
        'The sum of the roots is $-\\frac{b}{a}$, and the whole of the $x$ coefficient is $b = k ' + sg(r, '').trim() + '$. So $\\alpha + \\beta = -(' + lin(1, r, 'k') + ') = ' + good + '$.');
    }),
    G('squaring', function () {
      var d = rint(2, 9);
      return M('The roots $\\alpha$ and $\\beta$ of a quadratic satisfy $\\alpha - \\beta = ' + d + '$. Which equation correctly uses this with the sum and product?', dm('(\\alpha + \\beta)^2 - 4\\alpha\\beta = ' + (d * d)),
        [dm('(\\alpha + \\beta)^2 - 4\\alpha\\beta = ' + d), dm('(\\alpha + \\beta)^2 - 2\\alpha\\beta = ' + (d * d)), dm('(\\alpha + \\beta)^2 + 4\\alpha\\beta = ' + (d * d))],
        'Square the condition first: $(\\alpha - \\beta)^2 = ' + (d * d) + '$. Then use $(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta$.');
    }),
    S('relation', M('One root of a quadratic is twice the other. Which relation between the roots $\\alpha$ and $\\beta$ must hold, if $\\alpha = 2\\beta$?', dm('2(\\alpha + \\beta)^2 = 9\\alpha\\beta'),
      [dm('(\\alpha + \\beta)^2 = 9\\alpha\\beta'), dm('(\\alpha + \\beta)^2 = 4\\alpha\\beta'), dm('\\alpha + \\beta = 2\\alpha\\beta')],
      'With $\\alpha = 2\\beta$: $\\alpha + \\beta = 3\\beta$ and $\\alpha\\beta = 2\\beta^2$. So $(\\alpha + \\beta)^2 = 9\\beta^2 = \\frac{9}{2}\\alpha\\beta$, that is $2(\\alpha + \\beta)^2 = 9\\alpha\\beta$.'))
  ] };

  // =====================================================================
  // FPM-QUA-10 Forming a new quadratic from the roots of another
  // =====================================================================
  function tcase() {
    var c = dcase(false, true), m, k;
    do { m = pick([1, 2, 3]); k = pick([-3, -2, -1, 0, 1, 2, 3]); } while (m === 1 && k === 0);
    var nS = m * c.S + 2 * k, nP = m * m * c.P + m * k * c.S + k * k;
    c.m2 = m; c.k = k; c.nS = nS; c.nP = nP;
    c.rA = (m === 1 ? '' : m) + '\\alpha' + (k ? sg(k, '') : ''); c.rB = (m === 1 ? '' : m) + '\\beta' + (k ? sg(k, '') : '');
    return c;
  }
  function twhy(c) {
    return 'For the original equation, $\\alpha + \\beta = ' + c.S + '$ and $\\alpha\\beta = ' + c.P + '$. New sum: $(' + c.rA + ') + (' + c.rB + ') = ' + (c.m2 === 1 ? '' : c.m2) + '(\\alpha + \\beta)' + (c.k ? ' ' + sg(2 * c.k, '').trim() : '') + ' = ' + c.nS + '$. New product: $(' + c.rA + ')(' + c.rB + ') = ' + c.nP + '$.';
  }
  B['FPM-QUA-10'] = { title: 'Forming a new quadratic from the roots of another', items: [
    G('linear-roots', function () {
      var c = tcase(), good = poly(1, -c.nS, c.nP, 'x') + ' = 0';
      return M('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the quadratic equation, with integer coefficients, that has roots $' + c.rA + '$ and $' + c.rB + '$.', dm(good),
        [dm(poly(1, c.nS, c.nP, 'x') + ' = 0'), dm(poly(1, -c.nS, -c.nP, 'x') + ' = 0'), dm(poly(1, -(c.m2 * c.S + c.k), c.nP, 'x') + ' = 0'), dm(poly(1, -c.nS, c.m2 * c.m2 * c.P + c.k * c.k, 'x') + ' = 0'), dm(poly(1, -(c.nS + 1), c.nP, 'x') + ' = 0'), dm(poly(1, -c.nS, c.nP + 1, 'x') + ' = 0')],
        twhy(c) + ' The equation is $x^2 - (\\text{sum})x + \\text{product} = 0$, which is $' + good + '$.');
    }),
    G('squares', function () {
      var c = dcase(false, true); while (c.P === 0) c = dcase(false, true); var sum = c.S * c.S - 2 * c.P, prod = c.P * c.P, good = poly(1, -sum, prod, 'x') + ' = 0';
      return M('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the quadratic equation, with integer coefficients, that has roots $\\alpha^2$ and $\\beta^2$.', dm(good),
        [dm(poly(1, -c.S * c.S, prod, 'x') + ' = 0'), dm(poly(1, -sum, c.P, 'x') + ' = 0'), dm(poly(1, sum, prod, 'x') + ' = 0'), dm(poly(1, -sum, -prod, 'x') + ' = 0'), dm(poly(1, -(sum + 1), prod, 'x') + ' = 0')],
        '$\\alpha + \\beta = ' + c.S + '$, $\\alpha\\beta = ' + c.P + '$. New sum: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = ' + sum + '$. New product: $\\alpha^2\\beta^2 = (\\alpha\\beta)^2 = ' + prod + '$. So the equation is $' + good + '$.');
    }),
    G('reciprocals', function () {
      var S, P, D;
      do { S = rint(-6, 6); P = rint(2, 6); D = S * S - 4 * P; } while (S === 0 || D <= 0);
      var good = poly(P, -S, 1, 'x') + ' = 0';
      return M('The roots of $' + poly(1, -S, P, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the quadratic equation, with integer coefficients, that has roots $\\frac{1}{\\alpha}$ and $\\frac{1}{\\beta}$.', dm(good),
        [dm(poly(P, S, 1, 'x') + ' = 0'), dm(poly(S, -P, 1, 'x') + ' = 0'), dm(poly(1, -S, P, 'x') + ' = 0'), dm(poly(P, -S, P, 'x') + ' = 0')],
        'New sum: $\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta} = \\frac{' + S + '}{' + P + '}$. New product: $\\frac{1}{\\alpha\\beta} = \\frac{1}{' + P + '}$. So $x^2' + rsg(rn(-S, P), 'x') + ' + \\frac{1}{' + P + '} = 0$; multiplying by ' + P + ' gives $' + good + '$.');
    }),
    G('new-sum', function () {
      var c = tcase();
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the sum of the roots of the equation whose roots are $' + c.rA + '$ and $' + c.rB + '$.', c.nS, twhy(c));
    }),
    G('new-product', function () {
      var c = tcase();
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the product of $' + c.rA + '$ and $' + c.rB + '$.', c.nP, twhy(c));
    }),
    G('compare-coeffs', function () {
      var c = tcase(), askP = Math.random() < 0.5;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. The equation $x^2 + px + q = 0$ has roots $' + c.rA + '$ and $' + c.rB + '$. Find the value of $' + (askP ? 'p' : 'q') + '$.', askP ? -c.nS : c.nP,
        twhy(c) + ' For $x^2 + px + q = 0$, the sum of the roots is $-p$ and the product is $q$. So $p = ' + (-c.nS) + '$ and $q = ' + c.nP + '$.');
    }),
    G('non-monic', function () {
      var a = pick([2, 3]), b, c, k = pick([-3, -2, -1, 1, 2, 3]);
      do { b = rint(-7, 7); c = rint(-6, 6); } while (b * b - 4 * a * c <= 0 || c === 0);
      var B2 = b - 2 * a * k, C2 = a * k * k - b * k + c;
      return M('The roots of $' + poly(a, b, c, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the quadratic equation with integer coefficients that has roots $\\alpha ' + sg(k, '').trim() + '$ and $\\beta ' + sg(k, '').trim() + '$.', dm(poly(a, B2, C2, 'x') + ' = 0'),
        [dm(poly(a, b + 2 * a * k, a * k * k + b * k + c, 'x') + ' = 0'), dm(poly(a, B2, c - b * k + k * k, 'x') + ' = 0'), dm(poly(a, -B2, C2, 'x') + ' = 0'), dm(poly(a, b - 2 * k, C2, 'x') + ' = 0')],
        '$\\alpha + \\beta = ' + rs(rn(-b, a)) + '$ and $\\alpha\\beta = ' + rs(rn(c, a)) + '$. New sum: $' + rs(rn(-b, a)) + ' ' + sg(2 * k, '').trim() + ' = ' + rs(rn(-b + 2 * a * k, a)) + '$. New product: $\\alpha\\beta ' + sg(k, '').trim() + '(\\alpha + \\beta) + ' + (k * k) + ' = ' + rs(rn(C2, a)) + '$. Multiply $x^2 - (\\text{sum})x + \\text{product} = 0$ by ' + a + ' to clear fractions: $' + poly(a, B2, C2, 'x') + ' = 0$.');
    }),
    G('ratio-roots', function () {
      var S, P, D;
      do { S = rint(-6, 6); P = rint(2, 5); D = S * S - 4 * P; } while (D <= 0);
      var u = S * S - 2 * P, good = poly(P, -u, P, 'x') + ' = 0';
      return M('The roots of $' + poly(1, -S, P, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the quadratic equation, with integer coefficients, that has roots $\\frac{\\alpha}{\\beta}$ and $\\frac{\\beta}{\\alpha}$.', dm(good),
        [dm(poly(P, u, P, 'x') + ' = 0'), dm(poly(P, -u, 1, 'x') + ' = 0'), dm(poly(P, -S * S, P, 'x') + ' = 0'), dm(poly(1, -u, P, 'x') + ' = 0')],
        'New sum: $\\frac{\\alpha}{\\beta} + \\frac{\\beta}{\\alpha} = \\frac{\\alpha^2 + \\beta^2}{\\alpha\\beta} = \\frac{' + u + '}{' + P + '}$. New product: $\\frac{\\alpha}{\\beta} \\times \\frac{\\beta}{\\alpha} = 1$. So $x^2 - \\frac{' + u + '}{' + P + '}x + 1 = 0$, and multiplying by ' + P + ' gives $' + good + '$.');
    }),
    G('new-sum', function () {
      var S, P, D;
      do { S = rint(-6, 6); P = pick([-5, -4, -2, 2, 4, 5]); D = S * S - 4 * P; } while (D <= 0);
      return N('The roots of $' + poly(1, -S, P, 'x') + ' = 0$ are $\\alpha$ and $\\beta$. Find the sum of the roots of the equation whose roots are $\\frac{1}{\\alpha}$ and $\\frac{1}{\\beta}$, as a decimal.', cl(S / P),
        '$\\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\alpha + \\beta}{\\alpha\\beta} = \\frac{' + S + '}{' + P + '} = ' + cl(S / P) + '$.');
    }),
    G('symmetric-roots', function () {
      var c = dcase(false, true), prod = 2 * c.S * c.S + c.P;
      return N('The roots of $' + c.eq + '$ are $\\alpha$ and $\\beta$. Find the product of $(2\\alpha + \\beta)$ and $(\\alpha + 2\\beta)$.', prod,
        '$(2\\alpha + \\beta)(\\alpha + 2\\beta) = 2\\alpha^2 + 5\\alpha\\beta + 2\\beta^2 = 2(\\alpha^2 + \\beta^2) + 5\\alpha\\beta = 2(' + (c.S * c.S - 2 * c.P) + ') + 5(' + c.P + ') = ' + prod + '$.');
    }),
    S('structure', M('A quadratic equation has roots $r$ and $s$. Which is its equation?', dm('x^2 - (r + s)x + rs = 0'),
      [dm('x^2 + (r + s)x + rs = 0'), dm('x^2 - (r + s)x - rs = 0'), dm('x^2 - rsx + (r + s) = 0')],
      'The quadratic with roots $r$ and $s$ is $(x - r)(x - s) = x^2 - (r + s)x + rs = 0$. The $x$ coefficient is minus the sum and the constant is the product.'))
  ] };

})();
