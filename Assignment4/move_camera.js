///////////////////////////////////////////////////////////////////////////////////////////////////
// Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////

function move_camera() {
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//console.log("move_camera");
	
	for (var index = 0; index < objCount; index++) {
		var type = objList[index].type;
		var mode = objList[index].mode;
        //
        modelMatrix = objList[index].transform;
     
        //Look AT Matrix / View Matrix
        var  eyePos4 = vec4.fromValues(eyePos[0], eyePos[1], eyePos[2], 1);
        mat4.identity(rotMatrix);
        mat4.rotateY(rotMatrix, rotMatrix, degToRad(angle));
        vec4.transformMat4(eyePos4, eyePos4, rotMatrix);
        
		mat4.lookAt(lookatMatrix, [eyePos4[0], eyePos4[1], eyePos4[2]], atPoint, upVector);
       
        //mat4.invert(lookatMatrix, lookatMatrix);
        
        //modelview matrix
            mat4.multiply(mvMatrix, lookatMatrix, modelMatrix);

        // normal transform matrix, inverse transform of  mvMatrix
            mat3.normalFromMat4( normalMatrix, mvMatrix);
       //console.log("Draw Global");
       //keeping the lights fixed
         copy_lights(transLightPos, lightPosition);
        // transform the light positions by lookat matrix, lights are in word co-ordinates
       //transformLights(lookatMatrix, transLightPos, lightPosition, numUsed);

         //set the uniforms and draw
       setUniformsAndDraw(index, type, mode);
       
       // increment angle for rotation/animation
       angle += 5;
  
	} //for obj
    selected = 0;
} //drawscene
