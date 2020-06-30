
let accuracyOfPoseNet=1;
var Previouse_Angle_Between_RightWrist_RightShoulder=170;
var stepDirection="UpWordDirection";
var InitialMovement="YesInitialMovement";
function draw()
{
    //translate(video.width,0);
    //scale(-1,1);
    var xScale=0;

    image(video,0-xScale,0,video.width,video.height);
    if(pose&&(state=="collection"))
    {
        // console.log(pose);
        let inputs= {
            inputNames:1
        }

        var textString="";
        if((pose.rightHip.confidence*100>accuracyOfPoseNet)&&(pose.rightShoulder.confidence*100>accuracyOfPoseNet)&&(pose.rightElbow.confidence*100>accuracyOfPoseNet)&&(pose.rightWrist.confidence*100>accuracyOfPoseNet))
        {
            //good accuracy os pose net

            var standing = findANGLEComplete(pose.rightHip.x, pose.rightHip.y, pose.rightShoulder.x, pose.rightShoulder.y)
            if ((standing < -90) && (standing > -100))
            {
                //user is  staight position

                //textString="Good Standing position=" + standing+'",";
                var ArmISStill = findANGLEComplete(pose.rightElbow.x, pose.rightElbow.y, pose.rightShoulder.x, pose.rightShoulder.y)

                if((ArmISStill < -82) && (ArmISStill > -105))
                {
                    //arm is still there position

                    textString+=",good ARM,";

                      if(stepDirection=="UpWordDirection")
                      {
                          // moving arm upword direction

                          var Angle_Between_RightWrist_RightShoulder= Math.floor(angle(pose.rightWrist.x, pose.rightWrist.y,pose.rightElbow.x, pose.rightElbow.y,pose.rightShoulder.x, pose.rightShoulder.y)[1]);

                          if(InitialMovement=="YesInitialMovement")
                          {
                              // initial point set to 170 angle first

                              if((Angle_Between_RightWrist_RightShoulder>170)&&(Angle_Between_RightWrist_RightShoulder<160))
                              {
                                  //user doing arm excercise properly
                                  textString+=",Initial point set,";
                                  InitialMovement="NoInitialMovement";
                              }
                              else
                              {
                                  //user is not doing arm excercise properly
                                  textString+=",Please Set initial position,";
                              }

                          }
                          else
                          {
                              // not initial point set to 170 angle first
                              if((Angle_Between_RightWrist_RightShoulder>170)&&(Angle_Between_RightWrist_RightShoulder<90))
                              {
                                  //user doing arm excercise properly

                              }
                              else
                              {
                                  //user is not doing arm excercise properly
                              }

                          }

                      }
                      else
                      {

                          // moving arm downword direction
                          textString+=",moving arm downword direction ,";

                      }

                }
                else
                {
                    //user arm is inword or outword
                    textString+="ARM is moving inword or outword";

                }



            } else
            {
                //user is not staight position
                textString=",bad Standing position,";
            }
        }
        else
        {
            //posenet accuracy is not good
            textString+="Pose Net accuracy not good";
        }
        text.html(textString);
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