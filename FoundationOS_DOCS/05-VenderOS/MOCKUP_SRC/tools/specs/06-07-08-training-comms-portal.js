const L = require('../lib');
const { R, APPROVE, kpis, list, bars, cards, matrix, form, flow, timeline, kv, two, panel, badge } = L;
const G = '#16a34a', B = '#2563eb', O = '#d97706', P = '#7c3aed', T = '#0d9488', Rd = '#dc2626';
const reportsTab = (title, names) => [cards(title, names.map(n => [n, '', 'Opens in Reports and BI with these filters set', 'purple', 'Report'])), form('Run a report', [['Report', 'select', names], ['Period', 'select', ['Last 30 days', 'This quarter', 'This year']]], [['Open in Reports and BI', 'btn-primary', "showPage('reports')"]], { icon: 'bar-chart-2' })];

// =============== 6. TRAINING AND COMPETENCY ===============
const trainingPages = [{
  id: 'hse', wrap: { panel: 'hse-tab-induction' }, tabs: [
    { label: 'Dashboard', id: 'dash', blocks: [kpis([['Courses', '12', 'purple'], ['Certified vendors', '38', 'green'], ['Expiring (30 days)', '5', 'orange'], ['Test pass rate', '91%', 'blue']]), two(bars('Induction completion', [['Site Safety Induction', 100, 'success', '412 vendors'], ['Working at Heights', 62, 'warning', '71 vendors'], ['Hot Work Permit', 41, 'warning', '29 vendors']]), list('tr_actions', 'Needs your action', [R('CRT-77', 'Working at Heights certificate expires in 12 days: Delta Civils', 'Expiry', 'HSE Team', 'In 12 days', '', ['orange', 'Expiring'], 'S27', 'Send reminder'), R('ATT-905', 'Delta Civils staff failed Working at Heights (62%)', 'Test attempt', 'HSE Team', '2 weeks ago', '', ['red', 'Failed'], 'S27', 'Allow retake')]))] },
    { label: 'Courses', id: 'courses', blocks: [panel('Courses', 'graduation-cap', '<div class="table-wrap" data-vf="courses"></div>', 'Content, pass mark and validity are set per course. Vendors take the test in Training and HSE.')] },
    { label: 'Learning centre', id: 'learn', blocks: [cards('Learning centre', [['Site safety basics', '12 min', 'Video and 10-question quiz', 'green', 'Mandatory'], ['Working at heights', '25 min', 'Practical guide and test', 'orange', 'Trade'], ['Hot work permits', '18 min', 'Permit steps and quiz', 'orange', 'Trade'], ['Anti-bribery and conduct', '15 min', 'Policy and declaration', 'blue', 'All vendors'], ['Data protection', '10 min', 'Short guide', 'grey', 'Optional']], { sub: 'Learning material is shared with vendors in their Training and HSE area.' }), form('Add learning material', [['Title', 'text', 'For example: Fire safety on site'], ['Type', 'select', ['Video', 'Document', 'Quiz']], ['Audience', 'select', ['All vendors', 'Trade vendors', 'Staff']]], [['Add material', 'btn-primary']], { icon: 'plus' })] },
    { label: 'Induction', id: 'wrap' },
    { label: 'Assessments', id: 'assess', blocks: [panel('Test attempts', 'clipboard-check', '<div class="table-wrap" data-vf="attempts"></div>', 'Every attempt is recorded with score and staff member; a pass issues a certificate with an expiry date.')] },
    { label: 'Competency matrix', id: 'matrix', blocks: [matrix('Competency by vendor and course', ['Site safety', 'Heights', 'Hot work', 'Anti-bribery'], [['Kalahari Logistics', [96, 'n/a', 'n/a', 92]], ['Delta Civils and Plant Hire', [88, 62, 'expired', 80]], ['Phoenix Scaffolding', [90, 84, 'n/a', 76]], ['Sable IT Networks', [94, 'n/a', 'n/a', 95]]], { sub: 'Shows the best valid score per vendor and course. n/a means the course is not required for that trade.' })] },
    { label: 'Certificates', id: 'certs', blocks: [list('tr_certs', 'Certificate register', [
      R('CRT-81', 'Kalahari Logistics: Site Safety Induction', 'Certificate', 'HSE Team', 'Expires Oct next year', '', ['green', 'Valid'], 'S27', ''),
      R('CRT-77', 'Delta Civils and Plant Hire: Working at Heights', 'Certificate', 'HSE Team', 'Expires in 12 days', '', ['orange', 'Expiring'], 'S27', 'Send reminder'),
      R('CRT-70', 'Delta Civils and Plant Hire: Hot Work Permit', 'Certificate', 'HSE Team', 'Expired 3 weeks ago', '', ['red', 'Expired'], 'S27', 'Request retake')
    ])] },
    { label: 'Expiry tracking', id: 'expiry', blocks: [kpis([['Expiring in 30 days', '5', 'orange'], ['Expiring in 60 days', '11', 'blue'], ['Expired', '3', 'red'], ['Reminders sent', '19', 'green']]), list('tr_expiry', 'Expiry tracking', [R('EXP-12', 'Delta Civils and Plant Hire: Working at Heights', 'Certificate', 'HSE Team', '12 days', '', ['orange', 'Reminder 1 sent'], 'S27', 'Send reminder 2'), R('EXP-11', 'Phoenix Scaffolding: Site Safety Induction', 'Certificate', 'HSE Team', '34 days', '', ['blue', 'Scheduled'], 'S27', '')], { sub: 'Reminders go out at 30, 7 and 1 days, or at the intervals set in Administration.' })] },
    { label: 'Reports', id: 'reports', blocks: reportsTab('Training reports', ['Compliance', 'Performance']) }
  ]
}];

// =============== 7. COMMUNICATIONS ===============
const commsPages = [{
  id: 'comms', tabs: [
    { label: 'Dashboard', id: 'dash', blocks: [kpis([['Open threads', '14', 'blue'], ['Unassigned', '3', 'orange'], ['Average first response', '2.1 h', 'green'], ['SLA breaches', '1', 'red']]), two(bars('Messages by channel', [['Direct messages', 48, ''], ['Email', 31, 'success'], ['WhatsApp', 21, 'warning']]), list('cm_actions', 'Needs your action', [R('THR-401', 'Vendor asks about PO-8821 delivery date', 'Direct message', 'Procurement', '1 hour ago', '', ['orange', 'Unassigned'], 'S42', 'Assign to me'), R('THR-398', 'Email from Sable IT Networks: invoice query', 'Email', 'Finance', '3 hours ago', '', ['blue', 'Open'], 'S43', 'Reply')]))] },
    { label: 'Unified Inbox', existing: 'comms-unified' },
    { label: 'Direct Messages', existing: 'comms-dm' },
    { label: 'Email', existing: 'comms-email' },
    { label: 'WhatsApp', existing: 'comms-wa' },
    { label: 'Announcements', existing: 'comms-news' },
    { label: 'Alerts', existing: 'comms-alerts' },
    { label: 'Meetings', id: 'meetings', blocks: [list('cm_meetings', 'Meetings', [R('MTG-31', 'Quarterly vendor review: Kalahari Logistics', 'Meeting', 'Procurement', 'Mon 20 Oct, 10:00', '', ['blue', 'Scheduled'], 'S44', 'Open agenda'), R('MTG-30', 'Corrective action review: Delta Civils', 'Meeting', 'HSE Team', 'Tue 14 Oct, 14:00', '', ['blue', 'Scheduled'], 'S28', 'Open agenda'), R('MTG-27', 'Onboarding kick-off: Phoenix Scaffolding', 'Meeting', 'Vendor Admin', 'Last week', '', ['green', 'Held, minutes saved'], 'S19', '')]), form('Schedule a meeting', [['Title', 'text', 'Meeting title'], ['With vendor', 'select', ['Kalahari Logistics', 'Delta Civils and Plant Hire', 'Phoenix Scaffolding']], ['Date and time', 'datetime-local', ''], ['Agenda', 'textarea', 'What will be covered', true]], [['Schedule', 'btn-primary']], { icon: 'calendar' })] },
    { label: 'Tasks', id: 'tasks', blocks: [panel('Tasks from conversations', 'check-square', '<p style="font-size:13px;margin-bottom:10px">Tasks created from messages, meetings and surveys appear in the Task Centre.</p><button class="btn btn-primary btn-sm" onclick="showPage(\'tasks\')">Open the Task Centre</button>')] },
    { label: 'Support tickets', id: 'tickets', blocks: [kpis([['Open tickets', '3', 'orange'], ['Average response', '3.2 h', 'green'], ['Satisfaction', '94%', 'purple'], ['Waiting for vendor', '2', 'blue']]), list('cm_tickets', 'Support tickets', [R('TKT-912', 'Vendor cannot upload a PDF over 10 MB', 'Ticket', 'Service Desk', 'Opened today', '', ['orange', 'Open'], 'S22', 'Reply'), R('TKT-908', 'Request to change bank details', 'Ticket', 'Finance', 'Opened 2 days ago', '', ['blue', 'Waiting for vendor'], 'S44', ''), R('TKT-901', 'Question on the Nigeria document pack', 'Ticket', 'Compliance', 'Closed', '', ['green', 'Resolved'], 'S22', '')])] },
    { label: 'Surveys', id: 'surveys', blocks: [list('cm_surveys', 'Surveys', [R('SRV-12', 'Vendor satisfaction, Q4', 'Survey', 'Procurement', 'Closes in 9 days', '', ['blue', 'Open, 38% answered'], 'S44', 'View results'), R('SRV-11', 'Onboarding experience', 'Survey', 'Vendor Admin', 'Closed', '', ['green', 'Closed, score 4.3'], 'S19', 'View results')]), form('New survey', [['Title', 'text', 'Survey title'], ['Audience', 'select', ['All vendors', 'New vendors', 'Preferred vendors']], ['Questions', 'textarea', 'One question per line', true]], [['Create survey', 'btn-primary']], { icon: 'clipboard-list' })] },
    { label: 'Improvement plans', id: 'plans', blocks: [panel('Improvement plans', 'target', '<p style="font-size:13px;margin-bottom:10px">Improvement plans are managed in Performance. This tab lists the ones with open conversations.</p><button class="btn btn-primary btn-sm" onclick="showPage(\'perf\')">Open Performance</button>')] },
    { label: 'Document sharing', id: 'share', blocks: [list('cm_share', 'Shared documents', [R('SH-61', 'Supplier code of conduct v3', 'Shared with all vendors', 'Compliance', 'Shared 2 weeks ago', '', ['green', 'Read by 380 of 428'], 'S22', ''), R('SH-60', 'Q4 delivery calendar', 'Shared with transport vendors', 'Procurement', 'Shared last week', '', ['blue', 'Read by 41 of 64'], 'S42', 'Send reminder')], { sub: 'Files come from the shared document store, so a document shared here is the same record as in Document Management.' })] },
    { label: 'Activity feed', id: 'feed', blocks: [timeline('Activity feed', [['Today 10:40', 'Kalahari Logistics replied on PO-8821', 'Procurement', 'message-square'], ['Today 09:15', 'Announcement published: Q4 delivery calendar', 'Procurement', 'bell'], ['Yesterday', 'Survey SRV-12 opened to all vendors', 'Procurement', 'clipboard-list'], ['2 days ago', 'Ticket TKT-908 opened by Northgate Office Supplies', 'Finance', 'life-buoy']])] }
  ]
}];

// =============== 8. VENDOR PORTAL ===============
const portalPages = [
  { id: 'myprofile', tabs: [
    { label: 'Overview', existing: 'mp-overview' }, { label: 'Contacts', existing: 'mp-contacts' }, { label: 'Banking & Tax', existing: 'mp-banking' }, { label: 'Passport', existing: 'mp-passport' }, { label: 'Staff Access', existing: 'mp-staff' },
    { label: 'Contracts', id: 'contracts', blocks: [panel('Your contracts', 'file-text', '<div class="table-wrap" data-vf="contracts"></div>', 'Contracts you have with the buyer. Obligations and renewal dates are shown in the drawer.')] }
  ] },
  { id: 'mycomms', wrap: { panel: 'mc-messages' }, tabs: [
    { label: 'Messages', id: 'wrap' },
    { label: 'Announcements', id: 'news', blocks: [list('mc_news', 'Announcements', [R('AN-44', 'Q4 delivery calendar is published', 'Announcement', 'Procurement', 'Today', '', ['blue', 'New'], 'S42', ''), R('AN-41', 'Updated supplier code of conduct (v3)', 'Announcement', 'Compliance', '2 weeks ago', '', ['green', 'Read'], 'S22', '')])] },
    { label: 'Alerts', id: 'alerts', blocks: [list('mc_alerts', 'Alerts', [R('AL-19', 'Your operating licence expired 2 weeks ago', 'Alert', 'Compliance', '2 weeks ago', '', ['red', 'Action needed'], 'S16', 'Upload new licence'), R('AL-18', 'Goods in transit insurance expires in 40 days', 'Alert', 'Compliance', 'Today', '', ['orange', 'Expires soon'], 'S16', 'Upload renewal')])] }
  ] },
  { id: 'support', wrap: { panel: 'sp-chat' }, tabs: [
    { label: 'Chat', id: 'wrap' },
    { label: 'Email', id: 'email', blocks: [form('Email the Service Desk', [['Subject', 'text', 'What do you need help with?'], ['Category', 'select', ['Registration', 'Documents', 'Orders and RFQs', 'Invoices and payments', 'Other']], ['Message', 'textarea', 'Describe the problem. Attach files after sending.', true]], [['Send email', 'btn-primary']], { icon: 'mail', sub: 'Replies go to your registered email. Target response: 4 hours.' })] },
    { label: 'Knowledge base', id: 'kb', blocks: [list('kb_articles', 'Knowledge base', [R('KB-01', 'How to register as a vendor in 13 steps', 'Guide', 'Service Desk', 'Updated this month', '', ['green', 'Popular'], '-', ''), R('KB-02', 'The 15 documents we ask for in Nigeria', 'Guide', 'Compliance', 'Updated this month', '', ['green', 'Popular'], '-', ''), R('KB-03', 'How to submit an invoice and track payment', 'Guide', 'Finance', 'Updated last month', '', ['blue', 'Guide'], '-', ''), R('KB-04', 'What to do when a document is rejected', 'Guide', 'Compliance', 'Updated last month', '', ['blue', 'Guide'], '-', '')])] }
  ] }
];
const homePage = {
  id: 'myhome', ws: '08-vendor-portal', title: 'Home', sub: 'Where you are in onboarding, what needs you, and what has happened.',
  actions: [['Ask a question', 'btn-secondary', "showPage('mycomms')", 'message-square']],
  kpis: kpis([['Journey progress', '78%', 'purple'], ['Actions for you', '3', 'orange'], ['Documents valid', '13 of 15', 'green'], ['Unread messages', '2', 'blue']]),
  tabs: [
    { id: 'journey', label: 'Journey', blocks: [flow('Your onboarding journey', [['Registered', G], ['Documents', G], ['Assessment', G], ['Approval', B], ['Passport', '#9ca3af'], ['Active', '#9ca3af']], { sub: 'You are at Approval. The buyer team is reviewing your assessment.' }), bars('Step progress', [['Company and registration', 100, 'success'], ['Documents', 87, 'warning', '13 of 15'], ['Assessment', 100, 'success'], ['Approval', 40, '']])] },
    { id: 'actions', label: 'Action items', blocks: [list('myhome_actions', 'Action items', [R('ACT-31', 'Upload a renewed operating licence', 'Document', 'Compliance', 'Due in 5 days', '', ['red', 'Action needed'], 'S16', 'Upload document'), R('ACT-30', 'Confirm your bank account letter', 'Banking', 'Finance', 'Due in 7 days', '', ['orange', 'Action needed'], 'S13', 'Upload letter'), R('ACT-28', 'Read the updated code of conduct', 'Policy', 'Compliance', 'Due in 14 days', '', ['blue', 'To read'], 'S22', 'Open')])] },
    { id: 'activity', label: 'Activity', blocks: [timeline('Recent activity', [['Today', 'Assessment moved to Approval', 'Vendor Admin', 'check'], ['Yesterday', 'You uploaded Tax clearance certificate', 'You', 'upload'], ['3 days ago', 'Compliance asked for a clearer CAC certificate', 'Compliance', 'message-square']])] }
  ]
};
const notifPage = {
  id: 'mynotifications', ws: '08-vendor-portal', title: 'Notifications', sub: 'Everything the buyer team and the system have told you.',
  actions: [['Mark all read', 'btn-secondary', null, 'check']],
  tabs: [
    { id: 'all', label: 'All', blocks: [list('mynotif_all', 'Notifications', [R('NT-91', 'Your operating licence has expired', 'Alert', 'Compliance', 'Today', '', ['red', 'Unread'], 'S16', 'Upload new licence'), R('NT-90', 'Purchase order PO-8830 was issued to you', 'Order', 'Procurement', 'Yesterday', '₦6,240,000', ['blue', 'Unread'], 'S42', 'Open order'), R('NT-88', 'Payment PAY-2026-0182 was released', 'Payment', 'Finance', '4 days ago', '₦21,000,000', ['green', 'Read'], 'S43', '')])] },
    { id: 'settings', label: 'Settings', blocks: [form('How we contact you', [['Email me about', 'select', ['Everything', 'Actions and alerts only', 'Nothing']], ['SMS alerts', 'check', 'Send SMS for urgent alerts'], ['PO alerts', 'check', 'Tell me when a purchase order is issued'], ['Compliance reminders', 'check', 'Remind me before documents expire']], [['Save settings', 'btn-primary']], { icon: 'bell' })] }
  ]
};
module.exports = { pages: trainingPages.concat(commsPages, portalPages), newPages: [homePage, notifPage] };
