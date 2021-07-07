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