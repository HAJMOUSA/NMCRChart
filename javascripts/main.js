var sectionHeight = function() {
  var total    = $(window).height(),
      $section = $('section').css('height','auto');

  if ($section.outerHeight(true) < total) {
    var margin = $section.outerHeight(true) - $section.height();
    $section.height(total - margin - 20);
  } else {
    $section.css('height','auto');
  }
}

$(window).resize(sectionHeight);

$(document).ready(function(){
  $("section h1, section h2").each(function(){
    $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a></li>");
    $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    $("nav ul li:first-child a").parent().addClass("active");
  });
  
  $("nav ul li").on("click", "a", function(event) {
    var position = $($(this).attr("href")).offset().top - 190;
    $("html, body").animate({scrollTop: position}, 400);
    $("nav ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();    
  });
  
  sectionHeight();
  
  $('img').load(sectionHeight);
});

fixScale = function(doc) {

  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }

  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [.25, 1.6];
    doc[addEvent](type, fix, true);
  }
};


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
