// Copyright 2020 David Wilcox
// All Rights Reserved.

function getAssociativeEmails(categories, sheetName) {
  var spreadsheet = SpreadsheetApp.getActive(); 
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  var data = sheet.getDataRange().getValues();
  var newData = []
  
  var rtval = [];
 
  for(var itemnum=0; itemnum < categories.length; ++itemnum) {
    var found = false;  
    for(var row=0; row < data.length; row++) {
      if(data[row][0] == categories[itemnum]) {
        rtval[itemnum] = data[row][1];
        found = true;
      }
    }
    if ( !found ) {
      rtval[itemnum] = PropertiesService.getScriptProperties().getProperty('MINISTER_EMAIL');
    }
  }
  return rtval;
}


function getAssociativeTimeEmails(timeCategories) {
  return getAssociativeEmails(timeCategories, "Committees");
}

function getAssociativeTalentEmails(talentCategories) {
  return getAssociativeEmails(talentCategories, "Talent Contact")
}

function getSpreadsheetByName(filename) {
  var files = DriveApp.getFilesByName(filename);

  while (files.hasNext()) {
    var file = files.next();
    if ( file.getName() == filename )
      return SpreadsheetApp.open(file);
  }
  return null;
}


function findYearColumn(range, d) {

  var lastCol = range.getLastColumn();
  var foundcol = 0;
  var yearstr = d.getFullYear().toString()
  for(var i = 3; i <= lastCol; i++) {
    var cellval = range.getCell(1,i).getValue().toString()
    if(cellval == yearstr) {
      foundcol = i;
      break;
    }
  }

  return foundcol;
}

