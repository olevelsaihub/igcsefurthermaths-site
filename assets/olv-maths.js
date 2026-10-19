(function () {
  var opts = {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
              ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'input'], throwOnError: false};
  function run(el) { if (window.renderMathInElement) { try { window.renderMathInElement(el, opts); } catch (e) {} } }
  function start() {
    run(document.body);
    var pending = false;
    new MutationObserver(function (list) {
      if (pending) return; pending = true;
      setTimeout(function () { pending = false;
        list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1 && n.textContent.indexOf('$') >= 0 && !n.closest('.katex')) run(n); }); });
      }, 30);
    }).observe(document.body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
