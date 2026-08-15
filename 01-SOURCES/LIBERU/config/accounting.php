<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Reporting currency
    |--------------------------------------------------------------------------
    | ISO code of the currency financial statements are presented in. When null,
    | the Currency flagged is_default is used. GeneralLedgerService resolves this.
    */
    'reporting_currency' => env('ACCOUNTING_REPORTING_CURRENCY'),

    /*
    |--------------------------------------------------------------------------
    | Enforce two-factor authentication
    |--------------------------------------------------------------------------
    | When true, privileged users (see EnsureTwoFactorEnabled) must enrol in 2FA
    | before using a panel. OFF by default: the enrolment UI on the EditProfile
    | page isn't wired yet, so enabling this without it would lock admins out.
    | Flip to true once the enrolment form ships.
    */
    // Mandatory 2FA for privileged (super_admin/admin) users by default. The
    // EnsureTwoFactorEnabled middleware gracefully redirects an un-enrolled user
    // to the enrolment UI rather than locking them out. Override per deploy with
    // ACCOUNTING_ENFORCE_2FA=false.
    'enforce_2fa' => env('ACCOUNTING_ENFORCE_2FA', true),
];
