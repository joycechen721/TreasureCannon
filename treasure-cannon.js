import {defs, tiny} from './examples/common.js';
import Person from './objects/Person.js';
import Cloud from  './objects/Cloud.js';
import Tree from  './objects/Tree.js';
import StartScreen from './objects/StartScreen.js';
import Projectile from './objects/Projectile.js';
import { Text_Line } from '../examples/text-demo.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const COLORS = {
    black: hex_color("#000000"),
    white: hex_color("#ffffff"),
    blue: hex_color("#00FFFF"),
    yellow: hex_color("#FFFF8F"),
    green: hex_color("#50C878"),
  };

const PATHS = {
    brick_wall: "assets/brick-wall.jpeg",
    sand1: "assets/sand1.png",
    sky: "assets/sky.png",
    nightsky: "assets/night_sky.jpg",
    snow: "assets/snow.jpg"
};

//change what each item is worth here 
const ITEM_POINTS = {
    apple: 3, 
    bomb: -8, 
    pizza: 5, 
    coin: 5,
}; 

const bgm1 = new Audio("assets/bgm1.mp3");
const success = new Audio("assets/success.mp3");
const error = new Audio("assets/error.mp3");
let audio = bgm1;
audio.play().catch((e) => console.log(e));
  
  
const OBJECT_PROBABILITIES = {
    apple: 0.3,  
    bomb: 0.5,   
    pizza: 0.15,
    coin: 0.15,   
};

const selectObject = (probabilities) => {
    const rnd = Math.random();
    let cumulative = 0;
    for (let key in probabilities) {
        cumulative += probabilities[key];
        if (rnd < cumulative) {
            return key;
        }
    }
    return null; // Fallback, should not happen if probabilities are normalized correctly
};

export class TreasureCannon extends Scene {
    constructor() {
        super();

        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            tower_body: new defs.Capped_Cylinder(1, 6), 
            tower_head: new defs.Cube(), 
            tower_cone: new defs.Rounded_Closed_Cone(2, 8), 
            cannon_body: new defs.Capped_Cylinder(1, 20), 
            square: new defs.Square(),
            wall1: new defs.Square(),
            wall2: new defs.Square(),
            wall1_night: new defs.Square(),
            wall2_night: new defs.Square(),
            ground: new defs.Square(),
            ground_night: new defs.Square(),
            pizza: new defs.Triangle(),
            apple: new defs.Subdivision_Sphere(5),
            apple_stem: new defs.Cylindrical_Tube(1, 10, [[0, 2], [0, 1]]),
            bomb: new defs.Subdivision_Sphere(5),
            person: new Person(),
            side_walls: new defs.Square(),
            side_walls_night: new defs.Square(),
            cloud: new Cloud(),
            tree: new Tree(),
            start_screen: new StartScreen(),
            cylinder: new defs.Capped_Cylinder(20, 20, [[0, 1], [0, 1]]),
            text: new Text_Line(100),
            projectile1: new Projectile(),
            projectile2: new Projectile(),
            projectile3: new Projectile(),
            projectile4: new Projectile(),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#992828")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: 1, diffusivity: 1, color: hex_color("#992828")}),
            tower_body: new Material(new defs.Textured_Phong(),
                {ambient: .5, diffusivity: 1, color: hex_color("#73736B"), texture: new Texture(PATHS.brick_wall)}),
            tower_head: new Material(new defs.Textured_Phong(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828"), texture: new Texture(PATHS.brick_wall)}),
            tower_cone: new Material(new defs.Textured_Phong(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828"), texture: new Texture(PATHS.brick_wall)}),
            cannon: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FFFFFF")}),            
            
            wall_texture: new Material(new defs.Textured_Phong(), {
                ambient: 1, texture: new Texture(PATHS.sky),
            }),
            wall_night_texture: new Material(new defs.Textured_Phong(), {
                ambient: .5, texture: new Texture(PATHS.nightsky),
            }),
            side_wall_texture: new Material(new defs.Textured_Phong(), {
                ambient: 1, texture: new Texture(PATHS.sky)}),
            side_wall_night_texture: new Material(new defs.Textured_Phong(), {
                ambient: .5, texture: new Texture(PATHS.nightsky)}),
            ground_texture: new Material( new defs.Textured_Phong(), {
                ambient: 1, texture: new Texture(PATHS.sand1),
            }),
            ground_night_texture: new Material( new defs.Textured_Phong(), {
                ambient: 1, texture: new Texture(PATHS.snow),
            }),
            ground_night_texture: new Material( new defs.Textured_Phong(), {
                ambient: 1, texture: new Texture(PATHS.snow),
            }),
            apple_texture: new Material ( new defs.Phong_Shader(), {ambient: 1, color: hex_color("#992828")}),
            apple_stem_texture: new Material ( new defs.Phong_Shader(), {ambient: .9, diffusivity: .8, color: COLORS.green}),
            pizza_texture: new Material ( new defs.Phong_Shader(), {ambient: .9, color: COLORS.yellow}),
            text: new Material(new defs.Textured_Phong(), {ambient: 1, color: hex_color("#000000"), texture: new Texture('../assets/text.png')}),
            coin: new Material (new defs.Phong_Shader(), {ambient: 1, color: COLORS.yellow}),
            text2: new Material(new defs.Textured_Phong(), {ambient: 1, color: hex_color("#000000"), texture: new Texture('../assets/text2.png')}),
            
        }

        this.person_move = 0;
        this.person_left = false;
        this.person_right = false;
        this.person_last_move = 0;

        this.start_game = false;
        this.projectiles = []; 
        this.time_interval_between_projectiles = 1; 
        this.last_shot_time = 0; 
        this.points = 0; 
        this.play_music = true;
        this.night_bg = false;
        this.time_interval_between_projectiles = [0, 3, 2.25, 1.5, 1, 0.65]; 
        this.last_shot_time = 0; 
        this.points = 0; 
        this.level = 1; 
        this.point_thresholds = [0, 10, 15, 20, 25];
        this.gravitational_acceleration = [0, -9.81, -11.31, -13.81, -15.31, -16.81]; 
        this.level_up = false; 
        this.time_of_level_up = 0; 
        this.initial_camera_location = Mat4.look_at(vec3(0, 30, 0), vec3(0, 0, 0), vec3(0, 0, 1));
        this.attach_camera_to_person = false;
        this.attach_camera_to_cannon = false;
       
    }


    draw_tower_prongs(context, program_state, model_transform) {
        for (let i = -2; i < 3; i += 2) {
            for (let j = -2; j < 3; j += 2) {
                if (i !== 0 || j !== 0) {
                    let model_transform_tower_thingy = model_transform
                        .times(Mat4.translation(i, j, 6))
                        .times(Mat4.scale(0.5, 0.5, 1.3));
                    this.shapes.tower_head.draw(context, program_state, model_transform_tower_thingy, this.materials.tower_head);
                }
            }
        }
    }

    draw_tower_cones(context, program_state, model_transform){
        for (let i = -2; i < 3; i += 2) {
            for (let j = -2; j < 3; j += 2) {
                if (i !== 0 && j !== 0) {
                    let model_transform_tower_cone = model_transform
                        .times(Mat4.translation(i, j, 8))
                        .times(Mat4.scale(1, 1, 0.7)); 
                    this.shapes.tower_cone.draw(context, program_state, model_transform_tower_cone, this.materials.tower_cone);
                }
            }
        }
        // Draws background
    }

    draw_background(context, program_state) {
        this.night_bg = false
        // WALL
        let wall_transform = Mat4.identity()
        wall_transform = wall_transform
        .times(Mat4.translation(0,-10,5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0))
       ;
        // Scale appropriately to cover the screen
        
        this.shapes.wall2.draw(
        context,
        program_state,
        wall_transform,
        this.materials.wall_texture
        );

        // GROUND
        let ground_transform = Mat4.identity();
        ground_transform = ground_transform
        .times(Mat4.translation(0, 0, -9))
        .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
      
        .times(Mat4.scale(20, 0, 30))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0));
        this.shapes.ground.draw(
            context,
            program_state,
            ground_transform,
            this.materials.ground_texture
        );

        // right
        let side_transform = Mat4.identity();

        let right_side_transform = side_transform
        .times(Mat4.translation(-20,0, 5))
        .times(Mat4.scale(20, 40, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls.draw(
        context,
        program_state,
        right_side_transform,
        this.materials.side_wall_texture
        );

        // left
        let left_side_transform = side_transform
        .times(Mat4.translation(20,0, 5))
        .times(Mat4.scale(20, 40, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls.draw(
        context,
        program_state,
        left_side_transform,
        this.materials.side_wall_texture
        ); 

        // top
        let top_transform = left_side_transform
        .times(Mat4.translation(1,0, 1))
        .times(Mat4.rotation((Math.PI/2), 0, 1, 0))
        

        this.shapes.side_walls.draw(
            context,
            program_state,
            top_transform,
            this.materials.side_wall_texture
        ); 

    }

    draw_night_background(context, program_state) {
        this.night_bg = true
        // WALL
        let wall_transform = Mat4.identity()
        wall_transform = wall_transform
        .times(Mat4.translation(0,-10,5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0))
       ;
        // Scale appropriately to cover the screen
        
        this.shapes.wall2_night.draw(
        context,
        program_state,
        wall_transform,
        this.materials.wall_night_texture
        );

        // GROUND
        let ground_transform = Mat4.identity();
        ground_transform = ground_transform
        .times(Mat4.translation(0, -2, -9))
        .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
      
        .times(Mat4.scale(20, 1, 10))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0));
        this.shapes.ground_night.draw(
            context,
            program_state,
            ground_transform,
            this.materials.ground_night_texture
        );

        // right
        let side_transform = Mat4.identity();

        let right_side_transform = side_transform
        .times(Mat4.translation(-20,0, 5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls_night.draw(
        context,
        program_state,
        right_side_transform,
        this.materials.side_wall_night_texture
        );

        // left
        let left_side_transform = side_transform
        .times(Mat4.translation(20,0, 5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls_night.draw(
        context,
        program_state,
        left_side_transform,
        this.materials.side_wall_night_texture
        ); 
    }

    draw_night_background(context, program_state) {
        this.night_bg = true
        // WALL
        let wall_transform = Mat4.identity()
        wall_transform = wall_transform
        .times(Mat4.translation(0,-10,5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0))
       ;
        // Scale appropriately to cover the screen
        
        this.shapes.wall2_night.draw(
        context,
        program_state,
        wall_transform,
        this.materials.wall_night_texture
        );

        // GROUND
        let ground_transform = Mat4.identity();
        ground_transform = ground_transform
        .times(Mat4.translation(0, -2, -9))
        .times(Mat4.rotation((Math.PI) / 2, 1, 0, 0))
      
        .times(Mat4.scale(20, 1, 10))
        .times(Mat4.rotation((3 * Math.PI) / 2, 1, 0, 0));
        this.shapes.ground_night.draw(
            context,
            program_state,
            ground_transform,
            this.materials.ground_night_texture
        );

        // right
        let side_transform = Mat4.identity();

        let right_side_transform = side_transform
        .times(Mat4.translation(-20,0, 5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls_night.draw(
        context,
        program_state,
        right_side_transform,
        this.materials.side_wall_night_texture
        );

        // left
        let left_side_transform = side_transform
        .times(Mat4.translation(20,0, 5))
        .times(Mat4.scale(20, 20, 20))
        .times(Mat4.rotation((3 * Math.PI) / 2, 0, 1, 0));
        this.shapes.side_walls_night.draw(
        context,
        program_state,
        left_side_transform,
        this.materials.side_wall_night_texture
        ); 
    }

    draw_clouds_and_trees (context, program_state, t){
        let model_transform = Mat4.identity();
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(-8-Math.sin(t/6) * 6,3,10).times(Mat4.scale(1.5, 0.5, .5))));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(4+Math.sin(t/6) * 6,6,8)).times(Mat4.scale(1.5, 0.5, .5)));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(-Math.sin(t/6) * 8,4,7)).times(Mat4.scale(1, 0.5, .5)));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(-4+ Math.sin(t/6) * 6,5,6)).times(Mat4.scale(1.4, 0.5, .4)));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(2 -Math.sin(t/6) * 6,8,10)).times(Mat4.scale(1, 0.3, .4)));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(-7+ Math.sin(t/6) * 6,4,9)).times(Mat4.scale(1, 0.3, .3)));
        this.shapes.cloud.render(context, program_state, model_transform.times(Mat4.translation(4- Math.sin(t/6) * 6,5,8)).times(Mat4.scale(1, 0.4, .2)));

        let tree_transform = model_transform;
        this.shapes.tree.render(context, program_state, tree_transform);
        for (let i = 0; i < 5; i+=1) {
            tree_transform = tree_transform
                .times(Mat4.translation(7, 0, 0));  
            this.shapes.tree.render(context, program_state, tree_transform);
        }
        tree_transform = tree_transform.times(Mat4.translation(-3,4,0));

        this.shapes.tree.render(context, program_state, tree_transform);
        for (let i = 0; i < 4; i+=1) {
            tree_transform = tree_transform
                .times(Mat4.translation(-7, 0, 0)); 
            this.shapes.tree.render(context, program_state, tree_transform);
        }

        tree_transform = tree_transform.times(Mat4.translation(-2, -3, 0));
        for (let i = 0; i < 2; i+=1) {
            tree_transform = tree_transform
                .times(Mat4.translation(0, 6, 0)); 
            this.shapes.tree.render(context, program_state, tree_transform);
        }

        tree_transform = tree_transform.times(Mat4.translation(32, -12, 0));
        for (let i = 0; i < 2; i+=1) {
            tree_transform = tree_transform
                .times(Mat4.translation(0, 6, 0)); 
            this.shapes.tree.render(context, program_state, tree_transform);
        }
    }

    shoot_object(t, theta, initial_position){
        //random number from 4 to 9; will probably change range later 
        let initial_velocity = Math.floor(Math.random() * 9) + 4; 
        let launch_angle = theta; 
        //current time
        let launch_time = t; 


        let seen_types = [];

for (let i = this.projectiles.length - 1; i >= 0; i--) {
    let proj = this.projectiles[i];
    seen_types.push(proj.projectile_type);
    console.log("projectile_type", proj.projectile_type);
}

let projectile;
let proj_type;

if (!seen_types.includes(1)) {
    projectile = this.shapes.projectile1;
    proj_type = 1;
} else if (!seen_types.includes(2)) {
    projectile = this.shapes.projectile2;
    proj_type = 2;
} else if (!seen_types.includes(3)) {
    projectile = this.shapes.projectile3;
    proj_type = 3;
} else if (!seen_types.includes(4)) {
    projectile = this.shapes.projectile4;
    proj_type = 4;
}

// Now you have the projectile shape assigned based on availability of types
// You can use the 'projectile' variable as needed

        
        //selects object to fire according to specified probability for each object
        const objectType = selectObject(OBJECT_PROBABILITIES);
        projectile = projectile.initialize(objectType, initial_position, initial_velocity, launch_angle, launch_time, proj_type, this.gravitational_acceleration[this.level]);
        this.projectiles.push(projectile);
        
    }

    check_collision(bounding_box1, bounding_box2) {
        const collision = !(bounding_box1.max[0] < bounding_box2.min[0] || bounding_box1.min[0] > bounding_box2.max[0] ||
            bounding_box1.max[1] < bounding_box2.min[1] || bounding_box1.min[1] > bounding_box2.max[1] ||
            bounding_box1.max[2] < bounding_box2.min[2] || bounding_box1.min[2] > bounding_box2.max[2]);
        if (collision) {
            console.log("Collision detected");
        }
        return collision;
    }

    make_control_panel() {
        this.key_triggered_button("Start/Stop Game", ["t"], () =>
            {
                if (this.start_game){
                    this.start_game = false
                   
                }
                else {
                    this.start_game = true
                    audio.pause();
                    audio = bgm1;
                    if (this.play_music === true) {
                        audio.volume = 0.5;
                        audio.play().catch((e) => console.log(e));
                    }
                }  
            }
          );

        this.key_triggered_button("Move left", ["ArrowLeft"], () => {
            if(this.person_move <= 14){
            this.person_move += 2;
            }
            ; this.person_left = true})
        this.key_triggered_button("Move right", ["ArrowRight"], () => {
            if(this.person_move >= -30){
                this.person_move -= 2;
                } 
                this.person_right = true;})
        // this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        this.new_line();
        this.key_triggered_button("First Person POV", ["5"], () => {
            this.attach_camera_to_person = !this.attach_camera_to_person;
            if(this.attach_camera_to_cannon){
                this.attach_camera_to_cannon = false;
            }
        });
        this.key_triggered_button("Cannon POV", ["6"], () => {
            this.attach_camera_to_cannon = !this.attach_camera_to_cannon;
            if(this.attach_camera_to_person){
                this.attach_camera_to_person = false;
            }});
                  
        this.key_triggered_button("View game", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        this.new_line();
    
        this.key_triggered_button("Change background", ["c"], () => {
            this.night_bg = !this.night_bg
        })
        this.new_line();
        this.key_triggered_button("Toggle music", ["Control", "m"], () => {
            audio.pause();
            this.play_music = !this.play_music;
            if (this.play_music) {
                audio.play().catch((e) => console.log(e));
            }
        });
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            if (this.start_game) {
                this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            }
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        // TODO: Create Planets (Requirement 1)
        // this.shapes.[XXX].draw([XXX]) // <--example

        // TODO: Lighting (Requirement 2)
        // The parameters of the Light are: position, color, size

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 3 and 4)
        const t = program_state.animation_time / 1000
        let model_transform = Mat4.identity();
        let tower_transform = model_transform.times(Mat4.translation(12, 3, -3))
        let model_transform_tower_body = tower_transform.times(Mat4.scale(2.3, 2.3, 11.9));

        const light_position = vec4(0, 10, 20, 1);
      
        program_state.lights = [new Light(light_position, color(1,1,1,1), 100)];
        this.shapes.tower_body.draw(context, program_state, model_transform_tower_body, this.materials.tower_body);

        let model_transform_tower_head = tower_transform
            .times(Mat4.translation(0, 0, 5))
            .times(Mat4.scale(2.5, 2.5, 1)); 
        this.shapes.tower_head.draw(context, program_state, model_transform_tower_head, this.materials.tower_head);
        
        this.draw_tower_prongs(context, program_state, tower_transform); 
        this.draw_tower_cones(context, program_state, tower_transform); 

        let model_transform_cannon_base = tower_transform
            .times(Mat4.translation(0, 0, 7)); 
        this.shapes.sphere.draw(context, program_state, model_transform_cannon_base, this.materials.cannon);

        var max_angle = 0.3 * Math.PI;
        var theta = max_angle / 2 + (max_angle / 2) * Math.sin((Math.PI * t));
        
        //initial cannon position
        let model_transform_cannon_body = tower_transform
            .times(Mat4.translation(-1.5, 0, 7.5)) 
            .times(Mat4.rotation(-Math.PI / 2.5, 0, 1, 0)) 
            .times(Mat4.scale(0.6, 0.6, 4))

        //rotating the cannon body 
        if(this.start_game){    
            model_transform_cannon_body = model_transform_cannon_body
                .times(Mat4.scale(1/0.6, 1/0.6, 1/4.0))
                .times(Mat4.translation(0, 0, -1.5)) 
                .times(Mat4.rotation(theta, 0, 1, 0)) 
                .times(Mat4.translation(0, 0, 1.5))
                .times(Mat4.scale(0.6, 0.6, 4)); 
        }
        
        this.shapes.cannon_body.draw(context, program_state, model_transform_cannon_body, this.materials.cannon);


        //calculating the initial position of the projectile (since we want it to be at the end of the cannon body)
        let initial_position_transform = model_transform_cannon_body
            .times(Mat4.scale(1/0.6, 1/0.6, 1/4))
            .times(Mat4.translation(0, 0, 2))
            .times(Mat4.scale(0.6, 0.6, 4)); 

        let initial_position = vec4(initial_position_transform[0][3], initial_position_transform[1][3], initial_position_transform[2][3], 1);

        if (this.night_bg) {
            console.log("K:FJS:")
            this.draw_night_background(context, program_state)
        } else {
            this.draw_background(context, program_state);
        }
        program_state.lights = [new Light(light_position, color(1,1,1,1), 1000)];

        let person_transform = model_transform.times(Mat4.translation(0, 1, 1))
            .times(Mat4.scale(0.6, 0.6, 0.6))
            .times(Mat4.translation(this.person_move, 4, -8))
            .times(Mat4.translation(0, 0, 1.5))
            .times(Mat4.scale(1.2, 1.2, 0.5)).times(Mat4.translation(0, 0, 0.4));
        
        if (this.person_last_move != 0 && t-this.person_last_move > 1){
            this.person_last_move = 0;
            this.person_left = false;
            this.person_right = false;
        }
        if (this.person_last_move == 0 && (this.person_left || this.person_right)){
            this.person_last_move = t;
        }

        this.shapes.person.render(context, program_state, model_transform.times(Mat4.translation(0, 0.5, 1)), this.person_move, this.person_left, this.person_right);

        // CAMERA ANGLE
       // Calculate the person's position
       let basket_transform = person_transform.times(Mat4.translation(0,0, -4));
        let person_position = vec3(basket_transform[0][3], basket_transform[1][3], basket_transform[2][3]);

        // Calculate the cannon's position
        let cannon_position = vec3(tower_transform[0][3], tower_transform[1][3], tower_transform[2][3] + 17 );

        // Set the camera to follow the person and look at the cannon with a 90-degree right rotation
        let first_person_POV = Mat4.look_at(
            person_position, // Position adjusted for 90 degrees right rotation
            cannon_position,                      // Look at the cannon
            vec3(0, 0, 1)                         // Up direction adjusted for 90 degrees right rotation
        );

        let cannon_POV = Mat4.look_at(
            cannon_position.plus(vec3(0,0,-2)),                      // Look at the cannon
            person_position, // Position adjusted for 90 degrees right rotation
            vec3(-1, 0, 0)                         // Up direction adjusted for 90 degrees right rotation
        );

        if(this.start_game){
        if (this.attach_camera_to_person){
            program_state.set_camera(first_person_POV);
        }
        else if (this.attach_camera_to_cannon){
            program_state.set_camera(cannon_POV);
        }
        else {
            program_state.set_camera(this.initial_camera_location);
        }
    }

        this.draw_clouds_and_trees (context, program_state, t);
    

        if(this.start_game && (t - this.last_shot_time) >= this.time_interval_between_projectiles[this.level]){
            this.shoot_object(t, theta, initial_position); 
            this.last_shot_time = t; 
        }

        if (!this.start_game){
            this.shapes.start_screen.render(context, program_state, model_transform);
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            // console.log("length",this.projectiles.length);
            let projectile = this.projectiles[i];
            console.log("projectile",projectile);
            let { x, z } = projectile.update(t);
            let projectile_time = projectile.launch_time;
            //checking if projectile is out of camera view 
            if(x < -20 || z < -9){
                 this.projectiles.splice(i, 1);
            
            } 
            else {
          
                let projectile_transform = projectile.render(context, program_state);
                
                //checking collision between player and items
                if (this.check_collision(
                    {
                        min: vec3(person_transform[0][3] - 0.5, person_transform[1][3] - 0.5, person_transform[2][3] - 0.5),
                        max: vec3(person_transform[0][3] + 0.5, person_transform[1][3] + 0.5, person_transform[2][3] + 0.5)
                    },
                    {
                        min: vec3(projectile_transform[0][3] - .5, projectile_transform[1][3] - .5, projectile_transform[2][3] - .5),
                        max: vec3(projectile_transform[0][3] + .5, projectile_transform[1][3] + .5, projectile_transform[2][3] + .5)
                    }
                ))  {
                    if(projectile.type == "apple"){
                        let audio = success;
                        audio.play().catch((e) => console.log(e));
                        this.points += ITEM_POINTS.apple;
                    }
                    else if(projectile.type == "bomb"){
                        let audio = error;
                        audio.play().catch((e) => console.log(e));
                        this.points += ITEM_POINTS.bomb
                    }
                    else if(projectile.type == "pizza"){
                        let audio = success;
                        audio.play().catch((e) => console.log(e));
                        this.points += ITEM_POINTS.pizza
                    }
                    else if(projectile.type == "coin"){
                        this.points += ITEM_POINTS.coin
                        let audio = success;
                        audio.play().catch((e) => console.log(e));
                    }
                    this.projectiles.splice(i, 1);
                    }
            
            }
        }

        if(this.start_game){
            let points_text = "Points: " + this.points; 
            this.shapes.text.set_string(points_text, context.context);
            let points_matrix = model_transform
                .times(Mat4.translation(13, 10.1, 7))
                .times(Mat4.scale(0.3, 0.2, 0.3))
                .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
                .times(Mat4.rotation(Math.PI, 0, 1, 0))
            this.shapes.text.draw(context, program_state, points_matrix, this.materials.text);
        }

        if(this.level <= 4 && this.points >= this.point_thresholds[this.level]){
            this.level++; 
            this.time_of_level_up = t;  
        }
        
        if(this.time_of_level_up != 0 && t - this.time_of_level_up <= 2.0){
            let level_up_text;
            const flash_period = 0.25; // seconds
            const current_material = (Math.floor(t / flash_period) % 2) === 0 ? this.materials.text : this.materials.text2;
            let level_up_text_matrix;
            if(this.level < 5){
                level_up_text = "LEVEL UP!";
                level_up_text_matrix = model_transform
                    .times(Mat4.translation(6, 10.1, 6.5))
                    .times(Mat4.scale(1, 2/3.0, 1))
                    .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
                    .times(Mat4.rotation(Math.PI, 0, 1, 0))
            }
            else{
                level_up_text = "LEVEL UP! MAX LEVEL"
                level_up_text_matrix = model_transform
                    .times(Mat4.translation(13.5, 10.1, 6.5))
                    .times(Mat4.scale(1, 2/3.0, 1))
                    .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
                    .times(Mat4.rotation(Math.PI, 0, 1, 0))
            } 
            this.shapes.text.set_string(level_up_text, context.context); 
            this.shapes.text.draw(context, program_state, level_up_text_matrix, current_material);
        }

    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 VERTEX_COLOR;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                VERTEX_COLOR = vec4(shape_color.xyz * ambient, shape_color.w);
                VERTEX_COLOR.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);
            point_position = model_transform * vec4(position, 1.0);
            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            float scalar = sin(18.01 * distance(point_position.xyz, center.xyz));
            gl_FragColor = scalar * vec4(0.6078, 0.3961, 0.098, 1.0);
        }`;
    }
}

