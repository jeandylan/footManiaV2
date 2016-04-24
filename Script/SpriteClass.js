/**
 * Created by dylan on 21-Apr-16.
 */
function GameEngine(){
  this.entities=[];
  this.keyboard=null;
  this.mouse=null;
  this.scale=1;
}
GameEngine.prototype.init=function () {
  var canvas=document.getElementById("game");
 this.captureKeyboard();//works
  this.AjustCanvas();
  this.width=0;
  this.height=0;
}
GameEngine.prototype.captureKeyboard=function (){
    var that = this;
    window.addEventListener("keydown", function(e) {
      var keyboardValue={left:37,right:39,down:40,up:38}
      switch(e.keyCode) {
        case keyboardValue.left:
          this.keyboard='l';
          break;
        case keyboardValue.up:
          this.keyboard='u';
          break;
        case keyboardValue.right:
          this.keyboard='r';
          break;
        case keyboardValue.down:
          this.keyboard='d';

          break;
      }
    }, false);

}
GameEngine.prototype.addEntity = function(entity) {
  this.entities.push(entity);
}
GameEngine.prototype.AjustCanvas=function(){

  function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var screenRatio;
    var realWidth;
    var realHeight;
    if(width > height)
    {
      realWidth = width;
      realHeight = height;
    }
    else
    {
      realWidth = height;
      realHeight = width;
    }
    screenRatio = (realHeight / realWidth);
    if(isNaN(screenRatio))
    {
      if(screen.width > screen.height)
      {
        realWidth = screen.width;
        realHeight = screen.height;
      }
      else
      {
        realWidth = screen.height;
        realHeight = screen.width;
      }
      screenRatio = (realHeight / realWidth);
    }
    var canvas = document.getElementById('game');
this.width=realWidth;
    this.height=realHeight;
    canvas.width = realWidth;
    canvas.height = realHeight
  }

  window.addEventListener('resize', resize, false);
  resize();
}




function Entity(path,spriteCoordinates){
 this.spriteCoordinates=spriteCoordinates;
  this.path=path;
  this.sprite=AssetMgr.getAsset(this.path);
}
Entity.prototype.drawSpriteCenter = function(ctx) {

  var centerX = this.pos.x - this.sprite.width/2;
  var centerY = this.pos.y - this.sprite.height/2;
  ctx.drawImage(this.sprite,centerX,centerY);
}
//only thing needed was postion from sprite sheet
//everything depends on physical body
Entity.prototype.draw = function(ctx,PhysicalBody) {
  if(PhysicalBody.shape=="circle") {
    pos = box2d.getMapBodyPositionCanvasCircle (PhysicalBody.name);
  }
  if(PhysicalBody.shape=="rectangle"){
    pos = box2d.getMapBodyPositionCanvas(PhysicalBody.name);
  }
  if(PhysicalBody.shape=="null"){
    pos={x:PhysicalBody.x-(PhysicalBody.width/2),y:PhysicalBody.y-(PhysicalBody.height/2)};
  }

 ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,pos.x,pos.y,PhysicalBody.width,PhysicalBody.height);
}

//-----ball functions