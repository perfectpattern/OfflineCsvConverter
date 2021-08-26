
function parse(input) {
    return new Promise(
        function (resolve, reject) {
            let j = 0;

            let res = {
                data: [],
                errors: [],
                meta: {},
            };

            this.readRecords = 0;

            papa.parse(input, {
                header: true,
                worker: false,
                skipEmptyLines: true,

                step: function (results, parser) {
                    if (j % 10000 == 0) {
                        this.readRecords = j;
                    }
                    if (j == 0) res.meta = results.meta;
                    res.data.push(results.data);
                    if (results.errors.length > 0) {
                        for (var i = 0; i < results.errors.length; i++) {
                            res.errors.push(results.errors[i]);
                            console.log(results.errors[i]);
                        }
                    }
                    //res.errors = results.errors;
                    j++;
                }.bind(this),

                complete: function (results, file) {
                    //Success
                    if (
                        res.errors.length == 0 &&
                        res.hasOwnProperty("data") &&
                        res.data.length > 0 &&
                        res.hasOwnProperty("meta") &&
                        res.meta.hasOwnProperty("fields")
                    ) {
                        this.errors = null;
                        this.validData = true;
                        this.parsedData = res;
                        this.allFields = res.meta.fields;
                        this.sortedColumns = res.meta.fields;
                    }

                    //Error
                    else {
                        this.errors = res.errors;
                        this.validData = false;
                        this.parsedData = null;
                        this.sortedColumns = [];
                    }

                    //Finally
                    console.log("Parsing complete:");
                    console.log(this.parsedData);
                    this.loading = false;
                    resolve();
                }.bind(this),
            });
        }.bind(this)
    )
}

export const csvParser = {
    parse() {
        return parse(input);
    }
}
