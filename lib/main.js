import Program from './gl/Program';
import Geometry from './gl/Geometry';
import Renderer from './gl/Renderer';
import TextureTarget from './gl/TextureTarget';
import $ from 'jquery';

$.when(
    $.get('shaders/default.vert'),
    $.get('shaders/fromTexture.frag'),
    $.get('shaders/toTexture.frag')    
).then(function(vertex, fromTextureFrag, toTextureFrag) {
    let glContext = document.getElementById('viewport').getContext('webgl');
    let renderer = new Renderer(glContext);

    // Setup programs
    let toTextureProgram = new Program(glContext);
    toTextureProgram.setVertexShader(vertex[0]);
    toTextureProgram.setFragmentShader(toTextureFrag[0]);

    let fromTextureProgram = new Program(glContext);
    fromTextureProgram.setVertexShader(vertex[0]);
    fromTextureProgram.setFragmentShader(fromTextureFrag[0]);

    // Setup geometry
    let geometry = new Geometry(glContext);
    let vertices = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];
    geometry.addAttribute('vertexPosition', new Float32Array(vertices), 2);
    renderer.setGeometry(geometry);

    // Setup render target
    let textureTarget = new TextureTarget(glContext, 512, 512);

    // Load texture
    let texture = glContext.createTexture();
    texture.ready = false;
    let img = new Image();
    img.onload = function() {
        let gl = glContext;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        texture.ready = true;
    }
    img.src = 'test.png';

    // Rendering loop
    let startTime = (new Date()).getTime() / 1000;
    function render() {
        if (!texture.ready) {
            window.requestAnimationFrame(render);
            return;
        }

        // toTextureProgram.setUniform('time', (new Date()).getTime() / 1000 - startTime);
        // fromTextureProgram.setUniform('time', (new Date()).getTime() / 1000 - startTime);

        // Render to texture
        renderer.setProgram(toTextureProgram);
        renderer.setTarget(textureTarget);
        renderer.render();

        // Render from texture
        fromTextureProgram.setUniform('texture', textureTarget.texture);
        renderer.setProgram(fromTextureProgram);
        renderer.setTarget(null);
        renderer.render();
    }
    render();

    window.renderer = renderer;
    window.geometry = geometry;
    window.textureTarget = textureTarget;
});
