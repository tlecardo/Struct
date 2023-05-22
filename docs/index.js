import { ImgColor } from "./img.js";
import { Data } from "./data.js";

const vizInput = document.getElementById("vizInput");
const vizText = document.getElementById("vizText");
const dataInput = document.getElementById("dataInput");

var vizPromise = new Promise(function(resolve) {
    vizInput.addEventListener("change",resolve,false);
})
var dataPromise = new Promise(function(resolve) {
    dataInput.addEventListener("change", resolve, false);
})

Promise.all([dataPromise, vizPromise]).then(function([eData, eViz]) {

    const fileData = eData.target.files[0];
    const fileViz = eViz.target.files[0];

    var reader1 = new FileReader();
    var reader2 = new FileReader();

    var loadViz = new Promise(function(resolve) {
        reader1.addEventListener("load", resolve, false);
        reader1.readAsDataURL(fileViz);
    })

    var loadData = new Promise(function(resolve) {
        reader2.addEventListener("load", resolve, false);
        reader2.readAsText(fileData);
    })

    Promise.all([loadViz, loadData]).then(function([eVizLoad, eDataLoad]) {

        var dataGlobal = new Data(eDataLoad.target.result, d3.select("#sec_input"))
        dataGlobal.updateType();
        dataGlobal.updateUniqueValues();
        dataGlobal.createUserInput();
        dataGlobal.updateAttrValues();

        vizText.src = eVizLoad.target.result;
        const im = document.querySelector("img");
        im.addEventListener("load", () => {
            const imgObject = new ImgColor(im);
            imgObject.computePalette();
            imgObject.createColorsInput(d3.select("#sec_input"));
        })
    });
});