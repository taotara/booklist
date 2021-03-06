class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book) {
        const list = document.getElementById('book-list');

        //Create tr element
        const row = document.createElement('tr');

        //Insert col
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href= "#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(message, className) {
        //Create div
        const div = document.createElement('div');

        //Add clases
        div.className = `alert ${className}`;
        //Add text
        div.appendChild(document.createTextNode(message));
        //Get parent
        const container = document.querySelector('.container');
        //Get form
        const form = document.querySelector('#book-form');
        //Insert alert
        container.insertBefore(div, form);

        //Timeout after 3 sec
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000)
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

//Local Storage Class
class store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(book) {
        const books = store.getBooks();
        books.forEach(function(book) {
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = store.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }
}

// DOM load event
document.addEventListener('DOMContentLoaded', store.displayBooks);

//Event Listiner for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
    //Get form values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

//Instaltial book
    const book = new Book(title, author, isbn);


//Instantiate UI
    const ui = new UI();

//Validate
if(title === '' || author === '' || isbn === '') {
    //Error Alert
     ui.showAlert('Please fill in all fields', 'error');
} else {
//Add book to list
    ui.addBookToList(book);

    // Add to LS
    store.addBook(book);

    //Add success
    ui.showAlert('Book Added!', 'success');

//Clear fields
    ui.clearFields();
}



    e.preventDefault();
});

//Event Listiner for Delete
document.getElementById('book-list').addEventListener('click', function(e) {

    //Instantiate UI
    const ui = new UI();

    //Delete book
    ui.deleteBook(e.target);

    // Remove LS
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show Message
    ui.showAlert('Book Removed', 'success');

    e.preventDefault();
});