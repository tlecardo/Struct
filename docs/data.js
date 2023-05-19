class Data {

    constructor(csv) {
        this.json = this.#csv2Json(csv, ",");
        this.attrList = Object.keys(this.json[0]);

        this.attr = {}
        this.attrList.forEach(item => {
            this.attr[item] = {
                values: [],
                type: null,
                numbers: {},
                description: "",
                label: null
            }
        });
    }

    #csv2Json(text, sep) {
        var lines = text.split("\n")
        var headers = lines.shift().split(sep)

        var res = lines.reduce((acc, line) => {
            var obj = {};
            var curr_line = line.split(sep);
            for (var j = 0; j < headers.length; j++) {
                var elem = curr_line[j];
                obj[headers[j]] = isNaN(elem) ? elem : Number(elem);
            }
            acc.push(obj);
            return acc
        }, [])

        return res;
    }

    updateType() {
        this.attrList.forEach(attr => {
            
            let local_type = typeof(this.json[0][attr]);

            this.attr[attr].type = (local_type === "number")? (
                this.attr[attr].type = Number.isInteger(this.json[0][attr]) ? `int` : `float`
                ) : local_type;
        })
    }

    updateUniqueValues() {
        this.json.forEach(line => {
            this.attrList.forEach((attr) => {
                this.attr[attr].values.push(line[attr]);
                let nmb = this.attr[attr].numbers[line[attr]]
                this.attr[attr].numbers[line[attr]] = (nmb !== undefined) ? nmb + 1 : 1;
            })
        })
    }

    display() {
        console.log(this.attr);
    }



    getLabelAxis() {

        let viz = d3.select("#sec_viz")

        viz.append("label")
            .attr("for", "xLabel")
            .text("Attribut en X : ")

        let optx = viz.append("select")
            .attr("list", "x_labs")
            .attr("id", "xLabel")

        optx.selectAll("options")
            .data(["Sélectionner un attribut"].concat(this.attrList))
            .enter()
            .append("option")
            .text(name => name)

        viz.append("br")
        viz.append("label")
            .attr("for", "yLabel")
            .text("Attribut en Y : ")

        let opty = viz.append("select")
            .attr("list", "y_labs")

        opty.selectAll("option")
            .data(["Sélectionner un attribut"].concat(this.attrList))
            .enter()
            .append("option")
            .text(name => name)
    }

    getDescript() {

        d3.select('#sec_data')
            .selectAll(".sec_data")
            .data(this.attrList)
            .enter()
            .append("div")
            .attr("id", name => name)
            .append("input")
            .attr("placeholder", name => name)
            .attr("type", "text")
    }

}

export { Data };