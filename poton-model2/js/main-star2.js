var cloud, cloud2;
var model1, model2, model3;
var renderstep = 0;
var nowModel = 1;
var carSize = 1;
var particleArr = [];
var maxSize = 10000
var appModel = {
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

	objectsArr: [],
	carPaintArr: [],
	flags: {
		sceneIsMoving: false,
		goInCarFlag: false,
		goInCarAnimateFlag: 0,
		lightFlag: false,
		lightFlag2: false,
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
	},
	objectPosition: {
		cameraPosition: {
			x: 150 * Math.cos(Math.PI / 2 * 1.8),
			y: 50,
			z: 150 * Math.sin(Math.PI / 2 * 1.8)
		}
	},
};

var appController = {
	init: function() {
		appController.initThree();
		appController.initCamera();
		appController.initScene();
		appController.initLight();

		appController.addFbxObj();
		appController.addGround();
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
		appModel.threeSceneObject.render.setClearColor(0x000000, 1.0);
	},
	initCamera: function() {
		var cameraPosition = appModel.objectPosition.cameraPosition;
		appModel.threeSceneObject.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		appModel.threeSceneObject.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

		//		appModel.threeSceneObject.camera.up.x = 0;
		//		appModel.threeSceneObject.camera.up.y = 0;
		//		appModel.threeSceneObject.camera.up.z = 1;

		// controls
		appModel.threeSceneObject.controls = new THREE.OrbitControls(appModel.threeSceneObject.camera, appModel.threeSceneObject.render.domElement);
		appModel.threeSceneObject.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		appModel.threeSceneObject.controls.dampingFactor = 0.25;
		appModel.threeSceneObject.controls.screenSpacePanning = false;

		// 自动旋转
		//appModel.threeSceneObject.controls.autoRotate = true;
		appModel.threeSceneObject.controls.autoRotateSpeed = 0.5

		//appModel.threeSceneObject.controls.maxPolarAngle = Math.PI;

		clock = new THREE.Clock();
	},
	initScene: function() {
		appModel.threeSceneObject.scene = new THREE.Scene();
		//		appModel.threeSceneObject.scene.fog = new THREE.Fog(0x000000, 90, 400);
		// appModel.threeSceneObject.scene.fog = new THREE.FogExp2(0xff0000, 0.02);

	},
	initLight: function() {

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
		TWEEN.update();
		renderstep++;
		if(!!cloud2) {
			var vertices = cloud2.geometry.vertices;
			vertices.forEach(function(v) {

				v.y = v.y - (v.velocityY);
				v.x = v.x - (v.velocityX) * .5;

				if(v.y <= -60) v.y = 60;
				if(v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
			});

			//设置实时更新网格的顶点信息
			cloud2.geometry.verticesNeedUpdate = true;
		}
		//		if(!!cloud) {
		//			var vertices = cloud.geometry.vertices;
		//			
		//			for(var i=0;i<model1.length/3;i++){
		//				var stepx=model2[i*3]-model1[i*3];
		//				var stepy=model2[i*3+1]-model1[i*3+1]
		//				var stepz=model2[i*3+2]-model1[i*3+2]
		//				
		////				if(model1[i]+stepx/10=model2[i]){
		////					
		////				}else{
		////					vertices[i].x=model1[i*3+0]+stepx/10;
		////					vertices[i].y=model1[i*3+1]+stepy/10;
		////					vertices[i].z=model1[i*3+2]+stepz/10;
		////					
		////				}
		//				if(i<11){
		//					vertices[i].x=model1[i*3+0]+stepx/10*i;
		//					vertices[i].z=model1[i*3+2]+stepz/10*i;
		//					vertices[i].y=model1[i*3+1]+stepy/10*i;
		//				}
		//			
		//			}
		//			cloud.geometry.verticesNeedUpdate = true;
		//		}
		if(!!cloud) {
			cloud.geometry.verticesNeedUpdate = true;
			cloud.geometry.colorsNeedUpdate = true;
			//			if(renderstep % 5 == 1) {
			//				for(var i = 0; i < cloud.geometry.colors.length; i++) {
			//					var ticket = Math.random() > 0.5 ? true : false;
			//					if(ticket == true) {
			//						cloud.geometry.colors[i].g = 0;
			//						cloud.geometry.colors[i].b = 0;
			//						cloud.geometry.colors[i].r = 0;
			//					} else {
			//						cloud.geometry.colors[i].g = 1;
			//						cloud.geometry.colors[i].b = 1;
			//						cloud.geometry.colors[i].r = 1;
			//					}
			//				}
			//			}

			if(renderstep % 5 == 1 && !changeFlag) {
				var vertices = cloud.geometry.vertices;
				var trueModel = window["model" + nowModel];
				for(var i = 0; i < cloud.geometry.colors.length; i++) {
					var ticket = Math.random() > 0.8 ? true : false;
					if(ticket == true) {
						vertices[i].x = 0;
						vertices[i].y = 0;
						vertices[i].z = 0;

					} else {
						vertices[i].x = trueModel[i * 3 + 0] * carSize;
						vertices[i].y = trueModel[i * 3 + 2] * carSize;
						vertices[i].z = trueModel[i * 3 + 1] * carSize;
					}
				}
			}

		}

		if(particleArr.length > 0) {
			particleArr.map(function(item) {
				var ticket = Math.random() > 0.8 ? true : false;
				if(ticket > 0.8) {
					item.visible = false;
				} else {
					item.visible = true;
				}
			})
		}
		//设置实时更新网格的顶点信息

		var controls = appModel.threeSceneObject.controls;

		var delta = clock.getDelta();
		var camera = appModel.threeSceneObject.camera;

		controls.update(delta); //更新时间

		appModel.threeSceneObject.render.render(appModel.threeSceneObject.scene, appModel.threeSceneObject.camera);

		requestAnimationFrame(appController.render);

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
		var scene = appModel.threeSceneObject.scene;
		loader.load('assets/obj/bmw01.fbx', function(object) {
			console.log(object);
			//scene.add(object)
			createParticles();
			var carFbx = object;
			var size = 1;
			var transparent = true;
			var opacity = 1;
			var vertexColors = true;
			var sizeAttenuation = true;
			var color = "0xffffff";

			var texture = new THREE.TextureLoader().load("assets/img/shinning2.png");
			var texture2 = generateSprite()

			//样式化粒子的THREE.PointCloudMaterial材质
			var material = new THREE.PointsMaterial({
				size: size,
				transparent: transparent,
				opacity: opacity,
				vertexColors: vertexColors,
				sizeAttenuation: sizeAttenuation,
				color: color,
				map: texture,

				depthTest: false //设置解决透明度有问题的情况
			});

			var material2 = new THREE.SpriteMaterial({
				map: texture,
				blending: THREE.AdditiveBlending
			});

			var geom = new THREE.Geometry();
			model1 = carFbx.children[1].geometry.attributes.position.array;
			model2 = carFbx.children[8].geometry.attributes.position.array;
			model3 = carFbx.children[32].geometry.attributes.position.array;
			model2 = chargeArr(model1, model2);
			model3 = chargeArr(model1, model3);

			//			setTimeout(function() {
			//				inittween(model1, model2);
			//			}, 5000)

			var truePostion = model1;
			//			for(var i = 0; i < truePostion.length; i = i + 3) {
			//				//添加顶点的坐标
			//				var particle = new THREE.Vector3(truePostion[i + 0] * carSize, truePostion[i + 2] * carSize, truePostion[i + 1] * carSize);
			//				geom.vertices.push(particle);
			//				var color = new THREE.Color(0xffffff);
			//				//.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。
			//				//随机当前每个粒子的亮度
			//				//color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
			//				geom.colors.push(color);
			//
			//			}
			//			cloud = new THREE.Points(geom, material);
			//			cloud.verticesNeedUpdate = true;
			//			scene.add(cloud);
			loading.cancelLoading();
			//console.log(carFbx.children[2].geometry.attributes.position.array);

			console.log("添加新粒子")
			for(var i = 0; i < maxSize; i++) {

				var particle = new THREE.Sprite(material2);
				particle.position.set(truePostion[i * 3 + 0] * carSize, truePostion[i * 3 + 2] * carSize, truePostion[i * 3 + 1] * carSize)

				//initParticle(particle, i * 10);
				particle.scale.x = particle.scale.y = 1;
				particleArr.push(particle);
				scene.add(particle);
			}
			console.log("添加完毕")

		});
	},
	getThreeSceneObject: function(name) {

	},
	setThreeSceneObject: function(name, value) {
		appModel.threeSceneObject[name] = value;
	}

}

var appView = {
	init: function() {
		//		appModel.threeSceneObject.scene.background = new THREE.CubeTextureLoader()
		//			.setPath("assets/img/skybox/")
		//			.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);

		document.addEventListener('mousedown', appController.onDocumentMouseDown, false);
		appModel.threeSceneObject.render.render(appModel.threeSceneObject.scene, appModel.threeSceneObject.camera);

		$(".car-btn").click(function() {
			var index = $(this).index();
			changeModel(index);
		});

		$("img").click(function(e) {
			e.preventDefault();
		});

	},

}

$(document).ready(function() {

	appController.init();

})

var changeFlag = false;

function changeModel(index) {
	if(!changeFlag) {
		changeFlag = true;
		nowModel = index + 1;
		//		var vertices = cloud.geometry.vertices;
		//
		//		for(var i = 0; i < model1.length / 3; i++) {
		//			tweenAnimate(vertices[i], i, index)
		//		}
		var trueModel = window["model" + (index + 1)];
		for(var i = 0; i < maxSize; i++) {

			new TWEEN.Tween(particleArr[i].position)
				.to({
					x: trueModel[i * 3 + 0] * carSize,
					y: trueModel[i * 3 + 2] * carSize,
					z: trueModel[i * 3 + 1] * carSize,
				}, 2000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.start();
		}

		//cloud.geometry.verticesNeedUpdate = true;
		setTimeout(function() {
			changeFlag = false;
		}, 1950)
	}

}

function inittween(model1, model2) {
	return
	var option = {
		position: model1
	};

	var tween = new TWEEN.Tween(option)
		.to({
			position: [model1, model2]

		}, 10000)
		.onUpdate(function() {
			var vertices = cloud.geometry.vertices;
			var index = 0;
			console.log(vertices.length, model1.length / 3)
			for(var i = 0; i < model1.length; i = i + 3) {
				//	console.log(vertices[i])
				if(!!vertices[i]) {
					vertices[i / 3].x = this.position[i];
					vertices[i / 3].y = this.position[i + 1];
					vertices[i / 3].z = this.position[i + 2];
				}

			}

			//设置实时更新网格的顶点信息
			cloud.geometry.verticesNeedUpdate = true;

		})
		.delay(1000)
		.start();
}

function chargeArr(arr1, arr2) {
	var index = 0;
	var template = arr2;
	var newarr = [];
	var length = 0;
	for(var i = 0; i < arr1.length; i++) {

		if(!template[i - length]) {
			length += template.length;
		} else {

		}
		newarr[i] = template[i - length];

	}
	return newarr;
}
var tweenInstance;

function initTweenInstance() {

}

function tweenAnimate(verticles, i, modelIndex) {

	var trueModel = window["model" + (modelIndex + 1)];

	tweenInstance = new TWEEN.Tween(verticles)
		//	.stop()
		.to({
			x: trueModel[i * 3 + 0] * carSize,
			y: trueModel[i * 3 + 2] * carSize,
			z: trueModel[i * 3 + 1] * carSize,

		}, 2000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

}

function generateSprite() {

	var canvas = document.createElement('canvas');
	canvas.width = 16;
	canvas.height = 16;

	var context = canvas.getContext('2d');
	context.fillStyle = 'rgba(255, 255, 255, 0)';
	var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
	gradient.addColorStop(0, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.6, 'rgba(255,255,255,0)');
	gradient.addColorStop(1, 'rgba(0,0,0,0)');

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
	//return canvas;

}

function createParticles() {
	var scene = appModel.threeSceneObject.scene;
	var size = 3;
	var transparent = true;
	var opacity = 0.6;
	var vertexColors = true;
	var sizeAttenuation = true;
	var color = "0xffffff";

	var texture = new THREE.TextureLoader().load("assets/img/shinning2.png");
	//存放粒子数据的网格
	var geom = new THREE.Geometry();
	//样式化粒子的THREE.PointCloudMaterial材质
	var material = new THREE.PointsMaterial({
		size: size,
		transparent: transparent,
		opacity: opacity,
		vertexColors: vertexColors,
		sizeAttenuation: sizeAttenuation,
		color: color,
		map: texture,
		depthTest: false //设置解决透明度有问题的情况
	});

	var range = 120;
	for(var i = 0; i < 100; i++) {
		//添加顶点的坐标
		var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
		particle.velocityY = 0.1 + Math.random() / 5;
		particle.velocityX = (Math.random() - 0.5) / 3;
		geom.vertices.push(particle);
		var color = new THREE.Color(0xffffff);
		//.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。
		//随机当前每个粒子的亮度
		//color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
		geom.colors.push(color);
	}

	//生成模型，添加到场景当中
	cloud2 = new THREE.Points(geom, material);
	cloud2.verticesNeedUpdate = true;

	scene.add(cloud2);
}

function initParticle(particle, delay) {

	var particle = this instanceof THREE.Sprite ? this : particle;
	var delay = delay !== undefined ? delay : 0;

	particle.position.set(0, 0, 0);
	particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

	new TWEEN.Tween(particle)
		.delay(delay)
		.to({}, 10000)
		.onComplete(initParticle)
		.start();

	new TWEEN.Tween(particle.position)
		.delay(delay)
		.to({
			x: Math.random() * 4000 - 2000,
			y: Math.random() * 1000 - 500,
			z: Math.random() * 4000 - 2000
		}, 10000)
		.start();

	new TWEEN.Tween(particle.scale)
		.delay(delay)
		.to({
			x: 0.01,
			y: 0.01
		}, 10000)
		.start();

}