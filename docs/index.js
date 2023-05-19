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
        var dataObj = new Data(event.target.result)
        dataObj.updateType()
        dataObj.updateUniqueValues()
        dataObj.display()
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

function getLabelAxis(obj) {

    var attrList = Object.keys(obj)

    let viz = d3.select("#sec_viz")
    
    viz.append("label")
        .attr("for", "xLabel")
        .text("Attribut en X : ")

    let optx = viz.append("select")
        .attr("list", "x_labs")
        .attr("id", "xLabel")

    optx.selectAll("options")
        .data(["Sélectionner un attribut"].concat(attrList))
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
        .data(["Sélectionner un attribut"].concat(attrList))
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
}