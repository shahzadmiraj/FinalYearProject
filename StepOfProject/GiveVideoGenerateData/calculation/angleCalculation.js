function GetSide(Fx,Fy,Sx,Sy)
{
    return Math.sqrt(Math.pow((Fx-Sx),2)+Math.pow((Fy-Sy),2))
}
function GetAngleAlpha(a,b,c)
{
    var cal=(Math.pow(b,2)+Math.pow(c,2)-Math.pow(a,2))/(2*b*c)
    return Math.acos(cal)*(180/Math.PI)
}
function GetAngleBeta(a,b,c)
{
    var cal=(Math.pow(a,2)+Math.pow(c,2)-Math.pow(b,2))/(2*a*c)
    return Math.acos(cal)*(180/Math.PI)
}
function GetAngleGama(Alph,Beta)
{
    return 180-Alph-Beta
}

function angle(Ax,Ay,Bx,By,Cx,Cy)
{
    // C is top B is left and A is right
    //angle
    var angleAlphBetaGema=[21.34343443,213.3434334434,33443.3434]

    var a=GetSide(Bx,By,Cx,Cy); //BC
    var b=GetSide(Ax,Ay,Cx,Cy);//AC
    var c=GetSide(Ax,Ay,Bx,By);//AB
    angleAlphBetaGema[0]=GetAngleAlpha(a,b,c);
    angleAlphBetaGema[1]=GetAngleBeta(a,b,c);
    angleAlphBetaGema[2]=GetAngleGama(angleAlphBetaGema[0],angleAlphBetaGema[1]);
    return angleAlphBetaGema;

}
//console.log(angle(831.9707,417.5502,951.9148,496.4714,792.938,260.8059))