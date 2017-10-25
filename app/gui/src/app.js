import Vue from 'vue';
import VueResource from 'vue-resource-2';
import router from './router';
import App from './App.vue';
import VueMaterial from 'vue-material'
import parameters from './parameters';
import 'vue-material/dist/vue-material.css';

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(VueMaterial);
Vue.use(parameters);

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
});
