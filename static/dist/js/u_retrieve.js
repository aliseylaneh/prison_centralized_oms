const provinceSelected = document.getElementById("province-selector")
const citySelected = document.getElementById("city-selector")
provinceSelected.addEventListener('change', (e) => {
    checkProvince()
});

function checkProvince() {
    if (provinceSelected.value === "تهران") {
        $("#city-selector").empty()
        $("#city-selector").append("<option value=''>شهر</option>" +
            "<option value=\"تهران\">تهران</option>\n" +
            "<option value=\"تهران\">شهریار</option>\n" +
            "<option value=\"رودهن\">رودهن</option>\n" +
            "<option value=\"بومهن\">بومهن</option>\n" +
            "<option value=\"پردیس\">پردیس</option>\n" +
            "<option value=\"پرند\">پرند</option>\n" +
            "<option value=\"باغستان\">باغستان</option>\n")
    } else if (provinceSelected.value === "همدان") {
        $("#city-selector").empty()
        $("#city-selector").append("<option value=''>شهر</option>" +
            "<option value='ملایر'>ملایر</option>" +
            "<option value='نهاوند'>نهاوند</option>")
    } else if (provinceSelected.value === "گیلان") {
        $("#city-selector").empty()
        $("#city-selector").append("<option selected>شهر</option>" +
            "<option value='رشت'>رشت</option>" +
            "<option value='بندر انزلی'>بندر انزلی</option>")
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
