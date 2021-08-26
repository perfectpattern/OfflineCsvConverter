
function analyseJSON(obj, path = "", analysis = []) {
    let type = obj === null ? 'Null' :
        obj === undefined ? 'Undefined' :
            Object.prototype.toString.call(obj).slice(8, -1);

    if (type === 'Array') {
        analysis.push({
            path: path,
            type: 'Array',
            length: obj.length
        });
    }
    else if (type === 'Object') {
        analysis.push({
            path: path,
            type: 'Object',
            length: Object.keys(obj).length
        });

        if (Object.keys(obj).length < 50) {
            Object.keys(obj).forEach(key => {
                let newObj = obj[key];
                analysis = analyseJSON(newObj, path + (path === "" ? "" : "/") + key, analysis);
            });
        }
    }

    //Dead end
    else {
        analysis.push({
            path: path,
            type: type,
            length: null
        });
    }

    return analysis;
}

function chooseJSONpath(analysis) {
    let minRequiredLength = 50;
    let maxLength = 0;
    let path = null;
    analysis.forEach(entry => {
        if (entry.length !== null && entry.length > minRequiredLength) {
            if (entry.length > maxLength) {
                maxLength = entry.length;
                path = entry.path;
            }
        }
    });
    return path;
}

function extractJSONpath(json, path) {
    let pathArr = path.split("/");
    let key = pathArr.shift();
    if (key !== "") return extractJSONpath(json[key], pathArr.join("/"));
    else return json;
}

function readJSONdata(obj) {

    let type = obj === null ? 'Null' :
        obj === undefined ? 'Undefined' :
            Object.prototype.toString.call(obj).slice(8, -1);

    let result = {
        data: [],
        errors: [],
        meta: {
            fields: []
        }
    };

    //Json is an object of records
    if (type === 'Object') {
        for (var key in obj) {
            let record = obj[key];
            record['id'] = key;

            //Read record
            let recordRead = readRecord(record);

            //Add data record
            result.data.push(recordRead.record);

            //Merge fields
            for (var i = 0; i < recordRead.fields.length; i++) {
                let field = recordRead.fields[i];
                if (!result.meta.fields.includes(field)) result.meta.fields.push(field);
            }
        }
    }

    //Json is an array of records
    if (type === 'Array') {
        for (var i = 0; i < obj.length; i++) {
            let record = obj[i];

            //Read record
            let recordRead = readRecord(record);

            //Add data record
            result.data.push(recordRead.record);

            //Merge fields
            for (var j = 0; j < recordRead.fields.length; j++) {
                let field = recordRead.fields[j];
                if (!result.meta.fields.includes(field)) result.meta.fields.push(field);
            }
        }
    }

    return result;
}

function readRecord(obj, path = "", recordRead = null) {
    //init recordRead
    if (recordRead === null) {
        recordRead = {
            record: {},
            fields: []
        }
    }

    //Get type of record
    let type = obj === null ? 'Null' :
        obj === undefined ? 'Undefined' :
            Object.prototype.toString.call(obj).slice(8, -1);

    //Read record or iterate through children
    switch (type) {
        case 'Object':
            for (var k = 0; k < Object.keys(obj).length; k++) {
                let key = Object.keys(obj)[k];
                readRecord(obj[key], path + (path === "" ? "" : "/") + key, recordRead);
            }
            break;

        case 'Array':
            for (var k = 0; k < obj.length; k++) {
                readRecord(obj[k], path + (path === "" ? "" : "/") + k, recordRead);
            }
            break;

        default:
            let field = path.split("/").join("_");
            let value = obj;
            recordRead.record[field] = value;
            recordRead.fields.push(field);
            break;
    }
    return recordRead;
}

function parse(json) {
    let analysis = analyseJSON(json);
    let path = chooseJSONpath(analysis);
    let dataNode = extractJSONpath(json, path);
    return readJSONdata(dataNode);
}

export const jsonParser = {
    parse: parse
}
