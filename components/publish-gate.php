<?php

/**
 * Publication helpers for scheduled editorial content.
 * Dates become public at 00:00 in the site's editorial timezone.
 */

function embrace_publication_timezone(): DateTimeZone
{
    static $timezone = null;
    if ($timezone === null) {
        $timezone = new DateTimeZone('Asia/Kolkata');
    }
    return $timezone;
}

function embrace_is_published(string $date): bool
{
    $release = DateTimeImmutable::createFromFormat(
        '!Y-m-d',
        $date,
        embrace_publication_timezone()
    );

    if (!$release) {
        return false;
    }

    return new DateTimeImmutable('now', embrace_publication_timezone()) >= $release;
}

function embrace_require_published(string $date): void
{
    if (embrace_is_published($date)) {
        return;
    }

    http_response_code(404);
    header('X-Robots-Tag: noindex, nofollow', true);
    header('Cache-Control: no-store, private', true);
    exit;
}

