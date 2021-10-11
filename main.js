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
let allButton = true;
let activeButton = false;
let completedButton = false;

let todos = [];
//Counter for adding ID's to the new templates so the css rule will work on checkbox???? ändra???
let idCounter = 0;

form.onsubmit = (e => {
    e.preventDefault();
    if (textInput.value) {
        idCounter++;
        const listItem = listItemTemplate.content.firstElementChild.cloneNode(true);
        const deleteBtn = listItem.querySelector('button');

        listItem.querySelector('input').id = idCounter;
        const label = listItem.querySelector('label');
        label.setAttribute('for', idCounter);
        label.innerText = textInput.value;

        todos.push(listItem);

        list.append(listItem);
        todoStatus.style.display = "grid";
        textInput.value = '';
        allBtn.setAttribute('class', 'link-border');
        main.setAttribute('class', 'shadow-boxes');

        itemCount();

        deleteBtn.onclick = (e => {
            let index = todos.indexOf(listItem);
            console.log(index);
            todos.splice(index, 1);
            listItem.remove();
            itemCount();
            if (todos.length === 0) {
                todoStatus.style.display = "none";
                main.removeAttribute('class', 'shadow-boxes');
            }
        })
    }
})

toggleBtn.addEventListener('click', e => {

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
        })
    } else {
        todos.forEach(e => {
            e.firstElementChild.checked = true;
            toggleImg.style.opacity = '60%';
        })
    };

    itemCount();

})

list.addEventListener('click', e => {

    if (allButton)
        allBtn.click();
    if (activeButton)
        activeBtn.click();
    if (completedButton)
        completedBtn.click();

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
    })
    //Loop backwards so we dont ruin the order when we remove items
    for (let i = removeList.length - 1; i >= 0; i--) {
        let item = todos[removeList[i]];
        todos.splice(removeList[i], 1);
        item.remove();
    }

    if (todos.length === 0) {
        todoStatus.style.display = "none";
        main.removeAttribute('class', 'shadow-boxes');
    }
    itemCount();
})

allBtn.onclick = (e => {
    e.preventDefault();
    allButton = true;
    activeButton = false;
    completedButton = false;

    allBtn.setAttribute('class', 'link-border');
    removeBorder(activeBtn, completedBtn);

    todos.forEach(e => {
        e.style.display = 'inline-block';
    })
})



activeBtn.onclick = (e => {
    e.preventDefault();
    allButton = false;
    activeButton = true;
    completedButton = false;

    activeBtn.setAttribute('class', 'link-border');
    removeBorder(allBtn, completedBtn);
    todosChecked(true);

    itemCount();

})

completedBtn.onclick = (e => {
    e.preventDefault();
    allButton = false;
    activeButton = false;
    completedButton = true;

    completedBtn.setAttribute('class', 'link-border');
    removeBorder(activeBtn, allBtn);
    todosChecked(false);

})

function itemCount() {

    let itemCounter = 0;

    todos.forEach(e => {
        let id = e.firstElementChild;
        if (!id.checked) {
            itemCounter++;
        }
        let items = document.querySelector('.item-count');

        if (itemCounter === 1) {
            items.innerText = itemCounter + ' item left';
        } else {
            items.innerText = itemCounter + ' items left';
        }
    })

    
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

function todosChecked(bool) {
    let active = todos.filter(a => a.firstElementChild.checked === bool);

    todos.forEach(e => {
        e.style.display = "inline-block";
    })

    active.forEach(e => {
        e.style.display = "none";
    })
}

function removeBorder(a, b) {
    a.removeAttribute('class', 'link-border');
    b.removeAttribute('class', 'link-border');
}