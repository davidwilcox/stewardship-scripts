v// Copyright 2020 David Wilcox
// All Rights Reserved.

function canonicalizeEmail(email) {
  return email.toLowerCase();
}

function findMatching(dataRange, value, idx) {
  var last = dataRange.getLastRow();
  var lastCol = dataRange.getLastColumn();
  if ( lastCol <= idx )
    return 0;
  for(var i = 1; i <= last; ++i) {
    if ( dataRange.getCell(i,idx).isBlank() )
      continue;
    var foreignValue = dataRange.getCell(i,idx).getValue();
    if ( foreignValue == value )
      return i;
  }
  return 0;  
}

function findMatchingEmail(dataRange, email) {
  return findMatching(dataRange, email, PropertiesService.getScriptProperties().getProperty('EMAIL_FORM_IDX'));
}


function findMatchingPhoneNumber(dataRange, phoneNumber) {
  return findMatching(dataRange, phoneNumber, PropertiesService.getScriptProperties().getProperty('PHONENUMBER_FORM_IDX'));
}


function canonicalizePhoneNumber(phoneNumber) {
  if ( typeof phoneNumber != "string" )
    phoneNumber = phoneNumber.toString();
  phoneNumber = phoneNumber.replace(/\D/g,'');
  if ( phoneNumber.length > 0 && phoneNumber[0] == '1' )
    phoneNumber = phoneNumber.substr(1);
  return phoneNumber;
}

function canon() {
  Logger.log(canonicalizePhoneNumber("(801) 949--4456")); 
}
  

/** creates the deduplicate sheet
its a bit slow due to all the sheet calls in findmatching calls
ifs its an issue 
it can be sped up by doing it all with the arrays and then adding them in one call
**/
function createDeDuplicate(){
  buildFromPast = true;
  Logger.log("CreateDeDuplicate" + JSON.stringify(buildFromPast) );
  var ss = SpreadsheetApp.getActive();
  var formResponses = ss.getSheetByName("Form Responses 1");
  var data = formResponses.getDataRange().getValues()
  var sheet = ss.getSheetByName("Deduplicated Responses");
  if(!sheet){
    sheet = ss.insertSheet("Deduplicated Responses");
  } else{
    sheet.clear();
  }
  var d = new Date();
  var header = ["Email", "Phone", "Name"];
  sheet.appendRow(header);
  sheet.setFrozenRows(1);
  for(var i= 1; i < data.length ; i++){
    if ( data[i][2] == "I'd like to remove myself from pledging updates or emails." ) {
      removeDuplicate(sheet,data[i][1]);
    }
    else {
      insertRemoveDuplicate(sheet, data[i][0], canonicalizeEmail(data[i][1]), canonicalizePhoneNumber(data[i][4]), data[i][7], data[i][3])
    }
  }
  return sheet;
}


function removeDuplicate(sheet, email) {
  var rownum = findMatchingEmail(sheet.getDataRange(),email);
  if ( rownum > 0 )
    sheet.deleteRow(rownum);
}


function insertRemoveDuplicate(sheet, date, email, phone, pledge, name){

  Logger.log("Insert:Starting Append");
  var last = sheet.getLastRow();
  
  var r = sheet.getDataRange()

  var d = new Date(date);

  var lastCol = r.getLastColumn();
  var foundcol = findYearColumn(r, d);
  if (foundcol == 0) {
    sheet.insertColumnAfter(lastCol);
    var firstRowRange = sheet.getRange(1, 1, 1, lastCol+1);
    var values = firstRowRange.getValues();
    values[0][lastCol] = d.getFullYear().toString();
    firstRowRange.setValues(values);
    lastCol = lastCol+1;
    foundcol = lastCol;
  }
  
  var rownum = findMatchingEmail(r,email);
 
  if ( rownum == 0 ) {
    rownum = findMatchingPhoneNumber(r,phone);
  }
  if ( rownum != 0 ) {
    var range = sheet.getRange(rownum, foundcol, 1, 1);
    var values = range.getValues()
    values[0][0] = pledge;
    range.setValues(values);
  } else {
    var pushobj = [email, phone, name];
    for(var i = 4; i <= lastCol; i++) {
      if ( i == foundcol )
        pushobj.push(pledge);
      else
        pushobj.push("");
    }
    sheet.appendRow(pushobj);
  }
  Logger.log("Insert:APPENDING");
}

function getEmailsForInterest(email, phoneNumber, name, splitResponses, associativeEmails) {
  var rtval = [];
  for(var idx = 0; idx < associativeEmails.length; ++idx) {
    rtval.push( {
      to: associativeEmails[idx],
      subject: name + " is interested in " + splitResponses[idx], 
      body: "Hey.\n\nWe thought we should shoot you an email that " 
                      + name + " just completed a 3T card where they said that they wanted to be more involved in " 
                      + splitResponses[idx] + ". You can email them at " + email + " or you can call them at " + phoneNumber + ".\n\n"
                      + "Thanks for all that you do.\n\n--Stewardship Committee"
    } );
  }
  return rtval;
}

function getTalentResponseEmails(email, phoneNumber, name, talentResponses) {
  var splitResponses = talentResponses.split(', ');
  var associativeEmails = getAssociativeTalentEmails(splitResponses);
  
  return getEmailsForInterest(email, phoneNumber, name, splitResponses, associativeEmails);
}

function getTimeResponseEmails(email, phoneNumber, name, timeResponses) {
  var splitResponses = timeResponses.split(', ');
  var associativeEmails = getAssociativeTimeEmails(splitResponses);
  
  return getEmailsForInterest(email, phoneNumber, name, splitResponses, associativeEmails);
}

function sendEmails(emails) {
  for(var idx = 0; idx < emails.length; ++idx) {
    var email = emails[idx];
    MailApp.sendEmail(email.to, email.subject, email.body);
  }
}

function handleTimeResponses(email, phoneNumber, name, timeResponses) {
  var emails = getTimeResponseEmails(email, phoneNumber, name, timeResponses);
  sendEmails(emails);
}

function handleTalentResponses(email, phoneNumber, name, talentResponses) {
  var emails = getTalentResponseEmails(email, phoneNumber, name, talentResponses);
  sendEmails(emails);
}

function onFormSubmit2(e) {
  Logger.log(JSON.stringify(e));
  
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Deduplicated Responses")
 
  if(!sheet) {
    Logger.log("no Sheet")
    sheet = createDeDuplicate()
  }

  Logger.log(e.values);

  var date = e.values[0];
  var email = canonicalizeEmail(e.values[parseInt(PropertiesService.getScriptProperties().getProperty('EMAIL_INPUT_IDX'))]);
  var name = e.values[parseInt(PropertiesService.getScriptProperties().getProperty('NAME_INPUT_IDX'))];
  var phone = canonicalizePhoneNumber(e.values[parseInt(PropertiesService.getScriptProperties().getProperty('PHONENUMBER_INPUT_IDX'))]);
  var pledge = e.values[parseInt(PropertiesService.getScriptProperties().getProperty('PLEDGE_INPUT_IDX'))];
  var optout = e.values[parseInt(PropertiesService.getScriptProperties().getProperty('OPT_OUT_INPUT_IDX'))];

  if ( optout == "I don't plan on pledging this year." ) {
    removeDuplicate(sheet, email);
    return;
  }
  
  insertRemoveDuplicate(sheet, date, email, phone, pledge, name);
  
  handleTimeResponses(
    email,
    phone,
    name,
    e.values[parseInt(PropertiesService.getScriptProperties().getProperty('TIME_INPUT_IDX'))]);
  
  handleTalentResponses(
    email,
    phone,
    name,
    e.values[parseInt(PropertiesService.getScriptProperties().getProperty('TALENT_INPUT_IDX'))]);
  
  if ( e.values[parseInt(PropertiesService.getScriptProperties().getProperty('ACH_OPT_IN_INPUT_IDX'))] != "No" )
    if ( e.values[parseInt(PropertiesService.getScriptProperties().getProperty('ACH_ALREADY_DONE_INPUT_IDX'))] != "Yes" )
      sendTreasurerEmail(name, phone, email);
  
  sendBoardNotificationEmail(name, phone, email);
}

