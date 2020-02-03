import Storage from './storage.mjs'

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const overlayerDOM = document.getElementById('cart-overlay');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
let cart = [];
let buttonsDOM = [];
export default class UI{
  setupAPP(){
    cart = Storage.getCart();
    cart.forEach(item=>this.addCartItem(item))
    this.setCartValues(cart);
  }
  setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.forEach(item=>{
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal
  }
  displayProducts(products){
    let result = '';
    products.forEach(product => {
      result += `
        <article class="product" id="productN${product.id}">
          <img src=${product.image}
          alt="product" 
          class="product__img">
          <div class="product__text">
              <h3>${product.title}</h3>
              <h4>€${product.price.toFixed(2)}</h4>
          </div>
          <button class="product__cart-btn" data-id=${product.id}>
          <i class="fas fa-shopping-cart"></i>
          add to cart
          </button>
        </article>
      `
    });
    productsDOM.innerHTML = result;  
  }
  displayProductsLoading(){
    let result = ` 
      <article class="product" >
        <h1> LOOOOOOOOOOOOOOADING </h1>
      </article>
    `
    productsDOM.innerHTML = result;
  }
  getBagButtons(){
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
    overlayerDOM.addEventListener('click', this.hideCart)
    const buttons = [...document.querySelectorAll(".product__cart-btn")];
    buttonsDOM = buttons
    buttons.forEach(button=>{
      let id = button.dataset.id
      let inCart = cart.find(item => item.id === id);
      let disableButton = item=>{
        item.innerText = 'In Cart';
        item.disabled = true;
      }
      if(inCart){
        disableButton(button)
      } 
      button.addEventListener("click", event=>{
        disableButton(event.target)
        let cartItem = {...Storage.getProduct(id), amount: 1};
        cart = cart.concat(cartItem);
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem)
        this.showCart()
      })
    })
  }
  addCartItem(item){
    let div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src=${item.image} alt="product">
      <div>
        <h4>${item.title}</h4>
        <h5>£${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
      </div>
      <div class="itemNumber">
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="itemNumber__amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
    `;
    cartContent.appendChild(div);
  }
  showCart(){
    TweenMax.to(cartOverlay, 0.25, {visibility: "visible", backgroundColor: "rgba(0, 0, 0, 0.7)", ease: Expo.easeOut});
    TweenMax.to(cartDOM, 1, {right: 0, ease: Expo.easeOut});
    TweenMax.to(document.body, 0.25, {overflow: 'hidden'});
  }
  hideCart(){
    TweenMax.to(cartOverlay, 0.25, {visibility: "hidden", background: "rgba(0, 0, 0, 0)", ease: Expo.easeOut});
    TweenMax.to(cartDOM, 0.25, {right: "-100%", ease: Expo.easeIn});
    TweenMax.to(document.body, 0.25, {overflow: 'auto'});
  }
  cartLogic(){
    clearCartBtn.addEventListener('click', ()=>{
      this.clearCart(); 
    });
    cartContent.addEventListener('click', event=>{ 
      if(event.target.classList.contains('remove-item')){
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id)
      } else if (event.target.classList.contains('fa-chevron-up')){
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')){
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0 ){
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        }else{
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    })
  }
  clearCart(){
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id=>this.removeItem(id))
    while(cartContent.children.length > 0){
      cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();
  }
  removeItem(id){
    cart = cart.filter(item=>item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id)
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
  }
  getSingleButton(id){
    return buttonsDOM.find(button=>button.dataset.id === id)
  }
}