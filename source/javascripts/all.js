//= require ./all_nosearch
//= require ./app/_search
//= require ./lib/_md5.min

$(function () {
  // $('body').show();
  var password = prompt('Please enter your password');
  var hashedPassword = md5(password);
  if (hashedPassword === 'f2f6faad8e9afbbf70d857d0e2b451a0' || hashedPassword === '53185745d82de13f17baf449c2930799') {
    $('body').show();
  } else {
    alert('Incorrect Password');
  }
});

