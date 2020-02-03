import UI from './ui.mjs';
import Products from './products.mjs';
import Storage from './storage.mjs'

document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI()
  const products = new Products()
  ui.setupAPP();
  products.getProducts().then(products => {
    products === [] ? ui.displayProductsLoading() : ui.displayProducts(products)
    Storage.saveProducts(products);
    ui.getBagButtons();
    ui.cartLogic();
  }).catch(err=> console.error(err))
});



















