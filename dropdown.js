// ==============================================
const decide_country = () => {

    // data['US']
    // data['Japan']
    // data['China']
    // data['Korea, South']

    // Get initial dropdown value
    const dropdown_country = document.getElementById('dropdown-country');
    let dropdown_value 
        = dropdown_country.options[dropdown_country.selectedIndex].value;
     return dropdown_value;
};
// ==============================================
$('.dropdown-menu a').on('click', function(){
    // $('#datebox').val($(this).text());
    console.log('clicked');

    // const x = document.getElementById('dropdownMenuButton').innerHTML = 'JOSH';


    // // $('#datebox').val($(this).html());
    // console.log($('dropdown-menu').val($(this).html()));
});

$('#dropdown-menu li').on('click', function(){
    // $('#datebox').val($(this).text());
    console.log('clicked');
});
// ==============================================