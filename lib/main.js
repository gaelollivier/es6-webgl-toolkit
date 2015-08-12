import Program from './gl/Program';
import Geometry from './gl/Geometry';
import Renderer from './gl/Renderer';
import $ from 'jquery';

$.when(
    $.get('shaders/vertex.glsl', {'_': $.now()}), // Add timestamp to prevent caching
    $.get('shaders/fragment.glsl', {'_': $.now()})
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

    let colors = [
         1.0,  0.0, 0.0,
         0.0,  1.0, 0.0,
         0.0,  0.0, 1.0,
         1.0,  1.0, 1.0
    ];

    geometry.addAttribute('vertexPosition', new Float32Array(vertices), 2);
    geometry.addAttribute('vertexColor', new Float32Array(colors), 3);

    renderer.setGeometry(geometry);
    renderer.setProgram(program);

    renderer.render();
});
