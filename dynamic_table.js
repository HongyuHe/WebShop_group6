document.addEventListener('DOMContentLoaded', () => {
    var updated = false; // Dirty flag;

    $("#TopSell").css("display", "none");

    // Update data:
    $("#latestData").on('click', () => {
        if (!updated) {

            UpdateTable();
            $(".TopSellTable").fadeIn(1500);
            updated = true;
        }
    });

    // Reset table:
    $("#reset").on('click', () => {

        ResetDatabase();
        $(".TopSellTable").fadeOut(1500);
        UpdateTable();
        $(".TopSellTable").fadeIn(1500);
        updated = true;
    });

    // Submit new item:
    $("#TopSell").delegate("#submit", "click", () => {
        PostData();
        $(".TopSellTable").fadeOut(1500);
        UpdateTable();
        $(".TopSellTable").fadeIn(1500);
        update = false;

        // Do not reloading the entire page:
        return false;
    });

    // Delete data (Fake):
    $("#TopSell").delegate(".Delete", "click", function() {
        // console.log(this.parentElement.parentElement.childNodes);
        // let ancestor = this.parentElement.parentElement;
        let ancestor = $(this).closest("tr");
        ancestor.fadeOut(500, () => {
            ancestor.remove();
        });
        updated = false;

        // let childs = this.parentElement.parentElement.childNodes;
        // for (var i = 0; i < childs.length; i++) {
        //     // alert(childs[i].nodeName);
        //     ancestor.removeChild(childs[i]);
        // }
    });
});

function UpdateTable() {
    $.ajax({
        type: 'GET',
        url: 'https://wt.ops.labs.vu.nl/api19/6bb9b56b',
        success: function(products) {

            InitTable(products);
            InitSort();
            InitButton();
        },
    });
}

function ResetDatabase() {
    $.ajax({
        type: 'GET',
        url: 'https://wt.ops.labs.vu.nl/api19/6bb9b56b/reset',
        success: function(products) {

            alert(`${products.Success}`);
        },
    });
}

function PostData() {
    var new_data = {
        "image": `${$("#image").val()}`,
        "product": `${$("#product").val()}`,
        "amount": `${$("#amount").val()}`,
        "origin": `${$("#origin").val()}`,
        "best_before_date": `${$("#best_before_date").val()}`,
    };

    $.ajax({
        type: 'POST',
        url: 'https://wt.ops.labs.vu.nl/api19/6bb9b56b',
        data: new_data,
        success: function(data) {

            // $(".TopSellTable").fadeOut("slow");
            // alert(`${upi.URI}`);
            alert("Submit success!");
        },
    });
}

/* Initial table */
function InitTable(products) {
    $(".TopSellTable").empty();

    var $topsell_table = $(".TopSellTable").first();
    let row_num = ++(products.length);
    const col_num = 6;
    let new_title = "<tr>";
    let new_row = "<tr>";
    const table_titles = [
        "Image", "Product", "Amount", "Origin", "Best Before Date", "Operstion"
    ];
    const title_id = [
        "top_img", "top_pro", "top_amo", "top_ori", "top_dat", "top_opr"
    ];
    const input_row =
        "<tr id='inputRow'><form><td><input id='image' name='image' type='url' placeholder='Image URL'></td><th><input id='product' name='product' type='text' placeholder='Product's Name' required></th><td><input id='amount' name='amount' type='number' placeholder='Amount(kg)' ></td><td><input id='origin' name='origin' type='text' placeholder='Origin' ></td><td><input id='best_before_date' name='best_before_date' type='text' placeholder='Best Before Date' ></td><td class='Button'><button id='submit'>Submit</button></td></form></tr>";

    // Genrate template:
    for (let i = 0; i < col_num; i++) {
        new_title += "<th></th>";
    }
    new_title += "</tr>";
    for (let i = 0; i < col_num; i++) {
        if (i == 1)
            new_row += "<th></th>";
        else
            new_row += "<td></td>";
    }
    new_row += "</tr>";

    // Create table:
    for (let i = 0; i < row_num; i++) {
        if (!i) $topsell_table.append(new_title);
        else
            $topsell_table.append(new_row);
    }
    $topsell_table.children().first().attr("class", "TableHead");

    $.each($(".TopSellTable").children().first().children(),
        function(_index, _th) {
            _th.innerHTML = `${table_titles[_index]}`;
            _th.id = `${title_id[_index]}`;
        });

    // Set falgs:
    $(".TopSellTable tr:gt(0) td:nth-child(1)").each(function() {
        $(this).append("<image class=image></image>")
    });
    $(".TopSellTable tr:gt(0) th").each(function() {
        $(this).attr("class", "product");
    });
    $(".TopSellTable tr:gt(0) td:nth-child(3)").each(function() {
        $(this).attr("class", "amount");
    });
    $(".TopSellTable tr:gt(0) td:nth-child(4)").each(function() {
        $(this).attr("class", "origin");
    });
    $(".TopSellTable tr:gt(0) td:nth-child(5)").each(function() {
        $(this).attr("class", "best_before_date");
    });
    $(".TopSellTable tr:gt(0) td:nth-child(6)").each(function() {
        $(this).html("<button class='Delete'>Delete</button>");
    });
    $topsell_table.append(input_row);

    // Fill in data:
    $.each(products, (_index, _product) => {
        $.each(_product, (key, value) => {
            if (key == "image")
                $(".image").eq(_index).attr("src", `${_product.image}`);
            else if (key == "amount" && _index > 1)
                $(`.${key}`).eq(_index).text(`${value}kg`);
            else
                $(`.${key}`).eq(_index).text(`${value}`);
        });
    });
}

function InitSort() {
    $("#top_img").on("click", () => { sortTable(0, "TopSell", "string"); });
    $("#top_pro").on("click", () => { sortTable(0, "TopSell", "string"); });
    $("#top_amo").on("click", () => { sortTable(1, "TopSell", "string"); });
    $("#top_ori").on("click", () => { sortTable(2, "TopSell", "string"); });
    $("#top_dat").on("click", () => { sortTable(3, "TopSell", "string"); });
}

function InitButton() {
    // By default, submit button is disabled
    document.querySelector('#submit').disabled = true;
    $("#submit").css({ "background": "gray", "cursor": "not-allowed" });
    // Enable button only if there is text in the input field
    $("#TopSell").delegate("#inputRow", "keyup", () => {
        // document.querySelector('#task').onkeyup = () => {
        if (document.querySelector('#image').value.length > 0 &&
            document.querySelector('#product').value.length > 0 &&
            document.querySelector('#amount').value.length > 0 &&
            document.querySelector('#origin').value.length > 0 &&
            document.querySelector('#best_before_date').value.length > 0) {

            document.querySelector('#submit').disabled = false;
            $("#submit").css({ "background": "rgb(76, 194, 61)", "cursor": "pointer" });
        } else
            document.querySelector('#submit').disabled = true;
    });
}