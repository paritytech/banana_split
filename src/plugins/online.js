const plugin = {
    install (Vue) {
      const vm = new Vue({ 
        data: { 
          online: window.navigator.onLine 
        }
      });
  
      window.addEventListener('online', function handleOnline() { 
        vm.$data.online = true;
      });
      
      window.addEventListener('offline', function handleOffline() {
        vm.$data.online = false;
      });
  
      Vue.mixin({
        computed: {
          isOnline() {
            return vm.$data.online;
          }
        }
      });
    }
  };
  
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
  }
  
  export default plugin