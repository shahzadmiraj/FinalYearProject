let video;
let poseNet;
let pose;
let skeleton;
let playing = false;
let button;
let brain; //store  neuro network
let targetLabel;
let state='waiting';
function setup()
{
   createCanvas(900,750);
    video = createVideo("../../videos/F1.mp4");
    button = createButton('play');
    button.mousePressed(toggleVid);
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
    const modelInfo = {
        model: 'RightSideDumbellModel/model.json',
        metadata: 'RightSideDumbellModel/model_meta.json',
        weights: 'RightSideDumbellModel/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);

}
function brainLoaded()
{
console.log("brain RightSideDumbellModel is ready ...");
   classifyPose();

}
function classifyPose()
{
    if(pose)
    {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResults);
    }else
    {
        setTimeout(classifyPose,100);
    }
}
function gotResults(error,results)
{
    console.log(results);
    console.log(results[0].label);
    classifyPose();

}

function toggleVid()
{
    // plays or pauses the video depending on current state
    if (playing) {
        video.pause();
        button.html('play');
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
    if(poses.length>0)
    {
        pose=poses[0].pose;
        skeleton=poses[0].skeleton;
    }
}
function draw()
{
    translate(video.width,0);
    scale(-1,1);
    image(video,0,0,video.width,video.height);
    if(pose)
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