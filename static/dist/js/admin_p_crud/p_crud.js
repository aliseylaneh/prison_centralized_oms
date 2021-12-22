const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
let deliverDate = document.getElementById('dtp')
const selectedPrison = document.querySelector("#selected-prison");
const selectedBranch = document.querySelector("#selected-branch");

const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");

tableOutput.style.display = 'none';
const tableBody = document.querySelector(".table-body")
const noResult = document.querySelector(".no-results")


function handleSearch() {
    if (selectedCategory.value === 'دسته') {
        if (nameField.value.trim().length > 0)
            getData(nameField.value, null, null)
    } else {
        if (nameField.value.trim().length > 0)
            getData(nameField.value, selectedCategory.value, null)
        else
            getData('', selectedCategory.value, null)
    }
}

function getData(searchValue, categoryValue, supplierValue) {
    getProducts(searchValue, categoryValue, supplierValue)

}

function resetFound() {
    noResult.style.display = "none"
    tableOutput.style.display = "none"
    appTable.style.display = "block"
    paginationContainer.style.display = "block"
}

function getProducts(searchValue, categoryValue, supplierValue) {
    paginationContainer.style.display = "none";
    $("#loadingBar").show()
    tableBody.innerHTML = ""
    fetch("/search_products", {
        body: JSON.stringify({nameText: searchValue, categoryValue: categoryValue, supplierValue: supplierValue}),
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            appTable.style.display = "none";
            tableOutput.style.display = "block";
            noResult.style.display = "none"

            if (data.length === 0) {
                noResult.style.display = "block"
                tableOutput.style.display = "none"
            } else {
                noResult.style.display = "none"
                $("#loadingBar").hide()
                data.products.forEach(item => {

                    if (item.description == null || item.description.length === 0) {
                        tableBody.innerHTML += `
                                <tr id="productSourceSearch-${item.id}">
                                    <td class="text-center"">${item.id}</td>
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;" id="searchedCategory-${item.id}">${item.category_id}</span></td>
                                    <td class="text-center"><span class="text-center">بدون توضیحات</span></td>
                                    <td class="text-center"><span class="text-center">${item.product_unit}</span></td>
                                    <td class="text-center"><a href="/get_product/${item.id}"
                                                                       class="fa fa-edit"
                                                                       style="padding-top: 6px"></a>
                                            </td>
                                </tr>

                    `
                    } else {
                        tableBody.innerHTML += `
                                <tr id="productSourceSearch-${item.id}">
                                    <td class="text-center"">${item.id}</td>
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;" id="searchedCategory-${item.id}">${item.category_id}</span></td>
                                    <td class="text-center"><textarea
                                                        class="text-center rounded"
                                                        placeholder="${item.description}"
                                                        readonly style="resize: none"></textarea>
                                    <td class="text-center"><span class="text-center">${item.product_unit}</span></td>
                                    <td class="text-center"><a href="/get_product/${item.id}"
                                                                       class="fa fa-edit"
                                                                       style="padding-top: 6px"></a>
                                            </td>
                                </tr>

                    `
                    }


                });
            }
        });
}


$(window).keypress(function (event) {
    switch (event.keyCode) {

        case 13:
            handleSearch();
            break;

    }
});

function handleSearchRequest(flag) {
    if (selectedPrison.value === "بنیاد" && selectedBranch.value === "زندان" && nameField.value === '') {
    } else {
        getRequests(selectedPrison.value, selectedBranch.value, nameField.value, '', flag)
    }


}

function handleSearchRequestExpert(flag) {
    if (selectedPrison.value === "بنیاد" && selectedBranch.value === "زندان" && nameField.value === '') {
    } else {
        getRequestsForExpert(selectedPrison.value, selectedBranch.value, nameField.value, '', flag)
    }


}


function resetRequestFound() {
    noResult.style.display = "none"
    tableOutput.style.display = "none"
    appTable.style.display = "block"
    paginationContainer.style.display = "block"
}

function getRequests(prison, branch, number, date, flag) {
    paginationContainer.style.display = "none";
    $("#loadingBar").show()
    tableBody.innerHTML = ""
    fetch("/search_requests", {
        body: JSON.stringify({prison: prison, branch: branch, number: number, date: date, flag: flag}),
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            appTable.style.display = "none";
            tableOutput.style.display = "block";

            if (data.length === 0) {
                noResult.style.display = "block"
                tableOutput.style.display = "none"
            } else {

                $("#loadingBar").hide()
                data.requests.forEach(item => {


                    tableBody.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.number}</td>
                                            <td class="text-center">${item.prison}</td>
                                            <td class="text-center"><label
                                                    class="badge badge-secondary"
                                                    style="font-size: 13px;">${item.status}</label>
                                            </td>
                                            <td class="text-center"><label class="badge badge-info"
                                                                           style="font-size: 13px;">${item.sstatus}</label>
                                            </td>

                                            <td class="text-center"><span
                                                    class="text-center">${item.branch}</span>
                                            </td>

                                            <td class="text-center"><span
                                                    class="">${item.created_date_time} ${item.created_date} </span>
                                            </td>
                                            <td class="text-center"><span
                                                    class="">${item.submitted_time} ${item.submitted_date}</span>
                                            </td>
                                            <td class="text-center"><a href="/get_request/${item.number}"
                                                                       class="fa fa-check"
                                                                       style="padding-top: 6px"></a>
                                            </td>



                                        </tr>

                    `


                });
            }
        });
}

function getRequestsForExpert(prison, branch, number, date, flag) {
    paginationContainer.style.display = "none";
    $("#loadingBar").show()
    tableBody.innerHTML = ""
    fetch("/search_requests", {
        body: JSON.stringify({prison: prison, branch: branch, number: number, date: date, flag: flag}),
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            appTable.style.display = "none";
            tableOutput.style.display = "block";

            if (data.length === 0) {
                noResult.style.display = "block"
                tableOutput.style.display = "none"
            } else {

                $("#loadingBar").hide()
                data.requests.forEach(item => {


                    tableBody.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.number}</td>
                                            <td class="text-center">${item.prison}</td>
                                            <td class="text-center"><label
                                                    class="badge badge-secondary"
                                                    style="font-size: 13px;">${item.status}</label>
                                            </td>
                                            <td class="text-center"><label class="badge badge-info"
                                                                           style="font-size: 13px;">${item.sstatus}</label>
                                            </td>

                                            <td class="text-center"><span
                                                    class="text-center">${item.branch}</span>
                                            </td>

                                            <td class="text-center"><span
                                                    class="">${item.created_date_time} ${item.created_date} </span>
                                            </td>
                                            <td class="text-center"><span
                                                    class="">${item.submitted_time} ${item.submitted_date}</span>
                                            </td>
                                            <td class="text-center"><a href="/get_request/${item.number}/supplier_orders"
                                                                       class="fa fa-check"
                                                                       style="padding-top: 6px"></a>
                                            </td>



                                        </tr>

                    `


                });
            }
        });
}


