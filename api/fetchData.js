// api/fetchData.js

export default async function handler(req, res) {
    const { number } = req.query;

    if (!number || number.length < 10) {
        return res.status(400).json({ success: false, msg: "Invalid Number" });
    }

    let clean = number.startsWith('0') ? number.substring(1) : number;
    const target = `https://paksimdata.ftgmhacks.workers.dev/?number=${clean}`;

    try {
        // Direct fetch from Vercel Server with proper Headers
        const response = await fetch(target, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(8000) // 8 seconds timeout
        });

        if (!response.ok) throw new Error("API Server Not Responding");

        const result = await response.json();

        if (result && result.success && result.data.records && result.data.records.length > 0) {
            const firstRecord = result.data.records[0];
            
            // Detecting Stars (******)
            if (firstRecord.full_name.includes('*') || firstRecord.cnic.includes('*')) {
                return res.status(200).json({
                    success: false,
                    msg: "Is number ka data majood ni whatsapp par msg karain 03219233858"
                });
            }

            return res.status(200).json({
                success: true,
                records: result.data.records
            });
        } else {
            return res.status(200).json({
                success: false,
                msg: "Is number ka data majood ni whatsapp par msg karain 03219233858"
            });
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
        return res.status(200).json({ 
            success: false, 
            msg: "Connection slow hai ya API down hai. Dubara koshish karain." 
        });
    }
}
