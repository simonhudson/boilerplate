<?php include('layout/precontent.layout.inc.php'); ?>

    <div class="grid__wrap">

        <div class="grid__span--full center-content">

            <h1><?= pageHeading(); ?></h1>

            <form action="<?= $_SERVER['PHP_SELF']; ?>" class="js-validate" id="register__form" method="post">
                <fieldset>
                    <legend class="hidden">Register</legend>
                    <label for="register__email">Your e-mail address</label>
                    <input
                        data-toggle-password="true"
                        data-val-error-empty="<?= $formConfig->email->validation->errorMsg->empty; ?>"
                        data-val-error-invalid="<?= $formConfig->email->validation->errorMsg->invalid; ?>"
                        data-val-isrequired="true"
                        data-val-regex="<?= '^(foo@bar.com)$';//$formConfig->email->validation->regex; ?>"
                        data-val-type="text"
                        id="register__email"
                        name="register__email"
                        placeholder="<?= $formConfig->email->placeholder; ?>"
                        type="text" />
                    <label for="register__password">Choose a password</label>
                    <input
                        data-val-error-empty="<?= $formConfig->password->validation->errorMsg->empty; ?>"
                        data-val-error-invalid="<?= $formConfig->password->validation->errorMsg->invalid; ?>"
                        data-val-isrequired="true"
                        data-val-regex="<?= '^(bar)$';//$formConfig->password->validation->regex; ?>"
                        data-val-type="text"
                        id="register__password"
                        name="register__password"
                        placeholder="<?= $formConfig->password->placeholder; ?>"
                        type="password" />
                </fieldset>
                <input id="register__submit" name="register__submit" type="submit" value="Register" />
            </form>

            <p>Already have an account? <a href="<?= $pages->login->url; ?>">Log in here</a></p>

        </div>

    </div>

<?php include('layout/postcontent.layout.inc.php'); ?>