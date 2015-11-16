<?php
function renderMediaPlayer() {
    $videoElement = '';
    $videoElement .= '<div id="myvid" class="px-video-container">';
        $videoElement .= '<div class="px-video-img-captions-container">';
            $videoElement .= '<div class="px-video-captions float-l show"></div>';
            $videoElement .= '<video poster="http://paypal.github.io/accessible-html5-video-player/media/poster_PayPal_Austin2.jpg">';
                $videoElement .= '<source type="video/mp4" src="https://www.paypalobjects.com/webstatic/mktg/videos/PayPal_AustinSMB_baseline.mp4"></source>';
                $videoElement .= '<source type="video/webm" src="https://www.paypalobjects.com/webstatic/mktg/videos/PayPal_AustinSMB_baseline.webm"></source>';
                $videoElement .= '<track default="" srclang="en" src="http://paypal.github.io/accessible-html5-video-player/media/captions_PayPal_Austin_en.vtt" label="English captions" kind="captions"></track>';
                $videoElement .= '<div>';
                    $videoElement .= '<a href="https://www.paypalobjects.com/webstatic/mktg/videos/PayPal_AustinSMB_baseline.mp4">';
                        $videoElement .= '<img width="640" height="360" alt="download video" src="http://paypal.github.io/accessible-html5-video-player/media/poster_PayPal_Austin2.jpg">';
                    $videoElement .= '</a>';
                $videoElement .= '</div>';
            $videoElement .= '</video>';
        $videoElement .= '</div>';
        $videoElement .= '<div class="px-video-controls"><div class="clearfix"><div class="float-l"><button class="px-video-restart"><span class="hidden">Restart</span></button><button class="px-video-rewind"><span class="hidden">rewind <span class="px-seconds">20</span> seconds</span></button><button aria-label="Play video, PayPal Austin promo" class="px-video-play"><span class="hidden">Play</span></button><button class="px-video-pause hide"><span class="hidden">Pause</span></button><button class="px-video-forward"><span class="hidden">forward <span class="px-seconds">20</span> seconds</span></button></div><div class="px-video-mute-btn-container float-l"><input type="checkbox" id="btnMute2670" class="px-video-mute hidden"><label for="btnMute2670" id="labelMute2670" style="margin-left:250px"><span class="hidden">Mute</span></label></div><div class="float-l"><label class="hidden" for="volume2670">Volume:</label><input type="range" value="5" max="10" min="0" class="px-video-volume" id="volume2670"></div><div class="px-video-captions-btn-container float-l show"><input type="checkbox" id="btnCaptions2670" class="px-video-btnCaptions hidden" checked="checked"><label for="btnCaptions2670"><span class="hidden">Captions</span></label></div><div class="px-video-fullscreen-btn-container float-l show"><input type="checkbox" id="btnFullscreen2670" class="px-video-btnFullScreen hidden"><label for="btnFullscreen2670"><span class="hidden">Fullscreen</span></label></div><div class="px-video-time"><span class="hidden">time</span> <span class="px-video-duration">00:00</span></div></div><div><progress value="0" max="100" class="px-video-progress"><span>0</span>% played</progress></div></div>';
    $videoElement .= '</div>';
    return $videoElement;
}
?>