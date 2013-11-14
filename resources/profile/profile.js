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