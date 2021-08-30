import moment from 'moment';

function parseDateString(string, settings) { //parseFormat = null, returnFormat = null
    let date = null;
    if (settings.parsingMode === 'auto') {
        //try default
        date = moment(string, true);

        //convert to number and try again
        if (!date.isValid()) {
            let number = parseFloat(string);
            if (!isNaN(number)) date = moment(number, true);
        }
    }

    //Given format
    else {
        date = moment(string, settings.parsingString);
    }

    //Error
    if (!date.isValid()) return null;

    //Successfully parsed
    return settings.outputMode === 'auto' ? date.valueOf() : date.format(settings.outputString);
}

function format(value, options = {
    isTimestamp: false,
    timestampSettings: 'X'
}) {

    //Create response object
    let response = {
        value: null,
        error: false,
    };

    //Timestamp formatting
    if (options.isTimestamp) {
        let date = parseDateString(value, options.timestampSettings);

        //Successfully parsed
        if (date !== null)
            response.value = date;

        //Parsing error
        else
            response.error = true;
    }

    //Default value formatting
    else {
        //replace all decimal commas by points
        response.value = typeof value === 'string' ? value.replace(",", ".") : value;
    }

    return response;
}

export const formatter = {
    format: format
}