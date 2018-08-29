var appModel = {
	preloadImage: [
		"assets/img/skybox3/nx.jpg",
		"assets/img/skybox3/ny.jpg",
		"assets/img/skybox3/nz.jpg",
		"assets/img/skybox3/px.jpg",
		"assets/img/skybox3/py.jpg",
		"assets/img/skybox3/pz.jpg",
	],
	threeSceneObject:{
		render:null,
		camera:null,
		orbitControl:null,
		scene:null,
		render:null,
	},
	threeObject:{
		
	}
};

var appController={
	init:function(){
		
	}
}

var appView={
	
}

var renderer;
var camera;
var orbitControl;
var scene;
var light;
var backgroundPlant = null,
	planeG, ma;
var sceneIsMoving = false;
var goInCarFlag = false;
var goInCarAnimateFlag = 0;
var clock = new THREE.Clock();
var doorPosition = {
	x: 10,
	y: 15,
	z: 3
};
var innerPosition = {
	x: 4,
	y: 8,
	z: -2
}
var cameraPosition = {
	x: 0,
	y: 20,
	z: -50
};
var color1 = {
	r: 1,
	g: 0.0784313753247261,
	b: 0.6196078658103943
}

var color2 = {
	r: 0.0784313753247261,
	g: 0.0784313753247261,
	b: 0.6196078658103943
}

var color3 = {
	r: 0.6196078658103943,
	g: 0.0784313753247261,
	b: 0.6196078658103943
}
var objectsArr = [];
var objectsHint = [];
var lightFlag = false;

function initThree() {

	width = document.getElementById("container").clientWidth;
	height = document.getElementById("container").clientHeight;
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	console.log(window.innerWidth, window.innerHeight)
	//renderer.shadowMapEnabled = false;
	//	renderer.setSize(width, height);
	document.getElementById('container').appendChild(renderer.domElement);
	renderer.setClearColor(0xFFFFFF, 1.0);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

	// controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.25;
	controls.screenSpacePanning = false;
	//controls.minDistance = 50;
	controls.maxDistance = 100

	controls.minPolarAngle = Math.PI / 12;
	controls.maxPolarAngle = Math.PI / 2.5;
	// 自动旋转
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5

	//controls.maxPolarAngle = Math.PI;

	clock = new THREE.Clock();
}

function initScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 200, 1300);
}

var sun1;

function initLight() {
	//			var light = new THREE.PointLight(0xFFFFFF);
	//			light.position.set(1000, 500, 1000);
	//			light.castShadow = true;
	//			scene.add(light);
	//			
	//						var light2 = new THREE.PointLight(0xFFFFFF);
	//						light2.position.set(6,6,24);
	//						scene.add(light2);

	sun1 = new THREE.DirectionalLight(0xffffff);
	sun1.position.set(-1000, 500, -1000);
	//sun1.castShadow = true;
	scene.add(sun1);

	sun2 = new THREE.DirectionalLight(0xffffff);
	sun2.position.set(1000, 500, 1000);
	//sun2.castShadow = true;
	scene.add(sun2);

}

var backgroundPlant;
var ground;

function addGround() {
	var shadow = new THREE.PlaneGeometry(30, 50);
	var ma = new THREE.MeshLambertMaterial({
		map: new THREE.TextureLoader().load("assets/img/shadow.png"),
		transparent: true,
	});

	backgroundPlant = new THREE.Mesh(shadow, ma);
	backgroundPlant.position.y = 1;
	backgroundPlant.rotation.x = -Math.PI / 2;
	scene.add(backgroundPlant);

	let shape = new THREE.Shape();
	shape.absarc(0, 0, 300, 0 / 180 * Math.PI, 360 / 180 * Math.PI, false);
	shape.lineTo(0, 0); //（1）做一条线到圆心
	let arcGeometry = new THREE.ShapeGeometry(shape);
	//（2）使用网格模型来表示
	var texture = new THREE.TextureLoader().load("assets/img/wall.png");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(0.1, 0.1);
	var arcMaterial = new THREE.MeshLambertMaterial({
		map: texture,
		//				transparent:true,
		envMap: scene.background,
		combine: THREE.MixOperation,
		reflectivity: 0.5
	});

	ground = new THREE.Mesh(arcGeometry, arcMaterial);
	ground.rotation.x = -Math.PI / 2;
	scene.add(ground)

}

function create_hint_element(name, size, src, positionObj, isHint) {
	isHint = isHint || false;
	var planeG = new THREE.PlaneGeometry(size.width, size.height);
	var texture = new THREE.TextureLoader().load(src);

	var ma = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		side: THREE.DoubleSide

	});

	var icon = new THREE.Mesh(planeG, ma);
	icon.position.x = positionObj.x;
	icon.position.y = positionObj.y;
	icon.position.z = positionObj.z;
	icon.name = name;
	icon.imgUrl = src;
	if(icon.name == "icon3") {
		icon.rotation.y = Math.PI / 2
	}

	objectsArr.push(icon);

	if(isHint) {
		objectsHint.push(icon);
		icon.visible = false;
	} else {
		scene.add(icon);
		icon.visible = true;
	}
}

var hint;

function addclickboard() {

	create_hint_element("hint1", {
		width: 10,
		height: 10
	}, "assets/img/timg.png", {
		x: -10,
		y: 20,
		z: 0
	}, true);

	create_hint_element("hint2", {
		width: 10,
		height: 10
	}, "assets/img/timg2.jpg", {
		x: 10,
		y: 20,
		z: 0
	}, true);

	create_hint_element("icon1", {
		width: 2,
		height: 2
	}, "assets/img/icon.png", {
		x: -10,
		y: 10,
		z: 0
	});

	create_hint_element("icon2", {
		width: 2,
		height: 2
	}, "assets/img/icon.png", {
		x: 8,
		y: 10,
		z: 0
	});

	create_hint_element("icon3", {
		width: 2,
		height: 2
	}, "assets/img/icon.png", {
		x: 9,
		y: 7,
		z: 3
	});

	create_hint_element("light1", {
		width: 7,
		height: 7
	}, "assets/img/shinning.png", {
		x: 6,
		y: 6,
		z: 24
	});

	create_hint_element("light2", {
		width: 7,
		height: 7
	}, "assets/img/shinning.png", {
		x: -7,
		y: 6,
		z: 24
	});

}

//点击射线
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
	event.preventDefault();
	mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
	mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(objectsArr);

	if(intersects.length > 0) {
		for(var i = 0; i < intersects.length; i++) {
			if(intersects[i].object.visible == true) {
				var objectName = intersects[i].object.name;
				sceneIsMoving = true;
				setTimeout(function() {
					sceneIsMoving = false;
				}, 1000);

				switch(objectName) {
					case "hint1":
						getElementFormArr("hint1").visible = false;
						scene.remove(getElementFormArr("hint1"));
						break;
					case "hint2":
						getElementFormArr("hint2").visible = false;
						scene.remove(getElementFormArr("hint2"));
						break;
					case "icon1":
						getElementFormArr("hint1").visible = true;
						scene.add(getElementFormArr("hint1"));
						break;
					case "icon2":
						getElementFormArr("hint2").visible = true;
						scene.add(getElementFormArr("hint2"));
						break;
					case "icon3":
						hideSceneAnimate();
						break;
				}
			}
		}

	}

}

function getElementFormArr(name) {
	var obj;
	objectsArr.map(function(item) {
		if(item.name == name) {
			obj = item;
		}
	});
	return obj;
}

function hideSceneAnimate() {
	controls.enableRotate = false
	setTimeout(function() {

		$(".shadow").css({
			opacity: 0
		}).show().animate({
			opacity: 1
		}, 700, function() {
			hideScene();
			$(this).animate({
				opacity: 0
			}, 700, function() {
				$(this).hide();
			})
		});
	}, 2000)

	sceneIsMoving = true;
	goInCarFlag = true;
	goInCarAnimateFlag = 1;

	goInCarFlagStep = {
		x: (camera.position.x - doorPosition.x).toFixed(2),
		y: (camera.position.y - doorPosition.y).toFixed(2),
		z: (camera.position.z - doorPosition.z).toFixed(2)
	}

	goInCarFormPosition = {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z
	}
	console.log(goInCarFlagStep, camera.position)

}

function hideScene() {

	hideObject(carFbx);
	hideObject(ground);
	hideObject(backgroundPlant);

	scene.background = new THREE.CubeTextureLoader()
		.setPath("assets/img/skybox3/")
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

	for(var i = 0; i < 3; i++) {
		if(!!getElementFormArr("hint" + (i + 1))) {
			hideObject(getElementFormArr("hint" + (i + 1)))
		}

		if(getElementFormArr("icon" + (i + 1))) {
			hideObject(getElementFormArr("icon" + (i + 1)))
		}

		if(getElementFormArr("light" + (i + 1))) {
			hideObject(getElementFormArr("light" + (i + 1)))
		}
	}

	$(".home-btn").show();
	$(".car-btn-panel").hide();
	$(".light-btn").hide();
	$(".light-btn2").hide();
	controls.enableRotate = true;
	//			camera.lookAt({
	//				x: 9,
	//				y: 7,
	//				z: 100
	//			});

}

function showSceneAnimate() {
	controls.enableRotate = false
	$(".shadow").css({
		opacity: 0
	}).show().animate({
		opacity: 1
	}, 500, function() {
		showScene();
		$(this).animate({
			opacity: 0
		}, 500).hide();
	})
}

function showScene() {
	goInCarAnimateFlag = 4;
	showObject(carFbx);
	showObject(ground);
	showObject(backgroundPlant);

	scene.background = new THREE.CubeTextureLoader()
		.setPath("assets/img/skybox/")
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

	for(var i = 0; i < 3; i++) {
		if(!!getElementFormArr("hint" + (i + 1))) {
			showObject(getElementFormArr("hint" + (i + 1)))
		}

		if(getElementFormArr("icon" + (i + 1))) {
			showObject(getElementFormArr("icon" + (i + 1)))
		}

		if(getElementFormArr("light" + (i + 1))) {
			showObject(getElementFormArr("light" + (i + 1)))
		}
	}
	$(".car-btn-panel").show();
	$(".light-btn").show();
	$(".light-btn2").show();
	$(".home-btn").hide();

}

function hideObject(obj) {
	obj.visible = false;
}

function showObject(obj) {
	obj.visible = true;
}

function preload() {
	initThree();
	initCamera();
	initScene();
	initLight();
	addclickboard();
	addFbxObj();
	addGround();

	//addPoint();

}

var carFbx;
var carPaintArr = [];

function addFbxObj() {
	var loader = new THREE.FBXLoader();

	loader.load('assets/obj/bmw01.fbx', function(object) {

		carFbx = object;
		console.log(carFbx)
		carFbx.scale.multiplyScalar(0.1);

		var mainColor = {
			r: 1,
			g: 0.0784313753247261,
			b: 0.6196078658103943
		};

		for(var i = 0; i < carFbx.children.length; i++) {
			if(Array.isArray(carFbx.children[i].material)) {
				carFbx.children[i].material.map(function(item) {
					if(item.color.r == mainColor.r && item.color.g == mainColor.g && item.color.b == mainColor.b) {

						carPaintArr.push([i, carFbx.children[i].name, item.name])

					} else {

						//console.log(item.color.r)
					}
				})
			} else {
				var item = carFbx.children[i].material;

				if(item.color.r == mainColor.r && item.color.g == mainColor.g && item.color.b == mainColor.b) {
					carPaintArr.push([i, carFbx.children[i].name]);
				}

				//console.log(carFbx.children[i].material.color.r)
			}
		}

		//				object.mixer = new THREE.AnimationMixer(object);
		//				mixers.push(object.mixer);

		//				var action = object.mixer.clipAction(object.animations[0]);
		//				action.play();

		scene.add(carFbx);

	});
}

function fbxChangeColor(index) {
	var trueColor;

	switch(index) {
		case 0:
			trueColor = color1;
			break;
		case 1:
			trueColor = color2;
			break;
		case 2:
			trueColor = color3;
			break;
	}

	var index = 0;
	for(var i = 0; i < carFbx.children.length; i++) {

		if(!!carPaintArr[index] && i == carPaintArr[index][0]) {

			// 从这里得到所有的修改列表
			var item = carPaintArr[index];
			var changeNumber = item[0];
			if(!item[2]) {
				carFbx.children[changeNumber].material.color.r = trueColor.r;
				carFbx.children[changeNumber].material.color.g = trueColor.g;
				carFbx.children[changeNumber].material.color.b = trueColor.b;
			} else {
				var element = carFbx.children[changeNumber].material;
				for(var j = 0; j < element.length; j++) {
					if(element[j].name == item[2]) {
						element[j].color.r = trueColor.r;
						element[j].color.g = trueColor.g;
						element[j].color.b = trueColor.b;
					}
				}

			}
			index++;
		}

	}

	closeLight(false);
}

var lightGroup = [
	[0, 1, 2],
	[3, 4],
	[5, 6],
	[7, 8],
	[9, 10, 11],
	[],
	[],

];
var lightIndex = 0;
var lightFlag2 = false;

function closeLight(show) {
	return;
	lightGroup.map(function(lightGroups) {
		lightGroups.map(function(lightItems) {
			carFbx.children[lightItems].visible = show;
		});
	});
}

function playLightAnimate(arr, show) {
	arr.map(function(item) {
		carFbx.children[item].visible = show;
	});
}

function addPoint() {
	var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	var sphereMaterial = new THREE.MeshLambertMaterial({
		color: 0x7777ff
	});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	sphere.position.set(0, 7, 10);
	scene.add(sphere);

}
var maxTime = 60 * 5;
var maxIndex = 60 * 5;
var lightStep = 30;
var lightStepIndex = 30;
var goInCarFlagStep = {
	x: 0,
	y: 0,
	z: 0
};
var goInCarFlagStepTime = 30 * 3;
var goInCarFlagStepTime2 = 30;
var goInCarFlagStepIndex = 0;
var goInCarFlagStepIndex2 = 0;
var goInCarFormPosition = {};

function render() {
	if(!goInCarFlag) {
		if(!sceneIsMoving) {
			if(maxIndex > 0) {
				maxIndex--;
				if(controls.autoRotate) {
					controls.autoRotate = false;
				}
			} else {
				if(!controls.autoRotate) {
					controls.autoRotate = true;
				}
			}
		} else {
			maxIndex = maxTime;
			if(controls.autoRotate) {
				controls.autoRotate = false;
			}
		}
	} else {
		if(controls.autoRotate) {
			controls.autoRotate = false;
		}
		maxIndex = maxTime;
	}

	var delta = clock.getDelta();
	controls.update(delta); //更新时间
	if(getElementFormArr("hint1")) {
		for(var i = 0; i < 2; i++) {
			getElementFormArr("hint" + (i + 1)).rotation.y = camera.rotation.y;
			getElementFormArr("hint" + (i + 1)).rotation.x = camera.rotation.x;
			getElementFormArr("hint" + (i + 1)).rotation.z = camera.rotation.z;

			getElementFormArr("icon" + (i + 1)).rotation.y = camera.rotation.y;
			getElementFormArr("icon" + (i + 1)).rotation.x = camera.rotation.x;
			getElementFormArr("icon" + (i + 1)).rotation.z = camera.rotation.z;

			getElementFormArr("light" + (i + 1)).rotation.y = camera.rotation.y;
			getElementFormArr("light" + (i + 1)).rotation.x = camera.rotation.x;
			getElementFormArr("light" + (i + 1)).rotation.z = camera.rotation.z;

		}
	}

	//			sun1.rotation.y = camera.rotation.y;
	//			sun1.rotation.x = camera.rotation.x;
	//			sun1.rotation.z = camera.rotation.z;
	if(camera.rotation.y < 1 && camera.rotation.y > -1 && camera.position.z > 0 && lightFlag) {
		var opacityValue = (3 - (Math.abs(camera.rotation.y) * 3)).toFixed(2);
		if(opacityValue > 1) {
			opacityValue = 1;
		} else if(opacityValue < 0) {
			opacityValue = 0;
		}

		getElementFormArr("light1").material.opacity = opacityValue
		getElementFormArr("light2").material.opacity = opacityValue
	} else {
		getElementFormArr("light1").material.opacity = 0
		getElementFormArr("light2").material.opacity = 0
	}

	if(lightFlag2 && false) {
		if(lightStepIndex > 0) {
			lightStepIndex--;
		} else {
			lightStepIndex = lightStep;
			playLightAnimate(lightGroup[lightIndex], true);
			lightIndex++;
			if(lightIndex > lightGroup.length - 1) {
				lightIndex = 0;
				closeLight(false);
			} else {

			}
		}
	}

	// 摄像头进入车窗内动画

	if(goInCarAnimateFlag == 1) {

		camera.position.x = goInCarFormPosition.x - goInCarFlagStepIndex * goInCarFlagStep.x / goInCarFlagStepTime;
		camera.position.y = goInCarFormPosition.y - goInCarFlagStepIndex * goInCarFlagStep.y / goInCarFlagStepTime;
		camera.position.z = goInCarFormPosition.z - goInCarFlagStepIndex * goInCarFlagStep.z / goInCarFlagStepTime;
		controls.target.z = goInCarFlagStepIndex * 50 / goInCarFlagStepTime;
		goInCarFlagStepIndex++;
		if(goInCarFlagStepIndex >= goInCarFlagStepTime) {
			//					&&camera.position.x<doorPosition.x
			goInCarAnimateFlag = 0;
			setTimeout(function() {
				goInCarAnimateFlag = 2;
			}, 500)

		}
	} else if(goInCarAnimateFlag == 2) {
		goInCarFlagStepIndex2++;
		camera.position.x = doorPosition.x + goInCarFlagStepIndex2 * (innerPosition.x - doorPosition.x) / goInCarFlagStepTime2;
		camera.position.y = doorPosition.y + goInCarFlagStepIndex2 * (innerPosition.y - doorPosition.y) / goInCarFlagStepTime2;
		camera.position.z = doorPosition.z + goInCarFlagStepIndex2 * (innerPosition.z - doorPosition.z) / goInCarFlagStepTime2;

		if(goInCarFlagStepIndex2 >= goInCarFlagStepTime2) {
			goInCarAnimateFlag = 3;
		}
	} else if(goInCarAnimateFlag == 4) {
		goInCarFlagStepIndex2--;
		camera.position.x = doorPosition.x + goInCarFlagStepIndex2 * (innerPosition.x - doorPosition.x) / goInCarFlagStepTime2;
		camera.position.y = doorPosition.y + goInCarFlagStepIndex2 * (innerPosition.y - doorPosition.y) / goInCarFlagStepTime2;
		camera.position.z = doorPosition.z + goInCarFlagStepIndex2 * (innerPosition.z - doorPosition.z) / goInCarFlagStepTime2;

		if(goInCarFlagStepIndex2 <= 0) {
			goInCarAnimateFlag = 0;
			setTimeout(function() {
				goInCarAnimateFlag = 5;
			}, 500);

		}
	} else if(goInCarAnimateFlag == 5) {
		camera.position.x = goInCarFormPosition.x - goInCarFlagStepIndex * goInCarFlagStep.x / goInCarFlagStepTime;
		camera.position.y = goInCarFormPosition.y - goInCarFlagStepIndex * goInCarFlagStep.y / goInCarFlagStepTime;
		camera.position.z = goInCarFormPosition.z - goInCarFlagStepIndex * goInCarFlagStep.z / goInCarFlagStepTime;
		controls.target.z = goInCarFlagStepIndex * 50 / goInCarFlagStepTime;
		goInCarFlagStepIndex--;
		if(goInCarFlagStepIndex <= 0) {
			//					&&camera.position.x<doorPosition.x
			goInCarAnimateFlag = 0;
			goInCarFlag = false;
			controls.enableRotate = true

		}
	}

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

$(document).ready(function() {
	preload();
	render();

	renderer.render(scene, camera);
	scene.background = new THREE.CubeTextureLoader()
		.setPath("assets/img/skybox/")
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ])

	document.addEventListener('mousedown', onDocumentMouseDown, false);

	$(".car-btn").click(function() {
		var index = $(this).index();
		fbxChangeColor(index);
	});

	$(".light-btn").click(function() {
		lightFlag = !lightFlag;
	});

	$(".light-btn2").click(function() {

		closeLight(false);
		lightFlag2 = !lightFlag2;

	});

	$(".home-btn").click(function() {
		showSceneAnimate();
	});

	$("img").click(function(e) {
		e.preventDefault();
	});

	setTimeout(function() {
		var color1 = {
			r: 1,
			g: 1,
			b: 1
		}

		carFbx.children[44].material[1].color.r = color1.r;
		carFbx.children[44].material[1].color.g = color1.g;
		carFbx.children[44].material[1].color.b = color1.b;

	}, 1000);
	var imgLoader = new imageLoad();
	imgLoader.queueImage(appModel.preloadImage).imageLoadingProgressCallback(function(a) {

			//var a = Math.floor(a); // 获取当前载入图片的百分比
			// 按照当前的百分比可以执行自定义操作
			console.log(a)
		},
		function() {
			console.log("end");
		}
	);
})