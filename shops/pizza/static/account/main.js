import * as server from "../server.js";

function view_orders_list() {
    const products_container = document.getElementById('ordes-list');
    const get_orders = server.get_orders_by_user_id(USER_ID);
    get_orders.then(orders => {
        var template = ''
        orders['orders'].forEach(order => {
            var status = 'None';
            if (order['status'] === 'cooking') {
                status = 'Приготовление';
            } else if (order['status'] === 'delivery') {
                status = 'Доставка';
            }
            template += `
                <dev class="item">
                    <p class="name">${order['name']}</p>
                    <p class="qty">X${order['qty']}</p>
                    <p class="status">${status}</p>
                </dev>
            `
        });
        if (template === '') {
            template = '<h3 align="center">Пусто</h3>'
        }
        products_container.innerHTML = template;
    })
}

function field_changer(field) {
    field_change_active = field;
    var window = document.getElementById('field-changer');
    var title = document.getElementById('field-changer-title');
    var input = document.getElementById('field-changer-field');
    input.value = "";
    window.style.display = 'flex';

    if (field === 'phone') {
        title.textContent = 'Номер телефона';
        input.value = PHONE;
    } else if (field === 'address') {
        title.textContent = 'Адрес';
        input.value = ADDRESS;
    }
}
window.field_changer = field_changer;

function field_changer_close() {
    var window = document.getElementById('field-changer');
    window.style.display = 'none';
}
window.field_changer_close = field_changer_close;

function field_change() {
    var input = document.getElementById('field-changer-field');
    server.user_detail_change({'field': field_change_active, 'value': input.value}).then(e => {
        window.location.reload();
    });
    field_changer_close();
}
window.field_change = field_change;


var field_change_active = null;

view_orders_list();