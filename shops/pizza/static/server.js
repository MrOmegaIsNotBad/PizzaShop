export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function send_data_on_server (endpoint, data) {
    fetch('/'+endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') 
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log(response.json());
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/*
export function login(csrf_token, username, password) {
    return fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'csrfmiddlewaretoken': [csrf_token],
            'username': [username],
            'password': [password]
        })
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error login:', error);
        return null;
    });
}
export function register(username, password) {
    return fetch('/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'username': username,
            'password': password
        })
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error login:', error);
        return null;
    });
}
*/

export function get_products_list() {
    return fetch('/api/get-products-list/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error fetching product list:', error);
        return null; 
    });
}

export function get_filters_list() {
    return fetch('/api/get-filters-list/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error fetching filters list:', error);
        return null; 
    });
}

export function get_orders_by_user_id (user_id) {
    return fetch('/api/get-orders-by-user-id/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({'user_id': user_id}),
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error fetching orders list:', error);
        return null; 
    });
}

export function push_order(order) {
    return fetch('/api/push-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(order),
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error fetching order:', error);
        return null; 
    });
}

export function user_detail_change(field) {
    return fetch('/api/user-detail-change/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(field),
    })
    .then(response => response.json())
    .then(data => data.result)
    .catch(error => {
        console.error('Error fetching order:', error);
        return null; 
    });
}