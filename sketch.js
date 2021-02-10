var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameImage, restart,restartImg;
var donald, donald_running, donald_collided;
var ground, invisibleGround, groundImage;
var jumpSound , checkPointSound, dieSound;
var treesGroup, treeImage,cloudsGroup,cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

localStorage["HighestScore"] = 0;
var score;


function preload(){
  donald_running = loadAnimation("trump_run (7).png", "trump_run (8).png","trump_run (9).png","trump_run (10).png");
  
  donald_collided = loadAnimation("trump_run (12).png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  groundImage = loadImage("ground2.png");
  gameImage=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  treeImage = loadImage("t-removebg-preview.png");
   cloudImage=loadImage("cloud.png")
  
  obstacle1 = loadImage("st.png.png");
  obstacle2 = loadImage("pill-removebg-preview (1).png");
  obstacle3 = loadImage("us-removebg-preview.png");
  
}

function setup() {
  createCanvas(windowWidth,windowHeight, 200);
  
  donald = createSprite(50,windowHeight-150,20,50);
  donald.addAnimation("running", donald_running);
  donald.addAnimation("collided" , donald_collided)
  donald.scale = 0.8;
  
  donald.setCollider('rectangle', 0, 0, 35,donald.height);
  //donald.debug = true;
  
  ground = createSprite(200,windowHeight-200,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  invisibleGround = createSprite(200,windowHeight-150,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  treesGroup = createGroup();
  cloudsGroup=createGroup()
  console.log("Hello" + 5);
  
  score = 0;
  gameOver=createSprite(width/2,height/1.5,20,20);
  gameOver.addImage(gameImage)
  restart=createSprite(width/2,height/2,10,10);
  restart.addImage(restartImg);
  restart.scale=0.62
  gameOver.visible=false;
  restart.visible=false;
}

function draw() {
  background("#FAAC58");
 // text(mouseX+","+mouseY,mouseX,mouseY)
  
  text("Score: "+ score, width/1.2,height/10);
    text("Highest Score: "+ localStorage["HighestScore"], width/1.2,height/15);
  

  
  if(gameState === PLAY){
   
    ground.velocityX = -(6+score/300);
  
    score = score + Math.round(getFrameRate()/60);
   
    
    if(score%300===0 && score>0){
       checkPointSound.play();
       }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(keyDown("space")&& donald.y >= height-250) {
        donald.velocityY = -13;
      jumpSound.play(false);
    }
    

    donald.velocityY = donald.velocityY + 1   
  
    //spawn the clouds
    spawnTrees();
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(donald)){
       gameState = END;
     dieSound.play();
       donald.changeAnimation("collided" , donald_collided);
       invisibleGround.y=height-20;
     
     // donald.velocityY=-13;
    }
   
}
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     treesGroup.setVelocityXEach(0);
       cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     treesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
       gameOver.visible=true;
  restart.visible=true;
     donald.velocityY=0;
       donald.x=width/2
     donald.y=height-100;
     gameOver.depth=tree.depth;
  gameOver.depth=gameOver.depth+10;
   }
  ground.depth=donald.depth;
  donald.depth=donald.depth+1;
 
  
  donald.collide(invisibleGround);
  if(mousePressedOver(restart)){
    reset();
  }
  
  
  drawSprites();
}
function reset(){
  
  gameState=PLAY;
   gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  treesGroup.destroyEach();
  cloudsGroup.destroyEach();
  invisibleGround.y=height-150;
 donald.changeAnimation("running",donald_running);
  donald.y=height-200;
  donald.x=50
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  score=0;
}
//  donald = createSprite(50,windowHeight-150,20,50);
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-200,10,40);
   obstacle.velocityX = -(8+score/300);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.scale=0.4;
              break;
      case 2: obstacle.addImage(obstacle2);
        obstacle.scale=0.4;
              break;
      case 3: obstacle.addImage(obstacle3);
        obstacle.scale=0.3    ;
              break;
  
      default: break;
    }
   
           
  
    obstacle.lifetime = 500;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnTrees() {
  //write code here to spawn the clouds
   if (frameCount % 100  === 0) {
     tree = createSprite(600,height-350,40,10);
   
    tree.addImage(treeImage);
    tree.scale = 0.5;
    tree.velocityX = -3;
    
     //assign lifetime to the variable
    tree.lifetime = 300;
    
    //adjust the depth
    tree.depth = donald.depth;
    donald.depth = donald.depth + 1;
    
    //adding tree to the group
   treesGroup.add(tree);
    }
}
function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,height-550,40,10);
   
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = donald.depth;
    donald.depth = donald.depth + 1;
    
    //adding tree to the group
   cloudsGroup.add(cloud);
    }
}
