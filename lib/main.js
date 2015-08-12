import glProgram from './glProgram';
import $ from 'jquery';

$.when(
    $.get('shaders/vertex.glsl'),
    $.get('shaders/fragment.glsl')
).then(function(vertex, fragment) {
    let glContext = document.getElementById('viewport').getContext('webgl');
    let program = new glProgram(glContext);

    program.setVertexShader(vertex[0]);
    program.setFragmentShader(fragment[0]);

    program.render();

    // TODO: implement glGeometry and glRenderer
    // let geometry = glGeometry.basicQuad();

    // let renderer = new glRenderer(glContext);

    // renderer.render(geometry, program);
});
