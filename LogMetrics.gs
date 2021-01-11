// Copyright 2020 David Wilcox
// All Rights Reserved.

function sortArray(inputarray){
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}

function quartile(data, q) {
  data=sortArray(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}


function getPledges(d) {
  var foundcol = 0;

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Deduplicated Responses");
  var dataRange = sheet.getDataRange();

  var yearstr = d.getFullYear().toString()
  var lastCol = dataRange.getLastColumn();
  for(var i = 3; i <= lastCol; i++) {
    var cellval = dataRange.getCell(1,i).getValue().toString()
    if(cellval == yearstr) {
      foundcol = i;
      break;
    }
  }
  
  if ( foundcol == 0 )
    return 0;
  
  
  var allPledges = [];

  for(var i = 2; i <= dataRange.getLastRow(); i++) {
    if ( !dataRange.getCell(i,foundcol).isBlank() )
      allPledges.push(dataRange.getCell(i,foundcol).getValue());
  }
  return allPledges;
}

function total(pledges) {
  var total = 0;
  for(var i = 0; i < pledges.length; i++) {
    Logger.log(pledges[i]);
    if (!isNaN(pledges[i]))
      total += pledges[i];
  }
  return total;
}

function average(pledges) {
  return total(pledges)/pledges.length;
}



function logMetricsInternal(sheet, d) {

  var pledges = getPledges(d);

  var rowContents = [];

  rowContents.push((d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear());
  rowContents.push(quartile(pledges,.25));
  rowContents.push(quartile(pledges,.5));
  rowContents.push(quartile(pledges,.75));
  rowContents.push(average(pledges));
  rowContents.push(total(pledges));
  rowContents.push(pledges.length);

  sheet.appendRow(rowContents);
  
}

function createHistoricalSheet(clear) {
  var ss = getSpreadsheetByName("SVUUS Pledge Aggregates");
  if ( !ss )
    ss = SpreadsheetApp.create("SVUUS Pledge Aggregates");
  var sheet = ss.getSheetByName("Historical Metrics");
  
  if ( clear && sheet ) {
    sheet.clear();
  }
  
  if ( !sheet ) {
    // Logger.warn("No Log Sheet"); 
    sheet = ss.insertSheet("Historical Metrics");
  }
  if ( !sheet || clear ) {
    var rowContents = ["Date", "25th percentile", "50th percentile", "75th percentile", "average pledge", "total pledge amount", "number of pledgers"];
    sheet.appendRow(rowContents);
  }
  return sheet;
}

function logMetrics() {
  var sheet = createHistoricalSheet(false);
  logMetricsInternal(sheet, new Date());
}

function createAndPopulateHistorialSheet() {
  var sheet = createHistoricalSheet(true);

  var d = new Date(2018,3,1);
  for(var i = 0; i < 40; i++) {
    logMetricsInternal(sheet, d);
    d.setDate(d.getDate()+1);
  }
}
