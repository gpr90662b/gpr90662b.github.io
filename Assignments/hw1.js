"use strict";

var canvas;
var gl;
var points = [];
var theta = 0;
var thetaLoc;
var numTimesToSubdivide = 0;
var bufferId;

 var vertices = [
   vec2(Math.sin(2.0 * Math.PI / 3.0 * 0), Math.cos(2.0 * Math.PI / 3.0 * 0)),
   vec2(Math.sin(2.0 * Math.PI / 3.0 * 1), Math.cos(2.0 * Math.PI / 3.0 * 1)),
   vec2(Math.sin(2.0 * Math.PI / 3.0 * 2), Math.cos(2.0 * Math.PI / 3.0 * 2))
   // vec2(-0.5, -0.35),
   //	vec2( 0.5, -0.35),
   //	vec2( 0.0,  0.65)
    ];

function init()
{

printValue('slider1','rangeValue1');
printValue('slider2','rangeValue2');
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 24 *Math.pow(4, 10), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    thetaLoc = gl.getUniformLocation(program, "theta");
     
        document.getElementById("slider1").onchange = function() {
        numTimesToSubdivide = event.srcElement.value;
        numTimesToSubdivide = parseInt(numTimesToSubdivide);
        //console.log( numTimesToSubdivide);
        
        render();
        
    };

    document.getElementById("slider2").onchange = function() {
        theta = event.srcElement.value;
        
        theta =  theta * Math.PI/180.0;
           render();
       
        
    };

    render();
};

function printValue(sliderId, outputId) {
          var x = document.getElementById(outputId);
          var y = document.getElementById(sliderId);
          x.value = y.value;
        }

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // four new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        divideTriangle( ac, ab, bc, count );
        
    }
}

window.onload = init;

function render()
{
   
    //points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],numTimesToSubdivide);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    //console.log(numTimesToSubdivide);
     gl.uniform1f(thetaLoc, theta);
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points=[];
   
    //requestAnimFrame(render);
}
