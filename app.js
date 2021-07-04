class App {
    constructor() {

    }

    async init() {
        // get all the items as JSON objects
        const api = new Api();
        api.getTransactions().then(items => {
            // attach items to site
            let listSite = document.getElementById("transaction_list");
            let total = 0;
            items.forEach((item, index) => {
                let li = document.createElement("li");
                li.className = ((index+1) % 2) === 0 ? "even" : "odd";

                let col1 = document.createElement("div");
                col1.className = "col1";
                col1.innerText = item["Date"];
                li.appendChild(col1);

                let col2 = document.createElement("div");
                col2.className = "col2";
                col2.innerText = item["Company"];
                li.appendChild(col2);

                let col3 = document.createElement("div");
                col3.className = "col3";
                col3.innerText = item["Ledger"];
                li.appendChild(col3);

                let col4 = document.createElement("div");
                col4.className = "col4";
                const amount = item["Amount"] * -1;
                total += amount;
                col4.innerText = "$" + amount.toFixed(2);
                li.appendChild(col4);

                listSite.appendChild(li);
            });
            let totalSite = document.getElementById("header_col4");
            totalSite.innerText = "$" + total.toFixed(2);
        });
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