import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export default class Object {
    constructor(model_transform=Mat4.identity()) {
        this.shapes = {};
        this.materials = {};
    }

    render(context, program_state) {
    }
}
