import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ActiveAppsManager = () => {
    const pathname = usePathname();

    const getAppName = (path: string) => {
        const appId = path.split('/')[2];
        switch (appId) {
            case 'setting': return 'Cài đặt';
            case 'browser': return 'Trình duyệt';
            case 'mes': return 'Tin nhắn';
        }
    };

    useEffect(() => {
        const updateActiveApps = () => {
            const activeApps = JSON.parse(window.sessionStorage.getItem('activeApps') || '[]');
            const appId = pathname.split('/')[2] || 'home';
            const currentApp = {
                id: appId,
                name: getAppName(pathname),
                url: pathname
            };

            if (!activeApps.some((app: { id: string }) => app.id === currentApp.id)) {
                const updatedApps = [...activeApps, currentApp];
                window.sessionStorage.setItem('activeApps', JSON.stringify(updatedApps));
            } else {
                // Chỉ cập nhật URL của ứng dụng hiện tại
                const updatedApps = activeApps.map((app: { id: string, url: string }) =>
                    app.id === currentApp.id ? { ...app, url: currentApp.url } : app
                );
                window.sessionStorage.setItem('activeApps', JSON.stringify(updatedApps));
            }
        };

        updateActiveApps();
    }, [pathname]);

    return null;
};

export default ActiveAppsManager;