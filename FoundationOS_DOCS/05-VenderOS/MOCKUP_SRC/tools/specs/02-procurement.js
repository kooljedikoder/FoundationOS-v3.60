const L = require('../lib');
const { R, APPROVE, kpis, list, bars, cards, matrix, form, flow, timeline, two, panel } = L;
const G = '#16a34a', B = '#2563eb', O = '#d97706', P = '#7c3aed', T = '#0d9488', Rd = '#dc2626';

const dash = [
  kpis([['Open RFQs', '7', 'blue'], ['Quotations to evaluate', '11', 'orange'], ['Awards this month', '4', 'green'], ['Spend under management', '₦480m', 'purple']]),
  flow('Source to award', [['RFQ', B], ['Quotations', B], ['Evaluation', P], ['Finance review', O], ['Procurement review', O], ['Recommendation', T], ['Approval', G], ['Award', G], ['Purchase order', G]], { sub: 'Every step is a tab in this workspace. Stages 39 to 41 of the vendor journey.' }),
  two(
    list('proc_actions', 'Needs your action', [
      R('QT-3305', 'Phoenix Scaffolding quotation is ready for technical scoring', 'Quotation', 'Procurement', 'Today', '₦18,400,000', ['orange', 'Awaiting evaluation'], 'S40', 'Open evaluation'),
      R('REC-210', 'Recommendation for RFQ-1039 waits for Procurement Head sign-off', 'Recommendation', 'Procurement', 'Due tomorrow', '₦9,800,000', ['orange', 'Awaiting approval'], 'S41', 'Review recommendation'),
      R('PO-8830', 'Award AW-1192 has no purchase order yet', 'Award', 'Procurement', '2 days ago', '₦6,240,000', ['blue', 'Ready for PO'], 'S41', 'Create purchase order')
    ], { icon: 'inbox' }),
    bars('Spend by category', [['Logistics and fleet', 34, '', '₦163m'], ['Civils and plant', 22, 'warning', '₦106m'], ['IT and telecoms', 18, 'success', '₦86m'], ['Office and supplies', 12, '', '₦58m'], ['Other', 14, '', '₦67m']])
  )
];
const quotes = [
  kpis([['Received', '24', 'blue'], ['Awaiting evaluation', '11', 'orange'], ['Late', '2', 'red'], ['Withdrawn', '1', 'purple']]),
  list('quotations', 'Quotations', [
    R('QT-3301', 'Kalahari Logistics: fleet tyre supply, 12 month price', 'Quotation', 'Procurement', 'Received 3 days ago', '₦21,000,000', ['blue', 'Under evaluation'], 'S40', 'Open evaluation'),
    R('QT-3302', 'Northgate Office Supplies: HQ furniture package', 'Quotation', 'Procurement', 'Received 4 days ago', '₦6,240,000', ['blue', 'Under evaluation'], 'S40', 'Open evaluation'),
    R('QT-3305', 'Phoenix Scaffolding: scaffold hire, site B', 'Quotation', 'Procurement', 'Received today', '₦18,400,000', ['orange', 'Awaiting evaluation'], 'S40', 'Open evaluation'),
    R('QT-3307', 'Sable IT Networks: managed switches', 'Quotation', 'IT Procurement', 'Closed 1 day ago', '₦11,900,000', ['red', 'Late submission'], 'S40', 'Ask for reason'),
    R('QT-3309', 'Eastern Cores and Reels: packaging cores', 'Quotation', 'Procurement', 'Received 6 days ago', '₦3,150,000', ['grey', 'Withdrawn'], 'S40', '')
  ], { sub: 'Quotations come from the ERP quotation records for each RFQ; VendorOS adds the evaluation steps around them.', extra: { quotations: { 'QT-3301': [['Linked RFQ', 'RFQ-1042'], ['Validity', '30 days'], ['Lead time', '14 days']], 'QT-3305': [['Linked RFQ', 'RFQ-1051'], ['Validity', '21 days'], ['Attachments', 'Method statement, price schedule']] } } })
];
const evalTab = [
  matrix('Scoring matrix: RFQ-1042 fleet tyres', ['Technical', 'Commercial', 'HSE', 'Delivery', 'Total'], [['Kalahari Logistics', [88, 82, 90, 85, 86]], ['Delta Civils and Plant Hire', [74, 91, 58, 70, 74]], ['Apex Machine Parts', [81, 77, 84, 79, 80]]], { sub: 'Technical, commercial and HSE scores are entered by the reviewers named on the evaluation committee.' }),
  list('evaluations', 'Evaluations in progress', [
    R('EV-501', 'Technical evaluation: RFQ-1042 (3 bidders)', 'Technical', 'Engineering', 'Due in 2 days', '', ['orange', '2 of 3 scored'], 'S40', 'Enter my score'),
    R('EV-502', 'Commercial evaluation: RFQ-1042', 'Commercial', 'Procurement', 'Due in 3 days', '', ['blue', 'Waiting for technical'], 'S40', ''),
    R('EV-498', 'Bid evaluation: RFQ-1039 furniture', 'Bid', 'Procurement', 'Done', '', ['green', 'Completed'], 'S40', '')
  ]),
  form('Enter my score', [['Bidder', 'select', ['Kalahari Logistics', 'Delta Civils and Plant Hire', 'Apex Machine Parts']], ['Criterion', 'select', ['Technical', 'Commercial', 'HSE', 'Delivery']], ['Score (0 to 100)', 'number', '85'], ['Comment', 'textarea', 'Reason for the score', true]], [['Submit score', 'btn-primary'], ['Save draft', 'btn-secondary']], { icon: 'edit-3' })
];
const finRev = [
  kpis([['Waiting for finance', '5', 'orange'], ['Budget checks done', '19', 'green'], ['Tax clearance expired', '1', 'red'], ['Average review', '1.4 d', 'blue']]),
  list('fin_reviews', 'Finance review', [
    R('FR-120', 'Budget and payment terms: RFQ-1042 (Kalahari Logistics)', 'Finance review', 'Finance', 'Due today', '₦21,000,000', ['orange', 'Awaiting decision'], 'S41', '', APPROVE),
    R('FR-119', 'Tax clearance check: Phoenix Scaffolding', 'Finance review', 'Finance', 'Due in 2 days', '₦18,400,000', ['red', 'Certificate expired'], 'S41', 'Request new certificate'),
    R('FR-117', 'Credit and payment history: Northgate Office Supplies', 'Finance review', 'Finance', 'Done', '₦6,240,000', ['green', 'Cleared'], 'S41', '')
  ], { extra: { fin_reviews: { 'FR-120': [['Budget line', 'Fleet maintenance 2026'], ['Budget left', '₦44m'], ['Payment terms', '30 days']] } } })
];
const procRev = [
  list('proc_reviews', 'Procurement review', [
    R('PR-88', 'Category strategy and sole-source check: RFQ-1042', 'Procurement review', 'Procurement', 'Due today', '₦21,000,000', ['orange', 'Awaiting decision'], 'S41', '', APPROVE),
    R('PR-87', 'Conflict of interest declarations: RFQ-1051', 'Procurement review', 'Compliance', 'Due in 2 days', '₦18,400,000', ['blue', 'In progress'], 'S41', 'Open declarations'),
    R('PR-85', 'Preferred vendor policy check: RFQ-1039', 'Procurement review', 'Procurement', 'Done', '₦9,800,000', ['green', 'Passed'], 'S41', '')
  ])
];
const recTab = [
  list('recommendations', 'Recommendations', [
    R('REC-210', 'Award RFQ-1039 to Northgate Office Supplies', 'Recommendation', 'Procurement', 'Due tomorrow', '₦9,800,000', ['orange', 'Awaiting approval'], 'S41', 'Send for approval', APPROVE),
    R('REC-208', 'Award RFQ-1042 to Kalahari Logistics with conditions', 'Recommendation', 'Procurement', 'Draft', '₦21,000,000', ['grey', 'Draft'], 'S41', 'Complete recommendation'),
    R('REC-205', 'Split award RFQ-1031 between two vendors', 'Recommendation', 'Procurement', 'Approved', '₦14,300,000', ['green', 'Approved'], 'S41', '')
  ]),
  form('Draft a recommendation', [['RFQ', 'select', ['RFQ-1042', 'RFQ-1051', 'RFQ-1039']], ['Recommended vendor', 'select', ['Kalahari Logistics', 'Delta Civils and Plant Hire', 'Apex Machine Parts']], ['Conditions', 'textarea', 'For example: delivery in two batches', true], ['Rationale', 'textarea', 'Why this vendor represents best value', true]], [['Save recommendation', 'btn-primary']], { icon: 'file-text' })
];
const approval = [
  flow('Award approval chain', [['Procurement Head', B], ['Finance Director', P], ['CEO above ₦50m', O], ['Award issued', G]], { sub: 'The chain follows the 15-role approval matrix. Rejecting needs written findings.' }),
  list('award_approvals', 'Awards waiting for approval', [
    R('AAP-310', 'Award RFQ-1039 furniture to Northgate Office Supplies', 'Award approval', 'Procurement Head', 'Due tomorrow', '₦9,800,000', ['orange', 'Awaiting Procurement Head'], 'S41', '', APPROVE),
    R('AAP-309', 'Award RFQ-1042 fleet tyres to Kalahari Logistics', 'Award approval', 'Finance Director', 'Due in 3 days', '₦21,000,000', ['blue', 'Awaiting Finance Director'], 'S41', '', APPROVE),
    R('AAP-304', 'Award RFQ-1020 scaffold hire to Phoenix Scaffolding', 'Award approval', 'CEO', 'Done', '₦58,000,000', ['green', 'Approved'], 'S41', '')
  ])
];
const awards = [
  kpis([['Awards this month', '4', 'green'], ['Awaiting PO', '2', 'orange'], ['Value awarded', '₦118m', 'purple'], ['Savings vs budget', '6.1%', 'blue']]),
  list('awards', 'Awards', [
    R('AW-1192', 'Northgate Office Supplies: HQ furniture', 'Award', 'Procurement', 'Awarded 2 days ago', '₦6,240,000', ['blue', 'Ready for PO'], 'S41', 'Create purchase order'),
    R('AW-1190', 'Kalahari Logistics: transport framework', 'Award', 'Procurement', 'Awarded 3 weeks ago', '₦48,000,000', ['green', 'PO and contract issued'], 'S41', ''),
    R('AW-1188', 'Sable IT Networks: managed services', 'Award', 'IT Procurement', 'Awarded 5 weeks ago', '₦110,000,000', ['green', 'PO and contract issued'], 'S41', '')
  ])
];
const contractsTab = [
  L.panel('Contracts from awards', 'file-text', '<div class="table-wrap" data-vf="contracts"></div>', 'The same contract register as the Contracts and Commercial workspace. A contract is created from an award at stage 41.')
];
const reports = [
  cards('Procurement reports', [['Procurement report', '', 'Cycle time, quotations per RFQ, award value', 'purple', 'Reports and BI'], ['Spend report', '', 'Spend by category, vendor and month', 'blue', 'Reports and BI'], ['Contract report', '', 'Awards that became contracts', 'green', 'Reports and BI']], { sub: 'Reports run in the Reports and BI workspace. Choose one to open it with the procurement filters set.' }),
  form('Run a report', [['Report', 'select', ['Procurement', 'Spend', 'Contract']], ['Period', 'select', ['Last 30 days', 'This quarter', 'This year']], ['Format', 'select', ['On screen', 'PDF', 'Excel']]], [['Open in Reports and BI', 'btn-primary', "showPage('reports')"]], { icon: 'bar-chart-2' })
];

const pages = [{
  id: 'procurement', tabs: [
    { label: 'Dashboard', id: 'dash', blocks: dash },
    { label: 'RFQs', existing: 'proc-rfq' },
    { label: 'Quotations', id: 'quotes', blocks: quotes },
    { label: 'Evaluation', id: 'eval', blocks: evalTab },
    { label: 'Finance review', id: 'finrev', blocks: finRev },
    { label: 'Procurement review', id: 'procrev', blocks: procRev },
    { label: 'Recommendation', id: 'rec', blocks: recTab },
    { label: 'Approval', id: 'appr', blocks: approval },
    { label: 'Awards', id: 'awards', blocks: awards },
    { label: 'Purchase Orders', existing: 'proc-po' },
    { label: 'Contracts', id: 'contracts', blocks: contractsTab },
    { label: 'Deliveries & Inspection', existing: 'proc-delivery' },
    { label: 'Reports', id: 'reports', blocks: reports }
  ]
}, {
  id: 'finance', wrap: { panel: 'fin-invoices' }, tabs: [
    { label: 'Invoices', id: 'wrap' },
    { label: 'Payments', id: 'payments', blocks: [
      kpis([['Paid this month', '₦212m', 'green'], ['Scheduled', '₦64m', 'blue'], ['On hold', '₦6m', 'orange'], ['Average days to pay', '24', 'purple']]),
      list('payments', 'Payments', [
        R('PAY-2026-0182', 'Kalahari Logistics: INV-55021', 'Payment', 'Finance', 'Paid 4 days ago', '₦21,000,000', ['green', 'Paid'], 'S43', ''),
        R('PAY-2026-0190', 'Sable IT Networks: INV-55033', 'Payment', 'Finance', 'Scheduled for Friday', '₦9,150,000', ['blue', 'Scheduled'], 'S43', 'Release now'),
        R('PAY-2026-0193', 'Northgate Office Supplies: INV-55040', 'Payment', 'Finance', 'Held', '₦6,240,000', ['orange', 'On hold: bank details changed'], 'S43', 'Re-verify bank')
      ], { sub: 'Payments are read from the ERP payment records. Bank detail changes pause a payment until they are re-verified.' })
    ] },
    { label: 'Approval routing', id: 'routing', blocks: [
      flow('Payment approval routing', [['Invoice received', B], ['Three-way match', P], ['Approver by amount', O], ['Payment scheduled', G], ['Released', G]], { sub: 'Under ₦5m: Finance Officer. ₦5m to ₦50m: Finance Manager. Over ₦50m: Finance Director.' }),
      list('pay_approvals', 'Waiting for approval', [
        R('PAP-71', 'INV-55040 Northgate Office Supplies', 'Payment approval', 'Finance Manager', 'Due today', '₦6,240,000', ['orange', 'Awaiting approval'], 'S43', '', APPROVE),
        R('PAP-70', 'INV-55047 Delta Civils and Plant Hire', 'Payment approval', 'Finance Director', 'Due in 2 days', '₦58,000,000', ['blue', 'Awaiting Finance Director'], 'S43', '', APPROVE)
      ])
    ] }
  ]
}];
module.exports = { pages, newPages: [] };
