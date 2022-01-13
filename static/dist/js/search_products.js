const nameField = document.querySelector("#nameField");
const categoryField = document.querySelector("#categoryField");
const selectedCategory = document.getElementById("selected-category");
const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");
tableOutput.style.display = 'none';
const tableBody = document.querySelector(".table-body")
const noResult = document.querySelector(".no-results")
const priceTable = document.querySelector('.priceTable')


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
    tableBody.innerHTML = ""
    $("#loadingBar").show()
    fetch("/search_products", {
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
                $("#loadingBar").hide()
                data.products.forEach(item => {

                    tableBody.innerHTML += `
                                <tr id="productSourceSearch-${item.id}">
                                    <td class="text-center"">${item.id}</td>
                                    <td class="text-center">${item.name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;" id="searchedCategory-${item.id}">${item.category_id}</span></td>
                                    <td class="text-center ">
                                        <select class="btn btn-outline-dark text-right w-100 responseSupplier-${item.id}" aria-label=".form-select-sm example" id="searchedSupplier-${item.id}">
                                        <option value="بدون تامین کننده">تامین کننده</option>
                                        
                                        </select>
                                        </td>
                                    <td class="text-center ">
                                        <select class="btn btn-outline-dark text-right w-100 responseBrand-${item.id}" aria-label=".form-select-sm example" id="searchedBrand-${item.id}">
                                        <option value="بدون برند">برند</option>
                                        
                                        </select>
                                        </td>
                                    <td class="text-center"><input min="0" type="number" class="text-center" placeholder="${item.product_unit}"></td>
                                    <td class="text-center"><input min="0" type="number" class="text-center" placeholder="نقدی "></td>
                                    <td class="text-center"><input min="0" type="number" class="text-center" placeholder="دو ماهه"></td>
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-shopping-cart btn btn-outline-secondary" style="padding-top: 6px" onclick="transferRowSearch(${item.id})"></span></td>
                                </tr>

                    `
                    var suppliers = '';
                    var product_suppliers = item.product_suppliers
                    for (var key in product_suppliers) {

                        suppliers += '<option class="h-100" value="' + product_suppliers[key] + '">' + product_suppliers[key] + '</option>';

                    }
                    $(".responseSupplier-" + item.id).append(suppliers);

                    var brands = '';
                    var product_brands = item.product_brands
                    for (var key in product_brands) {

                        brands += '<option class="h-100" value="' + product_brands[key] + '">' + product_brands[key] + '</option>';

                    }
                    $(".responseBrand-" + item.id).append(brands);


                });
            }
        });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function getPrice(product_id, order_id) {
    let supplier = document.getElementById('requestSupplier-' + order_id).value
    let brand = document.getElementById('requestBrand-' + order_id).value
    let myproduct = {
        'supplier_id': supplier,
        'product_id': product_id,
        'brand_id': brand
    }
    priceTable.innerHTML = '';
    $.ajax({
        url: '/get_product_price',
        data: JSON.stringify(myproduct),
        dataType: 'json',
        method: 'POST',
        success: function (data) {
            data.data.forEach(item => {
                if (item.price2m !== 0)
                    margin = ((item.price2m - item.price) / item.price2m) * 100
                priceTable.innerHTML += `
                                <tr>
                                    <td class="text-center"">${item.supplier_name}</td>
                                    <td class="text-center"">${item.product_name}</td>
                                    <td class="text-center">${item.brand_name}</td>
                                    <td class="text-center"">${numberWithCommas(item.price)} ریال</td>
                                    <td class="text-center"">${numberWithCommas(item.price2m)} ریال</td>
                                    <td class="text-center">${margin.toFixed(2)}</td>
                                    <td class="text-center"">${item.created_date}</td>
                                </tr>

                    `
            })

        }
    })

}


function submitProductSupplierPrice(product_id, order_id, request_id) {
    let productDest = document.getElementById("productDestination-" + order_id)
    let supplier = document.getElementById('requestSupplier-' + order_id).value
    let brand = document.getElementById('requestBrand-' + order_id).value
    let quantity = productDest.childNodes[11].childNodes[0].value
    let price = productDest.childNodes[13].childNodes[0].value
    let price2m = productDest.childNodes[15].childNodes[0].value
    if (supplier !== 'بدون تامین کننده') {
        let tempDictUpdate = {
            'request_id': request_id,
            'product_id': product_id,
            'supplier_name': supplier,
            'brand_name': brand,
            'price': price,
            'price2m': price2m,
        }
        let alert = confirm("آیا از ثبت این قیمت مطمئن هستید؟")
        if (alert !== false) {
            $.ajax({
                url: '/add_supplier_price',
                data: JSON.stringify(tempDictUpdate),
                dataType: 'json',
                method: 'post',
                success: function (data) {
                }
            })
        }
    } else {
        window.alert('برای ثبت قیمت جدید باید تامین کننده ای را انتخاب کنید')
    }
}

$(window).keypress(function (event) {
    switch (event.keyCode) {

        case 13:
            handleSearch();
            break;

    }
});
