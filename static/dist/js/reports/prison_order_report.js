const requestTable = document.getElementById('request-table')
const startdate = document.getElementById('startdate')
const enddate = document.getElementById('enddate')
const reportdate = document.getElementById('reportdate')


function CrepServerCallOut() {
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    $("#loadingBar").show()
    $.ajax({
        method: 'post',
        url: '/prison-date-report',
        dataType: 'json',
        data: JSON.stringify({
            'start_date': start_date,
            'end_date': end_date
        }),
        success: function (data) {
            requestTable.innerHTML = ''
            $("#loadingBar").hide()
            data.prisons.forEach(item => {


                requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.prison_name}</td>
                                            <td class="text-center">${numberWithCommas(item.orders_count)}</td>
                                            <td class="text-center"><label
                                                    style="font-size: 14px;">${numberWithCommas(item.orders_price)}</label>
                                            </td> 
                                </tr>

                    `


            });
            requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">جمع کل:</label></td>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">${numberWithCommas(data.total_quantity)}</label></td>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">${numberWithCommas(data.total_price)}</label>
                                            </td> 
                                </tr>

                    `
            reportdate.innerHTML = data.report_date
            if (start_date === '') {
                startdate.innerHTML = 'نامشخص'
            } else {
                startdate.innerHTML = start_date
            }
            if (end_date === '') {
                enddate.innerHTML = 'اکنون'
            } else {
                enddate.innerHTML = end_date
            }
        }
    })
}


function PrepServerCallOut() {
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    $("#loadingBar").show()
    $.ajax({
        method: 'post',
        url: '/prison-deliver-report',
        dataType: 'json',
        data: JSON.stringify({
            'start_date': start_date,
            'end_date': end_date
        }),
        success: function (data) {
            requestTable.innerHTML = ''
            $("#loadingBar").hide()
            data.prisons.forEach(item => {


                requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center">${item.prison_name}</td>
                                            <td class="text-center">${numberWithCommas(item.delivered_quantity)}</td>
                                            <td class="text-center"><label
                                                    style="font-size: 14px;">${numberWithCommas(item.orders_price)}</label>
                                            </td> 
                                </tr>

                    `


            });
            requestTable.innerHTML += `
                                <tr>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">جمع کل:</label></td>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">${numberWithCommas(data.total_quantity)}</label></td>
                                            <td class="text-center"><label
                                                    style="font-size: 15px;">${numberWithCommas(data.total_price)}</label>
                                            </td> 
                                </tr>

                    `
            reportdate.innerHTML = data.report_date
            if (start_date === '') {
                startdate.innerHTML = 'نامشخص'
            } else {
                startdate.innerHTML = start_date
            }
            if (end_date === '') {
                enddate.innerHTML = 'اکنون'
            } else {
                enddate.innerHTML = end_date
            }
        }
    })
}

function por_xls() {
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    $("#loadingBar").show()
    $.ajax({
        method: 'post',
        url: '/por_xls',
        dataType: 'json',
        data: JSON.stringify({
            'start_date': start_date,
            'end_date': end_date
        }),
        success: function (data) {
            $("#loadingBar").hide()
        }
    })
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrintElem() {

    window.print()
}