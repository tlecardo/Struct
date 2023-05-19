class ImgColor {

    constructor(img) {
        this.img = img;
        this.colorThief = new ColorThief();
    }

    computePalette(numberColor=10) {
        this.colors = this.colorThief.getPalette(this.img, 10, numberColor)
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
}

export { ImgColor };