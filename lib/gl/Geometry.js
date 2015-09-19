/**
 * Geometry
 * This class exposes a simple API to define a geometry using vertex attributes.
 * At this time, only non-indexed geometry is supported.
 * Attributes are added using the addAttribute() method and the data is immediately sent to
 * a GPU buffer so the memory can be freed immediately.
 */
class Geometry {
    /**
     * Constructor
     * @param {WebGLRendeingContext} glContext WebGL context
     */
    constructor(glContext) {
        this.gl = glContext;

        this.attributes = {};
        this.itemsCount = null;
    }

    /**
     * Adds a new per-vertex attribute to the geometry
     * @param {string} name Name of the attribute
     * @param {mixed} data Data of the attribute (will be immediately send to GPU)
     * Can be any kind valid buffer data (Float32Array, ...)
     * @param {number} itemSize Number elements in attribute items (ex: 3 for vec3, 1 for float, ...)
     */
    addAttribute(name, data, itemSize) {
        let attribute = {
            buffer: null,
            itemSize: itemSize,
            itemsCount: data.length / itemSize
        };

        if (this.itemsCount !== null && attribute.itemsCount !== this.itemsCount) {
            throw new Error('Geometry attributes with different items count');
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
