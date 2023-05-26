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

        let qrGlobal = subparts.selectAll("a")
            .data(n => this.questions[n])
            .enter()
            .append("div")

        qrGlobal.append("text")
            .attr("class", "QRText")
            .text(c => `Q : ${c[0]}`)


        qrGlobal.append("text")
            .text(" | X")
            .on("click", function() {
                this.parentNode.remove()
            })
            .append("br")

        qrGlobal.append("text")
            .text(" ==> ")
    
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
                } if(input.className === "QRText") {
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