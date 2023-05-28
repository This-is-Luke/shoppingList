const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
let totalPrice = 0;

function deleteItem(index) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return;
  }
  groceries.splice(index, 1);
  localStorage.setItem('groceries', JSON.stringify(groceries));
  displayItems();
}


function displayItems() {
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  groceries.forEach((itemObj, index) => {
    const listItem = document.createElement('tr');
    listItem.innerHTML = `
      <td class="item-name">${itemObj.name}</td>
      <td class="price-cell">R${itemObj.price}</td>
      <td>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
      <td class="checkbox-cell">
        <input type="checkbox" class="purchased" id="purchased-${index}" ${itemObj.purchased ? 'checked' : ''} onclick="togglePurchased(${index})">
      </td>
    `;
    list.appendChild(listItem);
  });
  calculateTotal();
}

function togglePurchased(index) {
  groceries[index].purchased = !groceries[index].purchased;
  localStorage.setItem('groceries', JSON.stringify(groceries));
  displayItems();
}


function editItem(index) {
  const row = document.getElementById(`itemList`).rows[index];
  const priceCell = row.querySelector('.price-cell');
  const input = document.createElement('input');
  input.type = 'number';
  input.value = groceries[index].price;
  input.min = 0;
  input.step = 0.01;
  priceCell.innerHTML = '';
  priceCell.appendChild(input);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update';
  updateButton.onclick = () => updateItem(index, input);
  row.cells[2].appendChild(updateButton);

  input.focus();
  input.select();
  input.addEventListener('keydown', (event) => handleKeyDown(event, index));
}

function updateItem(index, input) {
	groceries[index].price = parseFloat(input.value);
	localStorage.setItem('groceries', JSON.stringify(groceries));
	displayItems();
}

function calculateTotal() {
	totalPrice = groceries.reduce((acc, itemObj) => acc + itemObj.price, 0);
	localStorage.setItem('totalPrice', totalPrice);
	document.getElementById('totalPrice').innerText =  `R ${totalPrice}`;
}

function updateList(event) {
	event.preventDefault();
	const form = document.getElementById('addItemForm');
	const name = form.name.value.trim();
	const price = parseFloat(form.price.value);
	if (name === '' || isNaN(price)) {
		alert('Please enter a valid item name and price.');
		return;
	}

	const newItem = {
		name: name,
		price: price,
	};

	groceries.push(newItem);
	localStorage.setItem('groceries', JSON.stringify(groceries));
	calculateTotal();
	displayItems();
}

function handleKeyDown(event, index) {
  if (event.key === 'Enter') {
    updateItem(index, event.target);
    event.preventDefault();
  }
}



document.getElementById('addItemForm').addEventListener('submit', updateList);
displayItems();
