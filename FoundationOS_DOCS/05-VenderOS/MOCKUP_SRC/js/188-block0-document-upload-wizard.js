/* ---------- Document upload wizard ---------- */
let docStep = 1;
function docWizardRender(){
  document.querySelectorAll('#docModal .wizard-body').forEach(b=>b.classList.remove('active'));
  document.getElementById('dbody-'+docStep).classList.add('active');
  document.querySelectorAll('#docStepper .step').forEach(s=>{
    const n = parseInt(s.dataset.dstep);
    s.classList.remove('done','current');
    if(n < docStep) s.classList.add('done');
    else if(n === docStep) s.classList.add('current');
  });
  document.getElementById('docBackBtn').style.visibility = docStep===1 ? 'hidden' : 'visible';
  document.getElementById('docNextBtn').innerHTML = docStep===3
    ? '<i data-lucide="check"></i>Done'
    : 'Next<i data-lucide="chevron-right"></i>';
  paintIcons(document.getElementById('docModal'));
}
function docWizardNext(){
  if(docStep < 3){ docStep++; docWizardRender(); return; }
  closeModal('docModal');
  showToast('Document uploaded and queued for verification','folder');
}
function docWizardBack(){ if(docStep>1){ docStep--; docWizardRender(); } }
function docWizardReset(){ docStep = 1; docWizardRender(); }

