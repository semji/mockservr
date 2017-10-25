function install(Vue, options) {
    Vue.prototype.$parameters = {
        apiUrl: API_URL
    };
}

export default install;
