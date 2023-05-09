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
        vizText.src = img;
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
        for (var j=0; j<headers.length;j++){
            var elem = curr_line[j];
            obj[headers[j]] = isNaN(elem) ? elem: Number(elem);
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

    attrList.forEach(attr => {groupAttr[attr] = {data: [], type: null, unique: {}}} );

    jsonObj.forEach(line => {
        attrList.forEach((attr) => {
            groupAttr[attr].data.push(line[attr]);
            let nmb = groupAttr[attr].unique[line[attr]]
            groupAttr[attr].unique[line[attr]] = (nmb !== undefined)? nmb + 1: 1;
        })
    })

    attrList.forEach(attr => {
        groupAttr[attr].type = getType(groupAttr[attr]); 
    })
    console.log(groupAttr)
}



function isNotCategorial(obj) {
    for (let attr in obj.unique) {
        if (obj.unique[attr] > 1) {
            return true;
        }
    }
    return false;
}


function getType(obj) {

   

    let local_type = typeof(obj.data[0]);
    if (local_type === "number") {
        //let cat = isNotCategorial(obj.unique)? "numérique": "catégorique";
        let cat = ""
        if (Number.isInteger(obj.data[0])) {
            return `int (${cat})`;
        } else {
            return `float (${cat})`;
        }
    }

    return local_type;
}