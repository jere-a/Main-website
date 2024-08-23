import { fetchData } from '@/ts/cloudflare-trace';
import type { ParsedData } from '@/ts/cloudflare-trace';
import { useEffect, useState } from 'react';

export const CloudflareTrace = () => {
    const [data, setData] = useState<ParsedData>({
        ip: '',
        uag: '',
        tls: '',
        loc: '',
        http: '',
        h: '',
    });

    useEffect(() => {
        fetchData().then(data => { setData(data); });
    }, []);


    return <p>ip: {data.ip}, User Agent: { data.uag }</p>;
}