/* Sprachen der Voranmeldung (20.10.2026).
   Fertig: Deutsch, Englisch. Vorbereitet (noch ohne Text): siehe PLANNED.
   Neue Sprache = neuer Block in TEXT mit denselben Schlüsseln; fehlende Schlüssel fallen auf Deutsch zurück.
   Rechts-nach-links-Sprachen (Arabisch) stehen in RTL; die Seite spiegelt sich dann automatisch. */
(function () {
  const RTL = ['ar'];
  // QR-Code nach der Voranmeldung anzeigen? (27.10.2026: für den Lehrgang am 14.11. AUS –
  // Einlass läuft über die Namensliste. Für spätere Seminare wieder auf true stellen.)
  const SHOW_QR = false;
  // Reihenfolge der Auswahl; "ready: false" = noch nicht übersetzt, erscheint nicht in der Auswahl.
  const LANGS = [
    { id: 'de', name: 'Deutsch', locale: 'de-DE', ready: true },
    { id: 'en', name: 'English', locale: 'en-GB', ready: true },
    { id: 'uk', name: 'Українська', locale: 'uk-UA', ready: false },
    { id: 'ru', name: 'Русский', locale: 'ru-RU', ready: false },
    { id: 'tr', name: 'Türkçe', locale: 'tr-TR', ready: false },
    { id: 'ar', name: 'العربية', locale: 'ar', ready: false },
    { id: 'fr', name: 'Français', locale: 'fr-CH', ready: false },
    { id: 'it', name: 'Italiano', locale: 'it-CH', ready: false },
    { id: 'zh', name: '中文', locale: 'zh-CN', ready: false }
  ];
  const TEXT = {
    de: {
      formIntroNoQr: 'Voranmeldung freiwillig – Teilnahme auch ohne Anmeldung möglich. Bezahlt wird bar vor Ort.',
      screenshotNoQr: '<b>Fertig – du musst nichts weiter tun.</b> Am Einlass nennst du einfach deinen Namen. Bezahlt wird bar vor Ort.',
      addPersonHintNoQr: 'Zum Beispiel ein Familienmitglied oder eine Begleitperson – jede Person wird einzeln angemeldet.',
      backToTicketsNoQr: 'Zurück zu meiner Anmeldung',
      pageTitle: 'Slowmotion Lehrgang – Voranmeldung',
      langLabel: 'Sprache',
      kicker: 'Selbstverteidigung',
      title: 'Offener<br>Lehrgang',
      by: 'Unter Leitung von',
      place: 'Ort', when: 'Wann',
      demo: 'Vorschau-Modus: Anmeldungen werden nur in diesem Browser gespeichert.',
      loading: 'Wird geladen …',
      offlineTitle: 'Gerade nicht erreichbar',
      offlineText: 'Bitte prüfe deine Internetverbindung und versuche es noch einmal.',
      reload: 'Neu laden',
      closedTitle: 'Zurzeit ist keine Voranmeldung offen',
      closedText: 'Schau später noch einmal vorbei.',
      formTitle: 'Voranmeldung',
      formIntro: 'Voranmeldung freiwillig – Teilnahme auch ohne Anmeldung möglich. Nach der Voranmeldung erhältst du einen persönlichen QR-Code. Bezahlt wird bar vor Ort.',
      firstName: 'Vorname', lastName: 'Nachname',
      school: 'Wo trainierst du?', schoolHint: 'Mehrere möglich.', choose: 'Bitte wählen',
      schoolNone: 'Keine feste Schule – bei verschiedenen Trainern', schoolOther: 'Andere Schule',
      stage: 'Deine Stufe',
      photoTitle: 'Fotos und Videos: Darfst du darauf zu sehen sein?',
      photoText: 'Beim Lehrgang wird fotografiert und gefilmt. Bitte wähle eins aus. „Nein“ hat für dich keinen Nachteil – du trainierst ganz normal mit.',
      photoYes: 'Ja, ich darf auf Fotos und Videos zu sehen sein', photoNo: 'Nein, bitte keine Fotos und Videos von mir',
      privacySummary: 'Was passiert mit meinen Angaben?',
      privacyText: 'Deine Angaben (Name, Schule, Stufe) dienen nur der Teilnehmerliste dieses Lehrgangs. Sehen können sie nur die Veranstalter und die Person am Einlass. Gespeichert wird bei einem Dienstleister mit Rechenzentrum in der EU. Die Liste wird spätestens drei Monate nach dem Lehrgang gelöscht. Wenn du nicht fotografiert werden möchtest, kannst du das auch später jederzeit den Veranstaltern sagen.',
      organizer: 'Verantwortlich für die Teilnehmerliste: Robert Pausch und Viktor Schott (Slowmotion Kampfsystem). Fragen, Auskunft, Löschung oder Widerruf: v.schott@slowmotion-kampfsystem.de oder 0172 3231103.',
      photoShort: 'Foto-Frage',
      photoNotice: '📷 Beim Lehrgang wird fotografiert und gefilmt (z. B. für Website und Social Media von Slowmotion). Wenn du nicht fotografiert werden möchtest, sag bitte am Einlass Bescheid.',
      photoOptOut: 'Ich möchte nicht auf Fotos und Videos zu sehen sein.',
      share: 'QR-Code speichern oder teilen', shareText: 'Mein Einlass-Code für den Slowmotion-Lehrgang', shareFail: 'Speichern hat nicht geklappt – bitte einen Screenshot machen.',
      kioskTitle: 'Selbst eintragen',
      kioskIntro: 'Bitte trag dich hier selbst ein. Die Liste der anderen ist für dich nicht sichtbar.',
      kioskPrivacy: 'Deine Angaben dienen nur der Teilnehmerliste dieses Lehrgangs und werden spätestens drei Monate danach gelöscht.',
      kioskSubmit: 'Eintragen',
      kioskDone: 'Danke, {name}! Du bist eingetragen.',
      kioskReturn: 'Bitte gib das Gerät zurück.',
      kioskNext: 'Weitere Person anmelden',
      addPerson: '+ Weitere Person anmelden',
      addPersonHint: 'Zum Beispiel ein Familienmitglied oder eine Begleitperson – jede Person bekommt ihren eigenen QR-Code.',
      cancel: 'Kann doch nicht kommen – abmelden',
      cancelConfirm: '{name} wirklich abmelden? Die Angaben werden gelöscht.',
      cancelled: '{name} ist abgemeldet. Die Angaben wurden gelöscht.',
      cancelFail: 'Abmelden hat nicht geklappt (vielleicht schon am Einlass abgehakt). Bitte melde dich bei den Veranstaltern.',
      backToTickets: 'Zurück zu den QR-Codes',
      otherDevice: 'Auf einem anderen Gerät angemeldet? Dann bitte dort abmelden oder kurz den Veranstaltern Bescheid geben.',
      otherSchoolName: 'Name der anderen Schule (freiwillig)',
      otherSchoolHint: 'Falls du woanders trainierst – z. B. Schule und Ort.',
      translationNote: '',
      confirm: 'Ich habe gelesen, wofür meine Angaben verwendet werden.',
      submit: 'Voranmelden', sending: 'Wird gesendet …',
      missing: 'Bitte noch ausfüllen: {list}.',
      confirmMissing: 'Bitte bestätige kurz, dass du den Hinweis zu deinen Angaben gelesen hast.',
      errNetwork: 'Keine Verbindung. Bitte prüfe dein Internet und versuche es noch einmal.',
      errOther: 'Das hat nicht geklappt. Bitte versuche es in ein paar Minuten noch einmal.',
      done: 'Du bist vorangemeldet ✓',
      screenshot: '<b>Mach jetzt einen Screenshot</b> von diesem QR-Code. In der Halle gibt es vielleicht kein Netz, der Screenshot funktioniert trotzdem. Am Eingang zeigst du ihn einfach vor. Bezahlt wird bar vor Ort.',
      photoState: 'Fotos und Videos: {state}', photoOk: 'ja', photoNotOk: 'bitte nicht',
      edit: 'Angaben ändern',
      otherSchool: 'Andere Schule / Gast',
      stageNew: 'Neu – zum ersten Mal dabei',
      albumBtn: '📷 Fotos & Videos vom Lehrgang',
      already: 'Du bist bereits vorangemeldet ✓',
      alreadyText: 'Auf diesem Gerät gibt es schon eine Voranmeldung. Du musst dich nicht noch einmal anmelden.',
      route: 'Route', appleMaps: 'Apple Karten', googleMaps: 'Google Maps',
      addCal: 'In Kalender eintragen', googleCal: 'Google Kalender',
      calTitle: 'Slowmotion – Offener Lehrgang (Selbstverteidigung)',
      calDetails: 'Unter Leitung von Robert Pausch & Viktor Schott. Bezahlung bar vor Ort. www.slowmotion-kampfsystem.de',
      tapPlace: 'Antippen für die Route', tapDate: 'Antippen für den Kalender'
    },
    en: {
      formIntroNoQr: 'Pre-registration is optional – you can also take part without registering. Payment is in cash on site.',
      screenshotNoQr: '<b>Done – nothing else to do.</b> Just tell us your name at the entrance. Payment is in cash on site.',
      addPersonHintNoQr: 'For example a family member or companion – each person is registered separately.',
      backToTicketsNoQr: 'Back to my registration',
      pageTitle: 'Slowmotion open seminar – pre-registration',
      langLabel: 'Language',
      kicker: 'Self-defence',
      title: 'Open<br>Seminar',
      by: 'Led by',
      place: 'Venue', when: 'When',
      demo: 'Preview mode: registrations are only stored in this browser.',
      loading: 'Loading …',
      offlineTitle: 'Not reachable right now',
      offlineText: 'Please check your internet connection and try again.',
      reload: 'Reload',
      closedTitle: 'Pre-registration is not open at the moment',
      closedText: 'Please check back later.',
      formTitle: 'Pre-registration',
      formIntro: 'Pre-registration is optional – you can also take part without registering. After pre-registering you receive a personal QR code. Payment is in cash on site.',
      firstName: 'First name', lastName: 'Last name',
      school: 'Where do you train?', schoolHint: 'You can choose more than one.', choose: 'Please choose',
      schoolNone: 'No fixed school – with different trainers', schoolOther: 'Other school',
      stage: 'Your level',
      photoTitle: 'Photos and videos: may you appear in them?',
      photoText: 'Photos and videos will be taken during the seminar. Please choose one. Saying “no” has no disadvantage – you train just like everyone else.',
      photoYes: 'Yes, I may appear in photos and videos', photoNo: 'No, please no photos or videos of me',
      privacySummary: 'What happens to my details?',
      privacyText: 'Your details (name, school, level) are used only for the participant list of this seminar. Only the organisers and the person at the entrance can see them. They are stored by a service provider with a data centre in the EU. The list is deleted no later than three months after the seminar. If you do not want to be photographed, you can also tell the organisers at any time later.',
      organizer: 'Responsible for the participant list: Robert Pausch and Viktor Schott (Slowmotion Kampfsystem). Questions, access, deletion or withdrawal: v.schott@slowmotion-kampfsystem.de or +49 172 3231103.',
      photoShort: 'photo question',
      photoNotice: '📷 Photos and videos will be taken at the seminar (e.g. for the Slowmotion website and social media). If you do not want to be photographed, please tell us at the entrance.',
      photoOptOut: 'I do not want to appear in photos or videos.',
      share: 'Save or share QR code', shareText: 'My entry code for the Slowmotion seminar', shareFail: 'Saving did not work – please take a screenshot.',
      kioskTitle: 'Register yourself',
      kioskIntro: 'Please enter your details here. You cannot see anyone else’s data.',
      kioskPrivacy: 'Your details are used only for the participant list of this seminar and are deleted no later than three months afterwards.',
      kioskSubmit: 'Register',
      kioskDone: 'Thank you, {name}! You are registered.',
      kioskReturn: 'Please hand the device back.',
      kioskNext: 'Register another person',
      addPerson: '+ Register another person',
      addPersonHint: 'For example a family member or companion – each person gets their own QR code.',
      cancel: 'Can’t come after all – cancel',
      cancelConfirm: 'Really cancel {name}? The details will be deleted.',
      cancelled: '{name} has been cancelled. The details were deleted.',
      cancelFail: 'Cancelling did not work (maybe already checked in). Please contact the organisers.',
      backToTickets: 'Back to the QR codes',
      otherDevice: 'Registered on another device? Please cancel there or let the organisers know.',
      otherSchoolName: 'Name of your school (optional)',
      otherSchoolHint: 'If you train somewhere else – e.g. school and town.',
      translationNote: 'Translation for your convenience; the German text is authoritative.',
      confirm: 'I have read what my details are used for.',
      submit: 'Pre-register', sending: 'Sending …',
      missing: 'Please fill in: {list}.',
      confirmMissing: 'Please confirm that you have read the note about your details.',
      errNetwork: 'No connection. Please check your internet and try again.',
      errOther: 'That did not work. Please try again in a few minutes.',
      done: 'You are pre-registered ✓',
      screenshot: '<b>Take a screenshot</b> of this QR code now. There may be no signal in the hall – the screenshot still works. Just show it at the entrance. Payment is in cash on site.',
      photoState: 'Photos and videos: {state}', photoOk: 'yes', photoNotOk: 'please not',
      edit: 'Change details',
      otherSchool: 'Other school / guest',
      stageNew: 'New – first time here',
      albumBtn: '📷 Photos & videos from the seminar',
      already: 'You are already pre-registered ✓',
      alreadyText: 'There is already a pre-registration on this device. You do not need to register again.',
      route: 'Directions', appleMaps: 'Apple Maps', googleMaps: 'Google Maps',
      addCal: 'Add to calendar', googleCal: 'Google Calendar',
      calTitle: 'Slowmotion – open self-defence seminar',
      calDetails: 'Led by Robert Pausch & Viktor Schott. Payment in cash on site. www.slowmotion-kampfsystem.de',
      tapPlace: 'Tap for directions', tapDate: 'Tap to add to calendar'
    }
  };

  function pick() {
    let saved = null; try { saved = localStorage.getItem('lg_lang'); } catch (e) {}
    const usable = LANGS.filter(l => l.ready).map(l => l.id);
    const q = new URLSearchParams(location.search).get('lang');
    if (q && usable.includes(q)) return q;
    if (saved && usable.includes(saved)) return saved;
    const nav = (navigator.languages || [navigator.language || 'de']).map(x => String(x).slice(0, 2).toLowerCase());
    return nav.find(x => usable.includes(x)) || 'de';
  }
  let cur = pick();
  function t(key, vars) {
    const k2 = SHOW_QR ? null : key + 'NoQr';
    let s = (k2 && ((TEXT[cur] && TEXT[cur][k2]) ?? TEXT.de[k2])) ?? (TEXT[cur] && TEXT[cur][key]) ?? TEXT.de[key] ?? key;
    if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  function apply() {
    const l = LANGS.find(x => x.id === cur) || LANGS[0];
    document.documentElement.lang = cur;
    document.documentElement.dir = RTL.includes(cur) ? 'rtl' : 'ltr';
    document.title = t('pageTitle');
    document.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = t(el.getAttribute('data-t')); });
    return l;
  }
  function set(id) { cur = id; try { localStorage.setItem('lg_lang', id); } catch (e) {} apply(); }
  function locale() { return (LANGS.find(x => x.id === cur) || LANGS[0]).locale; }
  function picker() {
    const ready = LANGS.filter(l => l.ready);
    if (ready.length < 2) return '';
    return `<label class="lang"><span class="sr">${t('langLabel')}</span><select id="langSel" aria-label="${t('langLabel')}">` +
      ready.map(l => `<option value="${l.id}" ${l.id === cur ? 'selected' : ''}>${l.name}</option>`).join('') + '</select></label>';
  }
  window.LGI = { t, showQr: SHOW_QR, apply, set, locale, picker, get lang() { return cur; }, LANGS, RTL };
})();
