import Program from './gl/Program';
import Geometry from './gl/Geometry';
import Renderer from './gl/Renderer';
import TextureTarget from './gl/TextureTarget';
import $ from 'jquery';

$.when(
    $.get('shaders/default.frag'),
    $.get('shaders/toTexture.frag'),
    $.get('shaders/fromTexture.frag')
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

    // Rendering loop
    let startTime = (new Date()).getTime() / 1000;
    function render() {
        //window.requestAnimationFrame(render);

        toTextureProgram.setUniform('time', (new Date()).getTime() / 1000 - startTime);
        fromTextureProgram.setUniform('time', (new Date()).getTime() / 1000 - startTime);

        // Render to texture
        renderer.setProgram(toTextureProgram);
        renderer.setTarget(textureTarget);
        renderer.render();

        // Render from texture
        toTextureProgram.setUniform('texture', textureTarget.texture);
        renderer.setProgram(toTextureProgram);
        renderer.setTarget(null);
        renderer.render();
    }
    render();

    window.renderer = renderer;
    window.geometry = geometry;
    window.textureTarget = textureTarget;
});
