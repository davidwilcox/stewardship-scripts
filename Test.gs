// Copyright 2020 David Wilcox
// All Rights Reserved.

function runTests() {
  if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText())
  } // Class GasTap is ready for use now!

  var test = new GasTap()
  
  test('get associative emails', function (t) {
    var values = getAssociativeTimeEmails(["Finance"]);
    t.deepEqual(values, ["davidvsthegiant@gmail.com"]);
    //t.deepEqual(values, ["davinort@yahoo.com"]);
  })
  
  test('multiple associative emails', function(t) {
    var values = getAssociativeTimeEmails(["Stewardship / Fundraising", "Worship Services"]);
    t.deepEqual(values, ["david.wilcox@svuus.org", "davidvsthegiant@gmail.com"]);
  })

    
  test('get emails for time categories', function(t) {
    var emails = getTimeResponseEmails("from@me.com", "8019894006", "My Name", "Stewardship / Fundraising, Worship Services");
    t.equal(emails.length,2);
    t.equal(emails[0].to,"david.wilcox@svuus.org");
    t.equal(emails[1].to,"davidvsthegiant@gmail.com");
    t.equal(emails[0].subject,"My Name is interested in Stewardship / Fundraising");
    t.equal(emails[1].subject,"My Name is interested in Worship Services");
  })
  
  test('get associative emails2', function(t) {
    var emails = getTimeResponseEmails(
      'useremail', 'userphone', 'username',
      'Religious Education (Elementary School), Website / Social Media, Stewardship / Fundraising, Social Action')
    t.equal(emails.length,4);
    t.equal(emails[0].subject, "username is interested in Religious Education (Elementary School)")
    t.equal(emails[1].subject, "username is interested in Website / Social Media")
    t.equal(emails[2].subject, "username is interested in Stewardship / Fundraising")
    t.equal(emails[3].subject, "username is interested in Social Action")
  })
  
  test('get associative talent emails', function(t) {
    var emails = getTalentResponseEmails(
      'useremail', 'userphone', 'username',
      'Hospitality, Team Building, Coordination')
    t.equal(emails.length,3);
    t.equal(emails[0].subject, "username is interested in Hospitality")
    t.equal(emails[1].subject, "username is interested in Team Building")
    t.equal(emails[2].subject, "username is interested in Coordination")

    t.equal(emails[0].to, "davidvsthegiant@gmail.com")
    t.equal(emails[1].to, "davidvsthegiant@gmail.com")
    t.equal(emails[2].to, "davidvsthegiant@gmail.com")
  })
  
  test.finish()
}

