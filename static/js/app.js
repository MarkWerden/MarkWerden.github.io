// I tried where I could to comment to show that I am learning from this, though a lot of this was discussed in class. - Mark

d3.json("./data/samples.json").then(function(incomingData) { // This section of code handles the dropdown menu in the HTML. Since it is not
   d3.select("#selDataset")                                  // live data it only needs to be called once. Note that some of these values
     .selectAll("option")                                    // reference the HTML as well (such as "optionChanged" as an example).
     .data(incomingData.names)
     .enter()
     .append("option")
     .text(d=>d)
     .attr("value",d=>d);
   
   optionChanged(d3.select("#selDataset").property("value"));
});

function BarGraph(x,y,text) { // This section of code handles the horizontal bar graph and will use data based on the data that is sampled from
   var data = [{              // the .json file. For personal note, a "function" handles in a similar way to "def" in Python, and "var" is
      type: 'bar',            // similar to free-defining a variable in Python (such as "x = <value>").
      x: x,
      y: y,
      text: text,
      orientation: 'h'
   }];

   var layout = {
      title: "Highest OTUs"
   };

   Plotly.newPlot('bar',data,layout); // Using Plotly to create the bar graph. Note that it uses the variables defined in the function.
}

function MetaData(data) { // This section of code handles the metadata that is within the .json. It uses parts of HTML in the code as it is
   var div = d3.select("#sample-metadata"); // meant to gather and displayed properly. It also clears any existing data and adds the new one in
   div.html("")                             // (kinda like the HTML Mars Mission assignment from last time, but this time using JavaScript).
   var list = div.append("ul");
   Object.entries(data).forEach(([key, value]) => {
       list.append("li").text(key + ": " + value);
    });
}

function BubbleGraph(x,y,text) { // This section of code handles the Bubble Graph that is located at the bottom of the page. In a similar fashion
   var data = [{                 // to the Bar Graph, the values are taken from whatever data is loaded from the sample list. For consistency,
      x: x,                      // I attempted to make this look like the image provided in the homework (with few variations).
      y: y,
      text: text,
      mode: 'markers',
      marker: {
        size: y,
        color: x.map(value=>value)
      }
  }];
  var layout = {
      title: "OTU Values",
      xaxis: {
          title: {
            text: 'OTU ID',
          }
      }
  };
  Plotly.newPlot('bubble',data,layout);
}

function GaugeGraph(num) { // This section of code handles the Gauge Graph that's located next to horizontal Bar Graph. As a means to keep
   var data = [{          // consistent with the sample photo, I actually used a color picker to find the hex ids for each of the graph "steps". 
       domain: { x: [0, 1], y: [0, 1] },
       value: num,
       title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
       type: "indicator",
       mode: "gauge+number",
       gauge: {
           axis: { range: [0,9]},
           bar: { color: "#fa1e1e"},
           steps: [
               { range: [0, 1], color: "#f7f2eb" },
               { range: [1, 2], color: "#f3f0e4" },
               { range: [2, 3], color: "#e8e6c8" },
               { range: [3, 4], color: "#e4e8af" },
               { range: [4, 5], color: "#d4e494" },
               { range: [5, 6], color: "#b6cc8a" },
               { range: [6, 7], color: "#86bf7f" },
               { range: [7, 8], color: "#84bb8a" },
               { range: [8, 9], color: "#7fb485" }
           ],
       }
   }];
   Plotly.newPlot('gauge',data);
}

function optionChanged(value) { // This section of code handles the actual data taken from the "samples.json" file. Note that the names of the
   d3.json("./data/samples.json").then(function(incomingData) { // variables are either given to us or are part of the internal .json data.
      var metadata = incomingData.metadata.filter(data => data.id ==value);
      console.log(metadata);
      var sample = incomingData.samples.filter(data => data.id ==value);
      console.log(sample);

      BarGraph(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
      BubbleGraph(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
      MetaData(metadata[0]);
      GaugeGraph(metadata[0].wfreq);
   });
}
//(Note: This has to be placed here primarily because it references other functions that are before it)