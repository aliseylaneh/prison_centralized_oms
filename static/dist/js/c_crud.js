function deleteCategory(name) {
    let action = confirm('آیا از حذف کردن این گروه کالایی مطمئن هستید ؟')


    if (action != false) {
        $.ajax({
            url: '/delete_category',
            data: {
                'name': name
            },
            dataType: 'json',
            success: function (data) {
                if (data.deleted) {
                    console.log('category-' + name)
                    $("#categoryTable #category-" + name).remove()
                }
            }
        })
    }
}

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()

                }
                form.classList.add('was-validated')
            }, false)
        })
})()