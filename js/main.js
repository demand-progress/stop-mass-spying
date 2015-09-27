// MT1.11 Compat
var $E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	return ($(filter) || document).getElements(selector);
};

var trackEvent = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);

    ga('send', 'event', ev);
};

var showOverlay = function($) {
    $('.overlay').css('display', 'table');
    setTimeout(function() {
        $('.overlay').addClass('visible');
        setTimeout(function() {
            $('.overlay .modal .inner').addClass('visible');
        }, 10);
    }, 100);
};

jQuery( document ).ready(function( $ ) {

    var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    };

    var validateZip = function(num) {
        r = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        if (r.test(num)) return num;
        else return false;
    };


    var validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    $('#phoneForm').submit(function(e) {
        e.preventDefault();
        $('#call_button').click();
    });

    $('#call_button').click(function(e) {

        var phone = $('#phone').val();
        var zipcode = $('#zipcode').val();

        if (!validatePhone(phone))
            return alert('Please enter a valid US phone number!');

        if (!validateZip(zipcode))
            return alert('Please enter a valid US zip code!');

        var data = {
            campaignId: 1,
            userPhone: validatePhone(phone),
            zipcode: validateZip(zipcode)
        };

        $.ajax({
            url: 'http://demandprogress.callpower.org/call/create',
            type: "get",
            dataType: "json",
            data: data,
            success: function(res) {
                trackEvent('call-power');
                console.log('Placed call-power call: ', res);
            }
        });
        showOverlay($);
    });

    $('#emailForm').submit(function(e) {
        e.preventDefault();
        $('#email_button').click();
    });

    $('#email_button').click(function(e) {

        if (!validateEmail($('#email').val()))
            return alert('Please enter a valid email address!');

        $('#email_form_fields').addClass('fade');
        $('.thanks').addClass('visible');
        setTimeout(function() {
            $('#email_form_fields').hide();
        }, 500);

        var form = $('#emailForm');
        $.post(form.attr('action'), form.serialize(), function(data){});

    });

    $('a.twitter').click(function(e) {

        e.preventDefault();

        trackEvent('share');

        var tw_text = encodeURIComponent(TWEET_TEXT);
        window.open('https://twitter.com/intent/tweet?hashtags=&text='+ tw_text +'&related=demandprogress');

    });

    $('.a.facebook').click(function(e) {
        trackEvent('share');
    });

    $('a.close').click(function (e){
        $('.overlay').removeClass('visible');
    });

});
