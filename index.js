// giphy API info
const apiKey = 'yvWD34WnumE99i4tpeVDm0671Ui8wH2s'
const searchTerm = 'celebrate'

// messages to feedback to user 
const messages = {
    noText: "Please type a chore...", 
    noChores: "No chores to clear...",
    choreDuplication: "Chore already included...",
    allDone: "All chores cleared!"
    }

const choreInputEl = document.querySelector(".chore-input")
const addBtn = document.querySelector(".add-btn")
const clearBtn = document.querySelector(".clear-btn")
const choresListEl = document.querySelector(".chores-list")
const choresList = localStorage


// adds new chore to the array
function addChoreToArray(newChore) {
    if (Object.values(choresList).length === 0) {
        choresListValues = []
    } 

    if (!Object.values(choresList).includes(newChore)) {
        choresList.setItem(setIndex(), newChore)
        setValuesArray()
        populateChoresListEl()
    } else {
        createMessageEl(messages.choreDuplication)
        clearChoreInput()
    }
}

function setIndex() {
    let index = 1
    if (Object.keys(choresList).length > 0) {
        const lastIndex = Object.keys(choresList).sort(function(a, b) { return a - b })[Object.keys(choresList).length - 1]
        index = Number(lastIndex) + 1
    }
    console.log(index)
    return index
}

function setValuesArray() {
    choresListValues = []
    if (Object.keys(choresList).length > 0) {
        const keysArray = Object.keys(choresList) ////////
        for (let i = 0; i < keysArray.length; i++) {
        const choreValue = choresList.getItem(keysArray[i])
        choresListValues.push(choreValue)
        }
    }
}

// iterates over the array to populate the list - including the new chore
function populateChoresListEl() {
    if (Object.values(choresList)) {
        clearChoresListEl() 
        let arr = Object.keys(choresList).sort(function(a, b) { return a - b })
        arr.forEach ( function(index) {
            const nextChore = createChoreEl(choresList[index])
            choresListEl.insertBefore(nextChore, choresListEl.firstChild)
        })
    }
    setEventListeners()
}

// creates and returns the div el for the new chore
function createChoreEl(chore) {
    const div = document.createElement("div")
    div.innerHTML = `
                        <button class="chore-btn" id="${chore}">${chore}</button>
                    `
    clearChoreInput()
    return div
}

// Removes entry of clicked chore from localstorage object and repopulates list.
function deleteChore(ID) {
    const choreElToDelete = document.getElementById(`${ID}`)
    const choreToDelete = choreElToDelete.textContent
    const keyToDelete = Object.keys(choresList).find(key => choresList[key] === choreToDelete)
    choresList.removeItem(keyToDelete)
    populateChoresListEl()
    playGif(choreElToDelete)
}

// creates message for reader depending on the issue.
function createMessageEl(message) {
    toggleButtons()
    const div = document.createElement("div")
    div.innerHTML = `
                        <p class="clear-message">${message}</p>
                    `
    choresListEl.insertBefore(div, choresListEl.firstChild)
    setTimeout(() => clearMessage(), 1500)
}


// creation and deletion of celebratory gifs
function createGifEl(gif) {
    const div = document.createElement("div")
    div.innerHTML = `
                        <img src="${gif}">
                    `
    choresListEl.insertBefore(div, choresListEl.firstChild)
    toggleButtons()
    setTimeout(() => deleteGif(), 3000)
}

function deleteGif() {
    choresListEl.removeChild(choresListEl.firstElementChild)
    toggleButtons()
}

// fetches random gif url to send create a gif from.
// TODO: More efficient fetch so that not receiving so much data
function playGif(choreEl) {
    fetch(`https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const allGifs = data.data
        const randomGifData = allGifs[allGifs.length * Math.random() | 0]
        const randomGifURL = randomGifData.images.original.webp
        createGifEl(randomGifURL)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// toggles butons off whilst waiting for messages to timeout so no unwanted behaviour occurs.
function toggleButtons() {
    const buttons = document.querySelectorAll("button")
    buttons.forEach( function(button) {
        if (button.disabled) {
            button.disabled = false 
        } else {
            button.disabled = true
        }
    })
}

function clearChoreInput() {
    choreInputEl.value = ""
}

function clearChoresListEl() {
    choresListEl.textContent = ""
}

function clearChoresList() {
    localStorage.clear()
}

function clearMessage() {
    choresListEl.firstChild.textContent = ""
    toggleButtons()
}

// adds event listeners to each of the chores so that they can be deleted
function setEventListeners() {
    const choreEls = document.querySelectorAll('.chore-btn')
    const chorePressed = event => { 
        deleteChore(event.target.id)
        }
    
    for (let chore of choreEls) {
    chore.addEventListener("click", chorePressed)
    }
}

addBtn.addEventListener("click", function() {
    const choreText = choreInputEl.value
    if (choreText) {
        addChoreToArray(choreText)
    } else {
        createMessageEl(messages.noText)
    }
})

clearBtn.addEventListener("click", function() {
    if (Object.keys(choresList) < 1) {
        createMessageEl(messages.noChores)
    } else {
        clearChoresListEl()
        createMessageEl(messages.allDone)
        clearChoresList()
    }
})

populateChoresListEl()