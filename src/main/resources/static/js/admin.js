const urlAdmin = '/api/admin/'
const urlUser = '/api/user/'


const adminNavbar = $('#navbar');

function showAdminNavbar() {
    adminNavbar.empty()
    fetch(urlUser)
        .then(response => response.json())
        .then(data => {
            let nav = `<div class="container-fluid">
                            <span class="navbar-brand text-white">
                                <strong>${data.username}</strong>
                                    with roles:
                                <span>${getRoles(data)}</span>
                            </span>
                            <form class="form-inline" action="/logout" method="POST">
                                <input class="btn btn-link text-secondary" type="submit" value="Logout"/>
                            </form>
                         </div>`;

            adminNavbar.append(nav)
        })
}

showAdminNavbar()


const userTable = $('#user');

function showUserPage() {
    userTable.empty()
    fetch(urlUser)
        .then(response => response.json())
        .then(data => {
            let user = `$(<tr>
                              <td>${data.id}</td>
                              <td>${data.firstName}</td>
                              <td>${data.lastName}</td>
                              <td>${data.age}</td>
                              <td>${data.email}</td>
                              <td>${getRoles(data)}</td>
                          </tr>)`;

            userTable.append(user);
        })
}

showUserPage()


const allUsersTable = $('#users');

function showAllUsers() {
    allUsersTable.empty()
    fetch(urlAdmin)
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let users = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${getRoles(user)}</td>
                            <td>
                                <button type="button" class="btn btn-info text-white" data-bs-toogle="modal" 
                                data-bs-target="#editModal" onclick="editModal(${user.id})">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" data-toggle="modal"
                                data-bs-target="#deleteModal" onclick="deleteModal(${user.id})">Delete</button>
                            </td>
                        </tr>)`;

                allUsersTable.append(users);
            })
        })
}

showAllUsers();


let formNew = document.forms["formNewUser"];

function addUser() {
    formNew.addEventListener("submit", ev => {
        ev.preventDefault();

        let newUserRoles = [];

        for (let i = 0; i < formNew.roles.options.length; i++) {
            if (formNew.roles.options[i].selected) newUserRoles.push({
                id: formNew.roles.options[i].value, name: "ROLE_" + formNew.roles.options[i].text
            });
        }

        fetch(urlAdmin, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                id: formNew.id.value,
                firstName: formNew.firstName.value,
                lastName: formNew.lastName.value,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            formNew.reset();
            showAllUsers();
            $('#home-tab').click();
        });
    });
}

addUser();


const formEdit = document.forms["formEditUser"];

async function editModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#editModal'));
    modal.show();

    const user = await (await fetch(urlAdmin + id)).json();

    formEdit.id.value = user.id;
    formEdit.firstName.value = user.firstName;
    formEdit.lastName.value = user.lastName;
    formEdit.age.value = user.age;
    formEdit.email.value = user.email;
}

function editUser() {
    formEdit.addEventListener("submit", ev => {
        ev.preventDefault();

        const editRoles = [];

        for (let i = 0; i < formEdit.roles.options.length; i++) {
            if (formEdit.roles.options[i].selected) editRoles.push({
                id: formEdit.roles.options[i].value, name: "ROLE_" + formEdit.roles.options[i].text
            });
        }

        fetch(urlAdmin + formEdit.id.value, {
            method: 'PATCH', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                id: formEdit.id.value,
                firstName: formEdit.firstName.value,
                lastName: formEdit.lastName.value,
                age: formEdit.age.value,
                email: formEdit.email.value,
                password: formEdit.password.value,
                roles: editRoles
            })
        }).then(() => {
            $('#editFormCloseButton').click();
            showAllUsers();
        });
    });
}

editUser();


const formDelete = document.forms["formDeleteUser"];

async function deleteModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#deleteModal'));
    modal.show();

    const user = await (await fetch(urlAdmin + id)).json();

    formDelete.id.value = user.id;
    formDelete.firstName.value = user.firstName;
    formDelete.lastName.value = user.lastName;
    formDelete.age.value = user.age;
    formDelete.email.value = user.email;
}

function deleteUser() {
    formDelete.addEventListener("submit", ev => {
        ev.preventDefault();
        fetch(urlAdmin + formDelete.id.value, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#deleteFormCloseButton').click();
            showAllUsers();
        });
    });
}

deleteUser();


function getRoles(user) {
    let roles = []

    for (let role of user.roles) {
        roles.push(" " + role.name.toString().replaceAll('ROLE_', ''))
    }

    return roles
}