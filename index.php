﻿<?php
$currentDir = '';

$validThemes = array('dark', 'light');
$theme = isset($_GET['theme']) && in_array($_GET['theme'], $validThemes) ? $_GET['theme'] : $validThemes[1]; // default theme

$validLanguages = array('en', 'zh');
$userLanguage = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (!isset($language))
{
    $language = $userLanguage;
}
if (!in_array($language, $validLanguages))
{
    $language = $validLanguages[0]; // default language
}
if (isset($_GET['lang']) && in_array($_GET['lang'], $validLanguages))
{
    $language = $_GET['lang'];
}

$preview = isset($_GET['preview']);
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/png" href="<? echo $currentDir; ?>/favicon.ico">
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Raleway:800">
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Josefin+Sans:400">
    <link rel="stylesheet" type="text/css" href="<? echo $currentDir; ?>/styles/common.css">
    <link rel="stylesheet" type="text/css" href="<? echo $currentDir; ?>/styles/<? echo $theme; ?>.css">
    <link rel="stylesheet" type="text/css" href="<? echo $currentDir; ?>/styles/medium.css" media="screen and (max-width: 1600px)">
    <link rel="stylesheet" type="text/css" href="<? echo $currentDir; ?>/styles/small.css" media="screen and (max-width: 1020px)">
    <script type="text/javascript" src="<? echo $currentDir; ?>/scripts/jquery-2.0.2.js"></script>
    <script type="text/javascript" src="<? echo $currentDir; ?>/scripts/knockout-2.2.1.js"></script>
    <script type="text/javascript" src="<? echo $currentDir; ?>/scripts/froogaloop.js"></script>
    <script type="text/javascript" src="http://www.youtube.com/player_api"></script>
    <script text="text/javascript"><? echo "var lang = '$language'; var theme = '$theme'; var currentDir = '$currentDir';"; ?></script>
    <script type="text/javascript" src="<? echo $currentDir; ?>/<? echo $preview ? 'loader_preview.js' : 'loader.js'; ?>"></script>
    <script type="text/javascript" src="<? echo $currentDir; ?>/scripts/main.js"></script>
</head>
<body>
    <div class="main-container" style="margin: 0 auto; padding: 0 10px;">
        <ul class="language-bar">
            <li><a href="<? echo $currentDir.($userLanguage === 'en' ? '/' : '/en'); ?>" data-bind="css: { selected: lang === 'en' }">English</a></li>
            <li><a href="<? echo $currentDir.($userLanguage === 'zh' ? '/' : '/cn'); ?>" data-bind="css: { selected: lang === 'zh' }">中文</a></li>
        </ul>
        <div class="header-container">
            <table class="header-grid" style="width: 100%;">
                <tr>
                    <td class="title-text main" style="width: 1%; cursor: pointer; vertical-align: bottom;">
                        <div style="white-space: nowrap; margin-bottom: -3px;" data-bind="text: title, click: function () { setSelectedContentPage(''); }"></div>
                    </td>
                    <td style="vertical-align: bottom;">
                        <ul class="title-text nav-bar" data-bind="foreach: contentPages" style="text-align: right;">
                            <li data-bind="text: title, click: $root.setSelectedContentPage, css: { selected: $root.selectedContentPage() === $data }" />
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
        <div style="position: relative; margin: 15px 0;">
            <div class="featured-container" data-bind="with: featuredContent">
                <figure data-bind="click: $root.setSelectedContent" class="effeckt-caption effeckt-caption-1" style="cursor: pointer;">
                    <img class="featured-image hidden" data-bind="attr: { src: image }" style="width: 100%; vertical-align: middle;" />
                    <figcaption>
                        <div class="effeckt-figcaption-wrap">
                            <div class="caption-title" data-bind="text: title"></div>
                            <div class="caption-subtitle" data-bind="text: subTitle"></div>
                        </div>
                    </figcaption>
                </figure>
            </div>
            <div class="content-page-container" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
                <table data-bind="with: selectedContentPage" class="content-pane" style="height: 100%; margin: 0 auto;">
                    <tr>
                        <td>
                            <table class="content-grid" data-bind="foreach: rows">
                                <tr data-bind="foreach: elements">
                                    <td>
                                        <figure class="effeckt-caption effeckt-caption-1" data-bind="click: $root.setSelectedContent" style="cursor: pointer;">
                                            <img class="content-image hidden" data-bind="attr: { src: image }" />
                                            <img class="content-image overlay" data-bind="attr: { src: altImage }" />
                                            <figcaption>
                                                <div class="effeckt-figcaption-wrap">
                                                    <div data-bind="text: title"></div>
                                                </div>
                                            </figcaption>
                                        </figure>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="content-container" data-bind="template: { data: selectedContent, if: selectedContent, afterRender: afterRenderSelectedContent }" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
                <iframe id="player" width="100%" height="100%" frameborder="0" allowfullscreen data-bind="attr: { src: url }" style="vertical-align: middle;"></iframe>
            </div>
        </div>
        <div>
            <div data-bind="css: { hidden: !selectedContent() }" class="title-text nav-bar" style="float: left;">
                <div class="action-item" data-bind="click: function () { setSelectedContent(''); }">Back</div>
                <div class="action-item" data-bind="css: { hidden: !selectedContent() || !selectedContent().youtube }, click: navigate">View on <img class="youtube-logo" src="<? echo $currentDir; ?>/images/youtube-<? echo $theme; ?>sm.png" /></div>
            </div>
            <ul class="title-text nav-bar" data-bind="foreach: infoPages" style="text-align: right;">
                <li data-bind="text: title, click: $root.setSelectedInfoPage, css: { selected: $root.selectedInfoPage() === $data }" />
            </ul>
            <div class="info-pane" data-bind="template: { data: selectedInfoPage, if: selectedInfoPage }" style="margin-top: 20px; min-height: 100px;">
                <div data-bind="html: html"></div>
            </div>
        </div>
    </div>
</body>

</html>