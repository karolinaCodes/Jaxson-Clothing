"use strict";
import { allProducts } from "./all-products.js";

//////////////////Pagination

const itemsPerPage = 16;
let currPage = 1;
const middleEl = document.querySelector(".middle-section");
const productsPage = document.querySelector(".products-page");
let currArray = allProducts;
const bodyEl = document.querySelector(".body");
//^just to change the width with removing el

const paginationBtns = function (numberOfItems) {
  const unorderedList = document.querySelector(".numbers");
  const numberOfPages = Math.ceil(numberOfItems / 16);
  for (let i = 0; i <= numberOfPages; i++) {
    if (i === numberOfPages) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `→`;
      listItem.setAttribute("id", "arrow");
      unorderedList.appendChild(listItem);
      return;
    }
    const listItem = document.createElement("li");
    listItem.innerHTML = `${i + 1}`;
    unorderedList.appendChild(listItem);
  }
};
paginationBtns(allProducts.length);

const displayItems = function (itemsPerPage, currPage, array) {
  const start = (currPage - 1) * itemsPerPage;
  const end = currPage * itemsPerPage;
  const trimmed = array.slice(start, end);
  const productsSection = document.querySelector(".products");
  productsSection.innerHTML = "";
  trimmed.forEach(function (el) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.setAttribute("data-popularity", `${el.popularity}`);
    div.setAttribute("data-price", `${el.price}`);
    div.setAttribute("item", `${el.item}`);
    div.innerHTML = `<div class="container">
        <img src="imgs/${el.item}.jpg" alt="${el.item}"/>
        <div class="overlay">
          <div class="icons">
            <a href="#" class="icon"> <i class="fas fa-cart-plus"></i></a>
            <div class="icon"><i class="fas fa-search"></i></div>
          </div>
        </div>
      </div>
      <p class="title">${el.productName}</p>
      <p class="grey-text">${el.description}</p>
      <span>$ ${
        Number.isInteger(el.price) ? String(el.price) + ".00" : el.price
      } USD</span> <span class="slash">$ ${el.originalprice} USD</span>
      </div>`;
    productsSection.appendChild(div);
  });
};
//have to reselect all the elements
displayItems(itemsPerPage, currPage, currArray);

const paginationBtnsContainer = document.querySelector(".numbers");

paginationBtnsContainer.addEventListener("click", function (e) {
  switch (e.target.innerHTML) {
    case "1":
      currPage = 1;
      displayItems(itemsPerPage, 1, currArray);
      break;
    case "2":
      currPage = 2;
      displayItems(itemsPerPage, 2, currArray);
      break;
    case "3":
      currPage = 3;
      displayItems(itemsPerPage, 3, currArray);
      break;
    case "→":
      if (currPage === 3) return;
      currPage++;
      displayItems(itemsPerPage, currPage, currArray);
  }
});

/////////////////////////Selectors
const overlay = document.querySelector(".overlay");
const cartBtn = document.querySelector(".fa-shopping-cart");
const addToCartBtn = document.querySelectorAll(".fa-cart-plus");
const sideCartOverlay = document.querySelector(".cart-overlay");
const sideCart = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".close-cart");
const cartContent = document.querySelector(".cart-content");
const cartFooter = document.querySelector(".cart-footer");
const quantityArrows = document.querySelector(".quantity");

/////////////////////Bag Functionality

let bag = [];

// when user clicks on cart btn, cart opens
cartBtn.addEventListener("click", function (e) {
  e.preventDefault();
  openCart();
});

//if no child of cart-content then add the "no items in bag" msg
const noItemsMsg = function () {
  //checks if there are no cart items, if not, makes the footer invisible and add the "no items in cart" msg
  if (!cartContent.querySelector(".cart-item")) {
    const cartFooter = document.querySelector(".cart-footer");
    const cartContent = document.querySelector(".cart-content");
    cartFooter.classList.add("cart-footer-invisible");
    const html = `<div class="empty-cart-msg">
    <p>There are no items in your cart.</p>
    <a href="../products-page/products.html"><button class="shop-btn">VISIT SHOP</button></a>
    </div>`;
    cartContent.insertAdjacentHTML("afterbegin", html);
  }
};
//display no items msg at beginning since so items at beginning
noItemsMsg();

//event listener on body div becuase when remove the product el you remove the event listener thats on it too addItemToCart
const eventController = function (e) {
  let el = e.target;
  if (el.classList.contains("fa-shopping-cart")) openCart();

  //Add to cart
  if (el.classList.contains("fa-cart-plus")) {
    e.preventDefault();
    openCart();
    //getting the alt attribute for the image of that overlay
    const selectedItem = el
      .closest(".overlay")
      .previousElementSibling.getAttribute("alt");
    console.log("here");
    renderCartItem(selectedItem);
  }
  const middle = document.querySelector(".middle-section");

  //open item description
  if (el.classList.contains("fa-search")) {
    //finding out which magnify glass was clicked for which item
    const product = e.target.closest(".item").getAttribute("item");
    console.log(product);
    //find the full object in the allproducts array
    const fullProduct = allProducts.find((el) => el.item === product);
    changeToProductDescription(fullProduct);
    const productCartBtn = document.querySelector(".add-to-cart-btn");
    productCartBtn.addEventListener("click", function () {
      const numbersInput = document.querySelector("input");
      let quantity = +numbersInput.value;
      console.log(quantity);
      renderCartItem(product, quantity);
      openCart();
    });
  }
  //go back to products page
  if (el.classList.contains("fa-arrow-right")) {
    Array.from(middleEl.children).forEach((el) => el.remove());
    middleEl.appendChild(productsPage);
    bodyEl.style.setProperty("width", "89%");
    // saved the el in variable (saved with event handlers and functionality) removed it, then reappended in as child
  }
};

middleEl.addEventListener("click", eventController);

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
      <h5 class="price">$${
        Number.isInteger(itemFromArray.price)
          ? String(itemFromArray.price) + ".00"
          : itemFromArray.price
      } USD</h5>
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
      const html = `<div class="cart-item ${item.item}">
  <img src="${item.image}" alt="${item.item}">
  <div class="product-price">
      <h4>${item.productName}</h4>
      <h5 class="price">$ ${item.price} USD</h5>
      <span class="remove-item">Remove</span>
  </div>
  <div class="quantity">
      <i class="fas fa-chevron-up arrow"></i>
<p class="item-amount">${item.quantity}</p>
<i class="fas fa-chevron-down arrow"></i>
  </div>
</div>`;
      const cartContent = document.querySelector(".cart-content");
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
  const sideCartOverlay = document.querySelector(".cart-overlay");
  const sideCart = document.querySelector(".cart");
  sideCartOverlay.classList.remove("transparentBcg");
  sideCart.classList.remove("showCart");
};

//open side cart
function openCart() {
  const sideCartOverlay = document.querySelector(".cart-overlay");
  const sideCart = document.querySelector(".cart");
  sideCartOverlay.classList.add("transparentBcg");
  sideCart.classList.add("showCart");
}

//when user clicks x btn in cart, it closes
closeCartBtn.addEventListener("click", closeCart);

//when user clicks outside of cart the cart closes
function closeCartOutside(removeItemBtn) {
  const sideCart = document.querySelector(".cart");
  const sideCartOverlay = document.querySelector(".cart-overlay");
  sideCart.classList.add("showCart");
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
  //gets item out of storage, saves new array of items that are not the item that is to be deleted, to bag, then save to local storage and displays the total
  const storageBag = JSON.parse(localStorage.getItem("bag"));
  bag = storageBag.filter((item) => item.item !== i);
  saveToLocalStorage(bag);
  displaySubtotal(bag);
};

function displaySubtotal(bag) {
  const cartTotalEl = document.querySelector(".cart-total");
  //add the prices (multiplied by the quantity) of the items in the bag
  const subtotal = bag.reduce(function (acc, curVal) {
    return acc + curVal.price * curVal.quantity;
  }, 0);
  const decimal = parseFloat(subtotal.toFixed(2));
  cartTotalEl.innerHTML = Number.isInteger(decimal)
    ? String(decimal) + ".00"
    : decimal;
}

function changeQuantity() {
  //adding event listener for event delegation for the arrows
  const cartContent = document.querySelector(".cart-content");
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
      console.log(index);
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

      const index = bag.findIndex((el) => el.item === `${parentElClass}`);
      bag[index1].quantity--;
      saveToLocalStorage(bag);
      //updates subtotal
      displaySubtotal(bag);
    }
  });
}

///////////////// Functionality for Products Page

const dropDownMenu = document.querySelector(".dropdown");
const allItems = document.querySelectorAll(".item");
const allProductsCopy = [...allProducts];

dropDownMenu.addEventListener("click", function (e) {
  //2.selects all items in products section, array.from to turn into array bc nodelist
  //sort- mutates original array
  const itemList = Array.from(document.querySelectorAll(".item"));
  switch (e.target.value) {
    case "popularity":
      allProducts.sort(function (a, b) {
        return a.popularity - b.popularity;
      });

      //remove all curr el in products section
      itemList.forEach(function (el) {
        el.remove();
      });

      displayItems(itemsPerPage, currPage, currArray);
      break;

    case "low-high":
      allProducts.sort(function (a, b) {
        return a.price - b.price;
      });

      itemList.forEach(function (el) {
        el.remove();
      });

      displayItems(itemsPerPage, currPage, currArray);
      break;

    case "high-low":
      allProducts.sort(function (a, b) {
        return b.price - a.price;
      });

      itemList.forEach(function (el) {
        el.remove();
      });

      displayItems(itemsPerPage, currPage, currArray);
      break;

    case "newest":
      currArray = allProductsCopy;
      itemList.forEach(function (el) {
        el.remove();
      });
      displayItems(itemsPerPage, currPage, currArray);
  }
});

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
          <span class="price">$ ${
            Number.isInteger(fullProduct.price)
              ? String(fullProduct.price) + ".00"
              : fullProduct.price
          } USD </span>
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
            <div class="item item-fromdescription" item="glasses">
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

            <div class="item item-fromdescription" item="purse">
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

        <div class="item item-fromdescription" item="heels">
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

        <div class="item item-fromdescription" item="shoes">
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
        <span>$ 299.99 USD <span class="slash"> $ 359.99 USD</span>
    </div>
</div>
      </div>
      <!--end of more for you-->
</html>
`;
  middleEl.insertAdjacentElement("afterbegin", div);
  bodyEl.style.setProperty("width", "100%");
  const body = document.querySelector("body");
  body.scrollIntoView({ behavior: "smooth" });
};
