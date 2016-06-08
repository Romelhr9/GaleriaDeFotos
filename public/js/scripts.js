/* -------------------------------------------------------------
  NOTE: In JQuery format, The callback fn will wait until the page is fully
  CHG:  We want to hide the comment form by default, and then display
        it only when a user clicks on the Post Comment button below
        an image (to the right of the Like button). 
  CHG: 10 p. 269 add event for btn-like
   ---------------------------------------------------------------
*/
$(function(){  // execute an anonymous function within the $() 
    //--- actions in  in image.handlebars ---
    $('#post-comment').hide();   
    $('#btn-comment').on('click', function(event) {
        event.preventDefault();  // watit browser action of fn and not native action of the browser
        $('#post-comment').show();  // show when the user gives click on btn-comment
    });
    /* The event handler first retrieves the data-id  attribute from 
       the Like button itself (assigned via the image.handlebars HTML 
       template code and the  viewModel ) and then performs a
       jQuery AJAX  POST  to the  /images/:image_id/like  route.
    */
    $('#btn-like').on('click', function(event) {
       event.preventDefault();
       var imgId = $(this).data('id');
       $.post('/images/' + imgId + '/like').done(function(data) {
          $('.likes-count').text(data.likes);
       });
    }); // btn-like
    $('#btn-delete').on('click', function(event) {
        event.preventDefault();
        var $this = $(this);
        var remove = confirm('Are you sure you want to delete this image?');
        if (remove) {
            var imgId = $(this).data('id');
            $.ajax({
                url: '/images/' + imgId,
                type: 'DELETE'
            }).done(function(result) {
                if (result) {
                    $this.removeClass('btn-danger').addClass('btn-success');
                    $this.find('i').removeClass('fa-times').addClass('fa-check');
                    $this.append('<span> Deleted!</span>');
                }
            });
        }
    }); // btn-delete
}); // fn anonymous