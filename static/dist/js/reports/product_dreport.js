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

let product_name = document.getElementById('product_name')
let product_category = document.getElementById('product_category')
let product_unit = document.getElementById('product_unit')
let orders_count = document.getElementById('orders_count')
let orders_quantity = document.getElementById('orders_quantity')
let dp_sum = document.getElementById('dp_sum')
let sdp_avg = document.getElementById('sdp_avg')
let with_brand_count = document.getElementById('with_brand_count')
let no_brand_count = document.getElementById('no_brand_count')


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
                data.products.forEach(item => {

                    tableBody.innerHTML += `
                                <tr id="productSourceSearch-${item.id}">
                                    <td class="text-center"">${item.id}</td>
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;" id="searchedCategory-${item.id}">${item.category_id}</span></td>
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-list btn btn-outline-secondary" style="padding-top: 6px" onclick="PrepServerCallOut(${item.id})"></span></td>
                                </tr>

                    `
                });
            }
        });
}


function PrepServerCallOut(product_id) {
    let start_date = document.getElementById('pcal1').value
    let end_date = document.getElementById('pcal2').value
    let myproduct = {
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
                                    <td class="text-center">${numberWithCommas(item.order_sell_price)}</td>
                                    <td class="text-center">${numberWithCommas(item.order_dsell_price)}</td>
                                </tr>

                    `
                })
                product_name.innerHTML = data.product_name
                product_category.innerHTML = data.product_category
                product_unit.innerHTML = data.product_unit
                orders_count.innerHTML = data.orders_count
                orders_quantity.innerHTML = data.orders_quantity
                dp_sum.innerHTML = data.dq_sum
                sdp_avg.innerHTML = numberWithCommas(data.sdp_avg)
                with_brand_count.innerHTML = data.with_brand_count
                no_brand_count.innerHTML = data.no_brand_count

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
