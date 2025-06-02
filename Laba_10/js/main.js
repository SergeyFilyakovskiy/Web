$(function(){
  const $input = $('#city-input');
  const $info = $('#info');
  const $rawList = $('#raw-list');
  const $procList = $('#proc-list');

  function display(list, $target){
    $target.empty();
    list.forEach((c,i)=>$target.append(`<li>${i+1}. ${c}</li>`));
  }

  $('#save-btn').on('click', async ()=>{
    const text = $input.val().trim();
    if(!text){
      alert('Введите хотя бы один город');
      return;
    }
    const arr = text.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean);
    try{
      const res = await fetch('/api/save', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({cities: arr})
      });
      const j = await res.json();
      if(j.error) throw j.error;
      $info.text(`Массив сохранён. Исходных: ${j.rawCount}, обработанных: ${j.procCount}`);
    }catch(err){
      console.error(err);
      alert('Ошибка при сохранении');
    }
  });

  $('#show-raw-btn').on('click', async ()=>{
    const res = await fetch('/api/raw');
    const arr = await res.json();
    display(arr, $rawList);
  });

  $('#show-proc-btn').on('click', async ()=>{
    const res = await fetch('/api/processed');
    const arr = await res.json();
    display(arr, $procList);
  });
});