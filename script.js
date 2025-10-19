window.onload = function() {  

// get elements from html
let title = document.getElementById("title");
let mainPrice = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let category = document.getElementById("category");
let count = document.getElementById("count");
let createBtn = document.getElementById("createBtn");
let totalPrice = document.getElementById("totalprice");

let dataProducts = [];
let isEditMode = false;
let editIndex = null;

// load local storage
if (localStorage.products != null) {
    dataProducts = JSON.parse(localStorage.products);
} else {
    dataProducts = [];
}

// get total price
function getTotalPrice() {
    if (mainPrice.value !== '') {
        let result = (+mainPrice.value + +taxes.value + +ads.value) - (+discount.value || 0);
        totalPrice.innerHTML = result.toFixed(2);
        totalPrice.style.background = "green";
    } else {
        totalPrice.innerHTML = 0;
        totalPrice.style.background = "red";
    }
}

[mainPrice, taxes, ads, discount].forEach(input => {
    input.addEventListener("input", getTotalPrice);
});

// Create or Edit product
createBtn.onclick = function () {
    let newProduct = {
        title: title.value.toLowerCase(),
        mainPrice: mainPrice.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        count: +count.value || 1, 
        category: category.value.toLowerCase()
    };

    if(title.value!=''
        &&mainPrice.value!=''
        &&category.value!=''
        &&count.value<=1000) {
        if (isEditMode) {
            // Edit
            dataProducts[editIndex] = newProduct;
            isEditMode = false;
            editIndex = null;
            createBtn.innerHTML = "Add Product";
            count.style.display = "block";
            createBtn.classList.remove("btn-edit"); // يرجع بني
        } else {
            // Create
            if (newProduct.count > 1) {
                for (let i = 0; i < newProduct.count; i++) {
                    dataProducts.push({ ...newProduct });
                }
            } else {
                dataProducts.push(newProduct);
            }
        }
    clearData();}

    localStorage.setItem('products', JSON.stringify(dataProducts));
    showProducts();
}

// clear inputs
function clearData() {
    title.value = "";
    mainPrice.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    count.value = "";
    category.value = "";
    totalPrice.innerHTML = 0;
    totalPrice.style.background = "red";
}

// read product
function showProducts() {
    let table = '';
    for (let i = 0; i < dataProducts.length; i++) {
        let total = (+dataProducts[i].mainPrice + +dataProducts[i].taxes + +dataProducts[i].ads) - (+dataProducts[i].discount);
        table += `
            <tr> 
                <td>${i + 1}</td>
                <td>${dataProducts[i].title}</td>
                <td>${dataProducts[i].mainPrice}</td>
                <td>${dataProducts[i].taxes}</td>
                <td>${dataProducts[i].ads}</td>
                <td>${dataProducts[i].discount}</td>
                <td>${total}</td>
                <td>${dataProducts[i].category}</td>
                <td><button class="btn btn-edit" onclick="editProduct(${i})"><i class="bi bi-pencil-square"></i></button></td>
                <td><button class="btn btn-danger" onclick="deleteProduct(${i})"><i class="bi bi-trash"></i></button></td>
            </tr>
        `;
    }
    document.getElementById("tbody").innerHTML = table;

    let btnDelete = document.getElementById("deleteall");
    if (dataProducts.length > 0) {
        btnDelete.innerHTML = ` 
        <button onclick="deleteAll()" class="btn btn-danger"> 
        <i class="bi bi-trash"></i> Delete All (${dataProducts.length}) </button>`;
    } else {
        btnDelete.innerHTML = "";
    }
}
showProducts();

// delete
window.deleteProduct = function(i) {
    dataProducts.splice(i, 1);
    localStorage.setItem('products', JSON.stringify(dataProducts));
    showProducts();
}

// delete all
window.deleteAll = function() {
    localStorage.clear();
    dataProducts = [];
    showProducts();
}

// edit
window.editProduct = function(i) {
    title.value = dataProducts[i].title;
    mainPrice.value = dataProducts[i].mainPrice;
    taxes.value = dataProducts[i].taxes;
    ads.value = dataProducts[i].ads;
    discount.value = dataProducts[i].discount;
    category.value = dataProducts[i].category;
    getTotalPrice();

    count.style.display = 'none';
    createBtn.innerHTML = "Update";
    createBtn.classList.add("btn-edit");
    isEditMode = true;
    editIndex = i;
}

//search
let searchMode='title';
function getSearchMode(id){
    let searchBox=document.getElementById('search')
    if(id=='searchByTitle'){
        searchMode='title';
    }
    else{
        searchMode='category';
    }
    searchBox.placeholder='search by ' +searchMode;
    searchBox.focus();
    searchBox.value=""
}
function search(value){
    let table = '';
    for(let i=0;i<dataProducts.length;i++){
        let total = (+dataProducts[i].mainPrice + +dataProducts[i].taxes + +dataProducts[i].ads) - (+dataProducts[i].discount);
        if(searchMode=='title'){
            if(dataProducts[i].title.includes(value.toLowerCase())){
                    table += `
                        <tr> 
                            <td>${i + 1}</td>
                            <td>${dataProducts[i].title}</td>
                            <td>${dataProducts[i].mainPrice}</td>
                            <td>${dataProducts[i].taxes}</td>
                            <td>${dataProducts[i].ads}</td>
                            <td>${dataProducts[i].discount}</td>
                            <td>${total}</td>
                            <td>${dataProducts[i].category}</td>
                            <td><button class="btn btn-edit" onclick="editProduct(${i})"><i class="bi bi-pencil-square"></i></button></td>
                            <td><button class="btn btn-danger" onclick="deleteProduct(${i})"><i class="bi bi-trash"></i></button></td>
                        </tr>
                    `;
                }
            }
            
    else if(searchMode=='category'){
            if(dataProducts[i].category.includes(value.toLowerCase())){
                    table += `
                        <tr> 
                            <td>${i + 1}</td>
                            <td>${dataProducts[i].title}</td>
                            <td>${dataProducts[i].mainPrice}</td>
                            <td>${dataProducts[i].taxes}</td>
                            <td>${dataProducts[i].ads}</td>
                            <td>${dataProducts[i].discount}</td>
                            <td>${total}</td>
                            <td>${dataProducts[i].category}</td>
                            <td><button class="btn btn-edit" onclick="editProduct(${i})"><i class="bi bi-pencil-square"></i></button></td>
                            <td><button class="btn btn-danger" onclick="deleteProduct(${i})"><i class="bi bi-trash"></i></button></td>
                        </tr>
                    `;
                }
            }
    }

    if (table === '') {
        table = `
            <tr>
                <td colspan="10" style="text-align:center; padding:10px; font-weight:bold; color:#bbb;">
                    No Products Found!
                </td>
            </tr>
        `;
    }
    
        document.getElementById("tbody").innerHTML = table;
}

} 
