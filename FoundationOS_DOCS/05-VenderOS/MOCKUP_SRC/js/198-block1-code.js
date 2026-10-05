<script>
/* ===== Vendor Portal: ONE list renderer, ONE detail drawer, ONE request form =====
   Every vendor list uses the same standard fields:
   ref · title · type · owner · date · amount · status · next action (+ J01 stage). */
const VF_BADGE = {grey:'badge-grey',blue:'badge-blue',orange:'badge-orange',red:'badge-red',green:'badge-green'};
const VF = {
  contacts:[
    {ref:'CT-01',title:'Kagiso Molefe',type:'Operations Director (CEO)',owner:'kagiso@kalaharilogistics.com.ng',date:'Primary contact',status:['green','Active'],stage:'S10',next:'Edit contact'},
    {ref:'CT-02',title:'David K.',type:'Company Representative',owner:'david@kalaharilogistics.com.ng',date:'Portal user',status:['green','Active'],stage:'S10',next:'Edit contact'}
  ],
  staff:[
    {ref:'SA-01',title:'Kagiso Molefe',type:'Primary contact',owner:'Full access',date:'Joined 14 months ago',status:['green','Active'],stage:'S37',next:'Change access'},
    {ref:'SA-02',title:'David K.',type:'Staff member',owner:'Limited access',date:'Joined 11 months ago',status:['green','Active'],stage:'S37',next:'Change access'}
  ],
  rfq:[
    {ref:'RFQ-1042',title:'Fleet tyre supply — annual contract',type:'RFQ',owner:'Procurement',date:'Closes in 3 days',status:['orange','Awaiting your quotation'],stage:'S39–40',next:'Submit quotation'},
    {ref:'RFQ-1050',title:'Warehouse racking supply',type:'RFQ',owner:'Procurement',date:'Closes in 7 days',status:['grey','Invitation received'],stage:'S39',next:'Accept invitation'}
  ],
  po:[
    {ref:'PO-8815',title:'Fleet tyres — Q2 batch',type:'Purchase Order',owner:'Procurement',date:'Delivered',amount:'₦21,000,000',status:['green','Delivered'],stage:'S42',next:''},
    {ref:'PO-8821',title:'Pallet jacks and straps',type:'Purchase Order',owner:'Procurement',date:'Due in 4 days',amount:'₦6,240,000',status:['blue','Awaiting delivery'],stage:'S42',next:'Confirm delivery date'}
  ],
  delivery:[
    {ref:'DN-4471',title:'Delivery note for PO-8815',type:'Delivery Note',owner:'Warehouse',date:'Today',status:['green','Signed off'],stage:'S42',next:''},
    {ref:'DN-4488',title:'Scheduled delivery for PO-8821',type:'Delivery Note',owner:'Warehouse',date:'In 4 days',status:['blue','Scheduled'],stage:'S42',next:'Acknowledge'}
  ],
  invoice:[
    {ref:'INV-55021',title:'Invoice for PO-8815',type:'Invoice',owner:'Finance',date:'Paid',amount:'₦21,000,000',status:['green','Paid'],grp:'paid',stage:'S43',next:''},
    {ref:'INV-55040',title:'Invoice for PO-8821',type:'Invoice',owner:'Finance',date:'Due in 5 days',amount:'₦6,240,000',status:['blue','Awaiting payment'],grp:'outstanding',stage:'S43',next:'Ask Finance about this invoice'},
    {ref:'INV-55052',title:'Invoice for PO-8830',type:'Invoice',owner:'Finance',date:'Not yet submitted',amount:'₦3,890,000',status:['grey','Not yet submitted'],grp:'outstanding',stage:'S43',next:'Submit invoice'}
  ],
  course:[
    {ref:'CRS-01',title:'Site Safety Induction',type:'Course',owner:'HSE Team',date:'Completed',status:['green','Completed'],stage:'S27',next:''},
    {ref:'CRS-02',title:'Working at Heights',type:'Course',owner:'HSE Team',date:'In progress',status:['orange','In progress'],stage:'S27',next:'Continue course'}
  ],
  cert:[
    {ref:'CERT-01',title:'Site Safety Induction',type:'Certificate',owner:'HSE Team',date:'Expires in 11 months',status:['green','Valid'],stage:'S27',next:''},
    {ref:'CERT-02',title:'Working at Heights',type:'Certificate',owner:'HSE Team',date:'Expired',status:['red','Renewal required'],stage:'S27',next:'Book renewal'}
  ],
  induction:[
    {ref:'IND-01',title:'David K. — site induction',type:'Induction',owner:'HSE Team',date:'14 months ago',status:['green','Passed — 94%'],stage:'S27',next:''}
  ],
  request:[
    {ref:'REQ-9001',title:'Certificate re-issue',type:'Certificate Re-issue',owner:'Compliance',date:'3 days ago',status:['green','Completed'],stage:'S22',next:''}
  ]
};

Object.assign(VF, {
  dn:[
    {ref:'DN-4471',title:'Delivery note for PO-8815',type:'Delivery note',owner:'Kalahari Logistics',date:'3 days ago',status:['green','Good'],stage:'S42',next:''},
    {ref:'DN-4468',title:'Delivery note for PO-8821',type:'Delivery note',owner:'Northgate Office Supplies',date:'Today',status:['orange','Pending inspection'],stage:'S42',actions:[['Accept','btn-primary'],['Reject','btn-danger'],['Request information','btn-secondary']]},
    {ref:'DN-4460',title:'Delivery note for PO-8809 — 2 units damaged',type:'Delivery note',owner:'Delta Civils & Plant Hire',date:'1 week ago',status:['red','Damaged units'],stage:'S42',next:'Raise claim with vendor'},
    {ref:'DN-4455',title:'Delivery note for PO-8790',type:'Delivery note',owner:'Sable IT Networks',date:'2 weeks ago',status:['green','Good'],stage:'S42',next:''}
  ],
  approval:[
    {ref:'AP-3301',title:'Sable IT Networks — management approval',type:'Management approval',owner:'Executive',date:'Due in 2 days',status:['orange','Awaiting decision'],stage:'S33',actions:[['Approve','btn-primary'],['Reject','btn-danger'],['Request information','btn-secondary']]},
    {ref:'AP-3302',title:'Phoenix Scaffolding — technical review',type:'Review',owner:'Procurement',date:'Overdue by 1 day',status:['red','Overdue'],stage:'S24',actions:[['Approve','btn-primary'],['Reject','btn-danger'],['Request information','btn-secondary'],['Escalate','btn-secondary']]},
    {ref:'AP-3303',title:'Maru Fleet Services — finance review',type:'Review',owner:'Finance',date:'Due in 4 days',status:['blue','In review'],stage:'S25',actions:[['Approve','btn-primary'],['Reject','btn-danger'],['Request information','btn-secondary']]},
    {ref:'AP-3304',title:'Bright Path Catering — legal review',type:'Review',owner:'Audit',date:'Due in 6 days',status:['grey','Not started'],stage:'S26',actions:[['Approve','btn-primary'],['Reject','btn-danger'],['Request information','btn-secondary']]}
  ],
  chain:[
    {ref:'S23',title:'Procurement review',type:'Review stage',owner:'Procurement',date:'SLA 3 working days',status:['green','Required'],stage:'S23',next:''},
    {ref:'S24',title:'Technical review (parallel with S25)',type:'Review stage',owner:'Procurement / technical lead',date:'SLA 3 working days',status:['green','Required'],stage:'S24',next:''},
    {ref:'S25',title:'Finance review (parallel with S24)',type:'Review stage',owner:'Finance',date:'SLA 3 working days',status:['green','Required'],stage:'S25',next:''},
    {ref:'S26',title:'Legal / governance review',type:'Review stage',owner:'Audit',date:'SLA 5 working days',status:['green','Required'],stage:'S26',next:''},
    {ref:'S27',title:'HSE review and induction',type:'Review stage',owner:'Vendor Admin (HSE)',date:'SLA 5 working days',status:['green','Required'],stage:'S27',next:''},
    {ref:'S29-30',title:'ESG and risk review',type:'Review stage (CORE)',owner:'Audit',date:'SLA 5 working days',status:['blue','CORE only'],stage:'S29-S30',next:''},
    {ref:'S33',title:'Management approval (final)',type:'Approval',owner:'Executive',date:'SLA 2 working days',status:['green','Required'],stage:'S33',next:''}
  ],
  history:[
    {ref:'HI-0412',title:'Kalahari Logistics — approved',type:'Management approval',owner:'Karabo E. (Executive)',date:'14 months ago',status:['green','Approved'],stage:'S33',next:''},
    {ref:'HI-0398',title:'Delta Civils & Plant Hire — rejected: HSE score 62%',type:'HSE review',owner:'Thabo M. (Vendor Admin)',date:'13 months ago',status:['red','Rejected'],stage:'S27',next:''},
    {ref:'HI-0377',title:'Tswana IT Solutions — information requested: tax clearance',type:'Finance review',owner:'Naledi F. (Finance)',date:'11 months ago',status:['blue','Information requested'],stage:'S25',next:''}
  ],
  timeline:[
    {ref:'TL-01',title:'Passport VP-00842 issued',type:'Passport',owner:'System',date:'14 months ago',status:['green','Issued'],stage:'S36',next:''},
    {ref:'TL-02',title:'Vendor activated and portal access granted',type:'Lifecycle',owner:'Thabo M.',date:'14 months ago',status:['green','Active'],stage:'S37',next:''},
    {ref:'TL-03',title:'Performance score published: 88%',type:'Performance',owner:'Boitumelo P.',date:'2 months ago',status:['green','Published'],stage:'S44',next:''},
    {ref:'TL-04',title:'Working at Heights certificate expired',type:'HSE',owner:'System',date:'Yesterday',status:['red','Expired'],stage:'S27',next:''},
    {ref:'TL-05',title:'Insurance certificate expires in 6 days',type:'Document',owner:'System',date:'Today',status:['orange','Expiring soon'],stage:'S17',next:''}
  ],
  vthreads:[
    {ref:'TH-0101',title:'Public Liability Insurance renewal',type:'Conversation',owner:'Compliance (Lesego K.)',date:'Today',status:['orange','Awaiting vendor'],stage:'S22',next:'Open in Communications'},
    {ref:'TH-0098',title:'HSE policy update, effective 1 September',type:'Announcement',owner:'HSE Team',date:'2 days ago',status:['grey','Sent'],stage:'S27',next:'Open in Communications'}
  ],
  expiring:[
    {ref:'DOC-2201',title:'Kalahari Logistics — Public Liability Insurance',type:'Insurance',owner:'Compliance',date:'Expires in 6 days',status:['red','Expiring soon'],stage:'S15',next:'Send reminder'},
    {ref:'DOC-2188',title:'Delta Civils & Plant Hire — Tax Compliance Evidence',type:'Tax',owner:'Finance',date:'Expires in 12 days',status:['orange','Expiring soon'],stage:'S14',next:'Send reminder'},
    {ref:'DOC-2170',title:'Tswana IT Solutions — ISO 9001 Certificate',type:'Certification',owner:'Compliance',date:'Expires in 21 days',status:['orange','Expiring soon'],stage:'S16',next:'Send reminder'},
    {ref:'DOC-2159',title:'Maru Fleet Services — Price List',type:'Commercial',owner:'Procurement',date:'Valid till in 28 days',status:['grey','Expiring soon'],stage:'S09',next:'Send reminder'}
  ]
});

Object.assign(VF, {
  contracts:[
    {ref:'CTR-2287',title:"Kalahari Logistics — transport framework agreement",type:"Framework",owner:"Procurement",date:"Renews in 2 months",amount:"₦48m / yr",status:["orange","Renewal due"],stage:'S41',next:"Start renewal"},
    {ref:'CTR-2301',title:"Sable IT Networks — managed IT services",type:"Service",owner:"Procurement",date:"Renews in 9 months",amount:"₦110m / yr",status:["green","Active"],stage:'S41',next:""},
    {ref:'CTR-2310',title:"Delta Civils & Plant Hire — plant hire",type:"Service",owner:"Procurement",date:"Renews in 5 months",amount:"₦34m / yr",status:["red","Suspended (HSE)"],stage:'S41',next:"Review suspension"}
  ],
  obligations:[
    {ref:'OB-101',title:"Provide renewed insurance certificate every quarter",type:"Obligation",owner:"Compliance",date:"Due in 6 days",status:["orange","Due soon"],stage:'S41',next:"Send reminder"},
    {ref:'OB-102',title:"Monthly SLA performance report",type:"Obligation",owner:"Procurement",date:"Due in 12 days",status:["blue","Scheduled"],stage:'S44',next:""},
    {ref:'OB-103',title:"Annual audit access for buyer",type:"Obligation",owner:"Audit",date:"Due in 4 months",status:["grey","Not started"],stage:'S41',next:""}
  ],
  findings:[
    {ref:'FND-221',title:"Delta Civils & Plant Hire — missing HSE induction records",type:"Finding (High)",owner:"Audit",date:"Opened 9 days ago",status:["red","Corrective action open"],stage:'S28',next:"Raise corrective action"},
    {ref:'FND-219',title:"Northgate Office Supplies — outdated banking mandate",type:"Finding (Medium)",owner:"Finance",date:"Opened 3 weeks ago",status:["orange","Under review"],stage:'S13',next:"Request evidence"},
    {ref:'FND-214',title:"Sable IT Networks — expired ISO certificate on file",type:"Finding (Low)",owner:"Compliance",date:"Opened 6 weeks ago",status:["green","Closed"],stage:'S16',next:""}
  ],
  capa:[
    {ref:'CAPA-88',title:"Retrain site team on working at heights",type:"Corrective action",owner:"HSE Team",date:"Due in 9 days",status:["orange","In progress"],stage:'S27',next:"Mark complete"},
    {ref:'CAPA-85',title:"Update vendor bank mandate and re-verify",type:"Corrective action",owner:"Finance",date:"Overdue by 2 days",status:["red","Overdue"],stage:'S13',next:"Escalate"}
  ],
  audits:[
    {ref:'AUD-31',title:"Delta Civils & Plant Hire — site audit",type:"Site audit",owner:"Audit",date:"Planned 14 Oct",status:["blue","Planned"],stage:'S28',next:""},
    {ref:'AUD-29',title:"Kalahari Logistics — annual compliance audit",type:"Compliance audit",owner:"Audit",date:"Completed 3 weeks ago",status:["green","Completed"],stage:'S26',next:""}
  ],
  risks:[
    {ref:'RSK-410',title:"Delta Civils & Plant Hire — HSE and safety",type:"Risk (High)",owner:"Audit",date:"Rising",status:["red","High: likelihood 4 x impact 4"],stage:'S30',next:"Add mitigation"},
    {ref:'RSK-402',title:"Sable IT Networks — cybersecurity",type:"Risk (Medium)",owner:"IT Security",date:"Stable",status:["orange","Medium: 3 x 3"],stage:'S30',next:""},
    {ref:'RSK-377',title:"Kalahari Logistics — financial exposure",type:"Risk (Low)",owner:"Finance",date:"Falling",status:["green","Low: 2 x 2"],stage:'S30',next:""}
  ],
  courses:[
    {ref:'CRS-01',title:"Site Safety Induction",type:"Course",owner:"HSE Team",date:"Valid 12 months",status:["green","Published (pass mark 80%)"],stage:'S27',next:""},
    {ref:'CRS-02',title:"Working at Heights",type:"Course",owner:"HSE Team",date:"Valid 12 months",status:["green","Published (pass mark 80%)"],stage:'S27',next:""},
    {ref:'CRS-03',title:"Hot Work Permit",type:"Course",owner:"HSE Team",date:"Valid 6 months",status:["orange","Draft"],stage:'S27',next:"Publish"}
  ],
  attempts:[
    {ref:'ATT-912',title:"David K. — Site Safety Induction",type:"Test attempt",owner:"Kalahari Logistics",date:"14 months ago",status:["green","Passed: 94%"],stage:'S27',next:""},
    {ref:'ATT-905',title:"Delta Civils staff — Working at Heights",type:"Test attempt",owner:"Delta Civils & Plant Hire",date:"2 weeks ago",status:["red","Failed: 62%"],stage:'S27',next:"Allow retake"}
  ],
  connectors:[
    {ref:'CON-1',title:"AureusERP (purchasing, accounting, inventory)",type:"ERP connector",owner:"IT",date:"Last sync 5 min ago",status:["green","Connected"],stage:'-',next:""},
    {ref:'CON-2',title:"Bank account verification service",type:"Banking API",owner:"Finance",date:"Never synced",status:["grey","Not connected"],stage:'S13',next:"Connect"},
    {ref:'CON-3',title:"Tax identification number check",type:"Tax authority API",owner:"Finance",date:"Never synced",status:["grey","Not connected"],stage:'S14',next:"Connect"},
    {ref:'CON-4',title:"Inbound email (support mailbox)",type:"Email",owner:"IT",date:"Last poll 1 min ago",status:["green","Connected"],stage:'-',next:""}
  ],
  apikeys:[
    {ref:'KEY-1',title:"BI export (read vendors, read invoices)",type:"API token",owner:"IT",date:"Used 2 hours ago",status:["green","Active, expires in 90 days"],stage:'-',next:"Revoke"},
    {ref:'KEY-2',title:"Vendor portal mobile app",type:"API token",owner:"IT",date:"Used yesterday",status:["green","Active, expires in 30 days"],stage:'-',next:"Revoke"}
  ],
  webhooks:[
    {ref:'WH-1',title:"vendor.approved to https://erp.example.com/hooks/vendor",type:"Webhook",owner:"IT",date:"Last delivery 3 hours ago",status:["green","Active, signed"],stage:'S35',next:""},
    {ref:'WH-2',title:"document.expiring to https://hr.example.com/hooks/docs",type:"Webhook",owner:"IT",date:"Last delivery failed",status:["red","3 failures"],stage:'S17',next:"Retry delivery"}
  ],
  rules:[
    {ref:'RL-1',title:"Auto-escalate insurance expiring within 7 days",type:"Automation rule",owner:"Compliance",date:"Ran 2 hours ago",status:["green","Active, version 3"],stage:'S22',next:"Edit rule"},
    {ref:'RL-2',title:"Remind vendor of missing documents after 3 days",type:"Automation rule",owner:"Vendor Admin",date:"Ran today",status:["green","Active, version 2"],stage:'S17',next:"Edit rule"},
    {ref:'RL-3',title:"Route invoices over N50m to Finance Director",type:"Automation rule",owner:"Finance",date:"Never ran",status:["grey","Draft"],stage:'S43',next:"Publish"}
  ],
  suggestions:[
    {ref:'AIS-31',title:"Flag 3 possible duplicate vendor records for review",type:"Suggestion",owner:"AI Copilot",date:"Today",status:["orange","Awaiting decision"],stage:'S19',next:"Review duplicates"},
    {ref:'AIS-29',title:"Delta Civils risk likely to rise: 2 expired certificates",type:"Suggestion",owner:"AI Copilot",date:"Yesterday",status:["blue","Accepted"],stage:'S30',next:""}
  ]
});
const VF_COLS = [['ref','Reference'],['title','Title'],['type','Type'],['owner','Owner'],['date','Date'],['amount','Amount'],['status','Status']];
const VF_REQ_TYPES = {
  'Service Request':'Procurement','New Passport':'Procurement','HSE Service':'HSE Team',
  'Training Slot':'Training Team','Certificate Re-issue':'Compliance','Permit':'Compliance','Invoice':'Finance'
};
function vfStatus(s){ return '<span class="badge '+VF_BADGE[s[0]]+'">'+s[1]+'</span>'; }
function vfTable(key, grp){
  const rows = (VF[key]||[]).filter(r=>!grp || r.grp===grp);
  if(!rows.length) return '<div class="vf-empty">Nothing here yet.</div>';
  const cols = VF_COLS.filter(c=>c[0]==='ref'||c[0]==='title'||c[0]==='status'||rows.some(r=>r[c[0]]));
  return '<table class="vf-table"><thead><tr>'+cols.map(c=>'<th class="vf-c-'+c[0]+'">'+c[1]+'</th>').join('')+'<th class="actions-col"></th></tr></thead><tbody>'+
    rows.map(r=>'<tr onclick="vfOpen(\''+key+'\',\''+r.ref+'\')">'+cols.map(c=>{
      const v = c[0]==='status' ? vfStatus(r.status) : (r[c[0]]||'');
      return '<td class="vf-c-'+c[0]+(c[0]==='title'?' vf-title':'')+'">'+v+'</td>';
    }).join('')+'<td class="actions-col"><button class="action-btn" data-tip="View" onclick="event.stopPropagation();vfOpen(\''+key+'\',\''+r.ref+'\')"><i data-lucide="chevron-right"></i></button></td></tr>').join('')+
    '</tbody></table>';
}
function vfRender(){
  document.querySelectorAll('[data-vf]').forEach(el=>{ el.innerHTML = vfTable(el.dataset.vf, el.dataset.grp); paintIcons(el); });
}
const VF_EXTRA = {
  po:{'PO-8815':[['Receipt status','Fully received (receipt_status)'],['Invoice status','Invoiced (invoice_status)'],['Payment terms','30 days (payment_term_id)']],'PO-8821':[['Receipt status','Waiting (receipt_status)'],['Invoice status','To invoice (invoice_status)'],['Payment terms','30 days (payment_term_id)']]},
  invoice:{'INV-55021':[['Payment state','Paid (payment_state)'],['Payment reference','PAY-2026-0182 (payment_reference)'],['Due date','Settled']],'INV-55040':[['Payment state','Not paid (payment_state)'],['Due date','In 5 days (invoice_date_due)'],['Amount residual','₦6,240,000 (amount_residual)']],'INV-55052':[['Payment state','Draft bill (state)'],['Matched to','PO-8830, goods receipt pending']]},
  rfq:{'RFQ-1042':[['Invited by','Boitumelo P. (user_id)'],['Quotation validity','Must be valid 30 days'],['Attachments','Specification (PDF), tyre list (Excel)']],'RFQ-1050':[['Invited by','Boitumelo P. (user_id)'],['Quotation validity','Must be valid 30 days']]},
  delivery:{'DN-4471':[['Operation state','Done (state)'],['Received at','3 days ago (closed_at)']],'DN-4488':[['Operation state','Assigned (state)'],['Scheduled at','In 4 days (scheduled_at)']]}
};
Object.assign(VF_EXTRA, {
  contracts:{'CTR-2287':[['Signed','14 months ago'],['Linked award','Stage 41 award AW-1190'],['Obligations','3 open']],'CTR-2301':[['Signed','3 months ago'],['Obligations','1 open']],'CTR-2310':[['Signed','8 months ago'],['Note','Suspended until HSE findings close']]},
  findings:{'FND-221':[['Severity','High'],['Evidence','Site register photos (3)'],['Linked CAPA','CAPA-88']],'FND-219':[['Severity','Medium'],['Evidence','Bank letter dated 2024']]},
  risks:{'RSK-410':[['Likelihood','4 (Likely)'],['Impact','4 (Major)'],['Mitigation owner','HSE Team'],['Trend','Rising']],'RSK-402':[['Likelihood','3'],['Impact','3'],['Mitigation owner','IT Security'],['Trend','Stable']]},
  courses:{'CRS-01':[['Pass mark','80%'],['Validity','12 months'],['Questions','10']],'CRS-02':[['Pass mark','80%'],['Validity','12 months'],['Questions','12']]},
  connectors:{'CON-1':[['Direction','Read purchasing, accounting and inventory; link only'],['Records mirrored','None (rule R4)']],'CON-2':[['Needed for','S13 bank verification']]},
  rules:{'RL-1':[['Trigger','Document expires in 7 days'],['Action','Notify vendor and buyer, then escalate'],['Version','3 (previous kept)']],'RL-2':[['Trigger','Mandatory document still missing after 3 days'],['Action','Reminder email to vendor primary contact']]}
});
function vfOpen(key, ref){
  const r = (VF[key]||[]).find(x=>x.ref===ref);
  if(!r) return;
  document.getElementById('vfDrawerTitle').innerHTML = '<i data-lucide="file-text" style="width:16px;height:16px;color:var(--primary)"></i>'+r.ref;
  const f = (l,v,full)=> v ? '<div class="vf-f'+(full?' full':'')+'"><dt>'+l+'</dt><dd>'+v+'</dd></div>' : '';
  document.getElementById('vfDrawerBody').innerHTML =
    '<h3 style="font-size:15px;margin-bottom:10px">'+r.title+'</h3>'+
    '<dl class="vf-fields">'+f('Reference',r.ref)+f('Type',r.type)+f('Owner',r.owner)+f('Date',r.date)+f('Amount',r.amount)+f('Status',vfStatus(r.status))+
      f('Journey stage','<span class="vf-stage">'+r.stage+'</span>')+(((VF_EXTRA[key]||{})[r.ref]||[]).map(x=>f(x[0],x[1])).join(''))+'</dl>'+
    (r.actions ? '<div class="field full" style="margin-bottom:8px"><label>Reason / findings (required to reject or request information, min 5 characters)</label><textarea id="vfReason" placeholder="Write the reason…"></textarea></div>' : '')+
    '<div class="vf-actions">'+
      (r.actions ? r.actions.map(a=>'<button class="btn '+a[1]+' btn-sm" onclick="vfDecide(\''+key+'\',\''+r.ref+'\',\''+a[0]+'\')">'+a[0]+'</button>').join('') : '')+
      (!r.actions && r.next ? '<button class="btn btn-primary btn-sm" onclick="vfAct(\''+r.ref+'\',\''+r.next.replace(/'/g,'')+'\')"><i data-lucide="check"></i>'+r.next+'</button>' : '')+
      '<button class="btn btn-secondary btn-sm" onclick="closeSlidePanel(\'vfDrawer\');showPage(\'mycomms\')"><i data-lucide="message-square"></i>Ask a question</button>'+
    '</div>';
  paintIcons(document.getElementById('vfDrawer'));
  openSlidePanel('vfDrawer');
}
function vfDecide(key, ref, action){
  const reason = (document.getElementById('vfReason')||{value:''}).value.trim();
  if(action!=='Approve' && action!=='Accept' && reason.length < 5){ showToast('Findings are required (at least 5 characters) to '+action.toLowerCase(),'alert-circle'); return; }
  const r = VF[key].find(x=>x.ref===ref);
  r.status = (action==='Approve'||action==='Accept') ? ['green', action==='Accept'?'Accepted':'Approved'] : action==='Reject' ? ['red','Rejected'] : action==='Escalate' ? ['orange','Escalated to Head of Procurement'] : ['blue','Information requested'];
  delete r.actions; closeSlidePanel('vfDrawer'); vfRender();
  showToast(ref+': '+action+' recorded — added to the approval history and audit log','check');
}
function vfAct(ref, label){
  closeSlidePanel('vfDrawer');
  if(label==='Open in Communications'){ showPage('comms'); return; }
  showToast(label+' — '+ref+' sent to the buyer', 'check');
}
function vfRqRoute(){
  document.getElementById('rqRoute').value = VF_REQ_TYPES[document.getElementById('rqType').value] || '';
}
function vfNewRequest(type){
  showPage('requests');
  setTimeout(()=>{
    const sel = document.getElementById('rqType');
    if(type && VF_REQ_TYPES[type]) sel.value = type;
    vfRqRoute();
    document.querySelector('#page-requests .tab').click();
    document.getElementById('rqDetails').focus();
  }, 260);
}
let vfReqSeq = 9001;
function vfSubmitRequest(){
  const type = document.getElementById('rqType').value;
  vfReqSeq++;
  const ref = 'REQ-'+vfReqSeq;
  VF.request.unshift({ref, title:type+(document.getElementById('rqDetails').value ? ' — '+document.getElementById('rqDetails').value.slice(0,60) : ''), type, owner:VF_REQ_TYPES[type], date:'Just now', status:['blue','Submitted'], stage:'S22', next:''});
  document.getElementById('rqDetails').value = '';
  vfRender();
  document.querySelectorAll('#page-requests .tab')[1].click();
  showToast(ref+' submitted to '+VF_REQ_TYPES[type], 'check');
}

