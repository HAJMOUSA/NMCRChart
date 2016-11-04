var counter = 0;	
var globalEvents = [];
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
					counter = 0;
			        globalEvents = evt;
					ReadUpdateAllfiles();
			};		
	};
	});

	function ReadUpdateAllfiles(){
		if(counter < globalEvents.target.files.length)
		{
			var file = globalEvents.target.files[counter];
			console.log(file.name);
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(event) {
					var csvData = event.target.result;
					data = $.csv.toArrays(csvData,{ separator: '"' });
					if (data && data.length > 0) {
					  alert('Imported -' + data.length + '- rows successfully!');
					  setTimeout(ExtractAndPlotData(ReadUpdateAllfiles,data,file),100);
					} else {
						alert('No data to import!');
					}
				};
			reader.onerror = function() {
			alert('Unable to read ' + file.fileName);
			};
		}
	};
	
	function ExtractAndPlotData(__CallBack,data,file)
	{
		//extract and dconvert to Convert to numbers 
		N_stage = data.map(function(value,index) { return Number(value[3]); }).slice(5);
		N_psd = data.map(function(value,index) { return Number(value[5]); }).slice(5);
		N_H= data.map(function(value,index) { return Number(value[9]); }).slice(5);
		Residual_Error =  math.subtract(N_stage,N_H);
		N_dro_deviation = data.map(function(value,index) { return Number(value[11]); }).slice(5);
		N_chan1 = data.map(function(value,index) { return Number(value[13]); }).slice(5);
		N_chan2 = data.map(function(value,index) { return Number(value[15]); }).slice(5);				
		//myploty("Calculated Height Plot",file.name,"linear",N_stage,N_H);
		myploty("Residual Error Plot"			//title
		,file.name,								//legend
		'Translation(mm)'						//xlabel
		,'Residual Error(mm)'					//ylabel
		,"linear"								//<div> tag name
		,N_stage,Residual_Error);				//x and Y data to be plotted
		myploty("Dro_deviation Plot"			,file.name,'Translation(mm)','deviation (mm)'			,"std"		,N_stage,N_dro_deviation);
		myploty("psd Plot"						,file.name,'Translation(mm)','PSD'						,"psd"		,N_stage,N_psd);
		myploty("Raw Channels Plot"				,file.name,'Translation(mm)','Counts_16bit'				,"chanels"	,N_stage,N_chan1);				
		myploty("Raw Channels Plot"				,file.name,'Translation(mm)','Counts_16bit'				,"chanels"	,N_stage,N_chan2);
		++counter;
		__CallBack();
	};

function myploty(Title,legend,xlabel,ylabel,div_name,xaxis,yaxis)
{
  var layout = {
  title : Title,
  xaxis: {title: xlabel},
  yaxis: {title: ylabel},
    autosize: true,
  width: 1000,
  height: 500,
  margin: {
    l: 50,
    r: 50,
    b: 100,
    t: 100,
    pad: 4,
	},
  hovermode: 'closest'
};
TESTER = document.getElementById(div_name);
Plotly.plot( TESTER, [{
    x: xaxis,
    y: yaxis,
	name: legend}], layout );
};
