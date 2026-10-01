const apiUrl = 'https://sajari-bot.onrender.com';

async function loadBook() {
    let id = new URLSearchParams(location.search).get('id');

    if (!id) {
        document.getElementById('bookInfo').innerHTML = '<h1>Книга не найдена</h1>';
        return;
    }

    let response = await fetch(`${apiUrl}/books/${id}`);
    
    if (!response.ok) {
        document.getElementById('bookInfo').innerHTML = '<h1>Книга не найдена</h1>';
        return;
    }

    let book = await response.json();

    let container = document.getElementById('bookInfo');
    container.innerHTML = `
        <div class="lv1book">
            <img src="${book.img}">
            <h1>${book.name}</h1>
            <p>${book.price}₽</p>
            <p>${book.shortOpis}</p>
            <p>${book.fullOpis}</p>
            <p>Материал: ${book.material}</p>

            <input id="contact" placeholder="Телефон / tg user">
            <button id="orderBtn">Заказать</button>
        </div>
    `;

    document.getElementById('orderBtn').addEventListener('click', async () => {
        let contact = document.getElementById('contact').value;

        if (!contact) {
            alert('Введите контакт');
            return;
        }

        let response = await fetch(`${apiUrl}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: book.id, contact: contact })
        });

        let data = await response.json();

        if (data.success) {
            alert('Заказ отправлен! Мастер свяжется с вами.');
        } else {
            alert('Ошибка: ' + data.error);
        }
    });
}

loadBook();