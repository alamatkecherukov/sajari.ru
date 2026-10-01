let uploadedImgUrl = '';
let admp = document.getElementById('admp');
const apiUrl = 'https://sajari-bot.onrender.com';
let books = [];

async function massZag() {
    let response = await fetch(`${apiUrl}/books`);
    books = await response.json();

    admp.innerHTML = `
        <div class="redaktor">
            <input type="file" id="fileInput" accept="image/*" style="display:none">
            <button id="phtInp">Загрузить фото</button>
            <input type="text" id="name1" placeholder="Название">
            <input type="text" id="opis" placeholder="Краткое описание">
            <input type="number" id="price" placeholder="Цена">
            <textarea id="fullOpis" placeholder="Полное описание"></textarea>
            <input type="text" id="mater" placeholder="Материалы">
            <button id="passADM">Создать товар</button>
        </div>
        <div id="catalog"></div>
    `;



    generateCard();
    addTovar();
    addDeleteHandler()
}

function fail() {
    admp.innerHTML = `<h1 class ="fail">Пароль неверный</h1>`;
    setTimeout(set, 1000);
}

function pass() {
    admp.innerHTML = `<img class="zagadm" src="https://gifgive.com/wp-content/uploads/2021/09/zagruzka.gif">`;
    setTimeout(massZag, 4000);
}

function generateCard() {
    let catalog = document.getElementById('catalog');
    catalog.innerHTML = '';

    for (let i = 0; i < books.length; i++) {
        let p = books[i];

        catalog.innerHTML += `
            <div class="card">
                <img src="${p.img}">
                <h2>${p.name}</h2>
                <p>${p.shortOpis}</p>
                <p>${p.price}₽</p>
                <a href="book.html?id=${p.id}">Просмотреть</a>
                <button class="delBtn" data-id="${p.id}">Удалить</button>
            </div>
        `;
    }
    
if(books.length === 0){
    admp.innerHTML += `Ничего нет`
    return;
}

}

function set() {
    admp.innerHTML = `
        <div class="admp1">
            <h1>Введите пароль</h1>
            <input id="inp" type="password" placeholder="Введите пароль">
            <button id="bth">Enter</button>
        </div>
    `;

    let bth = document.getElementById('bth');
    bth.addEventListener('click', () => {
        let inpt = document.getElementById('inp').value;

        fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: inpt })
        })
        .then(r => r.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                pass();
            } else {
                fail();
            }
        })
        .catch(() => fail());
    });
}

function addTovar() {
    let passADM = document.getElementById('passADM');
    let phtInp = document.getElementById('phtInp');
    let fileInput = document.getElementById('fileInput');

    phtInp.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
        let file = fileInput.files[0];
        if (!file) return;

        try {
            uploadedImgUrl = await uploadImage(file);
            alert('Фото загружено');
        } catch (e) {
            alert('Ошибка загрузки фото');
        }
    });

    passADM.addEventListener('click', async () => {
        let n1 = document.getElementById('name1').value;
        let opis = document.getElementById('opis').value;
        let price = document.getElementById('price').value;
        let fullOpis = document.getElementById('fullOpis').value;
        let mater = document.getElementById('mater').value;

        let token = localStorage.getItem('token');

        let response = await fetch(`${apiUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                name: n1,
                shortOpis: opis,
                price: Number(price),
                fullOpis: fullOpis,
                material: mater,
                img: uploadedImgUrl
            })
        });

        let data = await response.json();

        if (data.success) {
            alert('Книга добавлена');
            uploadedImgUrl = '';
            massZag();
        } else {
            alert('Ошибка: ' + data.error);
        }
    });
}

function addDeleteHandler() {
    let catalog = document.getElementById('catalog');

    catalog.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('delBtn')) return;

        let id = e.target.dataset.id;

        if (!confirm('Удалить книгу?')) return;

        let token = localStorage.getItem('token');

        let response = await fetch(`${apiUrl}/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });

        let data = await response.json();

        if (data.success) {
            massZag();
        } else {
            alert('Ошибка: ' + data.error);
        }
    });
}

async function uploadImage(file) {
    let formData = new FormData();
    formData.append('image', file);

    let response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
    });

    let data = await response.json();

    if (data.url) return data.url;
    throw new Error(data.error || 'Ошибка загрузки');
}

set();