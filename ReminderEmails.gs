// Copyright 2020 David Wilcox
// All Rights Reserved.

function sendNewYearEmail(toemail, phone, name, pledgeamt) {
  var message = {
    cc: PropertiesService.getScriptProperties().getProperty('MINISTER_EMAIL') + "," + PropertiesService.getScriptProperties().getProperty('STEWARDSHIP_EMAIL'),
    body: "Hi " + name + ",\n\n" + 
    "Sorry! I realize in my last email that the pledge amount was for 2018, not 2019. Please allow me to correct it here. Your actual pledge amount for this year was $" + pledgeamt + ". \n\n" +
    "Sorry again for the confusion. Please reach out for any questions.\n",
    subject: "South Valley UU New Fiscal Year (Pledge/ACH updates-please review!)",
    name: "David Wilcox",
    to: toemail
  };
  MailApp.sendEmail(message);
}


function sendNewYearMessages() {
  var foundcol = 0;

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Deduplicated Responses");
  var dataRange = sheet.getDataRange();

  var dateLastYear = new Date();
  dateLastYear.setDate(dateLastYear.getDate()-335);
  var dateThisYear = new Date();
  dateThisYear.setDate(dateThisYear.getDate()+30);
  var columnLastYear = findYearColumn(dataRange, dateLastYear);
  var columnThisYear = findYearColumn(dataRange, dateThisYear);
  
  var numRows = dataRange.getNumRows()
  for(var i = 2; i <= numRows; i++) {
    var email = dataRange.getCell(i, 1).getValue();
    if ( email.indexOf("nonexist") == 0 )
      email = "";

    var phone = "";
    if ( !dataRange.getCell(i, 2).isBlank() )
      phone = dataRange.getCell(i, 2).getValue();
      
    sendNewYearEmail(email, phone, dataRange.getCell(i, 3).getValue(), dataRange.getCell(i, columnThisYear).getValue());
  }
}


function sendReminderEmail(toemail, name, pledgeamt) {
  var message = {
    cc: PropertiesService.getScriptProperties().getProperty('MINISTER_EMAIL') + "," + PropertiesService.getScriptProperties().getProperty('STEWARDSHIP_EMAIL'),
    body: "Hi " + name + ",\n\nI emailed you a week or two ago about continuing your pledge to South Valley and either I misplaced your response or I haven't seen it yet. Is your pledge something you plan on renewing this year? If so, can you let us know on the link below? And even if you plan on not renewing it, can you let us know too? As a reference, I have you as pledged $" + pledgeamt + " last year. "
     + "\n\nYou can go to " + PropertiesService.getScriptProperties().getProperty('3T_BITLY') + " to either fill out the 3T form or let us know that you're not planning to pledge this year. Or you can just reply directly to this email."
     + "\n\nThanks,\nDavid Wilcox -- Stewardship Chair\n",
    subject: "South Valley UU Pledge?",
    name: "David Wilcox",
    to: toemail
  };
  MailApp.sendEmail(message);
}

function sendReminderMessages(sendFunc) {
  var foundcol = 0;

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Deduplicated Responses");
  var dataRange = sheet.getDataRange();

  var dateLastYear = new Date();
  dateLastYear.setDate(dateLastYear.getDate()-365);
  var dateThisYear = new Date();
  var columnLastYear = findYearColumn(dataRange, dateLastYear);
  var columnThisYear = findYearColumn(dataRange, dateThisYear);
  
  var numRows = dataRange.getNumRows()
  for(var i = 2; i <= numRows; i++) {
    var email = dataRange.getCell(i, 1).getValue();
    if ( email.indexOf("nonexist") == 0 )
      email = "";

    var phone = "";
    if ( !dataRange.getCell(i, 2).isBlank() )
      phone = dataRange.getCell(i, 2).getValue();
      
    if ( !dataRange.getCell(i, columnLastYear).isBlank() && dataRange.getCell(i, columnThisYear).isBlank() ) {
      sendFunc(email, phone, dataRange.getCell(i, 3).getValue(), dataRange.getCell(i, columnLastYear).getValue());
    }
  }
}


function sendReminderEmails() {
  var sendFunc = function(email, phone, name, lastYearPledge) {
    if ( email == "" )
      return;
    sendReminderEmail(email, name, lastYearPledge);
  };
  sendReminderMessages(sendFunc);
}


function sendReminderText(phoneNumber, pledgeAmt) {

  var formData = {
    "To": phoneNumber.toString(),
    "From": "+18014480789",
    "MessagingServiceSid": "MGda48b59c65fa4a7ad8265a2f38d5f0f0",
    "Body":  "Hi. This is David Wilcox from SVUUS. I sent you a text awhile ago but hadn't seen a response. Maybe I just lost it? I was wondering if you were planning on renewing your pledge to South Valley this upcoming year? Whether yes or no, could you let me know? You can reply to me or even better go to " + PropertiesService.getScriptProperties().getProperty('3T_GOOGL')  + " to fill out the 3T form. Let me know if you have any questions."
  };
  var params = {
    "method": "post",
    "headers": { "Authorization": "Basic QUNkOTUyZmM4MTRhODNjMzY3MDU3MmI4YmRlYmM4Y2QzOTpiOGI5MmNjNjU3OTRjODQ1NDk4NzhjMzlkOWExOThmOQo=" },
    "payload": formData
  };
  UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/ACd952fc814a83c3670572b8bdebc8cd39/Messages.json', params);
}



function sendReminderTextMessages() {
  var sendTextMessage = function(email, phone, name, pledgeLastYear) {
    if ( phone == "" )
      return;
    sendReminderText(phone, pledgeLastYear);
    // sleep for a second since long codes are limited in the US to sending 1 SMS per second.
    Utilities.sleep(1000);
  };
  
  sendReminderMessages(sendTextMessage);
}

function sendReminderTextTest() { 
  sendReminderText("8014490234", 4000);
}

function getQuota() {
  Logger.log(MailApp.getRemainingDailyQuota())
}
