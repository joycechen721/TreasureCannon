import {defs, tiny} from '../examples/common.js';
import Object from './Object.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cylindrical_Tube, Cube, Subdivision_Sphere, Triangle} = defs;

export default class Tree extends Object {
    constructor() {
        super();
        this.shapes = {
            trunk: new defs.Cylindrical_Tube(1, 10, [[0, 1], [0, 1]]),
            head: new Triangle(),
        };

        this.materials = {
            trunk: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#977946")}),
            head: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#097969")}),
        }
    }

    render(context, program_state, model_transform=Mat4.identity()) {
        model_transform = model_transform
        .times(Mat4.translation(-18, -7,-4.5))
        .times(Mat4.scale(2, 2, 2))
        .times(Mat4.rotation(Math.PI/2, 1, 0, 0))
        .times(Mat4.rotation(Math.PI/2, 0, 0, 1));

        this.shapes.head.draw(context, program_state, model_transform, this.materials.head);

        const num_triangles = 10;
        const angle_step = (2 * Math.PI) / num_triangles; 

        for (let i = 0; i < num_triangles; i++) {
            model_transform = model_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0));  // Rotate around the center
            this.shapes.head.draw(context, program_state, model_transform, this.materials.head);
        }

        model_transform = model_transform
        .times(Mat4.translation(-.8, 0, 0))
        .times(Mat4.scale(1, 1, 1));
        for (let i = 0; i < num_triangles; i++) {
            model_transform = model_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0));  // Rotate around the center
            this.shapes.head.draw(context, program_state, model_transform, this.materials.head);
        }

        model_transform = model_transform
        .times(Mat4.translation(-.8, 0, 0))
        .times(Mat4.scale(1.2, 1.2, 1.2));
        for (let i = 0; i < num_triangles; i++) {
            model_transform = model_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0));  // Rotate around the center
            this.shapes.head.draw(context, program_state, model_transform, this.materials.head);
        }

        model_transform =  model_transform
        .times(Mat4.scale(.2,.2,.2))
        .times(Mat4.rotation(Math.PI/2, 1, 0, 0))
        .times(Mat4.rotation(Math.PI/2, 0, 1, 0))
        .times(Mat4.translation(0, 0, -.5));

        this.shapes.trunk.draw(context, program_state, model_transform, this.materials.trunk);

        model_transform =  model_transform
        .times(Mat4.translation(0, 0, -.5));
        this.shapes.trunk.draw(context, program_state, model_transform, this.materials.trunk);
        model_transform =  model_transform
        .times(Mat4.translation(0, 0, -.5));
        this.shapes.trunk.draw(context, program_state, model_transform, this.materials.trunk);

        model_transform =  model_transform
        .times(Mat4.translation(0, 0, -.5));
        this.shapes.trunk.draw(context, program_state, model_transform, this.materials.trunk);

    }
}
