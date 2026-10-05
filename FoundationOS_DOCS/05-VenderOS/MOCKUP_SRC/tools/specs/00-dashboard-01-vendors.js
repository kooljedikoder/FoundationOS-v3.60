const L = require('../lib');
const { R, APPROVE, kpis, list, bars, cards, matrix, form, flow, timeline, kv, two, panel, badge } = L;
const G = '#16a34a', B = '#2563eb', O = '#d97706', P = '#7c3aed', T = '#0d9488', Rd = '#dc2626';

// ---------- Vendor Directory (new page) with the PRD views
const vendorRows = (st, extra) => [
  R('V-1001', 'Kalahari Logistics (Pty) Ltd', 'Transport and Logistics', 'Procurement', 'Active since 2024', '', st || ['green', 'Active'], 'S35', 'Open passport'),
  R('V-1002', 'Sable IT Networks', 'IT Services', 'IT Procurement', 'Active since 2025', '', st || ['green', 'Active'], 'S35', 'Open passport'),
  R('V-1003', 'Delta Civils and Plant Hire', 'Construction', 'Procurement', 'Active since 2023', '', st || ['orange', 'Under review'], 'S30', 'Open passport'),
  R('V-1004', 'Northgate Office Supplies', 'Office Supplies', 'Procurement', 'Active since 2025', '', st || ['green', 'Active'], 'S35', 'Open passport')
].concat(extra || []);
const dir = {
  id: 'vendors', ws: '01-vendor-management', title: 'Vendor Directory', sub: 'Every vendor in one list. Each row opens the Vendor Passport. Contact details come from the Contact Control Center.',
  actions: [['New vendor', 'btn-primary', "wizardReset();openModal('vendorModal')", 'user-plus'], ['Open in Contact Control Center', 'btn-secondary', "showPage('ccc')", 'contact']],
  kpis: kpis([['Vendors', '428', 'purple'], ['Preferred', '36', 'green'], ['Blacklisted', '3', 'red'], ['Archived', '41', 'blue']]),
  tabs: [
    { id: 'all', label: 'All vendors', blocks: [list('vendors_all', 'All vendors', vendorRows(), { icon: 'building-2', toolbar: '<input class="cc-in" style="max-width:260px;padding:8px 10px;border:1.5px solid var(--border);border-radius:8px" placeholder="Search vendors" aria-label="Search vendors">' })] },
    { id: 'cats', label: 'Categories', blocks: [
      cards('Vendor categories', [['Transport and Logistics', '64', 'Fleet, haulage, couriers', 'blue', '15 sub-types'], ['Construction and Civils', '52', 'Plant hire, scaffolding, civils', 'orange', ''], ['IT Services', '47', 'Networks, software, support', 'purple', ''], ['Office Supplies', '38', 'Stationery, furniture', 'green', ''], ['Professional Services', '31', 'Legal, audit, consulting', 'grey', '']], { sub: 'Categories are the Vendor Category list in Contact Control Center settings, so one list serves both.' }),
      list('vendors_cat', 'Vendors in Transport and Logistics', vendorRows().slice(0, 1).concat([R('V-1011', 'Apex Machine Parts Nigeria Ltd', 'Transport and Logistics', 'Procurement', 'Active since 2024', '', ['green', 'Active'], 'S35', 'Open passport')]))
    ] },
    { id: 'preferred', label: 'Preferred', blocks: [list('vendors_pref', 'Preferred vendors', vendorRows(['green', 'Preferred']).slice(0, 2), { sub: 'Preferred vendors score 85 or more, have no open findings and hold every mandatory document.' })] },
    { id: 'blacklisted', label: 'Blacklisted', blocks: [list('vendors_black', 'Blacklisted vendors', [
      R('V-0877', 'Greenline Haulage', 'Transport and Logistics', 'Audit', 'Blacklisted 4 months ago', '', ['red', 'Blacklisted'], 'S30', 'Review blacklist', APPROVE),
      R('V-0842', 'Quickbuild Contractors', 'Construction', 'Audit', 'Blacklisted 1 year ago', '', ['red', 'Blacklisted'], 'S30', '')
    ], { sub: 'Blacklisting needs written findings and is logged. Removing a vendor from the list needs the same approval.' })] },
    { id: 'archived', label: 'Archived', blocks: [list('vendors_arch', 'Archived vendors', vendorRows(['grey', 'Archived']).slice(2), { sub: 'Archived vendors keep their history but cannot receive RFQs or purchase orders.' })] }
  ]
};

// ---------- Passport 360: the ten tabs the PRD lists that are missing
const pp = (id, label, blocks) => ({ id, label, blocks });
const passportTabs = [
  { label: 'Overview', existing: 'vp-overview' },
  pp('company', 'Company', [kv('Company details', [['Legal name', 'Kalahari Logistics (Pty) Ltd'], ['Trading name', 'Kalahari Logistics'], ['Company type', 'Private Limited Company'], ['Registration number', 'RC 1234567'], ['Incorporated', '12 March 2016'], ['Years in business', '10 (calculated)'], ['Employees', '51 to 200'], ['Industry', 'Transport and Logistics']], { icon: 'building-2', sub: 'Read from the Contact Control Center. Edit it there; this tab never keeps a second copy.' })]),
  pp('contacts', 'Contacts', [list('pp_contacts', 'Contact persons', [
    R('C-01', 'David Kalu, Managing Director', 'Primary contact', 'Vendor', 'Signatory', '', ['green', 'Verified'], 'S08', ''),
    R('C-02', 'Ngozi Adeyemi, Operations Manager', 'Additional contact', 'Vendor', 'Day-to-day', '', ['green', 'Verified'], 'S08', ''),
    R('C-03', 'Tunde Bello, Accounts', 'Finance contact', 'Vendor', 'Invoices', '', ['blue', 'Invited'], 'S08', 'Resend invite')
  ], { icon: 'users' })]),
  pp('directors', 'Directors', [list('pp_directors', 'Directors, owners and signatories', [
    R('D-01', 'David Kalu', 'Managing Director, 60%', 'Vendor', 'Signing limit ₦50m', '', ['green', 'Signatory'], 'S09', ''),
    R('D-02', 'Ada Eze', 'Finance Director, 25%', 'Vendor', 'Signing limit ₦10m', '', ['grey', 'Director'], 'S09', ''),
    R('D-03', 'Musa Bello', 'Non-executive Director, 15%', 'Vendor', '', '', ['grey', 'Director'], 'S09', '')
  ], { icon: 'users', sub: 'Nationality, email, phone, signing limit, signature specimen and board resolution are kept per director.' })]),
  pp('banking', 'Banking', [list('pp_banks', 'Bank accounts', [
    R('B-01', 'Access Bank, 0123456789', 'Current account (NGN)', 'Finance', 'Verified 3 months ago', '', ['green', 'Verified'], 'S13', ''),
    R('B-02', 'Zenith Bank, 2012345678', 'Domiciliary (USD)', 'Finance', 'Awaiting letter', '', ['orange', 'Pending verification'], 'S13', 'Request bank letter')
  ], { icon: 'landmark', sub: 'A change of bank details always pauses payments until it is re-verified.' })]),
  { label: 'Documents', existing: 'vp-docs' },
  pp('certs', 'Certifications', [list('pp_certs', 'Certifications', [
    R('CT-01', 'ISO 9001 Quality Management', 'Certification', 'Compliance', 'Expires Mar 2027', '', ['green', 'Valid'], 'S16', ''),
    R('CT-02', 'ISO 45001 Health and Safety', 'Certification', 'Compliance', 'Expires in 40 days', '', ['orange', 'Expires soon'], 'S16', 'Request renewal'),
    R('CT-03', 'Operating licence', 'Licence', 'Compliance', 'Expired 2 weeks ago', '', ['red', 'Expired'], 'S16', 'Request renewal')
  ], { icon: 'award' })]),
  pp('insurance', 'Insurance', [list('pp_insurance', 'Insurance policies', [
    R('IN-01', 'Goods in transit, cover ₦200m', 'Insurance', 'Compliance', 'Expires Aug 2026', '', ['orange', 'Expires soon'], 'S16', 'Request renewal'),
    R('IN-02', 'Public liability, cover ₦100m', 'Insurance', 'Compliance', 'Expires Jan 2027', '', ['green', 'Valid'], 'S16', '')
  ], { icon: 'shield' })]),
  pp('products', 'Products and services', [list('pp_products', 'Products and services', [
    R('PS-01', 'Road haulage, full truck load', 'Service', 'Procurement', 'Lagos, Ogun, Oyo', '', ['green', 'Approved'], 'S11', ''),
    R('PS-02', 'Warehousing and storage', 'Service', 'Procurement', 'Lagos', '', ['green', 'Approved'], 'S11', ''),
    R('PS-03', 'Last-mile courier', 'Service', 'Procurement', 'Lagos', '', ['blue', 'Proposed by vendor'], 'S11', 'Review')
  ], { icon: 'package', sub: 'Vendors pick an existing ERP product or propose a new one. Brand, manufacturer and country of origin are kept for proposed products.' })]),
  pp('branches', 'Branches', [list('pp_branches', 'Branches and locations', [
    R('BR-01', 'Head office, Lagos', 'Head office', 'Vendor', '14 Marina Road, Lagos', '', ['green', 'Verified'], 'S06', ''),
    R('BR-02', 'Warehouse, Ikeja', 'Warehouse', 'Vendor', 'Plot 8, Ikeja Industrial Estate', '', ['green', 'Verified'], 'S06', ''),
    R('BR-03', 'Depot, Abuja', 'Branch', 'Vendor', 'Km 12, Airport Road, Abuja', '', ['blue', 'Added by vendor'], 'S06', 'Verify')
  ], { icon: 'map-pin' })]),
  { label: 'Performance', existing: 'vp-perf' },
  { label: 'Contracts', existing: 'vp-contracts' },
  { label: 'Communications', existing: 'vp-comms' },
  { label: 'Timeline & Activity Log', existing: 'vp-timeline' },
  pp('notes', 'Notes', [
    form('Add a note', [['Note', 'textarea', 'Internal note about this vendor. Vendors cannot see notes.', true], ['Visible to', 'select', ['Procurement', 'Finance', 'Audit', 'Everyone internal']]], [['Save note', 'btn-primary']], { icon: 'edit-3' }),
    timeline('Notes', [['2 days ago', 'Preferred for the Lagos region. Review again in January.', 'Boitumelo P., Procurement', 'message-square'], ['3 weeks ago', 'Asked to renew the operating licence before the next award.', 'Compliance', 'message-square']])
  ]),
  { label: 'Staff Access', existing: 'vp-staff' }
];

// ---------- Dashboard (executive overview additions) and Task Centre
const health = cards('Workspace health', [
  ['Vendor health', '87%', 'Vendors with every mandatory document valid', 'green', 'Good'],
  ['Spend', '₦480m', 'Under management this year; 6% under budget', 'blue', 'On track'],
  ['Compliance', '94%', '3 vendors with expired documents', 'orange', 'Watch'],
  ['Risk', '4 high', 'Open high risks; 1 rising', 'red', 'Action']
], { icon: 'activity', sub: 'Each tile opens its workspace.' });
const tasks = {
  id: 'tasks', ws: '00-dashboard', title: 'Task Centre', sub: 'Everything waiting for you across every workspace, in one list.',
  actions: [['New task', 'btn-primary', null, 'plus']],
  kpis: kpis([['Open tasks', '14', 'purple'], ['Due today', '4', 'orange'], ['Overdue', '2', 'red'], ['Done this week', '23', 'green']]),
  tabs: [
    { id: 'mine', label: 'My tasks', blocks: [list('tasks_mine', 'My tasks', [
      R('TSK-501', 'Approve payment PAP-71 (Northgate Office Supplies)', 'Approval', 'Finance', 'Due today', '₦6,240,000', ['orange', 'Due today'], 'S43', 'Open approval', APPROVE),
      R('TSK-498', 'Score technical evaluation EV-501', 'Evaluation', 'Procurement', 'Due in 2 days', '', ['blue', 'Open'], 'S40', 'Enter my score'),
      R('TSK-495', 'Review expired operating licence: Kalahari Logistics', 'Compliance', 'Compliance', 'Overdue by 2 days', '', ['red', 'Overdue'], 'S16', 'Request renewal'),
      R('TSK-490', 'Reply to vendor question on PO-8821', 'Message', 'Procurement', 'Due tomorrow', '', ['blue', 'Open'], 'S42', 'Open thread')
    ])] },
    { id: 'team', label: 'My team', blocks: [list('tasks_team', 'Team tasks', [
      R('TSK-510', 'Verify bank letter: Sable IT Networks', 'Review', 'Finance', 'Due in 3 days', '', ['blue', 'Open'], 'S13', ''),
      R('TSK-507', 'Site inspection: Delta Civils and Plant Hire', 'Inspection', 'HSE Team', 'Planned 14 Oct', '', ['grey', 'Planned'], 'S28', '')
    ])] },
    { id: 'done', label: 'Done', blocks: [list('tasks_done', 'Completed this week', [R('TSK-480', 'Approve vendor Northgate Office Supplies', 'Approval', 'Procurement', 'Done yesterday', '', ['green', 'Done'], 'S19', '')])] }
  ]
};
const calendar = {
  id: 'calendar', ws: '00-dashboard', title: 'Calendar', sub: 'Deadlines, expiries, audits, meetings and renewals from every workspace.',
  actions: [['New event', 'btn-primary', null, 'plus']],
  kpis: kpis([['This week', '9', 'purple'], ['Expiries (30 days)', '14', 'orange'], ['Audits planned', '2', 'blue'], ['Meetings', '5', 'green']]),
  tabs: [
    { id: 'agenda', label: 'Agenda', blocks: [list('cal_agenda', 'Upcoming', [
      R('EVT-91', 'Delta Civils and Plant Hire: site audit', 'Audit', 'Audit', 'Tue 14 Oct', '', ['blue', 'Planned'], 'S28', ''),
      R('EVT-92', 'Operating licence expires: Kalahari Logistics', 'Expiry', 'Compliance', 'Wed 15 Oct', '', ['red', 'Expiry'], 'S16', 'Request renewal'),
      R('EVT-93', 'Contract CTR-2287 renewal decision', 'Renewal', 'Procurement', 'Fri 17 Oct', '', ['orange', 'Decision due'], 'S41', 'Start renewal'),
      R('EVT-94', 'Quarterly vendor performance review', 'Meeting', 'Procurement', 'Mon 20 Oct', '', ['grey', 'Meeting'], 'S44', '')
    ])] },
    { id: 'month', label: 'Month view', blocks: [matrix('October', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], [['Week 41', ['', '14 audit', '15 expiry', '', '17 renewal']], ['Week 42', ['20 review', '', '22 course', '', '24 payment run']], ['Week 43', ['27', '28 inspection', '', '30 report', '']]], { icon: 'calendar', sub: 'Dates link to the record they came from.' })] }
  ]
};
const profile = {
  id: 'profile', ws: '00-dashboard', title: 'My Account', sub: 'Your details, preferences, security and activity.',
  actions: [['Sign out', 'btn-secondary', null, 'log-in']],
  tabs: [
    { id: 'account', label: 'My account', blocks: [form('Account', [['Full name', 'text', 'Refilwe Sithole'], ['Email', 'email', 'refilwe@example.com'], ['Phone', 'tel', '+234 802 555 0114'], ['Department', 'select', ['Procurement', 'Finance', 'Audit', 'HSE']], ['Job title', 'text', 'Procurement Manager'], ['Language', 'select', ['English', 'Hausa', 'Yoruba', 'Igbo']]], [['Save', 'btn-primary']], { icon: 'user' })] },
    { id: 'prefs', label: 'Preferences', blocks: [form('Preferences', [['Start page', 'select', ['Dashboard', 'Task Centre', 'Vendor Directory']], ['Time zone', 'select', ['Africa/Lagos', 'Africa/Johannesburg', 'UTC']], ['Email me about', 'select', ['Approvals and tasks', 'Everything', 'Nothing']], ['Dark mode', 'check', 'Use the dark theme']], [['Save preferences', 'btn-primary']], { icon: 'sliders-horizontal' })] },
    { id: 'security', label: 'Security', blocks: [form('Password and sign-in', [['Current password', 'password', ''], ['New password', 'password', ''], ['Two-step sign-in', 'check', 'Ask for a code on a new device']], [['Change password', 'btn-primary']], { icon: 'shield' }), list('profile_sessions', 'Signed-in devices', [R('SES-1', 'Chrome on Windows, Lagos', 'Session', 'Me', 'Now', '', ['green', 'This device'], '-', ''), R('SES-2', 'Phone, Lagos', 'Session', 'Me', '2 hours ago', '', ['blue', 'Active'], '-', 'Sign out')])] },
    { id: 'activity', label: 'Activity', blocks: [timeline('My recent activity', [['Today 09:12', 'Approved payment PAP-70', 'Finance', 'check'], ['Yesterday', 'Scored evaluation EV-498', 'Procurement', 'edit-3'], ['2 days ago', 'Signed in from a new device', 'Security', 'shield']])] }
  ]
};

const pages = [
  { id: 'passport', tabs: passportTabs },
  { id: 'dashboard', tabs: null }
].filter(p => p.tabs);
module.exports = { pages, newPages: [dir, tasks, calendar, profile], health };
