class App {
    constructor() {

    }

    async init() {
        // get all the items as JSON objects
        const api = new Api();
        api.getTransactions().then(items => {
            // attach items to site
            this.appendListItems(items);
        });
    }


    appendListItems(items) {
        let listSite = document.getElementById("transaction_list");
        let total = 0;

        // sort
        // TODO:
        items = items.slice().sort((a, b) => new Date(b["Date"]) - new Date(a["Date"]));

        items.forEach((item, index) => {
            let li = document.createElement("li");
            li.className = ((index + 1) % 2) === 0 ? "even" : "odd";

            this.appendColumnDate(item, li);

            this.appendColumnCompany(item, li);

            this.appendColumnLedger(item, li);

            total = this.appendColumnAmount(item, total, li);

            listSite.appendChild(li);
        });
        // TODO: formatting
        let totalSite = document.getElementById("header_col4");
        totalSite.innerText = "$" + total.toFixed(2);
    }

    appendColumnAmount(item, total, li) {
        let col4 = document.createElement("div");
        col4.className = "col4";
        const amount = item["Amount"] * -1;
        total += amount;
        col4.innerText = amount < 0 ? "-$" + (amount * -1).toFixed(2) : "$" + amount.toFixed(2);
        li.appendChild(col4);
        return total;
    }

    appendColumnLedger(item, li) {
        let col3 = document.createElement("div");
        col3.className = "col3";
        col3.innerText = item["Ledger"];
        li.appendChild(col3);
    }

    appendColumnCompany(item, li) {
        let col2 = document.createElement("div");
        col2.className = "col2";
        col2.innerText = item["Company"];
        li.appendChild(col2);
    }
    
    parseDateString(date) {
        let dateString = date ?? "";
        let dateArr = date.split("-");
        if (dateArr.length === 3) {
            let y = parseInt(dateArr[0]);
            let m = parseInt(dateArr[1]);
            let da = parseInt(dateArr[2]);

            // invalid date
            if (isNaN(m) || isNaN(y) || isNaN(da)) {
                return date;
            }

            let d = new Date(y - 1, m - 1, da -1);
            let year = dateArr[0];
            let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
            let day = new Intl.DateTimeFormat("en", { day: "numeric" }).format(d);

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
            }

            dateString = month + " " + day + ", " + year;
        }

        return dateString;
    }

    appendColumnDate(item, li) {
        let col1 = document.createElement("div");
        col1.className = "col1";
        col1.innerText = this.parseDateString(item["Date"]);
        li.appendChild(col1);
    }
}

class Api {
    constructor () {
        
    }

    async getTransactionsHelper(transactions, page) {
        return fetch(`https://resttest.bench.co/transactions/${page}.json`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).then(data => {
                if (data) {
                    transactions.push(...data.transactions);
                    page++;
                    if (transactions.length < data.totalCount) {
                        return this.getTransactionsHelper(transactions, page);
                    } else {
                        return transactions;
                    }
                }
            });
    }

    // Gets a list of transactions;
    async getTransactions() {
        const transactions = [];
        let page = 1;
        return await this.getTransactionsHelper(transactions, page);
    }
}

const app = new App();
app.init();