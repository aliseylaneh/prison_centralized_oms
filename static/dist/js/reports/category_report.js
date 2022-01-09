let ordercount = document.getElementById('ordercount')
let fullordercount = document.getElementById('fullordercount')
let requestcount = document.getElementById('requestcount')
let categoryexpert = document.getElementById('categoryexpert')
let brandcount = document.getElementById('brandcount')
const requestTable = document.getElementById('request-table')
const modalBody = document.getElementById('modalBody')

function CrepServerCallOut() {
    category_name = document.getElementById('selected-category').value
    prison_id = document.getElementById('selected-prison').value
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    if (category_name !== '0') {
        $.ajax({
            method: 'post',
            url: '/category_report',
            dataType: 'json',
            data: JSON.stringify({
                'category_name': category_name,
                'start_date': start_date,
                'end_date': end_date,
                'prison_id': prison_id
            }),
            success: function (data) {
                requestTable.innerHTML = ''
                ordercount.innerHTML = data.orders_count
                if (data.orders_count_quantity !== null) {
                    console.log(data.orders_count_quantity)
                    fullordercount.innerHTML = data.orders_count_quantity
                } else
                    fullordercount.innerHTML = 0
                requestcount.innerHTML = data.requests_count
                categoryexpert.innerHTML = data.expert
                brandcount.innerHTML = data.brand_count
                data.requests.forEach(item => {


                    requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.request__number}</td>
                                            <td class="text-center">${item.request__prison__name}</td>
                                            <td class="text-center"><label
                                                    style="font-size: 13px;">${item.request__request_status}</label>
                                            </td>
                                            <td class="text-center"><label
                                                                          style="font-size: 13px;">${item.request__shipping_status}</label>
                                            </td>

                                            <td class="text-center"><span
                                                    class="text-center">${item.request__branch__name}</span>
                                            </td>
                                            <td class="text-center no-print"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="ReviewRequest(${item.request__number})">مشاهده</button></a>
                                            </td>
                                        </tr>

                    `


                });

            }
        })

    } else {
        window.alert('برای گزارش گیری باید یک گروه کالایی را انتخاب کنید')
    }
}

function ReviewRequest(number) {
    let counter = 1
    $.ajax({
        method: 'post',
        url: '/review_request_report',
        dataType: 'json',
        data: JSON.stringify({
            'request_number': number,
        }),
        success: function (data) {
            var requestOrders = ``
            data.request_orders.forEach(item => {
                requestOrders += `
                            <tr>
                                    <td class="text-center">${counter++}</td>
                                    <td class="text-center">${item.product_name}</td>
                                    <td class="text-center">${item.product_category}</td>
                                    <td class="text-center">${item.product_supplier}</td>
                                    <td class="text-center">${item.product_brand}</td>
                                    <td class="text-center">${item.product_quantity} ${item.product_quantity_unit}</td>
                                    <td class="text-center">${numberWithCommas(item.buyprice)} ریال</td>
                                    <td class="text-center">${numberWithCommas(item.sellprice)} ریال</td>
                                </tr>
                        
                        `
            })


            modalBody.innerHTML = ''
            modalBody.innerHTML += `
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
                                                    <h5 class="text-right pb-1" style="font-family: 'B Titr'">جناب آقای مرتضی محمدی آشنایی</h5>
                                                    <h5 class="text-right pb-1 text-bold" style="font-family: 'B Titr'">مدیر
                                                        عامل شرکت بازرگانی حامیان امید</h5>
                                                    <h5 class="text-right pb-1 text-bold" style="font-family: 'B Titr'">موضوع:
                                                        درخواست ندامتگاه ${data.branch}</h5>
        
                                                </div>
                                                <div>
                                                     <span>بدینوسیله این درخواست با شماره و تاریخ درج شده در آن جهت ارسال به ندامتگاه ${data.branch} ( سرپرست آقای ${data.prisonprofile.branch_deputy} )، حضورتان ارسال میگردد</span>
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
                                                
                                                <div class="text-center border-primary">محصولات انتخاب شده جهت مصرف در فروشگاه ندامتگاه مربوط به ${data.branch}</div>
                                                <thead>
                                                <tr>
                                                    <th class="text-center">شماره</th>
                                                    <th class="text-center">نام کالا</th>
                                                    <th class="text-center">گروه</th>
                                                    <th class="text-center">تامین کننده</th>
                                                    <th class="text-center">برند</th>
                                                    <th class="text-center">کمیت</th>
                                                    <th class="text-center">خرید</th>
                                                    <th class="text-center">مصرف کننده</th>
                                                </tr>
                                                </thead>
                                                <tbody class='position-relative'>
                                                ${requestOrders}
                                                </tbody>
                                            </table>
                
                
                                            </p>
                                            <br>      
                                        </div>
                                    </div>
                                </article>
                            </div>
                
                        </div>
                
                
                    </section>`
        }
    })

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}