document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена');

    const form = document.getElementById('comment-form');

    if (!form) {
        console.log('Форма не найдена');
        return;
    }

    // Загружаем отзывы при загрузке страницы
    loadComments();

    // Обработчик формы
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.querySelector('.input-name').value.trim();
    const text = document.querySelector('.input-review-text').value.trim();

    if (!name || !text) {
        return;
    }

    // ВАЖНО: используем 'review-text' с дефисом, как в HTML форме
    const formData = new FormData();
    formData.append('name', name);
    formData.append('review-text', text); // ← ИЗМЕНЕНИЕ ТУТ

    console.log('Отправка данных:', { name, text });

    fetch('/reviews', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        console.log('Статус ответа:', response.status);
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(`Ошибка ${response.status}: ${text}`);
            });
        }
    })
    .then(function(data) {
        console.log('Успешный ответ:', data);
        form.reset();
        loadComments();
    })
    .catch(function(error) {
        console.error('Полная ошибка:', error);
    });
});

    // Синхронная функция загрузки комментариев
    function loadComments() {
    console.log("отработало")
        fetch('/get_reviews')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки отзывов');
                }
                return response.json();
            })
            .then(function(comments) {
                const container = document.getElementById('comments-container');
                if (!container) return;

                if (comments.length === 0) {
                    container.innerHTML = '<p>Нет отзывов</p>';
                    return;
                }

                let html = '';
                comments.forEach(function(comment) {
                    html += `
                        <div class="comment">
                            <div class="comment-header">
                                <span class="comment-author">${comment.name}</span>
                                <span class="comment-date">${new Date(comment.date).toLocaleString('ru-RU')}</span>
                            </div>
                            <div class="comment-text">${comment.text}</div>
                        </div>
                    `;
                });

                container.innerHTML = html;
            })
            .catch(function(error) {
                console.error('Ошибка загрузки:', error);
                const container = document.getElementById('comments-container');
                if (container) {
                    container.innerHTML = '<p>Ошибка загрузки отзывов</p>';
                }
            });
    }
});