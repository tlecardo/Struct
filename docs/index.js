// Chargement de l'article
const fileSelec = document.getElementById("articleInput");
const articleText = document.getElementById("articleText");

fileSelec.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        articleText.setAttribute("overflow", "scroll");
        articleText.innerHTML = event.target.result;
    })

    reader.readAsText(file)
})


// Chargement des données
const dataSelec = document.getElementById("dataInput");
const dataText = document.getElementById("dataText");

dataSelec.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const jsonFile = csv2Json(event.target.result, ",")
        summarizeJson(jsonFile)
    })
    reader.readAsText(file)
})


// Chargement de la visualisation
const vizSelec = document.getElementById("vizInput");
const vizText = document.getElementById("vizText");

vizSelec.addEventListener('change', (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        const img = reader.result;
        //vizText.src = img;
    })
    reader.readAsDataURL(file)

})


// Conversion du CSV en JSON
function csv2Json(text, sep) {
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
    },
        [])
    return res;
}

// Résumé des données
function summarizeJson(jsonObj) {

    // extract Attributs
    var attrList = Object.keys(jsonObj[0])
    var groupAttr = {}

    attrList.forEach(attr => { groupAttr[attr] = { values: [], type: null, numbers: {}, description: "", label: null } });

    jsonObj.forEach(line => {
        attrList.forEach((attr) => {
            groupAttr[attr].values.push(line[attr]);
            let nmb = groupAttr[attr].numbers[line[attr]]
            groupAttr[attr].numbers[line[attr]] = (nmb !== undefined) ? nmb + 1 : 1;
        })
    })

    attrList.forEach(attr => {
        groupAttr[attr].type = getType(groupAttr[attr]);
    })

    getDescript(groupAttr)
    getLabelAxis(groupAttr)
}


function getLabelAxis(obj) {
    var attrList = Object.keys(obj)

    obj[attrList[0]].label = "X"
    obj[attrList[1]].label = "Y"

    let optx = d3.select('#sec_viz')
        .append("select")
        .attr("list", "x_labs")
        .on("change", e => {

            for (let attr of attrList) {
                obj[attr]['label'] = null;
            }

            let attr = attrList[e.srcElement.selectedIndex]
            obj[attr]['label'] = "X";

            console.log(obj)
        })


    optx.selectAll("options")
        .data(attrList)
        .enter()
        .append("option")
        .text(name => name)

    let opty = d3.select('#sec_viz')
        .append("select")
        .attr("list", "y_labs")
        .on("change", e => {

            for (let attr of attrList) {
                obj[attr]['label'] = null;
            }

            let attr = attrList[e.srcElement.selectedIndex]
            obj[attr]['label'] = "Y";

            console.log(obj)
        })

    opty.selectAll("option")
        .data(attrList)
        .enter()
        .append("option")
        .text(name => name)
}

function getDescript(obj) {
    var attrList = Object.keys(obj)

    d3.select('#sec_data')
        .selectAll(".sec_data")
        .data(attrList)
        .enter()
        .append("div")
        .attr("id", name => name)
        .append("input")
        .attr("placeholder", name => name)
        .attr("type", "text")
        .on("keypress", (e, name) => {
            // INCOMPLET
            if (e.inputType == "insertText") {
                obj[name].description += e.data;
            } else {
                obj[name].description = obj[name].description.slice(0, -1);
            }
            console.log(obj)
        })
}


function getType(obj) {

    let local_type = typeof (obj.values[0]);
    if (local_type === "number") {
        if (Number.isInteger(obj.values[0])) {
            return `int`;
        } else {
            return `float`;
        }
    }

    return local_type;
}