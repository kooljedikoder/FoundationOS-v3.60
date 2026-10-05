/* ---------- Module registry (drives modules grid + gating) ---------- */
const MODULES = [
 {page:'reg',tier:'flex',icon:'user-plus',name:'Registration & Onboarding',desc:'Collect, validate and approve every new supplier.'},
 {page:'passport',tier:'flex',icon:'badge-check',name:'Vendor Passport 360',desc:'Permanent digital identity for every approved vendor.'},
 {page:'docs',tier:'flex',icon:'folder',name:'Document Management',desc:'Capture, verify, renew and archive vendor documents.'},
 {page:'assessment',tier:'flex',icon:'clipboard-check',name:'Supplier Assessment',desc:'Multi-discipline due diligence scoring before approval.'},
 {page:'hse',tier:'flex',icon:'shield-check',name:'HSE Induction & Certification',desc:'Safety induction, training and certification tracking.'},
 {page:'audit',tier:'core',icon:'scale',name:'Audit, Compliance & Governance',desc:'Enterprise oversight, findings and corrective actions.'},
 {page:'erm',tier:'core',icon:'alert-triangle',name:'Enterprise Risk Management',desc:'Live risk intelligence across every module.'},
 {page:'procurement',tier:'flex',icon:'shopping-cart',name:'Procurement Workspace',desc:'RFQs, quotations, POs and delivery tracking.'},
 {page:'clm',tier:'core',icon:'file-text',name:'Contract Lifecycle Mgmt',desc:'Draft, negotiate, execute, renew, monitor obligations.'},
 {page:'plusprocure',tier:'plus',icon:'rocket',name:'PLUS Procurement Hub',desc:'Full standalone enterprise Source-to-Pay platform.'},
 {page:'finance',tier:'flex',icon:'banknote',name:'Finance, Invoicing & Payments',desc:'Invoice verification, approvals and payment tracking.'},
 {page:'perf',tier:'flex',icon:'gauge',name:'Performance & SLA',desc:'Continuous KPI, SLA and scorecard monitoring.'},
 {page:'comms',tier:'flex',icon:'message-square',name:'Communication & Collaboration',desc:'Central hub for every vendor-linked conversation.'},
 {page:'selfservice',tier:'flex',icon:'users',name:'Vendor Self-Service Portal',desc:'Supplier-facing gateway into VendorOS.'},
 {page:'workflow',tier:'flex',icon:'workflow',name:'Workflow Automation',desc:'Visual designer for every business process.'},
 {page:'integration',tier:'core',icon:'plug',name:'Integration Hub & API',desc:'ERP, banking, tax and BI connections.'},
 {page:'ai',tier:'platform',icon:'bot',name:'AI Copilot',desc:'OCR, predictive risk scoring, generative reporting.'},
 {page:'builder',tier:'platform',icon:'layout-template',name:'Dynamic Form Builder',desc:'Drag-and-drop workspaces, no developer required.'},
 {page:'admin',tier:'flex',icon:'settings',name:'System Configuration',desc:'Users, roles, business units, branding, security.'},
 {page:'editions',tier:'flex',icon:'layers',name:'Editions & Licensing',desc:'Compare FLEX, CORE and PLUS side by side.'},
];
const TIER_RANK = {platform:0,flex:1,core:2,plus:3};
const TIER_NAMES = {platform:'PLATFORM',flex:'FLEX',core:'CORE',plus:'PLUS'};
let currentEdition = 'core';
let pendingEditionForUpgrade = null;

function buildModuleGrid(){
  const grid = document.getElementById('moduleGrid');
  grid.innerHTML = MODULES.map(m=>{
    const locked = TIER_RANK[m.tier] > TIER_RANK[currentEdition];
    return `<div class="mod-card ${locked?'locked':''}" data-tier="${m.tier}" onclick="${locked?`showUpgradePrompt('${m.tier}','${m.name}')`:`showPage('${m.page}')`}">
      ${locked ? `<div class="lock-badge"><i data-lucide="lock"></i>${TIER_NAMES[m.tier]}</div>` : `<div class="tier-chip ${m.tier}">${TIER_NAMES[m.tier]}</div>`}
      <div class="mod-icon"><i data-lucide="${m.icon}"></i></div>
      <h4>${m.name}</h4><p>${m.desc}</p>
    </div>`;
  }).join('');
  paintIcons(grid);
}

