import { ImgColor } from "./img";

class Data {

    constructor(csv, zone) {
        this.json = this.#csv2Json(csv, ",");
        this.attrList = Object.keys(this.json[0]);
        this.img = null;
        this.zone = zone;
        this.attr = {};

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

    createUserInput() {
        this.#createLabelAxisInput();
        this.#createDescriptionInput();
    }

    #createLabelAxisInput() {

        this.zone.append("label")
            .attr("for", "xLabel")
            .text("Attribut en X : ")

        let optx = this.zone.append("select")
            .attr("list", "x_labs")
            .attr("id", "xLabel")

        optx.selectAll("options")
            .data(["Sélectionner un attribut"].concat(this.attrList))
            .enter()
            .append("option")
            .text(name => name)

        this.zone.append("br")
        this.zone.append("label")
            .attr("for", "yLabel")
            .text("Attribut en Y : ")

        let opty = this.zone.append("select")
            .attr("list", "y_labs")
            .attr("id", "yLabel")

        opty.selectAll("option")
            .data(["Sélectionner un attribut"].concat(this.attrList))
            .enter()
            .append("option")
            .text(name => name)
    }

    #createDescriptionInput() {
        this.zone.selectAll("boxes").data(this.attrList)
            .enter()
            .append("input")
            .attr("id", name => name)
            .attr("value", name => name)
            .attr("type", "text")
    }

    updateAttrValues() {
        d3.select("#update").on("mouseover", (e) => {
            // update Description
            this.attrList.forEach(item => {
                this.attr[item].description = document.getElementById(item).value;
            })

            // update Axis attribut selection
            try {
                const xAxisAttr = d3.select("#yLabel").property("value")
                this.attr[xAxisAttr].label = "X";
            } catch { }

            try {
                const yAxisAttr = d3.select("#xLabel").property("value")
                this.attr[yAxisAttr].label = "Y";
            } catch { }

            console.log(this.attr)
        })

        
    }

}

export { Data };