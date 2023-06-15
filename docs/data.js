import { ImgColor } from "./img.js";

let CATEGORIQUE = "catégorique";
let ORDINAL = "ordinal";
let NUM = "numérique";

class Data {

    constructor(csv, zone, type) {
        this.json = this.#csv2Json(csv, ",");
        this.attrList = Object.keys(this.json[0]);
        this.img = null;
        this.zone = zone;
        this.attr = {};
        this.type = type; // BarChart PieChart LineChart
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

    addArticle(article) {
        this.article = article;
    }

    addImg(img) {
        this.img = new ImgColor(img);
        this.img.computePalette(5);
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

    update() {
        this.#updateType();
        this.#updateUniqueValues();
        this.#updateCat();

        return this;
    }

    #updateType() {
        // number, int or float
        this.attrList.forEach(attr => {
            let local_type = typeof (this.json[0][attr]);
            this.attr[attr].type = (local_type === "number") ? (
                this.attr[attr].type = Number.isInteger(this.json[0][attr]) ? `int` : `float`
            ) : local_type;
        })
    }

    #updateCat() {
        // catégorique, numérique, ordinale
        this.attrList.forEach(attr => {

            let typeAttr = this.attr[attr].type;
            let values = this.attr[attr].values;
            switch (typeAttr) {
                case "string":
                    this.attr[attr]["cat"] = CATEGORIQUE;
                    break;
                case "float":
                    this.attr[attr]["cat"] = NUM;
                    break;
                default:
                    if (Math.min(values) < 0) {
                        this.attr[attr]["cat"] = NUM;
                    } else { // type INT
                        this.attr[attr]["cat"] = Math.min(values) - Math.max(values) < 99 ? CATEGORIQUE : NUM;
                    }
            }
        })
    }

    #updateUniqueValues() {
        this.json.forEach(line => {
            this.attrList.forEach((attr) => {
                this.attr[attr].values.push(line[attr]);
                let nmb = this.attr[attr].distincts[line[attr]]
                this.attr[attr].distincts[line[attr]] = (nmb !== undefined) ? nmb + 1 : 1;
            })
        })
    }

    display() {
        console.log(this.attr);
    }

    createUserInput() {
        this.#createLabelAxisInput();
        this.#createDescriptionInput();
        this.img.createColorsInput(this.zone, this.attr, this.type);
        this.img.createTitleInput(this.zone);
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
        if (this.type !== "PieChart") {
            let selectAxis = this.zone.append("div")
                .attr("class", `axisSelector`)
            this.#createLabelAxis("X", selectAxis);
            this.#createLabelAxis("Y", selectAxis);
        }
    }

    #createDescriptionInput() {
        let zone = this.zone.append("div")
            .attr("class", "descripSelector")

        zone = zone.selectAll("* *")
            .data(this.attrList)
            .enter()
            .append("div")

        zone.append("label")
            .attr("for", name => name)
            .text(name => `${name.substring(0, 15)}.`)

        zone.append("input")
            .attr("id", name => name)
            .attr("value", name => name)
            .attr("type", "text")
            .attr("size", "50")
    }

    #getAttrAxis(axis) {
        const axisAttr = d3.select(`#${axis}label`).property("value")
        try {
            this.attr[axisAttr].label = axis;
        } catch {
            this.attrList.forEach(attr => { if (this.attr[attr].label === axis) { this.attr[attr].label = null; } })
        }
        return axisAttr;
    }

    updateAttrValues() {
        d3.select("#updateData").on("mouseover", (e) => {
            // update Description
            this.attrList.forEach(item => {
                this.attr[item].description = document.getElementById(item).value.toLowerCase();
            })
            // update Axis attribut selection
            let Xatt = (this.type != "PieChart") ? this.#getAttrAxis("X"): null;
            let Yatt = (this.type != "PieChart") ? this.#getAttrAxis("Y"): null;

            this.colors = {};
            let inputs = document.querySelectorAll('.colorSelector div input')
            let _ = [...inputs].filter(input => input.value !== "").forEach(input => {
                try {
                    this.colors[input.id] = this.attr[input.value].description;
                } catch (e) {
                    this.colors[input.id] = input.value.toLowerCase();
                }
            })

            let disp = document.getElementById("display")
            disp.innerText = JSON.stringify(this.attr) + JSON.stringify(this.colors);

            if (Xatt !== "Sélectionner un attribut" && Yatt !== "Sélectionner un attribut") {
                console.log(this.textIntro(Xatt, Yatt))
                // Subdivision de la visualisation
                // console.log(this.textColors());
                // console.log(this.textData());
                console.log(this.textAttr());
                // console.log(this.textArticle());
            }
        })
    }

    textIntro(Xatt, Yatt) {
        if (this.type == "BarChart") {
            return `Il s'agit d'un graphique intitulé "${this.img.title}". 
            L'axe X représente ${this.attr[Xatt].description}. Il s'agit de données ${this.attr[Xatt].cat}. 
            L'axe Y représente ${this.attr[Yatt].description}. Il s'agit de données ${this.attr[Yatt].cat}.`;
       }
    }

    textColors() {
        let len = this.colors.length;
        if (len != 0) {
            let text = (len === 1) ? "La couleur majoritaire est " : "Les couleurs majoritaires sont ";

            Object.keys(this.colors).forEach(c => text += `le ${c}, `);

            return Object.entries(this.colors).reduce((acc, c) =>
                `${acc} Le ${c[0]} représente le ${c[1]}.`,
                text.replace(/, $/, "."));
        }
    }

    textData() {
        let data = JSON.stringify(this.json);
        data = data.replace("[", "(").replace("]", ")")
            .replace("{", "[").replace("}", "]")
        return `Il représente les données suivantes : ${data}`
    }

    textAttr() {
        return Object.entries(this.attr).reduce((acc, c) => {
            let text = `${acc} L'attribut "${c[0]}" correspond à ${c[1].description}. Il s'agit d'un attribut ${c[1].cat}`
            const values = c[1].values;
            console.log(Math.min(...values))
            switch (c[1].cat) {
                case CATEGORIQUE:
                case ORDINAL:
                    text += ` ayant les valeurs ["${`${values}`.replaceAll(",", ', ')}"].`
                    break;
                case NUM:
                    text += ` allant de ${Math.min(...values)} à ${Math.max(...values)}.`
                    break;
                default:
                    text += "."
            }
            return text;
        }, "")
    }

    textArticle() {
        return `Il est accompagné de l'article de presse suivant : "${this.article}".`;
    }

    textQuestionVisuel() {
        return "[FR] Quelles sont les 25 questions sur les couleurs, formes, visuels et ordonnancement \
        les plus informatives à propos du graphique suivant : "
    }

    textQuestionData() {
        return "[FR] Quelles sont les 25 questions les plus informatives sur les données à propos du graphique suivant : "
    }
}

export { Data };    