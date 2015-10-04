import _ from 'lodash';

/**
 * Basic WebGL renderer
 * Executes a WebGL draw call using the specified program and geometry.
 * Outputs to the specified render target or default framebuffer.
 */
class Renderer {
    /**
     * Constructor
     * @param {WebGLRendeingContext} glContext WebGL context
     */
    constructor(glContext) {
        this.gl = glContext;

        this.geometry = null;
        this.program = null;
        this.renderTarget = null;

        this.attributesLocations = {};

        this.init();
    }

    /**
     * Inits the renderer
     */
    init() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * Sets the geometry to be rendered
     * @param {Geometry} geometry Geometry
     */
    setGeometry(geometry) {
        this.geometry = geometry;

        if (this.program) {
            this.initAttributes();
        }
    }

    /**
     * Sets the program to be used for rendering
     * @param {Program} program Program
     */
    setProgram(program) {
        this.program = program;

        if (this.geometry) {
            this.initAttributes();
        }
    }

    /**
     * Sets the render target. Draw calls will output to the specified target.
     * At this time, the only kind of target supported is TextureTarget.
     * If target is null or none is specified, render() outputs to default framebuffer.
     * @param {TextureTarget} target Render target
     */
    setTarget(target) {
        this.renderTarget = target;
    }

    /**
     * Inits vertice attributes for rendering
     * (retrieves locations and enable the attributes)
     */
    initAttributes() {
        // Get attributes locations
        _.forEach(this.geometry.attributes, (attribute, name) => {
            this.attributesLocations[name] = this.gl.getAttribLocation(this.program.glProgram, name);
            if (this.attributesLocations[name] === -1) {
                delete this.attributesLocations[name];
                throw new Error(`Cannot find attribute location: ${name}`);
            }
            this.gl.enableVertexAttribArray(this.attributesLocations[name]);
        });
    }

    /**
     * Render the given geometry using the given shader to default framebuffer
     */
    render() {
        if (!this.geometry) {
            throw new Error('Cannot render: no geometry specified');
            return;
        }

        if (!this.program) {
            throw new Error('Cannot render: no program specified');
        }

        if (!this.program.glProgram) {
            throw new Error('Cannot render: invalid program');
            return;
        }


        // Bind output buffer
        if (this.renderTarget) {
            this.renderTarget.bindFramebuffer();
            this.gl.viewport(0, 0, 512, 512);
        } else {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, 720, 480);
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program.glProgram);

        // Send uniforms
        this.program.updateUniforms();

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
