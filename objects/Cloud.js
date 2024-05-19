import {defs, tiny} from '../examples/common.js';
import Object from './Object.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Subdivision_Sphere} = defs;

export default class Cloud extends Object {
    constructor() {
        super();

        this.shapes = {
            cloud_particle: new Subdivision_Sphere(5),
        };

        this.materials = {
            cloud_particle: new Material(new defs.Phong_Shader(),
                {ambient: .8, diffusivity: 0.5, color: hex_color("#FFFFFF")}),
        };
        }


    render(context, program_state, model_transform = Mat4.identity()) {

        //bottom
        model_transform = model_transform.times(Mat4.scale(.6, .7, .7))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1.4, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1.4, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);


        //up
        model_transform = model_transform.times(Mat4.translation(0, 0, 1.8))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);

        model_transform = model_transform.times(Mat4.translation(-1.3, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(-1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(-1.3, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(-1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);

        // front
        model_transform = model_transform.times(Mat4.translation(0, .2, -1))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(1, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(.4, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);
        model_transform = model_transform.times(Mat4.translation(-6.4, 0, 0))
        this.shapes.cloud_particle.draw(context, program_state, model_transform, this.materials.cloud_particle);


    }
}
