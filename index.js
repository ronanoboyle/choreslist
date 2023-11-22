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
    
// local storage constant
const LOCAL_STORAGE_KEY = 'localUserChores'

const choreInputEl = document.querySelector(".chore-input")
const addBtnEl = document.querySelector(".add-btn")
const clearBtnEl = document.querySelector(".clear-btn")
const choresListEl = document.querySelector(".chores-list")

// populates list on each refresh if any items are in local storage
populateChoresListEl()

addBtnEl.addEventListener("click", function() {
    const localUserChores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
    const choreText = choreInputEl.value
    if (localUserChores.includes(choreText)) {
            createMessageEl(messages.choreDuplication)
            choreInputEl.value = ""
    } else {
        if (choreText) {
            addChoreToArray(choreText)
        } else {
            createMessageEl(messages.noText)
        }
    }
})

clearBtnEl.addEventListener("click", function() {
    if (!localStorage.localUserChores) {
        createMessageEl(messages.noChores)
    } else {
        choresListEl.textContent = ""
        createMessageEl(messages.allDone)
        localStorage.clear()
    }
})

// either creates (if none) or gets items from local storage to populate list
function populateChoresListEl() {
    if (!localStorage.localUserChores) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]))
    } else {
        let localUserChores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        choresListEl.textContent = ""
        localUserChores.forEach( function(chore) {
            const nextChore = createChoreEl(chore)
            choresListEl.insertBefore(nextChore, choresListEl.firstChild)
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUserChores))
    }
    setEventListeners()
}

// adds new chore to local storage by setting array with existing items
function addChoreToArray(newChore) {
    let localUserChores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (localUserChores) {
            localUserChores.push(newChore)
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUserChores))
        }
    else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newChore]))
    }
    populateChoresListEl()
}

// creates message for reader depending on the issue.
function createMessageEl(message) {
    toggleButtons()
    const div = document.createElement("div")
    div.innerHTML = `
                        <p class="clear-message">${message}</p>
                    `
    choresListEl.insertBefore(div, choresListEl.firstChild)
    setTimeout(function() {
        choresListEl.firstChild.textContent = ""
        toggleButtons()
    }, 1500)
}

// creates and returns the div el for the new chore
function createChoreEl(chore) {
    const div = document.createElement("div")
    div.innerHTML = `
                        <button class="chore-btn" id="${chore}">${chore}</button>
                    `
    choreInputEl.value = "";
    return div
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

// Removes entry of clicked chore from localstorage object and repopulates list.
function deleteChore(ID) {
    let localUserChores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    const choreElToDelete = document.getElementById(`${ID}`)
    const choreToDelete = choreElToDelete.textContent
    const indexToDelete = localUserChores.indexOf(choreToDelete)
    localUserChores.splice(indexToDelete, 1)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUserChores))
    populateChoresListEl()
    playGif(choreElToDelete)
}

// creation and deletion of celebratory gifs
function createGifEl(gif) {
    const div = document.createElement("div")
    div.innerHTML = `
                        <img src="${gif}">
                    `
    choresListEl.insertBefore(div, choresListEl.firstChild)
    toggleButtons()
    setTimeout(function() {
        choresListEl.removeChild(choresListEl.firstElementChild)
        toggleButtons()
    }, 3000)
}

// fetches random gif url to send create a gif from.
// TODO: More efficient fetch so that not receiving so much data
function playGif() {
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
