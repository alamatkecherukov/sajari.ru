const apiUrl = 'https://sajari-bot.onrender.com';

async function loadCatalog() {
    let response = await fetch(`${apiUrl}/books`);
    let books = await response.json();

    let catalog = document.getElementById('catalog');
    catalog.innerHTML = '';

    if (books.length === 0) {
        catalog.innerHTML = '<h2>Товаров нет</h2>';
        return;
    }

    for (let i = 0; i < books.length; i++) {
        let p = books[i];

        catalog.innerHTML += `

                <a href="book.html?id=${p.id}" class="card">                    <img src="${p.img}">
                <h2>${p.name}</h2>
                <p>${p.shortOpis}</p>
                <p>${p.price}₽</p>
                <p style = "background: #234C6A; padding: 2%; border-radius: 10px; color: #fff;">Заказать</p>
            </a>

        `;
    }
}

loadCatalog();