import { NextRequest, NextResponse } from 'next/server';
import { generateReferralCode } from '../services/referralService';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        const referralCode = await generateReferralCode(userId);
        return NextResponse.json({ referralCode });
    } catch (error) {
        return NextResponse.json({ error: 'Error generating referral code' }, { status: 500 });
    }
}
