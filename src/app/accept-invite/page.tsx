import React, { Suspense } from "react";
import { AcceptInvitePage } from "../../components/layout/AcceptInvitePage";

export default function AcceptInvite() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <AcceptInvitePage />
        </Suspense>
    );
}
