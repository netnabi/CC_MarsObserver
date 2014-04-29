var marsObserver = require('./MarsObserver.js');

function MarsObserverUnitTest(testFunc_, input_, output_){
	var output = testFunc_(input_);
	return output === output_;
}
var SZ_CMDS = 
	"5 3\n"+
	"1 1 E\n"+
	"RFRFRFRF\n"+
	"3 2 N\n"+
	"FRRFLLFFRRFLL\n"+
	"0 3 W\n"+
	"LLFFFLFLFL";
var SZ_OUTPUTS = 
	"1 1 E\n"+
	"3 3 N LOST\n"+
	"2 3 S";

var testResult=MarsObserverUnitTest(marsObserver.SendCmds, SZ_CMDS, SZ_OUTPUTS);
console.log(
	"===RESULT===\n"+testResult+"\n===INPUT===\n"+SZ_CMDS+"\n===OUTPUT===\n"+SZ_OUTPUTS);