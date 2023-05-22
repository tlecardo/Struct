class ImgColor {

    constructor(img) {
        this.img = img;
        this.colorThief = new ColorThief();
    }

    computePalette(numberColor = 3) {
        this.colors = this.colorThief.getPalette(this.img, numberColor, 10);
    }

    #componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    #rgbToHex(arr) {
        return "#" + this.#componentToHex(arr[0]) + this.#componentToHex(arr[1]) + this.#componentToHex(arr[2]);
    }

    getColorsNames() {
        return this.colors.reduce((prec, val) => { prec.push(ntc.name(this.#rgbToHex(val))[1]); return prec; }, []);
    }

    getColorsCodes() {
        return this.colors.reduce((prec, val) => { prec.push(ntc.name(this.#rgbToHex(val))[0]); return prec; }, []);
    }

    getColors() {
        return this.colors.reduce((prec, val) => { prec.push(ntc.name(this.#rgbToHex(val))); return prec; }, []);
    }

    createColorsInput(vizZone, data) {
        var getColors = this.getColors();
        vizZone = vizZone.selectAll("boxes")

        let boxes = vizZone.data(getColors)
            .enter()
            .append("div")
            .attr("class", "colorSelector")

        boxes.append("div")
            .attr("class", "rectangle")
            .style("background-color", c => c[0])

        boxes.append("label")
            .attr("for", c => c[1] + "Descr")
            .text(c => "Couleur " + c[1] + " : ")

        boxes.append("input")
            .attr("id", c => c[1])
            .attr("type", "text") 
    }
}

export { ImgColor };