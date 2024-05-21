import {defs, tiny} from '../examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;


const COLORS = {
    black: hex_color("#000000"),
    white: hex_color("#ffffff"),
    blue: hex_color("#00FFFF"),
    yellow: hex_color("#FFFF8F"),
    green: hex_color("#50C878"),
  };

export default class Projectile {
    constructor(type, initial_position, initial_velocity, theta, launch_time) {
        this.type = type;
        this.position = initial_position;
        this.initial_velocity = initial_velocity;
        this.theta = theta;
        this.launch_time = launch_time;
        this.gravity = -9.81;
        this.v_x = 0; 
        this.v_y = 0; 
        this.dx = 0; 
        this.dy = 0; 

        this.shapes = {
            pizza: new defs.Triangle(),
            apple: new defs.Subdivision_Sphere(5),
            apple_stem: new defs.Cylindrical_Tube(1, 10, [[0, 2], [0, 1]]),
            bomb: new defs.Subdivision_Sphere(5),
        }
        
        this.materials = {
            apple_texture: new Material ( new defs.Phong_Shader(), {ambient: 1, color: hex_color("#992828")}),
            apple_stem_texture: new Material ( new defs.Phong_Shader(), {ambient: .9, diffusivity: .8, color: COLORS.green}),
            pizza_texture: new Material ( new defs.Phong_Shader(), {ambient: .9, color: COLORS.yellow}),
            test2: new Material(new defs.Phong_Shader(),
            {ambient: 1, diffusivity: 1, color: hex_color("#992828")}),
        }
    }

    draw_apple(context, program_state){
        let model_transform = Mat4.identity(); 
        let apple_transform = model_transform
            .times(Mat4.translation(10.5 - this.dx, 3, 4.5 + this.dy))
            .times(Mat4.scale(.5, .5, .5));
        this.shapes.apple.draw(
            context,
            program_state,
            apple_transform,
            this.materials.apple_texture,
        );
    }

    draw_apple_or_bomb(context, program_state, is_bomb){
        // if (!this.apple_exists) return;

        const t = program_state.animation_time / 1000
        let apple_transform = Mat4.identity()

        if (!is_bomb){
        apple_transform = apple_transform
            .times(Mat4.translation(0,2.5,Math.sin(t*3) * 5))
            .times(Mat4.scale(.5, .5, .5))
            .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
            .times(Mat4.translation(-this.v_x, 0, this.v_y));
        // Scale appropriately to cover the screen
        }
        else {
            apple_transform = apple_transform
                .times(Mat4.translation(-5,2.5,this.bomb_z_position + Math.sin(t*3) * 5))
                .times(Mat4.scale(.5, .5, .5))
                .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
                .times(Mat4.translation(-this.v_x, 0, this.v_y));
        }

        if (!is_bomb){
            this.shapes.apple.draw(
                context,
                program_state,
                apple_transform,
                this.materials.apple_texture,
            );
            this.apple_transform = apple_transform;
        } else {
            this.shapes.bomb.draw(
                context,
                program_state,
                apple_transform,
                this.materials.apple_texture.override({ color: hex_color("#000000") }),
                );
        }

        let apple_stem_transform = Mat4.identity()
        apple_stem_transform =apple_transform
            .times(Mat4.translation(0,1,0))
            .times(Mat4.scale(.2, .8, .1))
            .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
            .times(Mat4.translation(-this.v_x, 0, this.v_y));

        if (!is_bomb){

        this.shapes.apple_stem.draw(
            context,
            program_state,
            apple_stem_transform,
            this.materials.apple_stem_texture,
            );

        }else {
            this.shapes.apple_stem.draw(
                context,
                program_state,
                apple_stem_transform,
                this.materials.apple_stem_texture.override({ color: COLORS.yellow }),
                );
        }

    
    }

    draw_pizza(context, program_state){
        let pizza_transform = Mat4.identity()
        pizza_transform = pizza_transform
            .times(Mat4.translation(0,2,-2))
            .times(Mat4.scale(1.3, 1.3, 2.8))
            .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
            .times(Mat4.rotation((Math.PI) / 4, 0, 0, 1));
        // Scale appropriately to cover the screen
        
        this.shapes.pizza.draw(
            context,
            program_state,
            pizza_transform,
            this.materials.pizza_texture
        );

        let crust_transform = pizza_transform;
        crust_transform = crust_transform 
            .times(Mat4.rotation(Math.PI/4, 0, 0, 1))
            .times(Mat4.translation(.7, 0, -.01))
            .times(Mat4.scale(.2, 1, .2))
            .times(Mat4.scale(.3, .7, .2));
        this.shapes.square.draw(
            context,
            program_state,
            crust_transform,
            this.materials.pizza_texture.override({ color: hex_color("#7B3F00")})
            );
        let topping_transform = pizza_transform;
        topping_transform = topping_transform
            .times(Mat4.scale(.2, .2, .2))
            .times(Mat4.scale(.5, .5, .5))
            .times(Mat4.translation(1.8, 2, 0));
        this.shapes.cylinder.draw(
            context,
            program_state,
            topping_transform,
            this.materials.test2,
        );
        this.shapes.cylinder.draw(
            context,
            program_state,
            topping_transform.times((Mat4.translation(4, -.3, 0))),
            this.materials.test2,
        );
        this.shapes.cylinder.draw(
            context,
            program_state,
            topping_transform.times((Mat4.translation(0, 4, 0))),
            this.materials.test2,
        );
    }

    update(current_time) {
        let t = current_time - this.launch_time
        let v_x = this.initial_velocity * Math.cos(this.theta);
        let v_y = this.initial_velocity * Math.sin(this.theta);

        this.dx = v_x * t; // x(t) = x0 + v0x * t
        this.dy = v_y * t + 0.5 * this.gravity * t * t; // y(t) = y0 + v0y * t - (1/2) * g * t^2
    }

    render(context, program_state) {
        if (this.type == "apple"){
            this.draw_apple(context, program_state); 
        }
        else if (this.type == "bomb"){
            this.draw_apple_or_bomb(context, program_state, true); 
        }
        else if(this.type == "pizza"){
            this.draw_pizza(context, program_state); 
        }
    }

}
