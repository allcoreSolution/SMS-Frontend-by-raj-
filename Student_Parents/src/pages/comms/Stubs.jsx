import React from 'react';

// Use same ComingSoon component for WhatsApp, Email, Documents, Gallery, School Visit
import ComingSoon from '../ComingSoon';

export default function WhatsApp() { return <ComingSoon title="WhatsApp Integration" />; }
export function Email() { return <ComingSoon title="Email Inbox" />; }
export function Documents() { return <ComingSoon title="Student Documents Vault" />; }
export function Gallery() { return <ComingSoon title="School Gallery" />; }
export function SchoolVisit() { return <ComingSoon title="Schedule School Visit" />; }
