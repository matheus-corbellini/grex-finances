"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { Loader2 } from "lucide-react";

const SheepIcon = () => (
    <img
        src="/Group 75.png"
        alt="Sheep Icon"
        style={{
            width: "60px",
            height: "60px",
            filter: "brightness(0) invert(1)", // Makes the image white
        }}
    />
);

export const LoadingPage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();

    useEffect(() => {
        // Simular carregamento rápido (2-3 segundos)
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                padding: "20px",
            }}
        >
            {/* Logo */}
            <div style={{ marginBottom: "40px" }}>
                <SheepIcon />
            </div>

            {/* Loading Spinner */}
            <div
                style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                }}
            >
                <Loader2 size={32} color="white" style={{ animation: "spin 1s linear infinite" }} />
            </div>

            {/* Loading Text */}
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                    margin: "0 0 8px 0",
                    textAlign: "center",
                }}
            >
                Carregando...
            </h1>

            <p
                style={{
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.8)",
                    margin: "0",
                    textAlign: "center",
                }}
            >
                Preparando sua experiência
            </p>

            {/* CSS for spinner animation */}
            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};
