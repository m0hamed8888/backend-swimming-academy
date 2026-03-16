/* ============================================================
   AQUAELITE — script.js  (Arabic RTL)
   GSAP · Conditional Fields · Dummy API Fetch · Subscriber Search
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  lucide.createIcons();

  /* ═══════════════════════════════════════════════════════════
     REFS
  ═══════════════════════════════════════════════════════════ */
  const navbar        = document.getElementById('navbar');
  const registerCard  = document.getElementById('registerCard');
  const registerForm  = document.getElementById('registerForm');
  const bottomNav     = document.getElementById('bottomNav');
  const submitBtn     = document.getElementById('submitBtn');
  const toast         = document.getElementById('toast');
  const toastMsg      = document.getElementById('toastMsg');

  // Form inputs
  const fullName  = document.getElementById('fullName');
  const dob       = document.getElementById('dob');
  const phone     = document.getElementById('phone');

  // Conditional fields
  const fieldStars = document.getElementById('field-stars');
  const fieldFear  = document.getElementById('field-fear');
  const starsCountWrap = document.getElementById('starsCountWrap');

  /* ═══════════════════════════════════════════════════════════
     1. GSAP ENTRANCE ANIMATIONS
  ═══════════════════════════════════════════════════════════ */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to(navbar, { opacity:1, y:0, duration:.6, ease:'power2.out' })
    .to(registerCard, { opacity:1, y:0, duration:.75, ease:'power3.out' }, '-=0.2')
    .fromTo('.field-group:not(.conditional-field)',
      { opacity:0, y:18, filter:'blur(4px)' },
      { opacity:1, y:0, filter:'blur(0px)', stagger:.07, duration:.5, ease:'power2.out' },
      '-=0.35'
    )
    .fromTo(submitBtn,
      { opacity:0, y:10, scale:.96 },
      { opacity:1, y:0, scale:1, duration:.45, ease:'back.out(1.4)' },
      '-=0.1'
    )
    .fromTo('.card-footer-text', { opacity:0 }, { opacity:1, duration:.4 }, '-=0.1')
    .to(bottomNav, { y:0, duration:.55, ease:'back.out(1.4)' }, '-=0.3');


  /* ═══════════════════════════════════════════════════════════
     2. CONDITIONAL FIELD LOGIC
     — "هل مارست السباحة من قبل؟"
  ═══════════════════════════════════════════════════════════ */
  function animateIn(el) {
    el.style.display = 'flex';
    el.classList.add('show');
    gsap.fromTo(el,
      { opacity:0, y:-12, filter:'blur(4px)' },
      { opacity:1, y:0,  filter:'blur(0px)', duration:.45, ease:'power2.out' }
    );
  }

  function animateOut(el) {
    gsap.to(el, {
      opacity:0, y:-8, filter:'blur(4px)', duration:.3, ease:'power2.in',
      onComplete: () => { el.classList.remove('show'); el.style.display = 'none'; }
    });
  }

  document.querySelectorAll('input[name="swamBefore"]').forEach(radio => {
    radio.addEventListener('change', () => {
      clearError('field-swam', 'err-swam');

      if (radio.value === 'yes') {
        animateIn(fieldStars);
        animateOut(fieldFear);
        // Reset fear answer
        document.querySelectorAll('input[name="waterFear"]').forEach(r => r.checked = false);
      } else {
        animateIn(fieldFear);
        animateOut(fieldStars);
        // Reset stars answers
        document.querySelectorAll('input[name="egyptStars"]').forEach(r => r.checked = false);
        starsCountWrap.classList.remove('show');
      }
    });
  });

  // Show/hide stars count input
  document.querySelectorAll('input[name="egyptStars"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'yes') {
        starsCountWrap.style.display = 'block';
        starsCountWrap.classList.add('show');
        gsap.fromTo(starsCountWrap,
          { opacity:0, y:-8 },
          { opacity:1, y:0, duration:.35, ease:'power2.out' }
        );
      } else {
        gsap.to(starsCountWrap, {
          opacity:0, y:-6, duration:.25, ease:'power2.in',
          onComplete: () => { starsCountWrap.classList.remove('show'); starsCountWrap.style.display = 'none'; }
        });
      }
    });
  });

  // Goal cards — visual feedback
  document.querySelectorAll('.goal-card').forEach(card => {
    card.addEventListener('click', () => {
      clearError('field-goal', 'err-goal');
      gsap.fromTo(card, { scale:.94 }, { scale:1, duration:.35, ease:'back.out(2)' });
    });
  });

  // Radio cards bounce
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      gsap.fromTo(card, { scale:.95 }, { scale:1, duration:.3, ease:'back.out(2)' });
    });
  });

  /* ── SESSIONS COUNT → TRAINING DAYS LOGIC ─────────────── */
  const fieldTraindays = document.getElementById('field-traindays');
  const options8       = document.getElementById('options8');
  const options12      = document.getElementById('options12');
  const options24      = document.getElementById('options24');

  function clearTrainingSchedule() {
    document.querySelectorAll('input[name="trainingSchedule"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="restDay"]').forEach(r => r.checked = false);
  }

  document.querySelectorAll('input[name="sessionsCount"]').forEach(radio => {
    radio.addEventListener('change', () => {
      clearError('field-sessions', 'err-sessions');
      clearTrainingSchedule();

      // Show traindays section
      if (!fieldTraindays.classList.contains('show')) {
        animateIn(fieldTraindays);
      }

      // Show/hide the right option group
      options8.style.display  = radio.value === '8'  ? 'flex' : 'none';
      options12.style.display = radio.value === '12' ? 'flex' : 'none';
      options24.style.display = radio.value === '24' ? 'flex' : 'none';

      // Animate new options in
      const activeOpts = radio.value === '8' ? options8 : radio.value === '12' ? options12 : options24;
      gsap.fromTo(activeOpts,
        { opacity:0, y:-10 },
        { opacity:1, y:0, duration:.4, ease:'power2.out' }
      );

      // Bounce the selected pill
      const pill = radio.closest('.session-pill');
      gsap.fromTo(pill, { scale:.93 }, { scale:1, duration:.4, ease:'back.out(2)' });
    });
  });

  // Clear traindays error on selection
  document.querySelectorAll('input[name="trainingSchedule"], input[name="restDay"]').forEach(r => {
    r.addEventListener('change', () => clearError('field-traindays', 'err-traindays'));
  });


  /* ═══════════════════════════════════════════════════════════
     3. VALIDATION HELPERS
  ═══════════════════════════════════════════════════════════ */
  function showError(fieldId, errId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errId);
    if (!field || !err) return;
    field.classList.add('has-error');
    err.classList.add('visible');
    const wrapper = field.querySelector('.input-wrapper') || field;
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth;
    wrapper.classList.add('shake');
  }

  function clearError(fieldId, errId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errId);
    if (!field || !err) return;
    field.classList.remove('has-error');
    err.classList.remove('visible');
  }

  function isValidPhone(val) { return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(val.trim()); }

  // Live clear
  fullName.addEventListener('input', () => { if (fullName.value.trim().length >= 2) clearError('field-name','err-name'); });
  dob.addEventListener('change', () => { if (dob.value) clearError('field-dob','err-dob'); });
  phone.addEventListener('input', () => { if (isValidPhone(phone.value)) clearError('field-phone','err-phone'); });


  /* ═══════════════════════════════════════════════════════════
     4. RIPPLE EFFECT
  ═══════════════════════════════════════════════════════════ */
  submitBtn.addEventListener('pointerdown', (e) => {
    const container = submitBtn.querySelector('.ripple-container');
    const ripple    = document.createElement('span');
    ripple.className = 'ripple';
    const rect = submitBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });


  /* ═══════════════════════════════════════════════════════════
     5. FORM SUBMIT → DUMMY API FETCH
     Replace URL below with your real backend endpoint
  ═══════════════════════════════════════════════════════════ */
  const API_REGISTER_URL = 'http://localhost:5000/api/swimmers/register';

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Validate Name
    if (fullName.value.trim().length < 2) { showError('field-name','err-name'); valid = false; }

    // Validate DOB
    if (!dob.value) { showError('field-dob','err-dob'); valid = false; }

    // Validate Phone
    if (!isValidPhone(phone.value)) { showError('field-phone','err-phone'); valid = false; }

    // Validate swamBefore
    const swamVal = document.querySelector('input[name="swamBefore"]:checked');
    if (!swamVal) { showError('field-swam','err-swam'); valid = false; }

    // Validate goal
    const goalVal = document.querySelector('input[name="goal"]:checked');
    if (!goalVal) { showError('field-goal','err-goal'); valid = false; }

    // Validate sessions count
    const sessionsVal = document.querySelector('input[name="sessionsCount"]:checked');
    if (!sessionsVal) { showError('field-sessions','err-sessions'); valid = false; }

    // Validate training days/schedule
    let trainingScheduleVal = null;
    let restDayVal = null;
    if (sessionsVal) {
      if (sessionsVal.value === '24') {
        restDayVal = document.querySelector('input[name="restDay"]:checked');
        if (!restDayVal) { showError('field-traindays','err-traindays'); valid = false; }
      } else {
        trainingScheduleVal = document.querySelector('input[name="trainingSchedule"]:checked');
        if (!trainingScheduleVal) { showError('field-traindays','err-traindays'); valid = false; }
      }
    }

    if (!valid) {
      gsap.fromTo(registerCard, { x:-4 }, { x:0, duration:.5, ease:'elastic.out(1.5,0.3)' });
      return;
    }

    // Build payload
    const starsChecked = document.querySelector('input[name="egyptStars"]:checked');
    const fearChecked  = document.querySelector('input[name="waterFear"]:checked');
    const starsCount   = document.getElementById('starsCount');

    const payload = {
      fullName:         fullName.value.trim(),
      dob:              dob.value,
      phone:            phone.value.trim(),
      swamBefore:       swamVal.value,
      egyptStars:       starsChecked ? starsChecked.value : null,
      starsCount:       (starsChecked?.value === 'yes' && starsCount.value) ? parseInt(starsCount.value) : null,
      waterFear:        fearChecked ? fearChecked.value : null,
      goal:             goalVal.value,
      sessionsCount:    parseInt(sessionsVal.value),
      trainingSchedule: trainingScheduleVal ? trainingScheduleVal.value : null,
      restDay:          restDayVal ? parseInt(restDayVal.value) : null,
    };

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      /* ── ACTUAL FETCH (will fail on dummy URL — handled in catch) ── */
      const response = await fetch(API_REGISTER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      handleSuccess(data);

    } catch (err) {
      /* ── DUMMY SUCCESS (remove this block when real API is ready) ── */
      console.warn('Dummy mode — API not connected. Payload:', payload);
      handleSuccess({ message: 'تم التسجيل بنجاح', swimmerId: 'AQ-' + Math.floor(10000 + Math.random() * 90000) });
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function handleSuccess(data) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    btnText.textContent = '✓ تم التسجيل بنجاح!';
    btnIcon.style.display = 'none';

    gsap.to(registerCard, {
      boxShadow: '0 24px 80px rgba(0,0,0,.6), 0 0 60px rgba(0,229,160,.35)',
      duration: .5, yoyo:true, repeat:1, ease:'power2.inOut'
    });

    showToast(`تم التسجيل! رقم السباح: ${data.swimmerId || '—'}`, 'success');

    setTimeout(() => {
      btnText.textContent = 'تسجيل سباح جديد';
      btnIcon.style.display = '';
      registerForm.reset();
      animateOut(fieldStars);
      animateOut(fieldFear);
      animateOut(document.getElementById('field-traindays'));
      starsCountWrap.classList.remove('show');
      starsCountWrap.style.display = 'none';
      options8.style.display = 'none';
      options12.style.display = 'none';
      options24.style.display = 'none';
    }, 3500);
  }


  /* ═══════════════════════════════════════════════════════════
     6. TOAST
  ═══════════════════════════════════════════════════════════ */
  function showToast(msg, type = 'success') {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    if (type === 'error') {
      toast.style.background = 'rgba(255,77,109,.12)';
      toast.style.borderColor = 'rgba(255,77,109,.3)';
      toast.style.color = 'var(--clr-error)';
    } else {
      toast.style.background = '';
      toast.style.borderColor = '';
      toast.style.color = '';
    }
    setTimeout(() => toast.classList.remove('show'), 3500);
  }


  /* ═══════════════════════════════════════════════════════════
     7. SEARCH MODAL — SUBSCRIBER LOOKUP
  ═══════════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════════
     API ENDPOINTS
     ─────────────────────────────────────────────────────────
     GET  /api/subscribers/:id          → بيانات المشترك
     GET  /api/attendance/:id/week      → حضور وغياب الأسبوع الحالي
     POST /api/attendance               → تسجيل حضور (من صفحة المدرب)

     Expected subscriber response shape:
     {
       id, name, dob, phone,
       sessions: { total, attended },
       trainingTime, expiryDate, startDate,
       trainingDays: ['sunday','tuesday','thursday'],
       trainer: { name, avatar? },
     }

     Expected attendance/week response shape:
     {
       weekStart: '2026-03-09',
       days: [
         { date:'2026-03-09', dayName:'sunday',  isTrainingDay:true,  status:'present' },
         { date:'2026-03-10', dayName:'monday',  isTrainingDay:false, status:null },
         { date:'2026-03-11', dayName:'tuesday', isTrainingDay:true,  status:'absent' },
         ...
       ]
     }
  ═══════════════════════════════════════════════════════════ */

  const API_BASE       = 'http://localhost:5000/api';
  const API_SEARCH_URL = `${API_BASE}/swimmers/`;
  const API_ATTEND_URL = `${API_BASE}/attendance/`;

  /* ── MOCK DATABASE ─────────────────────────────────────── */
  // Simulates what your real backend will return
  // trainingDays uses JS day index: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  const MOCK_DB = {
    '10023': {
      name:         'أحمد محمد علي',
      dob:          '2005-03-14',
      phone:        '0100-123-4567',
      sessions:     { total: 24, attended: 18 },
      trainingTime: '07:00 ص',
      expiryDate:   '2026-06-01',
      startDate:    '2025-12-01',
      trainingDays: [0, 2, 4], // Ahad, Thalatha, Khamees
      trainer:      { name: 'أ. محمود حسين' },
    },
    '10045': {
      name:         'سارة إبراهيم حسن',
      dob:          '2010-07-22',
      phone:        '0111-987-6543',
      sessions:     { total: 16, attended: 14 },
      trainingTime: '09:00 ص',
      expiryDate:   '2026-04-15',
      startDate:    '2026-01-15',
      trainingDays: [6, 1, 3], // Sabt, Etnayn, Arba'a
      trainer:      { name: 'أ. نادية كمال' },
    },
    '10067': {
      name:         'يوسف خالد محمود',
      dob:          '1998-11-05',
      phone:        '0122-555-0099',
      sessions:     { total: 8, attended: 6 },
      trainingTime: '06:00 م',
      expiryDate:   '2025-12-31', // expired
      startDate:    '2025-10-01',
      trainingDays: [1, 3],
      trainer:      { name: 'أ. محمود حسين' },
    },
    '10088': {
      name:         'نور عبد الله السيد',
      dob:          '2012-01-30',
      phone:        '0100-777-2233',
      sessions:     { total: 32, attended: 30 },
      trainingTime: '04:00 م',
      expiryDate:   '2026-09-20',
      startDate:    '2025-09-20',
      trainingDays: [0, 1, 2, 3, 4],
      trainer:      { name: 'أ. نادية كمال' },
    },
  };

  /* Simulate attendance — trainer marks these from trainer.html */
  const MOCK_ATTENDANCE = {
    '10023': { 0: 'present', 2: 'present', 4: 'absent'  },
    '10045': { 6: 'present', 1: 'absent',  3: 'present' },
    '10067': { 1: 'present', 3: 'absent'                },
    '10088': { 0: 'present', 1: 'present', 2: 'present', 3: 'absent', 4: 'present' },
  };

  const DAY_NAMES_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const DAY_SHORT_AR = ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

  /* ── DOM refs ──────────────────────────────────────────── */
  const searchBtn      = document.getElementById('searchBtn');
  const searchOverlay  = document.getElementById('searchOverlay');
  const searchCancel   = document.getElementById('searchCancel');
  const searchInput    = document.getElementById('searchInput');
  const searchExecBtn  = document.getElementById('searchExecBtn');

  const stateEmpty     = document.getElementById('stateEmpty');
  const stateLoading   = document.getElementById('stateLoading');
  const stateNotFound  = document.getElementById('stateNotFound');
  const subscriberCard = document.getElementById('subscriberCard');

  /* ── HELPERS ────────────────────────────────────────────── */
  function showState(name) {
    [stateEmpty, stateLoading, stateNotFound, subscriberCard].forEach(el => el.style.display = 'none');
    if      (name === 'empty')    stateEmpty.style.display    = 'flex';
    else if (name === 'loading')  stateLoading.style.display  = 'flex';
    else if (name === 'notfound') stateNotFound.style.display = 'flex';
    else if (name === 'card')     subscriberCard.style.display= 'block';
  }

  function calcAge(dobStr) {
    const today = new Date(), birth = new Date(dobStr);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year:'numeric', month:'short', day:'numeric' });
  }

  function isExpired(expiryDate) {
    return new Date(expiryDate).getTime() < Date.now();
  }

  /**
   * Real remaining-time calculation:
   * pct = (expiryDate - now) / (expiryDate - startDate) × 100
   * Returns integer 0–100
   */
  function calcRemainingPct(startDate, expiryDate) {
    const start = new Date(startDate).getTime();
    const end   = new Date(expiryDate).getTime();
    const now   = Date.now();
    if (now >= end)    return 0;
    if (now <= start)  return 100;
    return Math.round(((end - now) / (end - start)) * 100);
  }

  /** How many days left until expiry */
  function daysLeft(expiryDate) {
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  /* ── GET WEEK DAYS starting from last Sunday ─────────────── */
  function getWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }

  /* ── RENDER SUBSCRIBER CARD ─────────────────────────────── */
  function renderSubscriberCard(id, data, attendance) {
    const expired = isExpired(data.expiryDate);
    const pct     = calcRemainingPct(data.startDate, data.expiryDate);
    const left    = daysLeft(data.expiryDate);
    const age     = calcAge(data.dob);

    // ── Basic info
    document.getElementById('scAvatar').textContent  = data.name.charAt(0);
    document.getElementById('scName').textContent    = data.name;
    document.getElementById('scId').textContent      = '#' + id;
    document.getElementById('scAge').textContent     = age + ' سنة';
    document.getElementById('scTime').textContent    = data.trainingTime;
    document.getElementById('scExpiry').textContent  = formatDate(data.expiryDate);

    // Sessions: attended / total
    const sessEl = document.getElementById('scSessions');
    sessEl.innerHTML = `${data.sessions.attended}<span class="sessions-total"> / ${data.sessions.total}</span>`;

    // Trainer name
    document.getElementById('scTrainer').textContent = data.trainer?.name || '—';

    // Status badge
    const statusEl = document.getElementById('scStatus');
    statusEl.className = 'sc-status' + (expired ? ' expired' : '');
    statusEl.querySelector('.sc-status-text').textContent = expired ? 'منتهي' : 'نشط';

    // ── Weekly attendance calendar
    renderWeekCalendar(id, data.trainingDays, attendance);

    showState('card');
    lucide.createIcons();

    // ── Entrance animations
    gsap.fromTo(subscriberCard,
      { opacity:0, y:24, scale:.96 },
      { opacity:1, y:0, scale:1, duration:.55, ease:'back.out(1.2)' }
    );
    gsap.fromTo('.sc-stat',
      { opacity:0, y:10 },
      { opacity:1, y:0, stagger:.07, duration:.4, ease:'power2.out', delay:.1 }
    );
    gsap.fromTo('.week-day-cell',
      { opacity:0, scale:.7 },
      { opacity:1, scale:1, stagger:.05, duration:.35, ease:'back.out(1.6)', delay:.25 }
    );

    // Animate progress bar with real value
    setTimeout(() => {
      gsap.to(progFill, {
        width: expired ? '3%' : pct + '%',
        duration: 1.4, ease: 'power3.out', delay:.35
      });
    }, 80);
  }

  /* ── WEEKLY CALENDAR ─────────────────────────────────────── */
  function renderWeekCalendar(id, trainingDayIndexes, attendance) {
    const container = document.getElementById('scWeekCalendar');
    const weekDates = getWeekDates();
    const today     = new Date();
    today.setHours(0,0,0,0);

    // Month names for display
    const MONTHS_SHORT = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

    container.innerHTML = '';

    let attendedCount  = 0;
    let totalPastDays  = 0;

    weekDates.forEach(date => {
      const dayIdx        = date.getDay();
      const isTrainingDay = trainingDayIndexes.includes(dayIdx);
      const isPast        = date < today;
      const isToday       = date.getTime() === today.getTime();

      // Attendance logic:
      // - Past training day + NO absent record from API → PRESENT (blue, auto)
      // - Past training day + absent from API → ABSENT (red)
      // - Today training day → TODAY (cyan pulse)
      // - Future training day → UPCOMING (dim cyan)
      // - Not a training day → REST

      const apiStatus = attendance[dayIdx]; // 'absent' | undefined
      let cellState;

      if (!isTrainingDay) {
        cellState = 'rest-day';
      } else if (isToday) {
        cellState = 'today';
      } else if (isPast) {
        cellState = apiStatus === 'absent' ? 'absent' : 'present';
        totalPastDays++;
        if (cellState === 'present') attendedCount++;
      } else {
        cellState = 'upcoming';
      }

      // Build cell
      const cell = document.createElement('div');
      cell.className = `week-day-cell ${cellState}`;

      // Icon
      const icon = cellState === 'present' ? '✓'
                 : cellState === 'absent'  ? '✕'
                 : cellState === 'today'   ? '●'
                 : '';

      // Date display: day name + date number + month
      cell.innerHTML = `
        <span class="wdc-name">${DAY_SHORT_AR[dayIdx]}</span>
        <span class="wdc-num">${date.getDate()}</span>
        <span class="wdc-month">${MONTHS_SHORT[date.getMonth()]}</span>
        <span class="wdc-icon">${icon}</span>
      `;

      container.appendChild(cell);
    });

    // Summary
    document.getElementById('scAttendSummary').textContent =
      totalPastDays > 0
        ? `${attendedCount} حضور / ${totalPastDays} جلسة`
        : 'لا توجد جلسات ماضية هذا الأسبوع';
  }

  /* ── SEARCH & FETCH ─────────────────────────────────────── */
  async function performSearch(query) {
    const id = query.trim().replace(/\D/g, '');
    if (!id) return;

    showState('loading');

    try {
      const [subRes, attRes] = await Promise.all([
        fetch(API_SEARCH_URL + id),
        fetch(API_ATTEND_URL + id + '/week'),
      ]);
      if (!subRes.ok) throw new Error('not found');

      const subJson = await subRes.json();
      const attJson = attRes.ok ? await attRes.json() : {};

      const subData = subJson.data;
      // الباك اند بيرجع absenceMap مباشرة: { dayIndex: 'absent' }
      const attMap  = attJson.absenceMap || {};

      renderSubscriberCard(id, subData, attMap);

    } catch (err) {
      // ── FALLBACK TO MOCK (remove when real API is ready) ──
      console.warn('[AquaElite] Dummy mode — searching mock DB for:', id);
      await new Promise(r => setTimeout(r, 750));

      if (MOCK_DB[id]) {
        renderSubscriberCard(id, MOCK_DB[id], MOCK_ATTENDANCE[id] || {});
      } else {
        showState('notfound');
        gsap.fromTo(stateNotFound, { opacity:0, scale:.95 }, { opacity:1, scale:1, duration:.4, ease:'back.out(1.4)' });
      }
    }
  }

  /* ── OPEN / CLOSE SEARCH ─────────────────────────────────── */
  function openSearch() {
    searchOverlay.classList.add('open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showState('empty');
    setTimeout(() => searchInput.focus(), 200);
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    setTimeout(() => showState('empty'), 300);
  }

  searchBtn.addEventListener('click', openSearch);
  searchCancel.addEventListener('click', closeSearch);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
  searchExecBtn.addEventListener('click', () => performSearch(searchInput.value));
  searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch(); });


  /* ═══════════════════════════════════════════════════════════
     8. INPUT FOCUS MICRO-ANIMATION
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input.closest('.input-wrapper'), { scale:1.005, duration:.25, ease:'power2.out' });
    });
    input.addEventListener('blur', () => {
      gsap.to(input.closest('.input-wrapper'), { scale:1, duration:.2, ease:'power2.out' });
    });
  });

});