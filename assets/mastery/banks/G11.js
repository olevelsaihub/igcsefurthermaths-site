/* Group G11 mastery bank: Angles between planes and angles in solids; Volumes with trig; Double-angle and addition formulae; Product and sum formulae; Solving trig equations. Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function fr(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; if (d === 1) return String(n); return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}'; }
  function deg(x) { return x * 180 / Math.PI; }
  function rad(x) { return x * Math.PI / 180; }
  function r7(x) { return Math.round(x * 1e7) / 1e7 + 0; }
  function D(n) { return n + '^\\circ'; }
  // build a polynomial-like expression from [coef, text] pairs, skipping zeros, no "+ -" or "1x"
  function poly(parts) {
    var s = '';
    parts.forEach(function (p) {
      var c = p[0], t = p[1]; if (c === 0) return;
      var neg = c < 0, a = Math.abs(c), body = t === '' ? String(a) : (a === 1 ? t : a + t);
      if (s === '') s = (neg ? '-' : '') + body; else s += (neg ? ' - ' : ' + ') + body;
    });
    return s || '0';
  }
  function coef(c) { return c === 1 ? '' : String(c); }
  function pr(x) { return x < 0 ? '(' + x + ')' : String(x); }
  // multiple-angle text: 7x, x
  function mx(n, v) { v = v || 'x'; return n === 1 ? v : n + v; }
  // mcq object: correct option first, up to 3 distinct distractors
  function mk(q, correct, ds, why) {
    var opts = [correct];
    ds.forEach(function (d) { if (opts.indexOf(d) < 0 && opts.length < 4) opts.push(d); });
    return { kind: 'mcq', q: q, options: opts, answer: 0, why: why };
  }
  function fix(skill, o) { o.skill = skill; return o; }
  function G(skill, fn) { return { skill: skill, gen: fn }; }
  function num(q, ans, why, tol, display) {
    return { kind: 'num', q: q, answer: ans, tol: tol || 1e-9, unit: '', display: display || ('$' + ans + '$'), why: why };
  }
  // solutions of f(k x + c) = v for x in [lo, hi) (or [lo, hi] when closed). f: 'sin' | 'cos' | 'tan'. Degrees.
  function sols(f, v, k, c, lo, hi, closed) {
    var base, per;
    if (f === 'sin') { var p = deg(Math.asin(v)); base = [p, 180 - p]; per = 360; }
    else if (f === 'cos') { var p2 = deg(Math.acos(v)); base = [p2, -p2]; per = 360; }
    else { base = [deg(Math.atan(v))]; per = 180; }
    var out = [];
    for (var n = -40; n <= 40; n++) base.forEach(function (b) {
      var x = r7(((b + n * per) - c) / k);
      if (x >= lo - 1e-9 && (closed ? x <= hi + 1e-9 : x < hi - 1e-9) && out.indexOf(x) < 0) out.push(x);
    });
    return out.sort(function (a, b) { return a - b; });
  }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function isQuarter(x) { return Math.abs(x * 4 - Math.round(x * 4)) < 1e-6; }

  // =====================================================================
  // FPM-TRI-17 Angle between two sloping faces with the cosine rule
  // =====================================================================
  var PYR = [[3, 5, 4], [5, 13, 12], [6, 10, 8], [9, 15, 12], [8, 17, 15]];   // half-base, slant edge, height of a triangular face
  function pyr() { var t = pick(PYR); return { hb: t[0], l: t[1], fh: t[2], a: 2 * t[0] }; }
  function pyrText(P) { return 'VABCD is a right pyramid with a square base ABCD of side ' + P.a + ' cm. The slant edges VA, VB, VC and VD are each ' + P.l + ' cm long.'; }
  function pyrCos(P) { var p2 = Math.pow(P.a * P.fh / P.l, 2), d2 = 2 * P.a * P.a; return (2 * p2 - d2) / (2 * p2); }

  B['FPM-TRI-17'] = { title: 'Angle between two sloping faces with the cosine rule', items: [
    G('perpendicular', function () {
      var P = pyr(), p = R.roundDp(P.a * P.fh / P.l, 2);
      return num(pyrText(P) + ' The perpendicular from B to VA meets VA at M. Find the length BM, giving your answer to 2 decimal places. (Work from the area of triangle VAB.)', p,
        'The height of isosceles face VAB from V is $\\sqrt{' + P.l + '^2-' + P.hb + '^2}=' + P.fh + '$, so its area is $\\frac{1}{2}\\times' + P.a + '\\times' + P.fh + '=' + (P.hb * P.fh) + '$. Also area $=\\frac{1}{2}\\times' + P.l + '\\times BM$, so $BM=\\frac{2\\times' + (P.hb * P.fh) + '}{' + P.l + '}=' + p + '$.', 0.01);
    }),
    G('perpendicular', function () {
      var P = pyr(), area = P.hb * P.fh, p = R.roundDp(2 * area / P.l, 2);
      return num('Triangle VAB of a right square-based pyramid has area ' + area + ' cm$^2$ and the slant edge VA is ' + P.l + ' cm. Find the perpendicular distance from B to the line VA, to 2 decimal places.', p,
        'Area $=\\frac{1}{2}\\times VA\\times BM$, so $BM=\\frac{2\\times' + area + '}{' + P.l + '}=' + p + '$ cm.', 0.01);
    }),
    G('base-diagonal', function () {
      var a = rint(3, 12), d = R.roundDp(a * Math.sqrt(2), 2);
      return num('ABCD is a square of side ' + a + ' cm. The perpendiculars from B and D to the edge VA of a pyramid meet VA at the same point M. Find the length of the diagonal BD to 2 decimal places.', d,
        'BD is the diagonal of the square base, so $BD^2=' + a + '^2+' + a + '^2=' + (2 * a * a) + '$ and $BD=' + d + '$ cm. It is the third side of triangle BMD.', 0.01);
    }),
    G('cosine-rule', function () {
      var P = pyr(), c = R.roundDp(pyrCos(P), 3), p2 = Math.pow(P.a * P.fh / P.l, 2);
      return num(pyrText(P) + ' The perpendiculars from B and D to VA both meet VA at M. Find $\\cos\\angle BMD$ to 3 decimal places.', c,
        '$BM=DM=\\frac{' + P.a + '\\times' + P.fh + '}{' + P.l + '}$, so $BM^2=' + R.roundDp(p2, 3) + '$, and $BD^2=2\\times' + P.a + '^2=' + (2 * P.a * P.a) + '$. Then $\\cos BMD=\\frac{2BM^2-BD^2}{2BM^2}=' + c + '$ (negative, so the angle is obtuse).', 0.001);
    }),
    G('cosine-rule', function () {
      var P = pyr(), ang = R.roundDp(deg(Math.acos(pyrCos(P))), 1);
      return num(pyrText(P) + ' Find the obtuse angle between the planes VAB and VAD, in degrees to 1 decimal place.', ang,
        'M is the foot of the perpendiculars from B and D to VA, so the angle is $\\angle BMD$ with $BM=DM=\\frac{' + P.a + '\\times' + P.fh + '}{' + P.l + '}$ and $BD=' + P.a + '\\sqrt{2}$. The cosine rule gives $\\cos BMD=' + R.roundDp(pyrCos(P), 4) + '$, so the angle is ' + ang + ' degrees.', 0.06, '$' + ang + '$');
    }),
    G('cosine-rule', function () {
      var p = rint(4, 9), d = rint(p + 1, 2 * p - 1), c = R.roundDp(1 - d * d / (2 * p * p), 3);
      return num('In triangle BMD, $BM=DM=' + p + '$ cm and $BD=' + d + '$ cm. Find $\\cos\\angle BMD$ to 3 decimal places.', c,
        '$\\cos BMD=\\frac{' + p + '^2+' + p + '^2-' + d + '^2}{2\\times' + p + '\\times' + p + '}=\\frac{' + (2 * p * p - d * d) + '}{' + (2 * p * p) + '}=' + c + '$.', 0.001);
    }),
    G('obtuse', function () {
      var c = pick([-0.2, -0.3, -0.4, -0.5, -0.6, -0.7]), t = R.roundDp(deg(Math.acos(c)), 1), u = R.roundDp(deg(Math.acos(-c)), 1);
      return mk('The cosine rule gives $\\cos\\theta=' + c + '$ for the angle $\\theta$ between two sloping faces of a pyramid, and the question asks for the obtuse angle. What is $\\theta$?',
        t + ' degrees', [u + ' degrees', R.roundDp(360 - t, 1) + ' degrees', R.roundDp(t - 90, 1) + ' degrees'],
        'A negative cosine gives an obtuse angle directly: $\\theta=\\cos^{-1}(' + c + ')=' + t + '^\\circ$. The value ' + u + ' degrees comes from dropping the minus sign.');
    }),
    G('base-diagonal', function () {
      var a = rint(4, 10);
      return mk('Two perpendiculars of length $p$ are drawn from B and D to the edge VA of a right pyramid on a square base ABCD of side ' + a + ' cm. Which length is the third side of the triangle that contains the angle between the faces VAB and VAD?',
        '$BD=' + a + '\\sqrt{2}$ cm, the base diagonal', ['$AB=' + a + '$ cm, the base edge', '$VA$, the slant edge', '$VM$, the distance from V along the edge'],
        'The angle sits at the foot M of the two perpendiculars, between BM and DM. The side opposite it joins B to D, which is the diagonal of the square base.');
    }),
    fix('cosine-rule', mk('Triangle BMD has $BM=DM=p$ and $BD=d$. Which expression gives the angle $BMD$ between the two faces?',
      '$\\cos BMD=\\frac{2p^2-d^2}{2p^2}$', ['$\\cos BMD=\\frac{2p^2+d^2}{2p^2}$', '$\\cos BMD=\\frac{p^2+d^2-p^2}{2pd}$', '$\\cos BMD=\\frac{d^2-2p^2}{2p^2}$'],
      'The cosine rule for the angle between the two sides of length $p$ is $\\cos\\theta=\\frac{p^2+p^2-d^2}{2\\times p\\times p}$. The side opposite the angle, $d$, is the one that is subtracted.')),
    fix('perpendicular', mk('A student says: "The perpendicular from B to VA meets VA at its midpoint, because the pyramid is symmetrical." Which comment is correct?',
      'It is wrong: the perpendicular meets VA at the point M where $BM\\perp VA$, found from the face area, and M is not usually the midpoint', ['It is correct, because triangle VAB is isosceles', 'It is correct, because the base is a square', 'It is wrong, because the perpendicular does not meet VA at all'],
      'Symmetry about the plane through V, A and C only tells us that the perpendiculars from B and D meet VA at the same point. That point is the foot of the perpendicular from B, not the midpoint of VA.')),
    fix('perpendicular', mk('Triangle VAB has area $T$ and the edge VA has length $l$. Which formula gives the perpendicular distance $p$ from B to VA?',
      '$p=\\frac{2T}{l}$', ['$p=\\frac{T}{l}$', '$p=2Tl$', '$p=\\frac{l}{2T}$'],
      'Area of a triangle is half the base times the perpendicular height. Using VA as the base, $T=\\frac{1}{2}lp$, so $p=\\frac{2T}{l}$.')),
    fix('method', mk('Which pair of lines defines the angle between the planes VAB and VAD of a pyramid?',
      'Two lines, one in each plane, each perpendicular to VA and meeting VA at the same point', ['VB and VD', 'AB and AD', 'The slant edges VA and VC'],
      'The angle between two planes is measured across their common edge VA, using a line in each plane that is perpendicular to VA at the same point.'))
  ] };

  // =====================================================================
  // FPM-TRI-18 Angles and areas of triangles inside a solid
  // =====================================================================
  B['FPM-TRI-18'] = { title: 'Angles and areas of triangles inside a solid', items: [
    G('cuboid-angle', function () {
      var a = rint(3, 9), b = rint(3, 9), c = rint(3, 9);
      var ang = R.roundDp(deg(Math.acos(a * a / (Math.sqrt(a * a + b * b) * Math.sqrt(a * a + c * c)))), 1);
      return num('ABCDEFGH is a cuboid with AB = ' + a + ' cm, BC = ' + b + ' cm and BF = ' + c + ' cm (F is vertically above B). Find the angle FAC in degrees to 1 decimal place.', ang,
        'In triangle FAC: $AC^2=' + a + '^2+' + b + '^2=' + (a * a + b * b) + '$, $AF^2=' + a + '^2+' + c + '^2=' + (a * a + c * c) + '$, $CF^2=' + b + '^2+' + c + '^2=' + (b * b + c * c) + '$. Cosine rule at A: $\\cos FAC=\\frac{' + (a * a + b * b) + '+' + (a * a + c * c) + '-' + (b * b + c * c) + '}{2\\sqrt{' + (a * a + b * b) + '}\\sqrt{' + (a * a + c * c) + '}}$, giving ' + ang + ' degrees.', 0.06, '$' + ang + '$');
    }),
    G('pyramid-angle', function () {
      var a = rint(4, 10), l = rint(Math.ceil(a * 0.72), 14), ang = R.roundDp(deg(Math.acos(1 - a * a / (l * l))), 1);
      return num('VABCD is a right pyramid with a square base of side ' + a + ' cm and slant edges of length ' + l + ' cm. Find the angle AVC in degrees to 1 decimal place.', ang,
        'AC is the base diagonal, $AC^2=2\\times' + a + '^2=' + (2 * a * a) + '$. In triangle AVC with $VA=VC=' + l + '$: $\\cos AVC=\\frac{2\\times' + l + '^2-' + (2 * a * a) + '}{2\\times' + l + '^2}=' + R.roundDp(1 - a * a / (l * l), 4) + '$, so the angle is ' + ang + ' degrees.', 0.06, '$' + ang + '$');
    }),
    G('face-area', function () {
      var t = pick(PYR), a = 2 * t[0];
      return num('The base of a right pyramid is a square of side ' + a + ' cm and each slant edge is ' + t[1] + ' cm. Find the area of the triangular face VAB in cm$^2$.', t[0] * t[2],
        'The perpendicular from V to AB bisects AB, so the height of the face is $\\sqrt{' + t[1] + '^2-' + t[0] + '^2}=' + t[2] + '$. Area $=\\frac{1}{2}\\times' + a + '\\times' + t[2] + '=' + (t[0] * t[2]) + '$ cm$^2$.');
    }),
    G('face-area', function () {
      var t = pick(PYR), a = 2 * t[0];
      return num('The base of a right pyramid is a square of side ' + a + ' cm and each slant edge is ' + t[1] + ' cm. Find the height of the triangular face VAB (the perpendicular from V to AB) in cm.', t[2],
        'The perpendicular from V bisects AB, giving a right-angled triangle with hypotenuse ' + t[1] + ' and one side ' + t[0] + '. The height is $\\sqrt{' + t[1] + '^2-' + t[0] + '^2}=' + t[2] + '$ cm. It is not the slant edge ' + t[1] + '.');
    }),
    G('surface-area', function () {
      var t = pick(PYR), a = 2 * t[0], total = a * a + 2 * a * t[2];
      return num('A right pyramid has a square base of side ' + a + ' cm and four equal triangular faces. Each slant edge is ' + t[1] + ' cm. Find the total surface area in cm$^2$.', total,
        'Base: $' + a + '^2=' + (a * a) + '$. Each triangular face has height $\\sqrt{' + t[1] + '^2-' + t[0] + '^2}=' + t[2] + '$ and area $\\frac{1}{2}\\times' + a + '\\times' + t[2] + '=' + (t[0] * t[2]) + '$. Total $=' + (a * a) + '+4\\times' + (t[0] * t[2]) + '=' + total + '$ cm$^2$.');
    }),
    G('surface-area', function () {
      var t = pick(PYR), a = 2 * t[0], total = a * a + 2 * a * t[2];
      var wrong1 = a * a + 2 * a * t[1], wrong2 = 2 * a * t[2], wrong3 = a * a + 3 * t[0] * t[2];
      return mk('A right pyramid has a square base of side ' + a + ' cm and slant edges of ' + t[1] + ' cm. Which value is its total surface area?',
        total + ' cm$^2$', [wrong1 + ' cm$^2$', wrong2 + ' cm$^2$', wrong3 + ' cm$^2$'],
        'The height of each triangular face is $\\sqrt{' + t[1] + '^2-' + t[0] + '^2}=' + t[2] + '$, so each face has area ' + (t[0] * t[2]) + '. Total $=' + (a * a) + '+4\\times' + (t[0] * t[2]) + '=' + total + '$. Using the slant edge as the height gives ' + wrong1 + ', leaving out the base gives ' + wrong2 + ', and counting only three faces gives ' + wrong3 + '.');
    }),
    G('right-angle-check', function () {
      var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), m = pick([1, 1, 2]), isRight = Math.random() < 0.5;
      var s = tr.map(function (x) { return x * m; }), a = s[0], b = s[1], c = isRight ? s[2] : s[2] + 1, cs = c * c, ab = a * a + b * b;
      var ans = isRight ? 'Exactly 90 degrees' : (cs > ab ? 'More than 90 degrees' : 'Less than 90 degrees');
      return mk('A triangle inside a solid has sides ' + a + ' cm, ' + b + ' cm and ' + c + ' cm. What can you say about the angle opposite the ' + c + ' cm side?',
        ans, ['Exactly 90 degrees', 'More than 90 degrees', 'Less than 90 degrees'].filter(function (x) { return x !== ans; }).concat(['Cannot be found without a calculator']),
        'Compare $' + a + '^2+' + b + '^2=' + ab + '$ with $' + c + '^2=' + cs + '$. ' + (isRight ? 'They are equal, so by the converse of Pythagoras the angle is 90 degrees.' : (cs > ab ? 'The square of the longest side is larger, so the angle opposite it is obtuse.' : 'The square of the longest side is smaller, so the angle opposite it is acute.')));
    }),
    G('cosine-rule', function () {
      var p, q, r;
      do { p = rint(4, 10); q = rint(4, 10); r = rint(3, 12); } while (r >= p + q || p >= q + r || q >= p + r);
      var cor = '$\\cos A=\\frac{' + p + '^2+' + q + '^2-' + r + '^2}{2\\times' + p + '\\times' + q + '}$';
      return mk('In triangle ABC inside a solid, $AB=' + p + '$ cm, $AC=' + q + '$ cm and $BC=' + r + '$ cm. Which expression gives $\\cos A$?',
        cor, ['$\\cos A=\\frac{' + q + '^2+' + r + '^2-' + p + '^2}{2\\times' + q + '\\times' + r + '}$', '$\\cos A=\\frac{' + p + '^2+' + q + '^2+' + r + '^2}{2\\times' + p + '\\times' + q + '}$', '$\\cos A=\\frac{' + p + '^2+' + q + '^2-' + r + '^2}{' + p + '\\times' + q + '}$'],
        'Angle A lies between AB and AC, and BC is opposite it. The cosine rule is $\\cos A=\\frac{AB^2+AC^2-BC^2}{2\\times AB\\times AC}$.');
    }),
    fix('cuboid-angle', mk('ABCDEFGH is a cube. What is the size of angle CAF?',
      '60 degrees', ['45 degrees', '90 degrees', '30 degrees'],
      'AC, AF and CF are all face diagonals of the cube, so they are equal in length. Triangle ACF is equilateral and each of its angles is 60 degrees.')),
    fix('right-angle-check', mk('In a pyramid, a student finds the area of a triangular face by using the slant edge as the height. Which statement is correct?',
      'The slant edge is the sloping side of the face; the height must be found from the perpendicular to the base of that face', ['The slant edge is always the height of the face', 'The height of the face is half the base', 'The height of the face equals the height of the pyramid'],
      'In a triangular face the height is the perpendicular from the apex to the base edge of that face. It is shorter than the slant edge and different from the height of the whole pyramid.'))
  ] };

  // =====================================================================
  // FPM-TRI-19 Volume formulas for cones, pyramids and prisms using trig
  // =====================================================================
  B['FPM-TRI-19'] = { title: 'Volume formulas for cones, pyramids and prisms using trig', items: [
    G('half-angle', function () {
      var half = pick([20, 25, 35, 40, 50, 55]), h = rint(6, 20), r = R.roundSf(h * Math.tan(rad(half)), 3);
      return num('A cone has vertical angle ' + (2 * half) + ' degrees and height ' + h + ' cm. Find the radius of its base in cm, to 3 significant figures.', r,
        'The vertical angle is split in two by the axis, so the half-angle is ' + half + ' degrees and $r=h\\tan' + half + '^\\circ=' + h + '\\tan' + half + '^\\circ=' + r + '$ cm.', Math.pow(10, Math.floor(Math.log10(r)) - 2) / 2 + 1e-9);
    }),
    G('half-angle', function () {
      var half = pick([20, 25, 30, 35, 40, 50, 60]);
      return mk('A cone has vertical angle ' + (2 * half) + ' degrees. In the right-angled triangle formed by the axis, a radius and a sloping side, which angle is at the apex?',
        half + ' degrees', [(2 * half) + ' degrees', (90 - half) + ' degrees', (180 - 2 * half) + ' degrees'],
        'The axis bisects the vertical angle, so the angle at the apex of the right-angled triangle is half of ' + (2 * half) + ', which is ' + half + ' degrees. Then $\\tan' + half + '^\\circ=\\frac{r}{h}$.');
    }),
    G('half-angle', function () {
      var half = pick([30, 45, 60]);
      var correct = half === 30 ? '$r=\\frac{h}{\\sqrt{3}}$' : half === 45 ? '$r=h$' : '$r=h\\sqrt{3}$';
      var ds = ['$r=\\frac{h}{\\sqrt{3}}$', '$r=h$', '$r=h\\sqrt{3}$', '$r=\\frac{h}{2}$', '$r=\\frac{\\sqrt{3}h}{2}$'].filter(function (x) { return x !== correct; });
      return mk('A cone has vertical angle ' + (2 * half) + ' degrees and height $h$. Which expression gives its base radius $r$?', correct, ds,
        'The half-angle is ' + half + ' degrees, and $r=h\\tan' + half + '^\\circ$. Here $\\tan' + half + '^\\circ=' + (half === 30 ? '\\frac{1}{\\sqrt{3}}' : half === 45 ? '1' : '\\sqrt{3}') + '$, so ' + correct + '.');
    }),
    G('volume-in-h', function () {
      var half = pick([30, 60]), c = half === 30 ? '\\frac{\\pi h^3}{9}' : '\\pi h^3';
      var ds = ['\\frac{\\pi h^3}{3}', '\\frac{\\pi h^3}{27}', '\\frac{\\pi h^3}{9}', '\\pi h^3', '3\\pi h^3'].filter(function (x) { return x !== c; });
      return mk('A cone has vertical angle ' + (2 * half) + ' degrees and height $h$. Which expression is its volume in terms of $h$?', '$V=' + c + '$', ds.slice(0, 3).map(function (x) { return '$V=' + x + '$'; }),
        'The half-angle is ' + half + ' degrees so $r=h\\tan' + half + '^\\circ=' + (half === 30 ? '\\frac{h}{\\sqrt{3}}' : 'h\\sqrt{3}') + '$ and $r^2=' + (half === 30 ? '\\frac{h^2}{3}' : '3h^2') + '$. Then $V=\\frac{1}{3}\\pi r^2h=' + c + '$.');
    }),
    G('solve-for-h', function () {
      var h = pick([3, 6, 9, 12]), t = h * h * h / 9;
      return num('Water runs at a constant rate of $\\pi$ cm$^3$ per second into an empty container in the shape of a cone with its vertex downwards, axis vertical and vertical angle 60 degrees. Its volume when the depth is $h$ is $V=\\frac{\\pi h^3}{9}$. Find the depth of the water after ' + t + ' seconds, in cm.', h,
        '$V=\\pi t=' + t + '\\pi$, so $\\frac{\\pi h^3}{9}=' + t + '\\pi$ and $h^3=9\\times' + t + '=' + (h * h * h) + '$, giving $h=' + h + '$ cm.');
    }),
    G('solve-for-h', function () {
      var h = pick([3, 6, 9]), V = h * h * h / 3;
      return num('A cone has vertical angle 90 degrees and volume $' + V + '\\pi$ cm$^3$. Find its height in cm.', h,
        'The half-angle is 45 degrees so $r=h$ and $V=\\frac{1}{3}\\pi h^3$. Then $\\frac{1}{3}h^3=' + V + '$, so $h^3=' + (3 * V) + '$ and $h=' + h + '$ cm.');
    }),
    G('solve-for-h', function () {
      var h = pick([2, 3, 4, 5]), t = h * h * h;
      return num('A cone has vertical angle 120 degrees and its volume in terms of its height is $V=\\pi h^3$. It is filled at $\\pi$ cm$^3$ per second from empty (vertex down, axis vertical). Find the depth after ' + t + ' seconds in cm.', h,
        '$V=\\pi t=' + t + '\\pi$, so $\\pi h^3=' + t + '\\pi$ and $h^3=' + t + '$, giving $h=' + h + '$ cm.');
    }),
    G('cone-pyramid', function () {
      var r = rint(2, 9), h = rint(3, 15), V = R.roundSf(Math.PI * r * r * h / 3, 3);
      return num('A cone has base radius ' + r + ' cm and height ' + h + ' cm. Find its volume in cm$^3$ to 3 significant figures.', V,
        '$V=\\frac{1}{3}\\pi r^2h=\\frac{1}{3}\\pi\\times' + r + '^2\\times' + h + '=' + V + '$ cm$^3$.', Math.pow(10, Math.floor(Math.log10(V)) - 2) / 2 + 1e-9);
    }),
    G('cone-pyramid', function () {
      var l = rint(3, 12), w = rint(3, 12), h = 3 * rint(1, 6), V = l * w * h / 3;
      return num('A pyramid has a rectangular base ' + l + ' cm by ' + w + ' cm and a perpendicular height of ' + h + ' cm. Find its volume in cm$^3$.', V,
        '$V=\\frac{1}{3}\\times\\text{base area}\\times\\text{height}=\\frac{1}{3}\\times' + (l * w) + '\\times' + h + '=' + V + '$ cm$^3$.');
    }),
    G('prism', function () {
      var a = rint(4, 12), b = rint(4, 12), C = pick([30, 90, 150]), L = rint(5, 20);
      var V = R.roundSf(0.5 * a * b * Math.sin(rad(C)) * L, 3);
      return num('A prism of length ' + L + ' cm has a triangular cross-section with two sides of ' + a + ' cm and ' + b + ' cm enclosing an angle of ' + C + ' degrees. Find its volume in cm$^3$ to 3 significant figures.', V,
        'Cross-section area $=\\frac{1}{2}ab\\sin C=\\frac{1}{2}\\times' + a + '\\times' + b + '\\times\\sin' + C + '^\\circ=' + R.roundDp(0.5 * a * b * Math.sin(rad(C)), 3) + '$ cm$^2$. Volume $=$ area $\\times$ length $=' + V + '$ cm$^3$.', Math.pow(10, Math.floor(Math.log10(V)) - 2) / 2 + 1e-9);
    }),
    fix('spot-error', mk('A student shows that a cone of vertical angle 60 degrees has volume $\\frac{\\pi h^3}{9}$. Line 1: $r=h\\tan30^\\circ=\\frac{h}{\\sqrt{3}}$. Line 2: $V=\\frac{1}{3}\\pi\\left(\\frac{h}{\\sqrt{3}}\\right)^2h$. Line 3: $V=\\frac{1}{3}\\pi\\frac{h^2}{\\sqrt{3}}h$. Line 4: $V=\\frac{\\pi h^3}{9}$. Which line contains the first error?',
      'Line 3: $\\left(\\frac{h}{\\sqrt{3}}\\right)^2=\\frac{h^2}{3}$, not $\\frac{h^2}{\\sqrt{3}}$', ['Line 1: the angle used should be 60 degrees', 'Line 2: the factor $\\frac{1}{3}$ should not be there', 'Line 4: the answer should be $\\frac{\\pi h^3}{3}$'],
      'Squaring $\\frac{h}{\\sqrt{3}}$ squares both the top and the bottom, giving $\\frac{h^2}{3}$. Then $V=\\frac{1}{3}\\pi\\times\\frac{h^2}{3}\\times h=\\frac{\\pi h^3}{9}$. Line 1 correctly uses the half-angle 30 degrees.'))
  ] };

  // =====================================================================
  // FPM-TRI-20 Deriving the double-angle formulae
  // =====================================================================
  B['FPM-TRI-20'] = { title: 'Deriving the double-angle formulae', items: [
    fix('derive', mk('Putting $B=A$ in $\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$ gives which result?',
      '$\\sin2A=2\\sin A\\cos A$', ['$\\sin2A=2\\sin A$', '$\\sin2A=\\sin^2A+\\cos^2A$', '$\\sin2A=\\sin A\\cos A$'],
      'With $B=A$ the two terms are the same, $\\sin A\\cos A+\\cos A\\sin A=2\\sin A\\cos A$. Writing $\\sin2A=2\\sin A$ is the common error.')),
    fix('derive', mk('Putting $B=A$ in $\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B$ gives which result?',
      '$\\cos2A=\\cos^2A-\\sin^2A$', ['$\\cos2A=\\cos^2A+\\sin^2A$', '$\\cos2A=2\\cos A$', '$\\cos2A=\\sin^2A-\\cos^2A$'],
      'The product $\\cos A\\cos A$ is $\\cos^2A$ and $\\sin A\\sin A$ is $\\sin^2A$, and the minus sign stays: $\\cos2A=\\cos^2A-\\sin^2A$.')),
    fix('derive', mk('Putting $B=A$ in $\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}$ gives which result?',
      '$\\tan2A=\\frac{2\\tan A}{1-\\tan^2A}$', ['$\\tan2A=\\frac{2\\tan A}{1+\\tan^2A}$', '$\\tan2A=\\frac{\\tan A}{1-\\tan^2A}$', '$\\tan2A=2\\tan A$'],
      'The numerator becomes $\\tan A+\\tan A=2\\tan A$ and the denominator $1-\\tan A\\tan A=1-\\tan^2A$.')),
    fix('derive', mk('A proof starts with $\\cos2A=\\cos^2A-\\sin^2A$ and ends with $\\cos2A=1-2\\sin^2A$. Which substitution is made in the middle?',
      'Replace $\\cos^2A$ by $1-\\sin^2A$', ['Replace $\\sin^2A$ by $1-\\cos^2A$', 'Replace $\\cos^2A$ by $1+\\sin^2A$', 'Replace $\\sin^2A$ by $\\cos^2A-1$'],
      'Using $\\cos^2A=1-\\sin^2A$: $\\cos2A=(1-\\sin^2A)-\\sin^2A=1-2\\sin^2A$. Replacing $\\sin^2A$ instead would give the other form, $2\\cos^2A-1$.')),
    fix('derive', mk('A student writes $\\cos2A=\\cos^2A-(1-\\cos^2A)=-1$. Which comment is correct?',
      'The expansion has a sign error: it should be $\\cos^2A-1+\\cos^2A=2\\cos^2A-1$', ['It is correct because $\\cos^2A$ cancels', 'It is correct because $\\sin^2A=1-\\cos^2A$ is not allowed', 'The error is that $\\cos2A$ should equal $\\cos^2A+\\sin^2A$'],
      'The substitution $\\sin^2A=1-\\cos^2A$ is fine, but subtracting the bracket gives $-1+\\cos^2A$, so the two $\\cos^2A$ terms add: $\\cos2A=2\\cos^2A-1$.')),
    G('forms', function () {
      var T = [
        ['uses only $\\sin A$', '$\\cos2A=1-2\\sin^2A$', ['$\\cos2A=2\\sin^2A-1$', '$\\cos2A=1-2\\cos^2A$', '$\\cos2A=2\\cos^2A-1$']],
        ['uses only $\\cos A$', '$\\cos2A=2\\cos^2A-1$', ['$\\cos2A=1-2\\cos^2A$', '$\\cos2A=2\\cos^2A+1$', '$\\cos2A=1-2\\sin^2A$']],
        ['uses both $\\cos A$ and $\\sin A$', '$\\cos2A=\\cos^2A-\\sin^2A$', ['$\\cos2A=\\sin^2A-\\cos^2A$', '$\\cos2A=\\cos^2A+\\sin^2A$', '$\\cos2A=2\\sin A\\cos A$']]
      ], t = pick(T);
      return mk('Which of these is a correct form of the double-angle formula for cosine that ' + t[0] + '?', t[1], t[2],
        'The three forms are $\\cos2A=\\cos^2A-\\sin^2A=2\\cos^2A-1=1-2\\sin^2A$. The others have a sign wrong or use the wrong ratio.');
    }),
    G('apply', function () {
      var s = pick([0.6, 0.8]), c = s === 0.6 ? 0.8 : 0.6, ans = R.roundDp(2 * s * c, 2);
      return num('Angle $A$ is acute and $\\sin A=' + s + '$. Use $\\sin2A=2\\sin A\\cos A$ to find $\\sin2A$.', ans,
        'Since $\\sin^2A+\\cos^2A=1$ and $A$ is acute, $\\cos A=\\sqrt{1-' + R.roundDp(s * s, 2) + '}=' + c + '$. Then $\\sin2A=2\\times' + s + '\\times' + c + '=' + ans + '$.', 0.005);
    }),
    G('apply', function () {
      var s = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]), ans = R.roundDp(1 - 2 * s * s, 2);
      return num('Given $\\sin A=' + s + '$, use $\\cos2A=1-2\\sin^2A$ to find $\\cos2A$.', ans,
        '$\\cos2A=1-2\\times' + s + '^2=1-' + R.roundDp(2 * s * s, 2) + '=' + ans + '$.', 0.005);
    }),
    G('apply', function () {
      var cc = pick([0.64, 0.36, 0.81, 0.49, 0.25, 0.16, 0.09, 0.04]), v = R.roundDp(2 * cc - 1, 2);
      return num('Given $\\cos2A=' + v + '$, use $\\cos2A=2\\cos^2A-1$ to find $\\cos^2A$.', cc,
        'Rearrange: $\\cos^2A=\\frac{1+\\cos2A}{2}=\\frac{1+' + pr(v) + '}{2}=' + cc + '$.', 0.005);
    }),
    G('apply', function () {
      var t = pick([3, -3, 1.5, -1.5, 0.6, -0.6]), ans = R.roundSf(2 * t / (1 - t * t), 3);
      return num('Given $\\tan A=' + t + '$, use $\\tan2A=\\frac{2\\tan A}{1-\\tan^2A}$ to find $\\tan2A$, to 3 significant figures.', ans,
        '$\\tan2A=\\frac{2\\times(' + t + ')}{1-(' + t + ')^2}=\\frac{' + R.roundDp(2 * t, 2) + '}{' + R.roundDp(1 - t * t, 2) + '}=' + ans + '$. Note that $\\tan^2A$ is always positive, so the denominator is $1-t^2$.', 0.006);
    }),
    G('apply', function () {
      var c = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]), ans = R.roundDp(2 * c * c - 1, 2);
      return num('Given $\\cos A=' + c + '$, use $\\cos2A=2\\cos^2A-1$ to find $\\cos2A$.', ans,
        '$\\cos2A=2\\times' + c + '^2-1=' + R.roundDp(2 * c * c, 2) + '-1=' + ans + '$.', 0.005);
    }),
    G('apply', function () {
      var c = pick([0.6, 0.8]), s2 = c === 0.6 ? 0.8 : 0.6, ans = R.roundDp(2 * c * s2, 2);
      return num('Angle $A$ is acute and $\\cos A=' + c + '$. Find $\\sin2A$.', ans,
        'Since $A$ is acute, $\\sin A=\\sqrt{1-' + R.roundDp(c * c, 2) + '}=' + s2 + '$. Then $\\sin2A=2\\sin A\\cos A=2\\times' + s2 + '\\times' + c + '=' + ans + '$.', 0.005);
    }),
    G('derive', function () {
      var T = [['\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B', '\\sin2A=2\\sin A\\cos A', ['\\sin2A=2\\sin A', '\\sin2A=\\sin^2A+\\cos^2A', '\\sin2A=\\sin A\\cos A']],
        ['\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B', '\\cos2A=\\cos^2A-\\sin^2A', ['\\cos2A=\\cos^2A+\\sin^2A', '\\cos2A=\\sin^2A-\\cos^2A', '\\cos2A=2\\cos A']],
        ['\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}', '\\tan2A=\\frac{2\\tan A}{1-\\tan^2A}', ['\\tan2A=\\frac{2\\tan A}{1+\\tan^2A}', '\\tan2A=\\frac{\\tan A}{1-\\tan^2A}', '\\tan2A=2\\tan A']]], t = pick(T);
      return mk('Replace $B$ by $A$ in $' + t[0] + '$. Which result do you get?', '$' + t[1] + '$', t[2].map(function (x) { return '$' + x + '$'; }),
        'Putting $B=A$ turns $A+B$ into $2A$ and makes the two products identical, which gives $' + t[1] + '$. The other options come from a dropped factor or a wrong sign.');
    }),
    fix('apply', num('Using the addition formula with $B=A$ one gets $\\sin2A=k\\sin A\\cos A$. Write down the value of $k$.', 2,
      '$\\sin(A+A)=\\sin A\\cos A+\\cos A\\sin A=2\\sin A\\cos A$, so $k=2$.'))
  ] };

  // =====================================================================
  // FPM-TRI-21 Exact values with the addition formulae
  // =====================================================================
  var SA = '\\frac{\\sqrt{6}+\\sqrt{2}}{4}', SB = '\\frac{\\sqrt{6}-\\sqrt{2}}{4}';
  var EX = {
    'sin15': [SB, 'Write $15^\\circ=45^\\circ-30^\\circ$: $\\sin(45^\\circ-30^\\circ)=\\sin45^\\circ\\cos30^\\circ-\\cos45^\\circ\\sin30^\\circ=\\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{3}}{2}-\\frac{\\sqrt{2}}{2}\\cdot\\frac{1}{2}=\\frac{\\sqrt{6}-\\sqrt{2}}{4}$.'],
    'cos15': [SA, 'Write $15^\\circ=45^\\circ-30^\\circ$: $\\cos(45^\\circ-30^\\circ)=\\cos45^\\circ\\cos30^\\circ+\\sin45^\\circ\\sin30^\\circ=\\frac{\\sqrt{6}}{4}+\\frac{\\sqrt{2}}{4}$.'],
    'sin75': [SA, 'Write $75^\\circ=45^\\circ+30^\\circ$: $\\sin(45^\\circ+30^\\circ)=\\sin45^\\circ\\cos30^\\circ+\\cos45^\\circ\\sin30^\\circ=\\frac{\\sqrt{6}}{4}+\\frac{\\sqrt{2}}{4}$.'],
    'cos75': [SB, 'Write $75^\\circ=45^\\circ+30^\\circ$: $\\cos(45^\\circ+30^\\circ)=\\cos45^\\circ\\cos30^\\circ-\\sin45^\\circ\\sin30^\\circ=\\frac{\\sqrt{6}}{4}-\\frac{\\sqrt{2}}{4}$.'],
    'sin105': [SA, 'Write $105^\\circ=60^\\circ+45^\\circ$: $\\sin(60^\\circ+45^\\circ)=\\sin60^\\circ\\cos45^\\circ+\\cos60^\\circ\\sin45^\\circ=\\frac{\\sqrt{6}}{4}+\\frac{\\sqrt{2}}{4}$.'],
    'cos105': ['-' + SB, 'Write $105^\\circ=60^\\circ+45^\\circ$: $\\cos(60^\\circ+45^\\circ)=\\cos60^\\circ\\cos45^\\circ-\\sin60^\\circ\\sin45^\\circ=\\frac{\\sqrt{2}}{4}-\\frac{\\sqrt{6}}{4}$, which is negative because $105^\\circ$ is obtuse.']
  };
  var SPOOL = [SA, SB, '-' + SA, '-' + SB];
  var TEX = { 15: ['2-\\sqrt{3}', '\\tan(45^\\circ-30^\\circ)=\\frac{1-\\frac{1}{\\sqrt{3}}}{1+\\frac{1}{\\sqrt{3}}}=\\frac{\\sqrt{3}-1}{\\sqrt{3}+1}=\\frac{(\\sqrt{3}-1)^2}{2}=2-\\sqrt{3}'],
    75: ['2+\\sqrt{3}', '\\tan(45^\\circ+30^\\circ)=\\frac{1+\\frac{1}{\\sqrt{3}}}{1-\\frac{1}{\\sqrt{3}}}=\\frac{\\sqrt{3}+1}{\\sqrt{3}-1}=\\frac{(\\sqrt{3}+1)^2}{2}=2+\\sqrt{3}'],
    105: ['-2-\\sqrt{3}', '\\tan(60^\\circ+45^\\circ)=\\frac{\\sqrt{3}+1}{1-\\sqrt{3}}=\\frac{(\\sqrt{3}+1)^2}{-2}=-2-\\sqrt{3}'] };
  var TPOOL = ['2+\\sqrt{3}', '2-\\sqrt{3}', '-2-\\sqrt{3}', '-2+\\sqrt{3}'];

  B['FPM-TRI-21'] = { title: 'Exact values with the addition formulae', items: [
    G('exact-sin-cos', function () {
      var k = pick(Object.keys(EX)), e = EX[k], fn = k.slice(0, 3), an = k.slice(3);
      return mk('Without a calculator, what is the exact value of $\\' + fn + an + '^\\circ$?', '$' + e[0] + '$', SPOOL.filter(function (x) { return x !== e[0]; }).map(function (x) { return '$' + x + '$'; }), e[1]);
    }),
    G('exact-sin-cos', function () {
      var k = pick(Object.keys(EX)), e = EX[k], fn = k.slice(0, 3), an = k.slice(3);
      return mk('Use an addition formula to find the exact value of $\\' + fn + an + '^\\circ$.', '$' + e[0] + '$', SPOOL.filter(function (x) { return x !== e[0]; }).map(function (x) { return '$' + x + '$'; }), e[1]);
    }),
    G('exact-tan', function () {
      var base = pick([15, 75, 105]), big = pick([0, 0, 1]) ? base + 180 : base, e = TEX[base];
      return mk('Find the exact value of $\\tan' + big + '^\\circ$.', '$' + e[0] + '$', TPOOL.filter(function (x) { return x !== e[0]; }).map(function (x) { return '$' + x + '$'; }),
        (big !== base ? '$\\tan' + big + '^\\circ=\\tan(' + big + '^\\circ-180^\\circ)=\\tan' + base + '^\\circ$ since tan repeats every $180^\\circ$. ' : '') + '$' + e[1] + '$.');
    }),
    G('surd-product', function () {
      var a = pick([2, 3, 5, 6, 7]), b = pick([2, 3, 5, 6, 7].filter(function (x) { return true; }));
      while (b === a) b = pick([2, 3, 5, 6, 7]);
      var s = a === 2 || b === 2;
      return mk('Simplify $\\frac{\\sqrt{' + a + '}}{2}\\times\\frac{\\sqrt{' + b + '}}{2}$.', '$\\frac{\\sqrt{' + (a * b) + '}}{4}$', ['$\\frac{\\sqrt{' + (a + b) + '}}{4}$', '$\\frac{\\sqrt{' + (a * b) + '}}{2}$', '$\\frac{\\sqrt{' + (a + b) + '}}{2}$'],
        'Multiply the numerators and the denominators separately: $\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + (a * b) + '}$ (not $\\sqrt{' + (a + b) + '}$) and $2\\times2=4$.');
    }),
    G('split', function () {
      var T = [[15, '45^\\circ-30^\\circ', ['45^\\circ+30^\\circ', '60^\\circ-30^\\circ', '90^\\circ-60^\\circ+15^\\circ']],
        [75, '45^\\circ+30^\\circ', ['45^\\circ-30^\\circ', '90^\\circ-30^\\circ', '60^\\circ+30^\\circ']],
        [105, '60^\\circ+45^\\circ', ['60^\\circ+30^\\circ', '45^\\circ+30^\\circ', '90^\\circ+30^\\circ']]], t = pick(T);
      return mk('Which is a way of writing ' + t[0] + ' degrees using only the angles 30, 45 and 60 degrees, so that exact values can be used?', '$' + t[0] + '^\\circ=' + t[1] + '$', t[2].map(function (x) { return '$' + t[0] + '^\\circ=' + x + '$'; }),
        'Check by adding or subtracting: $' + t[1] + '=' + t[0] + '^\\circ$. The other splits give a different angle or use an angle (like 15 or 90 degrees) whose exact value we do not want to start from.');
    }),
    G('extract', function () {
      var which = pick(['a', 'b', 'sum']), val = which === 'a' ? 6 : which === 'b' ? 2 : 8;
      return num('It is known that $\\sin75^\\circ=\\frac{\\sqrt{a}+\\sqrt{b}}{4}$ where $a>b$ and $a$, $b$ are positive integers. Find ' + (which === 'sum' ? 'the value of $a+b$' : 'the value of $' + which + '$') + '.', val,
        '$\\sin(45^\\circ+30^\\circ)=\\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{3}}{2}+\\frac{\\sqrt{2}}{2}\\cdot\\frac{1}{2}=\\frac{\\sqrt{6}+\\sqrt{2}}{4}$, so $a=6$ and $b=2$' + (which === 'sum' ? ', and $a+b=8$' : '') + '.');
    }),
    G('extract', function () {
      var p = pick([75, 15]), pl = p === 75;
      return num('Using $\\tan(45^\\circ' + (pl ? '+' : '-') + '30^\\circ)$ with $\\tan45^\\circ=1$ and $\\tan30^\\circ=\\frac{1}{\\sqrt{3}}$, one finds $\\tan' + p + '^\\circ=\\frac{\\sqrt{3}' + (pl ? '+' : '-') + '1}{\\sqrt{3}' + (pl ? '-' : '+') + '1}$. Multiply top and bottom by the conjugate of the denominator. What is the new denominator?', 2,
        'The denominator becomes $(\\sqrt{3}' + (pl ? '-' : '+') + '1)(\\sqrt{3}' + (pl ? '+' : '-') + '1)=3-1=2$ (a difference of two squares). The numerator is $(\\sqrt{3}' + (pl ? '+' : '-') + '1)^2=4' + (pl ? '+' : '-') + '2\\sqrt{3}$, so $\\tan' + p + '^\\circ=2' + (pl ? '+' : '-') + '\\sqrt{3}$.');
    }),
    G('recognise', function () {
      var T = [['\\cos45^\\circ\\cos30^\\circ-\\sin45^\\circ\\sin30^\\circ', '\\cos75^\\circ', ['\\cos15^\\circ', '\\sin75^\\circ', '\\cos45^\\circ\\cos30^\\circ']],
        ['\\sin60^\\circ\\cos45^\\circ+\\cos60^\\circ\\sin45^\\circ', '\\sin105^\\circ', ['\\sin15^\\circ', '\\cos105^\\circ', '\\sin60^\\circ']],
        ['\\cos45^\\circ\\cos30^\\circ+\\sin45^\\circ\\sin30^\\circ', '\\cos15^\\circ', ['\\cos75^\\circ', '\\sin15^\\circ', '\\cos45^\\circ']],
        ['\\sin45^\\circ\\cos30^\\circ-\\cos45^\\circ\\sin30^\\circ', '\\sin15^\\circ', ['\\sin75^\\circ', '\\cos15^\\circ', '\\sin45^\\circ']]], t = pick(T);
      return mk('Which single trig value is equal to $' + t[0] + '$?', '$' + t[1] + '$', t[2].map(function (x) { return '$' + x + '$'; }),
        'The expression matches one of the addition formulae, so it collapses to a single ratio of the combined angle: $' + t[1] + '$. Check the sign in the middle: minus goes with $\\cos(A+B)$ and $\\sin(A-B)$, plus with $\\cos(A-B)$ and $\\sin(A+B)$.');
    }),
    fix('sign-rule', mk('A student works out $\\cos15^\\circ$ as $\\cos(45^\\circ-30^\\circ)=\\cos45^\\circ\\cos30^\\circ-\\sin45^\\circ\\sin30^\\circ$. What is wrong?',
      'The sign: $\\cos(A-B)=\\cos A\\cos B+\\sin A\\sin B$, so the middle sign should be plus', ['The angle: 15 degrees is $60^\\circ-30^\\circ$', 'Nothing: that is the correct formula for $\\cos(A-B)$', 'The formula should use $\\sin45^\\circ\\cos30^\\circ$'],
      'In the cosine formulae the sign in the middle is opposite to the sign in the bracket: $\\cos(A+B)$ has a minus and $\\cos(A-B)$ has a plus. So $\\cos15^\\circ=\\frac{\\sqrt{6}}{4}+\\frac{\\sqrt{2}}{4}$.')),
    fix('sign-rule', mk('Which sign is used in the middle of each formula?',
      '$\\sin(A+B)$ has a plus; $\\cos(A+B)$ has a minus', ['$\\sin(A+B)$ has a minus; $\\cos(A+B)$ has a plus', 'Both $\\sin(A+B)$ and $\\cos(A+B)$ have a plus', 'Both $\\sin(A+B)$ and $\\cos(A+B)$ have a minus'],
      'The sine formula keeps the sign of the bracket: $\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B$. The cosine formula reverses it: $\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B$.'))
  ] };

  // =====================================================================
  // FPM-TRI-22 Sums to products and products to sums
  // =====================================================================
  function T(f, n) { return '\\' + f + ' ' + mx(n); }
  B['FPM-TRI-22'] = { title: 'Turning sums of trig terms into products, and products into sums', items: [
    G('product-to-sum', function () {
      var A = rint(3, 9), Bq = rint(1, A - 1);
      return mk('Which expression is equal to $2\\sin' + mx(A) + '\\cos' + mx(Bq) + '$?', '$' + T('sin', A + Bq) + '+' + T('sin', A - Bq) + '$',
        ['$' + T('sin', A + Bq) + '-' + T('sin', A - Bq) + '$', '$' + T('cos', A + Bq) + '+' + T('cos', A - Bq) + '$', '$' + T('sin', A) + '+' + T('sin', Bq) + '$'].map(function (x) { return x; }),
        'Adding $\\sin(A+B)=\\sin A\\cos B+\\cos A\\sin B$ and $\\sin(A-B)=\\sin A\\cos B-\\cos A\\sin B$ gives $2\\sin A\\cos B$. With $A=' + mx(A) + '$ and $B=' + mx(Bq) + '$, $A+B=' + mx(A + Bq) + '$ and $A-B=' + mx(A - Bq) + '$.');
    }),
    G('product-to-sum', function () {
      var A = rint(3, 9), Bq = rint(1, A - 1);
      return mk('Which expression is equal to $2\\cos' + mx(A) + '\\cos' + mx(Bq) + '$?', '$' + T('cos', A + Bq) + '+' + T('cos', A - Bq) + '$',
        ['$' + T('cos', A + Bq) + '-' + T('cos', A - Bq) + '$', '$' + T('sin', A + Bq) + '+' + T('sin', A - Bq) + '$', '$' + T('cos', A) + '+' + T('cos', Bq) + '$'],
        'Adding $\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B$ and $\\cos(A-B)=\\cos A\\cos B+\\sin A\\sin B$ cancels the sine terms: $\\cos(A+B)+\\cos(A-B)=2\\cos A\\cos B$. Here $A+B=' + mx(A + Bq) + '$ and $A-B=' + mx(A - Bq) + '$.');
    }),
    G('product-to-sum', function () {
      var A = rint(3, 9), Bq = rint(1, A - 1);
      return mk('Which expression is equal to $2\\sin' + mx(A) + '\\sin' + mx(Bq) + '$?', '$' + T('cos', A - Bq) + '-' + T('cos', A + Bq) + '$',
        ['$' + T('cos', A + Bq) + '-' + T('cos', A - Bq) + '$', '$' + T('cos', A + Bq) + '+' + T('cos', A - Bq) + '$', '$' + T('sin', A + Bq) + '-' + T('sin', A - Bq) + '$'],
        'Subtract $\\cos(A+B)$ from $\\cos(A-B)$: $\\cos A\\cos B+\\sin A\\sin B-\\cos A\\cos B+\\sin A\\sin B=2\\sin A\\sin B$. The order matters: $\\cos(A-B)-\\cos(A+B)$, with $A-B=' + mx(A - Bq) + '$ and $A+B=' + mx(A + Bq) + '$.');
    }),
    G('sum-to-product', function () {
      var A = rint(2, 8), Bq = rint(1, A - 1), P = A + Bq, Q = A - Bq;
      return mk('Write $\\cos' + mx(P, '\\theta') + '+\\cos' + mx(Q, '\\theta') + '$ as a product.', '$2\\cos' + mx(A, '\\theta') + '\\cos' + mx(Bq, '\\theta') + '$',
        ['$2\\cos' + mx(P + Q, '\\theta') + '\\cos' + mx(P - Q, '\\theta') + '$', '$2\\cos' + mx(A, '\\theta') + '\\sin' + mx(Bq, '\\theta') + '$', '$2\\sin' + mx(A, '\\theta') + '\\sin' + mx(Bq, '\\theta') + '$'],
        'Let $P=' + mx(P, '\\theta') + '$ and $Q=' + mx(Q, '\\theta') + '$. Then $A=\\frac{P+Q}{2}=' + mx(A, '\\theta') + '$ and $B=\\frac{P-Q}{2}=' + mx(Bq, '\\theta') + '$, and $\\cos P+\\cos Q=2\\cos A\\cos B$. Forgetting to halve gives the first wrong option.');
    }),
    G('sum-to-product', function () {
      var A = rint(2, 8), Bq = rint(1, A - 1), P = A + Bq, Q = A - Bq;
      return mk('Write $\\cos' + mx(Q, '\\theta') + '-\\cos' + mx(P, '\\theta') + '$ as a product.', '$2\\sin' + mx(A, '\\theta') + '\\sin' + mx(Bq, '\\theta') + '$',
        ['$-2\\sin' + mx(A, '\\theta') + '\\sin' + mx(Bq, '\\theta') + '$', '$2\\cos' + mx(A, '\\theta') + '\\cos' + mx(Bq, '\\theta') + '$', '$2\\sin' + mx(P, '\\theta') + '\\sin' + mx(Q, '\\theta') + '$'],
        'The identity is $\\cos(A-B)-\\cos(A+B)=2\\sin A\\sin B$. Here $A+B=' + mx(P, '\\theta') + '$ and $A-B=' + mx(Q, '\\theta') + '$, so $A=' + mx(A, '\\theta') + '$ and $B=' + mx(Bq, '\\theta') + '$.');
    }),
    G('find-AB', function () {
      var A = rint(3, 9), Bq = rint(1, A - 1), P = A + Bq, Q = A - Bq, which = pick(['A', 'B']);
      return num('The identity $\\cos P+\\cos Q=2\\cos A\\cos B$ is used with $P=' + mx(P, '\\theta') + '$ and $Q=' + mx(Q, '\\theta') + '$, where $A=a\\theta$ and $B=b\\theta$ and $a>b$. Find ' + (which === 'A' ? '$a$' : '$b$') + '.', which === 'A' ? A : Bq,
        '$A=\\frac{P+Q}{2}=\\frac{' + mx(P, '\\theta') + '+' + mx(Q, '\\theta') + '}{2}=' + mx(A, '\\theta') + '$ and $B=\\frac{P-Q}{2}=\\frac{' + mx(P, '\\theta') + '-' + mx(Q, '\\theta') + '}{2}=' + mx(Bq, '\\theta') + '$. So ' + (which === 'A' ? '$a=' + A : '$b=' + Bq) + '$.');
    }),
    G('exact-value', function () {
      var CS = { 0: 1, 60: 0.5, 90: 0, 120: -0.5, 180: -1 }, pairs = [[75, 15], [60, 60], [90, 30], [120, 60], [30, 30], [150, 30]];
      var pp = pick(pairs), A = pp[0], Bq = pp[1], val = (CS[A + Bq] + CS[Math.abs(A - Bq)]) / 2;
      return num('Use $\\cos(A+B)+\\cos(A-B)=2\\cos A\\cos B$ to find the exact value of $\\cos' + A + '^\\circ\\cos' + Bq + '^\\circ$ (no calculator). Give your answer as a decimal.', val,
        '$\\cos' + A + '^\\circ\\cos' + Bq + '^\\circ=\\frac{1}{2}\\left[\\cos' + (A + Bq) + '^\\circ+\\cos' + Math.abs(A - Bq) + '^\\circ\\right]=\\frac{1}{2}\\left[' + CS[A + Bq] + '+' + pr(CS[Math.abs(A - Bq)]) + '\\right]=' + val + '$.');
    }),
    G('exact-value', function () {
      var SN = { '-30': -0.5, 0: 0, 30: 0.5, 90: 1, 150: 0.5, 180: 0 }, pairs = [[60, 30], [45, 45], [105, 75], [120, 30], [30, 60]];
      var pp = pick(pairs), A = pp[0], Bq = pp[1], val = (SN[A + Bq] + SN[A - Bq]) / 2;
      return num('Use $2\\sin A\\cos B=\\sin(A+B)+\\sin(A-B)$ to find the exact value of $\\sin' + A + '^\\circ\\cos' + Bq + '^\\circ$ (no calculator). Give your answer as a decimal.', val,
        '$\\sin' + A + '^\\circ\\cos' + Bq + '^\\circ=\\frac{1}{2}\\left[\\sin' + (A + Bq) + '^\\circ+\\sin' + (A - Bq) + '^\\circ\\right]=\\frac{1}{2}\\left[' + SN[A + Bq] + '+' + pr(SN[A - Bq]) + '\\right]=' + val + '$.');
    }),
    G('use-values', function () {
      var ca = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]), cb = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]), v = R.roundDp(2 * ca * cb, 2);
      return num('Given $\\cos A=' + ca + '$ and $\\cos B=' + cb + '$, find the value of $\\cos(A+B)+\\cos(A-B)$.', v,
        'The sum of the two addition formulae gives $\\cos(A+B)+\\cos(A-B)=2\\cos A\\cos B=2\\times' + ca + '\\times' + cb + '=' + v + '$. No angles are needed.', 0.005);
    }),
    fix('spot-error', mk('A student proves $\\cos(A+B)+\\cos(A-B)=2\\cos A\\cos B$. Line 1: $\\cos(A+B)=\\cos A\\cos B-\\sin A\\sin B$. Line 2: $\\cos(A-B)=\\cos A\\cos B-\\sin A\\sin B$. Line 3: add the two lines. Which line is wrong?',
      'Line 2: it should be $\\cos A\\cos B+\\sin A\\sin B$', ['Line 1: the sign should be plus', 'Line 3: the lines should be subtracted', 'None, the proof is correct'],
      'For $\\cos(A-B)$ the sign in the middle is a plus. Adding the correct lines makes the $\\sin A\\sin B$ terms cancel, leaving $2\\cos A\\cos B$.')),
    fix('method', mk('To write $2\\sin7x\\cos x$ as a sum, a student uses $2\\sin A\\cos B=\\sin(A+B)+\\sin(A-B)$. Which choice of $A$ and $B$ should be made?',
      '$A=7x$ and $B=x$', ['$A=x$ and $B=7x$', '$A=8x$ and $B=6x$', '$A=7x$ and $B=2x$'],
      'The first angle after the 2 must be the one in the sine, and the second the one in the cosine, so $A=7x$, $B=x$. This gives $\\sin8x+\\sin6x$. Swapping them gives $\\sin8x+\\sin(-6x)$, which is $\\sin8x-\\sin6x$ and is a different expression.'))
  ] };

  // =====================================================================
  // FPM-TRI-23 Proving identities with double-angle and addition formulae
  // =====================================================================
  B['FPM-TRI-23'] = { title: 'Proving identities with double-angle and addition formulae', items: [
    G('rewrite', function () {
      var c = rint(1, 9) * 2 - (Math.random() < 0.5 ? 1 : 0), k = c / 2;
      return num('Using $\\sin2x=2\\sin x\\cos x$, write $' + coef(c) + '\\sin x\\cos x$ as $k\\sin2x$. Find $k$.', k,
        '$\\sin x\\cos x=\\frac{1}{2}\\sin2x$, so $' + coef(c) + '\\sin x\\cos x=' + coef(k) + '\\sin2x$.');
    }),
    G('rewrite', function () {
      var c = rint(1, 8) * 2, a = c / 2;
      return num('Using $\\cos2x=1-2\\sin^2x$, the expression $' + c + '\\sin^2x$ can be written as $a-a\\cos2x$. Find $a$.', a,
        'Rearranging gives $\\sin^2x=\\frac{1-\\cos2x}{2}$, so $' + c + '\\sin^2x=' + a + '(1-\\cos2x)=' + a + '-' + a + '\\cos2x$.');
    }),
    G('multiple-angle', function () {
      var n = rint(2, 6);
      return num('Using a double-angle formula twice if needed, $\\sin' + (2 * n) + 'A=2\\sin nA\\cos nA$ for a whole number $n$. Find $n$.', n,
        'The double-angle formula is $\\sin2\\theta=2\\sin\\theta\\cos\\theta$. With $2\\theta=' + (2 * n) + 'A$ we have $\\theta=' + n + 'A$, so $n=' + n + '$.');
    }),
    G('multiple-angle', function () {
      var n = rint(2, 6);
      return num('Using $\\cos2\\theta=2\\cos^2\\theta-1$, we have $\\cos' + (2 * n) + 'A=2\\cos^2nA-1$ for a whole number $n$. Find $n$.', n,
        'Here $2\\theta=' + (2 * n) + 'A$, so $\\theta=' + n + 'A$. For example $\\cos4A=2\\cos^22A-1$ is the case $n=2$.');
    }),
    G('compare', function () {
      var p = pick([1, 2, 3, 4, 5, 6]), q = pick([2, 3, 4, 5, 6, 8]), r = pick([1, 2, 3, 4, 5, 6]), which = pick(['a', 'b', 'c']);
      var ans = which === 'a' ? (p + r) / 2 : which === 'b' ? q / 2 : (r - p) / 2;
      return num('Given that $' + poly([[p, '\\sin^2x'], [q, '\\sin x\\cos x'], [r, '\\cos^2x']]) + '\\equiv a+b\\sin2x+c\\cos2x$, find the value of $' + which + '$.', ans,
        'Use $\\sin^2x=\\frac{1-\\cos2x}{2}$, $\\cos^2x=\\frac{1+\\cos2x}{2}$ and $\\sin x\\cos x=\\frac{1}{2}\\sin2x$. Then $a=\\frac{' + p + '+' + r + '}{2}=' + (p + r) / 2 + '$, $b=\\frac{' + q + '}{2}=' + q / 2 + '$ and $c=\\frac{' + r + '-' + p + '}{2}=' + (r - p) / 2 + '$.');
    }),
    G('apply', function () {
      var t = pick([2, 3, 0.5, 0.75, -2, -3]), pick1 = pick(['sin', 'cos']);
      var s = pick1 === 'sin' ? 2 * t / (1 + t * t) : (1 - t * t) / (1 + t * t);
      var ans = R.roundDp(s, 3);
      return num('Given that $\\tan x=' + t + '$, find the value of $' + (pick1 === 'sin' ? '\\sin2x' : '\\cos2x') + '$ using $' + (pick1 === 'sin' ? '\\sin2x=\\frac{2\\tan x}{1+\\tan^2x}' : '\\cos2x=\\frac{1-\\tan^2x}{1+\\tan^2x}') + '$ (this identity is obtained by dividing top and bottom of the double-angle formula by $\\cos^2x$). Give your answer to 3 decimal places.', ans,
        pick1 === 'sin' ? '$\\sin2x=\\frac{2\\times(' + t + ')}{1+(' + t + ')^2}=\\frac{' + (2 * t) + '}{' + R.roundDp(1 + t * t, 4) + '}=' + ans + '$.' : '$\\cos2x=\\frac{1-(' + t + ')^2}{1+(' + t + ')^2}=\\frac{' + R.roundDp(1 - t * t, 4) + '}{' + R.roundDp(1 + t * t, 4) + '}=' + ans + '$.', 0.001);
    }),
    fix('identity', mk('To prove $\\frac{1-\\cos2x}{\\sin2x}\\equiv\\tan x$ starting from the left-hand side, which pair of substitutions is the best first step?',
      '$1-\\cos2x=2\\sin^2x$ and $\\sin2x=2\\sin x\\cos x$', ['$1-\\cos2x=2\\cos^2x-2$ and $\\sin2x=2\\sin x$', '$1-\\cos2x=\\sin^2x-\\cos^2x+1$ and $\\sin2x=\\cos^2x$', '$1-\\cos2x=2\\cos^2x$ and $\\sin2x=2\\sin x\\cos x$'],
      'Using $\\cos2x=1-2\\sin^2x$ gives $1-\\cos2x=2\\sin^2x$. Then $\\frac{2\\sin^2x}{2\\sin x\\cos x}=\\frac{\\sin x}{\\cos x}=\\tan x$. Using the wrong form of $\\cos2x$ would not simplify.')),
    fix('identity', mk('Which expression is equivalent to $\\frac{\\sin2x}{1+\\cos2x}$?',
      '$\\tan x$', ['$\\cot x$', '$2\\tan x$', '$\\sin x$'],
      'Use $\\sin2x=2\\sin x\\cos x$ and $1+\\cos2x=2\\cos^2x$: the fraction is $\\frac{2\\sin x\\cos x}{2\\cos^2x}=\\frac{\\sin x}{\\cos x}=\\tan x$.')),
    fix('identity', mk('Which expression is equivalent to $\\frac{1-\\cos2x}{1+\\cos2x}$?',
      '$\\tan^2x$', ['$\\cot^2x$', '$\\tan x$', '$1$'],
      '$1-\\cos2x=2\\sin^2x$ and $1+\\cos2x=2\\cos^2x$, so the fraction is $\\frac{\\sin^2x}{\\cos^2x}=\\tan^2x$.')),
    fix('method', mk('The question says: "Show that $\\cos4A\\equiv8\\cos^4A-8\\cos^2A+1$." Which is a sound way to begin?',
      'Write $\\cos4A=2\\cos^22A-1$, then replace $\\cos2A$ by $2\\cos^2A-1$', ['Assume the result is true, then simplify both sides until they match', 'Write $\\cos4A=2\\cos2A$ and expand', 'Write $\\cos4A=\\cos^2A-\\sin^2A$'],
      'Applying the double-angle formula to $4A=2\\times2A$ gives $\\cos4A=2\\cos^22A-1$, then $2(2\\cos^2A-1)^2-1=8\\cos^4A-8\\cos^2A+1$. Working on both sides at once, or starting from the answer, does not prove the identity.')),
    fix('method', mk('Which statement about proving an identity "show that LHS $\\equiv$ RHS" is correct?',
      'Start from one side and reach the other in a single chain of equal expressions', ['Do the same operation to both sides until they match', 'Rearrange the identity into $0=0$', 'It is enough to check that it works for one value of $x$'],
      'A proof is a chain from one side to the other in which each line equals the one before. Operating on both sides assumes the result, and one value of $x$ proves nothing.'))
  ] };

  // =====================================================================
  // FPM-TRI-24 Solving trig equations with a multiple or shifted angle
  // =====================================================================
  var TV = {
    sin: [[0.5, '0.5'], [-0.5, '-0.5'], [Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'], [-Math.sqrt(2) / 2, '-\\frac{\\sqrt{2}}{2}']],
    cos: [[0.5, '0.5'], [-0.5, '-0.5'], [Math.sqrt(2) / 2, '\\frac{\\sqrt{2}}{2}'], [-Math.sqrt(3) / 2, '-\\frac{\\sqrt{3}}{2}']],
    tan: [[1, '1'], [-1, '-1'], [Math.sqrt(3), '\\sqrt{3}'], [1 / Math.sqrt(3), '\\frac{1}{\\sqrt{3}}']]
  };
  function argTxt(k, c) {
    var kx = k === 1 ? 'x' : k === 0.5 ? '\\frac{x}{2}' : k + 'x';
    return kx + (c > 0 ? ' + ' + c : c < 0 ? ' - ' + (-c) : '');
  }
  function t24() {
    var CF = [[2, 0, 0, 180], [2, 30, 0, 180], [2, -30, 0, 180], [2, 60, 0, 180], [1, 30, 0, 360], [1, -45, 0, 360], [1, 60, 0, 360], [0.5, 0, 0, 720], [3, 15, 0, 120], [3, -30, 0, 120], [2, -45, 0, 180]];
    for (var tries = 0; tries < 300; tries++) {
      var f = pick(['sin', 'cos', 'tan']), tv = pick(TV[f]), cf = pick(CF), s = sols(f, tv[0], cf[0], cf[1], cf[2], cf[3]);
      if (s.length >= 2 && s.every(isQuarter)) return { f: f, v: tv, k: cf[0], c: cf[1], lo: cf[2], hi: cf[3], s: s };
    }
    return { f: 'sin', v: TV.sin[0], k: 2, c: 0, lo: 0, hi: 180, s: [15, 75] };
  }
  function t24q(P) {
    return 'Solve $\\' + P.f + '(' + argTxt(P.k, P.c) + ')^\\circ=' + P.v[1] + '$ for $' + P.lo + '\\leqslant x\\lt ' + P.hi + '$ (angles in degrees).';
  }
  function t24why(P) {
    var u1 = P.k * P.lo + P.c, u2 = P.k * P.hi + P.c;
    return 'Let $u=' + argTxt(P.k, P.c) + '$, so $' + u1 + '\\leqslant u\\lt ' + u2 + '$. Find every $u$ in that interval (sin: $\\alpha$ and $180^\\circ-\\alpha$; cos: $\\pm\\alpha$; tan: add $180^\\circ$), then $x=' + (P.k === 1 ? 'u' + (P.c > 0 ? '-' + P.c : P.c < 0 ? '+' + (-P.c) : '') : '\\frac{u' + (P.c > 0 ? '-' + P.c : P.c < 0 ? '+' + (-P.c) : '') + '}{' + P.k + '}') + '$. The solutions are $x=' + P.s.join(', ') + '$.';
  }
  B['FPM-TRI-24'] = { title: 'Solving trig equations with a multiple or shifted angle', items: [
    G('count', function () { var P = t24(); return num(t24q(P) + ' How many solutions are there?', P.s.length, t24why(P)); }),
    G('smallest', function () { var P = t24(); return num(t24q(P) + ' Find the smallest solution, in degrees.', P.s[0], t24why(P)); }),
    G('largest', function () { var P = t24(); return num(t24q(P) + ' Find the largest solution, in degrees.', P.s[P.s.length - 1], t24why(P)); }),
    G('sum', function () { var P = t24(); return num(t24q(P) + ' Find the sum of all the solutions, in degrees.', sum(P.s), t24why(P)); }),
    G('second-smallest', function () { var P = t24(); return num(t24q(P) + ' Find the second smallest solution, in degrees.', P.s[1], t24why(P)); }),
    G('interval', function () {
      var k = pick([2, 3, 4]), c = pick([-75, -30, 20, 40, 60]), lo = 0, hi = pick([90, 120, 180, 360]);
      var u1 = k * lo + c, u2 = k * hi + c;
      return mk('To solve $\\sin(' + argTxt(k, c) + ')^\\circ=0.5$ for $0\\leqslant x\\lt ' + hi + '$, let $u=' + argTxt(k, c) + '$. Which interval must $u$ cover?',
        '$' + u1 + '\\leqslant u\\lt ' + u2 + '$', ['$' + (lo + c) + '\\leqslant u\\lt ' + (hi + c) + '$', '$' + (k * lo) + '\\leqslant u\\lt ' + (k * hi) + '$', '$' + (k * lo - c) + '\\leqslant u\\lt ' + (k * hi - c) + '$'],
        'Multiply the ends of the interval by $' + k + '$ and then add $' + c + '$: $' + k + '\\times0' + (c >= 0 ? '+' : '') + c + '=' + u1 + '$ and $' + k + '\\times' + hi + (c >= 0 ? '+' : '') + c + '=' + u2 + '$. The other options forget the multiple or the shift, or use the wrong sign.');
    }),
    G('second-solution', function () {
      var f = pick(['sin', 'cos', 'tan']), th = pick([25, 32, 40, 48, 54, 63, 70]);
      var cor, ds;
      if (f === 'sin') { cor = 180 - th; ds = [360 - th, 180 + th, th + 90]; }
      else if (f === 'cos') { cor = 360 - th; ds = [180 - th, 180 + th, th + 180 + 90]; }
      else { cor = 180 + th; ds = [360 - th, 180 - th, 360 + th]; }
      var rule = f === 'sin' ? '$\\sin u$ is also positive in the second quadrant, so $u=180^\\circ-\\theta$' : f === 'cos' ? '$\\cos u$ is also positive in the fourth quadrant, so $u=360^\\circ-\\theta$' : '$\\tan$ repeats every $180^\\circ$, so $u=\\theta+180^\\circ$';
      return mk('The calculator gives $u=' + th + '^\\circ$ for $\\' + f + ' u=k$ where $k$ is positive. What is the next solution for $u$ between $0^\\circ$ and $360^\\circ$?', cor + ' degrees', ds.map(function (d) { return d + ' degrees'; }),
        'Here ' + rule + ', which is ' + cor + ' degrees.');
    }),
    fix('radians', mk('Solve $\\tan x=1$ for $0\\leqslant x\\leqslant2\\pi$ (radians).',
      '$x=\\frac{\\pi}{4},\\frac{5\\pi}{4}$', ['$x=\\frac{\\pi}{4},\\frac{3\\pi}{4}$', '$x=\\frac{\\pi}{4},\\frac{7\\pi}{4}$', '$x=\\frac{\\pi}{4},\\pi$'],
      'The principal value is $\\frac{\\pi}{4}$, and tan repeats every $\\pi$, so the next solution is $\\frac{\\pi}{4}+\\pi=\\frac{5\\pi}{4}$.')),
    fix('radians', mk('Solve $\\cos x=\\frac{1}{2}$ for $0\\leqslant x\\leqslant2\\pi$ (radians).',
      '$x=\\frac{\\pi}{3},\\frac{5\\pi}{3}$', ['$x=\\frac{\\pi}{3},\\frac{2\\pi}{3}$', '$x=\\frac{\\pi}{6},\\frac{11\\pi}{6}$', '$x=\\frac{\\pi}{3},\\frac{4\\pi}{3}$'],
      '$\\cos^{-1}\\frac{1}{2}=\\frac{\\pi}{3}$, and the other solution is $2\\pi-\\frac{\\pi}{3}=\\frac{5\\pi}{3}$ (cosine is symmetrical about $x=\\pi$).')),
    fix('common-error', mk('A student solves $\\sin(2x)^\\circ=0.5$ for $0\\leqslant x\\lt90$ and finds $2x=30$, so $x=15$, and $2x=150$, so $x=75$. Which comment is correct?',
      'Both answers are in range, and no more exist because $2x$ only runs from $0$ to $180$', ['Two more solutions are missing, $x=195$ and $x=255$', 'Only $x=15$ is right, because the second solution of a sine equation is not needed', 'Both are wrong, because $x$ should be $2\\times30=60$'],
      'For $0\\leqslant x\\lt90$ we need $0\\leqslant2x\\lt180$, so $2x=30$ and $2x=150$ are both in range, giving $x=15$ and $x=75$. Adding $360$ to $2x$ gives values of $x$ well beyond $90$.'))
  ] };

  // =====================================================================
  // FPM-TRI-25 Turning sin and cos equations into tan
  // =====================================================================
  var EQ25 = [
    ['\\sin(x+30)^\\circ=\\cos x^\\circ', [30, 210]],
    ['\\sin(x+30)^\\circ=2\\cos x^\\circ', [60, 240]],
    ['\\sin(x-30)^\\circ=\\cos x^\\circ', [60, 240]],
    ['\\cos(x+60)^\\circ=\\sin x^\\circ', [15, 195]],
    ['\\cos(x-30)^\\circ=\\sin(x+30)^\\circ', [45, 225]],
    ['\\sin(x+60)^\\circ=\\cos x^\\circ', [15, 195]],
    ['\\cos(x+30)^\\circ=\\sin x^\\circ', [30, 210]]
  ];
  var TAN25 = {
    '0': '\\tan x=\\frac{1}{\\sqrt{3}}', '1': '\\tan x=\\sqrt{3}', '2': '\\tan x=\\sqrt{3}', '3': '\\tan x=2-\\sqrt{3}', '4': '\\tan x=1', '5': '\\tan x=2-\\sqrt{3}', '6': '\\tan x=\\frac{1}{\\sqrt{3}}'
  };
  function tanEq(a, b, k, c, lo, hi) {   // a sin(kx + c) = b cos(kx + c)
    var arg = argTxt(k, c), br = arg === 'x' ? 'x' : '(' + arg + ')';
    return { text: coef(a) + '\\sin' + br + '^\\circ=' + coef(b) + '\\cos' + br + '^\\circ', s: sols('tan', b / a, k, c, lo, hi), r: b / a };
  }
  function t25() {
    for (var i = 0; i < 300; i++) {
      var a = pick([1, 2, 3, 4, 5]), b = pick([1, 2, 3, 4, 5, 6]), k = pick([1, 1, 2]), c = pick([0, 0, 20, -20, 30, -30]);
      var hi = k === 1 ? 360 : 180;
      if (gcd(a, b) !== 1 || a === b) continue;
      var E = tanEq(a, b, k, c, 0, hi); E.k = k; E.c = c; E.hi = hi; E.a = a; E.b = b;
      if (E.s.length >= 2) return E;
    }
    return tanEq(1, 2, 1, 0, 0, 360);
  }
  B['FPM-TRI-25'] = { title: 'Turning sin and cos equations into tan', items: [
    G('to-tan', function () {
      var a, b; do { a = rint(1, 7); b = rint(1, 7); } while (a === b || gcd(a, b) !== 1);
      var sg = pick([1, -1]), bb = sg * b;
      return mk('Divide both sides of $' + coef(a) + '\\sin u=' + (bb < 0 ? '-' : '') + coef(b) + '\\cos u$ by $\\cos u$ (and by ' + a + '). Which equation results?',
        '$\\tan u=' + fr(bb, a) + '$', ['$\\tan u=' + fr(a, bb) + '$', '$\\tan u=' + fr(-bb, a) + '$', '$\\tan u=' + fr(-a, bb) + '$'],
        'Since $\\frac{\\sin u}{\\cos u}=\\tan u$, dividing by $\\cos u$ gives $' + coef(a) + '\\tan u=' + bb + '$, so $\\tan u=' + fr(bb, a) + '$. The ratio is (cos coefficient) over (sin coefficient), not the other way round.');
    }),
    G('to-tan', function () {
      var a, b; do { a = rint(1, 6); b = rint(1, 6); } while (a === b || gcd(a, b) !== 1);
      var c1 = poly([[a, '\\sin x'], [-b, '\\cos x']]) + '=0';
      return mk('The equation $' + c1 + '$ is rearranged to a single trig ratio. Which is correct?', '$\\tan x=' + fr(b, a) + '$', ['$\\tan x=' + fr(a, b) + '$', '$\\tan x=-' + fr(b, a) + '$', '$\\cot x=' + fr(b, a) + '$'],
        'Move the cosine term across: $' + coef(a) + '\\sin x=' + coef(b) + '\\cos x$, then divide by $\\cos x$ and by ' + a + ': $\\tan x=' + fr(b, a) + '$.');
    }),
    G('solve-tan', function () {
      var E = t25();
      return num('Solve $' + E.text + '$ for $0\\leqslant x\\lt ' + E.hi + '$ (degrees). Give the smallest solution to 1 decimal place.', R.roundDp(E.s[0], 1),
        'Divide by the cosine: $\\tan(' + argTxt(E.k, E.c) + ')^\\circ=' + fr(E.b, E.a) + '$. Let $u=' + argTxt(E.k, E.c) + '$, find $u=\\tan^{-1}' + fr(E.b, E.a) + '$ and add $180^\\circ$ for the other values in the interval for $u$, then undo the shift and multiple. The solutions are ' + E.s.map(function (x) { return R.roundDp(x, 1); }).join(', ') + '.', 0.06);
    }),
    G('solve-tan', function () {
      var E = t25();
      return num('Solve $' + E.text + '$ for $0\\leqslant x\\lt ' + E.hi + '$ (degrees). Give the largest solution to 1 decimal place.', R.roundDp(E.s[E.s.length - 1], 1),
        'Divide by the cosine to get $\\tan(' + argTxt(E.k, E.c) + ')^\\circ=' + fr(E.b, E.a) + '$. Take $\\tan^{-1}$ and add multiples of $180^\\circ$ for $u=' + argTxt(E.k, E.c) + '$ over its whole interval, then solve for $x$. The solutions are ' + E.s.map(function (x) { return R.roundDp(x, 1); }).join(', ') + '.', 0.06);
    }),
    G('solve-tan', function () {
      var E = t25();
      return num('Solve $' + E.text + '$ for $0\\leqslant x\\lt ' + E.hi + '$ (degrees). How many solutions are there?', E.s.length,
        'Divide by the cosine to get $\\tan(' + argTxt(E.k, E.c) + ')^\\circ=' + fr(E.b, E.a) + '$. Tan repeats every $180^\\circ$, and $u=' + argTxt(E.k, E.c) + '$ runs over an interval of length ' + (E.k * E.hi) + ' degrees, giving ' + E.s.length + ' solutions: ' + E.s.map(function (x) { return R.roundDp(x, 1); }).join(', ') + '.');
    }),
    G('expand-first', function () {
      var i = rint(0, EQ25.length - 1), e = EQ25[i], t = TAN25[String(i)];
      var s = e[1];
      return mk('Expanding the compound angles and collecting terms turns $' + e[0] + '$ into one of these. Which one, and what are the solutions for $0\\leqslant x\\lt360$?',
        '$' + t + '$, giving $x=' + s[0] + '^\\circ$ and $x=' + s[1] + '^\\circ$', [
          '$' + t + '$, giving $x=' + s[0] + '^\\circ$ only', '$' + t + '$, giving $x=' + s[0] + '^\\circ$ and $x=' + (360 - s[0]) + '^\\circ$', '$' + t.replace('\\tan x', '\\cot x') + '$, giving $x=' + s[0] + '^\\circ$ and $x=' + s[1] + '^\\circ$'],
        'Expand with the addition formulae, collect the $\\sin x$ terms on one side and the $\\cos x$ terms on the other, and divide by $\\cos x$ to reach $' + t + '$. The principal value is ' + s[0] + ' degrees and the second solution is a half-turn later, ' + s[1] + ' degrees.');
    }),
    G('express', function () {
      var m = pick([2, 3, 5, 1.5, 4]), k = (m + 1) / (m - 1);
      return num('Given that $\\sin(x+y)=' + m + '\\sin(x-y)$, show that $\\tan x=k\\tan y$ and find the value of $k$.', k,
        'Expand: $\\sin x\\cos y+\\cos x\\sin y=' + m + '\\sin x\\cos y-' + m + '\\cos x\\sin y$. Collect: $' + (m + 1) + '\\cos x\\sin y=' + (m - 1) + '\\sin x\\cos y$. Divide by $\\cos x\\cos y$: $' + (m + 1) + '\\tan y=' + (m - 1) + '\\tan x$, so $\\tan x=\\frac{' + (m + 1) + '}{' + (m - 1) + '}\\tan y$ and $k=' + k + '$.');
    }),
    fix('common-error', mk('A student solves $\\sin u-3\\cos u=0$ and writes $\\tan u=\\frac{1}{3}$. What is the error?',
      'Moving the term gives $\\sin u=3\\cos u$, so dividing by $\\cos u$ gives $\\tan u=3$', ['None: $\\tan u=\\frac{\\cos u}{\\sin u}$ so $\\frac{1}{3}$ is correct', 'It should be $\\tan u=-3$ because of the minus sign', 'It should be $\\tan u=\\frac{1}{3}$ and $-3$ because there are two roots'],
      'Tan is sine over cosine. From $\\sin u=3\\cos u$ we divide both sides by $\\cos u$ and get $\\tan u=3$. Writing $\\frac{1}{3}$ comes from dividing the wrong way round.')),
    fix('common-error', mk('Why is it safe to divide by $\\cos u$ when solving $a\\sin u=b\\cos u$ (with $a\\neq0$)?',
      'If $\\cos u=0$ then the equation gives $a\\sin u=0$ with $\\sin u=\\pm1$, which is impossible, so $\\cos u=0$ is not a solution', ['Because $\\cos u$ is never zero', 'Because dividing by any trig ratio is always allowed', 'Because $\\sin u$ and $\\cos u$ cancel'],
      'When $\\cos u=0$, $\\sin u$ is $1$ or $-1$, so the left side is not zero while the right side is. So no solutions are lost by dividing by $\\cos u$.')),
    fix('common-error', mk('Solve $\\tan x=2$ for $0\\leqslant x\\lt360$. Which statement lists all the solutions correctly (to 1 decimal place)?',
      '$x=63.4^\\circ$ and $x=243.4^\\circ$', ['$x=63.4^\\circ$ only', '$x=63.4^\\circ$ and $x=296.6^\\circ$', '$x=63.4^\\circ$ and $x=116.6^\\circ$'],
      '$\\tan^{-1}2=63.4^\\circ$ and tan repeats every $180^\\circ$, so the next solution is $63.4^\\circ+180^\\circ=243.4^\\circ$. The values $116.6^\\circ$ and $296.6^\\circ$ are solutions of $\\tan x=-2$.'))
  ] };

  // =====================================================================
  // FPM-TRI-26 Trig equations that factorise
  // =====================================================================
  B['FPM-TRI-26'] = { title: 'Trig equations that factorise', items: [
    G('tan-sin', function () {
      var a = rint(1, 4), sg = pick([1, -1]), b = sg * 2 * a, c = -a / b;
      var s = sols('sin', 0, 1, 0, 0, 360, true).concat(sols('cos', c, 1, 0, 0, 360, true)).sort(function (x, y) { return x - y; });
      return num('Solve $' + poly([[a, '\\tan x'], [b, '\\sin x']]) + '=0$ for $0\\leqslant x\\leqslant360$ (degrees). How many solutions are there?', s.length,
        'Write $\\tan x=\\frac{\\sin x}{\\cos x}$ and factorise: $\\sin x\\left(\\frac{' + a + '}{\\cos x}' + (b < 0 ? ' - ' : ' + ') + Math.abs(b) + '\\right)=0$. Either $\\sin x=0$, giving $0, 180, 360$, or $\\cos x=' + c + '$, giving ' + sols('cos', c, 1, 0, 0, 360, true).join(' and ') + '. That is ' + s.length + ' solutions in total. Dividing by $\\sin x$ would lose three of them.');
    }),
    G('tan-sin', function () {
      var a = rint(1, 4), sg = pick([1, -1]), b = sg * 2 * a, c = -a / b;
      var cs = sols('cos', c, 1, 0, 0, 360);
      return num('Solve $' + poly([[a, '\\tan x'], [b, '\\sin x']]) + '=0$ for $0\\lt x\\lt360$ (degrees). Find the smallest solution.', Math.min(cs[0], 180),
        'Factorise: $\\sin x\\left(\\frac{' + a + '}{\\cos x}' + (b < 0 ? ' - ' : ' + ') + Math.abs(b) + '\\right)=0$. For $0\\lt x\\lt360$, $\\sin x=0$ gives $x=180$ and $\\cos x=' + c + '$ gives ' + cs.join(' and ') + '. The smallest is ' + Math.min(cs[0], 180) + '.');
    }),
    G('tan-n-sin', function () {
      var n = rint(2, 6), x = R.roundDp(deg(Math.acos(1 / n)), 1);
      return num('Solve $\\tan x=' + n + '\\sin x$ for $0\\leqslant x\\leqslant360$ (degrees). Give the smallest positive solution to 1 decimal place.', x,
        '$\\frac{\\sin x}{\\cos x}=' + n + '\\sin x$, so $\\sin x(1-' + n + '\\cos x)=0$. Either $\\sin x=0$ (giving 0, 180, 360) or $\\cos x=\\frac{1}{' + n + '}$, giving $x=' + x + '$ or ' + R.roundDp(360 - x, 1) + '. The smallest positive solution is ' + x + ' degrees.', 0.06);
    }),
    G('tan-n-sin', function () {
      var n = rint(2, 6);
      return num('Solve $\\tan x=' + n + '\\sin x$ for $0\\leqslant x\\leqslant360$ (degrees). How many solutions are there?', 5,
        'Factorise: $\\sin x\\left(\\frac{1}{\\cos x}-' + n + '\\right)=0$. $\\sin x=0$ gives $x=0, 180, 360$ and $\\cos x=\\frac{1}{' + n + '}$ gives two more, one in each of the first and fourth quadrants. That is 5 solutions. Dividing by $\\sin x$ would give only 2.');
    }),
    G('sin2x', function () {
      var m = pick([1, -1]), s = sols('sin', 0, 1, 0, 0, 360).concat(sols('cos', m / 2, 1, 0, 0, 360)).sort(function (a, b) { return a - b; });
      return num('Solve $\\sin2x=' + (m < 0 ? '-' : '') + '\\sin x$ for $0\\leqslant x\\lt360$ (degrees). How many solutions are there?', s.length,
        'Use $\\sin2x=2\\sin x\\cos x$ and factorise: $\\sin x(2\\cos x' + (m < 0 ? '+' : '-') + '1)=0$. $\\sin x=0$ gives 0 and 180; $\\cos x=' + (m / 2) + '$ gives ' + sols('cos', m / 2, 1, 0, 0, 360).join(' and ') + '. In total ' + s.length + ' solutions: ' + s.join(', ') + '.');
    }),
    G('sin2x', function () {
      var m = pick([1, -1]), cs = sols('cos', m / 2, 1, 0, 0, 360);
      return num('Solve $\\sin2x=' + (m < 0 ? '-' : '') + '\\sin x$ for $0\\lt x\\lt360$ (degrees). Find the smallest solution.', Math.min(cs[0], 180),
        'Write $2\\sin x\\cos x=' + (m < 0 ? '-' : '') + '\\sin x$ and factorise: $\\sin x(2\\cos x' + (m < 0 ? '+' : '-') + '1)=0$. In $0\\lt x\\lt360$: $\\sin x=0$ gives $x=180$ and $\\cos x=' + (m / 2) + '$ gives ' + cs.join(' and ') + '. The smallest is ' + Math.min(cs[0], 180) + '.');
    }),
    G('common-factor', function () {
      var T = [
        ['4\\sin x\\cos x-3\\sin x', '$\\sin x(4\\cos x-3)$', ['$\\cos x(4\\sin x-3)$', '$\\sin x(4\\cos x-3\\sin x)$', '$4\\sin x\\cos x(1-3)$']],
        ['5\\sin x-2\\sin x\\cos x', '$\\sin x(5-2\\cos x)$', ['$\\cos x(5-2\\sin x)$', '$\\sin x(3\\cos x)$', '$\\sin x(5\\cos x-2)$']],
        ['3\\cos x\\sin x+\\cos x', '$\\cos x(3\\sin x+1)$', ['$\\sin x(3\\cos x+1)$', '$\\cos x(3\\sin x)$', '$\\cos x\\sin x(3+1)$']]
      ], t = pick(T);
      return mk('Factorise $' + t[0] + '$ ready for solving the equation $' + t[0] + '=0$.', t[1], t[2],
        'Pick out the trig factor common to both terms and divide each term by it: ' + t[1] + '. Then set each factor equal to zero.');
    }),
    fix('why-factorise', mk('A student solves $\\sin x\\cos x=\\sin x$ by dividing both sides by $\\sin x$ to get $\\cos x=1$. What goes wrong?',
      'The solutions of $\\sin x=0$ are lost (for example $x=180^\\circ$)', ['Nothing: $\\cos x=1$ gives all the solutions', 'The solution $x=0^\\circ$ is wrongly included', 'The equation should be divided by $\\cos x$ instead'],
      'Move everything to one side and factorise: $\\sin x(\\cos x-1)=0$. Then $\\sin x=0$ or $\\cos x=1$. Dividing by $\\sin x$ throws away every solution of $\\sin x=0$, such as $x=180^\\circ$.')),
    fix('excluded-values', mk('Which of these values of $x$ (degrees) can never be a solution of an equation that contains $\\tan x$?',
      '$x=90$ and $x=270$', ['$x=0$ and $x=180$', '$x=45$ and $x=225$', '$x=60$ and $x=300$'],
      '$\\tan x=\\frac{\\sin x}{\\cos x}$ is not defined where $\\cos x=0$, which is at $90^\\circ$ and $270^\\circ$, so these must be removed even if they appear from a factor.')),
    fix('second-solution', mk('One solution of $\\cos x=\\frac{1}{3}$ is $x=70.5^\\circ$. What is the other solution for $0\\leqslant x\\leqslant360$?',
      '$289.5^\\circ$', ['$109.5^\\circ$', '$250.5^\\circ$', '$19.5^\\circ$'],
      'Cosine is positive in the first and fourth quadrants, so the second solution is $360^\\circ-70.5^\\circ=289.5^\\circ$.'))
  ] };

  // =====================================================================
  // FPM-TRI-27 Quadratic trig equations using an identity
  // =====================================================================
  function quadRoots() {
    var r1 = pick([0.5, -0.5]), r2 = pick([1, -1, 2, -2, 0]);
    return Math.random() < 0.5 ? [r1, r2] : [r2, r1];
  }
  function fmtRoot(r) { return String(r); }
  function t27() {
    var type = pick(['cosr', 'sinr', 'cos2x']), rts = quadRoots(), r1 = rts[0], r2 = rts[1], p = 2, q, r, eq, fn, ident, quad;
    if (type === 'cosr') {
      q = p * (r1 + r2); r = -p * (1 + r1 * r2); fn = 'cos';
      eq = poly([[p, '\\sin^2x'], [q, '\\cos x'], [r, '']]);
      ident = 'Replace $\\sin^2x$ by $1-\\cos^2x$: $' + poly([[p, '(1-\\cos^2x)'], [q, '\\cos x'], [r, '']]) + '=0$, which rearranges to $' + poly([[p, 'c^2'], [-q, 'c'], [-(p + r), '']]) + '=0$ with $c=\\cos x$';
    } else if (type === 'sinr') {
      q = p * (r1 + r2); r = -p * (1 + r1 * r2); fn = 'sin';
      eq = poly([[p, '\\cos^2x'], [q, '\\sin x'], [r, '']]);
      ident = 'Replace $\\cos^2x$ by $1-\\sin^2x$: $' + poly([[p, '(1-\\sin^2x)'], [q, '\\sin x'], [r, '']]) + '=0$, which rearranges to $' + poly([[p, 's^2'], [-q, 's'], [-(p + r), '']]) + '=0$ with $s=\\sin x$';
    } else {
      q = 4 * (r1 + r2); r = -2 - 4 * r1 * r2; fn = 'sin';
      eq = poly([[2, '\\cos2x'], [q, '\\sin x'], [r, '']]);
      ident = 'Replace $\\cos2x$ by $1-2\\sin^2x$: $' + poly([[2, '(1-2\\sin^2x)'], [q, '\\sin x'], [r, '']]) + '=0$, which rearranges to $' + poly([[4, 's^2'], [-q, 's'], [-(2 + r), '']]) + '=0$ with $s=\\sin x$';
    }
    var s = [];
    [r1, r2].forEach(function (rt) { if (Math.abs(rt) <= 1) sols(fn, rt, 1, 0, 0, 360).forEach(function (x) { if (s.indexOf(x) < 0) s.push(x); }); });
    s.sort(function (a, b) { return a - b; });
    var why = ident.replace(/\$\$/g, '$') + '. Factorising gives the roots $\\' + fn + ' x=' + fmtRoot(r1) + '$ and $\\' + fn + ' x=' + fmtRoot(r2) + '$ (reject any value outside $-1$ to $1$). The solutions in $0\\leqslant x\\lt360$ are ' + (s.length ? s.join(', ') : 'none') + '.';
    return { eq: eq, s: s, why: why };
  }
  function ratio(num_, den_) { return 'x'; }
  B['FPM-TRI-27'] = { title: 'Quadratic trig equations using an identity', items: [
    G('one-ratio', function () {
      var E = t27();
      return num('Solve $' + E.eq + '=0$ for $0\\leqslant x\\lt360$ (degrees). How many solutions are there?', E.s.length, E.why);
    }),
    G('one-ratio', function () {
      var E = t27();
      while (E.s.length < 2) E = t27();
      return num('Solve $' + E.eq + '=0$ for $0\\leqslant x\\lt360$ (degrees). Find the smallest solution.', E.s[0], E.why);
    }),
    G('one-ratio', function () {
      var E = t27();
      while (E.s.length < 2) E = t27();
      return num('Solve $' + E.eq + '=0$ for $0\\leqslant x\\lt360$ (degrees). Find the largest solution.', E.s[E.s.length - 1], E.why);
    }),
    G('one-ratio', function () {
      var E = t27();
      return num('Solve $' + E.eq + '=0$ for $0\\leqslant x\\lt360$ (degrees). Find the sum of all the solutions.', sum(E.s), E.why);
    }),
    G('tan-squared', function () {
      var m = pick([1, 2, 3]), type = pick([0, 1, 2]), a = type === 0 ? m : type === 1 ? 3 * m : m, b = type === 0 ? 3 * m : type === 1 ? m : m;
      var t2 = b / a, small = R.roundDp(deg(Math.atan(Math.sqrt(t2))), 1);
      return num('Solve $' + coef(a) + '\\sin^2x=' + coef(b) + '\\cos^2x$ for $0\\leqslant x\\lt360$ (degrees). Find the smallest solution.', small,
        'Divide by $\\cos^2x$: $\\tan^2x=' + fr(b, a) + '$, so $\\tan x=\\pm' + (t2 === 3 ? '\\sqrt{3}' : t2 === 1 ? '1' : '\\frac{1}{\\sqrt{3}}') + '$. The smallest positive solution is ' + small + ' degrees; the other three are $180^\\circ-$, $180^\\circ+$ and $360^\\circ-$ that angle.', 0.06);
    }),
    G('tan-squared', function () {
      var m = pick([1, 2, 3]), type = pick([0, 1, 2]), a = type === 0 ? m : type === 1 ? 3 * m : m, b = type === 0 ? 3 * m : type === 1 ? m : m;
      var t2 = b / a, small = R.roundDp(deg(Math.atan(Math.sqrt(t2))), 1);
      return num('Solve $' + coef(a) + '\\sin^2x=' + coef(b) + '\\cos^2x$ for $0\\leqslant x\\lt360$ (degrees). How many solutions are there?', 4,
        'Divide by $\\cos^2x$: $\\tan^2x=' + fr(b, a) + '$, so $\\tan x=\\pm\\sqrt{' + fr(b, a) + '}$. Each of the two values gives two solutions in $0\\leqslant x\\lt360$, so there are 4 (starting at ' + small + ' degrees).');
    }),
    G('divide-by-cos2', function () {
      var t1, t2; do { t1 = pick([1, -1, 2, -2, 3]); t2 = pick([1, -1, 2, -2, 3]); } while (t1 === t2);
      var eq = poly([[1, '\\sin^2x'], [-(t1 + t2), '\\sin x\\cos x'], [t1 * t2, '\\cos^2x']]);
      var xs = [t1, t2].map(function (t) { var x = deg(Math.atan(t)); return x < 0 ? x + 180 : x; }).sort(function (a, b) { return a - b; });
      return num('Solve $' + eq + '=0$ for $0\\leqslant x\\lt180$ (degrees). Give the smaller solution to 1 decimal place.', R.roundDp(xs[0], 1),
        'Divide every term by $\\cos^2x$ (this is allowed because $\\cos x=0$ is not a solution): $' + poly([[1, '\\tan^2x'], [-(t1 + t2), '\\tan x'], [t1 * t2, '']]) + '=0$, which factorises as $(\\tan x' + (t1 > 0 ? '-' + t1 : '+' + (-t1)) + ')(\\tan x' + (t2 > 0 ? '-' + t2 : '+' + (-t2)) + ')=0$. So $\\tan x=' + t1 + '$ or $' + t2 + '$, giving ' + xs.map(function (x) { return R.roundDp(x, 1); }).join(' and ') + ' degrees.', 0.06);
    }),
    G('divide-by-cos2', function () {
      var p = pick([2, 3]), q = pick([1, -1, 3, -3, 5, -5]), r = pick([1, -1, 2, -2]);
      var cor, ds, tries = 0;
      do {
        cor = poly([[p, '\\tan^2x'], [q, '\\tan x'], [r, '']]) + '=0';
        ds = [poly([[p, '\\tan^2x'], [q, '\\tan x'], [-r, '']]) + '=0', poly([[p, '\\tan^2x'], [-q, '\\tan x'], [r, '']]) + '=0', poly([[r, '\\tan^2x'], [q, '\\tan x'], [p, '']]) + '=0'];
        if (new Set([cor].concat(ds)).size === 4) break;
        q = pick([1, -1, 3, -3, 5, -5]); r = pick([1, -1, 2, -2]); tries++;
      } while (tries < 50);
      return mk('Dividing every term of $' + poly([[p, '\\sin^2x'], [q, '\\sin x\\cos x'], [r, '\\cos^2x']]) + '=0$ by $\\cos^2x$ gives which equation?', '$' + cor + '$', ds.map(function (d) { return '$' + d + '$'; }),
        'Use $\\frac{\\sin^2x}{\\cos^2x}=\\tan^2x$, $\\frac{\\sin x\\cos x}{\\cos^2x}=\\tan x$ and $\\frac{\\cos^2x}{\\cos^2x}=1$. Each coefficient stays with its term: $' + cor + '$.');
    }),
    G('reject', function () {
      var a = pick([2, 3, 4]), b = pick([-2, -3, 3, 5]), eq = poly([[1, '\\sin^2x'], [-(a + b), '\\sin x'], [a * b, '']]);
      return mk('Solve $' + eq + '=0$ for $0\\leqslant x\\lt360$ (degrees). Which statement is correct?',
        'There are no solutions: the roots are $\\sin x=' + a + '$ and $\\sin x=' + b + '$, both outside $-1\\leqslant\\sin x\\leqslant1$', ['There are two solutions, one for each root', 'There is one solution, from $\\sin x=' + a + '$', 'There are four solutions, two for each root'],
        'The quadratic factorises as $(\\sin x-' + a + ')(\\sin x' + (b < 0 ? '+' + (-b) : '-' + b) + ')=0$. Sine can only take values from $-1$ to $1$, so neither $' + a + '$ nor $' + b + '$ gives an angle. There are no solutions.');
    }),
    fix('identity', mk('To turn $\\cos2x+3\\sin x=2$ into an equation in $\\sin x$ only, which form of $\\cos2x$ should be used?',
      '$\\cos2x=1-2\\sin^2x$', ['$\\cos2x=2\\cos^2x-1$', '$\\cos2x=\\cos^2x-\\sin^2x$', '$\\cos2x=1-2\\cos^2x$'],
      'Only $1-2\\sin^2x$ contains $\\sin x$ alone. The equation becomes $1-2\\sin^2x+3\\sin x=2$, i.e. $2\\sin^2x-3\\sin x+1=0$, which factorises as $(2\\sin x-1)(\\sin x-1)=0$.')),
    fix('identity', mk('Which identity is used to change $\\sin^2x$ into an expression in $\\cos x$?',
      '$\\sin^2x=1-\\cos^2x$', ['$\\sin^2x=\\cos^2x-1$', '$\\sin^2x=1+\\cos^2x$', '$\\sin^2x=\\cos2x$'],
      'From $\\sin^2x+\\cos^2x=1$ we subtract $\\cos^2x$ from both sides to get $\\sin^2x=1-\\cos^2x$.'))
  ] };
})();
