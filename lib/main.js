import glProgram from './glProgram';
import $ from 'jquery';

let glContext = document.getElementById('viewport').getContext('webgl');

let program = new glProgram(glContext);

$.when(
	$.get('shaders/vertex.glsl'),
	$.get('shaders/fragment.glsl')
).then(function (vertex, fragment) {
	program.setVertexShader(vertex[0]);
	program.setFragmentShader(fragment[0]);
	program.render();
});