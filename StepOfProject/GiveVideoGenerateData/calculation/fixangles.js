var findAngle = function (ax, ay, bx, by) {
    var aDotb=(ax*bx)+(ay*by);
    var magnitudeofA=Math.abs(Math.sqrt((ax*ax)+(ay*ay)));
    var magnitudeofB=Math.abs(Math.sqrt((bx*bx)+(by*by)));
    var cosAngle=aDotb/(magnitudeofA*magnitudeofB);
    var pi=22/7;
    return Math.acos(cosAngle)* (180/pi);
}
var findANGLEComplete= function(ax, ay, bx, by)
{
    var angleDeg = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
    return angleDeg;
}
var standingposition=function () {

}
