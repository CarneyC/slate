//= require ./all_nosearch
//= require ./app/_search
//= require ./lib/_md5.min

$(function () {
  var password = prompt('Please enter your password');
  if (md5(password) === 'f2f6faad8e9afbbf70d857d0e2b451a0') {
    $('body').show();
  } else {
    alert('Incorrect Password');
  }
});

