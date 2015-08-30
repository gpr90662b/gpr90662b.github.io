///////////////////////////////////////////////////////////////////////////////////////////////////
// Move_Lights Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////

function move_lights() {
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//console.log("Draw Global");
	
	for (var index = 0; index < objCount; index++) {
		var type = objList[index].type;
		var mode = objList[index].mode;
        //
        modelMatrix = objList[index].transform;
     
        //Look AT Matrix / View Matrix
        mat4.identity(lookatMatrix);
        mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);
		
        //modelview matrix
            mat4.multiply(mvMatrix, lookatMatrix, modelMatrix);

        // normal transform matrix, inverse transform of  mvMatrix
            mat3.normalFromMat4( normalMatrix, mvMatrix);
       //console.log("Draw Global");
        // transform the light positions by lookat matrix, lights are in word co-ordinates
        //transformLights(lookat, transLightPos, lightPosition, numUsed);
        
        rotate_lights(angle, tempLightPos,lightPosition);
        
       //
        transformLights(lookatMatrix, transLightPos, tempLightPos, numUsed);
                
         //set the uniforms and draw
       setUniformsAndDraw(index, type, mode);
       angle += 5;
  
	} //for obj
    selected = 0;
} //drawscene
