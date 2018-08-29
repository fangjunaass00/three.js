var cloud;
var model1, model2, model3;
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
			x: 0,
			y: 20,
			z: -100
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

		appModel.threeSceneObject.camera.up.x = 0;
		appModel.threeSceneObject.camera.up.y = 1;
		appModel.threeSceneObject.camera.up.z = 0;

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
		appModel.threeSceneObject.scene.fog = new THREE.Fog(0xffffff, 200, 1300);
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
		}
		//设置实时更新网格的顶点信息

		var controls = appModel.threeSceneObject.controls;

		var delta = clock.getDelta();
		var camera = appModel.threeSceneObject.camera;

		controls.update(delta); //更新时间

		appModel.threeSceneObject.render.render(appModel.threeSceneObject.scene, appModel.threeSceneObject.camera);

		requestAnimationFrame(appController.render);

	},

	addFbxObj: function() {
		var loader = new THREE.FBXLoader();
		var scene = appModel.threeSceneObject.scene;
		loader.load('assets/obj/bmw01.fbx', function(object) {
			console.log(object)
			var carFbx = object;
			var size = 1;
			var transparent = true;
			var opacity = 0.6;
			var vertexColors = true;
			var sizeAttenuation = true;
			var color = 0xffffff;

			var texture = new THREE.TextureLoader().load("assets/img/shinning.png");

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

			var geom = new THREE.Geometry();
			model1 = carFbx.children[1].geometry.attributes.position.array;
			model2 = carFbx.children[2].geometry.attributes.position.array;
			model3 = carFbx.children[3].geometry.attributes.position.array;
			model2 = chargeArr(model1, model2);
			model3 = chargeArr(model1, model3);

			//			setTimeout(function() {
			//				inittween(model1, model2);
			//			}, 5000)

			var truePostion = model1;
			for(var i = 0; i < truePostion.length; i = i + 3) {
				//添加顶点的坐标
				var particle = new THREE.Vector3(truePostion[i + 1], truePostion[i + 0], truePostion[i + 2]);
				geom.vertices.push(particle);
				var color = new THREE.Color(0xffffff);
				//.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。
				//随机当前每个粒子的亮度
				//color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
				geom.colors.push(color);

			}
			cloud = new THREE.Points(geom, material);
			cloud.verticesNeedUpdate = true;
			scene.add(cloud);

			//console.log(carFbx.children[2].geometry.attributes.position.array);

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

function changeModel(index) {
	var vertices = cloud.geometry.vertices;

	console.log(vertices.length, model1.length / 3);

	for(var i = 0; i < model1.length / 3; i++) {
		tweenAnimate(vertices[i], i, index)
	}

	cloud.geometry.verticesNeedUpdate = true;

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

function tweenAnimate(verticles, i, modelIndex) {
	var trueModel = window["model" + (modelIndex + 1)]
	new TWEEN.Tween(verticles)
		.to({
			y: trueModel[i * 3 + 0],
			x: trueModel[i * 3 + 1],
			z: trueModel[i * 3 + 2],
		}, 2000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

}