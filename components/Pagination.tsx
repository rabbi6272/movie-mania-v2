"use client";
import { Pagination as HeroPagination } from "@heroui/react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <HeroPagination className="justify-center py-6">
      <HeroPagination.Content>
        <HeroPagination.Item>
          <HeroPagination.Previous
            onPress={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Prev
          </HeroPagination.Previous>
        </HeroPagination.Item>

        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <HeroPagination.Item key={`dots-${index}`}>
              <HeroPagination.Ellipsis />
            </HeroPagination.Item>
          ) : (
            <HeroPagination.Item key={page}>
              <HeroPagination.Link
                isActive={currentPage === page}
                onPress={() => onPageChange(page)}
              >
                {page}
              </HeroPagination.Link>
            </HeroPagination.Item>
          )
        )}

        <HeroPagination.Item>
          <HeroPagination.Next
            onPress={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </HeroPagination.Next>
        </HeroPagination.Item>
      </HeroPagination.Content>
    </HeroPagination>
  );
}
