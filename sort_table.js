document.addEventListener('DOMContentLoaded', () => {
    //Physical Table Headers
    document.getElementById("phys_loc").addEventListener("click", function() { sortTable(0, "PhysTable", "string") });
    document.getElementById("phys_sun").addEventListener("click", function() { sortTable(1, "PhysTable", "string") });
    document.getElementById("phys_siz").addEventListener("click", function() { sortTable(2, "PhysTable", "string") });

    //Event Listeners for TopSellingTable are added in dynamic_table.js

});

// Function adapted from w3Schools https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n, id, dataType) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0,
        offSet = 1,
        tempx, tempy;

    if (id == "TopSell") { //Offset is 2 for interactive table as we don't want the input row to move
        offSet = 2;
    }

    table = document.getElementById(id);
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - offSet); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            if (id == "TopSell" && n == 0) {
                x = rows[i].getElementsByTagName("TH")[n];
                y = rows[i + 1].getElementsByTagName("TH")[n];
            } else {
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
            }
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */


            if (dir == "asc") {
                if (dataType == "string") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dataType == "number") { //if column is a number
                    tempx = x.innerHTML.substring(0, x.innerHTML.length - 2); //Removes last two characters ('kg')
                    tempy = y.innerHTML.substring(0, y.innerHTML.length - 2);
                    if (Number(tempx) > Number(tempy)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dataType == "date") {
                    var splitOne = x.innerHTML.split(" "); //split date by spaces
                    var splitTwo = y.innerHTML.split(" ");

                    if (splitOne[1] > splitTwo[1]) { //if year 1 is bigger than year 2
                        shouldSwitch = true;
                        break;
                    } else if (splitOne[1] == splitTwo[1]) { //if the years are equal, look at the month
                        if (getMonthFromString(splitOne[0]) > getMonthFromString(splitTwo[0])) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            } else if (dir == "desc") {
                if (dataType == "string") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dataType == "number") { //If column is a number
                    tempx = x.innerHTML.substring(0, x.innerHTML.length - 2); //Removes last two characters ('kg')
                    tempy = y.innerHTML.substring(0, y.innerHTML.length - 2);
                    if (Number(tempx) < Number(tempy)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dataType == "date") {
                    var splitOne = x.innerHTML.split(" "); //split date by spaces
                    var splitTwo = y.innerHTML.split(" ");

                    if (splitOne[1] < splitTwo[1]) { //if year 1 is bigger than year 2
                        shouldSwitch = true;
                        break;
                    } else if (splitOne[1] == splitTwo[1]) { //if the years are equal, look at the month
                        if (getMonthFromString(splitOne[0]) < getMonthFromString(splitTwo[0])) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function getMonthFromString(mon) {
  /* Function is used to translate string month to number
  version for easier comparisons for data_type = data */
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
}