function showImage() {
  const caption = document.getElementById("caption").value;
  const width = document.getElementById("width").value;
  const borderColor = document.getElementById("borderColor").value;
  const opacity = document.getElementById("opacity").value;
  const image = document.getElementById("image").value;

  const win = window.open('', '', 'width=600,height=600');
  win.document.write(`
    <html>
    <head>
      <title>Результат</title>
    </head>
    <body style="font-family: Arial; padding: 20px;">
      <h2>${caption}</h2>
      <img src="../resource/${image}" style="width:${width}; border: 5px solid ${borderColor}; opacity:${opacity};">
      <ul>
        <li>Надпись: ${caption}</li>
        <li>Ширина: ${width}</li>
        <li>Цвет рамки: ${borderColor}</li>
        <li>Прозрачность: ${opacity}</li>
        <li>Файл: ${image}</li>
      </ul>
    </body>
    </html>
  `);
}
