/* Group G12 mastery bank: Vectors (position vectors, magnitude, unit vectors, routes and ratios, proofs, intersections, areas). Original questions, not copied from past papers. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- small helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function rsign() { return Math.random() < 0.5 ? -1 : 1; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  // rationals as [n, d]
  function rf(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return [n / g, d / g]; }
  function radd(a, b) { return rf(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rsub(a, b) { return rf(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function rmul(a, b) { return rf(a[0] * b[0], a[1] * b[1]); }
  function rdiv(a, b) { return rf(a[0] * b[1], a[1] * b[0]); }
  function rdec(a) { return a[0] / a[1]; }
  function rterm(a) { var d = a[1]; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
  function fs(n, d) { var r = rf(n, d); if (r[1] === 1) return String(r[0]); return (r[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(r[0]) + '}{' + r[1] + '}'; }
  function rs(a) { return fs(a[0], a[1]); }
  // a term n/d * sym, with sign handling
  function cterm(n, d, sym, first) {
    var r = rf(n, d); if (r[0] === 0) return '';
    var neg = r[0] < 0, an = Math.abs(r[0]), mag;
    if (an === 1 && r[1] === 1) mag = ''; else if (r[1] === 1) mag = String(an); else mag = '\\frac{' + an + '}{' + r[1] + '}';
    return (first ? (neg ? '-' : '') : (neg ? ' - ' : ' + ')) + mag + sym;
  }
  // combination of [n, d, sym] terms
  function combo(terms) {
    var s = '';
    terms.forEach(function (t) { var c = cterm(t[0], t[1], t[2], s === ''); s += c; });
    return s === '' ? '\\mathbf{0}' : s;
  }
  var I = '\\mathbf{i}', J = '\\mathbf{j}', A = '\\mathbf{a}', Bb = '\\mathbf{b}';
  function ij(x, y) { return combo([[x, 1, I], [y, 1, J]]); }
  function ab(ca, cb) { return combo([[ca[0], ca[1], A], [cb[0], cb[1], Bb]]); }
  function abi(x, y) { return ab([x, 1], [y, 1]); }
  function M(s) { return '$' + s + '$'; }
  function plus(c) { return c < 0 ? ' - ' + (-c) : ' + ' + c; }
  function lin(m, v, c) { return (m === 1 ? '' : m === -1 ? '-' : String(m)) + v + (c === 0 ? '' : plus(c)); }
  function simpSurd(n) { var k = 1; for (var f = Math.floor(Math.sqrt(n)); f > 1; f--) { if (n % (f * f) === 0) { k = f; break; } } return [k, n / (k * k)]; }
  function surdStr(k, m) { if (m === 1) return String(k); return (k === 1 ? '' : String(k)) + '\\sqrt{' + m + '}'; }
  // retry until a generator returns non-null
  function retry(fn) { for (var i = 0; i < 400; i++) { var r = fn(); if (r) return r; } throw new Error('generator could not build an item'); }
  // build mcq: correct first, then distractors (deduped); null if fewer than 4 distinct options
  function mk(q, correct, ds, why) {
    var o = [correct];
    ds.forEach(function (d) { if (o.indexOf(d) < 0 && o.length < 4) o.push(d); });
    if (o.length < 4) return null;
    return { kind: 'mcq', q: q, options: o, answer: 0, why: why };
  }
  function nm(skill, q, answer, why, extra) { var o = { skill: skill, kind: 'num', q: q, answer: answer, tol: 1e-9, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function sm(skill, q, options, answer, why) { return { skill: skill, kind: 'mcq', q: q, options: options, answer: answer, why: why }; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29], [15, 20, 25], [10, 24, 26]];
  var FRACS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]];
  var RATIOS = [[1, 1], [1, 3], [3, 1], [1, 4], [2, 3], [3, 2], [4, 1], [3, 5], [5, 3], [1, 9], [3, 7], [7, 3]];
  function triple() { var t = pick(TRIPLES); return rint(0, 1) ? [t[0], t[1], t[2]] : [t[1], t[0], t[2]]; }

  // =====================================================================
  // FPM-VEC-01 Getting from A to B
  // =====================================================================
  B['FPM-VEC-01'] = { title: 'Getting from A to B: subtracting position vectors', items: [
    { skill: 'subtract-ij', gen: function () {
      return retry(function () {
        var x1 = rint(-6, 6), y1 = rint(-6, 6), x2 = rint(-6, 6), y2 = rint(-6, 6);
        var dx = x2 - x1, dy = y2 - y1; if (dx === 0 || dy === 0 || x1 === 0 || y1 === 0) return null;
        return mk('The point $A$ has position vector ' + M(ij(x1, y1)) + ' and the point $B$ has position vector ' + M(ij(x2, y2)) + '. Find $\\overrightarrow{AB}$.',
          M(ij(dx, dy)), [M(ij(-dx, -dy)), M(ij(x1 + x2, y1 + y2)), M(ij(dx, y2 + y1)), M(ij(x1 + x2, dy))],
          '$\\overrightarrow{AB}=\\overrightarrow{OB}-\\overrightarrow{OA}=(' + ij(x2, y2) + ')-(' + ij(x1, y1) + ')=' + ij(dx, dy) + '$. End point minus start point, with the brackets applied to both parts.');
      });
    } },
    { skill: 'subtract-ij', gen: function () {
      return retry(function () {
        var x1 = rint(-7, 7), y1 = rint(-7, 7), x2 = rint(-7, 7), y2 = rint(-7, 7);
        if (x1 === x2 || y1 === y2) return null;
        var ask = pick(['i', 'j']);
        var ans = ask === 'i' ? x2 - x1 : y2 - y1;
        return nm('subtract-ij', 'The point $A$ has position vector ' + M(ij(x1, y1)) + ' and $B$ has position vector ' + M(ij(x2, y2)) + '. Write $\\overrightarrow{AB}=p\\mathbf{i}+q\\mathbf{j}$. Find the value of $' + (ask === 'i' ? 'p' : 'q') + '$.', ans,
          'Subtract the ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' parts, end minus start: $' + (ask === 'i' ? x2 : y2) + '-(' + (ask === 'i' ? x1 : y1) + ')=' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'position-add', gen: function () {
      return retry(function () {
        var x1 = rint(-6, 6), y1 = rint(-6, 6), dx = rint(-6, 6), dy = rint(-6, 6);
        if (!dx || !dy || !x1 || !y1) return null;
        var x2 = x1 + dx, y2 = y1 + dy;
        return mk('$\\overrightarrow{OA}=' + ij(x1, y1) + '$ and $\\overrightarrow{AB}=' + ij(dx, dy) + '$. Find the position vector of $B$.',
          M(ij(x2, y2)), [M(ij(x1 - dx, y1 - dy)), M(ij(dx, dy)), M(ij(dx - x1, dy - y1)), M(ij(x1, y2))],
          'The position vector of $B$ is $\\overrightarrow{OB}=\\overrightarrow{OA}+\\overrightarrow{AB}=(' + ij(x1, y1) + ')+(' + ij(dx, dy) + ')=' + ij(x2, y2) + '$. To find a position vector you add the displacement to the start point.');
      });
    } },
    { skill: 'position-add', gen: function () {
      return retry(function () {
        var x1 = rint(-6, 6), y1 = rint(-6, 6), dx = rint(-6, 6), dy = rint(-6, 6);
        var x2 = x1 + dx, y2 = y1 + dy; if (x1 === 0 || y1 === 0) return null;
        var ask = pick(['i', 'j']);
        var ans = ask === 'i' ? x1 : y1;
        return nm('position-add', '$\\overrightarrow{OB}=' + ij(x2, y2) + '$ and $\\overrightarrow{AB}=' + ij(dx, dy) + '$. Write $\\overrightarrow{OA}=p\\mathbf{i}+q\\mathbf{j}$. Find the value of $' + (ask === 'i' ? 'p' : 'q') + '$.', ans,
          '$\\overrightarrow{OA}=\\overrightarrow{OB}-\\overrightarrow{AB}$, so the ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' part is $' + (ask === 'i' ? x2 : y2) + '-(' + (ask === 'i' ? dx : dy) + ')=' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'letters', gen: function () {
      return retry(function () {
        var p = rint(-3, 3), q = rint(-3, 3), r = rint(-3, 3), s = rint(-3, 3);
        if (p === r || q === s || !p || !q || !r || !s) return null;
        var dx = r - p, dy = s - q;
        return mk('$\\overrightarrow{OA}=' + abi(p, q) + '$ and $\\overrightarrow{OB}=' + abi(r, s) + '$. Find $\\overrightarrow{AB}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
          M(abi(dx, dy)), [M(abi(-dx, -dy)), M(abi(p + r, q + s)), M(abi(dx, q + s)), M(abi(p - r, dy))],
          '$\\overrightarrow{AB}=\\overrightarrow{OB}-\\overrightarrow{OA}=(' + abi(r, s) + ')-(' + abi(p, q) + ')=' + abi(dx, dy) + '$. Subtract the $\\mathbf{a}$ parts and the $\\mathbf{b}$ parts separately.');
      });
    } },
    { skill: 'letters', gen: function () {
      var k = rint(0, 2);
      if (k === 0) return { kind: 'mcq', q: '$\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. Which expression gives $\\overrightarrow{BA}$?', options: ['$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{b}-\\mathbf{a}$', '$\\mathbf{a}+\\mathbf{b}$', '$-\\mathbf{a}-\\mathbf{b}$'], answer: 0,
        why: '$\\overrightarrow{BA}=\\overrightarrow{OA}-\\overrightarrow{OB}=\\mathbf{a}-\\mathbf{b}$: end point $A$ minus start point $B$. ($\\mathbf{b}-\\mathbf{a}$ is $\\overrightarrow{AB}$.)' };
      if (k === 1) return { kind: 'mcq', q: '$\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{AB}=\\mathbf{b}$. Which expression gives $\\overrightarrow{OB}$?', options: ['$\\mathbf{a}+\\mathbf{b}$', '$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{b}-\\mathbf{a}$', '$-\\mathbf{a}-\\mathbf{b}$'], answer: 0,
        why: 'Go from $O$ to $A$ and then on to $B$: $\\overrightarrow{OB}=\\overrightarrow{OA}+\\overrightarrow{AB}=\\mathbf{a}+\\mathbf{b}$.' };
      return { kind: 'mcq', q: '$\\overrightarrow{OB}=\\mathbf{a}$ and $\\overrightarrow{AB}=\\mathbf{b}$. Which expression gives $\\overrightarrow{OA}$?', options: ['$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{a}+\\mathbf{b}$', '$\\mathbf{b}-\\mathbf{a}$', '$-\\mathbf{a}-\\mathbf{b}$'], answer: 0,
        why: '$\\overrightarrow{OB}=\\overrightarrow{OA}+\\overrightarrow{AB}$, so $\\overrightarrow{OA}=\\overrightarrow{OB}-\\overrightarrow{AB}=\\mathbf{a}-\\mathbf{b}$.' };
    } },
    { skill: 'trap-brackets', gen: function () {
      return retry(function () {
        var x1 = rint(2, 6), y1 = rint(2, 6), x2 = rint(-5, 5), y2 = rint(-5, 5);
        if (!x2 || !y2) return null;
        var good = ij(x2 - x1, y2 - y1), bad = ij(x2 - x1, y2 + y1);
        if (good === bad) return null;
        return mk('A student finds $\\overrightarrow{AB}$ for $\\overrightarrow{OA}=' + ij(x1, y1) + '$ and $\\overrightarrow{OB}=' + ij(x2, y2) + '$ and writes<br>$\\overrightarrow{AB}=' + ij(x2, y2) + ' - ' + x1 + '\\mathbf{i} + ' + y1 + '\\mathbf{j}=' + bad + '$.<br>What is the mistake?',
          'The minus sign was not applied to the $\\mathbf{j}$ part of $\\overrightarrow{OA}$ (no brackets)',
          ['The vectors should have been added', 'The subtraction should be $\\overrightarrow{OA}-\\overrightarrow{OB}$', 'The $\\mathbf{i}$ part should also be added', 'There is no mistake'],
          'Without brackets only the first part of $\\overrightarrow{OA}$ was subtracted. It should be $(' + ij(x2, y2) + ')-(' + ij(x1, y1) + ')=' + good + '$.');
      });
    } },
    { skill: 'point-coords', gen: function () {
      return retry(function () {
        var x = rint(-6, 6), y = rint(-6, 6); if (!x || !y || x === y || x === -y) return null;
        return mk('The point $P$ has coordinates $(' + x + ',' + y + ')$ and $O$ is the origin. Which is the position vector of $P$?',
          M(ij(x, y)), [M(ij(y, x)), M(ij(-x, -y)), M(ij(x, -y))],
          'A position vector is $\\overrightarrow{OP}$. The $x$-coordinate is the $\\mathbf{i}$ part and the $y$-coordinate is the $\\mathbf{j}$ part, so $\\overrightarrow{OP}=' + ij(x, y) + '$.');
      });
    } },
    { skill: 'reverse', gen: function () {
      return retry(function () {
        var x1 = rint(-6, 6), y1 = rint(-6, 6), x2 = rint(-6, 6), y2 = rint(-6, 6);
        if (x1 === x2 || y1 === y2) return null;
        var ask = pick(['i', 'j']);
        var ans = ask === 'i' ? x1 - x2 : y1 - y2;
        return nm('reverse', 'The point $A$ has coordinates $(' + x1 + ',' + y1 + ')$ and the point $B$ has coordinates $(' + x2 + ',' + y2 + ')$. Write $\\overrightarrow{BA}=p\\mathbf{i}+q\\mathbf{j}$. Find the value of $' + (ask === 'i' ? 'p' : 'q') + '$.', ans,
          '$\\overrightarrow{BA}=\\overrightarrow{OA}-\\overrightarrow{OB}$ (end minus start), so the ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' part is $' + (ask === 'i' ? x1 : y1) + '-(' + (ask === 'i' ? x2 : y2) + ')=' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'reverse', gen: function () {
      return retry(function () {
        var x = rint(-6, 6), y = rint(-6, 6); if (!x || !y) return null;
        return mk('$\\overrightarrow{AB}=' + ij(x, y) + '$. Which is $\\overrightarrow{BA}$?',
          M(ij(-x, -y)), [M(ij(x, y)), M(ij(y, x)), M(ij(-x, y)), M(ij(x, -y))],
          'Reversing the journey from $A$ to $B$ gives the negative: $\\overrightarrow{BA}=-\\overrightarrow{AB}=' + ij(-x, -y) + '$.');
      });
    } },
    { skill: 'chain', gen: function () {
      return retry(function () {
        var x1 = rint(-4, 4), y1 = rint(-4, 4), x2 = rint(-4, 4), y2 = rint(-4, 4), x3 = rint(-4, 4), y3 = rint(-4, 4);
        var ask = pick(['i', 'j']);
        var ans = ask === 'i' ? x1 + x2 + x3 : y1 + y2 + y3;
        return nm('chain', '$\\overrightarrow{OA}=' + ij(x1, y1) + '$, $\\overrightarrow{AB}=' + ij(x2, y2) + '$ and $\\overrightarrow{BC}=' + ij(x3, y3) + '$. Write $\\overrightarrow{OC}=p\\mathbf{i}+q\\mathbf{j}$. Find the value of $' + (ask === 'i' ? 'p' : 'q') + '$.', ans,
          '$\\overrightarrow{OC}=\\overrightarrow{OA}+\\overrightarrow{AB}+\\overrightarrow{BC}$, so the ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' part is $' + (ask === 'i' ? x1 + '+(' + x2 + ')+(' + x3 + ')' : y1 + '+(' + y2 + ')+(' + y3 + ')') + '=' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    sm('arrow-direction', 'You sketch the vector $\\overrightarrow{AB}$ as an arrow. Which statement about the sketch is correct?',
      ['The arrow starts at $A$ and the arrowhead is at $B$', 'The arrow starts at $B$ and the arrowhead is at $A$', 'The arrow starts at the origin and the arrowhead is at $B$', 'The arrow has no direction, only a length'], 0,
      '$\\overrightarrow{AB}$ is the journey from $A$ to $B$, so the tail is at $A$ and the head at $B$. Starting at the origin would be the position vector $\\overrightarrow{OB}$.'),
    sm('arrow-direction', 'The point $A$ is $(4,3)$ and $B$ is $(1,7)$. You draw $\\overrightarrow{AB}$ on a grid. Which description of the arrow is right?',
      ['It goes 3 units left and 4 units up', 'It goes 3 units right and 4 units up', 'It goes 3 units left and 4 units down', 'It goes 5 units right and 10 units up'], 0,
      '$\\overrightarrow{AB}=(\\mathbf{i}+7\\mathbf{j})-(4\\mathbf{i}+3\\mathbf{j})=-3\\mathbf{i}+4\\mathbf{j}$: a negative $\\mathbf{i}$ part means left, a positive $\\mathbf{j}$ part means up.')
  ] };

  // =====================================================================
  // FPM-VEC-02 Magnitudes and unknowns
  // =====================================================================
  B['FPM-VEC-02'] = { title: 'How long is a vector? Magnitudes and finding unknowns', items: [
    { skill: 'magnitude', gen: function () {
      var t = triple(), x = rsign() * t[0], y = rsign() * t[1];
      return nm('magnitude', 'Find $|' + ij(x, y) + '|$.', t[2],
        '$|' + ij(x, y) + '|=\\sqrt{(' + x + ')^2+(' + y + ')^2}=\\sqrt{' + (x * x + y * y) + '}=' + t[2] + '$. Squaring removes the signs.', { display: M(String(t[2])) });
    } },
    { skill: 'magnitude', gen: function () {
      var t = triple(), sx = rsign(), sy = rsign(), x1 = rint(-5, 5), y1 = rint(-5, 5);
      var x2 = x1 + sx * t[0], y2 = y1 + sy * t[1];
      return nm('magnitude', '$\\overrightarrow{OA}=' + ij(x1, y1) + '$ and $\\overrightarrow{OB}=' + ij(x2, y2) + '$. Find the length $AB$.', t[2],
        '$\\overrightarrow{AB}=' + ij(x2 - x1, y2 - y1) + '$, so $|\\overrightarrow{AB}|=\\sqrt{(' + (x2 - x1) + ')^2+(' + (y2 - y1) + ')^2}=\\sqrt{' + t[2] * t[2] + '}=' + t[2] + '$. Subtract the position vectors first; the length is not the length of $\\overrightarrow{OB}$.', { display: M(String(t[2])) });
    } },
    { skill: 'surd-form', gen: function () {
      return retry(function () {
        var x = rint(1, 9), y = rint(1, 9), n = x * x + y * y, r = Math.round(Math.sqrt(n));
        if (r * r === n) return null;
        var s = simpSurd(n); if (s[0] === 1) return null;
        x *= rsign(); y *= rsign();
        var ax = Math.abs(x), ay = Math.abs(y);
        return mk('Find the exact value of $|' + ij(x, y) + '|$, giving your answer as a surd in its simplest form.',
          M(surdStr(s[0], s[1])), [M(String(n)), M(String(ax + ay)), M('\\sqrt{' + (ax + ay) + '}')],
          '$|' + ij(x, y) + '|=\\sqrt{' + x * x + '+' + y * y + '}=\\sqrt{' + n + '}=' + surdStr(s[0], s[1]) + '$ since $' + n + '=' + s[0] * s[0] + '\\times' + s[1] + '$.');
      });
    } },
    { skill: 'trap-sign', gen: function () {
      return retry(function () {
        var t = triple(), x = -t[0], y = rsign() * t[1];
        return mk('What is the value of $|' + ij(x, y) + '|$?', M(String(t[2])), [M(String(-t[2])), M(String(t[0] + t[1])), M(String(t[0] * t[0] + t[1] * t[1]))],
          'A magnitude is never negative. $|' + ij(x, y) + '|=\\sqrt{' + x * x + '+' + y * y + '}=' + t[2] + '$. Do not forget the square root, and note the signs vanish when you square.');
      });
    } },
    { skill: 'find-unknown', gen: function () {
      var t = triple(), b = rsign() * t[1], p = t[0];
      return nm('find-unknown', 'Given that $|p\\mathbf{i}' + (b < 0 ? ' - ' : ' + ') + Math.abs(b) + '\\mathbf{j}|=' + t[2] + '$ and $p\\gt 0$, find $p$.', p,
        '$p^2+' + b * b + '=' + t[2] * t[2] + '$, so $p^2=' + p * p + '$. Since $p\\gt 0$, $p=' + p + '$.', { display: M(String(p)) });
    } },
    { skill: 'find-unknown', gen: function () {
      return retry(function () {
        var t = triple(), c = rint(-6, 6); if (!c) return null;
        var a = t[0], b = t[1], L = t[2], larger = rint(0, 1);
        var ans = larger ? a - c : -a - c;
        return nm('find-unknown', 'Given that $|(p' + plus(c) + ')\\mathbf{i}+' + b + '\\mathbf{j}|=' + L + '$, find the ' + (larger ? 'larger' : 'smaller') + ' of the two possible values of $p$.', ans,
          '$(p' + plus(c) + ')^2+' + b * b + '=' + L * L + '$, so $(p' + plus(c) + ')^2=' + a * a + '$ and $p' + plus(c) + '=\\pm' + a + '$. Hence $p=' + (a - c) + '$ or $p=' + (-a - c) + '$; the ' + (larger ? 'larger' : 'smaller') + ' is $' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'equation-setup', gen: function () {
      return retry(function () {
        var m = rint(2, 4), c = rint(-5, 5), b = rint(2, 7), L = rint(8, 14); if (!c) return null;
        var inner = lin(m, 'p', c);
        return mk('Given that $|(' + inner + ')\\mathbf{i}-' + b + '\\mathbf{j}|=' + L + '$, which equation is correct?',
          M('(' + inner + ')^2+' + b * b + '=' + L * L),
          [M(m * m + 'p^2' + (c * c >= 0 ? ' + ' : ' - ') + Math.abs(c * c) + ' + ' + b * b + '=' + L * L), M('(' + inner + ')^2+' + b * b + '=' + L), M('(' + inner + ')^2-' + b * b + '=' + L * L)],
          'Square every whole component and the given length: $(' + inner + ')^2+(-' + b + ')^2=' + L + '^2$. The bracket must be squared as a whole (it gives a middle term), the $-' + b + '$ squares to $+' + b * b + '$, and the length is squared too.');
      });
    } },
    { skill: 'trap-square', gen: function () {
      return retry(function () {
        var m = rint(2, 4), c = rint(1, 5) * rsign();
        var mid = 2 * m * c;
        return mk('Expand $(' + lin(m, 'p', c) + ')^2$.', M(m * m + 'p^2' + (mid < 0 ? ' - ' : ' + ') + Math.abs(mid) + 'p' + plus(c * c)),
          [M(m * m + 'p^2' + plus(c * c)), M(m + 'p^2' + (mid < 0 ? ' - ' : ' + ') + Math.abs(mid) + 'p' + plus(c * c)), M(m * m + 'p^2' + (mid < 0 ? ' - ' : ' + ') + Math.abs(mid) + 'p')],
          '$(' + lin(m, 'p', c) + ')^2=(' + lin(m, 'p', c) + ')(' + lin(m, 'p', c) + ')=' + m * m + 'p^2' + (mid < 0 ? ' - ' : ' + ') + Math.abs(mid) + 'p' + plus(c * c) + '$. Squaring a bracket gives a middle term, and $(' + m + 'p)^2=' + m * m + 'p^2$, not $' + m + 'p^2$.');
      });
    } },
    { skill: 'cosine-rule', gen: function () {
      var a = rint(2, 9), b = rint(2, 9), th = pick([60, 120]), minus = rint(0, 1);
      // |u+v|^2 = a^2+b^2+2ab cos(th); |u-v|^2 = a^2+b^2-2ab cos(th)
      var c = th === 60 ? 0.5 : -0.5, s = minus ? -1 : 1;
      var ans = a * a + b * b + s * 2 * a * b * c;
      return nm('cosine-rule', '$\\mathbf{u}$ and $\\mathbf{v}$ are vectors with $|\\mathbf{u}|=' + a + '$, $|\\mathbf{v}|=' + b + '$, and the angle between them is $' + th + '$ degrees. Find $|\\mathbf{u}' + (minus ? '-' : '+') + '\\mathbf{v}|^2$.', ans,
        '$|\\mathbf{u}' + (minus ? '-' : '+') + '\\mathbf{v}|^2=|\\mathbf{u}|^2+|\\mathbf{v}|^2' + (minus ? '-' : '+') + '2|\\mathbf{u}||\\mathbf{v}|\\cos' + th + '^\\circ=' + a * a + '+' + b * b + (minus ? '-' : '+') + '2\\times' + a + '\\times' + b + '\\times(' + c + ')=' + ans + '$.', { display: M(String(ans)) });
    } },
    { skill: 'count-solutions', gen: function () {
      var b = rint(2, 8), kind = rint(0, 2), L = kind === 0 ? b + rint(1, 5) : kind === 1 ? b : b - rint(1, b - 1);
      var ans = kind === 0 ? 2 : kind === 1 ? 1 : 0;
      return { kind: 'mcq', q: 'How many real values of $p$ satisfy $|p\\mathbf{i}+' + b + '\\mathbf{j}|=' + L + '$?', options: ['None', 'Exactly one', 'Exactly two', 'Infinitely many'], answer: ans,
        why: '$p^2+' + b * b + '=' + L * L + '$ gives $p^2=' + (L * L - b * b) + '$. ' + (kind === 0 ? 'This is positive, so $p=\\pm\\sqrt{' + (L * L - b * b) + '}$: two values.' : kind === 1 ? 'This is zero, so $p=0$ only: one value.' : 'This is negative and a square cannot be negative: no values (the vector is already longer than ' + L + ').') };
    } },
    { skill: 'find-unknown', gen: function () {
      var t = triple(), P = rint(2, 6), sx = rsign(), sy = rsign(), x = sx * t[0], y = sy * t[1];
      return nm('find-unknown', 'Given that $|' + x + 'p\\mathbf{i}' + (y < 0 ? ' - ' : ' + ') + Math.abs(y) + 'p\\mathbf{j}|=' + t[2] * P + '$ and $p\\gt 0$, find $p$.', P,
        '$(' + x + 'p)^2+(' + y + 'p)^2=' + (t[2] * P) * (t[2] * P) + '$, so $' + t[2] * t[2] + 'p^2=' + (t[2] * P) * (t[2] * P) + '$ and $p^2=' + P * P + '$. With $p\\gt 0$, $p=' + P + '$.', { display: M(String(P)) });
    } },
    sm('formula', 'Which expression gives $|x\\mathbf{i}+y\\mathbf{j}|$?', ['$\\sqrt{x^2+y^2}$', '$x+y$', '$\\sqrt{x+y}$', '$x^2+y^2$'], 0,
      'The vector is the hypotenuse of a right-angled triangle with sides $|x|$ and $|y|$, so Pythagoras gives $\\sqrt{x^2+y^2}$.')
  ] };

  // =====================================================================
  // FPM-VEC-03 Unit vectors
  // =====================================================================
  function uv(den, x, y) { return '\\frac{1}{' + den + '}(' + ij(x, y) + ')'; }
  B['FPM-VEC-03'] = { title: 'Unit vectors: same direction, length one', items: [
    { skill: 'unit-vector', gen: function () {
      return retry(function () {
        var t = triple(), x = rsign() * t[0], y = rsign() * t[1], h = t[2];
        return mk('Which is a unit vector in the direction of $' + ij(x, y) + '$?', M(uv(h, x, y)),
          [M(uv(h * h, x, y)), M(uv(t[0] + t[1], x, y)), M(uv(h, -x, -y)), M('\\frac{' + x + '}{' + h + '}\\mathbf{i}' + plus(y) + '\\mathbf{j}')],
          'The magnitude is $\\sqrt{' + x * x + '+' + y * y + '}=' + h + '$. Divide the whole vector by it: $\\frac{1}{' + h + '}(' + ij(x, y) + ')$. (Negating the vector would point it the opposite way, and every part must be divided.)');
      });
    } },
    { skill: 'unit-vector', gen: function () {
      return retry(function () {
        var t = triple(), sx = rsign(), sy = rsign(), x1 = rint(-5, 5), y1 = rint(-5, 5), back = rint(0, 1);
        var x2 = x1 + sx * t[0], y2 = y1 + sy * t[1];
        var vx = back ? -sx * t[0] : sx * t[0], vy = back ? -sy * t[1] : sy * t[1];
        return mk('$\\overrightarrow{OA}=' + ij(x1, y1) + '$ and $\\overrightarrow{OB}=' + ij(x2, y2) + '$. Find a unit vector in the direction of $\\overrightarrow{' + (back ? 'BA' : 'AB') + '}$.',
          M(uv(t[2], vx, vy)), [M(uv(t[2], -vx, -vy)), M(uv(t[2], x2, y2)), M(ij(vx, vy)), M(uv(t[0] + t[1], vx, vy))],
          '$\\overrightarrow{' + (back ? 'BA' : 'AB') + '}=' + ij(vx, vy) + '$ (end minus start), with magnitude $' + t[2] + '$. The unit vector is $\\frac{1}{' + t[2] + '}(' + ij(vx, vy) + ')$. Use the displacement, not a position vector, and mind the direction.');
      });
    } },
    { skill: 'component', gen: function () {
      var t = pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), sx = rsign(), sy = rsign(), swap = rint(0, 1);
      var x = (swap ? t[1] : t[0]) * sx, y = (swap ? t[0] : t[1]) * sy, ask = pick(['i', 'j']);
      var ans = (ask === 'i' ? x : y) / t[2];
      return nm('component', 'Find the coefficient of ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' in the unit vector in the direction of $' + ij(x, y) + '$.', ans,
        '$|' + ij(x, y) + '|=\\sqrt{' + x * x + '+' + y * y + '}=' + t[2] + '$, so the unit vector is $\\frac{1}{' + t[2] + '}(' + ij(x, y) + ')$. The ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' coefficient is $\\frac{' + (ask === 'i' ? x : y) + '}{' + t[2] + '}=' + ans + '$.', { display: M(String(ans)) });
    } },
    { skill: 'component', gen: function () {
      var t = pick([[5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), sx = rsign(), sy = rsign(), swap = rint(0, 1);
      var x = (swap ? t[1] : t[0]) * sx, y = (swap ? t[0] : t[1]) * sy, ask = pick(['i', 'j']);
      var raw = (ask === 'i' ? x : y) / t[2], ans = R.roundDp(raw, 3);
      return nm('component', 'Find the coefficient of ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' in the unit vector in the direction of $' + ij(x, y) + '$. Give your answer to 3 decimal places.', ans,
        '$|' + ij(x, y) + '|=\\sqrt{' + x * x + '+' + y * y + '}=' + t[2] + '$. The ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' coefficient is $\\frac{' + (ask === 'i' ? x : y) + '}{' + t[2] + '}=' + ans + '$ to 3 d.p.', { tol: 0.0006, display: M(String(ans)) });
    } },
    { skill: 'find-constant', gen: function () {
      var t = triple(), b = t[1], p = t[0], h = t[2];
      return nm('find-constant', 'The vector $\\frac{1}{' + h + '}(p\\mathbf{i}+' + b + '\\mathbf{j})$ is a unit vector and $p\\gt 0$. Find $p$.', p,
        'A unit vector has magnitude 1, so $\\frac{1}{' + h + '}\\sqrt{p^2+' + b * b + '}=1$, giving $p^2+' + b * b + '=' + h * h + '$ and $p^2=' + p * p + '$. Hence $p=' + p + '$.', { display: M(String(p)) });
    } },
    { skill: 'find-constant', gen: function () {
      return retry(function () {
        var x = rint(1, 6), p = rint(1, 6), n = x * x + p * p, r = Math.round(Math.sqrt(n));
        if (r * r === n) return null;
        return nm('find-constant', 'The unit vector in the direction of $' + x + '\\mathbf{i}+p\\mathbf{j}$ (where $p\\gt 0$) is $\\frac{1}{\\sqrt{' + n + '}}(' + x + '\\mathbf{i}+p\\mathbf{j})$. Find $p$.', p,
          'The magnitude of $' + x + '\\mathbf{i}+p\\mathbf{j}$ is $\\sqrt{' + n + '}$, so $' + x + '^2+p^2=' + n + '$ and $p^2=' + p * p + '$. With $p\\gt 0$, $p=' + p + '$.', { display: M(String(p)) });
      });
    } },
    { skill: 'scale-length', gen: function () {
      var t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]), sx = rsign(), sy = rsign(), s = rint(2, 6);
      var x = t[0] * sx, y = t[1] * sy, ask = pick(['i', 'j']);
      var ans = (ask === 'i' ? x : y) * s;
      return nm('scale-length', 'A vector $\\mathbf{w}$ has magnitude ' + t[2] * s + ' and is in the same direction as $' + ij(x, y) + '$. Find the coefficient of ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' in $\\mathbf{w}$.', ans,
        'The unit vector is $\\frac{1}{' + t[2] + '}(' + ij(x, y) + ')$. Multiply it by the required length ' + t[2] * s + ': $\\mathbf{w}=' + s + '(' + ij(x, y) + ')=' + ij(x * s, y * s) + '$. The ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' coefficient is $' + ans + '$.', { display: M(String(ans)) });
    } },
    { skill: 'surd-unit', gen: function () {
      return retry(function () {
        var x = rint(1, 6) * rsign(), y = rint(1, 6) * rsign(), n = x * x + y * y, r = Math.round(Math.sqrt(n));
        if (r * r === n || Math.abs(x) === Math.abs(y)) return null;
        var sq = '\\sqrt{' + n + '}';
        return mk('Find a unit vector parallel to $' + ij(x, y) + '$ and in the same direction.', M('\\frac{1}{' + sq + '}(' + ij(x, y) + ')'),
          [M('\\frac{1}{' + n + '}(' + ij(x, y) + ')'), M('\\frac{1}{' + (Math.abs(x) + Math.abs(y)) + '}(' + ij(x, y) + ')'), M('\\frac{1}{' + sq + '}(' + ij(-x, -y) + ')')],
          '$|' + ij(x, y) + '|=\\sqrt{' + x * x + '+' + y * y + '}=' + sq + '$, which does not simplify, so the unit vector is $\\frac{1}{' + sq + '}(' + ij(x, y) + ')$. Divide by the magnitude, not by the magnitude squared.');
      });
    } },
    { skill: 'check-length', gen: function () {
      return retry(function () {
        var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), sx = rsign(), sy = rsign(), h = t[2];
        var cx = [sx * t[0], h], cy = [sy * t[1], h], s = t[0] + t[1];
        return mk('Which of these is a unit vector?', M(ab(rf(cx[0], cx[1]), rf(cy[0], cy[1])).replace(/\\mathbf\{a\}/g, I).replace(/\\mathbf\{b\}/g, J)),
          [M(ab(rf(sx * t[0], s), rf(sy * t[1], s)).replace(/\\mathbf\{a\}/g, I).replace(/\\mathbf\{b\}/g, J)),
           M(ab(rf(sx * t[0], h * h), rf(sy * t[1], h * h)).replace(/\\mathbf\{a\}/g, I).replace(/\\mathbf\{b\}/g, J)),
           M(ab(rf(sy * t[1], h), rf(sy * t[1], h)).replace(/\\mathbf\{a\}/g, I).replace(/\\mathbf\{b\}/g, J))],
          'A unit vector has magnitude 1. For the correct option, $(\\frac{' + t[0] + '}{' + h + '})^2+(\\frac{' + t[1] + '}{' + h + '})^2=\\frac{' + (t[0] * t[0] + t[1] * t[1]) + '}{' + h * h + '}=1$. The other options have a magnitude different from 1.');
      });
    } },
    sm('check-length', 'Which of these is a unit vector?', ['$0.6\\mathbf{i}+0.8\\mathbf{j}$', '$0.5\\mathbf{i}+0.5\\mathbf{j}$', '$0.3\\mathbf{i}+0.4\\mathbf{j}$', '$0.6\\mathbf{i}+0.4\\mathbf{j}$'], 0,
      '$0.6^2+0.8^2=0.36+0.64=1$, so its magnitude is 1. The others have magnitudes $\\sqrt{0.5}$, $0.5$ and $\\sqrt{0.52}$.'),
    sm('meaning', 'What does dividing a vector $\\mathbf{v}$ by its magnitude $|\\mathbf{v}|$ do?', ['It keeps the direction and makes the length 1', 'It reverses the direction and keeps the length', 'It keeps the length and rotates the direction', 'It makes the vector the zero vector'], 0,
      'Dividing by a positive number never changes direction, and $|\\mathbf{v}|/|\\mathbf{v}|=1$ gives a vector of length 1.')
  ] };

  // =====================================================================
  // FPM-VEC-04 Routes, midpoints and ratios
  // =====================================================================
  function K(m, n) { return rf(m, m + n); }
  B['FPM-VEC-04'] = { title: 'Finding a route: vectors round a shape with midpoints and ratios', items: [
    { skill: 'ratio-route', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1], k = K(m, n);
        var corr = ab([-1, 1], k);
        return mk('In triangle $OAB$, $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. The point $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$. Find $\\overrightarrow{AN}$.',
          M(corr), [M(ab([-1, 1], rf(m, n))), M(ab([1, 1], k)), M(ab([-1, 1], rf(-m, m + n))), M(ab([-1, 1], rf(n, m + n)))],
          '$ON=\\frac{' + m + '}{' + (m + n) + '}OB$, so $\\overrightarrow{ON}=' + rs(k) + '\\mathbf{b}$. Then $\\overrightarrow{AN}=\\overrightarrow{AO}+\\overrightarrow{ON}=-\\mathbf{a}+' + rs(k) + '\\mathbf{b}$. A ratio $' + m + ':' + n + '$ means $\\frac{' + m + '}{' + (m + n) + '}$ of the whole line, and $\\overrightarrow{AO}=-\\mathbf{a}$.');
      });
    } },
    { skill: 'ratio-route', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1]; if (m === n) return null;
        var kn = rf(n, m + n), km = K(m, n);
        return mk('In triangle $OAB$, $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. The point $P$ lies on $AB$ with $AP:PB=' + m + ':' + n + '$. Find $\\overrightarrow{OP}$.',
          M(ab(kn, km)), [M(ab(km, kn)), M(ab([1, 1], km)), M(ab(rf(-m, m + n), km)), M(ab(rf(m, n), rf(n, m)))],
          '$\\overrightarrow{AB}=\\mathbf{b}-\\mathbf{a}$ and $\\overrightarrow{AP}=\\frac{' + m + '}{' + (m + n) + '}\\overrightarrow{AB}$. So $\\overrightarrow{OP}=\\mathbf{a}+' + rs(km) + '(\\mathbf{b}-\\mathbf{a})=' + ab(kn, km) + '$. The fraction is taken from $A$, the start of the ratio.');
      });
    } },
    { skill: 'ratio-fraction', gen: function () {
      var r = pick(RATIOS), m = r[0], n = r[1], k = m / (m + n);
      return nm('ratio-fraction', 'The point $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$. Given that $\\overrightarrow{ON}=k\\overrightarrow{OB}$, find $k$ as a decimal.', k,
        'The line is split into $' + m + '+' + n + '=' + (m + n) + '$ equal parts and $ON$ is $' + m + '$ of them, so $k=\\frac{' + m + '}{' + (m + n) + '}=' + k + '$.', { tol: 1e-6, display: M(String(k)) });
    } },
    { skill: 'ratio-fraction', gen: function () {
      var r = pick(RATIOS), m = r[0], n = r[1], which = rint(0, 2);
      var k = which === 0 ? m / (m + n) : which === 1 ? n / (m + n) : -n / (m + n);
      var nmx = which === 0 ? '\\overrightarrow{AP}' : which === 1 ? '\\overrightarrow{PB}' : '\\overrightarrow{BP}';
      return nm('ratio-fraction', 'The point $P$ lies on $AB$ with $AP:PB=' + m + ':' + n + '$. Given that $' + nmx + '=k\\overrightarrow{AB}$, find $k$ as a decimal.', k,
        'The line is $' + (m + n) + '$ equal parts, with $AP$ being $' + m + '$ and $PB$ being $' + n + '$. So $' + nmx + '=' + (which === 2 ? '-' : '') + '\\frac{' + (which === 0 ? m : n) + '}{' + (m + n) + '}\\overrightarrow{AB}$' + (which === 2 ? ' (going from $B$ back towards $A$ reverses the direction)' : '') + ', giving $k=' + k + '$.', { tol: 1e-6, display: M(String(k)) });
    } },
    { skill: 'parallelogram', gen: function () {
      return retry(function () {
        var list = [['\\overrightarrow{OB}', [1, 1], [1, 1], 'the diagonal $OB$ is $\\overrightarrow{OA}+\\overrightarrow{AB}$ and $\\overrightarrow{AB}=\\overrightarrow{OC}=\\mathbf{b}$'],
          ['\\overrightarrow{AC}', [-1, 1], [1, 1], '$\\overrightarrow{AC}=\\overrightarrow{AO}+\\overrightarrow{OC}=-\\mathbf{a}+\\mathbf{b}$'],
          ['\\overrightarrow{CA}', [1, 1], [-1, 1], '$\\overrightarrow{CA}=\\overrightarrow{CO}+\\overrightarrow{OA}=-\\mathbf{b}+\\mathbf{a}$'],
          ['\\overrightarrow{CB}', [1, 1], [0, 1], '$CB$ is opposite and parallel to $OA$, so $\\overrightarrow{CB}=\\overrightarrow{OA}=\\mathbf{a}$'],
          ['\\overrightarrow{BC}', [-1, 1], [0, 1], '$\\overrightarrow{BC}=-\\overrightarrow{CB}=-\\overrightarrow{OA}=-\\mathbf{a}$'],
          ['\\overrightarrow{BA}', [0, 1], [-1, 1], '$\\overrightarrow{BA}=-\\overrightarrow{AB}=-\\overrightarrow{OC}=-\\mathbf{b}$'],
          ['the vector from $B$ to $O$', [-1, 1], [-1, 1], '$\\overrightarrow{BO}=-\\overrightarrow{OB}=-(\\mathbf{a}+\\mathbf{b})$']];
        var e = pick(list), ca = e[1], cb = e[2];
        var alt1 = ab([-ca[0], 1], [-cb[0], 1]), alt2 = ab(cb, ca), alt3 = ab([ca[0], 1], [-cb[0], 1]), alt4 = ab([-ca[0], 1], [cb[0], 1]);
        var nameText = e[0].charAt(0) === '\\' ? '$' + e[0] + '$' : e[0];
        return mk('$OABC$ is a parallelogram with $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OC}=\\mathbf{b}$. Find ' + nameText + '.',
          M(ab(ca, cb)), [M(alt1), M(alt2), M(alt3), M(alt4)], 'In a parallelogram opposite sides are equal vectors: $\\overrightarrow{AB}=\\overrightarrow{OC}=\\mathbf{b}$ and $\\overrightarrow{CB}=\\overrightarrow{OA}=\\mathbf{a}$. So ' + e[3] + ', which is $' + ab(ca, cb) + '$.');
      });
    } },
    { skill: 'midpoint', gen: function () {
      return retry(function () {
        var which = pick(['OM', 'AM', 'BM', 'MA']);
        var ans = which === 'OM' ? [[1, 2], [1, 2]] : which === 'AM' ? [[-1, 2], [1, 2]] : which === 'BM' ? [[1, 2], [-1, 2]] : [[1, 2], [-1, 2]];
        // AM = (b-a)/2 ; BM = (a-b)/2 ; MA = (a-b)/2
        var nameT = '\\overrightarrow{' + which + '}';
        var ca = ans[0], cb = ans[1];
        return mk('In triangle $OAB$, $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. The point $M$ is the midpoint of $AB$. Find $' + nameT + '$.',
          M(ab(ca, cb)), [M(ab([-ca[0], 2], [-cb[0], 2])), M(ab([1, 1], [1, 2])), M(ab([1, 2], [1, 1])), M(ab([-1, 2], [-1, 2])), M(ab([1, 1], [1, 1]))],
          which === 'OM' ? '$\\overrightarrow{OM}=\\overrightarrow{OA}+\\frac{1}{2}\\overrightarrow{AB}=\\mathbf{a}+\\frac{1}{2}(\\mathbf{b}-\\mathbf{a})=\\frac{1}{2}\\mathbf{a}+\\frac{1}{2}\\mathbf{b}$.'
            : which === 'AM' ? '$\\overrightarrow{AM}=\\frac{1}{2}\\overrightarrow{AB}=\\frac{1}{2}(\\mathbf{b}-\\mathbf{a})$. The half applies to the whole vector $\\overrightarrow{AB}$, not to $\\mathbf{b}$ alone.'
              : which === 'BM' ? '$\\overrightarrow{BM}=\\frac{1}{2}\\overrightarrow{BA}=\\frac{1}{2}(\\mathbf{a}-\\mathbf{b})$: from $B$ towards $A$, so it is the negative of $\\overrightarrow{AM}$.'
                : '$\\overrightarrow{MA}=-\\overrightarrow{AM}=-\\frac{1}{2}(\\mathbf{b}-\\mathbf{a})=\\frac{1}{2}(\\mathbf{a}-\\mathbf{b})$.');
      });
    } },
    { skill: 'trapezium', gen: function () {
      return retry(function () {
        var kk = pick([[1, 2], [2, 1], [3, 2], [2, 3], [3, 1]]), ask = pick(['OB', 'AB']);
        var ca = ask === 'OB' ? kk : rsub(kk, [1, 1]), cb = [1, 1];
        var nameT = '\\overrightarrow{' + ask + '}';
        return mk('$OABC$ is a trapezium with $CB$ parallel to $OA$. $\\overrightarrow{OA}=\\mathbf{a}$, $\\overrightarrow{OC}=\\mathbf{b}$ and $\\overrightarrow{CB}=' + rs(kk) + '\\overrightarrow{OA}$. Find $' + nameT + '$.',
          M(ab(ca, cb)), [M(ab(cb, ca)), M(ab(rf(-ca[0], ca[1]), cb)), M(ab(ca, [-1, 1])), M(ab(ask === 'OB' ? rsub(kk, [1, 1]) : kk, cb))],
          '$\\overrightarrow{OB}=\\overrightarrow{OC}+\\overrightarrow{CB}=\\mathbf{b}+' + rs(kk) + '\\mathbf{a}$. ' + (ask === 'AB' ? 'Then $\\overrightarrow{AB}=\\overrightarrow{OB}-\\overrightarrow{OA}=' + ab(ca, cb) + '$.' : 'So $\\overrightarrow{OB}=' + ab(ca, cb) + '$.'));
      });
    } },
    { skill: 'two-midpoints', gen: function () {
      return retry(function () {
        var r = pick([[1, 1], [1, 3], [3, 1], [1, 4], [2, 3]]), m = r[0], n = r[1], k = K(m, n);
        return mk('In triangle $OAB$, $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. $M$ is the midpoint of $OA$ and $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$. Find $\\overrightarrow{MN}$.',
          M(ab([-1, 2], k)), [M(ab([1, 2], k)), M(ab([-1, 2], rf(n, m + n))), M(ab([-1, 2], rf(m, n))), M(ab([1, 2], rf(-m, m + n)))],
          '$\\overrightarrow{MN}=\\overrightarrow{MO}+\\overrightarrow{ON}=-\\frac{1}{2}\\mathbf{a}+' + rs(k) + '\\mathbf{b}$, since $\\overrightarrow{OM}=\\frac{1}{2}\\mathbf{a}$ and $\\overrightarrow{ON}=\\frac{' + m + '}{' + (m + n) + '}\\mathbf{b}$.');
      });
    } },
    { skill: 'ratio-fraction', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1]; if (m === n) return null;
        return mk('The point $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$ and $\\overrightarrow{OB}=\\mathbf{b}$. Which is $\\overrightarrow{ON}$?',
          M(rs(K(m, n)) + '\\mathbf{b}'), [M(rs(rf(m, n)) + '\\mathbf{b}'), M(rs(rf(n, m + n)) + '\\mathbf{b}'), M(rs(rf(n, m)) + '\\mathbf{b}')],
          'The whole line $OB$ is $' + m + '+' + n + '=' + (m + n) + '$ parts and $ON$ is $' + m + '$ of them, so $\\overrightarrow{ON}=\\frac{' + m + '}{' + (m + n) + '}\\mathbf{b}$. Dividing $' + m + '$ by $' + n + '$ would compare the two parts, not part to whole.');
      });
    } },
    { skill: 'direction-sign', gen: function () {
      var k = rint(0, 2);
      if (k === 0) return { kind: 'mcq', q: '$\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{AB}=\\mathbf{b}$. Which is $\\overrightarrow{BO}$?', options: ['$-\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{a}+\\mathbf{b}$', '$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{b}-\\mathbf{a}$'], answer: 0,
        why: '$\\overrightarrow{OB}=\\mathbf{a}+\\mathbf{b}$, and going from $B$ back to $O$ reverses it: $\\overrightarrow{BO}=-\\mathbf{a}-\\mathbf{b}$.' };
      if (k === 1) return { kind: 'mcq', q: '$\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. Which is $\\overrightarrow{BA}$?', options: ['$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{b}-\\mathbf{a}$', '$-\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{a}+\\mathbf{b}$'], answer: 0,
        why: 'Route: $\\overrightarrow{BA}=\\overrightarrow{BO}+\\overrightarrow{OA}=-\\mathbf{b}+\\mathbf{a}$.' };
      return { kind: 'mcq', q: '$\\overrightarrow{OA}=\\mathbf{a}$, $\\overrightarrow{OB}=\\mathbf{b}$ and $\\overrightarrow{OC}=\\mathbf{c}$. Which is $\\overrightarrow{AC}$ plus $\\overrightarrow{CB}$?', options: ['$\\mathbf{b}-\\mathbf{a}$', '$\\mathbf{a}-\\mathbf{b}$', '$\\mathbf{c}-\\mathbf{a}$', '$\\mathbf{a}+\\mathbf{b}-\\mathbf{c}$'], answer: 0,
        why: '$\\overrightarrow{AC}+\\overrightarrow{CB}=\\overrightarrow{AB}$ (the middle point cancels), and $\\overrightarrow{AB}=\\mathbf{b}-\\mathbf{a}$.' };
    } }
  ] };

  // =====================================================================
  // FPM-VEC-06 Proofs: parallel, collinear, parallelogram, trapezium
  // =====================================================================
  function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }
  B['FPM-VEC-06'] = { title: 'Proving shapes and straight lines with vectors', items: [
    { skill: 'scalar-multiple', gen: function () {
      return retry(function () {
        var k = pick([2, 3, -1, -2, 0.5, -0.5, 4]), x = rint(1, 4) * 2 * rsign(), y = rint(1, 4) * 2 * rsign();
        return nm('scalar-multiple', '$\\overrightarrow{AB}=' + abi(x, y) + '$ and $\\overrightarrow{CD}=' + abi(k * x, k * y) + '$. Given that $\\overrightarrow{CD}=k\\overrightarrow{AB}$, find $k$.', k,
          'Compare the $\\mathbf{a}$ parts: $' + k * x + '\\div(' + x + ')=' + k + '$, and the $\\mathbf{b}$ parts give $' + k * y + '\\div(' + y + ')=' + k + '$ as well. The same multiple works for both, so the vectors are parallel.', { display: M(String(k)) });
      });
    } },
    { skill: 'find-unknown', gen: function () {
      return retry(function () {
        var c = rint(1, 4) * rsign(), d = rint(1, 4), m = pick([2, 3, -2, -1, 4]);
        var p = m * c, n = m * d;
        return nm('find-unknown', 'The vector $p\\mathbf{i}' + (n < 0 ? ' - ' : ' + ') + Math.abs(n) + '\\mathbf{j}$ is parallel to $' + ij(c, d) + '$. Find $p$.', p,
          'Parallel means $p\\mathbf{i}+' + n + '\\mathbf{j}=\\lambda(' + ij(c, d) + ')$. The $\\mathbf{j}$ parts give $' + d + '\\lambda=' + n + '$ so $\\lambda=' + m + '$, and then $p=' + m + '\\times(' + c + ')=' + p + '$.', { display: M(String(p)) });
      });
    } },
    { skill: 'find-unknown', gen: function () {
      return retry(function () {
        var c = rint(1, 4) * rsign(), d = rint(1, 4) * rsign(), m = pick([2, 3, -2, -1, 4]), pp = pick([2, 3, -1, -2]), k = rint(-5, 6);
        var s = m * c - pp * k; if (!k || s === 0) return null;
        var n = m * d;
        return nm('find-unknown', 'The vector $(' + lin(pp, 'k', s) + ')\\mathbf{i}' + (n < 0 ? ' - ' : ' + ') + Math.abs(n) + '\\mathbf{j}$ is parallel to $' + ij(c, d) + '$. Find $k$.', k,
          'Write $(' + lin(pp, 'k', s) + ')\\mathbf{i}' + (n < 0 ? ' - ' : ' + ') + Math.abs(n) + '\\mathbf{j}=\\lambda(' + ij(c, d) + ')$. The $\\mathbf{j}$ parts give $\\lambda=' + m + '$, so $' + lin(pp, 'k', s) + '=' + m * c + '$, which gives $k=' + k + '$.', { display: M(String(k)) });
      });
    } },
    { skill: 'classify-shape', gen: function () {
      return retry(function () {
        var u = [rint(-3, 3), rint(-3, 3)], v = [rint(-3, 3), rint(-3, 3)], kind = rint(0, 2), opts = ['$ABCD$ is a parallelogram', '$ABCD$ is a trapezium but not a parallelogram', '$ABCD$ is neither a parallelogram nor a trapezium', '$ABCD$ is a rectangle'];
        if (cross(u, v) === 0) return null;
        var AB = u, AD = v, DC, BC, why;
        if (kind === 0) { DC = u; BC = v; why = '$\\overrightarrow{DC}=\\overrightarrow{AB}$ and $\\overrightarrow{BC}=\\overrightarrow{AD}$: both pairs of opposite sides are equal vectors, so $ABCD$ is a parallelogram.'; }
        else if (kind === 1) { var k = pick([2, 3]); DC = [k * u[0], k * u[1]]; BC = [v[0] + (k - 1) * u[0], v[1] + (k - 1) * u[1]]; why = '$\\overrightarrow{DC}=' + k + '\\overrightarrow{AB}$, so $AB$ and $DC$ are parallel but not equal. $\\overrightarrow{AD}$ and $\\overrightarrow{BC}$ are not multiples of each other. One pair of parallel sides and no more: a trapezium, not a parallelogram.'; if (cross(BC, AD) === 0) return null; }
        else { DC = [rint(-3, 3), rint(-3, 3)]; BC = [v[0] + DC[0] - u[0], v[1] + DC[1] - u[1]]; if (cross(u, DC) === 0 || cross(BC, v) === 0) return null; why = '$\\overrightarrow{AB}$ and $\\overrightarrow{DC}$ are not multiples of each other, and neither are $\\overrightarrow{AD}$ and $\\overrightarrow{BC}$. No pair of opposite sides is parallel, so it is neither.'; }
        var ans = kind;
        return { kind: 'mcq', q: 'For the quadrilateral $ABCD$: $\\overrightarrow{AB}=' + abi(AB[0], AB[1]) + '$, $\\overrightarrow{DC}=' + abi(DC[0], DC[1]) + '$, $\\overrightarrow{AD}=' + abi(AD[0], AD[1]) + '$ and $\\overrightarrow{BC}=' + abi(BC[0], BC[1]) + '$. Which statement is correct?', options: opts, answer: ans, why: why };
      });
    } },
    { skill: 'collinear', gen: function () {
      return retry(function () {
        var p1 = rint(1, 3) * rsign(), q1 = rint(1, 3) * rsign(), r = pick([2, 3, -2, -1, 4]);
        var t = r * q1;
        return nm('collinear', 'The points $P$, $Q$ and $R$ lie on a straight line. $\\overrightarrow{PQ}=' + abi(p1, q1) + '$ and $\\overrightarrow{QR}=' + (r * p1) + '\\mathbf{a}+t\\mathbf{b}$. Find $t$.', t,
          'Since $Q$ is common and the points are collinear, $\\overrightarrow{QR}=\\lambda\\overrightarrow{PQ}$. The $\\mathbf{a}$ parts give $' + r * p1 + '=\\lambda(' + p1 + ')$, so $\\lambda=' + r + '$. Then $t=' + r + '\\times(' + q1 + ')=' + t + '$.', { display: M(String(t)) });
      });
    } },
    { skill: 'collinear', gen: function () {
      return retry(function () {
        var p = rint(1, 3) * rsign(), q = rint(1, 3) * rsign(), m1 = rint(-4, 4), m2 = rint(-4, 4);
        if (!m1 || !m2 || Math.abs(m1) === Math.abs(m2)) return null;
        var r = rf(m1, m2), inv = rf(m2, m1);
        return mk('$\\overrightarrow{AB}=' + abi(m1 * p, m1 * q) + '$ and $\\overrightarrow{BC}=' + abi(m2 * p, m2 * q) + '$. Which conclusion, with its reason, is correct?',
          '$\\overrightarrow{AB}=' + rs(r) + '\\overrightarrow{BC}$ and $B$ is a point on both vectors, so $A$, $B$, $C$ are collinear',
          ['$\\overrightarrow{AB}=' + rs(inv) + '\\overrightarrow{BC}$ and $B$ is a point on both vectors, so $A$, $B$, $C$ are collinear',
           '$\\overrightarrow{AB}=' + rs(r) + '\\overrightarrow{BC}$, so $AB$ and $BC$ are parallel, which is all that is needed for collinear',
           '$\\overrightarrow{AB}$ and $\\overrightarrow{BC}$ have different lengths, so $A$, $B$, $C$ are not collinear'],
          'Both vectors are multiples of $' + abi(p, q) + '$, with $\\overrightarrow{AB}=' + m1 + '(' + abi(p, q) + ')$ and $\\overrightarrow{BC}=' + m2 + '(' + abi(p, q) + ')$, so $\\overrightarrow{AB}=' + rs(r) + '\\overrightarrow{BC}$. Parallel alone is not enough: they must also share the point $B$, which proves collinear.');
      });
    } },
    { skill: 'parallelogram', gen: function () {
      return retry(function () {
        var xa = rint(-4, 4), ya = rint(-4, 4), xb = rint(-4, 4), yb = rint(-4, 4), xc = rint(-4, 4), yc = rint(-4, 4);
        if (cross([xb - xa, yb - ya], [xc - xb, yc - yb]) === 0) return null;
        var xd = xc - (xb - xa), yd = yc - (yb - ya), ask = pick(['i', 'j']);
        var ans = ask === 'i' ? xd : yd;
        return nm('parallelogram', '$ABCD$ is a parallelogram (vertices in order). $\\overrightarrow{OA}=' + ij(xa, ya) + '$, $\\overrightarrow{OB}=' + ij(xb, yb) + '$ and $\\overrightarrow{OC}=' + ij(xc, yc) + '$. Write $\\overrightarrow{OD}=p\\mathbf{i}+q\\mathbf{j}$. Find $' + (ask === 'i' ? 'p' : 'q') + '$.', ans,
          'In a parallelogram $\\overrightarrow{DC}=\\overrightarrow{AB}=' + ij(xb - xa, yb - ya) + '$, so $\\overrightarrow{OD}=\\overrightarrow{OC}-\\overrightarrow{DC}=' + ij(xd, yd) + '$. The ' + (ask === 'i' ? '$\\mathbf{i}$' : '$\\mathbf{j}$') + ' part is $' + ans + '$.', { display: M(String(ans)) });
      });
    } },
    sm('proof-conclusion', 'To prove that $A$, $B$ and $C$ are collinear you show $\\overrightarrow{AB}=3\\overrightarrow{BC}$. Which sentence completes the proof correctly?',
      ['$\\overrightarrow{AB}$ is a multiple of $\\overrightarrow{BC}$ and they share the point $B$, so $A$, $B$, $C$ lie on a straight line', '$\\overrightarrow{AB}$ is 3 times as long as $\\overrightarrow{BC}$, so $A$, $B$, $C$ lie on a straight line', '$\\overrightarrow{AB}$ and $\\overrightarrow{BC}$ are equal, so $A$, $B$, $C$ lie on a straight line', '$\\overrightarrow{AB}$ and $\\overrightarrow{BC}$ are perpendicular, so $A$, $B$, $C$ lie on a straight line'], 0,
      'Being a scalar multiple means parallel. Sharing the common point $B$ turns "parallel" into "on the same line". Different lengths alone prove nothing, and the vectors here are not equal or perpendicular.'),
    sm('proof-conclusion', 'To show that $ABCD$ is a parallelogram, which vector equation should you prove?',
      ['$\\overrightarrow{AB}=\\overrightarrow{DC}$', '$\\overrightarrow{AB}=\\overrightarrow{CD}$', '$\\overrightarrow{AB}=2\\overrightarrow{DC}$', '$\\overrightarrow{AB}+\\overrightarrow{BC}=\\mathbf{0}$'], 0,
      'A parallelogram has a pair of opposite sides equal in length and direction. Going $A$ to $B$ must match going $D$ to $C$, i.e. $\\overrightarrow{AB}=\\overrightarrow{DC}$. ($\\overrightarrow{CD}$ is the negative, and $2\\overrightarrow{DC}$ gives a trapezium.)'),
    sm('proof-conclusion', 'In quadrilateral $ABCD$ you find $\\overrightarrow{AB}=3\\overrightarrow{DC}$. What can you conclude?',
      ['$AB$ is parallel to $DC$, so $ABCD$ is a trapezium (not a parallelogram, since they are not equal)', '$ABCD$ is a parallelogram', '$A$, $B$, $C$, $D$ are all on one straight line', '$AB$ is perpendicular to $DC$'], 0,
      'A scalar multiple other than 1 means parallel but of different length. One parallel pair gives a trapezium; for a parallelogram you would need $\\overrightarrow{AB}=\\overrightarrow{DC}$ exactly.'),
    sm('proof-conclusion', 'To show that $ABCD$ is a trapezium and not a parallelogram, what must you show about the other pair of opposite sides?',
      ['They are not parallel (neither vector is a multiple of the other)', 'They are equal vectors', 'They are perpendicular', 'They have the same length'], 0,
      'A trapezium has exactly one pair of parallel sides. If the other pair were also parallel, the shape would be a parallelogram, so you must show that pair is not a scalar multiple.')
  ] };

  // =====================================================================
  // FPM-VEC-07 Where lines cross
  // =====================================================================
  var PQ = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];
  function cross2() {
    var p = pick(PQ), q = pick(PQ);
    var pq = rmul(p, q), den = rsub([1, 1], pq);
    var lam = rdiv(rsub([1, 1], p), den), mu = rdiv(rsub([1, 1], q), den);
    return { p: p, q: q, lam: lam, mu: mu, one: rsub([1, 1], lam) };
  }
  function setup(c) {
    return 'In triangle $OAB$, $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. The point $M$ lies on $OA$ with $\\overrightarrow{OM}=' + rs(c.p) + '\\mathbf{a}$ and the point $N$ lies on $OB$ with $\\overrightarrow{ON}=' + rs(c.q) + '\\mathbf{b}$. The lines $AN$ and $BM$ meet at $X$.';
  }
  B['FPM-VEC-07'] = { title: 'Where lines cross: two routes and comparing coefficients', items: [
    { skill: 'solve-ratio', gen: function () {
      return retry(function () {
        var c = cross2(), r = rdiv(c.lam, c.one), u = r[0], v = r[1];
        return mk(setup(c) + ' Find $AX:XN$.', M(u + ':' + v), [M(v + ':' + u), M(u + ':' + (u + v)), M((u + v) + ':' + v)],
          'Let $\\overrightarrow{AX}=\\lambda\\overrightarrow{AN}$ and $\\overrightarrow{BX}=\\mu\\overrightarrow{BM}$. Then $\\overrightarrow{OX}=(1-\\lambda)\\mathbf{a}+' + rs(c.q) + '\\lambda\\mathbf{b}=' + rs(c.p) + '\\mu\\mathbf{a}+(1-\\mu)\\mathbf{b}$. Comparing coefficients and solving gives $\\lambda=' + rs(c.lam) + '$, so $AX:XN=\\lambda:(1-\\lambda)=' + rs(c.lam) + ':' + rs(c.one) + '=' + u + ':' + v + '$.');
      });
    } },
    { skill: 'solve-ratio', gen: function () {
      return retry(function () {
        var c = cross2(), r = rdiv(c.lam, c.one);
        if (!rterm(r)) return null;
        var k = rdec(r);
        return nm('solve-ratio', setup(c) + ' Given that $AX:XN=k:1$, find $k$ as a decimal.', k,
          'Write $\\overrightarrow{OX}$ by two routes: $(1-\\lambda)\\mathbf{a}+' + rs(c.q) + '\\lambda\\mathbf{b}$ and $' + rs(c.p) + '\\mu\\mathbf{a}+(1-\\mu)\\mathbf{b}$. Equating coefficients gives $\\lambda=' + rs(c.lam) + '$. Then $k=\\frac{\\lambda}{1-\\lambda}=' + k + '$.', { tol: 1e-6, display: M(String(k)) });
      });
    } },
    { skill: 'compare-coefficients', gen: function () {
      return retry(function () {
        var c = cross2(); if (c.p[0] === c.q[0] && c.p[1] === c.q[1]) return null;
        var P = rs(c.p), Q = rs(c.q);
        var good = '$1-\\lambda=' + P + '\\mu$ and ' + '$' + Q + '\\lambda=1-\\mu$';
        return mk('Using $\\overrightarrow{OX}=(1-\\lambda)\\mathbf{a}+' + Q + '\\lambda\\mathbf{b}$ and $\\overrightarrow{OX}=' + P + '\\mu\\mathbf{a}+(1-\\mu)\\mathbf{b}$, which pair of equations comes from comparing coefficients?',
          good, ['$1-\\lambda=' + Q + '\\mu$ and $' + P + '\\lambda=1-\\mu$', '$\\lambda=' + P + '\\mu$ and $' + Q + '\\lambda=\\mu$', '$1-\\lambda=1-\\mu$ and $' + Q + '\\lambda=' + P + '\\mu$'],
          'Compare the coefficients of $\\mathbf{a}$: $1-\\lambda=' + P + '\\mu$. Compare the coefficients of $\\mathbf{b}$: $' + Q + '\\lambda=1-\\mu$. This is allowed because $\\mathbf{a}$ and $\\mathbf{b}$ are not parallel.');
      });
    } },
    { skill: 'set-up', gen: function () {
      return retry(function () {
        var c = cross2(), P = rs(c.p);
        return mk('The point $X$ lies on $BM$, where $\\overrightarrow{OM}=' + P + '\\mathbf{a}$, and $\\overrightarrow{BX}=\\mu\\overrightarrow{BM}$. Which expression for $\\overrightarrow{OX}$ is correct?',
          M('\\mathbf{b}+\\mu(' + P + '\\mathbf{a}-\\mathbf{b})'), [M('\\mathbf{b}+' + P + '\\mu\\mathbf{a}'), M('\\mu(' + P + '\\mathbf{a}-\\mathbf{b})'), M(P + '\\mathbf{a}+\\mu(\\mathbf{b}-' + P + '\\mathbf{a})')],
          'Travel to $B$ first, then a fraction $\\mu$ of the way along $\\overrightarrow{BM}$: $\\overrightarrow{OX}=\\overrightarrow{OB}+\\mu\\overrightarrow{BM}$, and $\\overrightarrow{BM}=\\overrightarrow{OM}-\\overrightarrow{OB}=' + P + '\\mathbf{a}-\\mathbf{b}$.');
      });
    } },
    { skill: 'convert-ratio', gen: function () {
      return retry(function () {
        var t = rint(3, 9), s = rint(1, t - 1); if (gcd(s, t) !== 1) return null;
        var r = t - s;
        return mk('$X$ lies on $AN$ with $\\overrightarrow{AX}=' + fs(s, t) + '\\overrightarrow{AN}$. Find $AX:XN$.', M(s + ':' + r), [M(s + ':' + t), M(r + ':' + s), M(t + ':' + r)],
          '$AX$ is $\\frac{' + s + '}{' + t + '}$ of $AN$, so $XN$ is the remaining $\\frac{' + r + '}{' + t + '}$. Hence $AX:XN=' + s + ':' + r + '$. Remember the ratio is $\\lambda:(1-\\lambda)$, not $\\lambda:1$.');
      });
    } },
    { skill: 'solve', gen: function () {
      return retry(function () {
        var c = cross2(); if (!rterm(c.one)) return null;
        var ans = rdec(c.one);
        return nm('solve', setup(c) + ' Given that $\\overrightarrow{OX}=\\alpha\\mathbf{a}+\\beta\\mathbf{b}$, find $\\alpha$ as a decimal.', ans,
          'Using $\\overrightarrow{OX}=\\overrightarrow{OA}+\\lambda\\overrightarrow{AN}=(1-\\lambda)\\mathbf{a}+' + rs(c.q) + '\\lambda\\mathbf{b}$ and the second route $' + rs(c.p) + '\\mu\\mathbf{a}+(1-\\mu)\\mathbf{b}$, comparing coefficients gives $\\lambda=' + rs(c.lam) + '$. So $\\alpha=1-\\lambda=' + ans + '$.', { tol: 1e-6, display: M(String(ans)) });
      });
    } },
    { skill: 'solve', gen: function () {
      return retry(function () {
        var c = cross2(); if (!rterm(c.mu)) return null;
        var ans = rdec(c.mu);
        return nm('solve', setup(c) + ' Given that $\\overrightarrow{BX}=\\mu\\overrightarrow{BM}$, find $\\mu$ as a decimal.', ans,
          'Equate the two routes: $(1-\\lambda)\\mathbf{a}+' + rs(c.q) + '\\lambda\\mathbf{b}=' + rs(c.p) + '\\mu\\mathbf{a}+(1-\\mu)\\mathbf{b}$. The coefficient equations are $1-\\lambda=' + rs(c.p) + '\\mu$ and $' + rs(c.q) + '\\lambda=1-\\mu$. Solving them gives $\\mu=' + ans + '$.', { tol: 1e-6, display: M(String(ans)) });
      });
    } },
    { skill: 'position-vector', gen: function () {
      return retry(function () {
        var c = cross2(), a1 = c.one, b1 = rmul(c.lam, c.q);
        var correct = ab(a1, b1);
        return mk(setup(c) + ' Find $\\overrightarrow{OX}$.', M(correct), [M(ab(b1, a1)), M(ab(c.lam, rmul(c.one, c.q))), M(ab(a1, c.lam))],
          '$\\overrightarrow{OX}=(1-\\lambda)\\mathbf{a}+' + rs(c.q) + '\\lambda\\mathbf{b}$ with $\\lambda=' + rs(c.lam) + '$ (found by comparing coefficients with the route via $B$ and $M$). So $\\overrightarrow{OX}=' + correct + '$.');
      });
    } },
    { skill: 'set-up', gen: function () {
      return retry(function () {
        var q = pick(PQ), Q = rs(q);
        var lamb = '\\lambda';
        var good = '(1-\\lambda)\\mathbf{a}+' + (q[0] === 1 ? '\\frac{\\lambda}{' + q[1] + '}' : '\\frac{' + q[0] + '\\lambda}{' + q[1] + '}') + '\\mathbf{b}';
        var d1 = '\\lambda\\mathbf{a}+' + (q[0] === 1 ? '\\frac{1-\\lambda}{' + q[1] + '}' : '\\frac{' + q[0] + '(1-\\lambda)}{' + q[1] + '}') + '\\mathbf{b}';
        var d2 = '(1-\\lambda)\\mathbf{a}+' + Q + '\\mathbf{b}';
        var d3 = '\\mathbf{a}+' + Q + '\\lambda\\mathbf{b}';
        return mk('$\\overrightarrow{OA}=\\mathbf{a}$, $\\overrightarrow{ON}=' + Q + '\\mathbf{b}$ and $X$ lies on $AN$ with $\\overrightarrow{AX}=\\lambda\\overrightarrow{AN}$. Find $\\overrightarrow{OX}$ in terms of $\\lambda$, $\\mathbf{a}$ and $\\mathbf{b}$.',
          M(good), [M(d1), M(d2), M(d3)],
          '$\\overrightarrow{AN}=\\overrightarrow{ON}-\\overrightarrow{OA}=' + Q + '\\mathbf{b}-\\mathbf{a}$, so $\\overrightarrow{OX}=\\mathbf{a}+\\lambda(' + Q + '\\mathbf{b}-\\mathbf{a})=(1-\\lambda)\\mathbf{a}+' + (q[0] === 1 ? '\\frac{\\lambda}{' + q[1] + '}' : '\\frac{' + q[0] + '\\lambda}{' + q[1] + '}') + '\\mathbf{b}$.');
      });
    } },
    { skill: 'collinear-condition', gen: function () {
      return retry(function () {
        var k = rint(1, 9) * 0.05 + rint(0, 3) * 0.1; k = Math.round(k * 100) / 100;
        if (k >= 0.5 || k <= 0) return null;
        var d = Math.round((1 - 2 * k) * 100) / 100; if (d <= 0) return null;
        return nm('collinear-condition', 'The point $P$ has $\\overrightarrow{OP}=k\\mathbf{a}+(k+' + d + ')\\mathbf{b}$ and lies on the line $AB$, where $\\overrightarrow{OA}=\\mathbf{a}$ and $\\overrightarrow{OB}=\\mathbf{b}$. Find $k$.', k,
          'On $AB$, $\\overrightarrow{OP}=\\mathbf{a}+t(\\mathbf{b}-\\mathbf{a})=(1-t)\\mathbf{a}+t\\mathbf{b}$, so the two coefficients add to 1. Hence $k+(k+' + d + ')=1$, so $2k=' + Math.round((1 - d) * 100) / 100 + '$ and $k=' + k + '$.', { tol: 1e-6, display: M(String(k)) });
      });
    } },
    sm('why-compare', 'After writing $\\overrightarrow{OX}$ in two ways as (number)$\\mathbf{a}$ + (number)$\\mathbf{b}$, why can you compare coefficients of $\\mathbf{a}$ and of $\\mathbf{b}$?',
      ['Because $\\mathbf{a}$ and $\\mathbf{b}$ are not parallel, so a vector can be written in only one way as a combination of them', 'Because $\\mathbf{a}$ and $\\mathbf{b}$ have the same length', 'Because $\\mathbf{a}$ and $\\mathbf{b}$ are perpendicular', 'Because $\\lambda$ and $\\mu$ must be equal'], 0,
      'If $\\mathbf{a}$ and $\\mathbf{b}$ are not parallel, then $\\alpha_1\\mathbf{a}+\\beta_1\\mathbf{b}=\\alpha_2\\mathbf{a}+\\beta_2\\mathbf{b}$ forces $\\alpha_1=\\alpha_2$ and $\\beta_1=\\beta_2$. They do not need to be equal in length or perpendicular.'),
    sm('error-check', 'A student writes $\\overrightarrow{OX}=\\overrightarrow{OA}+\\lambda\\overrightarrow{AN}$ for the line $AN$ and $\\overrightarrow{OX}=\\overrightarrow{OB}+\\lambda\\overrightarrow{BM}$ for the line $BM$, using $\\lambda$ both times. What is wrong with this?',
      ['The scalars for the two lines are generally different, so they need different letters ($\\lambda$ and $\\mu$)', 'Nothing: the same scalar can always be used for both lines', 'The scalar should be put on $\\overrightarrow{OA}$ instead of $\\overrightarrow{AN}$', 'The lines should be written with the scalar $1-\\lambda$ each time'], 0,
      '$X$ is a different fraction of the way along each line. Using one letter forces both fractions to be equal, which is usually false and gives a wrong or impossible answer.')
  ] };

  // =====================================================================
  // FPM-VEC-08 Vector ratios to compare areas
  // =====================================================================
  B['FPM-VEC-08'] = { title: 'Using vector ratios to compare areas', items: [
    { skill: 'shared-angle', gen: function () {
      return retry(function () {
        var p = pick(FRACS), q = pick(FRACS), t = rint(1, 4), S = p[1] * q[1] * t;
        var a = p[0] * q[0] * t;
        return nm('shared-angle', 'Triangle $OAB$ has area ' + S + ' cm$^2$. The point $P$ lies on $OA$ with $\\overrightarrow{OP}=' + rs(p) + '\\overrightarrow{OA}$ and $Q$ lies on $OB$ with $\\overrightarrow{OQ}=' + rs(q) + '\\overrightarrow{OB}$. Find the area of triangle $OPQ$ in cm$^2$.', a,
          'Triangles $OPQ$ and $OAB$ share the angle at $O$, so by $\\frac{1}{2}ab\\sin C$ the area is multiplied by $' + rs(p) + '\\times' + rs(q) + '=' + rs(rmul(p, q)) + '$. Area $=' + rs(rmul(p, q)) + '\\times' + S + '=' + a + '$ cm$^2$.', { display: M(String(a)) });
      });
    } },
    { skill: 'shared-angle', gen: function () {
      return retry(function () {
        var p = pick(FRACS), q = pick(FRACS), f = rmul(p, q);
        return mk('The point $P$ lies on $OA$ with $\\overrightarrow{OP}=' + rs(p) + '\\overrightarrow{OA}$ and $Q$ lies on $OB$ with $\\overrightarrow{OQ}=' + rs(q) + '\\overrightarrow{OB}$. What fraction of the area of triangle $OAB$ is the area of triangle $OPQ$?',
          M(rs(f)), [M(rs(radd(p, q))), M(rs(rsub([1, 1], f))), M(rs(rdiv(p, q)))],
          'Both sides round the shared angle at $O$ are scaled, so the area is multiplied by $' + rs(p) + '\\times' + rs(q) + '=' + rs(f) + '$. The two fractions are multiplied, not added.');
      });
    } },
    { skill: 'shared-height', gen: function () {
      var r = pick(RATIOS), m = r[0], n = r[1], t = rint(1, 6), S = (m + n) * t;
      return nm('shared-height', 'In triangle $OAB$ the point $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$. The area of triangle $OAB$ is ' + S + ' cm$^2$. Find the area of triangle $OAN$ in cm$^2$.', m * t,
        'Triangles $OAN$ and $OAB$ have the same height (from $A$ to line $OB$), so their areas are in the ratio of their bases: $ON:OB=' + m + ':' + (m + n) + '$. Area $=\\frac{' + m + '}{' + (m + n) + '}\\times' + S + '=' + m * t + '$ cm$^2$.', { display: M(String(m * t)) });
    } },
    { skill: 'shared-height', gen: function () {
      var r = pick(RATIOS), m = r[0], n = r[1], t = rint(1, 6), T = (m + n) * t;
      return nm('shared-height', 'In triangle $ANB$ the point $X$ lies on $AN$ with $AX:XN=' + m + ':' + n + '$. The area of triangle $ANB$ is ' + T + ' cm$^2$. Find the area of triangle $BXN$ in cm$^2$.', n * t,
        'Triangles $BXN$ and $BAN$ share the vertex $B$, so they have the same height to the line $AN$. Their areas are in the ratio of the bases $XN:AN=' + n + ':' + (m + n) + '$. Area $=\\frac{' + n + '}{' + (m + n) + '}\\times' + T + '=' + n * t + '$ cm$^2$.', { display: M(String(n * t)) });
    } },
    { skill: 'parallelogram-half', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1], t = rint(1, 5), S = 2 * (m + n) * t;
        return nm('parallelogram-half', '$OABC$ is a parallelogram of area ' + S + ' cm$^2$. The point $M$ lies on $AB$ with $AM:MB=' + m + ':' + n + '$. Find the area of triangle $OAM$ in cm$^2$.', m * t,
          'The diagonal $OB$ splits the parallelogram in half, so triangle $OAB$ has area $' + S / 2 + '$ cm$^2$. Triangle $OAM$ has the same height as $OAB$ and base $AM=\\frac{' + m + '}{' + (m + n) + '}AB$, so its area is $\\frac{' + m + '}{' + (m + n) + '}\\times' + S / 2 + '=' + m * t + '$ cm$^2$.', { display: M(String(m * t)) });
      });
    } },
    { skill: 'parallelogram-half', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1], t = rint(1, 5), S = 2 * (m + n) * t, ans = S - m * t;
        return nm('parallelogram-half', '$OABC$ is a parallelogram of area ' + S + ' cm$^2$. The point $M$ lies on $AB$ with $AM:MB=' + m + ':' + n + '$. Find the area of the quadrilateral $OMBC$ in cm$^2$.', ans,
          'Triangle $OAB$ is half the parallelogram, $' + S / 2 + '$ cm$^2$, and triangle $OAM$ is $\\frac{' + m + '}{' + (m + n) + '}$ of it, which is $' + m * t + '$ cm$^2$. The quadrilateral $OMBC$ is the parallelogram minus triangle $OAM$: $' + S + '-' + m * t + '=' + ans + '$ cm$^2$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'subtract', gen: function () {
      return retry(function () {
        var p = pick(FRACS), q = pick(FRACS), t = rint(1, 4), S = p[1] * q[1] * t, small = p[0] * q[0] * t, ans = S - small;
        return nm('subtract', 'Triangle $OAB$ has area ' + S + ' cm$^2$. The point $P$ lies on $OA$ with $\\overrightarrow{OP}=' + rs(p) + '\\overrightarrow{OA}$ and $Q$ lies on $OB$ with $\\overrightarrow{OQ}=' + rs(q) + '\\overrightarrow{OB}$. Find the area of the quadrilateral $PABQ$ in cm$^2$.', ans,
          'Triangle $OPQ$ has area $' + rs(p) + '\\times' + rs(q) + '\\times' + S + '=' + small + '$ cm$^2$. The quadrilateral $PABQ$ is triangle $OAB$ with triangle $OPQ$ removed: $' + S + '-' + small + '=' + ans + '$ cm$^2$.', { display: M(String(ans)) });
      });
    } },
    { skill: 'ratio-simplify', gen: function () {
      return retry(function () {
        var p = pick(FRACS), q = pick(FRACS), f = rmul(p, q), u = f[0], v = f[1];
        return mk('The point $P$ lies on $OA$ with $\\overrightarrow{OP}=' + rs(p) + '\\overrightarrow{OA}$ and $Q$ lies on $OB$ with $\\overrightarrow{OQ}=' + rs(q) + '\\overrightarrow{OB}$. Find the ratio area of $OPQ$ : area of $OAB$, in its simplest form.',
          M(u + ':' + v), [M(v + ':' + u), M(u + ':' + (v - u)), M((v - u) + ':' + v)],
          'The area of $OPQ$ is $' + rs(p) + '\\times' + rs(q) + '=' + rs(f) + '$ of the area of $OAB$, so the ratio is $' + u + ':' + v + '$ in simplest form.');
      });
    } },
    { skill: 'sine-area', gen: function () {
      return retry(function () {
        var a = rint(4, 12), b = rint(4, 12), p = pick(FRACS), q = pick(FRACS), th = pick([30, 150]);
        var full = a * b / 4, ans = R.roundDp(rdec(rmul(p, q)) * full, 2);
        return nm('sine-area', 'In triangle $OAB$, $OA=' + a + '$ cm, $OB=' + b + '$ cm and angle $AOB=' + th + '$ degrees. The point $P$ lies on $OA$ with $\\overrightarrow{OP}=' + rs(p) + '\\overrightarrow{OA}$ and $Q$ lies on $OB$ with $\\overrightarrow{OQ}=' + rs(q) + '\\overrightarrow{OB}$. Find the area of triangle $OPQ$ in cm$^2$, to 2 decimal places.', ans,
          'Area of $OAB=\\frac{1}{2}\\times' + a + '\\times' + b + '\\times\\sin' + th + '^\\circ=' + full + '$ cm$^2$. Triangle $OPQ$ is $' + rs(p) + '\\times' + rs(q) + '$ of this, so its area is $' + rs(rmul(p, q)) + '\\times' + full + '=' + ans + '$ cm$^2$ to 2 d.p.', { tol: 0.006, display: M(String(ans)) });
      });
    } },
    { skill: 'wrong-end', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1]; if (m === n) return null;
        return mk('In triangle $OAB$ the point $N$ lies on $OB$ with $ON:NB=' + m + ':' + n + '$. What fraction of the area of triangle $OAB$ is the area of triangle $NAB$?',
          M(rs(rf(n, m + n))), [M(rs(rf(m, m + n))), M(rs(rf(m, n))), M(rs(rf(n, m)))],
          'Triangles $NAB$ and $OAB$ have the same height from $A$, so the areas are in the ratio of the bases $NB:OB=' + n + ':' + (m + n) + '$. The base of $NAB$ is $NB$, which is the part matching ' + n + ' in the ratio, not $ON$.');
      });
    } },
    { skill: 'shared-height', gen: function () {
      return retry(function () {
        var r = pick(RATIOS), m = r[0], n = r[1]; if (m === n) return null;
        return mk('$X$ lies on $AN$ with $AX:XN=' + m + ':' + n + '$. What is the ratio of the area of triangle $OAX$ to the area of triangle $OXN$?',
          M(m + ':' + n), [M(n + ':' + m), M(m + ':' + (m + n)), M(m * m + ':' + n * n)],
          'The triangles share the vertex $O$, so they have the same height to the line $AN$. Their areas are in the ratio of their bases $AX:XN=' + m + ':' + n + '$.');
      });
    } },
    sm('justify', 'Which fact justifies saying "the area of triangle $OPQ$ is $\\frac{2}{3}\\times\\frac{3}{4}$ of the area of triangle $OAB$" when $OP=\\frac{2}{3}OA$ and $OQ=\\frac{3}{4}OB$?',
      ['Both use the same included angle at $O$, so area $=\\frac{1}{2}ab\\sin C$ is scaled by the product of the two side fractions', 'Areas are always scaled by the sum of the side fractions', 'The two triangles have the same height', 'Triangle $OPQ$ is half of triangle $OAB$'], 0,
      'With the same angle $C$ the area is $\\frac{1}{2}ab\\sin C$, so scaling the two sides by $\\frac{2}{3}$ and $\\frac{3}{4}$ scales the area by $\\frac{2}{3}\\times\\frac{3}{4}$.')
  ] };
})();
