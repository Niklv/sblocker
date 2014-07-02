$(function () {
    $('#side-menu').metisMenu();
});

$(function () {
    $(window).bind("load resize", function () {
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })
});

$(document).ready(function () {
    $('.dataTable').each(function (index, table) {
        $(table).dataTable();
    });

    $('.push-this').each(function (index, button) {
        $(button).click(function () {
            $(button).addClass('disabled');
            $.ajax({
                url: "/admin/api/push",
                method: 'POST',
                dataType: 'json',
                data: {_id: $(button).attr("_id"), type: 'android'},
                context: document.body
            }).done(function () {
                $(button).removeClass('disabled');
                console.log(arguments);
            }).error(function () {
                $(button).removeClass('disabled');
                console.log(arguments);
            });
        });
    });


    $('#custom_push_form').submit(function (event) {
            var info = $("#custom-push-result");
            var form_msg = $("#custom_push_form").serializeObject();
            var real_msg = {};
            if (!form_msg.regId || !form_msg.regId.length) {
                info.html("Error!<br>No regId provided");
                $('input#regId').parent().addClass('has-error');
                return false;
            } else {
                $('input#regId').parent().removeClass('has-error');
                real_msg.registration_ids = form_msg.regId.replace(/ /g, '').split(',');
            }

            if (form_msg.collapse_key && form_msg.collapse_key.length)
                real_msg.collapse_key = form_msg.collapse_key;

            if (form_msg.data.message && form_msg.data.message.length) {
                real_msg.data = real_msg.data || {};
                real_msg.data.message = form_msg.data.message;
            }

            if (form_msg.data.another_value && form_msg.data.another_value.length) {
                real_msg.data = real_msg.data || {};
                real_msg.data.another_value = form_msg.data.another_value;
            }

            var ttl = parseInt(form_msg.time_to_live);
            console.log(ttl);
            if (ttl && _.isNumber(ttl))
                real_msg.time_to_live = ttl;


            real_msg.dry_run = (form_msg.dry_run === "true");

            real_msg.delay_while_idle = (form_msg.delay_while_idle === "true");

            info.html("Message:<br>");
            info.append("<pre>" + JSON.stringify(real_msg, null, "\t") + "</pre>");
            info.append("Response: .....");
            if (!_.size(form_msg.data))
                delete form_msg.data;

            $.ajax({
                url: "/admin/api/custom_push",
                method: 'POST',
                dataType: 'json',
                data: real_msg,
                context: document.body
            }).done(function (data, textStatus, jqXHR) {
                info.append(textStatus + "<br>");
                info.append("<pre>" + JSON.stringify(data, null, "\t") + "</pre>");
            }).error(function (jqXHR, textStatus, errorThrown) {
                info.append(textStatus + "<br>");
                info.append("<pre>" + errorThrown + "</pre>");
            });
            return false;
        }
    );

    var socket = io.connect('https://localhost:20302');
    console.log(socket);
    var rt_logs = $('#rt-logs');
    socket.on('news', function (data) {
        console.log(rt_logs);
        rt_logs.val(rt_logs.val() + JSON.stringify(data, null, "\t"));
        socket.emit('my other event', { my: 'data' });

    });

});