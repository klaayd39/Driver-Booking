import { useState } from 'react';
import { Phone, MessageCircle, Shield, BadgeCheck, MapPin } from 'lucide-react';
import { Avatar, Badge, StarRating, StatusDot, Button, Card, Divider } from './UI';

export default function DriverCard({ driver, onBook, compact = false }) {
  const [expanded, setExpanded] = useState(false);

  const statusVariant = { online: 'green', away: 'amber', offline: 'gray' };

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f4f0' }}>
        <div style={{ position: 'relative' }}>
          <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={42} />
          <StatusDot status={driver.status} style={{ position: 'absolute', bottom: 0, right: 0 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{driver.name}</div>
          <div style={{ fontSize: 12, color: '#9c9890', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={11} />
            {driver.distance} away
            <span style={{ marginLeft: 4 }}><StarRating rating={driver.rating} size={11} /></span>
          </div>
        </div>
        <Badge variant={statusVariant[driver.status]}><StatusDot status={driver.status} /> {driver.status}</Badge>
      </div>
    );
  }

  return (
    <Card style={{ marginBottom: 12 }} className="animate-fadeUp">
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar initials={driver.initials} color={driver.color} bg={driver.bg} size={48} />
            <span style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 12, height: 12, borderRadius: '50%',
              background: driver.status === 'online' ? '#1e9e6e' : driver.status === 'away' ? '#d97b00' : '#9c9890',
              border: '2px solid #fff',
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{driver.name}</div>
                <div style={{ fontSize: 12, color: '#9c9890', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={11} /> {driver.location} · {driver.distance} away
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <StarRating rating={driver.rating} />
                <div style={{ fontSize: 11, color: '#9c9890', marginTop: 2 }}>{driver.trips} trips</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {driver.types.map(t => <Badge key={t} variant="blue">{t}</Badge>)}
              {driver.nbi && <Badge variant="green"><Shield size={9} /> NBI</Badge>}
              {driver.licensed && <Badge variant="green"><BadgeCheck size={9} /> Licensed</Badge>}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="animate-fadeUp" style={{ marginTop: 14 }}>
            <Divider margin="0 0 12px 0" />
            <p style={{ fontSize: 13, color: '#4a4740', lineHeight: 1.6, marginBottom: 12 }}>{driver.bio}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b6760' }}>
              <Phone size={13} /> {driver.phone}
            </div>
          </div>
        )}

        <Divider margin="14px 0 12px 0" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="sm"
            disabled={driver.status === 'offline'}
            onClick={() => onBook(driver)}
          >
            {driver.status === 'offline' ? 'Unavailable' : 'Book Driver'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Less info' : 'View profile'}
          </Button>
          <Button variant="secondary" size="sm" icon={<MessageCircle size={14} />}>
            Message
          </Button>
        </div>
      </div>
    </Card>
  );
}
