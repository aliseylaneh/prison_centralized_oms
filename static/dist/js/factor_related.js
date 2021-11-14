function submitDeliveredQuantity(order_id) {
    let delivered_quantity = document.getElementById("productNQ-" + order_id).value
    let sell_price = document.getElementById("productNDS-" + order_id).value
    if (delivered_quantity > 0) {

        let tempDictUpdate = {
            'order_id': order_id,
            'delivered_quantity': delivered_quantity,
            'sell_price': sell_price
        }
        let alert = confirm("آیا از ثبت مقدار دریافتی و قیمت مصرف کننده مورد نظر مطمئن هستید؟")
        if (alert !== false) {
            $.ajax({
                url: '/set_delivered_quantity',
                data: JSON.stringify(tempDictUpdate),
                dataType: 'json',
                method: 'post',
                success: function (data) {
                }
            })
        }
    } else {
        window.alert('برای ثبت مقدار دریافتی باید عددی را وارد کنید')
    }
}

// /request/{{ request_r.number }}/supplier_factor/{{ supplier_r.id }}/submit


// function submitDeliveredFactor(request_id, supplier_id) {
//     let tempDictUpdate = {
//         'request_number': request_id,
//         'supplier_id': supplier_id
//     }
//     let alert = confirm("آیا از ثبت این فاکتور مظمئن هستید؟")
//     if (alert !== false) {
//         document.getElementById("editButton").remove();
//         document.getElementById("submitButton").remove();
//         $.ajax({
//             url: '/submit_delivered_factor',
//             data: JSON.stringify(tempDictUpdate),
//             dataType: 'json',
//             method: 'post',
//             success: function (data) {
//
//             }
//         })
//     }
// }


