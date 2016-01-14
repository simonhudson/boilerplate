    
        </main>

    <footer class="footer--global">
        <div class="grid__wrap">
            <div class="grid__span--4 grid__pull-right--14">
                <p><small>Copyright &copy; <?= $site->name.' '.date('Y'); ?></small></p>
                <p>
                    <a data-test-hook="footer-nav__<?= (isLoggedIn() ? 'logout' : 'login'); ?>" href="<?= (isLoggedIn() ? $siteRoot.$pages->logout->url : $siteRoot.$pages->login->url); ?>?returnUrl=<?= $currentPage; ?>">
                        <?= (isset($_SESSION['isLoggedIn']) ? $pages->logout->mainNavText : $pages->login->mainNavText); ?></span>
                    </a>
                </p>
            </div>
        </div>
    </footer>

    <script src="<?= $paths->libs; ?>jquery/jquery-2.1.4.min.js"></script>
    <script src="<?= $paths->js; ?>config.js"></script>
    <script src="<?= $paths->js; ?>setup.js"></script>
    <script src="<?= $paths->js; ?>application.min.js"></script>
</body>
</html>
