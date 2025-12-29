'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function AuthDebugger() {
    useEffect(() => {
        const checkAuth = async () => {
            console.log('=== Auth Debug ===');

            // Check session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log('Session:', session);
            console.log('Session Error:', sessionError);

            // Check user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('User:', user);
            console.log('User Error:', userError);

            // Try profile query
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .maybeSingle();
                console.log('Profile:', profile);
                console.log('Profile Error:', profileError);
            } catch (e) {
                console.log('Profile Exception:', e);
            }

            // Try RPC call
            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('claim_daily_points');
                console.log('RPC Data:', rpcData);
                console.log('RPC Error:', rpcError);
            } catch (e) {
                console.log('RPC Exception:', e);
            }
        };

        checkAuth();
    }, []);

    return <div style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
        Check console for auth debug info
    </div>;
}