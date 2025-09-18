import React, { Suspense } from "react";
import { ResetPasswordPage } from "../../components/layout/ResetPasswordPage";

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
