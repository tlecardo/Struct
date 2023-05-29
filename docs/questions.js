class QR {

    constructor(data, zone) {
        this.questions = data;
        this.zone = zone;
        this.parts = Object.keys(this.questions);
    }

    display() {
        let subparts = this.zone.selectAll("div")
            .data(this.parts)
            .enter()
            .append("div")
            .attr("id", n => n)
            .attr("class", "parts")

        subparts.append("text")
            .attr("class", "partsText")
            .text(n => n)

        subparts.append("text")
            .text(" | +")
            .on("click", function () {
                
                let nw_node = d3.select(this.parentNode).append("div");

                nw_node.append("text").text("Q : ")

                nw_node.append("text")
                    .attr("class", "QRText")
                    .attr("contenteditable", true)
                    .text("A compléter")

                nw_node.append("text")
                    .text(" | ×")
                    .on("click", function () {
                        this.parentNode.remove()
                    })
                    .append("br")

                nw_node.append("text")
                    .text(" ==> ")

                nw_node.append("text")
                    .attr("class", "QRText")
                    .attr("contenteditable", true)
                    .text("A compléter")
            })

        let qrGlobal = subparts.selectAll("a")
            .data(n => this.questions[n])
            .enter()
            .append("div")

        qrGlobal.append("text").text("Q : ")

        qrGlobal.append("text")
            .attr("class", "QRText")
            .text(c => c[0])

        qrGlobal.append("text")
            .text(" | ×")
            .on("click", function () {
                this.parentNode.remove()
            })
            .append("br")

        qrGlobal.append("text").text(" ==> ")

        qrGlobal.append("text")
            .attr("class", "QRText")
            .attr("contenteditable", true)
            .text(c => c[1])
    }

    updateQR() {

        d3.select("#updateQR").on("mouseover", (e) => {
            let currentPart = null;
            let res = {}
            let isQuestion = true;
            let localQR = []

            let inputs = document.querySelectorAll('#sec_question div text')
            let _ = [...inputs].forEach(input => {
                if (input.className === "partsText") {
                    currentPart = input.textContent;
                    res[currentPart] = []
                } if (input.className === "QRText") {
                    localQR.push(input.textContent)
                    if (!isQuestion) {
                        res[currentPart].push(localQR)
                        localQR = []
                    }
                    isQuestion = !isQuestion;
                }
            })
            let disp = document.getElementById("display")
            disp.innerText = JSON.stringify(res);
        })
    }
}

export { QR };