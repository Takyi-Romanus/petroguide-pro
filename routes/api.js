const express = require('express');
const router = express.Router();

// ─── Try-load models (gracefully handle no DB) ─────────────────────────────
let Module, Hazard, Career, User;
try {
  Module = require('../models/module');
  Hazard = require('../models/hazard');
  Career = require('../models/career');
  User   = require('../models/user');
} catch(e) {}

// ─── Seed Data (used when DB is unavailable or empty) ─────────────────────
const SEED_MODULES = [
  {
    _id:'m1',
    title:'1. Introduction to the Petroleum Industry',
    slug:'intro-petroleum-industry',
    description:'Learn what petroleum is, explore its rich history, understand its global economic impact, and discover the complete petroleum value chain from upstream to downstream operations.',
    category:'upstream',
    level:'beginner',
    duration:90,
    enrolledCount:587,
    rating:4.9,
    tags:['fundamentals','industry','overview'],
    overview:'This foundational module introduces you to the petroleum industry\'s essential concepts and structure. You\'ll understand what petroleum is, how it formed, its historical development, economic significance, and the complete supply chain.',
    keyTopics:[
      { topic:'What is Petroleum?', description:'Understanding crude oil composition, natural gas, condensate, and petroleum products. Learn about hydrocarbon types, formation processes, and classification systems.' },
      { topic:'History of the Petroleum Industry', description:'From the first commercial oil well in 1859 to modern offshore operations. Understand key milestones, technological advances, and global expansion.' },
      { topic:'Importance of Petroleum in the Global Economy', description:'Petroleum\'s role in energy production, transportation, chemicals, and manufacturing. Explore economic impact, geopolitical implications, and market dynamics.' },
      { topic:'Petroleum Value Chain', description:'The complete journey from extraction to consumer—learn about Upstream, Midstream, and Downstream operations and their interconnectedness.' },
      { topic:'Upstream Operations', description:'Exploration, drilling, production, and reservoir management. Understand how we find and extract petroleum.' },
      { topic:'Midstream Operations', description:'Transportation via pipelines, tankers, and railcars. Storage facilities and trading hubs that connect producers to refiners.' },
      { topic:'Downstream Operations', description:'Refining crude oil into products, marketing, and distribution to consumers.' }
    ],
    resources:[
      { title:'BP Energy Review 2024', url:'https://www.bp.com/en/global/corporate/energy-economics/energy-outlook.html', type:'Report' },
      { title:'OPEC Petroleum Industry Overview', url:'https://www.opec.org/opec_web/en/about_us/169.htm', type:'Guide' },
      { title:'World Bank Oil & Gas Data', url:'https://www.worldbank.org/en/topic/extractiveindustries/brief/oil-and-gas', type:'Data' },
      { title:'CourseEra: Petroleum Engineering Essentials', url:'https://www.coursera.org/learn/petroleum-engineering', type:'Course' },
      { title:'SPE (Society of Petroleum Engineers) Introduction', url:'https://www.spe.org/en/learn/', type:'Learning' },
      { title:'TED Talk: The Future of Oil & Gas', url:'https://www.ted.com', type:'Video' }
    ]
  },
  {
    _id:'m2',
    title:'2. Petroleum Exploration & Drilling',
    slug:'exploration-drilling',
    description:'Master the techniques for locating petroleum reserves and executing drilling operations, including geological surveys, seismic exploration, rig types, drilling processes, and well completion methods.',
    category:'drilling',
    level:'intermediate',
    duration:120,
    enrolledCount:412,
    rating:4.8,
    tags:['drilling','exploration','operations'],
    overview:'Discover how petroleum professionals locate oil and gas deposits and drill wells to access them. This module covers exploration techniques, drilling operations, and well completion strategies.',
    keyTopics:[
      { topic:'Geological Surveys', description:'Understanding subsurface geology, sedimentary basins, structural and stratigraphic traps. Learn how geologists map potential petroleum systems.' },
      { topic:'Seismic Exploration', description:'2D and 3D seismic data acquisition and interpretation. Understanding seismic reflection principles to map subsurface features and identify drilling prospects.' },
      { topic:'Types of Drilling Rigs', description:'Onshore rigs, offshore floating rigs (jackups, semisubs, drillships). Learn about rig capabilities, limitations, and operational environments.' },
      { topic:'Drilling Process', description:'Well planning, wellbore design, casing design, mud engineering, circulation systems, pressure management, and drilling hazards.' },
      { topic:'Well Completion Methods', description:'Open hole completion, cased hole completion, perforating, gravel packing, and artificial lift installation.' }
    ],
    resources:[
      { title:'Schlumberger: Exploration & Production Guide', url:'https://www.slb.com/resource-library', type:'Technical' },
      { topic:'SPE Drilling Engineering Handbook', url:'https://www.spe.org/publications/', type:'Handbook' },
      { title:'IHS Markit Exploration Database', url:'https://www.ihsmarkit.com/products/exploration-production.html', type:'Database' },
      { title:'Udemy: Drilling Operations Course', url:'https://www.udemy.com/course/drilling/', type:'Course' },
      { title:'YouTube: Seismic Interpretation Fundamentals', url:'https://www.youtube.com/results?search_query=seismic+interpretation', type:'Video' },
      { title:'IADC (International Association of Drilling Contractors)', url:'https://www.iadc.org/', type:'Organization' }
    ]
  },
  {
    _id:'m3',
    title:'3. Reservoir Engineering',
    slug:'reservoir-engineering',
    description:'Understand reservoir characteristics including rock properties, porosity, permeability, petroleum traps, fluid flow dynamics, and comprehensive reservoir management strategies.',
    category:'reservoir',
    level:'intermediate',
    duration:105,
    enrolledCount:356,
    rating:4.7,
    tags:['reservoir','engineering','fundamentals'],
    overview:'Reservoir engineers are key to petroleum development. Learn how reservoirs store and produce oil and gas, and how professionals manage them for optimal recovery.',
    keyTopics:[
      { topic:'Reservoir Rocks', description:'Sandstones, carbonates, and shales as petroleum reservoirs. Understanding mineral composition, cementation, and depositional environments.' },
      { topic:'Porosity and Permeability', description:'What makes rocks capable of storing and producing hydrocarbons. Types of porosity (primary and secondary), permeability variations, and measurement methods.' },
      { topic:'Oil and Gas Traps', description:'Structural traps (anticlines, faults), stratigraphic traps (pinch-outs, unconformities). Understanding seal formations and trap geometry.' },
      { topic:'Fluid Flow in Reservoirs', description:'Darcy\'s law, multiphase flow, relative permeability, capillary pressure. How oil and gas move through rock formations.' },
      { topic:'Reservoir Management', description:'Primary, secondary, and tertiary recovery mechanisms. Production optimization, pressure maintenance, and enhanced oil recovery (EOR) techniques.' }
    ],
    resources:[
      { title:'Ahmed\'s Petroleum Reservoir Engineering Textbook', url:'https://www.elsevier.com/books/petroleum-reservoir-engineering/ahmed/978-0-08-102224-1', type:'Textbook' },
      { title:'SPE Reservoir Engineering Resource Center', url:'https://www.spe.org/en/learn/', type:'Learning' },
      { title:'Core Laboratories Formation Evaluation', url:'https://www.corelab.com/services/formation-evaluation', type:'Technical' },
      { title:'Udacity: Reservoir Simulation Course', url:'https://www.udacity.com/course/reservoir-engineering', type:'Course' },
      { title:'Open University of Netherlands: Subsurface Geology', url:'https://www.ou.nl/', type:'Course' },
      { title:'Petrowiki - Reservoir Basics', url:'https://petrowiki.org', type:'Wiki' }
    ]
  },
  {
    _id:'m4',
    title:'4. Production Engineering',
    slug:'production-engineering',
    description:'Learn oil and gas production methods, artificial lift systems, surface facilities design, fluid separation processes, and production optimization techniques.',
    category:'production',
    level:'intermediate',
    duration:110,
    enrolledCount:334,
    rating:4.8,
    tags:['production','engineering','operations'],
    overview:'Production engineers maximize the rate and recovery of petroleum from wells. This module covers the methods, equipment, and strategies used in modern production operations.',
    keyTopics:[
      { topic:'Oil and Gas Production Methods', description:'Primary production (natural energy), secondary recovery (water/gas injection), and tertiary recovery (EOR). Understanding production decline and recovery factors.' },
      { topic:'Artificial Lift Systems', description:'Sucker rod pumping, electric submersible pumps (ESP), gas lift, and jet pumps. Selecting appropriate lift methods for different well conditions.' },
      { topic:'Surface Production Facilities', description:'Wellhead equipment, manifolds, separators, desalters, compressors, and storage tanks. Processing produced fluids at surface.' },
      { topic:'Separation of Oil, Gas, and Water', description:'Two-stage and three-stage separation. Understanding emulsion breaking, water treatment, and gas recovery technology.' },
      { topic:'Production Optimization', description:'Nodal analysis, debottlenecking, managing pressure drop, and production surveillance. Techniques to maximize production efficiently.' }
    ],
    resources:[
      { title:'Tarek Ahmed - Modern Production Operations', url:'https://www.elsevier.com/books/modern-production-operations/ahmed/978-0-08-102224-1', type:'Textbook' },
      { title:'Halliburton Production Engineering Guides', url:'https://www.halliburton.com/en/careers/college-recruiting', type:'Technical' },
      { title:'Baker Hughes Equipment Specifications', url:'https://www.bakerhughes.com/exploration-production', type:'Technical' },
      { title:'LinkedIn Learning: Production Operations', url:'https://www.linkedin.com/learning', type:'Course' },
      { title:'OnePetro: Production Engineering Papers', url:'https://www.onepetro.org/', type:'Database' },
      { title:'YouTube: ESP Pump Operations', url:'https://www.youtube.com/results?search_query=ESP+pump+petroleum', type:'Video' }
    ]
  },
  {
    _id:'m5',
    title:'5. Petroleum Processing & Refining',
    slug:'petroleum-refining',
    description:'Explore crude oil refining processes, fractional distillation, petroleum product generation, and petrochemicals production.',
    category:'downstream',
    level:'intermediate',
    duration:100,
    enrolledCount:298,
    rating:4.6,
    tags:['refining','downstream','processing'],
    overview:'Refining transforms crude oil into useful products. Learn the chemistry and engineering behind fuel production, lubrication oils, and chemical feedstocks.',
    keyTopics:[
      { topic:'Crude Oil Refining', description:'Assaying crude oil for sulfur content, API gravity, and component analysis. Understanding crude types and their processing requirements.' },
      { topic:'Fractional Distillation', description:'Separation of crude oil by boiling points. Vacuum distillation, cracking processes (thermal and catalytic), and reforming.' },
      { topic:'Petroleum Products', description:'Gasoline (petrol), diesel, kerosene, fuel oil, LPG, and jet fuel specifications. Understanding octane rating, cetane number, and flash point.' },
      { topic:'Petrochemicals', description:'Production of ethylene, propylene, and aromatics. Derivative chemicals used in plastics, fertilizers, and synthetic materials.' },
      { topic:'Refining Economics & Efficiency', description:'Hydrotreating, hydrocracking, and coking processes. Nelson complexity index and refining margins.' }
    ],
    resources:[
      { title:'Petroleum Refining: Technology and Economics by James Speight', url:'https://www.elsevier.com/books/petroleum-refining-technology-and-economics/speight/978-0-12-415145-6', type:'Textbook' },
      { title:'RANSI: Refining Tutorials', url:'https://www.ransi.com/resources/', type:'Tutorial' },
      { title:'American Fuel & Petrochemical Manufacturers', url:'https://www.afpm.org/', type:'Association' },
      { title:'Coursera: Oil Refining Process', url:'https://www.coursera.org', type:'Course' },
      { title:'YouTube: Crude Oil Distillation Animation', url:'https://www.youtube.com/results?search_query=crude+oil+distillation', type:'Video' },
      { title:'Energy Institute: Petroleum Processing', url:'https://www.energyinst.org/', type:'Learning' }
    ]
  },
  {
    _id:'m6',
    title:'6. Health, Safety & Environment (HSE)',
    slug:'hse-petroleum',
    description:'Master workplace safety, personal protective equipment, hazard identification, emergency response procedures, and oil spill management in petroleum operations.',
    category:'safety',
    level:'beginner',
    duration:85,
    enrolledCount:673,
    rating:4.9,
    tags:['safety','HSE','compliance'],
    overview:'Safety is paramount in petroleum operations. Learn to identify hazards, protect yourself and others, and respond to emergencies effectively.',
    keyTopics:[
      { topic:'Workplace Safety Practices', description:'Risk assessment, job safety analysis (JSA), LOTO (Lockout/Tagout), confined space procedures, and hot work permits.' },
      { topic:'Personal Protective Equipment (PPE)', description:'Hard hats, safety glasses, gloves, steel-toed boots, hearing protection, and respiratory equipment. When to use each type and maintenance.' },
      { topic:'Hazard Identification', description:'Chemical hazards (hydrogen sulfide, benzene), physical hazards (pressure, temperature, noise), biological hazards, and ergonomic risks.' },
      { topic:'Emergency Response', description:'Fire response, medical evacuation, evacuation procedures, and incident command systems. First aid and emergency communication.' },
      { topic:'Oil Spill Management', description:'Spill prevention, containment, cleanup, and remediation. Environmental compliance and regulatory requirements (EPA, OSPAR, MARPOL).' }
    ],
    resources:[
      { title:'OSHA Petroleum Industry Safety Guidelines', url:'https://www.osha.gov/oils-gases', type:'Regulatory' },
      { title:'NEBOSH IGC Course Content', url:'https://www.nebosh.org.uk/qualifications/igc/', type:'Certification' },
      { title:'International Maritime Organization (IMO)', url:'https://www.imo.org/', type:'Regulatory' },
      { title:'Global Industry Analysts: HSE Practice Guide', url:'https://www.strategyr.com/', type:'Guide' },
      { title:'YouTube: HSE in Oil & Gas Operations', url:'https://www.youtube.com/results?search_query=HSE+oil+gas', type:'Video' },
      { title:'SafeStart: Safety Awareness Training', url:'https://www.safestart.com/', type:'Course' }
    ]
  },
  {
    _id:'m7',
    title:'7. Environmental Engineering in Petroleum',
    slug:'environmental-engineering',
    description:'Address pollution control, waste management, environmental assessment, climate change impacts, and sustainable petroleum operations.',
    category:'environment',
    level:'intermediate',
    duration:95,
    enrolledCount:267,
    rating:4.7,
    tags:['environment','sustainability','engineering'],
    overview:'Environmental responsibility is critical to modern petroleum operations. Learn to minimize environmental impact and operate sustainably.',
    keyTopics:[
      { topic:'Pollution Control', description:'Air quality management, VOC emissions reduction, water treatment, and soil remediation. Flaring minimization and methane recovery.' },
      { topic:'Waste Management', description:'Hazardous waste classification, disposal methods, recycling programs, and waste minimization strategies in E&P operations.' },
      { topic:'Environmental Impact Assessment', description:'EIA procedures, baseline studies, impact prediction, and mitigation measures. Stakeholder engagement and public consultation.' },
      { topic:'Climate Change Effects', description:'Oil industry carbon footprint, greenhouse gas emissions, net-zero commitments, and climate-related energy transition.' },
      { topic:'Sustainable Petroleum Operations', description:'Green completions, flaring reduction, renewable energy integration, circular economy principles, and ESG compliance.' }
    ],
    resources:[
      { title:'IPIECA Environmental Standards', url:'https://www.ipieca.org/environment/', type:'Standards' },
      { title:'EPA Oil & Gas Environmental Compliance', url:'https://www.epa.gov/oil-gas-operations', type:'Regulatory' },
      { title:'World Bank: Environmental & Social Safeguards', url:'https://www.worldbank.org/en/topic/safeguards', type:'Framework' },
      { title:'Udemy: Environmental Engineering Fundamentals', url:'https://www.udemy.com/course/environmental-engineering/', type:'Course' },
      { title:'Nature: Climate Science & Energy Transition', url:'https://www.nature.com/', type:'Journal' },
      { title:'UN Environmental Programme: Oil & Gas Report', url:'https://www.unep.org/', type:'Report' }
    ]
  },
  {
    _id:'m8',
    title:'8. Petroleum Equipment & Technology',
    slug:'petroleum-technology',
    description:'Explore drilling equipment, pumps, compressors, pipelines, digital oilfield systems, automation, and AI applications in petroleum.',
    category:'digital',
    level:'advanced',
    duration:125,
    enrolledCount:289,
    rating:4.8,
    tags:['technology','equipment','digital'],
    overview:'Modern petroleum operations rely on advanced equipment and digital technology. Learn about the tools and systems that drive efficiency and safety.',
    keyTopics:[
      { topic:'Drilling Equipment', description:'Drill strings, drill bits, BHA (bottom hole assembly), mud pumps, and drawworks. Understanding equipment specifications and capabilities.' },
      { topic:'Pumps and Compressors', description:'Centrifugal and positive displacement pumps. Gas and air compressors. Reciprocating, screw, and centrifugal compressor types.' },
      { topic:'Pipelines', description:'Pipeline design, materials, corrosion protection, inspection methods (pigging), and maintenance. Subsea pipeline systems.' },
      { topic:'Digital Oilfield Technology', description:'Real-time monitoring systems, SCADA, data acquisition, cloud platforms, and integration of sensors and telemetry.' },
      { topic:'Automation & AI in Petroleum', description:'Automated drilling systems, predictive maintenance using machine learning, production optimization algorithms, and autonomous systems.' }
    ],
    resources:[
      { title:'API (American Petroleum Institute) Standards', url:'https://www.api.org/standards', type:'Standards' },
      { title:'Weatherford Equipment Catalog', url:'https://www.weatherford.com/', type:'Technical' },
      { title:'Siemens Energy: Digital Solutions in Oil & Gas', url:'https://new.siemens.com/global/en/company/sustainability/environmental-protection/energy-efficiency/digital-solutions.html', type:'Technology' },
      { title:'Coursera: Industry 4.0 and Digital Oilfield', url:'https://www.coursera.org', type:'Course' },
      { title:'LinkedIn Learning: Artificial Intelligence for Industry', url:'https://www.linkedin.com/learning', type:'Course' },
      { title:'MIT: Digital Transformation in Energy', url:'https://energy.mit.edu/', type:'Research' }
    ]
  },
  {
    _id:'m9',
    title:'9. Energy Transition & Sustainability',
    slug:'energy-transition',
    description:'Understand the future of energy, clean energy concepts, carbon reduction strategies, SDGs alignment, and sustainable petroleum practices.',
    category:'environment',
    level:'advanced',
    duration:110,
    enrolledCount:301,
    rating:4.9,
    tags:['sustainability','energy','future'],
    overview:'The petroleum industry is transforming. Learn about renewable energy, carbon neutrality, and how petroleum can play a role in a sustainable future.',
    keyTopics:[
      { topic:'Future of Energy', description:'Energy demand projections, renewable energy growth, electrification, hydrogen economy, and hybrid energy systems.' },
      { topic:'Clean Energy Concepts', description:'Solar, wind, geothermal, and hydroelectric power. Energy storage solutions and grid modernization.' },
      { topic:'Carbon Reduction', description:'Carbon capture and storage (CCS), carbon pricing mechanisms, and carbon footprint reduction strategies.' },
      { topic:'Agenda 2030 & SDGs', description:'UN Sustainable Development Goals (SDG 7: Affordable Energy, SDG 12: Responsible Consumption, SDG 13: Climate Action).' },
      { topic:'Sustainable Petroleum Practices', description:'Renewable fuel integration, biofuels, synthetic fuels, and responsible energy sourcing.' }
    ],
    resources:[
      { title:'IEA: World Energy Outlook 2024', url:'https://www.iea.org/reports/world-energy-outlook-2024', type:'Report' },
      { title:'UN Sustainable Development Goals', url:'https://sdgs.un.org/', type:'Framework' },
      { title:'Climate Change 2023: Synthesis Report (IPCC)', url:'https://www.ipcc.ch/', type:'Report' },
      { title:'edX: Renewable Energy Engineering', url:'https://www.edx.org/learn/renewable-energy', type:'Course' },
      { title:'TED-Ed: Energy & Climate', url:'https://www.youtube.com/teded', type:'Video' },
      { title:'World Economic Forum: Energy Transition', url:'https://www.weforum.org/focus/energy-transition', type:'Research' }
    ]
  },
  {
    _id:'m10',
    title:'10. Career Pathways in Petroleum',
    slug:'career-pathways',
    description:'Explore petroleum engineering roles, required skills, internship guidance, industry certifications, and career advancement opportunities.',
    category:'career',
    level:'beginner',
    duration:75,
    enrolledCount:534,
    rating:4.8,
    tags:['career','professional','development'],
    overview:'Plan your career in petroleum. Learn about different roles, qualifications needed, and how to advance in the industry.',
    keyTopics:[
      { topic:'Petroleum Engineering Roles', description:'Reservoir engineer, drilling engineer, production engineer, completion engineer, HSE manager, project manager, and data scientist positions.' },
      { topic:'Required Skills', description:'Technical skills: engineering principles, software (ECLIPSE, ANSYS, Python). Soft skills: communication, teamwork, leadership, problem-solving.' },
      { topic:'Internship Guidance', description:'Finding opportunities, interview preparation, what employers look for, making the most of your internship experience.' },
      { topic:'Industry Certifications', description:'SPE certifications, NEBOSH, IWCF (Well Control), PMP (Project Management), and vendor certifications (Schlumberger, Weatherford, Baker Hughes).' },
      { topic:'Career Opportunities', description:'Entry-level positions, mid-career advancement, international opportunities, entrepreneurship, and research/academic paths.' }
    ],
    resources:[
      { title:'SPE: Career Development & Resources', url:'https://www.spe.org/en/careers/', type:'Career' },
      { title:'LinkedIn: Petroleum Jobs & Networking', url:'https://www.linkedin.com/jobs/oil-gas-petroleum-jobs/', type:'JobBoard' },
      { title:'Petroleum Club Recruitment', url:'https://www.petroleumclub.com/', type:'Network' },
      { title:'IMEC: Regional Job Board', url:'https://www.imecghana.org/', type:'JobBoard' },
      { title:'Coursera: Professional Development Certificates', url:'https://www.coursera.org/professional-certificates', type:'Certification' },
      { title:'edX: Career Certificates in Data Science & Engineering', url:'https://www.edx.org/professional-certificate', type:'Certification' }
    ]
  }
];

const SEED_HAZARDS = [
  { _id:'h1', title:'Gas Leak at Wellhead Valve', description:'Detected methane leak from the master valve packing gland on Well-14. Smell and sensor alarm triggered.', location:'Well Pad A, Block 7', severity:'high', category:'gas_leak', status:'investigating', reportedByName:'Kofi Mensah', createdAt: new Date(Date.now()-3600000) },
  { _id:'h2', title:'Minor Oil Spill — Storage Area', description:'Approximately 20 litres of crude spilled near Tank T-03. Contained with absorbent boom.', location:'Tank Farm, Zone 2', severity:'medium', category:'spill', status:'resolved', reportedByName:'Ama Osei', createdAt: new Date(Date.now()-86400000) },
  { _id:'h3', title:'Faulty Pressure Gauge on Separator', description:'Pressure gauge reading erratic — possible sensor failure on the production separator.', location:'Processing Plant, Unit 5', severity:'low', category:'equipment_failure', status:'reported', reportedByName:'Anonymous', createdAt: new Date(Date.now()-7200000) },
];

const SEED_CAREERS = [
  { _id:'c1', title:'Reservoir Engineer', company:'Ghana National Petroleum Corporation', location:'Accra, Ghana', type:'full-time', category:'reservoir', description:'Join GNPC to model and simulate reservoir performance for offshore fields. You will analyze production data and optimize recovery strategies.', requirements:['BSc Petroleum/Chemical Engineering','3+ years reservoir simulation experience','Proficiency in Eclipse or CMG'], benefits:['Competitive salary','Health insurance','Professional development'], salary:{min:8000,max:15000,currency:'GHS'}, deadline: new Date(Date.now()+30*86400000) },
  { _id:'c2', title:'Drilling Engineering Intern', company:'TotalEnergies Ghana', location:'Takoradi, Ghana', type:'internship', category:'drilling', description:'6-month internship supporting drilling operations on the Jubilee field. Work alongside experienced drilling engineers on live projects.', requirements:['3rd/4th year Petroleum Engineering student','Strong academic record','Willingness to work offshore'], benefits:['Monthly stipend','Offshore allowance','Mentorship program'], salary:{min:2500,max:3500,currency:'GHS'}, deadline: new Date(Date.now()+14*86400000) },
  { _id:'c3', title:'HSE Officer', company:'Springfield Exploration & Production', location:'Accra, Ghana', type:'full-time', category:'safety', description:'Enforce health, safety and environmental standards across upstream operations. Conduct risk assessments and safety audits.', requirements:['BSc Engineering or Science','NEBOSH certification preferred','2+ years oil & gas HSE experience'], benefits:['Insurance','Transport allowance','Bonus scheme'], salary:{min:6000,max:10000,currency:'GHS'}, deadline: new Date(Date.now()+21*86400000) },
  { _id:'c4', title:'Petroleum Data Scientist', company:'Aker Energy Ghana', location:'Remote / Accra', type:'full-time', category:'data', description:'Apply machine learning and advanced analytics to production data. Build predictive models for well performance and failure detection.', requirements:['BSc Engineering/Computer Science','Python & ML experience','Knowledge of petroleum operations'], benefits:['Remote work option','Training budget','Stock options'], salary:{min:10000,max:18000,currency:'GHS'}, deadline: new Date(Date.now()+45*86400000) },
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

// ─── Hazards API ────────────────────────────────────────────────────────────
router.get('/hazard', async (req, res) => {
  try {
    let hazards;
    if (Hazard) {
      hazards = await Hazard.find().sort({ createdAt: -1 }).lean();
      if (!hazards.length) {
        await Hazard.insertMany(SEED_HAZARDS);
        hazards = await Hazard.find().sort({ createdAt: -1 }).lean();
      }
    } else {
      hazards = SEED_HAZARDS;
    }
    res.json({ success: true, data: hazards });
  } catch (err) {
    res.json({ success: true, data: SEED_HAZARDS });
  }
});

// Alias for /hazard (frontend uses /api/hazards)
router.get('/hazards', async (req, res) => {
  try {
    let hazards;
    if (Hazard) {
      hazards = await Hazard.find().sort({ createdAt: -1 }).lean();
      if (!hazards.length) {
        await Hazard.insertMany(SEED_HAZARDS);
        hazards = await Hazard.find().sort({ createdAt: -1 }).lean();
      }
    } else {
      hazards = SEED_HAZARDS;
    }
    res.json({ success: true, data: hazards });
  } catch (err) {
    res.json({ success: true, data: SEED_HAZARDS });
  }
});

router.post('/hazard', async (req, res) => {
  try {
    const { title, description, location, severity, category, reportedByName } = req.body;
    if (Hazard) {
      const hazard = await Hazard.create({
        title, description, location, severity, category,
        reportedBy: req.session.user?._id,
        reportedByName: reportedByName || req.session.user?.fullName || 'Anonymous'
      });
      return res.json({ success: true, data: hazard });
    }
    // Fallback — just echo back
    res.json({ success: true, data: { _id: 'new-' + Date.now(), title, description, location, severity, category, status: 'reported', reportedByName: reportedByName || 'Anonymous', createdAt: new Date() } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    if (Hazard) hazards = await Hazard.countDocuments();
    if (Career) careers = await Career.countDocuments();
    res.json({ success: true, data: {
      users: users || 1247,
      modules: modules || 6,
      hazards: hazards || 3,
      careers: careers || 4
    }});
  } catch (err) {
    res.json({ success: true, data: { users: 1247, modules: 6, hazards: 3, careers: 4 } });
  }
});

module.exports = router;
