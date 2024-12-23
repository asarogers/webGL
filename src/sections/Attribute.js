import React from 'react';

export default function Attribute() {
    const vertexShaderSource = `#version 300 es
    in float aPointSize; // Vertex attribute
    in vec2 aPosition;
    in vec3 aColor;

    out vec3 vColor;

    void main() {
        vColor = aColor;
        gl_PointSize = aPointSize; // Set point size
        gl_Position = vec4(aPosition, 0.0, 1.0); // Set vertex position
    }`;

    const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 fragColor; // Fragment output

    in vec3 vColor;

    void main() {
        fragColor = vec4(vColor, 1.0); // Red color
    }`;

    const setCanvasRef = (canvas) => {
        if (canvas) {
            const gl = canvas.getContext('webgl2');
            if (!gl) {
                console.error('WebGL2 is not supported in your browser.');
                return;
            }

            // Compile shaders
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

            // Create and link the program
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);


            const aPositionLoc = 0;
            const aPointSizeLoc = 1;
            const aColorLoc = 2;

            gl.bindAttribLocation(program, aPositionLoc, 'aPosition')
            gl.bindAttribLocation(program, aPointSizeLoc, 'aPointSize')
            gl.bindAttribLocation(program, aColorLoc, 'aColor')

            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(`Program link error: ${gl.getProgramInfoLog(program)}`);
                return;
            }

            gl.useProgram(program);

            const bufferData = new Float32Array([
                0,1,        100,    1, 0, 0,
                -1,-1,    32,     0, 1, 0,
                1,-1,   50,     0, 0, 1,
            ])

            // const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
            // const aPointSizeLoc = gl.getAttribLocation(program, 'aPointSize');
            // const aColorLoc = gl.getAttribLocation(program, 'aColor');

            

            gl.enableVertexAttribArray(aPositionLoc);
            gl.enableVertexAttribArray(aPointSizeLoc);
            gl.enableVertexAttribArray(aColorLoc);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
            
            gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6*4, 0);
            gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6*4, 2*4);
            gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 6*4, 3*4);


            // Draw a single point
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
    };

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    return (
        <div>
            <canvas ref={setCanvasRef} width={450} height={250}></canvas>
        </div>
    );
}
