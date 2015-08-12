import _ from 'lodash';

class Renderer {
    constructor(glContext) {
        this.gl = glContext;

        this.geometry = null;
        this.program = null;

        this.attributesLocations = {};

        this.init();
    }

    init() {
        this.gl.clearColor(0.0, 0.0, 1.0, 1.0);
    }

    setGeometry(geometry) {
        this.geometry = geometry;

        if (this.program) {
            this.initAttributes();
        }
    }

    setProgram(program) {
        this.program = program;

        if (this.geometry) {
            this.initAttributes();
        }
    }

    initAttributes() {
        // Get attributes locations
        _.forEach(this.geometry.attributes, (attribute, name) => {
            this.attributesLocations[name] = this.gl.getAttribLocation(this.program.glProgram, name);
            if (this.attributesLocations[name] === -1) {
                delete this.attributesLocations[name];
                console.error(`Cannot find attribute location: ${name}`);
                return;
            }
            this.gl.enableVertexAttribArray(this.attributesLocations[name]);
        });
    }

    render() {
        if (!this.geometry) {
            console.error('Cannot render: no geometry specified');
            return;
        }

        if (!this.program) {
            console.error('Cannot render: no program specified');
            return;
        }

        if (!this.program.glProgram) {
            console.error('Cannot render: invalid program');
            return;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program.glProgram);

        // Bind attributes buffers
        _.forEach(this.geometry.attributes, (attribute, name) => {
            if (_.isUndefined(this.attributesLocations[name])) {
                return;
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
            this.gl.vertexAttribPointer(this.attributesLocations[name], attribute.itemSize, this.gl.FLOAT, false, 0, 0);
        });

        // Draw geometry
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.geometry.itemsCount);
    }
}

export default Renderer;
