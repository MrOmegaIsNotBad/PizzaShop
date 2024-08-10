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

export function get_products_list() {
    return fetch('/get-products-list/', {
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
    return fetch('/get_filters_list/', {
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