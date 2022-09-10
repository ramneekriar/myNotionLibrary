# 📚 Notion Library Alexa Skill

## Description
Designed and implemented an Amazon Alexa skill that leverages Notion API and Google Books API to update my personal Notion library database in real time. Used Alexa Developer Console to program intent handlers and created custom slot types for sample utterances to train and test the model. Intent handler functions parse the slot values and generate async requests to either add, retrieve, or update properties such as:

* author
* status (tbr, dnf, currently reading, finished)
* genre
* rating (⭐️, ⭐️⭐️, ⭐️⭐️⭐️, ⭐️⭐️⭐️⭐️, ⭐️⭐️⭐️⭐️⭐️)
* format (book, ebook, audiobook)
* number of pages
