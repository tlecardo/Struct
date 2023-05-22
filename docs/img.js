class ImgColor {

    constructor(img) {
        this.img = img;
        this.colorThief = new ColorThief();
    }

    computePalette(numberColor=3) {
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
    
    createColorsInput(vizZone) {
        var colorsName = this.getColorsNames()
        vizZone = vizZone.selectAll("boxes")

        vizZone.data(colorsName)
            .enter()
            .append("label")
            .attr("for", c => c + "Descr")
            .text(c => "Couleur " + c + " : ")
            .append("br")

        let optx = vizZone.data(colorsName)
            .enter()
            .append("select")
            .attr("list", "x_labs")
            .attr("id", c => c + "Descr")

        optx.selectAll("options")
            .data(["Sélectionner un attribut"].concat(["A", "B", "C"]))
            .enter()
            .append("option")
            .text(name => name)
            .append("br")

    }
}

export { ImgColor };