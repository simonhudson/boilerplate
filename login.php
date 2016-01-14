<?php include('layout/precontent.layout.inc.php'); ?>

    <div class="grid__wrap">

        <div class="grid__span--full center-content">

            <h1><?= pageHeading(); ?></h1>

            <form action="<?= $_SERVER['PHP_SELF']; ?>" class="js-validate" id="login__form" method="post">
                <fieldset>
                    <legend class="hidden">Log in</legend>
                    <label class="hidden" for="login__password">Password</label>
                    <input
                        data-val-error-empty="<?= $formConfig->password->validation->errorMsg->empty; ?>"
                        data-val-error-invalid="<?= $formConfig->password->validation->errorMsg->invalid; ?>"
                        data-val-isrequired="true"
                        data-val-regex="<?= '^(admin)$';//$formConfig->password->validation->regex; ?>"
                        data-val-type="text"
                        id="login__password"
                        name="login__password"
                        placeholder="<?= $formConfig->password->placeholder; ?>"
                        type="password" />
                </fieldset>
                <input id="login__returnUrl" name="login__returnUrl" type="hidden" value="<?= getReturnUrl(); ?>" />
                <input id="login__submit" name="login__submit" type="submit" value="Log in" />
            </form>

            <p>Not got an account? <a href="<?= $pages->register->url; ?>">Register here</a></p>

        </div>

    </div>

<?php include('layout/postcontent.layout.inc.php'); ?>