const requestTable = document.getElementById('request-table')


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
                                                    style="font-size: 13px;">${numberWithCommas(item.orders_price)}</label>
                                            </td> 
                                </tr>

                    `


            });
        }
    })
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function PrintElem() {

    window.print()
}