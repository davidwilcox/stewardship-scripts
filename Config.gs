// Copyright 2020 David Wilcox
// All Rights Reserved.

function setupProperties() {  
  PropertiesService.getScriptProperties().setProperty('EMAIL_FORM_IDX', '1');
  PropertiesService.getScriptProperties().setProperty('PHONENUMBER_FORM_IDX', '2');
  PropertiesService.getScriptProperties().setProperty('PLEDGEAMT_FORM_IDX', '7');
  
  
  PropertiesService.getScriptProperties().setProperty("EMAIL_INPUT_IDX", '1');
  PropertiesService.getScriptProperties().setProperty("OPT_OUT_INPUT_IDX", '2');
  PropertiesService.getScriptProperties().setProperty("NAME_INPUT_IDX", '3');
  PropertiesService.getScriptProperties().setProperty("PHONENUMBER_INPUT_IDX", '4');
  PropertiesService.getScriptProperties().setProperty("TIME_INPUT_IDX", '5');
  PropertiesService.getScriptProperties().setProperty("TALENT_INPUT_IDX", '6');
  PropertiesService.getScriptProperties().setProperty('PLEDGE_INPUT_IDX', '7');
  PropertiesService.getScriptProperties().setProperty('ACH_OPT_IN_INPUT_IDX', '8');
  PropertiesService.getScriptProperties().setProperty('ACH_ALREADY_DONE_INPUT_IDX', '9');
  
  PropertiesService.getScriptProperties().setProperty("BOARD_EMAIL", "board@svuus.org");
  PropertiesService.getScriptProperties().setProperty('TREASURER_EMAIL', 'treasurer@svuus.org');
  PropertiesService.getScriptProperties().setProperty('MINISTER_EMAIL', 'minister@svuus.org');
  PropertiesService.getScriptProperties().setProperty('STEWARDSHIP_EMAIL', 'stewardship@svuus.org');

  PropertiesService.getScriptProperties().setProperty('3T_BITLY', 'http://bit.ly/svuus-pledge');
  // we need a separate one for texts since for some reason, the bitly above gets filtered out by carriers.
  // before you replace it for texts, make sure that delivery works when we use the URL above.
  // PropertiesService.getScriptProperties().setProperty('3T_GOOGL', 'goo.gl/ADahxE');
  PropertiesService.getScriptProperties().setProperty('3T_GOOGL', 'bit.ly/svuus-pledge');  
  
  Logger.log(PropertiesService.getScriptProperties().getProperty(['MINISTER_EMAIL']))
}

setupProperties();

