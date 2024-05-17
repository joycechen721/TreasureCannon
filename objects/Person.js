import {defs, tiny} from '../examples/common.js';
import Object from './Object.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

const {Cube, Subdivision_Sphere} = defs;

export default class Person extends Object {
    constructor() {
        super();
        this.shapes = {
            basket: new defs.Cylindrical_Tube(1, 10, [[0, 2], [0, 1]]),
            head: new Subdivision_Sphere(5),
            body: new Cube(),
            leg: new Cube(),
        };

        this.materials = {
            basket: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#977946")}),
            head: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FFFFFF")}),
            body: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#E6B869")}),
            arm: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FFFFFF")}),
            leg: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#C2C592")}),
        }
    }

    render(context, program_state, model_transform=Mat4.identity(), move_amt=0) {
        const head_transform = model_transform
            .times(Mat4.scale(0.6, 0.6, 0.6)).times(Mat4.translation(move_amt, 4, -8))
        const basket_transform = head_transform
            .times(Mat4.translation(0, 0, 1.5))
        const basket_transform2 = basket_transform
            .times(Mat4.scale(1.2, 1.2, 0.5)).times(Mat4.translation(0, 0, 0.4))
        const body_transform = head_transform
            .times(Mat4.scale(0.8, 0.5, 1.2)).times(Mat4.translation(0, 0, -1.8))
        const rightarm_transform = body_transform
            .times(Mat4.scale(0.2, 1, 0.8)).times(Mat4.translation(-6, 0, 0.2))
        const leftarm_transform = body_transform
            .times(Mat4.scale(0.2, 1, 0.8)).times(Mat4.translation(6, 0, 0.2))
        const rightleg_transform = body_transform
            .times(Mat4.scale(0.4, 1, 0.8)).times(Mat4.translation(-1.5, 0, -2.2))
        const leftleg_transform = body_transform
            .times(Mat4.scale(0.4, 1, 0.8)).times(Mat4.translation(1.5, 0, -2.2))

        this.shapes.head.draw(context, program_state, head_transform, this.materials.head);
        this.shapes.basket.draw(context, program_state, basket_transform, this.materials.basket);
        this.shapes.basket.draw(context, program_state, basket_transform2, this.materials.basket);
        this.shapes.body.draw(context, program_state, body_transform, this.materials.body);
        this.shapes.leg.draw(context, program_state, rightarm_transform, this.materials.arm);
        this.shapes.leg.draw(context, program_state, leftarm_transform, this.materials.arm);
        this.shapes.leg.draw(context, program_state, rightleg_transform, this.materials.leg);
        this.shapes.leg.draw(context, program_state, leftleg_transform, this.materials.leg);
    }
}
