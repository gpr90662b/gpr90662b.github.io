//
function demo() {

currObjType = "Sphere"
objList[objCount] = new obj(currObjType, id);

objList[objCount].id = "Sphere0";
objList[objCount].mode = "both";
objList[objCount].translation = [-1, 1, 1]; 
objList[objCount].rotation = [15, 0, 0];
objList[objCount].scale = [2, 2, 2];
objList[objCount].transform = mat4.create();

objCount++;

currObjType = "Cone"
objList[objCount] = new obj(currObjType, id);

objList[objCount].id = "Cone0";
objList[objCount].mode = "both";
objList[objCount].translation = [1, -1, 0.5]; 
objList[objCount].rotation = [15, 0, 15];
objList[objCount].scale = [2, 2, 2];
objList[objCount].transform = mat4.create();

objCount++;

currObjType = "Cylinder"
objList[objCount] = new obj(currObjType, id);

objList[objCount].id = "Cone0";
objList[objCount].mode = "both";
objList[objCount].translation = [0, 0, 0]; 
objList[objCount].rotation = [15, 0, 15];
objList[objCount].scale = [2, 2, 2];
objList[objCount].transform = mat4.create();
drawScene();

}