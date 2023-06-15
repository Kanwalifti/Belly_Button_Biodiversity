//2.Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//d3.select("#selDataset").on("change", updatePlotly);
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.



// //// Get the sample.json endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// // Promise Pending 
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
let dataFromApi = undefined;

// // Fetch the JSON data and console log it
d3.json(url).then(function (data) {
  populateDropdown(data);
  dataFromApi = data;
});

function populateDropdown(data) {
  const dropdown = d3.select("#selDataset");
  // let dataset = dropdown.property("value");

  // get the id data to the dropdwown menu
  data.names.forEach(function (name) {
    dropdown.append("option").text(name).property("value");
  });

}

function optionChanged(value) {
  const id = value;

  populateDemographicinfo(id);

  let selectedItem = undefined;
  if (dataFromApi) {     //here this line means if tis dataset api has a value then continueor check if null then
    dataFromApi['samples'].forEach(si => {
      if (si.id === id) {
        selectedItem = si;
      }
    });
  }

  if (!selectedItem) {
    console.log("Selected Item is undefined or null. Returning.");
    return;
  }

  console.log('SelectedItem', selectedItem);

  // Getting the top 10 
  let samplevalues = selectedItem.sample_values.slice(0, 10).reverse();

  // get only top 10 otu ids for the plot OTU and reversing it. 
  let OTU_top = (selectedItem.otu_ids.slice(0, 10)).reverse();

  // get the otu id's to the desired form for the plot
  let OTU_id = OTU_top.map(d => "OTU " + d)

  //  console.log(`OTU IDS: ${OTU_id}`)


  // get the top 10 labels for the plot
  let labels = selectedItem.otu_labels.slice(0, 10);

  createGraph(samplevalues, OTU_id, labels);
  bubblechart(samplevalues, OTU_id, labels);
}

function createGraph(samplevalues, OTU_id, labels) {
  let trace = {
    x: samplevalues,
    y: OTU_id,
    text: labels,
    marker: {
      color: 'rgb(142,124,195)'
    },
    type: "bar",
    orientation: "h",
  };

  // create data variable
  let data = [trace];

  // create layout variable to set plots layout
  let layout = {
    title: "Top 10 OTU",
    yaxis: {
      tickmode: "linear",
    },
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 30
    }
  };

  // create the bar plot
  Plotly.newPlot("bar", data, layout);
}


//3.Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.

function bubblechart(samplevalues, OTU_id, labels) {
  let trace1 = {
    x: OTU_id,
    y: samplevalues,
    text: labels,
    mode: 'markers',
    marker: {
      size: samplevalues,
      color: OTU_id,
      colorscale: "Sunset"
    },
  };

  // create data variable
  let data = [trace1];

  // create layout variable to set plots layout
  let layoutbubble = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" },
    hovermode: "closest",

  };

  // create the bubble plot
  Plotly.newPlot("bubble", data, layoutbubble);
}


//4.Display the sample metadata, i.e., an individual's demographic information.
//5.Display each key-value pair from the metadata JSON object somewhere on the page.
///demographic info///

function populateDemographicinfo(selectedId) {
  const demobox = d3.select("#sample-metadata");
  let seldemographic = undefined;

  console.log("dataFromApi", dataFromApi);
  console.log("id", selectedId);

  // get the id data to the dropdwown menu
  dataFromApi.metadata.forEach((info) => {
    if (info.id == selectedId) {
      seldemographic = info;
    }
  });

  if (!seldemographic) {
    console.log("Selected demographics is undefined or null. Returning.");
    return;
  }

  console.log('selectedDemographic', seldemographic);
  for ([key, value] of Object.entries(seldemographic)) {
    //i am calling object.entries to call in key vaalue pair
    demobox.append("div").text(key + ' : ' + value); 
  };

  populategauge(seldemographic);

}


//6.Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:

function populategauge(selectedMetadata){
  const wfreq = selectedMetadata.wfreq;
  // The guage chart
  
  let data_g = [
    {
    domain: { x: [0, 1], y: [0, 1] },
    value: parseFloat(wfreq),
    title: { text: `Weekly Washing Frequency ` },
    type: "indicator",
    
    mode: "gauge+number",
    gauge: { axis: {range: [0,9], tickmode: "linear", tick0: 2, dtick: 2},
    bar: {color: "black"},
             steps: [
              { range: [0, 2], color: "LightSalmon" },
              { range: [2, 4], color: "Salmon" },
              { range: [4, 6], color: "LightCoral" },
              { range: [6, 8], color: "IndianRed" },
              { range: [8, 9], color: "Red" },
            ]}
        
    }
  ];
  let layout_g = { 
      width: 700, 
      height: 600, 
      margin: { t: 20, b: 40, l:100, r:100 } 
    };
  Plotly.newPlot("gauge", data_g, layout_g);

}  





