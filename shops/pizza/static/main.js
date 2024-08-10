import * as server from "./server.js";
import * as ldb from "./localdb.js";

function view_product_list() {
    server.get_products_list().then(product_list => {
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
    const rldb = indexedDB.open('db', 1);

    rldb.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['basket'], 'readonly');
        const basket = transaction.objectStore('basket');
        const get_product_list = basket.getAll();
        
        get_product_list.onsuccess = function() {
            const product_list = get_product_list.result; 

            const products_container = document.querySelector('#basket-product-list');
            products_container.innerHTML = "";
            product_list.forEach(product => {
                products_container.innerHTML += `
                    <div class="product">
                        <p class="name">${product["name"]}</p>
                        <p class="quantity">x${product["qty"]}</p>
                    </div>`;
            });
        }
    }
}

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



view_filters();
view_product_list();
basket_update();


document.addEventListener('DOMContentLoaded', () => {
    // floating filter 
    const floating_filter_button = document.getElementById('filter-floating-button');
    const filter_window = document.getElementById('filter-container');
    const filter_apply_button = document.getElementById('filter-apply-button');

    floating_filter_button.addEventListener('click', () => {
        filter_window.classList.toggle('filter-container-show');
    });

    filter_apply_button.addEventListener('click', () => {
        filter_window.classList.remove('filter-container-show');
    });

    // floating basket
    const basket_window = document.getElementById('floating-basket');
    const basket_button = document.getElementById('header-basket-button');
    const basket_close_button = document.getElementById('floating-basket-header-close-button');
    const basket_order_button = document.getElementById('floating-basket-header-order-button');

    basket_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });
    basket_close_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });
    basket_order_button .addEventListener('click', () => {
        basket_window.classList.toggle('floating-basket-show');
    });


});



