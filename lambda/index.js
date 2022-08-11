const Alexa = require('ask-sdk-core');
const Notion = require('./functions');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Opening your notion library. How can I help you?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AddBookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddBookIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookAuthor = handlerInput.requestEnvelope.request.intent.slots.BOOK_AUTHOR.value;
        var bookStatus = handlerInput.requestEnvelope.request.intent.slots.BOOK_STATUS.value;

        var functionResult = '';
        if (bookStatus === ''){
            functionResult = await Notion.addBook(bookName, bookAuthor);
        }
        else{
            functionResult = await Notion.addBook(bookName, bookAuthor, bookStatus);
        }
        
        var speakOutput = '';
        if (functionResult === 'success'){
            speakOutput = bookName + ' written by ' + bookAuthor + ' was successfully added to your library.';
        }
        else{
            speakOutput = 'Sorry, there was a problem in adding the book to your library. Please try again later.';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const GetBookByNumStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBookByNumStatusIntent';
    },
    async handle(handlerInput) {
        
        var bookStatus = handlerInput.requestEnvelope.request.intent.slots.BOOK_STATUS.value;
        console.log(bookStatus);
        var numBooks = await Notion.getBookNumbyStatus(bookStatus);
        
        var speakOutput = '';
        if (numBooks === 'fail'){
            speakOutput = 'Sorry, there was a problem in retrieving the number of books by status. Please try again later.';
        }
        else{
            speakOutput = 'There are ' + numBooks + ' books with the status ' + bookStatus + ' .';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const GetBookStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBookStatusIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookStatus = await Notion.getBookStatus(bookName);
        
        var speakOutput = '';
        if (bookStatus === 'fail'){
            speakOutput = 'Sorry, there was a problem in retrieving the status of ' + bookName + '. Please try again later.';
        }
        else{
            speakOutput = 'The book ' + bookName + ' has a status of ' + bookStatus + ' .';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const GetBookAuthorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBookAuthorIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookAuthor = await Notion.getBookAuthor(bookName);
        
        var speakOutput = '';
        if (bookAuthor === 'fail'){
            speakOutput = 'Sorry, there was a problem in retrieving the author of ' + bookName + '. Please try again later.';
        }
        else{
            speakOutput = 'The author of ' + bookName + ' is ' + bookAuthor + ' .';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const GetBookGenreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBookGenreIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookGenre = await Notion.getBookGenre(bookName);
        
        var speakOutput = '';
        if (bookGenre === 'fail'){
            speakOutput = 'Sorry, there was a problem in retrieving the genre of ' + bookName + '. Please try again later.';
        }
        else{
            speakOutput = 'The genre of ' + bookName + ' is ' + bookGenre + ' .';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const UpdateFormatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UpdateFormatIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookFormat = handlerInput.requestEnvelope.request.intent.slots.BOOK_FORMAT.value;
        var functionResult = await Notion.updateFormat(bookName, bookFormat);
        
        var speakOutput = '';
        if (functionResult === 'success'){
            speakOutput = 'The format of ' + bookName + ' has been successfully updated to ' + bookFormat + ' .';
        }
        else{
            speakOutput = 'Sorry, there was a problem in updating the format of the book. Please try again later.';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const UpdateRatingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UpdateRatingIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookRating = handlerInput.requestEnvelope.request.intent.slots.BOOK_RATING.value;
        var functionResult = await Notion.updateRating(bookName, bookRating);
        
        var speakOutput = '';
        if (functionResult === 'success'){
            speakOutput = bookName + ' has successfully been updated to ' + bookRating + 's.';
        }
        else{
            speakOutput = 'Sorry, there was a problem in updating the rating for the book. Please try again later.';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const UpdateStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UpdateStatusIntent';
    },
    async handle(handlerInput) {
        
        var bookName = handlerInput.requestEnvelope.request.intent.slots.BOOK_NAME.value;
        var bookStatus = handlerInput.requestEnvelope.request.intent.slots.BOOK_STATUS.value;
        var functionResult = await Notion.updateStatus(bookName, bookStatus);
        
        var speakOutput = '';
        if (functionResult === 'success') {
            speakOutput = 'The status of ' + bookName + ' has been successfully updated to ' + bookStatus + ' .';
        }
        else {
            speakOutput = 'Sorry, there was a problem in updating the status of the book. Please try again later.';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You are in your notion library! You can ask me to retrieve or update properties like status, rating, format, and genre.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye! Come visit your library soon.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse(); 
    }
};

/**
 * Generic error handling to capture any syntax or routing errors.
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AddBookIntentHandler,
        GetBookByNumStatusIntentHandler,
        GetBookStatusIntentHandler,
        GetBookAuthorIntentHandler,
        GetBookGenreIntentHandler,
        UpdateFormatIntentHandler,
        UpdateRatingIntentHandler,
        UpdateStatusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('alexa/my-notion-library/v1.0')
    .lambda();