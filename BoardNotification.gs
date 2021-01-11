// Copyright 2020 David Wilcox
// All Rights Reserved.

function sendBoardNotificationEmail(name, phone, email) {
  var message = {
    body: "Hi board,\n\n\nWe just had a new pledge come in from " + name + ". You can contact him or her at " + phone + " or at " + email + ".\n\nThanks for all your service!\n--David",
    subject: "New Pledge Came In",
    name: "Stewardship",
    to: "board@svuus.org"
    // to: PropertiesService.getScriptProperties().getProperty('BOARD_EMAIL')
  };
  MailApp.sendEmail(message);
}

function sendTreasurerEmail(name, phone, email) {
  var message = {
    body: "Hi Treasurer,\n\n" + name + " just made a pledge and indicated that he or she wants to sign up for ACH. Please reach out to him or her at " + email + " or phone number " + phone + " to set that up."
      + "\n\n--David Wilcox",
    subject: name + " Person Wants ACH",
    name: "Stewardship",
    to: "treasurer@svuus.org"
    // to: PropertiesService.getScriptProperties().getProperty('TREASURER_EMAIL')
  };
  MailApp.sendEmail(message);
}
