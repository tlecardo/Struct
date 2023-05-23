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
                distincts: {},
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

            let local_type = typeof (this.json[0][attr]);

            this.attr[attr].type = (local_type === "number") ? (
                this.attr[attr].type = Number.isInteger(this.json[0][attr]) ? `int` : `float`
            ) : local_type;
        })

        return this;
    }

    updateUniqueValues() {
        this.json.forEach(line => {
            this.attrList.forEach((attr) => {
                this.attr[attr].values.push(line[attr]);
                let nmb = this.attr[attr].distincts[line[attr]]
                this.attr[attr].distincts[line[attr]] = (nmb !== undefined) ? nmb + 1 : 1;
            })
        })

        return this;
    }

    display() {
        console.log(this.attr);
    }

    createUserInput() {
        this.#createLabelAxisInput();
        this.#createDescriptionInput();

        return this;
    }

    #createLabelAxis(axis, zone) {

        zone = zone.append("div")

        zone.append("label")
            .attr("for", `${axis}label`)
            .text(`Attribut en ${axis}`)

        let optx = zone.append("select")
            .attr("list", `${axis}_labs`)
            .attr("id", `${axis}label`)

        optx.selectAll("options")
            .data(["Sélectionner un attribut"].concat(this.attrList))
            .enter()
            .append("option")
            .text(name => name)
    }

    #createLabelAxisInput() {
        let selectAxis = this.zone.append("div")
            .attr("class", `axisSelector`)
        this.#createLabelAxis("X", selectAxis);
        this.#createLabelAxis("Y", selectAxis);
    }

    #createDescriptionInput() {
        let zone = this.zone.append("div")
            .attr("class", "descripSelector")

        zone.selectAll("boxes")
            .data(this.attrList)
            .enter()
            .append("div")
            .append("input")
            .attr("id", name => name)
            .attr("value", name => name)
            .attr("type", "text")
    }

    #getAttrAxis(axis) {
        try {
            const axisAttr = d3.select(`#${axis}label`).property("value")
            this.attr[axisAttr].label = axis;
        } catch {
            this.attrList.forEach(attr => {if (this.attr[attr].label === axis) {this.attr[attr].label = null;}})
        }
    }

    updateAttrValues() {
        d3.select("#update").on("mouseover", (e) => {
            // update Description
            this.attrList.forEach(item => {
                this.attr[item].description = document.getElementById(item).value;
            })

            // update Axis attribut selection
            this.#getAttrAxis("X");
            this.#getAttrAxis("Y");

            this.colors = {};
            let inputs = document.querySelectorAll('.colorSelector div input')
            let _ = [...inputs].filter(input => input.value !== "").forEach(input => {
                this.colors[input.id] = input.value;
            })

            let disp = document.getElementById("display")
            disp.innerText = JSON.stringify(this.attr);
            disp.innerText += JSON.stringify(this.colors);
        })


    }

}

export { Data };