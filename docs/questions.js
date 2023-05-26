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
        
        subparts.append("text")
            .text(n => n)

        subparts.selectAll("a")
            .data(n => this.questions[n])
            .enter()
            .append("div")
            .append("text")
            .text(c => `Q : ${c[0]} => R : ${c[1]}`)
    }

    updateQR() {
        return;
    }
}

export { QR };