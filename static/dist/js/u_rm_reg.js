const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");


tableOutput.style.display = "none";
const tableBody = document.querySelector(".table-body")
const noResult = document.querySelector(".no-results")


nameField.addEventListener("keyup", (e) => {
    const searchValue = e.target.value;
    if (selectedCategory.value === 'نقش')
        getData(searchValue, null, null)
    else if (selectedCategory.value !== 'نقش')
        getData(searchValue, selectedCategory.value, null)
    else
        resetFound()


});

selectedCategory.addEventListener('change', function () {
    if (this.value !== 'نقش')
        getData(nameField.value, this.value, null)
    else
        getData(nameField.value, null, null)
}, false);


function getData(searchValue, categoryValue, supplierValue) {
    if (searchValue.trim().length > 0 || categoryValue === null) {
        getUsers(searchValue, null, null)
    } else if (categoryValue !== null) {
        getUsers(null, categoryValue, null)
    } else if (searchValue.trim().length > 0 || categoryValue !== null) {
        getUsers(searchValue, categoryValue, null)
    } else if (searchValue.trim().length < 0 || categoryValue === 'نقش') {
        resetFound();
    } else {
        resetFound();
    }

}

function resetFound() {
    noResult.style.display = "none"
    tableOutput.style.display = "none"
    appTable.style.display = "block"
    paginationContainer.style.display = "block"
}

function getUsers(searchValue, categoryValue, supplierValue) {
    paginationContainer.style.display = "none";
    tableBody.innerHTML = ""
    fetch("/search_users", {
        body: JSON.stringify({nameText: searchValue, categoryValue: categoryValue, supplierValue: supplierValue}),
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            appTable.style.display = "none";
            tableOutput.style.display = "block";
            noResult.style.display = "none"

            if (data.length === 0) {
                noResult.style.display = "block"
                tableOutput.style.display = "none"
            } else {
                noResult.style.display = "none"

                data.data.forEach(item => {
                    if (item.active === false) {
                        tableBody.innerHTML += `
                                     <tr id="user-${item.id}">
                                        <td class="text-center">${item.user_email}</td>
                                        <td class="text-center">${item.first_name} ${item.last_name}</td>
                                        <td class="text-center"><span class="badge badge-success" style="font-size: 13px;">${item.group}</span></td>
                                        <td class="text-center">${item.phone_number}</td>
                                        <td class="text-center"><a href="/get_user/${item.id}" class="fa fa-edit" style="padding-top: 6px"></a></td>
                                        <td class="text-center" id="userstatussearch-${item.id}"><a href="#" class="fa fa-remove" style="padding-top: 6px;color: red" onClick="deleteUserSearch(${item.id})" ></a></td>
                                    </tr>
    
                        `
                    } else {
                        tableBody.innerHTML += `
                                     <tr id="user-${item.id}">
                                        <td class="text-center">${item.user_email}</td>
                                        <td class="text-center">${item.first_name} ${item.last_name}</td>
                                        <td class="text-center"><span class="badge badge-success" style="font-size: 13px;">${item.group}</span></td>
                                        <td class="text-center">${item.phone_number}</td>
                                        <td class="text-center"><a href="/get_user/${item.id}" class="fa fa-edit" style="padding-top: 6px"></a></td>
                                        <td class="text-center" id="userstatussearch-${item.id}"><a href="#" class="fa fa-check" style="padding-top: 6px;color: green" onClick="deleteUserSearch(${item.id})" ></a></td>
                                    </tr>
    
                        `
                    }

                });
            }
        });
}

function reviewUser(email) {

    $.ajax({
        url: '/review_user',
        data: {
            'email': email
        },
        dataType: 'json',
    })

}

function deleteUser(id) {
    var action = confirm('آیا از تغییر وضعیت فعال یا غیر فعال بودن این کاربر مظمئن هستید؟')
    if (action != false) {
        $.ajax({
            url: '/delete_user',
            data: {
                'id': id
            },
            dataType: 'json',
            success: function (data) {
                if (data.data.status === false) {
                    document.getElementById("userstatus-" + id).innerHTML = `<a href="#" class="fa fa-remove"
                                                                           style="padding-top: 6px; color: red"
                                                                           onClick="deleteUser(${data.data.id})">`;
                    alert('کاربر مورد نظر غیر فعال شد')
                } else {
                    document.getElementById("userstatus-" + id).innerHTML = `<a href="#" class="fa fa-check"
                                                                           style="padding-top: 6px; color: green"
                                                                           onClick="deleteUser(${data.data.id})">`;

                    alert('کاربر مورد نظر فعال شد')

                }
            }
        })
    }

}

function deleteUserSearch(id) {
    var action = confirm('آیا از تغییر وضعیت فعال یا غیر فعال بودن این کاربر مظمئن هستید؟')
    if (action != false) {
        $.ajax({
            url: '/delete_user',
            data: {
                'id': id
            },
            dataType: 'json',
            success: function (data) {
                if (data.data.status === false) {
                    document.getElementById("userstatussearch-" + id).innerHTML = `<a href="#" class="fa fa-remove"
                                                                           style="padding-top: 6px; color: red"
                                                                           onClick="deleteUser(${data.data.id})">`;
                    alert('کاربر مورد نظر غیر فعال شد')
                } else {
                    document.getElementById("userstatussearch-" + id).innerHTML = `<a href="#" class="fa fa-check"
                                                                           style="padding-top: 6px; color: green"
                                                                           onClick="deleteUser(${data.data.id})">`;
                    alert('کاربر مورد نظر فعال شد')

                }
            }
        })
    }
}


