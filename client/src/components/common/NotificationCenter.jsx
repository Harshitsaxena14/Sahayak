import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, FileText, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NotificationCenter = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load real notifications from localStorage / session state
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem('sahayak_notifications');
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          // Initial real app notifications based on seed/demo data
          const initial = [
            {
              id: 'notif-1',
              type: 'grievance',
              title: language === 'hi' ? 'शिकायत की स्थिति अपडेट' : 'Grievance Status Updated',
              desc: language === 'hi' ? 'टिकट GRV-2026-894102 की जांच प्रगति पर है (जल बोर्ड).' : 'Ticket GRV-2026-894102 status updated to In Progress.',
              timestamp: '2 hours ago',
              link: '/track?ticket=GRV-2026-894102',
              read: false
            },
            {
              id: 'notif-2',
              type: 'application',
              title: language === 'hi' ? 'आवेदन प्राप्त हुआ' : 'Application Received',
              desc: language === 'hi' ? 'आपका PM-KISAN आवेदन सत्यापन के लिए भेजा गया है।' : 'Your PM-KISAN scheme application has been submitted.',
              timestamp: '1 day ago',
              link: '/track?appId=APP-2026-784912',
              read: true
            }
          ];
          setNotifications(initial);
          localStorage.setItem('sahayak_notifications', JSON.stringify(initial));
        }
      } catch (e) {}
    };

    loadNotifications();
    window.addEventListener('storage', loadNotifications);
    return () => window.removeEventListener('storage', loadNotifications);
  }, [language]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('sahayak_notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleItemClick = (item) => {
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNotifications(updated);
    try {
      localStorage.setItem('sahayak_notifications', JSON.stringify(updated));
    } catch (e) {}
    setIsOpen(false);
    navigate(item.link);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-sahayak-ink hover:bg-sahayak-surfaceWarm rounded-full transition-colors min-h-touch min-w-touch flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-sahayak-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Desktop Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-sahayak-card z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between border-b border-sahayak-border pb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-sahayak-ink">
                {language === 'hi' ? 'अधिसूचनाएं' : 'Notifications'}
              </h4>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-sahayak-primary hover:underline"
                >
                  {language === 'hi' ? 'सभी पढ़ें' : 'Mark all read'}
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-sahayak-inkMuted py-4 text-center">
                  {language === 'hi' ? 'कोई नई अधिसूचना नहीं है' : 'No notifications yet'}
                </p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      item.read
                        ? 'bg-sahayak-surface border-sahayak-border hover:bg-sahayak-surfaceWarm/50'
                        : 'bg-sahayak-surfaceWarm border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sahayak-ink flex items-center gap-1.5">
                        {item.type === 'grievance' ? (
                          <FileText className="w-3.5 h-3.5 text-sahayak-primary" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sahayak-success" />
                        )}
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-sahayak-inkMuted">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-sahayak-inkSoft leading-tight">{item.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
