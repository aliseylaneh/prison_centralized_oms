let requestFinalOrders = {}
'use strict';

function handleTicket(request_number) {
    let ticket_title = document.getElementById('ticket_title').value
    let ticket_con = document.getElementById('ticket_con').value
    console.log(ticket_title, ticket_con)
    let data = {
        'request_number': request_number,
        'ticket_con': ticket_con,
        'ticket_title': ticket_title
    }
    if (ticket_con.length >= 10 && ticket_title.length >= 5) {
        $.ajax({
            url: '/submit_request_ticket',
            data: JSON.stringify(data),
            dataType: 'json',
            method: 'POST',
            success: function () {
                window.alert('تیکت مربوطه ارسال شد')
            }
        })
    } else {
        window.alert('متن و یا عنوانی را بنویسید')
    }
}

function handleConversation(conversation_id, user_id) {
    var value = document.getElementById(conversation_id).value
    var content = document.getElementById('div-' + conversation_id)
    let data = {
        'reply': value,
        'conversation_id': conversation_id,
        'user_email': user_id
    }
    if (value != 0) {
        $.ajax({
            url: '/submit_request_conversation',
            data: JSON.stringify(data),
            dataType: 'json',
            method: 'POST',
            success: function () {
                content.innerHTML = '<div class="col-4"><span>پاسخ: ' + value + '</span></div>'
                window.alert('پاسخ تیکت ارسال شد')
            }
        })
    } else {
        window.alert('متنی را به عنوان پاسخ ارسال کنید')
    }
}

function handleCommercialExpert(request_id) {
    var value = document.getElementById('ce_request').value
    let data = {
        'ce_category_email': value,
        'request_number': request_id
    }
    if (value != 0) {
        $.ajax({
            url: '/change_request_cexpert',
            data: JSON.stringify(data),
            dataType: 'json',
            method: 'POST',
            success: function () {
                window.alert('درخواست با موفقیت به کارشناس مربوطه ارسال شد')
            }
        })
    } else {
        window.alert('برای ارسال درخواست به مرحله بعد باید یک کارشناس را انتخاب کنید')
    }
}

function transferRow(id) {

    var table2 = document.getElementById("tableDestination")
    var productSource = document.getElementById("productSource-" + id)
    var childNodes = productSource.childNodes
    console.log(childNodes)
    let product_id = childNodes[1].textContent
    let product_name = childNodes[3].textContent
    let product_category = document.getElementById('category-' + id).innerText
    let product_supplier = document.getElementById('supplier-' + id).value
    let product_brand = document.getElementById('brand-' + id).value
    let product_quantity = childNodes[11].childNodes[0]
    let product_quantity_unit = product_quantity.getAttribute('placeholder')
    let product_price = childNodes[13].childNodes[0].value
    let product_2month_price = childNodes[15].childNodes[0].value
    if (product_quantity.value != 0) {
        let orderID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        table2.innerHTML += `<tr id="productDestination-${product_id}">
                                    <td class="text-center" id="product-id">${product_id}</td>
                                    <td class="text-center">${product_name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;">${product_category}</span></td>
                                    <td class="text-center">${product_supplier}</td>
                                    <td class="text-center">${product_brand}</td>
                                    <td class="text-center">${product_quantity.value} ${product_quantity_unit}</td>
                                    <td class="text-center">${numberWithCommas(product_price)} ریال</td>
                                    <td class="text-center">${numberWithCommas(product_2month_price)}ریال</td>
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-remove btn btn-outline-danger" style="padding-top: 6px" onclick="deleteProduct(${product_id},'${orderID}')"></span></td>
                                </tr>`

        var tempOrderDict = {
            'id': product_id,
            'product_name': product_name,
            'product_category': product_category,
            'product_supplier': product_supplier,
            'product_brand': product_brand,
            'product_quantity': product_quantity.value,
            'product_quantity_unit': product_quantity_unit,
            'product_price': product_price,
            'product_2month_price': product_2month_price
        }

        addProductToRequest(tempOrderDict, orderID)

    } else {
        window.alert('مقداری برای کالای مورد نظر انتخاب کنید')
    }

}

function transferRowSearch(id) {

    let table2 = document.getElementById("tableDestination");
    let productSource = document.getElementById("productSourceSearch-" + id)
    let childNodes = productSource.childNodes
    let product_id = childNodes[1].textContent
    let product_name = childNodes[3].textContent
    let product_category = document.getElementById('searchedCategory-' + id).innerText
    let product_brand = document.getElementById('searchedBrand-' + id).value
    let product_supplier = document.getElementById('searchedSupplier-' + id).value
    let product_quantity = childNodes[11].childNodes[0]
    let product_quantity_unit = product_quantity.getAttribute('placeholder')
    let product_price = childNodes[13].childNodes[0].value
    let product_2month_price = childNodes[15].childNodes[0].value
    if (product_quantity.value != 0) {
        let orderID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        table2.innerHTML += `<tr id="productDestination-${product_id}">
                                    <td class="text-center" id="product-id">${product_id}</td>
                                    <td class="text-center">${product_name}</td>
                                    <td class="text-center"><span class="badge badge-success" style="font-size: 13px;">${product_category}</span></td>
                                    <td class="text-center">
                                    ${product_supplier}    
                                    </td>
                                    <td class="text-center">
                                    ${product_brand}    
                                    </td>
                                    <td class="text-center">${product_quantity.value} ${product_quantity_unit}</td>
                                    <td class="text-center">${numberWithCommas(product_price)} ریال</td>
                                    <td class="text-center">${numberWithCommas(product_2month_price)}ریال</td> 
                                    <td class="text-center"><span id="shoppingButton"  class="fa fa-remove btn btn-outline-danger" style="padding-top: 6px" onclick="deleteProduct(${product_id},'${orderID}')"></span></td>
                                </tr>`
        let tempOrderDict = {
            'id': product_id,
            'product_name': product_name,
            'product_category': product_category,
            'product_supplier': product_supplier,
            'product_brand': product_brand,
            'product_quantity': product_quantity.value,
            'product_quantity_unit': product_quantity_unit,
            'product_price': product_price,
            'product_2month_price': product_2month_price
        }

        addProductToRequest(tempOrderDict, orderID)
    } else {
        window.alert('مقداری برای کالای مورد نظر انتخاب کنید')
    }


}

function deleteProduct(id, orderID) {
    removeProductFromRequest(orderID)
    var row = document.getElementById('productDestination-' + id);
    row.parentNode.removeChild(row);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


function addProductToRequest(order, orderID) {
    requestFinalOrders[orderID] = order
}

function removeProductFromRequest(orderID) {
    delete requestFinalOrders[orderID]
}

function serverCallOut() {
    let branch = document.getElementById('prisonbranch').value
    let counter = 1
    if (branch !== '') {
        if (Object.keys(requestFinalOrders).length >= 1) {
            let action = confirm('آیا از محصولات انتخاب شده برای درخواست خود مطمئن هستید؟')
            let tempDict = {};
            tempDict[branch] = requestFinalOrders;
            if (action != false) {
                $.ajax({
                    url: '/review_request',
                    data: JSON.stringify(tempDict),
                    dataType: 'json',
                    method: 'POST',
                    success: function (data) {
                        console.log(data)
                        var requestFinalOrders = ``
                        data.request_orders.forEach(item => {
                            requestFinalOrders += `
                            <tr>
                                    <td class="text-center">${counter++}</td>
                                    <td class="text-center">${item.product_name}</td>
                                    <td class="text-center">${item.product_category}</td>
                                    <td class="text-center">${item.product_supplier}</td>
                                    <td class="text-center">${item.product_brand}</td>
                                    <td class="text-center">${item.product_quantity} ${item.product_quantity_unit}</td>
                                    <td class="text-center">${numberWithCommas(item.product_price)} ریال</td>
                                    <td class="text-center">${numberWithCommas(item.product_2month_price)} ریال</td>
                                </tr>
                        
                        `
                        })


                        $('#main_wrapper').html(`
                    
                <section class="content" xmlns="http://www.w3.org/1999/html">
                
                
                        <div class="card">
                
                            <div class="card-body">
                                <article class="section" id="article-page">
                                    <div id="post-content">
                                        <div class="row">
                                            <div class="text-right col-4">
                                               <img src="../../../static/dist/img/logo.png" style="width: 74px;margin-right: 34px">
                                               <br>
                                               <span style="font-family: 'B Titr'">بازرگانی حامیان امید فردا</span><br>
                                               
                                             </div>
                                            <div class="text-center col-4">
                                            <h5 style="font-family: IranNastaliq;font-size: 40px" class="article-title text-center">بسم الله الرحمن الرحیم</h5>    
                                                <h5 class="article-title text-center">بنیاد تعاون زندانیان استان تهران</h5>
                                                <h5 class="article-title text-center">(فرم درخواست کالا از شرکت بازرگانی حامی امید)</h5>
                                            </div>
                                            <div class="text-left col-4">
                                                <span class="text-left"> شماره درخواست: ${data.request.number}</span><br>
                                                تاریخ ثبت: ${data.request.request_datetime}<br>
                                                <span class="text-left"> پیوست: ندارد</span>
                                            </div>
                                        </div>
                                        <hr>
                                        <br>
                                        <div class="article-body paragraph" style="font-size: 18px;"><p>
                                            <div class="row">
                                                <div class="col-12">
                                                    <h5 class="text-right pb-1" style="font-family: 'B Titr'">جناب آقای محمد
                                                        برهانی
                                                        پور</h5>
                                                    <h5 class="text-right pb-1 text-bold" style="font-family: 'B Titr'">مدیر
                                                        عامل شرکت بازرگانی حامیان امید</h5>
                                                    <h5 class="text-right pb-1 text-bold" style="font-family: 'B Titr'">موضوع:
                                                        درخواست ندامتگاه ${branch}</h5>
        
                                                </div>
                                                <div>
                                                     <span>بدینوسیله این درخواست با شماره و تاریخ درج شده در آن جهت ارسال به ندامتگاه ${branch} ( سرپرست آقای ${data.prisonprofile.branch_deputy} )، حضورتان ارسال میگردد</span>
                                                </div>
                                            </div>
                                            <br>
                                            <h6>اطلاعات مربوط به درخواست کننده:</h6>
                                               <div class="row invoice-info">
                                               
                                                <div class="col-sm-4 invoice-col">
                                                  <address>
                                                    
                                                    نمایندگی: ${data.prisonprofile.name}<br>
                                                    آدرس: ${data.prisonprofile.address}<br>
                                                    تلفن: ${data.prisonprofile.phone_number}<br>
                                                   
                                                  </address>
                                                </div>
                                                <div class="col-sm-4 invoice-col">
                                                  <address>
                                                    
                                                    نام: ${data.userprofile.first_name}<br>
                                                    نام خانوادگی: ${data.userprofile.last_name}<br>
                                                  
                                                   
                                                  </address>
                                                </div>
                                                <div class="col-sm-4 invoice-col">
                                                  <address>
                                                    
                                                    وضعیت تاییدیه:${data.request.status}<br>
                                                    وضعیت درخواست:${data.request.shipping_status}<br>
                                                    
                                                   
                                                  </address>
                                                </div>
                                               </div>
                                              
                                           
                                          
                                            <p style="text-align: justify;">
                
                                            <table class="table table-bordered">
                                                
                                                <div class="text-center border-primary">محصولات انتخاب شده جهت مصرف در فروشگاه ندامتگاه مربوط به ${branch}</div>
                                                <thead>
                                                <tr>
                                                    <th class="text-center">شماره</th>
                                                    <th class="text-center">نام کالا</th>
                                                    <th class="text-center">گروه</th>
                                                    <th class="text-center">تامین کننده</th>
                                                    <th class="text-center">برند</th>
                                                    <th class="text-center">کمیت</th>
                                                    <th class="text-center">نقدی</th>
                                                    <th class="text-center">دو ماهه</th>
                                                </tr>
                                                </thead>
                                                <tbody class='position-relative'>
                                                ${requestFinalOrders}
                                                </tbody>
                                            </table>
                
                
                                            </p>
                                            <br>
                                            
                                                <span style="font-size: 14px;">توجه: این درخواست فقط برای استفاده شخصی کاربر استان میباشد و هیچگونه ارزش قانونی ندارد، چرا که این گونه درخواست ها نیازمند تاییدیه از افراد ثبت شده در کارتابل سازمان میباشند و بعد از آن دارای ارزش قانونی برای روند اداری میباشند</span>
                                                <div class="text-right pt-4">
                                                <div class="row no-print">
                                                    <div class="col-12" id="print-button">
                                                     <form action="/user/requests">
                                                     <button type="submit" class="btn btn-success float-left ml-2" style="margin-right: 5px;">
                                                        <i class="fa fa-arrow-left"></i> ادامه
                                                      
                                                      <button type="button" onclick="PrintElem()" class="btn btn-primary float-left ml-2" style="margin-right: 5px;">
                                                        <i class="fa fa-print"></i> چاپ درخواست
                                                      </button>
                                                      </form>
                                                    </div>
                                                  </div>
                                            </div>
                                        
                                                      
                                        </div>
                                    </div>
                                </article>
                            </div>
                
                        </div>
                
                
                    </section>

                      `)
                    }
                })
            } else {
                confirm('شما برای ایجاد درخواست جدید نیازمند به اضافه کردن حداقل ۱ محصول را دارید')
            }
        }
    } else {
        window.alert("زندان را انتخاب کنید")
    }

}


function PrintElem() {

    window.print()
}
