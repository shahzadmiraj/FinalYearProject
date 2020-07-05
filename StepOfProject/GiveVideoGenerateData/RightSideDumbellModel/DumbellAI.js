
let accuracyOfPoseNet=20;
var Previouse_Angle_Between_RightWrist_RightShoulder=200;
var stepDirection="UpWordDirection";
var InitialMovement="YesInitialMovement";

var CountOfPerfectStep=0;
var WarningMovingUpWord=0;
var CountOfWarningMovingArm=0;
var previousText="";
var textString="";
var Angle_Between_RightWrist_RightShoulder=0;
function draw()
{
    //translate(video.width,0);
    //scale(-1,1);
    var xScale=100;

    image(video,0-xScale,0,video.width,video.height);
    if(pose&&(state=="collection"))
    {
        // console.log(pose);
        let inputs= {
            inputNames:1
        }

        textString="";
        if((pose.rightHip.confidence*100>accuracyOfPoseNet)&&(pose.rightShoulder.confidence*100>accuracyOfPoseNet)&&(pose.rightElbow.confidence*100>accuracyOfPoseNet)&&(pose.rightWrist.confidence*100>accuracyOfPoseNet))
        {
            //good accuracy os pose net

            var standing = findANGLEComplete(pose.rightHip.x, pose.rightHip.y, pose.rightShoulder.x, pose.rightShoulder.y)
            if ((standing < -90) && (standing > -105))
            {
                //user is  staight position

                //textString="Good Standing position=" + standing+'",";
                var ArmISStill = findANGLEComplete(pose.rightElbow.x, pose.rightElbow.y, pose.rightShoulder.x, pose.rightShoulder.y);

                if((ArmISStill < -78) && (ArmISStill > -110))
                {
                    //arm is still there position

                   // textString+=",good ARM,";

                      if(stepDirection=="UpWordDirection")
                      {
                          // moving arm upword direction

                          Angle_Between_RightWrist_RightShoulder= Math.floor(angle(pose.rightWrist.x, pose.rightWrist.y,pose.rightElbow.x, pose.rightElbow.y,pose.rightShoulder.x, pose.rightShoulder.y)[1]);

                          if(InitialMovement=="YesInitialMovement")
                          {
                              // initial point set to 170 angle first

                              if(IsAngleTouchHip())
                              {
                                  //user doing arm excercise properly
                                  textString+="<br>Let Start Excercise";
                                  if(IsCurrentAngleIncrease()==false)
                                  {
                                      InitialMovement="NoInitialMovement";
                                      CountOfWarningMovingArm=0;
                                  }
                                  else
                                  {
                                      SetInitialPosition();
                                  }
                              }
                              else
                              {
                                  //user is not doing arm excercise properly
                                  textString+="<br>Please Set initial position"+Angle_Between_RightWrist_RightShoulder;
                                  SetInitialPosition();
                              }

                          }
                          else
                          {
                              // not initial point set to 170 angle first
                              if(IsArmMoveCorrectlyInExcercise())
                              {
                                  //user doing arm excercise properly
                                   if(IsCurrentAngleIncrease()==false)
                                  {
                                      //angle improve itself by degree decrease when user move arm upward
                                      if(IsAngleTouchShoulder())
                                      {
                                          // if user arm get  peak angle now start move down word direction
                                          textString+="<br>Now Move Down Worddddddd ";
                                          stepDirection="DownWordDirection";
                                          InitialMovement="YesInitialMovement";
                                          CountOfWarningMovingArm=0;
                                          Previouse_Angle_Between_RightWrist_RightShoulder=0;
                                      }
                                      else
                                      {

                                          // if user arm does not  get peak angle now start moving up word direction
                                          textString+="<br>Good Move Upword "+Angle_Between_RightWrist_RightShoulder;
                                          Previouse_Angle_Between_RightWrist_RightShoulder=Angle_Between_RightWrist_RightShoulder;
                                          CountOfWarningMovingArm=0;
                                      }

                                  }
                                  else if(IsMarginApply())
                                  {
                                      //user move down word arm or still contant position does not improve angle
                                      warningOrError();
                                  }
                                  else
                                  {
                                      //if user move full downward direction then initial position set
                                      textString+="<br> Please agian start Excercise Due to Completely wrong Down word direction,";
                                      SetInitialPosition();
                                  }

                              }
                              else
                              {
                                  //user is not doing arm excercise properly
                                  textString+="<br>elbow angle out of excercise,"+Angle_Between_RightWrist_RightShoulder;
                                  SetInitialPosition();
                              }

                          }

                      }
                      else
                      {


                          MovingArmDownwordDirection();

                          // moving arm downword direction
                          textString+="<br>moving arm downword direction ,"+ArmISStill;

                      }

                }
                else
                {
                    //user arm is inword or outword
                    textString+="<br> ARM is moving inword or outword"+ArmISStill;
                    SetInitialPosition();

                }



            }
            else
            {
                //user is not staight position
                textString="<br>bad Standing position,"+standing;
                SetInitialPosition();
            }
        }
        else
        {
            //posenet accuracy is not good
            textString+="<br>Pose Net accuracy not good";
        }
        if(previousText!=textString)
        {
            previousText=textString;
            console.log(textString);
        }
        text.html(textString+"  Step ="+CountOfPerfectStep); //append
        for(let i=0;i<pose.keypoints.length;i++)//15
        {
            let x=pose.keypoints[i].position.x;
            let y=pose.keypoints[i].position.y;


            fill(0,0,200);
            ellipse(x-xScale,y,16,16);

        }
        for(let i=0;i<skeleton.length;i++)
        {
            let a=skeleton[i][0];
            let b=skeleton[i][1];
            strokeWeight(2);
            stroke(200);
            line(a.position.x-xScale,a.position.y,b.position.x-xScale,b.position.y);
        }
    }

}









function MovingArmDownwordDirection()
{

    // moving arm upword direction

    Angle_Between_RightWrist_RightShoulder= Math.abs(Math.floor(angle(pose.rightWrist.x, pose.rightWrist.y,pose.rightElbow.x, pose.rightElbow.y,pose.rightShoulder.x, pose.rightShoulder.y)[1]));

    if(InitialMovement=="YesInitialMovement")
    {
        // initial point set to 90 angle first

        if(IsAngleTouchShoulder())
        {
            //user doing arm excercise properly
            textString+="<br>Downword initial position has set"+Angle_Between_RightWrist_RightShoulder;
            if(IsCurrentAngleIncrease()==true)
            {
                InitialMovement="NoInitialMovement";
                CountOfWarningMovingArm=0;
            }
            else
            {
                SetInitialPosition();
            }

        }
        else
        {
            //user is not doing arm excercise properly
            textString+="<br>Please Set Downword initial position"+Angle_Between_RightWrist_RightShoulder;
            SetInitialPosition();
        }

    }
    else
    {
        // not initial point set to 170 angle first
        if(IsArmMoveCorrectlyInExcercise())
        {
            //user doing arm excercise properly
            if(IsCurrentAngleIncrease()==true)
            {
                //angle improve itself by degree increase when user move arm downword
                if(IsAngleTouchHip())
                {
                    // if user arm get  peak angle now start move up word direction
                    textString+="<br>Now Move Up Word Direction ";
                    SetInitialPosition();
                    Previouse_Angle_Between_RightWrist_RightShoulder=200;
                    CountOfPerfectStep=CountOfPerfectStep+1;
                    textString+="<br>Hurrrrrryyyy  "+CountOfPerfectStep;
                }
                else
                {

                    // if user arm does not  get peak angle now start moving up word direction
                    textString+="<br>Good Move Downword "+Angle_Between_RightWrist_RightShoulder;
                    Previouse_Angle_Between_RightWrist_RightShoulder=Angle_Between_RightWrist_RightShoulder;
                    CountOfWarningMovingArm=0;
                }

            }
            else if(IsMarginApply())
            {
                //user move down word arm or still contant position does not improve angle
                warningOrError();
            }
            else
            {
                //if user move full downward direction then initial position set
                textString+="<br> Please agian start Excercise Due to Completely wrong up word direction,";
                SetInitialPosition();
            }

        }
        else
        {
            //user is not doing arm excercise properly
            textString+="<br>elbow angle out of excercise,"+Angle_Between_RightWrist_RightShoulder;
            SetInitialPosition();
        }

    }

}


function warningOrError()
{
    if(CountOfWarningMovingArm<5)
    {
        textString+="<br>Warning please when "+stepDirection+Previouse_Angle_Between_RightWrist_RightShoulder;
        CountOfWarningMovingArm=CountOfWarningMovingArm+1;
    }
    else
    {
        //if user doesnot improve angle more then 3 time warning then set initial position
        textString+="<br> Please agian start Excercise due to More then Warning Found during"+stepDirection+Previouse_Angle_Between_RightWrist_RightShoulder;
        SetInitialPosition();

    }

}

function SetInitialPosition()
{
    textString+="Again Start with  initial position,";
    CountOfWarningMovingArm=0;
    InitialMovement="YesInitialMovement";
    stepDirection="UpWordDirection";
}

function IsCurrentAngleIncrease()
{
    var state=false;
    if(Previouse_Angle_Between_RightWrist_RightShoulder<Angle_Between_RightWrist_RightShoulder)
    {
        state=true;
    }
    //Previouse_Angle_Between_RightWrist_RightShoulder=Angle_Between_RightWrist_RightShoulder;
    return state;
}
function IsAngleTouchShoulder()
{

    if(Angle_Between_RightWrist_RightShoulder<50 && Angle_Between_RightWrist_RightShoulder>40)
    {

        return true;
    }
    return false;
}
function IsAngleTouchHip()
{
    if(Angle_Between_RightWrist_RightShoulder<180 && Angle_Between_RightWrist_RightShoulder>150)
    {
        return true;
    }
    return false;
}
function IsArmMoveCorrectlyInExcercise()
{
    if(Angle_Between_RightWrist_RightShoulder<180 && Angle_Between_RightWrist_RightShoulder>40)
    {
        return true;
    }
    return false;
}
function IsMarginApply()
{
    var margin=Previouse_Angle_Between_RightWrist_RightShoulder-Angle_Between_RightWrist_RightShoulder;

    if(margin<0)
        margin=margin*-1;
   textString+="p"+Previouse_Angle_Between_RightWrist_RightShoulder+"C="+Angle_Between_RightWrist_RightShoulder+",Marging is set"+margin;
    if(margin<=2&&margin>=0)
    {
        return true;
    }
    return false;
}