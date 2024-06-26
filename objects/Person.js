import {defs, tiny} from '../examples/common.js';
import Object from './Object.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
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
            basket: new Material(new defs.Textured_Phong(),
                {ambient: .3, diffusivity: .6, texture: new Texture('../../assets/clothes.png')}),
            head: new Material(new defs.Phong_Shader(),
                {ambient: .8, diffusivity: .6, color: hex_color("#CC9C80")}),
            body: new Material(new defs.Textured_Phong(),
                {ambient: .5,  texture: new Texture('../../assets/clothes.png')}),
            arm: new Material(new defs.Phong_Shader(),
                {ambient: .8,diffusivity: .6, color: hex_color("#CC9C80")}),
            leg: new Material(new defs.Textured_Phong(),
                {ambient: .5,  texture: new Texture('../../assets/clothes.png')}),
        }
    }

    render(context, program_state, model_transform=Mat4.identity(), move_amt=0, left_move, right_move) {
      
        const t = program_state.animation_time / 1000; // Current time

        let rotation_angle = 0;
        let limb_rotation = 0;

        if (left_move || right_move){
            limb_rotation = 0 ; // this needs to be changed
        }

        if (left_move){
            rotation_angle = Math.PI/2;
        }
        else if (right_move){
            rotation_angle = -Math.PI/2;
        }

        const head_transform = model_transform
            .times(Mat4.scale(0.6, 0.6, 0.6)).times(Mat4.translation(move_amt, 4, -11))
            .times(Mat4.rotation(rotation_angle, 0, 0, 1))
        const basket_transform = head_transform
            .times(Mat4.translation(0, 0, 1.5))
        const basket_transform2 = basket_transform
            .times(Mat4.scale(1.2, 1.2, 0.5)).times(Mat4.translation(0, 0, 0.4))
        const body_transform = head_transform
            .times(Mat4.scale(0.8, 0.5, 1.2)).times(Mat4.translation(0, 0, -1.8))
        const rightarm_transform = body_transform
            .times(Mat4.scale(.4, .5, 0.8))
            .times(Mat4.rotation(limb_rotation, 1, 0, 0))
            .times(Mat4.translation(-3, 0, 0.2))
           
        const leftarm_transform = body_transform
            .times(Mat4.scale(.4, .5, 0.8))
            .times(Mat4.rotation(limb_rotation, 1, 0, 0))
            .times(Mat4.translation(3, 0, 0.2))
          
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

        return head_transform;

    }
}
