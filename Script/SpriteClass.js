/**
 * Created by dylan on 21-Apr-16.
 */
function GameEngine(){
  this.entities=[];
  this.keyboard=null;
  this.updateKeyboard=false;
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
          that.keyboard='l';
          break;
        case keyboardValue.up:
          that.keyboard='u';
          break;
        case keyboardValue.right:
          that.keyboard='r';
          break;
        case keyboardValue.down:
          that.keyboard='d';

          break;
      }
      that.updateKeyboard=true;
    }, false);

}
GameEngine.prototype.addSprite = function(entity) {
  if(entity!=undefined) {
    this.entities.push (entity);
  }

}
GameEngine.prototype.addBody=function (physicalBody) {
  box2d.createSingleBody(physicalBody);
}
GameEngine.prototype.remove=function (name) {
  for (i = 0; i < this.entities.length; i++) {
    if( this.entities[i].name === name ) {
      this.entities.splice(i ,1);
  }
  }
}
GameEngine.prototype.removeCurrentKeeper=function () {
  for (i = 0; i < this.entities.length; i++) {
    if( this.entities[i].name.startsWith("keep") ) {
      console.log("remove"+this.entities[i].name);
      box2d.destroyBody(this.entities[i].name);
      this.entities.splice(i ,1);

    }
  }
}


GameEngine.prototype.view=function () {
  for (i = 0; i < this.entities.length; i++) {
 //console.log(this.entities[i].name);
  }
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
GameEngine.prototype.draw=function (ctx) {
  for (i = 0; i < this.entities.length; i++) {
    this.entities[i].draw(ctx)

  }
}



function Entity(path,spriteCoordinates,canvasCoordinate,offset){
 this.spriteCoordinates=spriteCoordinates;
  this.path=path;
  this.name=canvasCoordinate.name;
  this.sprite=AssetMgr.getAsset(this.path);
 this.canvasCoordnate=null;
  this.canvasDimension={width:canvasCoordinate.width,height:canvasCoordinate.height}
  this.offset=offset;
  this.dynamic=false;
}
Entity.prototype.getPhysicalCoordinate=function (name) {
  return box2d.getMapBodyPositionCanvas(name);
}
Entity.prototype.drawSpriteCenter = function(ctx) {

  var centerX = this.pos.x - this.sprite.width/2;
  var centerY = this.pos.y - this.sprite.height/2;
  ctx.drawImage(this.sprite,centerX,centerY);
}
//only thing needed was postion from sprite sheet
//everything depends on physical body
Entity.prototype.draw = function(ctx) {
  if(this.dynamic){
    this.canvasCoordnate=this.getPhysicalCoordinate(this.name);
    ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,
      this.canvasCoordnate.x-this.offset.x,this.canvasCoordnate.y-this.offset.y,this.canvasDimension.width,this.canvasDimension.height);
  }
  else{
    if(this.canvasCoordnate==null && !this.dynamic) {
      this.canvasCoordnate = box2d.getMapBodyPositionCanvas (this.name);
    }
    ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,
      this.canvasCoordnate.x-this.offset.x,this.canvasCoordnate.y-this.offset.y,this.canvasDimension.width,this.canvasDimension.height);
  }
}



//-----ball functions