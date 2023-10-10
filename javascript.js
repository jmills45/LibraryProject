// Variables 

const myLibrary = [];

// DOM Elements 

const bookTitleInput = document.querySelector("#bookTitle");
const bookAuthorInput = document.querySelector("#bookAuthor");
const bookPagesInput = document.querySelector("#bookPages");
const bookReadInput = document.querySelector("#bookRead");
const bookTableWrapper = document.querySelector(".tableWrapper");
const bookForm = document.querySelector(".bookSubmitForm");
const totalBooks = document.querySelector(".totalBooks");
const booksRead = document.querySelector(".booksRead");
const booksToRead = document.querySelector(".booksToRead");
const totalPages = document.querySelector(".totalPages");

bookForm.addEventListener("submit", addBook);

// Object Constructors 

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Functions 

function createBook() {
    let bookTitle = bookTitleInput.value;
    let bookAuthor = bookAuthorInput.value;
    let bookPages = bookPagesInput.value;
    let bookRead = bookReadInput.value;

    return new Book(bookTitle, bookAuthor, bookPages, bookRead);
}

function addBook(event) {
    // Prevent form submit from refreshing webpage
    event.preventDefault();

    // Create new book and push to array
    let newBook = createBook();
    myLibrary.push(newBook);

    // Refresh Table and Reset Form
    generateTable();
    bookForm.reset();
}

function promptForDeletion(bookRow) {

    // Checks if row is prompted for deletion - toggles confirm box if false
    if (bookRow.dataset.deletePrompt === "false") {
    
        // Hide all table row child elements so confirm for deletion box can be displayed
        bookRow.style.padding = "0";
        for (const child of bookRow.children) {
            child.style.display = "none"
        }
    
        // Show confirm for deletion box
        const confirmDelete = bookRow.querySelector(".confirmBox");
        confirmDelete.style.display = "flex";

        // Mark row for deletion - required for deleteBook function
        bookRow.dataset.deletePrompt = "true";

    } else {

        // Shows all the table row child elements
        bookRow.style.padding = "0.5em";
        for (const child of bookRow.children) {
            child.style.display = "block"
        }
        
        // Hides the confirm deletion box
        const confirmDelete = bookRow.querySelector(".confirmBox");
        confirmDelete.style.display = "none";

        // Remove row for deletion to reset prompt
        bookRow.dataset.deletePrompt = "false";
    }   
}

function deleteBook(bookRow, bookIndex) {

    // Ensure the delete prompt is active before deletion
    if (bookRow.dataset.deletePrompt === "true") {

        // Remove current Book from Array
        myLibrary.splice(bookIndex, 1);

        // Regenerate table after row has been removed
        generateTable();
        
    } else {
        console.log("Error - book delete attempted without prompt")
    }

}

function toggleRead(bookIndex) {

    // Toggle book.read property between Read / Not Read
    if (myLibrary[bookIndex].read === "Read") {
        myLibrary[bookIndex].read = "Not Read";

    } else {
        myLibrary[bookIndex].read = "Read";      
    }

    // Regenerate table after read property has been updated
    generateTable();      
}

function onClick(event) {

    // Lookup which bookrow was clicked
    let bookRow = event.target.closest(".bookRow");

    // Lookup the array index of the target book
    let bookIndex = bookRow.dataset.index;

    // Lookup the data attribute action to perform
    let clickAction = event.target.dataset.action;

    switch(clickAction){
        case "toggleRead":
            toggleRead(bookIndex);
            break;

        case "promptForDeletion":
            promptForDeletion(bookRow);
            break;

        case "confirmDelete":
            deleteBook(bookRow, bookIndex);
            break;

        case "cancelDelete":
            promptForDeletion(bookRow);
            break;
    }
}

function updateStats() {
    totalBooks.innerHTML = myLibrary.length;
    booksRead.innerHTML = myLibrary.reduce((booksRead, currentBook) => booksRead + (currentBook.read === "Read" ? 1 : 0), 0);
    booksToRead.innerHTML = myLibrary.reduce((booksToRead, currentBook) => booksToRead + (currentBook.read === "Not Read" ? 1 : 0), 0);
    totalPages.innerHTML = myLibrary.reduce((totalPages, currentBook) => totalPages + Number(currentBook.pages), 0);
}

function generateTable() {

    // Remove table and recreate with new rows / entries
    while (bookTableWrapper.firstChild) {
        bookTableWrapper.removeChild(bookTableWrapper.firstChild);
    }

    //  Create new Table and Table Body
    const bookTable = document.createElement("table");
    const bookTableBody = document.createElement("tbody");

    // Create new Table Row for each Book Object in MyLibrary Array
    myLibrary.forEach((element, index) => {

        // Create Table Row
        const bookRow = document.createElement("tr");
        bookRow.classList.add("bookRow");
        bookRow.dataset.index = index;
        bookRow.dataset.deletePrompt = "false";
        bookRow.addEventListener("click", onClick);

        // Create table data for each object property
        for (const [key, value] of Object.entries(element)) {

            if (key != "read") {
                const bookCell = document.createElement("td");
                const bookCellText = document.createTextNode(value);

                bookCell.appendChild(bookCellText);
                bookRow.appendChild(bookCell);
            }
        }

        // Add Read Toggle Button
        const toggleCell = document.createElement("td");
        const bookToggleReadButton = document.createElement("button");
        bookToggleReadButton.innerHTML = element.read;
        bookToggleReadButton.dataset.action = "toggleRead";
        bookToggleReadButton.dataset.index = index;
        bookToggleReadButton.classList.add("toggleButton");

        toggleCell.appendChild(bookToggleReadButton);
        bookRow.appendChild(toggleCell);


        // Add delete button to the end of each book row
        const deleteCell = document.createElement("td");
        const bookDeleteButton = document.createElement("button");
        bookDeleteButton.innerHTML = "Delete";
        bookDeleteButton.dataset.action = "promptForDeletion";
        bookDeleteButton.classList.add("deleteButton");

        deleteCell.appendChild(bookDeleteButton);
        bookRow.appendChild(deleteCell);

        // Add delete confirmation dialog box
        const confirmBox = document.createElement("div");
        confirmBox.classList.add("confirmBox");

        const confirmButton = document.createElement("button");
        confirmButton.innerHTML = "Confirm";
        confirmButton.dataset.action = "confirmDelete";

        const cancelButton = document.createElement("button");
        cancelButton.innerHTML = "Cancel";
        cancelButton.dataset.action = "cancelDelete";

        const confirmMessage = document.createElement("p");
        confirmMessage.innerHTML = `Are you sure you want to delete ${element.title}?`;

        confirmBox.appendChild(confirmButton);
        confirmBox.appendChild(cancelButton);
        confirmBox.appendChild(confirmMessage);

        bookRow.appendChild(confirmBox);
       
        // Add newly created row to table
        bookTableBody.appendChild(bookRow);      
        bookTable.appendChild(bookTableBody);
        bookTableWrapper.appendChild(bookTable);

        // Update Stats after table has finished generating
    })
    updateStats();
}