function startCorusel() {
    // Скрываем 4-й и 5-й элементы сразу при запуске
    document.getElementById("pelmen-pos-4").style.display = 'none';
    document.getElementById("pelmen-pos-5").style.display = 'none';

    setInterval(function() {
        let pos1 = document.getElementById("pelmen-pos-1");
        let pos2 = document.getElementById("pelmen-pos-2");
        let pos3 = document.getElementById("pelmen-pos-3");
        let pos4 = document.getElementById("pelmen-pos-4");
        let pos5 = document.getElementById("pelmen-pos-5");

        // Временно показываем скрытые элементы
        pos4.style.display = 'block';
        pos5.style.display = 'block';

        // Сохраняем HTML содержимое
        const html1 = pos1.innerHTML;
        const html2 = pos2.innerHTML;
        const html3 = pos3.innerHTML;
        const html4 = pos4.innerHTML;
        const html5 = pos5.innerHTML;

        // Сразу скрываем обратно
        pos4.style.display = 'none';
        pos5.style.display = 'none';

        // Ротируем содержимое
        pos1.innerHTML = html2;
        pos2.innerHTML = html3;
        pos3.innerHTML = html4;
        pos4.innerHTML = html5;
        pos5.innerHTML = html1;
    }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting carousel');
    startCorusel();
});