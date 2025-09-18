import React, { Suspense } from "react";
import { EmailVerificationPage } from "../../components/layout/EmailVerificationPage";

export default function EmailVerification() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <EmailVerificationPage />
        </Suspense>
    );
}
