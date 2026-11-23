// Pixel Quest · aviso de cookies y estadísticas.
// - Guarda la elección en localStorage ('pq-estadisticas' = 'si' | 'no').
// - Carga GoatCounter (estadísticas anónimas, sin cookies) salvo que se rechace.
// - Muestra el aviso abajo hasta que la persona elige. PQCookies.abrir() lo vuelve a abrir.
(function () {
  var CLAVE = 'pq-estadisticas';

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  function cargarEstadisticas() {
    if (leer() === 'no' || document.querySelector('script[data-goatcounter]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = '//gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://pixelquestlegacy.goatcounter.com/count');
    document.head.appendChild(s);
  }

  var css = '' +
    '#pq-cookies{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:1000;width:min(760px,calc(100vw - 24px));' +
    'background:#141c30;color:#e3ebf7;border:3px solid #e8b94a;box-shadow:0 0 0 3px #2a1a06,0 10px 30px rgba(0,0,0,.6);' +
    'padding:18px 20px;font-family:Nunito,system-ui,sans-serif;font-size:15px;line-height:1.55;display:flex;gap:18px;align-items:center;flex-wrap:wrap}' +
    '#pq-cookies .pq-t{flex:1 1 300px}' +
    '#pq-cookies b.pq-h{display:block;font-family:"Press Start 2P",monospace;font-size:11px;color:#ffd866;margin-bottom:8px}' +
    '#pq-cookies a{color:#ffd866}' +
    '#pq-cookies .pq-b{display:flex;gap:10px;flex-wrap:wrap}' +
    '#pq-cookies button{font-family:"Press Start 2P",monospace;font-size:10px;cursor:pointer;padding:12px 14px;border:3px solid #2a1a06}' +
    '#pq-cookies .pq-si{background:#ffd866;color:#2a1a06;box-shadow:0 4px 0 #8a5a12}' +
    '#pq-cookies .pq-no{background:#1b2540;color:#ffe9a8;border-color:#e8b94a;box-shadow:0 4px 0 #0a0e18}' +
    '#pq-cookies button:active{transform:translateY(3px);box-shadow:none}' +
    '@media(max-width:560px){#pq-cookies{bottom:8px;padding:14px}#pq-cookies .pq-b{width:100%}#pq-cookies button{flex:1}}';

  function cerrar() {
    var c = document.getElementById('pq-cookies');
    if (c) c.remove();
  }

  function elegir(v) {
    guardar(v);
    cerrar();
    if (v === 'si') cargarEstadisticas();
    document.dispatchEvent(new CustomEvent('pq-cookies', { detail: v }));
  }

  function abrir() {
    if (document.getElementById('pq-cookies')) return;
    if (!document.getElementById('pq-cookies-css')) {
      var st = document.createElement('style');
      st.id = 'pq-cookies-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    var c = document.createElement('div');
    c.id = 'pq-cookies';
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-label', 'Aviso de cookies');
    c.innerHTML =
      '<div class="pq-t"><b class="pq-h">🍪 COOKIES</b>' +
      'Aquí no hay publicidad ni rastreo. Guardamos tu partida en tu dispositivo y contamos visitas de forma anónima, sin cookies. ' +
      '<a href="legal.html#cookies">Más información</a></div>' +
      '<div class="pq-b"><button type="button" class="pq-no">SOLO LO NECESARIO</button>' +
      '<button type="button" class="pq-si">ACEPTAR</button></div>';
    c.querySelector('.pq-si').addEventListener('click', function () { elegir('si'); });
    c.querySelector('.pq-no').addEventListener('click', function () { elegir('no'); });
    document.body.appendChild(c);
  }

  window.PQCookies = { abrir: abrir, eleccion: leer };

  cargarEstadisticas();
  function alCargar() { if (!leer()) abrir(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', alCargar);
  else alCargar();
})();
