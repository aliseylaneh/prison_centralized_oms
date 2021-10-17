const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");

tableOutput.style.display = 'none';
const tableBody = document.querySelector(".table-body")
const noResult = document.querySelector(".no-results")


nameField.addEventListener("keyup", (e) => {
    const searchValue = e.target.value;
    if (selectedCategory.value === 'دسته')
        getData(searchValue, null, null)
    else if (selectedCategory.value !== 'دسته')
        getData(searchValue, selectedCategory.value, null)
    else
        resetFound()


});

selectedCategory.addEventListener('change', function () {
    if (this.value !== 'دسته')
        getData(nameField.value, this.value, null)
    else
        getData(nameField.value, null, null)
}, false);


function getData(searchValue, categoryValue, supplierValue) {
    if (searchValue.trim().length > 0 || categoryValue === null) {
        getData(searchValue, null, null)
    } else if (categoryValue !== null) {
        getData(null, categoryValue, null)
    } else if (searchValue.trim().length > 0 || categoryValue !== null) {
        getData(searchValue, categoryValue, null)
    } else if (searchValue.trim().length < 0 || categoryValue === 'دسته') {
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

function getData(searchValue, categoryValue, supplierValue) {
    paginationContainer.style.display = "none";
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

                data.products.forEach(item => {

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
                                    <td class="text-center"><span class="text-center">${item.product_unit}</span></td>
                                    <td class="text-center"><span class="text-center">${item.product_ordered_quantity}</span></td>
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-edit btn btn-outline-primary" style="padding-top: 6px" onclick="editProduct(${item.id})"></span></td>
                                </tr>

                    `
                    var suppliers = '';
                    var product_suppliers = item.product_suppliers
                    for (var key in product_suppliers) {

                        suppliers += '<option class="h-100" value="' + product_suppliers[key] + '">' + product_suppliers[key] + '</option>';

                    }
                    $(".responseSupplier-" + item.id).append(suppliers);


                });
            }
        });
}

