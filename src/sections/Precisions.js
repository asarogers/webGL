import React from 'react';

export default function Precisions() {
    const vertexShaderSource = `#version 300 es
    in vec4 a_position; // Vertex attribute
    void main() {
        gl_Position = a_position; // Set vertex position
        gl_PointSize = 50.0; // Point size
    }`;

    const fragmentShaderSource = `#version 300 es
  
    out vec4 fragColor; // Fragment output
    void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
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
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(`Program link error: ${gl.getProgramInfoLog(program)}`);
                return;
            }

            gl.useProgram(program);

            // Provide vertex data for a single point
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const positions = [0.0, 0.0, 0.0, 1.0]; // Single point at the center
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            // Bind the position attribute
            const positionLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);

            // Set the canvas clear color and clear
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Draw a single point
            gl.drawArrays(gl.POINTS, 0, 1);
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
