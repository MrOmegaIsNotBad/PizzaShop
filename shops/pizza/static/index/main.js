import * as server from "../server.js";
import * as ldb from "../localdb.js";

function view_product_list(search=false) {
    var search_value = document.getElementById('search-bar-input').value;

    products_list.then(data => {
        var product_list = [...data];
        const products_container = document.querySelector('#product-container');

        ldb.get(DB, 'filters_ingradient_active').then(data => {
            var ingredients_list = [];
            data.forEach(ingredient => {
                ingredients_list.push(ingredient['ingredient']);
            });

            for (var i=0; i < product_list.length; i++) {
                if (ingredients_list.length > 0 && product_list[i]['ingredients'].length == 0) {
                    delete product_list[i];
                    continue;
                }
                if ( !ingredients_list.every(e => product_list[i]['ingredients'].includes(e)) ) {
                    delete product_list[i];
                }
                if (search && search_value != "") {
                    var name = product_list[i]['name'].toLowerCase();
                    search_value = search_value.toLowerCase();
                    if (!name.includes(search_value)) {
                        delete product_list[i];
                    }
                }
            }

            ldb.get(DB, 'basket').then(data => {
                var template = '';
                product_list.forEach(product => {
                    var count = 0;
                    var p = data.filter(item => item['id'] === product['id']);
                    if (p.length > 0) {
                        count = p[0]['qty'];
                    }
                    template += `
                    <div class="product">
                        <img src="${product["image"]}">
                        <h3>${product["name"]}</h3>
                        <p>${product["description"]}</p>
                        <h3 class="price">${product["price"]} UAH</h3>
                        <div class="order_bar">
                            <button class="add" onclick="product_basket_add_remove(this, 'add', '${product["id"]}', '${product["name"]}', '${product["price"]}')">+</button><h2 class="count">${count}</h2><button class="remove" onclick="product_basket_add_remove(this, 'remove', '${product["id"]}', '${product["name"]}', '${product["price"]}')">-</button>
                        </div>
                    </div>
                    `
                });
                products_container.innerHTML = template;
            });

        });
    });
}
window.view_product_list = view_product_list;

function view_filters() {
    server.get_filters_list().then(filters_list => {
        ldb.get(DB, 'filters_ingradient_active').then(data => {
            var ingredients_list = [];
            data.forEach(ingredient => {
                ingredients_list.push(ingredient['ingredient']);
            });

            const ingredients_checkboxes = document.querySelector('#filter-ingredients-checkboxes');
            filters_list['ingredients'].forEach(ingredient => {
                var checked = 'unchecked';
                if (ingredients_list.includes(ingredient)) {
                    checked = 'checked';
                }
                
                ingredients_checkboxes.innerHTML += `
                <label class="custom-checkbox">
                    <input class="checkbox-filter-ingredients" type="checkbox", name="${ingredient}" ${checked}>
                    <span class="checkbox"></span>
                    <span class="checkbox-label-text">${ingredient}</span>
                </label>
                `
            });
            
        });
    });
}

function filters_apply () {
    let checkboxes = document.getElementsByClassName('checkbox-filter-ingredients');

    ldb.get(DB, 'filters_ingradient_active').then(ingredients_list => {
        ingredients_list.forEach(item => {
            ldb.remove(DB, 'filters_ingradient_active', item.ingredient);
            //console.log('Remove Filter:', item.ingredient);
        });

        for (var i=0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) { 
                ldb.add(DB, 'filters_ingradient_active', {'ingredient':checkboxes[i].name});
                //console.log('Add Filter:', checkboxes[i].name);
            }
        }
        view_product_list();
    });
}
window.filters_apply = filters_apply;

function product_basket_add_remove (button, action, product_id, product_name, product_price) {
    console.log(action, product_id, product_name, product_price);

    const product = button.closest('.product');
    const orderBar = product.querySelector('.order_bar');
    const countElement = orderBar.querySelector('.count');
    let count = parseInt(countElement.textContent);

    ldb.get(DB, 'basket', parseInt(product_id)).then(product => { 
        if (action === 'add') { 
            if (product) {
                ldb.add(DB, 'basket', {'id':parseInt(product_id), 'name':product_name, 'price':parseFloat(product_price), 'qty':product['qty']+1 } );
            } else {
                ldb.add(DB, 'basket', {'id': parseInt(product_id), 'name': product_name, 'price': parseFloat(product_price), 'qty': 1 } );
            }
            count += 1;
            countElement.textContent = count;
        } else if (action === 'remove') {
            if (product) {
                if (product['qty'] > 1) {
                    ldb.add(DB, 'basket', {'id':parseInt(product_id), 'name':product_name, 'price':parseFloat(product_price), 'qty':product['qty']-1 } );
                    count -= 1;
                } else {
                    count = 0;
                    ldb.remove(DB, 'basket', parseInt(product_id));
                }
            }
            countElement.textContent = count;
        }
        basket_update();
    }); 
}
window.product_basket_add_remove = product_basket_add_remove;

function basket_update() {
    ldb.get(DB, 'basket').then(product_list => {
        const products_container = document.querySelector('#basket-product-list');
        var template = '';
        var all_price = 0;
        product_list.forEach(product => {
            template += `
                <div class="product">
                    <p class="name">${product["name"]}</p>
                    <p class="quantity">x${product["qty"]}</p><br>
                    <p class="price">${product["price"]*product["qty"]} UAH</p>
                </div>
            `;
            all_price += product["price"]*product["qty"];
        });
        products_container.innerHTML = template;

        document.getElementById('basket-all-price').innerText = all_price;

        var floating_basket_button = document.getElementById('floating-basket-button');
        if (product_list.length > 0) {
            floating_basket_button.style.display = 'flex';
        } else {
            floating_basket_button.style.display = 'none';
        }

    });
}
function basket_clear() {
    ldb.get(DB, 'basket').then(product_list => {
        product_list.forEach(product => {
            ldb.remove(DB, 'basket', product['id']);
        });
        basket_update();
        view_product_list();
    });
}
window.basket_clear = basket_clear;

function basket_order() {
    ldb.get(DB, 'basket').then(product_list => {
        var order = {'products':[]}; 
        product_list.forEach(product => {
            order['products'].push({'id': product['id'], 'qty': product['qty']});
        });
        server.push_order(order);
        basket_clear();
    });
}
window.basket_order = basket_order;


const DB = ldb.open('db', 1);
ldb.set(DB, {
    'basket': {
        'key': 'id',
        'fields': [
            {'name': 'name', 'params':{'unique': false}},
            {'name': 'price', 'params':{'unique': false}},
            {'name': 'qty', 'params':{'unique': false}}
        ]
    },
    'filters_ingradient_active': {
        'key': 'ingredient',
        'fields': [
            {'name': 'ingredient', 'params':{'unique': false}}
        ]
    }
});

const products_list = server.get_products_list();


view_filters();
view_product_list();
basket_update();


document.addEventListener('DOMContentLoaded', () => {
    // floating filter button 
    const floating_filter_button = document.getElementById('filter-floating-button');
    const filter_window = document.getElementById('filter-container');
    const filter_apply_button = document.getElementById('filter-apply-button');

    floating_filter_button.addEventListener('click', () => {
        filter_window.classList.toggle('filter-container-show');
    });

    filter_apply_button.addEventListener('click', () => {
        filter_window.classList.remove('filter-container-show');
    });

    // floating basket button
    const basket_window = document.getElementById('floating-basket');
    const basket_button = document.getElementById('floating-basket-button');
    const basket_close_button = document.getElementById('floating-basket-header-close-button');
    const basket_clear_button = document.getElementById('floating-basket-header-clear-button');
    const basket_order_button = document.getElementById('floating-basket-order-button');

    basket_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });
    basket_close_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });
    basket_clear_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });
    basket_order_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });

});



