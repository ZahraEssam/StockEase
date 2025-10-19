// Core state (global) variables for product management 
let dataProducts = [];  // array storing all products
let isEditMode = false; // flag to track if we are editing an existing product
let editIndex = null;   // index of the product currently being edited

window.onload = function() {  
    let title = document.getElementById("title");
    let mainPrice = document.getElementById("price");
    let taxes = document.getElementById("taxes");
    let ads = document.getElementById("ads");
    let discount = document.getElementById("discount");
    let category = document.getElementById("category");
    let count = document.getElementById("count");
    let createBtn = document.getElementById("createBtn");
    let totalPrice = document.getElementById("totalprice");

    // load local storage
    if (localStorage.products != null && localStorage.products.length > 0) {
        dataProducts = JSON.parse(localStorage.products);
    }

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

        if (isEditMode) {
            dataProducts[editIndex] = { ...newProduct, count: 1 }; 
            isEditMode = false;
            editIndex = null;
            createBtn.innerHTML = "Add Product";
            count.style.display = "block";
            createBtn.classList.remove("btn-edit"); 
            localStorage.setItem('products', JSON.stringify(dataProducts));
            showProducts();
            clearData();
        } else {
            if(title.value != '' && mainPrice.value != '' && category.value != '') {
                for (let i = 0; i < newProduct.count; i++) {
                    dataProducts.push({ ...newProduct });
                }
                localStorage.setItem('products', JSON.stringify(dataProducts));
                showProducts();
                clearData();
            } else {
                alert("Please fill the Product Name, Price, and Category.");
            }
        }
    }

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

    function showProducts() {
        let table = '';
        for (let i = 0; i < dataProducts.length; i++) {
            let total = (+dataProducts[i].mainPrice + +dataProducts[i].taxes + +dataProducts[i].ads) - (+dataProducts[i].discount);
            table += createRow(i, dataProducts[i], total);
        }
        document.getElementById("tbody").innerHTML = table;

        let btnDelete = document.getElementById("deleteall");
        if (dataProducts.length > 0) {
            btnDelete.innerHTML = ` 
            <button id="deleteAllBtn" class="btn btn-danger"> 
            <i class="bi bi-trash"></i> Delete All (${dataProducts.length}) </button>`;
            document.getElementById("deleteAllBtn").addEventListener("click", deleteAll);
        } else {
            btnDelete.innerHTML = "";
        }
    }
    showProducts();

    function deleteProduct(i) {
        dataProducts.splice(i, 1);
        localStorage.setItem('products', JSON.stringify(dataProducts));
        showProducts();
    }

    function deleteAll() {
        localStorage.clear();
        dataProducts = [];
        showProducts();
    }

    function editProduct(i) {
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

    // attach event listeners for dynamic edit/delete buttons
    document.getElementById('tbody').addEventListener('click', function(e){
        if(e.target.closest('.btn-edit')){
            let i = e.target.closest('tr').rowIndex - 1;
            editProduct(i);
        }
        if(e.target.closest('.btn-danger')){
            let i = e.target.closest('tr').rowIndex - 1;
            deleteProduct(i);
        }
    });

    // search
    let searchMode='title';
    let searchBox=document.getElementById('search');

    function getSearchMode(id){
        if(id=='searchByTitle'){
            searchMode='title';
        } else {
            searchMode='category';
        }
        searchBox.placeholder='search by ' +searchMode;
        searchBox.focus();
        searchBox.value="";
    }
    document.getElementById('searchByTitle').addEventListener('click', ()=>getSearchMode('searchByTitle'));
    document.getElementById('searchByCategory').addEventListener('click', ()=>getSearchMode('searchByCategory'));

function search(value){
    let table = '';
    value = value.toLowerCase();
    for(let i=0;i<dataProducts.length;i++){
        let total = (+dataProducts[i].mainPrice + +dataProducts[i].taxes + +dataProducts[i].ads) - (+dataProducts[i].discount);
        if(searchMode=='title' && dataProducts[i].title.includes(value)){
            table += createRow(i, dataProducts[i], total);
        }
        else if(searchMode=='category' && dataProducts[i].category.includes(value)){
            table += createRow(i, dataProducts[i], total);
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


    searchBox.addEventListener('input', ()=>search(searchBox.value));

    function createRow(i, product, total){
        return `
            <tr> 
                <td>${i + 1}</td>
                <td>${product.title}</td>
                <td>${product.mainPrice}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.discount}</td>
                <td>${total}</td>
                <td>${product.category}</td>
                <td><button class="btn btn-edit"><i class="bi bi-pencil-square"></i></button></td>
                <td><button class="btn btn-danger"><i class="bi bi-trash"></i></button></td>
            </tr>
        `;
    }
}
