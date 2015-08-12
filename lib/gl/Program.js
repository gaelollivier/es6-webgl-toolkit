class Program {
    constructor(glContext) {
        this.gl = glContext;

        this.shaders = {
            vertex: null,
            fragment: null
        };

        this.glProgram = null;
    }

    setVertexShader(src) {
        this.shaders.vertex = this.createShader(this.gl.VERTEX_SHADER, src);

        if (this.shaders.fragment) {
            this.link();
        }
    }

    setFragmentShader(src) {
        this.shaders.fragment = this.createShader(this.gl.FRAGMENT_SHADER, src);

        if (this.shaders.vertex) {
            this.link();
        }
    }

    createShader(type, src) {
        let shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader error:\n' + this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    link() {
        if (!this.shaders.vertex || !this.shaders.fragment) {
            console.error('Cannot link program: missing shader');
            return;
        }

        this.glProgram = this.gl.createProgram();
        this.gl.attachShader(this.glProgram, this.shaders.vertex);
        this.gl.attachShader(this.glProgram, this.shaders.fragment);
        this.gl.linkProgram(this.glProgram);

        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            console.error('Could not link program:\n' + this.gl.getProgramInfoLog(this.glProgram));
            this.glProgram = null;
            return;
        }
    }
}

export default Program;
