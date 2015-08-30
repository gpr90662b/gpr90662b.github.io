function drawScene(e) {
// 
 if ( !e.id ) {
    e.id = "default";
}
 mat4.identity(modelMatrix);
    console.log(e.id);
    var translate = objList[objCount-1].translation;
    var toOrigin = [-translate[0],-translate[1],-translate[2]];
    switch (e.id) {
    case "scaleX":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, toOrigin);
        mat4.scale(modelMatrix, modelMatrix, [scaleXYZ[0],1,1]);
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "scaleY":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix,  toOrigin);
        mat4.scale(modelMatrix, modelMatrix, [1, scaleXYZ[1],1]);
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "scaleZ":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix,  toOrigin);
        mat4.scale(modelMatrix, modelMatrix, [1, 1,scaleXYZ[2]]);
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "rotX":
         mat4.identity(modelMatrix);
         mat4.translate(modelMatrix, modelMatrix,  toOrigin);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(rotXYZ[0]));
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "rotY":
     mat4.identity(modelMatrix);
     mat4.translate(modelMatrix, modelMatrix,  toOrigin);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(rotXYZ[1]));
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "rotZ":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix,  toOrigin);
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(rotXYZ[2]));
        mat4.translate(modelMatrix, modelMatrix, translate);
        break;
    case "transX":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [transXYZ[0],1,1]);
        break;
     case "transY":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [1, transXYZ[1],1]);
        break;
     case "transZ":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [1, 1,transXYZ[2]]);
        break;
        
     default:
        console.log("Wrong selection");
         mat4.identity(modelMatrix);
        break;
     
    }
    
    //clone the model  matrix for this object and  save it
        mat4.multiply(objList[objCount-1].transform ,objList[objCount-1].transform, modelMatrix);
    draw_global();
    

}