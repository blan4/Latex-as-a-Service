(function($){
    'use strict';
    $(function() {
        $('#js-compile').on('click', (ev) => {
            ev.preventDefault();
            const main = $('#js-main').val();
            $.ajax({
                url: '/api/pdf',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    main: main
                }),
                success: function(data, status, xhr) {
                    const output = $('#js-output');
                    if (data.error) {
                        console.error(data.error);
                        output.text(data.error);
                    } else {
                        console.log(data.data);
                        const a = $('<a />');
                        a.attr('href', data.data);
                        a.attr('target', '_blank');
                        a.text('Download PDF');
                        output.html(a);
                    }
                }
            })
        });
    });
})(jQuery);
