// first set the groceries and total price variables, the groceries variable will be used to store the items in the local storage and the total price variable will be used to store the total price of the items in the local storage.
const groceries = JSON.parse(localStorage.getItem("groceries")) || [];
let totalPrice = 0;

// Mext is the deleteItems function, this function will be used to delete an item from the list. The function will take two parameters, the index of the item to be deleted and the list item to be deleted. The function will first ask the user if they are sure they want to delete the item, if the user clicks the OK button, the item will be deleted from the list and the total price will be updated. The function will then call the displayItems function to update the list in the browser and the local storage.
function deleteItem(index, listItem) {
  const retVal = confirm("Are you sure you want to delete this item?");
  if (retVal == true) {
    totalPrice -= groceries[index].price;
    groceries.splice(index, 1);
    listItem.remove();
    displayItems();
    localStorage.setItem("groceries", JSON.stringify(groceries));
    calculateTotal();
  }
}

// Next is the diplaysItems function, this function will be used to display the items in the list. The function will first get the list element from the HTML file and store it in a variable called list. The function will then loop through the groceries array and create a list item for each item in the array. The function will then add a close button to each list item and append the list item to the list element. The function will then add an event listener to each list item, this event listener will call the markAsBought function when the user clicks on the list item. The function will then call the calculateTotal function to update the total price of the items in the list.
function displayItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";
  groceries.forEach((itemObj, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = itemObj.name + " - R" + itemObj.price;
    if (itemObj.bought) {
      listItem.classList.add("checkmark");
    } else {
      listItem.classList.remove("checkmark");
    }
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.textContent = " \u00D7";
    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteItem(index, listItem);
    });
    listItem.appendChild(closeBtn);
    list.appendChild(listItem);
    listItem.addEventListener("click", () => markAsBought(index));
  });
  calculateTotal();
}

// Next is the markAsBought function, this function will be used to mark an item as bought. The function will take one parameter, the index of the item to be marked as bought. The function will first get the list element from the HTML file and store it in a variable called list. The function will then get the list item from the list element using the index parameter and store it in a variable called listItem. The function will then check if the item is already marked as bought, if it is, the function will remove the checkmark class from the list item and set the bought property of the item to false. If the item is not marked as bought, the function will add the checkmark class to the list item and set the bought property of the item to true. The function will then update the local storage and call the calculateTotal function to update the total price of the items in the list.
function markAsBought(index) {
  const list = document.getElementById("itemList");
  const listItem = list.children[index];
  if (groceries[index].bought) {
    groceries[index].bought = false;
    listItem.classList.remove("checkmark");
    } else {
    groceries[index].bought = true;
    listItem.classList.add("checkmark");
  }
  localStorage.setItem("groceries", JSON.stringify(groceries));
}

// Next is the updateList function, this function will be used to add a new item to the list. The function will first get the input element from the HTML file and store it in a variable called input. The function will then get the value of the input element and store it in a variable called newItem. The function will then get the price input element from the HTML file and store it in a variable called priceInput. The function will then get the value of the price input element and store it in a variable called newPrice. The function will then check if the newItem variable is empty, if it is, the function will set the custom validity of the input element to "Please enter an item name.". If the newItem variable is not empty, the function will check if the newPrice variable is not a number, if it is not a number, the function will display an alert message to the user. If the newPrice variable is a number, the function will set the custom validity of the input element to an empty string. The function will then add the new item to the groceries array and clear the input and price input elements. The function will then update the local storage, call the calculateTotal function to update the total price of the items in the list and call the displayItems function to update the list in the browser.
function updateList() {
  const input = document.getElementById("input");
  const newItem = input.value.trim();
  const priceInput = document.getElementById("price");
  const newPrice = parseFloat(priceInput.value);
  if (newItem == "") {
    input.value = "";
    input.setCustomValidity("Please enter an item name.");
  } else if (isNaN(newPrice)) {
    alert("Please enter a valid price.");
  } else {
    input.setCustomValidity("");
    priceInput.setCustomValidity("");
    groceries.push({
      name: newItem,
      price: newPrice,
      bought: false
    });
    input.value = "";
    priceInput.value = "";
    localStorage.setItem("groceries", JSON.stringify(groceries));
    calculateTotal();
    displayItems();
  }
}
// Next is the event listener for the input element, this event listener will call the updateList function when the user presses the enter key.
const inputElement = document.getElementById("input");
inputElement.addEventListener("keypress", function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    updateList();
  }
});
document.getElementById("addBtn").addEventListener("click", updateList);

//Next we create a calculateTotal function, this function will be used to calculate the total price of the items in the list. The function will first create a variable called total and set it to 0. The function will then loop through the groceries array and add the price of each item to the total variable. The function will then set the totalPrice variable to the value of the total variable and display the total price in the browser.
function calculateTotal() {
  let total = 0;
  groceries.forEach(item => {
    total += item.price;
  });
  totalPrice = total;
  document.getElementById("total").textContent = "Total: R" + total.toFixed(2);
}

displayItems();
