/* ---------- Comms inbox ---------- */
const THREADS = [
  {title:'Kalahari Logistics — Insurance certificate renewal', sub:'Linked to Vendor Passport VP-00842', msgs:[
    ['KL','Kalahari Logistics','We\'ve requested the updated Public Liability Insurance certificate from our broker — expect it within 48 hours.'],
    ['LK','Lesego K. (Compliance)','Thanks — flagging the account so procurement holds any new PO until it\'s received.']
  ]},
  {title:'Delta Civils & Plant Hire — HSE induction re-scheduling', sub:'Linked to HSE Induction & Certification', msgs:[
    ['DC','Delta Civils & Plant Hire','Can we book the retake for Thursday morning? Our site lead was unavailable for the first slot.'],
    ['TM','Thabo M. (Procurement)','Booked for Thursday 9am. Note that new POs stay on hold until the retake is passed.']
  ]},
  {title:'Sable IT Networks — RFQ-1042 clarification', sub:'Linked to Procurement Workspace · RFQ-1042', msgs:[
    ['SI','Sable IT Networks','Confirmed, we can meet the 3-day turnaround requested in the RFQ.']
  ]}
];
function openThread(el, idx){
  document.querySelectorAll('#commsThreads .inbox-row').forEach(r=>r.classList.remove('active'));
  el.classList.add('active');
  const t = THREADS[idx];
  document.getElementById('threadTitle').textContent = t.title;
  document.getElementById('threadBody').innerHTML = t.msgs.map(m=>
    `<div class="inbox-msg"><div class="inbox-msg-av">${m[0]}</div><div><div style="font-size:12.5px;font-weight:700;margin-bottom:2px">${m[1]}</div><div class="inbox-msg-text">${m[2]}</div></div></div>`
  ).join('');
}

