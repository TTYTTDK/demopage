// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// All check or not check in rmse chart
function check(checked = true) {
    const cbs = document.querySelectorAll('input[name="modelf"]');
    cbs.forEach((cb) => {
        cb.checked = checked;
    });
}

const btn = document.querySelector('#checkall');
btn.onclick = checkAll;

function checkAll() {
    check();
    // reassign click event handler
    this.onclick = uncheckAll;
}

function uncheckAll() {
    check(false);
    // reassign click event handler
    this.onclick = checkAll;
}

//
function round2(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}