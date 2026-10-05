/* ---------- Dynamic page builder ---------- */
let builderFields = [];
let builderSeq = 0;
function addBuilderField(label, type, icon){
  builderSeq++;
  builderFields.push({id:builderSeq, label:label+' '+builderSeq, type});
  renderBuilder();
  showToast(label+' added to canvas','plus');
}
function removeBuilderField(id){
  builderFields = builderFields.filter(f=>f.id!==id);
  renderBuilder();
}
function renderBuilder(){
  const canvas = document.getElementById('builderCanvas');
  canvas.innerHTML = builderFields.length ? builderFields.map(f=>
    `<div class="canvas-field"><i data-lucide="file-text"></i><span class="cf-name">${f.label}</span><span class="cf-type">${f.type}</span><button class="cf-remove" onclick="removeBuilderField(${f.id})"><i data-lucide="x"></i></button></div>`
  ).join('') : '<p style="font-size:12.5px;color:var(--muted);text-align:center;padding:30px 10px">Click a field type on the left to add it here.</p>';
  document.getElementById('schemaPreview').textContent = JSON.stringify(
    builderFields.map(f=>({field:f.label, type:f.type})), null, 2
  );
  paintIcons(canvas);
}
function publishForm(){
  if(!builderFields.length){ showToast('Add at least one field before publishing','alert-circle'); return; }
  showToast(builderFields.length+'-field form published to Supplier Assessment','check');
}

