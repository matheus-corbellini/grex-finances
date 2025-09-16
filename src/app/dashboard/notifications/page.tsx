"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to notifications settings by default
        router.replace("/dashboard/notifications/settings");
    }, [router]);

    return null;
}
