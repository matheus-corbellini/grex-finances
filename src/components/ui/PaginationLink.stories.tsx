import React from "react";
import { PaginationLink } from "./PaginationLink";
import { Pagination } from "./Pagination";

// Simple demonstration of PaginationLink component
export const PaginationLinkDemo = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Pagination Link Component Demo</h2>

      {/* Basic Pagination Links (like the image) */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Basic Pagination Links (like the image)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <PaginationLink variant="link" direction="previous" />
          <PaginationLink variant="button" direction="previous" />
          <PaginationLink variant="link" direction="next" />
          <PaginationLink variant="button" direction="next" />
        </div>
      </div>

      {/* Different Variants */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Link Style:</span>
            <PaginationLink variant="link" direction="previous" />
            <PaginationLink variant="link" direction="next" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Button Style:</span>
            <PaginationLink variant="button" direction="previous" />
            <PaginationLink variant="button" direction="next" />
          </div>
        </div>
      </div>

      {/* Different Sizes */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Small:</span>
            <PaginationLink size="sm" direction="previous" />
            <PaginationLink size="sm" direction="next" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Medium:</span>
            <PaginationLink size="md" direction="previous" />
            <PaginationLink size="md" direction="next" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Large:</span>
            <PaginationLink size="lg" direction="previous" />
            <PaginationLink size="lg" direction="next" />
          </div>
        </div>
      </div>

      {/* States */}
      <div style={{ marginBottom: "30px" }}>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Enabled:</span>
            <PaginationLink
              direction="previous"
              onClick={() => console.log("Previous clicked")}
            />
            <PaginationLink
              direction="next"
              onClick={() => console.log("Next clicked")}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Disabled:</span>
            <PaginationLink direction="previous" disabled={true} />
            <PaginationLink direction="next" disabled={true} />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Active:</span>
            <PaginationLink direction="previous" active={true} />
            <PaginationLink direction="next" active={true} />
          </div>
        </div>
      </div>

      {/* Custom Text */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Custom Text</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Custom Previous:</span>
            <PaginationLink direction="previous" text="Anterior" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Custom Next:</span>
            <PaginationLink direction="next" text="Próximo" />
          </div>
        </div>
      </div>

      {/* Without Icons */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Without Icons</h3>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <PaginationLink direction="previous" showIcon={false} />
          <PaginationLink direction="next" showIcon={false} />
        </div>
      </div>

      {/* Custom Icon Positions */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Custom Icon Positions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Icon Left:</span>
            <PaginationLink direction="next" iconPosition="left" />
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Icon Right:</span>
            <PaginationLink direction="previous" iconPosition="right" />
          </div>
        </div>
      </div>

      {/* Complete Pagination Component */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Complete Pagination Component</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          variant="link"
        />
      </div>

      {/* Pagination with Button Style */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Pagination with Button Style</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          variant="button"
        />
      </div>

      {/* Pagination with First/Last */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Pagination with First/Last</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          showFirstLast={true}
        />
      </div>
    </div>
  );
};

// Individual PaginationLink Examples
export const PreviousLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="previous" />
  </div>
);

export const NextLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="next" />
  </div>
);

export const PreviousButton = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink variant="button" direction="previous" />
  </div>
);

export const NextButton = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink variant="button" direction="next" />
  </div>
);

export const DisabledPrevious = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="previous" disabled={true} />
  </div>
);

export const DisabledNext = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="next" disabled={true} />
  </div>
);

export const ActivePrevious = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="previous" active={true} />
  </div>
);

export const ActiveNext = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="next" active={true} />
  </div>
);

export const SmallPaginationLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink size="sm" direction="previous" />
  </div>
);

export const LargePaginationLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink size="lg" direction="next" />
  </div>
);

export const CustomTextPaginationLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="previous" text="Anterior" />
  </div>
);

export const NoIconPaginationLink = () => (
  <div style={{ padding: "20px" }}>
    <PaginationLink direction="next" showIcon={false} />
  </div>
);

export default PaginationLinkDemo;
