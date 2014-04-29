function MarsMap(nMinX_, nMinY_, nMaxX_, nMaxY_) {
	this.nMIN_X=nMinX_;
	this.nMIN_Y=nMinY_;
	this.nMAX_X=nMaxX_;
	this.nMAX_Y=nMaxY_;
	
	var lostTicket = {};
	
	MarsMap.prototype.IsInRange = function(nX, nY){
		if( nX < this.nMIN_X || nX > this.nMAX_X )
			return false;
		if( nY < this.nMIN_Y || nY > this.nMAX_Y )
			return false;
		return true;
	}
	MarsMap.prototype.AddLostTicket = function(nX, nY){
		lostTicket[nX+"_"+nY]=true;
	}
	MarsMap.prototype.IsThereLostTicket = function(nX, nY){
		if( lostTicket[nX+"_"+nY] === true )
			return true;
		return false;
	}
}

function DeltaXY_ByArrow(angle_) {
	var rad=(angle_)*Math.PI/180;
	
	var ndx = Math.floor(Math.sin(rad).toFixed(4));
	var ndy = Math.floor(Math.cos(rad).toFixed(4)); 

	var out = {};
	out["dx"]=ndx;
	out["dy"]=ndy;
	return out;
}
function SendCmdObserver(marsMap_, szCmdPos_, szCmdCtrl_) {
	var arrCmdPos=szCmdPos_.split(" ");
	var nObsX=parseInt(arrCmdPos[0]);
	var nObsY=parseInt(arrCmdPos[1]);
	var cObsArrow=arrCmdPos[2];

	var ARROW = ["N","E","S","W"];
	var ANGLE=90;
	var ANGLE_MAX=360;
	
	var nObsArrowR=0;
	var nArrow = ARROW.indexOf(cObsArrow);
	if( nArrow >= 0 )
		nObsArrowR = nArrow*ANGLE;

	var nMoveX = 0;
	var nMoveY = 0;

	nObsArrowR = (nObsArrowR)%ANGLE_MAX;
	var deltaXY=DeltaXY_ByArrow(nObsArrowR);
	nMoveX = deltaXY["dx"];
	nMoveY = deltaXY["dy"];

	var bLost=false;
	for( var i=0; i<szCmdCtrl_.length; ++i ) {
		
		var dR=0;
		
		var cmdCh=szCmdCtrl_[i];
		if( cmdCh === "L" ) {
			dR=(-1*ANGLE);
		}
		else if( cmdCh === "R" ) {
			dR=(+1*ANGLE);
		}
		nObsArrowR = (nObsArrowR+dR)%ANGLE_MAX;
		var deltaXY=DeltaXY_ByArrow(nObsArrowR);
		nMoveX = deltaXY["dx"];
		nMoveY = deltaXY["dy"];
		
		if( cmdCh === "F" ){
			
			if( marsMap_.IsInRange(nObsX+nMoveX, nObsY+nMoveY) ){
				nObsX += nMoveX;
				nObsY += nMoveY;	
			}else{
				if( marsMap_.IsThereLostTicket(nObsX, nObsY) === false ){
					marsMap_.AddLostTicket(nObsX, nObsY);
					bLost=true;
					break;
				}
			}
			
		}// end of  if( cmdCh === "F" )
	}// end of for( var i=0; i<szCmdCtrl_.length; ++i ) 
	
	var outMsg=nObsX+" "+nObsY+" "+ARROW[Math.abs(nObsArrowR/ANGLE)];
	if( bLost ){
		outMsg = outMsg+" "+"LOST";
	}
	return outMsg;
}
exports.SendCmds = function (szCmd_) {
	var arrOutput = new Array();

	var arrCmds=szCmd_.split("\n");
		
	var arrRange=arrCmds[0].split(" ");
	var nMaxX=parseInt(arrRange[0]);
	var nMaxY=parseInt(arrRange[1]);
	var marsMap = new MarsMap(0, 0, nMaxX, nMaxY);
	
	for( var order=1; order<arrCmds.length; order+=2 )
	{
		var szCmdPos=arrCmds[order];
		var szCmdCtrl=arrCmds[order+1];
		if( szCmdPos === undefined || szCmdCtrl === undefined )
			continue;
		var szResponse=SendCmdObserver(marsMap, szCmdPos, szCmdCtrl);
		arrOutput.push(szResponse);
	}// end of for(order...)
	
	var szOutput="";
	for( var oi=0; oi < arrOutput.length; ++ oi ){
		szOutput += arrOutput[oi];
		if( oi < arrOutput.length-1 ) szOutput += "\n";
	}
	return szOutput;
}
