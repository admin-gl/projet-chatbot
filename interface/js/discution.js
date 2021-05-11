window.bot = null;
let code = '';
let Steve = '> begin\n\t+ request\n\t- {ok}\n< begin\n+ salut\n- hello !\n\n+ *\n- je comprends pas frere';
let Coco = '> begin\n\t+ request\n\t- {ok}\n< begin\n+ salut\n- hello !\n\n+ *\n- nope';
let listeNom = ['Steve', 'Coco'];

$(document).ready(() => {

    /*
    Pour plus tard
    $.ajax({
        url: "",
        dataType: "text",
        error: function(jqXHR, textStatus, error) {
            window.alert(error);
        },
        success: function(data, textStatus, jqXHR) {
            code = data
            console.log(code)
        }
    });
    */

    listeNom.forEach((nom) => {
        $('#selection').append($(`<option value="${nom.toLowerCase()}">${nom}</option>`));
    });

    $("#selection").change(() => {
        let $selected = $("#selection option:selected")[0];
        if ($selected.value !== "") {

            if ($selected.value === 'coco') {
                code = Coco;
            } else {
                code = Steve;
            }

            window.bot = new RiveScript();
            window.bot.setHandler("coffeescript", new RSCoffeeScript(window.bot));
            window.bot.stream(code, function(error) {
                window.alert("Error in your RiveScript code:\n\n" + error);
            });
            window.bot.sortReplies();

            // Reset the dialogue.
            $("#dialogue").empty();
        }
    });


    $("#message").keydown((e) => {
        if (e.keyCode === 13) {
            var $dialogue = $("#dialogue");
            var $message = $("#message");

            if (window.bot === null) {
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
            window.bot.reply("local-user", message).then((reply) => {
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