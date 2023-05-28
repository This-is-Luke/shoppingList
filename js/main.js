// Initialize groceries array from localStorage or an empty array
const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
let totalPrice = 0;

// Deletes an item from the groceries array and updates the view
function deleteItem(index) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  groceries.splice(index, 1);
  saveAndUpdateItems();
}

// Saves the groceries array to localStorage and updates the view
function saveAndUpdateItems() {
  localStorage.setItem('groceries', JSON.stringify(groceries));
  displayItems();
}

// Displays the groceries items in the HTML table
function displayItems() {
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  groceries.forEach((itemObj, index) => {
    const listItem = createListItem(itemObj, index);
    list.appendChild(listItem);
  });
  calculateTotal();
}

// Creates a table row element for a grocery item
function createListItem(itemObj, index) {
  const listItem = document.createElement('tr');
  listItem.className = 'row';
  listItem.innerHTML = `
    <td class="item-name">${itemObj.name}</td>
    <td class="price-cell">R${itemObj.price}</td>
    <td class="table-actions">
      <button onclick="editItem(${index})">Price</button>
      <button onclick="deleteItem(${index})">Delete</button>
      <input type="checkbox" class="checkmark" id="purchased-${index}" ${itemObj.purchased ? 'checked' : ''} onclick="togglePurchased(${index})">
    </td>
  `;
  attachCheckboxListener(listItem);
  return listItem;
}

// Adds a change event listener to the checkbox of a table row
function attachCheckboxListener(listItem) {
  const checkbox = listItem.querySelector('.checkmark');
  checkbox.addEventListener('change', event => {
    const row = event.target.closest('.row');
    if (event.target.checked) row.classList.add('checked');
    else row.classList.remove('checked');
  });
}

// Toggles the purchased status of a grocery item
function togglePurchased(index) {
  groceries[index].purchased = !groceries[index].purchased;
  saveAndUpdateItems();
}

// Allows editing the price of a grocery item
function editItem(index) {
  const row = document.getElementById('itemList').rows[index];
  const priceCell = row.querySelector('.price-cell');
  const input = createPriceInput(groceries[index].price);
  priceCell.innerHTML = '';
  priceCell.appendChild(input);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update';
  updateButton.onclick = () => updateItem(index, input);
  row.cells[2].appendChild(updateButton);

  input.focus();
  input.select();
  input.addEventListener('keydown', event => handleKeyDown(event, index));
}

// Creates a price input element for editing a grocery item
function createPriceInput(price) {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = price;
  input.min = 0;
  input.step = 0.01;
  return input;
}

// Updates the price of a grocery item and refreshes the view
function updateItem(index, input) {
  groceries[index].price = parseFloat(input.value);
  saveAndUpdateItems();
}

// Calculates and displays the total price of all grocery items
function calculateTotal() {
  totalPrice = groceries.reduce((acc, itemObj) => acc + itemObj.price, 0);
  localStorage.setItem('totalPrice', totalPrice);
  document.getElementById('totalPrice').innerText = `R ${totalPrice}`;
}

// Updates the groceries list with a new item
function updateList(event) {
  event.preventDefault();
  const form = document.getElementById('addItemForm');
  const name = form.name.value.trim();
  const price = parseFloat(form.price.value);
  if (name === '' || isNaN(price)) {
    alert('Please enter a valid item name and price.');
    return;
  }
  const newItem = { name, price };
  groceries.push(newItem);
  saveAndUpdateItems();
}

// Handles the keydown event for updating the price input
function handleKeyDown(event, index) {
  if (event.key === 'Enter') {
    updateItem(index, event.target);
    event.preventDefault();
  }
}

// Attach updateList function to the submit event of addItemForm
document.getElementById('addItemForm').addEventListener('submit', updateList);

// Display items on page load
displayItems();
