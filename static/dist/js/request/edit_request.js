var table2 = document.getElementById("tableDestination");

function removeProductServerCallOut(id) {
    let alert = confirm("آیا از حذف این کالای سفارش شده مطمئن هستید؟")
    if (alert != false) {
        let order = {'order_id': id}
        $.ajax({
            url: '/remove_order_request',
            data: JSON.stringify(order),
            dataType: 'json',
            method: 'delete',
            success: function () {
                deleteProduct(id)
            }
        })
    }

}

function submitProductServerCallOut(id) {
    let productDest = document.getElementById("productDestination-" + id)
    let supplier = document.getElementById('requestSupplier-' + id).value
    let brand = document.getElementById('requestBrand-' + id).value
    let quantity = productDest.childNodes[11].childNodes[0].value
    let price = productDest.childNodes[13].childNodes[0].value
    let price_2m = productDest.childNodes[15].childNodes[0].value

    let tempDictUpdate = {
        'order_id': id,
        'supplier': supplier,
        'brand': brand,
        'quantity': quantity,
        'price': price,
        'price_2m': price_2m,
    }
    let alert = confirm("آیا از ویرایش این کالای سفارش شده مطمئن هستید؟")
    if (alert != false) {
        $.ajax({
            url: '/update_order_request',
            data: JSON.stringify(tempDictUpdate),
            dataType: 'json',
            method: 'put',
            success: function (data) {
            }
        })
    }
}

function submitProductServerCallOutStaff(id) {
    let productDest = document.getElementById("productDestination-" + id)
    let supplier = document.getElementById('requestSupplier-' + id).value
    let brand = document.getElementById('requestBrand-' + id).value
    let quantity = productDest.childNodes[11].childNodes[0].value

    let tempDictUpdate = {
        'order_id': id,
        'supplier': supplier,
        'brand': brand,
        'quantity': quantity,
    }
    let alert = confirm("آیا از ویرایش این کالای سفارش شده مطمئن هستید؟")
    if (alert != false) {
        $.ajax({
            url: '/update_order_request_staff',
            data: JSON.stringify(tempDictUpdate),
            dataType: 'json',
            method: 'put',
            success: function (data) {
            }
        })
    }
}

function addProductServerCallOut(product) {
    $.ajax({
        url: '/add_product_to_request',
        data: JSON.stringify(product),
        dataType: 'json',
        method: 'post',
        success: function (data) {
            table2.innerHTML += `<tr id="productDestination-${data.order.id}">
                                    <td class="text-center" id="order-id">${data.order.id}</td>
                                    <td class="text-center">${data.order.product}</td>
                                    <td class="text-center">${data.order.category}</td>
                                    <td class="text-center">
                                    <select class="btn btn-outline-dark text-right w-100 responseSSupplier-${data.order.id}" aria-label=".form-select-sm example" id="requestSupplier-${data.order.id}">
                                        <option value="0">تامین کننده</option>
                                  
                                        </select>
                                        </td>
                                    </td>
                                    <td class="text-center">
                                    <select class="btn btn-outline-dark text-right w-100 responseSBrand-${data.order.id}" aria-label=".form-select-sm example" id="requestBrand-${data.order.id}">
                                        <option value="0">برند</option>
                                  
                                        </select>
                                        </td>
                                    </td>
                                    <td class="text-center w-0"><input type="number" class="text-center"
                                                                                  value="${data.order.quantity}"> ${data.order.quantity_unit}
                                                </td>
                                    <td class="text-center"><input type="number" class="text-center"
                                                                               value="${data.order.price}"> ریال</td>
                                    <td class="text-center"><input type="number" class="text-center"
                                                                               value="${data.order.price_2m}"> ریال</td>
                                                                               
                                   
                                                </td>
                                    <td class="text-center"><span id="shoppingButton"
                                                                              class="fa fa-edit btn btn-success"
                                                                              style="padding-top: 6px"
                                                                              onclick="submitProductServerCallOut(${data.order.id})"></span>                                            
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-remove btn btn-outline-danger" style="padding-top: 6px" onclick="removeProductServerCallOut(${data.order.id})"></span></td>
                                </tr>`
            var suppliers = '';
            var product_suppliers = data.suppliers_r
            console.log(product_suppliers)
            for (var key in product_suppliers) {
                if (data.order.supplier === product_suppliers[key])
                    suppliers += '<option class="h-100" value="' + product_suppliers[key] + '" selected>' + product_suppliers[key] + '</option>';
                else
                    suppliers += '<option class="h-100" value="' + product_suppliers[key] + '" >' + product_suppliers[key] + '</option>';


            }
            $(".responseSSupplier-" + data.order.id).append(suppliers);

            var brands = '';
            var product_brands = data.brands_r
            console.log(product_brands)
            for (var key in product_brands) {
                if (data.order.brand === product_brands[key])
                    brands += '<option class="h-100" value="' + product_brands[key] + '" selected>' + product_brands[key] + '</option>';
                else
                    brands += '<option class="h-100" value="' + product_brands[key] + '" >' + product_brands[key] + '</option>';


            }
            $(".responseSBrand-" + data.order.id).append(brands);
        }

    })

}

function transferRow(id) {
    var productSource = document.getElementById("productSource-" + id)
    let childNodes = productSource.childNodes
    let product_id = childNodes[1].textContent
    let product_name = childNodes[3].textContent
    let product_category = document.getElementById('category-' + id).innerText
    let product_supplier = document.getElementById('supplier-' + id).value
    let product_brand = document.getElementById('brand-' + id).value
    let product_quantity = childNodes[11].childNodes[0]
    let product_quantity_unit = product_quantity.getAttribute('placeholder')
    let product_price = childNodes[13].childNodes[0].value
    let product_2month_price = childNodes[15].childNodes[0].value


    console.log(product_brand)
    if (product_quantity.value == '') {
        window.alert('مقدار کالای مورد نظر را وارد کنید')
    } else if (product_supplier === '') {
        window.alert('تامین کننده کالای مورد نظر را انتخاب کنید')
    } else {
        var tempOrderDict = {
            'request_id': request_id,
            'product_id': product_id,
            'product_brand': product_brand,
            'product_supplier': product_supplier,
            'product_quantity': product_quantity.value,
            'product_price': product_price,
            'product_2month_price': product_2month_price
        }
        addProductServerCallOut(tempOrderDict)
    }

}

function transferRowSearch(id) {
    var productSourceSearch = document.getElementById("productSourceSearch-" + id)
    let childNodes = productSourceSearch.childNodes
    let product_id = childNodes[1].textContent
    let product_name = childNodes[3].textContent
    let product_category = document.getElementById('searchedCategory-' + id).innerText
    let product_supplier = document.getElementById('searchedSupplier-' + id).value
    let product_brand = document.getElementById('searchedBrand-' + id).value
    let product_quantity = childNodes[11].childNodes[0]
    let product_quantity_unit = product_quantity.getAttribute('placeholder')
    let product_price = childNodes[13].childNodes[0].value
    let product_2month_price = childNodes[15].childNodes[0].value
    console.log(product_brand)
    var tempOrderDict = {
        'request_id': request_id,
        'product_id': product_id,
        'product_supplier': product_supplier,
        'product_brand': product_brand,
        'product_quantity': product_quantity.value,
        'product_price': product_price,
        'product_2month_price': product_2month_price
    }
    addProductServerCallOut(tempOrderDict)


}

function deleteProduct(id) {
    var row = document.getElementById('productDestination-' + id);
    row.parentNode.removeChild(row);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrintElem() {

    window.print()
}

