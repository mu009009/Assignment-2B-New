/**
 * Created by Administrator on 2015/2/20.
 */

var margin ={t:50,r:50,b:50,l:50}
var width = $('.plot').width() - margin.r - margin.l ;
var height = $('.plot').height() - margin.t - margin.b;

var plot = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('class','plot')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var scaleX = d3.scale.log().range([0,width]),
    scaleY = d3.scale.log().range([height,0]);

var axisX = d3.svg.axis()
    .orient('bottom')
    .tickValues([1045,4125,12746,40000])
    .tickSize(-height,0)
    .scale(scaleX);

var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);

console.log("Start loading data");
d3.csv('data/world_bank_2010_gdp_co2.csv', parse, dataLoaded);

 //console.log("DataLoaded");

 function dataLoaded(err,rows){

 console.log("Data loaded");

 var minX = d3.min(rows, function(d){ return d.gdpPerCap; }),
 maxX = d3.max(rows, function(d){ return d.gdpPerCap; });
 scaleX.domain([minX *0.85, maxX*1.15]);

 var minY = d3.min(rows, function(d){return d.CO2E;}),
     maxY = d3.min(rows, function(d){return d.CO2E;});
 scaleY.domain([minY*0.5,maxY*500000]);

 /* You can draw the axes now or later in the draw function */
    plot.append('g')
         .attr('class','axis x')
         .attr('transform','translate(0,'+height+')')
         .call(axisX);
    plot.append('g')
         .attr('class','axis y')
        // .attr('transform','translate(0,'+width+')')
         .call(axisY);

 draw(rows);
 }

 function draw(rows){
     //console.log(rows)
 console.log("Start drawing");

 /*IMPORTANT! Using .selectAll(), .data(), and .enter() to automatically generate DOM elements for data elements */



     //var scaleR = d3.scale.log().range([minR,maxR]);
     //scaleR.domain([1,20]);

     var nodes = plot.selectAll('.node')
    .data(rows)
    .enter()
    .append('g')
    .attr('class','node')
    .filter(function(d){
             return d.gdpPerCap && d.CO2E && d.populationTotal;
 })
    .attr('transform', function(d){
             return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.CO2E)+')';
    });

     var minR = d3.min(rows,function(d){return d.populationTotal;}),
         maxR = d3.max(rows,function(d){return d.populationTotal;});

     var scaleR = d3.scale.log().range([0,4]);
         scaleR.domain = ([minR,maxR]);

    nodes.append('circle')
         .attr('r',function(d){return scaleR(d.populationTotal);});
        //.attr('r',20);

    nodes.append('text')
    .text(function(d){
            return d.country;
 })
    .attr('text-anchor','middle')
    .attr('dy',12);
 }

 function parse(row){
 //@param row is each unparsed row from the dataset
 return {
 gdpPerCap: row['GDP per capita, PPP (constant 2011 international $)']=='..'?undefined:+row['GDP per capita, PPP (constant 2011 international $)'],
 populationTotal: row['Population, total']=='..'?undefined:+row['Population, total'],
 CO2E: row['CO2 emissions (kt)']=='..'?undefined:+row['CO2 emissions (kt)'],
 CO2EM: row['CO2 emissions (metric tons per capita)'] = ".."?undefined:row['CO2 emissions (metric tons per capita)'],
 country: row['Country Name'],
 countryCode: row['Country Code']
 };
 }


