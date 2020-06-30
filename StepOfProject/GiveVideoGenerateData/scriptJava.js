
let video;
let poseNet;
let pose;
let skeleton;
let playing = false;
let button;
let brain; //store  neuro network
let targetLabel="c";
let state='waiting';
let startAndStopButton;
let saveModelButton;
let text;
let inputNames = ["noseX","noseY","leftEyeX","leftEyeY","rightEyeX","rightEyeY", "leftEarX","leftEarY", "rightEarX","rightEarY", "leftShoulderX","leftShoulderY", "rightShoulderX","rightShoulderY", "leftElbowX","leftElbowY","rightElbowX","rightElbowY","leftWristX","leftWristY","rightWristX","rightWristY","leftHipX","leftHipY","rightHipX","rightHipY","leftKneeX","leftKneeY","rightKneeX","rightKneeY","leftAnkleX","leftAnkleY","rightAnkleX","rightAnkleY"]

function ButtonCreatesAtTopOfPage(text)
{
    let btn = createButton(text);
    let col = color(25, 23, 200, 100);
    btn.style('background-color', col);
    btn.style('width', '900px');
    btn.style('height', '5vh');
    btn.style('font-size', '100%');
    return btn;
}
function  preload() {
    button=ButtonCreatesAtTopOfPage("play video");
    startAndStopButton=ButtonCreatesAtTopOfPage("Start collection Dataset");
    saveModelButton=ButtonCreatesAtTopOfPage("Save DataSet");
}

function setup()
{
    text=createElement('h1', 'right elbow');
   createCanvas(1020,1200);
   background(51);
   //video = createVideo("../../videos/Bicep_Curls.mp4");//Bicep_Curls.mp4,"../../videos/Bicep_Curls.mp4"
   video =  createCapture(VIDEO);

    //video.size(300,200)
    startAndStopButton.mousePressed(functionStartAndStopRecording);
    button.mousePressed(toggleVid);
    saveModelButton.mousePressed(SaveDataset);
  //  video.hide();
    poseNet=ml5.poseNet(video,modelLoad);
    poseNet.on('pose',getPoses);

    let options = {
        inputs: inputNames,
        outputs: ['label'],
        task: 'classification',
        debug: true
    }
    brain = ml5.neuralNetwork(options);

}
function SaveDataset()
{
    //save model
    brain.saveData()
    startAndStopButton.html('Start collection Dataset');
    state = "waiting";
}
function functionStartAndStopRecording()
{
    //start and Stop video recording and collection data Set
    if(state=="waiting")
    {

        state = "collection";
        startAndStopButton.html('Stop collection Dataset');
    }
    else
    {
        state="waiting";
        startAndStopButton.html('Start collection Dataset');
    }
}
function keyPressed()
{
        targetLabel = key;
        console.log(targetLabel);
}


function toggleVid() {
    // plays or pauses the video depending on current state
    if (playing) {
        video.pause();
        button.html('play video');
    } else {
        video.loop();
        button.html('pause');
    }
    playing = !playing;
}
function modelLoad()
{
    console.log('pose net model is ready');
}
function getPoses(poses)
{
    if((poses.length>0)&&(state=="collection"))
    {
        console.log("data is saving in brain");
        pose=poses[0].pose;
        skeleton=poses[0].skeleton;
        let inputs=[];
        for(let i=0;i<pose.keypoints.length;i++)
        {
            let x=pose.keypoints[i].position.x;
            let y=pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        let taget=[targetLabel];
        brain.addData(inputs,taget);
        //console.log(pose.keypoints);
       // console.log(inputs);

    }
}


