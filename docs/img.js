import Tesseract from 'tesseract.js';

class ImgColor {

    constructor(img) {
        this.img = img;
        this.colorThief = new ColorThief();
    }

    async getTitle() {
        let text = await Tesseract.recognize(this.img, 'eng', { logger: m => m}).then(({ data: {text}}) => text)

        let title = ""
        for (let line of text.split('\n')) {
            if (line === "") { break; }
            title = title.concat(" " + line);
        }
        console.log(title)
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

    createColorsInput(vizZone) {
        var getColors = this.getColors();

        vizZone = vizZone.append("div")
            .attr("class", "colorSelector")

        let boxes = vizZone.selectAll("* *").data(getColors)
            .enter()
            .append("div")

        boxes.append("svg")
            .attr("class", "color")
            .append("rect")
            .attr("width", "90%")
            .attr("height", "90%")
            .attr("rx", "5px")
            .attr("fill", c => c[0])

        boxes.append("label")
            .attr("for", c => c[1] + "Descr")
            .text(c => c[1])

        boxes.append("input")
            .attr("id", c => c[1])
            .attr("type", "text") 
    }
}

export { ImgColor };