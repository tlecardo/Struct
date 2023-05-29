import { ImgColor } from "./img.js";
import { Data } from "./data.js";
import { QR } from "./questions.js";

const vizInput = document.getElementById("vizInput");
const vizText = document.getElementById("vizText");
const dataInput = document.getElementById("dataInput");
const img = document.getElementsByTagName("img")[0];

let testQ = {
    Visuel: [["Quelle est la couleur dominante ?", "Le rouge est la couleur majoritairement présente."],
    ["Quelles données sont sur l'axe des ordonnées ?", "Le nombre de cas est représenté sur l'axe Y."]],
    Data: [["Quand le nombre de cas atteint-il un pic ?", "Le mois de Novembre 2021 correspond au nombre le plus important de cas"]]
}

var vizPromise = new Promise(function (resolve) {
    vizInput.addEventListener("change", resolve, false);
})
var dataPromise = new Promise(function (resolve) {
    dataInput.addEventListener("change", resolve, false);
})

const createPromises = function (eData, eViz) {

    const fileData = eData.target.files[0];
    const fileViz = eViz.target.files[0];

    var reader1 = new FileReader();
    var reader2 = new FileReader();

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

    return [loadViz, loadData]
}


Promise.all([dataPromise, vizPromise])
    .then(function ([eData, eViz]) {

        Promise.all(createPromises(eData, eViz)).then(function ([_, eDataLoad]) {

            var dataGlobal = new Data(eDataLoad.target.result, d3.select("#sec_input"))
            dataGlobal.update()
                .createUserInput();
            dataGlobal.updateAttrValues();

            const imgObject = new ImgColor(img);
            imgObject.computePalette(5);
            imgObject.createColorsInput(d3.select("#sec_input"));
            imgObject.createTitleInput(d3.select("#sec_input"));

            let qrLocal = new QR(testQ, d3.select("#sec_question"));
            qrLocal.display();
            qrLocal.updateQR();
        });
    })