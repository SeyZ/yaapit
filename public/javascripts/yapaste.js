$(document).ready(function() {
  $('#pasteSubmit').click(function(event) {
    var content = $('#pasteTa').val();
    $.post("/", {content: content})
      .success(function(data) {
        console.log("Paste done !");
        $('#pasteUrl').attr("href", data);
        $('#pasteUrl').text(data);
      }).error(function(data) {
        console.log("Error occured with status: " + data.status);
      });
  });
});
