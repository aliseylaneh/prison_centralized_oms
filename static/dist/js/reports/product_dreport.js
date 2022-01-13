const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
const tableOutput = document.querySelector(".table-output");
tableOutput.style.display = 'none';
const tableBody = document.querySelector(".table-body")
const priceTable = document.querySelector('.prisonTable')
const supplierTable = document.querySelector('.supplierTable')
const requestTable = document.querySelector('.requestTable')
const priceTableHeader = document.getElementById('priceTableHeader')

let supplierCounter = document.getElementById('suppliercount')
let brandCounter = document.getElementById('brandcount')
let requestCounter = document.getElementById('requestcount')
let bpAvg = document.getElementById('averagebuyprice')
let spAvg = document.getElementById('averagesellprice')
let mostUsedSupplier = document.getElementById('mostsubmitted')
let latestSuppleir = document.getElementById('lastsupplier')


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
    tableOutput.style.display = "none"
    priceTableHeader.style.display = "none"
    resultTable.innerHTML = ''
    selectedCategory.selectedIndex = 0
    nameField.value = ''


}

function clearDates() {
    document.getElementById('pcal1').value = '';
    document.getElementById('pcal2').value = '';
}

function backTable() {
    tableOutput.style.display = "block"
    priceTableHeader.style.display = "none"
    requestTable.innerHTML = ''
    priceTable.innerHTML = ''
    supplierTable.innerHTML = ''
}


function getProducts(searchValue, categoryValue, supplierValue) {
    priceTableHeader.style.display = "none"
    tableBody.innerHTML = ""
    $("#loadingBar").show()
    fetch("/search_products", {
        body: JSON.stringify({nameText: searchValue, categoryValue: categoryValue, supplierValue: supplierValue}),
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            tableOutput.style.display = "block";
            if (data.length === 0) {
                tableOutput.style.display = "none"
            } else {
                $("#loadingBar").hide()
                var suppliers = '';
                var product_suppliers = data.products[0].product_suppliers
                for (var key in product_suppliers) {

                    suppliers += '<option class="h-100" value="' + product_suppliers[key] + '">' + product_suppliers[key] + '</option>';

                }
                data.products.forEach(item => {

                    tableBody.innerHTML += `
                                <tr id="productSourceSearch-${item.id}">
                                    <td class="text-center"">${item.id}</td>
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;" id="searchedCategory-${item.id}">${item.category_id}</span></td>
                                    <td class="text-center ">
                                        <select class="btn btn-outline-dark text-right w-100 responseSupplier-${item.id}" aria-label=".form-select-sm example" id="searchedSupplier-${item.id}">
                                        <option value="بدون تامین کننده">تامین کننده</option>
                                            ${suppliers}
                                        </select>
                                        </td>
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-list btn btn-outline-secondary" style="padding-top: 6px" onclick="PrepServerCallOut(${item.id})"></span></td>
                                </tr>

                    `
                });
            }
        });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrepServerCallOut(product_id) {
    let supplier_id = document.getElementById('searchedSupplier-' + product_id).value
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    let myproduct = {
        'supplier_id': supplier_id,
        'product_id': product_id,
        'start_date': start_date,
        'end_date': end_date
    }
    priceTable.innerHTML = '';
    supplierTable.innerHTML = '';
    requestTable.innerHTML = '';
    $.ajax({
        url: '/search_detailed_product',
        data: JSON.stringify(myproduct),
        dataType: 'json',
        method: 'POST',
        success: function (data) {
            if (data.orders_count !== 0) {
                priceTableHeader.style.display = "block"
                tableOutput.style.display = "none"
                data.prisons_response.forEach(item => {
                    priceTable.innerHTML += `
                                <tr>
                                    <td class="text-center"">${item.prison_name}</td>
                                    <td class="text-center">${item.order_counter}</td>
                                    <td class="text-center"">${item.order_quantity}</td>
                                </tr>

                    `
                })
                data.suppliers_response.forEach(item => {
                    supplierTable.innerHTML += `
                                <tr>
                                    <td class="text-center"">${item.supplier_name}</td>
                                    <td class="text-center">${item.order_counter}</td>
                                    <td class="text-center"">${item.order_quantity}</td>
                                </tr>

                    `
                })
                data.requests_response.forEach(item => {
                    requestTable.innerHTML += `
                                <tr>
                                    <td class="text-center"">${item.request_number}</td> 
                                    <td class="text-center">${item.request_prison}</td>
                                    <td class="text-center"">${item.request_branch}</td>
                                    <td class="text-center"">${item.order_supplier}</td>
                                    <td class="text-center">${item.order_brand}</td>
                                    <td class="text-center"">${item.order_quantity}</td>
                                    <td class="text-center"">${item.order_delivered_quantity}</td>
                                    <td class="text-center">${item.order_sell_price}</td>
                                    <td class="text-center">${item.order_dsell_price}</td>
                                </tr>

                    `
                })
                supplierCounter.innerHTML = data.supplier_count
                brandCounter.innerHTML = data.brand_count
                requestCounter.innerHTML = data.request_count
                bpAvg.innerHTML = numberWithCommas(data.buy_price_avg)
                spAvg.innerHTML = numberWithCommas(data.sell_price_avg)
                mostUsedSupplier.innerHTML = data.most_supplier
                latestSuppleir.innerHTML = data.latest_supplier


            } else {
                window.alert("اطلاعاتی درمورد کالای مورد نظر در قیمت سفارشات وجود ندارد")
            }
        }
    })

}

$(window).keypress(function (event) {
    switch (event.keyCode) {

        case 13:
            handleSearch();
            break;

    }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrintElem() {

    window.print()
}
