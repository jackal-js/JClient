/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var myCodeDiv = $('#myCodeSession');
var shareCodeDiv = $('#sharedCodeSession');
var helpDiv = $('#helpSession');

$(document).ready(function(){
    shareCodeDiv.hide();
    helpDiv.hide();
    
    function showModal(modal){
        $(modal).modal(options);
    }
    
//   document.getElementById("myCodeSession").style.visibility ="hidden";
//   document.getElementById("sharedCodeSession").style.visibility ="visibility";
//   document.getElementById("settingSession").style.visibility ="hidden";
//   document.getElementById("helpSession").style.visibility ="hidden";
});

$('#myCode').click(function(){
   
   shareCodeDiv.hide();
   helpDiv.hide();
   $('.tools').after(myCodeDiv);
});

$('#sharedCode').click(function(){
    
   myCodeDiv.detach();
   helpDiv.detach();
   shareCodeDiv.show();
   $('.tools').after(shareCodeDiv);
});

$('#help').click(function(){
   myCodeDiv.detach();
   shareCodeDiv.hide();
   helpDiv.show();
   $('.tools').after(helpDiv);
});

//$('#abb').click(function(){
//   shareCodeDiv.show();
//});
