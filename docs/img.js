class ImgColor {

    constructor(img) {
        this.img = img;
        this.colorThief = new ColorThief();
    }

    #getTitle() {
        const myPromise = new Promise(resolve => {

            Tesseract.recognize(this.img, 'fra', { logger: m => m })
                .then(({ data: { text } }) => text)
                .then(text => {
                    let title = ""
                    for (let line of text.split('\n')) {
                        if (line === "") { break; }
                        title = title.concat(" " + line);
                    }
                    this.text = text;
                    this.title = title;
                    resolve(title);
                })
        })
        return myPromise;
    }

    createTitleInput(vizZone) {

        let node = vizZone.node();
        let titleNode = document.createElement("div");
        titleNode.className = "titleSelector";
        node.insertBefore(titleNode, node.childNodes[0]);

        let zone = d3.selectAll("div.titleSelector").append("div");

        zone.append("label")
            .attr("for", "title")
            .text("Titre");

        let input = zone.append("input")
            .attr("id", "title")
            .attr("value", "Titre")
            .attr("type", "text");

        this.#getTitle().then(x => { input.attr("value", x).attr("size", "50") });

        return this;
    }

    computePalette(numberColor = 3) {
        this.colors = this.colorThief.getPalette(this.img, numberColor, 1);
    }

    #componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    #rgbToHex(arr) {
        return "#" + this.#componentToHex(arr[0]) + this.#componentToHex(arr[1]) + this.#componentToHex(arr[2]);
    }

    getColors() {
        return this.colors.reduce((prec, val) => { prec.push(ntc.name(this.#rgbToHex(val))); return prec; }, []);
    }

    createColorsInput(vizZone, dataset, type) {
        let colors = this.getColors();

        let viz_sec = vizZone.append("div")
            .attr("class", "colorSelector");

        let listData = []
        for(let item of Object.keys(dataset)) {
            listData.push(item);
            if (type == "circle") {
                if (dataset[item].type === "string") {
                    for (let val of dataset[item].values){
                        listData.push(val)
                    }
                }
            }
        }

        viz_sec.append("datalist")
            .attr("id", "attrs")
            .selectAll("*")
            .data(listData)
            .enter()
            .append("option")
            .attr("value", n => n)
            .text(n => n)

        let boxes = viz_sec.selectAll("color")
            .data(colors)
            .enter()
            .append("div");
        
        boxes.append("svg")
            .attr("class", "color")
            .append("rect")
            .attr("width", "90%")
            .attr("height", "90%")
            .attr("rx", "5px")
            .attr("fill", c => c[0]);

        boxes.append("label")
            .attr("for", c => c[1] + "Descr")
            .text(c => c[1]);

        boxes.append("input")
            .attr("id", c => c[1])
            .attr("type", "search")
            .attr("list", "attrs")
        
        return this;
    }
}

export { ImgColor };