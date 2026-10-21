/* Group G08 mastery bank: Arithmetic series; Sums of arithmetic series; Geometric series (terms and finite sums). Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function fmt(x) { return String(Math.round(x * 1e6) / 1e6); }
  function cx(c, v) { return c === 1 ? v : (c === -1 ? '-' + v : c + v); }          // coefficient with variable
  // polynomial from [coef, 'n^2'] pairs, e.g. terms([[3,'n^2'],[-1,'n'],[4,'']]) -> "3n^2 - n + 4"
  function terms(list) {
    var s = '';
    list.forEach(function (t) {
      var c = t[0], v = t[1];
      if (c === 0) return;
      var mag = Math.abs(c), body = v === '' ? String(mag) : (mag === 1 ? v : mag + v);
      if (s === '') s = (c < 0 ? '-' : '') + body; else s += (c < 0 ? ' - ' : ' + ') + body;
    });
    return s === '' ? '0' : s;
  }
  function lin(p, q, v) { return terms([[p, v], [q, '']]); }
  function quad(A, B, C, v) { return terms([[A, v + '^2'], [B, v], [C, '']]); }
  function opts(c, ds) {            // correct option first, then distinct distractors up to 4 options
    var o = [c];
    ds.forEach(function (d) { if (o.indexOf(d) < 0 && o.length < 4) o.push(d); });
    return o;
  }
  function num(q, ans, why) { ans = Math.round(ans * 1e6) / 1e6; return { kind: 'num', q: q, answer: ans, tol: 1e-9, display: '$' + fmt(ans) + '$', why: why }; }
  function mq(q, correct, ds, why) { return { kind: 'mcq', q: q, options: opts(correct, ds), answer: 0, why: why }; }
  function G(skill, fn) { return { skill: skill, gen: fn }; }
  function M(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function apT(a, d, n) { return a + (n - 1) * d; }
  function apS(a, d, n) { return n * (2 * a + (n - 1) * d) / 2; }
  function gS(a, r, n) { var s = 0, t = a; for (var i = 0; i < n; i++) { s += t; t *= r; } return s; }
  function ord(n) { var m = n % 100, k = n % 10; return n + ((m >= 11 && m <= 13) ? 'th' : (k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th')); }
  function nz(lo, hi) { var v = 0; while (v === 0) v = rint(lo, hi); return v; }
  function listAP(a, d) { return a + ', ' + (a + d) + ', ' + (a + 2 * d) + ', \\dots'; }

  // =====================================================================
  // FPM-SER-01 First term and common difference of an arithmetic series
  // =====================================================================
  function twoTerms() {
    var a = rint(-8, 12), d = nz(-5, 7), p = rint(2, 5), q = p + rint(2, 6);
    while (apT(a, d, p) === 0 || apT(a, d, q) === 0) a = rint(-8, 12);
    return { a: a, d: d, p: p, q: q, up: apT(a, d, p), uq: apT(a, d, q) };
  }
  function twoTermsWhy(t) {
    return '$a + ' + cx(t.p - 1, 'd') + ' = ' + t.up + '$ and $a + ' + cx(t.q - 1, 'd') + ' = ' + t.uq + '$. Subtracting gives $' + cx(t.q - t.p, 'd') + ' = ' + (t.uq - t.up) + '$, so $d = ' + t.d + '$; then $a = ' + t.up + ' - ' + (t.p - 1) + '(' + t.d + ') = ' + t.a + '$.';
  }
  B['FPM-SER-01'] = { title: 'Finding the first term and common difference of an arithmetic series', items: [
    G('find-a', function () {
      var t = twoTerms();
      return num('An arithmetic series has $u_{' + t.p + '} = ' + t.up + '$ and $u_{' + t.q + '} = ' + t.uq + '$. Find the first term $a$.', t.a, twoTermsWhy(t));
    }),
    G('find-a', function () {
      var t = twoTerms();
      return num('The ' + ord(t.p) + ' term of an arithmetic series is ' + t.up + ' and the ' + ord(t.q) + ' term is ' + t.uq + '. What is the first term?', t.a, twoTermsWhy(t));
    }),
    G('find-d', function () {
      var t = twoTerms();
      return num('An arithmetic series has $u_{' + t.p + '} = ' + t.up + '$ and $u_{' + t.q + '} = ' + t.uq + '$. Find the common difference $d$.', t.d, twoTermsWhy(t));
    }),
    G('find-d', function () {
      var a = rint(2, 12), d = nz(-5, 7), x = 2 * a + d, y = a + 3 * d;
      return num('In an arithmetic series the sum of the first two terms is ' + x + ' and the 4th term is ' + y + '. Find the common difference.', d,
        'The first two terms add to $2a + d = ' + x + '$ (not $a + d$). The 4th term gives $a + 3d = ' + y + '$. Doubling the second equation and subtracting the first: $5d = ' + (2 * y - x) + '$, so $d = ' + d + '$.');
    }),
    G('term-from-ad', function () {
      var t = twoTerms(), m = rint(12, 25);
      return num('An arithmetic series has $u_{' + t.p + '} = ' + t.up + '$ and $u_{' + t.q + '} = ' + t.uq + '$. Find the ' + ord(m) + ' term.', apT(t.a, t.d, m),
        twoTermsWhy(t) + ' Then $u_{' + m + '} = a + ' + (m - 1) + 'd = ' + t.a + ' + ' + (m - 1) + '(' + t.d + ') = ' + apT(t.a, t.d, m) + '$.');
    }),
    G('term-from-ad', function () {
      var a = rint(2, 15), d = nz(-4, 8), n = rint(8, 30), T = apT(a, d, n);
      return num('The first three terms of an arithmetic series are $' + listAP(a, d) + '$. Which term of the series is equal to ' + T + '?', n,
        'Here $a = ' + a + '$ and $d = ' + d + '$. Solve $' + a + ' + (n-1)(' + d + ') = ' + T + '$: $(n-1)(' + d + ') = ' + (T - a) + '$, so $n - 1 = ' + (n - 1) + '$ and $n = ' + n + '$.');
    }),
    G('sum-and-term', function () {
      var a = rint(1, 12), d = nz(-4, 6), n = pick([4, 6, 8]), p = pick([3, 5]);
      var U = apT(a, d, p), S = apS(a, d, n);
      return num('An arithmetic series has $u_{' + p + '} = ' + U + '$ and the sum of its first ' + n + ' terms is $S_{' + n + '} = ' + S + '$. Find the common difference $d$.', d,
        '$a + ' + cx(p - 1, 'd') + ' = ' + U + '$ and $\\frac{' + n + '}{2}[2a + ' + cx(n - 1, 'd') + '] = ' + S + '$, i.e. $2a + ' + cx(n - 1, 'd') + ' = ' + (2 * S / n) + '$. Subtract twice the first equation: $' + cx(n + 1 - 2 * p, 'd') + ' = ' + (2 * S / n - 2 * U) + '$, so $d = ' + d + '$.');
    }),
    G('sum-and-term', function () {
      var t = twoTerms(), n = rint(8, 20);
      return num('An arithmetic series has $u_{' + t.p + '} = ' + t.up + '$ and $u_{' + t.q + '} = ' + t.uq + '$. Find the sum of the first ' + n + ' terms.', apS(t.a, t.d, n),
        twoTermsWhy(t) + ' Then $S_{' + n + '} = \\frac{' + n + '}{2}[2(' + t.a + ') + ' + (n - 1) + '(' + t.d + ')] = ' + apS(t.a, t.d, n) + '$.');
    }),
    G('form-equations', function () {
      var t = twoTerms();
      var c = '$a + ' + cx(t.p - 1, 'd') + ' = ' + t.up + '$ and $a + ' + cx(t.q - 1, 'd') + ' = ' + t.uq + '$';
      return mq('An arithmetic series has first term $a$ and common difference $d$, with $u_{' + t.p + '} = ' + t.up + '$ and $u_{' + t.q + '} = ' + t.uq + '$. Which pair of equations is correct?', c, [
        '$a + ' + cx(t.p, 'd') + ' = ' + t.up + '$ and $a + ' + cx(t.q, 'd') + ' = ' + t.uq + '$',
        '$a + ' + cx(t.q - 1, 'd') + ' = ' + t.up + '$ and $a + ' + cx(t.p - 1, 'd') + ' = ' + t.uq + '$',
        '$' + cx(t.p - 1, 'a') + ' + d = ' + t.up + '$ and $' + cx(t.q - 1, 'a') + ' + d = ' + t.uq + '$'],
      'The $n$th term is $a + (n-1)d$, so the ' + ord(t.p) + ' term is $a + ' + cx(t.p - 1, 'd') + '$ and the ' + ord(t.q) + ' term is $a + ' + cx(t.q - 1, 'd') + '$: one fewer $d$ than the term number.');
    }),
    G('form-equations', function () {
      var t = twoTerms(), dd = t.q - t.p, dv = t.uq - t.up;
      return mq('For an arithmetic series, $a + ' + cx(t.p - 1, 'd') + ' = ' + t.up + '$ and $a + ' + cx(t.q - 1, 'd') + ' = ' + t.uq + '$. What does subtracting the first equation from the second give?',
        '$' + cx(dd, 'd') + ' = ' + dv + '$', [
          '$' + cx(dd + 1, 'd') + ' = ' + dv + '$',
          '$' + cx(dd, 'd') + ' = ' + (t.uq + t.up) + '$',
          '$' + cx(t.p + t.q - 2, 'd') + ' = ' + (t.uq + t.up) + '$', '$' + cx(dd, 'd') + ' = ' + (dv + 1) + '$'],
        '$a$ cancels. The number of $d$s is $(' + (t.q - 1) + ') - (' + (t.p - 1) + ') = ' + dd + '$ and the right-hand sides are subtracted: $' + t.uq + ' - ' + (t.up < 0 ? '(' + t.up + ')' : t.up) + ' = ' + dv + '$.');
    }),
    M('trap-sum2', 'In an arithmetic series with first term $a$ and common difference $d$, the sum of the first two terms is 17. Which equation is correct?',
      ['$2a + d = 17$', '$a + d = 17$', '$a + 2d = 17$', '$2a + 2d = 17$'], 0,
      'The first term is $a$ and the second is $a + d$. Their sum is $a + (a + d) = 2a + d$. The expression $a + d$ is only the second term on its own.'),
    G('nth-formula', function () {
      var k = rint(6, 20);
      return mq('An arithmetic series has first term $a$ and common difference $d$. Which expression gives the ' + ord(k) + ' term?',
        '$a + ' + cx(k - 1, 'd') + '$', ['$a + ' + cx(k, 'd') + '$', '$a + ' + cx(k + 1, 'd') + '$', '$' + cx(k, 'a') + ' + d$'],
        'Use $u_n = a + (n-1)d$ with $n = ' + k + '$, giving $a + ' + cx(k - 1, 'd') + '$. The first term has no $d$ added, so the number of $d$s is one less than the term number.');
    })
  ] };

  // =====================================================================
  // FPM-SER-02 Getting terms out of a formula for the sum
  // =====================================================================
  function snForm(c, k) { return 'n(' + c + (k < 0 ? ' - ' : ' + ') + cx(Math.abs(k), 'n') + ')'; }
  function snVals(c, k) { return { S: function (n) { return k * n * n + c * n; } }; }
  B['FPM-SER-02'] = { title: 'Getting terms out of a formula for the sum', items: [
    G('first-term', function () {
      var c = rint(5, 20), k = nz(-4, 5);
      return num('The sum of the first $n$ terms of an arithmetic series is $S_n = ' + snForm(c, k) + '$. Find the first term.', c + k,
        'The first term is $S_1 = 1(' + c + (k < 0 ? ' - ' : ' + ') + Math.abs(k) + ') = ' + (c + k) + '$.');
    }),
    G('common-diff', function () {
      var c = rint(5, 20), k = nz(-4, 5), S = snVals(c, k).S;
      return num('The sum of the first $n$ terms of an arithmetic series is $S_n = ' + snForm(c, k) + '$. Find the common difference.', 2 * k,
        '$u_1 = S_1 = ' + S(1) + '$ and $S_2 = ' + S(2) + '$, so $u_2 = S_2 - S_1 = ' + (S(2) - S(1)) + '$. Then $d = u_2 - u_1 = ' + (2 * k) + '$.');
    }),
    G('value-of-sum', function () {
      var c = rint(5, 20), k = nz(-3, 5), n = pick([10, 12, 15, 20, 25]);
      return num('The sum of the first $n$ terms of an arithmetic series is $S_n = ' + snForm(c, k) + '$. Find $S_{' + n + '}$.', k * n * n + c * n,
        'Substitute $n = ' + n + '$ straight into the formula: $S_{' + n + '} = ' + n + '(' + c + (k < 0 ? ' - ' : ' + ') + Math.abs(k) + '\\times ' + n + ') = ' + (k * n * n + c * n) + '$.');
    }),
    G('nth-term', function () {
      var c = rint(5, 20), k = nz(-3, 5), n = rint(6, 15), S = snVals(c, k).S;
      return num('The sum of the first $n$ terms of an arithmetic series is $S_n = ' + snForm(c, k) + '$. Find the ' + ord(n) + ' term.', S(n) - S(n - 1),
        'The ' + ord(n) + ' term is $S_{' + n + '} - S_{' + (n - 1) + '} = ' + S(n) + ' - (' + S(n - 1) + ') = ' + (S(n) - S(n - 1)) + '$. Putting $n = ' + n + '$ into $S_n$ alone would give the sum, not the term.');
    }),
    G('second-term', function () {
      var X = rint(3, 15), u2 = rint(X + 1, X + 12), Y = X + u2;
      return mq('For a series, $S_1 = ' + X + '$ and $S_2 = ' + Y + '$. What is the second term $u_2$?', '$' + u2 + '$',
        ['$' + Y + '$', '$' + (Y + X) + '$', '$' + Y / 2 + '$', '$' + (Y - 2 * X) + '$'],
        '$S_2$ is the sum of the first two terms, so $u_2 = S_2 - S_1 = ' + Y + ' - ' + X + ' = ' + u2 + '$.');
    }),
    G('sigma-first', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return num('A series is given by $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$. Find the first term.', p + q,
        'Put $r = 1$: $' + p + '(1) ' + (q < 0 ? '- ' : '+ ') + Math.abs(q) + ' = ' + (p + q) + '$.');
    }),
    G('sigma-d', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return num('A series is given by $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$. Find the common difference.', p,
        'The terms are $' + (p + q) + ', ' + (2 * p + q) + ', ' + (3 * p + q) + ', \\dots$ (put $r = 1, 2, 3$). Each is $' + p + '$ more than the one before, so $d = ' + p + '$.');
    }),
    G('sigma-sum2', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return num('For the series $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$, find the sum of the first two terms.', 3 * p + 2 * q,
        'Put $r = 1$ and $r = 2$: $(' + (p + q) + ') + (' + (2 * p + q) + ') = ' + (3 * p + 2 * q) + '$.');
    }),
    G('geometric-r', function () {
      var r = pick([2, 3, 4, 5]), k = rint(1, 6);
      return num('The sum of the first $n$ terms of a geometric series is $S_n = ' + k + '(' + r + '^n - 1)$. Find the common ratio $r$.', r,
        '$u_1 = S_1 = ' + k * (r - 1) + '$ and $S_2 = ' + k * (r * r - 1) + '$, so $u_2 = S_2 - S_1 = ' + (k * (r * r - 1) - k * (r - 1)) + '$. Then $r = \\frac{u_2}{u_1} = \\frac{' + (k * (r * r - 1) - k * (r - 1)) + '}{' + k * (r - 1) + '} = ' + r + '$.');
    }),
    G('geometric-first', function () {
      var r = pick([2, 3, 4, 5]), k = rint(2, 7);
      return num('The sum of the first $n$ terms of a geometric series is $S_n = ' + k + '(' + r + '^n - 1)$. Find the first term.', k * (r - 1),
        'The first term is $S_1 = ' + k + '(' + r + '^1 - 1) = ' + k * (r - 1) + '$.');
    }),
    G('trap-term-vs-sum', function () {
      var k = rint(2, 5), c = rint(1, 6), n = rint(4, 8), S = function (m) { return m * (k * m + c); };
      return mq('The sum of the first $n$ terms of an arithmetic series is $S_n = n(' + cx(k, 'n') + ' + ' + c + ')$. Find the ' + ord(n) + ' term.',
        '$' + (S(n) - S(n - 1)) + '$', ['$' + S(n) + '$', '$' + (S(n) + S(n - 1)) + '$', '$' + (S(n + 1) - S(n)) + '$'],
        'The ' + ord(n) + ' term is $S_{' + n + '} - S_{' + (n - 1) + '} = ' + S(n) + ' - ' + S(n - 1) + ' = ' + (S(n) - S(n - 1)) + '$. The value ' + S(n) + ' is the sum of all ' + n + ' terms.');
    }),
    M('term-from-sum', 'Which statement correctly links the $n$th term $u_n$ to the sums $S_n$ of a series, for $n \\geqslant 2$?',
      ['$u_n = S_n - S_{n-1}$', '$u_n = S_n - S_{n+1}$', '$u_n = S_n - S_1$', '$u_n = S_n \\div n$'], 0,
      '$S_n$ adds the first $n$ terms and $S_{n-1}$ adds all but the last, so the difference leaves exactly the $n$th term.')
  ] };

  // =====================================================================
  // FPM-SER-04 Writing a sigma sum as a formula in n
  // =====================================================================
  function sg(n) { return n < 0 ? '- ' + (-n) : '+ ' + n; }
  B['FPM-SER-04'] = { title: 'Writing a sigma sum as a formula in n', items: [
    G('formula', function () {
      var p = rint(2, 7), q = nz(-4, 6);
      var good = '$\\frac{n}{2}(' + lin(p, p + 2 * q, 'n') + ')$';
      return mq('Which expression equals $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ for every positive integer $n$?', good, [
        '$\\frac{n}{2}(' + lin(p, 2 * q - p, 'n') + ')$',
        '$\\frac{n}{2}(' + lin(p, 2 * q + 2 * p, 'n') + ')$',
        '$\\frac{n}{2}(' + lin(p, q, 'n') + ')$', '$\\frac{n}{2}(' + lin(p, p + q, 'n') + ')$', '$\\frac{n}{2}(' + lin(p, 3 * p + 2 * q, 'n') + ')$'],
      'First term $a = ' + (p + q) + '$, $d = ' + p + '$, $n$ terms: $\\frac{n}{2}[2(' + (p + q) + ') + (n-1)(' + p + ')] = \\frac{n}{2}(' + lin(p, 2 * (p + q) - p, 'n') + ')$.');
    }),
    G('first-term', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return num('The sum $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ is an arithmetic series. Find its first term $a$.', p + q,
        'Put $r = 1$: $a = ' + p + ' ' + sg(q) + ' = ' + (p + q) + '$. (The constant ' + q + ' alone is not the first term.)');
    }),
    G('last-term', function () {
      var p = rint(2, 8), q = nz(-5, 9), n = rint(10, 30);
      return num('Find the last term of $\\sum_{r=1}^{' + n + '}(' + lin(p, q, 'r') + ')$.', p * n + q,
        'The last term has $r = ' + n + '$: $' + p + '\\times ' + n + ' ' + sg(q) + ' = ' + (p * n + q) + '$.');
    }),
    G('identify-a-d', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return mq('Writing $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ as an arithmetic series, which values of the first term $a$ and common difference $d$ should be used?',
        '$a = ' + (p + q) + ',\\ d = ' + p + '$', ['$a = ' + q + ',\\ d = ' + p + '$', '$a = ' + (p + q) + ',\\ d = ' + (p + q) + '$', '$a = ' + p + ',\\ d = ' + q + '$', '$a = ' + (p + q) + ',\\ d = ' + q + '$', '$a = ' + (2 * p + q) + ',\\ d = ' + p + '$'],
        'Putting $r = 1$ gives $a = ' + (p + q) + '$ and the coefficient of $r$ is the common difference, $d = ' + p + '$.');
    }),
    G('evaluate', function () {
      var p = rint(2, 8), q = nz(-5, 9), n = rint(8, 25), s = 0;
      for (var r = 1; r <= n; r++) s += p * r + q;
      return num('Evaluate $\\sum_{r=1}^{' + n + '}(' + lin(p, q, 'r') + ')$.', s,
        'Arithmetic with $a = ' + (p + q) + '$, last term $' + (p * n + q) + '$ and ' + n + ' terms: $\\frac{' + n + '}{2}(' + (p + q) + ' ' + sg(p * n + q) + ') = ' + s + '$.');
    }),
    G('constants', function () {
      var A = rint(2, 7), Bc = nz(-4, 6), s = A + 2 * Bc;
      return num('It is given that $\\sum_{r=1}^{n}(Ar + B) = \\frac{n}{2}(' + lin(A, s, 'n') + ')$ for all $n$, where $A$ and $B$ are constants. Find $B$.', Bc,
        'The sum is $\\frac{n}{2}[2(A+B) + (n-1)A] = \\frac{n}{2}(An + A + 2B)$. Comparing coefficients: $A = ' + A + '$ and $A + 2B = ' + s + '$, so $2B = ' + (s - A) + '$ and $B = ' + Bc + '$.');
    }),
    G('constants', function () {
      var A = rint(2, 7), Bc = nz(-4, 6), s = A + 2 * Bc;
      return num('Given that $\\sum_{r=1}^{n}(Ar + B) = \\frac{n}{2}(' + lin(A, s, 'n') + ')$ for all positive integers $n$, find $A + B$.', A + Bc,
        'Expanding the sum formula gives $\\frac{n}{2}(An + A + 2B)$. Comparing with the given form: $A = ' + A + '$ and $A + 2B = ' + s + '$, so $B = ' + Bc + '$ and $A + B = ' + (A + Bc) + '$.');
    }),
    G('expand', function () {
      var p = rint(1, 7), q = nz(-4, 6), co = p / 2;
      return num('Written as $\\frac{n}{2}(' + lin(p, p + 2 * q, 'n') + ')$, the sum $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ can be expanded as $An^2 + Bn$. Find the value of $A$.', co,
        'Multiplying out, $\\frac{n}{2}(' + lin(p, p + 2 * q, 'n') + ')$ has $n^2$ term $\\frac{' + p + '}{2}n^2$, so $A = ' + fmt(co) + '$.');
    }),
    G('trap-last', function () {
      var p = rint(2, 8), q = nz(-5, 9);
      return mq('In $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ there are $n$ terms. Which expression is the last term?',
        '$' + lin(p, q, 'n') + '$', ['$' + lin(p, q - p, 'n') + '$', '$' + cx(p, 'n') + '$', '$' + lin(p, p + q, 'n') + '$', '$' + lin(p, 2 * q, 'n') + '$', '$' + lin(p, q + 1, 'n') + '$'],
        'The last term is the one with $r = n$, so replace $r$ by $n$: $' + lin(p, q, 'n') + '$. Using $n - 1$ would drop the final term.');
    }),
    G('number-of-terms', function () {
      var p = rint(2, 8), q = nz(-5, 9), n = rint(12, 40), k = rint(6, 9);
      return mq('Which gives the first term, last term and number of terms in $\\sum_{r=1}^{' + n + '}(' + lin(p, q, 'r') + ')$?',
        'first ' + (p + q) + ', last ' + (p * n + q) + ', ' + n + ' terms',
        ['first ' + q + ', last ' + (p * n + q) + ', ' + n + ' terms', 'first ' + (p + q) + ', last ' + (p * n + q) + ', ' + (n - 1) + ' terms', 'first ' + (p + q) + ', last ' + (p * (n - 1) + q) + ', ' + (n - 1) + ' terms'],
        'The sum runs from $r = 1$ to $r = ' + n + '$, so there are ' + n + ' terms. First term: $' + p + ' ' + sg(q) + ' = ' + (p + q) + '$. Last term: $' + p * n + ' ' + sg(q) + ' = ' + (p * n + q) + '$.');
    }),
    G('show-that', function () {
      var p = rint(2, 6), q = nz(-3, 5);
      // which line of a show-that is the first to go wrong
      var a = p + q;
      return mq('Here is a show-that for $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$. Which line must replace line 1 to make the working correct?<br>Line 1: "$a = ' + q + '$, $d = ' + p + '$."<br>Line 2: "$S_n = \\frac{n}{2}[2a + (n-1)d]$."',
        'Line 1 should be $a = ' + a + '$, $d = ' + p + '$', ['Line 1 should be $a = ' + q + '$, $d = ' + a + '$', 'Line 1 should be $a = ' + p + '$, $d = ' + q + '$', 'Line 1 is correct; line 2 should use $n - 1$ terms'],
        'The first term comes from $r = 1$: $' + p + ' ' + sg(q) + ' = ' + a + '$, not just ' + q + '. The coefficient of $r$, ' + p + ', is the common difference.');
    })
  ] };

  // =====================================================================
  // FPM-SER-05 Adding up an arithmetic series between two limits
  // =====================================================================
  function sigAP(p, q, lo, hi) { var s = 0; for (var r = lo; r <= hi; r++) s += p * r + q; return s; }
  B['FPM-SER-05'] = { title: 'Adding up an arithmetic series between two limits', items: [
    G('evaluate', function () {
      var p = rint(2, 8), q = nz(-5, 9), lo = rint(5, 30), hi = lo + rint(10, 40), tot = sigAP(p, q, lo, hi);
      return num('Evaluate $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$.', tot,
        'Number of terms: $' + hi + ' - ' + lo + ' + 1 = ' + (hi - lo + 1) + '$. First term $' + (p * lo + q) + '$, last term $' + (p * hi + q) + '$. Sum $= \\frac{' + (hi - lo + 1) + '}{2}(' + (p * lo + q) + ' ' + sg(p * hi + q) + ') = ' + tot + '$.');
    }),
    G('evaluate', function () {
      var p = rint(2, 6), q = nz(-5, 9), lo = rint(3, 20), hi = lo + rint(8, 30), tot = sigAP(p, q, lo, hi);
      var S = function (n) { return sigAP(p, q, 1, n); };
      return num('Find the value of $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$ by subtracting two sums that start at $r = 1$.', tot,
        '$\\sum_{r=1}^{' + hi + '} = ' + S(hi) + '$ and $\\sum_{r=1}^{' + (lo - 1) + '} = ' + S(lo - 1) + '$. Subtracting: $' + S(hi) + ' - (' + S(lo - 1) + ') = ' + tot + '$.');
    }),
    G('count-terms', function () {
      var lo = rint(5, 30), hi = lo + rint(8, 40), p = rint(2, 6), q = nz(-4, 8);
      return num('How many terms are there in $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$?', hi - lo + 1,
        'The terms are $r = ' + lo + ', ' + (lo + 1) + ', \\dots, ' + hi + '$, which is $' + hi + ' - ' + lo + ' + 1 = ' + (hi - lo + 1) + '$ terms.');
    }),
    G('count-terms', function () {
      var lo = rint(6, 20), hi = lo + rint(10, 30), N = hi - lo + 1;
      return mq('How many terms are there from the ' + ord(lo) + ' term to the ' + ord(hi) + ' term of a series, inclusive?', '$' + N + '$',
        ['$' + (N - 1) + '$', '$' + (N + 1) + '$', '$' + hi + '$'],
        'Count from ' + lo + ' to ' + hi + ' including both ends: $' + hi + ' - ' + lo + ' + 1 = ' + N + '$. Subtracting alone gives ' + (N - 1) + ', which misses one term.');
    }),
    G('subtract', function () {
      var p = rint(2, 6), q = nz(-4, 8), lo = rint(10, 40), hi = lo + rint(8, 30);
      return mq('To evaluate $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$ using $S_n = \\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$, which calculation is correct?',
        '$S_{' + hi + '} - S_{' + (lo - 1) + '}$', ['$S_{' + hi + '} - S_{' + lo + '}$', '$S_{' + (hi - lo) + '}$', '$S_{' + hi + '} - S_{' + (lo + 1) + '}$'],
        'The unwanted terms are $r = 1$ to $r = ' + (lo - 1) + '$, so subtract $S_{' + (lo - 1) + '}$. Subtracting $S_{' + lo + '}$ would also remove the wanted term $r = ' + lo + '$.');
    }),
    G('lower-limit', function () {
      var lo = rint(8, 50), hi = lo + rint(10, 40);
      return num('A student writes $\\sum_{r=' + lo + '}^{' + hi + '} f(r) = S_{' + hi + '} - S_m$, where $S_n = \\sum_{r=1}^{n} f(r)$. What is the value of $m$?', lo - 1,
        'The sum to remove is every term before $r = ' + lo + '$, namely $r = 1$ to $' + (lo - 1) + '$. So $m = ' + (lo - 1) + '$.');
    }),
    G('hence', function () {
      var p = rint(2, 6), q = nz(-4, 8), lo = rint(10, 30), hi = lo + rint(10, 30);
      var f = function (n) { return n * (p * n + p + 2 * q) / 2; };
      return num('It is given that $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ') = \\frac{n}{2}(' + lin(p, p + 2 * q, 'n') + ')$. Hence evaluate $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$.', f(hi) - f(lo - 1),
        'Use $S_{' + hi + '} - S_{' + (lo - 1) + '}$. $S_{' + hi + '} = ' + f(hi) + '$ and $S_{' + (lo - 1) + '} = ' + f(lo - 1) + '$, so the answer is $' + (f(hi) - f(lo - 1)) + '$.');
    }),
    G('terms-range', function () {
      var a = rint(2, 12), d = nz(-3, 6), lo = rint(5, 15), hi = lo + rint(8, 25), s = 0;
      for (var n = lo; n <= hi; n++) s += apT(a, d, n);
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Find the sum of the ' + ord(lo) + ' term to the ' + ord(hi) + ' term inclusive.', s,
        'Use $S_{' + hi + '} - S_{' + (lo - 1) + '}$: $S_{' + hi + '} = ' + apS(a, d, hi) + '$ and $S_{' + (lo - 1) + '} = ' + apS(a, d, lo - 1) + '$, so the sum is $' + s + '$.');
    }),
    G('subtract', function () {
      var m = rint(8, 20), n = m + rint(12, 30), Sn = rint(600, 4000), Sm = rint(100, 500);
      return num('For an arithmetic series, $S_{' + n + '} = ' + Sn + '$ and $S_{' + m + '} = ' + Sm + '$. Find the sum of the ' + ord(m + 1) + ' term to the ' + ord(n) + ' term inclusive.', Sn - Sm,
        'The terms from the ' + ord(m + 1) + ' to the ' + ord(n) + ' are what is left after removing the first ' + m + ' terms: $S_{' + n + '} - S_{' + m + '} = ' + Sn + ' - ' + Sm + ' = ' + (Sn - Sm) + '$.');
    }),
    G('first-last', function () {
      var p = rint(2, 8), q = nz(-5, 9), lo = rint(5, 30), hi = lo + rint(8, 30);
      return num('In $\\sum_{r=' + lo + '}^{' + hi + '}(' + lin(p, q, 'r') + ')$, find the value of the first term of the sum.', p * lo + q,
        'The first term has $r = ' + lo + '$ (the lower limit): $' + p + '\\times ' + lo + ' ' + sg(q) + ' = ' + (p * lo + q) + '$.');
    })
  ] };

  // =====================================================================
  // FPM-SER-06 Finding n from an equation linking sums and terms
  // =====================================================================
  B['FPM-SER-06'] = { title: 'Finding n from an equation linking sums and terms', items: [
    G('sum-equals', function () {
      var a = rint(1, 10), d = rint(2, 6), n = rint(5, 14), T = apS(a, d, n);
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. The sum of the first $n$ terms is ' + T + '. Find $n$.', n,
        '$\\frac{n}{2}[2(' + a + ') + (n-1)(' + d + ')] = ' + T + '$ gives $' + quad(d, 2 * a - d, -2 * T, 'n') + ' = 0$. Solving, $n = ' + n + '$; the other root is negative, so it is rejected.');
    }),
    G('shifted-sum', function () {
      var a = rint(1, 10), d = rint(2, 6), m = rint(4, 14), T = apS(a, d, m);
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Given that $S_{n+1} = ' + T + '$, find $n$.', m - 1,
        '$S_{n+1} = \\frac{n+1}{2}[2(' + a + ') + n(' + d + ')] = ' + T + '$. Expanding gives $' + quad(d, 2 * a + d, 2 * a - 2 * T, 'n') + ' = 0$, whose positive root is $n = ' + (m - 1) + '$ (the other root is negative). Check: $S_{' + m + '} = ' + T + '$.');
    }),
    G('double-n', function () {
      var d = 2 * rint(1, 4), n = rint(3, 12), a = d * (n + 1) / 2;
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Given that $S_{2n} = 3S_n$, find $n$.', n,
        '$S_{2n} = n[2a + (2n-1)d]$ and $3S_n = \\frac{3n}{2}[2a + (n-1)d]$. Equate, divide by $n$ ($n \\neq 0$) and expand: $nd = 2a - d$. Here $' + d + 'n = ' + (2 * a - d) + '$, so $n = ' + n + '$.');
    }),
    G('sigma-equation', function () {
      var p = rint(2, 6), q = rint(-3, 6), n = rint(5, 14), T = n * (p * n + p + 2 * q) / 2;
      return num('Given that $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ') = ' + T + '$, find the value of $n$.', n,
        'The sum is $\\frac{n}{2}(' + lin(p, p + 2 * q, 'n') + ')$. Setting this equal to ' + T + ' gives $' + quad(p, p + 2 * q, -2 * T, 'n') + ' = 0$. The positive root is $n = ' + n + '$ (the other root is negative).');
    }),
    G('reject-root', function () {
      var n1 = rint(3, 12), m = rint(2, 9), kind = pick(['neg', 'half', 'poshalf']);
      if (kind === 'neg') {
        return num('A student forms the equation $' + quad(1, m - n1, -m * n1, 'n') + ' = 0$ for the number of terms $n$. Find $n$.', n1,
          'It factorises as $(n - ' + n1 + ')(n + ' + m + ') = 0$, so $n = ' + n1 + '$ or $n = -' + m + '$. The number of terms must be positive, so $n = ' + n1 + '$.');
      }
      var o = 2 * m + 1;   // odd
      if (kind === 'half') {
        return num('Solving a problem about the number of terms $n$ gives $' + quad(2, o - 2 * n1, -o * n1, 'n') + ' = 0$. Find $n$.', n1,
          'It factorises as $(n - ' + n1 + ')(2n + ' + o + ') = 0$, so $n = ' + n1 + '$ or $n = -\\frac{' + o + '}{2}$. A number of terms cannot be negative, so $n = ' + n1 + '$.');
      }
      return num('Solving a problem about the number of terms $n$ gives $' + quad(2, -(o + 2 * n1), o * n1, 'n') + ' = 0$, where $n$ is a positive integer. Find $n$.', n1,
        'It factorises as $(n - ' + n1 + ')(2n - ' + o + ') = 0$, so $n = ' + n1 + '$ or $n = \\frac{' + o + '}{2} = ' + (o / 2) + '$. The number of terms is a whole number, so $n = ' + n1 + '$.');
    }),
    G('substitute-2n', function () {
      var d = rint(2, 6), a = rint(d + 1, d + 6);
      var good = '$' + quad(2 * d, 2 * a - d, 0, 'n') + '$';
      return mq('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Which expression is $S_{2n}$?', good, [
        '$' + quad(d, 2 * a - d, 0, 'n') + '$', '$' + quad(2 * d, 4 * a - 2 * d, 0, 'n') + '$', '$' + quad(2 * d, 2 * a + d, 0, 'n') + '$', '$' + quad(2 * d, 2 * a, 0, 'n') + '$', '$' + quad(4 * d, 2 * a - d, 0, 'n') + '$'],
      '$S_{2n} = \\frac{2n}{2}[2(' + a + ') + (2n-1)(' + d + ')] = n(' + lin(2 * d, 2 * a - d, 'n') + ') = ' + quad(2 * d, 2 * a - d, 0, 'n') + '$. Replace every $n$ in $S_n$ by $2n$; it is not just $2S_n$.');
    }),
    G('sum-equals', function () {
      var a = rint(1, 6), d = rint(3, 8), n = rint(6, 16), T = apS(a, d, n);
      return num('The first term of an arithmetic series is ' + a + ' and the common difference is ' + d + '. The sum of the first $n$ terms is ' + T + '. Use algebra to find $n$ (reject any invalid root).', n,
        'Set $\\frac{n}{2}[' + 2 * a + ' + ' + d + '(n-1)] = ' + T + '$ and rearrange to $' + quad(d, 2 * a - d, -2 * T, 'n') + ' = 0$. Solving gives $n = ' + n + '$; the other solution is negative, so it is rejected.');
    }),
    G('sigma-equation', function () {
      var p = rint(3, 7), q = rint(-2, 5), n = rint(6, 15), T = n * (p * n + p + 2 * q) / 2;
      return num('The sum of the first $n$ terms of the series $\\sum_{r=1}^{n}(' + lin(p, q, 'r') + ')$ is ' + T + '. Use algebra to find $n$.', n,
        'First term ' + (p + q) + ', common difference ' + p + ': $\\frac{n}{2}[2(' + (p + q) + ') + (n-1)(' + p + ')] = ' + T + '$, which simplifies to $' + quad(p, p + 2 * q, -2 * T, 'n') + ' = 0$. Solving gives $n = ' + n + '$; the other root is negative, so reject it.');
    }),
    M('divide-by-n', 'Solving a problem gives $n(3n - 24) = 0$ where $n$ is the number of terms. Which conclusion is correct?',
      ['$n = 8$, because $n = 0$ is not a possible number of terms', '$n = 0$ or $n = 8$, so give both answers', '$n = 24$', '$n = 8$ and also $n = -8$'], 0,
      'Either $n = 0$ or $3n - 24 = 0$. A series has at least one term, so $n = 0$ is rejected and $n = 8$. (Dividing by $n$ is allowed since $n \\neq 0$.)'),
    G('shifted-sum', function () {
      var a = rint(2, 9), d = rint(2, 5), m = rint(5, 12), T = apS(a, d, m);
      return mq('For an arithmetic series with first term ' + a + ' and common difference ' + d + ', which equation in $n$ comes from $S_{n+1} = ' + T + '$?',
        '$' + quad(d, 2 * a + d, 2 * a - 2 * T, 'n') + ' = 0$',
        ['$' + quad(d, 2 * a - d, -2 * T, 'n') + ' = 0$', '$' + quad(d, 2 * a + d, -2 * T, 'n') + ' = 0$', '$' + quad(d, 2 * a + 2 * d, 2 * a - 2 * T, 'n') + ' = 0$'],
        '$S_{n+1} = \\frac{n+1}{2}[2(' + a + ') + n(' + d + ')]$. Multiply by 2 and expand: $(n+1)(' + lin(d, 2 * a, 'n') + ') = ' + quad(d, 2 * a + d, 2 * a, 'n') + '$. Then equate to $' + 2 * T + '$.');
    })
  ] };

  // =====================================================================
  // FPM-SER-07 Least or greatest number of terms for an arithmetic sum
  // =====================================================================
  function critRoot(a, d, T) { var b = 2 * a - d; return (-b + Math.sqrt(b * b + 8 * d * T)) / (2 * d); }
  function betweenT(a, d, m) { return apS(a, d, m) + rint(1, Math.max(1, apT(a, d, m + 1) - 1)); }
  B['FPM-SER-07'] = { title: 'Least or greatest number of terms for an arithmetic sum', items: [
    G('least-n', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(6, 16), T = betweenT(a, d, m), n = 1;
      while (apS(a, d, n) <= T) n++;
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Find the least value of $n$ for which $S_n > ' + T + '$.', n,
        '$\\frac{n}{2}[' + 2 * a + ' + ' + d + '(n-1)] \\gt ' + T + '$ gives $' + quad(d, 2 * a - d, -2 * T, 'n') + ' \\gt 0$. The critical value is $n = ' + R.roundDp(critRoot(a, d, T), 2) + '$, so the least integer is $n = ' + n + '$. Check: $S_{' + (n - 1) + '} = ' + apS(a, d, n - 1) + ' \\leqslant ' + T + '$ and $S_{' + n + '} = ' + apS(a, d, n) + '$.');
    }),
    G('least-n', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(6, 16), T = betweenT(a, d, m), n = 1;
      while (apS(a, d, n) <= T) n++;
      return num('How many terms of the series $' + listAP(a, d) + '$ are needed for the sum to exceed ' + T + '?', n,
        'Here $a = ' + a + '$, $d = ' + d + '$ so $S_n = \\frac{n}{2}[' + 2 * a + ' + ' + d + '(n-1)]$. Solving $S_n = ' + T + '$ gives $n = ' + R.roundDp(critRoot(a, d, T), 2) + '$, so at least $' + n + '$ terms are needed. Check: $S_{' + (n - 1) + '} = ' + apS(a, d, n - 1) + '$, $S_{' + n + '} = ' + apS(a, d, n) + '$.');
    }),
    G('greatest-n', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(6, 16), T = betweenT(a, d, m), n = 1;
      while (apS(a, d, n + 1) < T) n++;
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Find the greatest value of $n$ for which $S_n \\lt ' + T + '$.', n,
        'Solve $S_n = ' + T + '$: $' + quad(d, 2 * a - d, -2 * T, 'n') + ' = 0$ gives $n = ' + R.roundDp(critRoot(a, d, T), 2) + '$. $S_n$ is below ' + T + ' for smaller $n$, so round down: $n = ' + n + '$. Check: $S_{' + n + '} = ' + apS(a, d, n) + ' \\lt ' + T + '$ and $S_{' + (n + 1) + '} = ' + apS(a, d, n + 1) + ' \\gt ' + T + '$.');
    }),
    G('greatest-n', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(6, 16), T = betweenT(a, d, m), n = 1;
      while (apS(a, d, n + 1) <= T) n++;
      return num('The sum of the first $n$ terms of the series $' + listAP(a, d) + '$ must not be more than ' + T + '. What is the greatest possible value of $n$?', n,
        'Solve $S_n = ' + T + '$ to get the critical value $n = ' + R.roundDp(critRoot(a, d, T), 2) + '$. Since the sum is allowed to be up to ' + T + ', round down: $n = ' + n + '$. Check: $S_{' + n + '} = ' + apS(a, d, n) + ' \\leqslant ' + T + '$ but $S_{' + (n + 1) + '} = ' + apS(a, d, n + 1) + '$.');
    }),
    G('negative-d', function () {
      var a, d, n, ok = false;
      while (!ok) {
        a = rint(30, 60); d = -rint(3, 8);
        ok = (2 * a) % (-d) !== 0;
      }
      n = 1; while (apS(a, d, n) >= 0) n++;
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Find the least value of $n$ for which $S_n \\lt 0$.', n,
        '$S_n = \\frac{n}{2}[' + 2 * a + ' - ' + (-d) + '(n-1)]$. For $n \\gt 0$ this is negative when $' + 2 * a + ' - ' + (-d) + '(n-1) \\lt 0$, i.e. $n \\gt 1 + \\frac{' + 2 * a + '}{' + (-d) + '} = ' + R.roundDp(1 + 2 * a / (-d), 2) + '$. The least integer is $n = ' + n + '$.');
    }),
    G('rounding', function () {
      var b = rint(8, 25), f = rint(1, 9), c = b + f / 10, T = rint(200, 900);
      return mq('For an increasing arithmetic series with positive terms, solving $S_n = ' + T + '$ gives $n = ' + fmt(c) + '$. What is the least value of $n$ for which $S_n \\gt ' + T + '$?',
        '$' + (b + 1) + '$', ['$' + b + '$', '$' + fmt(c) + '$', '$' + (b - 1) + '$'],
        'The sum equals ' + T + ' at $n = ' + fmt(c) + '$ and grows after that. $n$ must be a whole number past the critical value, so round up to $' + (b + 1) + '$. Rounding down to ' + b + ' gives a sum still below ' + T + '.');
    }),
    G('rounding', function () {
      var b = rint(8, 25), f = rint(1, 9), c = b + f / 10, T = rint(200, 900);
      return mq('For an increasing arithmetic series with positive terms, solving $S_n = ' + T + '$ gives $n = ' + fmt(c) + '$. What is the greatest value of $n$ for which $S_n \\lt ' + T + '$?',
        '$' + b + '$', ['$' + (b + 1) + '$', '$' + fmt(c) + '$', '$' + (b - 1) + '$'],
        'The sum is below ' + T + ' only while $n \\lt ' + fmt(c) + '$. The greatest whole number there is $' + b + '$, so round down. Rounding up to ' + (b + 1) + ' gives a sum above ' + T + '.');
    }),
    G('set-up', function () {
      var a = rint(2, 9), d = rint(2, 6), T = rint(100, 800);
      return mq('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Which inequality in $n$ is equivalent to $S_n \\gt ' + T + '$?',
        '$' + quad(d, 2 * a - d, -2 * T, 'n') + ' \\gt 0$',
        ['$' + quad(d, 2 * a - d, -T, 'n') + ' \\gt 0$', '$' + quad(d, 2 * a + d, -2 * T, 'n') + ' \\gt 0$', '$' + quad(d, 2 * a, -2 * T, 'n') + ' \\gt 0$'],
        '$S_n = \\frac{n}{2}[' + 2 * a + ' + ' + d + '(n-1)] = \\frac{n}{2}(' + lin(d, 2 * a - d, 'n') + ')$. Multiply the inequality by 2 (both sides): $n(' + lin(d, 2 * a - d, 'n') + ') \\gt ' + 2 * T + '$, i.e. $' + quad(d, 2 * a - d, -2 * T, 'n') + ' \\gt 0$.');
    }),
    G('boundary', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(5, 15), T = apS(a, d, m), v = pick(['gt', 'ge', 'le', 'lt']);
      var text = { gt: ['least', '\\gt', m + 1], ge: ['least', '\\geqslant', m], le: ['greatest', '\\leqslant', m], lt: ['greatest', '\\lt', m - 1] }[v];
      return num('An arithmetic series has first term ' + a + ' and common difference ' + d + '. Find the ' + text[0] + ' value of $n$ for which $S_n ' + text[1] + ' ' + T + '$.', text[2],
        'Here $S_{' + m + '} = ' + T + '$ exactly (the critical value is the whole number ' + m + '). With $' + text[1] + '$ the case $n = ' + m + '$' + (v === 'gt' || v === 'lt' ? ' is not allowed' : ' is allowed') + ', so the ' + text[0] + ' value is $n = ' + text[2] + '$.');
    }),
    G('check-neighbour', function () {
      var a = rint(2, 9), d = rint(2, 6), m = rint(8, 20), s1 = apS(a, d, m), s2 = apS(a, d, m + 1), T = s1 + rint(1, s2 - s1 - 1);
      return num('An increasing series has $S_{' + m + '} = ' + s1 + '$ and $S_{' + (m + 1) + '} = ' + s2 + '$. Find the least value of $n$ for which $S_n \\gt ' + T + '$.', m + 1,
        'The sums increase, and ' + s1 + ' is below ' + T + ' while ' + s2 + ' is above it. So $S_{' + m + '}$ is too small and $S_{' + (m + 1) + '}$ is the first sum to exceed ' + T + ': $n = ' + (m + 1) + '$.');
    })
  ] };

  // =====================================================================
  // FPM-SER-08 First term and common ratio of a geometric series
  // =====================================================================
  B['FPM-SER-08'] = { title: 'Finding the first term and common ratio of a geometric series', items: [
    G('find-r', function () {
      var r = pick([2, 3, 4, 5, -2, -3]), p = rint(2, 4), gap = r < 0 ? pick([1, 3]) : rint(1, 3), q = p + gap, a = rint(1, 5);
      var up = a * Math.pow(r, p - 1), uq = a * Math.pow(r, q - 1);
      return num('The ' + ord(p) + ' term of a geometric series is ' + up + ' and the ' + ord(q) + ' term is ' + uq + '.' + (r > 0 && gap % 2 === 0 ? ' The common ratio $r$ is positive.' : '') + ' Find the common ratio $r$.', r,
        '$ar^{' + (p - 1) + '} = ' + up + '$ and $ar^{' + (q - 1) + '} = ' + uq + '$. Dividing: $r^{' + gap + '} = \\frac{' + uq + '}{' + up + '} = ' + (uq / up) + '$, so $r = ' + r + '$.');
    }),
    G('find-r', function () {
      var r = pick([2, 3, 4, 5, -2, 0.5]), p = rint(2, 3), gap = 1, a = pick([8, 16, 32, 48]);
      var up = a * Math.pow(r, p - 1), uq = a * Math.pow(r, p);
      return num('In a geometric series the ' + ord(p) + ' term is ' + fmt(up) + ' and the ' + ord(p + 1) + ' term is ' + fmt(uq) + '. Find the common ratio.', r,
        'The common ratio is the later term divided by the earlier one: $r = \\frac{' + fmt(uq) + '}{' + fmt(up) + '} = ' + fmt(r) + '$.');
    }),
    G('find-a', function () {
      var r = pick([2, 3, 4, 5]), p = rint(2, 3), q = p + rint(2, 3), a = rint(1, 6);
      var up = a * Math.pow(r, p - 1), uq = a * Math.pow(r, q - 1);
      return num('A geometric series has $u_{' + p + '} = ' + up + '$ and $u_{' + q + '} = ' + uq + '$, with a positive common ratio. Find the first term $a$.', a,
        'Dividing, $r^{' + (q - p) + '} = \\frac{' + uq + '}{' + up + '} = ' + (uq / up) + '$, so $r = ' + r + '$. Then $a r^{' + (p - 1) + '} = ' + up + '$ gives $a = ' + up + ' \\div ' + Math.pow(r, p - 1) + ' = ' + a + '$.');
    }),
    G('nth-term', function () {
      var r = pick([2, 3, 0.5, -2]), a = pick([16, 32, 64, 128]), k = rint(5, 8);
      var s1 = a, s2 = a * r, s3 = a * r * r;
      return num('The first three terms of a geometric series are $' + fmt(s1) + ', ' + fmt(s2) + ', ' + fmt(s3) + ', \\dots$. Find the ' + ord(k) + ' term.', a * Math.pow(r, k - 1),
        'The ratio is $r = ' + fmt(s2) + ' \\div ' + fmt(s1) + ' = ' + fmt(r) + '$. Then $u_{' + k + '} = ar^{' + (k - 1) + '} = ' + a + '\\times (' + fmt(r) + ')^{' + (k - 1) + '} = ' + fmt(a * Math.pow(r, k - 1)) + '$.');
    }),
    G('nth-term', function () {
      var r = pick([2, 3, 4]), p = rint(2, 4), q = p + rint(2, 4), a = rint(1, 4);
      var up = a * Math.pow(r, p - 1), uq = a * Math.pow(r, q - 1), m = q + rint(1, 2);
      return num('The common ratio of a geometric series is ' + r + ' and the ' + ord(p) + ' term is ' + up + '. Find the ' + ord(q) + ' term.', uq,
        'Between the ' + ord(p) + ' and ' + ord(q) + ' terms the series is multiplied by $r$ exactly ' + (q - p) + ' times: $' + up + '\\times ' + r + '^{' + (q - p) + '} = ' + uq + '$.');
    }),
    G('sign-choice', function () {
      var r0 = pick([2, 3, 4, 5]), p = rint(2, 4), a = rint(1, 5) , neg = Math.random() < 0.5;
      var u1 = a * Math.pow(r0, p - 1) * (1), up = u1 * 1; // p-th term positive
      var upp = up * r0 * r0;
      var cond = neg ? 'the ' + ord(p + 1) + ' term is negative' : 'all the terms are positive';
      var ans = neg ? -r0 : r0;
      return mq('A geometric series has positive ' + ord(p) + ' term ' + up + ' and $u_{' + (p + 2) + '} = ' + upp + '$. Given that ' + cond + ', find $r$.',
        '$r = ' + ans + '$', ['$r = \\pm ' + r0 + '$', '$r = ' + (neg ? r0 : -r0) + '$', '$r = ' + r0 * r0 + '$'],
        'Dividing, $r^2 = \\frac{' + upp + '}{' + up + '} = ' + r0 * r0 + '$, so $r = \\pm ' + r0 + '$. Since $u_{' + p + '} \\gt 0$ and ' + (neg ? 'the next term is negative, $r$ is negative' : 'all terms are positive, $r$ is positive') + ': $r = ' + ans + '$.');
    }),
    G('surd-ratio', function () {
      var k = pick([2, 3, 5, 6, 7]), p = rint(2, 3), A = rint(2, 9), neg = Math.random() < 0.5;
      var which = neg ? 'a negative common ratio' : 'both possible values of $r$';
      var good = neg ? '$r = -\\sqrt{' + k + '}$' : '$r = \\pm\\sqrt{' + k + '}$';
      var ds = neg ? ['$r = \\sqrt{' + k + '}$', '$r = -' + k + '$', '$r = \\pm\\sqrt{' + k + '}$'] : ['$r = \\sqrt{' + k + '}$', '$r = \\pm ' + k + '$', '$r = ' + k + '$'];
      return mq('In a geometric series, $u_{' + p + '} = ' + A + '$ and $u_{' + (p + 2) + '} = ' + A * k + '$. Find ' + (neg ? 'the value of $r$, given that $r$ is negative' : 'the possible values of $r$') + '.',
        good, ds,
        'Dividing, $r^2 = \\frac{' + A * k + '}{' + A + '} = ' + k + '$, so $r = \\pm\\sqrt{' + k + '}$' + (neg ? '; the negative one is $-\\sqrt{' + k + '}$.' : '. An even power gives two roots, so both signs are valid.'));
    }),
    G('trap-power', function () {
      var a = rint(2, 7), r = rint(2, 5), k = rint(5, 9);
      return mq('A geometric series has first term ' + a + ' and common ratio ' + r + '. Which expression gives the ' + ord(k) + ' term?',
        '$' + a + '\\times ' + r + '^{' + (k - 1) + '}$', ['$' + a + '\\times ' + r + '^{' + k + '}$', '$(' + a + '\\times ' + r + ')^{' + (k - 1) + '}$', '$' + a + '\\times ' + r + '\\times ' + k + '$'],
        'The $n$th term is $ar^{n-1}$. For $n = ' + k + '$ the power is ' + (k - 1) + ' because the first term has no ratio applied yet, giving $' + a + '\\times ' + r + '^{' + (k - 1) + '}$.');
    }),
    G('consecutive-terms', function () {
      var x = rint(2, 8), r = pick([2, 3, 4]), d1 = x * (r - 1), d2 = x * (r * r - 1);
      return num('The numbers $k$, $k + ' + d1 + '$ and $k + ' + d2 + '$ are three consecutive terms of a geometric series. Find the value of $k$.', x,
        'For a geometric series (middle)$^2$ = first $\\times$ third: $(k + ' + d1 + ')^2 = k(k + ' + d2 + ')$. Expanding, $' + 2 * d1 + 'k + ' + d1 * d1 + ' = ' + d2 + 'k$, so $' + (d2 - 2 * d1) + 'k = ' + d1 * d1 + '$ and $k = ' + x + '$. The terms are ' + x + ', ' + x * r + ', ' + x * r * r + '.');
    }),
    G('sign-choice', function () {
      var r = pick([2, 3, 4]), a = rint(1, 4), p = 3;
      var u2 = a * r, u4 = a * r * r * r;
      return mq('A geometric series has $u_2 = ' + u2 + '$ and $u_4 = ' + u4 + '$ and the series has only positive terms. Which statement is correct?',
        '$r = ' + r + '$ and $a = ' + a + '$', ['$r = \\pm ' + r + '$ and $a = ' + a + '$', '$r = ' + r + '$ and $a = ' + u2 + '$', '$r = -' + r + '$ and $a = ' + (-a) + '$'],
        'Dividing $u_4$ by $u_2$ gives $r^2 = ' + r * r + '$, so $r = \\pm ' + r + '$. All terms are positive, so $r = ' + r + '$. Then $ar = ' + u2 + '$ gives $a = ' + a + '$.');
    })
  ] };

  // =====================================================================
  // FPM-SER-10 Finding r from sums of a geometric series
  // =====================================================================
  B['FPM-SER-10'] = { title: 'Finding r from sums of a geometric series', items: [
    G('sum-inf-ratio', function () {
      var k = pick([2, 4, 5, 10, 1.25, 2.5]), r = 1 - 1 / k;
      return num('The sum to infinity of a geometric series is ' + fmt(k) + ' times its first term. Find the common ratio $r$ as a decimal.', r,
        '$\\frac{a}{1-r} = ' + fmt(k) + 'a$. Divide by $a$: $\\frac{1}{1-r} = ' + fmt(k) + '$, so $1 - r = ' + fmt(1 / k) + '$ and $r = ' + fmt(r) + '$.');
    }),
    G('sum-inf-ratio', function () {
      var k = pick([3, 4, 5, 6]);
      return mq('The sum to infinity of a geometric series is ' + k + ' times its first term. What is the common ratio $r$?',
        '$r = \\frac{' + (k - 1) + '}{' + k + '}$', ['$r = \\frac{1}{' + k + '}$', '$r = \\frac{' + k + '}{' + (k + 1) + '}$', '$r = ' + (k - 1) + '$'],
        '$\\frac{a}{1-r} = ' + k + 'a$ gives $1 = ' + k + '(1 - r)$, so $1 - r = \\frac{1}{' + k + '}$ and $r = \\frac{' + (k - 1) + '}{' + k + '}$.');
    }),
    G('divide-sums', function () {
      var r = pick([2, 3, 4, 5]), a = rint(1, 5), X = a * (1 + r), Y = X * r * r;
      return num('The sum of the first two terms of a geometric series is ' + X + ' and the sum of the third and fourth terms is ' + Y + '. Given that $r \\gt 0$, find $r$.', r,
        '$a(1 + r) = ' + X + '$ and $ar^2(1 + r) = ' + Y + '$. Dividing, the common factor $a(1+r)$ cancels: $r^2 = \\frac{' + Y + '}{' + X + '} = ' + r * r + '$, so $r = ' + r + '$ (positive).');
    }),
    G('divide-sums', function () {
      var r = pick([2, 3, 4, 5, 0.5, -2, -3]), a = 2 * rint(1, 4), X = a * (1 + r), Y = X * r;
      return num('In a geometric series the sum of the first two terms is ' + fmt(X) + ' and the sum of the second and third terms is ' + fmt(Y) + '. Find the common ratio.', r,
        '$a + ar = ' + fmt(X) + '$ and $ar + ar^2 = ' + fmt(Y) + '$. Factorising, $a(1+r) = ' + fmt(X) + '$ and $ar(1+r) = ' + fmt(Y) + '$. Dividing gives $r = \\frac{' + fmt(Y) + '}{' + fmt(X) + '} = ' + fmt(r) + '$.');
    }),
    G('divide-sums', function () {
      var r = pick([2, 3, 4, 5]), a = rint(1, 5), X = a * (1 + r), Y = X * r * r;
      return mq('A geometric series has $a + ar = ' + X + '$ and $ar^2 + ar^3 = ' + Y + '$. Dividing the second equation by the first gives which result?',
        '$r^2 = ' + r * r + '$', ['$r = ' + r * r + '$', '$r^2 = ' + (Y - X) + '$', '$r = ' + (Y - X) + '$'],
        'Factorise: $a(1+r) = ' + X + '$ and $ar^2(1+r) = ' + Y + '$. Dividing whole expressions, $a(1+r)$ cancels leaving $r^2 = \\frac{' + Y + '}{' + X + '} = ' + r * r + '$. Subtracting the equations does not cancel anything useful.');
    }),
    G('two-sums-r', function () {
      var r = pick([0.5, 0.2, 0.4, 0.6, 0.8]), a = 60 * rint(1, 2), X = a * (1 + r), Y = a / (1 - r);
      return num('A geometric series has $S_2 = ' + fmt(X) + '$ and sum to infinity $S_\\infty = ' + fmt(Y) + '$. Given that $r \\gt 0$, find $r$ as a decimal.', r,
        '$a(1 + r) = ' + fmt(X) + '$ and $\\frac{a}{1 - r} = ' + fmt(Y) + '$. Dividing the first by the second eliminates $a$ and gives $1 - r^2 = ' + fmt(X / Y) + '$, so $r^2 = ' + fmt(r * r) + '$ and $r = ' + fmt(r) + '$.');
    }),
    G('two-sums-a', function () {
      var r = pick([0.5, 0.2, 0.4, 0.6, 0.8]), a = 60 * rint(1, 2), X = a * (1 + r), Y = a / (1 - r);
      return num('A geometric series has $S_2 = ' + fmt(X) + '$ and sum to infinity $S_\\infty = ' + fmt(Y) + '$. Given that $r \\gt 0$, find the first term $a$.', a,
        'Dividing $a(1 + r) = ' + fmt(X) + '$ by $\\frac{a}{1-r} = ' + fmt(Y) + '$ gives $1 - r^2 = ' + fmt(X / Y) + '$, so $r^2 = ' + fmt(r * r) + '$ and $r = ' + fmt(r) + '$. Then $a = S_\\infty(1 - r) = ' + fmt(Y) + '\\times ' + fmt(1 - r) + ' = ' + a + '$.');
    }),
    G('reject-root', function () {
      var v = pick([0.5, 0.25, 0.2, 0.4, 0.8]), inv = 1 / v, two = Math.random() < 0.5;
      var first = two ? fmt(v) : fmt(inv), second = two ? fmt(inv) : fmt(v);
      return num('Solving an equation for the common ratio of a geometric series gives $r = ' + first + '$ or $r = ' + second + '$. The series has a sum to infinity. What is $r$?', v,
        'A sum to infinity exists only when $|r| \\lt 1$. The value ' + fmt(inv) + ' has $|r| \\gt 1$ so it is rejected, leaving $r = ' + fmt(v) + '$.');
    }),
    G('quadratic-r', function () {
      var r = rint(2, 6), a = rint(1, 5), S = a * (1 + r + r * r), k = S / a;
      return num('A geometric series has first term ' + a + ' and sum of the first three terms equal to ' + S + '. Given that $r \\gt 0$, find $r$.', r,
        '$a(1 + r + r^2) = ' + S + '$ so $1 + r + r^2 = ' + k + '$, i.e. $r^2 + r - ' + (k - 1) + ' = 0$. Factorising: $(r - ' + r + ')(r + ' + (r + 1) + ') = 0$. The positive root is $r = ' + r + '$.');
    }),
    M('sum-formula', 'The sum of the first three terms of a geometric series with first term $a$ and common ratio $r$ is which of these?',
      ['$a(1 + r + r^2)$', '$a(1 + r)(1 + r^2)$', '$a(1 + r^2 + r^3)$', '$\\frac{a(1 - r^2)}{1 - r}$'], 0,
      'The terms are $a$, $ar$, $ar^2$, which add to $a(1 + r + r^2)$. This equals $\\frac{a(1 - r^3)}{1 - r}$, because $1 - r^3 = (1 - r)(1 + r + r^2)$. The other options add four terms, skip a term or use the wrong power.'),
    M('factorise', 'Which is the correct factorisation of $1 - r^3$?',
      ['$(1 - r)(1 + r + r^2)$', '$(1 - r)(1 - r + r^2)$', '$(1 + r)(1 - r + r^2)$', '$(1 - r)(1 - r)(1 + r)$'], 0,
      'Multiplying out, $(1 - r)(1 + r + r^2) = 1 + r + r^2 - r - r^2 - r^3 = 1 - r^3$. The other products give $1 + r^3$ or other expressions.')
  ] };

  // =====================================================================
  // FPM-SER-11 Adding up a finite geometric series
  // =====================================================================
  B['FPM-SER-11'] = { title: 'Adding up a finite geometric series', items: [
    G('apply-formula', function () {
      var a = rint(1, 5), r = pick([2, 3, 4]), n = rint(5, 8), S = gS(a, r, n);
      return num('Find the sum of the first ' + n + ' terms of the geometric series with first term ' + a + ' and common ratio ' + r + '.', S,
        '$S_{' + n + '} = \\frac{a(r^{n} - 1)}{r - 1} = \\frac{' + a + '(' + r + '^{' + n + '} - 1)}{' + (r - 1) + '} = \\frac{' + a + '\\times ' + (Math.pow(r, n) - 1) + '}{' + (r - 1) + '} = ' + S + '$.');
    }),
    G('apply-formula', function () {
      var a = rint(1, 6), r = pick([2, 3]), n = rint(5, 8), S = gS(a, r, n);
      return num('Find the sum of the first ' + n + ' terms of the geometric series $' + a + ' + ' + a * r + ' + ' + a * r * r + ' + \\dots$', S,
        'Here $a = ' + a + '$ and $r = ' + r + '$ (' + a * r + ' $\\div$ ' + a + '). $S_{' + n + '} = \\frac{' + a + '(' + r + '^{' + n + '} - 1)}{' + r + ' - 1} = ' + S + '$.');
    }),
    G('fractional-r', function () {
      var k = rint(5, 8), a = Math.pow(2, k), n = rint(3, k + 1), S = gS(a, 0.5, n);
      return num('Find the sum of the first ' + n + ' terms of the geometric series with first term ' + a + ' and common ratio $\\frac{1}{2}$.', S,
        '$S_{' + n + '} = \\frac{a(1 - r^{n})}{1 - r} = \\frac{' + a + '(1 - (\\frac{1}{2})^{' + n + '})}{\\frac{1}{2}} = ' + S + '$. (Check: the terms are ' + (function () { var t = [], x = a; for (var i = 0; i < n; i++) { t.push(x); x /= 2; } return t.join(' + '); })() + '.)');
    }),
    G('negative-r', function () {
      var a = rint(1, 5), r = pick([-2, -3]), n = rint(5, 8), S = gS(a, r, n);
      return num('Find the sum of the first ' + n + ' terms of the geometric series with first term ' + a + ' and common ratio ' + r + '.', S,
        '$S_{' + n + '} = \\frac{a(1 - r^{n})}{1 - r} = \\frac{' + a + '(1 - (' + r + ')^{' + n + '})}{1 - (' + r + ')} = \\frac{' + a + '\\times (' + (1 - Math.pow(r, n)) + ')}{' + (1 - r) + '} = ' + S + '$. Take care with the sign of $(' + r + ')^{' + n + '}$.');
    }),
    G('sigma-geo', function () {
      var a = rint(2, 5), r = pick([2, 3]), n = rint(5, 8), s = 0;
      for (var k = 1; k <= n; k++) s += a * Math.pow(r, k);
      return num('Evaluate $\\sum_{k=1}^{' + n + '} ' + a + '\\times ' + r + '^{k}$.', s,
        'At $k = 1$ the first term is $' + a + '\\times ' + r + ' = ' + a * r + '$, and the ratio is ' + r + ', with ' + n + ' terms. $S = \\frac{' + a * r + '(' + r + '^{' + n + '} - 1)}{' + (r - 1) + '} = ' + s + '$.');
    }),
    G('count-terms', function () {
      var c = rint(1, 3), r = pick([2, 3]), p = rint(2, 4), q = p + rint(4, 6), s = 0;
      for (var k = p; k <= q; k++) s += c * Math.pow(r, k);
      return num('Evaluate $\\sum_{k=' + p + '}^{' + q + '} ' + (c === 1 ? '' : c + '\\times ') + r + '^{k}$.', s,
        'There are $' + q + ' - ' + p + ' + 1 = ' + (q - p + 1) + '$ terms. The first term (at $k = ' + p + '$) is $' + c * Math.pow(r, p) + '$ and the ratio is ' + r + '. $S = \\frac{' + c * Math.pow(r, p) + '(' + r + '^{' + (q - p + 1) + '} - 1)}{' + (r - 1) + '} = ' + s + '$.');
    }),
    G('terms-range', function () {
      var a = rint(1, 3), r = 2, p = rint(3, 5), q = p + rint(3, 4), s = 0;
      for (var k = p; k <= q; k++) s += a * Math.pow(r, k - 1);
      return num('A geometric series has first term ' + a + ' and common ratio 2. Find the sum of the ' + ord(p) + ' term to the ' + ord(q) + ' term inclusive.', s,
        'The ' + ord(p) + ' term is $' + a + '\\times 2^{' + (p - 1) + '} = ' + a * Math.pow(2, p - 1) + '$. There are $' + q + ' - ' + p + ' + 1 = ' + (q - p + 1) + '$ terms, so the sum is $\\frac{' + a * Math.pow(2, p - 1) + '(2^{' + (q - p + 1) + '} - 1)}{2 - 1} = ' + s + '$.');
    }),
    G('surd-form', function () {
      var useThree = Math.random() < 0.5, a = rint(1, 4), m = useThree ? rint(2, 3) : rint(2, 4), n = 2 * m;
      var p = useThree ? a * (Math.pow(3, m) - 1) / 2 : a * (Math.pow(2, m) - 1), s = useThree ? 3 : 2;
      return num('A geometric series has first term ' + a + ' and common ratio $\\sqrt{' + s + '}$. The sum of the first ' + n + ' terms can be written as $p(1 + \\sqrt{' + s + '})$, where $p$ is an integer. Find $p$.', p,
        '$S_{' + n + '} = \\frac{' + a + '((\\sqrt{' + s + '})^{' + n + '} - 1)}{\\sqrt{' + s + '} - 1} = \\frac{' + a * (Math.pow(s, m) - 1) + '}{\\sqrt{' + s + '} - 1}$. Multiply top and bottom by $\\sqrt{' + s + '} + 1$: ' + (useThree ? 'the denominator becomes 2, giving $\\frac{' + a * (Math.pow(3, m) - 1) + '}{2}(\\sqrt{3} + 1)$' : 'the denominator becomes 1, giving $' + p + '(\\sqrt{2} + 1)$') + '. So $p = ' + p + '$.');
    }),
    G('rationalise', function () {
      var p = rint(2, 9) * (Math.random() < 0.5 ? 1 : 1);
      return mq('Rationalise the denominator: $\\frac{' + p + '}{\\sqrt{2} - 1}$.',
        '$' + p + '(\\sqrt{2} + 1)$', ['$' + p + '(\\sqrt{2} - 1)$', '$' + p + '(2 + \\sqrt{2})$', '$-' + p + '(\\sqrt{2} + 1)$'],
        'Multiply top and bottom by $\\sqrt{2} + 1$. The denominator becomes $(\\sqrt{2} - 1)(\\sqrt{2} + 1) = 2 - 1 = 1$, so the result is $' + p + '(\\sqrt{2} + 1)$.');
    }),
    G('sigma-first', function () {
      var A = pick([4, 5, 6, 7]), Bb = pick([2, 3]), shift = Math.random() < 0.5, n = rint(6, 10);
      var expr = shift ? A + '\\times ' + Bb + '^{k-1}' : A + '\\times ' + Bb + '^{k}';
      var good = shift ? A : A * Bb;
      return mq('Considering $\\sum_{k=1}^{' + n + '} ' + expr + '$ as a geometric series, what is its first term?', '$' + good + '$',
        ['$' + (shift ? A * Bb : A) + '$', '$' + Bb + '$', '$' + A * Bb * Bb + '$'],
        'The first term is found by putting $k = 1$: ' + (shift ? '$' + A + '\\times ' + Bb + '^{0} = ' + A + '$' : '$' + A + '\\times ' + Bb + '^{1} = ' + A * Bb + '$') + '. The ratio is ' + Bb + '.');
    }),
    M('formula-choice', 'For a geometric series with common ratio $r = 3$, which form of the sum formula avoids negative signs?',
      ['$S_n = \\frac{a(3^n - 1)}{3 - 1}$', '$S_n = \\frac{a(1 - 3^n)}{3 - 1}$', '$S_n = \\frac{a(3^n - 1)}{1 - 3}$', '$S_n = a(1 - 3^n)(3 - 1)$'], 0,
      '$\\frac{a(1 - r^n)}{1 - r}$ and $\\frac{a(r^n - 1)}{r - 1}$ are equal. For $r \\gt 1$ the second form has a positive numerator and denominator. Changing only one of the two signs, or multiplying instead of dividing, gives a wrong sum.')
  ] };
})();
