import { ImgColor } from "./img.js";
import { Data } from "./data.js";

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
        var dataObj = new Data(event.target.result, d3.select("#sec_viz"), d3.select("#sec_data"))
        dataObj.updateType();
        dataObj.updateUniqueValues();
        dataObj.createUserInput();
        dataObj.updateAttrValues();
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
        const im = document.querySelector("img")
        const imgObject = new ImgColor(im)
        im.addEventListener("load", () => {
            imgObject.computePalette()
            console.log(imgObject.getColorsNames())
        })
    })
    reader.readAsDataURL(file)

})