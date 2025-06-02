// Модуль бизнес‑логики: обработка массива городов
const raw = [
  "minsk",
  "Москва",
  "london",
  "Алматы",
  "berlin",
  "rome"
];

// Делает первую букву заглавной
function capitalize(word) {
  if (!word) return word;
  return word[0].toUpperCase() + word.slice(1);
}

// Возвращает новый массив с заглавной первой буквой и отсортированный
function processed() {
  return raw.map(capitalize).sort((a, b) => a.localeCompare(b, 'ru'));
}

module.exports = { raw, processed };