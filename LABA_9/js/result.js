document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('city-list');
  try {
    const res = await fetch('/api/cities/processed');
    const cities = await res.json();
    cities.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      list.appendChild(li);
    });
  } catch(err) {
    list.textContent = 'Ошибка загрузки данных';
  }
});