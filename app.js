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

    formatCurrency(num) {
       const formatter = new Intl.NumberFormat("en", { style: "currency", currency: "USD"});
       return formatter.format(num);
    }

    appendListItems(items) {
        let listSite = document.getElementById("transaction_list");
        let total = 0;

        // create a date object for each item
        items.forEach(item => {
            let dateArr = item["Date"].split("-");
            if (dateArr.length === 3) {
                let y = parseInt(dateArr[0]);
                let m = parseInt(dateArr[1]);
                let da = parseInt(dateArr[2]);

                // invalid date
                if (isNaN(m) || isNaN(y) || isNaN(da)) {
                    return;
                }

                let d = new Date(y, m - 1, da -1);
                item["Date"] = d;
            }
        });

        // sort from most recent to oldest
        items = items.slice().sort((a, b) => b["Date"] - a["Date"]);

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
        totalSite.innerText = this.formatCurrency(total);
    }

    appendColumnAmount(item,li) {
        let col4 = document.createElement("div");
        col4.className = "col4";
        const amount = parseFloat(item["Amount"]);
        col4.innerText = this.formatCurrency(amount);
        li.appendChild(col4);
        return amount;
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

            return month + " " + day + ", " + year;
        } else {
            return date;
        }
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