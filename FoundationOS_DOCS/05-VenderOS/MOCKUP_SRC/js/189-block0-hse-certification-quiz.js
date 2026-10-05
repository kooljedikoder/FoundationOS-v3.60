/* ---------- HSE certification quiz ---------- */
function submitHseQuiz(){
  const qs = document.querySelectorAll('#hseQuizForm .quiz-q');
  let correct = 0;
  qs.forEach(q=>{
    const name = q.querySelector('input').name;
    const picked = document.querySelector(`input[name="${name}"]:checked`);
    const val = picked ? picked.value : null;
    q.querySelectorAll('.quiz-opt').forEach(opt=>{
      const input = opt.querySelector('input');
      opt.classList.remove('correct','wrong');
      if(input.value === q.dataset.correct) opt.classList.add('correct');
      else if(input===picked) opt.classList.add('wrong');
    });
    if(val === q.dataset.correct) correct++;
  });
  const score = Math.round(correct / qs.length * 100);
  const pass = score >= 70;
  document.getElementById('hseQuizForm').style.opacity = '.55';
  document.getElementById('hseQuizForm').style.pointerEvents = 'none';
  const result = document.getElementById('hseResult');
  result.classList.add('show', pass ? 'pass':'fail');
  result.classList.remove(pass ? 'fail':'pass');
  document.getElementById('hseScoreText').textContent = score+'%';
  document.getElementById('hseResultLabel').textContent = pass ? 'Passed — certificate issued' : 'Not yet passed';
  document.getElementById('hseResultSub').textContent = pass
    ? 'Site Safety Induction certificate has been added to this vendor\'s Passport, valid for 12 months.'
    : 'A minimum of 70% is required. Review the highlighted answers and retake the test.';
  paintIcons(result);
  showToast(pass ? 'Certificate issued' : 'Test not passed', pass?'award':'alert-circle');
}
function resetHseQuiz(){
  document.getElementById('hseQuizForm').style.opacity = '1';
  document.getElementById('hseQuizForm').style.pointerEvents = 'auto';
  document.querySelectorAll('#hseQuizForm input[type=radio]').forEach(i=>i.checked=false);
  document.querySelectorAll('#hseQuizForm .quiz-opt').forEach(o=>o.classList.remove('correct','wrong'));
  document.getElementById('hseResult').classList.remove('show','pass','fail');
}

