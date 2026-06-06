import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { booking } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get driver's email
  const { data: driverAuth } = await supabase.auth.admin.getUserById(booking.driver_id)
  const driverEmail = driverAuth?.user?.email

  if (!driverEmail) {
    return new Response(JSON.stringify({ error: 'Driver email not found' }), { status: 400 })
  }

  // Send email using Supabase
  const { error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: driverEmail,
  })

  // Use Resend for actual email (free tier = 100 emails/day)
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DriverLink <noreply@driverlink.ph>',
      to: driverEmail,
      subject: `🚗 New Booking Request — ₱${booking.fare}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="background: #1a5c9a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🚗 New Booking!</h1>
          </div>
          <div style="background: #fff; border: 1px solid #eae8e2; border-radius: 0 0 12px 12px; padding: 24px;">
            <h2 style="color: #1c1a17; margin: 0 0 16px;">Hi Ricky! You have a new booking request.</h2>

            <div style="background: #f9f8f6; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
              <p style="margin: 0 0 8px;"><strong>👤 Customer:</strong> ${booking.customer_name}</p>
              <p style="margin: 0 0 8px;"><strong>🚘 Trip type:</strong> ${booking.trip_type}</p>
              <p style="margin: 0 0 8px;"><strong>📍 Pickup:</strong> ${booking.pickup}</p>
              <p style="margin: 0 0 8px;"><strong>🏁 Destination:</strong> ${booking.destination}</p>
              <p style="margin: 0 0 8px;"><strong>📅 Date:</strong> ${booking.date} at ${booking.time}</p>
              <p style="margin: 0 0 8px;"><strong>⏱ Duration:</strong> ${booking.duration}</p>
              <p style="margin: 0;"><strong>💰 Fare:</strong> <span style="color: #1a5c9a; font-size: 20px; font-weight: 700;">₱${booking.fare}</span></p>
            </div>

            <a href="https://fetchmalaybalay.vercel.app" 
               style="display: block; background: #1a5c9a; color: white; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">
              Open App to Accept →
            </a>

            <p style="color: #9c9890; font-size: 12px; text-align: center; margin-top: 16px;">
              DriverLink · Zamboanga City
            </p>
          </div>
        </div>
      `,
    }),
  })

  const emailData = await emailRes.json()

  return new Response(
    JSON.stringify({ success: true, email: driverEmail }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})