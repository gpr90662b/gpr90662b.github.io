"use strict";
var canvas;
var rect;
var gl;

// current values
var defaultZ = 0;
var transXYZ = vec3.fromValues(0, 0, defaultZ);
var rotXYZ = vec3.fromValues(0, 0, 0);
var scaleXYZ = vec3.fromValues(1, 1, 1);

var gtransXYZ = vec3.fromValues(0, 0, 0);
var grotXYZ = vec3.fromValues(0, 0, 0);
var gscaleXYZ = vec3.fromValues(1, 1, 1);


var currObjMode = "light";

var tFlag = 0;
// eye/camera coordinates
var eyePos = vec3.fromValues(0.0, 0.0, 20);
var atPoint = vec3.fromValues(0.0, 0.0, 0);
var upVector = vec3.fromValues(0, 1, 0);

//perspective Projection;
var fovy = 45;
fovy = degToRad(fovy); //gl-Matrix wants it as radian?!
var near = 1;
var far = 100;
var WIDTH = 800;
var HEIGHT = 600;

//Orthographic projection
var orthoLeft = -15;
var orthoRight = 15 * WIDTH / HEIGHT;
var orthoBottom = -15;
var orthoTop = 15;
var orthoNear = 0;
var orthoFar = 100;

// model,  modelview, projection , normal transform and view matrices
var modelMatrix, mvMatrix, pMatrix, normalMatrix, lookatMatrix;
modelMatrix = mat4.create();
mvMatrix = mat4.create();
pMatrix = mat4.create();
lookatMatrix = mat4.create();
normalMatrix = mat3.create();

//projection flag
var xeyeSpinner, yeyeSpinner, zeyeSpinner;
var xatSpinner, yatSpinner, zatSpinner;
var xupSpinner, yupSpinner, zupSpinner;
var projectionFlag = 0; //perspective=0, orthographic=1

var selected = null;

//Look AT Matrix / View Matrix
mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);
// Perspective projection matrix		
if (projectionFlag == 1) {
    mat4.ortho(pMatrix, orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);
} else {
    mat4.perspective(pMatrix, fovy, WIDTH / HEIGHT, near, far);
}

var mvMatrixStack = [];

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


//lights
var MAXLIGHTS = 10;
var lightFlag = 0;
var lights = [];
var lightXYZ = [10, 10, 10];
var lightSelected = 0;
var aredSpinner, agreenSpinner, ablueSpinner;
var dredSpinner, dgreenSpinner, dblueSpinner;
var sredSpinner, sgreenSpinner, sblueSpinner;

var animId;

var lightPosition = new Float32Array(MAXLIGHTS * 4);
var alightColor = new Float32Array(MAXLIGHTS * 4);
var dlightColor = new Float32Array(MAXLIGHTS * 4);
var slightColor = new Float32Array(MAXLIGHTS * 4);
var transLightPos = new Float32Array(MAXLIGHTS * 4);
var tempLightPos = new Float32Array(MAXLIGHTS * 4);


for (var i = 0; i < MAXLIGHTS * 4; i++) {
    lightPosition[i] = 10; //vec4.fromValues(1,1,1,1));
    transLightPos[i] = 1; //.push(vec4.fromValues(1,1,1,1));
    alightColor[i] = 1; //.push(vec4.fromValues(1,1,1,1));
    dlightColor[i] = 1; //.push(vec4.fromValues(1,1,1,1));
    slightColor[i] = 1; //.push(vec4.fromValues(1,1,1,1));
}

var attFactor = 0.005;

lightPosition[0] = -10;
lightPosition[1] = -10;
lightPosition[2] = 10;
lightPosition[3] = 1;
lightPosition[4] = -10;
lightPosition[5] = 10;
lightPosition[6] = 10;
lightPosition[7] = 0;
lightPosition[8] = 10;
lightPosition[9] = -10;
lightPosition[10] = 10;
lightPosition[11] = 1;
lightPosition[12] = 10;
lightPosition[13] = 10;
lightPosition[14] = 10;
lightPosition[15] = 0;

alightColor[0] = 0.15;
alightColor[1] = 0.15;
alightColor[2] = 0.15;
alightColor[3] = 1;
dlightColor[0] = 0;
dlightColor[1] = 1;
dlightColor[2] = 0;
dlightColor[3] = 1;
slightColor[0] = 1;
slightColor[1] = 1;
slightColor[2] = 1;
slightColor[3] = 1;

alightColor[4] = 0.2;
alightColor[5] = 0.2;
alightColor[6] = 0.2;
alightColor[7] = 1;
dlightColor[4] = 1;
dlightColor[5] = 0;
dlightColor[6] = 0;
dlightColor[7] = 1;
slightColor[4] = 1;
slightColor[5] = 1;
slightColor[6] = 1;
slightColor[7] = 1;

alightColor[8] = 0.1;
alightColor[9] = 0.1;
alightColor[10] = 0.1;
alightColor[11] = 1;
dlightColor[8] = 1;
dlightColor[9] = 0;
dlightColor[10] = 1;
dlightColor[11] = 1;
slightColor[8] = 1;
slightColor[9] = 1;
slightColor[10] = 1;
slightColor[11] = 1;

alightColor[12] = 0.3;
alightColor[13] = 0.3;
alightColor[14] = 0.3;
alightColor[15] = 1;
dlightColor[12] = 0;
dlightColor[13] = 1;
dlightColor[14] = 1;
dlightColor[15] = 1;
slightColor[12] = 1.0;
slightColor[13] = 0.5;
slightColor[14] = 1.0;
slightColor[15] = 1;


// number of lite used
var numUsed = 4;

for (var i = 0; i < numUsed; i++) {
    lights[i] = 1;
}


var objList = [];
var objCount = 0;
var currObjType = null;

// object constructor
function obj(type, id) {
    this.type = type;
    this.id = id;
    this.mode = "light";
    this.translation = vec3.fromValues(0, 0, 0);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.scale = vec3.fromValues(1, 1, 1);
    this.ambient = vec4.fromValues(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2, 1);
    this.diffuse = vec4.fromValues(Math.random() * 0.5 + 0.5, Math.random(), Math.random(), 1);
    this.specular = vec4.fromValues(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
    //this.emission = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
    this.shininess = Math.random() * 100;
    this.transform = mat4.create();
    //console.log("created "+this.type);
}



//////////////////////////////////////////////////////////////////////////////////////////////
// Computer normal to  a triangle
//////////////////////////////////////////////////////////////////////////////////////////////
function computeNormal(out, v0, v1, v2, v3, v4, v5, v6, v7, v8) {
    //computer normal to a triangle 
    var p1 = vec3.fromValues(v0, v1, v2);
    var p2 = vec3.fromValues(v3, v4, v5);
    var p3 = vec3.fromValues(v6, v7, v8);

    var temp1 = vec3.create();
    var temp2 = vec3.create();
    var temp3 = vec3.create();

    vec3.sub(temp1, p2, p1);
    vec3.sub(temp2, p3, p1);
    vec3.cross(temp3, temp1, temp2);
    vec3.normalize(out, temp3);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Get Shader from html file, compile and return them
///////////////////////////////////////////////////////////////////////////////////////////////////
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);

    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// initialize shaders 
///////////////////////////////////////////////////////////////////////////////////////////////////
var shaderProgram;

function initShaders() {

    var vertexShader = getShader(gl, "shader-vs");
    console.log("compiled vetex shader.");
    var fragmentShader = getShader(gl, "shader-fs");
    console.log("compiled fragment shader.");
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    var status = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!status) {
        alert("Could not initialise shaders");
    }
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    //material property    
    shaderProgram.ambient = gl.getUniformLocation(shaderProgram, "ambient");
    shaderProgram.diffuse = gl.getUniformLocation(shaderProgram, "diffuse");
    //shaderProgram.emission = gl.getUniformLocation(shaderProgram, "emission");
    shaderProgram.specular = gl.getUniformLocation(shaderProgram, "specular");
    shaderProgram.shininess = gl.getUniformLocation(shaderProgram, "shininess");

    //light flag ( currently set to false )
    shaderProgram.lightFlag = gl.getUniformLocation(shaderProgram, "lightFlag");
    shaderProgram.lightIndFlag = gl.getUniformLocation(shaderProgram, "lightIndFlag");
    gl.uniform4iv(shaderProgram.lightIndFlag, lights);


    shaderProgram.lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    shaderProgram.alightColor = gl.getUniformLocation(shaderProgram, "alightColor");
    shaderProgram.dlightColor = gl.getUniformLocation(shaderProgram, "dlightColor");
    shaderProgram.slightColor = gl.getUniformLocation(shaderProgram, "slightColor");
    shaderProgram.attFactor = gl.getUniformLocation(shaderProgram, "attFactor")
    shaderProgram.numUsed = gl.getUniformLocation(shaderProgram, "numUsed");

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "mvMatrix");
    shaderProgram.normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");

    //
    shaderProgram.uRenderModeUniform = gl.getUniformLocation(shaderProgram, "uRenderMode")
    gl.uniform1i(shaderProgram.uRenderModeUniform, true);

    shaderProgram.uColorUniform = gl.getUniformLocation(shaderProgram, "uColor");
    if (selected) {
        gl.uniform4fv(shaderProgram.uColorUniform, [0, 1, 1, 1.0]);
    } else {
        gl.uniform4fv(shaderProgram.uColorUniform, [1, 0, 1, 1.0]);
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Initiate webgl  Vertex, Color buffers etc.
///////////////////////////////////////////////////////////////////////////////////////////////////
function init_buffers() {
    //
    sphVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexPosition), gl.STATIC_DRAW);
    sphVertexPositionBuffer.itemSize = 3;
    sphVertexPositionBuffer.numItems = sphVertexPosition.length / 3;
    // Normal 
    sphVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexNormal), gl.STATIC_DRAW);
    sphVertexNormalBuffer.itemSize = 3;
    sphVertexNormalBuffer.numItems = sphVertexNormal.length / 3;
    //  
    sphVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexColor), gl.STATIC_DRAW);
    sphVertexColorBuffer.itemSize = 4;
    sphVertexColorBuffer.numItems = sphVertexColor.length / 4;

    // cylinder
    cylVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexPosition), gl.STATIC_DRAW);
    cylVertexPositionBuffer.itemSize = 3;
    cylVertexPositionBuffer.numItems = cylVertexPosition.length / 3;
    // Normal 
    cylVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexNormal), gl.STATIC_DRAW);
    cylVertexNormalBuffer.itemSize = 3;
    cylVertexNormalBuffer.numItems = cylVertexNormal.length / 3;
    //color
    cylVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexColor), gl.STATIC_DRAW);
    cylVertexColorBuffer.itemSize = 4;
    cylVertexColorBuffer.numItems = cylVertexColor.length / 4;
    //

    //Cone
    coneVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertexPosition), gl.STATIC_DRAW);
    coneVertexPositionBuffer.itemSize = 3;
    coneVertexPositionBuffer.numItems = coneVertexPosition.length / 3;
    // Normal 
    coneVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertexNormal), gl.STATIC_DRAW);
    coneVertexNormalBuffer.itemSize = 3;
    coneVertexNormalBuffer.numItems = coneVertexNormal.length / 3;

    //color     
    coneVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(conelVertexColor), gl.STATIC_DRAW);
    coneVertexColorBuffer.itemSize = 4;
    coneVertexColorBuffer.numItems = conelVertexColor.length / 4;

}

function setMatrixUniforms() {
    // Set uniform 
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
}


function setLightUniforms() {
    // Set uniform 
    // send it the fragment shader
    gl.uniform4fv(shaderProgram.lightPosition, transLightPos);
    //gl.uniform4fv(shaderProgram.lightPosition, lightPosition);
    gl.uniform4fv(shaderProgram.alightColor, alightColor);
    gl.uniform4fv(shaderProgram.dlightColor, dlightColor);
    gl.uniform4fv(shaderProgram.slightColor, slightColor);
    gl.uniform1f(shaderProgram.attFactor, attFactor);
    gl.uniform1i(shaderProgram.numUsed, numUsed);
}

function setMaterialUniforms(item) {
    // Set uniform 
    gl.uniform4fv(shaderProgram.ambient, item.ambient);
    gl.uniform4fv(shaderProgram.diffuse, item.diffuse);
    gl.uniform4fv(shaderProgram.specular, item.specular);
    gl.uniform1f(shaderProgram.shininess, item.shininess);
    //gl.uniform4fv(shaderProgram.emission, item.emission );
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function radToDeg(rad) {
    return rad * 180;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    console.log("Draw");
    for (var index = 0; index < objCount; index++) {
        var type = objList[index].type;
        var mode = objList[index].mode;
        var translation = objList[index].translation;
        var rotation = objList[index].rotation;
        var scalexyz = objList[index].scale;

        // We are using gl-matrix.js  for matrix/vector routines
        //model transforms, scale first
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, translation);
        // mat4.scale(mvMatrix, mvMatrix, scalexyz);
        mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotation[0]), [1, 0, 0]);
        mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotation[1]), [0, 1, 0]);
        mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotation[2]), [0, 0, 1]);
        mat4.scale(mvMatrix, mvMatrix, scalexyz);



        //clone the model  matrix for this object and  save it
        objList[index].transform = mat4.clone(mvMatrix);

        //
        mat4.identity(lookatMatrix);
        mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);

        //modelview matrix
        mat4.multiply(mvMatrix, lookatMatrix, mvMatrix);

        // normal transform matrix, inverse transform of  mvMatrix
        mat3.normalFromMat4(normalMatrix, mvMatrix);

        // transform the light positions by lookatMatrix matrix, lights are in word co-ordinates
        transformLights(lookatMatrix, transLightPos, lightPosition, numUsed);

        //set the uniforms and draw
        setUniformsAndDraw(index, type, mode);

    } //for obj
    selected = 0;
} //drawscene

// Set uniforms and draw

function setUniformsAndDraw(index, type, mode) {
    //
    // light flag
    if (mode == "light") {
        gl.uniform1i(shaderProgram.lightFlag, 1);
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
    } else {
        gl.uniform1i(shaderProgram.lightFlag, 0);
    }

    // set the uniforms
    setMatrixUniforms();
    setMaterialUniforms(objList[index]); //index is the index in object list
    setLightUniforms();

    if (type == "Cone") {
        draw_cone(mode);
    }
    if (type == "Cylinder") {
        draw_cylinder(mode);
    }
    if (type == "Sphere") {
        draw_sphere(mode)
    }
}

function draw_sphere(mode) {
    //console.log("Sphere");
    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);


    // color buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (mode == "wire") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < sphVertexPositionBuffer.numItems; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }
    } else if (mode == "solid") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, sphVertexPositionBuffer.numItems);
    } else {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, sphVertexPositionBuffer.numItems);
        /*
        gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < sphVertexPositionBuffer.numItems; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        } */

    }

}

function draw_cylinder(mode) {
    //console.log("Cylinder");
    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // color buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (mode == "wire") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < cylVertexPositionBuffer.numItems; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }
    } else if (mode == "solid") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, cylVertexPositionBuffer.numItems);
    } else {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, cylVertexPositionBuffer.numItems);
        /* gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < cylVertexPositionBuffer.numItems; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        } */

    }
}

function draw_cone(mode) {
    //console.log("Cone");
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, coneVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // color buffer 
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, coneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    if (mode == "wire") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < coneVertexPositionBuffer.numItems; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }
    } else if (mode == "solid") {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, coneVertexPositionBuffer.numItems);
    } else {
        gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
        gl.drawArrays(gl.TRIANGLES, 0, coneVertexPositionBuffer.numItems);
        /* gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
        for (var i = 0; i < coneVertexPositionBuffer.numItems; i += 3) {
        	gl.drawArrays(gl.LINE_LOOP, i, 3);
        } */

    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// initialization
//////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = init;

function init() {
    //
    gen_sphereCords(sphereR);
    gen_cylinderCords(cylH, cylR);
    gen_coneCords(coneH, coneR);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Checked lights
    /////////////////////////////////////////////////////////////////////////////////////////////////
    document.getElementById("check1").checked = false;
    document.getElementById("check2").checked = true;
    document.getElementById("check3").checked = true;
    document.getElementById("check4").checked = false;
    lights[0] = 0
        //lights[1] = 0;
        //light[2] = 0;
    lights[3] = 0;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Set up, scaling, rotation, and translation sliders
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    $("#transX").slider({
        orientation: "horizontal",
        max: 15,
        min: -15,
        step: 0.1,
        value: 0,
        slide: function(e, ui) {
            if (tFlag == 0) {
                transXYZ[0] = ui.value;
                objList[objCount - 1].translation[0] = ui.value;
                $("#transXVal").html(ui.value);
                drawScene();
            } else {
                gtransXYZ[0] = ui.value;
                draw_globalTrans();
                draw_globalTrans();
            }

        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#transY").slider({
        orientation: "horizontal",
        max: 10,
        min: -10,
        step: 0.1,
        value: 0,
        slide: function(e, ui) {
            if (tFlag == 0) {
                transXYZ[1] = ui.value;
                objList[objCount - 1].translation[1] = ui.value;
                $("#transYVal").html(ui.value);
                drawScene();
            } else {
                gtransXYZ[1] = ui.value;
                draw_globalTrans();
            }

        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#transZ").slider({
        orientation: "horizontal",
        max: 20,
        min: -50,
        step: 0.1,
        value: defaultZ,
        slide: function(e, ui) {
            if (tFlag == 0) {
                transXYZ[2] = ui.value;
                objList[objCount - 1].translation[2] = ui.value;
                $("#transZVal").html(ui.value);
                drawScene();
            } else {
                gtransXYZ[2] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    //rotation
    $("#rotX").slider({
        orientation: "horizontal",
        min: -360,
        max: 360,
        step: 5,
        value: 0,
        slide: function(e, ui) {
            if (tFlag == 0) {
                rotXYZ[0] = ui.value;
                objList[objCount - 1].rotation[0] = ui.value;
                $("#rotXVal").html(ui.value);
                drawScene();
            } else {
                grotXYZ[0] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#rotY").slider({
        orientation: "horizontal",
        min: -360,
        max: 360,
        step: 5,
        value: 0,
        slide: function(e, ui) {
            if (tFlag == 0) {
                rotXYZ[1] = ui.value;
                objList[objCount - 1].rotation[1] = ui.value;
                $("#rotYVal").html(ui.value);
                drawScene();
            } else {
                grotXYZ[1] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#rotZ").slider({
        orientation: "horizontal",
        min: -360,
        max: 360,
        step: 5,
        value: 0,
        slide: function(e, ui) {
            if (tFlag == 0) {
                rotXYZ[2] = ui.value;
                objList[objCount - 1].rotation[2] = ui.value;
                $("#rotZVal").html(ui.value);
                drawScene();
            } else {
                grotXYZ[2] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    // scaling
    $("#scaleX").slider({
        orientation: "horizontal",
        max: 3.0,
        min: 0.25,
        step: 0.25,
        value: scaleXYZ[0],
        slide: function(e, ui) {
            if (tFlag == 0) {
                scaleXYZ[0] = ui.value;
                objList[objCount - 1].scale[0] = ui.value;
                $("#scaleXVal").html(ui.value);
                drawScene();
            } else {
                gscaleXYZ[0] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#scaleY").slider({
        orientation: "horizontal",
        max: 3.0,
        min: 0.25,
        step: 0.25,
        value: scaleXYZ[1],
        slide: function(e, ui) {
            if (tFlag == 0) {
                scaleXYZ[1] = ui.value;
                objList[objCount - 1].scale[1] = ui.value;
                $("#scaleYVal").html(ui.value);
                drawScene();
            } else {
                gscaleXYZ[1] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });

    $("#scaleZ").slider({
        orientation: "horizontal",
        max: 3.0,
        min: 0.25,
        step: 0.25,
        value: scaleXYZ[2],
        slide: function(e, ui) {
            if (tFlag == 0) {
                scaleXYZ[2] = ui.value;
                objList[objCount - 1].scale[2] = ui.value;
                $("#scaleZVal").html(ui.value);
                drawScene();
            } else {
                gscaleXYZ[1] = ui.value;
                draw_globalTrans();
            }
        },
        change: function(event) {
            if (event.originalEvent) {
                if (tFlag == 0) {
                    drawScene();
                } else {
                    draw_globalTrans();
                }
            }
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////////
    // Light Position slider and light intensity Spinners 
    ////////////////////////////////////////////////////////////////////////////////////////

    $("#lightX").slider({
        orientation: "horizontal",
        max: 50,
        min: -50,
        step: 1,
        value: 10,
        slide: function(e, ui) {
            lightXYZ[0] = ui.value;
            lightPosition[lightSelected * 4] = ui.value;
            $("#lightXVal").html(ui.value);
            drawScene();
        },
        change: function(event) {
            if (event.originalEvent) {
                drawScene();
            }
        }
    });

    $("#lightY").slider({
        orientation: "horizontal",
        max: 50,
        min: -50,
        step: 1,
        value: 10,
        slide: function(e, ui) {
            lightXYZ[1] = ui.value;
            lightPosition[lightSelected * 4 + 1] = ui.value;
            $("#lightYVal").html(ui.value);
            drawScene();
        },
        change: function(event) {
            if (event.originalEvent) {
                drawScene();
            }
        }
    });

    $("#lightZ").slider({
        orientation: "horizontal",
        max: 50,
        min: -50,
        step: 1,
        value: 10,
        slide: function(e, ui) {
            lightXYZ[2] = ui.value;
            lightPosition[lightSelected * 4 + 2] = ui.value;
            $("#lightZVal").html(ui.value);
            drawScene();
        },
        change: function(event) {
            if (event.originalEvent) {
                drawScene();
            }
        }
    });

    $("#lightATT").slider({
        orientation: "horizontal",
        max: 0.2,
        min: 0.001,
        step: 0.002,
        value: 0.001,
        slide: function(e, ui) {
            attFactor = ui.value;
            $("#lightATTVal").html(ui.value);
            drawScene();
        },
        change: function(event) {
            if (event.originalEvent) {
                drawScene();
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////
    //******************************************************************************

    $(function() {
        aredSpinner = $("#aredSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        aredSpinner.spinner("value", alightColor[lightSelected * 4]);

        agreenSpinner = $("#agreenSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        agreenSpinner.spinner("value", alightColor[lightSelected * 4 + 1]);

        ablueSpinner = $("#ablueSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.05
        });
        ablueSpinner.spinner("value", alightColor[lightSelected * 4 + 2]);
    });

    $(function() {
        dredSpinner = $("#dredSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        dredSpinner.spinner("value", dlightColor[lightSelected * 4]);
        dgreenSpinner = $("#dgreenSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        dgreenSpinner.spinner("value", dlightColor[lightSelected * 4 + 1]);
        dblueSpinner = $("#dblueSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.05
        });
        dblueSpinner.spinner("value", dlightColor[lightSelected * 4 + 2]);
    });

    $(function() {
        sredSpinner = $("#sredSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        sredSpinner.spinner("value", slightColor[lightSelected * 4]);
        sgreenSpinner = $("#sgreenSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.1
        });
        sgreenSpinner.spinner("value", slightColor[lightSelected * 4 + 1]);
        sblueSpinner = $("#sblueSpinner").spinner({
            min: 0,
            max: 1,
            step: 0.05
        });
        sblueSpinner.spinner("value", slightColor[lightSelected * 4 + 2]);
    });
    //******************************************************************************
    ///////////////////////////////////////////////////////////////////////////////

    setLightValues();
    setViewValues();

    // webgl canvas
    canvas = document.getElementById("gl-canvas");
    rect = canvas.getBoundingClientRect();

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.projectionFlag = 0;

    initShaders()
    init_buffers();

    viewSpinners();
    reset_ui();

} // init


//////////////////////////////////////////////////////////////////////////////////////////////////
// create object
///////////////////////////////////////////////////////////////////////////////////////////////
//shape selector Selector
$(function() {
    $("input[name='shapeGroup']").on("click", function() {
        var id = this.value + objCount;
        currObjType = this.value;

        objList[objCount] = new obj(currObjType, id);
        //objList[objCount].type = this.value;
        objCount++;
        console.log(objCount);

        reset_ui();
        // Add to Select list
        addOneToList(id);

        drawScene();
    });
});


/////////////////////////////////////////////////////////////////////////////////////////
//  reset all the buttons and sliders to default values 
////////////////////////////////////////////////////////////////////////////////////////
function reset_ui_lights() {
    $("#lightX").slider("option", "value", lightPosition[lightSelected * 4]);
    $("#lightY").slider("option", "value", lightPosition[lightSelected * 4 + 1]);
    $("#lightZ").slider("option", "value", lightPosition[lightSelected * 4 + 2]);

    $("#lightXVal").html(lightPosition[lightSelected * 4]);
    $("#lightYVal").html(lightPosition[lightSelected * 4 + 1]);
    $("#lightZVal").html(lightPosition[lightSelected * 4 + 2]);

    // reset spinners
    aredSpinner.spinner("value", alightColor[lightSelected * 4]);
    agreenSpinner.spinner("value", alightColor[lightSelected * 4 + 1]);
    ablueSpinner.spinner("value", alightColor[lightSelected * 4 + 2]);


    dredSpinner.spinner("value", dlightColor[lightSelected * 4]);
    dgreenSpinner.spinner("value", dlightColor[lightSelected * 4 + 1]);
    dblueSpinner.spinner("value", dlightColor[lightSelected * 4 + 2]);


    sredSpinner.spinner("value", slightColor[lightSelected * 4]);
    sgreenSpinner.spinner("value", slightColor[lightSelected * 4 + 1]);
    sblueSpinner.spinner("value", slightColor[lightSelected * 4 + 2]);

    $("#lightATTVal").html(0.001);

}

function reset_ui() {
    $("input[name=renderModeGroup][value=wire]").prop('checked', false);
    $("input[name=renderModeGroup][value=solid]").prop('checked', false);
    $("input[name=renderModeGroup][value=light]").prop('checked', true);

    reset_ui_lights();

    $("#transX").slider("option", "value", 0);
    $("#transY").slider("option", "value", 0);
    $("#transZ").slider("option", "value", 0);

    $("#rotX").slider("option", "value", 0);
    $("#rotY").slider("option", "value", 0);
    $("#rotZ").slider("option", "value", 0);

    $("#scaleX").slider("option", "value", 1);
    $("#scaleY").slider("option", "value", 1);
    $("#scaleZ").slider("option", "value", 1);

    $("#transXVal").html(0);
    $("#transYVal").html(0);
    $("#transZVal").html(0);

    $("#rotXVal").html(0);
    $("#rotYVal").html(0);
    $("#rotZVal").html(0);

    $("#scaleXVal").html(0);
    $("#scaleYVal").html(0);
    $("#scaleZVal").html(0);

    $("input[name=viewGroup][value=Perspective]").prop('checked', true);
    $("input[name=viewGroup][value=Orthogonal]").prop('checked', false);

}

// Mode Selector
$(function() {
    $("input[name='renderModeGroup']").on("change", function() {
        currObjMode = this.value;
        console.log(this.value);
        objList[objCount - 1].mode = this.value;
        //alert(this.value);
        drawScene();
    });

});

//projection selector
$(function() {
    $("input[name='viewGroup']").on("change", function() {
        //console.log(this.value);
        if (this.value == "Orthogonal") {
            gl.projectionFlag = 1;
            mat4.ortho(pMatrix, orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);
        } else {
            mat4.perspective(pMatrix, fovy, gl.viewportWidth / gl.viewportHeight, near, far);
            gl.projectionFlag = 0;
        }
        drawScene();
    });
});

//model/global selector
$(function() {
    $("input[name='transformGroup']").on("change", function() {
        console.log(this.value);
        if (this.value == "model") {
            tFlag = 0;

        } else {
            tFlag = 1;
        }
    });
});


////////////////////////////////////////////////////////////////////
/// Make the select list of objects for selection
///////////////////////////////////////////////////////////////////
function make_list() {
    $.each(objList, function() {

        $('#mySelect').append($('<option>', {
            value: this.id,
            text: this.id
        }));
    });
}
////////////////////////////////////////////////////////////////
function addOneToList(id) {

    $('#mySelect').append($('<option>', {
        value: id,
        text: id
    }));
}


/////////////////////////////////////////////////////////////////
// toggling Div container  for select list 
/////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $("#switch").click(function() {
        var selectList = $("#mySelect");
        selectList.find("option:gt(0)").remove();
        //$("#mySelect").empty();
        make_list();
        $("#panel").toggle();
    });
});
// SELECTION AND DELETION  OF OBJECTS FROM ARRAY
////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $("#mySelect").change(function() {
        var v = $("#mySelect").val();
        //console.log(v);
        for (var i = 0; i < objCount; i++) {
            if (v == objList[i].id) {
                if (confirm('Press Cancel to Edit the Selected Object, Ok to Delete it.')) {
                    // delete it 
                    objList.splice(i, 1);
                    objCount = objCount - 1;
                    drawScene();
                    break;

                } else {
                    // Do nothing!
                    selected = 1;
                    swapArrayElements(objList, i, objCount - 1);
                    reset_ui();
                    drawScene();
                    break;
                }
            }
        }
        setTimeout(function() {
            $('#panel').fadeOut('fast');
        }, 500);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////
// SWAP two object positions in the array.
//////////////////////////////////////////////////////////////////////////////////////////

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Delete an object from a array
///////////////////////////////////////////////////////////////////////////////////////////////
var removeByAttr = function(arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {

            arr.splice(i, 1);

        }
    }
    return arr;
}

/////////////////////////////////////////////////////////////////////////////
// Light Selection and Editing
////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $("#lightSelect").change(function() {
        var v = $("#lightSelect").val();
        lightSelected = v;
        reset_ui_lights();

    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////
// Apply LookAt transform to lights
/////////////////////////////////////////////////////////////////////////////////////////////////

function transformLights(mat, outvec, invec, used) {
    // multiply  matrix with vector
    var i, j, k;
    var out = vec4.create();
    for (k = 0; k < 4 * used; k += 4) {

        for (i = 0; i < 4; i++) {
            out[i] = invec[k + i];
        }
        vec4.transformMat4(out, out, mat);
        for (i = 0; i < 4; i++) {
            outvec[k + i] = out[i];
        }


    }
}
//////////////////////////////////////////////////////////////////////////////////////////
// Rotate Lights
//////////////////////////////////////////////////////////////////////////////////////////
var angle = 0;
var rotMatrix;
rotMatrix = mat4.create();

function rotate_lights(rot, outVector, inVector) {
    mat4.identity(rotMatrix);
    mat4.rotateY(rotMatrix, rotMatrix, degToRad(rot));
    transformLights(rotMatrix, outVector, inVector, numUsed);
    console.log(rot);
}

/////////////////////////////////////////////////////////////////////////////////////////
// Light Toggle Switches
////////////////////////////////////////////////////////////////////////////////////////

function handleLights(event) {
    if (event.id == "check1") {
        if (event.checked == true) {
            lights[0] = 1;
        } else {
            lights[0] = 0;
        }
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if (event.id == "check2") {
        if (event.checked == true) {
            lights[1] = 1;
        } else {
            lights[1] = 0;
        }
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if (event.id == "check3") {
        if (event.checked == true) {
            lights[2] = 1;
        } else {
            lights[2] = 0;
        }
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if (event.id == "check4") {
        if (event.checked == true) {
            lights[3] = 1;
        } else {
            lights[3] = 0;
        }
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }

}

/////////////////////////////////////////////////////////////////////////////////
// Light Rotation Demo
//////////////////////////////////////////////////////////////////////////////////
function setupScene() {
    objCount = 0;
    currObjType = "Sphere"
    objList[objCount] = new obj(currObjType, "Sphere0");
    objList[objCount].id = "Sphere0";
    objList[objCount].mode = "light";
    objList[objCount].translation = [-5.5, 1, 1];
    objList[objCount].rotation = [15, 0, 0];
    objList[objCount].scale = [2, 2, 2];
    objList[objCount].transform = mat4.create();
    objCount++;

    currObjType = "Cone"
    objList[objCount] = new obj(currObjType, "Cone1");
    objList[objCount].id = "Cone1";
    objList[objCount].mode = "light";
    objList[objCount].translation = [4.5, -2.0, 0.5];
    objList[objCount].rotation = [15, 0, 30];
    objList[objCount].scale = [2, 2, 2];
    objList[objCount].transform = mat4.create();
    objCount++;

    currObjType = "Cylinder"
    objList[objCount] = new obj(currObjType, "Cylinder2");
    objList[objCount].id = "Cylinder2";
    objList[objCount].mode = "light";
    objList[objCount].translation = [0, 0, 0];
    objList[objCount].rotation = [15, 0, 15];
    objList[objCount].scale = [2, 2, 2];
    objList[objCount].transform = mat4.create();
    objCount++;

    drawScene();
    //lightAnimId =  setInterval(move_camera, 500);
}


function move_lights_demo() {
    //angle = 0;
    animId = setInterval(move_lights, 100);
}

function stop_lights() {
    clearInterval(animId);
}

function move_camera_demo() {
    //angle = 0;
    animId = setInterval(move_camera, 100);
}

function stop_camera() {
    clearInterval(animId);
}

function resetScene() {
    if (animId) {
        clearInterval(animId);
    }
    objCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function copy_lights(outvector, invector) {
    for (var p = 0; p < numUsed * 4; p++) {
        outvector[p] = invector[p];
    }
}

function setLightValues() {
    $("#setLightValues").click(function() {
        alightColor[lightSelected * 4] = aredSpinner.spinner("value");
        alightColor[lightSelected * 4 + 1] = agreenSpinner.spinner("value");
        alightColor[lightSelected * 4 + 2] = ablueSpinner.spinner("value");

        dlightColor[lightSelected * 4] = dredSpinner.spinner("value");
        dlightColor[lightSelected * 4 + 1] = dgreenSpinner.spinner("value");
        dlightColor[lightSelected * 4 + 2] = dblueSpinner.spinner("value");

        slightColor[lightSelected * 4] = sredSpinner.spinner("value");
        slightColor[lightSelected * 4 + 1] = sgreenSpinner.spinner("value");
        slightColor[lightSelected * 4 + 2] = sblueSpinner.spinner("value");

        drawScene();
    });

}

function viewSpinners() {
    $(function() {
        xeyeSpinner = $("#xeyeSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        xeyeSpinner.spinner("value", eyePos[0]);

        yeyeSpinner = $("#yeyeSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        yeyeSpinner.spinner("value", eyePos[1]);

        zeyeSpinner = $("#zeyeSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        zeyeSpinner.spinner("value", eyePos[2]);

    });

    $(function() {

        xatSpinner = $("#xatSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        xatSpinner.spinner("value", atPoint[0]);

        yatSpinner = $("#yatSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        yatSpinner.spinner("value", atPoint[1]);

        zatSpinner = $("#zatSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        zatSpinner.spinner("value", atPoint[2]);



    });

    $(function() {
        xupSpinner = $("#xupSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        xupSpinner.spinner("value", upVector[0]);

        yupSpinner = $("#yupSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        yupSpinner.spinner("value", upVector[1]);

        zupSpinner = $("#zupSpinner").spinner({
            min: -100,
            max: 100,
            step: 1
        });
        zupSpinner.spinner("value", upVector[2]);
    });

}

function setViewValues() {
    $("#setViewValues").click(function() {

        eyePos[0] = xeyeSpinner.spinner("value");
        eyePos[1] = yeyeSpinner.spinner("value");
        eyePos[2] = zeyeSpinner.spinner("value");

        atPoint[0] = xatSpinner.spinner("value");
        atPoint[1] = yatSpinner.spinner("value");
        atPoint[2] = zatSpinner.spinner("value");

        upVector[0] = xupSpinner.spinner("value");
        upVector[1] = yupSpinner.spinner("value");
        upVector[2] = zupSpinner.spinner("value");

        //mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);

        drawScene();
    });
}

function setDefaultView() {
    eyePos[0] = 0;
    eyePos[1] = 0;
    eyePos[2] = 20;

    atPoint[0] = 0;
    atPoint[1] = 0;
    atPoint[2] = 0;

    upVector[0] = 0;
    upVector[1] = 1;
    upVector[2] = 0;

    xeyeSpinner.spinner("value", eyePos[0]);
    yeyeSpinner.spinner("value", eyePos[1]);
    zeyeSpinner.spinner("value", eyePos[2]);

    xatSpinner.spinner("value", atPoint[0]);
    yatSpinner.spinner("value", atPoint[1]);
    zatSpinner.spinner("value", atPoint[2]);

    xupSpinner.spinner("value", upVector[0]);
    yupSpinner.spinner("value", upVector[1]);
    zupSpinner.spinner("value", upVector[2]);

    drawScene();
}

$(document).ready(function() {
    $("#infoButton").click(function() {
        $("#infoPanel").toggle();
    });
});