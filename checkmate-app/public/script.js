const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

// --- Data Fetching ---

async function getItems() {
    try {
        const response = await fetch('/items');
        if (!response.ok) throw new Error('Failed to fetch items');
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function addItem(event) {
    event.preventDefault();
    const newItem = itemInput.value.trim();
    if (!newItem) return;

    try {
        const response = await fetch('/add-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: newItem }),
        });
        if (!response.ok) throw new Error('Failed to add item');
        itemInput.value = '';
        getItems(); // Refresh the list
    } catch (error) {
        console.error('Error:', error);
    }
}

// --- Rendering ---

function renderItems(items) {
    itemList.innerHTML = '';
    items.forEach(item => {
        const li = createListItem(item.task);
        itemList.appendChild(li);

        if (item.subTasks && item.subTasks.length > 0) {
            const subList = document.createElement('ul');
            item.subTasks.forEach(subTaskText => {
                const subLi = createListItem(subTaskText);
                subList.appendChild(subLi);
            });
            li.appendChild(subList);
        }
    });
}

function createListItem(text) {
    const li = document.createElement('li');
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    
    const span = document.createElement('span');
    span.textContent = text;
    
    li.appendChild(checkbox);
    li.appendChild(span);
    
    return li;
}

// --- Event Listeners ---

itemForm.addEventListener('submit', addItem);

itemList.addEventListener('click', (event) => {
    if (event.target.classList.contains('checkbox')) {
        event.target.parentElement.classList.toggle('checked');
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', getItems);
