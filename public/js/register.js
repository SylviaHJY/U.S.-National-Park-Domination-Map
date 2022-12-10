(function ($) {
    var myForm = $('#myForm'),
        passwordInput = $('#passwordInput'),
        confirmPasswordInput = $('#confirmPasswordInput');
        mySpan = $('#message');
    myForm.submit(function (e) {
        e.preventDefault();
        if (passwordInput.val() !== confirmPasswordInput.val()) {
            
            mySpan.css('color', 'red');
            mySpan.html('not matching');
        } else {
            mySpan.css('color', 'green');
            mySpan.html('matching');
            var requestConfig = {
                method: 'POST',
                url: '/register',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: $('#usernameInput').val(),
                    email: $('#emailInput').val(),
                    birthDate: $('#birthDateInput').val(),
                    password: $('#passwordInput').val()
                })
            }
            $.ajax(requestConfig).then(function (responseMessage) {
                
                window.location.href = '/login';
            });

        }
    });
})(window.jQuery);