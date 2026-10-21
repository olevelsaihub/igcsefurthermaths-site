/* Group G03 mastery bank: areas of composite regions, volumes of revolution, kinematics by calculus. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function n6(x) { return R.roundDp(x, 6); }
  // coefficient times body: 1 -> body
  function cof(n) { return n === 1 ? '' : String(n); }
  function cf(c, body) { return c === 1 ? body : String(c) + body; }
  // list of [coef, body] -> clean expression
  function terms(list) {
    var out = '', i, c, b, a, co;
    for (i = 0; i < list.length; i++) {
      c = list[i][0]; b = list[i][1];
      if (c === 0) continue;
      a = Math.abs(c); co = (b !== '' && a === 1) ? '' : String(a);
      if (out === '') out = (c < 0 ? '-' : '') + co + b;
      else out += (c < 0 ? ' - ' : ' + ') + co + b;
    }
    return out || '0';
  }
  // coefficient array (index = power) -> polynomial in v
  function poly(cs, v) {
    var list = [], p;
    for (p = cs.length - 1; p >= 0; p--) list.push([cs[p], p === 0 ? '' : (p === 1 ? v : v + '^{' + p + '}')]);
    return terms(list);
  }
  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1; n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  }
  function fracPi(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1; n /= g; d /= g;
    if (n === 0) return '0';
    var top = (Math.abs(n) === 1 ? '' : String(Math.abs(n))) + '\\pi';
    var s = d === 1 ? top : '\\frac{' + top + '}{' + d + '}';
    return (n < 0 ? '-' : '') + s;
  }
  function sfTol(x, n) { return 0.5 * Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - n + 1) * 1.001; }
  function sf3(q, x, why) { var a = R.roundSf(x, 3); return { kind: 'num', q: q, answer: a, tol: sfTol(a, 3), display: '$' + a + '$', why: why }; }
  function exact(q, x, why, unit) { var a = n6(x); return { kind: 'num', q: q, answer: a, tol: 1e-9, unit: unit || '', display: '$' + a + '$', why: why }; }
  // mcq with the right option first (the engine shuffles)
  function M(q, right, wrongs, why) {
    var o = [right], i;
    for (i = 0; i < wrongs.length; i++) if (o.indexOf(wrongs[i]) < 0) o.push(wrongs[i]);
    return { kind: 'mcq', q: q, options: o.slice(0, 4), answer: 0, why: why };
  }
  function S(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }

  // ---------- shared kinematics helpers ----------
  // F(t) for v = 3(t-p)(t-q): integral = t^3 - 1.5(p+q)t^2 + 3pq t
  function Fv(p, q, t) { return t * t * t - 1.5 * (p + q) * t * t + 3 * p * q * t; }
  function vexp(p, q) { return poly([3 * p * q, -3 * (p + q), 3], 't'); }

  // =====================================================================
  B['FPM-CAL-21'] = { title: 'Areas of regions made of several pieces', items: [
    { skill: 'integral-plus-triangle', gen: function () {
      var a = pick([3, 6]), k = rint(1, 4), b = a + (a === 3 ? 2 * rint(1, 3) : rint(1, 4));
      var h = k * a * a, I = k * a * a * a / 3, T = (b - a) * h / 2;
      return exact('The curve $C$ has equation $y = ' + cf(k, 'x^2') + '$. The point $P$ on $C$ has $x$-coordinate $' + a + '$. The straight line through $P$ meets the $x$-axis at $Q(' + b + ', 0)$. The finite region $R$ is bounded by $C$, the line $PQ$, the $x$-axis and the $y$-axis. Find the area of $R$.',
        I + T, 'Split $R$ at $x = ' + a + '$. The curved piece is $\\int_0^{' + a + '} ' + cf(k, 'x^2') + '\\,dx = ' + n6(I) + '$. The triangle under $PQ$ has base $' + (b - a) + '$ and height $' + h + '$, so its area is $\\frac{1}{2} \\times ' + (b - a) + ' \\times ' + h + ' = ' + n6(T) + '$. Total $= ' + n6(I + T) + '$.');
    } },
    { skill: 'find-intercept', gen: function () {
      var a = rint(2, 6), m = rint(2, 4), j = rint(1, 4), h = m * j;
      return exact('A straight line passes through $P(' + a + ', ' + h + ')$ and has gradient $-' + m + '$. Find the $x$-coordinate of the point where the line meets the $x$-axis.',
        a + j, 'Going right by $d$ lowers $y$ by $' + m + 'd$. To drop $' + h + '$ you need $d = ' + h + ' \\div ' + m + ' = ' + j + '$, so the line meets the axis at $x = ' + a + ' + ' + j + ' = ' + (a + j) + '$.');
    } },
    { skill: 'two-curves', gen: function () {
      var a = pick([3, 6]), k = rint(1, 3), top = a * a + a;
      var area = k * (a * a * a / 3 + a * a * a * a / 2);
      return exact('The finite region $R$ is bounded by the $y$-axis, the $x$-axis, the curve $C_1$ with equation $y = ' + cf(k, 'x^2') + '$ for $0 \\leqslant x \\leqslant ' + a + '$, and the line $C_2$ with equation $y = ' + k + '(' + top + ' - x)$ for $' + a + ' \\leqslant x \\leqslant ' + top + '$. Find the area of $R$.',
        area, 'On $C_1$: $\\int_0^{' + a + '} ' + cf(k, 'x^2') + '\\,dx = ' + n6(k * a * a * a / 3) + '$. $C_2$ meets $C_1$ at $x = ' + a + '$ where $y = ' + (k * a * a) + '$, and meets the $x$-axis at $x = ' + top + '$, so it makes a triangle with base $' + (top - a) + '$ and height $' + (k * a * a) + '$, area $' + n6(k * a * a * a * a / 2) + '$. Total $= ' + n6(area) + '$.');
    } },
    { skill: 'triangle-minus-integral', gen: function () {
      var a = pick([3, 6, 9]), k = rint(1, 3), area = k * a * a * a / 6;
      return exact('The curve $C$ has equation $y = ' + cf(k, 'x^2') + '$. The line $l$ passes through the origin $O$ and the point $P$ on $C$ with $x$-coordinate $' + a + '$. Using a triangle and an integral, find the area of the finite region between $C$ and $l$.',
        area, '$P$ is $(' + a + ', ' + (k * a * a) + ')$. The triangle under $OP$ down to $x = ' + a + '$ has area $\\frac{1}{2} \\times ' + a + ' \\times ' + (k * a * a) + ' = ' + n6(k * a * a * a / 2) + '$. The area under the curve is $\\int_0^{' + a + '} ' + cf(k, 'x^2') + '\\,dx = ' + n6(k * a * a * a / 3) + '$. The region is the triangle minus the integral: $' + n6(area) + '$.');
    } },
    { skill: 'rectangle-minus-integral', gen: function () {
      var a = pick([3, 6]), k = rint(1, 4), area = 2 * k * a * a * a / 3;
      return exact('The finite region $R$ is bounded by the curve $y = ' + cf(k, 'x^2') + '$, the $y$-axis and the line $y = ' + (k * a * a) + '$. Find the area of $R$.',
        area, 'The curve meets $y = ' + (k * a * a) + '$ at $x = ' + a + '$. The rectangle $0 \\leqslant x \\leqslant ' + a + '$, $0 \\leqslant y \\leqslant ' + (k * a * a) + '$ has area $' + (k * a * a * a) + '$. The area under the curve is $\\int_0^{' + a + '} ' + cf(k, 'x^2') + '\\,dx = ' + n6(k * a * a * a / 3) + '$. $R$ is the difference: $' + n6(area) + '$.');
    } },
    { skill: 'triangle-from-axes', gen: function () {
      var m = rint(2, 5), j = rint(2, 5), c = m * j, area = c * j / 2;
      return exact('The line $y = ' + c + ' - ' + m + 'x$ meets the $y$-axis at $A$ and the $x$-axis at $B$. Find the area of triangle $OAB$, where $O$ is the origin.',
        area, '$A = (0, ' + c + ')$. Putting $y = 0$ gives $x = ' + c + ' \\div ' + m + ' = ' + j + '$, so $B = (' + j + ', 0)$. Area $= \\frac{1}{2} \\times ' + j + ' \\times ' + c + ' = ' + n6(area) + '$.');
    } },
    { skill: 'sqrt-piece-sf', gen: function () {
      var a = pick([4, 16]), r = Math.sqrt(a), b = a + rint(1, 3) * 2;
      var I = 2 / 3 * Math.pow(a, 1.5), T = (b - a) * r / 2;
      return sf3('The curve $C$ has equation $y = \\sqrt{x}$. The point $P$ on $C$ has $x$-coordinate $' + a + '$. The line through $P$ meets the $x$-axis at $Q(' + b + ', 0)$. The finite region $R$ is bounded by $C$, $PQ$, the $x$-axis and the $y$-axis. Find the area of $R$, giving your answer to 3 significant figures.',
        I + T, 'Curved piece: $\\int_0^{' + a + '} x^{1/2}\\,dx = \\frac{2}{3}(' + a + ')^{3/2} = ' + n6(I) + '$. Triangle: base $' + (b - a) + '$, height $' + r + '$, area $' + n6(T) + '$. Total $= ' + n6(I + T) + '$, which is $' + R.roundSf(I + T, 3) + '$ to 3 s.f.');
    } },
    { skill: 'corners', gen: function () {
      var a = rint(2, 4), k = rint(1, 3), b = a + rint(2, 4), h = k * a * a;
      var right = '$(0, 0)$, $(' + a + ', ' + h + ')$, $(' + b + ', 0)$';
      return M('The curve $y = ' + cf(k, 'x^2') + '$ and a line meet at $P$, where $x = ' + a + '$. The line meets the $x$-axis at $(' + b + ', 0)$. The region $R$ is bounded by the curve, the line, the $x$-axis and the $y$-axis. Which set lists the corners of $R$?',
        right, ['$(0, 0)$, $(' + a + ', 0)$, $(' + b + ', 0)$', '$(0, 0)$, $(' + a + ', ' + a + ')$, $(' + b + ', 0)$', '$(0, 0)$, $(' + a + ', ' + h + ')$, $(' + b + ', ' + h + ')$'],
        '$P$ is on the curve, so its $y$-coordinate is $' + cf(k, '(' + a + ')^2') + ' = ' + h + '$. The other corners are the origin and the point where the line meets the $x$-axis, $(' + b + ', 0)$.');
    } },
    S('plan', 'A curve and a straight line meet at $P$. The line then runs down to the $x$-axis at $Q$. The region $R$ is bounded by the curve, $PQ$, the $x$-axis and the $y$-axis. Which method gives the area of $R$?',
      ['Integrate the curve from the $y$-axis to $P$, then add the area of the triangle under $PQ$', 'Integrate the curve from the $y$-axis all the way to $Q$', 'Integrate the curve from the $y$-axis to $P$, then subtract the area of the triangle under $PQ$', 'Find the area of the triangle only, since the curve is not needed'], 0,
      'The boundary changes at $P$. Under the curve from the $y$-axis to $P$ you need an integral; from $P$ to $Q$ the boundary is straight, so you add a triangle. The curve does not continue past $P$.'),
    S('below-axis', 'Part of a region lies below the $x$-axis. When you find its total area, how do you treat that part?',
      ['Find its area as a positive number and add it to the other pieces', 'Find the signed integral and add it, even though it is negative', 'Ignore it, because only areas above the axis count', 'Subtract its area from the other pieces'], 0,
      'Area is never negative. A piece below the axis gives a negative integral, so take its size (or use a triangle) and add that to the rest.'),
    S('rounding', 'A region splits into an integral worth $12.4567\\ldots$ and a triangle of area $5$. The answer is needed to 3 significant figures. What is the best approach?',
      ['Add the exact pieces and round only the total', 'Round each piece to 3 s.f. first, then add', 'Round the integral to the nearest whole number first', 'Give the integral only, as the triangle is exact'], 0,
      'Rounding early can push the final digit out. Keep full values until the last step: $12.4567 + 5 = 17.4567$, which is $17.5$ to 3 s.f.')
  ] };

  // =====================================================================
  B['FPM-CAL-22'] = { title: 'Volume of revolution about the x-axis', items: [
    { skill: 'sqrt-curve', gen: function () {
      var c = rint(1, 6), b = rint(1, 5), p = c * b * b / 2;
      return exact('The region bounded by the curve $y = \\sqrt{' + cf(c, 'x') + '}$, the $x$-axis and the line $x = ' + b + '$ is rotated through $360^\\circ$ about the $x$-axis. The volume of the solid is $V = k\\pi$. Find $k$.',
        p, '$y^2 = ' + cf(c, 'x') + '$, so $V = \\pi\\int_0^{' + b + '} ' + cf(c, 'x') + '\\,dx = \\pi\\left[' + frac(c, 2) + 'x^2\\right]_0^{' + b + '} = ' + n6(p) + '\\pi$. So $k = ' + n6(p) + '$.');
    } },
    { skill: 'linear-expand', gen: function () {
      var a = rint(1, 4), b = rint(1, 4), L = pick([3, 6]);
      var p = a * a * L + a * b * L * L + b * b * L * L * L / 3;
      return exact('The region under the line $y = ' + a + ' + ' + cf(b, 'x') + '$ between $x = 0$ and $x = ' + L + '$ is rotated through $360^\\circ$ about the $x$-axis. The volume generated is $k\\pi$. Find $k$.',
        p, '$y^2 = ' + terms([[a * a, ''], [2 * a * b, 'x'], [b * b, 'x^2']]) + '$ (note the cross term). Integrating from $0$ to $' + L + '$: $' + a * a + '(' + L + ') + ' + a * b + '(' + L + ')^2 + ' + frac(b * b, 3) + '(' + L + ')^3 = ' + n6(p) + '$. So $k = ' + n6(p) + '$.');
    } },
    { skill: 'power-curve', gen: function () {
      var L = rint(2, 4);
      return M('The region under $y = x^2$ between $x = 0$ and $x = ' + L + '$ is rotated through $360^\\circ$ about the $x$-axis. What is the exact volume?',
        '$V = ' + fracPi(Math.pow(L, 5), 5) + '$', ['$V = ' + fracPi(Math.pow(L, 3), 3) + '$', '$V = ' + fracPi(Math.pow(L, 4), 4) + '$', '$V = ' + frac(Math.pow(L, 5), 5) + '$', '$V = ' + fracPi(Math.pow(L, 6), 6) + '$'],
        '$y^2 = x^4$, so $V = \\pi\\int_0^{' + L + '} x^4\\,dx = \\pi\\left[\\frac{x^5}{5}\\right]_0^{' + L + '} = ' + fracPi(Math.pow(L, 5), 5) + '$. Options without $\\pi$ or with the wrong power miss a step.');
    } },
    { skill: 'exponential', gen: function () {
      var k = pick([1, 2, 4]), b = pick([3, 5, 7]), p = (b * b - 1) / (2 * k);
      var up = k === 1 ? '\\ln ' + b : '\\frac{\\ln ' + b + '}{' + k + '}';
      return exact('The region under the curve $y = e^{' + cf(k, 'x') + '}$ between $x = 0$ and $x = ' + up + '$ is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find the value of $p$.',
        p, '$y^2 = e^{' + cf(2 * k, 'x') + '}$, so $V = \\pi\\left[\\frac{1}{' + 2 * k + '}e^{' + cf(2 * k, 'x') + '}\\right]_0^{U}$. At the upper limit $e^{' + cf(k, 'x') + '} = ' + b + '$, so $e^{' + cf(2 * k, 'x') + '} = ' + (b * b) + '$. Then $p = \\frac{' + (b * b) + ' - 1}{' + 2 * k + '} = ' + n6(p) + '$.');
    } },
    { skill: 'trig-exact', gen: function () {
      var k = rint(1, 4), v = k * k * Math.PI * Math.PI / 2;
      return sf3('The region under the curve $y = ' + cf(k, '\\sin x') + '$ between $x = 0$ and $x = \\pi$ ($x$ in radians) is rotated through $360^\\circ$ about the $x$-axis. Find the volume, to 3 significant figures.',
        v, '$y^2 = ' + (k * k === 1 ? '' : k * k) + '\\sin^2 x = ' + frac(k * k, 2) + '(1 - \\cos 2x)$. Integrating over $0$ to $\\pi$ gives $' + frac(k * k, 2) + '\\pi$, so $V = \\pi \\times ' + frac(k * k, 2) + '\\pi = ' + frac(k * k, 2) + '\\pi^2 = ' + R.roundSf(v, 3) + '$.');
    } },
    { skill: 'square-first', gen: function () {
      var a = rint(1, 4), b = rint(2, 5);
      return M('A curve has equation $y = ' + a + ' + ' + b + '\\sin x$. Which expression is $y^2$?',
        '$' + terms([[a * a, ''], [2 * a * b, '\\sin x'], [b * b, '\\sin^2 x']]) + '$',
        ['$' + terms([[a * a, ''], [b * b, '\\sin^2 x']]) + '$', '$' + terms([[a * a, ''], [2 * a * b, '\\sin x'], [b * b, '\\sin x']]) + '$', '$' + terms([[a * a, ''], [a * b, '\\sin x'], [b * b, '\\sin^2 x']]) + '$'],
        '$(' + a + ' + ' + b + '\\sin x)^2 = ' + a * a + ' + ' + 2 * a * b + '\\sin x + ' + b * b + '\\sin^2 x$. Squaring term by term loses the cross term $2ab\\sin x$.');
    } },
    S('identity', 'Which identity is used to integrate $\\sin^2 x$?',
      ['$\\sin^2 x = \\frac{1}{2}(1 - \\cos 2x)$', '$\\sin^2 x = \\frac{1}{2}(1 + \\cos 2x)$', '$\\sin^2 x = 1 - \\cos 2x$', '$\\sin^2 x = \\frac{1}{2}(1 - \\cos x)$'], 0,
      'From $\\cos 2x = 1 - 2\\sin^2 x$ we get $\\sin^2 x = \\frac{1}{2}(1 - \\cos 2x)$. The version with a plus sign is for $\\cos^2 x$.'),
    { skill: 'solve-limit', gen: function () {
      var c = pick([2, 4, 6]), b = rint(2, 6), p = c * b * b / 2;
      return exact('The region under the curve $y = \\sqrt{' + cf(c, 'x') + '}$ between $x = 0$ and $x = b$ ($b \\gt 0$) is rotated through $360^\\circ$ about the $x$-axis. The volume is $' + p + '\\pi$. Find $b$.',
        b, '$V = \\pi\\int_0^b ' + cf(c, 'x') + '\\,dx = \\pi \\times ' + (c / 2) + 'b^2$. Setting $' + (c / 2) + 'b^2 = ' + p + '$ gives $b^2 = ' + (p * 2 / c) + '$, so $b = ' + b + '$ (the positive root, as $b \\gt 0$).');
    } },
    { skill: 'solve-limit', gen: function () {
      var a = pick([3, 6]), b = rint(1, 4), P = a * a * b * b * b / 3;
      return exact('The line $y = ' + a + 'x$ between $x = 0$ and $x = b$ ($b \\gt 0$) is rotated through $360^\\circ$ about the $x$-axis to form a cone of volume $' + P + '\\pi$. Find $b$.',
        b, '$V = \\pi\\int_0^b ' + a * a + 'x^2\\,dx = ' + (a * a / 3) + '\\pi b^3$. So $' + (a * a / 3) + 'b^3 = ' + P + '$, giving $b^3 = ' + (b * b * b) + '$ and $b = ' + b + '$.');
    } },
    S('formula', 'Which formula gives the volume when the region under $y = f(x)$ from $x = a$ to $x = b$ is rotated through $360^\\circ$ about the $x$-axis?',
      ['$V = \\pi\\int_a^b y^2\\,dx$', '$V = \\pi\\int_a^b y\\,dx$', '$V = \\int_a^b \\pi y\\,dx$', '$V = \\pi\\int_a^b x^2\\,dy$'], 0,
      'Each thin slice is a disc of radius $y$ and area $\\pi y^2$, so the volume is $\\pi\\int y^2\\,dx$. The last option is the $y$-axis formula.'),
    { skill: 'exp-integrate', gen: function () {
      var k = pick([2, 3, 4, 5]);
      return M('What is $\\int \\left(e^{' + k + 'x}\\right)^2\\,dx$?',
        '$\\frac{1}{' + 2 * k + '}e^{' + 2 * k + 'x} + c$', ['$\\frac{1}{' + k + '}e^{' + 2 * k + 'x} + c$', '$\\frac{1}{' + k * k + '}e^{' + k * k + 'x} + c$', '$\\frac{1}{' + 2 * k + '}e^{' + k + 'x} + c$'],
        '$\\left(e^{' + k + 'x}\\right)^2 = e^{' + 2 * k + 'x}$, and $\\int e^{mx}\\,dx = \\frac{1}{m}e^{mx}$ with $m = ' + 2 * k + '$.');
    } },
    { skill: 'power-sf', gen: function () {
      var a = rint(2, 5), L = rint(1, 3), v = Math.PI * a * a * Math.pow(L, 5) / 5;
      return sf3('The region under the curve $y = ' + cf(a, 'x^2') + '$ between $x = 0$ and $x = ' + L + '$ is rotated through $360^\\circ$ about the $x$-axis. Find the volume, to 3 significant figures.',
        v, '$y^2 = ' + a * a + 'x^4$, so $V = \\pi\\int_0^{' + L + '} ' + a * a + 'x^4\\,dx = \\pi \\times ' + frac(a * a * Math.pow(L, 5), 5) + ' = ' + R.roundSf(v, 3) + '$.');
    } }
  ] };

  // =====================================================================
  B['FPM-CAL-23'] = { title: 'Volumes of revolution between two boundaries', items: [
    { skill: 'curve-and-line', gen: function () {
      var k = pick([3, 6]), p = 2 * Math.pow(k, 5) / 15;
      return exact('The curve $y = x^2$ and the line $y = ' + k + 'x$ enclose a finite region, which is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'They meet where $x^2 = ' + k + 'x$, so $x = 0$ and $x = ' + k + '$. The line is the outer boundary, so $V = \\pi\\int_0^{' + k + '} (' + k * k + 'x^2 - x^4)\\,dx = \\pi\\left[' + (k * k / 3) + 'x^3 - \\frac{x^5}{5}\\right]_0^{' + k + '} = ' + n6(p) + '\\pi$.');
    } },
    { skill: 'chord-sf', gen: function () {
      var pr = pick([[-2, 2], [-1, 2], [-1, 3], [0, 2], [0, 3], [1, 3], [-2, 1]]), p = pr[0], q = pr[1], s = p + q, m = p * q;
      var G = function (x) { return s * s * x * x * x / 3 - s * m * x * x + m * m * x - Math.pow(x, 5) / 5; };
      var v = Math.PI * (G(q) - G(p));
      return sf3('The curve $y = x^2$ and the line $y = ' + terms([[s, 'x'], [-m, '']]) + '$ intersect at two points. The finite region between them is rotated through $360^\\circ$ about the $x$-axis. Find the volume, to 3 significant figures.',
        v, 'Solving $x^2 = ' + terms([[s, 'x'], [-m, '']]) + '$ gives $x = ' + p + '$ and $x = ' + q + '$. The line is above the curve between these, so $V = \\pi\\int_{' + p + '}^{' + q + '} \\left[(' + terms([[s, 'x'], [-m, '']]) + ')^2 - x^4\\right]dx = ' + R.roundSf(v, 3) + '$.');
    } },
    { skill: 'find-limits', gen: function () {
      var pr = pick([[-2, 3], [-1, 2], [-1, 3], [-3, 2], [-2, 4], [1, 4]]), p = pr[0], q = pr[1];
      return exact('The curve $y = x^2$ and the line $y = ' + terms([[p + q, 'x'], [-p * q, '']]) + '$ intersect at two points. Find the larger $x$-coordinate of the intersection points.',
        q, 'Set $x^2 = ' + terms([[p + q, 'x'], [-p * q, '']]) + '$, so $x^2 ' + terms([[-(p + q), 'x'], [p * q, '']]).replace(/^-/, '- ').replace(/^(\d)/, '+ $1') + ' = 0$, which factorises as $(x ' + (p < 0 ? '+ ' + (-p) : '- ' + p) + ')(x ' + (q < 0 ? '+ ' + (-q) : '- ' + q) + ') = 0$. The larger root is $x = ' + q + '$.');
    } },
    { skill: 'cone', gen: function () {
      var m = rint(1, 4), h = pick([3, 6]), p = m * m * h * h * h / 3;
      return exact('The region bounded by the line $y = ' + cf(m, 'x') + '$, the $x$-axis and the line $x = ' + h + '$ is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'Either integrate, $\\pi\\int_0^{' + h + '} ' + m * m + 'x^2\\,dx$, or use the cone formula: radius $' + m * h + '$ and height $' + h + '$ give $\\frac{1}{3}\\pi(' + m * h + ')^2(' + h + ') = ' + n6(p) + '\\pi$.');
    } },
    { skill: 'line-above-curve', gen: function () {
      var c = pick([4, 9, 16]), r = Math.sqrt(c), p = 4 * Math.pow(r, 5) / 5;
      return exact('The finite region bounded by the curve $y = x^2$, the line $y = ' + c + '$ and the $y$-axis (with $x \\geqslant 0$) is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'The curve meets $y = ' + c + '$ at $x = ' + r + '$. The line is the outer boundary: $V = \\pi\\int_0^{' + r + '} (' + c * c + ' - x^4)\\,dx = \\pi\\left[' + c * c + 'x - \\frac{x^5}{5}\\right]_0^{' + r + '} = ' + n6(p) + '\\pi$.');
    } },
    { skill: 'add-pieces', gen: function () {
      var m = rint(1, 3), L = rint(5, 7), p = m * m * 9 + m * m * 9 * (L - 3);
      return exact('The region $R$ is bounded by the line $y = ' + cf(m, 'x') + '$ for $0 \\leqslant x \\leqslant 3$, the line $y = ' + 3 * m + '$ for $3 \\leqslant x \\leqslant ' + L + '$, the line $x = ' + L + '$ and the $x$-axis. When $R$ is rotated through $360^\\circ$ about the $x$-axis the volume is $p\\pi$. Find $p$.',
        p, 'The first piece is a cone, radius $' + 3 * m + '$ and height $3$: $\\frac{1}{3}\\pi(' + 3 * m + ')^2(3) = ' + 9 * m * m + '\\pi$. The second is a cylinder, radius $' + 3 * m + '$ and height $' + (L - 3) + '$: $\\pi(' + 3 * m + ')^2(' + (L - 3) + ') = ' + 9 * m * m * (L - 3) + '\\pi$. Add them: $p = ' + p + '$.');
    } },
    { skill: 'set-up', gen: function () {
      var k = rint(2, 5);
      return M('The curve $y = x^2$ and the line $y = ' + k + 'x$ enclose a region rotated about the $x$-axis. Which integral gives the volume?',
        '$\\pi\\int_0^{' + k + '} (' + k * k + 'x^2 - x^4)\\,dx$', ['$\\pi\\int_0^{' + k + '} (' + k + 'x - x^2)^2\\,dx$', '$\\pi\\int_0^{' + k + '} (' + k + 'x - x^2)\\,dx$', '$\\int_0^{' + k + '} (' + k * k + 'x^2 - x^4)\\,dx$'],
        'The volume is the outer solid minus the inner one: $\\pi\\int (y_1^2 - y_2^2)\\,dx$ with $y_1^2 = ' + k * k + 'x^2$ and $y_2^2 = x^4$. Squaring the difference gives a different expression, and $\\pi$ is needed.');
    } },
    { skill: 'outer-inner', gen: function () {
      var k = rint(2, 6);
      return M('The curve $y = x^2$ and the line $y = ' + k + 'x$ enclose a region for $0 \\leqslant x \\leqslant ' + k + '$. When it is rotated about the $x$-axis, which is the outer boundary of the solid?',
        'The line $y = ' + k + 'x$', ['The curve $y = x^2$', 'The $x$-axis', 'Neither, they swap places halfway'],
        'Test a value in the middle: at $x = 1$ the line gives $y = ' + k + '$ and the curve gives $y = 1$. The line is higher (further from the axis) throughout the interval, so it is the outer boundary.');
    } },
    { skill: 'outer-inner', kind: 'num', q: 'The finite region between $y = \\sqrt{x}$ and $y = x^2$ is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find $p$.', answer: 0.3, tol: 1e-9, display: '$0.3$',
      why: 'The curves meet at $x = 0$ and $x = 1$, and $\\sqrt{x}$ is the outer boundary there. $V = \\pi\\int_0^1 (x - x^4)\\,dx = \\pi\\left[\\frac{x^2}{2} - \\frac{x^5}{5}\\right]_0^1 = \\pi\\left(\\frac{1}{2} - \\frac{1}{5}\\right) = 0.3\\pi$.' },
    { skill: 'negative-limits', gen: function () {
      var a = pick([2, 3]), v = 2 * Math.pow(a, 5) / 5;
      return exact('Evaluate $\\int_{-' + a + '}^{' + a + '} x^4\\,dx$.',
        v, '$\\left[\\frac{x^5}{5}\\right]_{-' + a + '}^{' + a + '} = \\frac{' + Math.pow(a, 5) + '}{5} - \\frac{(-' + a + ')^5}{5} = \\frac{' + Math.pow(a, 5) + '}{5} + \\frac{' + Math.pow(a, 5) + '}{5} = ' + n6(v) + '$. Take care: $(-' + a + ')^5$ is negative.');
    } },
    { skill: 'cylinder-minus-cone', gen: function () {
      var c = pick([3, 6]), p = 2 * c * c * c / 3;
      return exact('The finite region bounded by the line $y = x$, the line $y = ' + c + '$ and the $y$-axis is rotated through $360^\\circ$ about the $x$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'The lines meet at $x = ' + c + '$. The outer solid is a cylinder of radius ' + c + ' and length ' + c + ', volume $' + Math.pow(c, 3) + '\\pi$. The inner solid is a cone with the same radius and length, volume $\\frac{1}{3}\\pi(' + c + ')^2(' + c + ') = ' + Math.pow(c, 3) / 3 + '\\pi$. So $p = ' + Math.pow(c, 3) + ' - ' + Math.pow(c, 3) / 3 + ' = ' + n6(p) + '$.');
    } },
    S('why-not-squared-difference', 'Why is the volume between two boundaries not $\\pi\\int (y_1 - y_2)^2\\,dx$?',
      ['$(y_1 - y_2)^2 \\neq y_1^2 - y_2^2$; the solid is a big disc with a smaller disc removed, so the areas $\\pi y_1^2$ and $\\pi y_2^2$ are subtracted', 'The factor $\\pi$ should not be inside the integral', 'It is correct; both formulas always agree', 'The limits would have to be $y$-values'], 0,
      'Each slice is a washer: area $= \\pi y_1^2 - \\pi y_2^2$. Squaring the difference first drops the cross term $-2y_1y_2$, which gives a smaller, wrong answer.')
  ] };

  // =====================================================================
  B['FPM-CAL-24'] = { title: 'Volume of revolution about the y-axis', items: [
    { skill: 'x2-in-y', gen: function () {
      var a = pick([2, 4]), c = rint(0, 3), e = rint(2, 5), d = c + e, p = a * e * e / 2;
      return exact('The curve $C$ has equation $y = \\frac{x^2}{' + a + '}' + (c ? ' + ' + c : '') + '$. The region bounded by $C$, the $y$-axis and the line $y = ' + d + '$ is rotated through $360^\\circ$ about the $y$-axis. The volume is $k\\pi$. Find $k$.',
        p, 'Rearrange: $x^2 = ' + a + '(y' + (c ? ' - ' + c : '') + ')$. The $y$-limits are $' + c + '$ to $' + d + '$. $V = \\pi\\int_{' + c + '}^{' + d + '} ' + a + '(y' + (c ? ' - ' + c : '') + ')\\,dy = \\pi\\left[' + frac(a, 2) + '(y' + (c ? ' - ' + c : '') + ')^2\\right]_{' + c + '}^{' + d + '} = ' + n6(p) + '\\pi$.');
    } },
    { skill: 'rearrange', gen: function () {
      var m = rint(2, 4), c = rint(1, 5), sg = pick([-1, 1]);
      var inner = terms([[1, 'y'], [-sg * c, '']]);
      var line = terms([[m, 'x'], [sg * c, '']]);
      return M('A boundary of a region has equation $y = ' + line + '$. The region is rotated about the $y$-axis. Which expression is $x^2$ in terms of $y$?',
        '$\\frac{(' + inner + ')^2}{' + m * m + '}$', ['$\\frac{(' + inner + ')^2}{' + m + '}$', '$\\frac{y^2' + (sg > 0 ? ' - ' : ' + ') + c * c + '}{' + m * m + '}$', '$\\frac{' + inner + '}{' + m * m + '}$'],
        'Make $x$ the subject: $x = \\frac{' + inner + '}{' + m + '}$. Then square the whole fraction: $x^2 = \\frac{(' + inner + ')^2}{' + m * m + '}$. Squaring each term separately loses the cross term.');
    } },
    { skill: 'square-expression', gen: function () {
      var a = rint(2, 5), b = rint(1, 6);
      return M('A curve has equation $x = ' + a + 'y - ' + b + '$. Which expression is $x^2$?',
        '$' + terms([[a * a, 'y^2'], [-2 * a * b, 'y'], [b * b, '']]) + '$', ['$' + terms([[a * a, 'y^2'], [-b * b, '']]) + '$', '$' + terms([[a * a, 'y^2'], [b * b, '']]) + '$', '$' + terms([[a * a, 'y^2'], [-a * b, 'y'], [b * b, '']]) + '$'],
        '$(' + a + 'y - ' + b + ')^2 = ' + a * a + 'y^2 - ' + 2 * a * b + 'y + ' + b * b + '$. The middle term is $2 \\times ' + a + ' \\times ' + b + ' = ' + 2 * a * b + '$.');
    } },
    { skill: 'limits', gen: function () {
      var h = rint(3, 9);
      return M('The region bounded by the curve $y = x^2$, the $y$-axis and the line $y = ' + h + '$ is rotated through $360^\\circ$ about the $y$-axis. What are the limits of the integral $\\pi\\int x^2\\,dy$?',
        '$y = 0$ to $y = ' + h + '$', ['$x = 0$ to $x = ' + h + '$', '$y = 0$ to $y = \\sqrt{' + h + '}$', '$x = 0$ to $x = \\sqrt{' + h + '}$'],
        'When integrating with respect to $y$ the limits must be $y$-values. The region runs from the origin ($y = 0$) up to the line $y = ' + h + '$. The value $\\sqrt{' + h + '}$ is where the curve meets the line in the $x$ direction.');
    } },
    { skill: 'between-curves', gen: function () {
      var k = pick([3, 6]), p = Math.pow(k, 4) / 6;
      return exact('The curve $y = x^2$ and the line $y = ' + k + 'x$ enclose a finite region, which is rotated through $360^\\circ$ about the $y$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'They meet at $(0, 0)$ and $(' + k + ', ' + k * k + ')$. For each $y$, the curve ($x^2 = y$) is further from the axis than the line ($x^2 = y^2/' + k * k + '$). So $V = \\pi\\int_0^{' + k * k + '} \\left(y - \\frac{y^2}{' + k * k + '}\\right)dy = \\pi\\left[\\frac{y^2}{2} - \\frac{y^3}{' + 3 * k * k + '}\\right]_0^{' + k * k + '} = ' + n6(p) + '\\pi$.');
    } },
    { skill: 'find-limit', gen: function () {
      var d = rint(2, 5) * 2, V = d * d / 2;
      return exact('The region bounded by the curve $y = x^2$, the $y$-axis and the line $y = h$ ($h \\gt 0$) is rotated through $360^\\circ$ about the $y$-axis. The volume is $' + V + '\\pi$. Find $h$.',
        d, '$V = \\pi\\int_0^h y\\,dy = \\frac{\\pi h^2}{2}$. Setting $\\frac{h^2}{2} = ' + V + '$ gives $h^2 = ' + d * d + '$, so $h = ' + d + '$.');
    } },
    { skill: 'set-up', gen: function () {
      var c = rint(1, 3), d = c + rint(3, 5);
      return M('The region bounded by the curve $y = x^2 + ' + c + '$, the $y$-axis and the line $y = ' + d + '$ is rotated about the $y$-axis. Which integral gives the volume?',
        '$\\pi\\int_{' + c + '}^{' + d + '} (y - ' + c + ')\\,dy$', ['$\\pi\\int_{' + c + '}^{' + d + '} (y - ' + c + ')^2\\,dy$', '$\\pi\\int_0^{' + d + '} (y - ' + c + ')\\,dy$', '$\\pi\\int_0^{' + d + '} (x^2 + ' + c + ')^2\\,dx$'],
        '$x^2 = y - ' + c + '$, and the region starts at the vertex $y = ' + c + '$, not at $y = 0$. The integrand is $x^2$ (not $x^4$), and the last option is an $x$-axis volume.');
    } },
    { skill: 'sf', gen: function () {
      var m = pick([3, 5, 7]), c = rint(1, 3), e = rint(2, 6), v = Math.PI * e * e / (2 * m);
      return sf3('The curve $y = ' + c + ' + ' + m + 'x^2$ is used with the $y$-axis and the line $y = ' + (c + e) + '$ to bound a region, which is rotated through $360^\\circ$ about the $y$-axis. Find the volume, to 3 significant figures.',
        v, '$x^2 = \\frac{y - ' + c + '}{' + m + '}$, with $y$ from $' + c + '$ to $' + (c + e) + '$. $V = \\pi\\left[\\frac{(y - ' + c + ')^2}{' + 2 * m + '}\\right]_{' + c + '}^{' + (c + e) + '} = \\frac{' + e * e + '\\pi}{' + 2 * m + '} = ' + R.roundSf(v, 3) + '$.');
    } },
    { skill: 'cone', gen: function () {
      var pr = pick([[1, 3], [1, 6], [2, 6], [3, 9]]), m = pr[0], h = pr[1], p = Math.pow(h, 3) / (3 * m * m);
      return exact('The region bounded by the line $y = ' + cf(m, 'x') + '$, the $y$-axis and the line $y = ' + h + '$ is rotated through $360^\\circ$ about the $y$-axis. The volume is $p\\pi$. Find $p$.',
        p, 'Here $x = \\frac{y}{' + m + '}$, so $x^2 = \\frac{y^2}{' + m * m + '}$. $V = \\pi\\int_0^{' + h + '} \\frac{y^2}{' + m * m + '}\\,dy = \\pi \\times \\frac{' + Math.pow(h, 3) + '}{' + 3 * m * m + '} = ' + n6(p) + '\\pi$.');
    } },
    S('formula', 'A region is rotated through $360^\\circ$ about the $y$-axis between $y = c$ and $y = d$. Which formula gives the volume?',
      ['$V = \\pi\\int_c^d x^2\\,dy$', '$V = \\pi\\int_c^d y^2\\,dx$', '$V = \\pi\\int_c^d x\\,dy$', '$V = \\pi\\int_c^d y^2\\,dy$'], 0,
      'Each slice perpendicular to the $y$-axis is a disc of radius $x$, so the volume is $\\pi\\int x^2\\,dy$ between the $y$-limits.'),
    S('which-axis', 'Which statement about limits is correct for a region rotated about the $y$-axis?',
      ['The limits of the integral are $y$-values, because the variable of integration is $y$', 'The limits are the $x$-values where the curve meets the axes', 'The limits are always $0$ and the $x$-coordinate of the corner', 'The limits can be either $x$ or $y$ values, it does not matter'], 0,
      'You integrate $x^2$ with respect to $y$, so the limits must be values of $y$. Using $x$-values is the classic error.')
  ] };

  // =====================================================================
  B['FPM-CAL-25'] = { title: 'Velocity and acceleration by differentiating', items: [
    { skill: 'v-from-s', gen: function () {
      var a = rint(1, 3), b = rint(-4, 4), c = rint(-5, 8), d = rint(1, 9), t = rint(2, 4);
      var v = 3 * a * t * t + 2 * b * t + c;
      return exact('A particle $P$ moves in a straight line. Its displacement from a fixed point $O$ is $s$ metres at time $t$ seconds, where $s = ' + poly([d, c, b, a], 't') + '$. Find the velocity of $P$ when $t = ' + t + '$, in m/s.',
        v, '$v = \\frac{ds}{dt} = ' + poly([c, 2 * b, 3 * a], 't') + '$ (the constant $' + d + '$ differentiates to $0$). When $t = ' + t + '$, $v = ' + v + '$.', ' m/s');
    } },
    { skill: 'a-from-v', gen: function () {
      var a = rint(1, 4), b = rint(-6, 6), c = rint(-5, 9), t = rint(2, 5), acc = 2 * a * t + b;
      return exact('A particle $P$ moves in a straight line with velocity $v$ m/s at time $t$ seconds, where $v = ' + poly([c, b, a], 't') + '$. Find the acceleration of $P$ when $t = ' + t + '$, in m/s$^2$.',
        acc, '$a = \\frac{dv}{dt} = ' + poly([b, 2 * a], 't') + '$. When $t = ' + t + '$: $a = 2(' + a + ')(' + t + ') + (' + b + ') = ' + acc + '$.', ' m/s^2');
    } },
    { skill: 'a-from-s', gen: function () {
      var a = rint(1, 3), b = rint(-3, 4), c = rint(-4, 6), t = rint(2, 5), acc = 6 * a * t + 2 * b;
      return exact('The displacement of a particle from $O$ is $s = ' + poly([5, c, b, a], 't') + '$ metres at time $t$ seconds. Find the acceleration at $t = ' + t + '$, in m/s$^2$.',
        acc, 'Differentiate twice. $v = ' + poly([c, 2 * b, 3 * a], 't') + '$ and $a = \\frac{d^2s}{dt^2} = ' + poly([2 * b, 6 * a], 't') + '$. At $t = ' + t + '$, $a = ' + acc + '$.', ' m/s^2');
    } },
    { skill: 'trig', gen: function () {
      var A = rint(1, 4), w = pick([1, 2, 3]), acc = -A * w * w;
      var tt = w === 1 ? '\\frac{\\pi}{2}' : '\\frac{\\pi}{' + 2 * w + '}';
      return exact('A particle moves with displacement $s = ' + cf(A, '\\sin ' + (w === 1 ? '' : w) + 't') + '$ metres at time $t$ seconds ($t$ in radians). Find the acceleration when $t = ' + tt + '$, in m/s$^2$.',
        acc, '$v = ' + A * w + '\\cos ' + (w === 1 ? '' : w) + 't$ and $a = -' + A * w * w + '\\sin ' + (w === 1 ? '' : w) + 't$. When $t = ' + tt + '$ the angle is $\\frac{\\pi}{2}$, so $\\sin = 1$ and $a = ' + acc + '$.', ' m/s^2');
    } },
    { skill: 'exponential', gen: function () {
      var k = pick([1, 2, 3]), A = rint(1, 4), b = rint(-6, 6), v = A * k * Math.pow(2, k) + b;
      return exact('A particle has displacement $s = ' + terms([[A, 'e^{' + cf(k, 't') + '}'], [b, 't']]) + '$ metres at time $t$ seconds. Find its velocity when $t = \\ln 2$, in m/s.',
        v, '$v = ' + terms([[A * k, 'e^{' + cf(k, 't') + '}'], [b, '']]) + '$. When $t = \\ln 2$, $e^{' + cf(k, 't') + '} = 2^{' + k + '} = ' + Math.pow(2, k) + '$, so $v = ' + A * k + ' \\times ' + Math.pow(2, k) + terms([[b, '']]).replace(/^(-?)(\d)/, function (m, g, d) { return (g ? ' - ' : ' + ') + d; }) + ' = ' + v + '$.', ' m/s');
    } },
    { skill: 'change-in-position', gen: function () {
      var a = rint(1, 3), b = rint(-6, -1), t1 = rint(1, 2), t2 = t1 + rint(2, 3);
      var s = function (t) { return a * t * t * t + b * t * t + 4 * t; };
      return exact('A particle moves so that its displacement from $O$ is $s = ' + poly([0, 4, b, a], 't') + '$ metres at time $t$ seconds. Find how far the particle has moved (its change in displacement) between $t = ' + t1 + '$ and $t = ' + t2 + '$, in metres.',
        s(t2) - s(t1), '$s(' + t2 + ') = ' + s(t2) + '$ and $s(' + t1 + ') = ' + s(t1) + '$. The change is $' + s(t2) + ' - (' + s(t1) + ') = ' + (s(t2) - s(t1)) + '$. No differentiation is needed here.');
    } },
    { skill: 'distance-from-O', gen: function () {
      var h = rint(2, 5), c = rint(1, 6), t = rint(1, 3), s = t * t - 2 * h * t - c;
      return exact('The displacement of a particle from $O$ is $s = ' + poly([-c, -2 * h, 1], 't') + '$ metres at time $t$ seconds. Find the distance of the particle from $O$ when $t = ' + t + '$, in metres.',
        Math.abs(s), 'Substitute into $s$: $s(' + t + ') = ' + s + '$. The distance from $O$ is the size of the displacement, so it is $' + Math.abs(s) + '$ m.', ' m');
    } },
    { skill: 'constant-term', gen: function () {
      var a = rint(1, 3), b = rint(2, 6), c = rint(4, 15), t = rint(1, 4), acc = 3 * a * t * t + b;
      return exact('A particle has velocity $v = ' + poly([c, b, 0, a], 't') + '$ m/s at time $t$ seconds. Find its acceleration when $t = ' + t + '$, in m/s$^2$.',
        acc, '$a = \\frac{dv}{dt} = ' + poly([b, 0, 3 * a], 't') + '$. The constant $' + c + '$ differentiates to $0$. At $t = ' + t + '$, $a = ' + acc + '$.', ' m/s^2');
    } },
    { skill: 'initial-velocity', gen: function () {
      var a = rint(1, 3), b = rint(-4, 4), c = rint(-9, 9);
      return exact('The displacement of a particle is $s = ' + poly([2, c, b, a], 't') + '$ metres at time $t$ seconds. Find the velocity when $t = 0$, in m/s.',
        c, '$v = ' + poly([c, 2 * b, 3 * a], 't') + '$. At $t = 0$ only the constant term remains, so $v = ' + c + '$.', ' m/s');
    } },
    { skill: 'choose-expression', gen: function () {
      var a = rint(1, 4), b = rint(1, 5), c = rint(2, 7);
      return M('The displacement of a particle is $s = ' + poly([c, b, a], 't') + '$, with $s$ in metres and $t$ in seconds. Which expression is the acceleration?',
        '$' + 2 * a + '$', ['$' + poly([b, 2 * a], 't') + '$', '$' + poly([c, b, a], 't') + '$', '$' + poly([0, b, a], 't') + '$'],
        'Differentiate once for velocity: $v = ' + poly([b, 2 * a], 't') + '$. Differentiate again for acceleration: $a = ' + 2 * a + '$, a constant. The velocity is the first derivative, not the acceleration.');
    } },
    S('units', 'Displacement is in metres and time in seconds. What are the units of acceleration?',
      ['$\\text{m/s}^2$', '$\\text{m/s}$', '$\\text{m}$', '$\\text{s/m}$'], 0,
      'Acceleration is the rate of change of velocity (m/s) per second, which is m/s$^2$.'),
    S('which-first', 'Given $s$ as a function of $t$, you need the velocity at $t = 3$. What should you do?',
      ['Differentiate $s$ with respect to $t$, then substitute $t = 3$', 'Substitute $t = 3$ into $s$, then differentiate', 'Integrate $s$, then substitute $t = 3$', 'Differentiate $s$ twice, then substitute $t = 3$'], 0,
      'Velocity is $\\frac{ds}{dt}$. Substituting first turns $s$ into a constant, whose derivative is $0$. Differentiate first, then substitute.')
  ] };

  // =====================================================================
  B['FPM-CAL-26'] = { title: 'When is the particle at rest (or at a given velocity)?', items: [
    { skill: 'rest-from-s', gen: function () {
      var pr = pick([[1, 3], [1, 4], [2, 5], [1, 6], [2, 3], [3, 4]]), p = pr[0], q = pr[1];
      var cs = [0, 6 * p * q, -3 * (p + q), 2];
      return exact('A particle $P$ moves in a straight line. Its displacement from $O$ is $s = ' + poly(cs, 't') + '$ metres at time $t$ seconds, $t \\geqslant 0$. $P$ is instantaneously at rest twice. Find the later of the two times, in seconds.',
        q, 'At rest means $v = 0$. $v = \\frac{ds}{dt} = ' + poly([6 * p * q, -6 * (p + q), 6], 't') + ' = 6(t - ' + p + ')(t - ' + q + ')$. So $t = ' + p + '$ or $t = ' + q + '$; the later time is $' + q + '$.', ' s');
    } },
    { skill: 'position-at-rest', gen: function () {
      var pr = pick([[1, 3], [1, 4], [2, 5], [1, 6], [2, 3], [3, 4]]), p = pr[0], q = pr[1];
      var s = function (t) { return 2 * t * t * t - 3 * (p + q) * t * t + 6 * p * q * t; };
      return exact('A particle $P$ has displacement $s = ' + poly([0, 6 * p * q, -3 * (p + q), 2], 't') + '$ metres from $O$ at time $t$ seconds. $P$ is at rest at $t = ' + p + '$ and $t = ' + q + '$. Find the displacement of $P$ from $O$ at the later of these times.',
        s(q), 'Substitute $t = ' + q + '$ into $s$: $' + 2 * q * q * q + ' - ' + 3 * (p + q) * q * q + ' + ' + 6 * p * q * q + ' = ' + s(q) + '$ m. (A negative displacement means $P$ is on the other side of $O$.)', ' m');
    } },
    { skill: 'given-velocity', gen: function () {
      var t0 = rint(2, 6), u = rint(1, 4), c0 = rint(0, 6), V = c0 + t0 * u, b = u - t0;
      return exact('A particle has velocity $v = ' + poly([c0, b, 1], 't') + '$ m/s at time $t$ seconds, $t \\geqslant 0$. Find the value of $t$ when $v = ' + V + '$.',
        t0, 'Set $' + poly([c0, b, 1], 't') + ' = ' + V + '$, so $' + poly([c0 - V, b, 1], 't') + ' = 0$. This factorises as $(t - ' + t0 + ')(t + ' + u + ') = 0$, giving $t = ' + t0 + '$ or $t = -' + u + '$. Time cannot be negative, so $t = ' + t0 + '$.', ' s');
    } },
    { skill: 'acceleration-sign', gen: function () {
      var m = rint(2, 4), t0 = rint(2, 6), up = Math.random() < 0.5, c = m * t0;
      var a = up ? terms([[m, 't'], [-c, '']]) : terms([[-m, 't'], [c, '']]);
      var right = up ? '$t \\gt ' + t0 + '$' : '$0 \\leqslant t \\lt ' + t0 + '$';
      var wr = up ? ['$t \\lt ' + t0 + '$', '$t \\gt -' + t0 + '$', '$t \\gt ' + c + '$'] : ['$t \\gt ' + t0 + '$', '$t \\lt -' + t0 + '$', '$0 \\leqslant t \\lt ' + c + '$'];
      return M('A particle has acceleration $a = ' + a + '$ m/s$^2$ at time $t$ seconds, $t \\geqslant 0$. For which values of $t$ is $a \\gt 0$?',
        right, wr, 'Solve $' + a + ' \\gt 0$. ' + (up ? 'Add ' + c + ' and divide by the positive number ' + m + ': $t \\gt ' + t0 + '$.' : 'Add $' + m + 't$ to both sides: $' + c + ' \\gt ' + m + 't$, so $t \\lt ' + t0 + '$. With $t \\geqslant 0$ this is $0 \\leqslant t \\lt ' + t0 + '$. The negative coefficient of $t$ means the inequality ends up pointing the other way from the "$a \\gt 0$" you started with.'));
    } },
    { skill: 'acceleration-at-rest', gen: function () {
      var pr = pick([[1, 3], [2, 5], [1, 4], [2, 6], [3, 7]]), p = pr[0], q = pr[1];
      return exact('A particle has velocity $v = ' + poly([p * q, -(p + q), 1], 't') + '$ m/s at time $t$ seconds. It is at rest twice. Find the acceleration at the later time it is at rest, in m/s$^2$.',
        q - p, '$v = (t - ' + p + ')(t - ' + q + ')$, so rest at $t = ' + p + '$ and $t = ' + q + '$. $a = \\frac{dv}{dt} = 2t - ' + (p + q) + '$. At $t = ' + q + '$, $a = ' + 2 * q + ' - ' + (p + q) + ' = ' + (q - p) + '$.', ' m/s^2');
    } },
    { skill: 'return-to-O', gen: function () {
      var pr = pick([[1, 4], [2, 5], [3, 5], [2, 6], [1, 3]]), p = pr[0], q = pr[1];
      return exact('A particle has displacement $s = ' + poly([0, p * q, -(p + q), 1], 't') + '$ metres from $O$ at time $t$ seconds. For $t \\gt 0$ the particle is at $O$ twice. Find the later time, in seconds.',
        q, 'At $O$ means $s = 0$. $s = t(t^2 - ' + (p + q) + 't + ' + p * q + ') = t(t - ' + p + ')(t - ' + q + ')$. For $t \\gt 0$ the times are $' + p + '$ and $' + q + '$; the later is $' + q + '$.', ' s');
    } },
    { skill: 'at-rest-roots', gen: function () {
      var pr = pick([[2, 5], [1, 6], [3, 4], [2, 7], [1, 8]]), p = pr[0], q = pr[1];
      return M('A particle has velocity $v = ' + poly([p * q, -(p + q), 1], 't') + '$ m/s, $t \\geqslant 0$. At which times is it instantaneously at rest?',
        '$t = ' + p + '$ and $t = ' + q + '$', ['$t = -' + p + '$ and $t = -' + q + '$', '$t = -' + p + '$ and $t = ' + q + '$', '$t = ' + (p + q) + '$ and $t = ' + p * q + '$'],
        'Rest means $v = 0$: $t^2 - ' + (p + q) + 't + ' + p * q + ' = (t - ' + p + ')(t - ' + q + ') = 0$. Check the signs when factorising: roots multiply to $+' + p * q + '$ and add to $+' + (p + q) + '$.');
    } },
    { skill: 'reject-negative', gen: function () {
      var u = rint(1, 5), t0 = rint(2, 6);
      return M('Solving an equation for a particle gives $t = ' + t0 + '$ or $t = -' + u + '$, where $t \\geqslant 0$ is the time in seconds. What should be stated?',
        'The time is $t = ' + t0 + '$ s; the negative value is rejected', ['The times are $t = ' + t0 + '$ s and $t = -' + u + '$ s', 'The time is $t = -' + u + '$ s because it is smaller', 'The time is $t = ' + (t0 + u) + '$ s, the sum of the roots'],
        'Time cannot be negative here, so $t = -' + u + '$ is rejected and only $t = ' + t0 + '$ is valid.');
    } },
    { skill: 'zero-acceleration', gen: function () {
      var m = rint(1, 4), c = rint(1, 9), b = -3 * m;
      return exact('A particle has displacement $s = ' + poly([0, c, b, 1], 't') + '$ metres at time $t$ seconds. Find the time when its acceleration is zero.',
        m, '$v = ' + poly([c, 2 * b, 3], 't') + '$ and $a = ' + poly([2 * b, 6], 't') + '$. Setting $a = 0$: $6t = ' + -2 * b + '$, so $t = ' + m + '$.', ' s');
    } },
    { skill: 'hence', gen: function () {
      var m = rint(1, 4), c = rint(5, 15), b = -3 * m, v = 3 * m * m + 2 * b * m + c;
      return exact('A particle has displacement $s = ' + poly([0, c, b, 1], 't') + '$ metres at time $t$ seconds. The acceleration is zero at $t = ' + m + '$. Hence find the velocity of the particle at that time, in m/s.',
        v, '$v = \\frac{ds}{dt} = ' + poly([c, 2 * b, 3], 't') + '$. Substitute $t = ' + m + '$: $3(' + m * m + ') ' + (2 * b * m < 0 ? '- ' + (-2 * b * m) : '+ ' + 2 * b * m) + ' + ' + c + ' = ' + v + '$.', ' m/s');
    } },
    S('condition', 'A particle has displacement $s$, velocity $v$ and acceleration $a$ at time $t$. Which equation must be solved to find when the particle is instantaneously at rest?',
      ['$v = 0$', '$s = 0$', '$a = 0$', '$v = a$'], 0,
      'At rest means the velocity is zero. $s = 0$ means the particle is at the origin, and $a = 0$ means the velocity is momentarily not changing.')
  ] };

  // =====================================================================
  B['FPM-CAL-27'] = { title: 'Never at rest, and the least speed', items: [
    { skill: 'discriminant', gen: function () {
      var a = pick([1, 1, 2, 3]), b = rint(2, 6), c, disc;
      do { c = rint(2, 12); disc = b * b - 4 * a * c; } while (disc >= 0);
      return exact('A particle has velocity $v = ' + poly([c, -b, a], 't') + '$ m/s at time $t$ seconds. Work out the value of $b^2 - 4ac$ for the equation $v = 0$.',
        disc, 'Here $a = ' + a + '$, $b = -' + b + '$ and $c = ' + c + '$. $b^2 - 4ac = ' + b * b + ' - ' + 4 * a * c + ' = ' + disc + '$. It is negative, so $v = 0$ has no real roots.');
    } },
    { skill: 'conclusion', gen: function () {
      var neg = Math.random() < 0.5, a = 1, b = pick([4, 6, 8]), c, disc;
      do { c = rint(2, 20); disc = b * b - 4 * a * c; } while (neg ? disc >= 0 : disc <= 0);
      var D = 'The discriminant is $' + disc + '$';
      var good = neg ? D + ', which is less than $0$, so $v = 0$ has no real roots and $P$ never comes to rest' : D + ', which is greater than $0$, so $v = 0$ has real roots and $P$ does come to rest';
      var bad1 = neg ? D + ', which is less than $0$, so $v = 0$ has two roots and $P$ comes to rest twice' : D + ', which is greater than $0$, so $v = 0$ has no real roots and $P$ never comes to rest';
      var bad2 = D + ', so $P$ is moving in the negative direction at all times';
      var bad3 = D + ', so the answer cannot be decided without finding $t$';
      return M('A particle has velocity $v = ' + poly([c, -b, 1], 't') + '$ m/s for $t \\geqslant 0$. Which conclusion is correct?',
        good + '.', [bad1 + '.', bad2 + '.', bad3 + '.'],
        '$b^2 - 4ac = ' + b * b + ' - ' + 4 * c + ' = ' + disc + '$. ' + (neg ? 'A negative discriminant means no real roots, so $v$ is never $0$.' : 'A positive discriminant means two real roots, so $v = 0$ happens.'));
    } },
    { skill: 'least-speed', gen: function () {
      var h = rint(2, 6), k = rint(1, 9), c = h * h + k;
      return exact('A particle has velocity $v = ' + poly([c, -2 * h, 1], 't') + '$ m/s at time $t$ seconds. By completing the square, find the least value of $v$, in m/s.',
        k, '$' + poly([c, -2 * h, 1], 't') + ' = (t - ' + h + ')^2 + ' + k + '$. A square is at least $0$, so the least value of $v$ is $' + k + '$ m/s, reached at $t = ' + h + '$.', ' m/s');
    } },
    { skill: 'least-speed', gen: function () {
      var a = rint(2, 4), h = rint(1, 4), k = rint(1, 8);
      return exact('A particle has velocity $v = ' + poly([a * h * h + k, -2 * a * h, a], 't') + '$ m/s at time $t$ seconds. Find the least speed of the particle, in m/s.',
        k, 'Complete the square: $v = ' + a + '(t - ' + h + ')^2 + ' + k + '$. The bracket squared is at least $0$, so the least value is $' + k + '$. Since $v$ is always positive, the least speed is $' + k + '$ m/s.', ' m/s');
    } },
    { skill: 'time-of-least', gen: function () {
      var h = rint(2, 7), k = rint(1, 9);
      return exact('A particle has velocity $v = ' + poly([h * h + k, -2 * h, 1], 't') + '$ m/s. Using differentiation, find the value of $t$ at which the speed is least.',
        h, '$\\frac{dv}{dt} = 2t - ' + 2 * h + '$. Setting this to $0$ gives $t = ' + h + '$. (This is where $a = 0$.)', ' s');
    } },
    { skill: 'completed-square', gen: function () {
      var h = rint(2, 5), k = rint(1, 9), b = 2 * h, c = h * h + k;
      return M('Which is $t^2 - ' + b + 't + ' + c + '$ written in completed-square form?',
        '$(t - ' + h + ')^2 + ' + k + '$', ['$(t + ' + h + ')^2 + ' + k + '$', '$(t - ' + b + ')^2 + ' + k + '$', '$(t - ' + h + ')^2 + ' + c + '$'],
        'Half of $-' + b + '$ is $-' + h + '$, so $t^2 - ' + b + 't = (t - ' + h + ')^2 - ' + h * h + '$. Then add $' + c + '$: $(t - ' + h + ')^2 + ' + c + ' - ' + h * h + ' = (t - ' + h + ')^2 + ' + k + '$.');
    } },
    { skill: 'unknown-constant', gen: function () {
      var h = rint(2, 6);
      return exact('A particle has velocity $v = t^2 - ' + 2 * h + 't + k$ m/s, where $k$ is an integer. Find the least value of $k$ for which the particle is never at rest.',
        h * h + 1, 'Never at rest needs no real roots: $b^2 - 4ac = ' + 4 * h * h + ' - 4k \\lt 0$, so $k \\gt ' + h * h + '$. The least integer value is $k = ' + (h * h + 1) + '$.');
    } },
    { skill: 'discriminant', gen: function () {
      var h = rint(2, 5), k = rint(1, 6), c = h * h + k;
      return M('To show that $v = ' + poly([c, -2 * h, 1], 't') + '$ is never zero, which working is complete and correct?',
        '$(t - ' + h + ')^2 + ' + k + ' \\geqslant ' + k + ' \\gt 0$, so $v \\neq 0$ for all $t$', ['$(t - ' + h + ')^2 + ' + k + ' = 0$ gives $t = ' + h + '$, so $v = 0$ at $t = ' + h + '$', '$(t - ' + h + ')^2 \\geqslant 0$, so $v \\geqslant 0$ and $v$ can be $0$', '$b^2 - 4ac = ' + (4 * h * h - 4 * c) + '$, which is negative, so there are two roots'],
        'Completing the square gives $(t - ' + h + ')^2 + ' + k + '$, which is at least $' + k + '$ because a square cannot be negative. So $v$ is always positive and never $0$. (The discriminant here is $' + (4 * h * h - 4 * c) + '$, which is negative and means no roots, not two.)');
    } },
    S('proof-step', 'A student shows a particle is never at rest. For $v = t^2 - 6t + 10$ they write: Step 1, $b^2 - 4ac = 36 - 40$. Step 2, $= -4$. Step 3, since $-4 \\lt 0$, $v = 0$ has two real roots. Step 4, so $P$ is never at rest. Which step is wrong?',
      ['Step 3', 'Step 1', 'Step 2', 'Step 4'], 0,
      'A negative discriminant means no real roots, not two. The chain then reads: no real roots, so $v$ is never $0$, so $P$ is never at rest.'),
    S('inequality-direction', 'For $v = at^2 + bt + c$, which condition shows that $P$ never comes to rest?',
      ['$b^2 - 4ac \\lt 0$', '$b^2 - 4ac \\gt 0$', '$b^2 - 4ac = 0$', '$b^2 - 4ac \\geqslant 0$'], 0,
      '$v = 0$ must have no real solutions, which happens when the discriminant is negative. Zero gives one repeated root (momentary rest) and positive gives two.'),
    S('conclusion', 'After showing $b^2 - 4ac \\lt 0$ for $v = 0$, what is the conclusion that earns the final mark?',
      ['There are no real values of $t$ with $v = 0$, so $P$ is never instantaneously at rest', 'The value of $b^2 - 4ac$ is negative', 'The particle has stopped moving', 'The discriminant is $-12$'], 0,
      'The calculation alone is not the conclusion. You must say what it means: $v = 0$ has no real roots, so the particle never comes to rest.')
  ] };

  // =====================================================================
  B['FPM-CAL-28'] = { title: 'Velocity and displacement by integrating', items: [
    { skill: 'v-from-a', gen: function () {
      var p = 2 * rint(1, 3), q = rint(-4, 5), u = rint(0, 6), T = rint(2, 4);
      var v = p / 2 * T * T + q * T + u;
      return exact('A particle moves in a straight line. Its acceleration is $a = ' + poly([q, p], 't') + '$ m/s$^2$ at time $t$ seconds. When $t = 0$ its velocity is $' + u + '$ m/s. Find the velocity when $t = ' + T + '$, in m/s.',
        v, '$v = \\int a\\,dt = ' + poly([0, q, p / 2], 't') + ' + c$. When $t = 0$, $v = ' + u + '$, so $c = ' + u + '$. At $t = ' + T + '$: $v = ' + v + '$.', ' m/s');
    } },
    { skill: 's-from-v', gen: function () {
      var A = rint(1, 3), B2 = rint(-3, 3), r = rint(-4, 6), s0 = rint(0, 7), T = rint(2, 3);
      var s = A * T * T * T + B2 * T * T + r * T + s0;
      return exact('A particle moves in a straight line with velocity $v = ' + poly([r, 2 * B2, 3 * A], 't') + '$ m/s at time $t$ seconds. When $t = 0$ the particle is ' + s0 + ' m from $O$ (displacement $s = ' + s0 + '$). Find its displacement from $O$ when $t = ' + T + '$, in metres.',
        s, '$s = \\int v\\,dt = ' + poly([0, r, B2, A], 't') + ' + c$. At $t = 0$, $s = ' + s0 + '$, so $c = ' + s0 + '$. At $t = ' + T + '$: $s = ' + s + '$.', ' m');
    } },
    { skill: 'starts-at-rest', gen: function () {
      var p = 2 * rint(1, 3), q = rint(1, 6), T = rint(2, 5), v = p / 2 * T * T + q * T;
      return exact('A particle starts from rest. Its acceleration is $a = ' + poly([q, p], 't') + '$ m/s$^2$ at time $t$ seconds. Find its velocity at $t = ' + T + '$, in m/s.',
        v, 'Starts from rest means $v = 0$ when $t = 0$. $v = ' + poly([0, q, p / 2], 't') + ' + c$ and $c = 0$. So at $t = ' + T + '$, $v = ' + v + '$.', ' m/s');
    } },
    { skill: 'condition-not-at-zero', gen: function () {
      var p = 2 * rint(1, 3), q = rint(-3, 4), t0 = rint(1, 3), w = rint(3, 12), T = t0 + rint(1, 3);
      var c = w - (p / 2 * t0 * t0 + q * t0), v = p / 2 * T * T + q * T + c;
      return exact('A particle moves with acceleration $a = ' + poly([q, p], 't') + '$ m/s$^2$. When $t = ' + t0 + '$ its velocity is $' + w + '$ m/s. Find its velocity when $t = ' + T + '$, in m/s.',
        v, '$v = ' + poly([0, q, p / 2], 't') + ' + c$. Use the condition at $t = ' + t0 + '$ (not at $t = 0$): $' + w + ' = ' + (p / 2 * t0 * t0 + q * t0) + ' + c$, so $c = ' + c + '$. Then $v(' + T + ') = ' + v + '$.', ' m/s');
    } },
    { skill: 'initial-position', gen: function () {
      var A = rint(1, 3), B2 = rint(-2, 3), r = rint(-3, 5), s0 = rint(1, 8), T = rint(2, 3);
      var ST = A * T * T * T + B2 * T * T + r * T + s0;
      return exact('A particle has velocity $v = ' + poly([r, 2 * B2, 3 * A], 't') + '$ m/s. When $t = ' + T + '$ its displacement from $O$ is $' + ST + '$ m. Find its displacement from $O$ when $t = 0$, in metres.',
        s0, '$s = ' + poly([0, r, B2, A], 't') + ' + c$. Using $s = ' + ST + '$ at $t = ' + T + '$: $' + ST + ' = ' + (ST - s0) + ' + c$, so $c = ' + s0 + '$. At $t = 0$, $s = c = ' + s0 + '$.', ' m');
    } },
    { skill: 'antiderivative', gen: function () {
      var c = pick([3, 5, 7, 9, 11, 13]), d = rint(2, 8);
      return M('Which is $\\int (' + c + 't + ' + d + ')\\,dt$?',
        '$' + frac(c, 2) + 't^2 + ' + d + 't + c$', ['$' + c + 't^2 + ' + d + 't + c$', '$' + frac(c, 2) + 't^2 + ' + d + ' + c$', '$' + c + ' + c$'],
        'Raise each power by one and divide by the new power: $\\int ' + c + 't\\,dt = \\frac{' + c + '}{2}t^2$ and $\\int ' + d + '\\,dt = ' + d + 't$. Do not forget $+c$.');
    } },
    { skill: 'constant', gen: function () {
      var m = rint(1, 4), u = rint(2, 9);
      return M('A particle has acceleration $a = ' + 2 * m + 't$ m/s$^2$ and velocity $' + u + '$ m/s when $t = 0$. Which is the velocity at time $t$?',
        '$v = ' + cf(m, 't^2') + ' + ' + u + '$', ['$v = ' + cf(m, 't^2') + '$', '$v = ' + cf(2 * m, 't^2') + ' + ' + u + '$', '$v = ' + cf(m, 't^2') + ' + ' + u + 't$'],
        '$v = \\int ' + 2 * m + 't\\,dt = ' + cf(m, 't^2') + ' + c$. At $t = 0$, $v = ' + u + '$, so $c = ' + u + '$. Without $c$ the starting velocity is lost.');
    } },
    { skill: 'trig', gen: function () {
      var w = pick([1, 2, 3]), A = w * rint(1, 4), u = rint(0, 5);
      var v = A / w + u;
      return exact('A particle has acceleration $a = ' + cf(A, '\\cos ' + (w === 1 ? '' : w) + 't') + '$ m/s$^2$ at time $t$ seconds ($t$ in radians) and velocity $' + u + '$ m/s when $t = 0$. Find its velocity when $t = \\frac{\\pi}{' + 2 * w + '}$, in m/s.',
        v, '$v = \\int ' + cf(A, '\\cos ' + (w === 1 ? '' : w) + 't') + '\\,dt = ' + cof(A / w) + '\\sin ' + (w === 1 ? '' : w) + 't + c$. At $t = 0$, $c = ' + u + '$. At $t = \\frac{\\pi}{' + 2 * w + '}$ the sine is $1$, so $v = ' + (A / w) + ' + ' + u + ' = ' + v + '$.', ' m/s');
    } },
    { skill: 'exponential', gen: function () {
      var k = pick([1, 2, 3]), A = k * rint(1, 4), s0 = rint(0, 6), s = A / k + s0;
      return exact('A particle has velocity $v = ' + cf(A, 'e^{' + cf(k, 't') + '}') + '$ m/s. When $t = 0$ its displacement is $' + s0 + '$ m. Find its displacement when $t = \\frac{\\ln 2}{' + k + '}$, in metres.',
        s + 0 * A, '$s = \\int ' + cf(A, 'e^{' + cf(k, 't') + '}') + '\\,dt = ' + frac(A, k) + 'e^{' + cf(k, 't') + '} + c$. At $t = 0$: $' + s0 + ' = ' + frac(A, k) + ' + c$, so $c = ' + n6(s0 - A / k) + '$. At $t = \\frac{\\ln 2}{' + k + '}$, $e^{' + cf(k, 't') + '} = 2$, so $s = ' + n6(2 * A / k) + ' + (' + n6(s0 - A / k) + ') = ' + n6(A / k + s0) + '$.', ' m');
    } },
    { skill: 'find-c', gen: function () {
      var A = rint(1, 3), B2 = rint(1, 5), c = rint(-6, 9), t0 = rint(1, 3), w = A * t0 * t0 + B2 * t0 + c;
      return exact('A particle has velocity $v = ' + poly([0, B2, A], 't') + ' + c$ m/s, where $c$ is a constant. When $t = ' + t0 + '$ the velocity is $' + w + '$ m/s. Find $c$.',
        c, 'Substitute $t = ' + t0 + '$: $' + A * t0 * t0 + ' + ' + B2 * t0 + ' + c = ' + w + '$, so $c = ' + w + ' - ' + (A * t0 * t0 + B2 * t0) + ' = ' + c + '$.');
    } },
    S('what-to-do', 'You are given the acceleration of a particle as a function of $t$ and asked for its displacement. What is the sequence of operations?',
      ['Integrate to get $v$ (with $+c$), use a condition to find $c$, integrate again for $s$ (with a new constant), use another condition', 'Differentiate twice and substitute the time', 'Integrate once and substitute the time', 'Integrate twice, taking both constants as $0$'], 0,
      'Going $a \\to v \\to s$ needs two integrations, and each brings in a constant that must be fixed from the given conditions.')
  ] };

  // =====================================================================
  B['FPM-CAL-29'] = { title: 'Distance travelled by integrating velocity', items: [
    { skill: 'no-turn', gen: function () {
      var k = rint(1, 8), T = pick([3, 6]), d = T * T * T / 3 + k * T;
      return exact('A particle moves in a straight line with velocity $v = t^2 + ' + k + '$ m/s at time $t$ seconds. It is always moving in the positive direction. Find the distance it travels in the interval $0 \\leqslant t \\leqslant ' + T + '$, in metres.',
        T * T * T / 3 + k * T, '$v \\gt 0$ throughout, so there is no change of direction. Distance $= \\int_0^{' + T + '} (t^2 + ' + k + ')\\,dt = \\left[\\frac{t^3}{3} + ' + k + 't\\right]_0^{' + T + '} = ' + d + '$ m.', ' m');
    } },
    { skill: 'turn-total', gen: function () {
      var pr = pick([[1, 3], [2, 4], [1, 5], [3, 5], [2, 6]]), p = pr[0], q = pr[1], T = q + rint(1, 2);
      var pts = [0, p, q, T], d = 0, i;
      for (i = 1; i < pts.length; i++) d += Math.abs(Fv(p, q, pts[i]) - Fv(p, q, pts[i - 1]));
      return exact('A particle moves in a straight line with velocity $v = ' + vexp(p, q) + '$ m/s at time $t$ seconds. Find the total distance travelled in the interval $0 \\leqslant t \\leqslant ' + T + '$, in metres.',
        d, '$v = 3(t - ' + p + ')(t - ' + q + ')$, so $v = 0$ at $t = ' + p + '$ and $t = ' + q + '$: the direction changes. Integrating, $s = t^3 - ' + n6(1.5 * (p + q)) + 't^2 + ' + 3 * p * q + 't$. The movements are $|s(' + p + ') - s(0)| = ' + Math.abs(Fv(p, q, p)) + '$, $|s(' + q + ') - s(' + p + ')| = ' + Math.abs(Fv(p, q, q) - Fv(p, q, p)) + '$ and $|s(' + T + ') - s(' + q + ')| = ' + Math.abs(Fv(p, q, T) - Fv(p, q, q)) + '$. Total $= ' + n6(d) + '$ m.', ' m');
    } },
    { skill: 'displacement-vs-distance', gen: function () {
      var pr = pick([[1, 3], [2, 4], [1, 5], [3, 5], [2, 6]]), p = pr[0], q = pr[1], T = q + rint(1, 2), disp = Fv(p, q, T) - Fv(p, q, 0);
      return exact('A particle moves in a straight line with velocity $v = ' + vexp(p, q) + '$ m/s at time $t$ seconds. Find its displacement (the change in position) between $t = 0$ and $t = ' + T + '$, in metres.',
        disp, 'Displacement is the single integral $\\int_0^{' + T + '} v\\,dt = [t^3 - ' + n6(1.5 * (p + q)) + 't^2 + ' + 3 * p * q + 't]_0^{' + T + '} = ' + disp + '$ m. Unlike distance, backward movement is allowed to cancel forward movement.', ' m');
    } },
    { skill: 'between-rests', gen: function () {
      var p = rint(1, 3), q = p + 2 * rint(1, 3), d = Math.pow(q - p, 3) / 2;
      return exact('A particle has velocity $v = ' + vexp(p, q) + '$ m/s. It is instantaneously at rest at the points $M$ ($t = ' + p + '$) and $N$ ($t = ' + q + '$). Find the distance $MN$, in metres.',
        d, '$MN = \\left|\\int_{' + p + '}^{' + q + '} 3(t - ' + p + ')(t - ' + q + ')\\,dt\\right|$. Using the antiderivative $t^3 - ' + n6(1.5 * (p + q)) + 't^2 + ' + 3 * p * q + 't$: $s(' + q + ') - s(' + p + ') = ' + (Fv(p, q, q) - Fv(p, q, p)) + '$. Distance is the size: $' + n6(d) + '$ m.', ' m');
    } },
    { skill: 'change-of-direction', gen: function () {
      var b = pick([4, 6, 8]), c, disc, yes = Math.random() < 0.5;
      do { c = rint(3, 25); disc = b * b - 4 * c; } while (yes ? disc <= 0 : disc >= 0);
      var T = b + 1;
      var right = yes ? 'Yes, because $b^2 - 4ac = ' + disc + ' \\gt 0$, so $v = 0$ has two roots' : 'No, because $b^2 - 4ac = ' + disc + ' \\lt 0$, so $v = 0$ has no real roots';
      var wr = yes ? ['No, because $b^2 - 4ac = ' + disc + ' \\gt 0$, so $v = 0$ has no real roots', 'No, because $v$ is positive at $t = 0$', 'Yes, because the discriminant is not zero'] : ['Yes, because $b^2 - 4ac = ' + disc + ' \\lt 0$, so $v = 0$ has two roots', 'Yes, because $v$ is positive at $t = 0$', 'No, because the discriminant is not zero'];
      return M('A particle has velocity $v = ' + poly([c, -b, 1], 't') + '$ m/s. Does the particle change direction in the interval $0 \\leqslant t \\leqslant ' + T + '$?',
        right, wr, 'A change of direction needs $v$ to change sign, which means a root of $v = 0$ in the interval. For $v = ' + poly([c, -b, 1], 't') + '$ the discriminant is $' + b * b + ' - ' + 4 * c + ' = ' + disc + '$. ' + (yes ? 'Positive: the roots are ' + n6((b - Math.sqrt(disc)) / 2) + ' and ' + n6((b + Math.sqrt(disc)) / 2) + ', both in the interval, so the direction changes.' : 'Negative: no roots, so $v$ keeps one sign and the particle never turns.'));
    } },
    { skill: 'trig-distance', gen: function () {
      var w = pick([1, 2]), A = w * rint(1, 4), d = 2 * A / w;
      return exact('A particle moves with velocity $v = ' + cf(A, '\\cos ' + (w === 1 ? '' : w) + 't') + '$ m/s at time $t$ seconds, where $t$ is in radians. Find the total distance travelled from $t = 0$ to $t = \\frac{\\pi}{' + w + '}$, in metres.',
        d, '$v = 0$ when $' + (w === 1 ? '' : w) + 't = \\frac{\\pi}{2}$, i.e. at $t = \\frac{\\pi}{' + 2 * w + '}$, inside the interval. From $0$ to there: $\\left[' + cof(A / w) + '\\sin ' + (w === 1 ? '' : w) + 't\\right] = ' + (A / w) + '$. After it, the particle returns by the same amount. Total $= 2 \\times ' + (A / w) + ' = ' + d + '$ m.', ' m');
    } },
    { skill: 'trig-distance', gen: function () {
      var w = pick([1, 2]), A = w * rint(1, 4);
      return exact('A particle moves with velocity $v = ' + cf(A, '\\cos ' + (w === 1 ? '' : w) + 't') + '$ m/s at time $t$ seconds, where $t$ is in radians. Find its displacement from its position at $t = 0$ to its position at $t = \\frac{\\pi}{' + w + '}$, in metres.',
        0, '$\\int_0^{\\pi/' + w + '} ' + cf(A, '\\cos ' + (w === 1 ? '' : w) + 't') + '\\,dt = ' + cof(A / w) + '[\\sin ' + (w === 1 ? '' : w) + 't]_0^{\\pi/' + w + '} = ' + cof(A / w) + '(\\sin \\pi - \\sin 0) = 0$. The particle goes out and comes back, so its displacement is $0$ even though it has travelled a distance.', ' m');
    } },
    { skill: 'quadratic-sf', gen: function () {
      var c = 2 * rint(1, 3), T = c + rint(1, 3), F = function (t) { return t * t * t / 3 - c * t * t / 2; };
      var d = Math.abs(F(c) - F(0)) + Math.abs(F(T) - F(c));
      return sf3('A particle has velocity $v = t^2 - ' + c + 't$ m/s at time $t$ seconds. Find the total distance travelled in $0 \\leqslant t \\leqslant ' + T + '$, to 3 significant figures.',
        d, '$v = t(t - ' + c + ')$, which is $0$ at $t = ' + c + '$ and negative for $0 \\lt t \\lt ' + c + '$. With $s = \\frac{t^3}{3} - ' + frac(c, 2) + 't^2$: first stage $|s(' + c + ') - s(0)| = ' + n6(Math.abs(F(c))) + '$, second stage $s(' + T + ') - s(' + c + ') = ' + n6(F(T) - F(c)) + '$. Total $= ' + n6(d) + '$, which is $' + R.roundSf(d, 3) + '$ to 3 s.f.');
    } },
    { skill: 'method', gen: function () {
      var p = rint(1, 3), q = p + rint(2, 3);
      return M('A particle has velocity $v$ and is instantaneously at rest at $t = ' + p + '$ and $t = ' + q + '$. The velocity is positive for $0 \\leqslant t \\lt ' + p + '$ and negative for $' + p + ' \\lt t \\lt ' + q + '$. Which expression gives the distance travelled for $0 \\leqslant t \\leqslant ' + q + '$?',
        '$\\left|\\int_0^{' + p + '} v\\,dt\\right| + \\left|\\int_{' + p + '}^{' + q + '} v\\,dt\\right|$', ['$\\int_0^{' + q + '} v\\,dt$', '$\\left|\\int_0^{' + q + '} v\\,dt\\right|$', '$\\int_0^{' + p + '} v\\,dt$'],
        'The particle changes direction at $t = ' + p + '$, so split there and take the size of each part before adding. A single integral over the whole interval lets the backward movement cancel the forward movement.');
    } },
    S('error-spot', 'A student finds the distance for a particle that turns round by working out $\\int_0^6 v\\,dt = 0$ and says the particle has travelled $0$ m. What is wrong?',
      ['The integral gives displacement; distance needs the integral split where $v = 0$ and the sizes added', 'The limits should be $1$ and $6$', 'The integral should be of $s$, not $v$', 'Nothing, $0$ is correct because displacement and distance are the same thing'], 0,
      'A single integral gives the net change in position. Forward and backward movement cancel, so you must split at the times where $v = 0$ and add the sizes.')
  ] };
})();
