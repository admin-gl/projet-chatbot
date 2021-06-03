window.bot = null;
let brain = null;
let code = '';
let Steve = '> begin\n\t+ request\n\t- {ok}\n< begin\n+ salut\n- hello !\n\n+ *\n- je comprends pas frere';

$(document).ready(() => {

    document.onbeforeunload = () => {
        fetch(`http://localhost:3002/sesscount/${bot[0]._id}/interface/-`);
    }

    $.ajax({
        url: "localhost:3002/bList",
        method: "GET",
        dataType: "text",
        error: function(jqXHR, textStatus, error) {
            window.alert(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
            brain = data;
            console.log('nice');
        }
    });


    code = brain.cerveau;

    window.bot = [brain, new RiveScript()];
    window.bot[1].stream(code, function(error) {
        window.alert("Error in the RiveScript code:\n\n" + error);
    });
    window.bot[1].sortReplies();
    fetch(`http://localhost:3002/sesscount/${bot[0]._id}/interface/+`);

    // Reset the dialogue.
    $("#dialogue").empty();



    $("#message").keydown((e) => {
        if (e.keyCode === 13) {
            var $dialogue = $("#dialogue");
            var $message = $("#message");

            if (window.bot[1] === null) {
                return; // No bot? Weird.
            }

            var message = $message.val();
            if (message.length === 0) {
                return;
            }

            // Echo the user immediately and clear their input.
            var $user = $("<div class='msg-user'></div>");
            $user.html('<span class="user">User</span><div class="msg">' + message + "</div>");
            $dialogue.append($user);
            $message.val("");

            // Fetch the reply.
            window.bot[1].reply("local-user", message).then((reply) => {
                reply = reply.replace(new RegExp("\n", "g"), "<br>");

                // Update the dialogue.
                var $bot = $("<div class='msg-bot'></div>");
                $bot.html('<span class="bot">Bot</span><div class="msg">' + reply + "</div>");
                $dialogue.append($bot);

                // Scroll to bottom.
                $dialogue.animate({ scrollTop: $dialogue[0].scrollHeight }, 1000);
            });
        }
    })
});