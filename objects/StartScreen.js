import {defs, tiny} from '../examples/common.js';
import Object from './Object.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;
import { Text_Line } from '../examples/text-demo.js';
const {Square, Phong_Shader, Textured_Phong} = defs;

export default class StartScreen extends Object {
    constructor() {
        super();
        this.shapes = {
            title: new Square(),
            scoreboard: new Square(),
            start_text: new Text_Line(100),
        };

        this.materials = {
            scoreboard: new Material(new Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#977946")}),
            title: new Material(new Textured_Phong(), 
                {ambient: 1, color: hex_color("#000000"), texture: new Texture('../assets/title.jpg')}),
            start_text: new Material(new Textured_Phong(1), 
                {ambient: 1}),
        }
    }

    render(context, program_state, model_transform=Mat4.identity()) {
        const scoreboard_matrix = Mat4.identity()
        .times(Mat4.translation(-11.5, -4.5, 2))
        .times(Mat4.scale(4, 2, 1));

        this.shapes.scoreboard.draw(context, program_state, scoreboard_matrix, this.materials.scoreboard);

        const title_matrix = Mat4.identity()
            .times(Mat4.translation(0,4,-5))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
            .times(Mat4.scale(4, 1, 1));
        this.shapes.title.draw(
            context,
            program_state,
            title_matrix,
            this.materials.title
        );

        let sign_text_matrix = Mat4.identity()
            .times(Mat4.translation(-3.03, 3.415, 1))
            .times(Mat4.scale(0.15, 0.2, 1));

        const text_strings = [
            "You have seconds to score",
            "as many points as possible",
            "Last game's score: ",
            "Session high score: ",
            "Games played: ",
            "To start or stop the game,",
            "press 'q'",
            "Move cursor to aim and",
            "click to shoot the ball",
            "To pause the backboard,",
            "press 'p'",
            "To toggle music,",
            "press 't'",
        ];

        let i = 0;

        for (let line of text_strings.slice()) {
            i = i + 1;
            this.shapes.start_text.set_string(line, context.context);
            this.shapes.start_text.draw(context, program_state, sign_text_matrix, this.materials.start_text);
            const non_breakpoints = [1, 3, 4, 6, 8, 10, 12];
            if (non_breakpoints.includes(i)) {
            sign_text_matrix = sign_text_matrix.times(
                Mat4.translation(0, -2.2, 0)
            );
            } else {
            sign_text_matrix = sign_text_matrix.times(
                Mat4.translation(0, -3.5, 0)
            );
            }
        }
    }
}
