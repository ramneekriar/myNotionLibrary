require('dotenv').config();

const { Client } = require('@notionhq/client');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

const fetch = require("node-fetch");
const url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:';

// ********** FUNCTIONS ********** \\

/**
 * Adds a new page object to the database.
 *
 * @param {string} bookTitle The title of the book.
 * @param {string} author The author of the book.
 * @param {string} status The status of the book from either 'TBR', 'DNF', 'Currently Reading', 'Finished'.
 * @param {array}  genre The genres the book falls under.
 * @param {string} rating The rating of the book from either '⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'.
 * @param {string} format The format of the book from either 'Ebook', 'Audiobook', 'Book'.
 * @return {string} The result of adding the book to the library, either 'success' or 'fail'.
 */
 async function addBook(bookTitle, author, status='TBR') {
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
              type: 'title',
              title: [ {type: 'text', text: {content: bookTitle}} ]
          },
          Author: {
              select: { name : author }
            },
          Status: {
              select: { name : status }
          },
        },
      });
      return 'success';
    } catch (error) {
      return 'fail';
    }
  }

/**
 * Retrieves pageId of specified book.
 *
 * @param {string} bookTitle The title of the book.
 * @return {string} page The page containing the book specifed.
 */
 async function getBook(bookTitle) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: 'Name',
            title: {equals: bookTitle}
        }
      });
      const page = response['results'][0];
      return page;
    } catch (error) {
      return 'fail';
    }
  }

/**
 * Retrieves the number of books given a status.
 *
 * @param {string} status The status property.
 * @return {string} numBooks The number of books with the given status.
 */
 async function getBookNumbyStatus(status) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Status',
                select: {equals: status}
            }
          });
          const numBooks = response['results'].length;
          return numBooks;
    } catch (error) {
        return 'fail';
    }
  }

  /**
 * Retrieves the author of given book.
 *
 * @param {string} bookTitle The title of the book.
 * @return {string} bookAuthor The author of the book.
 */
  async function getBookAuthor(bookTitle) {
    try {
        const page = await getBook(bookTitle)
        const authorPropertyId = page.properties["Author"].id;
        const response = await notion.pages.properties.retrieve({
            page_id: page.id,
            property_id: authorPropertyId
        });
        const bookAuthor = response.select.name;
        return bookAuthor;
    } catch (error) {
        return 'fail';
    }
  }
  
  /**
 * Retrieves the current status of the book given its title.
 *
 * @param {string} bookTitle The title of the book.
 * @return {string} currentStatus The current status of the book.
 */
  async function getBookStatus(bookTitle) {
    try {
        const page = await getBook(bookTitle);
        const statusPropertyId = page.properties["Status"].id;
        const response = await notion.pages.properties.retrieve({
            page_id: page.id,
            property_id: statusPropertyId
          });
          const currentStatus = response.select.name;
          return currentStatus;
    } catch (error) {
        return 'fail'
    }
  }

    /**
 * Retrieves the genre of a given book.
 *
 * @param {string} bookTitle The title of the book.
 * @return {string} genreString The genre of the book as a string.
 */
     async function getBookGenre(bookTitle) {
        try {
            const page = await getBook(bookTitle);
            const genrePropertyId = page.properties["Genre"].id;
            const response = await notion.pages.properties.retrieve({
                page_id: page.id,
                property_id: genrePropertyId
            });
            const bookGenre = response.multi_select
            var genreString = ''
            bookGenre.forEach(item => {
              genreString += item['name'] + ', '
            });
            return genreString;
        } catch (error) {
            return 'fail';
        }
      }

  /**
 * Updates the status of the book. If status is 'Finished', will update the number of pages read by calling Google Books Api.
 *
 * @param {string} bookTitle The title of the book.
 * @param {string} status The status the book will be updated to.
 * @return {string} The result of updating the status of the book, either 'success' or 'fail'.
 */
  async function updateStatus(bookTitle, status) {
    try {
        const bookAuthor = await getBookAuthor(bookTitle);
        const page = await getBook(bookTitle);
        var numPages = 0;
        
        if (status === 'finished'){
            const formattedTitle = (bookTitle.split(' ')).join('+').toLowerCase();
            
            const bookUrl = url+formattedTitle+'+inauthor:'+bookAuthor.split(' ')[1].toLowerCase();
            numPages = await fetch(bookUrl).then(res =>res.json())
            .then(({ items: [ { volumeInfo : { pageCount} } ] }) => {
              return pageCount;
            });
        }

        const response = await notion.pages.update({
            page_id: page.id,
            properties: {
                Status: {
                    select: { name: status }
                },
                Pages: {
                    number: numPages
                }
            }
        });
        return 'success';
    } catch (error) {
        return 'fail';
    }
  }

  /**
 * Updates the rating of the book.
 *
 * @param {string} bookTitle The title of the book.
 * @param {string} rating The rating the book will be updated to.
 * @return {string} The result of updating the rating of the book, either 'success' or 'fail'.
 */
   async function updateRating(bookTitle, rating) {
    var emoji = '';
    if ( rating === '1 star' ) {
        emoji += '⭐';
    } else if ( rating === '2 star' ) {
        emoji += '⭐⭐';
    } else if ( rating === '3 star' ) {
        emoji += '⭐⭐⭐';
    } else if ( rating === '4 star' ) {
        emoji += '⭐⭐⭐⭐';
    } else {
        emoji += '⭐⭐⭐⭐⭐';
    }
    try {
        const page = await getBook(bookTitle);
        const response = await notion.pages.update({
            page_id: page.id,
            properties: {
                Rating: {
                    select: { name: emoji }
                },
            }
          });
          return 'success';
    } catch (error) {
        return 'fail';
    }
  }

/**
 * Updates the format of the book.
 *
 * @param {string} bookTitle The title of the book.
 * @param {string} format The format the book will be updated to.
 * @return {string} The result of updating the format of the book, either 'success' or 'fail'.
 */
  async function updateFormat(bookTitle, format) {
    try {
        const page = await getBook(bookTitle);
        const response = await notion.pages.update({
            page_id: page.id,
            properties: {
                Format: {
                    select: { name: format }
                }
            }
        });
        return 'success';
    } catch (error) {
        return 'fail';
    }
  }

  module.exports = {
    getBookNumbyStatus,
    addBook,
    getBookAuthor,
    getBookStatus,
    getBookGenre,
    updateStatus,
    updateRating,
    updateFormat
  }