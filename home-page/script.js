"use strict";
import { allProducts } from "../products-page/all-products.js";

const glasses = {
  item: "glasses",
  productName: "Comfort Eyewear",
  description: "Unisex Eyewear",
  price: 34.99,
  image: "./imgs/glasses.jpg",
  quantity: 1,
};

const purse = {
  item: "purse",
  productName: "Weezbeez Rose Gold",
  description: "Lady's Bag",
  price: 19.99,
  image: "./imgs/purse.jpg",
  quantity: 1,
};

const heels = {
  item: "heels",
  productName: "Vivio Brown",
  description: "Women's Shoes",
  price: 44.99,
  image: "./imgs/heels.jpg",
  quantity: 1,
};

const shoes = {
  item: "shoes",
  productName: "Melvin Kicks",
  description: "Men's Shoes",
  price: 299.99,
  image: "./imgs/shoes.jpg",
  quantity: 1,
};

//Selectors
const overlay = document.querySelector(".overlay");
const addToCartBtn = document.querySelectorAll(".fa-cart-plus");
const newArrivalsSection = document.querySelector(".new-arrivals");
const sideCartOverlay = document.querySelector(".cart-overlay");
const sideCart = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".close-cart");
const cartContent = document.querySelector(".cart-content");
const cartBtn = document.querySelector(".fa-shopping-cart");
const cartFooter = document.querySelector(".cart-footer");
const quantityArrows = document.querySelector(".quantity");
const middleEl = document.querySelector(".middle-section");
const body = document.querySelector(".body");
console.log(middleEl);
const homePage = document.querySelector(".home-page");

let bag = [];

//when user clicks on cart btn, cart opens
cartBtn.addEventListener("click", function (e) {
  e.preventDefault();
  openCart();
});

//if no child of cart-content then add the "no items in bag" msg
const noItemsMsg = function () {
  //checks if there are no cart items, if not, makes the footer invisible and add the "no items in cart" msg
  if (!cartContent.querySelector(".cart-item")) {
    cartFooter.classList.add("cart-footer-invisible");
    const html = `<div class="empty-cart-msg">
    <p>There are no items in your cart.</p>
    <a href="../products-page/products.html"><button class="shop-btn">VISIT SHOP</button></a>
    </div>`;
    cartContent.insertAdjacentHTML("afterbegin", html);
  }
};
//display no items msg at beggining since no items at beginning
noItemsMsg();

const iconBtnsController = function (e) {
  const el = e.target;
  if (el.classList.contains("fa-cart-plus")) {
    e.preventDefault();
    openCart();
    //getting the alt attribute for the image of that overlay
    const selectedItem = el
      .closest(".overlay")
      .previousElementSibling.getAttribute("alt");

    renderCartItem(selectedItem);
  }
  //open item description
  if (el.classList.contains("fa-search")) {
    //finding out which magnify glass was clicked for which item
    console.log(e.target);
    const product = e.target.closest(".item").getAttribute("item");
    //find the full object in the allproducts array
    const fullProduct = allProducts.find((el) => el.item === product);
    changeToProductDescription(fullProduct);
    const productCartBtn = document.querySelector(".add-to-cart-btn");
    productCartBtn.addEventListener("click", function () {
      const numbersInput = document.querySelector("input");
      let quantity = +numbersInput.value;
      console.log(quantity);
      renderCartItem(product, quantity);
    });
  }
  //go back to products page
  if (el.classList.contains("fa-arrow-right")) {
    console.log("rightarow");
    Array.from(middleEl.children).forEach((el) => el.remove());
    middleEl.appendChild(homePage);
  }
};

//open the side shopping cart when user clicks cart btn on item
body.addEventListener("click", iconBtnsController);

const renderCartItem = function (item, quantity = 1) {
  const itemFromArray = allProducts.find((el) => el.item === item);
  //if the item is already in the cart, increase the quantity (of the specific item that was added)instead of rendering the item again
  //1selects item that already in bag, 2if item is there, selects the p el with the quantity and adds to that one.
  const elAlreadyThere = document.querySelector(`.cart-item.${item}`);
  if (elAlreadyThere) {
    const quantityofItem = elAlreadyThere.querySelector(".item-amount");
    quantityofItem.innerHTML = +quantityofItem.innerHTML + quantity;
    //finds the duplicate el in array and gets the index, removes that element(splice), increases the quantity and then add it to the bag (replacing the first el (push)) and then resaving that bag to the local storage
    const duplicate = bag.find((el) => el.item === `${item}`);
    const index = bag.indexOf(duplicate);
    bag.splice(index, 1);
    duplicate.quantity += quantity;
    console.log(duplicate.quantity);
    bag.push(duplicate);
    console.log(duplicate);
    saveToLocalStorage(bag);
    displaySubtotal(bag);
    return;
  }

  const html = `<div class="cart-item ${itemFromArray.item}">
  <img src="${itemFromArray.image}" alt="${itemFromArray.item}">
  <div class="product-price">
      <h4>${itemFromArray.productName}</h4>
      <h5 class="price">$ ${itemFromArray.price} USD</h5>
      <span class="remove-item">Remove</span>
  </div>
  <div class="quantity">
      <i class="fas fa-chevron-up arrow"></i>
<p class="item-amount">${quantity}</p>
<i class="fas fa-chevron-down arrow"></i>
  </div>
</div>`;
  const cartContent = document.querySelector(".cart-content");
  cartContent.insertAdjacentHTML("beforeend", html);
  itemFromArray.quantity = quantity;
  bag.push(itemFromArray);
  saveToLocalStorage(bag);

  const emptyCartMsg = document.querySelector(".empty-cart-msg");

  closeCartOutside();
  if (emptyCartMsg) {
    emptyCartMsg.remove();
    cartFooter.classList.remove("cart-footer-invisible");
  }
  displaySubtotal(bag);
};

//renders the item in local storage
const takeOutLocalStorage = function () {
  if (localStorage.getItem("bag")) {
    const saved = JSON.parse(localStorage.getItem("bag"));
    bag = saved;
    saved.forEach((item) => {
      const itemObj = eval(item);
      const html = `<div class="cart-item ${itemObj.item}">
  <img src="${itemObj.image}" alt="${itemObj.item}">
  <div class="product-price">
      <h4>${itemObj.productName}</h4>
      <h5 class="price">$ ${itemObj.price} USD</h5>
      <span class="remove-item">Remove</span>
  </div>
  <div class="quantity">
      <i class="fas fa-chevron-up arrow"></i>
<p class="item-amount">${itemObj.quantity}</p>
<i class="fas fa-chevron-down arrow"></i>
  </div>
</div>`;
      cartContent.insertAdjacentHTML("beforeend", html);
    });
    closeCartOutside();

    const emptyCartMsg = document.querySelector(".empty-cart-msg");
    if (emptyCartMsg) {
      emptyCartMsg.remove();
      cartFooter.classList.remove("cart-footer-invisible");
    }

    displaySubtotal(bag);
    changeQuantity();
    if (!cartContent.querySelector(".cart-item")) {
      noItemsMsg();
    }
  }
};
takeOutLocalStorage();

//close side cart
const closeCart = function () {
  sideCartOverlay.classList.remove("transparentBcg");
  sideCart.classList.remove("showCart");
};

//open side cart
function openCart() {
  sideCartOverlay.classList.add("transparentBcg");
  sideCart.classList.add("showCart");
}

//when user clicks x btn in cart, it closes
closeCartBtn.addEventListener("click", closeCart);

//when user clicks outside of cart the cart closes
function closeCartOutside(removeItemBtn) {
  sideCartOverlay.addEventListener("click", function (e) {
    const el = e.target;
    //if element that isn't in cart and element that isn't remove button, then closes the cart
    if (
      !el.closest(".cart") &&
      !el.classList.contains("remove-item") &&
      !el.classList.contains("fa-chevron-down")
    ) {
      sideCartOverlay.classList.remove("transparentBcg");
      sideCart.classList.remove("showCart");
    }
  });
}

//click remove and cart item is removed and 'no items" msg appears
const removeItem = function (e) {
  const el = e.target;
  //if remove button is clicked..removes the cart-content element
  if (el.classList.contains("remove-item")) {
    const elToRemove = e.target.parentElement.parentElement;
    elToRemove.remove();
    noItemsMsg();
    //gets the alt of the child of the element to remove bc its easier than getting the class of the eltoremove el
    const itemToRemove = elToRemove.querySelector("img").getAttribute("alt");
    deletefromLocalStorage(itemToRemove);
  }
};

function saveToLocalStorage(bag) {
  localStorage.setItem("bag", JSON.stringify(bag));
}

//event delegation for the cartContent to handle when user clicks remove btn
cartContent.addEventListener("click", removeItem);

const deletefromLocalStorage = function (i) {
  //gets the item name(i) and the fullitem, gets the storage bag, matches the item from storage bag to the item that needs to be removed, finds the index of the item and removes it then saves again to storage
  // const fullItem = eval(i);
  const storageBag = JSON.parse(localStorage.getItem("bag"));
  const itemToRemove = storageBag.find((el) => el.item === `${i.item}`);
  const index = bag.indexOf(itemToRemove);
  bag.splice(index, 1);
  saveToLocalStorage(bag);
  displaySubtotal(bag);
};

function displaySubtotal(bag) {
  const cartTotalEl = document.querySelector(".cart-total");
  //add the prices (multiplied by the quantity) of the items in the bag
  const subtotal = bag.reduce(function (acc, curVal) {
    return acc + curVal.price * curVal.quantity;
  }, 0);
  cartTotalEl.innerHTML = parseFloat(subtotal.toFixed(2));
}
//decrease total when remove (and lower quantity)

function changeQuantity() {
  //adding event listener for event delegation for the arrows
  cartContent.addEventListener("click", function (e) {
    let el = e.target;
    //parent el of the arrow and its class name (ex.glasses)
    const parentElClass = el.parentElement.parentElement.classList.item(1);
    if (el.classList.contains("fa-chevron-up")) {
      const parentEl2 = document.querySelector(`.${parentElClass}`);
      const childEl = parentEl2.querySelector(".item-amount");
      childEl.innerHTML++;
      //decreases quantity of el in the bag
      const index = bag.findIndex((el) => el.item === `${parentElClass}`);
      bag[index].quantity++;
      saveToLocalStorage(bag);
      //updates subtotal;
      displaySubtotal(bag);
    }
    if (el.classList.contains("fa-chevron-down")) {
      const parentEl2 = document.querySelector(`.${parentElClass}`);
      parentEl2.querySelector(".item-amount").innerHTML--;

      const childEl = parentEl2.querySelector(".item-amount");
      //when quantity gets to 0, removes the element
      if (childEl.innerHTML === "0") {
        parentEl2.remove();
        const itemToRemove = bag.find((el) => el.item === `${parentElClass}`);
        const index = bag.indexOf(itemToRemove);
        bag.splice(index, 1);
        saveToLocalStorage(bag);
        //updates subtotal
        displaySubtotal(bag);
        noItemsMsg();
        return;
      }

      const itemToDecrease = bag.find((el) => el.item === `${parentElClass}`);
      const index1 = bag.indexOf(itemToDecrease);
      bag[index1].quantity--;
      saveToLocalStorage(bag);
      //updates subtotal
      displaySubtotal(bag);
    }
  });
}

const changeToProductDescription = function (fullProduct) {
  //for each child of the body, remove the element
  Array.from(middleEl.children).forEach((el) => el.remove());
  const div = document.createElement("div");
  div.innerHTML = `<div class="product-details">
        <div class="image">
          <img class="img-single" src="${fullProduct.image}" />
        </div>
        <div class="container2">
        <div class="description">
          <p class="grey-text-single">${fullProduct.description}</p>
          <h2>${fullProduct.productName}</h2>
          <span class="price">$ ${fullProduct.price} USD </span>
          <span class="price slash"> $ ${fullProduct.originalprice} USD</span>
          <p id="para">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <ul class="list">
            <li class="li">100% Testing</li>
            <li class="li">Size: 11" x 24"</li>
            <li class="li">Leather Skin</li>
          </ul>
          <div class="quantity-section">
            <h2 id="quantity">Quantity</h2>
            <div class="add-to-cart">
              <input type="number" min="1" value="1" />
              <button class="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
        </div>
        <i class="fas fa-arrow-right"></i>
    </div>
    </div>

      <!--end of product description-->

      <!--more for you-->
      <div class="more-for-you">
        <h1>More For You</h1>
        <div class="more-products">
            <div class="more-products-item">
            <div class="container">
        <img class="new-img img-single" src="imgs/glasses.jpg" alt="glasses">
        <div class="overlay">
            <div class="icons">
              <a href="#" class="icon"> <i class="fas fa-cart-plus"></i></a>
              <div class="icon"><i class="fas fa-search"></i></div>
            </div>
          </div>
    </div>
        <p>Comfort Eyewear</p>
        <p class="grey-text-single">Unisex Eyewear</p>
        <span>$ 34.00 USD</span> <span class="slash">$ 59.00 USD</span>
    </div>

            <div class="more-products-item">
            <div class="container">
        <img class="new-img img-single" src="imgs/purse.jpg" alt="purse">
        <div class="overlay">
            <div class="icons">
              <a href="#" class="icon"> <i class="fas fa-cart-plus"></i></a>
              <div class="icon"><i class="fas fa-search"></i></div>
            </div>
          </div>
    </div>
        <p>Weezbeez Rose Gold</p>
        <p class="grey-text-single">Lady's Bag</p>
        <span>$ 19.99 USD</span> <span class="slash">$ 59.99 USD</span>
    </div>

        <div class="more-products-item">
        <div class="container">
        <img class="new-img img-single" src="imgs/heels.jpg" alt="heels">
        <div class="overlay">
            <div class="icons">
              <a href="#" class="icon"> <i class="fas fa-cart-plus"></i></a>
              <div class="icon"><i class="fas fa-search"></i></div>
            </div>
          </div>
    </div>
        <p>Vivio Brown</p>
        <p class="grey-text-single">Women's Shoe</p>
        <span>$ 44.99 USD</span> <span class="slash"> $ 79.99 USD</span>
        </div>

        <div class="more-products-item">
        <div class="container">
        <img class="new-img img-single" src="imgs/shoes.jpg" alt="shoes">
        <div class="overlay">
            <div class="icons">
              <a href="#" class="icon"> <i class="fas fa-cart-plus"></i></a>
              <div class="icon"><i class="fas fa-search"></i></div>
            </div>
          </div>
        </div>
        <p>Melvin Kicks</p>
        <p class="grey-text-single">Men's Shoe</p>
        <span>$ 299.99 USD<span class="slash"> $ 359.99 USD</span>
    </div>
</div>
      </div>
      <!--end of more for you-->
</html>
`;
  middleEl.insertAdjacentElement("afterbegin", div);
  const body = document.querySelector("body");
  body.scrollIntoView({ behavior: "smooth" });
};
