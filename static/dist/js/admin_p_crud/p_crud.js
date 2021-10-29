const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");

tableOutput.style.display = 'none';
const tableBody = document.querySelector(".table-body")
const noResult = document.querySelector(".no-results")


function handleSearch() {
    console.log(selectedCategory.value)
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
                                    <td class="text-center ">
                                        <select class="btn btn-outline-dark text-right w-100 responseSupplier-${item.id}" aria-label=".form-select-sm example" id="searchedSupplier-${item.id}">
                                        <option value="0">برند</option>
                                        </select>
                                        </td>
                                    <td class="text-center"><span class="text-center">بدون توضیحات</span></td>
                                    <td class="text-center"><span class="text-center">${item.product_unit}</span></td>
                                    <td class="text-center"><span class="text-center">${item.product_ordered_quantity}</span></td>
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
                                    <td class="text-center ">
                                        <select class="btn btn-outline-dark text-right w-100 responseSupplier-${item.id}" aria-label=".form-select-sm example" id="searchedSupplier-${item.id}">
                                        <option value="0">برند</option>
                                        </select>
                                        </td>
                                    <td class="text-center"><textarea
                                                        class="text-center rounded"
                                                        placeholder="${item.description}"
                                                        readonly style="resize: none"></textarea>
                                    <td class="text-center"><span class="text-center">${item.product_unit}</span></td>
                                    <td class="text-center"><span class="text-center">${item.product_ordered_quantity}</span></td>
                                    <td class="text-center"><a href="/get_product/${item.id}"
                                                                       class="fa fa-edit"
                                                                       style="padding-top: 6px"></a>
                                            </td>
                                </tr>

                    `
                    }
                    var brands = '';
                    var product_brands = item.product_brands
                    for (var key in product_brands) {

                        brands += '<option class="h-100" value="' + product_brands[key] + '">' + product_brands[key] + '</option>';

                    }
                    $(".responseSupplier-" + item.id).append(brands);


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



