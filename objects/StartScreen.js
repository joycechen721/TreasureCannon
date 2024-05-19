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
            background: new Square(),
            title: new Square(),
            start_text: new Text_Line(100),
        };

        this.materials = {
            background: new Material(new Phong_Shader(),
                {ambient: 1, diffusivity: .1, color: color(0, 0, 0, 0.5)}),
            title: new Material(new Textured_Phong(), 
                {ambient: 1, color: hex_color("#000000"), texture: new Texture('../assets/title.jpg')}),
            start_text: new Material(new Textured_Phong(1), 
                {ambient: 1, color: hex_color("#ffffff"), texture: new Texture('../assets/text.png'),}),
        }
    }

    render(context, program_state, model_transform=Mat4.identity()) {
        const bg_matrix = Mat4.identity()
            .times(Mat4.translation(0, 9, -2))
            .times(Mat4.scale(8, 1, 6))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
        this.shapes.background.draw(context, program_state, bg_matrix, this.materials.background);

        const title_matrix = Mat4.identity()
            .times(Mat4.translation(0, 10, 6))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.rotation(Math.PI, 0, 1, 0))
            .times(Mat4.scale(7, 2, 1))
        this.shapes.title.draw(
            context,
            program_state,
            title_matrix,
            this.materials.title
        );

        let sign_text_matrix = Mat4.identity()
            .times(Mat4.translation(7, 10.1, 3))
            .times(Mat4.scale(0.3, 0.2, 0.3))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
            .times(Mat4.rotation(Math.PI, 0, 1, 0))

        const text_strings = [
            "Welcome to Treasure Cannon!",
            "Move the right & left arrow keys",
            "to collect the falling objects.",
            "To start or stop the game,",
            "press 't'",
        ];

        let i = 0;
        for (let line of text_strings.slice()) {
            i = i + 1;
            this.shapes.start_text.set_string(line, context.context);
            this.shapes.start_text.draw(context, program_state, sign_text_matrix, this.materials.start_text);
            sign_text_matrix = sign_text_matrix.times(
                Mat4.translation(0, -2.5, 0)
            );
        }
    }
}
