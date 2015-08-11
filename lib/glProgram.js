class glProgram {
	constructor(glContext) {
		this.gl = glContext;

		this.shaders = {
			vertex: null,
			fragment: null
		};

		this.vertexAttributes = {};

		this.glProgram = null;

		this.init();
	}

	init() {
		this.gl.clearColor(0.0, 0.0, 1.0, 1.0);

		// Create geometry buffer
		this.geometryBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.geometryBuffer);

		let vertices = [
			1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
			1.0, -1.0, 0.0, -1.0, -1.0, 0.0
		];

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.geometryBuffer.itemSize = 3;
		this.geometryBuffer.itemsCount = vertices.length / this.geometryBuffer.itemSize;
	}

	setVertexShader(src) {
		this.shaders.vertex = this.createShader(this.gl.VERTEX_SHADER, src);
		this.link();
	}

	setFragmentShader(src) {
		this.shaders.fragment = this.createShader(this.gl.FRAGMENT_SHADER, src);
		this.link();
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

		this.gl.useProgram(this.glProgram);

		this.vertexAttributes.vertexPosition = this.gl.getAttribLocation(this.glProgram, 'vertexPosition');
		this.gl.enableVertexAttribArray(this.vertexAttributes.vertexPosition);
	}

	render() {
		if (!this.glProgram) {
			console.error('Cannot render: invalid program');
			return;
		}

		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.useProgram(this.glProgram);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.geometryBuffer);
		this.gl.vertexAttribPointer(this.vertexAttributes.vertexPosition, this.geometryBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		// Draw geometry
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.geometryBuffer.itemsCount);
	}
}

export default glProgram;