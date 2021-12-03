import { helpers } from "./helpers";

//check if parsing was successfull
function parsingSuccessfull(parsingResult) {
    return parsingResult.errors.length == 0 &&
        parsingResult.hasOwnProperty("data") &&
        parsingResult.data.length > 0 &&
        parsingResult.hasOwnProperty("meta") &&
        parsingResult.meta.hasOwnProperty("fields");
}

//Check for timestamps information
function fieldContainsTimestamp(field) {
    let sani = helpers.sanitizeString(field);
    return sani.includes("date") ||
        sani.includes("time") ||
        sani.includes("datum") ||
        sani.includes("zeit");
}

//On success...
function onSuccess(parsingResult) {
    //define output
    let output = {
        errors: null,
        parsedData: parsingResult.data,
        columns: {}
    };

    //Iterate all fields found by parser and create columns
    parsingResult.meta.fields.forEach((field, index) => {
        //Create column
        output.columns[index] = {
            fields: [field], //used to map with parsed data keys
            name: field, //can be changed
            id: index,
            order: index,
            rule: null,
            tags: fieldContainsTimestamp(field) ? ["timestamp"] : ["value"],
            origin: "import",
        };
    });

    //Add hardcoded additional columns
    output.columns['timestamp'] = {
        fields: [], //filled ´by TimestampSettings.vue
        name: "timestamp",
        id: "timestamp",
        rule: null,
        tags: [],
        origin: "app",
        params: {
            parsingMode: { id: "auto", label: "auto" },
            parsingString: "DD.MM.YYYY HH:mm:ss.SSS",
            outputMode: { id: "auto", label: "auto" },
            outputString: "DD.MM.YYYY HH:mm:ss.SSS",
        }
    }

    return output;
}

function onError(parsingResult) {
    //define output
    let output = {
        errors: [],
        parsedData: null,
        columns: null
    };

    //Define max error messages
    let maxErrors = 5;

    //Get errors length
    let errorsLength = parsingResult.errors.length;

    //limit to 5 error entries
    if (errorsLength > maxErrors) {
        output.errors = parsingResult.errors.slice(0, maxErrors - 1);
        output.errors.push({
            type: "Further errors removed...",
            message: "There are " + (errorsLength - maxErrors + 1) + " more errors.",
        });
    }

    //Fallback
    if (errorsLength == 0) {
        output.errors.push(
            {
                type: "Data could not be parsed",
                message:
                    "The received data could not be parsed as CSV by papaparse (https://www.papaparse.com/docs).",
            }
        );
    }

    return output;
}

function prepare(parsingResult) {
    //Success
    if (parsingSuccessfull(parsingResult)) return onSuccess(parsingResult);

    //Error
    return onError(parsingResult);
}

export const dataPreparator = {
    prepare: prepare
}