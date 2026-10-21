/* Group G10 mastery bank: Sine models and exact trig ratios; Arc length and sectors; Cosine rule, sine rule and triangle area; 3D trigonometry. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  var D2R = Math.PI / 180;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function sfTol(x, n) { return 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - (n - 1)) * 1.02; }
  // fraction in TeX, reduced, sign out the front
  function fr(n, d) { var g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } var s = n < 0 ? '-' : ''; n = Math.abs(n); return d === 1 ? s + n : s + '\\frac{' + n + '}{' + d + '}'; }
  // sqrt(n) simplified -> [c, m] with sqrt(n) = c*sqrt(m)
  function sqS(n) { var c = 1, m = n; for (var f = 2; f * f <= m; f++) { while (m % (f * f) === 0) { m /= f * f; c *= f; } } return [c, m]; }
  function surd(c, m) { if (m === 1) return '' + c; return (c === 1 ? '' : c) + '\\sqrt{' + m + '}'; }
  // (c*sqrt(n))/d simplified in TeX, optional minus sign
  function sfr(c, n, d, neg) {
    var s = sqS(n), cc = c * s[0], mm = s[1], g = gcd(cc, d); cc /= g; d /= g;
    var body = surd(cc, mm), sg = neg ? '-' : '';
    return d === 1 ? sg + body : sg + '\\frac{' + body + '}{' + d + '}';
  }
  // a + c*sqrt(r)  (c may be negative; r may be 1)
  function lin(a, c, r) { var t = surd(Math.abs(c), r); return a + (c < 0 ? ' - ' : ' + ') + t; }
  // generic "x + c" style signed term: lead + sign |c|
  function sgnTerm(c) { return (c < 0 ? ' - ' : ' + ') + Math.abs(c); }
  function T(s) { return '$' + s + '$'; }
  function mc(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  function nu(skill, q, answer, tol, display, why, unit) { var o = { skill: skill, kind: 'num', q: q, answer: answer, tol: tol, display: display, why: why }; if (unit) o.unit = unit; return o; }
  // generated items
  function G(skill, fn) { return { skill: skill, gen: fn }; }
  function M(q, correct, dis, why) {
    var o = [correct];
    dis.forEach(function (d) { if (o.indexOf(d) < 0 && o.length < 4) o.push(d); });
    return { kind: 'mcq', q: q, options: o, answer: 0, why: why };
  }
  function N(q, ans, tol, why, unit) { return { kind: 'num', q: q, answer: ans, tol: tol, display: T(String(ans)), why: why, unit: unit || '' }; }
  // number answer rounded to n s.f.
  function N3(q, x, why, unit) { var a = R.roundSf(x, 3); return { kind: 'num', q: q, answer: a, tol: sfTol(a, 3), display: T(String(a)), why: why, unit: unit || '' }; }
  // angle answer to 1 d.p. (degrees)
  function ND(q, x, why) { var a = R.roundDp(x, 1); return { kind: 'num', q: q, answer: a, tol: 0.051, display: T(String(a)), why: why, unit: '°' }; }
  function r3(x) { return R.roundSf(x, 3); }
  function r1(x) { return R.roundDp(x, 1); }

  // =====================================================================
  // FPM-TRI-01 Reading a sine model
  // =====================================================================
  var ARG = { 6: ['\\frac{\\pi t}{6}'], 4: ['\\frac{\\pi t}{4}'], 3: ['\\frac{\\pi t}{3}'] };
  // sin(pi t / den) as sign * sqrt(r) / 2
  var SINT = {
    6: [null, [1, 1], [1, 3], [1, 4], [1, 3], [1, 1], [1, 0], [-1, 1], [-1, 3], [-1, 4], [-1, 3], [-1, 1]],
    4: [null, [1, 2], [1, 4], [1, 2], [1, 0], [-1, 2], [-1, 4], [-1, 2]],
    3: [null, [1, 3], [1, 3], [1, 0], [-1, 3], [-1, 3]]
  };
  B['FPM-TRI-01'] = { title: 'Reading a sine model: values, biggest and smallest', items: [
    G('extreme-values', function () {
      var b = rint(2, 6), a = rint(b + 1, b + 6), k = pick([2, 3, 4, 6]), f = pick(['sin', 'cos']), big = pick([true, false]);
      var arg = '\\frac{\\pi t}{' + k + '}';
      var ans = big ? a + b : a - b;
      return N('The depth of water in a harbour is modelled by $D = ' + a + ' + ' + (b === 1 ? '' : b) + '\\' + f + '\\left(' + arg + '\\right)$ metres, where $t$ is in hours and the angle is in radians. Find the ' + (big ? 'greatest' : 'least') + ' value of $D$.',
        ans, 1e-9, 'The ' + f + ' term lies between $-1$ and $1$, so $D$ lies between $' + a + ' - ' + b + ' = ' + (a - b) + '$ and $' + a + ' + ' + b + ' = ' + (a + b) + '$. The ' + (big ? 'greatest' : 'least') + ' value is $' + ans + '$.', 'm');
    }),
    G('negative-coeff', function () {
      var b = rint(2, 6), a = rint(b + 1, b + 7), k = pick([3, 4, 6]), big = pick([true, false]);
      var ans = big ? a + b : a - b;
      return N('The temperature in a greenhouse is modelled by $H = ' + a + ' - ' + b + '\\sin\\left(\\frac{\\pi t}{' + k + '}\\right)$ degrees Celsius, with the angle in radians. Find the ' + (big ? 'greatest' : 'least') + ' value of $H$.',
        ans, 1e-9, 'The coefficient of sine is negative. ' + (big ? 'H is biggest when $\\sin = -1$, giving $' + a + ' + ' + b + ' = ' + ans + '$.' : 'H is smallest when $\\sin = 1$, giving $' + a + ' - ' + b + ' = ' + ans + '$.'), '°C');
    }),
    G('exact-value', function () {
      var den = pick([6, 4, 3]), t, v, tries = 0;
      do { t = rint(1, 2 * den - 1); v = SINT[den][t]; tries++; } while ((v[1] === 0 || v[1] === 1 || v[1] === 4) && tries < 40);
      var b = 2 * rint(1, 4), a = rint(1, 6), c = b / 2;
      var P = 'P = ' + a + ' + ' + b + '\\sin\\left(\\frac{\\pi t}{' + den + '}\\right)';
      var s = v[0] * c;
      var ok = lin(a, s, v[1]);
      var wrong1 = lin(a, -s, v[1]);
      var wrong2 = lin(a, v[0] * b, v[1]);
      var wrong3 = lin(a, -v[0] * b, v[1]);
      var ang = fr(t, den);
      return M('A population is modelled by $' + P + '$, where the angle is in radians. Find the exact value of $P$ when $t = ' + t + '$.',
        T(ok), [T(wrong1), T(wrong2), T(wrong3)],
        'At $t = ' + t + '$ the angle is $' + ang + '\\pi$ radians. $\\sin\\left(' + ang + '\\pi\\right) = ' + (v[0] < 0 ? '-' : '') + '\\frac{\\sqrt{' + v[1] + '}}{2}$ (use the related acute angle and the sign from the quadrant). So $P = ' + a + ' + ' + b + '\\times ' + (v[0] < 0 ? '\\left(-' : '') + '\\frac{\\sqrt{' + v[1] + '}}{2}' + (v[0] < 0 ? '\\right)' : '') + ' = ' + ok + '$.');
    }),
    G('range-of-model', function () {
      var b = rint(2, 5), a = rint(b + 1, b + 6), f = pick(['sin', 'cos']);
      var q = 'Which inequality gives the range of values of $y = ' + a + ' + ' + b + '\\' + f + ' x$ for all real $x$?';
      return M(q, T((a - b) + ' \\leqslant y \\leqslant ' + (a + b)),
        [T((a - 1) + ' \\leqslant y \\leqslant ' + (a + 1)), T('-' + b + ' \\leqslant y \\leqslant ' + b), T(a + ' \\leqslant y \\leqslant ' + (a + b))],
        'Since $-1 \\leqslant \\' + f + ' x \\leqslant 1$, multiplying by ' + b + ' gives $-' + b + ' \\leqslant ' + b + '\\' + f + ' x \\leqslant ' + b + '$. Adding ' + a + ' gives $' + (a - b) + ' \\leqslant y \\leqslant ' + (a + b) + '$.');
    }),
    G('axis-crossing', function () {
      var k = pick([1, 2, 3, 4]);
      var correct = T(k === 1 ? '\\frac{\\pi}{2}' : '\\frac{\\pi}{' + (2 * k) + '}');
      return M('The graph of $y = \\cos(' + (k === 1 ? '' : k) + 'x)$ is sketched for $x \\geqslant 0$, with $x$ in radians. At which value of $x$ does it first cross the $x$-axis?',
        correct,
        [T(k === 1 ? '\\pi' : '\\frac{\\pi}{' + k + '}'), T(k === 1 ? '0' : '\\frac{\\pi}{' + (4 * k) + '}'), T(k === 1 ? '2\\pi' : '\\frac{2\\pi}{' + k + '}')],
        '$\\cos u = 0$ first at $u = \\frac{\\pi}{2}$. Here $u = ' + (k === 1 ? '' : k) + 'x$, so $x = \\frac{\\pi}{2' + (k === 1 ? '' : '\\times ' + k) + '}$' + (k === 1 ? '' : ' $= \\frac{\\pi}{' + (2 * k) + '}$') + '.');
    }),
    G('range-check', function () {
      var b = 2 * rint(1, 4), a = rint(2, 7);
      var ans = lin(a, b / 2, 3);
      return M('A model is $P = ' + a + ' + ' + b + '\\sin\\left(\\frac{\\pi t}{6}\\right)$ for $0 \\leqslant t \\leqslant 2$, with the angle in radians. What is the greatest value of $P$ in this interval?',
        T(ans), [T('' + (a + b)), T(lin(a, b, 3)), T(a + ' + ' + (b / 2))],
        'Sine only reaches $1$ when $\\frac{\\pi t}{6} = \\frac{\\pi}{2}$, i.e. $t = 3$, which is outside the interval. On $0 \\leqslant t \\leqslant 2$ the sine is increasing, so the greatest value is at $t = 2$: $\\sin\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2}$, giving $P = ' + a + ' + ' + b + '\\times\\frac{\\sqrt{3}}{2} = ' + ans + '$.');
    }),
    mc('exact-value', 'What is the exact value of $\\sin\\frac{7\\pi}{6}$? (The angle is in radians.)',
      [T('-\\frac{1}{2}'), T('\\frac{1}{2}'), T('-\\frac{\\sqrt{3}}{2}'), T('\\frac{\\sqrt{3}}{2}')], 0,
      '$\\frac{7\\pi}{6} = \\pi + \\frac{\\pi}{6}$, and $\\sin(\\pi + \\alpha) = -\\sin\\alpha$. So $\\sin\\frac{7\\pi}{6} = -\\sin\\frac{\\pi}{6} = -\\frac{1}{2}$.'),
    mc('range-of-model', 'Which of these equations has no solution for real $x$?',
      [T('\\sin x = 1.2'), T('\\cos x = -1'), T('\\sin x = -0.9'), T('\\cos x = 0.7')], 0,
      'Sine and cosine always lie between $-1$ and $1$, so $\\sin x = 1.2$ is impossible. The other three values are all inside $[-1, 1]$.'),
    nu('exact-value', 'The graph of $y = 5 - 2\\cos x$ ($x$ in radians) is sketched. At what value of $y$ does it cross the $y$-axis?', 3, 1e-9, T('3'),
      'On the $y$-axis $x = 0$, and $\\cos 0 = 1$, so $y = 5 - 2\\times 1 = 3$.'),
    mc('extreme-values', 'The graph of $y = 2 + 3\\sin x$ ($x$ in radians) is drawn for $0 \\leqslant x \\leqslant 2\\pi$. Which point is its maximum?',
      [T('\\left(\\frac{\\pi}{2}, 5\\right)'), T('\\left(\\frac{\\pi}{2}, 3\\right)'), T('\\left(\\pi, 5\\right)'), T('\\left(\\frac{3\\pi}{2}, 5\\right)')], 0,
      '$\\sin x$ is largest ($=1$) at $x = \\frac{\\pi}{2}$, so the maximum is $y = 2 + 3 = 5$ at $\\left(\\frac{\\pi}{2}, 5\\right)$.'),
    mc('axis-crossing', 'For $y = \\cos x$ ($x$ in radians), which statement about the graph is correct?',
      ['It crosses the $x$-axis at $x = \\frac{\\pi}{2}$ and has $y = 1$ when $x = 0$', 'It crosses the $x$-axis at $x = \\pi$ and has $y = 1$ when $x = 0$', 'It crosses the $x$-axis at $x = \\frac{\\pi}{2}$ and passes through the origin', 'It crosses the $x$-axis at $x = 0$ and has $y = 1$ when $x = \\frac{\\pi}{2}$'], 0,
      'Cosine starts at its maximum $\\cos 0 = 1$ and first reaches $0$ at $x = \\frac{\\pi}{2}$, so the graph does not pass through the origin.')
  ] };

  // =====================================================================
  // FPM-TRI-02 Getting one exact trig ratio from another
  // =====================================================================
  B['FPM-TRI-02'] = { title: 'Getting one exact trig ratio from another', items: [
    G('find-other-ratio', function () {
      var q = rint(3, 9), p = rint(1, q - 1), D = q * q - p * p, s = sqS(D);
      var root = s[1] === 1 ? fr(s[0], q) : sfr(1, D, q, false);
      var corr = '-' + root, pos = root;
      if (s[1] === 1) { corr = fr(-s[0], q); pos = fr(s[0], q); }
      return M('Angle $\\beta$ is obtuse and $\\sin\\beta = ' + fr(p, q) + '$. Find the exact value of $\\cos\\beta$.',
        T(corr), [T(pos), T(fr(-D, q * q)), T(sfr(1, q * q + p * p, q, true))],
        '$\\cos^2\\beta = 1 - \\frac{' + p * p + '}{' + q * q + '} = \\frac{' + D + '}{' + q * q + '}$, so $\\cos\\beta = \\pm\\' + (s[1] === 1 ? 'frac{' + s[0] + '}{' + q + '}' : 'frac{' + surd(s[0], s[1]) + '}{' + q + '}') + '$. An obtuse angle has a negative cosine, so $\\cos\\beta = ' + corr + '$.');
    }),
    G('tan-from-ratio', function () {
      var b = rint(3, 9), a = rint(1, b - 1), D = b * b - a * a;
      var corr = sfr(1, D, a, false);
      return M('Angle $\\theta$ is acute and $\\cos\\theta = ' + fr(a, b) + '$. Find the exact value of $\\tan\\theta$.',
        T(corr), [T(sfr(1, D, b, false)), T('\\frac{' + a + '}{\\sqrt{' + D + '}}'), T(sfr(1, D, a, true))],
        '$\\sin^2\\theta = 1 - \\frac{' + a * a + '}{' + b * b + '} = \\frac{' + D + '}{' + b * b + '}$, so $\\sin\\theta = ' + sfr(1, D, b, false) + '$ (positive, acute). Then $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = ' + corr + '$.');
    }),
    G('sign', function () {
      var pr = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [7, 24, 25], [24, 7, 25]]);
      var s = pr[0] / pr[2], c = -pr[1] / pr[2];
      var sd = R.roundDp(s, 3), cd = R.roundDp(c, 3);
      var q = 'Angle $\\beta$ is obtuse and $\\sin\\beta = ' + fr(pr[0], pr[2]) + '$. Find $\\cos\\beta$ as a decimal, to 3 decimal places.';
      return { kind: 'num', q: q, answer: cd, tol: 0.0006, display: T(String(cd)), unit: '',
        why: '$\\cos^2\\beta = 1 - \\left(' + fr(pr[0], pr[2]) + '\\right)^2 = \\frac{' + pr[1] * pr[1] + '}{' + pr[2] * pr[2] + '}$, so $|\\cos\\beta| = ' + fr(pr[1], pr[2]) + '$. Because $\\beta$ is obtuse the cosine is negative: $\\cos\\beta = ' + cd + '$.' };
    }),
    G('via-cosine-rule', function () {
      var a, b, c, n, d, tries = 0;
      do { a = rint(3, 9); b = rint(3, 9); c = rint(3, 9); tries++; } while ((a + b <= c || a + c <= b || b + c <= a || a === b || b === c || a === c || (b * b + c * c - a * a) === 0) && tries < 200);
      n = b * b + c * c - a * a; d = 2 * b * c;
      var g = gcd(n, d), nn = n / g, dd = d / g, D = dd * dd - nn * nn;
      var corr = D > 0 && sqS(D)[1] === 1 ? fr(sqS(D)[0], dd) : sfr(1, D, dd, false);
      return M('In triangle $ABC$, $BC = ' + a + '$ cm, $AC = ' + b + '$ cm and $AB = ' + c + '$ cm. Find the exact value of $\\sin A$.',
        T(corr), [T(fr(nn, dd)), T(sfr(1, dd * dd + nn * nn, dd, false)), T(fr(-D, dd * dd))],
        'Cosine rule: $\\cos A = \\frac{' + b + '^2 + ' + c + '^2 - ' + a + '^2}{2 \\times ' + b + ' \\times ' + c + '} = ' + fr(nn, dd) + '$. Then $\\sin^2 A = 1 - \\left(' + fr(nn, dd) + '\\right)^2 = \\frac{' + D + '}{' + dd * dd + '}$. Angle $A$ is inside a triangle so $\\sin A \\gt 0$, giving $\\sin A = ' + corr + '$.');
    }),
    mc('sign', 'Angle $\\beta$ is obtuse. Which of these is true?',
      [T('\\sin\\beta \\gt 0,\\ \\cos\\beta \\lt 0,\\ \\tan\\beta \\lt 0'), T('\\sin\\beta \\gt 0,\\ \\cos\\beta \\gt 0,\\ \\tan\\beta \\gt 0'), T('\\sin\\beta \\lt 0,\\ \\cos\\beta \\lt 0,\\ \\tan\\beta \\gt 0'), T('\\sin\\beta \\gt 0,\\ \\cos\\beta \\lt 0,\\ \\tan\\beta \\gt 0')], 0,
      'For an angle between $90^\\circ$ and $180^\\circ$ the sine is positive, the cosine is negative, and so $\\tan = \\frac{\\sin}{\\cos}$ is negative.'),
    mc('spot-error', '$\\sin\\beta = \\frac{1}{3}$ and $\\beta$ is obtuse. A student writes: Line 1: $\\cos^2\\beta = 1 - \\frac{1}{9} = \\frac{8}{9}$. Line 2: $\\cos\\beta = \\frac{2\\sqrt{2}}{3}$. Line 3: $\\tan\\beta = \\frac{1}{2\\sqrt{2}}$. Which line first goes wrong?',
      ['Line 2: the sign of $\\cos\\beta$ should be negative', 'Line 1: $1 - \\frac{1}{9}$ is not $\\frac{8}{9}$', 'Line 2: $\\sqrt{\\frac{8}{9}}$ is not $\\frac{2\\sqrt{2}}{3}$', 'Line 3: $\\tan\\beta$ should be $\\sin\\beta \\times \\cos\\beta$'], 0,
      'Line 1 is correct, and $\\sqrt{\\frac{8}{9}} = \\frac{2\\sqrt{2}}{3}$. But $\\beta$ is obtuse, so $\\cos\\beta = -\\frac{2\\sqrt{2}}{3}$. Line 2 is the first error (and it makes the tangent in line 3 positive when it should be negative).'),
    mc('tan-from-ratio', 'Angle $\\theta$ has $\\sin\\theta = \\frac{3}{5}$ and $\\cos\\theta = -\\frac{4}{5}$. What is $\\tan\\theta$?',
      [T('-\\frac{3}{4}'), T('\\frac{3}{4}'), T('-\\frac{4}{3}'), T('\\frac{4}{3}')], 0,
      '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{3/5}{-4/5} = -\\frac{3}{4}$.'),
    nu('find-other-ratio', 'Angle $\\theta$ is acute and $\\cos\\theta = 0.6$. Find $\\sin\\theta$.', 0.8, 0.001, T('0.8'),
      '$\\sin^2\\theta = 1 - 0.6^2 = 1 - 0.36 = 0.64$, so $\\sin\\theta = 0.8$ (positive because $\\theta$ is acute).'),
    nu('sign', 'Angle $\\beta$ is obtuse and $\\sin\\beta = 0.28$. Find $\\cos\\beta$.', -0.96, 0.001, T('-0.96'),
      '$\\cos^2\\beta = 1 - 0.28^2 = 0.9216$, so $|\\cos\\beta| = 0.96$. An obtuse angle has a negative cosine, so $\\cos\\beta = -0.96$.'),
    G('tan-from-ratio', function () {
      var q = rint(3, 8), p = rint(1, q - 1), D = q * q - p * p;
      var corr = sfr(1, D, p, true);
      return M('Angle $\\beta$ is obtuse and $\\sin\\beta = ' + fr(p, q) + '$. Find the exact value of $\\tan\\beta$.',
        T(corr), [T(sfr(1, D, p, false)), T(sfr(1, D, q, true)), T('-\\frac{' + p + '}{\\sqrt{' + D + '}}')],
        '$\\cos\\beta = -' + sfr(1, D, q, false) + '$ (obtuse, so negative). Then $\\tan\\beta = \\frac{\\sin\\beta}{\\cos\\beta} = \\frac{' + p + '/' + q + '}{-\\sqrt{' + D + '}/' + q + '} = ' + corr + '$.');
    })
  ] };

  // =====================================================================
  // FPM-TRI-03 Arc length, sector area and perimeter
  // =====================================================================
  var THS = [0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2, 2.5, 3];
  B['FPM-TRI-03'] = { title: 'Arc length, sector area and perimeter', items: [
    G('arc', function () {
      var r = rint(3, 15), th = pick(THS), s = R.roundDp(r * th, 4);
      return N('A sector of a circle has radius $' + r + '$ cm and angle $' + th + '$ radians. Find the arc length.', s, 0.005,
        '$s = r\\theta = ' + r + ' \\times ' + th + ' = ' + s + '$ cm.', 'cm');
    }),
    G('area', function () {
      var r = rint(2, 12), th = pick(THS), A = R.roundDp(0.5 * r * r * th, 4);
      return N('A sector of a circle has radius $' + r + '$ cm and angle $' + th + '$ radians. Find the area of the sector.', A, 0.005,
        '$A = \\frac{1}{2}r^2\\theta = \\frac{1}{2} \\times ' + r + '^2 \\times ' + th + ' = ' + A + '$ cm$^2$.', 'cm²');
    }),
    G('perimeter', function () {
      var r = rint(3, 12), th = pick(THS), P = R.roundDp(2 * r + r * th, 4);
      return N('A sector of a circle has radius $' + r + '$ cm and angle $' + th + '$ radians. Find the perimeter of the sector.', P, 0.005,
        'Arc length $= r\\theta = ' + R.roundDp(r * th, 4) + '$ cm. Perimeter $= 2r + r\\theta = ' + 2 * r + ' + ' + R.roundDp(r * th, 4) + ' = ' + P + '$ cm.', 'cm');
    }),
    G('convert', function () {
      var deg = pick([30, 45, 60, 90, 120, 135, 150, 210, 240, 300]);
      var corr = fr(deg, 180) + '\\pi';
      var other = [fr(deg, 360) + '\\pi', fr(180, deg) + '\\pi', fr(deg * 2, 180) + '\\pi'];
      if (deg === 90) other = ['\\frac{\\pi}{4}', '2\\pi', '\\frac{3\\pi}{4}'];
      if (deg === 300) other = ['\\frac{5\\pi}{6}', '\\frac{3\\pi}{5}', '\\frac{5\\pi}{3}'];
      if (deg === 300) corr = '\\frac{5\\pi}{3}', other = ['\\frac{5\\pi}{6}', '\\frac{3\\pi}{5}', '\\frac{5\\pi}{12}'];
      return M('Convert $' + deg + '^\\circ$ to radians, giving an exact answer.', T(corr), other.map(T),
        'Multiply by $\\frac{\\pi}{180}$: $' + deg + ' \\times \\frac{\\pi}{180} = ' + corr + '$.');
    }),
    G('degrees-trap', function () {
      var deg = pick([60, 90, 120, 150, 45]), r = rint(4, 15);
      var th = deg * Math.PI / 180, s = R.roundSf(r * th, 3);
      return N3('A sector has radius $' + r + '$ cm and angle $' + deg + '^\\circ$. Find the arc length, correct to 3 significant figures.', r * th,
        'Convert first: $' + deg + '^\\circ = ' + fr(deg, 180) + '\\pi$ radians. Then $s = r\\theta = ' + r + ' \\times ' + fr(deg, 180) + '\\pi = ' + s + '$ cm. Using $' + deg + '$ directly in $s = r\\theta$ would be wrong.', 'cm');
    }),
    G('find-unknown', function () {
      var r = rint(3, 14), th = pick([0.5, 1.5, 2, 2.5, 0.8, 1.2]), s = R.roundDp(r * th, 4);
      return N('A sector has arc length $' + s + '$ cm and angle $' + th + '$ radians. Find its radius.', r, 1e-6,
        '$s = r\\theta$, so $r = \\frac{s}{\\theta} = \\frac{' + s + '}{' + th + '} = ' + r + '$ cm.', 'cm');
    }),
    G('find-unknown', function () {
      var r = rint(3, 12), th = pick([0.5, 1.5, 2, 0.8, 1.2, 2.5]), A = R.roundDp(0.5 * r * r * th, 4);
      return N('A sector has area $' + A + '$ cm$^2$ and angle $' + th + '$ radians. Find its radius.', r, 1e-6,
        '$A = \\frac{1}{2}r^2\\theta$, so $r^2 = \\frac{2A}{\\theta} = \\frac{2 \\times ' + A + '}{' + th + '} = ' + r * r + '$, giving $r = ' + r + '$ cm.', 'cm');
    }),
    G('find-unknown', function () {
      var r = rint(4, 12), th = pick([0.5, 0.75, 1.5, 2, 2.5, 1.25]), s = R.roundDp(r * th, 4);
      return N('A sector of radius $' + r + '$ cm has arc length $' + s + '$ cm. Find the angle of the sector in radians.', th, 1e-6,
        '$s = r\\theta$, so $\\theta = \\frac{s}{r} = \\frac{' + s + '}{' + r + '} = ' + th + '$ radians.', 'rad');
    }),
    G('perimeter', function () {
      var r = rint(4, 12), th = pick([0.5, 1.5, 2, 2.5, 1.2]), P = R.roundDp(2 * r + r * th, 4);
      return N('A sector has radius $' + r + '$ cm and perimeter $' + P + '$ cm. Find the angle of the sector in radians.', th, 1e-6,
        'Perimeter $= 2r + r\\theta$, so $r\\theta = ' + P + ' - ' + 2 * r + ' = ' + R.roundDp(r * th, 4) + '$. Then $\\theta = \\frac{' + R.roundDp(r * th, 4) + '}{' + r + '} = ' + th + '$ radians.', 'rad');
    }),
    mc('trap', 'Which is the correct formula for the area of a sector with radius $r$ and angle $\\theta$ in radians?',
      [T('A = \\frac{1}{2}r^2\\theta'), T('A = r^2\\theta'), T('A = \\frac{1}{2}r\\theta'), T('A = \\frac{1}{2}r\\theta^2')], 0,
      'A sector is the fraction $\\frac{\\theta}{2\\pi}$ of the circle $\\pi r^2$, which simplifies to $\\frac{1}{2}r^2\\theta$.'),
    mc('trap', 'A sector has radius $5$ cm and arc length $8$ cm. Which gives its perimeter?',
      [T('8 + 10 = 18\\text{ cm}'), T('8\\text{ cm}'), T('8 + 5 = 13\\text{ cm}'), T('8 \\times 10 = 80\\text{ cm}')], 0,
      'The boundary of a sector is the arc plus two straight radii: $8 + 5 + 5 = 18$ cm.'),
    mc('trap', 'Which of these could be the angle of a sector (in radians)?',
      [T('\\theta = 5.8'), T('\\theta = 6.5'), T('\\theta = 7'), T('\\theta = 360')], 0,
      'A full circle is $2\\pi \\approx 6.28$ radians, so a sector angle must be less than $6.28$. Only $5.8$ qualifies.')
  ] };

  // =====================================================================
  // FPM-TRI-04 Sector problems with an unknown radius or angle
  // =====================================================================
  B['FPM-TRI-04'] = { title: 'Sector problems with an unknown radius or angle', items: [
    G('area-and-arc', function () {
      var r = rint(3, 14), th = pick([0.5, 1.5, 2, 2.5, 1.2, 0.8]), s = R.roundDp(r * th, 4), A = R.roundDp(0.5 * r * r * th, 4);
      return N('A sector has arc length $' + s + '$ cm and area $' + A + '$ cm$^2$. Find the radius of the sector.', r, 1e-6,
        'Divide area by arc length: $\\frac{A}{s} = \\frac{\\frac{1}{2}r^2\\theta}{r\\theta} = \\frac{r}{2}$. So $r = 2 \\times \\frac{' + A + '}{' + s + '} = ' + r + '$ cm.', 'cm');
    }),
    G('area-and-arc', function () {
      var r = rint(3, 14), th = pick([0.5, 1.5, 2, 2.5, 1.2, 0.8]), s = R.roundDp(r * th, 4), A = R.roundDp(0.5 * r * r * th, 4);
      return N('A sector has arc length $' + s + '$ cm and area $' + A + '$ cm$^2$. Find the angle of the sector in radians.', th, 1e-6,
        '$\\frac{A}{s} = \\frac{r}{2}$ gives $r = 2 \\times \\frac{' + A + '}{' + s + '} = ' + r + '$ cm. Then $\\theta = \\frac{s}{r} = \\frac{' + s + '}{' + r + '} = ' + th + '$ radians.', 'rad');
    }),
    G('reject-root', function () {
      var r1, r2, P, A, t1, t2, tries = 0;
      do {
        r1 = rint(1, 3); r2 = rint(5, 14); P = 2 * (r1 + r2); A = r1 * r2;
        t1 = P / r1 - 2; t2 = P / r2 - 2; tries++;
      } while (!(t1 > 2 * Math.PI && t2 < 2 * Math.PI && t2 > 0) && tries < 300);
      return N('A sector of a circle has perimeter $' + P + '$ cm and area $' + A + '$ cm$^2$. Its angle $\\theta$ is less than $2\\pi$ radians. Find the radius.', r2, 1e-6,
        'Perimeter: $r\\theta = ' + P + ' - 2r$. Area: $' + A + ' = \\frac{1}{2}r(' + P + ' - 2r)$, so $2r^2 - ' + P + 'r + ' + 2 * A + ' = 0$, i.e. $(r - ' + r1 + ')(r - ' + r2 + ') = 0$ after dividing by 2. If $r = ' + r1 + '$ then $\\theta = \\frac{' + (P - 2 * r1) + '}{' + r1 + '} = ' + t1 + ' \\gt 2\\pi$, which is not allowed. So $r = ' + r2 + '$ cm.', 'cm');
    }),
    G('cone', function () {
      var tr = pick([[5, 3, 4], [13, 5, 12], [17, 8, 15], [10, 6, 8], [25, 7, 24], [26, 10, 24]]);
      var Rr = tr[0], r = tr[1], h = tr[2];
      var th = fr(2 * r, Rr) + '\\pi';
      return N('A sector of a circle of radius $' + Rr + '$ cm and angle $' + th + '$ radians is bent round, with its straight edges joined, to form a hollow cone. Find the vertical height of the cone.', h, 1e-6,
        'The arc of the sector becomes the base circumference: $' + Rr + ' \\times ' + th + ' = 2\\pi r$, so $r = ' + r + '$ cm. The sector radius is the slant height $' + Rr + '$, so $h = \\sqrt{' + Rr + '^2 - ' + r + '^2} = ' + h + '$ cm.', 'cm');
    }),
    G('cone', function () {
      var Rr = pick([12, 24, 36]), o = pick([[1, 1, 2], [2, 3, 3], [3, 2, 4], [1, 2, 4]]);
      var p = o[0], q = o[1], r = Rr * p / (2 * q);
      if (o[2] === 4) { r = Rr * p / (2 * q); }
      var th = fr(p, q) + '\\pi';
      return N('A sector of radius $' + Rr + '$ cm and angle $' + th + '$ radians is rolled into a cone. Find the radius of the base of the cone.', r, 1e-6,
        'Arc length $= ' + Rr + ' \\times ' + th + '$ equals the base circumference $2\\pi r$. So $r = \\frac{' + Rr + ' \\times ' + fr(p, q) + '}{2} = ' + r + '$ cm.', 'cm');
    }),
    G('eliminate', function () {
      var r, th, P, A;
      do { r = rint(4, 12); th = pick([1, 1.5, 2, 0.5, 2.5]); P = R.roundDp(2 * r + r * th, 4); A = R.roundDp(0.5 * r * r * th, 4); } while (P === A);
      return M('A sector has perimeter $' + P + '$ cm and area $' + A + '$ cm$^2$. Which equation, in $r$ only, comes from eliminating $\\theta$?',
        T(A + ' = \\frac{1}{2}r(' + P + ' - 2r)'),
        [T(A + ' = \\frac{1}{2}r(' + P + ' - r)'), T(A + ' = \\frac{1}{2}r^2(' + P + ' - 2r)'), T(A + ' = r(' + P + ' - 2r)')],
        'The perimeter gives $r\\theta = P - 2r$. The area is $A = \\frac{1}{2}r(r\\theta)$, so $A = \\frac{1}{2}r(P - 2r)$.');
    }),
    mc('reject-root', 'Solving a sector problem gives two possible radii. For one of them the angle works out as $\\theta = 8.4$ radians. What should you do with that radius?',
      ['Reject it, because a sector angle must be less than $2\\pi \\approx 6.28$', 'Keep it, because any positive angle is allowed', 'Keep it and halve the angle', 'Reject it, because the angle is not a whole number'], 0,
      'A sector is part of one circle, so its angle must be less than $2\\pi \\approx 6.28$ radians. $8.4$ is too big, so that root is rejected.'),
    mc('spot-error', 'A sector has perimeter $20$ cm and radius $6$ cm. A student finds the angle as $\\theta = \\frac{20}{6}$ radians. What is the mistake?',
      ['They used the perimeter as the arc length; the arc is $20 - 12 = 8$ cm', 'They should have divided by $r^2$', 'They forgot the $\\frac{1}{2}$ in the area formula', 'Nothing: the angle is correct'], 0,
      'The perimeter includes the two radii. The arc is $20 - 2\\times 6 = 8$ cm, so $\\theta = \\frac{8}{6} = \\frac{4}{3}$ radians.'),
    G('cone', function () {
      var tr = pick([[5, 3, 4], [13, 5, 12], [17, 8, 15], [10, 6, 8]]);
      var Rr = tr[0], r = tr[1], h = tr[2];
      return M('A cone has base radius $' + r + '$ cm and vertical height $' + h + '$ cm. It is made by rolling up a sector. What is the radius of the sector?',
        T('' + Rr + '\\text{ cm}'), [T('' + r + '\\text{ cm}'), T('' + h + '\\text{ cm}'), T('' + (r + h) + '\\text{ cm}')],
        'The radius of the sector becomes the slant height of the cone: $\\sqrt{' + r + '^2 + ' + h + '^2} = ' + Rr + '$ cm.');
    }),
    G('area-and-arc', function () {
      var r = rint(4, 10), th = pick([0.5, 1.5, 2, 2.5]), s = R.roundDp(r * th, 4), A = R.roundDp(0.5 * r * r * th, 4);
      return M('A sector has area $' + A + '$ cm$^2$ and arc length $' + s + '$ cm. Which expression gives its radius?',
        T('r = \\frac{2 \\times ' + A + '}{' + s + '}'), [T('r = \\frac{' + A + '}{' + s + '}'), T('r = \\frac{' + s + '}{2 \\times ' + A + '}'), T('r = \\sqrt{\\frac{2 \\times ' + A + '}{' + s + '}}')],
        '$\\frac{A}{s} = \\frac{r}{2}$, so $r = \\frac{2A}{s}$.');
    })
  ] };

  // =====================================================================
  // FPM-TRI-05 Areas and perimeters of shapes made from sectors and triangles
  // =====================================================================
  B['FPM-TRI-05'] = { title: 'Areas and perimeters of shapes made from sectors and triangles', items: [
    G('segment', function () {
      var r = rint(4, 12), th = pick([1, 1.2, 1.5, 2, 2.5]);
      var A = 0.5 * r * r * (th - Math.sin(th));
      return N3('A chord $AB$ of a circle, centre $O$ and radius $' + r + '$ cm, makes $\\angle AOB = ' + th + '$ radians. Find the area of the minor segment cut off by the chord, to 3 significant figures.', A,
        'Segment = sector $-$ triangle $= \\frac{1}{2}r^2(\\theta - \\sin\\theta) = \\frac{1}{2} \\times ' + r + '^2 \\times (' + th + ' - \\sin ' + th + ') = ' + r3(A) + '$ cm$^2$ (calculator in radian mode).', 'cm²');
    }),
    G('segment', function () {
      var r = pick([6, 12, 18]), a1 = r * r / 6, a2 = r * r / 4;
      var corr = a1 + '\\pi - ' + a2 + '\\sqrt{3}';
      return M('A chord $AB$ of a circle with centre $O$ and radius $' + r + '$ cm makes $\\angle AOB = \\frac{\\pi}{3}$. Find the exact area of the segment cut off by the chord.', T(corr),
        [T(a1 + '\\pi + ' + a2 + '\\sqrt{3}'), T(2 * a1 + '\\pi - ' + a2 + '\\sqrt{3}'), T(a1 + '\\pi - ' + 2 * a2 + '\\sqrt{3}')],
        'Sector: $\\frac{1}{2} \\times ' + r + '^2 \\times \\frac{\\pi}{3} = ' + a1 + '\\pi$. Triangle: $\\frac{1}{2} \\times ' + r + '^2 \\times \\sin\\frac{\\pi}{3} = ' + a2 + '\\sqrt{3}$. Segment $= ' + corr + '$.');
    }),
    G('lens', function () {
      var r = pick([6, 12, 18]), a1 = 2 * r * r / 3, a2 = r * r / 2;
      var corr = a1 + '\\pi - ' + a2 + '\\sqrt{3}';
      return M('Two circles, each of radius $' + r + '$ cm, overlap so that each passes through the centre of the other. The shaded region is the overlap (a lens). Each circle contributes a segment with angle $\\frac{2\\pi}{3}$ at its centre. Find the exact area of the shaded region.', T(corr),
        [T(a1 / 2 + '\\pi - ' + a2 / 2 + '\\sqrt{3}'), T(a1 + '\\pi + ' + a2 + '\\sqrt{3}'), T(a1 + '\\pi - ' + a2 * 2 + '\\sqrt{3}')],
        'One segment: $\\frac{1}{2}r^2(\\theta - \\sin\\theta) = \\frac{' + r * r + '}{2}\\left(\\frac{2\\pi}{3} - \\frac{\\sqrt{3}}{2}\\right) = ' + a1 / 2 + '\\pi - ' + a2 / 2 + '\\sqrt{3}$. The lens is two such segments, so double it: $' + corr + '$.');
    }),
    G('chord', function () {
      var r = rint(4, 12), th = pick([1, 1.2, 1.5, 2, 2.5]);
      var c = 2 * r * Math.sin(th / 2);
      return N3('A sector $OAB$ has radius $' + r + '$ cm and angle $' + th + '$ radians. Find the length of the chord $AB$, to 3 significant figures.', c,
        'Cosine rule in triangle $OAB$: $AB^2 = ' + r + '^2 + ' + r + '^2 - 2 \\times ' + r + '^2\\cos ' + th + ' = ' + R.roundSf(2 * r * r * (1 - Math.cos(th)), 5) + '$, so $AB = ' + r3(c) + '$ cm (radian mode).', 'cm');
    }),
    G('perimeter', function () {
      var r = rint(4, 12), th = pick([1, 1.2, 1.5, 2, 2.5]);
      var P = r * th + 2 * r * Math.sin(th / 2);
      return N3('A circle has centre $O$ and radius $' + r + '$ cm. A chord $AB$ makes $\\angle AOB = ' + th + '$ radians. Find the perimeter of the minor segment, to 3 significant figures.', P,
        'Perimeter = arc + chord. Arc $= r\\theta = ' + R.roundSf(r * th, 5) + '$ cm. Chord $= 2r\\sin\\frac{\\theta}{2} = ' + R.roundSf(2 * r * Math.sin(th / 2), 5) + '$ cm. Total $= ' + r3(P) + '$ cm.', 'cm');
    }),
    G('combine', function () {
      var r = rint(3, 15);
      var P = Math.PI * r;
      return N3('An equilateral triangle $ABC$ has sides of length $' + r + '$ cm. Three arcs are drawn, each with its centre at one vertex and joining the other two vertices. Find the perimeter of the curved shape formed by the three arcs, to 3 significant figures.', P,
        'Each arc has radius $' + r + '$ and angle $\\frac{\\pi}{3}$ (the angle of an equilateral triangle), so its length is $' + r + ' \\times \\frac{\\pi}{3}$. Three arcs give $' + r + '\\pi = ' + r3(P) + '$ cm.', 'cm');
    }),
    mc('trap-mode', 'A student needs $\\sin 1.2$ where $1.2$ is an angle in radians. Which calculator value is correct?',
      ['$0.932$', '$0.0209$', '$0.362$', '$0.998$'], 0,
      'The angle is in radians, so the calculator must be in radian mode: $\\sin 1.2 = 0.932$. In degree mode it would give $\\sin 1.2^\\circ = 0.0209$.'),
    mc('combine', 'A segment is the region between a chord and an arc. Which expression gives the area of the segment cut off by chord $AB$ (centre $O$, radius $r$, $\\angle AOB = \\theta$ radians)?',
      [T('\\frac{1}{2}r^2\\theta - \\frac{1}{2}r^2\\sin\\theta'), T('\\frac{1}{2}r^2\\theta + \\frac{1}{2}r^2\\sin\\theta'), T('\\frac{1}{2}r^2\\sin\\theta - \\frac{1}{2}r^2\\theta'), T('\\frac{1}{2}r\\theta - \\frac{1}{2}r\\sin\\theta')], 0,
      'The segment is the sector $OAB$ with the triangle $OAB$ removed: sector $\\frac{1}{2}r^2\\theta$ minus triangle $\\frac{1}{2}r^2\\sin\\theta$.'),
    mc('perimeter', 'A sector has radius $6$ cm and angle $\\frac{\\pi}{3}$ radians. What is its exact perimeter?',
      [T('12 + 2\\pi'), T('2\\pi'), T('6 + 2\\pi'), T('12 + 6\\pi')], 0,
      'Arc $= 6 \\times \\frac{\\pi}{3} = 2\\pi$. Add the two radii: $2\\pi + 6 + 6 = 12 + 2\\pi$ cm.'),
    mc('combine', 'The region between two overlapping circles of the same size is made of two identical segments. A student works out the area of one segment and gives that as the area of the region. What is the error?',
      ['The region contains two segments, so the area should be doubled', 'The segment should have been added to the triangle', 'The sector area should have been used on its own', 'There is no error'], 0,
      'Count each piece the right number of times: the overlap is two segments, so its area is twice one segment.')
  ] };

  // =====================================================================
  // FPM-TRI-06 Regions made by tangents and a sector
  // =====================================================================
  var TANT = [
    { n: '\\frac{\\pi}{4}', v: Math.PI / 4, t: 1, tt: '1' },
    { n: '\\frac{\\pi}{3}', v: Math.PI / 3, t: Math.sqrt(3), tt: '\\sqrt{3}' },
    { n: '\\frac{\\pi}{6}', v: Math.PI / 6, t: 1 / Math.sqrt(3), tt: '\\frac{1}{\\sqrt{3}}' }
  ];
  B['FPM-TRI-06'] = { title: 'Regions made by tangents and a sector', items: [
    G('tangent-length', function () {
      var o = pick(TANT), r = rint(3, 15);
      return N3('Circle with centre $O$ and radius $' + r + '$ cm. $B$ is on the circle and $BC$ is a tangent at $B$. Point $C$ is such that $\\angle BOC = ' + o.n + '$ radians. Find the length of $BC$, to 3 significant figures.', r * o.t,
        'The tangent is perpendicular to the radius, so $\\angle OBC = 90^\\circ$. In the right-angled triangle $OBC$, $BC = OB\\tan\\theta = ' + r + '\\tan ' + o.n + ' = ' + r3(r * o.t) + '$ cm.', 'cm');
    }),
    G('shaded-area', function () {
      var o = pick(TANT), r = rint(3, 12);
      var A = 0.5 * r * r * (o.t - o.v);
      return N3('Circle with centre $O$ and radius $' + r + '$ cm. $OB$ is a radius and $BC$ the tangent at $B$, with $\\angle BOC = ' + o.n + '$ radians. $OC$ cuts the circle at $D$. Find the area of the region bounded by $BC$, $CD$ and the arc $BD$, to 3 significant figures.', A,
        'Triangle $OBC$: $\\frac{1}{2} \\times ' + r + ' \\times ' + r + '\\tan ' + o.n + ' = ' + r3(0.5 * r * r * o.t) + '$. Sector $OBD$: $\\frac{1}{2} \\times ' + r + '^2 \\times ' + o.n + ' = ' + r3(0.5 * r * r * o.v) + '$. Shaded $=$ triangle $-$ sector $= ' + r3(A) + '$ cm$^2$.', 'cm²');
    }),
    G('shaded-area', function () {
      var r = pick([4, 8, 12]);
      var a = r * r / 2, b = r * r / 8;
      var corr = a + ' - ' + b + '\\pi';
      return M('Circle with centre $O$ and radius $' + r + '$ cm. $BC$ is the tangent at $B$ and $\\angle BOC = \\frac{\\pi}{4}$. Find the exact area bounded by $BC$, $CD$ and arc $BD$, where $D$ is where $OC$ meets the circle.', T(corr),
        [T(a + ' + ' + b + '\\pi'), T(2 * a + ' - ' + b + '\\pi'), T(a + ' - ' + 2 * b + '\\pi')],
        'Triangle $OBC$ has $BC = ' + r + '\\tan\\frac{\\pi}{4} = ' + r + '$, so its area is $\\frac{1}{2} \\times ' + r + ' \\times ' + r + ' = ' + a + '$. Sector: $\\frac{1}{2} \\times ' + r + '^2 \\times \\frac{\\pi}{4} = ' + b + '\\pi$. Shaded $= ' + corr + '$.');
    }),
    G('kite', function () {
      var r = rint(3, 12);
      var A = r * r * Math.sqrt(3) - r * r * Math.PI / 3;
      return N3('Two tangents from a point $T$ touch a circle of centre $O$ and radius $' + r + '$ cm at $A$ and $B$, where $\\angle AOB = \\frac{2\\pi}{3}$ radians. Find the area enclosed by $TA$, $TB$ and the minor arc $AB$, to 3 significant figures.', A,
        'Each half-angle at $O$ is $\\frac{\\pi}{3}$, so $TA = ' + r + '\\tan\\frac{\\pi}{3} = ' + r + '\\sqrt{3}$. Kite $OATB$ is two right triangles: $2 \\times \\frac{1}{2} \\times ' + r + ' \\times ' + r + '\\sqrt{3} = ' + r3(r * r * Math.sqrt(3)) + '$. Sector: $\\frac{1}{2} \\times ' + r + '^2 \\times \\frac{2\\pi}{3} = ' + r3(r * r * Math.PI / 3) + '$. Shaded $= ' + r3(A) + '$ cm$^2$.', 'cm²');
    }),
    G('kite', function () {
      var d = pick([100, 110, 120, 130, 140, 150, 80, 70, 60]);
      return N('Two tangents from a point $T$ touch a circle, centre $O$, at $A$ and $B$. Angle $AOB = ' + d + '^\\circ$. Find angle $ATB$ in degrees.', 180 - d, 1e-6,
        'The angles of the kite $OATB$ add up to $360^\\circ$. The angles at $A$ and $B$ are both $90^\\circ$ (tangent perpendicular to radius), so $\\angle ATB = 360 - 90 - 90 - ' + d + ' = ' + (180 - d) + '^\\circ$.', '°');
    }),
    G('find-r', function () {
      var r = rint(4, 12), o = TANT[0];
      var A = R.roundSf(0.5 * r * r * (1 - Math.PI / 4), 4);
      return N('Circle with centre $O$ and radius $r$ cm. $BC$ is the tangent at $B$ with $\\angle BOC = \\frac{\\pi}{4}$, and $D$ is where $OC$ meets the circle. The area bounded by $BC$, $CD$ and the arc $BD$ is $' + A + '$ cm$^2$. Find $r$, to the nearest whole number.', r, 0.5,
        'Area $= \\frac{1}{2}r^2\\tan\\frac{\\pi}{4} - \\frac{1}{2}r^2\\frac{\\pi}{4} = \\frac{1}{2}r^2\\left(1 - \\frac{\\pi}{4}\\right)$. So $r^2 = \\frac{2 \\times ' + A + '}{1 - \\pi/4} \\approx ' + R.roundSf(r * r, 3) + '$ and $r \\approx ' + r + '$ cm.', 'cm');
    }),
    mc('right-angle', 'A tangent to a circle touches it at $B$ and $O$ is the centre. What is the size of the angle between $OB$ and the tangent?',
      [T('90^\\circ'), T('60^\\circ'), T('45^\\circ'), T('180^\\circ')], 0,
      'A tangent is always perpendicular to the radius at the point of contact.'),
    mc('tangent-length', 'In a circle of radius $r$, $BC$ is a tangent at $B$ and $\\angle BOC = \\theta$ where $0 \\lt \\theta \\lt \\frac{\\pi}{2}$. Which expression gives $BC$?',
      [T('r\\tan\\theta'), T('r\\sin\\theta'), T('r\\cos\\theta'), T('\\frac{r}{\\tan\\theta}')], 0,
      'Triangle $OBC$ is right-angled at $B$. Opposite $\\theta$ is $BC$ and adjacent is $OB = r$, so $\\tan\\theta = \\frac{BC}{r}$ and $BC = r\\tan\\theta$.'),
    mc('shaded-area', 'A tangent triangle $OBC$ (right-angled at $B$) sits outside a sector $OBD$. The shaded region lies between $BC$, $CD$ and the arc $BD$. Which calculation gives its area?',
      ['area of triangle $OBC$ minus area of sector $OBD$', 'area of triangle $OBC$ plus area of sector $OBD$', 'area of sector $OBD$ minus area of triangle $OBC$', 'area of triangle $OBC$ only'], 0,
      'The shaded region is what is left of the triangle after the sector is cut out of it.'),
    mc('tangent-length', 'In a circle of radius $10$ cm, $BC$ is a tangent at $B$ and $\\angle BOC = \\frac{\\pi}{6}$. Compared with the radius, the tangent length $BC$ is',
      ['shorter than the radius, since $\\tan\\frac{\\pi}{6} \\lt 1$', 'equal to the radius', 'longer than the radius, since $\\tan\\frac{\\pi}{6} \\gt 1$', 'impossible to compare'], 0,
      '$BC = 10\\tan\\frac{\\pi}{6} = \\frac{10}{\\sqrt{3}} \\approx 5.77$ cm, which is shorter than the radius. The tangent length equals the radius only when $\\theta = \\frac{\\pi}{4}$.')
  ] };

  // =====================================================================
  // FPM-TRI-07 Cosine rule
  // =====================================================================
  var ANG = [40, 50, 55, 65, 70, 110, 125];
  var TRI60 = [[3, 5, 7], [5, 3, 7], [7, 8, 13], [8, 7, 13], [5, 16, 19], [16, 5, 19]];
  B['FPM-TRI-07'] = { title: 'Using the cosine rule, including when it gives a quadratic', items: [
    G('find-side', function () {
      var b = rint(5, 15), c = rint(5, 15), A = pick(ANG);
      var a = Math.sqrt(b * b + c * c - 2 * b * c * cos(A));
      return N3('In triangle $ABC$, $AB = ' + c + '$ cm, $AC = ' + b + '$ cm and $\\angle BAC = ' + A + '^\\circ$. Find the length of $BC$, to 3 significant figures.', a,
        '$BC^2 = ' + b + '^2 + ' + c + '^2 - 2 \\times ' + b + ' \\times ' + c + ' \\times \\cos ' + A + '^\\circ = ' + R.roundSf(a * a, 5) + '$, so $BC = ' + r3(a) + '$ cm.', 'cm');
    }),
    G('find-side', function () {
      var A = pick([60, 120]), t, b, c, a;
      if (A === 60) { t = pick(TRI60); b = t[0]; c = t[0] + t[1]; a = t[2]; }
      else { t = pick([[3, 5, 7], [5, 3, 7], [5, 16, 19], [16, 5, 19], [7, 8, 13], [8, 7, 13]]); b = t[0]; c = t[1]; a = t[2]; }
      var val = b * b + c * c - 2 * b * c * (A === 60 ? 0.5 : -0.5);
      return N('In triangle $ABC$, $AB = ' + c + '$ cm, $AC = ' + b + '$ cm and $\\angle BAC = ' + A + '^\\circ$. Find the length of $BC$ in cm (it is a whole number).', a, 1e-9,
        '$BC^2 = ' + b + '^2 + ' + c + '^2 - 2 \\times ' + b + ' \\times ' + c + ' \\times \\cos ' + A + '^\\circ$ with $\\cos ' + A + '^\\circ = ' + (A === 60 ? '\\frac{1}{2}' : '-\\frac{1}{2}') + '$, so $BC^2 = ' + val + '$ and $BC = ' + a + '$ cm.', 'cm');
    }),
    G('find-angle', function () {
      var tr, a, b, c, tries = 0;
      do { a = rint(5, 14); b = rint(5, 14); c = rint(5, 14); tries++; } while ((a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1 || a === b || b === c || a === c) && tries < 300);
      var cosA = (b * b + c * c - a * a) / (2 * b * c);
      var A = Math.acos(cosA) / D2R;
      return ND('Triangle $ABC$ has $BC = ' + a + '$ cm, $AC = ' + b + '$ cm and $AB = ' + c + '$ cm. Find angle $BAC$, to 1 decimal place.', A,
        '$\\cos A = \\frac{' + b + '^2 + ' + c + '^2 - ' + a + '^2}{2 \\times ' + b + ' \\times ' + c + '} = \\frac{' + (b * b + c * c - a * a) + '}{' + 2 * b * c + '}$, so $A = ' + r1(A) + '^\\circ$.');
    }),
    G('quadratic', function () {
      var t = pick(TRI60), x = t[0], d = t[1], a = t[2];
      var c1 = d, c0 = d * d - a * a;
      var corr = T('x^2 + ' + c1 + 'x - ' + (-c0) + ' = 0');
      return M('In triangle $ABC$, $AB = x$ cm, $AC = (x + ' + d + ')$ cm, $BC = ' + a + '$ cm and $\\angle BAC = 60^\\circ$. Which equation does the cosine rule give for $x$?', corr,
        [T('2x^2 + ' + 2 * d + 'x - ' + (a * a - d * d) + ' = 0'), T('x^2 - ' + d + 'x - ' + (a * a - d * d) + ' = 0'), T('3x^2 + ' + 3 * d + 'x - ' + (a * a - d * d) + ' = 0')],
        '$' + a + '^2 = x^2 + (x + ' + d + ')^2 - 2x(x + ' + d + ')\\cos 60^\\circ = x^2 + x^2 + ' + 2 * d + 'x + ' + d * d + ' - x^2 - ' + d + 'x = x^2 + ' + d + 'x + ' + d * d + '$. So $x^2 + ' + d + 'x - ' + (a * a - d * d) + ' = 0$.');
    }),
    G('quadratic', function () {
      var t = pick(TRI60), x = t[0], d = t[1], a = t[2];
      return N('In triangle $ABC$, $AB = x$ cm, $AC = (x + ' + d + ')$ cm, $BC = ' + a + '$ cm and $\\angle BAC = 60^\\circ$. Use the cosine rule to find $x$.', x, 1e-9,
        'The cosine rule gives $x^2 + ' + d + 'x - ' + (a * a - d * d) + ' = 0$, which factorises as $(x - ' + x + ')(x + ' + (a * a - d * d) / x + ') = 0$. So $x = ' + x + '$ or $x = -' + (a * a - d * d) / x + '$. A length cannot be negative, so $x = ' + x + '$.', 'cm');
    }),
    G('angle-type', function () {
      var sets = [[3, 4, 5, 'a right angle'], [6, 8, 10, 'a right angle'], [5, 12, 13, 'a right angle'], [2, 3, 4, 'an obtuse angle'], [4, 5, 8, 'an obtuse angle'], [5, 6, 10, 'an obtuse angle'], [4, 5, 6, 'an acute angle'], [6, 7, 8, 'an acute angle'], [5, 6, 7, 'an acute angle']];
      var s = pick(sets), l = s[2], x = s[0], y = s[1], k = (x * x + y * y - l * l);
      return M('A triangle has sides of length $' + x + '$ cm, $' + y + '$ cm and $' + l + '$ cm. The angle opposite the longest side is', s[3],
        ['a right angle', 'an obtuse angle', 'an acute angle'].filter(function (z) { return z !== s[3]; }).concat(['impossible to tell']),
        'Using the cosine rule, $\\cos C = \\frac{' + x + '^2 + ' + y + '^2 - ' + l + '^2}{2 \\times ' + x + ' \\times ' + y + '} = \\frac{' + k + '}{' + 2 * x * y + '}$. The numerator is ' + (k === 0 ? 'zero, so the angle is $90^\\circ$' : k < 0 ? 'negative, so the cosine is negative and the angle is obtuse' : 'positive, so the angle is acute') + '.');
    }),
    G('which-side', function () {
      var a = rint(4, 9), b, c;
      do { b = rint(4, 12); c = rint(4, 12); } while (b === c || b === a || c === a || a + b <= c || a + c <= b || b + c <= a);
      return M('In triangle $ABC$, $BC = ' + a + '$, $AC = ' + b + '$ and $AB = ' + c + '$. Which expression equals $\\cos A$?',
        T('\\frac{' + b + '^2 + ' + c + '^2 - ' + a + '^2}{2 \\times ' + b + ' \\times ' + c + '}'),
        [T('\\frac{' + a + '^2 + ' + c + '^2 - ' + b + '^2}{2 \\times ' + a + ' \\times ' + c + '}'), T('\\frac{' + a + '^2 + ' + b + '^2 - ' + c + '^2}{2 \\times ' + a + ' \\times ' + b + '}'), T('\\frac{' + a + '^2 - ' + b + '^2 - ' + c + '^2}{2 \\times ' + b + ' \\times ' + c + '}')],
        'Angle $A$ is opposite side $BC = ' + a + '$ and lies between $AB$ and $AC$. So $\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$ with $a = BC$, $b = AC$, $c = AB$.');
    }),
    mc('expand-error', 'A student expands $(3x - 1)^2$ while using the cosine rule. Which expansion is correct?',
      [T('9x^2 - 6x + 1'), T('9x^2 - 1'), T('9x^2 + 1'), T('3x^2 - 6x + 1')], 0,
      '$(3x - 1)^2 = (3x - 1)(3x - 1) = 9x^2 - 3x - 3x + 1 = 9x^2 - 6x + 1$. The middle term must not be left out.'),
    mc('reject-root', 'The cosine rule gives $x^2 + 3x - 40 = 0$ for the length $x$ cm of a side. Which is the correct conclusion?',
      ['$x = 5$ only, because $x = -8$ cannot be a length', '$x = -8$ only', '$x = 5$ or $x = -8$, both are valid', '$x = 8$ only'], 0,
      '$x^2 + 3x - 40 = (x + 8)(x - 5) = 0$ gives $x = -8$ or $x = 5$. A length must be positive, so $x = 5$.'),
    mc('find-side', 'A student calculates $BC^2$ for $b = 8$, $c = 6$, $A = 70^\\circ$ by working out $8^2 + 6^2 - 2 \\times 8 \\times 6$ first and then multiplying the result by $\\cos 70^\\circ$. What is wrong?',
      ['$\\cos A$ multiplies only the $2bc$ term: $64 + 36 - 96\\cos 70^\\circ$', 'The sign before $2bc\\cos A$ should be plus', 'Nothing: the order of operations does not matter', 'The cosine rule should use $\\sin A$'], 0,
      'The cosine rule is $a^2 = b^2 + c^2 - 2bc\\cos A$: the cosine multiplies only $2bc$, i.e. $64 + 36 - 96\\cos 70^\\circ$. Subtracting first changes the answer.')
  ] };

  // =====================================================================
  // FPM-TRI-09 Sine rule
  // =====================================================================
  B['FPM-TRI-09'] = { title: 'Using the sine rule, including the two-answer case', items: [
    G('find-side', function () {
      var A = pick([35, 40, 50, 55, 65]), Bb = pick([30, 45, 60, 75, 80]), a = rint(6, 20);
      var b = a * sin(Bb) / sin(A);
      return N3('In triangle $ABC$, $\\angle A = ' + A + '^\\circ$, $\\angle B = ' + Bb + '^\\circ$ and $BC = ' + a + '$ cm. Find the length of $AC$, to 3 significant figures.', b,
        '$BC$ is opposite $A$ and $AC$ is opposite $B$. $\\frac{AC}{\\sin ' + Bb + '^\\circ} = \\frac{' + a + '}{\\sin ' + A + '^\\circ}$, so $AC = \\frac{' + a + '\\sin ' + Bb + '^\\circ}{\\sin ' + A + '^\\circ} = ' + r3(b) + '$ cm.', 'cm');
    }),
    G('find-angle', function () {
      var A = pick([35, 40, 50, 60]), Bt = rint(20, 80), a = rint(8, 20);
      var b = R.roundDp(a * sin(Bt) / sin(A), 1);
      var ang = Math.asin(b * sin(A) / a) / D2R;
      if (Bt >= A) { /* acute value still found by calculator; ask for acute */ }
      return ND('In triangle $ABC$, $BC = ' + a + '$ cm, $AC = ' + b + '$ cm and $\\angle A = ' + A + '^\\circ$. Angle $B$ is acute. Find angle $B$, to 1 decimal place.', ang,
        '$\\frac{\\sin B}{' + b + '} = \\frac{\\sin ' + A + '^\\circ}{' + a + '}$, so $\\sin B = \\frac{' + b + ' \\sin ' + A + '^\\circ}{' + a + '}$ and $B = \\sin^{-1}(\\ldots) = ' + r1(ang) + '^\\circ$.');
    }),
    G('obtuse', function () {
      var A = pick([20, 25, 30]), Bt = rint(55, 75), a = rint(8, 20);
      var b = R.roundDp(a * sin(Bt) / sin(A), 1);
      var acute = Math.asin(b * sin(A) / a) / D2R, ob = 180 - acute;
      return ND('In triangle $ABC$, $BC = ' + a + '$ cm, $AC = ' + b + '$ cm and $\\angle A = ' + A + '^\\circ$. Angle $B$ is obtuse. Find angle $B$, to 1 decimal place.', ob,
        '$\\sin B = \\frac{' + b + ' \\sin ' + A + '^\\circ}{' + a + '}$ gives the acute value $' + r1(acute) + '^\\circ$. The sine of an angle and of its supplement are equal, and $B$ is obtuse, so $B = 180^\\circ - ' + r1(acute) + '^\\circ = ' + r1(ob) + '^\\circ$.');
    }),
    G('count-solutions', function () {
      var A = pick([30, 40, 50, 60, 70, 80, 100]);
      var s = pick([0.5, 0.6, 0.7, 0.8, 0.9]);
      var acute = R.roundDp(Math.asin(s) / D2R, 1), ob = R.roundDp(180 - Math.asin(s) / D2R, 1);
      var both = A + (180 - Math.asin(s) / D2R) < 180;
      var oB = '$B = ' + acute + '^\\circ$ and $B = ' + ob + '^\\circ$ are both possible';
      var oA = '$B = ' + acute + '^\\circ$ only; the obtuse value would make the angles total more than $180^\\circ$';
      var corr = both ? oB : oA;
      return M('In triangle $ABC$, angle $A = ' + A + '^\\circ$ and the sine rule gives $\\sin B = ' + s + '$. Which statement is correct?', corr,
        [both ? oA : oB, '$B = ' + ob + '^\\circ$ only', 'There is no valid value of $B$'],
        'The sine rule gives $B = ' + acute + '^\\circ$ or $B = 180^\\circ - ' + acute + '^\\circ = ' + ob + '^\\circ$. Check the angle sum: $' + A + ' + ' + ob + ' = ' + R.roundDp(A + ob, 1) + '$, which is ' + (both ? 'less than' : 'more than') + ' $180$. So the obtuse value is ' + (both ? 'also valid' : 'not valid') + '.');
    }),
    G('exact', function () {
      var o = pick([[60, 45, 3, '\\sqrt{6}', 1], [45, 60, 2, '\\sqrt{6}', 1], [30, 45, 1, '\\sqrt{2}', 1], [30, 60, 1, '\\sqrt{3}', 1]]);
      var m = rint(2, 6), A = o[0], Bb = o[1], a = o[2] * m;
      var sinT = { 30: '\\frac{1}{2}', 45: '\\frac{\\sqrt{2}}{2}', 60: '\\frac{\\sqrt{3}}{2}' };
      var corr = m + o[3];
      var bad = [m * 3 + '\\sqrt{2}', 2 * m + '\\sqrt{3}', m + '\\sqrt{6}'].filter(function (z) { return z !== corr; });
      bad.push((m + 1) + o[3]);
      return M('In triangle $ABC$, $\\angle A = ' + A + '^\\circ$, $\\angle B = ' + Bb + '^\\circ$ and $BC = ' + a + '$ cm. Find the exact length of $AC$.', T(corr), bad.slice(0, 3).map(T),
        '$AC = \\frac{BC \\sin B}{\\sin A} = \\frac{' + a + ' \\times ' + sinT[Bb] + '}{' + sinT[A] + '} = ' + corr + '$ cm after simplifying and rationalising.');
    }),
    G('pairing', function () {
      var a = rint(5, 12), b = rint(5, 12);
      while (b === a) b = rint(5, 12);
      var A = pick([40, 50, 60, 70]);
      return M('In triangle $ABC$, $BC = ' + a + '$ cm, $AC = ' + b + '$ cm and $\\angle A = ' + A + '^\\circ$. Which equation correctly starts the sine rule to find $\\angle B$?',
        T('\\frac{\\sin B}{' + b + '} = \\frac{\\sin ' + A + '^\\circ}{' + a + '}'),
        [T('\\frac{\\sin B}{' + a + '} = \\frac{\\sin ' + A + '^\\circ}{' + b + '}'), T('\\frac{\\sin B}{' + b + '} = \\frac{\\cos ' + A + '^\\circ}{' + a + '}'), T('\\frac{\\sin B}{' + a + '} = \\frac{\\sin ' + A + '^\\circ}{' + a + '}')],
        'Each side is paired with its opposite angle: $AC = ' + b + '$ is opposite $B$, and $BC = ' + a + '$ is opposite $A = ' + A + '^\\circ$. So $\\frac{\\sin B}{' + b + '} = \\frac{\\sin ' + A + '^\\circ}{' + a + '}$.');
    }),
    nu('angle-sum', 'In triangle $ABC$, $\\angle A = 40^\\circ$ and $\\angle B = 65^\\circ$. Find $\\angle C$ in degrees, then use it to decide which side is the longest: it is the side opposite $C$. What is $\\angle C$?', 75, 1e-9, T('75'),
      'The angles in a triangle sum to $180^\\circ$: $C = 180 - 40 - 65 = 75^\\circ$. It is the largest angle, so the side opposite it is the longest.', '°'),
    mc('obtuse', 'The sine rule gives $\\sin B = 0.7$, so the calculator shows $B = 44.4^\\circ$. In triangle $ABC$, $\\angle A = 60^\\circ$. Is $B = 135.6^\\circ$ also possible?',
      ['No, because $60^\\circ + 135.6^\\circ$ is more than $180^\\circ$', 'Yes, because $\\sin 135.6^\\circ = \\sin 44.4^\\circ$ always gives a second triangle', 'No, because a triangle cannot have an obtuse angle', 'Yes, because $135.6 = 180 - 44.4$'], 0,
      'The second angle $180^\\circ - 44.4^\\circ = 135.6^\\circ$ has the same sine, but it is only valid if the three angles can still total $180^\\circ$. $60 + 135.6 = 195.6 \\gt 180$, so it is not possible.'),
    mc('obtuse', 'Why does the sine rule sometimes give two possible angles?',
      ['$\\sin\\theta = \\sin(180^\\circ - \\theta)$, so an acute and an obtuse angle share the same sine', '$\\cos\\theta = \\cos(180^\\circ - \\theta)$ for every angle', 'The calculator makes a rounding error', 'The sine of an angle is always negative for one of them'], 0,
      'Sine is positive in both the first and second quadrants and $\\sin\\theta = \\sin(180^\\circ - \\theta)$. That is why a sine value can come from an acute or an obtuse angle.'),
    G('find-side', function () {
      var A = pick([30, 45, 60, 50]), Cc = pick([70, 80, 40, 55]), c = rint(7, 18);
      var Bb = 180 - A - Cc, b = c * sin(Bb) / sin(Cc);
      return N3('In triangle $ABC$, $\\angle A = ' + A + '^\\circ$, $\\angle C = ' + Cc + '^\\circ$ and $AB = ' + c + '$ cm. Find the length of $AC$, to 3 significant figures.', b,
        'First $\\angle B = 180 - ' + A + ' - ' + Cc + ' = ' + Bb + '^\\circ$. $AB$ is opposite $C$ and $AC$ is opposite $B$, so $AC = \\frac{' + c + ' \\sin ' + Bb + '^\\circ}{\\sin ' + Cc + '^\\circ} = ' + r3(b) + '$ cm.', 'cm');
    })
  ] };

  // =====================================================================
  // FPM-TRI-11 Area of a triangle
  // =====================================================================
  var T3S = [[5, 6, 7], [4, 5, 6], [6, 7, 8], [7, 8, 9], [5, 7, 9], [6, 9, 10], [8, 9, 11], [4, 6, 7], [7, 9, 12]];
  B['FPM-TRI-11'] = { title: 'Area of a triangle using half ab sin C', items: [
    G('forward', function () {
      var a = rint(5, 16), b = rint(5, 16), C = pick([35, 40, 55, 65, 80, 110, 130]);
      var A = 0.5 * a * b * sin(C);
      return N3('Triangle $ABC$ has $AB = ' + a + '$ cm, $BC = ' + b + '$ cm and $\\angle ABC = ' + C + '^\\circ$. Find its area, to 3 significant figures.', A,
        'Area $= \\frac{1}{2} \\times AB \\times BC \\times \\sin B = \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\sin ' + C + '^\\circ = ' + r3(A) + '$ cm$^2$.', 'cm²');
    }),
    G('find-angle', function () {
      var a = rint(6, 15), b = rint(6, 15), C = pick([25, 35, 40, 50, 60, 70]);
      var A = R.roundDp(0.5 * a * b * sin(C), 1);
      var ang = Math.asin(2 * A / (a * b)) / D2R;
      return ND('Triangle $ABC$ has $AB = ' + a + '$ cm, $BC = ' + b + '$ cm and area $' + A + '$ cm$^2$. Angle $ABC$ is acute. Find angle $ABC$, to 1 decimal place.', ang,
        '$' + A + ' = \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\sin B$, so $\\sin B = \\frac{2 \\times ' + A + '}{' + a * b + '}$ and $B = ' + r1(ang) + '^\\circ$.');
    }),
    G('two-triangles', function () {
      var s = pick([[0.5, 30, 150], [0.6, 36.9, 143.1], [0.8, 53.1, 126.9]]);
      var a = pick([8, 10, 12, 15]), b = pick([5, 6, 8, 10, 20]);
      var area = R.roundDp(0.5 * a * b * s[0], 2);
      var corr = '$' + s[1] + '^\\circ$ or $' + s[2] + '^\\circ$';
      return M('A triangle has two sides of length $' + a + '$ cm and $' + b + '$ cm and an area of $' + area + '$ cm$^2$. What are the possible sizes of the angle between the two sides?', corr,
        ['$' + s[1] + '^\\circ$ only', '$' + s[2] + '^\\circ$ only', '$' + R.roundDp(90 - s[1], 1) + '^\\circ$ or $' + R.roundDp(90 + s[1], 1) + '^\\circ$'],
        '$\\sin C = \\frac{2 \\times ' + area + '}{' + a + ' \\times ' + b + '} = ' + s[0] + '$. So $C = ' + s[1] + '^\\circ$ or $C = 180^\\circ - ' + s[1] + '^\\circ = ' + s[2] + '^\\circ$. Both give the same area.');
    }),
    G('find-side', function () {
      var a = rint(4, 14) * 2, b = rint(3, 12), C = pick([30, 150]);
      var A = a * b / 4;
      return N('Triangle $PQR$ has $PQ = ' + a + '$ cm, $\\angle PQR = ' + C + '^\\circ$ and area $' + A + '$ cm$^2$. Find the length of $QR$.', b, 1e-6,
        '$\\sin ' + C + '^\\circ = \\frac{1}{2}$, so area $= \\frac{1}{2} \\times ' + a + ' \\times QR \\times \\frac{1}{2} = \\frac{' + a + ' \\times QR}{4}$. Setting this equal to $' + A + '$ gives $QR = \\frac{4 \\times ' + A + '}{' + a + '} = ' + b + '$ cm.', 'cm');
    }),
    G('three-sides', function () {
      var t = pick(T3S), a = t[0], b = t[1], c = t[2];
      var s = (a + b + c) / 2, A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      var C = Math.acos((a * a + b * b - c * c) / (2 * a * b)) / D2R;
      return N3('Triangle $ABC$ has $BC = ' + a + '$ cm, $CA = ' + b + '$ cm and $AB = ' + c + '$ cm. Find its area, to 3 significant figures.', A,
        'No angle is given, so find one with the cosine rule: $\\cos C = \\frac{' + a + '^2 + ' + b + '^2 - ' + c + '^2}{2 \\times ' + a + ' \\times ' + b + '}$ gives $C = ' + R.roundDp(C, 2) + '^\\circ$. Then area $= \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\sin C = ' + r3(A) + '$ cm$^2$.', 'cm²');
    }),
    G('exact', function () {
      var C = pick([60, 120]), a = pick([2, 4, 6, 8]), b = pick([2, 4, 6, 8, 10]);
      var k = a * b / 4;
      return M('Triangle $ABC$ has $AB = ' + a + '$ cm, $BC = ' + b + '$ cm and $\\angle ABC = ' + C + '^\\circ$. Find its exact area.', T(surd(k, 3)),
        [T(surd(2 * k, 3)), T(surd(k, 2)), T(fr(a * b, 4))].map(function (z) { return z; }),
        'Area $= \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\sin ' + C + '^\\circ = \\frac{1}{2} \\times ' + a * b + ' \\times \\frac{\\sqrt{3}}{2} = ' + surd(k, 3) + '$ cm$^2$.');
    }),
    G('forward', function () {
      var a = rint(3, 12) * 2, b = rint(3, 12) * 2, C = pick([30, 150]);
      var A = a * b / 4;
      return N('Triangle $ABC$ has $AC = ' + a + '$ cm, $BC = ' + b + '$ cm and $\\angle ACB = ' + C + '^\\circ$. Find its area in cm$^2$.', A, 1e-9,
        'Area $= \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\sin ' + C + '^\\circ = \\frac{1}{2} \\times ' + a + ' \\times ' + b + ' \\times \\frac{1}{2} = ' + A + '$.', 'cm²');
    }),
    mc('included-angle', 'In triangle $ABC$, $AB = 9$ cm, $AC = 12$ cm and $BC = 15$ cm. Which expression for the area uses the included angle correctly?',
      [T('\\frac{1}{2} \\times 9 \\times 12 \\times \\sin A'), T('\\frac{1}{2} \\times 9 \\times 12 \\times \\sin B'), T('\\frac{1}{2} \\times 9 \\times 15 \\times \\sin A'), T('\\frac{1}{2} \\times 12 \\times 15 \\times \\sin A')], 0,
      'The angle must lie between the two sides used. Angle $A$ is between $AB$ and $AC$, so the area is $\\frac{1}{2} \\times AB \\times AC \\times \\sin A$.'),
    mc('forward', 'A student finds the area of a triangle with sides $8$ cm and $5$ cm and included angle $30^\\circ$ as $8 \\times 5 \\times \\sin 30^\\circ = 20$ cm$^2$. What is the mistake?',
      ['They forgot the factor $\\frac{1}{2}$; the area is $10$ cm$^2$', 'They should have used $\\cos 30^\\circ$', 'The angle should have been in radians', 'There is no mistake'], 0,
      'Area $= \\frac{1}{2}ab\\sin C = \\frac{1}{2} \\times 8 \\times 5 \\times \\frac{1}{2} = 10$ cm$^2$.'),
    mc('two-triangles', 'Two different triangles have the same two side lengths and the same area. Which statement explains how this can happen?',
      ['The included angles are $C$ and $180^\\circ - C$, which have the same sine', 'The included angles are $C$ and $90^\\circ - C$, which have the same sine', 'The third sides must be equal', 'It is impossible'], 0,
      'Since area $= \\frac{1}{2}ab\\sin C$ and $\\sin C = \\sin(180^\\circ - C)$, an acute and an obtuse included angle give the same area.')
  ] };

  // =====================================================================
  // FPM-TRI-13 Lengths in a 3D solid
  // =====================================================================
  var QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [3, 4, 12, 13], [2, 10, 11, 15], [6, 6, 7, 11], [4, 8, 8, 12]];
  var PYTH = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]];
  B['FPM-TRI-13'] = { title: 'Lengths in a 3D solid using right-angled triangles', items: [
    G('cuboid', function () {
      var q = pick(QUADS), k = pick([1, 1, 2]);
      var a = q[0] * k, b = q[1] * k, c = q[2] * k, d = q[3] * k;
      return N('A cuboid measures $' + a + '$ cm by $' + b + '$ cm by $' + c + '$ cm. Find the length of the space diagonal (corner to opposite corner through the inside).', d, 1e-6,
        'First the face diagonal across the base: $\\sqrt{' + a + '^2 + ' + b + '^2} = \\sqrt{' + (a * a + b * b) + '}$. Then with the height: $\\sqrt{' + (a * a + b * b) + ' + ' + c + '^2} = \\sqrt{' + d * d + '} = ' + d + '$ cm.', 'cm');
    }),
    G('cuboid', function () {
      var a = rint(3, 12), b = rint(3, 12), c = rint(3, 12);
      var d = Math.sqrt(a * a + b * b + c * c);
      return N3('A cuboid measures $' + a + '$ cm by $' + b + '$ cm by $' + c + '$ cm. Find the length of its space diagonal, to 3 significant figures.', d,
        '$d = \\sqrt{' + a + '^2 + ' + b + '^2 + ' + c + '^2} = \\sqrt{' + (a * a + b * b + c * c) + '} = ' + r3(d) + '$ cm.', 'cm');
    }),
    G('pyramid-edge', function () {
      var s = 2 * rint(2, 8), h = rint(4, 15);
      var l = Math.sqrt(h * h + s * s / 2);
      return N3('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + s + '$ cm. The vertex $V$ is $' + h + '$ cm vertically above the centre of the base. Find the length of the sloping edge $VA$, to 3 significant figures.', l,
        'The base diagonal is $' + s + '\\sqrt{2}$, so half of it (centre to $A$) is $\\frac{' + s + '\\sqrt{2}}{2}$ and its square is $' + s * s / 2 + '$. Then $VA = \\sqrt{' + h + '^2 + ' + s * s / 2 + '} = ' + r3(l) + '$ cm.', 'cm');
    }),
    G('pyramid-edge', function () {
      var s = 2 * rint(2, 8), l = rint(12, 20);
      var h = Math.sqrt(l * l - s * s / 2);
      return N3('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + s + '$ cm. Each sloping edge is $' + l + '$ cm long. Find the vertical height of the pyramid, to 3 significant figures.', h,
        'Half the base diagonal: $\\frac{' + s + '\\sqrt{2}}{2}$, squared $= ' + s * s / 2 + '$. Then $h^2 = ' + l + '^2 - ' + s * s / 2 + ' = ' + (l * l - s * s / 2) + '$, so $h = ' + r3(h) + '$ cm.', 'cm');
    }),
    G('slant-height', function () {
      var t = pick(PYTH), k = pick([1, 2]);
      var a = t[0] * k, h = t[1] * k, sl = t[2] * k;
      return N('$VABCD$ is a right pyramid with square base $ABCD$ of side $' + 2 * a + '$ cm and vertical height $' + h + '$ cm. $M$ is the midpoint of $BC$. Find the length of $VM$, the slant height of face $VBC$.', sl, 1e-6,
        'Triangle $VOM$ is right-angled at $O$ with $OM = \\frac{' + 2 * a + '}{2} = ' + a + '$ (half the side) and $VO = ' + h + '$. So $VM = \\sqrt{' + a + '^2 + ' + h + '^2} = ' + sl + '$ cm.', 'cm');
    }),
    G('half-diagonal', function () {
      var s = 2 * rint(2, 9);
      return M('The base of a right pyramid is a square of side $' + s + '$ cm. To find the sloping edge from the vertex to a corner, you need the horizontal distance from the centre of the base to a corner. What is it?',
        T((s / 2) + '\\sqrt{2}\\text{ cm}'), [T(s + '\\sqrt{2}\\text{ cm}'), T((s / 2) + '\\text{ cm}'), T(s + '\\text{ cm}')],
        'The base diagonal is $' + s + '\\sqrt{2}$ cm. The centre is its midpoint, so the distance to a corner is half of it, $' + (s / 2) + '\\sqrt{2}$ cm, not the whole diagonal.');
    }),
    G('exact-height', function () {
      var k = rint(2, 9), an = pick([45, 60]);
      var corr = an === 45 ? surd(k, 2) : surd(k, 6);
      var others = an === 45 ? [surd(k, 6), surd(2 * k, 2), surd(k, 3)] : [surd(k, 2), surd(2 * k, 3), surd(3 * k, 2)];
      return M('$VABCD$ is a right pyramid with a square base of side $' + 2 * k + '$ cm. The sloping edge $VA$ makes an angle of $' + an + '^\\circ$ with the base. Find the exact height of the pyramid.', T(corr + '\\text{ cm}'), others.map(function (o) { return T(o + '\\text{ cm}'); }),
        'Half the base diagonal is $' + k + '\\sqrt{2}$. The height is $' + k + '\\sqrt{2} \\times \\tan ' + an + '^\\circ = ' + k + '\\sqrt{2} \\times ' + (an === 45 ? '1' : '\\sqrt{3}') + ' = ' + corr + '$ cm.');
    }),
    mc('right-triangle', 'In a right pyramid $VABCD$ with square base, $O$ is the centre of the base. Which triangle is certainly right-angled?',
      [T('VOA'), T('VAB'), T('VBC'), T('OAB')].slice(0, 4), 0,
      '$VO$ is vertical, so it is perpendicular to every line in the base, in particular $OA$. Triangle $VOA$ is right-angled at $O$. Face triangles like $VAB$ are isosceles but not right-angled in general.'),
    mc('cuboid', 'A cuboid has edges $a$, $b$, $c$. Which expression gives its space diagonal?',
      [T('\\sqrt{a^2 + b^2 + c^2}'), T('\\sqrt{a^2 + b^2} + c'), T('a + b + c'), T('\\sqrt{abc}')], 0,
      'Apply Pythagoras twice: the base diagonal has length $\\sqrt{a^2 + b^2}$, then with the height $c$ the space diagonal is $\\sqrt{a^2 + b^2 + c^2}$.'),
    nu('cuboid', 'Two edges of the base of a cuboid are $9$ cm and $12$ cm. How long is the diagonal of the base, in cm?', 15, 1e-9, T('15'),
      '$\\sqrt{9^2 + 12^2} = \\sqrt{225} = 15$ cm.', 'cm'),
    mc('pyramid-edge', 'A student finds the sloping edge of a pyramid with square base of side $8$ cm and height $6$ cm as $\\sqrt{6^2 + 8^2} = 10$. What is the mistake?',
      ['They used the side of the base instead of the horizontal distance from the centre to the corner, $4\\sqrt{2}$', 'They should have added the lengths, not used Pythagoras', 'They should have used half the side, $4$', 'There is no mistake'], 0,
      'The vertical height meets the base at its centre, so the horizontal leg is centre-to-corner $= 4\\sqrt{2}$. The edge is $\\sqrt{6^2 + 32} = \\sqrt{68} \\approx 8.25$ cm.')
  ] };

  // =====================================================================
  // FPM-TRI-15 Angle between a line and a plane
  // =====================================================================
  B['FPM-TRI-15'] = { title: 'Angle between a line and a plane', items: [
    G('cuboid-diagonal', function () {
      var a = rint(3, 12), b = rint(3, 12), c = rint(3, 12), nm = pick([['AG', 'C', 'AC'], ['EC', 'A', 'AC'], ['BH', 'D', 'BD'], ['FD', 'B', 'BD']]);
      var base = Math.sqrt(a * a + b * b), ang = Math.atan(c / base) / D2R;
      return ND('A cuboid $ABCDEFGH$ has base $ABCD$ and top face $EFGH$, with $E$ above $A$, $F$ above $B$, $G$ above $C$ and $H$ above $D$. $AB = ' + a + '$ cm, $BC = ' + b + '$ cm and $AE = ' + c + '$ cm. Find the angle between the line $' + nm[0] + '$ and the plane $ABCD$, to 1 decimal place.', ang,
        'The projection of $' + nm[0] + '$ onto the base is $' + nm[2] + '$ (the vertical edge at ' + nm[1] + ' is the perpendicular). $' + nm[2] + ' = \\sqrt{' + a + '^2 + ' + b + '^2} = ' + R.roundSf(base, 4) + '$. Then $\\tan\\theta = \\frac{' + c + '}{' + R.roundSf(base, 4) + '}$, so $\\theta = ' + r1(ang) + '^\\circ$.');
    }),
    G('pyramid-edge', function () {
      var s = 2 * rint(2, 8), h = rint(4, 14);
      var half = s * Math.SQRT2 / 2, ang = Math.atan(h / half) / D2R;
      return ND('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + s + '$ cm and vertical height $' + h + '$ cm. Find the angle between the edge $VA$ and the base, to 1 decimal place.', ang,
        'The foot of the perpendicular from $V$ is the centre $O$, so the projection of $VA$ is $OA = \\frac{' + s + '\\sqrt{2}}{2} = ' + R.roundSf(half, 4) + '$. $\\tan\\theta = \\frac{VO}{OA} = \\frac{' + h + '}{' + R.roundSf(half, 4) + '}$, so $\\theta = ' + r1(ang) + '^\\circ$.');
    }),
    G('projection', function () {
      var a = rint(3, 12), b = rint(3, 12), c = rint(3, 12);
      var ang = Math.atan(b / Math.sqrt(a * a + c * c)) / D2R;
      return ND('A cuboid $ABCDEFGH$ has base $ABCD$ and top face $EFGH$, with $E$ above $A$, $F$ above $B$, $G$ above $C$ and $H$ above $D$. $AB = ' + a + '$ cm, $BC = ' + b + '$ cm and $AE = ' + c + '$ cm. Find the angle between the line $AG$ and the plane $ABFE$, to 1 decimal place.', ang,
        'The perpendicular from $G$ to plane $ABFE$ is $GF$ (parallel to $BC$, length ' + b + '). So the projection of $AG$ is $AF = \\sqrt{' + a + '^2 + ' + c + '^2}$. $\\tan\\theta = \\frac{' + b + '}{\\sqrt{' + (a * a + c * c) + '}}$, giving $\\theta = ' + r1(ang) + '^\\circ$.');
    }),
    G('sin-from-length', function () {
      var t = pick([[5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 12, 15]]);
      var h = Math.min(t[0], t[1]), L = t[2];
      var ang = Math.asin(h / L) / D2R;
      return ND('A straight wire of length $' + L + '$ m runs from the ground up to the top of a vertical post of height $' + h + '$ m, on horizontal ground. Find the angle between the wire and the ground, to 1 decimal place.', ang,
        'The wire, the post and the ground form a right-angled triangle. The post is opposite the angle, the wire is the hypotenuse: $\\sin\\theta = \\frac{' + h + '}{' + L + '}$, so $\\theta = ' + r1(ang) + '^\\circ$.');
    }),
    G('projection', function () {
      var cases = [['EC', 'AC'], ['GA', 'AC'], ['FD', 'BD'], ['HB', 'BD']];
      var cs = pick(cases);
      return M('A cuboid $ABCDEFGH$ has base $ABCD$ with $E$ above $A$, $F$ above $B$, $G$ above $C$ and $H$ above $D$. To find the angle between the line $' + cs[0] + '$ and the plane $ABCD$, which line is the projection of $' + cs[0] + '$ onto the plane?',
        T(cs[1]), [T(cs[1] === 'AC' ? 'BD' : 'AC'), T('AB'), T('BC')],
        'Drop the perpendicular from the raised end of the line to the base. For $' + cs[0] + '$ this foot is the corner directly below it, so the projection joins that corner to the far end, which is $' + cs[1] + '$.');
    }),
    G('choose-ratio', function () {
      var t = pick([[5, 12, 13], [8, 15, 17], [7, 24, 25], [3, 4, 5]]);
      var h = t[0], p = t[1], L = t[2];
      return M('A line of length $' + L + '$ cm makes an angle $\\theta$ with a plane. The perpendicular height of its upper end above the plane is $' + h + '$ cm and its projection on the plane has length $' + p + '$ cm. Which gives $\\theta$ correctly?',
        T('\\tan\\theta = \\frac{' + h + '}{' + p + '}'), [T('\\tan\\theta = \\frac{' + p + '}{' + h + '}'), T('\\cos\\theta = \\frac{' + h + '}{' + L + '}'), T('\\sin\\theta = \\frac{' + p + '}{' + L + '}')],
        'The angle is between the line and its projection. The height is opposite $\\theta$ and the projection is adjacent, so $\\tan\\theta = \\frac{' + h + '}{' + p + '}$ (also $\\sin\\theta = \\frac{' + h + '}{' + L + '}$ and $\\cos\\theta = \\frac{' + p + '}{' + L + '}$).');
    }),
    mc('projection', 'What is the angle between a line and a plane defined as?',
      ['The angle between the line and its projection on the plane', 'The angle between the line and any line in the plane', 'The angle between the line and the perpendicular to the plane', 'The angle between the line and the edge of the base'], 0,
      'The angle between a line and a plane is measured between the line and its projection ("shadow") on the plane. This is the smallest angle the line makes with any line in the plane.'),
    mc('projection', 'A pyramid $VABCD$ has a square base and its vertex is directly above the centre $O$. To find the angle between $VA$ and the base, which triangle do you use?',
      [T('VOA, right-angled at O'), T('VAB, using the base edge AB'), T('VBC, using BC'), T('VAC, using the base diagonal')], 0,
      '$VO$ is perpendicular to the base and $OA$ is the projection of $VA$. The angle is $\\angle VAO$ in the right-angled triangle $VOA$.'),
    nu('cuboid-diagonal', 'A cuboid has a base measuring $3$ cm by $4$ cm and a height of $5$ cm. The base diagonal is $5$ cm. What is the angle, in degrees, between the space diagonal from one base corner to the opposite top corner and the base?', 45, 0.051, T('45'),
      'The vertical edge is $5$ and the projection (the base diagonal) is $5$. $\\tan\\theta = \\frac{5}{5} = 1$, so $\\theta = 45^\\circ$.', '°'),
    mc('trap-projection', 'A student finds the angle between the diagonal $AG$ of a cuboid and the base $ABCD$ using $\\tan\\theta = \\frac{CG}{AB}$. What is the mistake?',
      ['The projection of $AG$ on the base is the diagonal $AC$, not the edge $AB$', 'They should have used $\\cos$ instead of $\\tan$', 'They should have used $BC$ in place of $CG$', 'There is no mistake'], 0,
      'The foot of the perpendicular from $G$ is $C$, so the projection is $AC = \\sqrt{AB^2 + BC^2}$ and $\\tan\\theta = \\frac{CG}{AC}$.')
  ] };

  // =====================================================================
  // FPM-TRI-16 Angle between two planes
  // =====================================================================
  B['FPM-TRI-16'] = { title: 'Angle between two planes using a right-angled triangle', items: [
    G('tan-ratio', function () {
      var a = rint(3, 10), h = rint(4, 14), ang = Math.atan(h / a) / D2R;
      return ND('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + 2 * a + '$ cm and vertical height $' + h + '$ cm. Find the angle between the face $VBC$ and the base, to 1 decimal place.', ang,
        'Let $M$ be the midpoint of $BC$ and $O$ the centre of the base. $OM = ' + a + '$ and $VO = ' + h + '$, and the angle between the planes is $\\angle VMO$. $\\tan\\angle VMO = \\frac{' + h + '}{' + a + '}$, so the angle is $' + r1(ang) + '^\\circ$.');
    }),
    G('cos-ratio', function () {
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), a = t[0], sl = t[1], l = t[2];
      var ang = Math.acos(a / sl) / D2R;
      return ND('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + 2 * a + '$ cm. Each sloping edge is $' + l + '$ cm. Find the angle between the face $VAB$ and the base, to 1 decimal place.', ang,
        'Let $M$ be the midpoint of $AB$. $VM = \\sqrt{' + l + '^2 - ' + a + '^2} = ' + sl + '$ (isosceles face, $BM = ' + a + '$). $OM = ' + a + '$. In the right-angled triangle $VOM$, $\\cos\\angle VMO = \\frac{OM}{VM} = \\frac{' + a + '}{' + sl + '}$, so the angle is $' + r1(ang) + '^\\circ$.');
    }),
    G('regular-polygon', function () {
      var n = pick([4, 6]), a = rint(2, 8), h = rint(4, 14);
      var om = n === 4 ? a : a * Math.sqrt(3), ang = Math.atan(h / om) / D2R;
      return ND('A right pyramid has a base that is ' + (n === 4 ? 'a square' : 'a regular hexagon') + ' with sides of length $' + 2 * a + '$ cm. Its vertical height is $' + h + '$ cm. Find the angle between a sloping face and the base, to 1 decimal place.', ang,
        'The distance from the centre to the midpoint of a side is ' + (n === 4 ? '$' + a + '$ (half the side)' : '$\\frac{' + a + '}{\\tan 30^\\circ} = ' + a + '\\sqrt{3} = ' + R.roundSf(om, 4) + '$ (hexagon, half-side $' + a + '$)') + '. So $\\tan\\theta = \\frac{' + h + '}{' + R.roundSf(om, 4) + '}$ and $\\theta = ' + r1(ang) + '^\\circ$.');
    }),
    G('regular-polygon', function () {
      var a = rint(2, 9);
      return M('The base of a right pyramid is a regular hexagon of side $' + 2 * a + '$ cm. What is the distance from the centre of the base to the midpoint of one side?',
        T(a + '\\sqrt{3}\\text{ cm}'), [T(2 * a + '\\sqrt{3}\\text{ cm}'), T(a + '\\text{ cm}'), T(fr(a, 3).replace('\\frac{', '\\frac{') + '\\sqrt{3}\\text{ cm}')],
        'The centre, a vertex and the midpoint of a side form a $30$-$60$-$90$ triangle. The half-side is $' + a + '$ and the angle at the centre is $30^\\circ$, so the distance is $\\frac{' + a + '}{\\tan 30^\\circ} = ' + a + '\\sqrt{3}$ cm.');
    }),
    G('slant-height', function () {
      var a = rint(3, 9), l;
      var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]);
      a = t[0]; l = t[2];
      return M('$VABCD$ is a right pyramid with a square base of side $' + 2 * a + '$ cm and sloping edges of length $' + l + '$ cm. $M$ is the midpoint of $AB$. Which expression gives $VM$?',
        T('\\sqrt{' + l + '^2 - ' + a + '^2}'), [T('\\sqrt{' + l + '^2 - ' + 2 * a + '^2}'), T('\\sqrt{' + l + '^2 + ' + a + '^2}'), T(l + ' - ' + a)],
        'Triangle $VAB$ is isosceles with $VA = VB = ' + l + '$, so $VM \\perp AB$ and $BM = \\frac{AB}{2} = ' + a + '$. Pythagoras in $VMB$ gives $VM = \\sqrt{' + l + '^2 - ' + a + '^2}$.');
    }),
    G('identify-angle', function () {
      var e = pick([['BC', 'VBC'], ['AB', 'VAB'], ['CD', 'VCD'], ['DA', 'VDA']]);
      var ends = e[0].split('');
      return M('$VABCD$ is a right pyramid with a square base and centre $O$. $M$ is the midpoint of $' + e[0] + '$. Which angle is the angle between the plane $' + e[1] + '$ and the base?',
        T('\\angle VMO'), [T('\\angle V' + ends[0] + 'O'), T('\\angle V' + ends[1] + 'M'), T('\\angle ' + e[1].replace(/(.)/g, '$1') + '')].map(function (o) { return o; }),
        'The planes meet along $' + e[0] + '$. $VM$ and $OM$ are both perpendicular to $' + e[0] + '$ at $M$, so the angle between the planes is $\\angle VMO$. Angles at a corner such as $' + ends[0] + '$ are not perpendicular to the common line.');
    }),
    G('find-height', function () {
      var a = rint(3, 12), th = pick([45, 60]);
      var h = a * Math.tan(th * D2R);
      return N3('$VABCD$ is a right pyramid with a square base $ABCD$ of side $' + 2 * a + '$ cm. The face $VBC$ makes an angle of $' + th + '^\\circ$ with the base. Find the vertical height of the pyramid, to 3 significant figures.', h,
        'With $M$ the midpoint of $BC$, $OM = ' + a + '$ and $\\tan ' + th + '^\\circ = \\frac{VO}{OM}$. So $VO = ' + a + ' \\tan ' + th + '^\\circ = ' + r3(h) + '$ cm.', 'cm');
    }),
    mc('identify-angle', 'In a right pyramid, a student says: "The angle between the face $VBC$ and the base is $\\angle BVC$." What is wrong?',
      ['$\\angle BVC$ is at the vertex inside the face; the angle between the planes is $\\angle VMO$ with $M$ the midpoint of $BC$', 'Nothing: $\\angle BVC$ is the angle between the planes', 'The angle should be $\\angle VBC$', 'The angle should be $\\angle VAC$'], 0,
      'The angle between two planes is measured with lines perpendicular to the common line $BC$. $VM$ and $OM$ both are, so use $\\angle VMO$.'),
    mc('slant-height', 'Why is the midpoint $M$ of a base edge used when finding the angle between a sloping face and the base of a right pyramid?',
      ['Because $VM$ and $OM$ are both perpendicular to the edge there', 'Because $M$ is always the foot of the vertical height', 'Because the edge is a sloping edge at $M$', 'Because $VM$ is vertical'], 0,
      'In the isosceles face the line from the apex to the midpoint of the base edge is perpendicular to that edge, and $OM$ is perpendicular to it as well. So $\\angle VMO$ is the angle between the planes.'),
    nu('tan-ratio', 'The face of a right pyramid makes an angle $\\theta$ with its base where $\\tan\\theta = 2$ and the base is a square of side $6$ cm. Find the vertical height of the pyramid in cm.', 6, 1e-6, T('6'),
      'Half the side is $OM = 3$. $\\tan\\theta = \\frac{VO}{OM} = 2$, so $VO = 2 \\times 3 = 6$ cm.', 'cm')
  ] };
})();
