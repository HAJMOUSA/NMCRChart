
    var data = null;
	var Encoder = null;
	var H = null;
	var dro_deviation;
	var xField = 'Date';
	var yField = 'Mean_TemperatureC';
	
    $(document).ready(function() {

    // The event listener for the file upload
    document.getElementById('txtFileUpload').addEventListener('change', upload, false);

    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
        }
        return isCompatible;
    }

    // Method that reads and processes the selected file
    function upload(evt) {
    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
        } else {
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toArrays(csvData,{ separator: '"' });
                if (data && data.length > 0) {
                  alert('Imported -' + data.length + '- rows successfully!');
                } else {
                    alert('No data to import!');
                }
				stage = data.map(function(value,index) { return value[3]; }).slice(5);
				H = data.map(function(value,index) { return value[9]; }).slice(5);
				dro_deviation = data.map(function(value,index) { return value[11]; }).slice(5);
				chan1 = data.map(function(value,index) { return value[13]; }).slice(5);
				chan2 = data.map(function(value,index) { return value[15]; }).slice(5);
				//Convert to numbers 
				N_stage = data.map(function(value,index) { return Number(value[3]); }).slice(5);
				N_H= data.map(function(value,index) { return Number(value[9]); }).slice(5);
				Residual_Error =  math.subtract(N_stage,N_H);
				N_dro_deviation = data.map(function(value,index) { return Number(value[11]); }).slice(5);
				N_chan1 = data.map(function(value,index) { return Number(value[13]); }).slice(5);
				N_chan2 = data.map(function(value,index) { return Number(value[15]); }).slice(5);				
				myploty("Calculated Height Plot","linear",N_stage,N_H);
				myploty("Variance Plot","std",N_stage,Residual_Error);
				myploty("Variance Plot","std",N_stage,N_dro_deviation);
				myploty("Channels","chanels",N_stage,N_chan1);				
				myploty("Channels","chanels",N_stage,N_chan2);
            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
});

function myploty(Title,name,xaxis,yaxis)
{
  var layout = {
  title : Title,
  xaxis: {title: 'Translation mm'},
  yaxis: {title: 'measurement mm'},
  margin: {t:0},
  hovermode: 'closest'
};
TESTER = document.getElementById(name);
Plotly.plot( TESTER, [{
    x: xaxis,
    y: yaxis }], layout );
}
//plotting function using char.js
function PlotData(xaxis,yaxis){

var MyData = {
	labels: xaxis,
	datasets: [
		{
		label: 'dro_deviation (mm)',
		fill: false,
		lineTension: 0,
		data: yaxis,
		fillColor : "rgba(172,194,132,0.4)",
		strokeColor : "#ACC26D",
		pointColor : "#fff",
		pointStrokeColor : "#9DB86D",
		}
	]
};
var ctx = document.getElementById("myChart").getContext('2d');

var myChart = new Chart(ctx, {type: 'line',data: MyData,options: LineOptions});

var LineOptions =  {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
		title: {
            display: true,
            text: 'dro_deviation'
        }
    };
}

//plotting fucntion using Dygraph
function PlotData2(name,xaxis,yaxis)
{
var myarray = [];
for (var i= 0 ;i< xaxis.length;i++)
{
	myarray.push([xaxis[i],yaxis[i]]);
}
g = new Dygraph(document.getElementById(name),myarray,
                       {
							width: 480,
							height: 320,
                            drawPoints: true,
                            showRoller: true,
							valueRange: [0.0, 5],
                            labels: ['Time', 'random']
                          });
}
