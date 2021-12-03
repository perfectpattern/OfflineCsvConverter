import moment from 'moment';

function parseDateString(string, settings) { //parseFormat = null, returnFormat = null
    let date = null;
    if (settings.parsingMode.id === 'auto') {
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
    return settings.outputMode.id === 'auto' ? date.valueOf() : date.format(settings.outputString);
}

/*function format(value, options = {
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
}*/
function getValues(row, fields) {
    let values = [];
    fields.forEach(field => {
        values.push(row[field]);
    })
    return values;
}

function format(row, column) {
    let output = {
        raw: null,
        formatted: null,
        error: null,
        errorMsg: null
    }

    //Get raw data
    output.raw = getValues(row, column.fields).join(" ");

    //Timestamps
    if (column.id === 'timestamp') {
        let date = parseDateString(output.raw, column.params);

        //Successfully parsed
        if (date !== null) output.formatted = date;

        //Parsing error
        else {
            output.error = true;
            output.errorMsg = "Parsing error. Please check parsing string";
        }
    }

    //Values
    else {
        //No rule
        if (column.rule === null) {
            output.formatted = output.raw[0];
        }

        //Rule
        else {
            let values = {};
            output.raw.forEach((value, index) => {
                values[index] = value;
            });

            try {
                output.formatted = eval(column.rule);
            }
            catch (e) {
                output.error = true;
                output.errorMsg = e.getMessage();
            }
        }

        //Default value formatting
        //replace all decimal commas by points
        output.formatted = typeof output.formatted === 'string' ? output.formatted.replace(",", ".") : output.formatted;
    }

    return output;
}

export const formatter = {
    format: format
}