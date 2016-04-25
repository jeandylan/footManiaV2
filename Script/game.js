/**
 * Created by dylan on 21-Apr-16.
 */



var AssetMgr = new AssetManager();
AssetMgr.queueDownload("Images/ball3.png");
AssetMgr.queueDownload("Images/g.png");
AssetMgr.queueDownload("Images/post.png");
AssetMgr.queueDownload("Images/e.png");
AssetMgr.downloadAll(start);
var game=new GameEngine();
game.init();
box2d.init();
//Declaring Objects
var canvas=document.getElementById("game");
var ctx = canvas.getContext('2d');

  var factoryPhysicalBody={
  goal:{name:"goal",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2), y:(canvas.height*0.15),width:700,height:10, type:'k'},
  keeperHands:{name:"keeperCenter",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)+10, y:(canvas.height*0.3),width:120,height:30, type:'s'},
  keeperLeft:{name:"keeperLeft",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)-216, y:(canvas.height*0.3),width:310,height:10, type:'k'},
  keeperRight:{name:"keeperRight",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:(canvas.width/2)+220, y:(canvas.height*0.3),width:275,height:10, type:'k'},
    ball:{name:"ball",shape:'circle',density:1,friction:0.3,restitution:0.6, x:canvas.width/2,y:canvas.height*0.8, type:'d',radius:25,width:50,height:50},
    wallLeft:{name:"wallLeft",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:0, y:0,width:10,height:canvas.height*2, type:'s'},
    wallRight:{name:"wallRight",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:canvas.width, y:0,width:10,height:canvas.height*2, type:'s'},
    wallTop:{name:"wallTop",shape:'rectangle',density:1,friction:0.3,restitution:0.6, x:0, y:0,width:canvas.width*2,height:10, type:'s'}
};
//osds



var goalKeeperCenter=new Entity ('Images/g.png',{x:50,y:55,width:125,height:216},{x:canvas.width/2,y:canvas.height*0.3,width:125,height:216 ,name:"keeperCenter"},{x:0,y:90},'s',5);
var goalKeeperLeft= new Entity ('Images/g.png',{x:828,y:444,width:279,height:120},{x:(canvas.width/2)-216, y:(canvas.height*0.3),width:300,height:100,name:'keeperLeft'},{x:0,y:50},'s',5);
var goalKeeperRight=new Entity ('Images/g.png',{x:820,y:170,width:275,height:115},{x:(canvas.width/2)+220, y:(canvas.height*0.3),width:275,height:115,name:'keeperRight'},{x:0,y:50},'s',5);
var ball= new Entity ('Images/ball3.png',{x:0,y:0,width:708,height:724},{x:canvas.width/2,y:canvas.height*0.8,width:50,height:50,name:'ball'},{x:0,y:0},'d',0);

var goalPost=new Entity("Images/post.png",{x:0,y:0,width:573,height:224},{x:(canvas.width/2)-400,y:(canvas.height*0.3)-213,width:800,height: 216,name:"goalpost"},null,'i',6);
var netStill=new Entity('Images/e.png',{x:0,y:0,width:497,height:127},{x:(canvas.width/2)-350,y:(canvas.height*0.3)-165,width:710,height: 130,name:"netStill"},null,'i',6);


game.addSprite(goalPost);
game.addSprite(netStill);
game.addSprite(goalKeeperCenter);
game.addSprite(ball);

game.addBody(factoryPhysicalBody.keeperHands);
game.addBody(factoryPhysicalBody.wallLeft);
game.addBody(factoryPhysicalBody.goal);
game.addBody(factoryPhysicalBody.ball);
game.addBody(factoryPhysicalBody.wallRight);
game.addBody(factoryPhysicalBody.wallTop);

//game.addSprite(goalPost);
//game.addSprite(goalKeeperCenter);

ball.dynamic=true;
//box2d.createRectangle(factoryPhysicalBody.keeperRightStop);
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
    //goalkeeperLeft.draw(ctx,factorySprite.keeperLeft);

  game.draw(ctx);
    update();
  // drawGoalPost();
    box2d.drawDebug();
    setTimeout(animate, timeStep);
  }
animate();

};
game.view();
function drawGoalPost(){
  this.sprite=AssetMgr.getAsset("Images/post.png");
  ctx.drawImage(this.sprite,(canvas.width/2)-400,(canvas.height*0.3)-213,800,216);
}

function update() {
  updateGameKeyBoardEvents();

}
function updateGameKeyBoardEvents(){
  if (game.updateKeyboard) {
    switch (game.move) {
      case "l":
        game.removeCurrentKeeper();
        game.addBody (factoryPhysicalBody.keeperLeft);
        game.addSprite (goalKeeperLeft);
        break;
      case "r":
        game.removeCurrentKeeper();
        game.addBody (factoryPhysicalBody.keeperRight);
        game.addSprite (goalKeeperRight);
        break;
      case "u":
        game.removeCurrentKeeper();
        game.addBody (factoryPhysicalBody.keeperHands);
        game.addSprite (goalKeeperCenter);
        break;
    }
    game.updateKeyboard=false;
  }
}
$( document ).ready(function() {
  var that=game;
  var x= document.getElementById('game');
  var hammer    = new Hammer.Manager(x);
  var swipe     = new Hammer.Swipe();
  hammer.add(swipe);
  hammer.on('swipeleft', function(){
    game.updateKeyboard=true;
    that.move='l';
  });
  hammer.on('swipeup', function(){
    game.updateKeyboard=true;
    that.move='u';
  });
  hammer.on('swipedown', function(){
    game.updateKeyboard=true;
    that.move='d';
  });
  hammer.on('swiperight', function(){
    game.updateKeyboard=true;
    that.move='r';
  });
});


