const config = {
  api: {
    baseUrl: 'http://127.0.0.1:8000/api',
    loginEndpoint: '/login',
    registerEndpoint: '/register',
    changePasswordEndpoint: '/change-password',
    myBeneficiariesEndpoint: '/my-beneficiaries',
    otherBeneficiariesEndpoint: '/other-beneficiaries',
    addBeneficiariesEndpoint: '/add-beneficiaries',
    getAccountsEndpoint: '/accounts',
    createAccountsEndpoint: '/create-account',
    closeAccountsEndpoint: '/close-account/',
    makeTransactionEndpoint: '/make-transaction',
    pendingTransactionsEndpoint: '/pending-transactions',
    cancelTransactionEndpoint: '/cancel-transaction/',
    makeTransactionAutoEndpoint: '/make-transaction-auto',
    transactionsEndpoint: '/transactions/',
  },
};

export default config;
