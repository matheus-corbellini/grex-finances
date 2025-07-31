"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { PaginationLink } from "./PaginationLink";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  showFirstLast?: boolean;
  firstLastText?: {
    first?: string;
    last?: string;
  };
  previousNextText?: {
    previous?: string;
    next?: string;
  };
  size?: "sm" | "md" | "lg";
  variant?: "link" | "button";
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  showFirstLast = false,
  firstLastText = { first: "First", last: "Last" },
  previousNextText = { previous: "Previous", next: "Next" },
  size = "md",
  variant = "link",
  className = "",
  style,
}) => {
  const theme = useTheme();

  // Calculate which page numbers to show
  const getVisiblePageNumbers = (): number[] => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Container styles
  const getContainerStyles = (): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: theme.getSpacing("s"),
    fontFamily: theme.getFontFamily("primary"),
  });

  // Page number button styles
  const getPageNumberStyles = (isActive: boolean): React.CSSProperties => {
    const baseStyles = {
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("base"),
      fontWeight: isActive
        ? theme.getFontWeight("bold")
        : theme.getFontWeight("medium"),
      color: isActive ? theme.colors.baseWhite : theme.colors.baseBlack,
      backgroundColor: isActive ? theme.colors.primary[600] : "transparent",
      border: isActive ? "none" : `1px solid ${theme.colors.neutrals[200]}`,
      borderRadius: theme.getRadius("m"),
      padding: `${theme.getSpacing("xs")} ${theme.getSpacing("s")}`,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      minWidth: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
    };

    switch (size) {
      case "sm":
        return {
          ...baseStyles,
          fontSize: theme.getFontSize("sm"),
          padding: `${theme.getSpacing("xs")} ${theme.getSpacing("xs")}`,
          minWidth: "28px",
          height: "28px",
        };
      case "lg":
        return {
          ...baseStyles,
          fontSize: theme.getFontSize("lg"),
          padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
          minWidth: "40px",
          height: "40px",
        };
      default:
        return baseStyles;
    }
  };

  const containerStyles = {
    ...getContainerStyles(),
    ...style,
  };

  const visiblePages = getVisiblePageNumbers();

  return (
    <div
      style={containerStyles}
      className={`pagination pagination--${size} pagination--${variant} ${className}`}
    >
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <PaginationLink
          variant={variant}
          direction="previous"
          text={firstLastText.first}
          onClick={() => onPageChange(1)}
          size={size}
          showIcon={false}
        />
      )}

      {/* Previous button */}
      <PaginationLink
        variant={variant}
        direction="previous"
        text={previousNextText.previous}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        size={size}
      />

      {/* Page numbers */}
      {showPageNumbers && (
        <>
          {/* Show first page if not in visible range */}
          {visiblePages[0] > 1 && (
            <>
              <button
                type="button"
                style={getPageNumberStyles(false)}
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span
                  style={{
                    color: theme.colors.neutrals[400],
                    padding: theme.getSpacing("xs"),
                  }}
                >
                  ...
                </span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              style={getPageNumberStyles(page === currentPage)}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Show last page if not in visible range */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span
                  style={{
                    color: theme.colors.neutrals[400],
                    padding: theme.getSpacing("xs"),
                  }}
                >
                  ...
                </span>
              )}
              <button
                type="button"
                style={getPageNumberStyles(false)}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </>
      )}

      {/* Next button */}
      <PaginationLink
        variant={variant}
        direction="next"
        text={previousNextText.next}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        size={size}
      />

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <PaginationLink
          variant={variant}
          direction="next"
          text={firstLastText.last}
          onClick={() => onPageChange(totalPages)}
          size={size}
          showIcon={false}
        />
      )}
    </div>
  );
};

export default Pagination;
