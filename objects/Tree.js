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
                {ambient: 1, color: hex_color("#094932")}),
        };
        
    }

    render(context, program_state, model_transform = Mat4.identity()) {
        // Calculate wind effect
        

        const t = program_state.animation_time / 1000; // Time in seconds
        const wind_frequency = .01; // Oscillations per second
        const wind_amplitude = 0.05; // Maximum rotation angle in radians
        const wind_effect = Math.sin(2 * Math.PI * wind_frequency * t) * wind_amplitude;

        const random_num = Math.random() * 2;

        const rotate_dir = random_num < 1 ? 1 : -1;
    

        // Transform for the trunk
        let trunk_transform = model_transform
            .times(Mat4.translation(-18, -8, -8))
            .times(Mat4.scale(.5, .5, .5))
            .times(Mat4.rotation(Math.PI / 2, 0, 0, 1))
         

        // Draw the trunk
        this.shapes.trunk.draw(context, program_state, trunk_transform, this.materials.trunk);
        trunk_transform = trunk_transform.times(Mat4.translation(0, 0, -0.5));
        this.shapes.trunk.draw(context, program_state, trunk_transform, this.materials.trunk);
        trunk_transform = trunk_transform.times(Mat4.translation(0, 0, -0.5));
        this.shapes.trunk.draw(context, program_state, trunk_transform, this.materials.trunk);
        trunk_transform = trunk_transform.times(Mat4.translation(0, 0, -0.5));
        this.shapes.trunk.draw(context, program_state, trunk_transform, this.materials.trunk);

        // Transform for the foliage
        let foliage_transform = trunk_transform
            // .times(Mat4.translation(-18, 0, -4.5))
            .times(Mat4.scale(3, 3, 3))
            .times(Mat4.rotation(-Math.PI / 2, 0, 1, 0))
            .times(Mat4.translation(2.23, 0, 0)) // Move foliage up so it's above the trunk
            .times(Mat4.rotation(rotate_dir*wind_effect, 1, 0, 0)); // Apply wind effect

        this.shapes.head.draw(context, program_state, foliage_transform, this.materials.head);

        const num_triangles = 10;
        const angle_step = (2 * Math.PI) / num_triangles;

        for (let i = 0; i < num_triangles; i++) {
            foliage_transform = foliage_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0)); // Rotate around the center
            this.shapes.head.draw(context, program_state, foliage_transform, this.materials.head);
        }

        foliage_transform = foliage_transform
            .times(Mat4.translation(-0.8, 0, 0))
            .times(Mat4.scale(1, 1, 1));
        for (let i = 0; i < num_triangles; i++) {
            foliage_transform = foliage_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0)); // Rotate around the center
            this.shapes.head.draw(context, program_state, foliage_transform, this.materials.head);
        }

        foliage_transform = foliage_transform
            .times(Mat4.translation(-0.8, 0, 0))
            .times(Mat4.scale(1.2, 1.2, 1.2));
        for (let i = 0; i < num_triangles; i++) {
            foliage_transform = foliage_transform
                .times(Mat4.rotation(angle_step, 1, 0, 0)); // Rotate around the center
            this.shapes.head.draw(context, program_state, foliage_transform, this.materials.head);
        }
    }
}
