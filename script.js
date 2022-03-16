document.getElementById('printCode').ondblclick = function(){
    event.preventDefault();
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(this);
    sel.removeAllRanges();
    sel.addRange(range);
};

function sortByKey(t, r) {
    return t.sort(function (t, e) {
        return "string" == typeof t[r] && ((t = t[r].toLowerCase()), (e = e[r].toLowerCase())), t < e ? -1 : t > e ? 1 : 0;
    });
}

var in_data = {};

var JSON_keys = [];
var header_list = [];
var items_list = [];
var sort_select_html = "";
var removed_items;
var selected_items = [];

var matrix = [{"id": 1, "title": "£50 PSN PlayStation Network Card UK", "badge": 21},{"id": 2, "title": "Microsoft Office 2019 Professional Plus", "badge": 35},{"id": 3, "title": "FIFA 20 Standard Edition Xbox One", "badge": 45},{"id": 4, "title": "Apex Legends 6700 Coins PS4", "badge": 17}];

$("#str").on('input',function(e){
    if(e.target.value === ''){
        // Textarea has no value
        console.log("nooooo input found");
    // } else {
        // Textarea has a value
        // button.show();
    }
});

// ingest product JSON
$('#ingestJSON').click(function() {

    in_data = $("#str").val().trim();
    matrix = JSON.parse(in_data);

    console.log(matrix);

    JSON_keys = Object.keys(matrix[0]);
    console.log(JSON_keys);

    JSON_keys.forEach(function (item) {
        header_list.push("<span class='font-weight-bold'>"+item+"</span>");
        sort_select_html += "<option>" + item + "</option>";
    });

    $("#divsort").html('&rarr; Select Sort Key <select id="selsortkey"><option>-select field-</option>' + sort_select_html + '</select>');

    // $("#divdelete").html();

    $("#productList").html("");

    $("#productList").prepend("<li class='list-group-item d-flex justify-content-between align-items-center filtered'>"+header_list+"</li>");

    matrix.forEach(function (json_item){
        console.log("json_item - ");
        console.log(json_item);
        console.log("json_item id - ");
        console.log(json_item['id']);
        JSON_keys.forEach(function (item) {
            console.log("json_item[item].substr(0,10) - ")
            console.log(json_item[item])
            console.log("typeof json_item[item] - ")
            console.log(typeof json_item[item])
            if (item == 'id' ){
                items_list.push("<span id='"+item+"'>"+json_item[item]+"</span>")
            }
            else if (typeof json_item[item] === 'string'){
                items_list.push("<span id='"+item+"'>"+json_item[item].substr(0,10)+"</span>")
            }
            // console.log(json_item[item].substr(0,10));
        });

        $("#productList").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+items_list+"</li>");

        header_list = [];
        items_list = [];
    });
});

$("body").on("change", "#selsortkey", function () {
    var t = $("select#selsortkey").val();
    matrix = sortByKey(matrix, t);

    console.log(matrix);

    JSON_keys.forEach(function (item) {
        header_list.push("<span class='font-weight-bold'>"+item+"</span>");
    });

    $("#productList").html("");

    $("#productList").prepend("<li class='list-group-item d-flex justify-content-between align-items-center filtered'>"+header_list+"</li>");

    header_list = [];

    matrix.forEach(function (json_item){
        JSON_keys.forEach(function (item) {
            if (item == 'id'){
                items_list.push("<span id='"+item+"'>"+json_item[item]+"</span>")
            }
            else{
                items_list.push("<span id='"+item+"'>"+json_item[item].substr(0,10)+"</span>")
            }
        });

        $("#productList").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+items_list+"</li>");
        
        items_list = [];
    });
});

// delete selected items
$('#deleteElements').click(function() {
    selected_items.forEach(function (item) {
        console.log(item.querySelectorAll("#id")[0].innerHTML);
        // console.log(matrix.splice(matrix.indexOf(item), 1));
        // console.log(matrix);
        var objCount = matrix.length;
        console.log(objCount);
        for (var x = 0; x < objCount; x++) {
            // console.log(x);
            // console.log(matrix[0]);
            if (matrix[x]['id'] == item.querySelectorAll("#id")[0].innerHTML){
                console.log("found matching id");
                matrix.splice(x, 1);
                break;
            }
        }
        item.remove();
        console.log(matrix);
    });
    selected_items = [];
    // removed_items = $('.selected').detach();
    // console.log(removed_items);
});

// generate product JSON
$('#generateJSON').click(function() {

    var out_data = {};

    var out_data_result = $('span[id^=id]').map(function(idx, elem) {
        console.log($(elem).text());

        var objCount = matrix.length;
        for (var x = 0; x < objCount; x++) {
            if (matrix[x]['id'] == $(elem).text()){
                console.log("found matching id")
                return matrix[x];
            }
        }

    }).get();

    console.log("out_data_result -");
    console.log(out_data_result);

    out_data['result'] = out_data_result;

    // encode to JSON format
    var result_json = JSON.stringify(out_data,null,'\t');
    $('#printCode').html(result_json);
});

// sortable
Sortable.create(productList, {
    filter: '.filtered',
    group: "sorting",
    sort: true,
    multiDrag: true, // Enable multi-drag
    avoidImplicitDeselect: true,
    selectedClass: 'selected', // The class applied to the selected items
    fallbackTolerance: 3, // So that we can select items on mobile
    animation: 150,
    onSelect: function(/**Event*/evt) {
        console.log(evt.item);
        // console.log(evt.item.childNodes);
        // console.log(evt.item.querySelectorAll("#id"));
        // console.log(evt.item.querySelectorAll("#id")[0]);
        // console.log(evt.item.querySelectorAll("#id")[0].innerHTML);
        selected_items.push(evt.item);
        console.log(selected_items);
    },
    onDeselect: function(/**Event*/evt) {
        console.log(selected_items);
        selected_items.pop(evt.item);
        console.log(selected_items);
    }
});