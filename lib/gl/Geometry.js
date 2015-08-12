class Geometry {
    constructor(glContext) {
        this.gl = glContext;

        this.attributes = {};
        this.itemsCount = null;
    }

    addAttribute(name, data, itemSize) {
        let attribute = {
            buffer: null,
            itemSize: itemSize,
            itemsCount: data.length / itemSize
        };

        if (this.itemsCount !== null && attribute.itemsCount !== this.itemsCount) {
            console.error('Geometry attributes with different items count');
            return;
        } else {
            this.itemsCount = attribute.itemsCount;
        }

        attribute.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        this.attributes[name] = attribute;
    }
}

export default Geometry;
