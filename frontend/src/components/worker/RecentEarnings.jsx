export default function RecentEarnings({ earnings }) {
    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Earnings</h2>
            <div className="space-y-3">
                {earnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <div className="font-semibold">{earning.job}</div>
                            <div className="text-sm text-slate-600">{earning.date}</div>
                        </div>
                        <div className="text-xl font-bold text-green-600">+${earning.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
