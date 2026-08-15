<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SageConnection;
use App\Services\SageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SageController extends Controller
{
    public function __construct(private readonly SageService $sage) {}

    public function connect(Request $request): JsonResponse
    {
        $state = Str::random(40);
        Cache::put($this->stateCacheKey($request), $state, now()->addMinutes(10));

        return response()->json([
            'authorization_url' => $this->sage->getAuthorizationUrl($state),
        ]);
    }

    public function callback(Request $request): JsonResponse
    {
        $validated = $request->validate(['code' => ['required', 'string']]);

        // Verify OAuth state (CSRF / auth-code injection). Stashed in the cache
        // under the authenticated user by connect() — api routes have no session.
        $expected = Cache::pull($this->stateCacheKey($request));
        abort_if($expected === null || ! hash_equals($expected, (string) $request->input('state')), 403, 'Invalid OAuth state');

        $connection = $this->sage->handleCallback((int) $request->user()->id, $validated['code']);

        // Connections are team-shared: stamp the acting team (no creating hook does it).
        $connection->team_id = $request->user()->current_team_id;
        $connection->save();

        return response()->json(['success' => true, 'business_id' => $connection->business_id]);
    }

    public function sync(Request $request, SageConnection $connection): JsonResponse
    {
        abort_unless($connection->team_id === ($request->user()->current_team_id ?? -1), 403);

        return response()->json(['success' => true, 'invoices_synced' => $this->sage->pullInvoices($connection)]);
    }

    private function stateCacheKey(Request $request): string
    {
        return 'sage_oauth_state:'.$request->user()->id;
    }
}
