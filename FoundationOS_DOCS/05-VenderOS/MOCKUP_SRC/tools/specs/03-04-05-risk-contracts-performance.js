const L = require('../lib');
const { R, APPROVE, kpis, list, bars, cards, matrix, form, flow, timeline, kv, two, panel, badge } = L;
const G = '#16a34a', B = '#2563eb', O = '#d97706', P = '#7c3aed', T = '#0d9488', Rd = '#dc2626';

// =============== 3. RISK AND COMPLIANCE ===============
const riskPages = [{
  id: 'audit', wrap: { panel: 'audit-audits' }, tabs: [
    { label: 'Dashboard', id: 'dash', blocks: [
      kpis([['Open findings', '9', 'red'], ['Open CAPA', '6', 'orange'], ['Audits this quarter', '4', 'blue'], ['Vendor health score', '87', 'green']]),
      two(bars('Compliance by area', [['Documents valid', 94, 'success'], ['Insurance valid', 89, 'success'], ['Certifications valid', 82, 'warning'], ['HSE induction current', 76, 'warning']], { icon: 'shield' }),
        list('rc_actions', 'Needs your action', [
          R('RC-31', 'Operating licence expired: Kalahari Logistics', 'Compliance review', 'Compliance', 'Overdue by 2 days', '', ['red', 'Overdue'], 'S16', 'Request renewal'),
          R('RC-30', 'Corrective action CAPA-85 is overdue', 'CAPA', 'Finance', 'Overdue by 2 days', '', ['red', 'Overdue'], 'S28', 'Escalate')
        ]))
    ] },
    { label: 'Compliance reviews', id: 'reviews', blocks: [list('comp_reviews', 'Compliance reviews', [
      R('CR-205', 'Annual compliance review: Kalahari Logistics', 'Annual review', 'Compliance', 'Due in 12 days', '', ['blue', 'In progress'], 'S26', 'Continue review'),
      R('CR-204', 'Document completeness: Phoenix Scaffolding', 'Document check', 'Compliance', 'Due in 3 days', '', ['orange', '2 documents missing'], 'S26', 'Chase vendor'),
      R('CR-199', 'Annual compliance review: Sable IT Networks', 'Annual review', 'Compliance', 'Done', '', ['green', 'Passed'], 'S26', '')
    ])] },
    { label: 'Risk assessments', id: 'riskasm', blocks: [panel('Risk assessments', 'alert-triangle', '<p style="font-size:13px">Risk assessments live in the Enterprise Risk register, with likelihood, impact and mitigation per vendor.</p><button class="btn btn-primary btn-sm" onclick="showPage(\'erm\')">Open the risk register</button>')] },
    { label: 'Site inspections', id: 'inspect', blocks: [
      list('inspections', 'Site inspections', [
        R('SI-71', 'Delta Civils and Plant Hire: plant yard, Port Harcourt', 'Site inspection', 'HSE Team', 'Planned 14 Oct', '', ['blue', 'Planned'], 'S28', 'Open checklist'),
        R('SI-70', 'Kalahari Logistics: depot, Ikeja', 'Site inspection', 'HSE Team', '3 weeks ago', '', ['green', 'Passed, 2 minor notes'], 'S28', ''),
        R('SI-68', 'Phoenix Scaffolding: site B', 'Site inspection', 'HSE Team', '5 weeks ago', '', ['orange', '1 finding'], 'S28', 'View finding')
      ]),
      form('Inspection checklist', [['Vendor', 'select', ['Delta Civils and Plant Hire', 'Kalahari Logistics', 'Phoenix Scaffolding']], ['Site', 'text', 'Address or site name'], ['PPE worn on site', 'check', 'Yes'], ['Permits on display', 'check', 'Yes'], ['Findings', 'textarea', 'Describe anything not compliant', true]], [['Save inspection', 'btn-primary']], { icon: 'clipboard-check' })
    ] },
    { label: 'Audits', id: 'wrap' },
    { label: 'CAPA', id: 'capa', blocks: [kpis([['Open', '6', 'orange'], ['Overdue', '1', 'red'], ['Closed this month', '9', 'green'], ['Average days to close', '17', 'blue']]), `<div class="table-wrap" data-vf="capa"></div>`] },
    { label: 'ESG', id: 'esg', blocks: [
      matrix('ESG review by vendor', ['Environment', 'Social', 'Governance', 'Overall'], [['Kalahari Logistics', [78, 84, 90, 84]], ['Sable IT Networks', [82, 88, 86, 85]], ['Delta Civils and Plant Hire', [55, 62, 70, 62]]], { sub: 'ESG review is a CORE-edition assessment type.' }),
      list('esg_items', 'ESG actions', [R('ESG-12', 'Delta Civils: provide an environmental management plan', 'ESG action', 'Compliance', 'Due in 20 days', '', ['orange', 'Requested'], 'S29', 'Send reminder')])
    ] },
    { label: 'Vendor scoring', id: 'scoring', blocks: [
      bars('Assessment scores', [['Kalahari Logistics', 88, 'success'], ['Sable IT Networks', 85, 'success'], ['Northgate Office Supplies', 76, ''], ['Phoenix Scaffolding', 68, 'warning'], ['Delta Civils and Plant Hire', 58, 'danger']], { sub: 'Scores come from the eight assessment reviews (Procurement, Technical, Finance, Legal, Compliance, HSE, ESG, Information Security).' }),
      panel('Full assessment', 'clipboard-check', '<button class="btn btn-primary btn-sm" onclick="showPage(\'assessment\')">Open Supplier Assessment</button>')
    ] },
    { label: 'Health score', id: 'health', blocks: [
      kpis([['Average health', '87', 'green'], ['Vendors below 70', '5', 'red'], ['Improving', '14', 'blue'], ['Declining', '4', 'orange']]),
      bars('Health score parts', [['Documents', 94, 'success'], ['Performance', 86, 'success'], ['Compliance findings', 78, ''], ['HSE', 76, 'warning'], ['Financial standing', 90, 'success']], { sub: 'Health score is a weighted mix. The weights are set in Administration.' }),
      list('health_watch', 'Vendors below 70', [R('HS-5', 'Delta Civils and Plant Hire: health 58', 'Health score', 'Audit', 'Falling', '', ['red', 'High risk'], 'S30', 'Add mitigation'), R('HS-4', 'Phoenix Scaffolding: health 68', 'Health score', 'Audit', 'Stable', '', ['orange', 'Watch'], 'S30', '')])
    ] },
    { label: 'Renewals', id: 'renewals', blocks: [list('rc_renewals', 'Renewals due', [
      R('RN-41', 'Goods in transit insurance: Kalahari Logistics', 'Insurance renewal', 'Compliance', 'In 40 days', '', ['orange', 'Due soon'], 'S16', 'Send reminder'),
      R('RN-40', 'ISO 45001 certificate: Kalahari Logistics', 'Certificate renewal', 'Compliance', 'In 40 days', '', ['orange', 'Due soon'], 'S16', 'Send reminder'),
      R('RN-38', 'Tax clearance: Phoenix Scaffolding', 'Tax renewal', 'Finance', 'Expired', '', ['red', 'Expired'], 'S14', 'Request new certificate')
    ])] },
    { label: 'Expiring documents', id: 'expiring', blocks: [panel('Expiring documents', 'file-text', '<div class="table-wrap" data-vf="expiring"></div>', 'The same expiring-documents list as Document Management.')] },
    { label: 'Reports', id: 'reports', blocks: [cards('Compliance and risk reports', [['Compliance report', '', 'Documents, insurance, certifications', 'green', 'Reports and BI'], ['Risk report', '', 'Register, mitigations, trend', 'red', 'Reports and BI']]), form('Run a report', [['Report', 'select', ['Compliance', 'Risk']], ['Period', 'select', ['Last 30 days', 'This quarter', 'This year']]], [['Open in Reports and BI', 'btn-primary', "showPage('reports')"]], { icon: 'bar-chart-2' })] }
  ]
}, {
  id: 'erm', wrap: { panel: 'erm-register' }, tabs: [
    { label: 'Register', id: 'wrap' },
    { label: 'Mitigations', id: 'mitig', blocks: [list('mitigations', 'Mitigation actions', [
      R('MIT-31', 'Delta Civils: working at heights retraining', 'Mitigation', 'HSE Team', 'Due in 9 days', '', ['orange', 'In progress'], 'S27', 'Mark complete'),
      R('MIT-29', 'Sable IT Networks: penetration test', 'Mitigation', 'IT Security', 'Due in 30 days', '', ['blue', 'Planned'], 'S30', ''),
      R('MIT-25', 'Kalahari Logistics: second signatory for payments', 'Mitigation', 'Finance', 'Done', '', ['green', 'Done'], 'S30', '')
    ])] },
    { label: 'History', id: 'hist', blocks: [timeline('Risk changes', [['This week', 'RSK-410 Delta Civils raised to High', 'Audit', 'alert-triangle'], ['2 weeks ago', 'RSK-402 Sable IT Networks kept at Medium', 'IT Security', 'check'], ['Last month', 'RSK-377 Kalahari Logistics lowered to Low', 'Finance', 'check']])] }
  ]
}];

// =============== 4. CONTRACTS AND COMMERCIAL ===============
const contractPages = [{
  id: 'clm', wrap: { panel: 'clm-register' }, tabs: [
    { label: 'Dashboard', id: 'dash', blocks: [kpis([['Active contracts', '64', 'purple'], ['Expiring (30 days)', '12', 'orange'], ['Obligations due', '9', 'red'], ['Annual value', '₦1.9bn', 'green']]), two(bars('Value by category', [['Transport', 38, ''], ['IT services', 29, 'success'], ['Civils', 18, 'warning'], ['Other', 15, '']]), list('ct_actions', 'Needs your action', [R('CTR-2287', 'Kalahari Logistics framework renews in 2 months', 'Renewal', 'Procurement', 'Decision due', '₦48m / yr', ['orange', 'Renewal due'], 'S41', 'Start renewal')]))] },
    { label: 'Contracts', id: 'wrap' },
    { label: 'Templates', id: 'templates', blocks: [cards('Contract templates', [['Framework agreement', '', 'Annual framework with schedule of rates', 'blue', 'v4'], ['Service agreement', '', 'Fixed scope, SLA and KPIs', 'green', 'v3'], ['Supply agreement', '', 'Goods, delivery terms and returns', 'purple', 'v2'], ['Non-disclosure agreement', '', 'One-way and mutual', 'grey', 'v5']], { sub: 'Templates keep their clauses in the clause library. A change creates a new version.' }), form('New template', [['Name', 'text', 'For example: Equipment hire agreement'], ['Based on', 'select', ['Blank', 'Framework agreement', 'Service agreement']]], [['Create template', 'btn-primary']], { icon: 'file-text' })] },
    { label: 'Pricing', id: 'pricing', blocks: [list('ct_pricing', 'Agreed prices', [
      R('PR-901', 'Tyres, 315/80 R22.5', 'Price list', 'Procurement', 'Valid to Dec 2026', '₦285,000 each', ['green', 'Active'], 'S41', ''),
      R('PR-902', 'Haulage Lagos to Abuja, full load', 'Rate card', 'Procurement', 'Valid to Dec 2026', '₦1,150,000 per trip', ['green', 'Active'], 'S41', ''),
      R('PR-903', 'Managed switch, 48 port', 'Price list', 'IT Procurement', 'Expires in 20 days', '₦620,000 each', ['orange', 'Expires soon'], 'S41', 'Ask for new prices')
    ])] },
    { label: 'Terms', id: 'terms', blocks: [list('ct_terms', 'Standard terms', [
      R('TRM-01', 'Payment within 30 days of a correct invoice', 'Payment terms', 'Finance', 'Standard', '', ['green', 'Approved'], 'S41', ''),
      R('TRM-02', 'Liability cap at 100% of annual contract value', 'Liability', 'Legal', 'Standard', '', ['green', 'Approved'], 'S41', ''),
      R('TRM-03', 'Termination for convenience with 60 days notice', 'Termination', 'Legal', 'Exception needs Legal', '', ['orange', 'Needs approval'], 'S41', 'Request approval')
    ])] },
    { label: 'SLAs', id: 'slas', blocks: [kpis([['SLAs tracked', '38', 'purple'], ['Met this month', '34', 'green'], ['Breached', '3', 'red'], ['At risk', '1', 'orange']]), list('ct_slas', 'Service level agreements', [
      R('SLA-12', 'Kalahari Logistics: on-time delivery 95%', 'SLA', 'Procurement', 'This month 96%', '', ['green', 'Met'], 'S44', ''),
      R('SLA-14', 'Sable IT Networks: response within 4 hours', 'SLA', 'IT', 'This month 91%', '', ['red', 'Breached'], 'S44', 'Raise corrective action')
    ])] },
    { label: 'Renewals', id: 'renewals', blocks: [panel('Obligations and renewals', 'calendar', '<div class="table-wrap" data-vf="obligations"></div>', 'The same obligations list as the Contracts tab; renewals are obligations with a renewal date.')] },
    { label: 'Digital signatures', id: 'sign', blocks: [list('ct_sign', 'Signatures', [
      R('SIG-31', 'CTR-2312 Northgate Office Supplies', 'Signature request', 'Legal', 'Waiting for vendor', '₦6,240,000', ['blue', 'Sent to vendor'], 'S41', 'Send reminder'),
      R('SIG-30', 'CTR-2310 Delta Civils and Plant Hire', 'Signature request', 'Legal', 'Waiting for us', '₦34,000,000', ['orange', 'Awaiting our signatory'], 'S41', 'Sign now', APPROVE),
      R('SIG-27', 'CTR-2301 Sable IT Networks', 'Signature request', 'Legal', 'Done', '₦110,000,000', ['green', 'Signed by both'], 'S41', '')
    ], { sub: 'Signing limits come from the director records in Contact Control Center.' })] },
    { label: 'Spend analysis', id: 'spend', blocks: [bars('Contract spend vs commitment', [['Kalahari Logistics', 82, 'success', '₦39m of ₦48m'], ['Sable IT Networks', 64, '', '₦70m of ₦110m'], ['Delta Civils and Plant Hire', 91, 'warning', '₦31m of ₦34m'], ['Northgate Office Supplies', 40, '', '₦2.5m of ₦6.2m']]), cards('Savings', [['Negotiated savings', '₦14.2m', 'This year against list prices', 'green', '+6.1%'], ['Off-contract spend', '₦9.8m', 'Bought outside a contract', 'orange', '2.0%']])] },
    { label: 'Reports', id: 'reports', blocks: [cards('Contract reports', [['Contract report', '', 'Register, renewals, obligations', 'purple', 'Reports and BI'], ['Spend report', '', 'Spend vs commitment', 'blue', 'Reports and BI']]), form('Run a report', [['Report', 'select', ['Contract', 'Spend']], ['Period', 'select', ['Last 30 days', 'This quarter', 'This year']]], [['Open in Reports and BI', 'btn-primary', "showPage('reports')"]], { icon: 'bar-chart-2' })] }
  ]
}];

// =============== 5. PERFORMANCE ===============
const scoreRows = [['Kalahari Logistics', [92, 88, 90, 90]], ['Sable IT Networks', [85, 90, 88, 88]], ['Northgate Office Supplies', [78, 80, 82, 80]], ['Phoenix Scaffolding', [70, 65, 72, 69]], ['Delta Civils and Plant Hire', [58, 62, 55, 58]]];
const perfPages = [{
  id: 'perf', wrap: { panel: 'perf-dash' }, tabs: [
    { label: 'Dashboard', id: 'wrap' },
    { label: 'Scorecards', id: 'score', blocks: [matrix('KPI scorecards', ['Delivery', 'Quality', 'Financial', 'Overall'], scoreRows, { sub: 'Scores are the weighted KPIs set in Administration. Open a vendor for its full scorecard.' })] },
    { label: 'Ratings', id: 'ratings', blocks: [list('perf_ratings', 'Buyer ratings', [
      R('RT-310', 'Kalahari Logistics: 4.6 out of 5', 'Rating', 'Procurement', 'This quarter', '', ['green', 'Excellent'], 'S44', ''),
      R('RT-309', 'Northgate Office Supplies: 3.9 out of 5', 'Rating', 'Procurement', 'This quarter', '', ['blue', 'Good'], 'S44', ''),
      R('RT-305', 'Delta Civils and Plant Hire: 2.8 out of 5', 'Rating', 'HSE Team', 'This quarter', '', ['red', 'Poor'], 'S44', 'Start improvement plan')
    ])] },
    { label: 'Delivery', id: 'delivery', blocks: [kpis([['On-time delivery', '91%', 'green'], ['Late deliveries', '14', 'orange'], ['Average delay', '1.8 d', 'blue'], ['Short deliveries', '5', 'red']]), bars('On-time delivery by vendor', [['Kalahari Logistics', 96, 'success'], ['Sable IT Networks', 92, 'success'], ['Northgate Office Supplies', 84, ''], ['Phoenix Scaffolding', 71, 'warning']])] },
    { label: 'Quality', id: 'quality', blocks: [kpis([['First-pass acceptance', '94%', 'green'], ['Defect rate', '2.1%', 'orange'], ['Returns', '7', 'red'], ['Inspections', '58', 'blue']]), bars('Acceptance at inspection', [['Kalahari Logistics', 98, 'success'], ['Northgate Office Supplies', 93, 'success'], ['Phoenix Scaffolding', 81, 'warning'], ['Delta Civils and Plant Hire', 74, 'danger']])] },
    { label: 'Financial', id: 'financial', blocks: [kpis([['Invoice accuracy', '97%', 'green'], ['Disputed invoices', '2', 'red'], ['Early-payment discounts', '₦1.1m', 'purple'], ['Credit notes', '6', 'blue']]), bars('Invoice accuracy', [['Kalahari Logistics', 99, 'success'], ['Sable IT Networks', 98, 'success'], ['Northgate Office Supplies', 92, 'warning']])] },
    { label: 'Corrective actions', id: 'actions', blocks: [panel('Corrective actions', 'wrench', '<div class="table-wrap" data-vf="capa"></div>', 'Corrective actions are CAPA records, shared with Risk and Compliance.')] },
    { label: 'Improvement plans', id: 'plans', blocks: [list('perf_plans', 'Improvement plans', [
      R('IMP-21', 'Delta Civils and Plant Hire: safety performance plan', 'Improvement plan', 'HSE Team', 'Review in 30 days', '', ['orange', 'In progress'], 'S44', 'Review progress'),
      R('IMP-19', 'Phoenix Scaffolding: delivery reliability plan', 'Improvement plan', 'Procurement', 'Review in 14 days', '', ['blue', 'Started'], 'S44', ''),
      R('IMP-14', 'Sable IT Networks: response time plan', 'Improvement plan', 'IT', 'Closed', '', ['green', 'Target met'], 'S44', '')
    ]), form('Start an improvement plan', [['Vendor', 'select', ['Delta Civils and Plant Hire', 'Phoenix Scaffolding']], ['Goal', 'textarea', 'What should improve, and by when', true], ['Review date', 'date', '']], [['Create plan', 'btn-primary']], { icon: 'target' })] },
    { label: 'Benchmarking', id: 'bench', blocks: [bars('Overall score against category average', [['Kalahari Logistics (90) vs transport 78', 90, 'success'], ['Sable IT Networks (88) vs IT 80', 88, 'success'], ['Delta Civils and Plant Hire (58) vs civils 72', 58, 'danger']], { sub: 'Benchmarks compare a vendor with the average of its own category.' })] },
    { label: 'Trends', id: 'trends', blocks: [matrix('Overall score by month', ['Jul', 'Aug', 'Sep', 'Oct'], [['Kalahari Logistics', [86, 88, 89, 90]], ['Sable IT Networks', [84, 86, 87, 88]], ['Phoenix Scaffolding', [74, 72, 70, 69]], ['Delta Civils and Plant Hire', [66, 63, 60, 58]]], { icon: 'trending-up', sub: 'Falling scores for two months in a row raise a watch-list entry.' })] }
  ]
}];
module.exports = { pages: riskPages.concat(contractPages, perfPages), newPages: [] };
