/**
 * Created by dylan on 21-Apr-16.
 */
function GameEngine(){
  this.entities=[];
  this.move=null;
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
};
GameEngine.prototype.captureKeyboard=function (){
    var that = this;
    window.addEventListener("keydown", function(e) {

      var keyboardValue={left:37,right:39,down:40,up:38}
      switch(e.keyCode) {
        case keyboardValue.left:
          that.move='l';
          break;
        case keyboardValue.up:
          that.move='u';
          break;
        case keyboardValue.right:
          that.move='r';
          break;
        case keyboardValue.down:
          that.move='d';

          break;
      }
      that.updateKeyboard=true;
    }, false);

};
  

GameEngine.prototype.addSprite = function(entity) {
  if(entity!=undefined) {
    this.entities.push (entity);
  }

};
GameEngine.prototype.addBody=function (physicalBody) {
  box2d.createSingleBody(physicalBody);
};
GameEngine.prototype.remove=function (name) {
  for (i = 0; i < this.entities.length; i++) {
    if( this.entities[i].name === name ) {
      this.entities.splice(i ,1);
  }
  }
};
GameEngine.prototype.sortZIndex=function () {
  this.entities.sort(function(a, b) {
    return b.zIndex - a.zIndex;
  });
};
GameEngine.prototype.removeCurrentKeeper=function () {
  for (i = 0; i < this.entities.length; i++) {
    if( this.entities[i].name.startsWith("keep") ) {
      console.log("remove"+this.entities[i].name);
      box2d.destroyBody(this.entities[i].name);
      this.entities.splice(i ,1);

    }
  }
};

GameEngine.prototype.view=function () {
  var out="";
  for (i = 0; i < this.entities.length; i++) {
out= out.concat(this.entities[i].name+",");
  }
  console.log(out);
}; //debug tool
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
};
GameEngine.prototype.draw=function (ctx) {
  this.sortZIndex();
  for (i = 0; i < this.entities.length; i++) {
    this.entities[i].draw(ctx)
  }
};



function Entity(path,spriteCoordinates,canvasCoordinate,offset,type,zIndex){
  this.path=path;
  this.sprite=AssetMgr.getAsset(this.path);
  this.name = canvasCoordinate.name;
  this.canvasCoordinate=canvasCoordinate;
this.staticUpdated=false;
  this.canvasCoordinateWidth=canvasCoordinate.width;
  this.canvasCoordinateHeight=canvasCoordinate.height;
  this.animate=false;
  this.zIndex=zIndex;
  this.spriteCoordinates = spriteCoordinates;
  this.offset = offset;
  this.type=type;

  };

Entity.prototype.getPhysicalCoordinate=function (name) {
  return box2d.getMapBodyPositionCanvas(name);
}

/*draw functions */
Entity.prototype.drawSpriteCenter = function(ctx) {

  var centerX = this.pos.x - this.sprite.width/2;
  var centerY = this.pos.y - this.sprite.height/2;
  ctx.drawImage(this.sprite,centerX,centerY);
}


Entity.prototype.drawDynamic=function (ctx) {
  this.canvasCoordinate=box2d.getMapBodyPositionCanvas (this.name);
  ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,
    this.canvasCoordinate.x-this.offset.x,this.canvasCoordinate.y-this.offset.y,this.canvasCoordinateWidth,this.canvasCoordinateHeight);
};
Entity.prototype.drawStatic=function (ctx) {
  if(!this.staticUpdated) {
    this.canvasCoordinate = box2d.getMapBodyPositionCanvas (this.name);
    this.staticUpdated=true;
  }
  ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,
    this.canvasCoordinate.x-this.offset.x,this.canvasCoordinate.y-this.offset.y,this.canvasCoordinateWidth,this.canvasCoordinateHeight);
};
/*main draw func*/
Entity.prototype.draw = function(ctx) {
  if(this.type=='d'){
  this.drawDynamic(ctx);
  }
  if(this.type=='s') {
    console.log("sssss");
    this.drawStatic(ctx);
  }
  if(this.type=='i'){
    ctx.drawImage(this.sprite,this.spriteCoordinates.x,this.spriteCoordinates.y, this.spriteCoordinates.width, this.spriteCoordinates.height,this.canvasCoordinate.x,this.canvasCoordinate.y,this.canvasCoordinate.width,this.canvasCoordinate.height);
  }
  };
function Ball () {
  this.Entity=new Entity ('Images/ball3.png',{x:0,y:0,width:708,height:724},{x:canvas.width/2,y:canvas.height*0.8,width:50,height:50,name:'ball'},{x:0,y:0},'d',0);
}
Ball.prototype.move=function () {
  console.log("update");
}






//-----ball functions