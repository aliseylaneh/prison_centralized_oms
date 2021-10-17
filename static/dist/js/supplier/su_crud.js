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
    getData(searchValue)


});


function getData(searchValue) {
    if (searchValue.trim().length > 0) {
        getSuppliers(searchValue)
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

function getSuppliers(searchValue, categoryValue, supplierValue) {
    paginationContainer.style.display = "none";
    tableBody.innerHTML = ""
    fetch("/search_suppliers", {
        body: JSON.stringify({nameText: searchValue}),
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
                    tableBody.innerHTML += `
                                 <tr id="user-${item.id}">
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center">${item.margin}</td>
                                    <td class="text-center">${item.province}</td>
                                    <td class="text-center">${item.city}</td>
                                    <td class="text-center">${item.status}</td>
                                    <td class="text-center">${item.fax}</td>
                                    <td class="text-center">${item.address}</td>
                                    <td class="text-center"><a href="/get_supplier/${item.id}" class="fa fa-edit" style="padding-top: 6px"></a></td>
                                   
                                </tr>

                    `

                });
            }
        });
}

function reviewSupplier() {

    $.ajax({
        url: '/review_supplier',
        data: {
            'id': id
        },
        dataType: 'json',
    })

}

// function deleteSupplier(id) {
//     var action = confirm('آیا از پایان دادن قرار داد با این تامین کننده مطمئ‍ن هستید؟')
//     if (action != false) {
//         $.ajax({
//             url: '/delete_supplier',
//             data: {
//                 'id': id
//             },
//             dataType: 'json',
//             success: function (data) {
//                 if (data.deleted) {
//                     $("#supplierTable #supplier-" + id +"").remove()
//                 }
//             }
//         })
//     }
// }

(function () {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()

                }
                form.classList.add('was-validated')
            }, false)
        })
})()
