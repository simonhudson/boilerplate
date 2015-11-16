/*
Prevent page jump
*/
$('[href="#"], [href=""]').on('click', function() {
    return false;
});