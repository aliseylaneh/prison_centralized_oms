let ordercount = document.getElementById('ordercount')
let fullordercount = document.getElementById('fullordercount')
let requestcount = document.getElementById('requestcount')
let categoryexpert = document.getElementById('categoryexpert');


function CrepServerCallOut() {
    category_name = document.getElementById('selected-category').value
    start_date = document.getElementById('pcal1').value
    end_date = document.getElementById('pcal2').value
    $.ajax({
        method: 'post',
        url: '/category_report',
        dataType: 'json',
        data: JSON.stringify({
            'category_name': category_name,
            'start_date': start_date,
            'end_date': end_date
        }),
        success: function (data) {
            ordercount.innerHTML = data.orders_count
            if (data.orders_count_quantity !== null) {
                console.log(data.orders_count_quantity)
                fullordercount.innerHTML = data.orders_count_quantity
            } else
                fullordercount.innerHTML = 0
            requestcount.innerHTML = data.requests_count
            categoryexpert.innerHTML = data.expert
        }
    })

}