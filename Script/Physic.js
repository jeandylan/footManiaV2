var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2jointWldDef = Box2D.Dynamics.Joints.b2WeldJointDef;
var ctx=document.getElementById('game').getContext('2d');
var box2d = {
  scale: 30,
  init: function () {
    var gravity = new b2Vec2 (0, 0); //declare gravity as 9.8 m/s^2 downward
    var allowSleep = true; //Allow objects that are at rest to fall asleep and be excluded from
    box2d.world = new b2World (gravity, allowSleep);
    var timeStep = 1 / 60;
    var velocityIterations = 8;
    var positionIterations = 3;
  },
  drawDebug: function () {
    var debugContext = document.getElementById ('game').getContext ('2d');
    var debugDraw = new b2DebugDraw ();
    debugDraw.SetSprite (debugContext);
    debugDraw.SetDrawScale (30);
    debugDraw.SetFillAlpha (0.3);
    debugDraw.SetLineThickness (1.0);
    debugDraw.SetFlags (b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    box2d.world.SetDebugDraw (debugDraw);
  },

  createRectangle: function (entity) {
    var bodyDef = new b2BodyDef;
    switch (entity.type) {
      case 's':
        bodyDef.type = b2Body.b2_staticBody;
        break;
      case 'd':
        bodyDef.type = b2Body.b2_dynamicBody;
        break;
      case 'k':
        bodyDef.type = b2Body.b2_kinematicBody;
        break;
    }
    bodyDef.position.x = (entity.x) / box2d.scale;
    bodyDef.position.y = (entity.y) / box2d.scale;
    bodyDef.awake = true;
    bodyDef.allowSleep = false;
    //bodyDef.awake=true;
    if (entity.angle) {
      bodyDef.angle = entity.angle;
    }
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = entity.density;
    fixtureDef.friction = entity.friction;
    fixtureDef.restitution = entity.restitution;
    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox (entity.width / 2 / box2d.scale, entity.height / 2 / box2d.scale);
    var body = box2d.world.CreateBody (bodyDef);
    body.SetUserData (entity);
    var fixture = body.CreateFixture (fixtureDef);
    return body;
  },
  createCircle: function (entity) {
    var bodyDef = new b2BodyDef;
    switch (entity.type) {
      case 's':
        bodyDef.type = b2Body.b2_staticBody;
        break;
      case 'd':
        bodyDef.type = b2Body.b2_dynamicBody;
        break;
      case 'k':
        bodyDef.type = b2Body.b2_kinematicBody;
        break;
    }
    bodyDef.position.x = entity.x / 30;
    bodyDef.position.y = entity.y / 30;
    if (entity.angle) {
      bodyDef.angle = Math.PI * entity.angle / 180;
    }
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = entity.density;
    fixtureDef.friction = entity.friction;
    fixtureDef.restitution = entity.restitution;
    fixtureDef.shape = new b2CircleShape (entity.radius / box2d.scale);
    var body = box2d.world.CreateBody (bodyDef);
    body.SetUserData (entity);
    var fixture = body.CreateFixture (fixtureDef);
    //apply random impluse
    var minx = -100;
    var maxx = 100;
// and the formula is:
    randomy=Math.floor(Math.random() * (-100 - 75)) + -75;
    var randomx = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
    body.ApplyImpulse ({x:randomx, y:randomy}, body.GetWorldCenter ());
    return body;
  },
  getBodyByName: function (bodyName) {
    var bodyReturn = null;
    for (var body = box2d.world.GetBodyList (); body; body = body.GetNext ()) {
      var entity = body.GetUserData ();
      if (entity) {
        if (entity.name == bodyName) {
          bodyReturn = body;
        }
      }
    }
    return bodyReturn;
  },
  destroyBody: function (bodyName) {
    var bodyToDestroy = box2d.getBodyByName (bodyName);
    if (bodyToDestroy != null) {
      box2d.world.DestroyBody (bodyToDestroy);
    }
    else {
      console.log ("object does not exit how to delete ?")
    }
  },
  Impluse: function (bodyName, impulseX, impulseY) { //work only dynamic
    var bodyToImpulse = box2d.getBodyByName (bodyName);
    if (bodyToImpulse != null) {
      bodyToImpulse.ApplyImpulse ({x: impulseX, y: impulseY}, bodyToImpulse.GetWorldCenter ());
    }
    else {
      console.log ("object does not exit how to Impulse ?")
    }

  },
  LinearGravity: function (bodyName, vectorX, vectorY) {
    var bodyToApplyForce = box2d.getBodyByName (bodyName);
    if (bodyToApplyForce != null) {
      var direction = new b2Vec2 (vectorX, vectorY);
      bodyToApplyForce.ApplyForce (direction, bodyToApplyForce.GetPosition ());
    }
    else {
      console.log ("object does not exit how to Impulse ?")
    }

  },
  ApplyLinearVelocity: function (bodyName, velocityX, velocityY) { ////work With dynamic , kinematic well
    var bodyToApplyVelocity = box2d.getBodyByName (bodyName);
    if (bodyToApplyVelocity != null) {
      // bodyToApplyVelocity.awake=false;
      bodyToApplyVelocity.SetLinearVelocity (new b2Vec2 (velocityX, velocityY));
    }
    else {
      console.log ("object does not exit how to Impulse ?")
    }
  },

  CollisionDetection: function (callback) { //work with Dynamic obj
    var listener = new Box2D.Dynamics.b2ContactListener;
    listener.BeginContact = function (contact) {
      var bodyA = contact.GetFixtureA ().GetBody ();
      var bodyB = contact.GetFixtureB ().GetBody ();
      var jointDef = new b2RevoluteJointDef ();
      jointDef.Initialize (bodyA, bodyB, bodyB.GetPosition ());
      box2d.world.CreateJoint (jointDef);
     handleCollision(bodyA.GetUserData().name,bodyB.GetUserData().name);

    };
    listener.PostSolve = function (contact) {
      //var body1 = contact.GetFixtureA().GetBody();
      // box2d.ApplyLinearVelocity('ball',0,0);
    };
    listener.PreSolve = function (contact, oldManifold) {


    };
    box2d.world.SetContactListener (listener);

  },

  jointCollisionBody: function (contact) {
    var joint2 = new b2jointWldDef ();
    var body1 = contact.GetFixtureA ().GetBody ();
    var body2 = contact.GetFixtureB ().GetBody ();
    joint2.bodyA = body1;
    joint2.bodyB = body2;
    //alert(joint2.bodyB.GetAngle());
    alert (joint2.bodyA.GetAngle ());
    joint2.referenceAngle = 40;
    box2d.world.CreateJoint (joint2);
  },
  jointObject: function (nameobj1, nameobj2) {
    var body1 = box2d.getBodyByName (nameobj1);
    var body2 = box2d.getBodyByName (nameobj2);
    distance_joint = new b2DistanceJointDef ();
    distance_joint.bodyA = body1;
    distance_joint.bodyB = body2;
    distance_joint.localAnchorA = new b2Vec2 (0, 0);
    distance_joint.localAnchorB = new b2Vec2 (0, 0);
    distance_joint.length = 3;
    distance_joint.collideConnected = true;
    box2d.world.CreateJoint (distance_joint);
    return box2d.world;
  },
  getMapBodyPositionCanvas: function (bodyName) {
    var body = box2d.getBodyByName (bodyName);
    switch ( body.GetUserData().shape){
      case "rectangle":
        var width = body.GetUserData ().width / 30;
        var height = body.GetUserData ().height / 30;
        return {
          x: (body.GetPosition ().x - (width / 2)) * box2d.scale,
          y: (body.GetPosition ().y - (height / 2)) * box2d.scale
        };
      break;
      case "circle":
        var rd = body.GetUserData ().radius / 30;
        return {x: (body.GetPosition ().x - rd) * box2d.scale, y: (body.GetPosition ().y - rd) * box2d.scale};
    }

  },
  manufactureBody: function (factory) {
    for (var key in factory) {
      if (factory.hasOwnProperty(key)) {
        console.log("io");
        switch (factoryPhysicalBody[key].shape) {
          case "circle":
            box2d.createCircle (factoryPhysicalBody[key]);
            break;
          case "rectangle":
            box2d.createRectangle (factoryPhysicalBody[key]);
            break;
        }
      }
    }

  },
  createSingleBody:function (body) {
    switch (body.shape) {
      case "circle":
        box2d.createCircle (body);
        break;
      case "rectangle":
        box2d.createRectangle (body);
        break;
    }
  }
}










