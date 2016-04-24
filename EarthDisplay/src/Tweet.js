
import Beacon from './Beacon.js';

const canvasWrapper = document.getElementById("canvasWrapper");

export default class Tweet extends THREE.Object3D {

  constructor(data) {
    super();

    var tweetEle = document.createElement("div");
    tweetEle.className = "popupDisplay tweet";
    tweetEle.textContent = data.message;
    tweetEle.style.top = "0px";
    tweetEle.style.left = "0px";
    this.tweetEle = tweetEle;

    canvasWrapper.appendChild(tweetEle);

    var beacon = new Beacon();
    this.add(beacon);
    beacon.rotation.x = -Math.PI/2;
    beacon.position.z = -2.5;
    this.beacon = beacon;


    var updateListener = () => {
      this.update();
    };

    global.events.addEventListener('update', updateListener);

    this.addEventListener('removed', () => {
      this.destroy();
      global.events.removeEventListener('update', updateListener);
    })

    this.hovering = false;

    this.tweetEle.addEventListener('mouseover', (e) => {
      this.startHover();
    });

    this.tweetEle.addEventListener('mouseleave', (e) => {
      this.stopHover();
    });

    this.hoverTime = 0;

    this.isGoing = false;

    this.tweetEle.addEventListener('click', (e) => {
      this.onClick();
    });

  }

  startHover() {
    var children = this.tweetEle.parentNode.childNodes;
    for (var i in children) {
      var child = children[i];
      if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
        child.overrideOpacity = true;
        child.style.opacity = 0.11;
      }
    }
    this.tweetEle.overrideOpacity = true;
    this.tweetEle.style.opacity = 1;
    this.beacon.mesh.material.opacity = 1;
    this.hovering = true;
  }

  stopHover() {
    var children = this.tweetEle.parentNode.childNodes;
    for (var i in children) {
      var child = children[i];
      if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
        child.overrideOpacity = false;
      }
    }
    this.beacon.mesh.material.opacity = 0.5;
    this.hovering = false;
  }

  onClick() {
    var lol = new THREE.Vector3(0,0,0);
    this.localToWorld(lol);
    // camera.position.copy( lol );

    this.goal = lol.multiplyScalar(1.2);
    this.isGoing = true;
    controls.enabled = false;
  }

  destroy() {
    this.tweetEle.parentNode.removeChild(this.tweetEle);
  }

  update() {

    if (this.isGoing) {
      camera.position.lerp(this.goal, 0.1);
      if ( camera.position.distanceTo(this.goal) < 0.1 ) {
        this.isGoing = false;
        controls.enabled = true;
      }
    }


    var pos3D = this.localToWorld(new THREE.Vector3(0,0,0));

    // pos3D.z += 2;

    var pos = calc3Dto2D(pos3D);
    // console.log(pos);
    this.tweetEle.style.left = Math.floor((pos.x+1)/2*window.innerWidth) + 'px';
    this.tweetEle.style.top = Math.floor(window.innerHeight-Math.floor((pos.y+1)/2*window.innerHeight)) + 'px';
    // this.tweetEle.style.opacity

    if (!this.tweetEle.overrideOpacity) {
      var dist = camera.position.length()/2;
      var opacity = (dist-camera.position.distanceTo(pos3D))/dist;
      if (opacity < 0) {
        opacity = 0;
        this.tweetEle.style.display = 'none';
      } else {
        this.tweetEle.style.display = 'inline-block';
      }

      if (opacity > 1) {
        opacity = 1;
      }

      this.tweetEle.style.opacity = opacity;
    }

    if (this.tweetEle.style.opacity <= 0) {
      this.tweetEle.style.opacity = 0;
      this.tweetEle.style.display = 'none';
    } else {
      if (this.hovering) {
        this.tweetEle.style.display = 'inline-block';
      }
    }


    this.lookAt(new THREE.Vector3(0,0,0));

  }

};
