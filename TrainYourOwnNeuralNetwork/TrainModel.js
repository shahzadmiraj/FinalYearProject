let model;
let targetLabel='C';
let trainingData=[]
let state='collection';

function setup()
{
    createCanvas(900,500);


    let options={
        inputs:['x','y'],
        outputs:['label'],
        task:'classification',
        debug:true,
        learningRate: 0.9, //may be more improve error try it is depend
    };
model=ml5.neuralNetwork(options);
//model.loadData('RawData/mouseNotes.json',dataLoaded); //load model from RawData/mouseNotes.json

    const modelDetails = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin'
    }
    model.load(modelDetails, modelLoaded)

    background(255);
}

function modelLoaded()
{
    console.log("model is ready");
    state='prediction';
}


function dataLoaded()
{
    console.log(model.data);
    let data=model.data.data.raw;
    //let data=model.getData()
    for(let i=0;i<data.length;i++)
    {
        let inputs=data[i].xs; //input coodinates from loaded data
        let target=data[i].ys; //output target from loaded data
        stroke(0);
        noFill();
        ellipse(inputs.x, inputs.y, 24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(target.label, inputs.x, inputs.y);
    }

}

function keyPressed()
{
    if(key=='t')
    {
        state="training";
        model.normalizeData();
        let option={
            epochs:100
        }
        model.train(option,whileTraining,finishedTraining);
    }
    else if(key=='s')
    {
        model.saveData('mouseNotes'); //when s key is press data will be save in dowloads folder
    }
    else if(key=='m')
    {
        model.save(); //when press m then create a model and save in dowload folder
    }
    else
    {
        targetLabel=key.toUpperCase();
    }

}
function whileTraining(epoch,loss)
{
    console.log(epoch);
}
function finishedTraining() {
    console.log('finished training .');
    state="prediction";
}

function mousePressed()
{

    let inputs = {
        x: mouseX,
        y: mouseY
    }
    if(state=="collection")
    {
        let target = {
            label: targetLabel
        }
        model.addData(inputs, target);
        stroke(0);
        noFill();
        ellipse(mouseX, mouseY, 24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(targetLabel, mouseX, mouseY);
    }
    else if(state=="prediction")
    {
        model.classify(inputs,gotResults);
    }

}
function gotResults(error,results)
{
    if(error)
    {
        console.error(error);
        return;
    }
    console.log(results);

    stroke(0);
    fill(0,0,255,100);
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);

    let label=results[0].label;
    text(label, mouseX, mouseY);
}
