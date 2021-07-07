class App {
    constructor() {
    }

    async init() {
        // get all the items as JSON objects
        const api = new Api();
        const transactions = new Transactions();
        api.getTransactions().then(items => {
            // attach items to site
            transactions.appendListItems(items);
        });
    }    
}

const app = new App();
app.init();