import { Data } from "./data.js";
import { QR } from "./questions.js";

const vizInput = document.getElementById("vizInput");
const textInput = document.getElementById("articleInput");
const dataInput = document.getElementById("dataInput");
const img = document.getElementsByTagName("img")[0];

let testQ = {
    Visuel: [["Quelle est la couleur dominante ?", "Le rouge est la couleur majoritairement présente."],
    ["Quelles données sont sur l'axe des ordonnées ?", "Le nombre de cas est représenté sur l'axe Y."]],
    Data: [["Quand le nombre de cas atteint-il un pic ?", "Le mois de Novembre 2021 correspond au nombre le plus important de cas"]]
}

var nwPromise = function(zone) {
    return new Promise(function (resolve) {
        zone.addEventListener("change", resolve, false);
    })
}

const createPromises = function (eData, eViz, eText) {

    const fileData = eData.target.files[0];
    const fileViz = eViz.target.files[0];
    const fileArticle = eText.target.files[0];
    
    var reader1 = new FileReader();
    var reader2 = new FileReader();
    var reader3 = new FileReader();

    var loadViz = new Promise(function (resolve) {

        reader1.addEventListener("load", (eVizLoad) => {
            vizText.src = eVizLoad.target.result;
            img.addEventListener("load", resolve, false)
            })
        reader1.readAsDataURL(fileViz);
    })

    var loadData = new Promise(function (resolve) {
        reader2.addEventListener("load", resolve, false);
        reader2.readAsText(fileData);
    })

    var loadArticle = new Promise(function (resolve) {
        reader3.addEventListener("load", resolve, false);
        reader3.readAsText(fileArticle);
    })

    return [loadViz, loadData, loadArticle]
}

Promise.all([nwPromise(dataInput), nwPromise(vizInput), nwPromise(textInput)])
    .then(function ([eData, eViz, eText]) {

        Promise.all(createPromises(eData, eViz, eText)).then(function ([_, eDataLoad, eTextLoad]) {
            let zone = d3.select("#sec_input")
            let type = d3.select("#typeSelec").property("value")
            console.log(type)       
            var dataGlobal = new Data(eDataLoad.target.result, zone);
            
            dataGlobal.addImg(img);
            dataGlobal.addArticle(eTextLoad.target.result)
            dataGlobal.update();
            dataGlobal.createUserInput();
            dataGlobal.updateAttrValues();

            /*
            *   Génération des questions / réponses   
            */

            let qrLocal = new QR(testQ, d3.select("#sec_question"));
            qrLocal.display();
            qrLocal.updateQR();
        });
    })