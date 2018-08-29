var appModel = {
	preloadImage: [
		"assets/img/skybox3/nx.jpg",
		"assets/img/skybox3/ny.jpg",
		"assets/img/skybox3/nz.jpg",
		"assets/img/skybox3/px.jpg",
		"assets/img/skybox3/py.jpg",
		"assets/img/skybox3/pz.jpg",
	],
	threeSceneObject: {
		camera: null,
		orbitControl: null,
		scene: null,
		render: null,
		controls: null,
		clock: null,
		//点击射线
		raycaster: new THREE.Raycaster(),
		mouse: new THREE.Vector2(),
	},
	threeObject: {
		backgroundShadow: null,
		groundPlate: null,
		carFbx: null,
	},
	carColor: {
		color1: {
			r: 1,
			g: 0.0784313753247261,
			b: 0.6196078658103943
		},
		color2: {
			r: 0.0784313753247261,
			g: 0.0784313753247261,
			b: 0.6196078658103943
		},
		color3: {
			r: 0.6196078658103943,
			g: 0.0784313753247261,
			b: 0.6196078658103943
		}
	},
	objectsArr: [],
	carPaintArr: [],
	flags: {
		sceneIsMoving: false,
		goInCarFlag: false,
		goInCarAnimateFlag: 0,
		lightFlag: false,
		lightFlag2: false,
	},
	objectPosition: {
		doorPosition: {
			x: 10,
			y: 15,
			z: 3
		},
		innerPosition: {
			x: 4,
			y: 8,
			z: -2
		},
		cameraPosition: {
			x: 0,
			y: 20,
			z: -50
		}
	},
	temporarySign: {
		autoRotateMax: 60 * 5,
		autoRotateIndex: 60 * 5,
		goInCarFlagStep: {
			x: 0,
			y: 0,
			z: 0
		},
		goInCarFlagStepTime: 30 * 3,
		goInCarFlagStepTime2: 30,
		goInCarFlagStepIndex: 0,
		goInCarFlagStepIndex2: 0,
		goInCarFormPosition: {}
	}
};

var appController = {
	init: function() {
		appController.initThree();
		appController.initCamera();
		appController.initScene();
		appController.initLight();

		appController.addclickboard();
		appController.addGround();
		appController.addFbxObj();

		appController.render();

		appView.init();

	},
	initThree: function() {
		appModel.threeSceneObject.render = new THREE.WebGLRenderer({
			antialias: true
		});
		appModel.threeSceneObject.render.setPixelRatio(window.devicePixelRatio);
		appModel.threeSceneObject.render.setSize(window.innerWidth, window.innerHeight);

		//renderer.shadowMapEnabled = false;

		document.getElementById('container').appendChild(appModel.threeSceneObject.render.domElement);
		appModel.threeSceneObject.render.setClearColor(0xFFFFFF, 1.0);
	},
	initCamera: function() {
		var cameraPosition = appModel.objectPosition.cameraPosition;
		appModel.threeSceneObject.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		appModel.threeSceneObject.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

		// controls
		appModel.threeSceneObject.controls = new THREE.OrbitControls(appModel.threeSceneObject.camera, appModel.threeSceneObject.render.domElement);
		appModel.threeSceneObject.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		appModel.threeSceneObject.controls.dampingFactor = 0.25;
		appModel.threeSceneObject.controls.screenSpacePanning = false;
		//appModel.threeSceneObject.controls.minDistance = 50;
		appModel.threeSceneObject.controls.maxDistance = 100

		appModel.threeSceneObject.controls.minPolarAngle = Math.PI / 12;
		appModel.threeSceneObject.controls.maxPolarAngle = Math.PI / 2.5;
		// 自动旋转
		appModel.threeSceneObject.controls.autoRotate = true;
		appModel.threeSceneObject.controls.autoRotateSpeed = 0.5

		//appModel.threeSceneObject.controls.maxPolarAngle = Math.PI;

		clock = new THREE.Clock();
	},
	initScene: function() {
		appModel.threeSceneObject.scene = new THREE.Scene();
		appModel.threeSceneObject.scene.fog = new THREE.Fog(0xffffff, 200, 1300);
	},
	initLight: function() {
		//			var light = new THREE.PointLight(0xFFFFFF);
		//			light.position.set(1000, 500, 1000);
		//			light.castShadow = true;
		//			scene.add(light);
		//			
//		var light2 = new THREE.PointLight(0xFFFFFF);
//		light2.position.set(6, 6, 24);
//		scene.add(light2);

		var sun1 = new THREE.DirectionalLight(0xffffff);
		sun1.position.set(-1000, 500, -1000);
		//sun1.castShadow = true;
		appModel.threeSceneObject.scene.add(sun1);

		var sun2 = new THREE.DirectionalLight(0xffffff);
		sun2.position.set(1000, 500, 1000);
		//sun2.castShadow = true;
		appModel.threeSceneObject.scene.add(sun2);
	},
	render: function() {
		var controls = appModel.threeSceneObject.controls;
		var autoRotateIndex = appController.getTemporySign("autoRotateIndex");
		if(!appModel.flags.goInCarFlag) {
			if(!appModel.flags.sceneIsMoving) {
				if(autoRotateIndex > 0) {

					appController.setTemporySign("autoRotateIndex", --autoRotateIndex);
					if(controls.autoRotate == true) {
						controls.autoRotate = false;
					}
				} else {
					if(controls.autoRotate == false) {
						controls.autoRotate = true;
					}
				}
			} else {
				autoRotateIndex = appController.getTemporySign("autoRotateMax");
				appController.setTemporySign("autoRotateIndex", autoRotateIndex);
				if(controls.autoRotate == true) {
					controls.autoRotate = false;
				}
			}
		} else {
			if(controls.autoRotate == true) {
				controls.autoRotate = false;
			}
			autoRotateIndex = appController.getTemporySign("autoRotateMax");
			appController.setTemporySign("autoRotateIndex", autoRotateIndex);
		}

		var delta = clock.getDelta();
		var camera = appModel.threeSceneObject.camera;
		var doorPosition = appModel.objectPosition.doorPosition;
		var innerPosition = appModel.objectPosition.innerPosition;
		controls.update(delta); //更新时间
		if(appController.getElementFormArr("hint1")) {
			for(var i = 0; i < 2; i++) {
				var hintElement = appController.getElementFormArr("hint" + (i + 1));
				var iconElement = appController.getElementFormArr("icon" + (i + 1));
				var lightElement = appController.getElementFormArr("light" + (i + 1));
				hintElement.rotation.y = camera.rotation.y;
				hintElement.rotation.x = camera.rotation.x;
				hintElement.rotation.z = camera.rotation.z;

				iconElement.rotation.y = camera.rotation.y;
				iconElement.rotation.x = camera.rotation.x;
				iconElement.rotation.z = camera.rotation.z;

				lightElement.rotation.y = camera.rotation.y;
				lightElement.rotation.x = camera.rotation.x;
				lightElement.rotation.z = camera.rotation.z;

			}
		}

		//			sun1.rotation.y = camera.rotation.y;
		//			sun1.rotation.x = camera.rotation.x;
		//			sun1.rotation.z = camera.rotation.z;

		if(camera.rotation.y < 1 && camera.rotation.y > -1 && camera.position.z > 0 && appModel.flags.lightFlag) {
			var opacityValue = (3 - (Math.abs(camera.rotation.y) * 3)).toFixed(2);
			if(opacityValue > 1) {
				opacityValue = 1;
			} else if(opacityValue < 0) {
				opacityValue = 0;
			}

			appController.getElementFormArr("light1").material.opacity = opacityValue
			appController.getElementFormArr("light2").material.opacity = opacityValue
		} else {
			appController.getElementFormArr("light1").material.opacity = 0
			appController.getElementFormArr("light2").material.opacity = 0
		}

		if(appModel.flags.lightFlag2 && false) {
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
		var goInCarAnimateFlag = appModel.flags.goInCarAnimateFlag;
		var goInCarFlagStepTime = appController.getTemporySign("goInCarFlagStepTime");
		var goInCarFlagStepTime2 = appController.getTemporySign("goInCarFlagStepTime2");
		var goInCarFlagStepIndex = appController.getTemporySign("goInCarFlagStepIndex");
		var goInCarFlagStepIndex2 = appController.getTemporySign("goInCarFlagStepIndex2");
		var goInCarFormPosition = appController.getTemporySign("goInCarFormPosition");
		var goInCarFlagStep = appController.getTemporySign("goInCarFlagStep");

		if(goInCarAnimateFlag == 1) {

			camera.position.x = goInCarFormPosition.x - goInCarFlagStepIndex * goInCarFlagStep.x / goInCarFlagStepTime;
			camera.position.y = goInCarFormPosition.y - goInCarFlagStepIndex * goInCarFlagStep.y / goInCarFlagStepTime;
			camera.position.z = goInCarFormPosition.z - goInCarFlagStepIndex * goInCarFlagStep.z / goInCarFlagStepTime;

			controls.target.z = goInCarFlagStepIndex * 50 / goInCarFlagStepTime;
			goInCarFlagStepIndex++;
			appController.setTemporySign("goInCarFlagStepIndex", goInCarFlagStepIndex);
			if(goInCarFlagStepIndex >= goInCarFlagStepTime) {
				appModel.flags.goInCarAnimateFlag = 0;
				setTimeout(function() {
					appModel.flags.goInCarAnimateFlag = 2;
				}, 500)

			}
		} else if(goInCarAnimateFlag == 2) {
			goInCarFlagStepIndex2++;
			appController.setTemporySign("goInCarFlagStepIndex2", goInCarFlagStepIndex2);
			camera.position.x = doorPosition.x + goInCarFlagStepIndex2 * (innerPosition.x - doorPosition.x) / goInCarFlagStepTime2;
			camera.position.y = doorPosition.y + goInCarFlagStepIndex2 * (innerPosition.y - doorPosition.y) / goInCarFlagStepTime2;
			camera.position.z = doorPosition.z + goInCarFlagStepIndex2 * (innerPosition.z - doorPosition.z) / goInCarFlagStepTime2;

			if(goInCarFlagStepIndex2 >= goInCarFlagStepTime2) {
				appModel.flags.goInCarAnimateFlag = 3;
			}
		} else if(goInCarAnimateFlag == 4) {
			goInCarFlagStepIndex2--;
			appController.setTemporySign("goInCarFlagStepIndex2", goInCarFlagStepIndex2);
			camera.position.x = doorPosition.x + goInCarFlagStepIndex2 * (innerPosition.x - doorPosition.x) / goInCarFlagStepTime2;
			camera.position.y = doorPosition.y + goInCarFlagStepIndex2 * (innerPosition.y - doorPosition.y) / goInCarFlagStepTime2;
			camera.position.z = doorPosition.z + goInCarFlagStepIndex2 * (innerPosition.z - doorPosition.z) / goInCarFlagStepTime2;

			if(goInCarFlagStepIndex2 <= 0) {
				appModel.flags.goInCarAnimateFlag = 0;
				setTimeout(function() {
					appModel.flags.goInCarAnimateFlag = 5;
				}, 500);

			}
		} else if(goInCarAnimateFlag == 5) {
			camera.position.x = goInCarFormPosition.x - goInCarFlagStepIndex * goInCarFlagStep.x / goInCarFlagStepTime;
			camera.position.y = goInCarFormPosition.y - goInCarFlagStepIndex * goInCarFlagStep.y / goInCarFlagStepTime;
			camera.position.z = goInCarFormPosition.z - goInCarFlagStepIndex * goInCarFlagStep.z / goInCarFlagStepTime;
			controls.target.z = goInCarFlagStepIndex * 50 / goInCarFlagStepTime;
			goInCarFlagStepIndex--;
			appController.setTemporySign("goInCarFlagStepIndex", goInCarFlagStepIndex);
			if(goInCarFlagStepIndex <= 0) {
				//					&&camera.position.x<doorPosition.x
				appModel.flags.goInCarAnimateFlag = 0;
				appModel.flags.goInCarFlag = false;
				controls.enableRotate = true

			}
		}

		//appModel.threeSceneObject.render.render(scene, camera);
		appModel.threeSceneObject.render.render(appModel.threeSceneObject.scene, appModel.threeSceneObject.camera);

		requestAnimationFrame(appController.render);

	},
	addclickboard: function() {

		appController.create_hint_element("hint1", {
			width: 10,
			height: 10
		}, "assets/img/timg.png", {
			x: -10,
			y: 20,
			z: 0
		}, true);

		appController.create_hint_element("hint2", {
			width: 10,
			height: 10
		}, "assets/img/timg2.jpg", {
			x: 10,
			y: 20,
			z: 0
		}, true);

		appController.create_hint_element("icon1", {
			width: 2,
			height: 2
		}, "assets/img/icon.png", {
			x: -10,
			y: 10,
			z: 0
		});

		appController.create_hint_element("icon2", {
			width: 2,
			height: 2
		}, "assets/img/icon.png", {
			x: 8,
			y: 10,
			z: 0
		});

		appController.create_hint_element("icon3", {
			width: 2,
			height: 2
		}, "assets/img/icon.png", {
			x: 9,
			y: 7,
			z: 3
		});

		appController.create_hint_element("light1", {
			width: 7,
			height: 7
		}, "assets/img/shinning.png", {
			x: 6,
			y: 6,
			z: 24
		});

		appController.create_hint_element("light2", {
			width: 7,
			height: 7
		}, "assets/img/shinning.png", {
			x: -7,
			y: 6,
			z: 24
		});
	},
	addGround: function() {
		var scene = appModel.threeSceneObject.scene;
		var shadow = new THREE.PlaneGeometry(30, 50);
		var ma = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load("assets/img/shadow.png"),
			transparent: true,
		});

		appModel.threeObject.backgroundShadow = new THREE.Mesh(shadow, ma);
		appModel.threeObject.backgroundShadow.position.y = 1;
		appModel.threeObject.backgroundShadow.rotation.x = -Math.PI / 2;
		scene.add(appModel.threeObject.backgroundShadow);

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

		appModel.threeObject.groundPlate = new THREE.Mesh(arcGeometry, arcMaterial);
		appModel.threeObject.groundPlate.rotation.x = -Math.PI / 2;
		scene.add(appModel.threeObject.groundPlate)
	},
	addFbxObj: function() {
		var loader = new THREE.FBXLoader();

		loader.load('assets/obj/bmw01.fbx', function(object) {

			appModel.threeObject.carFbx = object;

			var carFbx = appModel.threeObject.carFbx;
			console.log(carFbx)
			carFbx.scale.multiplyScalar(0.1);

			var mainColor = {
				r: 1,
				g: 0.0784313753247261,
				b: 0.6196078658103943
			};
			var carPaintArr = [];
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
			appModel.carPaintArr = carPaintArr;

			//				object.mixer = new THREE.AnimationMixer(object);
			//				mixers.push(object.mixer);

			//				var action = object.mixer.clipAction(object.animations[0]);
			//				action.play();

			appModel.threeSceneObject.scene.add(carFbx);

		});
	},
	getElementFormArr: function(name) {
		var obj;
		appModel.objectsArr.map(function(item) {
			if(item.name == name) {
				obj = item;
			}
		});
		return obj;
	},
	create_hint_element: function(name, size, src, positionObj, isHint) {
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

		appModel.objectsArr.push(icon);

		if(isHint) {
			icon.visible = false;
		} else {
			appModel.threeSceneObject.scene.add(icon);
			icon.visible = true;
		}
	},
	onDocumentMouseDown: function(event) {
		event.preventDefault();
		var scene = appModel.threeSceneObject.scene;
		appModel.threeSceneObject.mouse.x = (event.clientX / appModel.threeSceneObject.render.domElement.clientWidth) * 2 - 1;
		appModel.threeSceneObject.mouse.y = -(event.clientY / appModel.threeSceneObject.render.domElement.clientHeight) * 2 + 1;
		appModel.threeSceneObject.raycaster.setFromCamera(appModel.threeSceneObject.mouse, appModel.threeSceneObject.camera);
		var intersects = appModel.threeSceneObject.raycaster.intersectObjects(appModel.objectsArr);

		if(intersects.length > 0) {
			for(var i = 0; i < intersects.length; i++) {
				if(intersects[i].object.visible == true) {
					var objectName = intersects[i].object.name;
					appModel.flags.sceneIsMoving = true;
					setTimeout(function() {
						appModel.flags.sceneIsMoving = false;
					}, 1000);

					switch(objectName) {
						case "hint1":
							appController.getElementFormArr("hint1").visible = false;
							scene.remove(appController.getElementFormArr("hint1"));
							break;
						case "hint2":
							appController.getElementFormArr("hint2").visible = false;
							scene.remove(appController.getElementFormArr("hint2"));
							break;
						case "icon1":
							appController.getElementFormArr("hint1").visible = true;
							scene.add(appController.getElementFormArr("hint1"));
							break;
						case "icon2":
							appController.getElementFormArr("hint2").visible = true;
							scene.add(appController.getElementFormArr("hint2"));
							break;
						case "icon3":
							appView.hideSceneAnimate();
							break;
					}
				}
			}

		}
	},
	getTemporySign: function(name) {
		var obj = appModel.temporarySign;
		var value;
		for(var item in obj) {
			if(item == name) {
				value = appModel.temporarySign[item];
			}

		}
		return value;
	},
	setTemporySign: function(name, value) {
		appModel.temporarySign[name] = value;
	},
	getThreeSceneObject: function(name) {

	},
	setThreeSceneObject: function(name, value) {
		appModel.threeSceneObject[name] = value;
	}

}

var appView = {
	init: function() {
		appModel.threeSceneObject.scene.background = new THREE.CubeTextureLoader()
			.setPath("assets/img/skybox/")
			.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

		document.addEventListener('mousedown', appController.onDocumentMouseDown, false);
		appModel.threeSceneObject.render.render(appModel.threeSceneObject.scene, appModel.threeSceneObject.camera);

		$(".car-btn").click(function() {
			var index = $(this).index();
			appView.fbxChangeColor(index);
		});

		$(".light-btn").click(function() {
			appModel.flags.lightFlag = !appModel.flags.lightFlag;
		});

		$(".light-btn2").click(function() {

			closeLight(false);
			appModel.flags.lightFlag2 = !appModel.flags.lightFlag2;

		});

		$(".home-btn").click(function() {
			appView.showSceneAnimate();
		});

		$("img").click(function(e) {
			e.preventDefault();
		});

		setTimeout(function() {
			return;
			var color1 = {
				r: 1,
				g: 1,
				b: 1
			}

			appModel.threeObject.carFbx.children[44].material[1].color.r = color1.r;
			appModel.threeObject.carFbx.children[44].material[1].color.g = color1.g;
			appModel.threeObject.carFbx.children[44].material[1].color.b = color1.b;

		}, 1000);
	},
	fbxChangeColor: function(index) {
		var trueColor;
		var carFbx = appModel.threeObject.carFbx;
		var carPaintArr = appModel.carPaintArr;
		switch(index) {
			case 0:
				trueColor = appModel.carColor.color1;
				break;
			case 1:
				trueColor = appModel.carColor.color2;
				break;
			case 2:
				trueColor = appModel.carColor.color3;
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
	},
	hideSceneAnimate: function() {
		appModel.threeSceneObject.controls.enableRotate = false
		setTimeout(function() {

			$(".shadow").css({
				opacity: 0
			}).show().animate({
				opacity: 1
			}, 700, function() {
				appView.hideScene();
				$(this).animate({
					opacity: 0
				}, 700, function() {
					$(this).hide();
				})
			});
		}, 2000)

		appModel.flags.sceneIsMoving = true;
		appModel.flags.goInCarFlag = true;
		appModel.flags.goInCarAnimateFlag = 1;

		var camera = appModel.threeSceneObject.camera;
		var doorPosition = appModel.objectPosition.doorPosition;
		var goInCarFlagStep = {
			x: (camera.position.x - doorPosition.x).toFixed(2),
			y: (camera.position.y - doorPosition.y).toFixed(2),
			z: (camera.position.z - doorPosition.z).toFixed(2)
		}

		var goInCarFormPosition = {
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z
		};

		appController.setTemporySign("goInCarFlagStep", goInCarFlagStep);
		appController.setTemporySign("goInCarFormPosition", goInCarFormPosition);
		console.log(appModel.temporarySign);

	},

	hideScene: function() {

		appView.hideObject(appModel.threeObject.carFbx);
		appView.hideObject(appModel.threeObject.groundPlate);
		appView.hideObject(appModel.threeObject.backgroundShadow);

		appModel.threeSceneObject.scene.background = new THREE.CubeTextureLoader()
			.setPath("assets/img/skybox3/")
			.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

		for(var i = 0; i < 3; i++) {
			if(!!appController.getElementFormArr("hint" + (i + 1))) {
				appView.hideObject(appController.getElementFormArr("hint" + (i + 1)))
			}

			if(appController.getElementFormArr("icon" + (i + 1))) {
				appView.hideObject(appController.getElementFormArr("icon" + (i + 1)))
			}

			if(appController.getElementFormArr("light" + (i + 1))) {
				appView.hideObject(appController.getElementFormArr("light" + (i + 1)))
			}
		}

		$(".home-btn").show();
		$(".car-btn-panel").hide();
		$(".light-btn").hide();
		$(".light-btn2").hide();
		appModel.threeSceneObject.controls.enableRotate = true;
		//			camera.lookAt({
		//				x: 9,
		//				y: 7,
		//				z: 100
		//			});

	},

	showSceneAnimate: function() {
		appModel.threeSceneObject.controls.enableRotate = false
		$(".shadow").css({
			opacity: 0
		}).show().animate({
			opacity: 1
		}, 500, function() {
			appView.showScene();
			$(this).animate({
				opacity: 0
			}, 500).hide();
		})
	},

	showScene: function() {
		appModel.flags.goInCarAnimateFlag = 4;
		appView.showObject(appModel.threeObject.carFbx);
		appView.showObject(appModel.threeObject.groundPlate);
		appView.showObject(appModel.threeObject.backgroundShadow);

		appModel.threeSceneObject.scene.background = new THREE.CubeTextureLoader()
			.setPath("assets/img/skybox/")
			.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

		for(var i = 0; i < 3; i++) {
			if(!!appController.getElementFormArr("hint" + (i + 1))) {
				appView.showObject(appController.getElementFormArr("hint" + (i + 1)))
			}

			if(appController.getElementFormArr("icon" + (i + 1))) {
				appView.showObject(appController.getElementFormArr("icon" + (i + 1)))
			}

			if(appController.getElementFormArr("light" + (i + 1))) {
				appView.showObject(appController.getElementFormArr("light" + (i + 1)))
			}
		}
		$(".car-btn-panel").show();
		$(".light-btn").show();
		$(".light-btn2").show();
		$(".home-btn").hide();

	},
	hideObject: function(obj) {
		obj.visible = false;
	},

	showObject: function(obj) {
		obj.visible = true;
	}
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
			appModel.threeObject.carFbx.children[lightItems].visible = show;
		});
	});
}

function playLightAnimate(arr, show) {
	arr.map(function(item) {
		appModel.threeObject.carFbx.children[item].visible = show;
	});
}

function addPoint() {
	var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
	var sphereMaterial = new THREE.MeshLambertMaterial({
		color: 0x7777ff
	});
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	sphere.position.set(0, 7, 10);
	appModel.threeSceneObject.scene.add(sphere);

}

var lightStep = 30;
var lightStepIndex = 30;

$(document).ready(function() {

	appController.init();

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

	appController.getTemporySign("autoRotateMax")
})