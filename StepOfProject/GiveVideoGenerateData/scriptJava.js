
let video;
let poseNet;
let pose;
let skeleton;
let playing = false;
let button;
let brain; //store  neuro network
let targetLabel;
let state='waiting';
let startAndStopButton;
let saveModelButton;

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

   createCanvas(900,600);
    video = createVideo("../../videos/F1.mp4");
    startAndStopButton.mousePressed(functionStartAndStopRecording);
    button.mousePressed(toggleVid);
    saveModelButton.mousePressed(SaveDataset);
    video.hide();
    poseNet=ml5.poseNet(video,modelLoad);
    poseNet.on('pose',getPoses);

    let options = {
        inputs: 34,
        outputs: 4,
        task: 'classification',
        debug: true
    }
    brain = ml5.neuralNetwork(options);

}
function SaveDataset()
{
    //save model
    brain.saveData()
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
    }
}
function draw()
{
    translate(video.width,0);
    scale(-1,1);
    image(video,0,0,video.width,video.height);
    if(pose&&(state=="collection"))
    {

        for(let i=0;i<pose.keypoints.length;i++)
        {
            let x=pose.keypoints[i].position.x;
            let y=pose.keypoints[i].position.y;
            fill(0,0,200);
            ellipse(x,y,16,16);
          //  console.log(pose.keypoints[i].part+"x="+x+" y="+y);
        }
        for(let i=0;i<skeleton.length;i++)
        {
            let a=skeleton[i][0];
            let b=skeleton[i][1];
            strokeWeight(2);
            stroke(200);
            line(a.position.x,a.position.y,b.position.x,b.position.y);
        }


    }

}