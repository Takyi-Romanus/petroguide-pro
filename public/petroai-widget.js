

(function () {
  'use strict';

  // ─── Inject Styles ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* === Widget Root === */
    #petroai-widget * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* === Floating Trigger Button === */
    #petroai-trigger {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9998;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0a2540 0%, #1a4a7a 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(10, 37, 64, 0.45), 0 0 0 0 rgba(240, 165, 0, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease;
      animation: petroai-pulse 3s ease-in-out infinite;
    }

    #petroai-trigger:hover {
      transform: scale(1.12);
      box-shadow: 0 8px 32px rgba(10, 37, 64, 0.5), 0 0 0 8px rgba(240, 165, 0, 0.15);
      animation: none;
    }

    #petroai-trigger.open {
      transform: scale(1.08) rotate(20deg);
      animation: none;
    }

    @keyframes petroai-pulse {
      0%, 100% { box-shadow: 0 4px 24px rgba(10, 37, 64, 0.45), 0 0 0 0 rgba(240, 165, 0, 0.4); }
      50%       { box-shadow: 0 4px 24px rgba(10, 37, 64, 0.45), 0 0 0 10px rgba(240, 165, 0, 0); }
    }

    /* Robot icon SVG inside the button */
    #petroai-trigger svg {
      width: 30px;
      height: 30px;
      transition: transform 0.3s ease;
    }

    /* Unread badge */
    #petroai-badge {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 18px;
      height: 18px;
      background: #f0a500;
      border-radius: 50%;
      border: 2px solid white;
      font-size: 10px;
      font-weight: 700;
      color: #0a2540;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    #petroai-badge.show {
      opacity: 1;
      transform: scale(1);
    }

    /* === Chat Window === */
    #petroai-window {
      position: fixed;
      bottom: 100px;
      right: 28px;
      z-index: 9999;
      width: 380px;
      height: 560px;
      max-height: calc(100vh - 120px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow:
        0 24px 80px rgba(10, 37, 64, 0.35),
        0 8px 24px rgba(10, 37, 64, 0.2),
        0 0 0 1px rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      background: #f8fafc;

      /* Animation states */
      transform-origin: bottom right;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.25s ease;
    }

    #petroai-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* === Window Header === */
    #petroai-header {
      background: linear-gradient(135deg, #0a2540 0%, #1a4a7a 100%);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      position: relative;
    }

    .petroai-avatar-ring {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(240, 165, 0, 0.15);
      border: 2px solid rgba(240, 165, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
      position: relative;
    }

    .petroai-status-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid #0a2540;
      animation: petroai-blink 2s ease-in-out infinite;
    }

    @keyframes petroai-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .petroai-header-info { flex: 1; }

    .petroai-header-info h3 {
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .petroai-header-info p {
      color: rgba(255,255,255,0.6);
      font-size: 0.72rem;
      margin-top: 1px;
    }

    #petroai-close {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.8);
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
      flex-shrink: 0;
    }

    #petroai-close:hover {
      background: rgba(255,255,255,0.22);
      color: white;
    }

    /* === Suggested Chips === */
    #petroai-chips {
      padding: 10px 14px 6px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }

    .petroai-chip {
      padding: 4px 10px;
      border-radius: 100px;
      border: 1.5px solid #e2e8f0;
      background: white;
      font-size: 0.72rem;
      color: #1a4a7a;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
      font-weight: 500;
    }

    .petroai-chip:hover {
      background: #0a2540;
      border-color: #0a2540;
      color: white;
    }

    /* === Messages Area === */
    #petroai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
    }

    #petroai-messages::-webkit-scrollbar { width: 4px; }
    #petroai-messages::-webkit-scrollbar-track { background: transparent; }
    #petroai-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

    .petroai-msg {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      animation: petroai-msgIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;
    }

    @keyframes petroai-msgIn {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .petroai-msg.user { flex-direction: row-reverse; }

    .petroai-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .petroai-msg.bot .petroai-msg-avatar {
      background: linear-gradient(135deg, #f0a500, #e85d04);
    }

    .petroai-msg.user .petroai-msg-avatar {
      background: linear-gradient(135deg, #1a4a7a, #0a2540);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
    }

    .petroai-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.83rem;
      line-height: 1.55;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .petroai-msg.bot .petroai-bubble {
      background: white;
      color: #1e293b;
      border-radius: 4px 16px 16px 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .petroai-msg.user .petroai-bubble {
      background: linear-gradient(135deg, #0a2540, #1a4a7a);
      color: white;
      border-radius: 16px 4px 16px 16px;
    }

    .petroai-bubble strong { font-weight: 700; }
    .petroai-bubble br { display: block; margin-bottom: 3px; }

    /* Typing indicator */
    .petroai-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 4px 2px;
    }

    .petroai-typing span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #94a3b8;
      animation: petroai-bounce 1.2s ease-in-out infinite;
    }

    .petroai-typing span:nth-child(2) { animation-delay: 0.18s; }
    .petroai-typing span:nth-child(3) { animation-delay: 0.36s; }

    @keyframes petroai-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30%            { transform: translateY(-6px); opacity: 1; }
    }

    /* === Input Area === */
    #petroai-input-area {
      padding: 12px 14px;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }

    #petroai-input {
      flex: 1;
      padding: 9px 13px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.85rem;
      outline: none;
      resize: none;
      max-height: 80px;
      min-height: 38px;
      line-height: 1.4;
      color: #1e293b;
      background: #f8fafc;
      transition: border-color 0.2s;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    #petroai-input:focus {
      border-color: #1a4a7a;
      background: white;
      box-shadow: 0 0 0 3px rgba(26, 74, 122, 0.1);
    }

    #petroai-input::placeholder { color: #94a3b8; }

    #petroai-send {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0a2540, #1a4a7a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    }

    #petroai-send:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba(10, 37, 64, 0.4);
    }

    #petroai-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    #petroai-send svg {
      width: 16px;
      height: 16px;
      fill: white;
    }

    /* === Footer === */
    #petroai-footer {
      background: white;
      text-align: center;
      padding: 5px;
      font-size: 0.65rem;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
    }

    #petroai-footer a {
      color: #f0a500;
      text-decoration: none;
      font-weight: 600;
    }

    /* === Mobile responsive === */
    @media (max-width: 480px) {
      #petroai-window {
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
        transform-origin: bottom center;
      }

      #petroai-trigger {
        bottom: 20px;
        right: 20px;
      }
    }
  `;
  document.head.appendChild(style);

  // ─── Build HTML ────────────────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.id = 'petroai-widget';
  widget.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="petroai-trigger" aria-label="Open PetroAI Assistant" title="Chat with PetroAI">
      <div id="petroai-badge">1</div>
      <!-- Robot SVG icon -->
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Antenna -->
        <rect x="30" y="4" width="4" height="10" rx="2" fill="#f0a500"/>
        <circle cx="32" cy="4" r="4" fill="#f0a500"/>
        <!-- Head -->
        <rect x="12" y="14" width="40" height="28" rx="8" fill="#e2e8f0"/>
        <rect x="14" y="16" width="36" height="24" rx="6" fill="white"/>
        <!-- Eyes -->
        <rect x="18" y="22" width="10" height="8" rx="4" fill="#1a4a7a"/>
        <rect x="36" y="22" width="10" height="8" rx="4" fill="#1a4a7a"/>
        <!-- Eye shine -->
        <circle cx="21" cy="24" r="2" fill="#f0a500"/>
        <circle cx="39" cy="24" r="2" fill="#f0a500"/>
        <!-- Mouth / speaker grille -->
        <rect x="22" y="33" width="20" height="3" rx="1.5" fill="#e2e8f0"/>
        <!-- Body -->
        <rect x="18" y="44" width="28" height="14" rx="5" fill="#1a4a7a"/>
        <!-- Body buttons -->
        <circle cx="27" cy="51" r="2.5" fill="#f0a500"/>
        <circle cx="37" cy="51" r="2.5" fill="rgba(255,255,255,0.3)"/>
        <!-- Arms -->
        <rect x="6" y="46" width="11" height="6" rx="3" fill="#1a4a7a"/>
        <rect x="47" y="46" width="11" height="6" rx="3" fill="#1a4a7a"/>
        <!-- Ears (side panels) -->
        <rect x="10" y="20" width="3" height="10" rx="1.5" fill="#94a3b8"/>
        <rect x="51" y="20" width="3" height="10" rx="1.5" fill="#94a3b8"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div id="petroai-window" role="dialog" aria-label="PetroAI Chat">
      <!-- Header -->
      <div id="petroai-header">
        <div class="petroai-avatar-ring">
          🤖
          <div class="petroai-status-dot"></div>
        </div>
        <div class="petroai-header-info">
          <h3>PetroAI Assistant</h3>
          <p id="petroai-status">● Online — Ask me anything</p>
        </div>
        <button id="petroai-close" aria-label="Close">✕</button>
      </div>

      <!-- Quick Chips -->
      <div id="petroai-chips">
        <button class="petroai-chip" data-q="What is porosity?">Porosity</button>
        <button class="petroai-chip" data-q="Explain Darcy's Law">Darcy's Law</button>
        <button class="petroai-chip" data-q="Drilling safety basics">Drilling Safety</button>
        <button class="petroai-chip" data-q="What is API gravity?">API Gravity</button>
        <button class="petroai-chip" data-q="Explain mud weight">Mud Weight</button>
      </div>

      <!-- Messages -->
      <div id="petroai-messages">
        <!-- Greeting injected by JS -->
      </div>

      <!-- Input -->
      <div id="petroai-input-area">
        <textarea
          id="petroai-input"
          placeholder="Ask a petroleum engineering question..."
          rows="1"
          aria-label="Message PetroAI"
        ></textarea>
        <button id="petroai-send" aria-label="Send">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <!-- Footer -->
      <div id="petroai-footer">
        Powered by <a href="/ai-assistant">PetroGuide Pro</a> &nbsp;·&nbsp; NextGen Petro-Tech
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // ─── PetroAI Knowledge Base ────────────────────────────────────────────────
  const KNOWLEDGE = {
    greetings: ['hello','hi','hey','good morning','good afternoon','yo','sup'],
    topics: {
      porosity: `**Porosity (φ)** is the fraction of rock volume made up of pore space.\n\nφ = Pore Volume ÷ Bulk Volume\n\nTypical values:\n• Sandstone: 15–35%\n• Carbonates: 5–15%\n• Shale: up to 50% (but mostly non-permeable)\n\nMeasured by: core analysis, neutron log, density log, or sonic log.`,
      permeability: `**Permeability (k)** measures how easily fluid flows through rock (unit: Darcy or mD).\n\nTypes:\n• Absolute — single fluid\n• Effective — multiple fluids present\n• Relative — k_eff / k_absolute\n\nRanges:\n• Conventional reservoir: 1–1000 mD\n• Tight gas: 0.001–1 mD\n• Shale: < 0.001 mD`,
      darcy: `**Darcy's Law** governs fluid flow through porous media:\n\nQ = -(kA/μ) × (ΔP/L)\n\nWhere:\n• Q = flow rate (cm³/s)\n• k = permeability (Darcy)\n• A = cross-section area (cm²)\n• μ = viscosity (cP)\n• ΔP/L = pressure gradient (atm/cm)\n\n1 Darcy ≈ 9.87 × 10⁻¹³ m²`,
      drilling: `**Rotary Drilling Basics:**\n\nKey components: drill bit → drill collars → drill pipe → surface equipment\n\nKey parameters:\n• WOB — Weight on Bit\n• RPM — Rotations per Minute\n• ROP — Rate of Penetration\n• ECD — Equivalent Circulating Density\n\nDrilling fluid (mud) carries cuttings up the annulus and controls formation pressure.`,
      safety: `**HSE in Petroleum Operations:**\n\n• Conduct a Job Hazard Analysis (JHA) before every task\n• H₂S is toxic — detector alarm at 10 ppm, IDLH at 100 ppm\n• Always wear PPE appropriate to the zone\n• STOP WORK AUTHORITY — anyone can halt unsafe operations\n• Emergency Shutdown Systems (ESD) must be tested regularly\n• Know your muster point and evacuation route`,
      h2s: `**H₂S (Hydrogen Sulfide) Safety:**\n\nH₂S is colourless, flammable, and extremely toxic.\n\n• Threshold: detectable at 0.5 ppm (rotten egg smell)\n• Action level: 10 ppm — don PPE\n• IDLH (Immediately Dangerous): 100 ppm\n• Fatal exposure: >700 ppm\n\nAlways carry a personal H₂S detector in sour gas areas. Use SCBA above 10 ppm.`,
      reservoir: `**Reservoir Engineering** studies fluid behaviour in porous rock formations.\n\nKey concepts:\n• Material Balance Equation — tracks pressure vs. production\n• Drive mechanisms: water drive, gas cap, solution gas, gravity\n• Recovery factor: % of OOIP that can be produced\n• Skin factor (S) — indicates wellbore damage (+ damaged, – stimulated)`,
      production: `**Production Engineering** optimises well output.\n\nArtificial Lift Methods:\n• ESP (Electric Submersible Pump)\n• Gas Lift\n• Rod Pump (Sucker Rod)\n• PCP (Progressive Cavity Pump)\n\nNodal Analysis identifies bottlenecks between reservoir and surface. Production logging diagnoses well performance.`,
      mudweight: `**Mud Weight / ECD:**\n\nMud weight is expressed in ppg (lb/gal) or g/cc.\n\n• Freshwater: 8.33 ppg\n• Normal drilling: 9–16 ppg\n• Max practical: ~20 ppg\n\nHydrostatic Pressure (psi) = 0.052 × MW (ppg) × Depth (ft)\n\nToo light → formation fluids enter the well (kick)\nToo heavy → mud lost to formation (lost circulation)`,
      api: `**API Gravity** classifies crude oil density:\n\nAPI = (141.5 / SG) − 131.5\n(SG measured at 60°F vs water)\n\nClassification:\n• >31.1° API — Light crude (most valuable)\n• 22.3–31.1° — Medium crude\n• 10–22.3° — Heavy crude\n• <10° — Extra heavy / bitumen\n\nHigher API = lighter oil = higher market value.`,
      viscosity: `**Viscosity** is a fluid's resistance to flow.\n\nUnits:\n• Dynamic viscosity: cP (centipoise)\n• Kinematic viscosity: cSt (centistoke)\n\nCrude oil viscosity range:\n• Light crude: <5 cP\n• Medium: 5–100 cP\n• Heavy: 100–10,000 cP\n• Bitumen: >10,000 cP\n\nViscosity decreases as temperature increases — critical for pipeline transport.`,
      fracking: `**Hydraulic Fracturing (Fracking):**\n\nHigh-pressure fluid is pumped into the well to fracture tight rock and boost flow.\n\nFluid composition:\n• ~90% water\n• ~9% sand (proppant — keeps fractures open)\n• ~1% chemical additives\n\nMicroseismic monitoring maps fracture geometry. Used extensively in tight oil/gas and shale plays.`,
      environment: `**Environmental Management:**\n\n• Spill response: contain with boom/absorbents, notify authorities\n• Produced water: must be treated before disposal\n• Flaring: minimise — use Vapour Recovery Units (VRU)\n• Follow EPA Ghana and GGPE regulations\n• Conduct Environmental Impact Assessments (EIA) for new projects\n• Zero-routine-flaring policy by 2030 (World Bank)`,
    }
  };

  function getResponse(msg) {
    const m = msg.toLowerCase().trim();

    // Greetings
    if (KNOWLEDGE.greetings.some(g => m === g || m.startsWith(g + ' ') || m.endsWith(' ' + g))) {
      return `Hello! 👋 I'm **PetroAI**, your petroleum engineering assistant.\n\nAsk me about:\n• Drilling & well control\n• Reservoir engineering\n• Production & artificial lift\n• Safety & HSE\n• Environmental compliance\n• Formulas & calculations\n\nWhat would you like to know?`;
    }

    // Keyword matching
    const kw = {
      porosity:     ['porosity','pore','void','φ'],
      permeability: ['permeability','darcy','perm','millidarcy','mD'],
      darcy:        ["darcy's law","darcy law","flow rate","q =","fluid flow"],
      drilling:     ['drilling','drill','bit','wob','rpm','rop','drill string','mud system'],
      safety:       ['safety','hse','ppe','jha','hazard','emergency','stop work'],
      h2s:          ['h2s','hydrogen sulfide','sour gas','h₂s','toxic gas'],
      reservoir:    ['reservoir','material balance','drive mechanism','recovery','skin factor'],
      production:   ['production','esp','gas lift','rod pump','nodal','artificial lift'],
      mudweight:    ['mud weight','mudweight','ecd','hydrostatic','kick','lost circulation'],
      api:          ['api gravity','api°','crude classification','light crude','heavy crude'],
      viscosity:    ['viscosity','cp','centipoise','fluid resistance','pour point'],
      fracking:     ['fracking','fracturing','hydraulic frac','frac fluid','proppant','shale'],
      environment:  ['environment','spill','produced water','flaring','eia','emission','epa'],
    };

    for (const [topic, words] of Object.entries(kw)) {
      if (words.some(w => m.includes(w))) {
        return KNOWLEDGE.topics[topic];
      }
    }

    // Calculation helpers
    if (m.includes('calculate') || m.includes('formula') || m.includes('equation')) {
      return `I can help with petroleum engineering formulas! Try asking about:\n\n• **Darcy's Law** — flow through porous media\n• **Hydrostatic pressure** — P = 0.052 × MW × Depth\n• **API Gravity** — API = 141.5/SG − 131.5\n• **Porosity** — φ = Vp / Vb\n• **Skin factor** — from pressure build-up test\n\nWhich calculation would you like help with?`;
    }

    // Fallback
    return `I'm here to help with petroleum engineering! You can ask me about:\n\n• Porosity & permeability\n• Darcy's Law & fluid flow\n• Drilling operations & mud engineering\n• Safety (HSE, H₂S)\n• Reservoir & production engineering\n• API gravity & fluid properties\n• Environmental compliance\n\nTry a specific question like *"What is mud weight?"* or *"Explain Darcy's law."*`;
  }

  // ─── DOM References ────────────────────────────────────────────────────────
  const trigger  = document.getElementById('petroai-trigger');
  const chatWin  = document.getElementById('petroai-window');
  const closeBtn = document.getElementById('petroai-close');
  const messages = document.getElementById('petroai-messages');
  const input    = document.getElementById('petroai-input');
  const sendBtn  = document.getElementById('petroai-send');
  const badge    = document.getElementById('petroai-badge');
  const status   = document.getElementById('petroai-status');
  const chips    = document.querySelectorAll('.petroai-chip');

  let isOpen = false;
  let hasGreeted = false;

  // ─── Render a message ──────────────────────────────────────────────────────
  function addMessage(role, text, isTyping = false) {
    const wrap = document.createElement('div');
    wrap.className = `petroai-msg ${role}`;

    const av = document.createElement('div');
    av.className = 'petroai-msg-avatar';
    av.textContent = role === 'bot' ? '🤖' : getUserInitial();

    const bubble = document.createElement('div');
    bubble.className = 'petroai-bubble';

    if (isTyping) {
      bubble.innerHTML = `<div class="petroai-typing"><span></span><span></span><span></span></div>`;
      wrap.id = 'petroai-typing-msg';
    } else {
      bubble.innerHTML = formatText(text);
    }

    wrap.appendChild(av);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
    return wrap;
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function getUserInitial() {
    try {
      const name = (window.__petroaiUser || 'U');
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    } catch { return 'U'; }
  }

  function removeTyping() {
    const t = document.getElementById('petroai-typing-msg');
    if (t) t.remove();
  }

  // ─── Greeting on first open ────────────────────────────────────────────────
  function showGreeting() {
    if (hasGreeted) return;
    hasGreeted = true;
    setTimeout(() => {
      addMessage('bot', `Hello! I'm **PetroAI** ⛽\nAsk me any petroleum engineering question — drilling, reservoir, safety, production, or formulas.\n\nOr tap a quick topic above to get started!`);
    }, 300);
  }

  // ─── Send message flow ─────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Hide chips after first message
    document.getElementById('petroai-chips').style.display = 'none';

    input.value = '';
    input.style.height = 'auto';
    addMessage('user', text);

    sendBtn.disabled = true;
    status.textContent = '● Thinking...';
    addMessage('bot', '', true); // typing

    try {
      // Try real API first
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      removeTyping();
      addMessage('bot', data.success ? data.response : getResponse(text));
    } catch {
      // Fallback to local knowledge base if server unavailable
      await new Promise(r => setTimeout(r, 700));
      removeTyping();
      addMessage('bot', getResponse(text));
    }

    status.textContent = '● Online — Ask me anything';
    sendBtn.disabled = false;
    input.focus();
  }

  // ─── Toggle open/close ─────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    chatWin.classList.add('open');
    trigger.classList.add('open');
    badge.classList.remove('show');
    showGreeting();
    setTimeout(() => input.focus(), 350);
  }

  function closeChat() {
    isOpen = false;
    chatWin.classList.remove('open');
    trigger.classList.remove('open');
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  // ─── Tip: show badge after 4 seconds to draw attention ────────────────────
  setTimeout(() => {
    if (!isOpen) badge.classList.add('show');
  }, 4000);

  // ─── Auto-resize textarea ──────────────────────────────────────────────────
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  // ─── Event Listeners ───────────────────────────────────────────────────────
  trigger.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.q;
      sendMessage();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // Optionally expose user name from session for avatar initials
  fetch('/api/me').then(r => r.json()).then(d => {
    if (d.user) window.__petroaiUser = d.user.fullName;
  }).catch(() => {});

})();
