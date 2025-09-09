const categoryContainer = document.getElementById("categoryContainer");
const cardContainer = document.getElementById("card-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

let cart = [];


// try----------
const loadCategoryAsync = async () => {
  try{
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    const categories = data.categories
    console.log(categories)
    showCategory(categories)
  }
   catch (err) {
    console.log(err);
  }
};

const showCategory = (categories) => {
  categories.forEach(cat => {
  categoryContainer.innerHTML += `
          <li class="hover:bg-[#15803d] my-4 rounded-md px-5 py-2">${cat.category_name}</li>
      `
    });
  }

      categoryContainer.addEventListener('click', (e) => {
      const allLi = document.querySelectorAll('li')
    
      allLi.forEach(li => {
        li.classList.remove('border hover:bg-[#15803d]')
      })

      if(e.target.loc)
      console.log(e.target.localName === 'li'); 
      {
        // console.log(e.target.id)
        e.target.classList.add('border hover:bg-[#15803d]')
        loadTreesByCategory(e.target.id)
      }
    });


const loadTreesByCategory = (categoryId) => {
  console.log(categoryId)
  fetch("https:openapi.programming-hero.com/api/category/${categoryId}")
  .then(res => res.json())
  .then(data => {
    console.log(data.category_name)
  })
  .catch(err => {
    console.log(err)
  })
}


loadCategoryAsync();

// ----------------------------

  
// Load categories
  async function loadCategories() {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  data.categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.category;
    li.className = "cursor-pointer hover:text-green-600";
    li.onclick = () => loadPlants(cat.category_id); 
    categoryList.appendChild(li);
  });
}

// Load all plants initially
async function loadPlants(id = "") {
  cardContainer.innerHTML = `<p>Loading...</p>`;
  let url = id 
    ? `https://openapi.programming-hero.com/api/category/${id}`
    : "https://openapi.programming-hero.com/api/plants";
  const res = await fetch(url);
  const data = await res.json();
  renderCards(data.plants || data.data);
}

// Render plant cards
function renderCards(plants) {
  cardContainer.innerHTML = "";
  plants.forEach(p => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow p-4 flex flex-col";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="h-32 w-full object-cover rounded mb-3">
      <h3 class="text-lg font-bold">${p.name}</h3>
      <p class="text-sm text-slate-600 mb-2 h-28">${p.description}</p>
      <div class="flex justify-between items-center my-2">
      <span class="chip bg-[#cff0dc] rounded-full text-[#15803d] px-2">${p.category}</span>
      <p class="font-semibold mt-2"><i class="fa-solid fa-bangladeshi-taka-sign"></i>${p.price}</p>
      </div>
      <button class="btn-primary bg-[#15803d] text-white rounded-full mb-1 py-2">Add to Cart</button>
    `;
    div.querySelector("h3").onclick = () => showModal(p.plantId);
    div.querySelector("button").onclick = () => addToCart(p);
    cardContainer.appendChild(div);
  });
}

// Show modal details
async function showModal(id) {
  const res = await fetch("https://openapi.programming-hero.com/api/plant/${id}");
  const data = await res.json();
  modalContent.innerHTML = `
    <h2 class="font-bold text-xl mb-2">${data.name}</h2>
    <img src="${data.image}" alt="${data.name}" class="mb-3 rounded">
    <p>${data.description}</p>
  `;
  modal.classList.add("active");
}
modalClose.onclick = () => modal.classList.remove("active");

// Cart logic
function addToCart(plant) {
  cart.push(plant);
  renderCart();
}
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center bg-green-50 px-2 py-1 rounded";
    div.innerHTML = `
      <span>${item.name}<i class="fa-solid fa-bangladeshi-taka-sign"></i>${item.price}</span>
      <button onclick="removeFromCart(${i})"><i class="fa-solid fa-xmark"></i></button>
    `;
    cartList.appendChild(div);
  });
  cartTotal.textContent = `
  ৳${total}`;
}
function removeFromCart(i) {
  cart.splice(i,1);
  renderCart();
}


// Init
loadCategories();
loadPlants();