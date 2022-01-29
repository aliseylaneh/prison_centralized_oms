const requestTable = document.getElementById('request-table')
const tableOutput = document.querySelector(".table-output");
const supplierTable = document.querySelector(".supplier-table");
const requestSupplierDiv = document.getElementById('request-suppler-div')
const requestNumber = document.getElementById('request_number')
const supplierCount = document.getElementById('supplier_count')
const brandCount = document.getElementById('brand_count')
const ordersCount = document.getElementById('orders_count')
const supplierDeliverCount = document.getElementById('supplier_delivered')
const reportDate = document.getElementById('report_date')


function TimerReqServerCallOut() {

    let request_number = document.getElementById('request-number').value
    $("#loadingBar").show()
    if (request_number.length !== 0) {
        $.ajax({
            method: 'post',
            url: '/request-time-search',
            dataType: 'json',
            data: JSON.stringify({
                'request_number': request_number,
            }),
            success: function (data) {
                $("#loadingBar").hide()
                requestTable.innerHTML = ''
                data.requests.forEach(item => {

                    requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.number}</td>
                                            <td class="text-center">${item.prison}</td>
                                            <td class="text-center"><label
                                                    style="font-size: 13px;">${item.status}</label>
                                            </td>
                                            <td class="text-center"><label
                                                                          style="font-size: 13px;">${item.sstatus}</label>
                                            </td>

                                            <td class="text-center"><span
                                                    class="text-center">${item.branch}</span>
                                            </td>
                                            <td class="text-center"><span
                                                    class="text-center">${item.created_date_time} ${item.created_date}</span>
                                            </td>
                                            <td class="text-center"><span
                                                    class="text-center">${item.submitted_time} ${item.submitted_date}</span>
                                            </td>
                                            
                                            <td class="text-center no-print"><button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="ReviewRequest(${item.number})">مشاهده</button></a>
                                            </td>
                                        </tr>

                    `


                });

            }
        })
    } else {
        window.alert('شماره درخواست مورد نظر را وارد کنید')
    }

}


function ReviewRequest(request_number) {
    $.ajax({
        method: 'post',
        url: '/time-dsearch-report',
        dataType: 'json',
        data: JSON.stringify({
            'request_number': request_number,
        }),
        success: function (data) {
            tableOutput.style.display = 'none'
            requestSupplierDiv.style.display = 'block'
            supplierTable.innerHTML = ''
            data.deliver_dates.forEach(item => {
                supplierTable.innerHTML += `
                    <tr>
                                            <td class="text-center">${item.supplier_name}</td>
                                            <td class="text-center">${item.request_date}</td>
                                            <td class="text-center">${item.final_date}</td>
                                            <td class="text-center">${item.recieved_date}</td>
                                            <td class="text-center">${item.avg_receive_requested} روز</td>
                                            <td class="text-center">${item.avg_receive_final} روز</td>
                                            <td class="text-center">${item.avg_requested_final} روز</td>

                     </tr>
                `


            });
            requestNumber.innerHTML = data.request_number
            supplierCount.innerHTML = data.suppliers_count
            brandCount.innerHTML = data.brands_count
            reportDate.innerHTML = data.report_date
            ordersCount.innerHTML = data.orders_count
            supplierDeliverCount.innerHTML = data.supplier_deliver_count

        }
    })


}


$(window).keypress(function (event) {
    switch (event.keyCode) {

        case 13:
            CrepServerCallOut();
            break;

    }
});


function resetFound() {
    tableOutput.style.display = 'block'
    requestSupplierDiv.style.display = 'none'
    supplierTable.innerHTML = ''
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrintElem() {

    window.print()
}
