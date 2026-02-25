// api/fetchData.js

export default async function handler(req, res) {
    const { number } = req.query;

    if (!number || number.length < 10) {
        return res.status(400).json({ success: false, msg: "Invalid Number" });
    }

    let clean = number.startsWith('0') ? number.substring(1) : number;
    const target = `https://paksimdata.ftgmhacks.workers.dev/?number=${clean}`;

    try {
        const response = await fetch(target);
        const result = await response.json();

        if (result && result.success && result.data.records.length > 0) {
            const firstRecord = result.data.records[0];
            
            // Check if name contains stars (******)
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
        return res.status(500).json({ success: false, msg: "Server connection failed." });
    }
}
