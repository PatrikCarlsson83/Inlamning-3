//Helper functions
//Count Todos and change footer menu gui
function itemCount() {
    let itemCounter = 0;

    todos.forEach(e => {
        let id = e.firstElementChild;
        let items = document.querySelector('.item-count');

        if (!id.checked) {
            itemCounter++;
        }

        if (itemCounter === 1) {
            items.innerText = itemCounter + ' item left';
        } else {
            items.innerText = itemCounter + ' items left';
        }
    });

    if (itemCounter === 0 && todos.length > 0)
        toggleImg.style.opacity = '60%';
    else {
        toggleImg.style.opacity = '10%';
    }
    // Hide clear button
    if (itemCounter !== todos.length) {
        clearCompleted.style.visibility = 'visible';
    } else {
        clearCompleted.style.visibility = 'hidden';
    }
}

//Hide or show Todos
function todosChecked(bool) {
    let active = todos.filter(a => a.firstElementChild.checked === bool);

    todos.forEach(e => {
        e.style.display = "inline-block";
    });

    active.forEach(e => {
        e.style.display = "none";
    });
}

function removeBorder(a, b) {
    a.classList.remove('link-border');
    b.classList.remove('link-border');
}




function updateFilters() {
    if (allButton)
        allBtn.click();
    if (activeButton)
        activeBtn.click();
    if (completedButton)
        completedBtn.click();
}

function changeItemListGUI(text, bool) {
    idCounter++;
    const listItem = listItemTemplate.content.firstElementChild.cloneNode(true);
    const checkBox = listItem.querySelector('.checkbox');
    const deleteBtn = listItem.querySelector('button');
    const item = listItem.querySelector('.item');

    listItem.querySelector('input').id = idCounter;
    const label = listItem.querySelector('label');
    label.setAttribute('for', idCounter);
    item.innerText = text;

    checkBox.checked = bool;

    todos.push(listItem);

    list.append(listItem);

    //When item is added show statusbar
    todoStatus.style.display = "grid";
    textInput.value = '';
    allBtn.classList.add('link-border');
    main.setAttribute('class', 'shadow-boxes');

    itemCount();
    updateFilters();

    // Adds new todos
    label.addEventListener("dblclick", e => {
        e.preventDefault();
        const text = document.createElement("input");
        text.type = "text";
        text.setAttribute("class", "edit-item");
        label.style.display = "none";
        checkBox.style.display = "none";
        deleteBtn.style.display = "none";
        text.value = item.innerText;
        listItem.append(text);

        text.focus();

        // Edit Todos
        function checkCheckbox() {
            if (text.value !== '') {
                item.innerText = text.value;
                text.remove();
            } else {
                text.remove();
            }
        
            label.style.display = "inline-block";
            deleteBtn.style.display = "inline-block";
            checkBox.style.display = "inline-block";
        }

        //add/edit textbox on blur "unfocus"
        text.addEventListener("blur", e => {
            checkCheckbox();
        });

        //Add edited todo
        text.addEventListener("keyup", ({
            key
        }) => {
            e.preventDefault();

            if (key === "Enter") {
                checkCheckbox();
            }
        });
    });

    //Delete Todos from GUI and list
    deleteBtn.onclick = (e => {
        let index = todos.indexOf(listItem);
        todos.splice(index, 1);
        listItem.remove();
        itemCount();

        if (todos.length === 0) {
            todoStatus.style.display = "none";
            main.removeAttribute('class', 'shadow-boxes');
        }
    });
}

//Creating variables to manipulate the DOM
const form = document.querySelector('form');
const list = document.getElementById('todo-list');
const listItemTemplate = document.getElementById('list-item');
const textInput = document.getElementById('text-input');
const toggleBtn = document.querySelector('#toggle-btn');
const main = document.querySelector('main');
const todoStatus = document.querySelector('.todo-status');
const toggleImg = document.querySelector('#toggle-img');
const clearCompleted = document.querySelector('.clear-completed');
const allBtn = document.querySelector('#all-btn');
const activeBtn = document.querySelector('#active-btn');
const completedBtn = document.querySelector('#completed-btn');

//Creating variables to keep track of which "button" is clicked in the 'filters-menue'
let allButton = true;
let activeButton = false;
let completedButton = false;

let todos = [];
let storage = [];
//Counter for adding ID's to the new templates so the css rules for checkbox will work.
let idCounter = 0;

//Event listeners
window.addEventListener('load', e => {
    let data = localStorage.getItem("items");
    let storage2 = JSON.parse(data);

    storage2.forEach(e => {
        changeItemListGUI(e.text, e.checkbox);
    });
});

window.onbeforeunload = function () {
    todos.forEach(e => {
        let item = {
            checkbox: e.children[0].checked,
            text: e.children[1].innerText
        };
        storage.push(item);
    });

    localStorage.setItem("items", JSON.stringify(storage));
};

form.onsubmit = (e => {
    e.preventDefault();
    if (textInput.value) {
        changeItemListGUI(textInput.value, false);
    }
});

// Check or uncheck Todos
toggleBtn.addEventListener('click', e => {
    e.preventDefault();

    let length = todos.length;
    let checked = 0;
    todos.forEach(e => {
        if (e.firstElementChild.checked)
            checked++;
    });

    if (checked == length) {
        todos.forEach(e => {
            e.firstElementChild.checked = false;
            toggleImg.style.opacity = '10%';
        });
    } else {
        todos.forEach(e => {
            e.firstElementChild.checked = true;
            toggleImg.style.opacity = '60%';
        });
    }

    updateFilters();
    itemCount();
});

//Update Todo-counter and change GUI in the bottom menu
list.addEventListener('click', e => {
    updateFilters();
    itemCount();
});

clearCompleted.addEventListener('click', e => {
    let removeList = [];
    todos.forEach(e => {
        let item = e.firstElementChild;

        if (item.checked) {
            let index = todos.indexOf(item.parentElement);
            removeList.push(index);
        }
    });

    //Loop backwards so we dont ruin the order when we remove items
    for (let i = removeList.length - 1; i >= 0; i--) {
        let item = todos[removeList[i]];
        todos.splice(removeList[i], 1);
        item.remove();
    }

    //Remove statusbar when there is no items in the list
    if (todos.length === 0) {
        todoStatus.style.display = "none";
        main.removeAttribute('class', 'shadow-boxes');
    }
    itemCount();
});

allBtn.onclick = (e => {
    e.preventDefault();
    allButton = true;
    activeButton = false;
    completedButton = false;

    window.location.hash = 'All';

    allBtn.classList.add('link-border');
    removeBorder(activeBtn, completedBtn);

    todos.forEach(e => {
        e.style.display = 'inline-block';
    });
});

activeBtn.onclick = (e => {
    e.preventDefault();
    allButton = false;
    activeButton = true;
    completedButton = false;

    window.location.hash = 'Active';

    activeBtn.classList.add('link-border');
    removeBorder(allBtn, completedBtn);
    todosChecked(true);

    itemCount();
});

completedBtn.onclick = (e => {
    e.preventDefault();
    allButton = false;
    activeButton = false;
    completedButton = true;

    window.location.hash = 'Completed';

    completedBtn.classList.add('link-border');
    removeBorder(activeBtn, allBtn);
    todosChecked(false);
});

window.addEventListener('hashchange', e => {
    let check = window.location.hash;

    if (check === '#All') {
        allBtn.click();
    }
    if (check === '#Active') {
        activeBtn.click();
    }
    if (check === '#Completed') {
        completedBtn.click();
    }
});