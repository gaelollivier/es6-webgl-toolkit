import Program from './gl/Program';
import Geometry from './gl/Geometry';
import Renderer from './gl/Renderer';
import $ from 'jquery';

$.when(
    $.get('shaders/vertex.glsl'),
    $.get('shaders/fragment.glsl')
).then(function(vertex, fragment) {
    let glContext = document.getElementById('viewport').getContext('webgl');

    let geometry = new Geometry(glContext);
    let program = new Program(glContext);
    let renderer = new Renderer(glContext);

    program.setVertexShader(vertex[0]);
    program.setFragmentShader(fragment[0]);

    let vertices = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];

    geometry.addAttribute('vertexPosition', new Float32Array(vertices), 2);

    renderer.setGeometry(geometry);
    renderer.setProgram(program);

    let startTime = (new Date()).getTime() / 1000;
    function render() {
        window.requestAnimationFrame(render);

        program.setUniform('time', (new Date()).getTime() / 1000 - startTime);
        renderer.render();
    }
    render();
});
