// ==UserScript==
// @name         Login Override
// @version      1.0
// @description  Overrides the login function on a given website
// @match        https://pass.sdu.edu.cn/*
// @grant        none
// ==/UserScript==
const YOUR_CUSTOM_DEVICE_FINGERPRINT = [
    Object({ key: "My Browser", value: 'Test code' }),
];
(function() {
    'use strict';

    // Override the login function
    function login() {

        // Get the username and password input fields
        var $u = $("#un"), $p = $("#pd");

        // Get the value of the username input field
        var u = $u.val();

        // Check if the username is empty
        if(u==""){
            $u.focus(); // Set focus on the username input field
            $u.parent().addClass("login_error_border"); // Add a CSS class to highlight the input field as an error
            return ; // Exit the function
        }

        // Get the value of the password input field
        var p = $p.val();

        // Check if the password is empty
        if(p==""){
            $p.focus(); // Set focus on the password input field
            $p.parent().addClass("login_error_border"); // Add a CSS class to highlight the input field as an error
            return ; // Exit the function
        }

        // Disable the username and password input fields
        $u.attr("disabled","disabled");
        $p.attr("disabled","disabled");

        // Get the value of the lt input field
        var lt = $("#lt").val();

        // Set the length of the username and password in hidden input fields
        $("#ul").val(u.length);
        $("#pl").val(p.length);

        // Encrypt the username, password, and lt values using a custom encryption function
        $("#rsa").val(strEnc(u+p+lt , '1' , '2' , '3'));

        // Get device fingerprint using Fingerprint2 library
        Fingerprint2.get(function(components) {
            var details = "";
            // Override the device fingerprint with custom values
            components = YOUR_CUSTOM_DEVICE_FINGERPRINT;
            for (var index in components) {
                var obj = components[index]
                var line = obj.key + " = " + String(obj.value).substr(0, 100)
                details += line + "\n"
            }
            var murmur = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31);

            var details_s = "" ;
            for (var index in components) {
                var obj = components[index]
                if(obj.key == 'deviceMemory' || obj.key == 'screenResolution' || obj.key == 'availableScreenResolution'){
                    continue ;
                }
                var line = obj.key + " = " + String(obj.value).substr(0, 100)
                details_s += line + "\n"
            }
            var murmur_s = Fingerprint2.x64hash128(details_s, 31);
            var murmur_md5 = hex_md5(details_s);

            // Send a POST request to the server with the device fingerprint and other data
            $.post("device" , {
                d : murmur ,
                d_s : murmur_s ,
                d_md5 : murmur_md5 ,
                m : '1' ,
                u : strEnc(u , '1' , '2' , '3') ,
                p : strEnc(p , '1' , '2' , '3')
            } , function(ret){
                if(ret.info == 'validErr'|| ret.info == 'notFound'){
                    location.reload(); // Reload the page if the response indicates an error or not found
                }else if(ret.info == 'bind'){
                    // Perform additional verification for device binding
                    $("#phone").val(ret.m);
                    phone(murmur_s , details_s);
                }else if(ret.info == 'mobileErr'){
                    // Show an error message if the mobile number is incorrect
                    $("#errormsg2").show().text("尚未绑定手机");
                }else if(ret.info == 'binded' || ret.info == 'pass'){
                    // Submit the login form directly if the response indicates successful login
                    $("#loginForm")[0].submit();
                }
            }, 'json').error(function(xhr , status , info){
                if(is_weixin()){
                    // Handle specific error case for WeChat browser
                }
            });
        })
    }

    // Override the original login function with the modified one
    window.login = login;
})();