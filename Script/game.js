/**
 * Created by dylan on 21-Apr-16.
 */



var AssetMgr = new AssetManager();
AssetMgr.queueDownload("Images/ball3.png");
AssetMgr.queueDownload("Images/g.png");
AssetMgr.queueDownload("Images/post.png");
AssetMgr.downloadAll(start);
var game=new GameEngine();
game.init();
//Declaring Objects
var canvas=document.getElementById("game");
var ctx = canvas.getContext('2d');

var ball= new Entity ('Images/ball3.png',{x:0,y:0,width:708,height:724} );
var goalkeeperLeft= new Entity ('Images/g.png',{x:828,y:444,width:279,height:120});
var goalKeeperCenter=new Entity ('Images/g.png',{x:50,y:55,width:125,height:216});
var goalKeeperRight=new Entity ('Images/g.png',{x:820,y:170,width:275,height:115});

var factoryPhysicalBody={ball:{name:"ball",shape:'circle',density:1,friction:0.3,restitution:0.6, x:canvas.width/2,y:canvas.height*0.8, type:'d',radius:25,width:50,height:50},
  keeperCenter:{name:"keeperCenter",shape:'null',density:1,friction:0.3,restitution:0.6, x:canvas.width/2,y:canvas.height*0.3,width:125,height:216, type:'k'},
  keeperLeft:{name:"keeperLeft",shape:'null',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)-216, y:(canvas.height*0.3),width:300,height:100, type:'k'},
  keeperRight:{name:"keeperRight",shape:'null',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)+220, y:(canvas.height*0.3),width:275,height:115, type:'k'},

  //now physical objects
  goal:{name:"goal",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2), y:(canvas.height*0.15),width:700,height:10, type:'k'},
  keeperHands:{name:"keeperHands",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2), y:(canvas.height*0.3),width:100,height:30, type:'s'},
  keeperLeftStop:{name:"keeperLeftStop",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)-216, y:(canvas.height*0.3),width:300,height:10, type:'k'},
  keeperRightStop:{name:"keeperRightStop",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)+220, y:(canvas.height*0.3),width:275,height:10, type:'k'}
};
//osds

console.log(canvas.width);
box2d.init();

box2d.createCircle(factoryPhysicalBody.ball);
box2d.createRectangle(factoryPhysicalBody.keeperRightStop);
box2d.createRectangle(factoryPhysicalBody.keeperHands);
//box2d.createRectangle(factoryPhysicalBody.keeperLeftStop);
box2d.createRectangle(factoryPhysicalBody.goal);
box2d.CollisionDetection();

function start() {
  var timeStep = 1/60;
  var velocityIterations = 8;
  var positionIterations = 3;
  function animate(){
    box2d.world.Step(1 / 60, 8, 3);

    //box2d.destroyBody("keeperLeft");
    box2d.world.ClearForces();
   box2d.world.DrawDebugData();
  box2d.drawDebug();
    goalkeeperLeft.draw(ctx,factoryPhysicalBody.keeperLeft);
    goalKeeperRight.draw(ctx,factoryPhysicalBody.keeperRight);
    goalKeeperCenter.draw(ctx,factoryPhysicalBody.keeperCenter);
    ball.draw(ctx,factoryPhysicalBody.ball);
    drawGoalPost();
    setTimeout(animate, timeStep);
  }
animate();
};

function drawGoalPost(){
  this.sprite=AssetMgr.getAsset("Images/post.png");
  ctx.drawImage(this.sprite,(canvas.width/2)-400,(canvas.height*0.3)-213,800,216)
}
