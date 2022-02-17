const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
// 設定
configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
  });
  
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yunei';


const app = Vue.createApp({
    data() {
        return {
            products: [],
            productId: '',
            cartData: {
                carts: [],
            },
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
            },
            isLoadingItem: '',
        };
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
        openProductModal(id) {
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url)
                .then(res => {
                    this.cartData = res.data.data;
                    // console.log(this.cartData);
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
        addToCart(id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            const data = {
              "data": {
                "product_id": id,
                "qty": qty,
              }
            };
            this.isLoadingItem = id;
            axios.post(url, data)
                .then(res => {
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
        removeCartItem(id) {
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            axios.delete(url)
                .then(res => {
                    this.getCart();
                })
                .catch(error => {
                    console.log(error.response.data)
                });
        },
        updateCartItem(item) {
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
            const data = {
                "data": {
                  "product_id": item.id,
                  "qty": item.qty,
                }
              };
            this.isLoadingItem = item.id;
            axios.put(url, data)
                .then(res => {
                    console.log(res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(error => {
                    console.log(error.response.data)
                });
        },
        deleteAllCart() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    this.getCart();
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
        createOrder() {
            console.log('send');
            const url = `${apiUrl}/api/${apiPath}/order`;
            const data = {
                data: this.form,
            };
            axios.post(url, data)
                .then(res => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch(error => {
                    console.log(error.data);
                });
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
});

app.component('product-modal', {
    props:['id'],
    template: '#userProductModal',
    data() {
        return {
            modal: {},
            product: {},
            qty: 1,
        };
    },
    watch: {
        id() {
            this.product = {};
            this.getProduct();
        },
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        getProduct() {
            const url = `${apiUrl}/api/${apiPath}/product/${this.id}`;
            axios.get(url)
                .then(res => {
                    this.product = res.data.product;
                })
                .catch(error => {
                    console.log(error.response.data)
                });
                
        },
        addToCart() {
            this.$emit('add-cart', this.id, this.qty);
            this.modal.hide();
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})
app.mount('#app');