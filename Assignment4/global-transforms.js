///////////////////////////////////////////////////////////////////////////////////////////////////
// Set up, scaling, grotation, and gtranslation sliders
///////////////////////////////////////////////////////////////////////////////////////////////////
	$("#gtransX").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: 0,
		slide: function(e, ui) {
			gtransXYZ[0] = ui.value;
			objList[objCount - 1].gtranslation[0] = ui.value;
			$("#gtransXVal").html(ui.value);
            drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	$("#gtransY").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: 0,
		slide: function(e, ui) {
			gtransXYZ[1] = ui.value;
			objList[objCount - 1].gtranslation[1] = ui.value;
			$("#gtransYVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});
    
	$("#gtransZ").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: defaultZ,
		slide: function(e, ui) {
			gtransXYZ[2] = ui.value;
			objList[objCount - 1].gtranslation[2] = ui.value;
			$("#gtransZVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	//grotation
	$("#grotX").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			grotXYZ[0] = ui.value;
			objList[objCount - 1].grotation[0] = ui.value;
			$("#grotXVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	$("#grotY").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			grotXYZ[1] = ui.value;
			objList[objCount - 1].grotation[1] = ui.value;
			$("#grotYVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	$("#grotZ").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			grotXYZ[2] = ui.value;
			objList[objCount - 1].grotation[2] = ui.value;
			$("#grotZVal").html(ui.value); 
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

// scaling
	$("#gscaleX").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: gscaleXYZ[0],
		slide: function(e, ui) {
			gscaleXYZ[0] = ui.value;
			objList[objCount - 1].gscale[0] = ui.value;
			$("#gscaleXVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	$("#gscaleY").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: gscaleXYZ[1],
		slide: function(e, ui) {
			gscaleXYZ[1] = ui.value;
			objList[objCount - 1].gscale[1] = ui.value;
			$("#gscaleYVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});

	$("#gscaleZ").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: gscaleXYZ[2],
		slide: function(e, ui) {
			gscaleXYZ[2] = ui.value;
			objList[objCount - 1].gscale[2] = ui.value;
			$("#gscaleZVal").html(ui.value);
              drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				 drawScene();
			}
		}
	});
