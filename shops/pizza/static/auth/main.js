import * as server from "../server.js";

function login() {
    //{'csrfmiddlewaretoken': ['6y3ZpJR1mf4Ro2NwBWqhMMx5bqaR2rgQ3lnQINQWgOK6kmsBkj0sveHJz5UXgvRz'], 'username': ['sdfsd'], 'password': ['sdfsfd']}
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    server.login(CSRF_TOKEN, username, password);
}
window.login = login;

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;
    if (password === password_confirm) {
        server.register(username, password);
    } else {
        alert('Wrong Password')
    }
}
window.register = register;


//https://medium.com/@devsumitg/django-auth-user-signup-and-login-7b424dae7fab