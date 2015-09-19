import _ from 'lodash';

/**
 * WebGL Program encapsulation
 * Allows to easily create and use a program composed of a vertex and fragment shader
 * from their source.
 */
class Program {
    /**
     * Constructor
     * @param {WebGLRendeingContext} glContext WebGL context
     */
    constructor(glContext) {
        this.gl = glContext;

        this.shaders = {
            vertex: null,
            fragment: null
        };

        this.glProgram = null;

        this.uniforms = {};
    }

    /**
     * Sets the vertex shader source of the program
     * The shader will be immediately compiled and attached to the program
     * @param {string} src Source of the shader
     */
    setVertexShader(src) {
        this.shaders.vertex = this.createShader(this.gl.VERTEX_SHADER, src);

        if (this.shaders.fragment) {
            this.link();
        }
    }

    /**
     * Sets the fragment shader source of the program
     * The shader will be immediately compiled and attached to the program
     * @param {string} src Source of the shader
     */
    setFragmentShader(src) {
        this.shaders.fragment = this.createShader(this.gl.FRAGMENT_SHADER, src);

        if (this.shaders.vertex) {
            this.link();
        }
    }

    /**
     * Creates and compile a new shader from a given source
     * @param {enum} type Type of the shader (ex: glContext.FRAGMENT_SHADER, ...)
     * @param {string} src Source of the shader
     * @returns Compiled shader
     * @protected
     */
    createShader(type, src) {
        let shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Shader error:\n' + this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    /**
     * Links the program
     */
    link() {
        if (!this.shaders.vertex || !this.shaders.fragment) {
            throw new Error('Cannot link program: missing shader');
            return;
        }

        this.glProgram = this.gl.createProgram();
        this.gl.attachShader(this.glProgram, this.shaders.vertex);
        this.gl.attachShader(this.glProgram, this.shaders.fragment);
        this.gl.linkProgram(this.glProgram);

        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            this.glProgram = null;
            throw new Error('Could not link program:\n' + this.gl.getProgramInfoLog(this.glProgram));
        }
    }

    /**
     * Sets a uniform value for the program
     * @param {string} name Name of the uniform
     * @param {mixed} value Value of the uniform
     * Can be any kind of valid uniform value (number, Float32Array, ...)
     * @param {string} [type] Type of the uniform, in the form of GL uniform* functions
     * ex: '1i', '3f', ...
     * If not specified, will be guessed from value
     * @see getUniformType
     */
    setUniform(name, value, type) {
        if (this.uniforms[name]) {
            this.uniforms[name].value = value;
        } else {
            this.uniforms[name] = {
                location: this.gl.getUniformLocation(this.glProgram, name),
                value: value
            }
            if (this.uniforms[name].location === -1) {
                throw new Error(`Cannot get location for uniform ${ name }`);
            }
        }

        this.uniforms[name].type = type ? type : this.getUniformType(value);
    }

    /**
     * Try to guess the type of a given uniform value
     * @param {mixed} value Uniform value
     * @returns {string} Type of the uniform, in the form of GL uniform* functions
     * @see setUniform
     */
    getUniformType(value) {
        if (value instanceof Float32Array) {
            return value.length + 'fv';
        } else if (value instanceof Int32Array) {
            return value.length + 'iv';
        } else {
            return '1f';
        }
    }

    /**
     * Send uniforms values to GPU
     */
    updateUniforms() {
        _.forEach(this.uniforms, (uniform, name) => {
            let method = this.gl['uniform' + uniform.type];

            if (!method) {
                throw new Error(`Cannot set uniform value, unknown type "${ uniform.type }"`);
            }

            method.bind(this.gl)(uniform.location, uniform.value);
        });
    }
}

export default Program;
