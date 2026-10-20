/* Slowmotion Lehrgang – gemeinsame Logik (Voranmeldung + Einlass).
   Ohne Eintrag in config.js läuft alles im Vorschau-Modus (nur in diesem Browser). */
(function () {
  const STAGES = [
    { id: 'Neu', stars: 0, group: 'Neu', labelKey: 'stageNew', label: 'Neu – zum ersten Mal dabei' },
    { id: 'Einsteiger', stars: 0, group: 'Basis', logo: 'einsteiger' },
    { id: 'Level 1', stars: 1, group: 'Basis', logo: 'level1' },
    { id: 'Level 2', stars: 2, group: 'Basis', logo: 'level2' },
    { id: 'Level 3', stars: 3, group: 'Fortgeschrittene', logo: 'level3' },
    { id: 'Praktiker', stars: 0, group: 'Fortgeschrittene', mark: 'P', logo: 'praktiker' },
    { id: 'Kampfsystem', stars: 0, group: 'Fortgeschrittene', mark: 'KS', logo: 'kampfsystem' },
    { id: 'Ausbilder 1', stars: 0, group: 'Ausbilder', mark: 'A1', logo: 'ausbilder1' },
    { id: 'Ausbilder 2', stars: 0, group: 'Ausbilder', mark: 'A2', logo: 'ausbilder2' },
    { id: 'Führungskräfte', stars: 0, group: 'Ausbilder', mark: 'F', logo: 'fuehrungskraefte' },
    { id: 'Ehrenmitglied', stars: 0, group: 'Ausbilder', mark: 'E', logo: 'ehrenmitglied' }
  ];
  // Stand 20.10.2026: Berlin (Eberswalde), Leipzig / Dresden ergänzt; mehrere Schulen je Person möglich
  const SCHOOLS = [
    'Slowmotion Kampfsportschule Berlin (Eberswalde)',
    'Slowmotion Kampfsportschule Leipzig / Dresden',
    'K4 Königs Wusterhausen',
    'K4 Mühlenbeck',
    'Greifswald',
    'Keine feste Schule – bei verschiedenen Trainern',
    'Andere Schule / Gast'
  ];
  const SCHOOL_SEP = ' · ';
  // Ältere Schreibweisen weiter erkennen
  const SCHOOL_ALIAS = { 'Slowmotion Kampfsportschule Berlin': SCHOOLS[0], 'Slowmotion Kampfsportschule Leipzig': SCHOOLS[1] };
  function splitSchools(v) { return String(v || '').split(SCHOOL_SEP).map(x => x.trim()).filter(Boolean).map(x => SCHOOL_ALIAS[x] || x); }
  function joinSchools(list) { return list.filter(Boolean).join(SCHOOL_SEP); }

  const conf = window.LG_CONFIG || {};
  const online = !!(conf.supabaseUrl && conf.supabaseAnonKey);

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }
  function storeJson(key, value) {
    if (value === undefined) { try { return JSON.parse(store(key) || 'null'); } catch (e) { return null; } }
    store(key, value === null ? null : JSON.stringify(value));
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) { try { return crypto.randomUUID(); } catch (e) {} }
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function stage(id) { return STAGES.find(s => s.id === id) || { id: id || '–', stars: 0 }; }
  function stageBadge(id) {
    const s = stage(id);
    const img = s.logo ? `<img class="lg" src="logos/${s.logo}.webp" alt="" width="28" height="28">` : '';
    const stars = s.stars ? '<span class="stars" aria-hidden="true">' + '★'.repeat(s.stars) + '</span>' : '';
    const name = s.labelKey ? (window.LGI ? window.LGI.t(s.labelKey) : (s.label || s.id)) : esc(s.id).replace(" ", "&nbsp;");
    const cls = s.logo ? '' : ' class="nologo"';
    return `<span class="badge">${img}<span${cls}>${name}</span>${stars}</span>`;
  }
  function fmtDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-').map(Number);
    const dt = new Date(y, m - 1, day);
    return dt.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  class ApiError extends Error { constructor(code, msg) { super(msg || code); this.code = code; } }
  const KNOWN = ['bad_key', 'invalid', 'no_event', 'full'];

  async function rpc(fn, payload) {
    const headers = { apikey: conf.supabaseAnonKey, 'Content-Type': 'application/json' };
    if (/^eyJ/.test(conf.supabaseAnonKey)) headers.Authorization = 'Bearer ' + conf.supabaseAnonKey;
    let res;
    try {
      res = await fetch(conf.supabaseUrl.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, { method: 'POST', headers, body: JSON.stringify(payload || {}) });
    } catch (e) { throw new ApiError('network'); }
    const text = await res.text();
    let body = null; try { body = text ? JSON.parse(text) : null; } catch (e) {}
    if (!res.ok) {
      const msg = (body && body.message) || text || '';
      throw new ApiError(KNOWN.find(k => msg === k) || 'server', String(msg).slice(0, 200));
    }
    return body;
  }

  /* ---------- Vorschau-Backend (nur dieser Browser) ---------- */
  const DEMO = 'lg_demo_db', DEMO_PW = 'demo';
  function dload() {
    let d = storeJson(DEMO);
    if (!d) {
      const id = uuid();
      d = { events: [{ id, title: 'Selbstverteidigung – Offener Lehrgang', event_date: '2026-11-14', time_text: '13:30–17:00 Uhr', location: 'Gunter-Liche-Halle, Hermann-Duncker-Straße 24, 16321 Bernau bei Berlin', active: true }], people: [] };
      storeJson(DEMO, d);
    }
    return d;
  }
  function dsave(d) { storeJson(DEMO, d); }
  function activeEvent(d) { return d.events.find(e => e.active) || null; }
  function ticket(d) {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let t;
    do { t = 'SM-' + Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join(''); } while (d.people.some(p => p.ticket === t));
    return t;
  }
  function sortPeople(list) { return list.sort((a, b) => (a.last_name.toLowerCase() + a.first_name.toLowerCase()).localeCompare(b.last_name.toLowerCase() + b.first_name.toLowerCase(), 'de')); }
  function dData(d, ev) {
    ev = ev || (activeEvent(d) || {}).id;
    const evo = d.events.find(e => e.id === ev) || {};
    return { prices: { regular: evo.price_regular ?? null, reduced: evo.price_reduced ?? null }, events: d.events.slice().sort((a, b) => (b.event_date || '').localeCompare(a.event_date || '')), event_id: ev, people: sortPeople(d.people.filter(p => p.event_id === ev).map(p => ({ ...p }))), server_time: new Date().toISOString() };
  }
  function applyOps(people, ops, eventId) {
    for (const o of ops) {
      if (o.op === 'add') {
        if (!people.some(p => p.id === o.id)) people.push({ id: o.id, event_id: o.event_id || eventId, ticket: o.ticket || '–', first_name: o.first_name, last_name: o.last_name, school: o.school, stage: o.stage, photo_ok: !!o.photo_ok, present: o.present !== false, present_at: o.present !== false ? (o.at || new Date().toISOString()) : null, paid: !!o.paid, free: !!o.free, reduced: !!o.reduced, amount: o.amount == null ? null : o.amount, source: 'vor_ort', note: o.note || null });
      } else if (o.op === 'set') {
        const p = people.find(x => x.id === o.id); if (!p) continue;
        if (o.present === true && !p.present) p.present_at = o.at || new Date().toISOString();
        if (o.present === false) p.present_at = null;
        for (const k of ['present', 'paid', 'free', 'reduced', 'amount', 'stage', 'school', 'first_name', 'last_name', 'photo_ok', 'note']) if (k in o) p[k] = o[k];
      } else if (o.op === 'delete') {
        const i = people.findIndex(x => x.id === o.id); if (i >= 0) people.splice(i, 1);
      }
    }
    return people;
  }
  function dAdmin(key) { if (key !== DEMO_PW) throw new ApiError('bad_key'); }
  const demo = {
    async publicEvent() { return activeEvent(dload()); },
    async register(client, f) {
      const d = dload(), ev = activeEvent(d); if (!ev) throw new ApiError('no_event');
      if (!f.first_name.trim() || !f.last_name.trim() || !f.school || !f.stage) throw new ApiError('invalid');
      const ex = d.people.find(p => p.event_id === ev.id && p.client === client);
      if (ex) { Object.assign(ex, { first_name: f.first_name.trim(), last_name: f.last_name.trim(), school: f.school, stage: f.stage, photo_ok: !!f.photo_ok }); dsave(d); return { ticket: ex.ticket, updated: true }; }
      const t = ticket(d);
      d.people.push({ id: uuid(), event_id: ev.id, ticket: t, client, first_name: f.first_name.trim(), last_name: f.last_name.trim(), school: f.school, stage: f.stage, photo_ok: !!f.photo_ok, present: false, present_at: null, paid: false, free: f.stage === 'Ehrenmitglied', reduced: false, amount: null, source: 'vorab', note: null, created_at: new Date().toISOString() });
      dsave(d); return { ticket: t, updated: false };
    },
    async cancel(client, tk) {
      const d = dload(); const i = d.people.findIndex(p => p.client === client && p.ticket === tk && !p.present);
      if (i >= 0) { d.people.splice(i, 1); dsave(d); return { cancelled: true }; }
      return { cancelled: false };
    },
    async adminData(key, ev) { dAdmin(key); return dData(dload(), ev); },
    async adminSetPrices(key, ev, r, red) { dAdmin(key); const d = dload(); const e = d.events.find(x => x.id === ev); if (e) { e.price_regular = r; e.price_reduced = red; dsave(d); } return dData(d, ev); },
    async adminSync(key, ev, ops) {
      dAdmin(key); const d = dload();
      ops.forEach(o => { if (o.op === 'add' && !d.people.some(p => p.id === o.id)) o = Object.assign(o, { ticket: ticket(d) }); });
      applyOps(d.people, ops, ev); dsave(d); return dData(d, ev);
    },
    async adminSaveEvent(key, e) {
      dAdmin(key); const d = dload();
      let ev = e.id && d.events.find(x => x.id === e.id);
      if (!ev) { ev = { id: uuid(), active: false }; d.events.push(ev); }
      Object.assign(ev, { title: e.title, event_date: e.event_date || null, time_text: e.time_text || '', location: e.location || '' });
      if (e.active) d.events.forEach(x => { x.active = x.id === ev.id; });
      dsave(d); return dData(d, ev.id);
    },
    seed(n) {
      const d = dload(), ev = activeEvent(d);
      const fn = ['Anna', 'Ben', 'Clara', 'David', 'Emma', 'Felix', 'Greta', 'Hannes', 'Ida', 'Jonas', 'Karla', 'Lukas', 'Mia', 'Noah', 'Paula'];
      const ln = ['Becker', 'Schulz', 'Wagner', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Braun', 'Zimmermann', 'Krüger'];
      for (let i = 0; i < n; i++) d.people.push({ id: uuid(), event_id: ev.id, ticket: ticket(d), client: uuid(), first_name: fn[Math.floor(Math.random() * fn.length)], last_name: ln[Math.floor(Math.random() * ln.length)] + ' (Beispiel)', school: SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)], stage: STAGES[Math.floor(Math.random() * 5)].id, photo_ok: Math.random() > 0.15, present: false, present_at: null, paid: false, source: 'vorab', note: null });
      dsave(d);
    },
    reset() { store(DEMO, null); Object.keys(localStorage).filter(k => k.startsWith('lg_')).forEach(k => store(k, null)); }
  };

  const live = {
    publicEvent: () => rpc('lg_public_event'),
    register: (client, f) => rpc('lg_register', { p_client: client, p_first: f.first_name, p_last: f.last_name, p_school: f.school, p_stage: f.stage, p_photo: !!f.photo_ok }),
    cancel: (client, tk) => rpc('lg_cancel', { p_client: client, p_ticket: tk }),
    adminData: (key, ev) => rpc('lg_admin_data', { p_key: key, p_event: ev || null }),
    adminSetPrices: (key, ev, r, red) => rpc('lg_admin_set_prices', { p_key: key, p_event: ev, p_regular: r, p_reduced: red }),
    adminSync: (key, ev, ops) => rpc('lg_admin_sync', { p_key: key, p_event: ev || null, p_ops: ops }),
    adminSaveEvent: (key, e) => rpc('lg_admin_save_event', { p_key: key, p_event: e })
  };

  function registerSW() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  const SHIELD = '<img src="logos/slowmotion.webp" alt="Slowmotion" style="width:100%;height:100%;object-fit:contain">';

  window.LG = { STAGES, SCHOOLS, SCHOOL_SEP, splitSchools, joinSchools, online, store, storeJson, uuid, esc, stage, stageBadge, fmtDate, ApiError, applyOps, sortPeople, SHIELD, DEMO_PW,
    api: online ? live : demo, demo: online ? null : demo, registerSW };
})();
