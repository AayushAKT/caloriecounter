let input = document.querySelector("#searchfooditem");
let calorieCount = document.querySelector("#caloriecount");
let proteinCount = document.querySelector("#proteincount");
let foodItemName = document.querySelector("#foodItemName")
let calorieSearchBtn = document.getElementById("calorieSearchBtn");

function getData() {
    var query = input.value;
    $.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + encodeURIComponent(query),
        headers: { 'X-Api-Key': '+LvNaxYhtMvMytLY0e3pvg==bQtBnir086pATb2i'},
        contentType: 'application/json',
        success: function(result) {
            console.log(result);

            if (result.items && result.items.length > 0) {
                var caloriesValue = result.items[0].calories;
                var proteinValue = result.items[0].protein_g;
                console.log('Calories:', caloriesValue);
                console.log('Proteins:', proteinValue);
                calorieCount.innerHTML = caloriesValue;
                proteinCount.innerHTML = proteinValue;
                foodItemName.innerHTML = query;

            } else {
                console.error('No items found in the API response');
            }
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}

calorieSearchBtn.addEventListener("click", () => {
    getData();
});



