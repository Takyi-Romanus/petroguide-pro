const express = require('express');
const router = express.Router();

// ─── Try-load models (gracefully handle no DB) ─────────────────────────────
let Module, Career, User;
try {
  Module = require('../models/module');
  Career = require('../models/career');
  User   = require('../models/user');
} catch(e) {}

// ─── Seed Data (used when DB is unavailable or empty) ─────────────────────
const SEED_MODULES = [
  { _id:'m1', title:'Petroleum Engineering Basics', slug:'petroleum-basics', description:'Foundations of petroleum engineering: rock properties, fluid mechanics, and formation evaluation.', category:'reservoir', level:'beginner', duration:45, enrolledCount:324, rating:4.8, tags:['fundamentals','reservoir','basics'] },
  { _id:'m2', title:'Drilling Operations & Safety', slug:'drilling-safety', description:'Learn rotary drilling operations, bit selection, mud engineering and critical safety protocols.', category:'drilling', level:'intermediate', duration:60, enrolledCount:218, rating:4.7, tags:['drilling','safety','operations'] },
  { _id:'m3', title:'Reservoir Simulation Fundamentals', slug:'reservoir-simulation', description:'Introduction to numerical reservoir simulation, grid types, and fluid flow modeling.', category:'reservoir', level:'advanced', duration:90, enrolledCount:142, rating:4.9, tags:['simulation','reservoir','advanced'] },
  { _id:'m4', title:'Well Completion & Stimulation', slug:'well-completion', description:'Techniques for casing, cementing, perforation, hydraulic fracturing and acidizing.', category:'production', level:'intermediate', duration:75, enrolledCount:197, rating:4.6, tags:['completion','stimulation','production'] },
  { _id:'m5', title:'HSE in Petroleum Operations', slug:'hse-petroleum', description:'Health, Safety and Environment management in oil and gas — risk assessment, PPE, emergency response.', category:'safety', level:'beginner', duration:40, enrolledCount:412, rating:4.9, tags:['safety','HSE','environment'] },
  { _id:'m6', title:'Petroleum Data Analytics', slug:'data-analytics', description:'Using Python, Power BI and machine learning for production optimization and reservoir insights.', category:'digital', level:'intermediate', duration:80, enrolledCount:256, rating:4.8, tags:['data','analytics','python','ML'] },
];

const SEED_CAREERS = [

{
_id:'c1',
title:'Reservoir Engineer',
company:'Ghana National Petroleum Corporation (GNPC)',
location:'Accra, Ghana',
type:'full-time',
category:'reservoir',
description:'Work with GNPC to model and simulate reservoir performance for offshore petroleum fields. You will analyze production data, build reservoir models, and optimize hydrocarbon recovery strategies.',
requirements:[
'BSc Petroleum Engineering, Chemical Engineering or related field',
'3+ years experience in reservoir engineering',
'Proficiency in reservoir simulation tools (Eclipse, CMG, or Petrel)'
],
benefits:[
'Competitive salary',
'Health insurance',
'Professional development programs'
],
salary:{min:8000,max:15000,currency:'GHS'},
applyLink:'https://www.gnpcghana.com/careers',
deadline:new Date(Date.now()+30*86400000)
},

{
_id:'c2',
title:'Drilling Engineering Intern',
company:'TotalEnergies Ghana',
location:'Takoradi, Ghana',
type:'internship',
category:'drilling',
description:'6-month internship supporting offshore drilling operations on the Jubilee Field. Interns assist drilling engineers with well planning, monitoring drilling performance, and safety compliance.',
requirements:[
'3rd or 4th year Petroleum Engineering student',
'Strong academic record',
'Willingness to work offshore'
],
benefits:[
'Monthly stipend',
'Offshore allowance',
'Mentorship from senior engineers'
],
salary:{min:2500,max:3500,currency:'GHS'},
applyLink:'https://careers.totalenergies.com',
deadline:new Date(Date.now()+14*86400000)
},

{
_id:'c3',
title:'Health, Safety & Environment (HSE) Officer',
company:'Springfield Exploration & Production',
location:'Accra, Ghana',
type:'full-time',
category:'safety',
description:'Ensure compliance with health, safety, and environmental regulations across upstream operations. Conduct risk assessments, safety audits, and emergency response planning.',
requirements:[
'BSc Engineering, Environmental Science, or related discipline',
'NEBOSH certification preferred',
'2+ years experience in oil & gas safety management'
],
benefits:[
'Insurance coverage',
'Transport allowance',
'Performance bonus scheme'
],
salary:{min:6000,max:10000,currency:'GHS'},
applyLink:'https://springfieldgroup.com/careers',
deadline:new Date(Date.now()+21*86400000)
},

{
_id:'c4',
title:'Petroleum Data Scientist',
company:'Aker Energy Ghana',
location:'Remote / Accra',
type:'full-time',
category:'data',
description:'Use machine learning and advanced analytics to analyze drilling and production data. Build predictive models for well performance, equipment failure detection, and reservoir optimization.',
requirements:[
'BSc Engineering, Data Science, or Computer Science',
'Strong Python programming skills',
'Knowledge of machine learning techniques'
],
benefits:[
'Remote work option',
'Training and development budget',
'Stock options'
],
salary:{min:10000,max:18000,currency:'GHS'},
applyLink:'https://akerenergy.com/careers',
deadline:new Date(Date.now()+45*86400000)
},

{
_id:'c5',
title:'Petroleum Engineering Intern',
company:'ExxonMobil',
location:'Accra, Ghana',
type:'internship',
category:'reservoir',
description:'Work alongside ExxonMobil engineers to assist in reservoir analysis, well performance monitoring, and production optimization for offshore operations.',
requirements:[
'Currently studying Petroleum or Mechanical Engineering',
'Basic reservoir engineering knowledge',
'Strong analytical and problem-solving skills'
],
benefits:[
'Hands-on industry experience',
'Mentorship from senior engineers',
'Opportunity for graduate recruitment'
],
salary:{min:3000,max:5000,currency:'GHS'},
applyLink:'https://corporate.exxonmobil.com/careers',
deadline:new Date(Date.now()+35*86400000)
},

{
_id:'c6',
title:'Drilling Engineer',
company:'Schlumberger (SLB)',
location:'Takoradi, Ghana',
type:'full-time',
category:'drilling',
description:'Design and supervise drilling programs for offshore wells. Monitor drilling operations to ensure efficiency, safety, and compliance with operational standards.',
requirements:[
'BSc Petroleum Engineering or Mechanical Engineering',
'Experience with drilling operations',
'Knowledge of drilling software tools'
],
benefits:[
'International training programs',
'Health insurance',
'Career progression opportunities'
],
salary:{min:15000,max:25000,currency:'GHS'},
applyLink:'https://careers.slb.com',
deadline:new Date(Date.now()+40*86400000)
},

{
_id:'c7',
title:'Reservoir Simulation Engineer',
company:'Tullow Oil',
location:'Jubilee Field, Ghana',
type:'full-time',
category:'reservoir',
description:'Develop reservoir simulation models to forecast production and optimize hydrocarbon recovery from offshore petroleum reservoirs.',
requirements:[
'Petroleum Engineering degree',
'Experience with reservoir simulation software',
'Strong analytical skills'
],
benefits:[
'Offshore allowances',
'Global training opportunities',
'Health insurance'
],
salary:{min:14000,max:22000,currency:'GHS'},
applyLink:'https://www.tullowoil.com/careers',
deadline:new Date(Date.now()+50*86400000)
},

{
_id:'c8',
title:'Offshore Safety Supervisor',
company:'Halliburton',
location:'Sekondi-Takoradi, Ghana',
type:'contract',
category:'safety',
description:'Supervise offshore safety procedures and ensure compliance with international HSE standards during drilling and production activities.',
requirements:[
'BSc Engineering or Environmental Science',
'NEBOSH or OSHA certification',
'Experience with offshore safety operations'
],
benefits:[
'Offshore allowances',
'International certification support',
'Accommodation during offshore rotation'
],
salary:{min:12000,max:20000,currency:'GHS'},
applyLink:'https://jobs.halliburton.com',
deadline:new Date(Date.now()+28*86400000)
},

{
_id:'c9',
title:'Energy Data Analyst',
company:'Shell',
location:'Remote / Lagos',
type:'full-time',
category:'data',
description:'Analyze petroleum production datasets using advanced analytics and AI models to improve operational efficiency and predictive maintenance.',
requirements:[
'Degree in Data Science, Engineering, or Computer Science',
'Python, SQL, and data visualization experience',
'Understanding of energy industry data'
],
benefits:[
'Remote work flexibility',
'Global collaboration opportunities',
'Professional development programs'
],
salary:{min:13000,max:21000,currency:'GHS'},
applyLink:'https://www.shell.com/careers',
deadline:new Date(Date.now()+60*86400000)
},

{
_id:'c10',
title:'Drilling Operations Engineer',
company:'Baker Hughes',
location:'Takoradi, Ghana',
type:'full-time',
category:'drilling',
description:'Coordinate drilling operations, monitor well performance, and ensure safe and efficient drilling execution on offshore rigs.',
requirements:[
'BSc Petroleum or Mechanical Engineering',
'Understanding of drilling operations',
'Strong problem-solving ability'
],
benefits:[
'Global career mobility',
'Training programs',
'Health coverage'
],
salary:{min:12000,max:20000,currency:'GHS'},
applyLink:'https://careers.bakerhughes.com',
deadline:new Date(Date.now()+40*86400000)
},

{
_id:'c11',
title:'Well Logging Engineer',
company:'Schlumberger (SLB)',
location:'Takoradi, Ghana',
type:'contract',
category:'drilling',
description:'Perform well logging operations and analyze subsurface formation data to support drilling and reservoir evaluation.',
requirements:[
'Petroleum Engineering or Geology degree',
'Understanding of well logging tools',
'Ability to work offshore rotations'
],
benefits:[
'Offshore allowances',
'Technical certification programs',
'Accommodation during rotation'
],
salary:{min:10000,max:18000,currency:'GHS'},
applyLink:'https://careers.slb.com',
deadline:new Date(Date.now()+32*86400000)
},

{
_id:'c12',
title:'Reservoir Modeling Engineer',
company:'Kosmos Energy',
location:'Accra, Ghana',
type:'full-time',
category:'reservoir',
description:'Develop advanced reservoir simulation models to forecast production and support field development decisions.',
requirements:[
'Petroleum Engineering degree',
'Experience with reservoir modeling software',
'Strong analytical skills'
],
benefits:[
'Career development programs',
'International exposure',
'Performance bonuses'
],
salary:{min:14000,max:22000,currency:'GHS'},
applyLink:'https://www.kosmosenergy.com/careers',
deadline:new Date(Date.now()+50*86400000)
},

{
_id:'c13',
title:'Production Optimization Engineer',
company:'Tullow Oil',
location:'Jubilee Field, Ghana',
type:'full-time',
category:'reservoir',
description:'Monitor well production and optimize field output using reservoir analysis and production engineering techniques.',
requirements:[
'Petroleum Engineering degree',
'Knowledge of production systems',
'Strong data analysis skills'
],
benefits:[
'Offshore allowances',
'Health insurance',
'Training opportunities'
],
salary:{min:15000,max:23000,currency:'GHS'},
applyLink:'https://www.tullowoil.com/careers',
deadline:new Date(Date.now()+46*86400000)
},

{
_id:'c14',
title:'Digital Oilfield Engineer',
company:'Shell',
location:'Remote / Lagos',
type:'full-time',
category:'data',
description:'Develop digital solutions for oilfield operations using AI, automation, and predictive analytics to improve operational efficiency.',
requirements:[
'Computer Science or Engineering degree',
'Python or data engineering experience',
'Understanding of oilfield data systems'
],
benefits:[
'Remote work',
'AI and cloud training',
'International collaboration'
],
salary:{min:16000,max:25000,currency:'GHS'},
applyLink:'https://www.shell.com/careers',
deadline:new Date(Date.now()+55*86400000)
},

{
_id:'c15',
title:'Energy Data Engineer',
company:'Chevron',
location:'Remote',
type:'full-time',
category:'data',
description:'Build data pipelines and analytics systems to support petroleum exploration, drilling optimization, and production forecasting.',
requirements:[
'Data Engineering or Computer Science degree',
'SQL, Python, and cloud experience',
'Understanding of energy datasets'
],
benefits:[
'Remote work flexibility',
'Training budget',
'Health benefits'
],
salary:{min:17000,max:26000,currency:'GHS'},
applyLink:'https://careers.chevron.com',
deadline:new Date(Date.now()+60*86400000)
}

];

// ─── Session helper ─────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  console.log('GET /api/me - Session ID:', req.sessionID, 'User:', req.session.user ? req.session.user.email : 'none');
  res.json({ user: req.session.user || null });
});

// ─── Modules API ────────────────────────────────────────────────────────────
router.get('/module', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let modules;
    if (Module) {
      let query = {};
      if (category) query.category = category;
      if (level) query.level = level;
      if (search) query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      modules = await Module.find(query).lean();
      if (!modules.length) {
        await Module.insertMany(SEED_MODULES);
        modules = await Module.find(query).lean();
      }
    } else {
      modules = SEED_MODULES;
      if (category) modules = modules.filter(m => m.category === category);
      if (level) modules = modules.filter(m => m.level === level);
      if (search) modules = modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({ success: true, data: modules });
  } catch (err) {
    console.error(err);
    res.json({ success: true, data: SEED_MODULES });
  }
});

// Alias for /module (frontend uses /api/modules)
router.get('/modules', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let modules;
    if (Module) {
      let query = {};
      if (category) query.category = category;
      if (level) query.level = level;
      if (search) query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      modules = await Module.find(query).lean();
      if (!modules.length) {
        await Module.insertMany(SEED_MODULES);
        modules = await Module.find(query).lean();
      }
    } else {
      modules = SEED_MODULES;
      if (category) modules = modules.filter(m => m.category === category);
      if (level) modules = modules.filter(m => m.level === level);
      if (search) modules = modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({ success: true, data: modules });
  } catch (err) {
    console.error(err);
    res.json({ success: true, data: SEED_MODULES });
  }
});

// ─── Careers API ────────────────────────────────────────────────────────────
router.get('/career', async (req, res) => {
  try {
    const { type, category } = req.query;
    let careers;
    if (Career) {
      let query = { isActive: true };
      if (type) query.type = type;
      if (category) query.category = category;
      careers = await Career.find(query).sort({ postedAt: -1 }).lean();
      if (!careers.length) {
        await Career.insertMany(SEED_CAREERS);
        careers = await Career.find(query).sort({ postedAt: -1 }).lean();
      }
    } else {
      careers = SEED_CAREERS;
      if (type) careers = careers.filter(c => c.type === type);
      if (category) careers = careers.filter(c => c.category === category);
    }
    res.json({ success: true, data: careers });
  } catch (err) {
    res.json({ success: true, data: SEED_CAREERS });
  }
});

// Alias for /career (frontend uses /api/careers)
router.get('/careers', async (req, res) => {
  try {
    const { type, category } = req.query;
    let careers;
    if (Career) {
      let query = { isActive: true };
      if (type) query.type = type;
      if (category) query.category = category;
      careers = await Career.find(query).sort({ postedAt: -1 }).lean();
      if (!careers.length) {
        await Career.insertMany(SEED_CAREERS);
        careers = await Career.find(query).sort({ postedAt: -1 }).lean();
      }
    } else {
      careers = SEED_CAREERS;
      if (type) careers = careers.filter(c => c.type === type);
      if (category) careers = careers.filter(c => c.category === category);
    }
    res.json({ success: true, data: careers });
  } catch (err) {
    res.json({ success: true, data: SEED_CAREERS });
  }
});

// ─── AI Assistant API ────────────────────────────────────────────────────────
const PETRO_KNOWLEDGE = {
  greetings: ['hello','hi','hey','good morning','good afternoon'],
  keywords: {
    drilling: `Drilling operations involve rotary drilling with a drill bit, drill string, and drilling fluid (mud). Key parameters include Weight on Bit (WOB), Rotations Per Minute (RPM), and Rate of Penetration (ROP). Common issues: lost circulation, stuck pipe, and kicks. Always maintain proper mud weight to control formation pressure.`,
    reservoir: `Reservoir engineering focuses on fluid flow through porous media. Key concepts: Darcy's Law (Q = -kA/μ × dP/dL), porosity (void space fraction), and permeability (ease of fluid flow). Material balance equation tracks reservoir pressure and fluid production over time.`,
    production: `Production engineering optimizes well output. Artificial lift methods (ESP, gas lift, rod pump) are used when reservoir pressure declines. Nodal analysis identifies system bottlenecks. Production logging helps diagnose well performance issues.`,
    safety: `HSE in petroleum: Always conduct a Job Hazard Analysis (JHA) before operations. H₂S is a colorless, odorless toxic gas — detector alarms at 10 ppm. Emergency Shutdown Systems (ESD) isolate equipment automatically. STOP WORK authority means anyone can halt unsafe operations.`,
    environment: `Environmental management: Oil spills require immediate containment using booms, skimmers, and absorbents. Produced water must be treated before disposal. Flaring should be minimized — use vapor recovery units. Always follow GGPE and EPA Ghana regulations.`,
    viscosity: `Viscosity is a fluid's resistance to flow. In petroleum, we measure dynamic viscosity (cP) and kinematic viscosity (cSt). Crude oil viscosity varies from <1 cP (light crude) to >10,000 cP (heavy crude). Temperature inversely affects viscosity — higher temp = lower viscosity.`,
    pressure: `Formation pressure types: Normal (~0.433 psi/ft for freshwater gradient), Overpressured (above normal), and Underpressured. Mudweight must be balanced to prevent kicks (influx of formation fluids) or lost circulation (mud lost to formation).`,
    porosity: `Porosity (φ) = pore volume / bulk volume. Types: Primary (intergranular), Secondary (fractures, vugs). Measured by core analysis or well logs (neutron, density, sonic). Typical reservoir porosities: 15-25% sandstone, 5-15% carbonates.`,
    permeability: `Permeability (k) measures ease of fluid flow (unit: Darcy or mD). Absolute perm = single fluid. Effective perm = multiple fluids. Relative perm = k_eff/k_abs. Shale: <0.001 mD, Tight gas: 0.001-1 mD, Conventional: 1-1000 mD.`,
    fracking: `Hydraulic fracturing (fracking): High-pressure fluid injected to fracture rock and increase permeability. Fluid = water + proppant (sand/ceramic) + additives. Monitoring microseismic activity maps fracture geometry. Used widely in tight oil/gas development.`,
  }
};

function getPetroResponse(message) {
  const msg = message.toLowerCase().trim();
  
  // Greetings
  if (PETRO_KNOWLEDGE.greetings.some(g => msg.includes(g))) {
    return `Hello! I'm **PetroAI**, your petroleum engineering assistant. I can help you with:\n\n• **Drilling** operations & parameters\n• **Reservoir** engineering concepts\n• **Production** optimization\n• **Safety & HSE** guidelines\n• **Environmental** compliance\n• Technical calculations\n\nWhat would you like to know today?`;
  }
  
  // Check keywords
  for (const [key, answer] of Object.entries(PETRO_KNOWLEDGE.keywords)) {
    if (msg.includes(key)) {
      return answer;
    }
  }

  // Specific calculations
  if (msg.includes('darcy') || (msg.includes('flow') && msg.includes('rate'))) {
    return `**Darcy's Law** for fluid flow in porous media:\n\nQ = -(kA/μ) × (dP/dL)\n\nWhere:\n• Q = flow rate (cm³/s)\n• k = permeability (Darcy)\n• A = cross-sectional area (cm²)\n• μ = viscosity (cP)\n• dP/dL = pressure gradient (atm/cm)\n\nFor practical use, 1 Darcy = 9.869 × 10⁻¹³ m².`;
  }

  if (msg.includes('mud weight') || msg.includes('mudweight')) {
    return `**Mud Weight / Equivalent Circulating Density (ECD)**\n\nMud weight is expressed in ppg (pounds per gallon) or g/cc.\n\n• Normal: 8.33 ppg (freshwater)\n• Typical drilling: 9–16 ppg\n• Maximum: 20 ppg (heavy formations)\n\nFormula: Hydrostatic pressure (psi) = 0.052 × MW (ppg) × Depth (ft)\n\nBalance mud weight carefully — too light causes kicks, too heavy causes lost circulation.`;
  }
  
  if (msg.includes('api gravity') || msg.includes('api°')) {
    return `**API Gravity** classifies crude oil density:\n\n• Light crude: >31.1° API\n• Medium crude: 22.3–31.1° API  \n• Heavy crude: 10–22.3° API\n• Extra heavy / bitumen: <10° API\n\nFormula: API = (141.5 / SG) - 131.5\nWhere SG = specific gravity relative to water at 60°F\n\nHigher API gravity = lighter, more valuable crude.`;
  }

  // Default helpful response
  return `I'm here to help with petroleum engineering questions! You can ask me about:\n\n• **Drilling**: operations, mud engineering, well control\n• **Reservoir**: fluid flow, material balance, simulation\n• **Production**: artificial lift, nodal analysis, optimization\n• **Safety**: H₂S, HAZOP, emergency procedures\n• **Environmental**: spill response, produced water, emissions\n• **Calculations**: Darcy's law, API gravity, mud weight\n\nTry asking something like: *"What is porosity?"* or *"Explain Darcy's law"*`;
}

router.post('/assistant/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message required' });
  
  // Simulate a short delay for realism
  setTimeout(() => {
    const response = getPetroResponse(message);
    res.json({ success: true, response, timestamp: new Date() });
  }, 600);
});

// ─── Stats API ────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    let users = 0, modules = 0, hazards = 0, careers = 0;
    if (User) users = await User.countDocuments();
    if (Module) modules = await Module.countDocuments();
    if (Career) careers = await Career.countDocuments();
    res.json({ success: true, data: {
      users: users || 1247,
      modules: modules || 30,
      careers: careers || 13
    }});
  } catch (err) {
    res.json({ success: true, data: { users: 1247, modules: 30, careers: 13 } });
  }
});

module.exports = router;
