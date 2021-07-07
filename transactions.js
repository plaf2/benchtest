class Transactions {
    constructor() {
    }

    // given a number returns a formatted string as a currency
    formatCurrency(num) {
        const formatter = new Intl.NumberFormat("en", { style: "currency", currency: "USD"});
        return formatter.format(num);
    }

    // appends the list items to the transaction_list site
    appendListItems(items) {
        let listSite = document.getElementById("transaction_list");
        
        // can't add transactions if there's no site or items
        if (!listSite || !items) {
            return;
        }
        let total = 0;

        // create a date object for each item
        items.forEach(item => {
            let dateArr = item["Date"]?.split("-");
            if (dateArr && dateArr.length === 3) {
                let y = parseInt(dateArr[0]);
                let m = parseInt(dateArr[1]);
                let da = parseInt(dateArr[2]);

                // save valid date
                if (!isNaN(m) && !isNaN(y) && !isNaN(da)) {
                    let d = new Date(y, m - 1, da);
                    item["Date"] = d;
                }
            }
        });

        // sort from most recent to oldest
        items = items.sort((a, b) => b["Date"] - a["Date"]);

        // append each list element to the site
        items.forEach((item, index) => {
            let li = document.createElement("li");
            li.className = ((index + 1) % 2) === 0 ? "even" : "odd";

            this.appendColumnDate(item, li);

            this.appendColumnCompany(item, li);

            this.appendColumnLedger(item, li);

            total += this.appendColumnAmount(item, li);

            listSite.appendChild(li);
        });
    
        // update total 
        let totalSite = document.getElementById("header_col4");
        if (totalSite) {
            totalSite.innerText = this.formatCurrency(total);
        } 
    }

    // appends the formatted currency to the site
    appendColumnAmount(item,li) {
        let col4 = document.createElement("div");
        col4.className = "col4";
        const amount = parseFloat(item["Amount"]);
        if (isNaN(amount)) {
            col4.innerText = "-.--";
            return 0;
        }
        col4.innerText = this.formatCurrency(amount);
        li.appendChild(col4);
        return amount;
    }

    // appends the description to the site
    appendColumnLedger(item, li) {
        let col3 = document.createElement("div");
        col3.className = "col3";
        col3.innerText = item["Ledger"];
        li.appendChild(col3);
    }

    // appends the company name to the site
    appendColumnCompany(item, li) {
        let col2 = document.createElement("div");
        col2.className = "col2";
        col2.innerText = item["Company"];
        li.appendChild(col2);
    }
    
    // generates and returns a formatted string of the given date
    parseDateString(date) {
        if (date instanceof Date) {
            const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date)
            const month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
            let day = new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);

            // add suffix to day
            const dayInt = parseInt(day[day.length - 1]);
            const dayInt2 = parseInt(day);
            if (!isNaN(dayInt) && !isNaN(dayInt2)) {
                if (dayInt2 > 10 && dayInt2 < 20) {
                    day += "th";
                } else if (dayInt === 1) {
                    day += "st";
                } else if (dayInt === 2) {
                    day += "nd";
                } else if (dayInt === 3) {
                    day += "rd";
                } else {
                    day += "th";
                }
            } else {
                return date;
            }
            // return formatted date
            return month + " " + day + ", " + year;
        } else {
            return date;
        }
    }
    // append the date to the site
    appendColumnDate(item, li) {
        let col1 = document.createElement("div");
        col1.className = "col1";
        col1.innerText = this.parseDateString(item["Date"]);
        li.appendChild(col1);
    }
}