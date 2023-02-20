import {TEST_SYMBOL} from '../common/gloabl/gloable'
import {App} from 'vue'


export default {
    install: (app:App) => {
      app.config.errorHandler=(err:any)=>{

      }
      
      const gloableconfittest = ()=>{
          console.log('gloableconfittest');
          return ' 测试'
      }
      
      app.config.globalProperties.$gloabletest=gloableconfittest;
      
      const gloableprovidetest = ()=>{
          console.log('gloableprovidetest');
          return ' 测试'
      }
      
      app.provide(TEST_SYMBOL, gloableprovidetest);
    }
  }