<?php
$formConfig = (object) array(

    'email' => (object) array(
        'placeholder'   => 'name@email.com',
        'validation' => (object) array(
            'regex'             => '^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$',
            'errorMsg'          => (object) array(
                'empty'         => 'Please enter your email address.',
                'childEmpty'    => 'Please enter your child\'s email address.',
                'invalid'       => 'Please enter a valid email address.',
                'childMatchesParent'    => 'Your child\'s email address must not be the same as yours.'
            )
        )
    ),
    'username' => (object) array(
        'placeholder'   => 'Username',
        'validation' => (object) array(
            'regex'             => '^(admin)$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your username.',
                'invalid'   => 'That username is not valid.'
            )
        )
    ),
    'password' => (object) array(
        'placeholder'   => 'Password',
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your password.',
                'invalid'   => 'Incorrect password.'
            )
        )
    ),
    'newpassword' => (object) array(
        'placeholder'   => 'New password',
        'validation' => (object) array(
            'regex'         => '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\W\_]+){6,}$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your new password.',
                'invalid'   => 'At least 6 characters, with at least one letter (A-Z) and one number (0-9)'
            )
        )
    ),
    'confirmpassword' => (object) array(
        'placeholder' => 'Confirm password',
        'validation' => (object) array(
            'regex'         => '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\W\_]+){6,}$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please confirm your new password.',
                'invalid'   => 'The passwords you have entered do not match.'
            )
        )
    ),
    'firstname' => (object) array(
        'placeholder'   => 'Joe',
        'validation' => (object) array(
            // 'regex'      => '^[a-zA-Z]+$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your first name.',
                'childEmpty'    => 'Please enter your child\'s first name.',
                'invalid'   => 'Please enter a valid first name.'
            )
        )
    ),
    'lastname' => (object) array(
        'placeholder'   => 'Bloggs',
        'validation' => (object) array(
            'regex'         => '^[a-zA-Z]+$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your last name.',
                'invalid'   => 'Please enter a valid last name.'
            )
        )
    ),
    'name' => (object) array(
        'placeholder'   => 'Joe Bloggs',
        'validation' => (object) array(
            'regex'         => '^[a-zA-Z]+$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your name.',
                'invalid'   => 'Please enter a valid name.'
            )
        )
    ),
    'message' => (object) array(
        'placeholder'   => 'Your message',
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your message to send.'
            )
        )
    ),
    'mobile' => (object) array(
        'placeholder'   => 'XXXXX XXX XXX',
        'validation' => (object) array(
            'regex'         => '(([0]{1}))([1]|[2]|[3]|[7]){1}[0-9|\s]{7,11}$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your mobile number.',
                'invalid'   => 'Please enter a valid mobile number.'
            )
        )
    ),
    'accesscode' => (object) array(
        'placeholder'   => 'Enter access code',
        'validation' => (object) array(
            'regex'         => '^[a-zA-Z0-9]+$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your access code.',
                'invalid'   => 'Please enter a valid access code.'
            )
        )
    ),
    'termsconditionscheckbox' => (object) array(
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please indicate you have read and accept our Terms &amp; Conditions.',
                'childEmpty'    => 'Please indicate your child has read and accepts our Terms &amp; Conditions.'
            )
        )
    ),
    'dob' => (object) array(
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter your date of birth.',
                'invalid'   => 'Your date of birth must be a date in the past.'
            )
        )
    ),
    'newAffinityDomain' => (object) array(
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please choose an Affinity domain.'
            )
        )
    ),
    'newAffinityUri' => (object) array(
        'placeholder'   => 'Choose URI',
        'validation' => (object) array(
            'regex'         => '^[\w&-]+$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter a URI.',
                'invalid'   => 'Please enter a valid URI.'
            )
        )
    ),
    'affinitySitesList' => (object) array(
        'placeholder'   => 'Choose an Affinity site',
        'loadError' => 'Sorry, we could not load the list of Affinity sites.',
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please choose an Affinity site.'
            )
        )
    ),
    'accessCodesQuantity' => (object) array(
        'placeholder'   => '',
        'validation' => (object) array(
            'regex'         => '^[1-9][0-9]*$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter a quantity.',
                'invalid'   => 'Please enter a number greater than 0.'
            )
        )
    ),
    'accessCodesRedemptions' => (object) array(
        'placeholder'   => '',
        'validation' => (object) array(
            'regex'         => '^[1-9][0-9]*$',
            'errorMsg'      => (object) array(
                'empty'     => 'Please enter the number of redemptions.',
                'invalid'   => 'Please enter a number greater than 0.'
            )
        )
    ),
    'fileUpload' => (object) array(
        'validation' => (object) array(
            'errorMsg'      => (object) array(
                'empty'     => 'Please choose a file.',
                'invalid'   => 'Please enter a number greater than 0.',
                'fileSizeExceeded'   => 'Please upload a file less than 500KB.'
            )
        )
    ),
);
?>