### three.js基础结构

#### 目录
一个three.js项目至少需要的东西有——  

 - [ ] scene：场景
 - [ ] camera：摄像机
 - [ ] render：渲染器
 - [ ] light：灯光
 
可能需要的有——  

 - [ ] controls：摄像机控制器
 - [ ] raycaster：点击射线，用于点击事件
 - [ ] loader：加载器，特殊的物体例如模型需要使用加载器，而且不同格式的模型需要不同的加载器
 - [ ] object：场景内的物体对象

 
#### 场景
    在three.js中，场景是作为最外层容器存在的，它相当于html中的window对象，所有three.js中的对象，都可以在scene中找到。
    它作为three.js的载体，是一个可自定义的三维模拟空间，定义方式如下（改代码使用MVC结构）——
```js
initScene: function() {
        // 声明场景
		appModel.threeSceneObject.scene = new THREE.Scene();
		
		// 可选择，是否启动雾化效果，参数1是雾的颜色，参数2，3是雾化起始距离和最远距离，是以场景的坐标点(0,0,0)为起始点。
		appModel.threeSceneObject.scene.fog = new THREE.Fog(0xffffff, 200, 1300);
	}
```

### 摄像机
        摄像机，或者说它是视角，同一个场景上，不同的视角看到的内容自然会不一样。视角和场景不一样，不仅仅是需要定义，还需要在渲染器`render`中，进行进一步的设定，这里先不讲，只要知道这个摄像机的“摄像功能”需要被不停的执行，才能让三维的场景看起来动作流畅。
        这个很好理解——摄像机照出来的是照片，是静止的。但是我们看到的是场景，里面的内容是可以动的，那么这要如何实现？自然是参考动画的制作——连续切换的静止图片组成一个动图。
        摄像机的初始化方式如下：
        
```
    // 初始化摄像机
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	// 设置摄像机位置
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
```

####  摄像机的伙伴，control控制器
        摄像机也是一个物体，一个对象，但是一般的摄像机只能设置一些静态属性，如位置，朝向等等参数。但是，使用control插件，我们就可以动态的操控摄像机，如：
        OrbitControls：轨道控制器，以中心点（可自定义其他的点）为圆心，左右拉动场景可以使摄像机围绕着这个中心点旋转，旋转半径在初始化的时候设定。
        FlyControls：飞行控制器，第一人称视角控制器，一版的PFS射击游戏视角，可以使用asdw进行前后左右操控移动。
        
        
### 灯光
        场景中灯光也是必要的，没有光，场景中的任何东西就处于“看不见”状态，就像站在在一片大地上，却没有太阳，理所当然看到的是一片漆黑。
        灯光有三种光源，平行光，点光源，聚光灯光源。
        平行光类似于太阳光，点光源类似于灯泡，聚光灯如其名是个聚光灯。三种光源的效果差距在于渲染物体时物体表面上的光的范围。如果物体正对于太阳光，那么它对着平行光的面上每一个部分接收到的“阳光”都是一样的。而点光源在同样情况下，光在投射到物体表面的中心点处最强，然后逐渐衰弱。聚光灯则处于两者之间，在某一个照射范围内，内部的光可以看成是平行光，而超过这个范围，则完全看不到。           
        
        大部分情况下，点光源和平行光并没有明显的区别，不过在使用另一个系统——影子之后，差距就会出来了。太阳光下的影子和点光源下的影子差距还是挺大的。
        
        灯光的初始化如下：

```js
    // 点光源
    var light2 = new THREE.PointLight(0xFFFFFF);
	light2.position.set(6, 6, 24);
	scene.add(light2);
    
    // 平行光
	var sun1 = new THREE.DirectionalLight(0xffffff);
	sun1.position.set(-1000, 500, -1000);
	//sun1.castShadow = true;
	appModel.threeSceneObject.scene.add(sun1);
```
    可以看到，两者的初始化的方式几乎一摸一样。阳光的渲染原理其实很简单：将阳光的颜色和物体的颜色进行融合，同时显示面对阳光的对象的部分内容。所以将上述代码的光色改成红色，就会发现物体也会被染色。
    阳光照射不到的部分会显示黑色。

### 渲染器
        渲染器的核心方法只有一句：
```
render.render(scene, camera);
```
        这句话会使得整个场景的内容刷新一次，所以这个方法需要放在requestAnimationFrame中不停地执行。
        条用渲染器的render方法会刷新内容，这个内容可以是某个物体的位置移动，翻转，变形，例如摄像机，单纯的物体，也可以是随着时间而执行的某种代码，如添加倒计时，时间一到便删除某个物体。

<strong>可以说，three中所有动态活动，不管是场景视角的移动，还是物体的属性变动，其代码都会在这里执行。</strong>
        最基础的render方法如下：
```
render: function() {
	    render.render(scene, camera);
		requestAnimationFrame(appController.render);

	},
```
<strong> 第一行是一个render方法，所有的动态代码将写在这个方法中</strong>

<strong>第二行有两个render，第一个render是render渲染器，第二个是渲染器内部的方法，所以这三行的render的意义其实都不一样。这个render传入的是当前的场景对象和摄像机对象，通过他们three会计算出当前场景的"截图"</strong>

<strong>第三行使用requestAnimationFrame方法，疯狂调用render方法自身，即第一行的render，达到不停的截图，串成一个动画的效果</strong>

而render自身的初始化方法是：
```
// new 一个render对象
render = new THREE.WebGLRenderer({
			antialias: true
		});
// 设置render分辨率
render.setPixelRatio(window.devicePixelRatio);

// 设置render渲染范围大小
render.setSize(window.innerWidth, window.innerHeight);

// 将整个three场景转成canvas，放到id为container的div中。
document.getElementById('container').appendChild(render.domElement);

// 设置场景的渲染颜色和透明度
render.setClearColor(0xFFFFFF, 1.0);

```
<strong>这一段代码优先级非常高，使用three的时候，请将其第一个初始化。</strong>

