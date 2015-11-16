/*
Employees
*/
var Employees = {
  
    getAll: function(options) {
        Ajax.doCall(options);
    },

    displayData: function(data) {
        var dataElement = $('.js-employees__list');
        dataElement.html('');
        for (var i in data) {
            var dataItem ='<li><strong>' + data[i].lastname + ', ' + data[i].firstname + ' ' + data[i].middlename + '</strong><br />' + data[i].location + '</li>';
            dataElement.append(dataItem);
        }
    }

};

$('[data-ajax=get--employees]').on('click', function() {
    var options = {
        url: 'sql/get-employees.php',
        success: Employees.displayData
    };
    Ajax.doCall(options);
});